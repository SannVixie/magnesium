import React from 'react';
import electron from 'electron';

export default class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      playing: '',
    };

    this.updatePlaying = (e, playing) => this.setState({ playing });
  }

  componentDidMount() {
    console.log('componentDidMount');
    electron.ipcRenderer.send('playing');
    electron.ipcRenderer.on('playing', this.updatePlaying);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    electron.ipcRenderer.removeListener('playing', this.updatePlaying);
  }

  render() {
    return (
      <div>
        <div className="ui basic center aligned segment">
          <button className="ui button" type="button" onClick={() => electron.ipcRenderer.send('stop')}>
            <i className="stop icon" />
            stop</button>
          <button className="ui button" type="button" onClick={() => electron.ipcRenderer.send('next')}>
            <i className="step forward icon" />
            next</button>
        </div>

        <div className="ui basic center aligned segment">
          <h1 className="ui header">{this.state.playing}</h1>
        </div>
      </div>
    );
  }
}
