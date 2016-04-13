// ==UserScript==
// @name         MidenQuestPlus
// @namespace    MidenQuestPlus_tampermonkey
// @version      0.87
// @description  Provides the user with some enhancements to MidenQuest
// @author       Ryalane
// @updateURL    https://github.com/Ryalane/MidenQuestPlus/raw/master/MQP.user.js
// @match        http://www.midenquest.com/Game.aspx
// @resource     MainStylesheet https://raw.githubusercontent.com/Ryalane/MidenQuestPlus/master/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @homepage     https://github.com/Ryalane/MidenQuestPlus
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("MainStylesheet"));

    var versionString = "";
    if (typeof GM_info !== "undefined") {
        versionString = GM_info.script.version;
        console.log(versionString);
    }

/* Handle Settings */
var Settings = {
  setupUI: function () {

    // Make the container
    $('body').prepend('<div id="Custom_MainBar"></div>');
    // Set the title
    $('#Custom_MainBar').append('<h1 id="Custom_MainBar_Title"></h1>');
    $('#Custom_MainBar_Title').text('MidenQuest+ v' + versionString);
    // Setup boxes
    $('#Custom_MainBar').append('<div id="Custom_MainBar_Box_Workload" class="Custom_MainBar_Box"></div>');
    $('#Custom_MainBar_Box_Workload').append('<h1>Workload Settings</h1>');
    $('#Custom_MainBar').append('<div id="Custom_MainBar_Box_Chat" class="Custom_MainBar_Box"></div>');
    $('#Custom_MainBar_Box_Chat').append('<h1>Chat Settings');
    $('#Custom_MainBar').append('<div id="Custom_MainBar_Box_Reserved" class="Custom_MainBar_Box"></div>');
    $('#Custom_MainBar_Box_Reserved').append('<h1>Reserved Settings');

    // Match the navbar size
    $('#MainPanel').css('width', '1002px');
    $('#MainPanel').css('margin-top', '0px');
    $('#MainPanel').css('height', '765px');

    $('#ZoneContent').css('border-top-left-radius', '0px');
    $('#ZoneContent').css('padding-top', '0px');
    $('#TopScreen').css('padding-top', '0px');
    $('#ZoneOptions').css('border-top-right-radius', '0px');
    // Center the text a bit better
    $('.prgActionOverlay').css('margin-top', '-19px');
    // Footer settings
    var footer = $('.aLink').parent();
    $(footer).css('border-top', '0px');
  },

  load: function loadSetting() {
    var setting = localStorage.getItem('MidenQuestPlus-settings');

    try {
      setting = setting ? JSON.parse(setting) : {};
    } catch(e) {}

    setting = setting || {};

    return setting;
  },

  save: function saveSetting(settings) {
    localStorage.setItem('MidenQuestPlus-settings', JSON.stringify(settings));
  },

  // Containers in order (1 = Workload, 2 = Chat, 3 = Reserved)
  addBool: function addBoolSetting(container, name, description, defaultSetting, callback) {
    defaultSetting = settings[name] || defaultSetting;
    var AppendTo = '';

    if (container === 1) {
      AppendTo = $('#Custom_MainBar_Box_Workload');
    } else if (container === 2) {
      AppendTo = $('#Custom_MainBar_Box_Chat');
    } else if (container === 3) {
      AppendTo = $('#Custom_MainBar_Box_Reserved');
    }

    $(AppendTo).append('<div><label><input type="checkbox" name="setting-' + name + '"' + (defaultSetting ? ' checked' : '') + '>' + description + '</label></div>');
            $("input[name='setting-" + name + "']").change(function() {
                settings[name] = !settings[name];
                Settings.save(settings);

                if(callback) {
                    callback();
                }
            });
            if (settings[name] !== undefined) {
                $("input[name='setting-" + name + "']").prop("checked", settings[name]);
            } else {
                settings[name] = defaultSetting;
            }
  },

  addRadio: function addRadioSetting(container, name, description, items, defaultSettings, callback) {

  },

  addInput: function addInputSetting(container, name, description, defaultSetting, callback) {

  },

  addButton: function(appendToID, newButtonID, description, callback, options) {

  }
};

Settings.setupUI();
var settings = Settings.load();
Settings.addBool(1, "useAlerts", "Alert when out of work", false);
Settings.addBool(2, "allowTabCycling", "Change channels with tab", false);

// select the target node
var target = document.querySelector('#ChatLog');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation, i) {
    var messageContainer = $(mutation.addedNodes[0]);
    var message = mutation.addedNodes[i].innerText;
    // Check if its a log
    if (message) {
      var message_isLog = message.split(']')[1][0] === '[' ? false : true;
    }
    // If it isn't, then parse it
    if (!message_isLog && message) {
      var message_timeStamp = message.split(']')[0].substring(1);
      var message_Name = message.split(']')[2].substring(1).split(':')[0];
      // Handle the message text itself
      var message_Text_Array = message.split(':');
      var message_Text = '';
      if (message_Text_Array.length > 2) {
        for (var i = 0; i < message_Text_Array.length; i++) {
          if (i < 2) {
            // do nothing
          } else if (i > 2) {
            // Prepend with : since it got cut out
            message_Text += ":" + message_Text_Array[i];
          } else {
            // Just show it like normal since it's the first part of the message_Text
            message_Text = message_Text_Array[i].substring(1);
          }
        }
      }
      if (message_Name === userName) {
        // If it was sent by you, add a background
        messageContainer.css('background', '#ddd');
      }
      if (message_Text.toLowerCase().indexOf(userName.toLowerCase()) !== -1) {
          messageContainer.css('background','#FFA27F');
          messageContainer.css('width', '100%');
          // Play sound
          userIsMentioned = true;
      }
      console.log("Time: " + message_timeStamp + ", Name: " + message_Name + ", Text: " + message_Text);
      console.log(mutation);
    }
    messageContainer.css('width', '100%');
  });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// Setup the username
var userName = '';
var getUsername = function() {
  userName = $('#SideName').text();
  if (userName === '???' || userName === '') {
    setTimeout(getUsername, 100);
  } else {
    // When the name has been stored, start the chat observer
    observer.observe(target, config);
  }
}
// Give it 100 ms to load
setTimeout(getUsername, 100);


// Settings Used
// Workload_useAlerts = true/false
// Chat_AllowTabCycling = true/false

/* Modify the title of the page */
    var doneAlerting = false;
    var Production = '';
    var ProductionTitle = '';
    var isWorking = false;

    var MaxWorkload = 0;
    var CurWorkLoad = 0;

    var StopWorkButton = $('#workloadStopButton');

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
            if (settings.useAlerts && !doneAlerting) {

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

    // Handle Chat tab clicking
    $('#ChatCh1').click(function () {
      selectedTab = 1;
    });
    $('#ChatCh2').click(function () {
      selectedTab = 2;
    });
    $('#ChatCh3').click(function () {
      selectedTab = 3;
    });
    $('#ChatCh4').click(function () {
      selectedTab = 4;
    });

    // Setup the key events
    $( document ).keydown(function(e) {
        var keycode = (e.which) ? e.which : e.keyCode;
        if (keycode == 9)
        {
          // TODO: Shift + tab for PreviousTab()
          if (settings.allowTabCycling) {
            NextTab();
            e.preventDefault();
          }
        }
    });
})();
