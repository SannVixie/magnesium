const jsdom = require('jsdom');

const find = (query, callback) => {
  jsdom.env(`https://www.youtube.com/results?search_query=${query}`, [], (err, window) => {
    if (!err && window) {
      const results = window.document.getElementsByClassName('yt-uix-tile-link');

      for (const result of results) {
        const link = result.href;
        if (link.indexOf('googleads.g.doubleclick.net') === -1 && link.indexOf('list=') === -1 && link.indexOf('user') === -1) {
          callback(link, query);
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
