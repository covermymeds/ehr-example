# eHR TODO

* Functional tests
  1. Add patient
  2. Add drug to patient
  3. Create request w/ drug
  4. View dashboard
  5. Create standalone request
  6. View "help" page

* Either fix grunt-jasmine or get rid of it

* Add "delete patient" button
* Grey out checkbox for "sent" requests
* Pagination for Dashboard

number_of_pages = Math.floor(results / results_per_page)

to_template = results.slice(current_page * results_per_page,
results_per_page)

43

results.slice(40, 10) = 3 results

var requests = '';
$.ajax({
  success: function (data) {
    requests = data;  
    
    // Draw html here
    // Draw nav links here
    // Write pagination event handlers here
  }
})


