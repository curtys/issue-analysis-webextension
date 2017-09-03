"use strict";

function saveOptions(e) {
    browser.storage.sync.set({
        wsurl: document.querySelector("#url").value
    });
    e.preventDefault();
}

function restoreOptions() {
    browser.storage.sync.get('wsurl').then((res) => {
        document.querySelector("#url").value = res.wsurl || 'ws://issueanalysis.azurewebsites.net/service';
    });
}

function setToDefault() {
    document.querySelector("#url").value = 'ws://issueanalysis.azurewebsites.net/service';
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#reset').addEventListener('click', setToDefault);
