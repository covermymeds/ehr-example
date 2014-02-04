/*jslint sloppy: true, nomen: true, white: true */
/*global window: false, _: false */
(function() {
    window.JST = {};

    window.JST.dashboard = _.template([
        '<div class="row">',
        '<div class="col-md-3">',
            '<form action="#" class="well" method="get" role="form">',
            '<fieldset>',
                '<legend>Search</legend>',
                '<div class="form-group"><input class="form-control" name="patient_first_name" placeholder="First Name" size="30" type="text" value="<%= filters.firstName %>"></div>',
                '<div class="form-group"><input class="form-control" name="patient_last_name" placeholder="Last Name" size="30" type="text" value="<%= filters.lastName %>"></div>',
                '<div class="form-group"><input class="form-control" data-behavior="datepicker" name="patient_date_of_birth" placeholder="Date of Birth" size="30" type="text" value="<%= filters.dob %>"></div>',
                '<div class="form-group"><input class="form-control" name="drug_name" placeholder="Drug" size="30" type="text" value="<%= filters.drug %>"></div>',
                '<div class="form-group"><input class="form-control" name="request_id" placeholder="Key" size="30" type="text" value="<%= filters.key %>"></div>',
                '<div class="form-group">',
                    '<button class="btn btn-primary search" type="submit">Search</button> ',
                    '<button class="btn search clear">Clear</button>',

                '</div>',
              '</fieldset>',
            '</form>',
        '</div>',
        '<div class="col-md-9">',
        '<table class="table table-striped requests">',
        '<% _.each(requests, function (request) { %>',
            '<tr>',
                '<td class="form-thumbnail">',
                    '<% if (request.form_id) { %>',
                    '<img src="https://www.covermymeds.com/forms/pdf/thumbs/90/highmark_west_virginia_prescription_drug_medication_6827.jpg">',
                    '<% } else { %>',
                    '<img src="https://www.covermymeds.com/styles_r2/images/pick_the_form.png">',
                    '<% } %>',
                '</td>',
                '<td>',
                    '<h4><%= request.patient.first_name %> <%= request.patient.last_name %> (Key: <%= request.id %>)</h4>',
                    '<dl class="dl-horizontal request-details">',
                        '<dt>Status</dt><dd><span class="label label-info"><%= request.workflow_status %></span></dd>',
                        '<dt>Drug</dt><dd><%= request.prescription.name || "(Missing)" %></dd>',
                        '<dt>Created</dt><dd><%= new Date(Date.parse(request.created_at)).toLocaleDateString() %></dd>',
                        '<dt>Link</dt><dd><a href="<%= request.tokens[0].html_url %>">View on CoverMyMeds.com &rarr;</a></dd>',
                   '</dl>',
                '</td>',
            '</tr>',
        '<% }); %>',
        '</table>',
        '<% if (totalPages > 0) { %>',
            '<ul class="pagination">',
                '<% function insideWindow(page, currentPage) {',
                    'var window = 2;',
                    'return Math.abs(currentPage - page) <= window;',
                '} %>',
                '<% i = 0; %>',
                '<li class="<%= (i === currentPage) ? "active" : "" %>"><a href="<%= i %>"><%= (i + 1) %></a></li>',
                '<% if (!insideWindow(i + 1, currentPage)) { %>',
                    '<li><a href="#">&hellip;</a></li>',
                '<% } %>',
                '<% for (i = 1; i <= totalPages - 1; i += 1) {',
                    'if (insideWindow(i, currentPage)) { %>',
                        '<li class="<%= (i === currentPage) ? "active" : "" %>"><a href="<%= i %>"><%= (i + 1) %></a></li>',
                    '<% }',
                '} %>',
                '<% i = totalPages; %>',
                '<% if (!insideWindow(i - 1, currentPage)) { %>',
                    '<li><a href="#">&hellip;</a></li>',
                '<% } %>',
                '<li class="<%= (i === currentPage) ? "active" : "" %>"><a href="<%= i %>"><%= (i + 1) %></a></li>',
            '</ul>',
        '<% } %>',
        '</div> <!-- /.span9 -->',
        '</div> <!-- /.row -->'
    ].join(''));

    window.JST.formsearch = _.template([
        '<table class="table">',
            '<tr>',
                '<td><img src="<%= form.thumbnail_url %>"></td>',
                '<td><%= form.text %></td>',
            '</tr>',
        '</table>'
        ].join(''));
}(window));

