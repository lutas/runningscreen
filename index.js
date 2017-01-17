
'use strict';

console.log("app start");

var config = require('./config.js');
var runtasticManager = require('./running.js');
var display = require('./display.js');

var YearStats = require("./yearstats.js");

const prevYearValue = 2016; // deduce at some point
const thisYearValue = 2017;

var prevYear = new YearStats(prevYearValue);
var thisYear = new YearStats(thisYearValue);

setTimeout(function() {
    console.log("Clearing display");
    display.clear();
    display.init();
    console.log("Initialised display");

}, 2000);

console.log("Attempting login");
runtasticManager.login(config).then(function() {

    var allMonths = [];
    for (let monthIndex = 1; monthIndex <= 12; ++monthIndex) {

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

setTimeout(function() {

    console.log("Delaying application end");

}, 30000);
