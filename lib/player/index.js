/* eslint "import/no-extraneous-dependencies": "off" */
const electron = require('electron');
const events = require('events');

const emitter = new events.EventEmitter();

const BrowserWindow = electron.BrowserWindow;
let playerWindow;
let state = 'stopped';

const create = () => {
  playerWindow = new BrowserWindow({ show: false, width: 200, height: 200 });

  playerWindow.loadURL('about:blank');

  playerWindow.on('closed', () => {
    emitter.emit('closed');
    playerWindow = null;
  });

  playerWindow.webContents.on('media-started-playing', () => {
    setTimeout(() => {
      state = 'playing';
      emitter.emit('playing');
    }, 2000);
  });

  playerWindow.webContents.on('media-paused', () => {
    if (state === 'playing') {
      emitter.emit('stopped');
      state = 'stopped';
    }
  });
};

const close = () => {
  playerWindow.close();
};

const play = (videoUrl) => {
  state = 'starting';
  playerWindow.loadURL(videoUrl);
};
const stop = () => {
  state = 'stopped';
  playerWindow.loadURL('about:blank');
};
const on = emitter.on.bind(emitter);

module.exports = {
  create,
  close,
  play,
  stop,
  on,
};
