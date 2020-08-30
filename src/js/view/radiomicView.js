"use strict"

var App = App || {};

let RadiomicView = function(){
    // let self = {
    // }

    // init();
    
    function drawRadiomic(){  
        // create svg element
        console.log(document.getElementById("radiomics").offsetWidth)
        console.log(document.getElementById("unbelievable-fix").offsetWidth)
        console.log(document.getElementById("subjectPrediction").offsetWidth)

        let width = document.getElementById("radiomics").offsetWidth;
        let bigSvg = d3.select("#radiomics")
            .append("svg")
            .attr("width", 150)
            .attr("height", 300)

        let name = ["FDT", "ASP", "PRG", "OS"]
        let data = [0.06494370649060044,0.0673236467699309,0.8702396477183327,0.9272890829277212]

        for(let i=0; i < 4; i++){
            
            let svg = bigSvg.append("svg").attr("width", 150)
            // Create the scale
            let x = d3.scaleLinear()
                .domain([0, 1])         // This is what is written on the Axis: from 0 to 100
                .range([30, 120]);       // This is where the axis is placed: from 100px to 800px

            let xAxis = d3
                .axisBottom()
                .scale(x)
                .ticks(5);

            // Draw the axis
            svg
            .append("g")
            .attr("transform", "translate(0," + (50 + 60 * i) +")")      // This controls the vertical position of the Axis
            .call(xAxis);  
            
            svg.append("g").append("text")
            .attr("x", 0)
            .attr("y", (60+60*i))
            .style("font-size", "10px")
            .text(name[i])           
            
            // Initialize circles. Note that the X scale is not available yet, so we cannot draw them
     // Add dots
        svg.append('g')
        .append("circle")
        .attr("cx", function(){
                console.log(x(data[i]));
                return x(data[i])
            })
            .attr("cy", (50 + 60 * i) )
            .attr("r", 5)
            .style("fill", "black")

        }

       
                
    }

    return{
        drawRadiomic
        
    }

};