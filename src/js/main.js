"use strict"

var App = App || {};

(function() {
  App.models = {};
  App.controllers = {};
  App.views = {};

  App.numberOfPatients = null;

  App.init = function() {
    // creat models
    App.models.patients = new PatientModel();
    App.models.applicationState = new ApplicationStateModel();

    // create controllers
    App.controllers.patientSelector = new PatientSelectorController();

    // creat views
    App.views.kiviatDiagramView = new KiviatDiagramView();
    App.views.kiviatDiagramView.init("kiviatDiagram");

    // load patients
    App.models.patients.loadPatients()
      .then(function(/*data*/){
        console.log("Promise Finished"/*, data*/);

        App.numberOfPatients = App.models.patients.getPatientNumber();

        // test
        let filters = {'Ethnicity': 'white', 'Site': 'supraglottic'};
        let filters2 = {'Ethnicity': 'white', 'Site': 'supraglottic', 'Gender': 'male', 'Tcategory': 'T4'};
        App.models.applicationState.setAttributeFilters({});

        App.controllers.patientSelector.attachToSelect(".patient-dropdown");
        App.controllers.patientSelector.updatePateintDropDown();

      })
      .catch(function(err) {
        console.log("Promise Error", err);
      });
  };

})();
