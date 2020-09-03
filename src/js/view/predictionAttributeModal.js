"use strict"

var App = App || {};

let PreditictionAttributeModal = function(){
    let self = {
        attributeList : ["Therapeutic combination", "Gender","Age at Diagnosis (Calculated)",
         "HPV/P16 status", "T-category", "N-category", 
         "Smoking status at Diagnosis (Never/Former/Current)", "Race", 
         "Smoking status (Packs/Year)", 
         "Tumor subsite (BOT/Tonsil/Soft Palate/Pharyngeal wall/GPS/NOS)", 
         "Total dose"],
         default: true
    }

    // init();
    
    function attribute_List(){
        $("#featurePicture").empty();
        // if(self.default == true){

        // }else{

        // }

        let list = ""
        
            
            
            
        axios({url: 'http://127.0.0.1:5000/picture',
             method: 'get',
             responseType: 'arraybuffer',
             headers: {'cache-control': "public, max-age=0"},
             data: self.default
                })
                .then(function (response) {
                    console.log(self.default)
                    self.default = false
                    console.log(response)
                    // <img id="image">
                    // let imageNode = document.getElementById('image');
                    let blob = new Blob(
                        [response.data], 
                        {type: response.headers['content-type']}
                    )
                    let imgUrl = URL.createObjectURL(blob)
                    console.log(imgUrl)
                    list = list + "<img src = '" + imgUrl + "' style='width: 100%; display: block; margin-left: auto; margin-right: auto;' >"
                    // console.log(list)
                    // imageNode.src = imgUrl
                    $("#featurePicture").html(list);

                })
                .catch(function (error) {
                    console.log(error);
                });

        // console.log(list)
        
        
        
    }

    return{
        attribute_List
    }

};