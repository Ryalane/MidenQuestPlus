// ==UserScript==
// @name         MidenQuestPlus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provides the user with some enhancements to MidenQuest
// @author       Ryalane
// @updateURL    https://github.com/Ryalane/MidenQuestPlus/raw/master/MQP.user.js
// @match        http://www.midenquest.com/Game.aspx
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    /*jshint multistr: true */
    // Make the Top navbar

    GM_addStyle("#Custom_MainBar { width: 1000px; \
                              height: 100px; \
                              display: block; \
                              position: relative;\
                              margin: auto; \
                              color: #ccc; \
                              background-color: #1A3753 \
                              border-radius: 5px; }");

    var MainBar = $("<div>", {id: "Custom_MainBar", class: ""});

    $('#MainPanel').css('width', '1002px');

    $("body").prepend(MainBar);

    // Setup the Title bar
var titlething = setInterval(function () {
var Selling = $('.prgActionOverlay').text();

if (Selling[0] === 'S') {
document.title = Selling;
} else {
document.title = 'Stopped Production';
}
}, 1000);

    // Setup tab for the chat
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
    console.log("E: " + e);
    var keycode = (e.which) ? e.which : e.keyCode;
    console.log(keycode);
    if (keycode == 9)
    {
        console.log("9");
        NextTab();
        e.preventDefault();
    }
});
})();
