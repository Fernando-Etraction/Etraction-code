(function () {
  const urlPermitida = "/geleia-real-pura-liofilizada-9-000mg";
  const mainColor = "#F2C85D";
  const darkColor = "#2f240f";

  const kits = {
    1: {
      title: "1 Mês",
      subtitle: "Ideal para começar",
      oldTotal: 271.24,
      totalPrice: 248.88,
      unitPrice: 248.88,
      quantity: "1 unidade",
      capsules: "30 cápsulas",
      badge: "",
      saving: "R$ 22,36"
    },
    2: {
      title: "2 Meses",
      subtitle: "Mais constância no uso",
      oldTotal: 542.48,
      totalPrice: 457.76,
      unitPrice: 228.88,
      quantity: "2 unidades",
      capsules: "60 cápsulas",
      badge: "",
      saving: "R$ 84,72"
    },
    3: {
      title: "3 Meses",
      subtitle: "Tratamento mais completo",
      oldTotal: 813.72,
      totalPrice: 581.64,
      unitPrice: 193.88,
      quantity: "3 unidades",
      capsules: "90 cápsulas",
      badge: "Mais vendido",
      saving: "R$ 232,08"
    }
  };

  let selectedQty = "1";
  let routeTimer = null;
  let repairTimer = null;
  let observerStarted = false;
  let lastUrl = "";

  function isAllowedPage() {
    return window.location.pathname.replace(/\/$/, "") === urlPermitida;
  }

  function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function removeKit() {
    const wrapper = document.querySelector(".etc-kit-wrapper");
    if (wrapper) wrapper.remove();
  }

  function injectStyle() {
    if (document.querySelector("#etc-kit-prices-layout")) return;

    const style = document.createElement("style");
    style.id = "etc-kit-prices-layout";

    style.innerHTML = `
      .etc-kit-wrapper {
        width: 100%;
        margin: 14px 0;
        font-family: Arial, sans-serif;
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
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
        pointer-events: none;
      }

      .etc-kit-header-title {
        font-size: 14px;
        font-weight: 900;
        color: ${darkColor};
        line-height: 1.2;
      }

      .etc-kit-header-pill {
        font-size: 10px;
        font-weight: 900;
        color: ${darkColor};
        background: #fff4cc;
        border: 1px solid #f2df9d;
        border-radius: 999px;
        padding: 6px 9px;
        white-space: nowrap;
      }

      .etc-kit-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;
        pointer-events: auto;
      }

      .etc-kit-card {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 10px;
        border: 1px solid #e8e1cf;
        border-radius: 14px;
        background: #fffdf8;
        padding: 12px;
        cursor: pointer;
        transition: all .2s ease;
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        pointer-events: auto;
        text-align: left;
      }

      .etc-kit-card:hover {
        border-color: ${mainColor};
        background: #fffaf0;
      }

      .etc-kit-card.etc-active {
        border: 2px solid ${mainColor};
        background: #fff8df;
        box-shadow: 0 5px 14px rgba(242, 200, 93, .3);
      }

      .etc-kit-input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        pointer-events: none;
      }

      .etc-kit-radio {
        width: 17px;
        height: 17px;
        border: 2px solid #b8aa8a;
        border-radius: 50%;
        background: #fff;
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
        inset: 4px;
        background: ${darkColor};
        border-radius: 50%;
      }

      .etc-kit-main {
        min-width: 0;
        display: block;
        text-align: left;
        justify-self: start;
        width: 100%;
      }

      .etc-kit-row-top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 7px;
        flex-wrap: wrap;
        margin-bottom: 4px;
        text-align: left;
      }

      .etc-kit-title {
        font-size: 14px;
        color: ${darkColor};
        font-weight: 900;
        line-height: 1.1;
      }

      .etc-kit-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: ${mainColor};
        color: ${darkColor};
        font-size: 8px;
        font-weight: 900;
        padding: 5px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        line-height: 1;
      }

      .etc-kit-badge:empty {
        display: none;
      }

      .etc-kit-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 5px;
        text-align: left;
      }

      .etc-kit-quantity {
        font-size: 10px;
        color: #7c6b48;
        font-weight: 900;
        line-height: 1.1;
      }

      .etc-kit-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #d5c59f;
        flex: 0 0 auto;
      }

      .etc-kit-capsules {
        font-size: 11px;
        color: ${darkColor};
        font-weight: 900;
        line-height: 1.1;
      }

      .etc-kit-subtitle {
        font-size: 11px;
        color: #8a7a5a;
        font-weight: 800;
        line-height: 1.2;
        text-align: left;
        display: block;
        width: 100%;
      }

      .etc-kit-side {
        text-align: right;
        min-width: 138px;
        display: block;
      }

      .etc-kit-old {
        display: block;
        font-size: 10px;
        color: #9d927c;
        text-decoration: line-through;
        margin-bottom: 4px;
        font-weight: 600;
      }

      .etc-kit-pay-label {
        display: block;
        font-size: 10px;
        color: #5f4a13;
        font-weight: 900;
        line-height: 1.15;
        margin-bottom: 2px;
      }

      .etc-kit-price {
        display: block;
        font-size: 18px;
        font-weight: 900;
        color: ${darkColor};
        line-height: 1;
        margin-bottom: 5px;
        white-space: nowrap;
      }

      .etc-kit-price-unit {
        font-size: 10px;
        font-weight: 900;
        color: ${darkColor};
        line-height: 1;
        margin-left: 2px;
      }

      .etc-kit-total {
        display: block;
        font-size: 10px;
        color: #6f613f;
        font-weight: 900;
        line-height: 1.2;
        margin-bottom: 5px;
      }

      .etc-kit-saving {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        color: #5f4a13;
        font-weight: 900;
        line-height: 1.15;
        background: rgba(242, 200, 93, .2);
        border-radius: 999px;
        padding: 5px 8px;
        white-space: nowrap;
      }

      .etc-kit-saving:empty {
        display: none;
      }

      .etc-kit-selected-tag {
        display: none;
        margin-top: 7px;
        font-size: 9px;
        font-weight: 900;
        color: #fff;
        background: ${darkColor};
        border-radius: 999px;
        padding: 5px 8px;
        width: fit-content;
        margin-left: auto;
      }

      .etc-kit-card.etc-active .etc-kit-selected-tag {
        display: inline-flex;
      }

      .etc-kit-feedback {
        margin-top: 9px;
        background: #fffaf0;
        border: 1px solid #eee2c4;
        border-radius: 12px;
        padding: 10px;
        font-size: 11px;
        color: #6f613f;
        font-weight: 800;
        line-height: 1.35;
        text-align: center;
        pointer-events: none;
      }

      .etc-kit-feedback strong {
        color: ${darkColor};
        font-weight: 900;
      }

      @media(max-width: 520px) {
        .etc-kit-header {
          align-items: flex-start;
        }

        .etc-kit-header-title {
          font-size: 13px;
        }

        .etc-kit-header-pill {
          font-size: 9px;
          padding: 5px 7px;
        }

        .etc-kit-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 9px;
          padding: 11px;
          min-height: 92px;
        }

        .etc-kit-main {
          text-align: left;
          justify-self: start;
          width: 100%;
        }

        .etc-kit-row-top,
        .etc-kit-info {
          justify-content: flex-start;
          text-align: left;
        }

        .etc-kit-subtitle {
          text-align: left;
        }

        .etc-kit-radio {
          width: 15px;
          height: 15px;
        }

        .etc-kit-side {
          grid-column: 2 / 3;
          text-align: left;
          min-width: 0;
          width: 100%;
          padding-top: 4px;
        }

        .etc-kit-title {
          font-size: 13px;
        }

        .etc-kit-badge {
          font-size: 7px;
          padding: 5px 7px;
        }

        .etc-kit-quantity {
          font-size: 9px;
        }

        .etc-kit-capsules {
          font-size: 10px;
        }

        .etc-kit-subtitle {
          font-size: 10px;
        }

        .etc-kit-old {
          font-size: 9px;
        }

        .etc-kit-pay-label {
          font-size: 10px;
        }

        .etc-kit-price {
          font-size: 17px;
        }

        .etc-kit-price-unit {
          font-size: 10px;
        }

        .etc-kit-total {
          font-size: 10px;
        }

        .etc-kit-saving {
          font-size: 9px;
          white-space: normal;
        }

        .etc-kit-selected-tag {
          margin-left: 0;
        }

        .etc-kit-feedback {
          font-size: 10px;
          padding: 9px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createCard(qty) {
    const kit = kits[qty];

    return `
      <button type="button" class="etc-kit-card" data-qty="${qty}" aria-label="Selecionar kit de ${kit.title}" aria-pressed="false">
        <input class="etc-kit-input" type="radio" name="etc-kit-option" value="${qty}">

        <span class="etc-kit-radio"></span>

        <span class="etc-kit-main">
          <span class="etc-kit-row-top">
            <span class="etc-kit-title">${kit.title}</span>
            <span class="etc-kit-badge">${kit.badge}</span>
          </span>

          <span class="etc-kit-info">
            <span class="etc-kit-quantity">${kit.quantity}</span>
            <span class="etc-kit-dot"></span>
            <span class="etc-kit-capsules">${kit.capsules}</span>
          </span>

          <span class="etc-kit-subtitle">${kit.subtitle}</span>
        </span>

        <span class="etc-kit-side">
          <span class="etc-kit-old">De ${formatMoney(kit.oldTotal)}</span>
          <span class="etc-kit-pay-label">Por apenas</span>
          <span class="etc-kit-price">
            ${formatMoney(kit.unitPrice)}<span class="etc-kit-price-unit"> por unidade</span>
          </span>
          <span class="etc-kit-total">Total: ${formatMoney(kit.totalPrice)}</span>
          <span class="etc-kit-saving">Economize ${kit.saving}</span>
          <span class="etc-kit-selected-tag">Selecionado</span>
        </span>
      </button>
    `;
  }

  function createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "etc-kit-wrapper";
    wrapper.setAttribute("data-etc-kit", "true");

    wrapper.innerHTML = `
      <div class="etc-kit-header">
        <div class="etc-kit-header-title">Escolha seu kit</div>
        <div class="etc-kit-header-pill">Preço por unidade</div>
      </div>

      <div class="etc-kit-list">
        ${createCard(3)}
        ${createCard(2)}
        ${createCard(1)}
      </div>

      <div class="etc-kit-feedback"></div>
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
    const kit = kits[qty];

    if (!wrapper || !kit) return;

    const feedback = wrapper.querySelector(".etc-kit-feedback");

    wrapper.querySelectorAll(".etc-kit-card").forEach(function (card) {
      const isActive = card.getAttribute("data-qty") === String(qty);
      const input = card.querySelector(".etc-kit-input");

      card.classList.toggle("etc-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (input) {
        input.checked = isActive;
      }
    });

    if (feedback) {
      feedback.innerHTML = `
        Você selecionou <strong>${kit.quantity}</strong> com <strong>${kit.capsules}</strong>.
        Você paga <strong>${formatMoney(kit.unitPrice)}</strong> por unidade e economiza <strong>${kit.saving} no kit</strong>.
      `;
    }
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

      selectKit(card.getAttribute("data-qty"));
    });

    wrapper.addEventListener("pointerup", function (event) {
      const card = event.target.closest(".etc-kit-card");

      if (!card || !wrapper.contains(card)) return;

      event.preventDefault();
      event.stopPropagation();

      selectKit(card.getAttribute("data-qty"));
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