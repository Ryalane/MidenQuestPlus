// ==UserScript==
// @name         MidenQuest+
// @namespace    https://github.com/Ryalane
// @version      0.1
// @description  MidenQuest Enhancement Script
// @author       Ryalane
// @include      http://www.midenquest.com/Game.aspx
// @include      http://midenquest.com/Game.aspx
// @grant        none
// ==/UserScript==

/**
  * Table of Contents
  *
  * Use Ctrl + F
  *
  * Settings:
  *   Settings Handling
  *
  * Page:
  *   Page Handling
  *
  * Server:
  *   Server Messages
  *
  * Chat:
  *   Chat Handling
  *
  * Work:
  *   Work Handling
  *
  * DOM:
  *   DOM Events
  *
  */


/**********************************
**                               **
**       Settings Handling       **
**                               **
**********************************/

var _Setting = _Setting || {};

/**
  * Retrieves the settings from the LocalStorage
  * @return {String} Settings
  */
_Setting.Load = function () {
  var setting = localStorage.getItem('MidenQuestPlus-settings');

  try {
    setting = setting ? JSON.parse(setting) : {};
  } catch(e) {}

  setting = setting || {};

  return setting;
};

/**
  * Saves the settings to the LocalStorage
  * @return {Void}
  */
_Setting.Save = function () {
  localStorage.setItem('MidenQuestPlus-settings', JSON.stringify(_Setting.settings));
};

_Setting.settings = _Setting.Load();

/**********************************
**                               **
**          Page Handling        **
**                               **
**********************************/

var _Page = _Page || {};

_Page.isLoaded = false;

/**
  * Creates a Checkbox
  * @param {String} a_Container
  * @param {String} a_Name
  * @param {String} a_Description
  * @param {String} a_DefaultSetting
  * @param {Function} a_callback
  * @return {Void}
  */
_Page.AddBool = function (a_Container, a_Name, a_Description, a_DefaultSetting, a_Callback) {
  defaultSetting = _Setting.settings[a_Name] || a_DefaultSetting;

  var AppendTo = $(a_Container);

  $(AppendTo).append('<div><label><input type="checkbox" name="setting-' + a_Name + '"' + (a_DefaultSetting ? ' checked' : '') + '>' + a_Description + '</label></div>');
          $("input[name='setting-" + a_Name + "']").change(function() {
              _Setting.settings[a_Name] = !_Setting.settings[a_Name];
              _Setting.Save(_Setting.settings);

              if(a_Callback) {
                  callback();
              }
          });
          if (_Setting.settings[a_Name] !== undefined) {
              $("input[name='setting-" + a_Name + "']").prop("checked", _Setting.settings[a_Name]);
          } else {
              _Setting.settings[a_Name] = defaultSetting;
          }
};

/**
  * Creates a Radio button
  * @return {Void}
  */
_Page.AddRadio = function () {

};

/**
  * Creates an Input box
  * @param {String} a_Container
  * @param {String} a_Name
  * @param {String} a_Description
  * @param {String} a_DefaultSetting
  * @param {Function} a_callback
  * @return {Void}
  */
_Page.AddInput = function (a_Container, a_Name, a_Description, a_DefaultSetting, a_Callback) {
  a_DefaultSetting = _Setting.settings[a_Name] || a_DefaultSetting;
  var AppendTo = $(a_Container);

  $(AppendTo).append('<div><label>' + a_Description + '</label><input type="text" name="setting-' + a_Name + '"></div>');
  $("input[name='setting-" + a_Name + "']").prop("defaultValue", a_DefaultSetting)
      .on("change", function() {

          _Setting.settings[a_Name] = String($(this).val());
          _Setting.Save(_Setting.settings);

          if(a_Callback) {
              callback();
          }
  });
  _Setting.settings[a_Name] = a_DefaultSetting;
};

/**
  * Creates a Button
  * @return {Void}
  */
_Page.AddButton = function () {

};

/**
  * Adds a style to the head element
  * @param {String} StyleRules
  * @return {Void}
  */
_Page.SetStyle = function (StyleRules) {
  $( "<style>" + StyleRules + "</style>").appendTo( "head" );
};

/**
  * Sets the page title
  * @return {Void}
  */
