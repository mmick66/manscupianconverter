import { ipcRenderer } from 'electron';
import query from 'query-string';

import Converter from './converter';
import Defaults from "./defaults";

const urlParams = query.parse(location.search);

let options = {
    load: urlParams.image
};

if (urlParams.x) {
    options.crop = {
        x: urlParams.x,
        y: urlParams.y,
        width: urlParams.width,
        height: urlParams.height,
    }
}

const converter = new Converter(options);

converter.convert().then((outpath) => {
    ipcRenderer.send(Defaults.Messages.ConvertionComplete, outpath);
}).catch((error) => {
    ipcRenderer.send(Defaults.Messages.ConvertionError, error);
});


