
'use strict';

var config = require('./config.js');
var runtasticManager = require('./running.js');
var display = require('./display.js');

var YearStats = require("./yearstats.js");

const prevYearValue = 2016; // deduce at some point
const thisYearValue = 2017;

var prevYear = new YearStats(prevYearValue);
var thisYear = new YearStats(thisYearValue);

console.log("Clearing display");
display.clear();
display.init();
console.log("Initialised display");

runtasticManager.login(config).then(function() {

    var allMonths = [];
    for (let monthIndex = 1; monthIndex <= 1; ++monthIndex) {

        // previous year details - could cache these somewhere
        let monthPromise = runtasticManager.getMonthStats(monthIndex, prevYearValue);        
        monthPromise.then(function(data) {
            prevYear.addStats(monthIndex, data);
        }, display.error);

        allMonths.push(monthPromise);

        // current year
        let thisYearMonthPromise = runtasticManager.getMonthStats(monthIndex, thisYearValue);
        thisYearMonthPromise.then(function(data) {
            thisYear.addStats(monthIndex, data);
        }, display.error);

        allMonths.push(thisYearMonthPromise);
    }

    Promise.all(allMonths).then(function() {

        display.output(1, prevYear, thisYear);

    }, display.error);

}, display.error);