/*jslint sloppy: true, unparam: true, todo: true, nomen: true */
/*global jQuery: false, CMM_API_CONFIG: false, Base64: false, _: false */
(function ($) {
    $.fn.extend({
        formSearch: function (options) {
            options = options || {};

            // Remove plugins/event handlers
            if (options === 'destroy') {
                return this.each(function () {
                    $(this).select2('destroy');
                });
            }

            return this.each(function () {
                var defaultUrl;

                defaultUrl = 'https://' + (options.debug ? 'staging.' : '') + 'api.covermymeds.com/forms?v=' + options.version;

                // Initialize select2
                $(this).select2({
                    placeholder: 'Plan, PBM, Form name, BIN, or Contract ID',
                    minimumInputLength: 4,
                    ajax: {
                        quietMillis: 250,
                        url: options.url || defaultUrl,
                        transport: function (params) {
                            // Add authorization header if directly querying API;
                            // otherwise we assume our custom URL will handle authorization
                            if (!options.url) {
                                params.beforeSend = function (xhr) {
                                    xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(options.apiId + ':' + options.apiSecret));
                                };
                            }

                            return $.ajax(params);
                        },
                        data: function (term, page) {
                            var state,
                                drugId;

                            // Values are either passed in to plugin constructor, or
                            // taken from input fields that conform to naming convention
                            state = options.state || $('select[name="request[state]"]').val();
                            drugId = options.drugId || $('input[name="request[drug_id]"]').val();

                            return {
                                q: term,
                                state: state,
                                drug_id: drugId
                            };
                        },
                        results: function (data, page) {
                            var results = [],
                                more,
                                i,
                                j;

                            more = (page * 10) < data.total;
                            for (i = 0, j = data.forms.length; i < j; i += 1) {
                                results.push({
                                    id: data.forms[i].request_form_id,
                                    text: data.forms[i].description,
                                    thumbnail_url: data.forms[i].thumbnail_url
                                });
                            }

                            return {
                                results: results,
                                more: more
                            };
                        }
                    },
                    formatResult: function (form) {
                        return JST.formsearch({ form: form });
                    }
                });
            });
        }
    });
}(jQuery));

/*jslint sloppy: true, unparam: true, todo: true */
/*global alert: false, jQuery: false, CMM_API_CONFIG: false, Base64: false */
(function ($) {
    $.fn.extend({
        drugSearch: function (options) {
            options = options || {};

            // Remove plugins/event handlers
            if (options === 'destroy') {
                return this.each(function () {
                    $(this).select2('destroy');
                });
            }

            return this.each(function () {
                var defaultUrl;

                defaultUrl = 'https://' + (options.debug ? 'staging.' : '') + 'api.covermymeds.com/drugs?v=' + options.version;

                // Initialize select2
                $(this).select2({
                    placeholder: 'Begin typing the medication name and select from list',
                    minimumInputLength: 4,
                    ajax: {
                        quietMillis: 250,
                        url: options.url || defaultUrl,
                        transport: function (params) {
                            // Add authorization header if directly querying API;
                            // otherwise we assume our custom URL will handle authorization
                            if (!options.url) {
                                params.beforeSend = function (xhr) {
                                    xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(options.apiId + ':' + options.apiSecret));
                                };
                            }

                            return $.ajax(params);
                        },
                        data: function (term, page) {
                            return {
                                q: term
                            };
                        },
                        results: function (data, page) {
                            var results = [],
                                more,
                                i,
                                j;

                            more = (page * 10) < data.total;

                            for (i = 0, j = data.drugs.length; i < j; i += 1) {
                                results.push({
                                    text: data.drugs[i].full_name,
                                    id: data.drugs[i].id
                                });
                            }

                            return {
                                results: results,
                                more: more
                            };
                        }
                    }
                });
            });
        }
    });
}(jQuery));

