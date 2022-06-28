

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
import facility_line_data from "../data/facility_to_state_year.csv"
import stateselectdata from "../data/state_to_state_sum_all_fullname.csv";
import stackdata from "../data/facility_to_state_year_sum2_fullname.csv";
import facility_shut from "../data/facility_shut_count.csv"
import facility_scrub from "../data/facility_scrubbed_count.csv"
import statestack from "../data/pm25_facility_state_sum_fullname.csv"



@observer
class DotMapViewCombine extends React.Component {

  componentDidMount() {
    this.deathGeoJson()

    // this.facilityLine(this.FACID)
    this.myChart = echarts.init(this.div.current, null, { renderer: 'svg' });
    window.onresize = () => {
      this.myChart.resize();

    };

    this.prepMark()
  }

  componentDidUpdate(prevProps) {
    // this.deathGeoJson()

    // this.facilityLine(this.FACID)
  }


  constructor(props) {
    super(props);
    this.FACID = 3
    this.statecode = null
    this.svg = React.createRef();
    this.div = React.createRef();
    this.checkbox = React.createRef();
    // this.isChecked=true,

    // this.state = {
    //   year: 1999,
    //   statecode:'Alabama'
    // }


  }

  @observable year = '1999'
  // @observable statecode = 'Alabama'
  @observable lineoption

  // state = {
  //   selectedOption: null,
  // };



  //Width and height of map

  //  @observable json 

  handleChange = selectedOption => {
    this.FACID = null
    this.props.setstatecode(selectedOption.value)
    this.statecode = selectedOption.value
    // this.deathGeoJson()
    this.stateSelect()
    this.stackLine({data:[]})
    this.checkbox.current.checked = true 


  };



  // yearChange = (name, value) => {
  //   this.props.setyear(value)
  //   this.year = value
  //   this.deathGeoJson()
  // }

  width = 860;
  height = 450;
  selectoptions = [{ 'value': 'Alabama', 'label': 'Alabama' }, { 'value': 'Alaska', 'label': 'Alaska' }, { 'value': 'Arizona', 'label': 'Arizona' }, { 'value': 'Arkansas', 'label': 'Arkansas' }, { 'value': 'California', 'label': 'California' }, { 'value': 'Colorado', 'label': 'Colorado' }, { 'value': 'Connecticut', 'label': 'Connecticut' }, { 'value': 'Delaware', 'label': 'Delaware' }, { 'value': 'Florida', 'label': 'Florida' }, { 'value': 'Georgia', 'label': 'Georgia' }, { 'value': 'Hawaii', 'label': 'Hawaii' }, { 'value': 'Idaho', 'label': 'Idaho' }, { 'value': 'Illinois', 'label': 'Illinois' }, { 'value': 'Indiana', 'label': 'Indiana' }, { 'value': 'Iowa', 'label': 'Iowa' }, { 'value': 'Kansas', 'label': 'Kansas' }, { 'value': 'Kentucky', 'label': 'Kentucky' }, { 'value': 'Louisiana', 'label': 'Louisiana' }, { 'value': 'Maine', 'label': 'Maine' }, { 'value': 'Maryland', 'label': 'Maryland' }, { 'value': 'Massachusetts', 'label': 'Massachusetts' }, { 'value': 'Michigan', 'label': 'Michigan' }, { 'value': 'Minnesota', 'label': 'Minnesota' }, { 'value': 'Mississippi', 'label': 'Mississippi' }, { 'value': 'Missouri', 'label': 'Missouri' }, { 'value': 'Montana', 'label': 'Montana' }, { 'value': 'Nebraska', 'label': 'Nebraska' }, { 'value': 'Nevada', 'label': 'Nevada' }, {
    'value':
      'New Hampshire', 'label': 'New Hampshire'
  }, { 'value': 'New Jersey', 'label': 'New Jersey' }, { 'value': 'New Mexico', 'label': 'New Mexico' }, { 'value': 'New York', 'label': 'New York' }, { 'value': 'North Carolina', 'label': 'North Carolina' }, { 'value': 'North Dakota', 'label': 'North Dakota' }, { 'value': 'Ohio', 'label': 'Ohio' }, {
    'value': 'Oklahoma',
    'label': 'Oklahoma'
  }, { 'value': 'Oregon', 'label': 'Oregon' }, { 'value': 'Palau', 'label': 'Palau' }, { 'value': 'Pennsylvania', 'label': 'Pennsylvania' }, { 'value': 'Puerto Rico', 'label': 'Puerto Rico' }, { 'value': 'Rhode Island', 'label': 'Rhode Island' }, { 'value': 'South Carolina', 'label': 'South Carolina' }, { 'value': 'South Dakota', 'label': 'South Dakota' }, { 'value': 'Tennessee', 'label': 'Tennessee' }, { 'value': 'Texas', 'label': 'Texas' }, { 'value': 'Utah', 'label': 'Utah' }, { 'value': 'Vermont', 'label': 'Vermont' }, { 'value': 'Virgin Island', 'label': 'Virgin Island' }, { 'value': 'Virginia', 'label': 'Virginia' }, { 'value': 'Washington', 'label': 'Washington' }, { 'value': 'West Virginia', 'label': 'West Virginia' }, { 'value': 'Wisconsin', 'label': 'Wisconsin' }, { 'value': 'Wyoming', 'label': 'Wyoming' }];


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


