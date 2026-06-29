(function () {
  const urlPermitida = "/geleia-real-pura-liofilizada-9-000mg";
  const mainColor = "#F2C85D";
  const darkColor = "#2f240f";
  const version = "etc-kit-price-drop-all-once-v1";

  const kits = {
    1: {
      title: "1 Mês",
      oldTotal: 271.24,
      totalPrice: 248.88,
      quantity: "1 unidade",
      capsules: "30 cápsulas",
      saving: "R$ 22,36"
    },
    2: {
      title: "2 Meses",
      oldTotal: 542.48,
      totalPrice: 457.76,
      quantity: "2 unidades",
      capsules: "60 cápsulas",
      saving: "R$ 84,72"
    },
    3: {
      title: "3 Meses",
      oldTotal: 813.72,
      totalPrice: 581.64,
      quantity: "3 unidades",
      capsules: "90 cápsulas",
      saving: "R$ 232,08"
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
    const currentStyle = document.querySelector("#etc-kit-prices-layout");

    if (currentStyle && currentStyle.getAttribute("data-version") === version) {
      return;
    }

    if (currentStyle) {
      currentStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "etc-kit-prices-layout";
    style.setAttribute("data-version", version);

    style.innerHTML = `
      .etc-kit-wrapper {
        width: 100%;
        margin: 12px 0;
        font-family: inherit;
        position: relative;
        pointer-events: auto;
      }

      .etc-kit-wrapper,
      .etc-kit-wrapper * {
        box-sizing: border-box;
      }

      .etc-kit-header {
        margin-bottom: 8px;
      }

      .etc-kit-header-title {
        font-size: 15px;
        font-weight: 800;
        color: ${darkColor};
        line-height: 1.2;
      }

      .etc-kit-list {
        display: flex;
        flex-direction: column;
        gap: 7px;
        position: relative;
        pointer-events: auto;
      }

      .etc-kit-card {
        position: relative;
        width: 100%;
        min-height: 68px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 10px;
        border: 1px solid #e7deca;
        border-radius: 12px;
        background: #fffdf8;
        padding: 11px 12px;
        cursor: pointer;
        transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
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
        border-color: ${mainColor};
        background: #fff8df;
        box-shadow: 0 4px 12px rgba(242, 200, 93, .22);
      }

      .etc-kit-input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
        pointer-events: none;
      }

      .etc-kit-radio {
        width: 16px;
        height: 16px;
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
      }

      .etc-kit-title {
        display: block;
        font-size: 14px;
        color: ${darkColor};
        font-weight: 800;
        line-height: 1.15;
        margin-bottom: 4px;
      }

      .etc-kit-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        flex-wrap: wrap;
        color: #7c6b48;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.15;
      }

      .etc-kit-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #cbb98d;
        flex: 0 0 auto;
      }

      .etc-kit-side {
        text-align: right;
        min-width: 124px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      .etc-kit-old {
        display: block;
        font-size: 10px;
        color: #9d927c;
        font-weight: 700;
        line-height: 1.1;
        text-decoration: line-through;
        white-space: nowrap;
      }

      .etc-kit-price {
        display: inline-flex;
        align-items: baseline;
        justify-content: flex-end;
        gap: 3px;
        font-size: 18px;
        font-weight: 900;
        color: ${darkColor};
        line-height: 1.05;
        white-space: nowrap;
        transform-origin: right center;
      }

      .etc-kit-price.etc-dropping {
        animation: etcPriceDrop .72s cubic-bezier(.18,.9,.25,1);
      }

      .etc-kit-por {
        font-size: 10px;
        font-weight: 800;
        color: #7c6b48;
      }

      .etc-kit-price-value {
        display: inline-block;
        min-width: 78px;
        text-align: right;
      }

      .etc-kit-saving {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        padding: 5px 8px;
        border-radius: 999px;
        background: rgba(242, 200, 93, .28);
        color: #5f4a13;
        font-size: 9px;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
      }

      .etc-kit-card.etc-active .etc-kit-saving {
        background: ${mainColor};
        color: ${darkColor};
      }

      .etc-kit-saving.etc-saving-pulse {
        animation: etcSavingPulse .72s ease;
      }

      @keyframes etcPriceDrop {
        0% {
          transform: translateY(-10px) scale(1.06);
          opacity: .35;
        }

        45% {
          transform: translateY(2px) scale(1.02);
          opacity: 1;
        }

        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes etcSavingPulse {
        0% {
          transform: scale(.96);
        }

        50% {
          transform: scale(1.06);
        }

        100% {
          transform: scale(1);
        }
      }

      @media(max-width: 520px) {
        .etc-kit-wrapper {
          margin: 10px 0;
        }

        .etc-kit-header-title {
          font-size: 14px;
        }

        .etc-kit-list {
          gap: 6px;
        }

        .etc-kit-card {
          min-height: 62px;
          grid-template-columns: auto 1fr auto;
          gap: 8px;
          padding: 10px;
          border-radius: 11px;
        }

        .etc-kit-radio {
          width: 15px;
          height: 15px;
        }

        .etc-kit-title {
          font-size: 13px;
          margin-bottom: 3px;
        }

        .etc-kit-info {
          font-size: 10px;
          gap: 5px;
        }

        .etc-kit-side {
          min-width: 108px;
          gap: 3px;
        }

        .etc-kit-old {
          font-size: 9px;
        }

        .etc-kit-price {
          font-size: 15px;
        }

        .etc-kit-por {
          font-size: 9px;
        }

        .etc-kit-price-value {
          min-width: 66px;
        }

        .etc-kit-saving {
          font-size: 8px;
          padding: 5px 7px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .etc-kit-price.etc-dropping,
        .etc-kit-saving.etc-saving-pulse {
          animation: none !important;
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
          <span class="etc-kit-title">${kit.title}</span>

          <span class="etc-kit-info">
            <span>${kit.quantity}</span>
            <span class="etc-kit-dot"></span>
            <span>${kit.capsules}</span>
          </span>
        </span>

        <span class="etc-kit-side">
          <span class="etc-kit-old">De: ${formatMoney(kit.oldTotal)}</span>

          <span class="etc-kit-price">
            <span class="etc-kit-por">Por:</span>
            <span class="etc-kit-price-value">${formatMoney(kit.totalPrice)}</span>
          </span>

          <span class="etc-kit-saving">Economize ${kit.saving}</span>
        </span>
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
        <div class="etc-kit-header-title">Escolha seu kit</div>
      </div>

      <div class="etc-kit-list">
        ${createCard(3)}
        ${createCard(2)}
        ${createCard(1)}
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

  function animateSinglePrice(card, oldValue, finalValue, index, onComplete) {
    if (!card) return;

    const priceBox = card.querySelector(".etc-kit-price");
    const priceValue = card.querySelector(".etc-kit-price-value");
    const savingTag = card.querySelector(".etc-kit-saving");

    if (!priceBox || !priceValue) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      priceValue.textContent = formatMoney(finalValue);

      if (typeof onComplete === "function") onComplete();
      return;
    }

    const duration = 900;
    const delay = index * 110;
    const from = Number(oldValue);
    const to = Number(finalValue);
    const diff = from - to;

    priceValue.textContent = formatMoney(from);

    setTimeout(function () {
      const start = performance.now();

      priceBox.classList.remove("etc-dropping");
      void priceBox.offsetWidth;
      priceBox.classList.add("etc-dropping");

      if (savingTag) {
        savingTag.classList.remove("etc-saving-pulse");
        void savingTag.offsetWidth;
        savingTag.classList.add("etc-saving-pulse");
      }

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutCubic(progress);
        const current = from - diff * eased;

        priceValue.textContent = formatMoney(current);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          priceValue.textContent = formatMoney(to);

          setTimeout(function () {
            priceBox.classList.remove("etc-dropping");

            if (savingTag) {
              savingTag.classList.remove("etc-saving-pulse");
            }

            if (typeof onComplete === "function") onComplete();
          }, 120);
        }
      }

      requestAnimationFrame(frame);
    }, delay);
  }

  function animateAllPrices(wrapper, onComplete) {
    if (!wrapper) return;

    const cards = Array.from(wrapper.querySelectorAll(".etc-kit-card"));

    if (!cards.length) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    wrapper.dataset.priceDropRunning = "true";

    let finished = 0;

    cards.forEach(function (card, index) {
      const qty = card.getAttribute("data-qty");
      const kit = kits[qty];

      if (!kit) {
        finished++;
        return;
      }

      animateSinglePrice(card, kit.oldTotal, kit.totalPrice, index, function () {
        finished++;

        if (finished >= cards.length) {
          wrapper.dataset.priceDropRunning = "false";
          window.__etcKitPriceDropPlayed = true;

          if (typeof onComplete === "function") onComplete();
        }
      });
    });
  }

  function setActiveCard(qty) {
    const wrapper = document.querySelector(".etc-kit-wrapper");

    if (!wrapper || !kits[qty]) return;

    wrapper.querySelectorAll(".etc-kit-card").forEach(function (card) {
      const isActive = card.getAttribute("data-qty") === String(qty);
      const input = card.querySelector(".etc-kit-input");

      card.classList.toggle("etc-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (input) {
        input.checked = isActive;
      }
    });
  }

  function resetAllPrices(wrapper) {
    if (!wrapper) return;

    wrapper.querySelectorAll(".etc-kit-card").forEach(function (card) {
      const qty = card.getAttribute("data-qty");
      const kit = kits[qty];
      const priceValue = card.querySelector(".etc-kit-price-value");

      if (kit && priceValue) {
        priceValue.textContent = formatMoney(kit.totalPrice);
      }
    });
  }

  function startInitialPriceDrop(wrapper) {
    if (!wrapper) return;

    setActiveCard(selectedQty);

    if (window.__etcKitPriceDropPlayed === true) {
      resetAllPrices(wrapper);
      wrapper.dataset.initialDrop = "done";
      return;
    }

    if (wrapper.dataset.initialDrop === "done" || wrapper.dataset.initialDrop === "running") {
      return;
    }

    wrapper.dataset.initialDrop = "running";

    setTimeout(function () {
      animateAllPrices(wrapper, function () {
        wrapper.dataset.initialDrop = "done";
      });
    }, 180);
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
    let createdNow = false;

    if (wrapper && wrapper.getAttribute("data-version") !== version) {
      wrapper.remove();
      wrapper = null;
    }

    if (!wrapper) {
      wrapper = createWrapper();
      target.parentNode.insertBefore(wrapper, target);
      createdNow = true;
    }

    bindEvents(wrapper);

    if (createdNow) {
      startInitialPriceDrop(wrapper);
    } else if (wrapper.dataset.priceDropRunning !== "true") {
      setActiveCard(selectedQty);
      resetAllPrices(wrapper);
    }

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

      const wrapper = document.querySelector(".etc-kit-wrapper");

      if (wrapper && wrapper.dataset.priceDropRunning === "true") {
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