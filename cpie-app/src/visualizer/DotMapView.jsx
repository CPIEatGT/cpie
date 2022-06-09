

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

import statedata from "../data/facility_to_state_sum_all_fullname.csv";
import statejson from "../data/gz_2010_us_040_00_500k.json"
import facility_to_sate from "../data/facility_to_state_sum_all.csv"
import facility_line_data from "../data/facility_to_state_year.csv"



@observer
class DotMapView extends React.Component {

  componentDidMount() {
    this.deathGeoJson()
    
    this.facilityLine(this.FACID)
   }
 

  constructor(props) {
    super(props);
    this.FACID = 3
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
    this.props.setstatecode(selectedOption.value)
    this.statecode = selectedOption.value
    this.deathGeoJson()
    // this.updateMap()
    
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

  // legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];



  deathGeoJson() {


    d3.csv(statedata).then((data) => {
      var self = this;




      //filter data
      var filteredData = data.filter((d) => {

        if ( parseInt(d["FacID"]) == this.FACID ) {
          return d;
        }

      })

      const minco = d3.min(filteredData, d => parseFloat(d.deaths_coef_2)) 
      const maxco = d3.max(filteredData, d => parseFloat(d.deaths_coef_2)) 

      this.color.domain([minco, maxco]); // setting the range of the input data    

      var stringified = JSON.stringify(statejson);
      var json = JSON.parse(stringified);

      // Load GeoJSON data and merge with states data
      for (var i = 0; i < filteredData.length; i++) {

        // Grab State Name
        var dataState = filteredData[i].state_zip;

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
      svgElement.append("g").attr("id", "statepath")
      svgElement.select("#statepath").selectAll("path").remove()

      svgElement.select("#statepath").selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("stroke","#fff")
        .style("stroke-width", '1')
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
        .on("click", (d) => {
          // this.props.setstatecode(d.target.__data__.properties.NAME)
          // this.statecode = d.target.__data__.properties.NAME
          
        })

      

      d3.csv(facility_to_sate).then((f2sdata) => {


      
        f2sdata.sort(function(a, b){
            return parseFloat(b["deaths_coef_2_all"])-parseFloat(a["deaths_coef_2_all"]);
        });

        svgElement.selectAll("circle")
          .data(f2sdata)
          .enter()
          .append("circle")
          .attr("cx", function (d) {
            return self.projection([d.lon, d.lat])[0];
          })
          .attr("cy", function (d) {
            return self.projection([d.lon, d.lat])[1];
          })
          .attr("r", function (d) {
            return d.deaths_coef_2_all / 800;
          })
          .style("stroke", "gray")
          .style("fill", "rgb(217,91,67)")
          .style("opacity", 0.85)

          // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
          // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
          .on("click", function(d){
            self.FACID = parseInt(d.target.__data__.FacID)
            d3.selectAll("circle").style("fill","rgb(217,91,67)" )
            d3.select(this).style("fill", "#abd9e9")
            self.facilityLine(self.FACID)
            self.deathGeoJson()
            self.updateLegend()
            
            
            //update 
            // div.transition()        
            //      .duration(200)      
            //      .style("opacity", .9);      
            //      div.text(d.place)
            //      .style("left", (d3.event.pageX) + "px")     
            //      .style("top", (d3.event.pageY - 28) + "px");    
          })

          // // fade out tooltip on mouse out               
          // .on("mouseout", function (d) {
          //   // div.transition()        
          //   //    .duration(500)      
          //   //    .style("opacity", 0);   
          // });
      })




      this.updateLegend(this.color)



    });

  }


  // create continuous color legend
  updateLegend(colorscale) {
    var legendheight = 200,
      legendwidth = 80,
      margin = { top: 10, right: 60, bottom: 10, left: 2 };

    d3.select('#legend2').selectAll("*").remove()

    var canvas = d3.select('#legend2')
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "absolute")
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

    var svg = d3.select('#legend2')
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

  facilityLine(FACID) {
    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 30, bottom: 30, left: 100 },
      width = 900 - margin.left - margin.right,
      height = 370 - margin.top - margin.bottom;
    
    // d3.select('#facilityline').selectAll("*").remove()

    // append the svg object to the body of the page

    const svgp = d3.select(this.flsvg)

    
   

    svgp.selectAll("*").remove()

    const svg = svgp.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    
    // svgElement.selectAll("circle")
    //       .data(f2sdata)
    //       .enter()
    //       .append("circle")
    //       .attr("cx", 

    


    // var svg = d3.select("#facilityline")
    //   .append("svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform",
    //     "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv(facility_line_data).then((fldata) => {

      var filteredData = fldata.filter((d) => {

        if ( parseInt(d["FacID"]) === FACID) {
          return d;
        }

      })

      // Add X axis --> it is a date format
      const minf = d3.min(filteredData, d => parseFloat(d.deaths_coef_1)) - 0.1
      const maxf = d3.max(filteredData, d => parseFloat(d.deaths_coef_3)) + 0.1

      var x = d3.scalePoint()
        .domain(d3.range(1999, 2021, 1))
        .range([0, width]);

        // svgElement.selectAll("path")
        // .data(json.features)
        // .enter()
        // .append("path")
        // .attr("d", this.path)
        // .style("stroke", (d) => {
        //   if (d.properties.NAME === this.statecode) {
        //     return "rgb(100,100,100)"
        //   } else {
        //     return "#fff"
        //   }

        // })

      
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([minf, maxf])
        .range([height, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      // Show confidence interval
      // svg.append("path")
      //   .datum()
      console.log(minf,maxf)
      svg.append("path")
      .datum(filteredData)
      .attr("fill", "#cce5df")
        .attr("stroke", "none")
        .attr("d", d3.area()
          .x(function (d) { return x(parseInt(d.year)) })
          .y0(function (d) { return y(parseFloat(d.deaths_coef_1)) })
          .y1(function (d) { return y(parseFloat(d.deaths_coef_3)) })
        )

      // Add the line
    
      svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function (d) { return x(parseInt(d.year)) })
          .y(function (d) { return y(parseFloat(d.deaths_coef_2)) })
        )
    })
    
  }

  render() {
    // const {year, statecode} = this.state;
    // this.deathGeoJson()
    // this.stackLine()
    
    // this.facilityLine(this.flsvg)


    return (
      <div  
      style={{width: '50vw' , }}>


        
        <svg
          // width={this.width}
          // height={this.height}
          className="dotmapview"
          viewBox =  "0 0 1000 500"
          style={{position : 'absolute',top: '8vh', left: '50vw', width: '50vw', height: 'auto'}}
         
          ref={input => (this.svg = input)}
        // ref = {ref}
        >



        </svg>
        <div id="facilityline"  style={{ width: '50vw' , height:'48vh' ,display: 'block' }} >

        
      
        <svg
          // width={800}
          // height={600}
          // className="facilityline"
          viewBox =  "0 0 1000 500"
          style={{position : 'absolute',top: '56vh', left: '50vw', width: '50vw', height: 'auto'}}
          ref={input => (this.flsvg = input)}
        
        ></svg>
        </div>
       
        <div id="legend2" style={{ display: 'inline-block' , position : 'absolute', top: '35vh', right:'10vw'}} ></div>
        {/* <Select
          value={this.statecode}
          onChange={this.handleChange}
          options={this.selectoptions}
        /> */}
        {/* <Picker
          // width={50}
          style={{ width: '150px', transform: 'translate(50px, -300px)' }}
          optionGroups={this.yearoptions}
          valueGroups={{ year: this.year }}
          onChange={this.yearChange}
          itemHeight={50}
        /> */}

        {/* <div id="linestack" width={800}
          height={300} style={{ display: 'block' }}  ref={input => (this.div = input)}></div> */}
        {/* {this.stackLine()} */}
        {/* {this.lineoption && <ReactECharts option={this.lineoption} />} */}
      </div>

    )
  }

}

export default DotMapView;