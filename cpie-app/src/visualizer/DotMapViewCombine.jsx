

// import { scaleLinear, max, axisLeft, axisBottom, select } from "d3"
import React from "react";
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import * as d3 from 'd3';
import { geoAlbersUsa, geoPath } from "d3-geo"
import { interpolateOrRd } from "d3-scale-chromatic"
import Select from 'react-select';
import Picker from 'react-mobile-picker-scroll';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import $ from 'jquery';

import statedata from "../data/newdata/facility_to_state_sum_all_fullname.csv";
import statejson from "../data/gz_2010_us_040_00_500k.json"
import facIDname from "../data/facid_name.json"
import facDict from "../data/facid_name_dict2.json"
import facility_line_data from "../data/newdata/facility_to_state_year.csv"
import stateselectdata from "../data/newdata/state_to_state_sum_all_fullname.csv";
import stackdata from "../data/newdata/facility_to_state_year_sum2_fullname.csv";
import facility_shut from "../data/new_facility_shut_count.csv"
import facility_scrub from "../data/new_facility_scrubbed_count.csv"
import statestack from "../data/newdata/pm25_facility_state_sum_fullname.csv"
import landingstate from "../data/newdata/landing_state_overall.csv"
import landingstack from "../data/newdata/landing_state_overall_year.csv"
import { timeHours } from "d3";



@observer
class DotMapViewCombine extends React.Component {

  componentDidMount() {
    // this.FacIDoptions(this)

    var fstr = JSON.stringify(facDict);
    this.fnameDict = JSON.parse(fstr)[0];


    this.myChart = echarts.init(this.div.current, null, { renderer: 'svg' });




    window.onresize = () => {
      this.myChart.resize();

    };

  
    this.landingview()
  }

  componentDidUpdate(prevProps) {
  
  }


  constructor(props) {
    super(props);
    this.FACID = null
    this.fname = 'Barry, Alabama'
    this.lastserieshover = 'undefined'
    this.statecode = null
    this.svg = React.createRef();
    this.div = React.createRef();
    this.checkbox = React.createRef();
    this.dotcheckbox = React.createRef();
    this.legendcheckbox = React.createRef();
    this.color = d3.scaleSequential(interpolateOrRd)
    this.dottooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  

  }

  @observable year = '1999'
  // @observable statecode = 'Alabama'
  @observable lineoption



