// ==UserScript==
// @name         Disable Amazon Rufus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modifies the body classes and styles on Amazon pages to disable the "Alexa for shopping" popup
// @author       Gilbert Industries
// @match        https://*.amazon.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply and enforce the changes
    function modifyBody(body) {
        // 1. Modify the classes safely without triggering infinite loops
        if (body.classList.contains('rufus-docked-left')) {
            body.classList.remove('rufus-docked-left');
        }
        if (!body.classList.contains('rufus-docked-closing-transition')) {
            body.classList.add('rufus-docked-closing-transition');
        }

        // 2. Modify the inline style attribute if it's not already set
        const targetStyle = '--rufus-docked-panel-width: 320px;';
        if (body.getAttribute('style') !== targetStyle) {
            body.setAttribute('style', targetStyle);
        }
    }

    // Set up an observer to watch the <body> tag specifically for attribute changes
    function observeBody(body) {
        modifyBody(body); // Run immediately once body is found

        const bodyObserver = new MutationObserver((mutations) => {
            // Temporarily disconnect to avoid an infinite loop when we modify attributes ourselves
            bodyObserver.disconnect();

            modifyBody(body);

            // Reconnect after modifications are done
            bodyObserver.observe(body, { attributes: true, attributeFilter: ['class', 'style'] });
        });

        // Watch for changes to class or style attributes on the body
        bodyObserver.observe(body, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    // Wait for the <body> element to exist initially
    if (document.body) {
        observeBody(document.body);
    } else {
        const docObserver = new MutationObserver((mutations, obs) => {
            if (document.body) {
                observeBody(document.body);
                obs.disconnect(); // Stop watching the document element once body is found
            }
        });
        docObserver.observe(document.documentElement, { childList: true });
    }
})();
