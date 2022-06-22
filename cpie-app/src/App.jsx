import logo from './logo.svg';
import './App.css';
import React from "react";
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import classnames from "classnames";

import MapView from "./visualizer/MapView";
import StackLine from "./visualizer/StackLine";
import DotMapViewCombine from "./visualizer/DotMapViewCombine";

@observer
class App extends React.Component {

  constructor(props) {


    super(props);
    this.state = {
      // year: 1999,
      // statecode:'Alabama'
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
      </div>
    )
  }
}


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
