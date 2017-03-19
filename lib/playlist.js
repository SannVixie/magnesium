// "use strict";

const fs = require("fs");
const jsdom = require("jsdom");

const readPlaylist = () => fs.readFileSync("./playlist.txt").toString().split("\n").filter(l => l.length);
const songList = readPlaylist();

console.log(songList);

const getRandomSong = () => Math.floor(Math.random() * songList.length);

let retryDelay = 1000;

const findVideoURL = (query, callback) => {

  console.log("findVideoURL", query);

  // https://www.youtube.com/results?search_query=the+band+perry+if+i+die+young
  jsdom.env("https://www.youtube.com/results?search_query=" + query, [], function(err, window) {

    if (err || !window) {
      callback();
      return;
    }
    const results = window.document.getElementsByClassName("yt-lockup-title");
    const links = [];
    for (let result of results) {
      const link = result.children[0].href;
      console.log("found link", link);
      if (-1 === link.indexOf("googleads.g.doubleclick.net") && -1 === link.indexOf("list=") && -1 === link.indexOf("user")) {
        callback(link);
        return;
      }
    }
    callback();

  });
}

const next = (callback) => {
  let song = songList[getRandomSong()];

  findVideoURL(song, (link) => {
    if (link) {
      callback(link, song);
      retryDelay = 1000;
    } else {
      retryDelay = retryDelay < 10000
        ? retryDelay + 1000
        : retryDelay;
      console.log("find failed, retrying in", retryDelay / 1000, "seconds");
      setTimeout(() => next(callback), retryDelay);
    }
  });
}

module.exports = {
  next
};
