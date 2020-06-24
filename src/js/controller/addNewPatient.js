"use strict"

var App = App || {};

let AddNewPatient = function() {

    let self = {
        patientInfo:{},
        all_patients: App.models.patients.getPatients()

    };

    function addNewPatient(){
        $('#add-patient').on('click', function(){
            //test patient.
            //will take the values from the form 
            // console.log(self.all_patients);
            let keys = Object.keys(self.all_patients)
            let initial_length = keys.length;
            // console.log(initial_length)
            //demographics
            //dummy id
            self.patientInfo[$('#add-id').attr('name')] = $('#add-id').val();
            //age
            self.patientInfo[$('#add-age').attr('name')] = $('#add-age').val();
            //Gender
            self.patientInfo[$('#add-gender').attr('name')] = $("input:radio[name=Gender]:checked").val();
            //Race
            self.patientInfo[$('#add-race').attr('name')] = $('#add-race').val();
            //Aspiration
            self.patientInfo[$('#add-aspiration-y').attr('name')] = $("input:radio[name='Aspiration rate Pre-therapy']:checked").val();
            //HPV/P16
            self.patientInfo[$('#add-hpvp16').attr('name')] = $('#add-hpvp16').val();
            //smoking status
            self.patientInfo[$('#add-smoking-never').attr('name')] = $("input:radio[name='Smoking status at Diagnosis (Never/Former/Current)']:checked").val();
            //packs per year
            self.patientInfo[$('#add-packs-per-year').attr('name')] = $('#add-packs-per-year').val();
            
            //cancer descriptors
            //tumoe site
            self.patientInfo[$('#add-tumor-site').attr('name')] = $('#add-tumor-site').val();
            // tumor sub site
            self.patientInfo[$('#add-tumor-subsite').attr('name')] = $('#add-tumor-subsite').val();
            //AJCC 7th
            self.patientInfo[$('#add-ajcc7-1').attr('name')] = $("input:radio[name='AJCC 7th edition']:checked").val();
            //AJCC 8th
            self.patientInfo[$('#add-ajcc8-1').attr('name')] = $("input:radio[name='AJCC 8th edition']:checked").val();
            //T-cat
            self.patientInfo[$('#add-tcat1').attr('name')] = $("input:radio[name='T-category']:checked").val();
            //N-cat
            self.patientInfo[$('#add-ncat-na').attr('name')] = $("input:radio[name='N-category']:checked").val();
            //Pathological Grade
            self.patientInfo[$('#add-pgrade1').attr('name')] = $("input:radio[name='Pathological Grade']:checked").val();
            //affected lymph nodes
            self.patientInfo[$('#add-affected-lymph').attr('name')] = $('#add-affected-lymph').val();

            // treatment info
            //chemotherapy
            self.patientInfo[$('#add-chemo').attr('name')] = $('#add-chemo').val();
            //local therapy
            self.patientInfo[$('#add-local-therapy').attr('name')] = $('#add-local-therapy').val();
            //treatment duration
            self.patientInfo[$('#add-duration').attr('name')] = $('#add-duration').val();
            //total dose
            self.patientInfo[$('#add-total-dose').attr('name')] = $('#add-total-dose').val();
            //total fraction
            self.patientInfo[$('#add-total-fraction').attr('name')] = $('#add-total-fraction').val();
            //dose/fraction
            self.patientInfo[$('#add-dose').attr('name')] = $('#add-dose').val();
            //neck dissection
            self.patientInfo[$('#add-neck-dissection').attr('name')] = $('#add-neck-dissection').val();
            //Neck boost
            self.patientInfo[$('#add-neck-boost-y').attr('name')] = $("input:radio[name='Neck boost (Y/N)']:checked").val();
            //neck dissection
            self.patientInfo[$('#add-os-calculated').attr('name')] = $('#add-os-calculated').val();

            // from patient model adding this values
            // self.patients[i] = d;
            self.patientInfo.AgeAtTx = +(self.patientInfo["Age at Diagnosis (Calculated)"]);
            self.patientInfo["Probability of Survival"] = 0.86568 //+(self.patientInfo["overall_survival_5yr_prob"]);
            self.patientInfo.ID = self.patientInfo["Dummy ID"];
            self.patientInfo.OS = +self.patientInfo["OS (Calculated)"];
            self.patientInfo.Censor = +self.patientInfo.Censor;
            //for attribute statistics
            self.patientInfo.SmokeStatusPacksYear = +self.patientInfo["Smoking status (Packs/Year)"];
            self.patientInfo.TotalDose = +self.patientInfo["Total dose"];
            self.patientInfo.TreatmentDays = +self.patientInfo["Treatment duration (Days)"];

            // console.log(self.patientInfo)
            // console.log(self.all_patients[initial_length])
            self.all_patients[initial_length] = self.patientInfo
            // console.log(self.all_patients)
            //add the patient to the patients list
            App.models.patients.setPatients(self.all_patients)
            //update the landing form dropdown
            //need to find a way to save the data to the file
            App.controllers.landingFormController.setPatientDropdown(".idSelect");
            // location.reload();


            //lets try to write the values to a file
            // const rows = [
            //     ["name1", "city1", "some other info"],
            //     ["name2", "city2", "more info"]
            // ];
            
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
            // let row = value_name.join(",")
            // console.log(typeof row)
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

            // console.log(csvContent)
            
            
            // rows.forEach(function(rowArray) {
            //     let row = rowArray.join(",");
            //     csvContent += row + "\r\n";
            // });

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "newdata.csv");
            document.body.appendChild(link); // Required for FF

            // console.log(self.patientInfo)

            link.click(); // This will download the data file named "my_data.csv".

            // location.reload();


            $(document).ready(function(){
                $.ajax({url: "http://127.0.0.1:5000/", success: function(result){
                  //   console.log(result)
                    location.reload()
                  //   console.log("prediciotn", self.prediction)
                }});
            });

            // $(".landing-form").show();
            // $(".add-patient-form").hide();
            // $(':input').val('');
        });

    }

    return {
        addNewPatient

    }
}