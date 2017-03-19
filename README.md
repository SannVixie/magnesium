# magnesium

a streaming music player that plays content from youtube

your music library is a list of songs

## install and run release

(windows users probably want this)

- go to <https://github.com/robblue2x/magnesium/releases>
- download the archive

  - windows: `magnesium-win32-x64.zip`
  - linux: `magnesium-linux-x64.tar.gz`

- extract the archive on your disk

- open the folder `magnesium-(platform)-x64`

- run the executable binary `magnesium` (.exe)

## editing your playlist

- open the folder `magnesium-(platform)-x64`
- open file `playlist.txt` with atom/notepad++/wordpad
- add one line per song
- the format `artist title` seems to work quite well

## using git

### prerequsites

- node
- npm

on ubuntu/debian:

```bash
sudo apt install nodejs npm nodejs-legacy
```

### clone repository

```bash
cd ~/projects
git clone https://github.com/robblue2x/magnesium.git
cd magnesium
npm install
```

### run program

```bash
cd ~/projects/magnesium
npm start
```

### update

```bash
cd ~/projects/magnesium
git pull
npm i
```

### create package

```bash
cd ~/projects/magnesium
npm run package-(linux|win32|all)
```

## FAQ

_I hear ads before a video_

youtube sometimes plays ads before videos, blocking youtube and google ads in your hosts file seems to work well to stop these

_I added ABC to my playlist but it doesn't play_

try searching for the same thing on youtube.com, that is all this app does, if if ABC can't be found on youtube then it cannot be played

_Why didn't you use embedded YT player_

i really wanted to, and had it working in an early prototype, but some videos (a lot of music videos) don't play if not viewed from youtube.com

_Why is there no pause/seek feature?_

the app just loads a youtube video in a hidden window, it can't interact with it
