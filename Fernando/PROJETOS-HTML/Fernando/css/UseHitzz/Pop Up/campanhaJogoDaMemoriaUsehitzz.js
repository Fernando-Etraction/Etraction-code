(function () {
  "use strict";

  if (window.__USEHITZZ_MEMORY_EDRONE_V6__) return;
  window.__USEHITZZ_MEMORY_EDRONE_V6__ = true;

  /* =========================================================
     CONFIGURAÇÕES
     ========================================================= */

  var CONFIG = {
    coupon: "JMHITZZ",
    discount: "10% OFF",

    /*
      Tag enviada diretamente no customer_tags da edrone.
      Não precisa cadastrar manualmente no código.
    */
    edroneTag: "jogo da memória",

    shopUrl: "/",

    maxTurns: 7,

    /*
      Abre automaticamente após 10 segundos.
    */
    autoOpenDelay: 7000,

    storageKey: "usehitzz_memory_campaign_v6",

    storageDays: 30,

    /*
      Mesmo padrão usado no código que já funcionou.
    */
    edroneTimeout: 8000
  };


  /* =========================================================
     ESTADO
     ========================================================= */

  var first = null;
  var second = null;

  var locked = true;

  var matches = 0;
  var turns = 0;

  var result = null;

  var overlay = null;
  var modal = null;
  var board = null;
  var startButton = null;
  var statusElement = null;
  var form = null;
  var message = null;
  var phoneInput = null;
  var closeButton = null;

  var ROOT_ID = "uhmMemoryRoot";
  var STYLE_ID = "uhmMemoryStyles";


  /* =========================================================
     PRODUTOS
     ========================================================= */

  var SYMBOLS = [
    {
      id: "isis",

      image:
        "https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/06/57/e4/6838d4cf2e290e6f30ffb54ee6/isis-chinelo-flatform-feminino-couro-preto-large-1.png",

      label:
        "Chinelo Isis"
    },

    {
      id: "bag",

      image:
        "https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/3e/b6/d7/c244b00c7670f4abd86c63c81a/agnes-bolsa-feminina-matelasse-lateral-preta-large-1.png",

      label:
        "Bolsa Agnes"
    },

    {
      id: "lion",

      image:
        "https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/8d/25/70/097cc10e610c28c50976f4c951/lion-clog-feminino-2-em-1-couro-preto-large-3.png",

      label:
        "Lion Clog"
    }
  ];


  /* =========================================================
     INÍCIO
     ========================================================= */

  start();


  function start() {
    var attempts = 0;

    function mount() {
      attempts += 1;

      if (!document.head || !document.body) {
        if (attempts < 100) {
          setTimeout(mount, 100);
        }

        return;
      }

      init();
    }

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        mount,
        {
          once: true
        }
      );

      /*
        Fallback semelhante ao seu código funcional.
      */
      setTimeout(mount, 500);
    } else {
      mount();
    }
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {
    removePreviousVersions();

    if (document.getElementById(ROOT_ID)) {
      return;
    }

    injectStyles();
    createStructure();
    cacheElements();
    bindEvents();

    buildBoard();
    updateScore();

    /*
      Abre somente se ainda estiver disponível.
    */
    if (canPlay()) {
      setTimeout(function () {
        if (!canPlay()) {
          return;
        }

        if (
          overlay &&
          !overlay.classList.contains("uhm-open")
        ) {
          openModal();
        }
      }, CONFIG.autoOpenDelay);
    }

    console.info(
      "[eTraction Hitzz Memory] iniciado.",
      {
        cupom: CONFIG.coupon,
        tag: CONFIG.edroneTag,
        abertura: CONFIG.autoOpenDelay
      }
    );
  }


  /* =========================================================
     REMOVE VERSÕES ANTERIORES
     ========================================================= */

  function removePreviousVersions() {
    var oldRoot =
      document.getElementById(ROOT_ID);

    var oldStyle =
      document.getElementById(STYLE_ID);

    if (oldRoot) {
      oldRoot.remove();
    }

    if (oldStyle) {
      oldStyle.remove();
    }
  }


  /* =========================================================
     CSS
     ========================================================= */

  function injectStyles() {
    var style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent = `

      #${ROOT_ID},
      #${ROOT_ID} *,
      #${ROOT_ID} *::before,
      #${ROOT_ID} *::after {
        box-sizing: border-box !important;
      }

      #${ROOT_ID} {
        font-family: Arial, Helvetica, sans-serif !important;
      }

      #${ROOT_ID} button,
      #${ROOT_ID} input {
        font-family: inherit !important;
      }

      .uhm-hidden {
        display: none !important;
      }


      /* =====================================================
         OVERLAY
         ===================================================== */

      .uhm-overlay {
        position: fixed !important;
        inset: 0 !important;

        z-index: 2147483000 !important;

        display: grid !important;
        place-items: center !important;

        padding: 12px !important;

        background: rgba(8, 8, 8, .74) !important;

        -webkit-backdrop-filter: blur(5px) !important;
        backdrop-filter: blur(5px) !important;

        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;

        transition:
          opacity .25s ease,
          visibility .25s ease !important;
      }

      .uhm-overlay.uhm-open {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }


      /* =====================================================
         MODAL
         ===================================================== */

      .uhm-modal {
        position: relative !important;

        width: min(
          calc(100vw - 24px),
          580px
        ) !important;

        max-height:
          calc(100vh - 24px) !important;

        max-height:
          calc(100dvh - 24px) !important;

        margin: 0 !important;
        padding: 0 !important;

        overflow-y: auto !important;
        overflow-x: hidden !important;

        border: 0 !important;
        border-radius: 18px !important;

        background: #fff !important;
        color: #000 !important;

        box-shadow:
          0 24px 70px rgba(0, 0, 0, .32) !important;
      }


      /* =====================================================
         HEADER
         ===================================================== */

      .uhm-brand {
        position: relative !important;

        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        min-height: 52px !important;

        padding:
          13px 56px 11px !important;
      }

      .uhm-brand::after {
        content: "" !important;

        position: absolute !important;

        right: 20px !important;
        bottom: 0 !important;
        left: 20px !important;

        height: 1px !important;

        background: #ececec !important;
      }

      .uhm-brand img {
        display: block !important;

        width: 96px !important;
        max-width: 96px !important;

        height: auto !important;
      }

      .uhm-close {
        position: absolute !important;

        top: 10px !important;
        right: 11px !important;

        z-index: 999 !important;

        display: grid !important;
        place-items: center !important;

        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;

        margin: 0 !important;
        padding: 0 !important;

        border: 0 !important;
        border-radius: 50% !important;

        background: #000 !important;
        color: #fff !important;

        font-size: 22px !important;
        font-weight: 400 !important;

        line-height: 1 !important;

        cursor: pointer !important;
      }


      /* =====================================================
         VIEWS
         ===================================================== */

      .uhm-view {
        display: none !important;

        padding:
          18px 24px 22px !important;

        text-align: center !important;
      }

      .uhm-view.uhm-active {
        display: block !important;

        animation:
          uhmFade .3s ease !important;
      }

      @keyframes uhmFade {
        from {
          opacity: 0;
          transform: translateY(6px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }


      /* =====================================================
         TEXTOS
         ===================================================== */

      .uhm-title {
        display: block !important;

        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #000 !important;

        font-size: 31px !important;
        font-weight: 800 !important;

        line-height: .98 !important;

        letter-spacing:
          -.045em !important;

        text-align: center !important;
      }

      .uhm-title span {
        color: #d20a16 !important;
      }

      .uhm-copy {
        display: block !important;

        width: 100% !important;
        max-width: 390px !important;

        margin:
          8px auto 0 !important;

        padding: 0 !important;

        color: #696969 !important;

        font-size: 12px !important;

        line-height: 1.4 !important;

        text-align: center !important;
      }

      .uhm-kicker {
        display:
          inline-block !important;

        margin:
          0 0 10px !important;

        padding:
          7px 11px !important;

        border-radius:
          999px !important;

        background:
          #000 !important;

        color:
          #fff !important;

        font-size:
          10px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .08em !important;

        text-transform:
          uppercase !important;
      }


      /* =====================================================
         PLACAR
         ===================================================== */

      .uhm-stats {
        display: grid !important;

        grid-template-columns:
          1fr 1fr !important;

        width: 100% !important;
        max-width: 440px !important;

        margin:
          13px auto 0 !important;

        overflow: hidden !important;

        border:
          1px solid #dedede !important;

        border-radius:
          8px !important;

        background:
          #f5f5f5 !important;
      }

      .uhm-stat {
        display: flex !important;

        align-items: center !important;
        justify-content: center !important;

        gap: 8px !important;

        min-height: 40px !important;

        padding:
          8px 12px !important;

        color:
          #666 !important;

        font-size:
          9px !important;

        text-align:
          center !important;
      }

      .uhm-stat + .uhm-stat {
        border-left:
          1px solid #dedede !important;
      }

      .uhm-stat strong {
        display:
          inline-block !important;

        margin: 0 !important;

        color:
          #000 !important;

        font-size:
          17px !important;

        font-weight:
          900 !important;

        line-height:
          1 !important;
      }


      /* =====================================================
         TABULEIRO
         ===================================================== */

      .uhm-board {
        position: relative !important;

        display: grid !important;

        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          ) !important;

        gap: 12px !important;

        width: 100% !important;
        max-width: 440px !important;

        margin:
          12px auto 0 !important;

        padding: 0 !important;
      }


      /* =====================================================
         CARTAS
         ===================================================== */

      .uhm-card {
        position: relative !important;

        display: block !important;

        width: 100% !important;

        aspect-ratio: .82 !important;

        margin: 0 !important;
        padding: 0 !important;

        border: 0 !important;
        border-radius:
          16px !important;

        outline: none !important;

        background:
          #fff !important;

        cursor:
          pointer !important;

        overflow:
          hidden !important;

        box-shadow:
          0 4px 13px
          rgba(0, 0, 0, .09) !important;

        transform:
          scaleX(1) !important;

        -webkit-transform:
          scaleX(1) !important;

        transform-origin:
          center !important;

        -webkit-transform-origin:
          center !important;

        transition:
          transform .18s ease !important;

        -webkit-transition:
          -webkit-transform .18s ease !important;

        touch-action:
          manipulation !important;

        -webkit-tap-highlight-color:
          transparent !important;

        user-select:
          none !important;

        -webkit-user-select:
          none !important;
      }

      .uhm-card.uhm-turning {
        transform:
          scaleX(.03) !important;

        -webkit-transform:
          scaleX(.03) !important;
      }

      .uhm-card.uhm-matched {
        box-shadow:
          inset 0 0 0 2px #000,
          0 5px 14px rgba(0,0,0,.12) !important;
      }

      .uhm-card-content {
        position: absolute !important;
        inset: 0 !important;

        display: block !important;

        width: 100% !important;
        height: 100% !important;
      }


      /* =====================================================
         VERSO
         ===================================================== */

      .uhm-card-back {
        position: absolute !important;
        inset: 0 !important;

        display: grid !important;
        place-items: center !important;

        width: 100% !important;
        height: 100% !important;

        overflow: hidden !important;

        border:
          1px solid #d8d8d8 !important;

        border-radius:
          16px !important;

        background:
          linear-gradient(
            135deg,
            transparent 0 46%,
            #ececec 46% 47%,
            transparent 47% 100%
          ),
          linear-gradient(
            45deg,
            transparent 0 46%,
            #f2f2f2 46% 47%,
            transparent 47% 100%
          ),
          #fff !important;

        background-size:
          34px 34px !important;
      }

      .uhm-card-back::before {
        content: "H" !important;

        position:
          absolute !important;

        top: 50% !important;
        left: 50% !important;

        color:
          #f0f0f0 !important;

        font-size:
          clamp(
            72px,
            11vw,
            108px
          ) !important;

        font-weight:
          900 !important;

        line-height:
          1 !important;

        transform:
          translate(
            -50%,
            -50%
          ) !important;
      }

      .uhm-back-logo {
        position:
          relative !important;

        z-index:
          2 !important;

        display:
          block !important;

        width:
          70% !important;

        max-width:
          70% !important;

        height:
          auto !important;
      }

      .uhm-back-meta {
        position:
          absolute !important;

        top:
          10px !important;

        right:
          11px !important;

        left:
          11px !important;

        z-index:
          3 !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          space-between !important;

        color:
          #777 !important;
      }

      .uhm-back-meta small {
        font-size:
          6px !important;

        font-weight:
          800 !important;

        letter-spacing:
          .16em !important;

        text-transform:
          uppercase !important;
      }

      .uhm-back-meta b {
        color:
          #555 !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;
      }

      .uhm-back-detail {
        position:
          absolute !important;

        right:
          10px !important;

        bottom:
          10px !important;

        left:
          10px !important;

        z-index:
          3 !important;

        color:
          #777 !important;

        font-size:
          7px !important;

        font-weight:
          800 !important;

        letter-spacing:
          .15em !important;

        text-align:
          center !important;

        text-transform:
          uppercase !important;
      }


      /* =====================================================
         FRENTE
         ===================================================== */

      .uhm-card-front {
        position: absolute !important;
        inset: 0 !important;

        display: block !important;

        width: 100% !important;
        height: 100% !important;

        overflow:
          hidden !important;

        border:
          1px solid #e1e1e1 !important;

        border-radius:
          16px !important;

        background:
          #fff !important;
      }

      .uhm-card-front::after {
        content: "" !important;

        position:
          absolute !important;

        inset:
          42% 0 0 !important;

        z-index:
          2 !important;

        background:
          linear-gradient(
            180deg,
            transparent,
            rgba(0, 0, 0, .72)
          ) !important;

        pointer-events:
          none !important;
      }

      .uhm-icon {
        position: absolute !important;
        inset: 0 !important;

        display: block !important;

        width:
          100% !important;

        height:
          100% !important;

        max-width:
          none !important;

        object-fit:
          cover !important;

        object-position:
          center !important;
      }

      .uhm-label {
        position:
          absolute !important;

        right:
          8px !important;

        bottom:
          8px !important;

        left:
          8px !important;

        z-index:
          5 !important;

        display:
          block !important;

        padding:
          7px 8px !important;

        border-radius:
          5px !important;

        background:
          rgba(0, 0, 0, .72) !important;

        color:
          #fff !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;

        line-height:
          1 !important;

        letter-spacing:
          .07em !important;

        text-align:
          center !important;

        text-transform:
          uppercase !important;
      }

      .uhm-card-check {
        position:
          absolute !important;

        top:
          7px !important;

        right:
          7px !important;

        z-index:
          20 !important;

        display:
          none !important;

        place-items:
          center !important;

        width:
          24px !important;

        height:
          24px !important;

        border-radius:
          50% !important;

        background:
          #000 !important;

        color:
          #fff !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;
      }

      .uhm-card.uhm-matched
      .uhm-card-check {
        display:
          grid !important;
      }


      /* =====================================================
         STATUS
         ===================================================== */

      .uhm-status {
        display: flex !important;

        width: 100% !important;
        max-width: 440px !important;

        min-height:
          34px !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        margin:
          10px auto 0 !important;

        padding:
          8px 12px !important;

        border:
          0 !important;

        border-radius:
          7px !important;

        background:
          #f1f1f1 !important;

        color:
          #4f4f4f !important;

        font-size:
          10px !important;

        font-weight:
          500 !important;

        line-height:
          1.3 !important;

        text-align:
          center !important;
      }

      .uhm-status::before {
        content:
          "" !important;

        display:
          block !important;

        width:
          7px !important;

        height:
          7px !important;

        flex:
          0 0 7px !important;

        margin-right:
          8px !important;

        border-radius:
          50% !important;

        background:
          #d20a16 !important;

        box-shadow:
          0 0 0 4px
          rgba(210, 10, 22, .09) !important;
      }


      /* =====================================================
         BOTÕES
         ===================================================== */

      .uhm-btn {
        display:
          grid !important;

        place-items:
          center !important;

        width:
          100% !important;

        max-width:
          440px !important;

        min-height:
          43px !important;

        margin:
          9px auto 0 !important;

        padding:
          10px 15px !important;

        border:
          1px solid #000 !important;

        border-radius:
          7px !important;

        background:
          #000 !important;

        color:
          #fff !important;

        font-size:
          13px !important;

        font-weight:
          900 !important;

        line-height:
          1.2 !important;

        text-decoration:
          none !important;

        cursor:
          pointer !important;
      }

      .uhm-btn:disabled {
        opacity:
          .55 !important;

        cursor:
          wait !important;
      }

      .uhm-small {
        margin:
          7px 0 0 !important;

        color:
          #777 !important;

        font-size:
          9px !important;
      }


      /* =====================================================
         FORM / CUPOM / DERROTA
         ===================================================== */

      .uhm-view[data-view="form"],
      .uhm-view[data-view="coupon"],
      .uhm-view[data-view="lost"] {
        width:
          100% !important;

        max-width:
          480px !important;

        margin:
          0 auto !important;

        padding:
          26px 28px 28px !important;
      }

      .uhm-result-icon,
      .uhm-lost-icon {
        display:
          grid !important;

        place-items:
          center !important;

        width:
          60px !important;

        height:
          60px !important;

        margin:
          4px auto 14px !important;

        border-radius:
          50% !important;

        background:
          #f1f1f1 !important;

        color:
          #000 !important;

        font-size:
          28px !important;
      }

      .uhm-view[data-view="form"] .uhm-title,
      .uhm-view[data-view="coupon"] .uhm-title,
      .uhm-view[data-view="lost"] .uhm-title {
        font-size:
          32px !important;
      }

      .uhm-discount {
        margin:
          16px 0 5px !important;

        color:
          #000 !important;

        font-size:
          46px !important;

        font-weight:
          900 !important;

        line-height:
          1 !important;

        letter-spacing:
          -.05em !important;
      }


      /* =====================================================
         FORM
         ===================================================== */

      .uhm-form {
        display:
          grid !important;

        gap:
          10px !important;

        margin:
          20px 0 0 !important;

        padding:
          0 !important;

        text-align:
          left !important;
      }

      .uhm-field label {
        display:
          block !important;

        margin:
          0 0 5px 3px !important;

        color:
          #000 !important;

        font-size:
          11px !important;

        font-weight:
          800 !important;
      }

      .uhm-field input {
        display:
          block !important;

        width:
          100% !important;

        height:
          47px !important;

        margin:
          0 !important;

        padding:
          0 14px !important;

        border:
          1px solid #d3d3d3 !important;

        border-radius:
          7px !important;

        outline:
          0 !important;

        background:
          #fff !important;

        color:
          #000 !important;

        font-size:
          14px !important;
      }

      .uhm-field input:focus {
        border-color:
          #000 !important;

        box-shadow:
          0 0 0 3px rgba(0,0,0,.07) !important;
      }

      .uhm-consent {
        display:
          flex !important;

        align-items:
          flex-start !important;

        gap:
          8px !important;

        margin:
          0 !important;

        color:
          #696969 !important;

        font-size:
          10px !important;

        line-height:
          1.35 !important;
      }

      .uhm-consent input {
        margin:
          2px 0 0 !important;

        accent-color:
          #000 !important;
      }

      .uhm-message {
        min-height:
          14px !important;

        margin:
          0 !important;

        color:
          #b42318 !important;

        font-size:
          11px !important;

        text-align:
          center !important;
      }


      /* =====================================================
         CUPOM
         ===================================================== */

      .uhm-coupon {
        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          space-between !important;

        gap:
          10px !important;

        margin:
          21px 0 12px !important;

        padding:
          9px 9px 9px 15px !important;

        border:
          2px solid #000 !important;

        border-radius:
          7px !important;

        background:
          #fff !important;

        color:
          #000 !important;
      }

      .uhm-code {
        font-size:
          20px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .08em !important;
      }

      .uhm-copy-btn {
        margin:
          0 !important;

        padding:
          10px 12px !important;

        border:
          0 !important;

        border-radius:
          6px !important;

        background:
          #000 !important;

        color:
          #fff !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;

        cursor:
          pointer !important;
      }

      .uhm-rules {
        margin:
          10px 0 0 !important;

        color:
          #696969 !important;

        font-size:
          10px !important;

        line-height:
          1.4 !important;
      }


      /* =====================================================
         DERROTA
         ===================================================== */

      .uhm-lost-copy {
        max-width:
          340px !important;

        margin:
          12px auto 0 !important;

        color:
          #666 !important;

        font-size:
          13px !important;

        line-height:
          1.5 !important;
      }


      /* =====================================================
         MOBILE
         ===================================================== */

      @media (max-width: 600px) {

        .uhm-overlay {
          padding:
            8px !important;
        }

        .uhm-modal {
          width:
            min(
              calc(100vw - 16px),
              430px
            ) !important;

          max-height:
            calc(100dvh - 16px) !important;

          border-radius:
            14px !important;
        }

        .uhm-brand {
          min-height:
            44px !important;

          padding:
            10px 48px 8px !important;
        }

        .uhm-brand img {
          width:
            82px !important;

          max-width:
            82px !important;
        }

        .uhm-close {
          top:
            7px !important;

          right:
            8px !important;

          width:
            31px !important;

          height:
            31px !important;

          min-width:
            31px !important;

          font-size:
            19px !important;
        }

        .uhm-view {
          padding:
            10px 12px 12px !important;
        }

        .uhm-title {
          font-size:
            clamp(
              22px,
              6.3vw,
              27px
            ) !important;
        }

        .uhm-title br {
          display:
            none !important;
        }

        .uhm-copy {
          margin-top:
            5px !important;

          font-size:
            10px !important;
        }

        .uhm-stats {
          margin-top:
            8px !important;
        }

        .uhm-stat {
          min-height:
            34px !important;

          padding:
            6px 8px !important;

          font-size:
            8px !important;
        }

        .uhm-stat strong {
          font-size:
            14px !important;
        }

        .uhm-board {
          max-width:
            316px !important;

          gap:
            7px !important;

          margin-top:
            8px !important;
        }

        .uhm-card,
        .uhm-card-back,
        .uhm-card-front {
          border-radius:
            11px !important;
        }

        .uhm-label {
          right:
            6px !important;

          bottom:
            6px !important;

          left:
            6px !important;

          padding:
            5px 4px !important;

          font-size:
            7px !important;
        }

        .uhm-status {
          min-height:
            30px !important;

          margin-top:
            7px !important;

          padding:
            6px 9px !important;

          font-size:
            9px !important;
        }

        .uhm-btn {
          min-height:
            38px !important;

          margin-top:
            7px !important;

          font-size:
            11px !important;
        }

        .uhm-view[data-view="form"],
        .uhm-view[data-view="coupon"],
        .uhm-view[data-view="lost"] {
          padding:
            14px 14px 16px !important;
        }

        .uhm-view[data-view="form"] .uhm-title,
        .uhm-view[data-view="coupon"] .uhm-title,
        .uhm-view[data-view="lost"] .uhm-title {
          font-size:
            25px !important;
        }

        .uhm-result-icon,
        .uhm-lost-icon {
          width:
            44px !important;

          height:
            44px !important;

          margin-bottom:
            8px !important;

          font-size:
            21px !important;
        }

        .uhm-discount {
          margin:
            8px 0 3px !important;

          font-size:
            35px !important;
        }

        .uhm-form {
          gap:
            7px !important;

          margin-top:
            12px !important;
        }

        .uhm-field input {
          height:
            40px !important;

          font-size:
            13px !important;
        }

        .uhm-coupon {
          margin:
            12px 0 8px !important;
        }

        .uhm-code {
          font-size:
            17px !important;
        }

        .uhm-lost-copy {
          font-size:
            11px !important;
        }

      }

    `;

    document.head.appendChild(
      style
    );
  }


  /* =========================================================
     HTML
     ========================================================= */

  function createStructure() {
    var root =
      document.createElement("div");

    root.id =
      ROOT_ID;

    root.innerHTML = `

      <div
        class="uhm-overlay"
        id="uhmOverlay"
        aria-hidden="true"
      >

        <section
          class="uhm-modal"
          role="dialog"
          aria-modal="true"
        >

          <button
            class="uhm-close"
            type="button"
            aria-label="Fechar"
          >
            ×
          </button>


          <div class="uhm-brand">

            <img
              src="https://adaptive-images.uooucdn.com.br/tr:w-200,h-55,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/s/bc/cd/11/166f64fab1c8539ed760290a5c.svg"
              alt="UseHitzz"
            >

          </div>


          <!-- JOGO -->

          <div
            class="uhm-view uhm-active"
            data-view="game"
          >

            <h2 class="uhm-title">

              Encontre os pares
              <br>

              e ganhe

              <span>
                10% OFF
              </span>

            </h2>


            <p class="uhm-copy">

              Memorize as cartas e encontre
              os três pares em até sete jogadas.

            </p>


            <div class="uhm-stats">

              <div class="uhm-stat">

                Pares encontrados

                <strong>

                  <span data-matches>
                    0
                  </span>/3

                </strong>

              </div>


              <div class="uhm-stat">

                Jogadas restantes

                <strong data-left>
                  7
                </strong>

              </div>

            </div>


            <div
              class="uhm-board"
              aria-label="Jogo da memória"
            ></div>


            <p
              class="uhm-status"
              aria-live="polite"
            >
              Clique em começar para ver as cartas.
            </p>


            <button
              class="uhm-btn uhm-start"
              type="button"
            >
              Começar o desafio
            </button>


            <p class="uhm-small">
              Uma tentativa por pessoa.
            </p>

          </div>


          <!-- GANHOU -->

          <div
            class="uhm-view"
            data-view="form"
          >

            <div class="uhm-result-icon">
              ✦
            </div>


            <p class="uhm-kicker">
              Você venceu
            </p>


            <h2 class="uhm-title">
              Memória afiada!
            </h2>


            <div class="uhm-discount">
              10% OFF
            </div>


            <p class="uhm-copy">

              Preencha seus dados para liberar
              seu cupom exclusivo.

            </p>


            <form
              class="uhm-form"
              novalidate
            >

              <div class="uhm-field">

                <label for="uhmName">
                  Nome
                </label>

                <input
                  id="uhmName"
                  name="name"
                  autocomplete="name"
                  placeholder="Seu nome"
                  required
                >

              </div>


              <div class="uhm-field">

                <label for="uhmEmail">
                  E-mail
                </label>

                <input
                  id="uhmEmail"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="voce@email.com"
                  required
                >

              </div>


              <div class="uhm-field">

                <label for="uhmPhone">
                  Celular
                </label>

                <input
                  id="uhmPhone"
                  name="phone"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel"
                  maxlength="15"
                  placeholder="(00) 00000-0000"
                  required
                >

              </div>


              <label class="uhm-consent">

                <input
                  name="consent"
                  type="checkbox"
                  required
                >

                <span>

                  Aceito receber novidades,
                  ofertas e comunicações da Hitzz.

                </span>

              </label>


              <p
                class="uhm-message"
                aria-live="polite"
              ></p>


              <button
                class="uhm-btn"
                type="submit"
              >
                Revelar meu cupom
              </button>

            </form>

          </div>


          <!-- CUPOM -->

          <div
            class="uhm-view"
            data-view="coupon"
          >

            <div class="uhm-result-icon">
              ✓
            </div>


            <p class="uhm-kicker">
              Prêmio liberado
            </p>


            <h2 class="uhm-title">
              Seu cupom chegou!
            </h2>


            <div class="uhm-discount">
              10% OFF
            </div>


            <p class="uhm-copy">
              Copie o código e use no carrinho.
            </p>


            <div class="uhm-coupon">

              <span
                class="uhm-code"
                data-coupon
              >
                JMHITZZ
              </span>


              <button
                class="uhm-copy-btn"
                type="button"
              >
                Copiar
              </button>

            </div>


            <a
              class="uhm-btn uhm-shop"
              href="/"
            >
              Usar desconto agora
            </a>


            <p class="uhm-rules">

              Cupom de uso único, não cumulativo
              e sujeito às regras da campanha.

            </p>

          </div>


          <!-- PERDEU -->

          <div
            class="uhm-view"
            data-view="lost"
          >

            <div class="uhm-lost-icon">
              ×
            </div>


            <p class="uhm-kicker">
              Fim do desafio
            </p>


            <h2 class="uhm-title">
              Foi por pouco!
            </h2>


            <p class="uhm-lost-copy">

              Dessa vez você não encontrou
              os três pares dentro das sete jogadas.

            </p>


            <a
              class="uhm-btn"
              href="/"
            >
              Continuar comprando
            </a>

          </div>

        </section>

      </div>

    `;

    document.body.appendChild(
      root
    );
  }


  /* =========================================================
     ELEMENTOS
     ========================================================= */

  function cacheElements() {
    overlay =
      document.getElementById(
        "uhmOverlay"
      );

    modal =
      overlay.querySelector(
        ".uhm-modal"
      );

    board =
      overlay.querySelector(
        ".uhm-board"
      );

    startButton =
      overlay.querySelector(
        ".uhm-start"
      );

    statusElement =
      overlay.querySelector(
        ".uhm-status"
      );

    form =
      overlay.querySelector(
        ".uhm-form"
      );

    message =
      overlay.querySelector(
        ".uhm-message"
      );

    phoneInput =
      form.querySelector(
        '[name="phone"]'
      );

    closeButton =
      overlay.querySelector(
        ".uhm-close"
      );
  }


  /* =========================================================
     EVENTOS
     ========================================================= */

  function bindEvents() {
    closeButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        closeModal();
      }
    );


    overlay.addEventListener(
      "click",
      function (event) {
        if (event.target === overlay) {
          closeModal();
        }
      }
    );


    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape" &&
          overlay.classList.contains(
            "uhm-open"
          )
        ) {
          closeModal();
        }
      }
    );


    startButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        beginGame();
      }
    );


    form.addEventListener(
      "submit",
      submitLead
    );


    phoneInput.addEventListener(
      "input",
      maskPhone
    );


    overlay
      .querySelector(
        ".uhm-copy-btn"
      )
      .addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          copyCoupon();
        }
      );
  }


  /* =========================================================
     MODAL
     ========================================================= */

  function openModal() {
    overlay.classList.add(
      "uhm-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );
  }


  function closeModal() {
    overlay.classList.remove(
      "uhm-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  function showView(name) {
    var views =
      overlay.querySelectorAll(
        ".uhm-view"
      );

    Array.prototype.forEach.call(
      views,
      function (view) {
        view.classList.toggle(
          "uhm-active",
          view.getAttribute(
            "data-view"
          ) === name
        );
      }
    );

    modal.scrollTop = 0;
  }


  /* =========================================================
     STORAGE
     ========================================================= */

  function canPlay() {
    try {
      var saved =
        JSON.parse(
          localStorage.getItem(
            CONFIG.storageKey
          ) || "null"
        );

      if (
        !saved ||
        !saved.date
      ) {
        return true;
      }

      var expiration =
        CONFIG.storageDays *
        86400000;

      return (
        Date.now() -
        saved.date
      ) > expiration;

    } catch (error) {
      return true;
    }
  }


  function savePlayed(resultData) {
    try {
      localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify({
          date: Date.now(),
          result: resultData
        })
      );
    } catch (error) {}
  }


  /* =========================================================
     HELPERS
     ========================================================= */

  function wait(ms) {
    return new Promise(
      function (resolve) {
        setTimeout(
          resolve,
          ms
        );
      }
    );
  }


  function shuffle(array) {
    var copy =
      array.slice();

    for (
      var i = copy.length - 1;
      i > 0;
      i -= 1
    ) {
      var j =
        Math.floor(
          Math.random() *
          (i + 1)
        );

      var temp =
        copy[i];

      copy[i] =
        copy[j];

      copy[j] =
        temp;
    }

    return copy;
  }


  function updateScore() {
    overlay
      .querySelector(
        "[data-matches]"
      )
      .textContent =
        matches;

    overlay
      .querySelector(
        "[data-left]"
      )
      .textContent =
        Math.max(
          0,
          CONFIG.maxTurns - turns
        );
  }


  /* =========================================================
     HTML DA CARTA
     ========================================================= */

  function getBackHTML(index) {
    return `

      <div class="uhm-card-back">

        <div class="uhm-back-meta">

          <small>
            Memory
          </small>

          <b>
            ${String(index + 1).padStart(2, "0")}
          </b>

        </div>


        <img
          class="uhm-back-logo"

          src="https://adaptive-images.uooucdn.com.br/tr:w-200,h-55,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/s/bc/cd/11/166f64fab1c8539ed760290a5c.svg"

          alt=""
        >


        <small class="uhm-back-detail">
          Encontre os pares
        </small>

      </div>

    `;
  }


  function getFrontHTML(item) {
    return `

      <div class="uhm-card-front">

        <img
          class="uhm-icon"

          src="${item.image}"

          alt="${item.label}"

          loading="eager"

          decoding="async"
        >


        <span class="uhm-label">
          ${item.label}
        </span>


        <span class="uhm-card-check">
          ✓
        </span>

      </div>

    `;
  }


  /* =========================================================
     CRIA TABULEIRO
     ========================================================= */

  function buildBoard() {
    board.innerHTML = "";

    var cards =
      shuffle(
        SYMBOLS.concat(
          SYMBOLS
        )
      );


    cards.forEach(
      function (item, index) {
        var card =
          document.createElement(
            "div"
          );


        card.className =
          "uhm-card";


        card.setAttribute(
          "data-symbol",
          item.id
        );

        card.setAttribute(
          "data-index",
          String(index)
        );

        card.setAttribute(
          "data-face",
          "back"
        );

        card.setAttribute(
          "data-flipping",
          "0"
        );

        card.setAttribute(
          "data-matched",
          "0"
        );

        card.setAttribute(
          "role",
          "button"
        );

        card.setAttribute(
          "tabindex",
          "0"
        );

        card.setAttribute(
          "aria-label",
          "Carta " +
          (index + 1)
        );


        card._item =
          item;


        var content =
          document.createElement(
            "div"
          );


        content.className =
          "uhm-card-content";


        content.innerHTML =
          getBackHTML(
            index
          );


        card.appendChild(
          content
        );


        card.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            event.stopPropagation();

            flipCard(
              card
            );
          }
        );


        card.addEventListener(
          "keydown",
          function (event) {
            if (
              event.key !== "Enter" &&
              event.key !== " "
            ) {
              return;
            }

            event.preventDefault();

            flipCard(
              card
            );
          }
        );


        board.appendChild(
          card
        );
      }
    );
  }


  /* =========================================================
     ANIMAÇÃO
     ========================================================= */

  async function animateCard(
    card,
    face
  ) {
    if (!card) {
      return;
    }

    if (
      card.getAttribute(
        "data-flipping"
      ) === "1"
    ) {
      return;
    }

    if (
      card.getAttribute(
        "data-face"
      ) === face
    ) {
      return;
    }


    card.setAttribute(
      "data-flipping",
      "1"
    );


    card.classList.add(
      "uhm-turning"
    );


    await wait(
      180
    );


    var content =
      card.querySelector(
        ".uhm-card-content"
      );


    if (face === "front") {
      content.innerHTML =
        getFrontHTML(
          card._item
        );
    } else {
      content.innerHTML =
        getBackHTML(
          Number(
            card.getAttribute(
              "data-index"
            )
          )
        );
    }


    card.setAttribute(
      "data-face",
      face
    );


    /*
      Força repaint/reflow.
    */
    void card.offsetWidth;


    card.classList.remove(
      "uhm-turning"
    );


    await wait(
      180
    );


    card.setAttribute(
      "data-flipping",
      "0"
    );
  }


  /* =========================================================
     COMEÇAR JOGO
     ========================================================= */

  async function beginGame() {
    first = null;
    second = null;

    matches = 0;
    turns = 0;

    locked = true;


    buildBoard();
    updateScore();


    startButton.classList.add(
      "uhm-hidden"
    );


    statusElement.textContent =
      "Memorize as posições...";


    var cards =
      Array.prototype.slice.call(
        board.querySelectorAll(
          ".uhm-card"
        )
      );


    await Promise.all(
      cards.map(
        function (card) {
          return animateCard(
            card,
            "front"
          );
        }
      )
    );


    /*
      Tempo para memorizar.
    */
    await wait(
      1500
    );


    await Promise.all(
      cards.map(
        function (card) {
          return animateCard(
            card,
            "back"
          );
        }
      )
    );


    await wait(
      150
    );


    locked = false;


    statusElement.textContent =
      "Agora encontre os pares!";
  }


  /* =========================================================
     CLIQUE NAS CARTAS
     ========================================================= */

  async function flipCard(card) {
    if (!card) {
      return;
    }

    if (locked) {
      return;
    }

    if (
      card.getAttribute(
        "data-flipping"
      ) === "1"
    ) {
      return;
    }

    if (
      card.getAttribute(
        "data-matched"
      ) === "1"
    ) {
      return;
    }

    if (card === first) {
      return;
    }


    await animateCard(
      card,
      "front"
    );


    /*
      Primeira carta.
    */
    if (!first) {
      first =
        card;

      statusElement.textContent =
        "Escolha mais uma carta.";

      return;
    }


    /*
      Segunda carta.
    */
    second =
      card;

    locked =
      true;

    turns +=
      1;


    updateScore();


    await wait(
      500
    );


    var firstSymbol =
      first.getAttribute(
        "data-symbol"
      );

    var secondSymbol =
      second.getAttribute(
        "data-symbol"
      );


    /* =====================================================
       ACERTO
       ===================================================== */

    if (
      firstSymbol ===
      secondSymbol
    ) {
      first.setAttribute(
        "data-matched",
        "1"
      );

      second.setAttribute(
        "data-matched",
        "1"
      );


      first.classList.add(
        "uhm-matched"
      );

      second.classList.add(
        "uhm-matched"
      );


      first
        .querySelector(
          ".uhm-card-content"
        )
        .innerHTML =
          getFrontHTML(
            first._item
          );


      second
        .querySelector(
          ".uhm-card-content"
        )
        .innerHTML =
          getFrontHTML(
            second._item
          );


      matches +=
        1;


      statusElement.textContent =
        "Boa! Você encontrou um par.";


    /* =====================================================
       ERRO
       ===================================================== */

    } else {
      statusElement.textContent =
        "Não combinou. Tente lembrar das posições.";


      await wait(
        350
      );


      await Promise.all([
        animateCard(
          first,
          "back"
        ),

        animateCard(
          second,
          "back"
        )
      ]);
    }


    first = null;
    second = null;


    updateScore();


    /*
      Ganhou.
    */
    if (matches === 3) {
      finishGame(
        true
      );

      return;
    }


    /*
      Perdeu.
    */
    if (
      turns >=
      CONFIG.maxTurns
    ) {
      finishGame(
        false
      );

      return;
    }


    locked = false;
  }


  /* =========================================================
     FIM
     ========================================================= */

  async function finishGame(won) {
    locked = true;

    await wait(
      500
    );


    if (won) {
      result = {
        won: true,
        discount: 10,
        coupon: CONFIG.coupon
      };


      showView(
        "form"
      );

      return;
    }


    /*
      Perdeu = sem cupom.
    */
    result = {
      won: false,
      discount: 0,
      coupon: null
    };


    savePlayed(
      result
    );


    showView(
      "lost"
    );
  }


  /* =========================================================
     TELEFONE
     ========================================================= */

  function onlyDigits(value) {
    return String(
      value || ""
    ).replace(
      /\D/g,
      ""
    );
  }


  function formatPhone(value) {
    var number =
      onlyDigits(
        value
      ).slice(
        0,
        11
      );


    if (
      number.length <= 2
    ) {
      return number
        ? "(" + number
        : "";
    }


    if (
      number.length <= 6
    ) {
      return (
        "(" +
        number.slice(0, 2) +
        ") " +
        number.slice(2)
      );
    }


    if (
      number.length <= 10
    ) {
      return (
        "(" +
        number.slice(0, 2) +
        ") " +
        number.slice(2, 6) +
        "-" +
        number.slice(6)
      );
    }


    return (
      "(" +
      number.slice(0, 2) +
      ") " +
      number.slice(2, 7) +
      "-" +
      number.slice(7)
    );
  }


  function maskPhone(event) {
    var value =
      onlyDigits(
        event.target.value
      ).slice(
        0,
        11
      );


    event.target.value =
      formatPhone(
        value
      );
  }


  /*
    Exatamente o mesmo padrão utilizado
    no código que já funcionou.
  */
  function formatEdronePhone(value) {
    var number =
      onlyDigits(
        value
      );


    if (
      number.indexOf("55") === 0 &&
      (
        number.length === 12 ||
        number.length === 13
      )
    ) {
      return "+" + number;
    }


    return (
      "+55" +
      number
    );
  }


  /* =========================================================
     PAYLOAD EDRONE

     Mesmo padrão do código funcional:
     email
     first_name
     phone
     subscriber_status
     customer_tags
     action_type
     ========================================================= */

  function createEdronePayload(
    name,
    email,
    phone
  ) {
    return {
      email:
        String(
          email || ""
        )
        .trim()
        .toLowerCase(),

      first_name:
        String(
          name || ""
        )
        .trim(),

      phone:
        formatEdronePhone(
          phone
        ),

      subscriber_status:
        "1",

      /*
        A tag é enviada diretamente aqui.

        Não existe nenhuma API separada
        para criar a tag.
      */
      customer_tags:
        CONFIG.edroneTag,

      action_type:
        "subscribe"
    };
  }


  /* =========================================================
     WAIT EDRONE

     Igual ao código que funcionou.
     ========================================================= */

  function waitForEdrone() {
    return new Promise(
      function (
        resolve,
        reject
      ) {
        var started =
          Date.now();


        function verify() {
          if (
            window._edrone &&
            typeof window._edrone.init ===
              "function"
          ) {
            resolve();

            return;
          }


          if (
            Date.now() -
            started >=
            CONFIG.edroneTimeout
          ) {
            reject(
              new Error(
                "window._edrone.init não encontrada."
              )
            );

            return;
          }


          setTimeout(
            verify,
            250
          );
        }


        verify();
      }
    );
  }


  /* =========================================================
     ENVIA PARA EDRONE

     Exatamente no padrão do código enviado.
     ========================================================= */

  function sendToEdrone(
    name,
    email,
    phone
  ) {
    return waitForEdrone()
      .then(function () {
        var payload =
          createEdronePayload(
            name,
            email,
            phone
          );


        window._edrone.email =
          payload.email;


        window._edrone.first_name =
          payload.first_name;


        window._edrone.phone =
          payload.phone;


        window._edrone.subscriber_status =
          payload.subscriber_status;


        window._edrone.customer_tags =
          payload.customer_tags;


        window._edrone.action_type =
          payload.action_type;


        window._edrone.init();


        console.info(
          "[eTraction Hitzz Memory] Evento enviado:",
          payload
        );


        return payload;
      });
  }


  /* =========================================================
     SUBMIT DO FORMULÁRIO
     ========================================================= */

  function submitLead(event) {
    event.preventDefault();


    message.textContent =
      "";


    if (
      !form.checkValidity()
    ) {
      message.textContent =
        "Preencha todos os campos corretamente.";


      form.reportValidity();


      return;
    }


    var button =
      form.querySelector(
        '[type="submit"]'
      );


    button.disabled =
      true;


    button.textContent =
      "Enviando...";


    var data =
      new FormData(
        form
      );


    var name =
      String(
        data.get("name") || ""
      ).trim();


    var email =
      String(
        data.get("email") || ""
      )
      .trim()
      .toLowerCase();


    var phone =
      onlyDigits(
        data.get("phone") || ""
      );


    /* =====================================================
       VALIDAÇÕES EXTRAS
       ===================================================== */

    if (
      name.length < 2
    ) {
      message.textContent =
        "Digite seu nome.";

      button.disabled =
        false;

      button.textContent =
        "Revelar meu cupom";

      return;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        email
      )
    ) {
      message.textContent =
        "Digite um e-mail válido.";

      button.disabled =
        false;

      button.textContent =
        "Revelar meu cupom";

      return;
    }


    if (
      phone.length < 10
    ) {
      message.textContent =
        "Digite um celular com DDD.";

      button.disabled =
        false;

      button.textContent =
        "Revelar meu cupom";

      return;
    }


    /*
      Aqui acontece exatamente o mesmo
      fluxo do código enviado:
      espera edrone -> popula _edrone ->
      action_type subscribe -> init().
    */

    sendToEdrone(
      name,
      email,
      phone
    )
      .then(
        function (
          edronePayload
        ) {

          /* =================================================
             SALVA TENTATIVA
             ================================================= */

          savePlayed(
            result
          );


          /* =================================================
             DATALAYER
             ================================================= */

          window.dataLayer =
            window.dataLayer || [];


          window.dataLayer.push({
            event:
              "usehitzz_memory_lead",

            email:
              email,

            phone:
              phone,

            tag:
              CONFIG.edroneTag,

            discount:
              10,

            coupon:
              CONFIG.coupon,

            edronePayload:
              edronePayload
          });


          /* =================================================
             EXIBE CUPOM
             ================================================= */

          overlay
            .querySelector(
              "[data-coupon]"
            )
            .textContent =
              CONFIG.coupon;


          overlay
            .querySelector(
              ".uhm-shop"
            )
            .href =
              CONFIG.shopUrl;


          showView(
            "coupon"
          );


          button.disabled =
            false;


          button.textContent =
            "Revelar meu cupom";

        }
      )
      .catch(
        function (error) {

          button.disabled =
            false;


          button.textContent =
            "Revelar meu cupom";


          message.textContent =
            "Não foi possível concluir agora. Tente novamente em instantes.";


          console.warn(
            "[eTraction Hitzz Memory]",
            error
          );

        }
      );
  }


  /* =========================================================
     COPIAR CUPOM
     ========================================================= */

  function copyCoupon() {
    copyText(
      CONFIG.coupon
    )
      .then(function () {
        var button =
          overlay.querySelector(
            ".uhm-copy-btn"
          );


        button.textContent =
          "Copiado!";


        setTimeout(
          function () {
            button.textContent =
              "Copiar";
          },
          1800
        );
      })
      .catch(function () {
        var button =
          overlay.querySelector(
            ".uhm-copy-btn"
          );


        button.textContent =
          CONFIG.coupon;


        setTimeout(
          function () {
            button.textContent =
              "Copiar";
          },
          1800
        );
      });
  }


  /*
    Mesmo sistema de fallback
    utilizado no código funcional.
  */
  function copyText(text) {
    var value =
      String(
        text || ""
      );


    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText ===
        "function" &&
      window.isSecureContext
    ) {
      return navigator.clipboard
        .writeText(
          value
        )
        .catch(function () {
          return copyTextFallback(
            value
          );
        });
    }


    return copyTextFallback(
      value
    );
  }


  function copyTextFallback(text) {
    return new Promise(
      function (
        resolve,
        reject
      ) {
        var textarea =
          document.createElement(
            "textarea"
          );


        var activeElement =
          document.activeElement;


        textarea.value =
          text;


        textarea.setAttribute(
          "readonly",
          ""
        );


        textarea.setAttribute(
          "aria-hidden",
          "true"
        );


        textarea.style.position =
          "fixed";


        textarea.style.top =
          "-9999px";


        textarea.style.left =
          "-9999px";


        textarea.style.width =
          "1px";


        textarea.style.height =
          "1px";


        textarea.style.padding =
          "0";


        textarea.style.border =
          "0";


        textarea.style.opacity =
          "0";


        document.body.appendChild(
          textarea
        );


        textarea.focus();


        textarea.select();


        textarea.setSelectionRange(
          0,
          textarea.value.length
        );


        try {
          var copied =
            document.execCommand(
              "copy"
            );


          textarea.remove();


          if (
            activeElement &&
            typeof activeElement.focus ===
              "function"
          ) {
            activeElement.focus();
          }


          if (copied) {
            resolve();
          } else {
            reject(
              new Error(
                "Não foi possível copiar."
              )
            );
          }

        } catch (error) {
          textarea.remove();


          if (
            activeElement &&
            typeof activeElement.focus ===
              "function"
          ) {
            activeElement.focus();
          }


          reject(
            error
          );
        }
      }
    );
  }


  /* =========================================================
     API PARA TESTES
     ========================================================= */

  window.UseHitzzMemory = {
    open:
      openModal,

    close:
      closeModal,

    start:
      beginGame,

    config:
      CONFIG,

    reset:
      function () {
        try {
          localStorage.removeItem(
            CONFIG.storageKey
          );
        } catch (error) {}


        first =
          null;

        second =
          null;

        locked =
          true;

        matches =
          0;

        turns =
          0;

        result =
          null;


        startButton.classList.remove(
          "uhm-hidden"
        );


        buildBoard();

        updateScore();


        statusElement.textContent =
          "Clique em começar para ver as cartas.";


        showView(
          "game"
        );


        openModal();
      },

    /*
      Permite testar somente a edrone
      pelo console se necessário.

      Exemplo:
      UseHitzzMemory.testEdrone(
        "Teste Hitzz",
        "teste@email.com",
        "47999999999"
      )
    */
    testEdrone:
      function (
        name,
        email,
        phone
      ) {
        return sendToEdrone(
          name,
          email,
          phone
        );
      }
  };

})();