"use strict"

var App = App || {};

let PatientModel = function() {

    /* Private varaible */
    let self = {
        patients: {},
        patientAttributes: []
    };

    // eight attributes for calculating knn and also eight asxes in the kiviat diagram
    self.patientAttributes = ["Gender", "Ethnicity", "Tcategory", "Site", "Nodal_Disease", "ecog", "Chemotherapy", "Local_Therapy"];

    /* load data from two csv files */
    function loadData() {
        let survivalProbabilityFile = "data/SurvivalProbability.csv ";
        let kaplanMeierFile = "data/correctKaplanMeier.csv";

        // use promise to notify main when the data has been loaded
        return new Promise(function(resolve, reject) {
            // load data using d3 queue
            let dataLoadQueue = d3.queue();

            dataLoadQueue
                .defer(d3.csv, survivalProbabilityFile)
                .defer(d3.csv, kaplanMeierFile)
                .await(loadAllFiles);

            function loadAllFiles(error, probData, kaplanMeierData) {
                if (error) {
                    // reject on error in await callback
                    reject(error);
                }

                self.patients = probData;

                kaplanMeierData.forEach(function(d, i) {
                    self.patients[i].ID = i + 1;
                    self.patients[i].OS = d.OS;
                    self.patients[i].Censor = d.Censor;
                });

                // resolve within await callback after data finished processing
                resolve( /*self.patients*/ );
            }
        });

    }

    /* get the combined full patient list */
    function getData() {
        return self.patients;
    }

    /* get a subset of the full patient list based on the filters applied */
    function filterData(filters) {
        let filteredPatients = _.filter(self.patients, filters);

        return _.keyBy(filteredPatients, function(o) {
            return (o.ID - 1);
        });
    }

    /* calculate the knn to the selected patient */
    function calculateKNN(subjectID, filters, k) {
        let otherPatients = [];

        // get the actual patient attributes used for calculating knn
        let knnFilters = _.difference(self.patientAttributes, filters);
        console.log(knnFilters);

        for (let patientID of Object.keys(self.patients)) {
            // calculate the similarity scores between the selected patient and the rest patients in the list
            if (patientID != subjectID && patientID != 'columns') {
                otherPatients[patientID] = {};
                otherPatients[patientID].id = patientID;
                otherPatients[patientID].score = similarityScore(patientID, subjectID, knnFilters);
            }
        }

        let sortedPatients = _.reverse(_.sortBy(otherPatients, ['score']));

        // output the top k similar patients
        let topKpatients = [];
        for (let i = 1; i <= k; i++) {
            topKpatients.push(sortedPatients[i]);
        }

        return topKpatients;
    }

    /* calculate the similarity between two patients based on the hamming distance*/
    function similarityScore(patientID, subjectID, knnFilters) {
        let score = 0;
        let tieBreaker = -(Math.abs(self.patients[patientID].AgeAtTx - self.patients[subjectID].AgeAtTx)) / 150; // max age diff - 150

        score += tieBreaker;

        for (let attribute of knnFilters) {
          if (self.patients[patientID][attribute] === self.patients[subjectID][attribute]) {
            score +=1 ;
          }
        }

        return score;
    }


    /* Return the publicly accessible functions */
    return {
        loadPatients: loadData,
        getPatients: getData,
        filterPatients: filterData,
        getKnnTo: calculateKNN
    };
}