/*jslint sloppy: true, unparam: true, todo: true */
/*global jQuery: false, CMM_API_CONFIG: false, Base64: false */
(function ($) {
    $.fn.extend({
        createRequest: function (options) {
            options = options || {};

            // Remove event handler created by this plugin
            if (options === 'destroy') {
                return this.each(function () {
                    $(this).off('click');
                });
            }

            return this.each(function () {
                var defaultUrl,
                    button,
                    active;

                defaultUrl = 'https://' + (options.debug ? 'staging.' : '') + 'api.covermymeds.com/requests?v=' + options.version;

                button = $(this);
                active = false;

                // Attach event handler
                button.on('click', function (event) {
                    event.preventDefault();

                    // Prevent duplicate/multiple clicks
                    if (active === true) {
                        return;
                    }

                    button.attr('disabled', 'disabled');
                    active = true;

                    // To create a PA request, either pass a "data" attribute in the options object,
                    // or create form elements that conform to the API data naming convention
                    var dataFromFormElements = {
                        "request": {
                            "urgent": $('input[name="request[urgent]"]').attr('checked'),
                            "form_id": $('input[name="request[form_id]"]').val(),
                            "state": $('select[name="request[state]"]').val(),
                            "patient": {
                                "first_name": $('input[name="request[patient][first_name]"]').val(),
                                "middle_name": $('input[name="request[patient][middle_name]"]').val(),
                                "last_name": $('input[name="request[patient][last_name]"]').val(),
                                "date_of_birth": $('input[name="request[patient][date_of_birth]"]').val(),
                                "gender": $('select[name="request[patient][gender]"]').val(),
                                "email": $('input[name="request[patient][email]"]').val(),
                                "health_plan_name": $('input[name="request[patient][health_plan_name]"]').val(),
                                "member_id": $('input[name="request[patient][member_id]"]').val(),
                                "group_id": $('input[name="request[patient][group_id]"]').val(),
                                "phone_number": $('input[name="request[patient][phone_number]"]').val(),
                                "address": {
                                    "street_1": $('input[name="request[patient][address][street_1]"]').val(),
                                    "street_2": $('input[name="request[patient][address][street_2]"]').val(),
                                    "city": $('input[name="request[patient][address][city]"]').val(),
                                    "state": $('select[name="request[patient][address][state]"]').val(),
                                    "zip": $('input[name="request[patient][address][zip]"]').val()
                                }
                            },
                            "prescriber": {
                                "npi": $('input[name="request[prescriber][npi]"]').val(),
                                "first_name": $('input[name="request[prescriber][first_name]"]').val(),
                                "last_name": $('input[name="request[prescriber][last_name]"]').val(),
                                "clinic_name": $('input[name="request[prescriber][clinic_name]"]').val(),
                                "address": {
                                    "street_1": $('input[name="request[prescriber][address][street_1]"]').val(),
                                    "street_2": $('input[name="request[prescriber][address][street_2]"]').val(),
                                    "city": $('input[name="request[prescriber][address][city]"]').val(),
                                    "state": $('select[name="request[prescriber][address][state]"]').val(),
                                    "zip": $('input[name="request[prescriber][address][zip]"]').val()
                                },
                                "fax_number": $('input[name="request[prescriber][fax_number]"]').val(),
                                "phone_number": $('input[name="request[prescriber][phone_number]"]').val()
                            },
                            "prescription": {
                                "drug_id": $('input[name="request[prescription][drug_id]"]').val(),
                                "strength": $('input[name="request[prescription][strength]"]').val(),
                                "frequency": $('input[name="request[prescription][frequency]"]').val(),
                                "enumerated_fields": $('input[name="request[prescription][enumerated_fields]"]').val(),
                                "refills": $('input[name="request[prescription][refills]"]').val(),
                                "dispense_as_written": $('input[name="request[prescription][dispense_as_written]"]').val(),
                                "quantity": $('input[name="request[prescription][quantity]"]').val(),
                                "days_supply": $('input[name="request[prescription][days_supply]"]').val()
                            },
                            "pharmacy": {
                                "name": $('input[name="request[pharmacy][name]"]').val(),
                                "address": {
                                    "street_1": $('input[name="request[pharmacy][address][street_1]"]').val(),
                                    "street_2": $('input[name="request[pharmacy][address][street_2]"]').val(),
                                    "city": $('input[name="request[pharmacy][address][city]"]').val(),
                                    "state": $('select[name="request[pharmacy][address][state]"]').val(),
                                    "zip": $('input[name="request[pharmacy][address][zip]"]').val()
                                },
                                "fax_number": $('input[name="request[pharmacy][fax_number]"]').val(),
                                "phone_number": $('input[name="request[pharmacy][phone_number]"]').val()
                            },
                            "enumerated_fields": {
                                "icd9_0": $('input[name="request[enumerated_fields][icd9_0]"]').val(),
                                "icd9_1": $('input[name="request[enumerated_fields][icd9_1]"]').val(),
                                "icd9_2": $('input[name="request[enumerated_fields][icd9_2]"]').val(),
                                "failed_med_0": $('input[name="request[enumerated_fields][failed_med_0]"]').val(),
                                "failed_med_1": $('input[name="request[enumerated_fields][failed_med_1]"]').val(),
                                "failed_med_2": $('input[name="request[enumerated_fields][failed_med_2]"]').val(),
                                "failed_med_3": $('input[name="request[enumerated_fields][failed_med_3]"]').val(),
                                "failed_med_4": $('input[name="request[enumerated_fields][failed_med_4]"]').val(),
                                "failed_med_5": $('input[name="request[enumerated_fields][failed_med_5]"]').val(),
                                "failed_med_6": $('input[name="request[enumerated_fields][failed_med_6]"]').val(),
                                "failed_med_7": $('input[name="request[enumerated_fields][failed_med_7]"]').val(),
                                "failed_med_8": $('input[name="request[enumerated_fields][failed_med_8]"]').val(),
                                "failed_med_9": $('input[name="request[enumerated_fields][failed_med_9]"]').val()
                            }
                        }
                    };

                    $.ajax({
                        url: options.url || defaultUrl,
                        type: 'POST',
                        beforeSend: function (xhr, settings) {
                            if (!options.url) {
                                xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(options.apiId + ':' + options.apiSecret));
                            }
                        },
                        success: function (data, status, xhr) {
                            // Re-enable button
                            button.removeAttr('disabled');
                            active = false;

                            // Run user-defined callback
                            if (typeof options.success === 'function') {
                                options.success(data, status, xhr);
                            }
                        },
                        error: function (data, status, xhr) {
                            // Re-enable button
                            button.removeAttr('disabled');
                            active = false;

                            // Run user-defined callback
                            if (typeof options.error === 'function') {
                                options.error(data, status, xhr);
                            }
                        },
                        data: options.data || dataFromFormElements
                    });
                });
            });
        }
    });
}(jQuery));

