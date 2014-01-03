/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: {
            "sent": false,
            "request": {
                "urgent": "",
                "form_id": "",
                "state": "",
                "patient": {
                    "first_name": "",
                    "middle_name": "",
                    "last_name": "",
                    "date_of_birth": "",
                    "gender": "",
                    "email": "",
                    "health_plan_name": "",
                    "member_id": "",
                    "group_id": "",
                    "phone_number": "",
                    "address": {
                        "street_1": "",
                        "street_2": "",
                        "city": "",
                        "state": "",
                        "zip": ""
                    }
                },
                "prescriber": {
                    "npi": "",
                    "first_name": "",
                    "last_name": "",
                    "clinic_name": "",
                    "address": {
                        "street_1": "",
                        "street_2": "",
                        "city": "",
                        "state": "",
                        "zip": ""
                    },
                    "fax_number": "",
                    "phone_number": ""
                },
                "prescription": {
                    "drug_id": "",
                    "strength": "",
                    "frequency": "",
                    "enumerated_fields": "",
                    "refills": "",
                    "dispense_as_written": "",
                    "quantity": "",
                    "days_supply": ""
                },
                "pharmacy": {
                    "name": "",
                    "address": {
                        "street_1": "",
                        "street_2": "",
                        "city": "",
                        "state": "",
                        "zip": ""
                    },
                    "fax_number": "",
                    "phone_number": ""
                },
                "enumerated_fields": {
                    "icd9_0": "",
                    "icd9_1": "",
                    "icd9_2": "",
                    "failed_med_0": "",
                    "failed_med_1": "",
                    "failed_med_2": "",
                    "failed_med_3": "",
                    "failed_med_4": "",
                    "failed_med_5": "",
                    "failed_med_6": "",
                    "failed_med_7": "",
                    "failed_med_8": "",
                    "failed_med_9": ""
                }
            }
        }
    });

});

