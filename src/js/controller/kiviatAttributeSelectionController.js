"use strict";

let kiviatAttributeSelectionController = function(listID) {
    let self = {
        list: null,
        checkboxStates: {},
        // initialChecked : ["AgeAtTx", "Gender", "Race", "T-category", "N-category"],
        kiviatTrigger: false
    };
    

    init();

    function init() {
        let attributes = App.kiviatAttributes;

        for (let attribute of attributes) {
            self.checkboxStates[attribute] = true;
        }

        self.list = d3.select(listID);

        // console.log(self.list)
        // self.list.text("hello")

        // <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        //   <span aria-hidden="true">&times;</span>
        // </button>

        self.list.append("li")
            .append("div")
            .text("Axes Controller")
            .style("text-align", "center")
            .append("button")
            .attr("class", "close")
            .attr("type", "button")
            .attr("data-toggle", "collapse")
            .attr("data-target", "#kiviatAttributesControl")
            .append("span")
            .attr("aria-hidden", "true")
            .style("border", "none")
            .html("&times;");

        self.list.selectAll(".checkbox-li")
            .data(attributes)
            .enter().append("li")
            .attr("class", "checkbox-li")
            // .attr("height", "100%")
            .each(function(d, i) {
                let div = d3.select(this).append("div").attr("class", "checkbox");

                div.append("input")
                    .attr("class", "separated-checkbox")
                    .attr("checked", true)
                    .attr("type", "checkbox")
                    .attr("value", d)
                    .attr("id", "kiviatAttrCheck" + d)
                    .on("click", checkboxOnChange);

                div.append("label")
                    .attr("for", "kiviatAttrCheck" + d)
                    .on("click", function() {
                        d3.event.stopPropagation(); // prevent menu close on label click
                    })
                    .text(d);
            });

            let buttonDiv = d3.select(listID).append("div").attr("class", "modal-footer");
            buttonDiv.append("button")
                    .attr("class", "btn btn-default dropdown-toggle")
                    .attr("type", "button")
                    .attr("data-toggle", "collapse")
                    .attr("data-target", "#kiviatAttributesControl")
                    .text("Close");
    }

    function checkboxOnChange() {
        let checkbox = d3.select(this).node();

        self.checkboxStates[checkbox.value] = checkbox.checked;

        getNewKiviatAttributes();
    }

    function getNewKiviatAttributes() {
        let includedAttributes = _.filter(Object.keys(self.checkboxStates), o => self.checkboxStates[o]);

        App.kiviatAttributes = includedAttributes;
        // console.log(App.kiviatAttributes)

        let patients = App.controllers.patientSelector.getPatientWithGroup();
        // console.log(App.controllers.patientSelector.getPatientWithGroup())
        // console.log(patients)
        self.kiviatTrigger = true;
        // console.log(self.kiviatTrigger)

        App.views.kiviatDiagram.update(patients);

        // App.views.kiviatDiagram.init();

        // let subjectID = App.models.applicationState.getSelectedPatientID();
        // let updatedPatients = getUpdatedData(subjectID);

        // updateViews(patients);
    }

    function getKiviatTrigger(){
        return self.kiviatTrigger;
    }

    function setKiviatTrigger(trigger){
        self.kiviatTrigger = trigger;
    }

    // /* get the updated selected patient and knn */
    // function getUpdatedData(subjectID) {
    //     let subjectIndex = App.models.patients.getPatientIDFromDummyID(subjectID);
    //     let updatedPatients = {};
    //     updatedPatients.subject = App.models.patients.getPatientByID(subjectIndex);
    //     updatedPatients.neighbors = App.models.patients.getKnn();

    //     return updatedPatients;
    // }

    // /* update relative views */
    // function updateViews(updatedPatients) {
    //     // console.log("updated patients" + updatedPatients)
    //     App.views.kiviatDiagram.update(updatedPatients);
    //     App.views.nomogram.updateKnnData(updatedPatients);
    // }


    // function updateSelectedCheckboxes() {
    //     let excludedAttributes = App.models.applicationState.getKnnExcludedAttributes();

    //     self.list.selectAll("input").attr("checked", true);

    //     for (let attr of excludedAttributes) {
    //         console.log("Unchecking", attr);
    //         self.list.select("#knnAttrCheck" + attr).attr("checked", null);
    //     }
    // }

    return {
        // updateSelectedCheckboxes
        getKiviatTrigger,
        setKiviatTrigger
    };
};
