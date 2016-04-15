var PageSettings = PageSettings || {};

PageSettings.SetStyle = function (StyleRules) {
  $( "<style>" + StyleRules + "</style>").appendTo( "head" );
}

/*
var Timestamp = '<span class="chat-timestamp">' + Message.Timestamp + '</span>';
var Title = '<span class="chat-title" onclick="' + Message.UserPage + '" style="color: ' + Message.Title.Color + '">' + Message.Title.Text + ' </span>';
var Name = '<span class="chat-name" onclick="' + Message.UserPage + '">' + Message.Username + ': </span>';
var MessageText = '<span class="chat-message">' + Message.Text + '</span>';
$('#ChatLog').prepend('<div class="chat-shout" id="' + UniqueID + '"></div>');
*/
PageSettings.SetupPage = function () {
  // Setup the chat
  this.SetStyle(".chat-shout { font-size: 16px; padding: 2px; } .chat-shout:nth-child(even) { background: #FFF; } .chat-shout:nth-child(odd) { background: #e6e6e6; } .chat-title { font-weight: bold; } .chat-name { font-weight: bold; }");
}

PageSettings.SetupPage();

var ServerMessages = ServerMessages || {};

ServerMessages.Options = {
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

ServerMessages.GenerateUniqueID = function (length = 6) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

ServerMessages.Message = function(a_Text, a_Username, a_Title, a_Link, a_Timestamp, a_isEmpty = false, a_isNotification = false) {
  this.Text = a_Text;
  this.Username = a_Username;
  this.Title = a_Title
  this.UserPage = a_Link;
  this.Timestamp = a_Timestamp;
  this.isEmpty = a_isEmpty;
  this.isNotification = a_isNotification;
}

/* LONG PARSING METHOD */

ServerMessages.ParseMessage = function(data) {
  var splitData = data.split('|');
  // Remove the header
  splitData.shift();

  // Setup variables
  var Message = splitData;
  var regex_Time_Stamp = /( )(.{16})(.{7})/i;
  var Message_timeStamp;
  var regex_Name_and_Title = /style="font-size:smaller;">(.*)<\/a>/i;
  var Message_Name;
  var Message_Title;
  var regex_Title_Color = /(style="color:)(.{7})/i;
  var Message_Title_Color;
  var Message_Text_Array;
  var regex_Message_Text = /word-wrap: break-word(.*)<\/span>/i;
  var Message_Text;
  var regex_Message_Link = /onclick="(.*)event.preventDefault\(\);/i;
  var Message_Link;
  var regex_isNotification = /<span style='font-weight: bold; color: #253ECC;(.*)<br \/>/i;
  var isNotification = false;
  var m;
  // Check if it's a notification first
  if (Message) {
    var temp = String(Message).match(regex_isNotification);
    if (temp) {
      temp = new this.Message(Message, "", {Text: "", Color: ""}, "", "", false, true);
      this.PostToChatBox(temp);
      isNotification = true;
    }
  }

  // Check just to make sure the message isn't empty
  if (Message && !isNotification) {
    // Get the title colour
    Message_Text = String(Message).match(regex_Message_Text)[1].substring(3);
    tempNameTitle = String(Message).match(regex_Name_and_Title)[1].split(' ');
    Message_Name = tempNameTitle[1];
    Message_Title = tempNameTitle[0].slice(0,-7);
    Message_Link = String(Message).match(regex_Message_Link)[0].substring(9);
    Message_Title_Color = String(Message).match(regex_Title_Color)[2];
    Message_timeStamp = String(Message).match(regex_Time_Stamp)[3];

    temp = new this.Message(Message_Text, Message_Name, {Text: Message_Title, Color: Message_Title_Color}, Message_Link, Message_timeStamp);
    this.PostToChatBox(temp)

  }
}

/* LONG PARSE METHOD IS DONE */

ServerMessages.PostToChatBox = function(Message) {
  // Check if the message is empty or null
  if (!Message.isEmpty && Message) {
    // Check if its a notification
    if (Message.isNotification) {
      $('#ChatLog').prepend(Message.Text);
    } else {
      var UniqueID = this.GenerateUniqueID(10);
      var Timestamp = '<span class="chat-timestamp">' + Message.Timestamp + '</span>';
      var Title = '<span class="chat-title" onclick="' + Message.UserPage + '" style="color: ' + Message.Title.Color + '">' + Message.Title.Text + ' </span>';
      var Name = '<span class="chat-name" onclick="' + Message.UserPage + '">' + Message.Username + ': </span>';
      var MessageText = '<span class="chat-message">' + Message.Text + '</span>';
      $('#ChatLog').prepend('<div class="chat-shout" id="' + UniqueID + '"></div>');
      $('#' + UniqueID).append(Timestamp);
      $('#' + UniqueID).append(Title);
      $('#' + UniqueID).append(Name);
      $('#' + UniqueID).append(MessageText);
    }
  }

}

ServerMessages.getOption = function(data) {
  var Command = data.split('|')[0];

  var OptionSize = Object.keys(this.Options).length;
  tempData = data;
  for (var i = 0; i < OptionSize; i++) {

    var key = Object.keys(this.Options)[i];
    var value = this.Options[key];
    if (value === Command) {
      // If the value is a known command, then get the parser up
      //TODO: Intercept ONLY messages
      if (key === "Message") {
        this.ParseMessage(data);
      } else if (key === "ChatStarted") {
        // Loop through all the messages and parse them
        $('#ChatLog').empty();
        var tempregex = /<div id='chatShout1'>(.*?)<\/div>/g;
        var matches = data.match(tempregex);
        for (var j = matches.length - 1; j >= 0; j--) {
          tempMatch = "CHATSTART|" + matches[j];
          this.ParseMessage(tempMatch);
        }

      } else {
        ServerReceptionHandler(data);
      }
    }
  }
}

function onmsg(evt) {
ServerMessages.getOption(evt.data);
};
// Start watching incoming messages
ws.onmessage=onmsg;