_Page.SetTitle = function (Title) {
  if (Title) {
    document.title = title;
  }
};

/**
  * Sets up the page
  * @return {Void}
  */
_Page.SetupUI = function (Username) {
  _Page.isLoaded = true;
  // Make the container
  $('body').prepend('<div id="Custom_MainBar"></div>');
  // Set the title
  $('#Custom_MainBar').append('<h1 id="Custom_MainBar_Title"></h1>');
  $('#Custom_MainBar_Title').text('MidenQuest+ v0.1');
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

  // Setup the style
  _Page.SetStyle( "#Custom_MainBar {" +
                  "width: 992px;" +
                  "min-height: 90px;" +
                  "max-height: 270px;" +
                  "display: block;" +
                  "position: relative;" +
                  "margin: auto;" +
                  "color: #ccc;" +
                  "background-color: #1A3753;" +
                  "border-radius: 5px 5px 0px 0px;" +
                  "border-bottom: 1px white solid;" +
                  "padding: 5px;" +
                  "}" +
                  ".Custom_MainBar_Box {" +
                  "width: 300px;" +
                  "height: 69px;" +
                  "border: 1px white solid;" +
                  "padding: 5px;" +
                  "margin: 5px;" +
                  "display: inline-flex;" +
                  "align-content: space-between;" +
                  "align-items: center;" +
                  "flex-direction: column;" +
                  "flex-wrap: nowrap;" +
                  "overflow-x: hidden;" +
                  "overflow-y: overlay;" +
                  "}" +
                  ".chat-timestamp {" +
                  "font-weight: normal;" +
                  "}" +
                  ".chat-title {" +
                  "font-weight: bold;" +
                  "}" +
                  ".chat-name {" +
                  "font-weight: bold;" +
                  "}" +
                  ".chat-message {" +
                  "font-weight: normal;" +
                  "}" +
                  ".chat-shout:nth-child(even) {" +
                  "background: #FFF;" +
                  "}" +
                  ".chat-shout:nth-child(odd) {" +
                  "background: #e6e6e6;" +
                  "}" +
                  ".chat-shout {" +
                  "padding: 2px;" +
                  "font-size: 16px;" +
                  "}" +
                  ".chat-notification {" +
                  "font-size: 20px;" +
                  "font-weight: bold;" +
                  "color: #01AAFF;" +
                  "}"
  );

  _Page.AddBool('#Custom_MainBar_Box_Chat', "allowTabCycling", "Change channels with tab", false);
  _Page.AddInput('#Custom_MainBar_Box_Chat', 'MaxChatHistory', "Max Chat History", 50);
  _Page.AddInput('#Custom_MainBar_Box_Chat', 'mentionTriggers', 'Mention Keywords', Username);
  _Page.AddInput('#Custom_MainBar_Box_Chat', 'mentionBackground', 'Mention Background Colour', 'rgba(255, 165, 50, 0.5)');

  $("#ChatCh1").click(function () {
    if (_Chat.CurrentTab != 1) {
      _Chat.CurrentTab = 1;
      ChangeChatChannel(1);
      _Chat.Clear();
      _Chat.ResetTab(1);
    }
  });
  $("#ChatCh2").click(function () {
    if (_Chat.CurrentTab != 2) {
      _Chat.CurrentTab = 2;
      ChangeChatChannel(2);
      _Chat.Clear();
      _Chat.ResetTab(2);
    }
  });
  $("#ChatCh3").click(function () {
    if (_Chat.CurrentTab != 3) {
      _Chat.CurrentTab = 3;
      ChangeChatChannel(3);
      _Chat.Clear();
      _Chat.ResetTab(3);
    }
  });
  $("#ChatCh4").click(function () {
    if (_Chat.CurrentTab != 4) {
      _Chat.CurrentTab = 4;
      ChangeChatChannel(4);
      _Chat.Clear();
      _Chat.ResetTab(4);
    }
  });

  $( document ).keydown(function(e) {
      var keycode = (e.which) ? e.which : e.keyCode;
      if (keycode == 9)
      {
        _Chat.NextTab();
        e.preventDefault();
      }
  });

  ChangeChatChannel(2);

  ChangeChatChannel(1);
  _Chat.Clear();
};

