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
        this.out = options.out || Defaults.Paths.Out;

        if (!fs.existsSync(this.out)) {
            mkdirp.sync(this.out);
        }
    }

    set width(value) {
        this.size.width = value;
    }

    set height(value) {
        this.size.height = value;
    }

    load(filePath) {
        this.image = new ImageFile(filePath);
    }

    thumbnail() {

        return new Promise((res, rej) => {

            libraw.extractThumb(this.image.path, `${this.out}/${this.image.name}.thumb.${this.image.type}`).then((outpath) => {

                const size = sizeOf(outpath);

                this.image.ratio = size.height / size.width;
                res(outpath);

            }, (error) => {
                rej(error);
            });
        });

    }

    convert() {

        return new Promise((res, rej) => {

            const out = `${this.out}/${this.image.name}`;
            libraw.extract(this.image.path, out).then((outpath) => {

                sharp(outpath).png().resize(this.size.width, this.size.height).toFile(`${out}.png`).then(() => {

                    res(outpath);

                }, (error) => {
                    rej(error);
                });

            }, (error) => {
                rej(error);
            });

        });
    }
}
