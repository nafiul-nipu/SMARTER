"use strict"

var App = App || {};

let predictiveAnalysis = function(){
    let self = {
        logistic_regression : new logisticRegression(),
        data : {}
    }
    function main(){
        //getting the test data 
        //only for test purpose
        d3.csv("data/logistic_regression_test_data.csv", function(data){
            // console.log(data)
            data.map((d,i) => {
                // console.log(d)
                d["featureOne"] = +(d["featureOne"]);
                d["featureTwo"] = +(d["featureTwo"]);
                d["target"] = +(d["target"]);
            });
            self.data = data
            // console.log("from get_data", self.test)
            // self.data = App.models.patients.getPatients();
            // console.log("i am called")
            console.log(self.data.length)
            self.logistic_regression.main_function(self.data)
        });

    }

    return{
        main
    };
   
};

