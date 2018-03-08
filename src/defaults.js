import os from 'os';

const defpath = os.homedir() + '/MancuspiaConverter';

const Paths = {
    Out: defpath,
    Temp: defpath + '/temp'
};

const Size = {
    Width: 1200,
    Height: 900,
};

const Values = {
    CosmeticDelay: 800,
};

const Strings = {
    ValueNotNumeric: 'El valor no es numérico',
    DragHere: 'Prueba a soltar algunos archivos RAW aquí',
    OrClickToUpload: 'o haga clic para cargar desde su unidad local',
    CannotConvert: 'No se pudo convertir esta imagen. Asegúrese de que sea de formato RAW y se puede abrir con Preview',
    CannotSelectDir: 'No se pudo seleccionar el directorio',
    SelectedDirectory: 'Nuevo directorio seleccionado',
};

const Messages = {
    StartConvertion: 'start-convertion',
    ConvertionComplete: 'convertion-complete',
    ConvertionError: 'convertion-error'
};


export default {
    Paths: Paths,
    Size: Size,
    Strings: Strings,
    Values: Values,
    Messages: Messages,
};
