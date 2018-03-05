import path from 'path';
import sizeOf from "image-size";

export default class ImageFile {

    constructor(fileFullPath) {

        this.parsed = path.parse(fileFullPath);

    }

    get name() {
        return this.parsed.name;
    }


    get path() {
        return `${this.parsed.dir}/${this.parsed.base}`;
    }

    get width() {
        if (!this.thumbnail) throw new Error('Needs to set thumbnail first');
        return this._width;
    }

    get height() {
        if (!this.thumbnail) throw new Error('Needs to set thumbnail first');
        return this._height;
    }

    get ratio() {
        return this.width / this.height;
    }

    set thumbnail(path) {
        this._thumbnail = path;
        const size  = sizeOf(path);
        this._width  = size.width;
        this._height = size.height;
    }

    get thumbnail() {
        return this._thumbnail;
    }



};
