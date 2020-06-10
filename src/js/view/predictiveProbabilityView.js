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
            console.log(feeding_tube[0][0])
            // console.log(aspiration)

            let table = `<table class = "table table-bordered">
            <thead>
            <tr>
              <th scope="col">Dummy Id</th>
              <th scope="col">Feeding Tube (1)</th>
              <th scope="col">Feeding Tube (2)</th>
              <th scope="col">Aspiration (1)</th>
              <th scope="col">Aspiration (2)</th>
            </tr>
          </thead>
          <tbody>
            `;

            for (let index in id) {                

               table += `<tr> <td> ` + id[index] +`</td> <td>` + feeding_tube[0][index] + `</td> <td>` + feeding_tube[1][index] + `</td> <td>` + aspiration[0][index] + `</td> <td>` + aspiration[0][index] +  `</td></tr>`

            } 
            table += `</tbody></table>`
            $("#predictionModalBody").append(table);
       // });
        
        
    }

};