/**********************************
**                               **
**         Server Messages       **
**                               **
**********************************/

var _ServerMessage = _ServerMessage || {};

/**
  * List of all server Options
  * TODO: Finish adding server options
  */
_ServerMessage.Options = {
    Connect:          "CONNECTED",
    SetName:          "SETNAME",
    SetTitleCount:    "SETTITLECOUNT",
    SetLevel:         "SETLVL",
    SetGold:          "SETGOLD",
    SetElements:      "SETME",
    SetRelics:        "SETRELIC",
    SetGems:          "SETGEM",
    SetKeys:          "SETKEY",
    SetKingdom:       "SETKING",
    SetLocation:      "SETLOC",
    GetMinimap:       "LOADMINIMAP",
    CD:               "SETCD",
    ChatNotification: "CHATNOTIF",
    Notification:     "NOTIF",
    Captcha:          "CAPTCHA_CHALLENGE",
    LoadLog:          "LOGSTART",
    Log:              "NLOG",
    Message:          "CHATNEW",
    ChatStarted:      "CHATSTART",
    Channel:          "CHANNEL",
    LoadPage:         "LOADPAGE",
    TSData:           "TSLVL",
    TSOdds:           "TSODDS",
    TSBonus:          "TSBONUS",
    SetOre:           "SETORE",
    SetPlant:         "SETPLANT",
    SetWood:          "SETWOOD",
    SetFish:          "SETFISH",
    BoostTimer:       "TIMER",
    OpenChest:        "OPENR" /* Got relics, may be different for gems and ME */
};

/**
  * Finds the option of the Data
  * @param {String} a_Data
  * @return {Void}
  */
_ServerMessage.Compute = function (a_Data) {
  var RawData = a_Data.data;
  var Command;
  var Info;
  var Arr = RawData.split('|');

  Command = Arr[0];
  Info = Arr[1];

  if (Command) {
    for (var i = 0; i < Object.keys(_ServerMessage.Options).length; i++) {
      var key = Object.keys(_ServerMessage.Options)[i];
      var value = _ServerMessage.Options[key];
      if (Command === value) {
        // We have a match; move on
        switch (key) {
          case "ChatStarted":
            if (_Page.isLoaded) {
              _Chat.UpdateChat(Info);
            } else {
              _Chat.Clear();
            }
          break;
          case "Message":
            if (_Page.isLoaded) {
              _Chat.SendMessage(Info);
            }
          break;
          case "ChatNotification":
            if (_Page.isLoaded) {
              _Chat.UpdateTab(Info);
            }
          break;
          case "SetName":
            if (!_Page.isLoaded) {
              _Page.SetupUI(Info);
            }
            ServerReceptionHandler(RawData);
          break;
          default:
            ServerReceptionHandler(RawData);
          break;
        }
      }
    }
  }
};

/**********************************
**                               **
**         Chat Handling         **
**                               **
**********************************/

var _Chat = _Chat || {};

/**
  * Used to increment the chat message ID's
  */
_Chat.IDNum = 0;

/**
  * Creates a Message object to be used in sending messages
  * @param {String} a_Text
  * @param {String} a_Username
  * @param {String} a_Title
  * @param {String} a_Title_Color
  * @param {String} a_Link
  * @param {String} a_Timestamp
  * @param {Bool} [a_isNotification=false]
  * @return {Void}
  */
_Chat.Message = function(a_Text, a_Username, a_Title, a_Title_Color, a_Link, a_Timestamp, a_isNotification = false) {
  this.Text = a_Text;
  this.Username = a_Username;
  this.Title = {Text: a_Title, Color: a_Title_Color};
  this.UserPage = a_Link;
  this.Timestamp = a_Timestamp;
  this.isNotification = a_isNotification;
};

/**
  * Goes through the given data and gleans required information for a chat message
  * @param {String} Message
  * @return {Message} The Parsed Message or {Void} if there's an error
  */
