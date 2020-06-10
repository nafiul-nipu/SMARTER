"use strict"

var App = App || {};

let predictionModalView = function(){

    init();
    
    function init(){

        //$("#predictionButton").on("click", function(){
            $("#predictionModalBody").empty();
            let id = App.models.predictiveAnalysis.get_ID();
            let feeding_tube = App.models.predictiveAnalysis.get_feeding_tube_result();
            let aspiration = App.models.predictiveAnalysis.get_aspiration_result();

            // console.log(id)
            // console.log(feeding_tube)
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

            for (let index in id) {                

               table += `<tr> <td> ` + id[index] +`</td> <td>` + feeding_tube[index] + `</td> <td>` + aspiration[index] + `</td> <td>` + "OS" + `</td> <td>` + "PF" +  `</td></tr>`

            } 
            table += `</tbody></table>`
            $("#predictionModalBody").append(table);
       // });
        
        
    }

};


