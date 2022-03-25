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
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        icon: '',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    });
    mainWindow.center();
    mainWindow.removeMenu();
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
    mainWindow.once('ready-to-show', function () {
        mainWindow.maximize();
        mainWindow.show();
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
// Display disk path
console.log("DISK PATH", electron_1.app.getAppPath());
electron_1.ipcMain.on('async-save-projects', function (event, arg) {
    // console.log("async-save", arg);
    try {
        fs.writeFileSync('projectmanager.projects', JSON.stringify(arg), 'utf-8');
        mainWindow.webContents.send('save-status', { status: true });
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
        mainWindow.webContents.send('save-status', { status: false });
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
electron_1.ipcMain.on('minimize', function (event, arg) {
    mainWindow.minimize();
});
electron_1.ipcMain.on('maximize', function (event, arg) {
    mainWindow.maximize();
});
electron_1.ipcMain.on('close', function (event, arg) {
    mainWindow.close();
});
electron_1.ipcMain.on('open-link', function (event, arg) {
    console.log("LINK TO OPEN", arg);
    electron_1.shell.openExternal(arg);
});
electron_1.ipcMain.on('open-folder', function (event, arg) {
    console.log("FOLDER TO OPEN", arg);
    electron_1.shell.openPath(arg);
});
//# sourceMappingURL=main.js.map