"use strict"

var App = App || {};

let PatientModel = function() {

    /* Private variables */
    let self = {
        patients: {},
        attributeDomains: {},
        axes: {},
        commonAttributeValues: {},
        commonKaplanAttributeValues: {},
        // statisticsOfAllPatients:{}
    };

    /* load data from two csv files, returning a promise that resolves upon completion */
    function loadPatients() {
        // let survivalProbabilityFile = "data/SurvivalProbability.csv ";
        // let kaplanMeierFile = "data/correctKaplanMeier.csv";
        let newDataFile = "data/newdata.csv";

        // use promise to notify main when the data has been loaded
        return new Promise(function(resolve, reject) {
            // load data using d3 queue
            let dataLoadQueue = d3.queue();

            dataLoadQueue
                .defer(d3.csv, newDataFile)
                .await(loadAllFiles);

            // called after both files are loaded, and combines the data from two files
            function loadAllFiles(error,
                                  // probData,
                                  // kaplanMeierData,
                                  newData) {
                if (error) {
                    // reject on error in await callback
                    reject(error);
                }
                // console.log(newData);
                // console.log(newData[0]["Dummy ID"]);
                // convert array to object using IDs as the key
                _.forEach(newData, (d, i) => {
                    // if (d['Dummy ID'] === "2006") {
                    //     console.log("Dummy id 2006 ", d);
                    // }
                    self.patients[i] = d;
                    self.patients[i].AgeAtTx = +(d["Age at Diagnosis (Calculated)"]);
                    self.patients[i]["Probability of Survival"] = +(d["overall_survival_5yr_prob"]);
                    self.patients[i].ID = d["Dummy ID"];
                    self.patients[i].OS = +d["OS (Calculated)"];
                    self.patients[i].Censor = +d.Censor;
                    //for attribute statistics
                    self.patients[i].SmokeStatusPacksYear = +d["Smoking status (Packs/Year)"];
                    self.patients[i].TotalDose = +d["Total dose"];
                    self.patients[i].TreatmentDays = +d["Treatment duration (Days)"];
                });

                // console.log(self.patients)
                // calculatePatientAttributeDomains();

                // resolve within await callback after data finished processing
                resolve( /*self.patients*/ );
            }
        });

    }

    /* get the combined full patient list */
    function getPatients() {
        return self.patients;
    }

    /* get the total number of patients in the list */
    function getPatientNumber() {
        return Object.keys(self.patients).length;
    }

    /* get the patient Info by the ID 
    this ID is the index number of the patient*/
    function getPatientByID(patientID) {
        return self.patients[patientID];
    }

    /**get the total number of patients in the dataset */
    function getTotalPatients(){
        let total = Object.keys(self.patients).length;
        return total;
    }

    

    /* calculate the patient attribute domains including age and pbty */
    function calculatePatientAttributeDomains() {
        let patientObjArray = Object.values(self.patients);
       
        for (let attribute of App.patientKnnAttributes) {
            let attribute_valueArray = patientObjArray.map(function(o) {
                return o[attribute];
            });
            let uniqueVals = _.uniq(attribute_valueArray);
            self.attributeDomains[attribute] = uniqueVals.sort();
        }

        // self.attributeDomains["AgeAtTx"] = [25, 90];
        // self.attributeDomains["Probability of Survival"] = [0, 1];
    }

    /* get the patient attribute domains */
    function getPatientAttirbuteDomains() {
        return self.attributeDomains;
    }

    function getCommonAttributeValues() {
        return self.commonAttributeValues;
    }

    //from the DummyId getting the index number in the dataset
    function getPatientIDFromDummyID(patientDummyID){
        // console.log(self.patients[2]["Dummy ID"])
        for(let patient in self.patients){
            if(self.patients[patient]["Dummy ID"] == patientDummyID){
                return patient;
            }
        }
    }

    // //calculate the patient stats
    // function statisticsOfAllPatients(){
    //    let attributeData = App.models.attibuteModel.getAttributeData();
    //    console.log(attributeData)

    // }


     /**
         * Computes how many attributes the kn patients have in common with all, according to kaplanAttribute
         *          * @param {array} knn 
         */
        function computeCommonKaplanAttributeValues(patients, kaplanAttribute, currentPatient){
            // console.log("kaplan attribute values " + currentPatient)
            self.commonKaplanAttributeValues = {Subgroup : 0};
            // let patientRealID = getPatientIDFromDummyID(currentPatient)
            // console.log(patientRealID);
            if(!currentPatient){
                currentPatient = 0;
            }
            // console.log("patient's dummy ID " + currentPatient)
            // console.log("patient serial id in the data set " + test);
            // console.log(patients[13][kaplanAttribute[0]])
            // console.log(patients[test])

            for (let attribute of kaplanAttribute) {
                // console.log(attribute)
                self.commonKaplanAttributeValues[patients[currentPatient][attribute]] = 0;
                for (let patient in patients){
                    // console.log(patients[patient])
                    // console.log(patients[patient][attribute] +  "===" + patients[currentPatient][attribute])
                    if (patients[patient][attribute] === patients[currentPatient][attribute]) {
                        self.commonKaplanAttributeValues[patients[currentPatient][attribute]] += 1;
                    }
                }
            }

            //calculate how many pepople are in this sub group
            for(let patient in patients){
                // console.log(patient)
                let check = true ;
                for(let attribute of kaplanAttribute){
                    // console.log(patients[patient][attribute])
                    // console.log(patients[patient][attribute] +  "!=" + patients[currentPatient][attribute])
                    if (patients[patient][attribute] != patients[currentPatient][attribute]) {
                        check = false;
                        break;
                    }
                }
                if(check == true){
                    self.commonKaplanAttributeValues["Subgroup"] += 1;
                }
            }




            return self.commonKaplanAttributeValues;
        }


    /* get the patient knn attribute domains */
    function getPatientKnnAttributeDomains() {
        let knnAttributeDomains = {};

        for (let attribute of App.patientKnnAttributes) {
            knnAttributeDomains[attribute] = self.axes[attribute].domain;
        }

        return knnAttributeDomains;
    }

    /* get a subset of the full patient list based on the filters applied where
       filters is an object with attribute-value pairs
        - e.g. {'Ethnicity': 'white', ... } */
    function filterPatients() {
        let filters = App.models.applicationState.getAttributeFilters();
        // console.log(filters)
        let filteredPatients = _.filter(self.patients, filters);
        // console.log(filteredPatients)

        return _.keyBy(filteredPatients, function(o) {
            return o.ID; // object
        });
    }

    /* calculate the knn to the selected patient based on (patientAttributes - excludedAttributes),
       return the knn info with full attributes */
    function calculateKNN( /*subjectID, excludedAttributes, k*/ ) {
        let otherPatients = [];

        let numberOfNeighbors = App.models.applicationState.getNumberOfNeighbors();
        // console.log("number of neigbors " + numberOfNeighbors)
        let subjectID = App.models.applicationState.getSelectedPatientID();
        // console.log("suject ID "+subjectID)

        let subjectIndexID = getPatientIDFromDummyID(subjectID);
        // console.log("patients Index number on dataset " + subjectIndexID)
        // console.log(getPatientByID(subjectIndexID))

        let patientAttributes = App.patientKnnAttributes;
        // console.log("patient Knn Attributes " + patientAttributes)

        let knnExcludedAttributes = App.models.applicationState.getKnnExcludedAttributes();
        // console.log("knn excluded attributes " + knnExcludedAttributes)

        // get the actual patient attributes used for calculating knn
        let knnAttributes = _.difference(patientAttributes, knnExcludedAttributes);
        // console.log(knnAttributes);

        // calculate the similarity scores between the selected patient and the rest patients in the list
        for (let patientID of Object.keys(self.patients)) {
            // console.log(patientID)
            if (patientID !== subjectIndexID && patientID !== 'columns') {
                otherPatients[patientID] = {};
                otherPatients[patientID].id = patientID;
                otherPatients[patientID].score = similarityScore(patientID, subjectIndexID, knnAttributes);
            }
        }
        // console.log(otherPatients)

        let sortedPatients = _.reverse(_.sortBy(otherPatients, ['score']));

        // console.log(sortedPatients)

        // output the top k similar patients
        let topKpatients = [];
        for (let i = 1; i <= numberOfNeighbors; i++) {
            let neighbor = self.patients[sortedPatients[i].id];
            neighbor.score = sortedPatients[i].score;
            topKpatients.push(neighbor);
        }
        // console.log("topKpatients " + topKpatients)

        computeCommonAttributeValues(topKpatients, knnAttributes, subjectIndexID);
        // console.log(topKpatients)
        // console.log(subjectID)
        // console.log(knnAttributes)
        // console.log(self.patients[2])

        return topKpatients;
    }

    /**
     * Computes how many attributes the kn patients have in common with the subject, for each attribute used in the knn
     * @param {array} knn 
     */
    function computeCommonAttributeValues(topKpatients, knnAttributes, subjectID){
        // console.log("subject id in compute common att " + subjectID)
        self.commonAttributeValues = {};
        // console.log(topKpatients)

        for (let attribute of knnAttributes) {
            self.commonAttributeValues[attribute] = 0;
            for (let patient of topKpatients){
                if (patient[self.axes[attribute].name] === self.patients[subjectID][self.axes[attribute].name]) {
                    self.commonAttributeValues[attribute] += 1;
                }
            }
        }
        // console.log(self.commonAttributeValues)
    }


   

    /* calculate the similarity between two patients based on the hamming distance
       over a subset of patientAttributes */
    function similarityScore(patientID, subjectID, knnAttributes) {
        let score = 0;
        
        //giving error 
        // if(self.patients[patientID].AgeAtTx && self.patients[subjectID].AgeAtTx){
        //     let tieBreaker = -(Math.abs(self.patients[patientID].AgeAtTx - self.patients[subjectID].AgeAtTx)) / 150; // max age diff - 150

        //     score += tieBreaker;

        // }

        let tieBreaker = -(Math.abs(self.patients[patientID].AgeAtTx - self.patients[subjectID].AgeAtTx)) / 150; // max age diff - 150

            score += tieBreaker;
        

        for (let attribute of knnAttributes) {
            // console.log(patientID, self.patients[patientID][axes[attribute].name] === self.patients[subjectID][axes[attribute].name]);
            if (self.patients[patientID][self.axes[attribute].name] === self.patients[subjectID][self.axes[attribute].name]) {
                score += 1;
            }
        }

        return score;
    }

    function setAxes(axes) {
        self.axes = axes;
    }


    /* Return the publicly accessible functions */
    return {
        loadPatients,
        getPatients,
        getPatientNumber,
        getPatientByID,
        getPatientIDFromDummyID,
        getPatientAttirbuteDomains,
        getPatientKnnAttributeDomains,
        getCommonAttributeValues,
        computeCommonKaplanAttributeValues,
        filterPatients,
        setAxes,
        getTotalPatients,
        // statisticsOfAllPatients,
        getKnn: calculateKNN
    };
}