/*jslint sloppy: true, unparam: true, todo: true, nomen: true, plusplus: true, continue: true */
/*global alert: false, jQuery: false, CMM_API_CONFIG: false, Base64: false, JST: false, _: false */
(function ($) {
    // String.trim() polyfill
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/gm, '');
        };
    }

    var CmmDashboard = function (options) {
        // Ensure 'this' -> 'CmmDashboard' in all these methods
        _.bindAll(this, 'load', 'filter', 'render', 'paginate');

        this.elem = options.elem;   // jQuery object to draw into
        this.url = options.url;
        this.defaultUrl = 'https://' + (options.debug ? 'staging.' : '') + 'api.covermymeds.com/requests/search?v=' + options.version;

        this.ids = options.ids || [];
        this.apiId = options.apiId || '';
        this.apiSecret = options.apiSecret || '';

        this.currentPage = 0;
        this.perPage = 10;

        this.filters = {
            firstName: '',
            lastName: '',
            dob: '',
            drug: '',
            key: ''
        };

        if (options.data === undefined) {
            this.load(_.bind(function () {
                this.filteredData = this.data;
                this.render();
            }, this));
        } else {
            this.data = this.filteredData = options.data;
            this.render();
        }
    };

    CmmDashboard.prototype.load = function (callback) {
        var self = this;

        this.elem.html('<h3>Loading...</h3>');

        $.ajax({
            url: this.url || this.defaultUrl,
            type: 'POST',
            data: {
                ids: this.ids
            },
            beforeSend: function (xhr, settings) {
                if (self.url === undefined) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + Base64.encode(self.apiId + ':' + self.apiSecret));
                }
            },
            success: function (data, status, xhr) {
                self.data = data.requests;

                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (data, status, xhr) {
                self.elem.empty().text('There was an error processing your request. Please try again.');
            }
        });
    };

    // Transform this.data -> this.filteredData
    CmmDashboard.prototype.filter = function (clear) {
        var request,
            i;

        if (clear === true) {
            this.filters.firstName = this.filters.lastName = this.filters.dob = this.filters.drug = this.filters.key = null;

            this.filteredData = this.data;

            return;
        }

        // Clear out previous filtered values
        this.filteredData = [];

        this.filters.firstName = $('input[name="patient_first_name"]').val().trim();
        this.filters.lastName = $('input[name="patient_last_name"]').val().trim();
        this.filters.dob = $('input[name="patient_date_of_birth"]').val().trim();
        this.filters.drug = $('input[name="drug_name"]').val().trim();
        this.filters.key = $('input[name="request_id"]').val().trim();

        i = this.data.length;
        while (i--) {
            // determine if this.data[i] fits curent criteria
            request = this.data[i];

            if (this.filters.firstName) {
                if (request.patient.first_name.toLowerCase().indexOf(this.filters.firstName.toLowerCase()) === -1) {
                    continue;
                }
            }

            if (this.filters.lastName) {
                if (request.patient.last_name.toLowerCase().indexOf(this.filters.lastName.toLowerCase()) === -1) {
                    continue;
                }
            }

            if (this.filters.dob) {
                if (request.patient.date_of_birth.toLowerCase().indexOf(this.filters.dob.toLowerCase()) === -1) {
                    continue;
                }
            }

            if (this.filters.drug) {
                if (request.prescription.drug_name.toLowerCase().indexOf(this.filters.drug.toLowerCase()) === -1) {
                    continue;
                }
            }

            if (this.filters.key) {
                if (request.id.toLowerCase().indexOf(this.filters.key.toLowerCase()) === -1) {
                    continue;
                }
            }

            // If still here, that means the request passed all filters
            this.filteredData.push(request);
        }
    };

    CmmDashboard.prototype.render = function () {
        var begin,
            end,
            totalPages;

        begin = this.currentPage * this.perPage;
        end = begin + this.perPage;
        totalPages = Math.ceil(this.filteredData.length / this.perPage) - 1; // 0-index based

        // Remove any previously-attached event handlers
        $('.pagination a', this.elem).off('click');
        $('button.search', this.elem).off('click');

        // Draw to DOM
        this.elem.empty().append(JST.dashboard({ requests: this.filteredData.slice(begin, end), currentPage: this.currentPage, totalPages: totalPages, filters: this.filters }));

        // Add event handlers
        $('.pagination a', this.elem).on('click', this.paginate);
        $('button.search', this.elem).on('click', _.bind(function (event) {
            event.preventDefault();

            var clear = $(event.target).hasClass('clear');

            this.filter(clear);
            this.render();
        }, this));
    };

    CmmDashboard.prototype.paginate = function (event) {
        var page;

        event.preventDefault();

        page = parseInt($(event.target).attr('href'), 10);

        if (isNaN(page)) {
            return;
        }

        this.currentPage = page;

        this.render();
    };

    $.fn.extend({
        dashboard: function (options) {
            // Remove event handler created by this plugin
            if (options === 'destroy') {
                return this.each(function () {
                    var elem = $(this);
                    $('.pagination a', elem).off('click');
                    $('button.search', elem).off('click');
                    elem.remove();
                });
            }

            return this.each(function () {
                options = $.extend(options, { elem: $(this) });
                new CmmDashboard(options);
            });
        }
    });
}(jQuery));


/*jslint sloppy: true, unparam: true, todo: true, nomen: true */
/*global jQuery: false, _: false */
(function ($) {
    $.fn.extend({
        showHelp: function (options) {
            options = $.extend({}, options);

            return this.each(function () {
                var content = '<h1>For assistance using CoverMyMeds&reg;</h1>' +
                              '<ul>' +
                              '<li>Phone: 1-866-452-5017</li>' +
                              '<li>Email: <a href="mailto:help@covermymeds.com">help@covermymeds.com</a></li>' +
                              '</ul>' +
                              '<h1>Send forms or report data issues</h1>' +
                              '<ul>' +
                              '<li>Phone: 1-866-452-5017</li>' +
                              '<li>Fax: 1-615-379-2541</li>' +
                              '<li>Email: <a href="mailto:data@covermymeds.com">data@covermymeds.com</a></li>';
                              '</ul>';

                $(this).html(content);
            });
        }
    });
}(jQuery));


/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
