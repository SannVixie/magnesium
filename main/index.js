const electron = require('electron');
const playlist = require('./lib/playlist');
const player = require('./lib/player');
const youtube = require('./lib/youtube');

const globalShortcut = electron.globalShortcut;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let win;

const doPlay = (track) => {
  if (!win) {
    return;
  }
  youtube.video.find(track, (videoUrl, query) => {
    if (query === track) {
      win.webContents.send('playing', track);
      player.play(videoUrl);
    }
  });
};

const doNext = () => {
  playlist.random();
};

const doStop = () => {
  player.stop();
};

const createWindow = () => {
  player.create();
  playlist.load('playlist.txt');

  win = new BrowserWindow({ width: 480, height: 240 });
  win.on('closed', () => {
    win = null;
    player.close();
    playlist.close();
  });
  win.loadURL(`file://${__dirname}/../dist/ui-control/index.html`);

  // win.webContents.openDevTools();

  player.on('stopped', doNext);
  playlist.on('playlist:play', doPlay);

  electron.ipcMain.on('next', doNext);
  electron.ipcMain.on('stop', doStop);

  electron.ipcMain.on('playlist:open', playlist.open);
  electron.ipcMain.on('player:show', player.show);

  globalShortcut.register('MediaNextTrack', doNext);
  globalShortcut.register('MediaStop', doStop);

  doNext();
};

app.on('ready', createWindow);

app.on('window-all-closed', app.quit);

app.on('activate', () => {
  console.log('app:on:activate');
});
