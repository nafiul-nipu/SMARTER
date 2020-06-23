"use strict"

var App = App || {};

let AddNewPatient = function() {

    let self = {
        patientInfo:{},
        all_patients: App.models.patients.getPatients()

    };

    function addNewPatient(){
        $('#add-patient').on('click', function(){
            // console.log(self.all_patients);
            let keys = Object.keys(self.all_patients)
            let length = keys.length;
            //test patient.
            //will take the values from the form 
            self.all_patients[length] = {"Dummy ID": 9999, hello:5, hi:6}
            // console.log(self.all_patients)
            //add the patient to the patients list
            App.models.patients.setPatients(self.all_patients)
            //update the landing form dropdown
            //need to find a way to save the data to the file
            App.controllers.landingFormController.setPatientDropdown(".idSelect");
            // location.reload();
            $(".landing-form").show();
            $(".add-patient-form").hide();
        });

    }

    return {
        addNewPatient

    }
}