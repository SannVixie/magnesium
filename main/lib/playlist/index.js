/* eslint "import/no-extraneous-dependencies": "off" */
const electron = require('electron');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

const emitter = new EventEmitter();
const on = emitter.on.bind(emitter);

const BrowserWindow = electron.BrowserWindow;
let win = null;
let playlist = [];
let nowPlaying = 0;

const play = (t) => {
  emitter.emit('playlist:play', t);
  if (win) {
    win.webContents.send('playlist:nowplaying', t);
  }
};

electron.ipcMain.on('playlist:list', () => {
  if (win) {
    win.webContents.send('playlist:list', playlist);
  }
});
electron.ipcMain.on('playlist:nowplaying', () => {
  if (win) {
    win.webContents.send('playlist:nowplaying', playlist[nowPlaying]);
  }
});

electron.ipcMain.on('playlist:play', (e, t) => {
  play(t);
});

const load = (name) => {
  const loaded = fs.readFileSync(`./playlists/${name}`).toString().split('\n').filter(t => t.length !== 0);

  playlist = playlist.concat(loaded);

  if (win) {
    win.webContents.send('playlist:list', playlist);
  }
};

const save = name => fs.writeFileSync(name, playlist.join('\n'));

const close = () => {
  if (win) {
    win.close();
    win = null;
  }
};

const open = () => {
  close();
  win = new BrowserWindow({ show: true, width: 400, height: 600 });
  win.loadURL(`file://${__dirname}/../../../dist/ui-playlist/index.html`);
  win.on('closed', () => {
    emitter.emit('closed');
    win = null;
  });
};


const next = () => {
  nowPlaying = (nowPlaying + 1) % playlist.length;
  play(playlist[nowPlaying]);
};
const random = () => {
  nowPlaying = Math.floor(Math.random() * playlist.length);
  play(playlist[nowPlaying]);
};

module.exports = {
  next,
  random,
  load,
  save,
  open,
  close,
  on,
};
