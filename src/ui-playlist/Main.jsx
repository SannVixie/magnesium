/* eslint jsx-a11y/no-static-element-interactions : off */

import React from 'react';
import electron from 'electron';

export default class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      playlist: [],
      nowPlaying: '',
    };

    this.updatePlaylist = (e, playlist) => this.setState({ playlist });
    this.updateNowPlaying = (e, nowPlaying) => this.setState({ nowPlaying });
  }

  componentDidMount() {
    electron.ipcRenderer.on('playlist:list', this.updatePlaylist);
    electron.ipcRenderer.on('playlist:nowplaying', this.updateNowPlaying);
    electron.ipcRenderer.send('playlist:list');
    electron.ipcRenderer.send('playlist:nowplaying');
  }

  componentWillUnmount() {
    electron.ipcRenderer.removeListener('playlist:list', this.updatePlaylist);
    electron.ipcRenderer.removeListener('playlist:nowplaying', this.updateNowPlaying);
  }

  render() {
    const list = [];
    for (const t of this.state.playlist) {
      const playing = this.state.nowPlaying === t ? 'inverted' : '';
      list.push(
        <div
          className={`ui basic center aligned segment ${playing}`}
          onClick={() => electron.ipcRenderer.send('playlist:play', t)}
        >{t}</div>);
    }
    return (
      <div>
        <div className="ui basic center aligned segment">
          {list}
        </div>
      </div>
    );
  }
}
