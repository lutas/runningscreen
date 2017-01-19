
'use strict';

console.log("app start");

//var config = require('./config.js');
var display = require('./display.js');

var config = {
    emailAddress: process.env.LoginEmail,
    password: process.env.Password
};

console.log("Using account: " + config.emailAddress);

    console.log("Clearing display");
    display.clear();
    display.init();
    console.log("Initialised display");

    
setInterval(function() {
    display.init();
    console.log("init display");
}, 500);



// var runtasticManager = require('./running.js');

// var YearStats = require("./yearstats.js");

// var prevYearValue = 2016; // deduce at some point
// var thisYearValue = 2017;

// var prevYear = new YearStats(prevYearValue);
// var thisYear = new YearStats(thisYearValue);
// console.log("Attempting login");
// runtasticManager.login(config).then(function() {

//     var allMonths = [];
//     for (var monthIndex = 1; monthIndex <= 12; ++monthIndex) {

//         // previous year details - could cache these somewhere
//         var monthPromise = runtasticManager.getMonthStats(monthIndex, prevYearValue);        
//         monthPromise.then(function(data) {
//             prevYear.addStats(monthIndex, data);
//         }, display.error);

//         allMonths.push(monthPromise);

//         // current year
//         var thisYearMonthPromise = runtasticManager.getMonthStats(monthIndex, thisYearValue);
//         thisYearMonthPromise.then(function(data) {
//             thisYear.addStats(monthIndex, data);
//         }, display.error);

//         allMonths.push(thisYearMonthPromise);
//     }

//     Promise.all(allMonths).then(function() {

//         display.output(1, prevYear, thisYear);

//     }, display.error);

// }, display.error);

