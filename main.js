/* eslint "import/no-extraneous-dependencies": "off" */

const electron = require('electron');
const playlist = require('./lib/playlist');
const player = require('./lib/player');
const path = require('path');
const url = require('url');
const youtube = require('./lib/youtube');

const globalShortcut = electron.globalShortcut;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let tracks = [];
let controlWindow;

let nowPlaying = '';

const getRandomSong = () => tracks[Math.floor(Math.random() * tracks.length)];

const doNext = () => {
  nowPlaying = getRandomSong();
  youtube.video.find(nowPlaying, (videoUrl, query) => {
    if (query === nowPlaying) {
      player.play(videoUrl);
    }
  });
};

const doStop = () => {
  console.log('stop clicked');
  player.stop();
};

const createWindow = () => {
  player.create();
  playlist.load('./playlists/playlist.txt', (ts) => {
    tracks = ts;
    doNext();
  });

  controlWindow = new BrowserWindow({ width: 400, height: 200 });
  controlWindow.on('closed', () => {
    controlWindow = null;
    player.close();
  });
  controlWindow.loadURL(url.format({
    pathname: path.join(__dirname, './ui-control/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  // controlWindow.webContents.openDevTools();

  player.on('stopped', doNext);

  electron.ipcMain.on('next', doNext);
  electron.ipcMain.on('stop', doStop);

  globalShortcut.register('MediaNextTrack', doNext);
  globalShortcut.register('MediaStop', doStop);
};

app.on('ready', createWindow);

app.on('window-all-closed', app.quit);

app.on('activate', () => {
  console.log('app:on:activate');
});
