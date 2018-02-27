import { ipcRenderer } from 'electron';
import query from 'query-string';

import Converter from './converter';
import Defaults from "./defaults";

const params = query.parse(location.search);

const converter = new Converter({ load: params.image });

converter.convert().then((outpath) => {
    ipcRenderer.send(Defaults.Messages.ConvertionComplete, outpath);
}).catch((error) => {
    ipcRenderer.send(Defaults.Messages.ConvertionError, error);
});


