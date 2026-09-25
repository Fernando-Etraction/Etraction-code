(function () {
  "use strict";

  var GLOBAL_KEY = "__ETRACTION_AVISO_FORMA__";
  var TARGET_SELECTOR = "#option-selector > div > div > div > div";
  var NOTICE_ID = "etraction-aviso-forma";
  var STYLE_ID = "etraction-aviso-forma-style";
  var timer = null;

  var LEVELS = [
    {
      label: "Forma pequena",
      description: "Recomendamos escolher uma numeração maior."
    },
    {
      label: "Forma padrão",
      description: "Escolha sua numeração habitual."
    },
    {
      label: "Forma grande",
      description: "Recomendamos escolher uma numeração menor."
    }
  ];

  if (
    window[GLOBAL_KEY] &&
    typeof window[GLOBAL_KEY].destroy === "function"
  ) {
    window[GLOBAL_KEY].destroy();
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function comparableText(text) {
    var value = normalizeText(text).toLowerCase();

    if (typeof value.normalize === "function") {
      value = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    return value;
  }

  function findSource() {
    var elements = document.querySelectorAll("#details strong");

    for (var i = 0; i < elements.length; i++) {
      var text = normalizeText(elements[i].textContent);

      if (/atenção\s*:\s*forma\b/i.test(text)) {
        return elements[i];
      }
    }

    return null;
  }

  function getInformation() {
    var source = findSource();

    if (!source) {
      return null;
    }

    var text = normalizeText(source.textContent)
      .replace(/^atenção\s*:\s*/i, "");

    var commaPosition = text.indexOf(",");
    var title;
    var description;

    if (commaPosition !== -1) {
      title = text.substring(0, commaPosition);
      description = text.substring(commaPosition + 1);
    } else {
      title = text;
      description = "";
    }

    return {
      title: normalizeText(title),
      description: normalizeText(description)
    };
  }

  function getActiveLevel(information) {
    var title = comparableText(information.title);
    var description = comparableText(information.description);

    /*
     * Forma pequena:
     * recomenda uma numeração maior.
     */
    if (
      /\b(justa|justo|pequena|pequeno|menor|reduzida|reduzido|apertada|apertado)\b/.test(
        title
      )
    ) {
      return 0;
    }

    /*
     * Forma grande:
     * recomenda uma numeração menor.
     */
    if (
      /\b(grande|maior|ampla|amplo|larga|largo|folgada|folgado)\b/.test(
        title
      )
    ) {
      return 2;
    }

    /*
     * Forma padrão.
     */
    if (
      /\b(fiel|normal|padrao|regular|tradicional)\b/.test(title)
    ) {
      return 1;
    }

    /*
     * Caso o tipo esteja indicado apenas na recomendação.
     */
    if (
      /\b(tamanho|numero|numeracao)\s+maior\b/.test(description)
    ) {
      return 0;
    }

    if (
      /\b(tamanho|numero|numeracao)\s+menor\b/.test(description)
    ) {
      return 2;
    }

    if (
      /numeracao habitual|numero habitual|forma padrao|tamanho habitual/.test(
        description
      )
    ) {
      return 1;
    }

    return 1;
  }

  function injectStyles() {
    var css = [
      "#" + NOTICE_ID + " {",
      "  width: 100% !important;",
      "  margin: 18px 0 0 !important;",
      "  padding: 15px 0 0 !important;",
      "  box-sizing: border-box !important;",
      "  display: block !important;",
      "  background: transparent !important;",
      "  border: 0 !important;",
      "  border-top: 1px solid #e4e4e4 !important;",
      "  color: #1d1d1d !important;",
      "  font-family: inherit !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__title {",
      "  margin: 0 0 15px !important;",
      "  padding: 0 !important;",
      "  color: #1d1d1d !important;",
      "  font-size: 13px !important;",
      "  font-weight: 700 !important;",
      "  line-height: 1.3 !important;",
      "  letter-spacing: 0 !important;",
      "  text-transform: none !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__labels {",
      "  width: 100% !important;",
      "  display: grid !important;",
      "  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;",
      "  align-items: end !important;",
      "  box-sizing: border-box !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__label {",
      "  min-width: 0 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  color: #888888 !important;",
      "  font-size: 11px !important;",
      "  font-weight: 400 !important;",
      "  line-height: 1.3 !important;",
      "  transition: color 0.2s ease !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__label:first-child {",
      "  text-align: left !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__label:nth-child(2) {",
      "  text-align: center !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__label:last-child {",
      "  text-align: right !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__label.is-active {",
      "  color: #1d1d1d !important;",
      "  font-weight: 700 !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__meter {",
      "  position: relative !important;",
      "  width: 100% !important;",
      "  height: 18px !important;",
      "  margin: 6px 0 0 !important;",
      "  box-sizing: border-box !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__track,",
      "#" + NOTICE_ID + " .etraction-aviso-forma__progress {",
      "  position: absolute !important;",
      "  top: 8px !important;",
      "  left: 6px !important;",
      "  height: 2px !important;",
      "  border-radius: 2px !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__track {",
      "  right: 6px !important;",
      "  background: #d7d7d7 !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__progress {",
      "  z-index: 1 !important;",
      "  width: 0;",
      "  background: #222222 !important;",
      "  transition: width 0.25s ease !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__markers {",
      "  position: relative !important;",
      "  z-index: 2 !important;",
      "  width: 100% !important;",
      "  height: 18px !important;",
      "  display: grid !important;",
      "  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;",
      "  align-items: center !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__marker {",
      "  width: 10px !important;",
      "  height: 10px !important;",
      "  box-sizing: border-box !important;",
      "  display: block !important;",
      "  justify-self: center !important;",
      "  background: #ffffff !important;",
      "  border: 2px solid #b8b8b8 !important;",
      "  border-radius: 50% !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__marker:first-child {",
      "  justify-self: start !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__marker:last-child {",
      "  justify-self: end !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__marker.is-active {",
      "  width: 14px !important;",
      "  height: 14px !important;",
      "  background: #222222 !important;",
      "  border-color: #222222 !important;",
      "  box-shadow: 0 0 0 3px #ffffff !important;",
      "}",

      "#" + NOTICE_ID + " .etraction-aviso-forma__message {",
      "  width: 100% !important;",
      "  margin: 11px 0 0 !important;",
      "  padding: 9px 11px !important;",
      "  box-sizing: border-box !important;",
      "  background: #f6f6f6 !important;",
      "  border: 0 !important;",
      "  border-left: 3px solid #222222 !important;",
      "  border-radius: 0 4px 4px 0 !important;",
      "  color: #333333 !important;",
      "  font-size: 11.5px !important;",
      "  font-weight: 400 !important;",
      "  line-height: 1.45 !important;",
      "}",

      "@media (max-width: 480px) {",
      "  #" + NOTICE_ID + " {",
      "    margin-top: 16px !important;",
      "    padding-top: 13px !important;",
      "  }",

      "  #" + NOTICE_ID + " .etraction-aviso-forma__title {",
      "    margin-bottom: 13px !important;",
      "    font-size: 12.5px !important;",
      "  }",

      "  #" + NOTICE_ID + " .etraction-aviso-forma__label {",
      "    font-size: 10px !important;",
      "  }",

      "  #" + NOTICE_ID + " .etraction-aviso-forma__message {",
      "    padding: 8px 10px !important;",
      "    font-size: 10.5px !important;",
      "  }",
      "}"
    ].join("\n");

    var style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;

      (document.head || document.documentElement).appendChild(style);
    }

    if (style.textContent !== css) {
      style.textContent = css;
    }
  }

  function createNotice() {
    var notice = document.createElement("section");

    notice.id = NOTICE_ID;
    notice.setAttribute("role", "group");

    notice.innerHTML =
      '<h3 class="etraction-aviso-forma__title">' +
      "Como este modelo calça" +
      "</h3>" +

      '<div class="etraction-aviso-forma__labels">' +
      '<span class="etraction-aviso-forma__label">' +
      LEVELS[0].label +
      "</span>" +

      '<span class="etraction-aviso-forma__label">' +
      LEVELS[1].label +
      "</span>" +

      '<span class="etraction-aviso-forma__label">' +
      LEVELS[2].label +
      "</span>" +
      "</div>" +

      '<div class="etraction-aviso-forma__meter" aria-hidden="true">' +
      '<span class="etraction-aviso-forma__track"></span>' +
      '<span class="etraction-aviso-forma__progress"></span>' +

      '<div class="etraction-aviso-forma__markers">' +
      '<span class="etraction-aviso-forma__marker"></span>' +
      '<span class="etraction-aviso-forma__marker"></span>' +
      '<span class="etraction-aviso-forma__marker"></span>' +
      "</div>" +
      "</div>" +

      '<p class="etraction-aviso-forma__message" aria-live="polite"></p>';

    return notice;
  }

  function getOrCreateNotice() {
    var notice = document.getElementById(NOTICE_ID);

    if (
      notice &&
      !notice.querySelector(".etraction-aviso-forma__meter")
    ) {
      var newNotice = createNotice();

      if (notice.parentNode) {
        notice.parentNode.replaceChild(newNotice, notice);
      }

      notice = newNotice;
    }

    return notice || createNotice();
  }

  function updateNotice(notice, activeLevel) {
    var labels = notice.querySelectorAll(
      ".etraction-aviso-forma__label"
    );

    var markers = notice.querySelectorAll(
      ".etraction-aviso-forma__marker"
    );

    for (var i = 0; i < LEVELS.length; i++) {
      var isActive = i === activeLevel;

      labels[i].classList.toggle("is-active", isActive);
      markers[i].classList.toggle("is-active", isActive);
    }

    var progress = notice.querySelector(
      ".etraction-aviso-forma__progress"
    );

    var progressWidths = [
      "0px",
      "calc((100% - 12px) / 2)",
      "calc(100% - 12px)"
    ];

    progress.style.width = progressWidths[activeLevel];

    var message = notice.querySelector(
      ".etraction-aviso-forma__message"
    );

    var messageText = LEVELS[activeLevel].description;

    if (message.textContent !== messageText) {
      message.textContent = messageText;
    }

    notice.setAttribute(
      "aria-label",
      "Forma do calçado: " + LEVELS[activeLevel].label
    );
  }

  function removeNotice() {
    var notice = document.getElementById(NOTICE_ID);

    if (notice && notice.parentNode) {
      notice.parentNode.removeChild(notice);
    }
  }

  function renderNotice() {
    var target = document.querySelector(TARGET_SELECTOR);
    var information = getInformation();

    if (!target || !information) {
      removeNotice();
      return;
    }

    injectStyles();

    var notice = getOrCreateNotice();
    var activeLevel = getActiveLevel(information);

    updateNotice(notice, activeLevel);

    if (target.nextElementSibling !== notice) {
      target.insertAdjacentElement("afterend", notice);
    }
  }

  function scheduleRender() {
    clearTimeout(timer);
    timer = setTimeout(renderNotice, 80);
  }

  var observer = new MutationObserver(scheduleRender);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  renderNotice();

  window[GLOBAL_KEY] = {
    destroy: function () {
      clearTimeout(timer);
      observer.disconnect();
      removeNotice();

      var style = document.getElementById(STYLE_ID);

      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  };
})();