// "use strict";

const fs = require("fs");
const jsdom = require("jsdom");

const readPlaylist = () => fs.readFileSync("./playlist.txt").toString().split("\n").filter(l => l.length);
const songList = readPlaylist();

console.log(songList);

const getRandomSong = () => Math.floor(Math.random() * songList.length);

const findVideoURL = (query, callback) => {

  // https://www.youtube.com/results?search_query=the+band+perry+if+i+die+young
  jsdom.env("https://www.youtube.com/results?search_query=" + query, [], function(err, window) {

    const results = window.document.getElementsByClassName("yt-lockup-title");
    const links = [];
    for (let result of results) {
      const link = result.children[0].href;

      if (-1 === link.indexOf("googleads.g.doubleclick.net") && -1 === link.indexOf("list=") && -1 === link.indexOf("user")) {
        callback(link, query);
        return
      }
    }

    callback();
  });
}

const next = (callback) => {
  let song = songList[getRandomSong()];
  findVideoURL(song, callback);
}

module.exports = {
  next
};
