import os from 'os';

const Paths = {
    Converted: os.homedir() + '/MancuspiaConvert'
};

const Size = {
    Width: 1200,
    Height: 900,
};

const Strings = {
    ValueNotNumeric: 'El valor no es numérico',
    DragHere: 'Prueba a soltar algunos archivos aquí...',
};


export default {
    Paths: Paths,
    Size: Size,
    Strings: Strings,
};
