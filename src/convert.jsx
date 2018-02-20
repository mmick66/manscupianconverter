import React from 'react';
import Dropzone from 'react-dropzone';

import libraw from 'libraw';

import { Button, message, Modal } from 'antd';

import fs from 'fs';

import sizeOf from 'image-size';


import sharp from 'sharp';

import { shell } from 'electron';
import path from 'path';
import Defaults from './defaults';
import SettingsForm from './settings.form';


export default class ConvertArea extends React.Component {

    constructor() {
        super();
        this.state = {
            files: [],
            rendered: null,
            settingsModalOpen: false,
            target: {
                width: Defaults.Size.Width,
                height: Defaults.Size.Height,
                path: Defaults.Paths.Out,
            },
        };

        if (!fs.existsSync(Defaults.Paths.Temp)) {
            fs.mkdirSync(Defaults.Paths.Temp);
        }

        if (!fs.existsSync(Defaults.Paths.Out)) {
            fs.mkdirSync(Defaults.Paths.Out);
        }

        this.onFilesDrop = this.onFilesDrop.bind(this);
        this.startConvertion = this.startConvertion.bind(this);
        this.chooseFileOutput = this.chooseFileOutput.bind(this);

        this.handleChangedSettings = this.handleChangedSettings.bind(this);
    }

    onFilesDrop(files) {

        this.setState({
            files: files,
        });


        const file = files[0];

        this.extractThumbnail(file);

    }

    extractThumbnail(file) {

        const parsed = path.parse(file.path);

        this.setState({
            current: {
                name: parsed.name,
                path: `${parsed.dir}/${parsed.base}`,
            },
        });

        const dest = `${Defaults.Paths.Temp}/${parsed.name}`


        libraw.extractThumb(file.path, dest).then((output) => {

            const dimensions = sizeOf(output);

            const target = this.state.target;
            target.height = target.width * (dimensions.height / dimensions.width);

            this.setState({
                rendered: output,
                target: target
            });

        });
    }

    startConvertion() {

        const file = this.state.current;

        this.setState({
            converting: true
        });

        console.log(this.state.target.path);

        libraw.extract(file.path, `${Defaults.Paths.Temp}/${file.name}`).then((output) => {

            const final = `${this.state.target.path}/${file.name}.png`;

            const w = this.state.target.width;
            const h = this.state.target.height;

            sharp(output).png().resize(w, h).toFile(final).then(() => {

                fs.unlink(output, () => {

                    shell.openItem(final);

                    this.setState({
                        converting: false,
                        rendered: null,
                    });

                });


            }).catch((e) => {
                console.log(e);
                message.error(e.toString());
            });

        });
    }

    chooseFileOutput() {

    }



    handleChangedSettings() {

        this.form.validateFields((errors, values) => {

            this.setState({
                target: {
                    width: values.width,
                    height: values.height
                },
                settingsModalOpen: false,
            });
        });

    }

    render() {

        let placeholder;
        if (this.state.rendered) {
            placeholder = <img alt={'Thumbnail'} src={`.${this.state.rendered}`} style={{ maxHeight: '100%', maxWidth: '100%' }} />;
        } else {
            placeholder = <p className={'dropText'}>{Defaults.Strings.DragHere}</p>;
        }

        return (
          <div>
              <Dropzone className={'dropzone'} onDrop={this.onFilesDrop} onClick={() => {}}>
                  {
                      placeholder
                  }
              </Dropzone>
              <div className={'controls'}>

                  <Button type="primary"
                          loading={this.state.converting}
                          style={{ marginRight: '12px' }}
                          disabled={!this.state.rendered}
                          onClick={this.startConvertion}>
                      Iniciar Conversión
                  </Button>

                  <Modal
                      title="Ajustes"
                      visible={this.state.settingsModalOpen}
                      okText="Ok"
                      onCancel={() => this.setState({ settingsModalOpen: false })}
                      onOk={this.handleChangedSettings}>
                      <SettingsForm ref={form => (this.form = form)}
                                    target={this.state.target} />
                  </Modal>

                  <Button type="default"
                          shape="circle"
                          icon="setting"
                          disabled={!this.state.rendered}
                          onClick={() => this.setState({ settingsModalOpen: true })} />

              </div>

          </div>
        );
    }

}
