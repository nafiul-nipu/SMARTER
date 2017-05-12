"use strict"

var App = App || {};

let KaplanMeierPatientModel = function() {

    let self = {
        patients: {},
        selectedAttribute: null,
        patientGroups: {},
        kaplanMeierPatientGroups: {}
    };

    /* initialize the patient list when first launching the application, and
       only be called once - when load the patient data */
    function initPatients(patients) {
        self.patients = patients;
    }

    /* update the patient list when applying new filters */
    function updatePatients(patients) {
        self.patients = patients;

        updateData();
    }

    /* update the selected attribute */
    function updateSelectedAttribute(attribute) {
        self.selectedAttribute = attribute;

        updateData();
    }

    /* update the patient groups based on the current patients and current selected attribute */
    function updateData() {
        // get all the values of the selected attribute
        let attributeDomains = App.models.patients.getPatientKnnAttributeDomains();
        let groups = attributeDomains[self.selectedAttribute];

        // reset to empty
        self.patientGroups = {};
        self.kaplanMeierPatientGroups = {};

        for (let i = 0; i < groups.length; i++) {
            let filter = {};
            filter[self.selectedAttribute] = groups[i];

            // filter patients by values of the selected attribute
            let thisGroupPateint = _.filter(self.patients, filter);
            self.patientGroups[groups[i]] = _.sortBy(thisGroupPateint, ["OS"]);

            // calculate the data for kaplan-meier plots
            calculateKaplanMeierData(self.patientGroups[groups[i]], groups[i]);
        }
        // console.log(self.patientGroups);
        console.log(self.kaplanMeierPatientGroups);
    }

    /* calculate the data used for kaplan-meier plots */
    function calculateKaplanMeierData(currentPatientGroup, selectedAttributeValue) {
        // {group: [{OS: , Prob: }, {}. ...]}
        let patientNum = currentPatientGroup.length;

        let CensorsAtOS = {}; // {OS: [censor], OS: [censor, censor, censor], OS: [], ...}

        for (let patientInd in currentPatientGroup) {
            CensorsAtOS[currentPatientGroup[patientInd].OS] = [];
        }

        for (let patientInd in currentPatientGroup) {
            CensorsAtOS[currentPatientGroup[patientInd].OS].push(currentPatientGroup[patientInd].Censor);
        }
        // console.log(CensorsAtOS);

        self.kaplanMeierPatientGroups[selectedAttributeValue] = CensorsAtOS;
    }

    /* get the data for kaplan-meier plots */
    function getKaplanMeierPatients() {
        return self.kaplanMeierPatientGroups;
    }


    return {
        initPatients,
        updatePatients,
        updateSelectedAttribute,
        getKaplanMeierPatients
    };
}
