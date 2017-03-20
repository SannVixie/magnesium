const jsdom = require('jsdom');

const find = (query, callback) => {
  console.log('find', query);

  jsdom.env(`https://www.youtube.com/results?search_query=${query}`, [], (err, window) => {
    if (!err && window) {
      const results = window.document.getElementsByClassName('yt-uix-tile-link');

      for (const result of results) {
        const link = result.href;
        console.log('found link', link);
        if (link.indexOf('googleads.g.doubleclick.net') === -1 && link.indexOf('list=') === -1 && link.indexOf('user') === -1) {
          callback(link);
          return;
        }
      }
    }
    callback();
  });
};

module.exports = {
  find,
};
