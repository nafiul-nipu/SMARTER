"use strict"

var App = App || {};

let LandingFormController = function() {

    let self = {
        patientDropDown: null,
        currentPatient: null,
        submitButton: null,
        showFormButton: null
    };

    function setPatientDropdown(element) {
        let patients = App.models.patients.filterPatients();
        // console.log(patients)
        // console.log(Object.keys(patients))

        self.patientDropDown = d3.select(element)
            .selectAll("option")
            .data(Object.keys(patients)).enter()
            .append("option")
            .attr("value", (d) => d)
            .text((d) => d);

        d3.select(element)
            .on("change", function () {
                let selectedID = d3.select(this).node().value;
                if (selectedID !== "N/A") { // updates the patients information in the form
                    self.currentPatient = selectedID;
                    // console.log(selectedID);
                    updateLandingForms(patients[selectedID]);
                }
                // else{
                //     console.log(selectedID)
                // }
            })

    }

    function setSubmitButton(element) {
        self.submitButton = d3.select(element)
            .on("click", function() {
                if($('.idSelect').val() == "N/A"){ //adding new patient
                    // console.log(App.controllers.newPatient.get_result_name()) 
                    let new_patient = App.controllers.newPatient.get_result_name();
                    if(new_patient["Dummy ID"] != "N/A"){
                        //landing form drop down fix
                        d3.select(".idSelect").append("option")
                                            .attr("value", new_patient["Dummy ID"])
                                            .text(new_patient["Dummy ID"])

                        //add to the patient dropdown of the interface
                        // d3.select("#patientSel").append("option")
                        //                     .attr("value", new_patient["Dummy ID"])
                        //                     .text(new_patient["Dummy ID"])

                        $('.idSelect').val(new_patient["Dummy ID"])
                        $(".landing-form").hide();
                        App.controllers.patientSelector.updatePateintDropDown();
                        App.controllers.patientSelector.setPatient(new_patient["Dummy ID"]);
                        let index = App.models.patients.getPatientIDFromDummyID(new_patient["Dummy ID"]);
                        $('#index-text').html('Patient Index: ' + index);
                    }                   
                }
                else{
                    let data = consolidateData();
                    // console.log(data);
                    if (data.age === null)
                        return;
                    else {
                        $(".landing-form").hide();
                        // $(".add-patient-form").hide()
                        // $(".dashboard-help").css("display", "block");
                        // $(".dashboard").css("display", "block");
                        if(self.currentPatient !== null) {
                            // console.log(self.currentPatient , "in !== null")
                            App.controllers.patientSelector.updatePateintDropDown();
                            App.controllers.patientSelector.setPatient(self.currentPatient);
                            let index = App.models.patients.getPatientIDFromDummyID(self.currentPatient);
                            $('#index-text').html('Patient Index: ' + index);

                        }else {
                            // Check if there is newly entered data.
                            // Figure out what all has to be done to.
                            // console.log(self.currentPatient)
                        }
                    }

                }
            })
    }

    //add patient button 
    function setShowFormButton(element) {
        self.showFormButton = d3.select(element)
            .on("click", function() {
                // console.log(element)
                $(".landing-form").show();
                // $(".add-patient-form").show();
            })
    }

    function updateLandingForms(data) {
        App.views.demographForm.updateForm(data);
        App.views.treatmentForm.updateForm(data);
        App.views.cancerDescriptorsForm.updateForm(data);
    }

    function consolidateData() {
        return {
            ...App.views.demographForm.consolidateData(),
            ...App.views.treatmentForm.consolidateData(),
            ...App.views.cancerDescriptorsForm.consolidateData()
        }
    }

    return {
        setPatientDropdown,
        consolidateData,
        setSubmitButton,
        setShowFormButton,
        updateLandingForms
    }
}