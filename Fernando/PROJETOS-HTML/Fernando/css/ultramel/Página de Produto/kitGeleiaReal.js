(function () {
  const urlPermitida = "/geleia-real-pura-liofilizada-9-000mg";

  const mainColor = "#F3C64E";
  const mainSoft = "#FFF9E9";
  const greenColor = "#47765E";
  const textColor = "#262626";
  const mutedColor = "#77736B";
  const borderColor = "#E5E1D8";
  const lightBg = "#FFFFFF";

  const version = "etc-kit-reference-layout-v5";

  const imageBase =
    "https://cdn-secure.uoou.com.br/static/images/loja_virtual/ultra-mel/descricao-geleia-real/";

  const kits = {
    1: {
      title: "1 MÊS",
      summaryTitle: "Kit de 1 mês",
      description: "Para experimentar",
      totalPrice: 248.88,
      unitPrice: 248.88,
      quantity: "1 pote",
      capsules: "30 cápsulas",
      saving: "R$ 22,36",
      image: imageBase + "image-1.png",
      tag: ""
    },

    3: {
      title: "3 MESES",
      summaryTitle: "Kit de 3 meses",
      description: "",
      totalPrice: 656.64,
      unitPrice: 218.88,
      quantity: "3 potes",
      capsules: "90 cápsulas",
      saving: "R$ 232,08",
      image: imageBase + "image-2.png",
      tag: ""
    },

    6: {
      title: "6 MESES",
      summaryTitle: "Kit de 6 meses",
      description: "Maior economia",
      totalPrice: 1133.28,
      unitPrice: 188.88,
      quantity: "6 potes",
      capsules: "180 cápsulas",
      saving: "R$ 360,00",
      image: imageBase + "image-3.png",
      tag: "Mais escolhido"
    }
  };

  /* =========================================================
     PADRÃO SELECIONADO
  ========================================================= */

  let selectedQty = "3";

  let routeTimer = null;
  let repairTimer = null;
  let observerStarted = false;
  let lastUrl = "";

  /* =========================================================
     VERIFICAÇÃO DA PÁGINA
  ========================================================= */

  function isAllowedPage() {
    return (
      window.location.pathname.replace(/\/$/, "") === urlPermitida
    );
  }

  /* =========================================================
     FORMATAR PREÇO
  ========================================================= */

  function formatMoney(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  /* =========================================================
     REMOVER KIT
  ========================================================= */

  function removeKit() {
    const wrapper = document.querySelector(".etc-kit-wrapper");

    if (wrapper) {
      wrapper.remove();
    }
  }

  /* =========================================================
     CSS
  ========================================================= */

  function injectStyle() {
    const currentStyle = document.querySelector(
      "#etc-kit-prices-layout"
    );

    if (
      currentStyle &&
      currentStyle.getAttribute("data-version") === version
    ) {
      return;
    }

    if (currentStyle) {
      currentStyle.remove();
    }

    const style = document.createElement("style");

    style.id = "etc-kit-prices-layout";
    style.setAttribute("data-version", version);

    style.innerHTML = `

      .etc-kit-wrapper,
      .etc-kit-wrapper * {
        box-sizing: border-box;
      }

      .etc-kit-wrapper {
        width: 100%;
        margin: 18px 0;
        font-family: inherit;
        color: ${textColor};
      }

      /* =====================================================
         INFO SUPERIOR
      ===================================================== */

      .etc-kit-daily-info {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
      }

      .etc-kit-daily-info span {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-height: 27px;

        padding: 6px 13px;

        background: #F8F7F3;

        border-radius: 20px;

        color: #6D6A64;

        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;
      }

      .etc-kit-daily-info strong {
        color: #34322E;
        font-weight: 700;
      }

      /* =====================================================
         LISTA
      ===================================================== */

      .etc-kit-list {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      /* =====================================================
         CARD
      ===================================================== */

      .etc-kit-card {
        appearance: none;
        -webkit-appearance: none;

        position: relative;

        display: grid;

        grid-template-columns:
          18px
          70px
          minmax(0, 1fr)
          auto;

        align-items: center;

        width: 100%;

        min-height: 89px;

        padding: 11px 14px;

        gap: 12px;

        border: 1px solid ${borderColor};

        border-radius: 8px;

        background: ${lightBg};

        cursor: pointer;

        text-align: left;

        font-family: inherit;

        transition:
          border-color .18s ease,
          background-color .18s ease,
          box-shadow .18s ease;

        -webkit-tap-highlight-color: transparent;
      }

      .etc-kit-card:hover {
        border-color: #D9C06A;
      }

      /* =====================================================
         CARD ATIVO
      ===================================================== */

      .etc-kit-card.etc-active {
        border: 2px solid ${mainColor};

        background: ${mainSoft};

        box-shadow:
          0 0 0 3px rgba(243, 198, 78, .15);
      }

      /* =====================================================
         INPUT
      ===================================================== */

      .etc-kit-input {
        position: absolute;

        width: 1px;
        height: 1px;

        opacity: 0;

        pointer-events: none;
      }

      /* =====================================================
         RADIO
      ===================================================== */

      .etc-kit-radio {
        position: relative;

        width: 15px;
        height: 15px;

        border-radius: 50%;

        border: 1.5px solid #BEBBB2;

        background: #FFFFFF;

        flex-shrink: 0;
      }

      .etc-kit-card.etc-active .etc-kit-radio {
        border-color: ${mainColor};
        background: ${mainColor};
      }

      .etc-kit-card.etc-active .etc-kit-radio::after {
        content: "";

        position: absolute;

        width: 5px;
        height: 5px;

        left: 50%;
        top: 50%;

        transform: translate(-50%, -50%);

        border-radius: 50%;

        background: #FFFFFF;
      }

      /* =====================================================
         IMAGENS
      ===================================================== */

      .etc-kit-image-box {
        width: 70px;
        height: 58px;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .etc-kit-image {
        display: block;

        width: 100%;
        height: 100%;

        object-fit: contain;
        object-position: center;
      }

      .etc-kit-card[data-qty="1"] .etc-kit-image {
        max-width: 49px;
        max-height: 49px;
      }

      .etc-kit-card[data-qty="3"] .etc-kit-image {
        max-width: 67px;
        max-height: 55px;
      }

      .etc-kit-card[data-qty="6"] .etc-kit-image {
        max-width: 65px;
        max-height: 58px;
      }

      /* =====================================================
         CONTEÚDO
      ===================================================== */

      .etc-kit-main {
        min-width: 0;
      }

      .etc-kit-title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        gap: 7px;

        margin-bottom: 4px;
      }

      /* =====================================================
         TÍTULO
      ===================================================== */

      .etc-kit-title {
        color: ${textColor};

        font-size: 17px;
        font-weight: 700;
        line-height: 1.1;
      }

      /* =====================================================
         DESCRIÇÕES
         SEM FUNDO AMARELO
      ===================================================== */

      .etc-kit-description {
        color: ${mutedColor};

        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;

        background: transparent;
        border: 0;
        padding: 0;
      }

      .etc-kit-meta {
        display: block;

        margin-top: 4px;

        color: #77746D;

        font-size: 11px;
        font-weight: 500;
        line-height: 1.25;

        background: transparent;
        border: 0;
      }

      /* =====================================================
         TAG PADRÃO
         SEM FUNDO
      ===================================================== */

      .etc-kit-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        padding: 0;

        border: 0;
        border-radius: 0;

        background: transparent;

        color: #77736B;

        font-size: 9px;
        font-weight: 700;
        line-height: 1;

        white-space: nowrap;
      }

      .etc-kit-tag:empty {
        display: none;
      }

      /* =====================================================
         SOMENTE "MAIS ESCOLHIDO" AMARELO
      ===================================================== */

      .etc-kit-card[data-qty="6"] .etc-kit-tag {
        padding: 4px 7px;

        border-radius: 4px;

        background: ${mainColor};

        color: #58430B;

        font-size: 9px;
        font-weight: 700;
      }

      /* =====================================================
         PREÇO
      ===================================================== */

      .etc-kit-side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        min-width: 116px;

        text-align: right;
      }

      .etc-kit-price-label {
        display: block;

        margin-bottom: 3px;

        color: #77746D;

        font-size: 7px;
        font-weight: 600;
        line-height: 1;

        letter-spacing: .04em;

        text-transform: uppercase;
      }

      .etc-kit-price {
        display: block;

        color: ${greenColor};

        font-size: 20px;
        font-weight: 700;
        line-height: 1;

        white-space: nowrap;
      }

      .etc-kit-unit-price {
        display: block;

        margin-top: 5px;

        color: #77746D;

        font-size: 9px;
        font-weight: 500;
        line-height: 1.1;

        white-space: nowrap;
      }

      /* =====================================================
         RESUMO
      ===================================================== */

      .etc-kit-summary {
        display: grid;

        grid-template-columns:
          minmax(0, 1fr)
          auto;

        align-items: center;

        gap: 15px;

        margin-top: 10px;

        padding: 14px 16px;

        border: 1px solid ${borderColor};

        border-radius: 8px;

        background: #FFFFFF;
      }

      .etc-kit-summary-left {
        min-width: 0;
      }

      .etc-kit-summary-eyebrow {
        display: block;

        margin-bottom: 3px;

        color: #7F8567;

        font-size: 8px;
        font-weight: 700;
        line-height: 1;

        text-transform: uppercase;

        letter-spacing: .04em;
      }

      .etc-kit-summary-title {
        display: block;

        color: ${greenColor};

        font-size: 15px;
        font-weight: 700;
        line-height: 1.15;
      }

      .etc-kit-summary-meta {
        display: block;

        margin-top: 3px;

        color: #77746D;

        font-size: 10px;
        font-weight: 500;
        line-height: 1.2;
      }

      .etc-kit-summary-right {
        text-align: right;
      }

      .etc-kit-summary-total-label {
        display: block;

        margin-bottom: 2px;

        color: #77746D;

        font-size: 8px;
        font-weight: 600;
        line-height: 1;

        text-transform: uppercase;
      }

      .etc-kit-summary-total {
        display: block;

        color: ${textColor};

        font-size: 20px;
        font-weight: 700;
        line-height: 1;

        white-space: nowrap;
      }

      .etc-kit-summary-saving {
        display: block;

        margin-top: 6px;

        color: #7C7972;

        font-size: 9px;
        font-weight: 500;
        line-height: 1.1;
      }

      .etc-kit-summary-saving strong {
        color: ${greenColor};
        font-weight: 700;
      }

      /* =====================================================
         MOBILE
      ===================================================== */

      @media (max-width: 520px) {

        .etc-kit-wrapper {
          margin: 15px 0;
        }

        .etc-kit-daily-info {
          margin-bottom: 10px;
        }

        .etc-kit-daily-info span {
          min-height: 24px;

          padding: 5px 10px;

          font-size: 9px;
        }

        .etc-kit-list {
          gap: 7px;
        }

        .etc-kit-card {
          grid-template-columns:
            15px
            52px
            minmax(0, 1fr)
            auto;

          min-height: 79px;

          padding: 9px 9px;

          gap: 8px;

          border-radius: 7px;
        }

        .etc-kit-radio {
          width: 14px;
          height: 14px;
        }

        .etc-kit-image-box {
          width: 52px;
          height: 50px;
        }

        .etc-kit-card[data-qty="1"] .etc-kit-image {
          max-width: 39px;
          max-height: 40px;
        }

        .etc-kit-card[data-qty="3"] .etc-kit-image {
          max-width: 50px;
          max-height: 45px;
        }

        .etc-kit-card[data-qty="6"] .etc-kit-image {
          max-width: 50px;
          max-height: 47px;
        }

        .etc-kit-title-row {
          gap: 5px;
          margin-bottom: 3px;
        }

        .etc-kit-title {
          font-size: 14px;
        }

        .etc-kit-description {
          font-size: 9px;
        }

        .etc-kit-card[data-qty="6"] .etc-kit-tag {
          padding: 3px 5px;

          font-size: 7px;
        }

        .etc-kit-meta {
          margin-top: 3px;

          font-size: 9px;
        }

        .etc-kit-side {
          min-width: 88px;
        }

        .etc-kit-price-label {
          font-size: 6px;
        }

        .etc-kit-price {
          font-size: 16px;
        }

        .etc-kit-unit-price {
          margin-top: 4px;

          font-size: 7px;
        }

        .etc-kit-summary {
          gap: 8px;

          margin-top: 8px;

          padding: 12px 11px;
        }

        .etc-kit-summary-eyebrow {
          font-size: 7px;
        }

        .etc-kit-summary-title {
          font-size: 13px;
        }

        .etc-kit-summary-meta {
          font-size: 8px;
        }

        .etc-kit-summary-total-label {
          font-size: 7px;
        }

        .etc-kit-summary-total {
          font-size: 17px;
        }

        .etc-kit-summary-saving {
          margin-top: 4px;

          font-size: 7px;
        }
      }

      /* =====================================================
         MOBILE PEQUENO
      ===================================================== */

      @media (max-width: 380px) {

        .etc-kit-card {
          grid-template-columns:
            14px
            43px
            minmax(0, 1fr)
            auto;

          padding-left: 8px;
          padding-right: 8px;

          gap: 6px;
        }

        .etc-kit-image-box {
          width: 43px;
        }

        .etc-kit-title {
          font-size: 13px;
        }

        .etc-kit-side {
          min-width: 81px;
        }

        .etc-kit-price {
          font-size: 14px;
        }

        .etc-kit-unit-price {
          font-size: 6.5px;
        }

        .etc-kit-summary-total {
          font-size: 15px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================================
     CRIAR CARD
  ========================================================= */

  function createCard(qty) {
    const kit = kits[qty];

    return `
      <button
        type="button"
        class="etc-kit-card"
        data-qty="${qty}"
        aria-label="Selecionar ${kit.title}"
        aria-pressed="false"
      >

        <input
          class="etc-kit-input"
          type="radio"
          name="etc-kit-option"
          value="${qty}"
        />

        <span class="etc-kit-radio"></span>

        <span class="etc-kit-image-box">

          <img
            class="etc-kit-image"
            src="${kit.image}"
            alt="${kit.title}"
            loading="lazy"
          />

        </span>

        <span class="etc-kit-main">

          <span class="etc-kit-title-row">

            <span class="etc-kit-title">
              ${kit.title}
            </span>

            ${
              kit.description
                ? `
                  <span class="etc-kit-description">
                    ${kit.description}
                  </span>
                `
                : ""
            }

            ${
              kit.tag
                ? `
                  <span class="etc-kit-tag">
                    ${kit.tag}
                  </span>
                `
                : ""
            }

          </span>

          <span class="etc-kit-meta">
            ${kit.quantity} · ${kit.capsules}
          </span>

        </span>

        <span class="etc-kit-side">

          <span class="etc-kit-price-label">
            Total do kit
          </span>

          <span class="etc-kit-price">
            ${formatMoney(kit.totalPrice)}
          </span>

          <span class="etc-kit-unit-price">
            ${formatMoney(kit.unitPrice)} por pote
          </span>

        </span>

      </button>
    `;
  }

  /* =========================================================
     CRIAR WRAPPER
  ========================================================= */

  function createWrapper() {
    const wrapper = document.createElement("div");

    wrapper.className = "etc-kit-wrapper";

    wrapper.setAttribute(
      "data-etc-kit",
      "true"
    );

    wrapper.setAttribute(
      "data-version",
      version
    );

    wrapper.innerHTML = `

      <div class="etc-kit-daily-info">

        <span>
          <strong>1 cápsula por dia</strong>
          &nbsp;·&nbsp;
          1 pote acompanha 30 dias
        </span>

      </div>

      <div class="etc-kit-list">

        ${createCard(1)}

        ${createCard(3)}

        ${createCard(6)}

      </div>

      <div class="etc-kit-summary">

        <div class="etc-kit-summary-left">

          <span class="etc-kit-summary-eyebrow">
            Sua escolha
          </span>

          <span
            class="etc-kit-summary-title"
            data-etc-summary-title
          ></span>

          <span
            class="etc-kit-summary-meta"
            data-etc-summary-meta
          ></span>

        </div>

        <div class="etc-kit-summary-right">

          <span class="etc-kit-summary-total-label">
            Total
          </span>

          <span
            class="etc-kit-summary-total"
            data-etc-summary-total
          ></span>

          <span
            class="etc-kit-summary-saving"
            data-etc-summary-saving
          ></span>

        </div>

      </div>
    `;

    return wrapper;
  }

  /* =========================================================
     INPUT DE QUANTIDADE NATIVO
  ========================================================= */

  function getQuantityInput() {
    return document.querySelector(
      "#sylius_cart_item_quantity"
    );
  }

  /* =========================================================
     ATUALIZAR QUANTIDADE
  ========================================================= */

  function updateQuantity(qty) {
    const input = getQuantityInput();

    if (!input) {
      return;
    }

    input.value = qty;

    input.setAttribute(
      "value",
      qty
    );

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new KeyboardEvent("keyup", {
        bubbles: true
      })
    );
  }

  /* =========================================================
     ATUALIZAR RESUMO
  ========================================================= */

  function updateSummary(qty) {
    const kit = kits[qty];

    const wrapper =
      document.querySelector(
        ".etc-kit-wrapper"
      );

    if (!kit || !wrapper) {
      return;
    }

    const title =
      wrapper.querySelector(
        "[data-etc-summary-title]"
      );

    const meta =
      wrapper.querySelector(
        "[data-etc-summary-meta]"
      );

    const total =
      wrapper.querySelector(
        "[data-etc-summary-total]"
      );

    const saving =
      wrapper.querySelector(
        "[data-etc-summary-saving]"
      );

    if (title) {
      title.textContent =
        kit.summaryTitle;
    }

    if (meta) {
      meta.textContent =
        kit.quantity +
        " · " +
        kit.capsules;
    }

    if (total) {
      total.textContent =
        formatMoney(
          kit.totalPrice
        );
    }

    if (saving) {
      saving.innerHTML =
        'Você economiza <strong>' +
        kit.saving +
        "</strong>";
    }
  }

  /* =========================================================
     MARCAR CARD ATIVO
  ========================================================= */

  function setActiveCard(qty) {
    const wrapper =
      document.querySelector(
        ".etc-kit-wrapper"
      );

    if (!wrapper || !kits[qty]) {
      return;
    }

    wrapper
      .querySelectorAll(
        ".etc-kit-card"
      )
      .forEach(function (card) {

        const active =
          card.getAttribute(
            "data-qty"
          ) === String(qty);

        const input =
          card.querySelector(
            ".etc-kit-input"
          );

        card.classList.toggle(
          "etc-active",
          active
        );

        card.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

        if (input) {
          input.checked = active;
        }
      });

    updateSummary(qty);
  }

  /* =========================================================
     SELECIONAR KIT
  ========================================================= */

  function selectKit(qty) {
    if (!kits[qty]) {
      return;
    }

    selectedQty = String(qty);

    setActiveCard(
      selectedQty
    );

    updateQuantity(
      selectedQty
    );
  }

  /* =========================================================
     EVENTOS
  ========================================================= */

  function bindEvents(wrapper) {
    if (
      !wrapper ||
      wrapper.dataset.bound === "true"
    ) {
      return;
    }

    wrapper.dataset.bound = "true";

    wrapper.addEventListener(
      "click",
      function (event) {

        const card =
          event.target.closest(
            ".etc-kit-card"
          );

        if (
          !card ||
          !wrapper.contains(card)
        ) {
          return;
        }

        event.preventDefault();

        event.stopPropagation();

        const qty =
          card.getAttribute(
            "data-qty"
          );

        selectKit(qty);
      }
    );
  }

  /* =========================================================
     INSERIR KIT
  ========================================================= */

  function insertKit() {
    if (!isAllowedPage()) {
      removeKit();
      return;
    }

    injectStyle();

    const target =
      document.querySelector(
        ".cart-actions-container"
      );

    const quantityInput =
      getQuantityInput();

    if (
      !target ||
      !quantityInput
    ) {
      return;
    }

    let wrapper =
      document.querySelector(
        ".etc-kit-wrapper"
      );

    if (
      wrapper &&
      wrapper.getAttribute(
        "data-version"
      ) !== version
    ) {
      wrapper.remove();
      wrapper = null;
    }

    if (!wrapper) {
      wrapper =
        createWrapper();

      target.parentNode.insertBefore(
        wrapper,
        target
      );
    }

    bindEvents(wrapper);

    setActiveCard(
      selectedQty
    );

    updateQuantity(
      selectedQty
    );
  }

  /* =========================================================
     AGENDAMENTO
  ========================================================= */

  function scheduleInsert() {
    clearTimeout(
      repairTimer
    );

    repairTimer =
      setTimeout(function () {
        insertKit();
      }, 400);
  }

  /* =========================================================
     TROCA DE ROTA
  ========================================================= */

  function checkRouteChange() {
    const currentUrl =
      window.location.href;

    if (
      currentUrl === lastUrl
    ) {
      scheduleInsert();
      return;
    }

    lastUrl = currentUrl;

    clearTimeout(
      routeTimer
    );

    routeTimer =
      setTimeout(function () {

        if (!isAllowedPage()) {
          removeKit();
          return;
        }

        insertKit();

        setTimeout(
          insertKit,
          500
        );

        setTimeout(
          insertKit,
          1200
        );

        setTimeout(
          insertKit,
          2200
        );

      }, 400);
  }

  /* =========================================================
     PATCH HISTORY
  ========================================================= */

  function patchHistoryMethods() {
    if (
      window.__etcKitHistoryPatched
    ) {
      return;
    }

    window.__etcKitHistoryPatched =
      true;

    const originalPushState =
      history.pushState;

    const originalReplaceState =
      history.replaceState;

    history.pushState =
      function () {

        originalPushState.apply(
          history,
          arguments
        );

        checkRouteChange();
      };

    history.replaceState =
      function () {

        originalReplaceState.apply(
          history,
          arguments
        );

        checkRouteChange();
      };

    window.addEventListener(
      "popstate",
      checkRouteChange
    );
  }

  /* =========================================================
     MUTATION OBSERVER
  ========================================================= */

  function startObserver() {
    if (observerStarted) {
      return;
    }

    observerStarted = true;

    const observer =
      new MutationObserver(
        function () {

          if (!isAllowedPage()) {
            removeKit();
            return;
          }

          scheduleInsert();
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  /* =========================================================
     BOOT
  ========================================================= */

  function boot() {
    patchHistoryMethods();

    checkRouteChange();

    startObserver();

    setTimeout(
      checkRouteChange,
      500
    );

    setTimeout(
      checkRouteChange,
      1200
    );

    setTimeout(
      checkRouteChange,
      2500
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot
    );

  } else {

    boot();

  }
})();