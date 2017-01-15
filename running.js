'use strict';

var Runtastic = require('runtastic-js');

function flatten(activities) {
    return activities.reduce(function(prev, val) {
        prev = prev || [];
        if (val) {
            for (let index = 0; index < val.length; ++index) {
                prev.push(val[index]);
            }
        }
        return prev;
    });
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
        
        const from = year + '/' + month + '/01';
        const to = year + '/' + month + '/31';

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

                flattened.forEach(function(activityId) {

                    let activityReceivedPromise = new Promise(function(individualActivityAccept, individualActivityReject) {

                        api.fetchActivityDetails(activityId, false, function(err, activity) {

                            if (err) {
                                // expected that some might fail to retrieve but this is fine
                                individualActivityAccept(false);
                            }
                            else {
                                let attrib = activity.data.attributes;
                                attrib.ext_data = undefined;
                                attrib.fastest_paths = undefined;
                                attrib.workout_data = undefined;
                                attrib.zones = undefined;
                                attrib.current_training_plan_state = undefined;

                                allDetails.push(attrib);
                                individualActivityAccept(activity);
                            }
                        });
                    });

                    activitiesReceived.push(activityReceivedPromise);
                });
                
                Promise.all(activitiesReceived).then(function() {
                    completedAccept(allDetails);
                }, function(err) {
                    completedReject(err);
                });
            });            
        });

        return completedPromise;
    }
};