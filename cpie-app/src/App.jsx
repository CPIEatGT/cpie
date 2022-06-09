import logo from './logo.svg';
import './App.css';
import React from "react";
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import classnames from "classnames";

import MapView from "./visualizer/MapView";
import StackLine from "./visualizer/StackLine";
import DotMapView from "./visualizer/DotMapView";

@observer
class App extends React.Component {

  constructor(props) {

    
    super(props);
    // this.state = {
    //   year: 1999,
    //   statecode:'Alabama'
    // }
  
  }

  @observable year = '1999'
  @observable statecode = 'Alabama'
 
  


  setyear(year){
    console.log(year)
    this.year = year
    
  
}

setstatecode(statecode){
  console.log(statecode)
  
  this.statecode =statecode

}

  render() {
    return (
      <div className="App">
        <div class="column" >
        <MapView year = {this.year} statecode = {this.statecode} setyear={year => this.setyear(year)} setstatecode={statecode => this.setstatecode(statecode)}/>
        <StackLine statecode = {this.statecode} setyear={year => this.setyear(year)} />
        </div>
        <div class="column"  >
        <DotMapView year = {this.year} statecode = {this.statecode} setyear={year => this.setyear(year)} setstatecode={statecode => this.setstatecode(statecode)}/>
        </div>
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