  customFilter = (option, searchText) => {

    if (
      option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.value.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };



  handleChange = selectedOption => {
    $('#loading-image').show();
    this.FACID = null
    this.fname = null
    this.dotcheckbox.current.checked = false
    this.legendcheckbox.current.checked = false
    this.props.setstatecode(selectedOption.value)
    this.statecode = selectedOption.value

    // this.setState({ statedFacList:  })
    // this.deathGeoJson()
    this.stateSelect()
    this.stackLine({ data: [] })
    this.dottooltip.transition()
      .duration(500)
      .style("opacity", 0);
     

  };




  width = 860;
  height = 450;
  selectoptions = [{ 'value': 'Alabama', 'label': 'Alabama' }, { 'value': 'Alaska', 'label': 'Alaska' }, { 'value': 'Arizona', 'label': 'Arizona' }, { 'value': 'Arkansas', 'label': 'Arkansas' }, { 'value': 'California', 'label': 'California' }, { 'value': 'Colorado', 'label': 'Colorado' }, { 'value': 'Connecticut', 'label': 'Connecticut' }, { 'value': 'Delaware', 'label': 'Delaware' }, { 'value': 'Florida', 'label': 'Florida' }, { 'value': 'Georgia', 'label': 'Georgia' }, { 'value': 'Hawaii', 'label': 'Hawaii' }, { 'value': 'Idaho', 'label': 'Idaho' }, { 'value': 'Illinois', 'label': 'Illinois' }, { 'value': 'Indiana', 'label': 'Indiana' }, { 'value': 'Iowa', 'label': 'Iowa' }, { 'value': 'Kansas', 'label': 'Kansas' }, { 'value': 'Kentucky', 'label': 'Kentucky' }, { 'value': 'Louisiana', 'label': 'Louisiana' }, { 'value': 'Maine', 'label': 'Maine' }, { 'value': 'Maryland', 'label': 'Maryland' }, { 'value': 'Massachusetts', 'label': 'Massachusetts' }, { 'value': 'Michigan', 'label': 'Michigan' }, { 'value': 'Minnesota', 'label': 'Minnesota' }, { 'value': 'Mississippi', 'label': 'Mississippi' }, { 'value': 'Missouri', 'label': 'Missouri' }, { 'value': 'Montana', 'label': 'Montana' }, { 'value': 'Nebraska', 'label': 'Nebraska' }, { 'value': 'Nevada', 'label': 'Nevada' }, {
    'value':
      'New Hampshire', 'label': 'New Hampshire'
  }, { 'value': 'New Jersey', 'label': 'New Jersey' }, { 'value': 'New Mexico', 'label': 'New Mexico' }, { 'value': 'New York', 'label': 'New York' }, { 'value': 'North Carolina', 'label': 'North Carolina' }, { 'value': 'North Dakota', 'label': 'North Dakota' }, { 'value': 'Ohio', 'label': 'Ohio' }, {
    'value': 'Oklahoma',
    'label': 'Oklahoma'
  }, { 'value': 'Oregon', 'label': 'Oregon' }, { 'value': 'Palau', 'label': 'Palau' }, { 'value': 'Pennsylvania', 'label': 'Pennsylvania' }, { 'value': 'Puerto Rico', 'label': 'Puerto Rico' }, { 'value': 'Rhode Island', 'label': 'Rhode Island' }, { 'value': 'South Carolina', 'label': 'South Carolina' }, { 'value': 'South Dakota', 'label': 'South Dakota' }, { 'value': 'Tennessee', 'label': 'Tennessee' }, { 'value': 'Texas', 'label': 'Texas' }, { 'value': 'Utah', 'label': 'Utah' }, { 'value': 'Vermont', 'label': 'Vermont' }, { 'value': 'Virgin Island', 'label': 'Virgin Island' }, { 'value': 'Virginia', 'label': 'Virginia' }, { 'value': 'Washington', 'label': 'Washington' }, { 'value': 'West Virginia', 'label': 'West Virginia' }, { 'value': 'Wisconsin', 'label': 'Wisconsin' }, { 'value': 'Wyoming', 'label': 'Wyoming' }];


  FACIDhandleChange = selectedOption => {



    // $('#loading-image').show(); 
    this.statecode = null

    this.FACID = selectedOption.value[1]
   
    const targetsvgElement = d3.select(this.targetsvg)
    this.legendcheckbox.current.checked = false
    // targetsvgElement.append("g").attr("id", "tstatepath")
    targetsvgElement.select("#tstatepath").selectAll("path").remove()
    this.mtitle.innerText = ''

    this.deathGeoJson()
    this.prepMark()

    d3.selectAll("circle")
      .style("fill", d => {
        if (parseInt(d["FacID"]) === this.FACID) {
          return "#abd9e9"
        } else {
          return "rgb(217,91,67)"
        }
      })
      .style("opacity", (d) => {
        if (parseInt(d["FacID"]) === this.FACID) {
        return 0.85
      } else {
        return this.dotcheckbox.current.checked ? 0.2 : 0
      }
        })



    // self.facilityLine(self.FACID)
    // self.props.setFACID(parseInt(d.target.__data__.FacID))
   


  };

  FacIDoptions = (self) => {
    // var facidstr = JSON.stringify(facIDname);
    // var facidjson = JSON.parse(facidstr);
    // var filterfacidjson = facidjson.filter((d) => {

    //   if(d.value[0] === 'Alabama') {
    //     return d;
    //   }

    // })


  }




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


  // .domain([0, 10000])

  // legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];


  toggle = event => {
    // this.isChecked= event.target.checked


    if (event.target.checked) {
      if (this.FACID) {
        this.lineoption.yAxis[0] = {
          type: 'value',
          max: 2000
        }
      } else if (this.statecode) {
        this.lineoption.yAxis[0] = {
          type: 'value',
          max: 7000
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

  legendtoggle = event=>{
    if (event.target.checked) {
      // unselect all 
      this.myChart.dispatchAction({ type: 'legendAllSelect' })
      this.myChart.dispatchAction({ type: 'legendInverseSelect' })
      
    }else{
      //selectall 

      this.myChart.dispatchAction({ type: 'legendAllSelect' })
    }
  }

  dottoggle = event => {
    const svgElement = d3.select(this.svg.current)
    if (event.target.checked) {
      d3.selectAll("circle").style("opacity", .85)

      svgElement
        .selectAll("text")
        .style("font-size", 10)

      svgElement
        .selectAll("line")
        .style("stroke", "black")


    } else {
      d3.selectAll("circle").style("opacity", 0)
      svgElement
        .selectAll("text")
        .style("font-size", 0)

      svgElement
        .selectAll("line")
        .style("stroke", "white")
    }
  }


  prepMark() {
    d3.csv(facility_shut).then((shutdata) => {

      var sumunit = 0
      var sumshutdata = shutdata.filter((d) => {

        if ((d["FacID"] == this.FACID)) {
          return d;
        }

      })
      sumunit += sumshutdata.reduce((total, obj) => parseInt(obj.uID) + total, 0)


      var shutfilteredData = sumshutdata.filter((d) => {

        if ((d.year_shut >= 1999 && d.year_shut <= 2020)) {
          return d;
        }

      })

      var marklist = []
      shutfilteredData.forEach((sd) => {

        // if (sd.year_shut > 2020 || sd.year_shut <1999) continue;
        var text
        if (parseInt(sd.uID) > 1) {
          text = sd.uID.toString() + " units retired"
        } else {
          text = sd.uID.toString() + " unit retired"
        }



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

        var sumscrubdata = scrubdata.filter((d) => {

          if ((d["FacID"] == this.FACID)) {
            return d;
          }

        })

        sumunit += sumscrubdata.reduce((total, obj) => parseInt(obj.uID) + total, 0)

        var scrubfilteredData = sumscrubdata.filter((d) => {

          if ((d.year_scrubbed >= 1999 && d.year_scrubbed <= 2020)) {
            return d;
          }

        })

        scrubfilteredData.forEach((sd) => {


          var text
          if (parseInt(sd.uID) > 1) {
            text = "Scrubber installed\non " + sd.uID.toString() + " units"
          } else {
            text = "Scrubber installed\non " + sd.uID.toString() + " unit"
          }


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

        var markDict = [{
          symbolSize: 40,
          //   symbol:'circle',
          //  symbolOffset:[-10,20],
          itemStyle: {
            color: "#fef0d9"
          },
          symbolRotate: 180,
          symbolOffset: [0, 20],
          data: marklist
        }, {
          sum: sumunit
        }]
        // console.log(markDict)


        this.stackLine(markDict)

      })


    })
  }

  stackLine(markDict) {
    // console.log(markDict)

    if (this.FACID) {
      d3.csv(stackdata).then((data) => {




        //filter data
        var filteredData = data.filter((d) => {

          if ((d["FacID"] == this.FACID)) {
            return d;
          }

        })



        const minco = parseFloat(d3.min(filteredData, d => parseFloat(d.deaths_coef_2))) - 0.1
        const maxco = parseFloat(d3.max(filteredData, d => parseFloat(d.deaths_coef_2))) + 0.1


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
              color: this.color(d3.sum(yearstateto))
                // parseFloat(yearstateto[0]))  //change later
            },
            data: yearstateto,
            sum: d3.sum(yearstateto)


          })




        })
        // console.log(seriesdata)
        seriesdata.sort(function (first, second) {
          return parseFloat(second.sum) - parseFloat(first.sum);
        });
        // if(seriesdata[0]){
        //   this.color.domain([0, seriesdata[0].sum]);
        // }

        //  // setting the range of the input data 

        // seriesdata.forEach(sdata=>{
        //   sdata.itemStyle.color = this.color(sdata.sum)
          
        // })

        var legenddata = seriesdata.map((d) => {
          return d.name
        })

        if (seriesdata.length > 0) {
          seriesdata[0].markPoint = markDict[0]
        }

        var totalDeath = d3.sum(seriesdata.map((d) => {
          return parseFloat(d.sum)
        }))



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

          

          title:[ {
            text: markDict[1].sum > 1 ? 'Records for ' + markDict[1].sum.toString() + ' units' : 'Records for ' + markDict[1].sum.toString() + ' unit',


            textStyle: {
              fontWeight: 'normal',
              fontSize: 10,
              lineHeight: 20
            },
            right: '5%',
            top: '57%'
          },{
          text:Math.ceil( totalDeath / 10) * 10 + ' Deaths',


          textStyle: {
            fontWeight: 'normal',
            fontSize: 10,
            lineHeight: 20
          },
          right: '5%',
          top: '55%'
        }
        ],
         
          
          legend: {
            orient: 'vertical',
            left: 'right',
            type: 'scroll',//does not work
            height: 300,
            formatter: name => {
              var series = this.myChart.getOption().series;
              var value = series.filter(row => row.name === name)[0].sum
              if (value > 10) {
                return name + '    ' + Math.ceil(value / 10) * 10;
              } else {
                return name + '    <10';
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
            bottom: '35%',
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
              max: this.checkbox.current.checked ? 2000 : null
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


        this.myChart.getZr().on('mouseover', (params) => {
          // set a small delay before continuing to ensure that series highlight/emphasis-state has already taken effect within Echarts. A single tick is not enough.
          // let zrTimeout = setTimeout(() => {


          // get the polyline/polygon drawing element from the ZRender component which is servicing a series and is in emphasis/highlight state
          const seriesPolyShape = this.myChart.getZr().storage._displayList.find(d => d.currentStates[0] === "emphasis" && d.parent?.parent?.__ecComponentInfo?.mainType === "series")

          // get the series index


          var highlightedSeriesIndex
          Object.values(params.target).forEach(val => {
            if (typeof (val) === 'object' && (typeof (val['seriesIndex']) !== "undefined")) {
              highlightedSeriesIndex = val['seriesIndex']
              return
            }
          });
          // seriesPolyShape?.parent?.parent?.__ecComponentInfo?.index
          // params.target.__ec_inner_7.seriesIndex

          if ((typeof (highlightedSeriesIndex) === "undefined")) {
            this.dottooltip.transition()
              .duration(500)
              .style("opacity", 0);

            const svgElement = d3.select(this.svg.current)

            svgElement.select("#statepath").selectAll("path")
              .style("stroke",
                "#fff"


              )
              .style("stroke-width",
                "1"

              )
            return


          } else {

            this.lastserieshover = highlightedSeriesIndex

            var series = this.myChart.getOption().series;
            var sumvalue = series[highlightedSeriesIndex].sum
            var statename = series[highlightedSeriesIndex].name


            // tooltip 
            const pointInPixel = [params.offsetX, params.offsetY];
            const pointInGrid = this.myChart.convertFromPixel('grid', pointInPixel);
            this.dottooltip.transition()
              .duration(200)
              .style("opacity", .9);
            this.dottooltip.text('Associated with ' + Math.ceil(sumvalue / 10) * 10 +   ' deaths in ' + statename
            )
              .style("left", (params.offsetX * (100 / document.documentElement.clientWidth) + 50) + 'vw')
              .style("top", (params.offsetY+50) + "px");

            const svgElement = d3.select(this.svg.current)

            svgElement.select("#statepath").selectAll("path")
              .style("stroke", (d, i) => {
                if (d.properties.NAME === statename) {
                  console.log(statename)
                  console.log(d.properties.NAME)
                  return "rgb(100,100,100)"
                } else {
                  return "#fff"
                }

              })
              .style("stroke-width", (d) => {
                if (d.properties.NAME === statename) {
                  return "4"
                } else {
                  return "1"
                }
              })

          }



          // }, 5)



        })

        this.myChart.getZr().on('mouseout', (params) => {
          this.dottooltip.transition()
            .duration(500)
            .style("opacity", 0);

          const svgElement = d3.select(this.svg.current)

          svgElement.select("#statepath").selectAll("path")
            .style("stroke",
              "#fff"


            )
            .style("stroke-width",
              "1"

            )
        })

        this.ltitle.innerText = "Deaths associated with " + this.fnameDict[parseInt(this.FACID)][0] + "Facility" +"(" + this.fnameDict[parseInt(this.FACID)][1] + ")"
        // 'Statewide deaths associated with '+  this.fnameDict[parseInt(this.FACID)][0]+ ' (' + this.fnameDict[parseInt(this.FACID)][1] + ') Facility'

        // `Statewide deaths associated with emissions from <span style={{ color: '#db4e3e' }} >`+ this.fnameDict[parseInt(this.FACID)][0] + ',' + this.fnameDict[parseInt(this.FACID)][1] + ' Facility ' + `</span> `

        // this.FACID.toString() 
        $('#loading-image').hide();

      })


    } else if (this.statecode) {
      d3.csv(statestack).then((data) => {




        //filter data
        var filteredData = data.filter((d) => {

          if ((d["state_facility"] == this.statecode)) {
            return d;
          }

        })



        // const minco = parseFloat(d3.min(filteredData, d => parseFloat(d.deaths_coef_2))) - 0.1
        // const maxco = parseFloat(d3.max(filteredData, d => parseFloat(d.deaths_coef_2))) + 0.1

        // this.color.domain([0, maxco]); // setting the range of the input data 

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
              color: this.color(d3.sum(yearstateto))  //change later
            },
            data: yearstateto,
            sum: d3.sum(yearstateto)


          })




        })
        // console.log(seriesdata)
        seriesdata.sort(function (first, second) {
          return parseFloat(second.sum) - parseFloat(first.sum);
        });

        // if(seriesdata[0]){
        //   this.color.domain([0, seriesdata[0].sum]);
        // }
        // seriesdata.forEach(sdata=>{
        //   sdata.itemStyle.color = this.color(sdata.sum)
          
        // })

        var legenddata = seriesdata.map((d) => {
          return d.name
        })

        if (seriesdata.length > 0) {
          seriesdata[0].markPoint = markDict
        }
        var totalDeath = d3.sum(seriesdata.map((d) => {
          return parseFloat(d.sum)
        }))



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
          title: {
            text:Math.ceil( totalDeath / 10) * 10 + ' Deaths',
  
  
            textStyle: {
              fontWeight: 'normal',
              fontSize: 10,
              lineHeight: 20
            },
            right: '5%',
            top: '75%'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            type: 'scroll',//does not work
            height: 300,
            formatter: name => {
              var series = this.myChart.getOption().series;
              var value = series.filter(row => row.name === name)[0].sum
              if (value > 10) {
                return name + '    ' + Math.ceil(value / 10) * 10;
              } else {
                return name + '    <10';
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
              max: this.checkbox.current.checked ? 7000 : null
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

        // this.myChart.getZr().on('click', (params) => {
        //   // set a small delay before continuing to ensure that series highlight/emphasis-state has already taken effect within Echarts. A single tick is not enough.
        //   // let zrTimeout = setTimeout(() => {


        //     // get the polyline/polygon drawing element from the ZRender component which is servicing a series and is in emphasis/highlight state
        //     const seriesPolyShape = this.myChart.getZr().storage._displayList.find(d => d.currentStates[0] === "emphasis" && d.parent?.parent?.__ecComponentInfo?.mainType === "series")

        //     // get the series index


        //     var highlightedSeriesIndex =   seriesPolyShape?.parent?.parent?.__ecComponentInfo?.index
        //     // params.target.__ec_inner_7.seriesIndex

        //     if ((typeof (highlightedSeriesIndex) === "undefined") ) {
        //       this.dottooltip.transition()
        //       .duration(500)
        //       .style("opacity", 0);

        //       const svgElement = d3.select(this.svg.current)

        //       svgElement.select("#statepath").selectAll("path")
        //         .style("stroke",
        //           "#fff"


        //         )
        //         .style("stroke-width",
        //           "1"

        //         )
        //         return 


        //     }

        //     if( (highlightedSeriesIndex !== this.lastserieshover)) {

        //       this.lastserieshover = highlightedSeriesIndex

        //       var series = this.myChart.getOption().series;
        //       var sumvalue = series[highlightedSeriesIndex].sum
        //       var statename = series[highlightedSeriesIndex].name


        //       // tooltip 
        //       const pointInPixel = [params.offsetX, params.offsetY];
        //       const pointInGrid = this.myChart.convertFromPixel('grid', pointInPixel);
        //       this.dottooltip.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //       this.dottooltip.text( "Causes around" + Math.ceil(sumvalue / 10) * 10 + " deaths in " + statename )
        //         .style("left", (params.offsetX * (100 / document.documentElement.clientWidth) + 50) + 'vw' )
        //         .style("top", (params.offsetY ) + "px");

        //       const svgElement = d3.select(this.svg.current)

        //       svgElement.select("#statepath").selectAll("path")
        //         .style("stroke", (d, i) => {
        //           if (d.properties.NAME === statename) {
        //             console.log(statename)
        //             console.log(d.properties.NAME)
        //             return "rgb(100,100,100)"
        //           } else {
        //             return "#fff"
        //           }

        //         })
        //         .style("stroke-width", (d) => {
        //           if (d.properties.NAME === statename) {
        //             return "4"
        //           } else {
        //             return "1"
        //           }
        //         })




        //     }



        //   // }, 5)



        // })

        this.ltitle.innerText = 'Deaths associated with all facilities in ' + this.statecode
        // 'Statewide deaths associated with all facilities in ' +   this.statecode
        // 'Statewide deaths associated with emissions from ' + this.statecode

        // this.statecode
        $('#loading-image').hide();
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
      const g = svgElement.append("g").attr("id", "statepath")
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
      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          svgElement.select("#statepath")
            .selectAll('path') // To prevent stroke width from scaling
            .attr('transform', event.transform);
          svgElement.selectAll("circle")
            .attr('transform', event.transform);
            svgElement
            .selectAll("line")
            .attr('transform', event.transform);
            svgElement
            .selectAll("text")
            .attr('transform', event.transform);
        });

      svgElement.call(zoom);


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

      // targetsvgElement.append("text")
      //   .attr("id", "statefromtext")
      //   // .attr("x", '40vw')
      //   // .attr("y", '30vh')
      //   .attr("dy", ".35em")
      //   .style('font-size', '50px')
      //   .style("position", "absolute")
      //   .style("top",  "50vh")
      //   .style("left",  "10vw")
      //   .text((d) => { return  this.statecode + ' deaths attributable to facilities in other states'; });

      this.ltitle.innerText = 'Deaths associated with all facilities in ' + this.statecode
      // 'Statewide deaths associated with all facilities in ' +   this.statecode
      // "Statewide deaths associated with emissions from " + this.statecode
      this.mtitle.innerText =  this.statecode + " deaths associated with facilities in other states"
      // this.statecode + ' deaths attributable to facilities in other states'



      d3.selectAll("circle").style("fill", d => {
        if (d.state_facility === this.statecode) {
          return "#abd9e9"
        } else {
          return "rgb(217,91,67)"
        }


      }
      ).style("opacity", (d) =>{ 
        if (d.state_facility === this.statecode) {
          return 0.85
        } else {
          return this.dotcheckbox.current.checked ? 0.2 : 0
        }
        
      })
      if(!this.dotcheckbox.current.checked){
        svgElement
        .selectAll("text")
        .style("font-size", 0)

      svgElement
        .selectAll("line")
        .style("stroke", "white")
      }
      

      this.updateLegend(this.color)

    })


  }

  deathGeoJson() {
    $('#loading-image').show();


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
      const g = svgElement.append("g").attr("id", "statepath")
      svgElement.select("#statepath").selectAll("path").remove()
      svgElement.selectAll(".facilitydot").remove()




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

      

      this.ltitle.innerText = "Deaths associated with " + this.fnameDict[parseInt(this.FACID)][0] + " Facility" +" (" + this.fnameDict[parseInt(this.FACID)][1] + ")"
      // 'Statewide deaths associated with '+  this.fnameDict[parseInt(this.FACID)][0]+ ' (' + this.fnameDict[parseInt(this.FACID)][1] + ') Facility'

      // "Statewide deaths associated with emissions from " + this.fnameDict[parseInt(this.FACID)][0] + ', ' + this.fnameDict[parseInt(this.FACID)][1] + ' Facility '
      // this.fnameDict[parseInt(this.FACID)][0] + ',' + this.fnameDict[parseInt(this.FACID)][1] + ' Facility '

      // + this.FACID.toString() 

      // svgElement.append("text")
      // .attr("x", '60vw' )
      // .attr("y", '40vh')
      // .attr("dy", ".35em")
      // .style('font-size', '50px')
      // .text((d) =>{ return 'Death in ' + this.statecode + 'caused by other states.'; });





      var uniFilterData = [...new Map(data.map(item =>
        [item['FacID'], item])).values()]

      uniFilterData.sort(function (a, b) {
        return parseFloat(b["deaths_coef_2_all"]) - parseFloat(a["deaths_coef_2_all"]);
      });
      var rratio = 800
      var rMaxSize = uniFilterData[0].deaths_coef_2_all

      svgElement.selectAll("circle")
        .data(uniFilterData)
        .enter()
        .append("circle")
        .attr('class', 'facilitydot')
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
        .style("fill", d => {
          if (parseInt(d["FacID"]) === this.FACID) {
            return "#abd9e9"
          } else {
            return "rgb(217,91,67)"
          }
        })
        .style("opacity", (d) => {
          if (parseInt(d["FacID"]) === this.FACID) {
            return 0.85
          } else {
            return this.dotcheckbox.current.checked ? 0.2 : 0
          }
          })
        .on("mouseover", (event, d) => {
          if(this.dotcheckbox.current.checked){
            this.dottooltip.transition()
            .duration(200)
            .style("opacity", .9);
            this.dottooltip.text("Total deaths from " + this.fnameDict[parseInt(d["FacID"])][0]  + ": " + Math.ceil(d.deaths_coef_2_all / 10) * 10 )
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
          }else{
            this.dottooltip.transition()
            .duration(500)
            .style("opacity", 0);
          }
          
        })
        // fade out tooltip on mouse out               
        .on("mouseout", (d) => {
          this.dottooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("click", function (d) {
          //remove target map 
          self.legendcheckbox.current.checked = false
          const targetsvgElement = d3.select(self.targetsvg)
          // targetsvgElement.append("g").attr("id", "tstatepath")
          targetsvgElement.select("#tstatepath").selectAll("path").remove()
          self.mtitle.innerText = ''

          self.FACID = parseInt(d.target.__data__.FacID)

          self.statecode = null
          d3.selectAll("circle").style("opacity", () => self.dotcheckbox.current.checked ? 0.2 : 0).style("fill", "rgb(217,91,67)")
          d3.select(this).style("fill", "#abd9e9").style("opacity", .85)
          // zoom.scale(1)
          // self.facilityLine(self.FACID)
          // self.props.setFACID(parseInt(d.target.__data__.FacID))
          self.deathGeoJson()
          self.prepMark()

          // self.updateLegend()


          //update 
          // div.transition()        
          //      .duration(200)      
          //      .style("opacity", .9);      
          //      div.text(d.place)
          //      .style("left", (d3.event.pageX) + "px")     
          //      .style("top", (d3.event.pageY - 28) + "px");    
        })

        const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          svgElement.select("#statepath")
            .selectAll('path') // To prevent stroke width from scaling
            .attr('transform', event.transform);
          svgElement.selectAll("circle")
            .attr('transform', event.transform);
            svgElement
          .selectAll("line")
          .attr('transform', event.transform);
          svgElement
          .selectAll("text")
          .attr('transform', event.transform);
        });

      svgElement.call(zoom);

      // // fade out tooltip on mouse out               
      // .on("mouseout", function (d) {
      //   // div.transition()        
      //   //    .duration(500)      
      //   //    .style("opacity", 0);   
      // });


      //////////////////////read ftostate data


      // The scale you use for bubble size

      // var rsize = d3.scaleSqrt()
      //   .domain([0, rMaxSize])  // What's in the data, let's say it is percentage
      //   .range([0, rMaxSize])  // Size in pixel

      // Add legend: circles
      // var valuesToShow = [15000, 10000, 5000]
      // var xCircle = 780
      // var xLabel = 810
      // var yCircle = 350
      // svgElement
      //   .selectAll("clegend")
      //   .data(valuesToShow)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", xCircle)
      //   .attr("cy", function (d) { return yCircle - d/rratio })
      //   .attr("r", function (d) { return d/rratio })
      //   .style("fill", "rgb(217,91,67)")
      //   .attr("stroke", "black")

      // // Add legend: segments
      // svgElement
      //   .selectAll("clegend")
      //   .data(valuesToShow)
      //   .enter()
      //   .append("line")
      //   .attr('x1', function (d) { return xCircle })
      //   .attr("class", 'clegend_line')
      //   .attr('x2', xLabel)
      //   .attr('y1', function (d) { return yCircle - 2 * d/rratio })
      //   .attr('y2', function (d) { return yCircle - 2 * d/rratio })
      //   .attr('stroke', 'black')
      //   .style('stroke-dasharray', ('2,2'))

      // // Add legend: labels
      // svgElement
      //   .selectAll("clegend")
      //   .data(valuesToShow)
      //   .enter()
      //   .append("text")
      //   .attr("class", 'clegend_text')
      //   .attr('x', xLabel)
      //   .attr('y', function (d) { return yCircle - 2 * d/rratio })
      //   .text(function (d) { return d  })
      //   .style("font-size", 10)
      //   .attr('alignment-baseline', 'middle')





      this.updateLegend(this.color)



    });

  }

