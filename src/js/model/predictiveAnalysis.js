/**
 * this code is a conversion from R code 
 */

"use strict"

var App = App || {};

let predictiveAnalysis = function(){
    let self = {
        data : {},
        feature_data:[], // {
            // ID : [],
            // white: [],
            // smoke_status: [],
            // pack_year: [],
            // age: [],
            // neck_boost: [],
            // neck_dissection: [],
            // tumor_subsite: [],
            // t_category: [],
            // n_category: [],
            // gender: [],
            // hpv_status: [],
            // therapeutic:[]
        // },
        feeding_tube:[],  // {
            // ID:[],
            // feeding_tube: [],
            // aspiration: []
       // }, //feeding tube and aspiration
       aspiration: [],
        censor_outcome: {
            // ID:[]
        } //survival
    }
    function main(){
        //load data
        self.data = App.models.patients.getPatients();
        // console.log(self.data)
        // console.log(self.data["33"]["Feeding tube 6m"])
        let pack_year_mean = getPackPerYearMean(self.data);
        // console.log(pack_year_mean)

        //data cleaning
        //making some adustment to the data
        //taking the features that is needed
        //and the binary outcome, censor outcome variables
        //making dummy variables for the categorical data as well
        let count = 0
        for(let index in self.data){
            // removing the feeding tube entries that does not have any value
            if(self.data[index]["Feeding tube 6m"] == "N" || self.data[index]["Feeding tube 6m"] == "Y"){
                
                self.feature_data[count] = {};
                // self.binary_outcome[count] = {};
                self.censor_outcome[count] = {};

                //dummy id of all of the patients
                self.feature_data[count].ID = self.data[index]["Dummy ID"];
                // self.binary_outcome[count].ID = self.data[index]["Dummy ID"];
                // self.censor_outcome[count].ID = self.data[index]["Dummy ID"];
                
                //ajcc stage 8th addition
                // self.feature_data[count].ajcc_stage = self.data[index]["AJCC 8th edition"]
                
                //race - white/caucasion = 1 , rest = 0
                if(self.data[index]["Race"] == "White/Caucasion"){
                    self.feature_data[count].white = "White";
                }else{
                    self.feature_data[count].white = "Other";
                }
                
                //smoke status - change - formar will be former
                // dummy variables - two variables - Never , Current
                if(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"] == "Formar"){
                    self.feature_data[count].smoke_status = "Former";
                }else{
                    self.feature_data[count].smoke_status = self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"];
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
                    self.feeding_tube[count] = 0;
                }else{
                    self.feeding_tube[count] = 1;

                }

                //aspiration
                // aspiration is N then set 0 otherwise 1
                if(self.data[index]["Aspiration rate(Y/N)"] == "N"){
                    self.aspiration[count] = 0;
                }else{
                    self.aspiration[count] = 1;

                }

                //survival will be added later here

                count++ ;
            }           
        }

        // console.log(self.feature_data)
        // console.log(self.binary_outcome)
        // we completed to take the data.. 
        // now we will send them to their destination functions
        console.log("calculating feeding tube")
        let feeding_tube = feeding_tube_function(self.feature_data, self.feeding_tube)
        console.log("feeding tube result")
        console.log(feeding_tube)

        console.log("calculating aspiration")
        let aspiration = aspiration_function(self.feature_data, self.aspiration)
        console.log("aspiration result")
        console.log(aspiration)
        // survival_function(self.feature_data, self.censor_outcome)

    }

    function feeding_tube_function(data, target){
        // in this funciton we will make the dummy variables
        //then we will call the logistic regression
        console.log("feeding tube")
        // console.log(data)
        // console.log(target)
        //create dummy variables 
        create_dummy_variable(data, "therapeutic", "therapeutic_CC", "CC");
        
        create_dummy_variable(data, "therapeutic", "therapeutic_IC_CC", "IC+CC");

        create_dummy_variable(data, "therapeutic", "therapeutic_Radiation_alone", "Radiation alone");

        create_dummy_variable(data, "gender", "gender_female" , "Female");

        create_dummy_variable(data, "hpv_status", "hpv_status_positive", "Positive");

        create_dummy_variable(data, "hpv_status", "hpv_status_unknown", "Unknown");

        create_dummy_variable(data, "t_category", "t_category_t2", "T2");

        create_dummy_variable(data, "t_category", "t_category_t3", "T3");

        create_dummy_variable(data, "t_category", "t_category_t4", "T4");

        create_dummy_variable(data, "n_category", "n_category_n1", "N1");

        create_dummy_variable(data, "n_category", "n_category_n2", "N2");

        create_dummy_variable(data, "n_category", "n_category_n3", "N3");

        create_dummy_variable(data, "smoke_status", "smoke_status_current", "Current");

        create_dummy_variable(data, "smoke_status", "smoke_status_never", "Never");

        create_dummy_variable(data, "white", "white_other", "Other");

        create_dummy_variable(data, "tumor_subsite", "tumor_subsite_bot", "BOT");

        create_dummy_variable(data, "tumor_subsite", "tumor_subsite_other", "Other");

        create_dummy_variable(data, "neck_boost", "neck_boost_N", "N");

        create_dummy_variable(data, "neck_dissection", "neck_dissection_Y", "Y");

        // call logistic regression

        // console.log(data)
        let final_data = [];
        let data_keys = Object.keys(data[0])
        //not considering dummy id therefore starting from 1
        for(let i = 0 ; i < data.length; i++){
            final_data[i] = []
            for(let key of data_keys){
                //adding the features that are number only
                if(typeof data[0][key] == "number"){
                    final_data[i].push(data[i][key])
                }
            }
            //adding the target
            final_data[i].push(target[i])
            
        }
        // final_data.push(target)
        // console.log(final_data)
        return logistic_regression(final_data)

    }

    function aspiration_function(data, target){
        // in this funciton we will make the dummy variables
        //then we will call the logistic regression
        console.log("aspiration_function")
        // console.log(target)

        //create dummy variables 
        create_dummy_variable(data, "therapeutic", "therapeutic_IC_Radiation_alone", "IC+Radiation alone");

        create_dummy_variable(data, "therapeutic", "therapeutic_CC", "CC");

        create_dummy_variable(data, "therapeutic", "therapeutic_IC_CC", "IC+CC");

        create_dummy_variable(data, "gender", "gender_female" , "Female");

        create_dummy_variable(data, "hpv_status", "hpv_status_positive", "Positive");

        create_dummy_variable(data, "hpv_status", "hpv_status_unknown", "Unknown");

        create_dummy_variable(data, "t_category", "t_category_t2", "T2");

        create_dummy_variable(data, "t_category", "t_category_t3", "T3");

        create_dummy_variable(data, "t_category", "t_category_t4", "T4");

        create_dummy_variable(data, "n_category", "n_category_n1", "N1");

        create_dummy_variable(data, "n_category", "n_category_n2", "N2");

        create_dummy_variable(data, "n_category", "n_category_n3", "N3");

        create_dummy_variable(data, "smoke_status", "smoke_status_current", "Current");

        create_dummy_variable(data, "smoke_status", "smoke_status_never", "Never");

        create_dummy_variable(data, "white", "white_white", "White");

        create_dummy_variable(data, "tumor_subsite", "tumor_subsite_tonsil", "Tonsil");

        create_dummy_variable(data, "tumor_subsite", "tumor_subsite_other", "Other");

        create_dummy_variable(data, "neck_boost", "neck_boost_N", "N");

        create_dummy_variable(data, "neck_dissection", "neck_dissection_Y", "Y");

        // call logistic regression

        // console.log(data)
        let final_data = [];
        let data_keys = Object.keys(data[0])
        //not considering dummy id therefore starting from 1
        for(let i = 0 ; i < data.length; i++){
            final_data[i] = []
            for(let key of data_keys){
                //adding the features that are number only
                if(typeof data[0][key] == "number"){
                    final_data[i].push(data[i][key])
                }
            }
            //adding the target
            final_data[i].push(target[i])
            
        }
        // final_data.push(target)
        // console.log(final_data)
        return logistic_regression(final_data)

    }

    function survival_function(data, target){
        console.log("survival_function")
        console.log(target)
    }


    function logistic_regression(trainingData){
        // console.log(trainingData)        
        //this is taken from https://github.com/chen0040/js-regression

        // === Create the logistic regression === //
        // Note that the last column should be y the output
        let logistic = new jsregression.LogisticRegression({
            alpha: 0.001,
            iterations: 1000,
            lambda: 0.0
         });
         // can also use default configuration: var logistic = new jsregression.LogisticRegression();
         
         // === Train the logistic regression === //
        let result = logistic.fit(trainingData);
         
         // === Print the trained model === //
        // console.log(result);
         
         // === Testing the trained logistic regression === //
        //  let probability = []
        //  let predicted = []
        //  for(var i=0; i < trainingData.length; ++i){
        //     probability[i] = logistic.transform(trainingData[i]);
        //     if(probability[i] >= logistic.threshold){
        //         predicted[i] = 1;
        //     }else{
        //         predicted[i] = 0;
        //     }
        //  }
        // //  console.log(probability)

        //  let final_result = {
        //      training_result : result,
        //      testing_probability: probability,
        //      predicted_value: predicted
        // }

        return result;
    }

    function create_dummy_variable(main_data, key, new_key, check_value){
        for(let i = 0 ; i < main_data.length; i++){
            if(main_data[i][key] == check_value){
                main_data[i][new_key] = 1
            }else{
                main_data[i][new_key] = 0
            }
        }
        return main_data;
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
        let mean = sum / count;
        return mean;
    }

    return{
        main
    };
   
};

