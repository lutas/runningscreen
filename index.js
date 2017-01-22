
'use strict';

console.log("app start");

var refreshRate = process.env.refreshRate || (10 * 60000);
console.log("refreshing every " + (refreshRate / 1000 / 60) + " minutes");

var Promise = require('promise');

//var config = require('./config.js');
var display = require('./displaystats.js');

var config = {
    emailAddress: process.env.LoginEmail || process.argv[2],
    password: process.env.Password || process.argv[3]
};

console.log("Using account: " + config.emailAddress);
display.init();

var runtasticManager = require('./running.js');
var YearStats = require("./yearstats.js");

var prevYearValue = 2016; // deduce at some point
var thisYearValue = 2017;

function refresh() {

    var prevYear = new YearStats(prevYearValue);
    var thisYear = new YearStats(thisYearValue);
    console.log("Attempting login");

    runtasticManager.login(config).then(function() {

        display.setLoading(true);

        var currentMonth = new Date().getMonth();

        var allMonths = [];
        for (var monthIndex = 0; monthIndex < 12; ++monthIndex) {

            // get this month 
            // + previous month for determining last run day
            if (monthIndex != currentMonth && monthIndex != currentMonth - 1) {
                continue;
            }

            // previous year details - could cache these somewhere
            var prevYearMonthPromise = runtasticManager.getMonthStats(monthIndex, prevYearValue);        
            prevYearMonthPromise.then(function(data) {
                console.log("Received data for prev year, month " + data.monthIndex + 1);
                prevYear.addStats(data.monthIndex, data.details);
            }, display.error);

            allMonths.push(prevYearMonthPromise);

            // current year
            var thisYearMonthPromise = runtasticManager.getMonthStats(monthIndex, thisYearValue);
            thisYearMonthPromise.then(function(data) {
                console.log("Received data for this year, month " + data.monthIndex + 1);
                thisYear.addStats(data.monthIndex, data.details);
            }, display.error);

            allMonths.push(thisYearMonthPromise);
        }

        Promise.all(allMonths).then(function() {

            display.setLoading(false);

            console.log("Displaying data");
            display.process(currentMonth, prevYear, thisYear);

        }, display.error);

    }, display.error);
}

setInterval(refresh, refreshRate);
refresh();


