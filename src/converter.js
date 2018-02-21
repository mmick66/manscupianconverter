import mkdirp from "mkdirp";
import libraw from "libraw";
import sharp from "sharp";
import sizeOf from "image-size";
import fs from 'fs';

import Defaults from './defaults';
import ImageFile from "./file";

export default class Converter {

    constructor(options) {

        options = options || {};

        this.size = {
            width: options.width || Defaults.Size.Width,
            height: options.width || Defaults.Size.Height
        };

        this.dir = {
            temp: options.temp || Defaults.Paths.Temp,
            out: options.out || Defaults.Paths.Out
        };

        if (!fs.existsSync(this.dir.temp)) mkdirp.sync(this.dir.temp);

    }

    get imageRatio() {
        return this.image ? this.image.ratio : 0;
    }

    get outputDimensions() {
        return this.size;
    }

    setOutputDimentions(width, height) {
        this.size = {
            width: width,
            height: height
        };
    }

    setOutputPath(value) {
        this.dir.out = value;
    }


    load(filePath) {
        this.image = new ImageFile(filePath);

        return new Promise((res, rej) => {

            libraw
                .extractThumb(this.image.path, `${this.dir.temp}/${this.image.name}.thumb.${this.image.type}`)
                .then((thumbpath) => {

                    const size = sizeOf(thumbpath);

                    this.image.ratio = size.height / size.width;
                    res(thumbpath);

                }, (error) => rej(error));
        });
    }


    convert() {

        return new Promise((res, rej) => {

            libraw
                .extract(this.image.path, `${this.dir.temp}/${this.image.name}`)
                .then((outpath) => {

                    sharp(outpath)
                        .png()
                        .resize(this.size.width, this.size.height)
                        .toFile(`${this.dir.out}/${this.image.name}.png`)
                        .then(() => res(outpath), (error) => rej(error));

            }, (error) => rej(error));

        });
    }
}
