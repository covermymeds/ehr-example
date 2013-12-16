js-dashboard
============

Example e-prescribing/dashboard app.

### Tests

Open `SpecRunner.html` in a browser window.

### Backbone.js view hierarchy
```
  -> DefaultView (index)
(for e-prescribing)
  -> PatientListView (patients/list)
  -> PatientAddView (patients/add)
  -> PatientShowView (patients/show)
  -> DrugListView (drugs/list)
  -> DrugAddView (drugs/add)
  -> FormAddView (forms/add)
(for prior auth)
  -> RequestListView (requests/list)
  -> RequestAddView (requests/add)
```
