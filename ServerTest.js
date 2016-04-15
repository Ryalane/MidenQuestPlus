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

    // Check just to make sure the message isn't empty
    if (Message) {
      // Get the title colour
      //Message_Title_Color = String(Message).match(regex_Title_Color).join().substring(13);
      Message_Text = String(Message).match(regex_Message_Text)[1].substring(3);
      var tempNameTitle = String(Message).match(regex_Name_and_Title)[1].split(' ');
      Message_Name = tempNameTitle[1];
      Message_Title = tempNameTitle[0].slice(0,-7);
      Message_Link = "sendRequestContentFill" + String(Message).match(regex_Message_Link)[0] + ";";
      Message_Title_Color = String(Message).match(regex_Title_Color)[2];
      Message_timeStamp = String(Message).match(regex_Time_Stamp)[3];

      console.log(Message_Title_Color + " Time: "+ Message_timeStamp + ", Link: " + Message_Link + ", Name: " + Message_Name + ", Title: " + Message_Title + ", Message: " + Message_Text);


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
