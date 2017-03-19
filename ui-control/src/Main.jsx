import React from "react";
import electron from 'electron';

export default class Main extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    console.log("render main", !!electron);

    return (
      <div>
        <div class="ui basic center aligned segment">
          <h1 class="ui header">magnesium controls</h1>
        </div>
        <div class="ui basic center aligned segment">
          <button class="ui button" type="button" onClick={() => electron.ipcRenderer.send("stop")}>
            <i class="stop icon"></i>stop</button>
          <button class="ui button" type="button" onClick={() => electron.ipcRenderer.send("next")}>
            <i class="step forward icon"></i>next</button>
        </div>
      </div>
    );
  }
}
