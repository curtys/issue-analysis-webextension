"use strict";

browser.runtime.onMessage.addListener(request => {
  console.log('dom request');
  if (request === 'DOMrequest') {
    var subject_dom = document.all[0].outerHTML;
    return Promise.resolve(subject_dom);
  }
  return Promise.reject('Does not understand');
  
});