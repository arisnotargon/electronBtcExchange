const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
let mainWindow = null;
function createMainWidow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800
    });
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createMainWidow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createMainWidow();
    }
});

