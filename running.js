'use strict';

var Runtastic = require('runtastic-js');
var Promise = require('promise');

function flatten(activities) {
    return activities.reduce(function(prev, val) {
        prev = prev || [];
        if (val) {
            for (var index = 0; index < val.length; ++index) {
                prev.push(val[index]);
            }
        }
        return prev;
    });
}

function downloadActivity(api, activityId) {

    var activityReceivedPromise = new Promise(function(individualActivityAccept, individualActivityReject) {

        api.fetchActivityDetails(activityId, false, function(err, activity) {

            if (err) {
                // expected that some might fail to retrieve but this is fine
                individualActivityAccept(false);
            }
            else {
                var attrib = activity.data.attributes;
                attrib.activityId = activityId;
                attrib.ext_data = undefined;
                attrib.fastest_paths = undefined;
                attrib.workout_data = undefined;
                attrib.zones = undefined;
                attrib.current_training_plan_state = undefined;

                individualActivityAccept(attrib);
            }
        });
    });

    return activityReceivedPromise;
}

module.exports = {

    api: null,
    
    login: function(config) {

        var self = this;
        var loginPromise = new Promise(function(accept, reject) {           

            self.api = new Runtastic(config.emailAddress, config.password);
            self.api.login(function(err, user) {
                if (err) {
                    reject(err);
                } 
                else {
                    self.user = user;
                    accept(user);
                }
            });
        });

        return loginPromise;
    },

    getMonthStats: function(month, year) {

        month += 1;
        
        var from = year + '/' + month + '/01';
        var to = year + '/' + month + '/31';

        var api = this.api;

        var completedPromise = new Promise(function(completedAccept, completedReject) {
            api.fetchActivities(50, {'from': new Date(from), 'to': new Date(to)}, function(err, activities) {

                if (err) {
                    completedReject(err);
                    return;
                }
               
                // flatten the activity ID's as they come back as array of arrays
                var flattened = flatten(activities);
                console.log("Month: " + month + "/" + year + " - retrieved " + flattened.length + " activities");
        
                var activitiesReceived = [];
                var allDetails = [];

                var initialPromise = new Promise(function(accept) { accept(); });

                var allReceived = flattened.reduce(function(promise, activityId, index) {
                    return promise.then(function(data) {
                        if (data) {                                
                            allDetails.push(data);
                        }
                        return downloadActivity(api, activityId);
                    });
                }, initialPromise);

                allReceived.then(function() {
                    completedAccept({ monthIndex: month - 1, details: allDetails });
                }, function(err) {
                    completedReject(err);
                })
                .catch(function(reason) {
                    throw reason;
                });
            });            
        });

        return completedPromise;
    }
};