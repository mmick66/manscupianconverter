import { app, BrowserWindow, ipcMain } from 'electron';
import Defaults from './defaults';

let mainWindow;
let backWindow;

ipcMain.on(Defaults.Messages.StartConvertion, function(event, path) {

    backWindow = new BrowserWindow({ show: false, });

    backWindow.loadURL(`file://${__dirname}/background.html?image=${path}`);

    backWindow.on('closed', () => backWindow = null);

});

ipcMain.on(Defaults.Messages.ConvertionComplete, function(event, outpath) {
    if (!mainWindow) return;
    mainWindow.webContents.send(Defaults.Messages.ConvertionComplete, outpath);
});

ipcMain.on(Defaults.Messages.ConvertionError, function(event, error) {
    if (!mainWindow) return;
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
