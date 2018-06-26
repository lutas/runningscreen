
'use strict';

console.log("app start");

var startTime = new Date();
console.log("Starting at " + startTime.toString());

var refreshRate = process.env.refreshRate || (10 * 60000);
console.log("refreshing every " + (refreshRate / 1000 / 60) + " minutes");

var Promise = require('promise');
var display = require('./displaystats.js');

var config = {
    emailAddress: process.env.LoginEmail || process.argv[2],
    password: process.env.Password || process.argv[3]
};

var onlyDisplayDuringActiveTimes = process.env.onlyDisplayDuringActiveTimes == "true";
console.log("onlyDisplayDuringActiveTimes: " + onlyDisplayDuringActiveTimes);
console.log("Using account: " + config.emailAddress);

display.init();

var runManager;
if (process.env.runMode == "runtastic") {
    console.log('Using runtastic');
    runManager = require('./runtastic');
}
else {
    console.log('Using strava');
    runManager = require('./strava');
}
var YearStats = require("./yearstats.js");

var thisYearValue = startTime.getFullYear();
var prevYearValue = thisYearValue - 1;

function isActiveTime() {

    var today = new Date();

    //active times
    // mon - fri 6-10am, 5-10pm
    // sat - sun 6am - 10pm

    var hour = today.getHours();
    var day = today.getDay();

    // weekend always active
    if (day == 0 || day == 6) {
        return hour >= 6 && hour < 22;
    }
    else {
        return (hour >= 6 && hour < 10) || (hour >= 17 && hour < 22);
    }

}

if (isActiveTime()) {
    console.log("Started in active time");
}
else {
    console.log("Started outside of active time");
}

function refresh() {

    if (onlyDisplayDuringActiveTimes && !isActiveTime()) {
        display.hide();
        return;
    }

    display.hide();
    display.show();    

    var prevYear = new YearStats(prevYearValue);
    var thisYear = new YearStats(thisYearValue);
    console.log("Attempting login");

    runManager.login(config).then(function() {

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
            var prevYearMonthPromise = runManager.getMonthStats(monthIndex, prevYearValue);        
            prevYearMonthPromise.then(function(data) {
                console.log("Month: " + (data.monthIndex + 1) + "/" + prevYearValue + " - downloaded " + data.details.length + " activities");
                prevYear.addStats(data.monthIndex, data.details);
            }, display.error)
            .catch(display.error);

            allMonths.push(prevYearMonthPromise);

            // current year
            var thisYearMonthPromise = runManager.getMonthStats(monthIndex, thisYearValue);
            thisYearMonthPromise.then(function(data) {
                console.log("Month: " + (data.monthIndex + 1) + "/" + thisYearValue + " - downloaded " + data.details.length + " activities");
                thisYear.addStats(data.monthIndex, data.details);
            }, display.error)
            .catch(display.error);

            allMonths.push(thisYearMonthPromise);
        }

        Promise.all(allMonths).then(function() {

            display.setLoading(false);

            console.log("Displaying data");
            display.process(currentMonth, prevYear, thisYear);
            
            runManager.logout();

        }, display.error)
        .catch(display.error);

    }, display.error)
    .catch(display.error);
}

setInterval(refresh, refreshRate);
refresh();


