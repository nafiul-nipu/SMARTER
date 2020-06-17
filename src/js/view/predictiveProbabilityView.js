"use strict"

var App = App || {};

let predictionModalView = function(){

    init();
    
    function init(){

        $("#predictionButton").on("click", function(){
            $("#predictionModalBody").empty();
            let feature_name = App.models.r_to_js.get_result_name();
            let prediction_result = App.models.r_to_js.get_prediction_result();

            // console.log(id)
            console.log(feature_name)
            console.log(prediction_result)
            // console.log(aspiration)

            let table = `<table class = "table table-bordered">
            <thead>
            <tr>
              <th scope="col">Dummy Id</th>
              <th scope="col">Feeding Tube</th>
              <th scope="col">Aspiration</th>
              <th scope="col">Overall Survival</th>
              <th scope="col">Progression Free</th>
            </tr>
          </thead>
          <tbody>
            `;

            for (let index in prediction_result[0]) {                

               table += `<tr> <td> ` + prediction_result[0][index] +`</td> <td>` + prediction_result[1][index] + `</td> <td>` + prediction_result[2][index] + `</td> <td>` + prediction_result[3][index] + `</td> <td>` + prediction_result[4][index] +  `</td></tr>`

            } 
            table += `</tbody></table>`
            $("#predictionModalBody").append(table);
       });
        
        
    }

};


