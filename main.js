// main.js
const { app, BrowserWindow, ipcMain, dialog, globalShortcut, Tray, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const homedirHandler = require('./homedirHandler');
const moment = require('moment');
const themes = require("./styles/stylesManager.js");
let mainWindow;

// Tray creation
let tray = null;

app.on('ready', () => {
    // check folder
    homedirHandler.checkSnapCodeFolder();
    // Register the global shortcut...
    globalShortcut.register('CommandOrControl+Alt+S', () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
            mainWindow = new BrowserWindow({
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                    contextIsolation: false,
                },
                autoHideMenuBar: true,
                icon: path.join(__dirname, 'icon.ico')
            });
            mainWindow.loadFile('index.html');
        } else {
            mainWindow.show();
        }
    });

    // Create a new tray instance
    tray = new Tray(path.join(__dirname, 'icon.ico')); // Replace 'icon.png' with the path to your icon

    // Create a context menu for the tray icon
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click:  function(){
            mainWindow.show();
        } },
        { label: 'Quit', click:  function(){
            app.isQuiting = true;
            app.quit();
        } }
    ]);

    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);
    });
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,  // Enable contextIsolation for better security
        },
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    ipcMain.on('open-file', async () => {
        const { filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openFile'] });
        const content = fs.readFileSync(filePaths[0], 'utf-8');
        // get the file name
        const fileName = path.basename(filePaths[0]);
        mainWindow.webContents.send('file-opened', filePaths[0], content, fileName);
    });

    ipcMain.on('save-file', async (event, filePath, content) => {
        if (!filePath) {
            const { filePath } = await dialog.showSaveDialog(mainWindow, {});
            fs.writeFileSync(filePath, content);
            // get the file name
            const fileName = path.basename(filePath);
            mainWindow.webContents.send('file-saved', filePath, fileName);
        } 
        else {
            fs.writeFileSync(filePath, content);
            // get the file name
            const fileName = path.basename(filePath);
            mainWindow.webContents.send('file-saved', filePath, fileName);
        }
    });

    ipcMain.on('rename-file', async (event, oldFilePath) => {
        // Show the save dialog and get the new file path
        const { filePath: newFilePath } = await dialog.showSaveDialog(mainWindow, {});

        if (newFilePath) {
            // Rename the file
            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    // Send a message back to the renderer process with the new file path
                    // get the new filename first
                    const fileName = path.basename(newFilePath);
                    event.reply('file-renamed', newFilePath, fileName);
                }
            });
        }
    });

    // styles handler
    ipcMain.on('get-styles', (event) => {
        event.reply("got-style", themes)
    });

    // open with code
    ipcMain.on("open-with-code", (event, filePath) => {
        console.log(filePath);
        exec(`code "${filePath}"`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
        });
    })

    // execute the code
    ipcMain.on("execute-code", (event, lang, fileLoc) => {
        const outputWindow = new BrowserWindow({
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: false,
            },
            width: 1000,
            height: 600,
            autoHideMenuBar: true,
            icon: path.join(__dirname, 'icon.ico')
        });
        outputWindow.loadFile('shellExecutor.html');
        event.reply("executing-code");
        let command = "";
        if (lang === "python") {
            command = `python "${fileLoc}"`;
        }
        else if (lang === "javascript") {
            command = `node "${fileLoc}"`;
        }
        else if (lang === "cpp") {
            command = `gcc "${fileLoc}" -o "${fileLoc}.exe" && "${fileLoc}.exe"`;
        }
        else if (lang === "java") {
            command = `javac "${fileLoc}" && java "${fileLoc}"`;
        }
        else {
            event.reply("code-executed", undefined);
        }

        const commandProcess = exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                event.reply("code-executed", err);
            }
        });

        commandProcess.stdout.on('data', (data) => {
            console.log(data);
            outputWindow.webContents.send("output", data.toString());
        });

        commandProcess.stderr.on('data', (data) => {
            console.log(data);
            outputWindow.webContents.send("output", data.toString());
        });

        commandProcess.on('close', (code) => {
            event.reply("code-executed", code);
        });

        ipcMain.on("input", (event, data) => {
            commandProcess.stdin.write(data + "\n");
        });
    });

});

app.on('window-all-closed', function () {
    console.log('window-all-closed');
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow.show();
});
