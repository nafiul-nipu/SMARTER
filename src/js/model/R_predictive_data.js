/**
 * this code is a conversion from R code 
 */

"use strict"

var App = App || {};

let R_to_JS = function(){
    let self = {
        name : ["ID", "Feeding Tube", "Aspiration", "Overall Survival", "Progression Free"],
        prediction: []

    }
    function main(){
        // $(document).ready(function(){
        //       $.ajax({url: "http://127.0.0.1:5000/output", success: function(result){
        //         //   console.log(result)
        //           self.prediction = result
        //         //   console.log("prediciotn", self.prediction)
        //       }});
        //   });

    }

    function get_result_name(){
        return self.name;
    }

    function get_prediction_result(){
        return self.prediction;
    }

    return{
        main,
        get_prediction_result,
        get_result_name
    };
   
};

