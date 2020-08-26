"use strict"

var App = App || {};

let PreditictionAttributeModal = function(){
    let self = {
        attributeList : ["Therapeutic combination", "Gender","Age at Diagnosis (Calculated)",
         "HPV/P16 status", "T-category", "N-category", 
         "Smoking status at Diagnosis (Never/Former/Current)", "Race", 
         "Smoking status (Packs/Year)", 
         "Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)", 
         "Total dose"]
    }

    // init();
    
    function attribute_List(){
        // console.log("prediction modal called")
        $("#featureModelsBody").empty();
        let subjectID = $('.idSelect').val()
        let subjectIndexID = App.models.patients.getPatientIDFromDummyID(subjectID);
        let patient = App.models.patients.getPatientByID(subjectIndexID)

        let list = "<ul>"
        for(let attribute of self.attributeList){
            if(patient[attribute] != "N/A" && patient[attribute] != NaN){
                list = list + "<li>" + attribute + "</li>"
            }
        }
        list = list + "</ul> <br>"
        /* +
        "<img src='file:///D:/01. PhD Research/Qubbd-smarter/png/CoxForest_OS.png' alt='PNG' width='500' height='600'>"*/

        $("#featureModelsBody").html(list);
        
        
    }

    return{
        attribute_List
    }

};