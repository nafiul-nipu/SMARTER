"use strict"

var App = App || {};

let AddNewPatient = function() {

    let self = {
        patientInfo:{},
        all_patients: App.models.patients.getPatients(),
        patientID : 0,
        change_made : false
    };

    function addNewPatient(){
        $('.submitButton').on('click', function(){
            // console.log($('.idSelect').val())
            self.patientID = $('.idSelect').val();
            //getting the index number of the patient from the dataset using the dummy ID
            let patient_index = App.models.patients.getPatientIDFromDummyID(self.patientID);
            // console.log(patient_index)
            //getting the patients data using the index
            self.patientInfo = App.models.patients.getPatientByID(patient_index);
            console.log(self.patientInfo)

            //check if the value is changed.. if chaged update the value
            //age
            if(self.patientInfo[$('#age-element').attr('name')] != $('#age-element').val()){
                self.patientInfo[$('#age-element').attr('name')] = $('#age-element').val();
                self.patientInfo.AgeAtTx = +(self.patientInfo["Age at Diagnosis (Calculated)"]);
                self.change_made = true;
                console.log("age",self.patientInfo[$('#age-element').attr('name')] , $('#age-element').val())
            }
            //Gender
            if(self.patientInfo[$('#male-radio').attr('name')] != $("input:radio[name=Gender]:checked").val()){
                self.patientInfo[$('#male-radio').attr('name')] = $("input:radio[name=Gender]:checked").val();
                self.change_made = true;
                console.log("gender", self.patientInfo[$('#male-radio').attr('name')] , $("input:radio[name=Gender]:checked").val())
            }
            //Race
            if(self.patientInfo[$('#race-element').attr('name')] != $('#race-element').val()){
                self.patientInfo[$('#race-element').attr('name')] = $('#race-element').val();
                self.change_made = true;
                console.log("race", self.patientInfo[$('#race-element').attr('name')],$('#race-element').val())
            }
            //Aspiration
            if(self.patientInfo[$('#aspiration-y-radio').attr('name')] != $("input:radio[name='Aspiration rate Pre-therapy']:checked").val()){
                self.patientInfo[$('#aspiration-y-radio').attr('name')] = $("input:radio[name='Aspiration rate Pre-therapy']:checked").val();
                self.change_made = true;
                console.log("aspiration",self.patientInfo[$('#aspiration-y-radio').attr('name')],$("input:radio[name='Aspiration rate Pre-therapy']:checked").val())
            }
            //HPV/P16
            if(self.patientInfo[$('#hpvp16-element').attr('name')] != $('#hpvp16-element').val()){
                self.patientInfo[$('#hpvp16-element').attr('name')] = $('#hpvp16-element').val();
                self.change_made = true;
                console.log("hpv",self.patientInfo[$('#hpvp16-element').attr('name')], $('#hpvp16-element').val())
            }
            //smoking status
            if(self.patientInfo[$('#smoking-never-radio').attr('name')] != $("input:radio[name='Smoking status at Diagnosis (Never/Former/Current)']:checked").val()){
                self.patientInfo[$('#smoking-never-radio').attr('name')] = $("input:radio[name='Smoking status at Diagnosis (Never/Former/Current)']:checked").val();
                self.change_made = true;
                console.log("smoking status",self.patientInfo[$('#smoking-never-radio').attr('name')], $("input:radio[name='Smoking status at Diagnosis (Never/Former/Current)']:checked").val())
            }
            //packs per year
            if(self.patientInfo[$('#packs-per-year-element').attr('name')] != $('#packs-per-year-element').val()){
                self.patientInfo[$('#packs-per-year-element').attr('name')] = $('#packs-per-year-element').val();
                self.patientInfo.SmokeStatusPacksYear = +self.patientInfo["Smoking status (Packs/Year)"];
                self.change_made = true;
                console.log("packs per year",self.patientInfo[$('#packs-per-year-element').attr('name')], $('#packs-per-year-element').val())
            }
            
            //cancer descriptors
            //tumoe site
            if(self.patientInfo[$('#tumor-site').attr('name')] != $('#tumor-site').val()){
                self.patientInfo[$('#tumor-site').attr('name')] = $('#tumor-site').val();
                self.change_made = true;
                console.log("tumor site",self.patientInfo[$('#tumor-site').attr('name')], $('#tumor-site').val())
            }
            // tumor sub site
            if(self.patientInfo[$('#tumor-subsite').attr('name')] != $('#tumor-subsite').val()){
                self.patientInfo[$('#tumor-subsite').attr('name')] = $('#tumor-subsite').val();
                self.change_made = true;
                console.log("tumor subsite",self.patientInfo[$('#tumor-subsite').attr('name')], $('#tumor-subsite').val())
            }
            //AJCC 7th
            if(self.patientInfo[$('#ajcc7-1').attr('name')] != $("input:radio[name='AJCC 7th edition']:checked").val()){
                self.patientInfo[$('#ajcc7-1').attr('name')] = $("input:radio[name='AJCC 7th edition']:checked").val();
                self.change_made = true;
                console.log("ajcc 7th",self.patientInfo[$('#ajcc7-1').attr('name')], $("input:radio[name='AJCC 7th edition']:checked").val())
            }
            //AJCC 8th
            if(self.patientInfo[$('#ajcc8-1').attr('name')] != $("input:radio[name='AJCC 8th edition']:checked").val()){
                self.patientInfo[$('#ajcc8-1').attr('name')] = $("input:radio[name='AJCC 8th edition']:checked").val();
                self.change_made = true;
                console.log("ajcc 8th", self.patientInfo[$('#ajcc8-1').attr('name')], $("input:radio[name='AJCC 8th edition']:checked").val())
            }
            //T-cat
            if(self.patientInfo[$('#tcat1').attr('name')] != $("input:radio[name='T-category']:checked").val()){
                self.patientInfo[$('#tcat1').attr('name')] = $("input:radio[name='T-category']:checked").val();
                self.change_made = true;
                console.log("t category", self.patientInfo[$('#tcat1').attr('name')], $("input:radio[name='T-category']:checked").val())
            }
            //N-cat
            if(self.patientInfo[$('#ncat-na').attr('name')] != $("input:radio[name='N-category']:checked").val()){
                self.patientInfo[$('#ncat-na').attr('name')] = $("input:radio[name='N-category']:checked").val();
                self.change_made = true;
                console.log("n category", self.patientInfo[$('#ncat-na').attr('name')], $("input:radio[name='N-category']:checked").val())
            }
            //Pathological Grade
            if(self.patientInfo[$('#pgrade1').attr('name')] != $("input:radio[name='Pathological Grade']:checked").val()){
                self.patientInfo[$('#pgrade1').attr('name')] = $("input:radio[name='Pathological Grade']:checked").val();
                self.change_made = true;
                console.log("pathological grade", self.patientInfo[$('#pgrade1').attr('name')], $("input:radio[name='Pathological Grade']:checked").val())
            }
            //affected lymph nodes
            if(self.patientInfo[$('#affected-lymph').attr('name')] != $('#affected-lymph').val()){
                self.patientInfo[$('#affected-lymph').attr('name')] = $('#affected-lymph').val();
                self.change_made = true;
                console.log("lymph node", self.patientInfo[$('#affected-lymph').attr('name')], $('#affected-lymph').val())
            }

            // treatment info
            //chemotherapy
            if(self.patientInfo[$('#chemo-element').attr('name')] != $('#chemo-element').val()){
                self.patientInfo[$('#chemo-element').attr('name')] = $('#chemo-element').val();
                self.change_made = true;
                console.log("therapeutic combination", self.patientInfo[$('#chemo-element').attr('name')], $('#chemo-element').val())
            }
            //local therapy
            if(self.patientInfo[$('#local-therapy-element').attr('name')] != $('#local-therapy-element').val()){
                self.patientInfo[$('#local-therapy-element').attr('name')] = $('#local-therapy-element').val();
                self.patientInfo.Censor = +self.patientInfo.Censor;
                self.change_made = true;
                console.log("censor", self.patientInfo[$('#local-therapy-element').attr('name')], $('#local-therapy-element').val())
            }
            //treatment duration
            if(self.patientInfo[$('#duration-element').attr('name')] != $('#duration-element').val()){
                self.patientInfo[$('#duration-element').attr('name')] = $('#duration-element').val();
                self.patientInfo.TreatmentDays = +self.patientInfo["Treatment duration (Days)"];
                self.change_made = true;
                console.log("treatment duration", self.patientInfo[$('#duration-element').attr('name')], $('#duration-element').val())
            }
            //total dose
            if(self.patientInfo[$('#total-dose-element').attr('name')] != $('#total-dose-element').val()){
                self.patientInfo[$('#total-dose-element').attr('name')] = $('#total-dose-element').val();
                self.patientInfo.TotalDose = +self.patientInfo["Total dose"];
                self.change_made = true;
                console.log("total dose", self.patientInfo[$('#total-dose-element').attr('name')], $('#total-dose-element').val())
            }
            //total fraction
            if(self.patientInfo[$('#total-fraction-element').attr('name')] != $('#total-fraction-element').val()){
                self.patientInfo[$('#total-fraction-element').attr('name')] = $('#total-fraction-element').val();
                self.change_made = true;
                console.log("total fraction", self.patientInfo[$('#total-fraction-element').attr('name')], $('#total-fraction-element').val())
            }
            //dose/fraction
            if(self.patientInfo[$('#dose-element').attr('name')] != $('#dose-element').val()){
                self.patientInfo[$('#dose-element').attr('name')] = $('#dose-element').val();
                self.change_made = true;
                console.log("total dose", self.patientInfo[$('#dose-element').attr('name')], $('#dose-element').val())
            }
            //neck dissection
            if(self.patientInfo[$('#neck-dissection-element').attr('name')] != $('#neck-dissection-element').val()){
                self.patientInfo[$('#neck-dissection-element').attr('name')] = $('#neck-dissection-element').val();
                self.change_made = true;
                console.log("neck dissection", self.patientInfo[$('#neck-dissection-element').attr('name')], $('#neck-dissection-element').val())
            }
            //Neck boost
            if(self.patientInfo[$('#neck-boost-y-radio').attr('name')] != $("input:radio[name='Neck boost (Y/N)']:checked").val()){
                self.patientInfo[$('#neck-boost-y-radio').attr('name')] = $("input:radio[name='Neck boost (Y/N)']:checked").val();
                self.change_made = true;
                console.log("neck boost", self.patientInfo[$('#neck-boost-y-radio').attr('name')], $("input:radio[name='Neck boost (Y/N)']:checked").val())
            }

            console.log(self.patientInfo)
            if(self.change_made == true){
                App.models.patients.updatePatient(self.patientInfo);
            }

            // self.all_patients[initial_length] = self.patientInfo
            // console.log(self.all_patients)
            //add the patient to the patients list
            // App.models.patients.setPatients(self.all_patients)

            /*
            //server connection

            $(document).ready(function(){
                $.ajax({url: "http://127.0.0.1:5000/", success: function(result){
                  //   console.log(result)
                    // location.reload()
                  //   console.log("prediciotn", self.prediction)
                }});
            });
            */            

            /*
            // saving the values to a csv file
            // not necessary now
            let csvContent = "data:text/csv;charset=utf-8,";

            // console.log(length)
            let value_name = Object.keys(self.all_patients[0])
            let new_keys = Object.keys(self.all_patients)
            let new_length = new_keys.length;
            console.log(new_length)
            //add the names first to the csvcontent
            let string = ""
            for(let i = 0 ; i < value_name.length - 1 ; i++){
                if(value_name[i].includes(",")){
                    string += '"' + value_name[i] + '",' ;
                }else{
                    string += value_name[i] + "," ;
                }
                
            }
            string += value_name[value_name.length - 1]
            // console.log(string)
            csvContent += string + "\r\n"
            // console.log(csvContent)
            for(let index = 0 ; index < new_length ; index++){
                let rowArray = []
                for(let value of value_name){
                    rowArray.push(self.all_patients[index][value])
                }
                // console.log(rowArray)
                let row = ""
                for(let i = 0 ; i < rowArray.length - 1 ; i++){
                    let type = typeof rowArray[i];
                    // console.log(type)
                    if(type == "string"){
                        if(rowArray[i].includes(",")){
                            row += '"' + rowArray[i] + '",';
                        }else{
                            row += rowArray[i] + ",";
                        }
                    }else{
                        row += rowArray[i] + ",";
                    }
                }
                row += rowArray[rowArray.length - 1];

                csvContent += row + "\r\n"
            }

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "newdata.csv");
            document.body.appendChild(link); // Required for FF

            // console.log(self.patientInfo)

            link.click(); // This will download the data file named "my_data.csv".

            */
        });

    }

    return {
        addNewPatient

    }
}