  toggle = event => {
    // this.isChecked= event.target.checked


    if (event.target.checked) {
      if(this.FACID){
        this.lineoption.yAxis[0] = {
          type: 'value',
          max: 2000
        }
      }else if (this.statecode){
        this.lineoption.yAxis[0] = {
          type: 'value',
          max: 6000
        }
      }
      
      this.myChart.setOption(this.lineoption);
    } else {
      this.lineoption.yAxis[0] = {
        type: 'value',
        max: null
      }

      this.myChart.setOption(this.lineoption);

    }


    // console.log(event.target.checked)
  }


  prepMark() {
    d3.csv(facility_shut).then((shutdata) => {

      var shutfilteredData = shutdata.filter((d) => {

        if ((d["FacID"] == this.FACID && d.year_shut >=1999 && d.year_shut <=2020)) {
          return d;
        }

      })
      var marklist = []
      shutfilteredData.forEach((sd) => {
        // if (sd.year_shut > 2020 || sd.year_shut <1999) continue;

        var text = sd.uID.toString() + " unit retired"
        
        marklist.push(
          {
            coord: [parseInt(sd.year_shut).toString(), 0],
            label: {
              show: true,
              fontSize: 10,
              color: "rgba(217, 41, 41, 1)",
              rotate: -90,
              offset: [25, 5],
              formatter: text
            }

          }
        )
      })


      d3.csv(facility_scrub).then((scrubdata) => {

        var scrubfilteredData = scrubdata.filter((d) => {

          if ((d["FacID"] == this.FACID && d.year_scrubbed >=1999 && d.year_scrubbed <=2020)) {
            return d;
          }

        })

        scrubfilteredData.forEach((sd) => {
          var text =  "Scrubber installed\non " + sd.uID.toString() + " unit"
          marklist.push(
            {
              coord: [parseInt(sd.year_scrubbed).toString(), 0],
              label: {
                show: true,
                fontSize: 10,
                color: "rgba(37, 213, 40, 1)",
                rotate: -90,
                offset: [38, -5],
                formatter: text
              }

            }
          )
        })

        var markDict = {
          symbolSize: 40,
          //   symbol:'circle',
          //  symbolOffset:[-10,20],
          itemStyle: {
            color: "#fef0d9"
          },
          symbolRotate: 180,
          symbolOffset: [0, 20],
          data: marklist
        }
        console.log(markDict)


        this.stackLine(markDict)

      })


    })
  }

