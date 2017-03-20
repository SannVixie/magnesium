const jsdom = require('jsdom');

const find = (playlistUrl, callback) => {
  console.log('find', playlistUrl);

  jsdom.env(playlistUrl, [], (err, window) => {
    if (err || !window) {
      callback();
      return;
    }

    const results = window.document.getElementsByClassName('pl-video-title-link');
    const links = Object.keys(results).map(r => results[r].innerHTML.trim());
    callback(links);
  });
};

module.exports = {
  find,
};
