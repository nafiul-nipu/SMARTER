"use strict"

var App = App || {};

let StatsView = function () {

    self = {
        dendrogramButton: null,
        lymphNodeButton: null,
        camprtButton: null,
        totalPatientsText: null,
        commonAttributesTable: null,
        detailsStatistics: null,
        campRTPatientList: [3,4,10,11,27,29,31,33,34,35,36,37,41,46,49,100,102,104,105,109,110,112,114,118,119,120,121,125,126,128,133,134,136,145,147,149,150,152,153,154,155,156,158,160,164,165,169,171,172,173,176,177,178,179,180,181,183,184,185,188,189,192,194,195,197,200,202,206,209,212,213,215,218,220,221,222,223,224,225,226,228,229,232,234,236,237,242,244,246,247,248,251,252,256,257,260,261,263,265,267,268,271,274,276,278,280,281,283,285,286,287,289,2000,2007,2011,2012,2016,2023,2024,2025,2026,2027,2028,2030,5001,5004,5007,5008,5009,5011,5025,5031,5042,5043,5053,5056,5058,5067,5068,5071,5075,5077,5078,5080,5081,5084,5085,5090,5092,5100,10014,10019,10021,10036,10040,10041,10044,10054,10061,10062,10063,10065,10070,10071,10074,10080,10083,10085,10092,10094,10103,10113,10114,10124,10129,10130,10132,10134,10135,10136,10138,10140,10143,10144,10145,10147,10148,10153,10154,10155,10157,10159,10163,10164,10174,10184,10188,10191,10197,10199]
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

        //code to show statistics
        self.detailsStatistics = d3.select("#statisticsPatients")

    }

    function setStatisticsPatients(){
        App.models.attributeModel.statisticsOfAllPatients();
        let url = `statistics.html`;
        self.detailsStatistics.attr("href", url);
        // self.detailsStatistics.on("click", App.models.attributeModel.populateStatisticsTable())
    }


    function setDendrogramButtons(pid) {
        // Tim's work currently hosted using GH pages.
        // let url = `https://uic-evl.github.io/LymphaticCancerViz/dendrogram/?id=${pid}`;
        let url = `dendrogram.html`
        // document.getElementById("dendrogramlinker").removeAttribute("class");
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
        // let url = `https://uic-evl.github.io/CAMP-RT/?id=${pid}`;
        let url = `https://mnipu2.people.uic.edu/CAMP-RT/?id=${pid}`;
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
        if(!currentPatient){
            currentPatient = 0;
        }

        // console.log(currentPatient)
        //getting the current patients values from patient model
        let currentPatientAttributes = App.models.patients.getPatientByID(currentPatient);
        // console.log(currentPatientAttributes)
        //group of the kaplam view
        let kaplanMeierGroup = App.mosaicAttributeOrderForCohortTable;
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

    function disableLymphnode() {
        // document.getElementById("dendrogramlinker-class").disabled = true;
        document.getElementById("lymphthingylinker-class").disabled = true;
        // document.getElementById("camprtlinker-class").disabled = true;

    }

    function enableLymphnode(){
        // document.getElementById("dendrogramlinker-class").disabled = false;
        document.getElementById("lymphthingylinker-class").disabled = false;
        // document.getElementById("camprtlinker-class").disabled = false;

    }

    function disaleCampRT() {
        // document.getElementById("dendrogramlinker-class").disabled = true;
        // document.getElementById("lymphthingylinker-class").disabled = true;
        document.getElementById("camprtlinker-class").disabled = true;

    }
    function enableCampRT(){
        // document.getElementById("dendrogramlinker-class").disabled = false;
        // document.getElementById("lymphthingylinker-class").disabled = false;
        document.getElementById("camprtlinker-class").disabled = false;

    }


    function updateButtons(currentPatient) {
        // console.log("stats view current patient " + currentPatient)
        if(currentPatient !== undefined){
            // console.log(App.models.patients.getDummyID(currentPatient));
             // console.log(currentPatient > 200)
            if(currentPatient != 0 && currentPatient <= 356){ //lymph node has 356 patients
                // console.log("update link")
                enableLymphnode()
                setLymphButton(currentPatient);
            }else{
                disableLymphnode()
            } 

            //camp rt 
            //get the dummy ID
            let campDummy = App.models.patients.getDummyID(currentPatient);
            // console.log(campDummy)
            // console.log(self.campRTPatientList)
            // console.log(self.campRTPatientList.includes(campDummy))
            for(let i = 0; i < self.campRTPatientList.length; i++){
                // console.log("yes")
                // dummy ID is in camp RT - enable the link
                if(self.campRTPatientList[i] == campDummy){
                    // console.log("camp enable")
                    enableCampRT();
                    setCamprtButton(campDummy);
                    break;
                }else{
                    // dummy ID is not in camp RT - disable the link
                    // console.log("camp disable")
                    disaleCampRT()
                }
            }
            // setCamprtButton(currentPatient); 
            setDendrogramButtons(currentPatient);     
            setStatisticsPatients();
            // console.log("current patient " + currentPatient)

            populateCommonAttributeTable(currentPatient); 
        }

    }

    return {
        updateButtons,
        updatePatientsCount
    }
};