const fs = require('fs');
const jsdom = require('jsdom');
const youtube = require('./youtube');

const readPlaylist = () => fs.readFileSync('./playlist.txt').toString().split('\n').filter(l => l.length);
const songList = readPlaylist();

console.log(songList);

const getRandomSong = () => Math.floor(Math.random() * songList.length);

let retryDelay = 1000;


const next = (callback) => {
  const song = songList[getRandomSong()];

  youtube.video.find(song, (link) => {
    if (link) {
      callback(link, song);
      retryDelay = 1000;
    } else {
      retryDelay = retryDelay < 10000
        ? retryDelay + 1000
        : retryDelay;
      console.log('find failed, retrying in', retryDelay / 1000, 'seconds');
      setTimeout(() => next(callback), retryDelay);
    }
  });
};

module.exports = {
  next,
};
