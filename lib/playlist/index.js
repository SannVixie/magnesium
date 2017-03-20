const fs = require('fs');

const list = (dir, cb) => {
  fs.readDir(dir, cb);
};
const load = (name, cb) => {
  fs.readFile(name, (e, d) => {
    if (e || !d) {
      cb();
    } else {
      const tracks = d.toString().split('\n').filter(t => t.length !== 0);
      cb(tracks);
    }
  });
};
const save = (tracks, name) => {
  fs.writeFileSync(name, tracks.join('\n'));
};

module.exports = {
  list,
  load,
  save,
};
