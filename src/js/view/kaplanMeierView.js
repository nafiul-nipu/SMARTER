"use strict"

var App = App || {};

let KaplanMeierView = function(targetID) {

    let self = {
        targetElement: null,
        targetSvg: null,
        maxOS: null
    };

    init();

    function init() {
        self.targetElement = d3.select(targetID);
        // console.log(self.targetElement.node())
        // console.log(window.innerHeight)
        // console.log(document.getElementById("buttonBottom").clientHeight)
        // console.log(document.getElementById("title").clientHeight)

        // let bottomPartHeight = document.getElementById("buttonBottom").clientHeight ; 
        let navigationBarHeight = document.getElementById("title").clientHeight ;
        let kaplanHeight = (window.innerHeight / 2) - (2 * navigationBarHeight);
        let kaplanWidth = self.targetElement.node().clientWidth;

        self.targetSvg = self.targetElement.append("svg")
            .attr("width", kaplanWidth)
            .attr("height", kaplanHeight)
            .attr("viewBox", "0 0 140 100") // + kaplanHeight / 4 + " " + kaplanHeight / 4)
            .style("margin-left", "30px")
            .attr("preserveAspectRatio", "xMidYMin");

        drawXAxis();
        drawYAxis();
        drawXAxisLabels();
    }

    function drawXAxis() {
        self.targetSvg.append("line")
            .attr("x1", 10)
            .attr("y1", 90)
            .attr("x2", 110)
            .attr("y2", 90)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", "0.6px");
    }

    function drawYAxis() {
        self.targetSvg.append("line")
            .attr("x1", 10)
            .attr("y1", 10)
            .attr("x2", 10)
            .attr("y2", 90)
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-width", "0.6px");

        self.targetSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -35)
            .attr("y", 15)
            // .style("stroke-width", "0.6px")
            .style("font-size", "6px")
            .attr("text-anchor", "end")
            .text("Survival Probability")
            .style("opacity", 0.7);;
    }

    function drawXAxisLabels() {
        for (let i = 0; i <= 10; i++) {
            self.targetSvg.append("text")
                .attr("x", 2)
                .attr("y", 91 - 8 * i)
                .style("font-size", "4px")
                .text((0.1 * i).toFixed(1))
                .style("opacity", 0.7);
        }
        self.targetSvg.append("text")
            .attr("class", "x axis-label")
            .attr("x", 50)
            .attr("y", 100)
            .style("font-size", "6px")
            // .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text("Duration (in months) ")
            .style("opacity", 0.7);
    }

    function drawLegend(attrVal, attrValNum, color) {
        self.targetSvg.append("rect")
            .attr("class", "legend")
            .attr("x", 80)
            .attr("y", attrValNum * 5)
            .attr("width", 5)
            .attr("height", 5)
            .style("fill", color)
            .style("opacity", 0.5)
            // .style("cursor", "context-menu")
            /*
            .on("click", function(d){
                // console.log(color);
                // console.log("I am clicked");
                highlight(attrVal)
            });
             .on("mouseover", function(d){
                    // console.log("mouse overed")
                    // console.log(attrVal)
                    highlight(attrVal);
                })
                .on("mouseleave", function(d,i){
                    // console.log("mouse leave")
                    noHighlight(attrVal);
                });
                */
            

        self.targetSvg.append("text")
            .attr("class", "legend")
            .attr("x", 85)
            .attr("y", 4 + attrValNum * 5)
            .style("font-size", "4px")
            // .style("cursor", "context-menu")
            .text(attrVal)
            /*
            .on("click", function(d){
                highlight(attrVal)
            });
            .on("mouseover", function(d){
                highlight(attrVal);
            })
            .on("mouseleave", function(d,i){
                noHighlight(attrVal);
            });
            */
            

        d3.select("#reset_kaplan").on("click", function(d){
            noHighlight();
        });
    }

    // What to do when one group is hovered
    function highlight(d){
        //both rect and path are named as kmVar Class
        //remove the special characters if have any 
        let value = d.replace(/[^a-zA-Z0-9]/g, '');

        // reduce opacity of all groups
        d3.select("#kaplanMeier").select("svg").selectAll(".kmVar").style("opacity", .05)
        // except the one that is hovered
        d3.select("#kaplanMeier").select("svg").selectAll("."+value).style("opacity", 0.5)
    }

    // And when it is not hovered anymore
    function noHighlight(){
        d3.select("#kaplanMeier").select("svg").selectAll(".kmVar").style("opacity", 0.5)
        // d3.select("#kaplanMeier").select("svg").select(".kmPlots").style("opacity", 0.5)
    }


    /* update the kaplan-meier plot based on the selected attribute*/
    function update(KMData) {
        // console.log("KMDATA" , KMData)
        d3.selectAll(".kmVar").remove();
        // d3.selectAll(".kmPlots").remove();
        d3.selectAll(".legend").remove();
        d3.selectAll(".yAxisLabels").remove();

        let x = d3.scaleLinear()
            .domain([0, self.maxOS])
            .range([10, 110]);

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([90, 10]);


        //we want to make the selected patient cohort's color more opaque
        //let's get the selected patient ID and information
        //get the Dummy ID from the drop down
        let patientID = App.controllers.patientSelector.getCurrentPatient();
        // console.log(patientID)
        // get the index of the dummy ID
        let indexID = 0;
        if(patientID == null || patientID == 0){ //as we don't have null and 0 indexed patient
            indexID = 2;            
        }else{
            indexID = App.models.patients.getPatientIDFromDummyID(patientID);
        }
        // console.log(indexID)
        //get that patient's information
        let patientInfo = App.models.patients.getPatientByID(indexID);
        // console.log(patientInfo)
        // get the selected attribute from kaplan dropdown
        let selectedAttribute = App.models.kaplanMeierPatient.getSelectedAttribute();
        // console.log(selectedAttribute)
        // console.log(patientInfo[selectedAttribute])
        // get the cohort of the selected patients
        let patient_attribute = patientInfo[selectedAttribute];

        // draw kaplan-meier plots
        let attrValNum = 0;
        for (let attrKey of Object.keys(KMData)) {
            console.log(attrKey)
            console.log(KMData[attrKey])
            if (KMData[attrKey].length > 0) {  // have patients in the group
                drawKMPlot(KMData[attrKey], x, y, App.attributeColors(attrKey), attrKey, patient_attribute);
                drawLegend(attrKey, attrValNum, App.attributeColors(attrKey));
                attrValNum++;
            }
        }

        // draw y-axis labels
        let interval = Math.round(self.maxOS / 100) * 10;

        for (let i = 0; i < self.maxOS; i += interval) {
            self.targetSvg.append("text")
                .attr("class", "yAxisLabels")
                .attr("x", x(i))
                .attr("y", 95)
                .style("font-size", "4px")
                .style("text-anchor", "middle")
                .style("opacity", 0.7)
                .text(i);
        }
    }

    /* draw the kaplan-meier plot */
    function drawKMPlot(data, xScale, yScale, color, attrVal, patient_attribute) {

        // remove the special symbols
        let value = attrVal.replace(/[^a-zA-Z0-9]/g, '');
        let opaqued_attribute = patient_attribute.replace(/[^a-zA-Z0-9]/g, '');
        // console.log(attrVal.replace(/[^a-zA-Z ]/g, ""));
        // console.log(value)
        // console.log(attrVal)

        // 1.96 is the approximation for the 97.5 percentile for a normal distribution
        //  => 95% of the area lies between -1.96 and 1.96
        let areaPercent95 = 1.96;

        // draw rect for showing variances
        for (let j = 0; j < data.length - 1; j++) {
            let x1 = xScale(data[j].OS);
            let x2 = xScale(data[j + 1].OS);
            let y1 = yScale(Math.max(0, data[j].prob - areaPercent95 * Math.sqrt(data[j].var)));
            let y2 = yScale(Math.min(1, data[j].prob + areaPercent95 * Math.sqrt(data[j].var)));

            self.targetSvg.append("rect")
                .attr("class", "kmVar " + value)
                .attr("id", value)
                .attr("x", x1)
                .attr("y", y2)
                .attr("width", x2 - x1)
                .attr("height", y1 - y2)
                .style("stroke", "none")
                .style("fill", color)
                .style("opacity", function(d){
                    // selected patient's cohort will be 0.7
                    // other will be 0.5
                    if(value == opaqued_attribute){
                        return 1
                    }else{
                        return 0.4
                    }
                });
        }

        // draw line
        let lineData = [{
            x: xScale(data[0].OS),
            y: yScale(1)
        }, {
            x: xScale(data[0].OS),
            y: yScale(data[0].prob)
        }];

        for (let i = 1; i < data.length; i++) {
            lineData.push({
                x: xScale(data[i].OS),
                y: yScale(data[i - 1].prob)
            });
            lineData.push({
                x: xScale(data[i].OS),
                y: yScale(data[i].prob)
            });
        }

        let lineFunc = d3.line()
            .x(function(d) {
                return d.x;
            })
            .y(function(d) {
                return d.y;
            });

        self.targetSvg.append("path")
            .attr("class", "kmVar " + value)
            .attr("id", value)
            .attr("d", lineFunc(lineData))
            .style("stroke", color)
            .style("stroke-width", "0.8px")
            .style("opacity", "0.5")
            .style("fill", "none");
    }

    /* set the maximum value on X-axis */
    function setMaxOS(os) {
        self.maxOS = os;
    }


    return {
        update,
        setMaxOS,
        highlight,
        noHighlight
    };
}
