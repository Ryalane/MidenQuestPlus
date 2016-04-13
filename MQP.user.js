// ==UserScript==
// @name         MidenQuestPlus
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Provides the user with some enhancements to MidenQuest
// @author       Ryalane
// @updateURL    https://github.com/Ryalane/MidenQuestPlus/raw/master/MQP.user.js
// @match        http://www.midenquest.com/Game.aspx
// @resource     MainStylesheet https://github.com/Ryalane/MidenQuestPlus/raw/master/style.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("MainStylesheet"));

/* Change the look of the page slightly */

    // Create the top navbar
    var MainBar = $("<div>", {id: "Custom_MainBar"});
    $("body").prepend(MainBar);
    $(MainBar).prepend('<h1>Stuff will go here eventually</h1>');

    // Match the navbar size
    $('#MainPanel').css('width', '1002px');
    // Center the text a bit better
    $('.prgActionOverlay').css('margin-top', '-19px');

/* Modify the title of the page */
    var Production = '';
    var ProductionTitle = '';
    var isWorking = false;

    var MaxWorkload
    var CurWorkLoad
    var CheckWork = function() {
      Production = $('.prgActionOverlay').text();
      if (Production[0] === 'S') {
        isWorking = true;
        ProductionTitle = 'Selling';
      } else if (Production[0] === 'M') {
        isWorking = true;
        ProductionTitle = 'Mining';
      } else if (Production[0] === 'G') {
        isWorking = true;
        ProductionTitle = 'Gathering';
      } else if (Production[0] === 'L') {
        isWorking = true;
        ProductionTitle = 'Cutting';
      } else if (Production[0] === 'F') {
        isWorking = true;
        ProductionTitle = 'Fishing';
      } else {
        isWorking = false;
      }

      // After the check, update the current/max workload
      if (isWorking) {
        tempWorkload = Production.split(' ')[1].split('/');
        CurWorkLoad = tempWorkload[0];
        MaxWorkload = tempWorkload[1];
      }
    }

    // Little helper method for setting the title
    var UpdateTitle = function() {
      var title = '';

      if (isWorking) {
        title = ProductionTitle + ' ' + CurWorkLoad + ' / ' + MaxWorkload;
      } else {
        if (ProductionTitle) {
          title = ProductionTitle + ' has stopped';
        } else {
          title = 'MidenQuest Online';
        }
      }

      document.title = title;
    }

    // Check what the title should be and then update it

    var titlething = setInterval(function () {
    CheckWork();
    UpdateTitle();
    }, 1000);

/* Handle chat tabs */
    var TabContainer = $('.Tabs>ul');
    var tabAmount = $('.Tabs>ul').children().size();
    var selectedTab = 1;
    // Create a couple helper functions
    var NextTab = function() {
        // Set what the next tab is
        if (selectedTab < 4) {
            selectedTab++;
        } else {
            selectedTab = 1;
        }

        // Switch to the next tab
        setTimeout(function () { ChangeChatChannel(selectedTab); }, 100);
    };

    // Set the tab to #1 just in case
    setTimeout(function () { ChangeChatChannel(1); }, 1000);


    // Setup the key events
    $( document ).keydown(function(e) {
        var keycode = (e.which) ? e.which : e.keyCode;
        if (keycode == 9)
        {
            NextTab();
            e.preventDefault();
        }
    });
})();
