const { app, BrowserWindow, screen } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');

let mainWindow;

// const args = process.argv.slice(1);
// const serve = args.some(val => val === '--serve');

function createWindow() {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
        // Path when running electron in local folder
        pathIndex = '../dist/index.html';
    }

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: 'file:',
        slashes: true
    }));
    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})