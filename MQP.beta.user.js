// ==UserScript==
// @name         MidenQuestPlus
// @namespace    MidenQuestPlus_tampermonkey
// @version      0.92
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
    defaultSetting = settings[name] || defaultSetting;
    var AppendTo = '';

    if (container === 1) {
      AppendTo = $('#Custom_MainBar_Box_Workload');
    } else if (container === 2) {
      AppendTo = $('#Custom_MainBar_Box_Chat');
    } else if (container === 3) {
      AppendTo = $('#Custom_MainBar_Box_Reserved');
    }

    $(AppendTo).append('<div><label>' + description + '</label><input type="text" name="setting-' + name + '"></div>');
    $("input[name='setting-" + name + "']").prop("defaultValue", defaultSetting)
        .on("change", function() {

            settings[name] = String($(this).val());
            Settings.save(settings);

            if(callback) {
                callback();
            }
    });
    settings[name] = defaultSetting;
  },

  addButton: function(appendToID, newButtonID, description, callback, options) {

  }
};

Settings.setupUI();
var settings = Settings.load();
Settings.addBool(1, "useAlerts", "Alert when out of work", false);
Settings.addBool(2, "allowTabCycling", "Change channels with tab", false);
Settings.addInput(2, "userBackground", "User Backround Colour", "#DDD");
Settings.addInput(2, "mentionBackground", "Mention Background Colour", "#FFA27F");

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

/* CHAT METHODS AND LOGIC GO HERE */

var ParseChat = function(MessageContainer) {
  var Message;
  var Message_timeStamp;
  var Message_Name;
  var Message_Title;
  var Message_Title_Color;
  var Message_Text_Array;
  var Message_Text;
  var Message_isLog = false;
  var Message_isLineBreak = false;
  if (MessageContainer) {
    // Make sure the container exists first
    Message = $(MessageContainer).text();
    console.log("Before checks: " + $(MessageContainer).prop('nodeName'));
    // Pass over quickly
    if (Message) {
      // Check if its a br element
      Message_isLineBreak = $(MessageContainer).prop('nodeName').toLowerCase() == 'br' ? true : false;
      console.log(Message_isLineBreak);

      if (!Message_isLineBreak) {
        // Double check
        Message_isLineBreak = Message.length > 5 ? false : true;
      }
        Message_isLog = Message.split(']')[1][0] === '[' ? false : true;
    }

    // If it's not a log or line break, then parse:
    if (!Message_isLog && !Message_isLineBreak && Message) {
      // Get the timestamp
      Message_timeStamp = Message.split(']')[0].substring(1);
      console.log(Message_timeStamp);
      console.log(Message);
      // Get the person sending the message
      Message_Name = Message.split(']')[2].substring(1).split(':')[0];

      // Get the users title
      Message_Title = Message.split(' ')[0].substring(7);
      // Get the users title colour
      // TODO: Get this into 1 line
      var Title_Color_Holder = $(MessageContainer).children().children()[0];
      Message_Title_Color = $(Title_Color_Holder).css('color');

      // Parse the message itself
      Message_Text_Array = Message.split(':');
      // If there's more than the default amount of :'s then that means a user sent 1
      if (Message_Text_Array.length > 2) {
        // Loop through each element in the array
        for (var i = 0; i < Message_Text_Array.length; i++) {
          if (i < 2) {
            // This is the stuff we don't want
          } else if (i > 2) {
            // This is what the user sent that got cut out; so add a :
            Message_Text += ":" + Message_Text_Array[i];
            // Can use += since it'll always be after the normal message
          } else {
            // The first part of the message
            Message_Text = Message_Text_Array[i].substring(1);
          }
        }
      }

      // Now we have to put all this new info into an object
      var ReturnValue = {Raw: Message, TimeStamp: Message_timeStamp, Name: Message_Name, MessageText: Message_Text, MessageTitle: Message_Title, MessageTitleColor: Message_Title_Color};
      return ReturnValue;
    } else if (Message_isLog) {
      // If its a log, just mark it as 1 and return it as it is
      return {MessageText: Message_Text, isLog: true};
    } else {
      // Just mark it as a line break
      return {isLineBreak: true};
    }
  } else {
    return {noContainer: true};
  }
};

// Observer starts in GetUsername()
var ChatBox = document.querySelector('#ChatLog');

var ChatMutationHandler = function(mutations) {
  console.log("Observer on");
  mutations.forEach(function(mutation, i) {
      var CurrentMessage = $(mutation.addedNodes[i]);

      if (CurrentMessage) {
        HandleChat(CurrentMessage);
      }
  });
};

// create an observer instance
var observer = new MutationObserver(ChatMutationHandler);

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

var ChatChange = function() {
  // Maybe going to need to set timeout
  console.log("ChatChange");
  observer.disconnect();
  setTimeout(function() {
    var Messages = $('#ChatLog').children();
    for (var i = 0; i < Messages.length; i++) {
      // Go through every child, including line breaks
      var CurrentMessage = $(Messages)[i];
      if (CurrentMessage) {
        HandleChat(CurrentMessage);
      }
    }
      observer.observe(ChatBox, config);
  }, 200);
};

// Setup the username
var userName = '';
var getUsername = function() {
  userName = $('#SideName').text();
  if (userName === '???' || userName === '') {
    setTimeout(getUsername, 250);
  } else {
    observer.observe(ChatBox, config)
  }
}
// Give it 100 ms to load
setTimeout(getUsername, 250);

var HandleChat = function(MessageContainer) {
  var ParsedMessage = ParseChat(MessageContainer);

  if (ParsedMessage.noContainer) {
    // Nothing to do
  } else if (ParsedMessage.isLineBreak) {
    $(MessageContainer).remove();
  } else if (ParsedMessage.isLog) {
    // Log
  } else {
    // Check if the message was sent by you
    if (ParsedMessage.Name === userName) {
      $(MessageContainer).css('background', settings.userBackground);
    }
    // Check if you were mentioned
    if (ParsedMessage.MessageText.toLowerCase().indexOf(userName.toLowerCase()) !== -1) {
      $(MessageContainer).css('background', settings.mentionBackground);
      $(MessageContainer).css('width', '100%');
    }

    $(MessageContainer).css('width', '100%');
  }
};

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

    // Handle Chat tab clicking
    $('#ChatCh1').click(function () {
      selectedTab = 1;
      ChatChange();
    });
    $('#ChatCh2').click(function () {
      selectedTab = 2;
      ChatChange();
    });
    $('#ChatCh3').click(function () {
      selectedTab = 3;
      ChatChange();
    });
    $('#ChatCh4').click(function () {
      selectedTab = 4;
      ChatChange();
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


/*TODO:
*
* Allow custom chat mention phrases
* Allow for user background and mention background customization
*
* Clean up the chat everytime it's changed or restarted
*
* Use an observer for the workload (.prgActionOverlay)
*/
