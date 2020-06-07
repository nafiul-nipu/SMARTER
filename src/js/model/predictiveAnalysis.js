/**
 * this code is a conversion from R code 
 */

"use strict"

var App = App || {};

let predictiveAnalysis = function(){
    let self = {
        data : {},
        feature_data: {
            ID : [],
            white: [],
            smoke_status: [],
            pack_year: [],
            age: [],
            neck_boost: [],
            neck_dissection: [],
            tumor_subsite: [],
            t_category: [],
            n_category: [],
            gender: [],
            hpv_status: [],
            therapeutic:[]
        },
        binary_outcome: {
            ID:[],
            feeding_tube: [],
            aspiration: []
        }, //feeding tube and aspiration
        censor_outcome: {
            ID:[]
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
        for(let index in self.data){
            // removing the feeding tube entries that does not have any value
            if(self.data[index]["Feeding tube 6m"] == "N" || self.data[index]["Feeding tube 6m"] == "Y"){
                //dummy id of all of the patients
                self.feature_data.ID.push(self.data[index]["Dummy ID"]);
                self.binary_outcome.ID.push(self.data[index]["Dummy ID"]);
                self.censor_outcome.ID.push(self.data[index]["Dummy ID"]);
                
                //ajcc stage 8th addition
                // self.feature_data[count].ajcc_stage = self.data[index]["AJCC 8th edition"]
                
                //race - white/caucasion = 1 , rest = 0
                if(self.data[index]["Race"] == "White/Caucasion"){
                    self.feature_data.white.push("White");
                }else{
                    self.feature_data.white.push("Other");
                }
                
                //smoke status - change - formar will be former
                // dummy variables - two variables - Never , Current
                if(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"] == "Formar"){
                    self.feature_data.smoke_status.push("Former");
                }else{
                    self.feature_data.smoke_status.push(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"]);
                }

                //pack per year 
                //if smoke status is never = 0
                // for NA take the mean
                if(self.data[index]["Smoking status at Diagnosis (Never/Former/Current)"] == "Never"){
                    self.feature_data.pack_year.push(0);
                }else if(isNaN(self.data[index]["SmokeStatusPacksYear"])){
                    //take the mean
                    self.feature_data.pack_year.push(pack_year_mean);
                }else{
                    self.feature_data.pack_year.push(self.data[index]["SmokeStatusPacksYear"]);
                }

                //age at diagnosis calculated
                self.feature_data.age.push(self.data[index]["AgeAtTx"]);

                //neck_boost
                self.feature_data.neck_boost.push(self.data[index]["Neck boost (Y/N)"]);

                //neck_dissection
                self.feature_data.neck_dissection.push(self.data[index]["Neck Disssection after IMRT (Y/N)"]);

                // tumor_subsite
                self.feature_data.tumor_subsite.push(self.data[index]["Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)"]);

                //t-category Tis and Tx will be t1
                if(self.data[index]["T-category"] == "Tis" || self.data[index]["T-category"] == "Tx"){
                    self.feature_data.t_category.push("T1");
                }else{
                    self.feature_data.t_category.push( self.data[index]["T-category"]);
                }

                //n-category
                self.feature_data.n_category.push(self.data[index]["N-category"]);

                //gender
                self.feature_data.gender.push(self.data[index]["Gender"]);

                //hpv status
                self.feature_data.hpv_status.push(self.data[index]["HPV/P16 status"]);

                //therapeutic combination
                self.feature_data.therapeutic.push(self.data[index]["Therapeutic combination"]);

                //let's take the binary outcomes
                // feeding tube 
                // if feeding tube is N then set 0 otherwise 1
                if(self.data[index]["Feeding tube 6m"] == "N"){
                    self.binary_outcome.feeding_tube.push(0);
                }else{
                    self.binary_outcome.feeding_tube.push(1);

                }

                //aspiration
                // aspiration is N then set 0 otherwise 1
                if(self.data[index]["Aspiration rate(Y/N)"] == "N"){
                    self.binary_outcome.aspiration.push(0);
                }else{
                    self.binary_outcome.aspiration.push(1);

                }

                //survival will be added later here

            }           
        }

        // console.log(self.feature_data)
        // console.log(self.binary_outcome)
        // we completed to take the data.. 
        // now we will send them to their destination functions
        // feeding_tube_function(self.feature_data, self.binary_outcome.feeding_tube)
        aspiration_function(self.feature_data, self.binary_outcome.aspiration)
        // survival_function(self.feature_data, self.censor_outcome)

    }

    function feeding_tube_function(data, target){
        // in this funciton we will make the dummy variables
        //then we will call the logistic regression
        console.log("feeding tube")
        console.log(data)
        //dummy variables
        data.therapeutic_CC = [];
        data.therapeutic_CC = create_dummy_variable(data.therapeutic, data.therapeutic_CC, "CC");

        data.therapeutic_IC_CC = [];
        data.therapeutic_IC_CC = create_dummy_variable(data.therapeutic, data.therapeutic_IC_CC, "IC+CC");

        data.therapeutic_Radiation_alone = [];
        data.therapeutic_Radiation_alone = create_dummy_variable(data.therapeutic, data.therapeutic_Radiation_alone, "Radiation alone");

        data.gender_female = [];
        data.gender_female = create_dummy_variable(data.gender, data.gender_female, "Female");

        data.hpv_status_positive = [];
        data.hpv_status_positive = create_dummy_variable(data.hpv_status, data.hpv_status_positive, "Positive");

        data.hpv_status_unknown = [];
        data.hpv_status_unknown = create_dummy_variable(data.hpv_status, data.hpv_status_unknown, "Unknown");

        data.t_category_t2 = [];
        data.t_category_t2 = create_dummy_variable(data.t_category, data.t_category_t2, "T2");

        data.t_category_t3 = [];
        data.t_category_t3 = create_dummy_variable(data.t_category, data.t_category_t3, "T3");

        data.t_category_t4 = [];
        data.t_category_t4 = create_dummy_variable(data.t_category, data.t_category_t4, "T4");

        data.n_category_n1 = [];
        data.n_category_n1 = create_dummy_variable(data.n_category, data.n_category_n1, "N1");

        data.n_category_n2 = [];
        data.n_category_n2 = create_dummy_variable(data.n_category, data.n_category_n2, "N2");

        data.n_category_n3 = [];
        data.n_category_n3 = create_dummy_variable(data.n_category, data.n_category_n3, "N3");

        data.smoke_status_current = [];
        data.smoke_status_current = create_dummy_variable(data.smoke_status, data.smoke_status_current, "Current");

        data.smoke_status_never = [];
        data.smoke_status_never = create_dummy_variable(data.smoke_status, data.smoke_status_never, "Never");

        data.white_other = [];
        data.white_other = create_dummy_variable(data.white, data.white_other, "Other");

        data.tumor_subsite_bot = [];
        data.tumor_subsite_bot = create_dummy_variable(data.tumor_subsite, data.tumor_subsite_bot, "BOT");

        data.tumor_subsite_other = [];
        data.tumor_subsite_other = create_dummy_variable(data.tumor_subsite, data.tumor_subsite_other, "Other");

        data.neck_boost_N = [];
        data.neck_boost_N = create_dummy_variable(data.neck_boost, data.neck_boost_N, "N");

        data.neck_dissection_Y = [];
        data.neck_dissection_Y = create_dummy_variable(data.neck_dissection, data.neck_dissection_Y, "Y");

        // call logistic regression
    }

    function aspiration_function(data, target){
        // in this funciton we will make the dummy variables
        //then we will call the logistic regression
        console.log("aspiration_function")
        console.log(data)

        //dummy variables
        data.therapeutic_IC_Radiation_alone = [];
        data.therapeutic_IC_Radiation_alone = create_dummy_variable(data.therapeutic, data.therapeutic_IC_Radiation_alone, "IC+Radiation alone");

        data.therapeutic_CC = [];
        data.therapeutic_CC = create_dummy_variable(data.therapeutic, data.therapeutic_CC, "CC");

        data.therapeutic_IC_CC = [];
        data.therapeutic_IC_CC = create_dummy_variable(data.therapeutic, data.therapeutic_IC_CC, "IC+CC");

        data.gender_female = [];
        data.gender_female = create_dummy_variable(data.gender, data.gender_female, "Female");

        data.hpv_status_positive = [];
        data.hpv_status_positive = create_dummy_variable(data.hpv_status, data.hpv_status_positive, "Positive");

        data.hpv_status_unknown = [];
        data.hpv_status_unknown = create_dummy_variable(data.hpv_status, data.hpv_status_unknown, "Unknown");

        data.t_category_t2 = [];
        data.t_category_t2 = create_dummy_variable(data.t_category, data.t_category_t2, "T2");

        data.t_category_t3 = [];
        data.t_category_t3 = create_dummy_variable(data.t_category, data.t_category_t3, "T3");

        data.t_category_t4 = [];
        data.t_category_t4 = create_dummy_variable(data.t_category, data.t_category_t4, "T4");

        data.n_category_n1 = [];
        data.n_category_n1 = create_dummy_variable(data.n_category, data.n_category_n1, "N1");

        data.n_category_n2 = [];
        data.n_category_n2 = create_dummy_variable(data.n_category, data.n_category_n2, "N2");

        data.n_category_n3 = [];
        data.n_category_n3 = create_dummy_variable(data.n_category, data.n_category_n3, "N3");

        data.smoke_status_current = [];
        data.smoke_status_current = create_dummy_variable(data.smoke_status, data.smoke_status_current, "Current");

        data.smoke_status_never = [];
        data.smoke_status_never = create_dummy_variable(data.smoke_status, data.smoke_status_never, "Never");

        data.white_white = [];
        data.white_white = create_dummy_variable(data.white, data.white_white, "White");

        data.tumor_subsite_tonsil = [];
        data.tumor_subsite_tonsil = create_dummy_variable(data.tumor_subsite, data.tumor_subsite_tonsil, "Tonsil");

        data.tumor_subsite_other = [];
        data.tumor_subsite_other = create_dummy_variable(data.tumor_subsite, data.tumor_subsite_other, "Other");

        data.neck_boost_N = [];
        data.neck_boost_N = create_dummy_variable(data.neck_boost, data.neck_boost_N, "N");

        data.neck_dissection_Y = [];
        data.neck_dissection_Y = create_dummy_variable(data.neck_dissection, data.neck_dissection_Y, "Y");

        //call logistic regression
        //this is a test of adding the data for finalization
        // let test = []
        // let test_count = 0;
        // let keys = Object.keys(data)
        // for(let x = 1 ; x < 5 ; x++){
        //     let key = keys[x];
        //     if(typeof data[key][0] == "number"){
        //         test[test_count] = data[key];
        //         test_count++;
        //     }
        // }
        console.log(test)
    }

    function survival_function(data, target){
        console.log("survival_function")
        console.log(target)
    }

    function create_dummy_variable(check, dummy, to_check){
        // console.log(check)
        // console.log(to_check)
        for(let i = 0 ; i < check.length ; i ++){
            if(check[i] == to_check){
                dummy.push(1);
            }else{
                dummy.push(0);
            }
        }
        // console.log(dummy)
        return dummy;
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

