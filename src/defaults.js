import os from 'os';

const defpath = os.homedir() + '/MancuspiaConvert';

const Paths = {
    Out: defpath,
    Temp: defpath
};

const Size = {
    Width: 1200,
    Height: 900,
};

const Strings = {
    ValueNotNumeric: 'El valor no es numérico',
    DragHere: 'Prueba a soltar algunos archivos aquí...',
    CannotConvert: 'No se pudo convertir esta imagen',
    CannotSelectDir: 'No se pudo seleccionar el directorio',
    SelectedDirectory: 'Nuevo directorio seleccionado',
};


export default {
    Paths: Paths,
    Size: Size,
    Strings: Strings,
};
