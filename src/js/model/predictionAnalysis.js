"use strict"

var App = App || {};

let predictionModel = function(){
    // console.log("Hello world")

    //let's test the glm()
    let glm_model = GLM(GLM.families.Gaussian());
    let feature_vectors = [[1], [2]];
    let target_values = [3, 4];
    console.log(glm_model.fit(target_values, feature_vectors));
    console.log(glm_model.predict([10, 100]));  // == 12, 102

};