_Chat.ParseMessage = function (Message) {

  var MessageTimestamp; //
  var MessageTitleText; //
  var MessageUsername;  //
  var MessageText;      //
  var MessageTitleColor;
  var MessageLink;

  // Check if there's really a message
  if (Message) {

    var chatText = $($(Message)[0]).text();
    var linkElement = $(Message)[0].children[0].children[0];

    if (chatText.split(']').length < 3) {
      // It's a notification
      //split('[')[1].split(']'); 0 = time, 1 = name + message
      MessageTimestamp = chatText.split('[')[1].split(']')[0];
      MessageUsername = chatText.split('[')[1].split(']')[1].split(' ')[0];
      MessageText = chatText.split('[')[1].split(']')[1].substring(MessageUsername.length + 1);

      return new _Chat.Message(MessageText, MessageUsername, null, null, null, MessageTimestamp, true);
    } else {
      MessageTimestamp = chatText.split('[')[1].slice(0,-1);
      MessageTitleText = chatText.split(']')[1].substring(1);
      MessageUserTemp = chatText.split(']')[2].substring(1);
      MessageUsername = MessageUserTemp.split(':')[0];
      ChatWithoutTitleandTime = chatText.split(']');
      tempBracketText = chatText.split(']');
      // If it's over 3 then the user sent a ] in there message.. go fix it
      BracketFix = "";
      if (tempBracketText.length > 3) {
        tempBracketText.forEach(function (element, index) {
          if (index < 2) {
            // We don't need the first 2
          } else if (index === 2) {
            BracketFix = element.substring(1);
          } else {
            BracketFix += "]" + element;
          }
        });
      } else {
        BracketFix = tempBracketText[2].substring(1);
      }

      tempColonFix = BracketFix.split(':');
      ColonFix = "";
      if (tempColonFix.length > 2) {
        // Get rid of the name
        tempColonFix.shift();
        tempColonFix.forEach(function (element, index) {
          if (index === 0 ) {
            ColonFix = element.substring(1);
          } else {
            ColonFix += ":" + element;
          }
        });
      } else {
        tempColonFix.shift();
        ColonFix = tempColonFix[0].substring(1);
      }
      MessageText = ColonFix;

      // Get the Title Color
      MessageTitleColor = $(linkElement).attr('style').substring(6);
      MessageTitleColor = MessageTitleColor.slice(0,-1);
      MessageLink = $(linkElement).attr('onclick');

      // Build the object
      //(a_Text, a_Username, a_Title, a_Title_Color, a_Link, a_Timestamp, a_isNotification = false)
      return new _Chat.Message(MessageText, MessageUsername, MessageTitleText, MessageTitleColor, MessageLink, MessageTimestamp);
    }

  } else {
    return null;
  }
};

/**
  * Clears the chat box
  * @return {Void}
  */
_Chat.Clear = function () {
  $('#ChatLog').empty();
};

/**
  * Removes any messages over _Setting.settings.MaxChatHistory
  * @return {Void}
  */
_Chat.RemoveMessage = function () {
// Check if the chat is over the max
  if ($('.chat-shout').length > _Setting.settings.MaxChatHistory) {
    // If it is the remove the last message
    $('.chat-shout')[_Setting.settings.MaxChatHistory].remove();
  }
};

_Chat.CheckMentions = function (Message) {
  if (_Setting.settings) {
    // Split up the mentions
    var Triggers = _Setting.settings.mentionTriggers.split(',');
    // Loop through mentions
    Triggers.forEach(function(Trigger) {
      if (Message.Text.toLowerCase().indexOf(Trigger.toLowerCase()) !== -1) {

        $('#' + _Chat.IDNum).css('background', _Setting.settings.mentionBackground);
      }
    });
  }
};

/**
  * Updates the chat window when the user goes to a different tab
  * @param {String} Message
  * @return {Void}
  */
_Chat.UpdateChat = function (Message) {
  var chatText = $(Message);

  for (var i = chatText.length - 1; i >= 0; i--) {
    if ($(chatText[i]).prop('nodeName').toLowerCase() === 'div') {
      _Chat.SendMessage(chatText[i]);
    }
  }
};


/**
  * Sends a message to the chat box
  * @return {Void}
  */
