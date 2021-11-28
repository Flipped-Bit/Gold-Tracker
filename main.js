// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { ChatListener } = require('./services/chatListenerService');
const { DataManager } = require('./services/dataManagerService');
const path = require('path');
const process = require('process');

const transactionType = {
  BUY: "buy"
}

let chatListener, dataManager, mainWindow;

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

async function initialiseChatListener() {
  chatListener = new ChatListener('castlehead');

  await chatListener.connect();

  try {
    chatListener.client.on("cheer", async (channel, userstate, message) => {
      await validateCheer(userstate["bits"], message, userstate["username"]);
    });
    console.log('Chat Listener Event Managers have been setup successfully.');
  } catch (error) {
    console.error('Unable to setup the Event Managers:', error);
  }
}

async function initialiseDataManager() {
  dataManager = new DataManager("castlehead");

  if (await dataManager.checkConnection()) {
    await dataManager.initTables();
    await dataManager.seedTable();
  };
}

async function initialiseServices() {
  await initialiseDataManager();
  await initialiseChatListener();
}

async function updateBalance(newBalance) {
  console.log(`Balance is now ${newBalance}`);
}

async function validateCheer(bits, message, username) {
  var bits = parseInt(bits, 10);
  if (bits >= 100 && message.toLowerCase().includes("gold")) {
    console.log(`Enough bits donated by ${username} (${bits} bits)`);
    await dataManager.transferGold(1, transactionType.BUY, username)
      .then(result => {
        updateBalance(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    console.log(`Not enough bits donated by ${username} (${bits} bits)`);
  }
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

ipcMain.on('addGold', async (evt, arg) => {
  await validateCheer(100, "gold", "Flipped_bit");
});

ipcMain.on('closeApp', (evt, arg) => {
  app.quit();
});