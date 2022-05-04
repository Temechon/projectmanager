import { app, BrowserWindow, dialog, ipcMain, screen, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';


let mainWindow: BrowserWindow;

// const args = process.argv.slice(1);
// const serve = args.some(val => val === '--serve');

function createWindow() {

    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        icon: '', // TODO
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,

    })
    mainWindow.center();
    mainWindow.removeMenu();

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

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// Display disk path
console.log("DISK PATH", app.getAppPath());

/**
 * Save project json to disk
 */
ipcMain.on('async-save-projects', (event, projectid, projectjson) => {
    try {
        fs.writeFileSync(`projectmanager.projects.${projectid}`, projectjson, 'utf-8');
        mainWindow.webContents.send('save-status', { status: true });
    }
    catch (e) {
        console.error(e, 'Failed to save the file !');
        mainWindow.webContents.send('save-status', { status: false });
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

ipcMain.on('minimize', (event, arg) => {
    mainWindow.minimize();
})
ipcMain.on('maximize', (event, arg) => {
    mainWindow.maximize();
})
ipcMain.on('close', (event, arg) => {
    mainWindow.close();
})
ipcMain.on('open-link', (event, arg) => {
    console.log("LINK TO OPEN", arg);
    shell.openExternal(arg);
})
ipcMain.on('open-folder', (event, arg) => {
    console.log("FOLDER TO OPEN", arg);
    shell.openPath(arg);
})
ipcMain.on('show-dialog', (event, options) => {
    event.returnValue = dialog.showMessageBoxSync(mainWindow, options);
})