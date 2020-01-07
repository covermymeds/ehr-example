EHR Example
============

Example e-prescribing/dashboard app.


### Dependencies
* jQuery
* Backbone
* Underscore
* api-jquery-plugins

### Tests

* Ruby version 1.9.3-p484
* Bundler

Run ``` bundle ``` to install all of the gem dependencies. Once complete
run ``` rspec ``` to run through the tests.

### Installation

Run ``` bundle ``` if you have not installed the gem dependencies. Once
bundle completes run ``` ruby server.rb ``` to serve the ehr example
application using Sinatra.

There is a configuration file with a sample API key in `lib/config.js`, but you'll
want to use your own unique key. Contact us at [ehr-api-request@covermymeds.com](mailto:ehr-api-request@covermymeds.com)
for an API key as well as implementation support.

### Distribution

To concatenate and minify the source files, run `npm install` to install local
Node dependencies (the `lessc` preprocessor). Then run `./build.sh` from the
command line. The resulting source file will be in `dist/src`.

### Walkthrough

This is a simple demo system to show how to integrate CoverMyMeds into
your system using the CoverMyMeds API.

You will need to create four interface elements:

1. a button to start a prior authorization while the provider is
working with an electronic prescription.
2. a prior authorization task list which will be used to show the PAs
being worked upon.
3. a form to start a new prior authorization.
4. a contact page so CoverMyMeds can help your users.

#### e-Prescribing - Patients

The example ehr application gives you the ability to manage patients.
The following goes through the workflow of managing patients,
prescriptions, and prior authorization requests.

Route: ``` /#/patients ```

The patient list view shows patients witin the ehr system. Each patient
has a count beside their name. This indicates the number of PA requests
associated with this patient.

From this view you can add a patient by clicking on the green
"Add Patient" button at the top. Removing a patient can be done by
clicking on the red "Remove" button to the right of the patient name.

Route: ``` /#/patients/:id ```

Clicking on a patient will direct you to the patients show view. There
are two possible scenarios when arriving to this view. If the patient
does not have any prescriptions associated to their record you will be
prompted to add one. However, if the patient has associated
prescriptions you will be directed to a list of prescriptions for that
patient along with their statuses.

Route ``` /#/patients/new ```

If there are no prescriptions present you will be asked to create a new
prescription for that patient. On this page the drug and form search
plugins are used. One thing to consider is that in order for the
form search to make a successful query a drug must be selected from the
drug search field.

To see an example of how the drug and form search plugins are used
navigate to ``` /src/views/requests/add-eprescribe.js  ``` and the
``` /src/templates/requests/add-eprescribe.html ```

If there are prescriptions present then a list of the patients
prescriptions are shown. From here you can change and add drugs, or you
can select the prescriptions you with so start.

Clicking the checkbox to the right of each prescription marks the
selected prescriptions to be sent to the CoverMyMeds API Create Request
Endpoint. When the next button is clicked the example application
gathers the prescriptions and sends them off to be created. All of this
logic is done in the ``` /src/views/patients/list.js ``` file.

Upon completion of these requests you will then be directed to the
pharmacy view to choose a pharmacy and complete the cycle.

Route: ``` /#/requests/new  ```

Allows you to add a single prior authorization request. The drug and
form search plugins are used here as well as the create request plugin.
When the form is filled out and the request is successful you will be
redirected to the task list or dashboard page.

To see an example of how the js-api-consumer plugins are used on this
page view the ``` /src/views/request/add-priorauth.js ``` and ```
/src/templates/requests/add-priorauth.html ``` files.

#### Dashboard/Task List

Route: ``` /#/dashboard ```

This page will query an array of ids supplied to the plugin and come back with
details for each prior authorization request.

To see an example of the dashbord plugin view the ```
/src/views/requests/list.js ``` and ```
/src/templates/requests/list.html ```

#### Contact CoverMyMeds

Route: ``` /#/help ```

The information provided on the help page is supplied via the help
plugin.

To see an example view the ``` /src/views/help.js ``` and
``` /src/templates/help.html ``` files.

