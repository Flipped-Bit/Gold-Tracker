// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { DataManager } = require('./services/dataManagerService');
const path = require('path');
const process = require('process');

let dataManager, mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    transparent: true,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nativeWindowOpen: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

async function initialiseDataManager() {
  dataManager = new DataManager();

  if(await dataManager.checkConnection()){
    await dataManager.initTables();
    await dataManager.seedTable();
  };
}

async function initialiseServices() {
  await initialiseDataManager();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  initialiseServices();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('closeApp', (evt, arg) => {
  app.quit();
});