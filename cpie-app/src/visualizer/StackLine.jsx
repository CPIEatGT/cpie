import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as d3 from 'd3';
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import stackdata from "../data/facility_to_state_year_sum2_fullname.csv";
import * as echarts from 'echarts';
import { interpolateOrRd } from "d3-scale-chromatic"

@observer
class StackLine extends React.Component {

  @observable year = "1999"

  @observable statecode = this.props.statecode
  // @observable FACID = this.props.FACID
  @observable lineoption
  color = d3.scaleSequential(interpolateOrRd)

  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.div = React.createRef();
  }

  componentDidMount() {
    this.myChart = echarts.init(this.div.current, null, { renderer: 'svg' });
  window.onresize =  () =>{
    this.myChart.resize();
   
  };

  this.stackLine()
   }

   componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.FACID !== prevProps.FACID) {
      this.stackLine()
    }
  }


  

  
 
  toggle = event =>{
    if(event.target.checked){
      this.lineoption.yAxis[0] = {
        type: 'value',
        max: 3000
      }
      
      this.myChart.setOption(this.lineoption);
    }else{
      this.lineoption.yAxis[0] = {
        type: 'value',
        max:  null
      }
      
      this.myChart.setOption(this.lineoption);

    }
    // console.log(event.target.checked)
  }

  stackLine() {



    d3.csv(stackdata).then((data) => {




      //filter data
      var filteredData = data.filter((d) => {

        if ((d["FacID"] == this.props.FACID)) {
          return d;
        }

      })

      const minco = parseFloat(d3.min(filteredData, d => parseFloat(d.deaths_coef_2))) - 0.1
      const maxco = parseFloat(d3.max(filteredData, d => parseFloat(d.deaths_coef_2))) + 0.1

      this.color.domain([minco, maxco]); // setting the range of the input data 

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
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: this.color(parseFloat(yearstateto[0]))  //change later
          },
          data: yearstateto,
          sum: d3.sum(yearstateto)


        })




      })
      // console.log(seriesdata)
      seriesdata.sort(function (first, second) {
        return parseInt(second.sum) - parseInt(first.sum);
      });



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
        legend: {
          orient: 'vertical',
          left: 'right',
          type:'scroll',//does not work
          height: 366,
          formatter:  name => {
            var series = this.myChart.getOption().series;
            var value = series.filter(row => row.name === name)[0].sum
            return name + '    ' + (Math.round(value * 100) / 100).toFixed(2);
          },
          // data: []
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
          bottom: '12%',
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
                formatter: (params) => {
                  console.log(params.value)
                  if (params.value !== this.year) {
                    // ...
                    this.year = params.value
                    // this.props.setyear(params.value)
                    //...
                  }
                  return null;
                }

              },
              handle: {
                show: false,
                color: 'rgb(100,100,100)',
                size: 20,
              }
            },
            boundaryGap: false,
            data: d3.range(1999, 2021, 1)
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 3000
          }
        ],
        series: seriesdata

      };


      // var chartDom = document.getElementById('linestack');
      // var myChart = echarts.init(chartDom);
      // myChart.setOption(this.lineoption);

      // var chartDom = document.getElementById('linestack2');
     
      this.myChart.setOption(this.lineoption);
      

    })



  }

  // lastyear = "1999"
  render() {
    
    return ( null
      )

    {/* {this.lineoption && <ReactECharts option={this.lineoption} />}; */ }

  }
}


export default StackLine;