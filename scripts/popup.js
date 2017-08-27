"use strict";

var subjectPageXML;
var serverUrlPromise;

window.onload = function() {
  serverUrlPromise = browser.storage.sync.get('wsurl');
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, "DOMrequest").then(response => {
        subjectPageXML = response;
      });
  });
}