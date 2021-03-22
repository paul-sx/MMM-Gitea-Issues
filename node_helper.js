/*
 * Magic Mirror Module Gitea Issues
 * Licensed under MIT
 * Copyright Paul-sx
 *
 */
const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
   start: function () {
      console.log("MMM-Gitea-Issues helper started...");
   },

   getIssues:  function (config) {
      console.log("--Gitea Issues: Fetching Issue Data--");
      var token = config.token;
      var repos = config.repos;
      var self = this;
      repos = repos.map( repo => {
         var url = new URL(repo);
         url.pathname = '/api/v1/repos' + url.pathname + '/issues';
         return url.href;
      } );

      var issuesRemaining = repos.length;
      var issues = [];
      repos.forEach( repo => {
         console.log(`Checking url ${repo}`);
         var headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/json'
         };
         request({headers: headers, url: repo, method: "GET"}, (err, rsp, body) => {
            if (!err && rsp.statusCode == 200)
            {
               issues = issues.concat(JSON.parse(body));
               issuesRemaining--;
               if ( issuesRemaining < 1 ) {
                  self.sendSocketNotification("ISSUES", issues);
               }
            } else {
               console.log("Error fetching issue data for " + repo + ": " + err + "(HTTP Status: "+ rsp.statusCode + ")");
            }
         });
      });
   },
   socketNotificationReceived: function(notification, payload) {
      console.log("Notification: " + notification);
      if (notification === "GET_ISSUES") {
         this.getIssues(payload);
      }
   }

});

