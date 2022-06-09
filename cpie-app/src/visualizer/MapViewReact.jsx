

// import { scaleLinear, max, axisLeft, axisBottom, select } from "d3"
import React from "react";
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from "d3-geo"
// import {Legend} from "./Legend"
import { interpolateOrRd } from "d3-scale-chromatic"
import Select from 'react-select';
import Picker from 'react-mobile-picker-scroll';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

import statedata from "../data/pm25_facility_state_sum_fullname.csv";
import statejson from "../data/gz_2010_us_040_00_500k.json"



@observer
class MapView extends React.Component {
  componentDidMount() {

  }

  constructor(props) {
    super(props);
    // this.state = {
    //   year: 1999,
    //   statecode:'Alabama'
    // }
   
  
  }

  @observable year = '1999'
  @observable statecode = 'Alabama'
  @observable lineoption 

  // state = {
  //   selectedOption: null,
  // };



  //Width and height of map

  //  @observable json 

  handleChange = selectedOption => {
    this.props.setstatecode (selectedOption.value) 
    this.statecode = selectedOption.value
    this.deathGeoJson()
    // this.updateMap()
    // console.log(this.json)
    // console.log(`Option selected:`, selectedOption);
  };

  yearChange = (name, value) => {
    this.props.setyear(value) 
    this.year = value
    this.deathGeoJson()
  }

  width = 860;
  height = 450;
  selectoptions = [
    { value: 'Alabama', label: 'Alabama' },
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Arizona', label: 'Arizona' },
  ];

  yearoptions = { year: d3.range(1999, 2021, 1) }

  // D3 Projection

  projection = geoAlbersUsa()
    .translate([this.width / 2, this.height / 2])    // translate to center of screen
    .scale([1000]);          // scale things down so see entire US

  // Define path generator
  path = geoPath()               // path generator that will convert GeoJSON to SVG paths
    .projection(this.projection);  // tell path generator to use albersUsa projection


  // Define linear scale for output
  //  color = d3.scaleLinear()
  // 			  .range(['rgb(254,232,200)',"rgb(179,0,0)"]);

  color = d3.scaleSequential(interpolateOrRd)
  // .domain([0, 10000])

  legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];



  deathGeoJson() {

    d3.csv(statedata).then((data) => {




      //filter data
      var filteredData = data.filter((d) => {

        if ((d["state_zip"] == this.statecode) && (d["year"] == this.year)) {
          return d;
        }

      })

      const minco = parseFloat(d3.min(filteredData, d => d.deaths_coef_2)) - 0.1
      const maxco = parseFloat(d3.max(filteredData, d => d.deaths_coef_2)) + 0.1

      this.color.domain([minco, maxco]); // setting the range of the input data    

      var stringified = JSON.stringify(statejson);
      var json = JSON.parse(stringified);

      // Load GeoJSON data and merge with states data
      for (var i = 0; i < filteredData.length; i++) {

        // Grab State Name
        var dataState = filteredData[i].state_facility;

        // Grab data value 
        var dataValue = filteredData[i].deaths_coef_2;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.NAME;

          if (dataState == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.deaths_coef_2 = dataValue;

            // Stop looking through the JSON
            break;
          }
        }
      }


      // Bind the data to the SVG and create one path per GeoJSON feature
      const svgElement = d3.select(this.svg)
      svgElement.selectAll("path").remove()

      svgElement.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("stroke", (d)=>{
          if (d.properties.NAME === this.statecode){
            return "rgb(100,100,100)"
          }else{
            return "#fff"
          }
          
        })
        .style("stroke-width", (d)=>{
          if (d.properties.NAME === this.statecode){
            return "4"
          }else{
            return "1"
          }
        })
        .style("fill-opacity", "0.7")
        .style("fill", (d) => {

          // Get data value
          var value = d.properties.deaths_coef_2;

          if (value) {
            //If value exists…
            return this.color(parseFloat(value));
          } else {
            //If value is undefined…
            return "rgb(213,222,217)";
          }
        })
        .on("click", (d) =>{
          this.props.setstatecode(d.target.__data__.properties.NAME)
          this.statecode = d.target.__data__.properties.NAME
          this.deathGeoJson()
          this.updateLegend()
        })

        

      this.updateLegend(this.color)



    });

  }


  // create continuous color legend
  updateLegend(colorscale) {
    var legendheight = 200,
      legendwidth = 80,
      margin = { top: 10, right: 60, bottom: 10, left: 2 };

    d3.select('#legend1').selectAll("*").remove()

    var canvas = d3.select('#legend1')
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "relative")
      .append("canvas")
      .attr("height", legendheight - margin.top - margin.bottom)
      .attr("width", 1)
      .style("height", (legendheight - margin.top - margin.bottom) + "px")
      .style("width", (legendwidth - margin.left - margin.right) + "px")
      .style("border", "1px solid #000")
      .style("position", "absolute")
      .style("top", (margin.top) + "px")
      .style("left", (margin.left) + "px")
      .node();

    var ctx = canvas.getContext("2d");

    var legendscale = d3.scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());

    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    var image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(function (i) {
      var c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4 * i] = c.r;
      image.data[4 * i + 1] = c.g;
      image.data[4 * i + 2] = c.b;
      image.data[4 * i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);


    var legendaxis = d3.axisRight()
      .scale(legendscale)
      .tickSize(6)
      .ticks(8);

    var svg = d3.select('#legend1')
      .append("svg")
      .attr("height", (legendheight) + "px")
      .attr("width", (legendwidth) + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px")

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
      .call(legendaxis);
  }

  stackLine(){

    d3.csv(statedata).then((data) => {




      //filter data
      var filteredData = data.filter((d) => {

        if ((d["state_zip"] == this.statecode) ) {
          return d;
        }

      })

      const minco = parseFloat(d3.min(filteredData, d => d.deaths_coef_2)) - 0.1
      const maxco = parseFloat(d3.max(filteredData, d => d.deaths_coef_2)) + 0.1

      this.color.domain([minco, maxco]); // setting the range of the input data 

      // extract series data:
      const statenames = filteredData.map(d=>{
        return d.state_facility
      })

      function onlyUnique(value, index, self){
        return self.indexOf(value) === index;
      }

      const unistate = statenames.filter(onlyUnique)

      var seriesdata = []

      unistate.forEach((state)=>{
        var statefrom = filteredData.filter((d) => {

          if ((d["state_facility"] == state) ) {
            return d;
          }
  
        })

        statefrom.sort(function(first, second) {
          return parseInt(first.year) - parseInt(second.year);
         });

        var yearstatefrom = statefrom.map((d)=>{
          return parseFloat(d.deaths_coef_2)
        })

        seriesdata.push({
          
            name: state,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: this.color(parseFloat(yearstatefrom[0]))  //change later
            },
            data: yearstatefrom
          
        }) 

        


      })
      console.log(seriesdata)
      this.lineoption =   {
  
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
            
        //     label: {
        //       backgroundColor: '#6a7985'
        //     }
        //   }
        // },
        // legend: {
        //   data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        // },
        
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
             axisPointer: {
            value: this.props.year,
            snap: true,
            lineStyle: {
              color: 'rgb(100,100,100)',
              width: 3
            },
            label: {
              show: false,
              formatter:  (params) =>{
                console.log(params.value)
                if(params.value !== this.year){
                  // ...
                  this.year = params.value
                  // this.props.setyear(params.value)
                  //...
                }
                return null;
              }
              
            },
            handle: {
              show: true,
              color: 'rgb(100,100,100)',
              size: 0, 
            }
          },
            boundaryGap: false,
            data: d3.range(1999, 2021, 1) 
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesdata
      };

      
      // var chartDom = document.getElementById('linestack');
      // var myChart = echarts.init(document.getElementById('main'));
      var myChart = echarts.init(this.div, null, {
        width: 2000,
        height: 350
      });
      // window.onresize = function() {
      //   myChart.resize();
      // };
      myChart.setOption(this.lineoption);

    })

     
    
  }


  render() {
    // const {year, statecode} = this.state;
    // this.deathGeoJson()
    this.stackLine()
    d3.csv(statedata).then((data) => {
      
    })
    return (
      <div>
        <svg
          width={this.width}
          height={this.height}
          className="mapview"
          ref={input => (this.svg = input)}
        // ref = {ref}
        >

      

        </svg>
        <div id="legend1" style={{ display: 'inline-block' }} ></div>
        {/* <Select
          value={this.statecode}
          onChange={this.handleChange}
          options={this.selectoptions}
        /> */}
        <Picker
        // width={50}
        style={{ width: '150px' , transform: 'translate(50px, -300px)'}}
          optionGroups={this.yearoptions}
          valueGroups={{ year: this.year }}
          onChange={this.yearChange}
          itemHeight = {50}
        />
         
         <div id="linestack" width={800}
          height={300} style={{ display: 'block' }}  ref={input => (this.div = input)}></div>
          {/* {this.stackLine()} */}
          {/* {this.lineoption && <ReactECharts option={this.lineoption} />} */}
      </div>

    )
  }

}

export default MapView;