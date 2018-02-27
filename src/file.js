import path from 'path';

export default class ImageFile {

    constructor(fileFullPath) {

        this.parsed = path.parse(fileFullPath);
        this.ratio = 1.0;

    }

    get name() {
        return this.parsed.name;
    }

    get type() {
        return this.parsed.ext.substring(1); // remove dot
    }

    get path() {
        return `${this.parsed.dir}/${this.parsed.base}`;
    }

};
