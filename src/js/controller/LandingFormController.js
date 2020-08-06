"use strict"

var App = App || {};

let LandingFormController = function() {

    let self = {
        patientDropDown: null,
        currentPatient: null,
        submitButton: null,
        showFormButton: null,
        mustInput : 12
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
                // if (selectedID !== "N/A") { // updates the patients information in the form
                    self.currentPatient = selectedID;
                    // console.log(selectedID);
                    updateLandingForms(patients[selectedID]);
                // }
                // else{
                //     console.log(selectedID)
                // }
            })

    }

    function setSubmitButton(element) {
        self.submitButton = d3.select(element)
            .on("click", function() {
                // console.log(getValidation())
                let count = getValidation()
                if(count == self.mustInput){
                    App.controllers.newPatient.addNewPatient();                   
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
                        // let data = consolidateData();
                        // console.log(data);
                        // if (data.age === null)
                            // return;
                        // else {
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

                            // }else {
                                // Check if there is newly entered data.
                                // Figure out what all has to be done to.
                                // console.log(self.currentPatient)
                            // }
                        }

                    }

                }

            })
    }

    //get the validation
    function getValidation(){
        let input_count = 0
        if(!$('#age-element').val()){
            $('#age-validation').show();
            // alert("Please provide age")
        }else{
            $('#age-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name=Gender]:checked").val()){
            $('#gender-validation').show();
            // alert("Please provide gender")
        }else{
            $('#gender-validation').hide();
            input_count = input_count + 1
        }
        if(!$('#race-element').val()){
            $('#race-validation').show();
            // alert("Please provide race")
        }else{
            $('#race-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name='Aspiration rate Pre-therapy']:checked").val()){
            $('#aspiration-validation').show();
            // alert("Please provide Aspiration")
        }else{
            $('#aspiration-validation').hide();
            input_count = input_count + 1
        }
        if(!$('#hpvp16-element').val()){
            $('#hpvp16-validation').show();
            // alert("Please provide hpv/p16")
        }else{
            $('#hpvp16-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name='Smoking status at Diagnosis (Never/Former/Current)']:checked").val()){
            $('#smoking-validation').show();
            // alert("Please provide smoking status")
        }else{
            $('#smoking-validation').hide();
            input_count = input_count + 1
        }
        if(!$('#packs-per-year-element').val()){
            $('#packs-validation').show();
            // alert("Please provide packs per year")
        }else{
            $('#packs-validation').hide();
            input_count = input_count + 1
        }
        if(!$('#tumor-site').val()){
            $('#site-validation').show();
            // alert("Please provide tm laterity")
        }else{
            $('#site-validation').hide();
            input_count = input_count + 1
        }
        if(!$('#tumor-subsite').val()){
            $('#subsite-validation').show();
            // alert("Please provide tumor subsite")
        }else{
            $('#subsite-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name='T-category']:checked").val()){
            $('#t-validation').show();
            // alert("Please provide T-category")
        }else{
            $('#t-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name='N-category']:checked").val()){
            $('#n-validation').show();
            // alert("Please provide N-category")
        }else{
            $('#n-validation').hide();
            input_count = input_count + 1
        }
        if(!$("input:radio[name='Pathological Grade']:checked").val()){
            $('#pathological-validation').show();
            // alert("Please provide pathological grade")
        }else{
            $('#pathological-validation').hide();
            input_count = input_count + 1
        }
        return input_count;
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
        updateLandingForms,
        getValidation
    }
}