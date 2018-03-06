import { app, BrowserWindow, ipcMain } from 'electron';
import Defaults from './defaults';

let mainWindow;
let backWindow;

ipcMain.on(Defaults.Messages.StartConvertion, function(event, path, crop) {

    backWindow = new BrowserWindow({ show: false, });

    let url = `file://${__dirname}/background.html?image=${path}`;

    if (crop.x) {
        url += `&x=${crop.x}&y=${crop.y}&width=${crop.width}&height=${crop.height}`
    }

    backWindow.loadURL(url);
    backWindow.on('closed', () => backWindow = null);

});

ipcMain.on(Defaults.Messages.ConvertionComplete, function(event, outpath) {
    backWindow.close();
    mainWindow.webContents.send(Defaults.Messages.ConvertionComplete, outpath);
});

ipcMain.on(Defaults.Messages.ConvertionError, function(event, error) {
    backWindow.close();
    mainWindow.webContents.send(Defaults.Messages.ConvertionError, error);
});

const isDevMode = process.execPath.match(/[\\/]electron/);

const createMainWindow = () => {

    mainWindow = new BrowserWindow({
        width: 600,
        height: 550,
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.setResizable(false);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit(); // when window closed quit except for MacOS
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});
