import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

let mainWindow: BrowserWindow;

// const args = process.argv.slice(1);
// const serve = args.some(val => val === '--serve');

function createWindow() {

    mainWindow = new BrowserWindow({
        // frame: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#323659',
            symbolColor: '#F3F6FF'
        },
        icon: '', // TODO
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWindow.center();
    mainWindow.removeMenu();
    mainWindow.maximize();
    mainWindow.focus();

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
    // mainWindow.webContents.openDevTools()

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

// Set disk path
console.log("DISK PATH", app.getAppPath());

ipcMain.on('async-save-projects', (event, arg) => {
    // console.log("async-save", arg);
    try {
        fs.writeFileSync('projectmanager.projects', JSON.stringify(arg), 'utf-8');
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
    }
})

ipcMain.on('async-save-tasks', (event, arg) => {
    // console.log("async-save", arg);
    try {
        fs.writeFileSync('projectmanager.tasks', JSON.stringify(arg), 'utf-8');
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
    }
})

ipcMain.on('read-projects', (event, arg) => {
    let projects = null;
    try {
        projects = fs.readFileSync('projectmanager.projects', 'utf-8');
    } catch (e) {
        console.error(e, 'No file called projectmanager.projects');
    }
    event.returnValue = projects;
})
ipcMain.on('read-tasks', (event, arg) => {
    let tasks = null;
    try {
        tasks = fs.readFileSync('projectmanager.tasks', 'utf-8');
    } catch (e) {
        console.error(e, 'No file called projectmanager.tasks');
    }
    event.returnValue = tasks;
})