  stackLine(markDict) {
    console.log(markDict)

    if(this.FACID){
      d3.csv(stackdata).then((data) => {




        //filter data
        var filteredData = data.filter((d) => {
  
          if ((d["FacID"] == this.FACID)) {
            return d;
          }
  
        })
  
  
  
        const minco = parseFloat(d3.min(filteredData, d => parseFloat(d.deaths_coef_2))) - 0.1
        const maxco = parseFloat(d3.max(filteredData, d => parseFloat(d.deaths_coef_2))) + 0.1
  
        this.color.domain([0, maxco]); // setting the range of the input data 
  
        // extract series data:
        const statenames = filteredData.map(d => {
          return d.state_zip
        })
  
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
  
        const unistate = statenames.filter(onlyUnique)
  
        var seriesdata = []
  
        unistate.forEach((state) => {
          var stateto = filteredData.filter((d) => {
  
            if ((d["state_zip"] == state)) {
              return d;
            }
  
          })
  
          stateto.sort(function (first, second) {
            return parseInt(first.year) - parseInt(second.year);
          });
  
          var yearstateto = stateto.map((d) => {
            return parseFloat(d.deaths_coef_2)
          })
  
          seriesdata.push({
  
            name: state,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            
            itemStyle: {
              color: this.color(parseFloat(yearstateto[0]))  //change later
            },
            data: yearstateto,
            sum: d3.sum(yearstateto)
  
  
          })
  
  
  
  
        })
        // console.log(seriesdata)
        seriesdata.sort(function (first, second) {
          return parseFloat(second.sum) - parseFloat(first.sum);
        });
  
        var legenddata = seriesdata.map((d) => {
          return d.name
        })
  
        if (seriesdata.length > 0) {
          seriesdata[0].markPoint = markDict
        }
  
  
  
        this.lineoption = {
  
          // tooltip: {
          //   trigger: 'axis',
          //   // textStyle:{fontSize : 5},
          //   // formatter: (params)=>{
          //   //   return params.sum
          //   // },
          //   padding: 2,
          //   position: [10, 10],
          //   axisPointer: {
          //     type: 'none',
          //     label: {
          //       backgroundColor: '#6a7985'
          //     }
          //   }
          // },
          // title: {
          //   text: 'Statewide deaths associated\nwith emissions from No.' + this.FACID + ' facility',
          //   left: 'left'
          // },
          legend: {
            orient: 'vertical',
            left: 'right',
            type: 'scroll',//does not work
            height: 366,
            formatter: name => {
              var series = this.myChart.getOption().series;
              var value = series.filter(row => row.name === name)[0].sum
              if(value >10){
                return name + '    ' + Math.ceil(value / 10) * 10;
              }else{
                return name + '    <10' ;
              }
              
            },
            data: legenddata
          },
  
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
            bottom: '30%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              // axisLabel:{interval:0,
              //   // fontSize: 
              // }  ,
              // axisPointer: {
              //   value: this.props.year,
              //   snap: true,
              //   lineStyle: {
              //     color: 'rgb(100,100,100)',
              //     width: 3
              //   },
              //   label: {
              //     show: false,
              //     formatter: (params) => {
              //       console.log(params.value)
              //       if (params.value !== this.year) {
              //         // ...
              //         this.year = params.value
              //         // this.props.setyear(params.value)
              //         //...
              //       }
              //       return null;
              //     }
  
              //   },
              //   handle: {
              //     show: false,
              //     color: 'rgb(100,100,100)',
              //     size: 20,
              //   }
              // },
              boundaryGap: false,
              data: d3.range(1999, 2021, 1)
            }
          ],
          yAxis: [
            {
              type: 'value',
              max: 2000
            }
          ],
          series: seriesdata
  
        };
  
  
        // var chartDom = document.getElementById('linestack');
        // var myChart = echarts.init(chartDom);
        // myChart.setOption(this.lineoption);
  
        // var chartDom = document.getElementById('linestack2');
  
        this.myChart.setOption(this.lineoption, {
          notMerge: true
         
      });
  
      this.ltitle.innerText = 'No.' + this.FACID.toString() + ' facility'
      })
      
      
    }else if(this.statecode){
      d3.csv(statestack).then((data) => {




        //filter data
        var filteredData = data.filter((d) => {
  
          if ((d["state_facility"] == this.statecode)) {
            return d;
          }
  
        })
  
  
  
        const minco = parseFloat(d3.min(filteredData, d => parseFloat(d.deaths_coef_2))) - 0.1
        const maxco = parseFloat(d3.max(filteredData, d => parseFloat(d.deaths_coef_2))) + 0.1
  
        this.color.domain([0, maxco]); // setting the range of the input data 
  
        // extract series data:
        const statenames = filteredData.map(d => {
          return d.state_zip
        })
  
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
  
        const unistate = statenames.filter(onlyUnique)
  
        var seriesdata = []
  
        unistate.forEach((state) => {
          var stateto = filteredData.filter((d) => {
  
            if ((d["state_zip"] == state)) {
              return d;
            }
  
          })
  
          stateto.sort(function (first, second) {
            return parseInt(first.year) - parseInt(second.year);
          });
  
          var yearstateto = stateto.map((d) => {
            return parseFloat(d.deaths_coef_2)
          })
  
          seriesdata.push({
  
            name: state,
            type: 'line',
            stack: 'Total',
            areaStyle: {},
           
            itemStyle: {
              color: this.color(parseFloat(yearstateto[0]))  //change later
            },
            data: yearstateto,
            sum: d3.sum(yearstateto)
  
  
          })
  
  
  
  
        })
        // console.log(seriesdata)
        seriesdata.sort(function (first, second) {
          return parseFloat(second.sum) - parseFloat(first.sum);
        });
  
        var legenddata = seriesdata.map((d) => {
          return d.name
        })
  
        if (seriesdata.length > 0) {
          seriesdata[0].markPoint = markDict
        }
  
  
  
        this.lineoption = {
  
          // tooltip: {
          //   trigger: 'axis',
          //   // textStyle:{fontSize : 5},
          //   // formatter: (params)=>{
          //   //   return params.sum
          //   // },
          //   padding: 2,
          //   position: [10, 10],
          //   axisPointer: {
          //     type: 'none',
          //     label: {
          //       backgroundColor: '#6a7985'
          //     }
          //   }
          // },
          // title: {
          //   text: 'Statewide deaths associated with emissions from ' + this.statecode,
          //   left: 'left'
          // },
          legend: {
            orient: 'vertical',
            left: 'right',
            type: 'scroll',//does not work
            height: 366,
            formatter: name => {
              var series = this.myChart.getOption().series;
              var value = series.filter(row => row.name === name)[0].sum
              if(value >10){
                return name + '    ' + Math.ceil(value / 10) * 10;
              }else{
                return name + '    <10' ;
              }
            },
            data: legenddata
          },
  
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
            bottom: '15%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              // axisLabel:{interval:0,
              //   // fontSize: 
              // }  ,
              // axisPointer: {
              //   value: this.props.year,
              //   snap: true,
              //   lineStyle: {
              //     color: 'rgb(100,100,100)',
              //     width: 3
              //   },
              //   label: {
              //     show: false,
              //     formatter: (params) => {
              //       console.log(params.value)
              //       if (params.value !== this.year) {
              //         // ...
              //         this.year = params.value
              //         // this.props.setyear(params.value)
              //         //...
              //       }
              //       return null;
              //     }
  
              //   },
              //   handle: {
              //     show: false,
              //     color: 'rgb(100,100,100)',
              //     size: 20,
              //   }
              // },
              boundaryGap: false,
              data: d3.range(1999, 2021, 1)
            }
          ],
          yAxis: [
            {
              type: 'value',
              max: 6000
            }
          ],
          series: seriesdata
  
        };
  
  
        // var chartDom = document.getElementById('linestack');
        // var myChart = echarts.init(chartDom);
        // myChart.setOption(this.lineoption);
  
        // var chartDom = document.getElementById('linestack2');
  
        this.myChart.setOption(this.lineoption,{
          notMerge: true
         
      });
  
      this.ltitle.innerText = this.statecode
  
      })
      
  
    }

    


  }

  stateSelect() {
    d3.csv(stateselectdata).then((data) => {
      var self = this;




      //filter data



      var filteredData = data.filter((d) => {

        if (d["state_facility"] == this.statecode) {
          return d;
        }

      })

      var targetFilteredData = data.filter((d) => {

        if (d["state_zip"] == this.statecode) {
          return d;
        }

      })




      const minco1 = d3.min(filteredData, d => parseFloat(d.deaths_coef_2))
      const maxco1 = d3.max(filteredData, d => parseFloat(d.deaths_coef_2))

      const minco2 = d3.min(targetFilteredData, d => parseFloat(d.deaths_coef_2))
      const maxco2 = d3.max(targetFilteredData, d => parseFloat(d.deaths_coef_2))

      const minco = Math.min(minco1, minco2)
      const maxco = Math.max(maxco1, maxco2)

      this.color.domain([0, maxco]); // setting the range of the input data    

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

      const svgElement = d3.select(this.svg.current)
      svgElement.append("g").attr("id", "statepath")
      svgElement.select("#statepath").selectAll("path").remove()

      svgElement.select("#statepath").selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("stroke", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "rgb(100,100,100)"
          } else {
            return "#fff"
          }

        })
        .style("stroke-width", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "4"
          } else {
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
        .on("click", (d) => {
          // this.props.setstatecode(d.target.__data__.properties.NAME)
          // this.statecode = d.target.__data__.properties.NAME
          // this.deathGeoJson()
          // this.updateLegend()

        })

      // update target map

      var targetjson = JSON.parse(stringified);

      // Load GeoJSON data and merge with states data
      for (var i = 0; i < targetFilteredData.length; i++) {

        // Grab State Name
        var dataState = targetFilteredData[i].state_facility;

        // Grab data value 
        var dataValue = targetFilteredData[i].deaths_coef_2;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < targetjson.features.length; j++) {
          var targetjsonState = targetjson.features[j].properties.NAME;

          if (dataState === targetjsonState) {

            // Copy the data value into the JSON
            targetjson.features[j].properties.deaths_coef_2 = dataValue;

            // Stop looking through the JSON
            break;
          }
        }
      }



      // Bind the data to the SVG and create one path per GeoJSON feature

      const targetsvgElement = d3.select(this.targetsvg)
      targetsvgElement.append("g").attr("id", "tstatepath")
      targetsvgElement.select("#tstatepath").selectAll("path").remove()

      targetsvgElement.select("#tstatepath").selectAll("path")
        .data(targetjson.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("stroke", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "rgb(100,100,100)"
          } else {
            return "#fff"
          }

        })
        .style("stroke-width", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "4"
          } else {
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
        .on("click", (d) => {

        })

        targetsvgElement.select("#statefromtext").remove()

      targetsvgElement.select("#statefromtext").append("text")
        .attr("x", '55vw')
        .attr("y", '40vh')
        .attr("dy", ".35em")
        .style('font-size', '50px')
        .text((d) => { return 'Death in ' + this.statecode + ' caused by other states.'; });

      this.sspan.innerText = this.statecode



      d3.selectAll("circle").style("fill", d => {
        if (d.state_facility === this.statecode) {
          return "#abd9e9"
        } else {
          return "rgb(217,91,67)"
        }


      }
      )
      this.updateLegend(this.color)

    })


  }

  deathGeoJson() {


    d3.csv(statedata).then((data) => {
      var self = this;




      //filter data

      var filteredData = data.filter((d) => {

        if (parseInt(d["FacID"]) == this.FACID) {
          return d;
        }

      })



      const minco = d3.min(filteredData, d => parseFloat(d.deaths_coef_2))
      const maxco = d3.max(filteredData, d => parseFloat(d.deaths_coef_2))

      this.color.domain([0, maxco]); // setting the range of the input data    

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

      const svgElement = d3.select(this.svg.current)
      svgElement.append("g").attr("id", "statepath")
      svgElement.select("#statepath").selectAll("path").remove()

      svgElement.select("#statepath").selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("stroke", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "rgb(100,100,100)"
          } else {
            return "#fff"
          }

        })
        .style("stroke-width", (d) => {
          if (d.properties.NAME === this.statecode) {
            return "4"
          } else {
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
        .on("click", (d) => {
          // this.props.setstatecode(d.target.__data__.properties.NAME)
          // this.statecode = d.target.__data__.properties.NAME
          // this.deathGeoJson()
          // this.updateLegend()

        })

      this.sspan.innerText = 'No.' + this.FACID.toString() + ' facility'

      // svgElement.append("text")
      // .attr("x", '60vw' )
      // .attr("y", '40vh')
      // .attr("dy", ".35em")
      // .style('font-size', '50px')
      // .text((d) =>{ return 'Death in ' + this.statecode + 'caused by other states.'; });







      data.sort(function (a, b) {
        return parseFloat(b["deaths_coef_2_all"]) - parseFloat(a["deaths_coef_2_all"]);
      });
      var rratio = 800
      var rMaxSize = data[0].deaths_coef_2_all/rratio

      svgElement.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return self.projection([d.lon, d.lat])[0];
        })
        .attr("cy", function (d) {
          return self.projection([d.lon, d.lat])[1];
        })
        .attr("r", function (d) {
          return d.deaths_coef_2_all / rratio;
        })
        .style("stroke", "gray")
        .style("fill", d =>{
          if(parseInt(d["FacID"])  === this.FACID){
           return "#abd9e9"
          }else{
            return "rgb(217,91,67)"
          }
        })
        .style("opacity", 0.85)

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("click", function (d) {
          //remove target map 
          const targetsvgElement = d3.select(self.targetsvg)
          // targetsvgElement.append("g").attr("id", "tstatepath")
          targetsvgElement.select("#tstatepath").selectAll("path").remove()

          self.FACID = parseInt(d.target.__data__.FacID)

          self.statecode = null
          d3.selectAll("circle").style("fill", "rgb(217,91,67)")
          d3.select(this).style("fill", "#abd9e9")
          // self.facilityLine(self.FACID)
          // self.props.setFACID(parseInt(d.target.__data__.FacID))
          self.deathGeoJson()
          self.prepMark()
          self.checkbox.current.checked = true 
          // self.updateLegend()


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


      //////////////////////read ftostate data


      // The scale you use for bubble size
     
      var rsize = d3.scaleSqrt()
        .domain([0,rMaxSize ])  // What's in the data, let's say it is percentage
        .range([0, rMaxSize])  // Size in pixel

      // Add legend: circles
      var valuesToShow = [parseInt(rMaxSize),parseInt(2*rMaxSize/3), parseInt(rMaxSize/3)]
      var xCircle = 780
      var xLabel = 810
      var yCircle = 350
      svgElement
        .selectAll("clegend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return yCircle - rsize(d) })
        .attr("r", function (d) { return rsize(d) })
        .style("fill", "rgb(217,91,67)")
        .attr("stroke", "black")

      // Add legend: segments
      svgElement
        .selectAll("clegend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle  })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return yCircle - 2*rsize(d) })
        .attr('y2', function (d) { return yCircle - 2*rsize(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

      // Add legend: labels
      svgElement
        .selectAll("clegend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return yCircle - 2*rsize(d) })
        .text(function (d) { return d*rratio })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')





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
      height = 200 - margin.top - margin.bottom;

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

        if (parseInt(d["FacID"]) === FACID) {
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
        .domain([0, maxf])
        .range([height, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      // Show confidence interval
      // svg.append("path")
      //   .datum()
      console.log(minf, maxf)
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

      <div>
        <div class="column" >
          <div
            style={{ width: '50vw', }}>
            <Select
              noOptionsMessage={() => 'Select a state to show...'}
              value={this.statecode}
              onChange={this.handleChange}
              options={this.selectoptions}
            />
            {this.FACID ? <h1>Deaths associated with emissions from <span style={{ color: '#db4e3e' }} ref={input => (this.sspan = input)}>{'No.' + this.FACID.toString() + ' facility'}</span> </h1>
              : <h1>Deaths associated with emissions from <span style={{ color: '#db4e3e' }} ref={input => (this.sspan = input)}>{this.statecode}</span> state </h1>
            }

            <svg
              // width={this.width}
              // height={this.height}
              className="dotmapview"
              viewBox="0 0 1000 500"
              style={{ position: 'absolute', top: '15vh', left: '2vw', width: '50vw', height: 'auto' }}

              ref={this.svg}
            // ref = {ref}
            >



            </svg>
            {/* <h2>Death in <span style={{ color:'blue' }} ref={input => (this.tspan = input)}>{this.statecode}</span> caused by other states</h2> */}

            <svg
              // width={this.width}
              // height={this.height}
              className="mapview"
              id='map'
              // preserveAspectRatio ="xMinYMin meet"
              viewBox="0 0 2000 500"
              style={{ position: 'absolute', top: '70vh', left: '2vw', width: '50vw', height: 'auto' }}
              ref={input => (this.targetsvg = input)}
            // ref = {ref}
            >



            </svg>
            <div id="facilityline" style={{ width: '50vw', height: '20vh', display: 'block' }} >



              <svg
                // width={800}
                // height={600}
                // className="facilityline"
                viewBox="0 0 1000 500"
                style={{ position: 'absolute', top: '80vh', left: '50vw', width: '50vw', height: 'auto' }}
                ref={input => (this.flsvg = input)}

              ></svg>
            </div>




          </div>
          {/* <DotMapViewCombine year = {this.year} statecode = {this.statecode} setFACID={FACID => this.setFACID(FACID)} setstatecode={statecode => this.setstatecode(statecode)}/> */}
          {/* <MapView year = {this.year} statecode = {this.statecode} setyear={year => this.setyear(year)} setstatecode={statecode => this.setstatecode(statecode)}/> */}

        </div>
        <div id="legend2" style={{ display: 'inline-block', position: 'absolute', top: '55vh', left: '40vw' }} ></div>
        
        <div class="column"  >
        
        {this.FACID ? <h1>Statewide deaths associated with emissions from <span style={{ color: '#db4e3e' }} ref={input => (this.ltitle = input)}>{' No.' + this.FACID.toString() + ' facility'}</span> </h1>
              : <h1>Statewide deaths associated with emissions from  <span style={{ color: '#db4e3e' }} ref={input => (this.ltitle = input)}>{this.statecode}</span>  </h1>
            }
          <div key={this.FACID} style={{ width: 'auto', height: '95vh', display: 'block' }} ref={this.div}>
            <div style={{ position: "relative", float: "left", left: "36vw" }}>
              <span style={{ color: '#f1aca5', position: 'relative', top: '5px', right: '10px', fontSize: '15px' }}>consistent scale</span>
              <label class="switch" >
                <input type="checkbox" onChange={this.toggle} defaultChecked={true} ref={this.checkbox} />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          {/* <StackLine FACID={this.state.FACID} /> */}
        </div>
      </div>

    )
  }

}

export default DotMapViewCombine;