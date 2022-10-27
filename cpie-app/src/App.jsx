import logo from './logo.svg';
import './App.css';
import React from "react";
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import classnames from "classnames";


import DotMapViewCombine from "./visualizer/DotMapViewCombine";

@observer
class App extends React.Component {

  constructor(props) {


    super(props);
    this.state = {
      FACID: 3
    }

  }

  @observable year = '1999'
  @observable statecode = 'Alabama'
  // @observable FACID = 3




  setFACID(FACID) {
    console.log(FACID)

    this.setState({
      FACID: parseInt(FACID)
    })



  }

  setstatecode(statecode) {
    console.log(statecode)

    this.statecode = statecode

  }

  render() {
    return (
      <div className="App">
         <DotMapViewCombine year = {this.year} statecode = {this.statecode} setFACID={FACID => this.setFACID(FACID)} setstatecode={statecode => this.setstatecode(statecode)}/>
      <div id="loading-image" style={{display:"none"}}></div>
      </div>
    )
  }
}




export default App;
