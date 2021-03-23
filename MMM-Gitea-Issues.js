/*
 * Gitea Issues MagicMirror2 Module
 * Distributed under the MIT License
 *
 */

'use strict';

Module.register("MMM-Gitea-Issues", {
   getStyles: function() {
      return ['tachyons.min.css'];
   },


   defaults: {
      "repos": [
         'https://host.example.com/owner/repo'
      ],
      "token": 'token',
      'updateInterval': 10,
      'fadeSpeed': 100,
      'showBody': false
   },

   start: function() {
      this.getIssues();
      this.scheduleUpdate();
   },

   issueList: [],

   getDom: function () {
      var wrapper = document.createElement('section');
      wrapper.classList.add("tl", "white-70", 'flex', 'flex-wrap');
      /*var header = document.createElement('h2');
      header.classList.add("baskerville",  "f3", "fw1", "ph0", "pv0");
      header.textContent = "Issues";
      wrapper.appendChild(header);
      */
      this.issueList.forEach( issue => {
         var article = document.createElement('article');
         article.classList.add("br4",  "ba", "bw1", "pa2", "b--white-50", "mr3", "mb2");
         var topDiv = document.createElement('div');
         topDiv.classList.add('flex', 'flex-row');
         var pillDiv = document.createElement('div');
         pillDiv.classList.add('flex', 'flex-wrap', 'w4');
         issue['labels'].forEach( tag => {
            var tagP = document.createElement('p');
            tagP.classList.add('f5', 'br-pill', 'ph3', 'pv0', 'ma0', 'h1', 'lh-solid', 'b');
            tagP.classList.add(this.textColor(tag['color']));
            tagP.style.backgroundColor = `#${tag['color']}`;
            tagP.textContent = tag['name'];
            pillDiv.appendChild(tagP);
         } );
         topDiv.appendChild(pillDiv);
         var textDiv = document.createElement('div');
         textDiv.classList.add('mw6');
         var titleH = document.createElement('h1');
         titleH.classList.add('f5', 'fw1', 'baskerville', 'mv0', 'lh-title');
         titleH.textContent = issue['title'];
         textDiv.appendChild(titleH);
         if (this.config.showBody == true) {
            var bodyP = document.createElement('p');
            bodyP.classList.add('f7', 'lh-copy');
            bodyP.textContent = issue['body'];
            textDiv.appendChild(bodyP);
         }
         var ownerP = document.createElement('p');
         ownerP.classList.add('f7', 'mv0', 'lh-copy');
         ownerP.textContent = `${issue['user']['username']} in ${issue['repository']['full_name']}`;
         textDiv.appendChild(ownerP);
         topDiv.appendChild(textDiv);
         article.appendChild(topDiv);
         wrapper.appendChild(article);
      } );
      return wrapper;
   },

   scheduleUpdate: function(delay) {
      var nextLoad = this.config.updateInterval * 60000;
      if (typeof delay !== "undefined" && delay >=0) {
         nextLoad = delay;
      }
      var self = this;
      setInterval(function () {
         self.getIssues();
      }, nextLoad);
   },

   getIssues: function () {
      var payload = this.config;
      this.sendSocketNotification("GET_ISSUES", payload);
   },

   socketNotificationReceived: function(notification, payload) {
      if (notification === "ISSUES") {
         this.issueList = payload;
         this.updateDom(self.config.fadeSpeed);
      }
   },

   textColor: function (backgroundColor) {
      var result = /^#?([a-f\d]{2}){3}$/i.exec(backgroundColor);
      if (! result) {return 'white';}
      var rgb = [
         parseInt(result[1], 16),
         parseInt(result[2], 16),
         parseInt(result[3], 16)
      ];
      rgb = rgb.map(function(c) {
         c = c / 255.0;
         if (c <= 0.03928) {
            c = c / 12.92;
         } else {
            c = ((c+0.055)/1.055) ^ 2.4;
         }
         return c;
      });
      var L = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

      if ( L > 0.179 ) {
         return "black";
      }
      return "white";

   },

});
