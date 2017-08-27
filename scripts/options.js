"use strict";

function saveOptions(e) {
    browser.storage.sync.set({
        wsurl: document.querySelector("#url").value
    });
    e.preventDefault();
}

function restoreOptions() {
    var gettingItem = browser.storage.sync.get('wsurl');
    gettingItem.then((res) => {
        document.querySelector("#url").value = res.wsurl || 'ws://0.0.0.0:4567/service';
    });
}

function setToDefault() {
    document.querySelector("#url").value = 'ws://0.0.0.0:4567/service';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#reset').addEventListener('click', setToDefault);
