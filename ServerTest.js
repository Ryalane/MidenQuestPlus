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
          Ore:              "SETORE"};

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
  var regex_Message_Link = /\((.*)\)/i;
  var Message_Link;
  var regex_isNotification = /<span style='font-weight: bold; color: #253ECC;(.*)<br \/>/i;
  var isNotification = false;
  var m;
  // Check if it's a notification first
  if (Message) {
    var temp = String(Message).match(regex_isNotification);
    if (temp) {
      temp = new this.Message(Message, "", {Text: "", Color: ""}, "", "");
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
    Message_Link = "sendRequestContentFill" + String(Message).match(regex_Message_Link)[0] + ";";
    Message_Title_Color = String(Message).match(regex_Title_Color)[2];
    Message_timeStamp = String(Message).match(regex_Time_Stamp)[3];

    temp = new this.Message(Message_Text, Message_Name, {Text: Message_Title, Color: Message_Title_Color}, Message_Link, Message_timeStamp);
    console.log(temp);

  }
}

/* LONG PARSE METHOD IS DONE */

ServerMessages.getOption = function(data) {
  var Command = data.split('|')[0];

  var OptionSize = Object.keys(this.Options).length;
  for (var i = 0; i < OptionSize; i++) {

    var key = Object.keys(this.Options)[i];
    var value = this.Options[key];
    console.log("Checking key: " + key + ", value: " + value);
    if (value === Command) {
      // If the value is a known command, then get the parser up
      //TODO: Intercept ONLY messages
      switch (key) {
        case "Message":
          this.ParseMessage();
        break;
        case "ChatStarted":
          //this.ParseMessage();
        break;
      }
    }
  }
}

var ServerMessage = {
  Data: "",
  Options: {CD:               "SETCD",
            ChatNotification: "CHATNOTIF",
            LoadLog:          "LOGSTART",
            Log:              "NLOG",
            Location:         "SETLOC",
            Message:          "CHATNEW",
            ChatStarted:      "CHATSTART",
            Channel:          "CHANNEL",
            Timer:            "TIMER",
            LoadPage:         "LOADPAGE",
            TSData:           "TSLVL",
            Ore:              "SETORE",},

  getOption: function(data) {
    this.Data = data;
    var Command = this.Data.split('|')[0];

    var OptionSize = Object.keys(this.Options).length;
    for (var i = 0; i < OptionSize; i++) {
      var key = Object.keys(this.Options)[i];
      var value = this.Options[key];
      if (value === Command) {
        // If the value is a known command, then get the parser up
        //TODO: Intercept ONLY messages
        switch (key) {
          case "CD":
            this.ParseCD();
          break;
          case "Message":
            this.ParseMessage();
          break;
          case "ChatStarted":
            //this.ParseMessage();
          break;
        }
      }
    }
  },

  ParseCD: function() {
    var splitData = this.Data.split('|');
    var TimeRemaining = splitData[1];
    var TotalTime = splitData[2];
    var WorkloadString = splitData[3];

    console.log(WorkloadString);
  },
  ParseMessage: function() {
    var splitData = this.Data.split('|');
    // Not checking for any other pipes because it doesnt show anyways
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
    var regex_Message_Link = /\((.*)\)/i;
    var Message_Link;
    var m;

    var regex_isNotification = /<span style='font-weight: bold; color: #253ECC;(.*)<br \/>/i;
    // Check if it's a notification first
    if (Message) {
      var temp = String(Message).match(regex_isNotification);
      console.log(temp);
    }
    // Check just to make sure the message isn't empty
    if (Message) {
      // Get the title colour
      Message_Text = String(Message).match(regex_Message_Text)[1].substring(3);
      tempNameTitle = String(Message).match(regex_Name_and_Title)[1].split(' ');
      Message_Name = tempNameTitle[1];
      Message_Title = tempNameTitle[0].slice(0,-7);
      Message_Link = "sendRequestContentFill" + String(Message).match(regex_Message_Link)[0] + ";";
      Message_Title_Color = String(Message).match(regex_Title_Color)[2];
      Message_timeStamp = String(Message).match(regex_Time_Stamp)[3];

      //temp = new ServerMessages.Message(Message_Text, Message_Name, {Text: Message_Title, Color: Message_Title_Color}, Message_Link, Message_timeStamp);
      //console.log(temp);

    }

    // End ParseMessage
  }
};

function onmsg(evt) {
ServerReceptionHandler(evt.data);
ServerMessage.getOption(evt.data);
};
// Start watching incoming messages
ws.onmessage=onmsg;
