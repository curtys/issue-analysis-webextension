"use strict";

var subjectPageXML;
var serverUrlPromise;

window.onload = function () {
    serverUrlPromise = browser.storage.sync.get('wsurl');
    var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
    }).then((tab) => {
        browser.tabs.sendMessage(tab[0].id, 'DOMrequest').then(result => {
            subjectPageXML = result;
        }).catch((fail) => console.log('send failure', fail));
    }).catch((error) => console.log('error', error));
}