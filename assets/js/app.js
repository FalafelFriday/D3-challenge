var svgWidth = 960;
var svgHeight = 500;

var chartMargin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// var chosenXAxis = "poverty";

// function xScale(statedata, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(statedata, d => d[chosenXAxis]) * 0.8,
//       d3.max(statedata, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, chartWidth]);

//   return xLinearScale;

// }

// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// if (chosenXAxis === "poverty") {
//   var label = "poverty";
// }
// else {
//   var label = "age";
// }

// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "poverty") {
//     var label = "poverty:";
//   }
//   else {
//     var label = "age:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }


d3.csv("./assets/data/data.csv").then(function(statedata) {
    // if(error) return console.log(error);
    // statedata = JSON.stringify(statedata);    
    // statedata = JSON.parse(statedata); 
    console.log(statedata);

    statedata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
    });
    
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(statedata, d => d.poverty)])
        .range([0,chartWidth]);
    
    // var xLinearScale = xScale(statedata, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(statedata, d => d.healthcare)])
        .range([chartHeight,0]);
    
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // var xAxis = chartGroup.append("g")
    //     .classed("x-axis", true)
    //     .attr("transform", `translate(0, ${chartHeight})`)
    //     .call(bottomAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(statedata)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("class", function(d) {
        return "stateCircle " + d.abbr;
      })
      .attr("fill", "blue")
      .attr("opacity", "1");
  
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr([1, -1])
      .html(function(d) {
        return (`${d.abbr}`);
      });
      
      
    chartGroup.call(toolTip);
      
    circlesGroup.on("click", function(data) {
          toolTip.show(data, this);
        })
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
      
      
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 1.2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 3}, ${chartHeight + chartMargin.top + 20})`)
      .attr("class", "axisText")
      .text("poverty");
    
  // var labelsGroup = chartGroup.append("g")
  //   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  // var povertyLabel = labelsGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 20)
  //   .attr("value", "poverty") // value to grab for event listener
  //   .classed("active", true)
  //   .text("poverty");

  // var ageLabel = labelsGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "age") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("Age of individual");

    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    var circlesGroup = chartGroup.selectAll()
      .data(statedata)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .style("font-size", "13px")
      .style("text-anchor", "middle")
      .style('fill', 'white')
      .text(d => (d.abbr));
  // //
  // labelsGroup.selectAll("text")
  //   .on("click", function() {
  //     // get value of selection
  //     var value = d3.select(this).attr("value");
  //     if (value !== chosenXAxis) {

  //       // replaces chosenXAxis with value
  //       chosenXAxis = value;

  //       // console.log(chosenXAxis)

  //       // functions here found above csv import
  //       // updates x scale for new data
  //       xLinearScale = xScale(statedata, chosenXAxis);

  //       // updates x axis with transition
  //       xAxis = renderAxes(xLinearScale, xAxis);

  //       // updates circles with new x values
  //       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

  //       // updates tooltips with new info
  //       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  //       // changes classes to change bold text
  //       if (chosenXAxis === "poverty") {
  //         povertyLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //         ageLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //       }
  //       else {
  //         povertyLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         ageLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //       }
  //     }
  //   });

});
