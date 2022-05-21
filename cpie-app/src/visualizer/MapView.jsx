

// import { scaleLinear, max, axisLeft, axisBottom, select } from "d3"

import { observable, computed, reaction, action } from "mobx";

// import{geoalbersUsa,geoPath} from "d3-geo"




@observer
class MapView extends React.Component {
  componentDidMount() {

  }

  //Width and height of map
 @observable year = "1999"
 @observable state = 'Alabama' 

 width = 960;
 height = 500;

// D3 Projection
 projection = geoalbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
 path = geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
 color = scaleLinear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

 legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];


 @computed
 get deathGeoJson() {
    d3.csv("pm25_facility_state_sum.csv", (data)=>{
        color.domain([0,1,2,3]); // setting the range of the input data
        

        //filter data
        var filteredData = data.filter((d) =>
        { 
        
                if(( d["state_zip"] == this.state) && (d["year"]==this.year ))
                { 
                    return d;
                } 
        
            })

        // Load GeoJSON data and merge with states data
        d3.json("us-states.json", (json) =>{
        
        // Loop through each state data value in the .csv file
        for (var i = 0; i < filteredData.length; i++) {
        
            // Grab State Name
            var dataState = filteredData[i].state_facility;
        
            // Grab data value 
            var dataValue = filteredData[i].deaths_coef_2;
        
            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++)  {
                var jsonState = json.features[j].properties.name;
        
                if (dataState == jsonState) {
        
                // Copy the data value into the JSON
                json.features[j].properties.deaths_coef_2 = dataValue; 
        
                // Stop looking through the JSON
                break;
                }
            }
        }
        return json 
    
    })
                
        

 })
}

 @action 
 updateMap(){
    

    // Bind the data to the SVG and create one path per GeoJSON feature
    this.svg.selectAll("path")
    .data(this.deathGeoJson)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", (d)=> {

    // Get data value
    var value = d.properties.deaths_coef_2;

    if (value) {
    //If value exists…
    return color(value);
    } else {
    //If value is undefined…
    return "rgb(213,222,217)";
    }
});

         

        
// // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
// var legend = d3.select("body").append("svg")
//                   .attr("class", "legend")
//                  .attr("width", 140)
//                 .attr("height", 200)
//                    .selectAll("g")
//                    .data(color.domain().slice().reverse())
//                    .enter()
//                    .append("g")
//                  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//       legend.append("rect")
//              .attr("width", 18)
//              .attr("height", 18)
//              .style("fill", color);

//       legend.append("text")
//             .data(legendText)
//             .attr("x", 24)
//             .attr("y", 9)
//             .attr("dy", ".35em")
//             .text(function(d) { return d; });
 


}
 
 

//Create SVG element and append map to the SVG

    // svgElement = select(this.svg)
//  circles = svgElement.selectAll("circle")
//  svg = select("body")
// 			.append("svg")
// 			.attr("width", width)
// 			.attr("height", height);
        
// Append Div for tooltip to SVG
//  div = d3.select("body")
// 		    .append("div")   
//     		.attr("class", "tooltip")               
//     		.style("opacity", 0);

// Load in my states data!
// Load in my states data!



  render() {
    return (
        <svg
        width={this.width + this.margin.right + this.margin.left}
        height={this.height + this.margin.top + this.margin.bottom}
        className="mapview"
        ref={input => (this.svg = input)}
      // ref = {ref}
      >

      </svg>
    )
  }

}

export default MapView;