_Chat.SendMessage = function (Message) {
  var ParsedMessage = _Chat.ParseMessage(Message);

  if (ParsedMessage) {

    if (ParsedMessage.isNotification) {
      var Timestamp = '<span class="chat-timestamp">[' + ParsedMessage.Timestamp + ']</span>';
      var Name = '<span class="chat-name"> ' + ParsedMessage.Username + ' </span>';
      var MessageText = '<span class="chat-message">' + ParsedMessage.Text + '</span>';
      $('#ChatLog').prepend('<div class="chat-shout chat-notification" id="' + _Chat.IDNum + '"></div>');
      $('#' + _Chat.IDNum).append(Timestamp);
      $('#' + _Chat.IDNum).append(Name);
      $('#' + _Chat.IDNum).append(MessageText);
    } else {
      var Timestamp = '<span class="chat-timestamp">[' + ParsedMessage.Timestamp + ']</span>';
      var Title = '<span class="chat-title" onclick="' + ParsedMessage.UserPage + '" style="color: ' + ParsedMessage.Title.Color + '">[' + ParsedMessage.Title.Text + '] </span>';
      var Name = '<span class="chat-name" onclick="' + ParsedMessage.UserPage + '">' + ParsedMessage.Username + ': </span>';
      var MessageText = '<span class="chat-message">' + ParsedMessage.Text + '</span>';
      $('#ChatLog').prepend('<div class="chat-shout" id="' + _Chat.IDNum + '"></div>');
      $('#' + _Chat.IDNum).append(Timestamp);
      $('#' + _Chat.IDNum).append(Title);
      $('#' + _Chat.IDNum).append(Name);
      $('#' + _Chat.IDNum).append(MessageText);
    }

    _Chat.CheckMentions(ParsedMessage);
    _Chat.IDNum++;
    _Chat.RemoveMessage();

  }
};

/**
  * List of tab names
  */
_Chat.TabNames = ["Public", "Help", "Kingdom", "Recruit"];
/**
  * Used to keep track of unread messages
  */
_Chat.UnreadMessages = [0, 0, 0, 0];
/**
  * Current TabNames
  */
_Chat.CurrentTab = 0;

/**
  * Updates the tab notification number
  * @param {Int} tabID
  * @return {Void}
  */
_Chat.UpdateTab = function (tabID) {
  _Chat.UnreadMessages[tabID - 1]++;
  var UnreadMessageCount = _Chat.UnreadMessages[tabID - 1];
  var TabName = _Chat.TabNames[tabID - 1];
  var Tab = $('#ChatName' + tabID);
  $(Tab).text(TabName + " (" + UnreadMessageCount + ")");
};

/**
  * Resets the tab notification number
  * @param {Int} tabID
  * @return {Void}
  */
_Chat.ResetTab = function (tabID) {
  _Chat.UnreadMessages[tabID - 1] = 0;
  var TabText = $('#ChatName' + tabID).text();
  $('#ChatName' + tabID).text(_Chat.TabNames[tabID - 1]);
};

_Chat.NextTab = function () {
  // Only run if it's allowed
  if (_Setting.settings.allowTabCycling) {

    var CurrentTabID = $('.TabSel').prop('id');
    var CurrentTab = CurrentTabID[CurrentTabID.length -1];
    var NextTab;

    if (CurrentTab < 4) {
      NextTab = +CurrentTab + 1;
    } else {
      NextTab = 1;
    }
    ChangeChatChannel(NextTab);
    _Chat.Clear();
    _Chat.ResetTab(NextTab);
    _Chat.CurrentTab = NextTab;
  }
}

/**********************************
**                               **
**         Work Handling         **
**                               **
**********************************/


var _Work = _Work || {};

// Return the workload
_Work.Workload = function () {

};

// Return true/false if is working
_Work.isWorking = function () {

};

// Return the type of work that's being done
_Work.WorkType = function () {

};


/**********************************
**                               **
**          DOM Events           **
**                               **
**********************************/


var getOption = function(data) {
  ServerReceptionHandler(a_Data);
  var Arr = data.split('|');
  var Command = Arr[0];
  if (Command === "CHATNEW") {
    var ChatInfo = Arr[1];
    var chatText = $($(ChatInfo)[0]).text();
    console.log(chatText);
  }
};

function onmsg(evt) {
  getOption(evt.data);
	_ServerMessage.Compute(evt.data);
};

ws.onmessage=_ServerMessage.Compute;
