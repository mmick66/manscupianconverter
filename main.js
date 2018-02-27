import { app, BrowserWindow } from 'electron';

let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

const createWindow = () => {

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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit(); // when window closed quit except for MacOS
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

