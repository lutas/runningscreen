'use strict';
var assert = require('assert');

var YearStats = function(year) {

    return {

        year: year,
        months: [null, null, null,
                null, null, null,
                null, null, null,
                null, null, null
        ],
        
        addStats: function(monthIndex, data) {
            assert(monthIndex >= 0 && monthIndex < 12, "Invalid month specified");

            this.months[monthIndex] = data;
        },

        getMonthDistance: function(monthIndex) {
            assert(monthIndex >= 0 && monthIndex < 12, "Invalid month specified");

            var month = this.months[monthIndex];
            if (month === null) {
                return 0;
            }

            var totalDistance = month.reduce(function(prev, val) {
                return prev + val.distance;
            }, 0);

            return totalDistance;
        },

        getLastRun: function() {

            // discount any months without data
            for (var monthIndex = 11; monthIndex >= 0; --monthIndex) {
                
                var month = this.months[monthIndex];
                if (month !== null && month.length > 0) {
                    
                    // find the latest one
                    var lastRun = null;
                    var latest = 0;
                    for (var activity = 0; activity < month.length; ++activity) {

                        var runTime = new Date(month[activity].end_time).getTime();                     

                        if (runTime > latest) {
                            lastRun = month[activity];
                            latest = runTime;
                        }
                    }
                    return lastRun;
                }
            }

            return null;
        }
    };
}

module.exports = YearStats;