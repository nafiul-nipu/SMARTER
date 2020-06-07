/**
 * this code is a conversion from R code 
 */

"use strict"

var App = App || {};

let predictiveAnalysis = function(){
    let self = {
        logistic_regression : new logisticRegression(),
        data : {},
        feature_data: [],
        binary_outcome: [], //feeding tube and aspiration
        censor_outcome: [] //survival
    }
    function main(){
        //load data
        self.data = App.models.patients.getPatients();
        console.log(self.data)
        // console.log(self.data["33"]["Feeding tube 6m"])
        let pack_year_mean = getPackPerYearMean(self.data);
        // console.log(pack_year_mean)

        //data cleaning
        //making some adustment to the data
        //taking the features that is needed
        let count = 0
        for(let index in self.data){
            // removing the feeding tube entries that does not have any value
            if(self.data[index]["Feeding tube 6m"] == "N" || self.data[index]["Feeding tube 6m"] == "Y"){
                self.feature_data[count] = {}
                self.binary_outcome[count] = {}
                self.censor_outcome[count] = {}
                //dummy id of all of the patients
                self.feature_data[count].ID = self.data[index]["Dummy ID"]
                self.binary_outcome[count].ID = self.data[index]["Dummy ID"]
                self.censor_outcome[count].ID = self.data[index]["Dummy ID"]
                
                //ajcc stage 8th addition
                // self.feature_data[count].ajcc_stage = self.data[index]["AJCC 8th edition"]
                
                //race - white/caucasion = white , rest = other
                if(self.data[index]["Race"] == "White/Caucasion"){
                    self.feature_data[count].white = "White"
                }else{
                    self.feature_data[count].white = "Other"
                }
                
                //smoke status - change - formar will be former
                if(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"] == "Formar"){
                    self.feature_data[count].smoke_status = "Former"
                }else{
                    self.feature_data[count].smoke_status = self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"]
                }

                //pack per year 
                //if smoke status is never = 0
                // for NA take the mean
                if(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"] == "Never"){
                    self.feature_data[count].pack_year = 0;
                }else if(isNaN(self.data[index]["SmokeStatusPacksYear"])){
                    //take the mean
                    self.feature_data[count].pack_year = pack_year_mean;
                }else{
                    self.feature_data[count].pack_year = self.data[index]["SmokeStatusPacksYear"];
                }

                //age at diagnosis calculated
                self.feature_data[count].age = self.data[index]["AgeAtTx"];

                //neck_boost
                self.feature_data[count].neck_boost = self.data[index]["Neck boost (Y/N)"];

                //neck_dissection
                self.feature_data[count].neck_dissection = self.data[index]["Neck Disssection after IMRT (Y/N)"];

                // tumor_subsite
                self.feature_data[count].tumor_subsite = self.data[index]["Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)"];

                //t-category Tis and Tx will be t1
                if(self.data[index]["T-category"] == "Tis" || self.data[index]["T-category"] == "Tx"){
                    self.feature_data[count].t_category = "T1";
                }else{
                    self.feature_data[count].t_category =  self.data[index]["T-category"];
                }

                //n-category
                self.feature_data[count].n_category = self.data[index]["N-category"];

                //gender
                self.feature_data[count].gender = self.data[index]["Gender"];

                //hpv status
                self.feature_data[count].hpv_status = self.data[index]["HPV/P16 status"];

                //therapeutic combination
                self.feature_data[count].therapeutic = self.data[index]["Therapeutic combination"];

                //let's take the binary outcomes
                // feeding tube 
                // if feeding tube is N then set 0 otherwise 1
                if(self.data[index]["Feeding tube 6m"] == "N"){
                    self.binary_outcome[count].feeding_tube = 0;
                }else{
                    self.binary_outcome[count].feeding_tube = 1;

                }

                //aspiration
                // aspiration is N then set 0 otherwise 1
                if(self.data[index]["Aspiration rate(Y/N)"] == "N"){
                    self.binary_outcome[count].aspiration = 0;
                }else{
                    self.binary_outcome[count].aspiration = 1;

                }
                

                count++ ;
            }           
        }

        console.log(self.feature_data)




    }

    function getPackPerYearMean(pack_data){
        let count = 0;
        let sum = 0;
        for(let index in pack_data){
            if(!isNaN(pack_data[index]["SmokeStatusPacksYear"])){
                sum += pack_data[index]["SmokeStatusPacksYear"];
                count++
            }
        }
        // console.log(sum)
        // console.log(count)
        let mean = sum / count;
        return mean;

    }

    return{
        main
    };
   
};

