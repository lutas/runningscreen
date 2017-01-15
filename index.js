
'use strict';

var config = require('./config.js');
var stats = require('./running.js');

function displayError(err) {
    console.log("Error: " + err.message);

    // flash LED's?
}

stats.login(config).then(function() {

    stats.getMonthStats(1, 2016).then(function(details) {

        console.log(details);

    }, displayError);

}, displayError);