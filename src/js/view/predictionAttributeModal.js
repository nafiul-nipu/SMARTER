"use strict"

var App = App || {};

let PreditictionAttributeModal = function(){
    let self = {
        attributeList : []
    }

    init();
    
    function init(){

        $("#attributeModal").on("click", function(){
            $("#predictionModalBody").empty();
        });
        
        
    }

};