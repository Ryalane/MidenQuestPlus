/**********************************
**                               **
**          Page Settings        **
**                               **
**********************************/

var _PageSetting = _PageSetting || {};

/**
  * Adds a style to the head element
  * @param {String} StyleRules
  */
_PageSetting.SetStyle = function (StyleRules) {
  $( "<style>" + StyleRules + "</style>").appendTo( "head" );
};

/**********************************
**                               **
**         Server Messages       **
**                               **
**********************************/

var _ServerMessage = _ServerMessage || {};

/**
  * List of all server Options
  */
_ServerMessage.Options = {
    CD:               "SETCD",
    ChatNotification: "CHATNOTIF",
    GetName:          "SETNAME",
    LoadLog:          "LOGSTART",
    Log:              "NLOG",
    Location:         "SETLOC",
    Message:          "CHATNEW",
    ChatStarted:      "CHATSTART",
    Channel:          "CHANNEL",
    Timer:            "TIMER",
    LoadPage:         "LOADPAGE",
    TSData:           "TSLVL",
    Ore:              "SETORE"
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
            _Chat.SendMessage(Info);
          break;
          case "Message":
            _Chat.SendMessage(Info);
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

    MessageTimestamp = chatText.split('[')[1].slice(0,-1);
    MessageTitleText = chatText.split(']')[1].substring(1);
    MessageUsername = chatText.split(' ')[1].slice(0,-1);
    tempText = chatText.split(' ');
    if (tempText.length > 3) {
      tempText.shift(); // Get rid of the title + timestamp
      tempText.shift(); // Get rid of the name
      MessageText = tempText.join(' ');
    } else {
      MessageText = tempText[2];
    }

    // Get the Title Color
    MessageTitleColor = $(linkElement).attr('style').substring(6);
    MessageTitleColor = MessageTitleColor.slice(0,-1);
    MessageLink = $(linkElement).attr('onclick');

    // Build the object
    //(a_Text, a_Username, a_Title, a_Title_Color, a_Link, a_Timestamp, a_isNotification = false)
    return new _Chat.Message(MessageText, MessageUsername, MessageTitleText, MessageTitleColor, MessageLink, MessageTimestamp);

  } else {
    return null;
  }
  console.log($(Message)[0]);
  console.log(chatText);
};

/**
  * Clears the chat box
  * @return {Void}
  */
_Chat.Clear = function () {

};

/**
  * Removes any messages over _Setting.settings.MaxChatHistory
  * @return {Void}
  */
_Chat.RemoveMessage = function () {

};

/**
  * Updates the chat window when the user goes to a different tab
  * @param {String} Message
  * @return {Void}
  */
_Chat.UpdateChat = function (Message) {
  // Loop through and call SendMessage for each element
  // May be reversed
};


/**
  * Sends a message to the chat box
  * @return {Void}
  */
_Chat.SendMessage = function (Message) {
  var ParsedMessage = _Chat.ParseMessage(Message);

  if (ParsedMessage) {

    if ($('.chat-shout').length >= 49) {
        $('.chat-shout')[50].remove();
      //ChatIDNum = 0;
    }
    var Timestamp = '<span class="chat-timestamp">[' + ParsedMessage.Timestamp + ']</span>';
    var Title = '<span class="chat-title" onclick="' + ParsedMessage.UserPage + '" style="color: ' + ParsedMessage.Title.Color + '">[' + ParsedMessage.Title.Text + '] </span>';
    var Name = '<span class="chat-name" onclick="' + ParsedMessage.UserPage + '">' + ParsedMessage.Username + ': </span>';
    var MessageText = '<span class="chat-message">' + ParsedMessage.Text + '</span>';
    $('#ChatLog').prepend('<div class="chat-shout" id="' + _Chat.IDNum + '"></div>');
    $('#' + _Chat.IDNum).append(Timestamp);
    $('#' + _Chat.IDNum).append(Title);
    $('#' + _Chat.IDNum).append(Name);
    $('#' + _Chat.IDNum).append(MessageText);
    _Chat.IDNum++;

  }
};

/**
  * Updates the tab notification number
  * @param {Int} tabID
  * @return {Void}
  */
_Chat.UpdateTab = function (tabID) {

};

/**
  * Resets the tab notification number
  * @param {Int} tabID
  * @return {Void}
  */
_Chat.ResetTab = function (tabID) {

};

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
**       Settings Handling       **
**                               **
**********************************/

var _Setting = _Setting|| {};

_Setting.settings = '';




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
