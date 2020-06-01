"use strict"

/**
 * we are using matrices for logistic regression
 * for matrix manipulation we are using math.js library
 */

var App = App || {};

let logisticRegression = function(){
    let self = {
        //this two should be matrices
        //matrices are kind of arrays
        features : [], 
        target : []
    }

    let main_function = function(data){
        // console.log("from main function", data)
        // data should be provided as such the last column is the
        // target and the first to last - 1 are features
        // differentiate feature and target
        let split_data = differentiate(data)
        self.features = split_data[0]
        self.target = split_data[1]
        // console.log(self.features, self.target)
    }

    function differentiate(data){
        // console.log(Object.keys(data[0]))
        for(let i = 0 ; i < data[0].length ; i++){
            // console.log(i)
        }

        return [5, 6]
    }
    
    return{
       main_function 
    };
};

