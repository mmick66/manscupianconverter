import mkdirp from "mkdirp";
import libraw from "libraw";
import sharp from "sharp";
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

        if (options.crop) {

            for (let key in options.crop) options.crop[key] /= 100.0;

            console.log(options.crop);

            this.extract = {
                left: Math.round(this.size.width * options.crop.x),
                top: Math.round(this.size.height * options.crop.y),
                width: Math.round(this.size.width * options.crop.width),
                height: Math.round(this.size.height * options.crop.height),
            };
        }

        this.format = Converter.Format.PNG;

        if (!fs.existsSync(this.dir.temp)) mkdirp.sync(this.dir.temp);

        if (options.load) {
            this.image = new ImageFile(options.load);
        }

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
                .extractThumb(this.image.path, `${this.dir.temp}/${this.image.name}`) // adds 'thumb.jpg at the end
                .then((path) => {
                    this.image.thumbnail = path;
                    res(this.image);

                }).catch((error) => rej(error));
        });
    }


    resize(height) {

        return new Promise((res, rej) => {

            if (!this.image) rej('Need to load image before resizing');

            const width = Math.round(height * this.image.ratio);

            const out = `${this.dir.temp}/${this.image.name}.render.jpg`;

            return sharp(this.image.thumbnail)
                .resize(width, height)
                .toFile(out).then(() => {
                    res(out);
                });
        });

    }


    convert() {

        return new Promise((res, rej) => {

            libraw
                .extract(this.image.path, `${this.dir.temp}/${this.image.name}`)
                .then((outpath) => {

                    let sharpAPI = sharp(outpath);
                    switch (this.format) {
                        case Converter.Format.PNG:
                            sharpAPI = sharpAPI.png();
                            break;
                        case Converter.Format.JPG:
                            sharpAPI = sharpAPI.jpeg();
                            break;
                    }

                    sharpAPI = sharpAPI.resize(this.size.width, this.size.height);

                    if (this.extract) {
                        sharpAPI.extract(this.extract);
                    }

                    const finalpath = `${this.dir.out}/${this.image.name}.${this.format.toLowerCase()}`

                    sharpAPI
                        .toFile(finalpath)
                        .then(() => res(finalpath), (error) => rej(error));

            }, (error) => rej(error));

        });
    }
}

Converter.Format = {
    PNG: 'PNG',
    JPG: 'JPG',
};
