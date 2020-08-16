"use strict";

let nomogramPredictionInfoController = function(listID) {
    let self = {
    };

    function subjectPredictions(id) {
        // console.log(id)
        d3.select("#subjectPrediction").remove();
        d3.select("#unbelievable-fix").append("div")
            .attr("id", "subjectPrediction")
            .style("padding-top", "70%")
            .html(function(){
                let feed = +id["feeding_tube_prob"];
                let asp = +id["aspiration_prob"];
                let prog = +id["progression_free_5yr_prob"];
                let os = +id["overall_survival_5yr_prob"];
                let text = "<strong>Patient ID: " + id["Dummy ID"] + "</strong><br>" +
                "Feeding Tube: " + feed.toFixed(3) + "<br>" +
                "Aspiration: " + asp.toFixed(3) + "<br>" + 
                "Progression (5 years): " + prog.toFixed(3) + "<br>" +
                "OS (5 years): " + os.toFixed(3) 

                return text;
            })

    
    }

    return{
        subjectPredictions
    }

};
