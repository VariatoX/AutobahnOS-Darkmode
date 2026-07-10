// ==UserScript==
// @name         Autobahn OS Darkmode
// @version      1.0
// @description  Make some map tiles and elements on the verkehr.vz-deutschland.de webpage (Autobahn OS) dark.
// @author       Variatox
// @license      MIT
// @match        https://verkehr.vz-deutschland.de/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=verkehr.vz-deutschland.de
// @homepageURL  https://github.com/VariatoX/AutobahnOS-Darkmode
// @downloadURL  https://raw.githubusercontent.com/VariatoX/AutobahnOS-Darkmode/main/verkehr-vz-darkmode.user.js
// @updateURL    https://raw.githubusercontent.com/VariatoX/AutobahnOS-Darkmode/main/verkehr-vz-darkmode.user.js
// ==/UserScript==

(function () {
  "use strict";

  // <i18n>
  const I18N = {
    de: {
      strToggleDarkmode: "Darkmode umschalten",
    },
    en: {
      strToggleDarkmode: "Toggle darkmode",
    },
    fr: {
      strToggleDarkmode: "Basculer le mode sombre",
    },
  };

  const currentLang = navigator.language.split("-")[0] || "en";
  const l = I18N[currentLang] || I18N.en;
  // </i18n>

  const CANVAS_SELECTOR = "canvas.maplibregl-canvas";
  const STYLE_ID = "darkmode-maptiles-style";
  const STORAGE_KEY = "darkmode-enabled";
  const FILTER = "invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9)";

  const OVERLAYS = ".maplibregl-popup-content, #disclaimer-content";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      ${CANVAS_SELECTOR} {
        filter: ${FILTER};
      }

      ${OVERLAYS} {
      background-color: #2b2b2b !important;
        color: #6eaaff !important;
      }

      ${OVERLAYS} a {
        color: #6eaaff !important;
      }
    `;

    document.head.appendChild(style);
  }

  function removeStyle() {
    const style = document.getElementById(STYLE_ID);

    if (style) {
      style.remove();
    }
  }

  function applyState() {
    const enabled = GM_getValue(STORAGE_KEY, true);

    if (enabled) {
      injectStyle();
    } else {
      removeStyle();
    }
  }

  function toggleDarkmode() {
    const enabled = GM_getValue(STORAGE_KEY, true);

    GM_setValue(STORAGE_KEY, !enabled);
    applyState();
  }

  function observe() {
    const observer = new MutationObserver(() => {
      applyState();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  applyState();
  observe();

  if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand(l.strToggleDarkmode, toggleDarkmode);
})();
