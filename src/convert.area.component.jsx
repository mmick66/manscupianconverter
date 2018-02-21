import React from 'react';
import Dropzone from 'react-dropzone';

import { Button, Modal, message } from 'antd';

import Converter from './converter';

import { shell, remote } from 'electron';
import Defaults from './defaults';
import SettingsForm from './settings.form.component';

export default class ConvertArea extends React.Component {

    constructor() {
        super();
        this.state = {
            files: [],
            settingsModalOpen: false,
            thumbnail: null,
        };

        this.converter = new Converter();

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

        this.converter.load(file.path).then((thumbpath) => {
            this.setState({
                thumbnail: thumbpath,
            });
        }).catch((error) => {
            console.log(error);
            Modal.error({
                title: 'Error de conversión',
                content: Defaults.Strings.CannotConvert,
            });
        });

    }


    startConvertion() {

        this.setState({ converting: true });

        this.converter.convert().then((outpath) => {

            console

            shell.openItem(outpath);

            this.setState({ converting: false, thumbnail: null, });

        }).catch((error) => {
            console.log(error);
            Modal.error({
                title: 'Error de conversión',
                content: Defaults.Strings.CannotConvert,
            });
        });


    }

    chooseFileOutput() {


        remote.dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory', 'multiSelections']
        }, (paths) => {
            const path = paths[0];
            if (path) {
                this.converter.setOutputPath(path);
                message.success(Defaults.Strings.SelectedDirectory);
            } else {
                Modal.error({
                    title: 'Error de selección',
                    content: Defaults.Strings.CannotSelectDir,
                });
            }
        });

    }


    handleChangedSettings() {

        this.form.validateFields((errors, values) => {

            this.converter.setOutputDimentions(values.width, values.height);
            this.setState({ settingsModalOpen: false, });
        });

    }

    render() {

        const thumbnail = (
            <div className={'imageContainer'}>
                <img alt={'Thumbnail'} src={`${this.state.thumbnail}`} style={{ maxHeight: '100%', maxWidth: '100%' }} />
            </div>

        );

        const dropZone = (
            <Dropzone className={'dropzone'} onDrop={this.onFilesDrop} onClick={() => {}}>
                <p className={'dropText'}>{Defaults.Strings.DragHere}</p>
            </Dropzone>
        );

        return (
          <div>

              <div className={'mainArea'}>
                  { this.state.thumbnail ? thumbnail : dropZone }
              </div>

              <div className={'controls'}>

                  <Button type="primary"
                          loading={this.state.converting}
                          className={'spacedButton'}
                          disabled={!this.state.thumbnail}
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
                                    dimensions={this.converter.outputDimensions} />
                  </Modal>

                  <Button type="default"
                          shape="circle"
                          icon="setting"
                          className={'spacedButton'}
                          disabled={!this.state.thumbnail}
                          onClick={() => this.setState({ settingsModalOpen: true })} />

                  <Button type="default"
                          shape="circle"
                          icon="folder-open"
                          onClick={this.chooseFileOutput} />

              </div>

          </div>
        );
    }

}
