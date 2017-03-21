/* eslint "import/no-extraneous-dependencies": "off" */
const electron = require('electron');
const EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter();
const on = emitter.on.bind(emitter);

const BrowserWindow = electron.BrowserWindow;
let win = null;
let state = 'stopped';

const create = () => {
  win = new BrowserWindow({
    show: false,
    width: 200,
    height: 200,
  });

  win.loadURL('about:blank');

  win.on('closed', () => {
    emitter.emit('closed');
    win = null;
  });

  win.webContents.on('media-started-playing', () => {
    setTimeout(() => {
      state = 'playing';
      emitter.emit('playing');
    }, 2000);
  });

  win.webContents.on('media-paused', () => {
    if (state === 'playing') {
      emitter.emit('stopped');
      state = 'stopped';
    }
  });
};

const close = () => {
  if (win) {
    win.close();
  }
};

const play = (videoUrl) => {
  if (!win) {
    create();
  }
  state = 'starting';
  win.loadURL(videoUrl);
};

const stop = () => {
  close();
};
const show = () => {
  if (win) {
    win.show();
  }
};

module.exports = {
  show,
  create,
  close,
  play,
  stop,
  on,
};
