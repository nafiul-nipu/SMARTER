"use strict";

let NomogramAxisController = function(listID) {
    let self = {
        list: null,
        selector: null,
        toggleButtons: null,

        checkboxStates: {},
        editMode: "domain",
        selectedAxis: null,

        sliderSvg: null
    };

    init();

    function init() {
        let attributes = App.patientKnnAttributes;

        for (let attribute of attributes) {
            self.checkboxStates[attribute] = true;
        }

        axisHeightSlider();
    }

    function attachToList(listID) {
        let attributes = App.patientKnnAttributes;

        self.list = d3.select(listID);

        self.list.selectAll(".checkbox-li")
            .data(attributes)
            .enter().append("li")
            .attr("class", "checkbox-li")
            .each(function(d, i) {
                let div = d3.select(this).append("div").attr("class", "checkbox");

                div.append("input")
                    .attr("class", "separated-checkbox")
                    .attr("checked", true)
                    .attr("type", "checkbox")
                    .attr("value", d)
                    .attr("id", "nomoVisCheck" + d)
                    .on("click", checkboxOnChange);

                div.append("label")
                    .attr("for", "nomoVisCheck" + d)
                    .on("click", function() {
                        d3.event.stopPropagation(); // prevent menu close on label click
                    })
                    .text(d);
            });
    }

    function attachToSelect(selectID) {
        // let attributes = App.patientKnnAttributes;
        // include age and surv prob axes
        let attributes = Object.keys(App.nomogramAxesRange);

        self.select = d3.select(selectID)
            .on("change", selectorOnChange);

        self.select.selectAll("option")
            .data(attributes)
            .enter().append("option")
            .attr("value", d => d)
            .text(d => d);

        this.selectedAxis = self.select.node().value;
    }

    function attachToDomainRangeToggle(domainID, rangeID) {
        self.toggleButtons = d3.selectAll("#nomogramAxisButton")
            .on("click", toggleButtonOnClick);
    }



    function checkboxOnChange() {
        let checkbox = d3.select(this).node();

        self.checkboxStates[checkbox.value] = checkbox.checked;

        updateNomogramAxisVisibility();
    }

    function selectorOnChange() {
        self.selectedAxis = d3.select(this).node().value;

        console.log(self.selectedAxis);
    }

    function toggleButtonOnClick() {
        self.editMode = d3.select(this).attr("value");

        self.toggleButtons
            .classed("active", function() {
                return d3.select(this).attr("value") === self.editMode;
            });

        console.log(self.editMode);
    }

    function updateNomogramAxisVisibility() {
        App.views.nomogram.updateAxisVisibility(self.checkboxStates);
    }

    function axisHeightSlider() {
        let sliderElement = d3.select("#axisHeightSlider");

        self.slider = sliderElement.append("svg")
            .attr("width", sliderElement.node().clientWidth)
            .attr("height", sliderElement.node().clientHeight)
            .style("background-color", "lightgray");

    }

    return {
        attachToList,
        attachToSelect,
        attachToDomainRangeToggle
    };
};
