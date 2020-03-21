"use strict"

var App = App || {};

let StatsView = function () {

    self = {
        dendrogramButton: null,
        lymphNodeButton: null,
        camprtButton: null,
        totalPatientsText: null,
        commonAttributesTable: null
    };

    init();

    function init() {
        // Code to link the Tim's lymph repo
        self.dendrogramButton = d3.select("#dendrogramlinker");
        self.lymphNodeButton = d3.select("#lymphthingylinker");

        self.commonAttributesTable = d3.select("#commonAttributesTable");

        // Code to link CAMP-RT
        self.camprtButton = d3.select("#camprtlinker");
        self.totalPatientsText = d3.select("#total-patient-span");
    }

    function setDendrogramButtons(pid) {
        // Tim's work currently hosted using GH pages.
        let url = `https://uic-evl.github.io/LymphaticCancerViz/dendrogram/?id=${pid}`;
        self.dendrogramButton
            .attr("href", url);
    }

    function setLymphButton(pid) {
        // Tim's work currently hosted using GH pages.
        let url = `https://uic-evl.github.io/LymphaticCancerViz/?id=${pid}`;
        self.lymphNodeButton
            .attr("href", url)
    }

    function setCamprtButton(pid) {
        let url = `https://uic-evl.github.io/CAMP-RT/?id=${pid}`;
        self.camprtButton
            .attr("href", url);
    }

    function updatePatientsCount() {
        //all of the patients in the data set 
        let patients = App.models.patients.filterPatients();
        // console.log(patients)
        self.totalPatientsText
            .text(Object.keys(patients).length);

        // console.log(self.totalPatientsText.text(Object.keys(patients).length))
    }

    function populateCommonAttributeTable(currentPatient){
        //stats view modification

        // console.log(currentPatient)
        //getting the current patients values from patient model
        let currentPatientAttributes = App.models.patients.getPatientByID(currentPatient);
        console.log(currentPatientAttributes)
        //group of the kaplam view
        let kaplanMeierGroup = App.mosaicAttributeOrder;
        // console.log(kaplanMeierGroup)
        
        let allPatients = App.models.patients.getPatients();
        // console.log(allPatients)
        // console.log(kaplanMeierGroup)
        // console.log(currentPatientAttributes)
        //getting the keys of the patients all attribute
        // let keys = Object.keys(currentPatientAttributes)
        // console.log(keys)

        //count all the values of kaplan meier
        let kaplamMeierGroupValues = App.models.patients.computeCommonKaplanAttributeValues(allPatients, kaplanMeierGroup, currentPatient)
        // console.log(kaplamMeierGroupValues)


        $("table.order-list").empty();
        let kaplanGroupNameCounter = 0;

        for (let attr of Object.keys(kaplamMeierGroupValues)) {
            
            // console.log(attr)
            var newRow = $("<tr>");
            var cols = "";

            if(attr == "Subgroup"){
                cols += `<td class="col-sm-6">`+"Patient ID: "+ `<span class="">${currentPatientAttributes["Dummy ID"]}</span> <span class="">${attr}</span></td>`;
            }else{
                cols += `<td class="col-sm-6"><span class="">${kaplanMeierGroup[kaplanGroupNameCounter]}</span>`+ " : " + `<span class="">${attr}</span></td>`;
                kaplanGroupNameCounter++;
            }
            
            cols += `<td class="col-sm-6"><span class="">${kaplamMeierGroupValues[attr]}</span></td>`;

            // console.log(attr + "and its value is : " + commonAttributeValues[attr])  
            // console.log("keys " : + Object.keys(commonAttributeValues))  
            newRow.append(cols);
            $("table.order-list").append(newRow);

            
        }
    }


    function updateButtons(currentPatient) {
        console.log("stats view current patient " + currentPatient)
        
        setDendrogramButtons(currentPatient);
        setLymphButton(currentPatient);
        setCamprtButton(currentPatient);
        // console.log("current patient " + currentPatient)

        populateCommonAttributeTable(currentPatient);        
    }

    return {
        updateButtons,
        updatePatientsCount
    }
};