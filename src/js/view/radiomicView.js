"use strict"

var App = App || {};

let RadiomicView = function(){
    let self = {
        options : ["Cluster 1", "Cluster 2", "Cluster 3"],
        values : ["cluster1", "cluster2", "cluster3"],
        cluster1: [],
        cluster2: [],
        cluster3: [],
    }

    function createSelect(){
        d3.select("#radiomic_dropdown")
            .on("change", function(){
                // console.log( $("#radiomic_dropdown").val())
                let value = $("#radiomic_dropdown").val()
                if(value == "cluster1" && Object.entries(self.cluster1).length != 0){ //checking if the object is empty or not
                    // console.log(typeof self.cluster1)
                    drawRadiomic(self.cluster1)                   
                }else if(value == "cluster2" && Object.entries(self.cluster2).length != 0){
                    // console.log(Object.entries(self.cluster2).length)
                    drawRadiomic(self.cluster2)
                }else if(value == "cluster3" && Object.entries(self.cluster3).length != 0){
                    drawRadiomic(self.cluster3)
                }
            }) 
            .selectAll("option")
            .data(self.options)
            .enter().append('option')
            .attr("value", function(d,i){
                return self.values[i];
            })
            .text(function(d){
                return d;
            }); 
    }
    
    function drawRadiomic(data){  
        // create svg element
        d3.select("#bigRadiomicSvg").remove();
        // console.log(document.getElementById("radiomics").offsetWidth)
        // console.log(document.getElementById("unbelievable-fix").offsetWidth)
        // console.log(document.getElementById("subjectPrediction").offsetWidth)

        let width = document.getElementById("radiomics").offsetWidth;
        let bigSvg = d3.select("#radiomics")
            .append("svg")
            .attr("id", "bigRadiomicSvg")
            .attr("width", 150)
            .attr("height", 300)

        let name = ["FDT", "ASP", "PRG", "OS"]
        let full_name = ["feeding tube", "aspiration", "progression", "overall"]
        let colorScale = d3.scaleLinear()
            .interpolate(d3.interpolateHcl)
            // .domain([1,0])
            .range(["#d18161", "#70a4c2"]); 

         // Create the scale
         let x = d3.scaleLinear()
         .domain([0, 1])         // This is what is written on the Axis: from 0 to 100
         .range([30, 120]);       // This is where the axis is placed: from 100px to 800px

        let xAxis = d3
            .axisBottom()
            .scale(x)
            .ticks(5);

        for(let i=0; i < 4; i++){

            let tip = d3.tip().attr('class', 'd3-tip')
                .html(function() { 
                    // let value = 
                    let text = full_name[i] + " : " + data[i].toFixed(3); 
                    return text;
                })
            
            let svg = bigSvg.append("svg").attr("width", 150)

            svg.call(tip)
            
            svg.append("g").append("text")
            .attr("x", 0)
            .attr("y", (60+60*i))
            .style("font-size", "10px")
            .text(name[i])           

                // Draw the axis
            svg
            .append("g")
            .attr("transform", "translate(0," + (50 + 60 * i) +")")  
            .call(xAxis);  
                           
        // Add dots
            svg.append('g')
            .append("circle")
            .attr("cx", function(){
                    return x(data[i])
                })
            .attr("cy", (50 + 60 * i) )
            .attr("r", 5)
            .style("fill", function(){
                if(name[i] == "FDT" || name[i] == "ASP"){
                    colorScale.domain([1,0])
                }else if(name[i] == "OS" || name[i] == "PRG"){
                    colorScale.domain([0,1])
                }
                return colorScale(data[i])
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            
    
         }
    }

    function populateClusterData(data){
        // console.log(data)
        self.cluster1 = [data[0][0] , data[1][0], data[3][0], data[2][0]];
        self.cluster2 = [data[0][1] , data[1][1], data[3][1], data[2][1]];
        self.cluster3 = [data[0][2] , data[1][2], data[3][2], data[2][2]];
        // console.log(self.cluster1, self.cluster2, self.cluster3)

        drawRadiomic(self.cluster1);

    }

    return{
        createSelect,
        drawRadiomic,
        populateClusterData
        
    }

};