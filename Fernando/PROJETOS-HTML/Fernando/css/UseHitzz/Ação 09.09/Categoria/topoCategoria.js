(function () {
  "use strict";

  /* =========================================================
     HITZZ - MAXIMALIA 09.09
     FULL WIDTH
     DESKTOP 350PX
  ========================================================= */

  var ID = "etraction-maximalia-0909";
  var STYLE_ID = "etraction-maximalia-0909-style";

  var CUPOM = "0909";

  var IMG_DESKTOP =
    "https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/usehitzz/chatgpt-image-3-de-set.png";

  var IMG_MOBILE =
    "https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/usehitzz/ChatGPT%20Image%203%20de%20set.%20de%202026,%2010_39_33%20(2).png";

  var observer = null;
  var observerFrame = null;


  /* =========================================================
     VALIDAÇÃO
  ========================================================= */

  function paginaValida() {

    try {

      var params =
        new URLSearchParams(
          window.location.search
        );

      var busca =
        (params.get("q") || "")
          .trim()
          .toLowerCase();


      return (
        window.location.pathname.indexOf("/search") !== -1 &&
        busca === "maximalia"
      );

    } catch (erro) {

      return false;

    }

  }


  if (!paginaValida()) {
    return;
  }


  /* =========================================================
     CSS
  ========================================================= */

  function adicionarEstilo() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }


    var style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

            #${ID},
            #${ID} * {
                box-sizing: border-box !important;
            }


            /* =====================================================
               FULL WIDTH
            ===================================================== */

            #${ID} {
                position: relative;

                left: 50%;

                width: 100vw;
                max-width: none;

                margin-left: -50vw;
                margin-right: -50vw;
                margin-bottom: 18px;

                background: #080808;
                color: #ffffff;

                font-family: inherit;

                overflow: hidden;
            }


            /* =====================================================
               CONTAINER
            ===================================================== */

            #${ID} .etraction-maximalia-inner {
                width: 100%;
                max-width: 1240px;

                margin: 0 auto;
            }


            /* =====================================================
               DESKTOP
            ===================================================== */

            #${ID} .etraction-maximalia-desktop {
                width: 100%;
                height: 350px;

                display: grid;

                grid-template-columns:
                    minmax(0, 42%)
                    minmax(0, 38%)
                    minmax(200px, 20%);

                align-items: stretch;
            }


            /* =====================================================
               IMAGEM DESKTOP
            ===================================================== */

            #${ID} .etraction-maximalia-image {
                position: relative;

                min-width: 0;
                height: 350px;

                overflow: hidden;
            }


            #${ID} .etraction-maximalia-image img {
                width: 100%;
                height: 100%;

                display: block;

                object-fit: cover;
                object-position: center center;
            }


            #${ID} .etraction-maximalia-image::after {
                content: "";

                position: absolute;
                inset: 0;

                background:
                    linear-gradient(
                        90deg,
                        rgba(8,8,8,0) 50%,
                        rgba(8,8,8,.10) 67%,
                        rgba(8,8,8,.55) 87%,
                        #080808 100%
                    );

                pointer-events: none;
            }


            /* =====================================================
               CONTEÚDO CENTRAL
            ===================================================== */

            #${ID} .etraction-maximalia-content {
                min-width: 0;

                padding:
                    44px
                    32px
                    40px
                    22px;

                display: flex;
                flex-direction: column;
                justify-content: center;
            }


            /* =====================================================
               HEADLINE
            ===================================================== */

            #${ID} .etraction-maximalia-headline {
                display: flex;
                align-items: center;

                gap: 12px;

                margin: 0 0 14px;
            }


            #${ID} .etraction-maximalia-off {
                margin: 0;

                color: #ffffff;

                font-family:
                    Georgia,
                    "Times New Roman",
                    serif;

                font-size: 66px;
                font-weight: 700;

                line-height: .88;

                letter-spacing: -2.6px;

                white-space: nowrap;
            }


            #${ID} .etraction-maximalia-pix {
                margin: 5px 0 0;
                padding: 0;

                display: flex;
                flex-direction: column;
                justify-content: center;

                color: #ffffff;

                font-size: 12px;
                font-weight: 500;

                line-height: 1.05;

                text-transform: uppercase;
                text-align: left;

                white-space: nowrap;
            }


            /* =====================================================
               MECÂNICA
            ===================================================== */

            #${ID} .etraction-maximalia-mechanics {
                margin: 0 0 18px;

                color: rgba(255,255,255,.76);

                font-size: 16px;
                font-weight: 400;

                line-height: 1.3;

                white-space: nowrap;
            }


            #${ID} .etraction-maximalia-mechanics strong {
                color: #ffffff;

                font-weight: 600;
            }


            /* =====================================================
               LINHA
            ===================================================== */

            #${ID} .etraction-maximalia-line {
                width: 100%;
                max-width: 430px;
                height: 1px;

                margin-bottom: 14px;

                background:
                    rgba(255,255,255,.17);
            }


            /* =====================================================
               INFORMAÇÕES
            ===================================================== */

            #${ID} .etraction-maximalia-info {
                display: flex;
                align-items: center;

                gap: 11px;

                color:
                    rgba(255,255,255,.65);

                font-size: 11px;
                font-weight: 400;

                white-space: nowrap;
            }


            #${ID} .etraction-maximalia-info-item {
                display: inline-flex;
                align-items: center;

                gap: 6px;
            }


            #${ID} .etraction-maximalia-info svg {
                width: 15px;
                height: 15px;

                display: block;

                fill: none;
                stroke: currentColor;

                stroke-width: 1.6;
                stroke-linecap: round;
                stroke-linejoin: round;
            }


            #${ID} .etraction-maximalia-dot {
                width: 3px;
                height: 3px;

                flex: 0 0 3px;

                border-radius: 50%;

                background:
                    rgba(255,255,255,.58);
            }


            /* =====================================================
               LATERAL DIREITA
            ===================================================== */

            #${ID} .etraction-maximalia-right {
                position: relative;

                padding:
                    54px
                    24px;

                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: center;

                gap: 18px;
            }


            #${ID} .etraction-maximalia-right::before {
                content: "";

                position: absolute;

                left: 0;
                top: 58px;
                bottom: 58px;

                width: 1px;

                background:
                    rgba(255,255,255,.34);
            }


            /* =====================================================
               CUPOM
            ===================================================== */

            #${ID} .etraction-maximalia-coupon {
                width: 100%;
                height: 46px;

                padding: 0 14px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 8px;

                background: transparent;
                color: #ffffff;

                border:
                    1px dashed
                    rgba(255,255,255,.62);

                border-radius: 4px;

                outline: none;

                font-family: inherit;

                font-size: 11px;
                font-weight: 600;

                line-height: 1;

                letter-spacing: .3px;

                cursor: pointer;

                transition:
                    background .15s ease,
                    border-color .15s ease;
            }


            #${ID} .etraction-maximalia-coupon:hover {
                background:
                    rgba(255,255,255,.06);

                border-color:
                    rgba(255,255,255,.95);
            }


            #${ID} .etraction-maximalia-coupon svg {
                width: 15px;
                height: 15px;

                flex: 0 0 15px;

                fill: none;
                stroke: currentColor;

                stroke-width: 1.7;
                stroke-linecap: round;
                stroke-linejoin: round;
            }


            /* =====================================================
               RASPADINHA
            ===================================================== */

            #${ID} .etraction-maximalia-scratch {
                width: 100%;

                padding-top: 16px;

                border-top:
                    1px solid
                    rgba(255,255,255,.15);

                text-align: center;
            }


            #${ID} .etraction-maximalia-scratch-title {
                display: block;

                margin-bottom: 6px;

                color: #ffffff;

                font-size: 11px;
                font-weight: 700;

                line-height: 1.2;

                letter-spacing: .5px;

                text-transform: uppercase;
            }


            #${ID} .etraction-maximalia-scratch-text {
                display: block;

                color:
                    rgba(255,255,255,.58);

                font-size: 10px;
                font-weight: 400;

                line-height: 1.3;
            }


            /* =====================================================
               MOBILE
            ===================================================== */

            #${ID} .etraction-maximalia-mobile {
                display: none;
            }


            @media (max-width: 768px) {

                #${ID} {
                    left: 50%;

                    width: 100vw;

                    margin-left: -50vw;
                    margin-right: -50vw;
                    margin-bottom: 12px;
                }


                #${ID} .etraction-maximalia-inner {
                    width: 100%;
                    max-width: none;
                }


                #${ID} .etraction-maximalia-desktop {
                    display: none;
                }


                #${ID} .etraction-maximalia-mobile {
                    display: block;
                }


                /* ===============================================
                   IMAGEM MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-image {
                    position: relative;

                    width: 100%;
                    height: 155px;

                    overflow: hidden;
                }


                #${ID} .etraction-maximalia-mobile-image img {
                    width: 100%;
                    height: 100%;

                    display: block;

                    object-fit: cover;
                    object-position: center 70%;
                }


                #${ID} .etraction-maximalia-mobile-image::after {
                    content: "";

                    position: absolute;
                    inset: 0;

                    background:
                        linear-gradient(
                            180deg,
                            rgba(8,8,8,0) 60%,
                            rgba(8,8,8,.18) 79%,
                            #080808 100%
                        );

                    pointer-events: none;
                }


                /* ===============================================
                   CONTEÚDO MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-content {
                    padding:
                        2px
                        16px
                        13px;

                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    text-align: center;
                }


                #${ID} .etraction-maximalia-mobile-headline {
                    width: 100%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 6px;

                    margin-bottom: 7px;
                }


                #${ID} .etraction-maximalia-mobile-off {
                    color: #ffffff;

                    font-family:
                        Georgia,
                        "Times New Roman",
                        serif;

                    font-size: 36px;
                    font-weight: 700;

                    line-height: .9;

                    letter-spacing: -1.5px;
                }


                #${ID} .etraction-maximalia-mobile-pix {
                    padding: 0;
                    margin: 3px 0 0;

                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    color: #ffffff;

                    font-size: 8px;
                    font-weight: 500;

                    line-height: 1.05;

                    text-align: left;
                    text-transform: uppercase;
                }


                /* ===============================================
                   MECÂNICA MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-mechanics {
                    width: 100%;

                    margin-bottom: 9px;

                    color:
                        rgba(255,255,255,.72);

                    font-size: 10px;
                    font-weight: 400;

                    line-height: 1.2;

                    text-align: center;
                }


                #${ID} .etraction-maximalia-mobile-mechanics strong {
                    color: #ffffff;

                    font-weight: 600;
                }


                /* ===============================================
                   LINHA MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-line {
                    width: 100%;
                    max-width: 330px;
                    height: 1px;

                    margin:
                        0 auto 8px;

                    background:
                        rgba(255,255,255,.16);
                }


                /* ===============================================
                   INFO MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-info {
                    width: 100%;

                    margin-bottom: 10px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 7px;

                    color:
                        rgba(255,255,255,.62);

                    font-size: 8px;

                    white-space: nowrap;
                }


                #${ID} .etraction-maximalia-mobile-info-item {
                    display: inline-flex;
                    align-items: center;

                    gap: 4px;
                }


                #${ID} .etraction-maximalia-mobile-info svg {
                    width: 11px;
                    height: 11px;

                    fill: none;
                    stroke: currentColor;

                    stroke-width: 1.6;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }


                #${ID} .etraction-maximalia-mobile-dot {
                    width: 2px;
                    height: 2px;

                    flex: 0 0 2px;

                    background:
                        rgba(255,255,255,.55);

                    border-radius: 50%;
                }


                /* ===============================================
                   CUPOM MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-coupon {
                    width: 100%;
                    max-width: 340px;
                    height: 34px;

                    margin:
                        0 auto 10px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 7px;

                    background: transparent;
                    color: #ffffff;

                    border:
                        1px dashed
                        rgba(255,255,255,.55);

                    border-radius: 3px;

                    outline: none;

                    font-family: inherit;

                    font-size: 9px;
                    font-weight: 600;

                    cursor: pointer;
                }


                #${ID} .etraction-maximalia-mobile-coupon svg {
                    width: 12px;
                    height: 12px;

                    flex: 0 0 12px;

                    fill: none;
                    stroke: currentColor;

                    stroke-width: 1.7;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }


                /* ===============================================
                   RASPADINHA MOBILE
                =============================================== */

                #${ID} .etraction-maximalia-mobile-scratch {
                    width: 100%;
                    max-width: 340px;

                    padding-top: 9px;

                    border-top:
                        1px solid
                        rgba(255,255,255,.14);

                    text-align: center;
                }


                #${ID} .etraction-maximalia-mobile-scratch-title {
                    display: block;

                    margin-bottom: 3px;

                    color: #ffffff;

                    font-size: 9px;
                    font-weight: 700;

                    line-height: 1.2;

                    letter-spacing: .4px;

                    text-transform: uppercase;
                }


                #${ID} .etraction-maximalia-mobile-scratch-text {
                    display: block;

                    color:
                        rgba(255,255,255,.56);

                    font-size: 8px;
                    font-weight: 400;
                }

            }


            /* =====================================================
               MOBILE PEQUENO
            ===================================================== */

            @media (max-width: 420px) {

                #${ID} .etraction-maximalia-mobile-image {
                    height: 145px;
                }


                #${ID} .etraction-maximalia-mobile-off {
                    font-size: 33px;
                }


                #${ID} .etraction-maximalia-mobile-content {
                    padding:
                        2px
                        12px
                        11px;
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

  function criarBloco() {

    var section =
      document.createElement(
        "section"
      );


    section.id =
      ID;


    section.innerHTML = `

            <div class="etraction-maximalia-inner">


                <!-- =========================================
                     DESKTOP
                ========================================== -->

                <div class="etraction-maximalia-desktop">


                    <div class="etraction-maximalia-image">

                        <img
                            src="${IMG_DESKTOP}"
                            alt="Produtos selecionados Maximalia"
                            loading="eager"
                        >

                    </div>


                    <div class="etraction-maximalia-content">


                        <div class="etraction-maximalia-headline">

                            <h2 class="etraction-maximalia-off">
                                17% OFF
                            </h2>


                            <span class="etraction-maximalia-pix">
                                AÇÃO<br>
                                NO PIX
                            </span>

                        </div>


                        <p class="etraction-maximalia-mechanics">

                            <strong>
                                7% no cupom ${CUPOM}
                            </strong>

                            +

                            <strong>
                                10% no Pix
                            </strong>

                        </p>


                        <div class="etraction-maximalia-line"></div>


                        <div class="etraction-maximalia-info">


                            <span class="etraction-maximalia-info-item">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    ></rect>

                                    <path
                                        d="M16 3v4M8 3v4M3 10h18"
                                    ></path>
                                </svg>

                                09/09

                            </span>


                            <span class="etraction-maximalia-dot"></span>


                            <span class="etraction-maximalia-info-item">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    ></circle>

                                    <path
                                        d="M12 7v5l3 2"
                                    ></path>
                                </svg>

                                24 horas de ação

                            </span>


                            <span class="etraction-maximalia-dot"></span>


                            <span>
                                quarta-feira
                            </span>


                        </div>


                    </div>


                    <div class="etraction-maximalia-right">


                        <button
                            type="button"
                            class="etraction-maximalia-coupon"
                            data-etraction-coupon="${CUPOM}"
                        >

                            <span class="etraction-maximalia-coupon-text">
                                COPIAR CUPOM ${CUPOM}
                            </span>


                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <rect
                                    x="8"
                                    y="8"
                                    width="11"
                                    height="11"
                                    rx="2"
                                ></rect>

                                <path
                                    d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                                ></path>
                            </svg>

                        </button>


                        <div class="etraction-maximalia-scratch">

                            <strong class="etraction-maximalia-scratch-title">
                                Compre e ganhe uma raspadinha
                            </strong>

                            <span class="etraction-maximalia-scratch-text">
                                Você pode até ganhar um Hitzz
                            </span>

                        </div>


                    </div>


                </div>


                <!-- =========================================
                     MOBILE
                ========================================== -->

                <div class="etraction-maximalia-mobile">


                    <div class="etraction-maximalia-mobile-image">

                        <img
                            src="${IMG_MOBILE}"
                            alt="Produtos selecionados Maximalia"
                            loading="eager"
                        >

                    </div>


                    <div class="etraction-maximalia-mobile-content">


                        <div class="etraction-maximalia-mobile-headline">

                            <strong class="etraction-maximalia-mobile-off">
                                17% OFF
                            </strong>


                            <span class="etraction-maximalia-mobile-pix">
                                AÇÃO<br>
                                NO PIX
                            </span>

                        </div>


                        <div class="etraction-maximalia-mobile-mechanics">

                            <strong>
                                7% no cupom ${CUPOM}
                            </strong>

                            +

                            <strong>
                                10% no Pix
                            </strong>

                        </div>


                        <div class="etraction-maximalia-mobile-line"></div>


                        <div class="etraction-maximalia-mobile-info">


                            <span class="etraction-maximalia-mobile-info-item">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    ></rect>

                                    <path
                                        d="M16 3v4M8 3v4M3 10h18"
                                    ></path>
                                </svg>

                                09/09

                            </span>


                            <span class="etraction-maximalia-mobile-dot"></span>


                            <span class="etraction-maximalia-mobile-info-item">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    ></circle>

                                    <path
                                        d="M12 7v5l3 2"
                                    ></path>
                                </svg>

                                24 horas

                            </span>


                            <span class="etraction-maximalia-mobile-dot"></span>


                            <span>
                                quarta-feira
                            </span>


                        </div>


                        <button
                            type="button"
                            class="etraction-maximalia-mobile-coupon"
                            data-etraction-coupon="${CUPOM}"
                        >

                            <span class="etraction-maximalia-coupon-text">
                                COPIAR CUPOM ${CUPOM}
                            </span>


                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <rect
                                    x="8"
                                    y="8"
                                    width="11"
                                    height="11"
                                    rx="2"
                                ></rect>

                                <path
                                    d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                                ></path>
                            </svg>

                        </button>


                        <div class="etraction-maximalia-mobile-scratch">

                            <strong class="etraction-maximalia-mobile-scratch-title">
                                Compre e ganhe uma raspadinha
                            </strong>

                            <span class="etraction-maximalia-mobile-scratch-text">
                                Você pode até ganhar um Hitzz
                            </span>

                        </div>


                    </div>


                </div>


            </div>

        `;


    return section;

  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function encontrarFiltro() {

    return document.querySelector(
      ".products-filter"
    );

  }


  function posicionarBloco() {

    var filtro =
      encontrarFiltro();


    if (!filtro) {
      return false;
    }


    var bloco =
      document.getElementById(
        ID
      );


    if (!bloco) {

      adicionarEstilo();


      bloco =
        criarBloco();


      filtro.parentNode.insertBefore(
        bloco,
        filtro
      );


      adicionarEventos(
        bloco
      );


      return true;

    }


    if (
      bloco.parentNode !== filtro.parentNode ||
      bloco.nextElementSibling !== filtro
    ) {

      filtro.parentNode.insertBefore(
        bloco,
        filtro
      );

    }


    return true;

  }


  /* =========================================================
     COPIAR CUPOM - FALLBACK
  ========================================================= */

  function copiarFallback(texto) {

    var textarea =
      document.createElement(
        "textarea"
      );


    textarea.value =
      texto;


    textarea.setAttribute(
      "readonly",
      ""
    );


    textarea.style.position =
      "fixed";

    textarea.style.left =
      "-9999px";

    textarea.style.top =
      "0";

    textarea.style.opacity =
      "0";


    document.body.appendChild(
      textarea
    );


    textarea.focus();

    textarea.select();


    try {

      document.execCommand(
        "copy"
      );

    } catch (erro) { }


    textarea.remove();

  }


  /* =========================================================
     COPIAR CUPOM
  ========================================================= */

  function copiarCupom(botao) {

    var cupom =
      botao.getAttribute(
        "data-etraction-coupon"
      ) || CUPOM;


    var label =
      botao.querySelector(
        ".etraction-maximalia-coupon-text"
      );


    function sucesso() {

      if (!label) {
        return;
      }


      label.textContent =
        "CUPOM COPIADO";


      clearTimeout(
        botao._etractionTimer
      );


      botao._etractionTimer =
        setTimeout(
          function () {

            label.textContent =
              "COPIAR CUPOM " +
              cupom;

          },
          1600
        );

    }


    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {

      navigator.clipboard
        .writeText(
          cupom
        )
        .then(
          sucesso
        )
        .catch(
          function () {

            copiarFallback(
              cupom
            );

            sucesso();

          }
        );

      return;

    }


    copiarFallback(
      cupom
    );


    sucesso();

  }


  /* =========================================================
     EVENTOS
  ========================================================= */

  function adicionarEventos(bloco) {

    if (
      !bloco ||
      bloco.getAttribute(
        "data-etraction-bound"
      ) === "1"
    ) {
      return;
    }


    bloco.setAttribute(
      "data-etraction-bound",
      "1"
    );


    var botoes =
      bloco.querySelectorAll(
        "[data-etraction-coupon]"
      );


    botoes.forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function (event) {

            event.preventDefault();


            copiarCupom(
              botao
            );

          }
        );

      }
    );

  }


  /* =========================================================
     OBSERVER
  ========================================================= */

  function iniciarObserver() {

    if (
      observer ||
      !window.MutationObserver ||
      !document.body
    ) {
      return;
    }


    observer =
      new MutationObserver(
        function () {

          if (observerFrame) {
            return;
          }


          observerFrame =
            requestAnimationFrame(
              function () {

                observerFrame =
                  null;


                posicionarBloco();

              }
            );

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
     START
  ========================================================= */

  var tentativas = 0;


  var timerInicial =
    setInterval(
      function () {

        tentativas++;


        if (
          posicionarBloco()
        ) {

          clearInterval(
            timerInicial
          );


          iniciarObserver();


          return;

        }


        if (
          tentativas >= 40
        ) {

          clearInterval(
            timerInicial
          );

        }

      },
      200
    );

})();