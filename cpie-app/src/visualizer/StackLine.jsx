import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as d3 from 'd3';
import { observer } from "mobx-react";
import { observable, computed, reaction, action } from "mobx";
import statedata from "../data/pm25_facility_state_sum_fullname.csv";
import * as echarts from 'echarts';
import { interpolateOrRd } from "d3-scale-chromatic"

@observer
class StackLine extends React.Component {

  @observable year = "1999"
  
  @observable statecode = this.props.statecode
  @observable lineoption 
  color = d3.scaleSequential(interpolateOrRd)

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
              size: 20, 
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
      // var myChart = echarts.init(chartDom);
      // myChart.setOption(this.lineoption);
      
      // var chartDom = document.getElementById('linestack2');
      var myChart = echarts.init(this.div, null, { renderer: 'svg' });
      myChart.setOption(this.lineoption);
      window.onresize = function() {
        myChart.resize();
      };

    })

     
    
  }

  // lastyear = "1999"
   render() {
    {this.stackLine()} 
    return (
      <div id="linestack2"   style={{ width: '50vw' , height:'48vh' ,display: 'block' }} ref={input => (this.div = input)}></div>)
         
      {/* {this.lineoption && <ReactECharts option={this.lineoption} />}; */}
    
  }
}

  
  export default StackLine;