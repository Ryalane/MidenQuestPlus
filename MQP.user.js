// ==UserScript==
// @name         MidenQuestPlus
// @namespace    http://tampermonkey.net/
// @version      0.70
// @description  Provides the user with some enhancements to MidenQuest
// @author       Ryalane
// @updateURL    https://github.com/Ryalane/MidenQuestPlus/raw/master/MQP.user.js
// @match        http://www.midenquest.com/Game.aspx
// @resource     MainStylesheet https://raw.githubusercontent.com/Ryalane/MidenQuestPlus/master/style.css
// @resource     NavbarFile https://raw.githubusercontent.com/Ryalane/MidenQuestPlus/master/Navbar.html
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("MainStylesheet"));


/* Handle Settings */
// Settings Used
// Workload_useAlerts = true/false
// Chat_AllowTabCycling = true/false
var SetupSettings = function() {
    // Set Workload Alerts
      if (GM_getValue('Workload_useAlerts')) {
          $('input[name="WorkloadAlert"]').prop('checked', true);
      } else {
          // Should be default, but let's do it anyways
          $('input[name="WorkloadAlert"]').prop('checked', false);
      }

    // Set Tab Cycling
    if (GM_getValue('Chat_AllowTabCycling')) {
          $('input[name="TabCycling"]').prop('checked', true);
      } else {
          // Should be default, but let's do it anyways
          $('input[name="TabCycling"]').prop('checked', false);
      }
};

/* Change the look of the page slightly */

    GM_xmlhttpRequest({
  method: "GET",
  url: "https://raw.githubusercontent.com/Ryalane/MidenQuestPlus/master/Navbar.html",
  onload: function(response) {
    $("body").prepend(response.responseText);
    SetupSettings();
  }
});

    // Match the navbar size
    $('#MainPanel').css('width', '1002px');
    // Center the text a bit better
    $('.prgActionOverlay').css('margin-top', '-19px');

/* Modify the title of the page */
    var useAlerts = 'false';
    var doneAlerting = false;
    var Production = '';
    var ProductionTitle = '';
    var isWorking = false;

    var MaxWorkload = 0;
    var CurWorkLoad = 0;

    var CheckWorkloadSettings = function() {
        useAlerts = $('input[name="WorkloadAlert"]').is(':checked');

        // Save every check
        if (GM_getValue('Workload_useAlerts') !== useAlerts) {
            console.log("Saving because GM = " + GM_getValue('Workload_useAlerts') + ' local = ' + useAlerts);
            GM_setValue('Workload_useAlerts', useAlerts);
            $('input[name="WorkloadAlert"]').prop('checked', useAlerts);
        }
    };

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
        var tempWorkload = Production.split(' ')[1].split('/');
        CurWorkLoad = tempWorkload[0];
        MaxWorkload = tempWorkload[1];
          if (doneAlerting) {
              doneAlerting = false;
          }
      }
    };

    // Little helper method for setting the title
    var UpdateTitle = function() {
      var title = '';

      if (isWorking) {
        title = ProductionTitle + ' ' + CurWorkLoad + ' / ' + MaxWorkload;
      } else {
        if (ProductionTitle) {
            if (useAlerts && !doneAlerting) {

                alert(ProductionTitle + ' has stopped');
                doneAlerting = true;
            } else {
                title = ProductionTitle + ' has stopped';
            }
        } else {
          title = 'MidenQuest Online';
        }
      }

      document.title = title;
    };

    // Check what the title should be and then update it

    var titlething = setInterval(function () {
    CheckWorkloadSettings();
    CheckWork();
    UpdateTitle();
    }, 1000);

/* Handle chat tabs */
    var TabContainer = $('.Tabs>ul');
    var tabAmount = $('.Tabs>ul').children().size();
    var selectedTab = 1;
    var allowTabCycling = true;

    var HandleChatSettings = function() {
        allowTabCycling = $('input[name="TabCycling"]').is(':checked');

        // Save every check
        if (GM_getValue('Chat_AllowTabCycling') !== useAlerts) {
            GM_setValue('Chat_AllowTabCycling', useAlerts);
            $('input[name="TabCycling"]').prop('checked', useAlerts);
        }
    };

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

    setInterval(function () {
        HandleChatSettings();
    }, 250);

    // Setup the key events
    $( document ).keydown(function(e) {
        var keycode = (e.which) ? e.which : e.keyCode;
        if (keycode == 9)
        {
          // TODO: Shift + tab for PreviousTab()
          if (allowTabCycling) {
            NextTab();
            e.preventDefault();
          }
        }
    });
})();
