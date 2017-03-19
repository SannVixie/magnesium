const electron = require('electron')
const playlist = require('./playlist')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let playerWindow;
let controlWindow;
let playing = false;
let nextInProgress = false;

const playNext = () => {
  console.log("playNext");
  if(nextInProgress){
    return;
  }
  nextInProgress = true;
  playing = false;
  playlist.next((url, query) => {
    console.log("playNext", url, query);
    playerWindow.loadURL(url);
    nextInProgress = false;
  });
}

const createWindow = () => {

  controlWindow = new BrowserWindow({width: 400, height: 200})
  controlWindow.on('closed', () => {
    controlWindow = null
    playerWindow && playerWindow.close()
  })
  controlWindow.loadURL(url.format({
    pathname: path.join(__dirname, './ui-control/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // controlWindow.webContents.openDevTools();

  playerWindow = new BrowserWindow({show: false, width: 400, height: 200})
  playerWindow.on('closed', () => {
    playerWindow = null
    controlWindow && controlWindow.close()
  })
  // playerWindow.webContents.openDevTools();

  playerWindow.webContents.on("media-started-playing", () => {
    console.log("media-started-playing");
    setTimeout(() => {
      console.log("playing = true");
      playing = true;
    }, 2000);
  });

  playerWindow.webContents.on("media-paused", () => {
    console.log("media-paused");
    if (playing) {
      playNext();
    }
  });

  electron.ipcMain.on("next", () => {
    console.log("next clicked");
    playNext();
  });
  electron.ipcMain.on("stop", () => {
    playing = false;
    console.log("stop clicked");
    playerWindow.loadURL("https://stopped");
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', app.quit)

app.on('activate', () => {

  if (playerWindow === null) {
    createWindow()
  }
})
