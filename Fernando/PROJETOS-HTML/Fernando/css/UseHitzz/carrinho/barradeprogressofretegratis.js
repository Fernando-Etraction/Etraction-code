/* ============================================================
 * Barra de progresso de FRETE GRÁTIS no minicart
 * Meta: R$ 499,90
 * Inserção: depois de .minicart-modal__header
 * Código 100% JS, sem tags script ou style
 * ============================================================ */

(function () {
  "use strict";

  var FREE_SHIPPING_TARGET = 499.90;
  var BAR_ID = "hz-free-shipping-bar";
  var GLOBAL_KEY = "__HZ_FREE_SHIPPING_BAR__";

  var pollTimer = null;
  var classObserver = null;
  var resizeTimer = null;
  var lastSignature = null;

  if (
    window[GLOBAL_KEY] &&
    typeof window[GLOBAL_KEY].destroy === "function"
  ) {
    window[GLOBAL_KEY].destroy();
  }

  /*
   * Remove estilos de versões anteriores.
   */
  var oldStyle = document.getElementById("hz-fsb-style");

  if (oldStyle) {
    oldStyle.remove();
  }

  function applyStyles(element, styles) {
    if (!element) return;

    Object.keys(styles).forEach(function (property) {
      element.style[property] = styles[property];
    });
  }

  function parseBRL(text) {
    if (!text) return 0;

    var clean = String(text)
      .replace(/[^0-9.,]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    var value = parseFloat(clean);

    return isNaN(value) ? 0 : value;
  }

  function formatBRL(value) {
    return (
      "R$ " +
      value
        .toFixed(2)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );
  }

  function getProductsTotal() {
    var element = document.querySelector(
      ".minicart-modal__subtotal .minicart-modal__subtotal-price"
    );

    return element ? parseBRL(element.textContent) : 0;
  }

  function isCartOpen() {
    return (
      document.documentElement.classList.contains(
        "minicart-modal--open"
      ) ||
      (
        document.body &&
        document.body.classList.contains("minicart-modal--open")
      )
    );
  }

  function createSvgElement(name, attributes) {
    var element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    );

    Object.keys(attributes || {}).forEach(function (attribute) {
      element.setAttribute(attribute, attributes[attribute]);
    });

    return element;
  }

  function createTruckIcon() {
    var svg = createSvgElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true"
    });

    svg.appendChild(
      createSvgElement("path", {
        d: "M3 6h11v10H3z"
      })
    );

    svg.appendChild(
      createSvgElement("path", {
        d: "M14 9h3.5l3.5 3.5V16h-2"
      })
    );

    svg.appendChild(
      createSvgElement("path", {
        d: "M14 16H9"
      })
    );

    svg.appendChild(
      createSvgElement("circle", {
        cx: "6.5",
        cy: "17",
        r: "1.8"
      })
    );

    svg.appendChild(
      createSvgElement("circle", {
        cx: "17.5",
        cy: "17",
        r: "1.8"
      })
    );

    return svg;
  }

  function createCheckIcon() {
    var svg = createSvgElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true"
    });

    svg.appendChild(
      createSvgElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      })
    );

    svg.appendChild(
      createSvgElement("path", {
        d: "M8 12l2.6 2.6L16.5 9"
      })
    );

    return svg;
  }

  function setIcon(container, icon) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(icon);
  }

  function setMessage(container, before, strongText, after) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(before));

    var strong = document.createElement("strong");
    strong.textContent = strongText;

    applyStyles(strong, {
      fontWeight: "700",
      color: "#111111"
    });

    container.appendChild(strong);
    container.appendChild(document.createTextNode(after));
  }

  function applyResponsiveStyles(bar) {
    if (!bar) return;

    var mobile = window.innerWidth <= 480;
    var top = bar.querySelector("[data-hz-fsb='top']");
    var icon = bar.querySelector("[data-hz-fsb='icon']");
    var message = bar.querySelector("[data-hz-fsb='message']");
    var track = bar.querySelector("[data-hz-fsb='track']");
    var svg = icon ? icon.querySelector("svg") : null;

    applyStyles(bar, {
      padding: mobile
        ? "11px 16px 12px"
        : "12px 20px 13px"
    });

    applyStyles(top, {
      gap: mobile ? "6px" : "7px",
      marginBottom: mobile ? "7px" : "8px"
    });

    applyStyles(icon, {
      flexBasis: mobile ? "17px" : "18px",
      width: mobile ? "17px" : "18px",
      height: mobile ? "17px" : "18px"
    });

    applyStyles(message, {
      fontSize: mobile ? "12px" : "12.5px"
    });

    applyStyles(track, {
      height: mobile ? "5px" : "6px"
    });

    if (svg) {
      applyStyles(svg, {
        display: "block",
        width: mobile ? "17px" : "18px",
        height: mobile ? "17px" : "18px"
      });
    }
  }

  function createBar() {
    var bar = document.createElement("div");
    var top = document.createElement("div");
    var icon = document.createElement("span");
    var message = document.createElement("span");
    var track = document.createElement("div");
    var fill = document.createElement("div");

    bar.id = BAR_ID;
    bar.setAttribute("role", "status");
    bar.setAttribute("aria-live", "polite");

    top.setAttribute("data-hz-fsb", "top");
    icon.setAttribute("data-hz-fsb", "icon");
    icon.setAttribute("aria-hidden", "true");
    message.setAttribute("data-hz-fsb", "message");
    track.setAttribute("data-hz-fsb", "track");
    track.setAttribute("aria-hidden", "true");
    fill.setAttribute("data-hz-fsb", "fill");

    applyStyles(bar, {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      margin: "0",
      padding: "12px 20px 13px",
      border: "0",
      borderBottom: "1px solid #ededed",
      borderRadius: "0",
      backgroundColor: "#ffffff",
      fontFamily: "inherit"
    });

    applyStyles(top, {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      minWidth: "0",
      margin: "0 0 8px",
      boxSizing: "border-box"
    });

    applyStyles(icon, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 18px",
      width: "18px",
      height: "18px",
      color: "#16a653",
      boxSizing: "border-box"
    });

    applyStyles(message, {
      minWidth: "0",
      fontSize: "12.5px",
      fontWeight: "500",
      lineHeight: "1.35",
      color: "#242424",
      boxSizing: "border-box"
    });

    applyStyles(track, {
      position: "relative",
      display: "block",
      width: "100%",
      height: "6px",
      overflow: "hidden",
      borderRadius: "999px",
      backgroundColor: "#e8ebe9",
      boxSizing: "border-box"
    });

    applyStyles(fill, {
      position: "relative",
      display: "block",
      width: "0%",
      height: "100%",
      borderRadius: "999px",
      backgroundColor: "#19ad58",
      transition: "width 0.45s cubic-bezier(.22,1,.36,1)",
      boxSizing: "border-box"
    });

    top.appendChild(icon);
    top.appendChild(message);
    track.appendChild(fill);
    bar.appendChild(top);
    bar.appendChild(track);

    applyResponsiveStyles(bar);

    return bar;
  }

  function ensureBar() {
    var header = document.querySelector(
      ".minicart-modal__header"
    );

    if (!header) return null;

    var bar = document.getElementById(BAR_ID);

    if (!bar) {
      bar = createBar();
    }

    /*
     * Insere imediatamente depois do cabeçalho.
     */
    if (header.nextElementSibling !== bar) {
      header.insertAdjacentElement("afterend", bar);
    }

    applyResponsiveStyles(bar);

    return bar;
  }

  function checkPrice() {
    var bar = ensureBar();

    if (!bar) return;

    var total = getProductsTotal();
    var free = total >= FREE_SHIPPING_TARGET;
    var signature = String(free) + "|" + total.toFixed(2);

    if (
      signature === lastSignature &&
      bar.getAttribute("data-signature") === signature
    ) {
      return;
    }

    lastSignature = signature;
    bar.setAttribute("data-signature", signature);

    var icon = bar.querySelector("[data-hz-fsb='icon']");
    var message = bar.querySelector(
      "[data-hz-fsb='message']"
    );
    var fill = bar.querySelector("[data-hz-fsb='fill']");

    var percentage = Math.min(
      100,
      Math.max(0, (total / FREE_SHIPPING_TARGET) * 100)
    );

    fill.style.width = percentage + "%";

    if (free) {
      bar.setAttribute("data-free", "true");

      applyStyles(icon, {
        color: "#098b3e"
      });

      applyStyles(fill, {
        backgroundColor: "#0d9745"
      });

      setIcon(icon, createCheckIcon());

      setMessage(
        message,
        "Você ganhou ",
        "FRETE GRÁTIS",
        "!"
      );
    } else {
      var missing = FREE_SHIPPING_TARGET - total;

      bar.setAttribute("data-free", "false");

      applyStyles(icon, {
        color: "#16a653"
      });

      applyStyles(fill, {
        backgroundColor: "#19ad58"
      });

      setIcon(icon, createTruckIcon());

      setMessage(
        message,
        "Faltam ",
        formatBRL(missing),
        " para o FRETE GRÁTIS"
      );
    }

    applyResponsiveStyles(bar);
  }

  function startPolling() {
    if (pollTimer) return;

    lastSignature = null;
    checkPrice();

    pollTimer = window.setInterval(function () {
      if (!isCartOpen()) {
        stopPolling();
        return;
      }

      checkPrice();
    }, 500);
  }

  function stopPolling() {
    if (!pollTimer) return;

    window.clearInterval(pollTimer);
    pollTimer = null;
  }

  function handleResize() {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(function () {
      applyResponsiveStyles(
        document.getElementById(BAR_ID)
      );
    }, 100);
  }

  function destroy() {
    stopPolling();

    if (classObserver) {
      classObserver.disconnect();
      classObserver = null;
    }

    window.removeEventListener("resize", handleResize);
    window.clearTimeout(resizeTimer);
  }

  function init() {
    classObserver = new MutationObserver(function () {
      if (isCartOpen()) {
        startPolling();
      } else {
        stopPolling();
      }
    });

    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (document.body) {
      classObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener("resize", handleResize);

    if (isCartOpen()) {
      startPolling();
    }
  }

  window[GLOBAL_KEY] = {
    destroy: destroy
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();