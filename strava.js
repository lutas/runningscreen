'use strict';

var strava = require('strava-v3');
var Promise = require('promise');

const toRuntastic = activity => {
    return {
        distance: activity.distance,
        end_time: new Date(activity.start_date_local) + activity.elapsed_time
    };
}

module.exports = {

    api: null,
    
    login: function(config) {
        return Promise.resolve();
    },

    logout: function() {
    },

    getMonthStats: function(month, year) {

        let from = new Date(year, month, 1).getTime() / 1000;
        let to = new Date(year, month + 1, 0).getTime() / 1000;

        var completedPromise = new Promise(function(completedAccept, completedReject) {

            strava.athlete.listActivities({ before: to, after: from }, (err, payload, limits) => {
                if (err) {
                    completedReject(err);
                    return;
                }

                completedAccept({
                    monthIndex: month,
                    details: payload.map(toRuntastic)
                });
            });            
        });

        return completedPromise;
    }
};