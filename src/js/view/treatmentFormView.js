"use strict"

var App = App || {};

let TreatmentFormView = function () {

    init();

    function init() {
        self.chemoElement = d3.select("#chemo-element");
        self.localTherapyElement = d3.select("#local-therapy-element");
        self.durationElement = d3.select("#duration-element");
        self.totalDoseElement = d3.select("#total-dose-element");
        self.dosePerDayElement = d3.select("#dose-element");
        self.totalFractionElement = d3.select("#total-fraction-element");
        self.neckElement = d3.select("#neck-dissection-element");
        self.neckBoostYesRadio = d3.select("#neck-boost-y-radio");
        self.neckBoostNoRadio = d3.select("#neck-boost-n-radio");
    }

    function updateForm(data) {
        let chemo, local_therapy, neck_boost, dose_per_day, total_dose, total_fractions, duration, neck_dissection = ""
        if(data === undefined){
            chemo = $('#chemo-element').val();
            local_therapy = $('#local-therapy-element').val();
            neck_boost = $("input:radio[name='Neck boost (Y/N)']:checked").val();
            dose_per_day = $('#dose-element').val();
            total_dose = $('#total-dose-element').val();
            total_fractions = $('#total-fraction-element').val();
            duration = $('#duration-element').val();
            neck_dissection = $('#neck-dissection-element').val();
        }else{
            chemo = data["Therapeutic combination"];
            local_therapy = data["Censor"];
            neck_boost = data["Neck boost (Y/N)"];
            dose_per_day = data["Dose/fraction (Gy)"];
            total_dose = data["Total dose"];
            total_fractions = data["Total fractions"]
            duration = data["Treatment duration (Days)"]
            neck_dissection = data["Neck Disssection after IMRT (Y/N)"]
        }
        // let {"Therapeutic combination": chemo, "Censor": local_therapy, "Neck boost (Y/N)":neck_boost,
        // "Dose/fraction (Gy)":dose_per_day, "Total dose":total_dose, "Total fractions":total_fractions, "Treatment duration (Days)":duration,
        // "Neck Disssection after IMRT (Y/N)":neck_dissection} = data;
        setChemoElement(chemo);
        setLocalTherapyElement(local_therapy);
        setNeckBoostElement(neck_boost);
        setTotalDoseElement(total_dose);
        setDosePerDayElement(dose_per_day);
        setTotalFractionElement(total_fractions);
        setDurationElement(duration);
        setNeckElement(neck_dissection);
    }

    function consolidateData() {
        return {
            "chemo": getChemoElement(),
            "local_therapy": getLocalTherapyElement(),
            "duration": getDurationElement(),
            "total_dose": getTotalDoseElement(),
            "dose_per_day": getDosePerDayElement(),
            "total_fraction": getTotalFractionElement(),
            "neck_dissection": getNeckElement(),
            "neck_boost": getNeckBoostElement()
        }
    }

    function getChemoElement() {
        return self.chemoElement.attr("value");
    }

    function setChemoElement(data) {
        if (data !== undefined) {
            // self.chemoElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("chemo-element").value = data;
        }
    }

    function getLocalTherapyElement() {
        return self.localTherapyElement.attr("value");
    }

    function setLocalTherapyElement(data) {
        if (data !== undefined) {
            // self.localTherapyElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("local-therapy-element").value = data;
        }
    }

    function getDurationElement() {
        return self.durationElement.attr("value");
    }

    function setDurationElement(data) {
        if (data !== undefined) {
            // self.durationElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("duration-element").value = data;

        }
    }

    function getTotalDoseElement() {
        return self.totalDoseElement.attr("value");
    }

    function setTotalDoseElement(data) {
        if (data !== undefined) {
            // self.totalDoseElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("total-dose-element").value = data;

        }
    }

    function getDosePerDayElement() {
        return self.dosePerDayElement.attr("value");
    }

    function setDosePerDayElement(data) {
        if (data !== undefined) {
            // self.dosePerDayElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("dose-element").value = data;

        }
    }

    function getTotalFractionElement() {
        return self.totalFractionElement.attr("value");
    }

    function setTotalFractionElement(data) {
        if (data !== undefined) {
            // self.totalFractionElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("total-fraction-element").value = data;

        }
    }

    function getNeckElement() {
        return self.neckElement.attr("value");
    }

    function setNeckElement(data) {
        if (data !== undefined) {
            // self.neckElement
            //     .attr("value", data)
            //     .text(data);
            document.getElementById("neck-dissection-element").value = data;

        }
    }

    function getNeckBoostElement() {
        let neckBoostYes = self.neckBoostYesRadio.property("checked");
        let neckBoostNo = self.neckBoostNoRadio.property("checked");

        if (neckBoostYes)
            return "yes";
        if (neckBoostNo)
            return "no";

        return null;
    }

    function setNeckBoostElement(data) {
        data = data.toLowerCase();
        if (data !== undefined) {
            if (data === "yes" || data==="y") {
                self.neckBoostYesRadio
                    .property("checked", true);
                self.neckBoostNoRadio
                    .property("checked", false);
            } else if (data === "no" || data === "n") {
                self.neckBoostYesRadio
                    .property("checked", false);
                self.neckBoostNoRadio
                    .property("checked", true);
            }
        }
    }

    return {
        updateForm,
        consolidateData
    }
}