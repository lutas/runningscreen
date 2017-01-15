'use strict';
var moment = require('moment');

function metresToMiles(metres) {
    return metres / (0.6 * 1000);
}

// http://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html#fbid=l8FTWLCXNET
function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  const one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

module.exports = {

    output: function(monthIndex, prevYear, thisYear) {

        console.log("Calculating output");

        // calculate distance this month
        const prevDistance = prevYear.getMonthDistance(monthIndex);
        const thisDistance = thisYear.getMonthDistance(monthIndex);

        var diff = metresToMiles(prevDistance - thisDistance);   

        // days since last run
        var lastRun = thisYear.getLastRun();
        var daysSinceLastRun = -1;
        if (lastRun) {
            var lastRunDate = new Date(lastRun.end_time);

            daysSinceLastRun = daysBetween(lastRunDate, new Date());
        }

        // days remaining in the month

        

        // output to console             
        console.log("MilesDifference = " + diff + " miles");
        console.log("Days since last run = " + daysSinceLastRun);
    },

    createGraph: function(prevYear, thisYear) {

        // graph statistics for each month for plotting 
    },

    error: function(err) {
        
        console.log("Error: " + err.message);

        // flash LED's?
    }

};