  landingview() {

    $('#loading-image').show();


    d3.csv(landingstate).then((data) => {
      var self = this;










      const minco = d3.min(data, d => parseFloat(d.deaths_coef_2_all))
      const maxco = d3.max(data, d => parseFloat(d.deaths_coef_2_all))

      this.color.domain([0, maxco]); // setting the range of the input data    

      var stringified = JSON.stringify(statejson);
      var json = JSON.parse(stringified);

      // Load GeoJSON data and merge with states data
      for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = data[i].state_zip;

        // Grab data value 
        var dataValue = data[i].deaths_coef_2_all;

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
      const g = svgElement.append("g").attr("id", "statepath")
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

      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          svgElement.select("#statepath")
            .selectAll('path') // To prevent stroke width from scaling
            .attr('transform', event.transform);
          svgElement.selectAll("circle")
            .attr('transform', event.transform);
          svgElement
          .selectAll("line")
          .attr('transform', event.transform);
          svgElement
          .selectAll("text")
          .attr('transform', event.transform);
        });

      svgElement.call(zoom);
      
      var pm25 = "2.5"
      this.ltitle.innerHTML  = "Deaths attributable to coal PM" + pm25.sub()
      // 'The overall statewide deaths'

      this.mtitle.innerText = ''


      // + this.FACID.toString() 

      // svgElement.append("text")
      // .attr("x", '60vw' )
      // .attr("y", '40vh')
      // .attr("dy", ".35em")
      // .style('font-size', '50px')
      // .text((d) =>{ return 'Death in ' + this.statecode + 'caused by other states.'; });


      d3.csv(statedata).then((circledata) => {

        var uniFilterData = [...new Map(circledata.map(item =>
          [item['FacID'], item])).values()]

        uniFilterData.sort(function (a, b) {
          return parseFloat(b["deaths_coef_2_all"]) - parseFloat(a["deaths_coef_2_all"]);
        });
        var rratio = 800
        var rMaxSize = uniFilterData[0].deaths_coef_2_all

        svgElement.selectAll("circle")
          .data(uniFilterData)
          .enter()
          .append("circle")
          .attr('class', 'facilitydot')
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
          .style("fill", d => {
            if (parseInt(d["FacID"]) === this.FACID) {
              return "#abd9e9"
            } else {
              return "rgb(217,91,67)"
            }
          })
          .style("opacity", () => this.dotcheckbox.current.checked ? 0.85 : 0)
          .on("mouseover", (event, d) => {
            this.dottooltip.transition()
              .duration(200)
              .style("opacity", .9);
          this.dottooltip.text("Total deaths from " + this.fnameDict[parseInt(d["FacID"])][0]  + ": " + Math.ceil(d.deaths_coef_2_all / 10) * 10 )
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
            
          })
          // fade out tooltip on mouse out               
          .on("mouseout", (d) => {
            this.dottooltip.transition()
              .duration(500)
              .style("opacity", 0);
          })

          // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
          // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
          .on("click", function (d) {
            //remove target map 
            self.legendcheckbox.current.checked = false
            const targetsvgElement = d3.select(self.targetsvg)
            // targetsvgElement.append("g").attr("id", "tstatepath")
            targetsvgElement.select("#tstatepath").selectAll("path").remove()
            self.mtitle.innerText = ''

            self.FACID = parseInt(d.target.__data__.FacID)

            self.statecode = null
            d3.selectAll("circle").style("opacity", () => self.dotcheckbox.current.checked ? 0.2 : 0).style("fill", "rgb(217,91,67)")
            d3.select(this).style("fill", "#abd9e9").style("opacity", .85)
            // zoom.scale(1)
            // self.facilityLine(self.FACID)
            // self.props.setFACID(parseInt(d.target.__data__.FacID))
            self.deathGeoJson()
            self.prepMark()

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

        // var rsize = d3.scaleSqrt()
        //   .domain([0, rMaxSize])  // What's in the data, let's say it is percentage
        //   .range([0, rMaxSize])  // Size in pixel

        // Add legend: circles
        var valuesToShow = [15000, 10000, 5000]
        var xCircle = 780
        var xLabel = 810
        var yCircle = 350
        svgElement
          .selectAll("clegend")
          .data(valuesToShow)
          .enter()
          .append("circle")
          .attr("cx", xCircle)
          .attr("cy", function (d) { return yCircle - d / rratio })
          .attr("r", function (d) { return d / rratio })
          .style("fill", "rgb(217,91,67)")
          .attr("stroke", "black")

        // Add legend: segments
        svgElement
          .selectAll("clegend")
          .data(valuesToShow)
          .enter()
          .append("line")
          .attr('x1', function (d) { return xCircle })
          .attr("class", 'clegend_line')
          .attr('x2', xLabel)
          .attr('y1', function (d) { return yCircle - 2 * d / rratio })
          .attr('y2', function (d) { return yCircle - 2 * d / rratio })
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))

        // Add legend: labels
        svgElement
          .selectAll("clegend")
          .data(valuesToShow)
          .enter()
          .append("text")
          .attr("class", 'clegend_text')
          .attr('x', xLabel)
          .attr('y', function (d) { return yCircle - 2 * d / rratio })
          .text(function (d) { return d })
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')

        svgElement
          .selectAll("clegend")
          .data(['Facility Deaths '])
          .enter()
          .append("text")
          .attr("class", 'clegend_text')
          .attr('x', xLabel - 50)
          .attr('y', yCircle - 70)
          .text(function (d) { return d })
          .style("font-size", 10)
          .attr('alignment-baseline', 'middle')


      })








      this.updateLegend(this.color)



    });

    d3.csv(landingstack).then((data) => {




      // //filter data
      // var filteredData = data.filter((d) => {

      //   if ((d["state_facility"] == this.statecode)) {
      //     return d;
      //   }

      // })



      // const minco = parseFloat(d3.min(data, d => parseFloat(d.deaths_coef_2_all))) - 0.1
      // const maxco = parseFloat(d3.max(data, d => parseFloat(d.deaths_coef_2_all))) + 0.1

      // this.color.domain([0, maxco]); // setting the range of the input data 

      // extract series data:
      const statenames = data.map(d => {
        return d.state_zip
      })

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      const unistate = statenames.filter(onlyUnique)

      var seriesdata = []

      unistate.forEach((state) => {
        var stateto = data.filter((d) => {

          if ((d["state_zip"] == state)) {
            return d;
          }

        })

        stateto.sort(function (first, second) {
          return parseInt(first.year) - parseInt(second.year);
        });

        var yearstateto = stateto.map((d) => {
          return parseFloat(d.deaths_coef_2_all)
        })

        seriesdata.push({

          name: state,
          type: 'line',
          stack: 'Total',
          areaStyle: {},

          itemStyle: {
            color: this.color(d3.sum(yearstateto))  //change later
          },
          data: yearstateto,
          sum: d3.sum(yearstateto)


        })




      })
      // console.log(seriesdata)
      seriesdata.sort(function (first, second) {
        return parseFloat(second.sum) - parseFloat(first.sum);
      });

      // if(seriesdata[0]){
      //   this.color.domain([0, seriesdata[0].sum]);
      // }
      //   seriesdata.forEach(sdata=>{
      //     sdata.itemStyle.color = this.color(sdata.sum)
          
      //   })

      var legenddata = seriesdata.map((d) => {
        return d.name
      })

      var totalDeath = d3.sum(seriesdata.map((d) => {
        return parseFloat(d.sum)
      }))

      // if (seriesdata.length > 0) {
      //   seriesdata[0].markPoint = markDict
      // }



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
        title: {
          text:Math.ceil( totalDeath / 10) * 10 + ' Deaths',


          textStyle: {
            fontWeight: 'normal',
            fontSize: 10,
            lineHeight: 20
          },
          right: '5%',
          top: '70%'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          type: 'scroll',//does not work
          height: 300,
          formatter: name => {
            var series = this.myChart.getOption().series;
            var value = series.filter(row => row.name === name)[0].sum
            if (value > 10) {
              return name + '    ' + Math.ceil(value / 10) * 10;
            } else {
              return name + '    <10';
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
            max: this.checkbox.current.checked ? 70000 : null
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

      this.myChart.getZr().on('mouseover', (params) => {
        // set a small delay before continuing to ensure that series highlight/emphasis-state has already taken effect within Echarts. A single tick is not enough.
        // let zrTimeout = setTimeout(() => {


        // get the polyline/polygon drawing element from the ZRender component which is servicing a series and is in emphasis/highlight state
        const seriesPolyShape = this.myChart.getZr().storage._displayList.find(d => d.currentStates[0] === "emphasis" && d.parent?.parent?.__ecComponentInfo?.mainType === "series")

        // get the series index


        var highlightedSeriesIndex
        Object.values(params.target).forEach(val => {
          if (typeof (val) === 'object' && (typeof (val['seriesIndex']) !== "undefined")) {
            highlightedSeriesIndex = val['seriesIndex']
            return
          }
        });
        // seriesPolyShape?.parent?.parent?.__ecComponentInfo?.index
        // params.target.__ec_inner_7.seriesIndex

        if ((typeof (highlightedSeriesIndex) === "undefined")) {
          this.dottooltip.transition()
            .duration(500)
            .style("opacity", 0);

          const svgElement = d3.select(this.svg.current)

          svgElement.select("#statepath").selectAll("path")
            .style("stroke",
              "#fff"


            )
            .style("stroke-width",
              "1"

            )
          return


        } else {

          this.lastserieshover = highlightedSeriesIndex

          var series = this.myChart.getOption().series;
          var sumvalue = series[highlightedSeriesIndex].sum
          var statename = series[highlightedSeriesIndex].name


          // tooltip 
          const pointInPixel = [params.offsetX, params.offsetY];
          const pointInGrid = this.myChart.convertFromPixel('grid', pointInPixel);
          this.dottooltip.transition()
            .duration(200)
            .style("opacity", .9);
          this.dottooltip.text('Associated with ' + Math.ceil(sumvalue / 10) * 10 +   ' deaths in ' + statename
            )
            .style("left", (params.offsetX * (100 / document.documentElement.clientWidth) + 50) + 'vw')
            .style("top", (params.offsetY+50) + "px");

          const svgElement = d3.select(this.svg.current)

          svgElement.select("#statepath").selectAll("path")
            .style("stroke", (d, i) => {
              if (d.properties.NAME === statename) {
                console.log(statename)
                console.log(d.properties.NAME)
                return "rgb(100,100,100)"
              } else {
                return "#fff"
              }

            })
            .style("stroke-width", (d) => {
              if (d.properties.NAME === statename) {
                return "4"
              } else {
                return "1"
              }
            })

        }



        // }, 5)



      })

      this.myChart.getZr().on('mouseout', (params) => {
        this.dottooltip.transition()
          .duration(500)
          .style("opacity", 0);

        const svgElement = d3.select(this.svg.current)

        svgElement.select("#statepath").selectAll("path")
          .style("stroke",
            "#fff"


          )
          .style("stroke-width",
            "1"

          )
      })


      var pm25 = "2.5"
      this.ltitle.innerHTML = "Deaths attributable to coal PM" + pm25.sub()
      // 'The overall statewide deaths'
      $('#loading-image').hide();
    })




  }


  // create continuous color legend
  updateLegend(colorscale) {
    var legendheight = 160,
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

    // svg
    // .selectAll("legend2_title")
    // .data(['Statewide Death Coefficient'])
    // .enter()
    // .append("text")
    // // .attr("class", 'legend_text')
    // .attr("transform", "translate(" + margin.left + "," + (margin.top ) + ")")
    // .text(function (d) { return d  })
    // .style("font-size", 10)
    // .attr('alignment-baseline', 'middle')
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

  openNav() {
    document.getElementById("mySidepanel").style.width = "300px";
  }

  closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }

  render() {
    // const {year, statecode} = this.state;
    // this.deathGeoJson()
    // this.stackLine()

    // this.facilityLine(this.flsvg)

    // function onlyUnique(value, index, self) {
    //   return self.indexOf(value) === index;
    // }

    var facidstr = JSON.stringify(facIDname);
    var facidjson = JSON.parse(facidstr);
    facidjson.sort((a, b) => (a.label > b.label) ? 1 : -1)

    // var filterfacidjson = facidjson.filter((d) => {

    //   if(d.value[0] === 'Alabama') {
    //     return d;
    //   }

    // })

    // const arrayUniqueByKey = [...new Map(facidjson.map(item =>
    //   [item['label'], item])).values()];



    console.log(facidjson)






    return (

      <div style={{  textAlign : "center"}}>
        <h1 > Coal Pollution Interactive Explorer </h1>
        <div className="centered">
        <h2 className="specific_title" style={{ visibility: "visible", marginTop:'0px'}} ref={input => (this.ltitle = input)}></h2>
      </div>

        <div class="column" >

          <div
            style={{ width: '50vw', }}>
            {/* <h2 className="specific_title" style={{ visibility: "visible" }} ref={input => (this.sspan = input)}> The overall statewide deaths </h2> */}




            <div style={{ zIndex:10000,width: '150px', height: '20px', position: 'absolute', top: '13vh', left: '35vw' }}>
              <Select
                // noOptionsMessage={() => 'Select a state to show...'}
                // LoadingMessage = {()=> 'Select a state to show...'}

                placeholder='Explore by state'
                value={this.statecode}
                onChange={this.handleChange}
                options={this.selectoptions}
                ref={input => (this.selectref0 = input)}
              />
            </div>

            {
              <div style={{ zIndex:10000, width: '150px', height: '20px', position: 'absolute', top: '13vh', left: '50vw' }}>

                <Select
                  placeholder='Explore by facility'
                  value={this.FACID}
                  onChange={this.FACIDhandleChange}
                  options={facidjson}
                  ref={input => (this.selectref = input)}
                />

              </div>}

            <div style={{ position: "relative", float: "left", left: "2vw", zIndex: 10000 }}>
              <span style={{ color: '#f1aca5', position: 'relative', top: '5px', right: '10px', fontSize: '15px' }}>show facilities</span>
              <label class="switch" >
                <input type="checkbox" onChange={this.dottoggle} defaultChecked={true} ref={this.dotcheckbox} />
                <span class="slider round"></span>
              </label>
            </div>
            <svg
              // width={this.width}
              // height={this.height}
              className="dotmapview"
              viewBox="0 0 1000 500"
              style={{ position: 'absolute', top: '18vh', left: '2vw', width: '50vw', height: 'auto' }}

              ref={this.svg}
            // ref = {ref}
            >
              {/* <rect x="5vw" y="15" width="140vh" height="75vh" style={{"position": "absolute","fill": "none","top": "18vh","left": "2vw","stroke": '#f1aca5',"stroke-width":"5", "fill-opacity":"0.1", "stroke-opacity":"0.9"}}></rect> */}



            </svg>
            <h3 style={{ position: 'absolute', top: '66vh' }}> <span ref={input => (this.mtitle = input)}></span> </h3>

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
                            {/* <rect x="5vw" y="15" width="140vh" height="75vh" style={{"position": "absolute","fill": "none","top": "18vh","left": "2vw","stroke": '#f1aca5',"stroke-width":"5", "fill-opacity":"0.1", "stroke-opacity":"0.9"}}></rect> */}




            </svg>

            <div id="mySidepanel" className="sidepanel" style={{textAlign:"left"}}>
              <a  href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>×</a>
              <p style={{paddingTop:'0px'}}>Authors</p>

              <a target="_blank" href="https://www.lucashenneman.org/">Lucas Henneman, George Mason University</a>
              <a  target="_blank"  href="#">Christine Choirat, ETH Zürich and EPFL</a>
              <a target="_blank" href="https://dedoussi.com/">Irene Dedoussi, TU Delft</a>
              <a  target="_blank" href="https://www.hsph.harvard.edu/profile/francesca-dominici/">Francesca Dmonici, Harvard TH Chan School of Public Health</a>
              <a target="_blank" href="http://jessicaannroberts.com/">Jessica Roberts, Georgia Institute of Technology</a>
              <a target="_blank" href="https://cns.utexas.edu/directory/item/3761-zigler-corwin?Itemid=349">Corwin Ziger, University of Texas, Austin</a>

              <p >Data and methods</p>
              <p className="insidep"> Facility information is taken from <a target="_blank" className="insidea" href="https://campd.epa.gov/">EPA’s Clean Air Markets Program Data </a> (https://campd.epa.gov/) .</p>
              <p className="insidep"> Population exposure is derived from each facility’s sulfur dioxide (SO<sub>2</sub>) emissions, atmospheric transport and dispersion, and chemical conversion to fine particulate matter (PM<sub>2.5</sub>). Other exposures and impacts (e.g., climate impacts) are not considered.</p>
              <p className="insidep"> Deaths correspond to excess mortalities in the US Medicare population.</p>
              <p className="insidep"> More detail on the methods is available here:</p>
              <p className="insidep"> Lucas Henneman, Christine Choirat, Irene Dedoussi, Francesca Dominici, Jessica Roberts, Corwin Zigler. Coal’s toll: 22 years of Medicare deaths attributable to electricity generation. <i>Under review</i>.</p>
              
              <p>Development</p>
              <a target="_blank" href="https://sichenj.in/">Sichen Jin, Georgia Institute of Technology</a>


            </div>

            <button className="openbtn" onClick={this.openNav} style={{ position: 'absolute', top: '10px', right: '5px', }}>☰ About</button>

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
        <div>          <span style={{ color: 'black', position: 'absolute', top: '68vh', left: '38vw', fontSize: '10px' }}> Statewide Deaths </span>
        </div>
        <div id="legend2" style={{ display: 'inline-block', position: 'absolute', top: '69vh', left: '40vw' }} >
        </div>

        <div class="column"  >



          <div key={this.FACID} style={{ width: 'auto', height: '90vh', display: 'block' }} ref={this.div}>
            <div style={{ position: "relative", float: "left", left: "36vw" }}>
              <span style={{ color: '#f1aca5', position: 'relative', top: '5px', right: '10px', fontSize: '15px' }}>consistent scale</span>
              <label class="switch" >
                <input type="checkbox" onChange={this.toggle} defaultChecked={true} ref={this.checkbox} />
                <span class="slider round"></span>
              </label>
            </div>
            <div style={{ position: "relative", float: "left", left: "10vw" }}>
              {/* <span style={{ color: '#f1aca5', position: 'relative', top: '5px', left: '155px', fontSize: '15px' }}>unselect all</span> */}
              <span style={{ color: '#f1aca5', position: 'relative', top: '5px', right: '15px', fontSize: '15px' }}>unselect all</span>
              <label class="switch" >
                <input type="checkbox" onChange={this.legendtoggle} defaultChecked={false} ref={this.legendcheckbox} />
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