'use strict';

var moment = require('moment');
var Output = require('./output');
var Promise = require('promise');

function metresToMiles(metres) {
    return (metres / 1000) / 1.6;
}

// http://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html#fbid=l8FTWLCXNET
function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.floor(difference_ms/one_day); 
}

var displays = {
    totalMilesThisYearMonth: null,
    totalMilesPrevYearMonth: null,
    daysSinceLastRun: null
};

module.exports = {

    init: function() {

        this.display = new Output();
        this.display.init();

        displays.totalMilesThisYearMonth = this.display.getController(0);
        displays.totalMilesPrevYearMonth = this.display.getController(1);
        displays.daysSinceLastRun = this.display.getController(2);
        displays.avgMileage = this.display.getController(3);

        // set all to "unknown" to begin with
        this.display.controllers.forEach(function(controller) {
            controller.writeUnknown();
        });

        this.shown = true;
        this.hide();
        this.show();
    },

    show: function() {
        if (!this.shown) {
            this.display.show();
            this.shown = true;
        }
    },

    hide: function() {
        if (this.shown) {
            this.display.hide();
            this.shown = false;
        }
    },

    setLoading: function(isLoading) {
        if (isLoading) {
            this.display.controllers.forEach(function(controller) {
                controller.blink(25);
            });
        } else {
            this.display.controllers.forEach(function(controller) {
                controller.blinkOff();
            });            
        }
    },

    process: function(monthIndex, prevYear, thisYear) {

        console.log("Calculating output");

        // calculate distance this month
        var prevDistance = prevYear.getMonthDistance(monthIndex);
        var thisDistance = thisYear.getMonthDistance(monthIndex);

        displays.totalMilesThisYearMonth.writeDecimal(metresToMiles(thisDistance));
        displays.totalMilesPrevYearMonth.writeDecimal(metresToMiles(prevDistance));

        console.log('Last year', metresToMiles(prevDistance), 'miles');
        console.log('This year', metresToMiles(thisDistance), 'miles');

        // days since last run
        var lastRun = thisYear.getLastRun();
        var daysSinceLastRun = -1;
        if (lastRun) {
            var lastRunDate = new Date(lastRun.end_time);
            daysSinceLastRun = daysBetween(lastRunDate, new Date());
            
            displays.daysSinceLastRun.writeNumber(daysSinceLastRun);
        }
        else {
            displays.daysSinceLastRun.writeUnknown();
        }
        
        // calc an average miles per day for the current month
        var totalDays = new Date().getDate();
        var avg = metresToMiles(thisDistance / totalDays);
        if (process.env.playAnim == 'true') {
            this.display.getController(3).playAnim();    
        }
        else {
            displays.avgMileage.writeDecimal(avg);
        }    

        // output to console             
        
        var diff = metresToMiles(thisDistance - prevDistance);   
        console.log("MilesDifference = " + diff + " miles");
        console.log("Days since last run = " + daysSinceLastRun);
        console.log("Average mileage per day current month = " + avg);
    },

    createGraph: function(prevYear, thisYear) {

        // graph statistics for each month for plotting 
    },

    error: function(err) {
        
        console.log("Error occurred");
        console.log("Error: " + (err.message || err.description));

        // flash LED's?
        this.display.getController(0).writeError();
        this.setLoading(false);//disable blinking
    }

};