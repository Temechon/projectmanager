"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var url = require("url");
var mainWindow;
// const args = process.argv.slice(1);
// const serve = args.some(val => val === '--serve');
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        // frame: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#323659',
            symbolColor: '#F3F6FF'
        },
        icon: '',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.center();
    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.focus();
    // Path when running electron executable
    var pathIndex = './index.html';
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
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (mainWindow === null)
        createWindow();
});
// Set disk path
console.log("DISK PATH", electron_1.app.getAppPath());
electron_1.ipcMain.on('async-save-projects', function (event, arg) {
    // console.log("async-save", arg);
    try {
        fs.writeFileSync('projectmanager.projects', JSON.stringify(arg), 'utf-8');
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
    }
});
electron_1.ipcMain.on('async-save-tasks', function (event, arg) {
    // console.log("async-save", arg);
    try {
        fs.writeFileSync('projectmanager.tasks', JSON.stringify(arg), 'utf-8');
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
    }
});
electron_1.ipcMain.on('read-projects', function (event, arg) {
    var projects = null;
    try {
        projects = fs.readFileSync('projectmanager.projects', 'utf-8');
    }
    catch (e) {
        console.error(e, 'No file called projectmanager.projects');
    }
    event.returnValue = projects;
});
electron_1.ipcMain.on('read-tasks', function (event, arg) {
    var tasks = null;
    try {
        tasks = fs.readFileSync('projectmanager.tasks', 'utf-8');
    }
    catch (e) {
        console.error(e, 'No file called projectmanager.tasks');
    }
    event.returnValue = tasks;
});
//# sourceMappingURL=main.js.map