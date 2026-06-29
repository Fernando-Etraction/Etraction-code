(function () {
  const urlPermitida = "/geleia-real-pura-liofilizada-9-000mg";
  const mainColor = "#F2C85D";
  const darkColor = "#2f240f";
  const softYellow = "#fff8df";
  const lightBg = "#fffdf8";
  const borderColor = "#eadfbf";
  const version = "etc-kit-yellow-layout-v1";

  const kits = {
    1: {
      title: "1 Mês",
      shortTitle: "1 UNIDADE",
      oldTotal: 271.24,
      totalPrice: 248.88,
      unitPrice: 248.88,
      quantity: "1 unidade",
      capsules: "30 cápsulas",
      saving: "R$ 22,36",
      inlineTag: "",
      ribbon: ""
    },
    2: {
      title: "2 Meses",
      shortTitle: "LEVE 2",
      oldTotal: 542.48,
      totalPrice: 457.76,
      unitPrice: 228.88,
      quantity: "2 unidades",
      capsules: "60 cápsulas",
      saving: "R$ 84,72",
      inlineTag: "Mais economia",
      ribbon: ""
    },
    3: {
      title: "3 Meses",
      shortTitle: "LEVE 3",
      oldTotal: 813.72,
      totalPrice: 581.64,
      unitPrice: 193.88,
      quantity: "3 unidades",
      capsules: "90 cápsulas",
      saving: "R$ 232,08",
      inlineTag: "Frete Grátis",
      ribbon: "Escolha Popular"
    }
  };

  let selectedQty = "3";
  let routeTimer = null;
  let repairTimer = null;
  let observerStarted = false;
  let lastUrl = "";
  let lastClickTime = 0;
  let lastClickQty = "";

  function isAllowedPage() {
    return window.location.pathname.replace(/\/$/, "") === urlPermitida;
  }

  function formatMoney(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function removeKit() {
    const wrapper = document.querySelector(".etc-kit-wrapper");
    if (wrapper) wrapper.remove();
  }

  function injectStyle() {
    const currentStyle = document.querySelector("#etc-kit-prices-layout");

    if (currentStyle && currentStyle.getAttribute("data-version") === version) {
      return;
    }

    if (currentStyle) currentStyle.remove();

    const style = document.createElement("style");
    style.id = "etc-kit-prices-layout";
    style.setAttribute("data-version", version);

    style.innerHTML = `
      .etc-kit-wrapper {
        width: 100%;
        margin: 16px 0;
        font-family: inherit;
        position: relative;
        pointer-events: auto;
      }

      .etc-kit-wrapper,
      .etc-kit-wrapper * {
        box-sizing: border-box;
      }

      .etc-kit-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 0 0 14px;
      }

      .etc-kit-header-line {
        flex: 1 1 auto;
        height: 2px;
        background: ${mainColor};
      }

      .etc-kit-header-title {
        flex: 0 0 auto;
        color: ${darkColor};
        font-size: 14px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: .04em;
        white-space: nowrap;
      }

      .etc-kit-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .etc-kit-card {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 22px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 16px 14px;
        border: 2px solid ${borderColor};
        border-radius: 14px;
        background: ${lightBg};
        cursor: pointer;
        text-align: left;
        transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        overflow: visible;
      }

      .etc-kit-card:hover {
        border-color: ${mainColor};
        background: #fffaf0;
      }

      .etc-kit-card.etc-active {
        border-color: ${mainColor};
        background: ${softYellow};
        box-shadow: 0 4px 14px rgba(242, 200, 93, .24);
      }

      .etc-kit-input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        pointer-events: none;
      }

      .etc-kit-radio {
        width: 18px;
        height: 18px;
        border: 2px solid #c9bb91;
        border-radius: 50%;
        background: #fffdf7;
        position: relative;
        flex: 0 0 auto;
      }

      .etc-kit-card.etc-active .etc-kit-radio {
        border-color: ${darkColor};
        background: ${mainColor};
      }

      .etc-kit-card.etc-active .etc-kit-radio::after {
        content: "";
        position: absolute;
        inset: 3px;
        border-radius: 50%;
        background: ${darkColor};
      }

      .etc-kit-main {
        min-width: 0;
      }

      .etc-kit-top-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 3px;
      }

      .etc-kit-title {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        font-weight: 900;
        color: ${darkColor};
        text-transform: uppercase;
        letter-spacing: .03em;
      }

      .etc-kit-subinfo {
        display: block;
        font-size: 11px;
        line-height: 1.3;
        color: #7c6b48;
        font-weight: 700;
      }

      .etc-kit-inline-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        padding: 3px 10px;
        border-radius: 999px;
        border: 1px solid ${mainColor};
        color: ${darkColor};
        background: rgba(242, 200, 93, .24);
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
        white-space: nowrap;
      }

      .etc-kit-card.etc-active .etc-kit-inline-tag {
        background: ${mainColor};
      }

      .etc-kit-inline-tag:empty {
        display: none;
      }

      .etc-kit-side {
        min-width: 112px;
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 4px;
      }

      .etc-kit-price {
        font-size: 18px;
        line-height: 1;
        font-weight: 900;
        color: ${darkColor};
        white-space: nowrap;
      }

      .etc-kit-old {
        font-size: 11px;
        line-height: 1;
        color: #9d927c;
        text-decoration: line-through;
        white-space: nowrap;
        font-weight: 700;
      }

      .etc-kit-ribbon {
        position: absolute;
        right: 12px;
        top: -11px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 26px;
        padding: 5px 11px;
        border-radius: 5px;
        background: ${mainColor};
        color: ${darkColor};
        border: 1px solid rgba(47, 36, 15, .16);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .04em;
        box-shadow: 0 2px 6px rgba(0,0,0,.08);
        transform: rotate(2deg);
        white-space: nowrap;
      }

      .etc-kit-ribbon:empty {
        display: none;
      }

      .etc-kit-bottom-note {
        margin-top: 4px;
        display: inline-flex;
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(242, 200, 93, .22);
        color: #5f4a13;
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
      }

      .etc-kit-card.etc-active .etc-kit-bottom-note {
        background: ${mainColor};
        color: ${darkColor};
      }

      @media(max-width: 520px) {
        .etc-kit-wrapper {
          margin: 14px 0;
        }

        .etc-kit-header {
          gap: 8px;
          margin-bottom: 12px;
        }

        .etc-kit-header-title {
          font-size: 12px;
          text-align: center;
          white-space: normal;
        }

        .etc-kit-card {
          grid-template-columns: 20px minmax(0, 1fr) auto;
          gap: 10px;
          padding: 14px 11px;
          border-radius: 12px;
        }

        .etc-kit-radio {
          width: 16px;
          height: 16px;
        }

        .etc-kit-card.etc-active .etc-kit-radio::after {
          inset: 3px;
        }

        .etc-kit-title {
          font-size: 13px;
        }

        .etc-kit-subinfo {
          font-size: 10px;
        }

        .etc-kit-inline-tag {
          min-height: 22px;
          padding: 3px 8px;
          font-size: 9px;
        }

        .etc-kit-side {
          min-width: 92px;
          gap: 3px;
        }

        .etc-kit-price {
          font-size: 15px;
        }

        .etc-kit-old {
          font-size: 10px;
        }

        .etc-kit-ribbon {
          top: -10px;
          right: 8px;
          min-height: 24px;
          padding: 5px 9px;
          font-size: 9px;
        }

        .etc-kit-bottom-note {
          font-size: 9px;
          padding: 4px 7px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createCard(qty) {
    const kit = kits[qty];

    return `
      <button type="button" class="etc-kit-card" data-qty="${qty}" aria-label="Selecionar kit ${kit.title}" aria-pressed="false">
        <input class="etc-kit-input" type="radio" name="etc-kit-option" value="${qty}" />

        <span class="etc-kit-radio"></span>

        <span class="etc-kit-main">
          <span class="etc-kit-top-row">
            <span class="etc-kit-title">${kit.shortTitle}</span>
            <span class="etc-kit-inline-tag">${kit.inlineTag || ""}</span>
          </span>

          <span class="etc-kit-subinfo">${kit.quantity} · ${kit.capsules} (${formatMoney(kit.unitPrice).replace("R$", "").trim()}/un)</span>
          <span class="etc-kit-bottom-note">Economize ${kit.saving}</span>
        </span>

        <span class="etc-kit-side">
          <span class="etc-kit-price">${formatMoney(kit.totalPrice)}</span>
          <span class="etc-kit-old">${formatMoney(kit.oldTotal)}</span>
        </span>

        <span class="etc-kit-ribbon">${kit.ribbon || ""}</span>
      </button>
    `;
  }

  function createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "etc-kit-wrapper";
    wrapper.setAttribute("data-etc-kit", "true");
    wrapper.setAttribute("data-version", version);

    wrapper.innerHTML = `
      <div class="etc-kit-header">
        <span class="etc-kit-header-line"></span>
        <span class="etc-kit-header-title">Escolha seu Kit e Economize</span>
        <span class="etc-kit-header-line"></span>
      </div>

      <div class="etc-kit-list">
        ${createCard(1)}
        ${createCard(2)}
        ${createCard(3)}
      </div>
    `;

    return wrapper;
  }

  function getQuantityInput() {
    return document.querySelector("#sylius_cart_item_quantity");
  }

  function updateQuantity(qty) {
    const input = getQuantityInput();
    if (!input) return;

    input.value = qty;
    input.setAttribute("value", qty);

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
  }

  function setActiveCard(qty) {
    const wrapper = document.querySelector(".etc-kit-wrapper");
    if (!wrapper || !kits[qty]) return;

    wrapper.querySelectorAll(".etc-kit-card").forEach(function (card) {
      const isActive = card.getAttribute("data-qty") === String(qty);
      const input = card.querySelector(".etc-kit-input");

      card.classList.toggle("etc-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (input) input.checked = isActive;
    });
  }

  function selectKit(qty) {
    if (!qty || !kits[qty]) return;

    selectedQty = String(qty);
    setActiveCard(selectedQty);
    updateQuantity(selectedQty);
  }

  function bindEvents(wrapper) {
    if (!wrapper || wrapper.dataset.bound === "true") return;

    wrapper.dataset.bound = "true";

    wrapper.addEventListener("click", function (event) {
      const card = event.target.closest(".etc-kit-card");
      if (!card || !wrapper.contains(card)) return;

      event.preventDefault();
      event.stopPropagation();

      const qty = card.getAttribute("data-qty");
      const now = Date.now();

      if (qty === lastClickQty && now - lastClickTime < 280) return;

      lastClickQty = qty;
      lastClickTime = now;

      selectKit(qty);
    });
  }

  function insertKit() {
    if (!isAllowedPage()) {
      removeKit();
      return;
    }

    injectStyle();

    const target = document.querySelector(".cart-actions-container");
    const quantityInput = getQuantityInput();

    if (!target || !quantityInput) return;

    let wrapper = document.querySelector(".etc-kit-wrapper");

    if (wrapper && wrapper.getAttribute("data-version") !== version) {
      wrapper.remove();
      wrapper = null;
    }

    if (!wrapper) {
      wrapper = createWrapper();
      target.parentNode.insertBefore(wrapper, target);
    }

    bindEvents(wrapper);
    setActiveCard(selectedQty);
    updateQuantity(selectedQty);
  }

  function scheduleInsert() {
    clearTimeout(repairTimer);
    repairTimer = setTimeout(function () {
      insertKit();
    }, 500);
  }

  function checkRouteChange() {
    const currentUrl = window.location.href;

    if (currentUrl === lastUrl) {
      scheduleInsert();
      return;
    }

    lastUrl = currentUrl;

    clearTimeout(routeTimer);

    routeTimer = setTimeout(function () {
      if (!isAllowedPage()) {
        removeKit();
        return;
      }

      insertKit();
      setTimeout(insertKit, 600);
      setTimeout(insertKit, 1200);
      setTimeout(insertKit, 2200);
    }, 500);
  }

  function patchHistoryMethods() {
    if (window.__etcKitHistoryPatched) return;

    window.__etcKitHistoryPatched = true;

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(history, arguments);
      checkRouteChange();
    };

    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      checkRouteChange();
    };

    window.addEventListener("popstate", checkRouteChange);
  }

  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;

    const observer = new MutationObserver(function () {
      if (!isAllowedPage()) {
        removeKit();
        return;
      }

      scheduleInsert();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function boot() {
    patchHistoryMethods();
    checkRouteChange();
    startObserver();

    setTimeout(checkRouteChange, 500);
    setTimeout(checkRouteChange, 1200);
    setTimeout(checkRouteChange, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();