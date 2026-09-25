(function () {
    "use strict";

    var ID = "etraction-hitzz-pdp-cliente";
    var STYLE_ID = "etraction-hitzz-pdp-cliente-style";
    var TIMER_CLASS = "etraction-hitzz-pdp-cliente__timer";

    /* =========================================================
       CONFIGURAÇÃO
    ========================================================= */

    var FIM_PROMOCAO = new Date(
        2026,
        8, // Setembro
        15,
        23,
        59,
        59,
        999
    );

    /* =========================================================
       PROMOÇÃO ATIVA
    ========================================================= */

    function promocaoAtiva() {
        return new Date().getTime() <= FIM_PROMOCAO.getTime();
    }

    /* =========================================================
       ESTILO
    ========================================================= */

    function adicionarEstilo() {

        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var style = document.createElement("style");

        style.id = STYLE_ID;

        style.textContent = `

            #${ID},
            #${ID} * {
                box-sizing: border-box !important;
            }

            #${ID} {
                position: relative;

                width: 100%;

                display: flex;
                align-items: center;
                justify-content: space-between;

                gap: 15px;

                margin: 7px 0 17px 0;
                padding: 13px 14px;

                background: #ffffff;

                border: 1px solid #e8e8e8;
                border-left: 3px solid #c91f28;

                border-radius: 7px;

                color: #161616;

                font-family: inherit;

                box-shadow:
                    0 3px 12px
                    rgba(0, 0, 0, 0.035);

                overflow: hidden;
            }

            /* =====================================================
               CONTEÚDO
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__content {

                flex: 1;
                min-width: 0;

                display: flex;
                align-items: center;

                gap: 11px;
            }

            /* =====================================================
               ÍCONE
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__icon {

                flex: 0 0 auto;

                width: 35px;
                height: 35px;

                display: flex;
                align-items: center;
                justify-content: center;

                border-radius: 50%;

                background: #fff1f1;

                color: #c91f28;

                font-size: 16px;

                border: 1px solid #f3d2d4;
            }

            /* =====================================================
               COPY
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__copy {
                min-width: 0;
            }

            #${ID}
            .etraction-hitzz-pdp-cliente__top {

                display: flex;
                align-items: center;
                flex-wrap: wrap;

                gap: 7px;

                margin-bottom: 4px;
            }

            /* =====================================================
               TAG
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__badge {

                display: inline-flex;
                align-items: center;
                justify-content: center;

                height: 20px;

                padding: 0 8px;

                border-radius: 3px;

                background: #c91f28;
                color: #ffffff;

                font-size: 8px;
                font-weight: 800;

                line-height: 1;

                letter-spacing: .7px;

                text-transform: uppercase;

                white-space: nowrap;
            }

            #${ID}
            .etraction-hitzz-pdp-cliente__label {

                color: #999999;

                font-size: 8px;
                font-weight: 700;

                letter-spacing: .55px;

                text-transform: uppercase;
            }

            /* =====================================================
               TÍTULO
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__title {

                display: block;

                color: #191919;

                font-size: 12.5px;
                font-weight: 700;

                line-height: 1.35;
            }

            #${ID}
            .etraction-hitzz-pdp-cliente__title strong {

                color: #c91f28;

                font-weight: 800;
            }

            /* =====================================================
               SUBTÍTULO
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__subtitle {

                display: block;

                margin-top: 2px;

                color: #717171;

                font-size: 10px;
                font-weight: 500;

                line-height: 1.35;
            }

            #${ID}
            .etraction-hitzz-pdp-cliente__subtitle strong {

                color: #333333;

                font-weight: 700;
            }

            /* =====================================================
               TIMER
            ===================================================== */

            #${ID}
            .etraction-hitzz-pdp-cliente__time {

                flex: 0 0 auto;

                min-width: 105px;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                padding: 8px 11px;

                background: #fff8f8;

                border: 1px solid #f2dddd;

                border-radius: 5px;
            }

            #${ID}
            .etraction-hitzz-pdp-cliente__time-label {

                display: block;

                margin-bottom: 4px;

                color: #9b6e70;

                font-size: 7px;
                font-weight: 700;

                line-height: 1;

                letter-spacing: .55px;

                text-transform: uppercase;
            }

            #${ID}
            .${TIMER_CLASS} {

                display: block;

                color: #c91f28;

                font-size: 14px;
                font-weight: 800;

                line-height: 1;

                letter-spacing: .1px;

                font-variant-numeric: tabular-nums;
            }

            /* =====================================================
               MOBILE
            ===================================================== */

            @media (max-width: 767px) {

                #${ID} {

                    gap: 9px;

                    margin: 6px 0 14px 0;

                    padding: 11px;

                    border-left-width: 3px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__content {

                    gap: 8px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__icon {

                    width: 31px;
                    height: 31px;

                    font-size: 14px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__badge {

                    height: 18px;

                    padding: 0 6px;

                    font-size: 7px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__label {

                    font-size: 7px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__title {

                    font-size: 10.5px;

                    line-height: 1.3;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__subtitle {

                    font-size: 8.8px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__time {

                    min-width: 80px;

                    padding: 7px 6px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__time-label {

                    font-size: 6px;
                }

                #${ID}
                .${TIMER_CLASS} {

                    font-size: 12px;
                }

            }

            @media (max-width: 390px) {

                #${ID} {
                    padding: 10px 9px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__icon {
                    display: none;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__top {
                    gap: 4px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__title {
                    font-size: 10px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__subtitle {
                    font-size: 8px;
                }

                #${ID}
                .etraction-hitzz-pdp-cliente__time {
                    min-width: 73px;

                    padding: 7px 5px;
                }

                #${ID}
                .${TIMER_CLASS} {
                    font-size: 11.5px;
                }

            }

        `;

        document.head.appendChild(style);
    }

    /* =========================================================
       CRIAR AVISO
    ========================================================= */

    function criarAviso() {

        var aviso = document.createElement("div");

        aviso.id = ID;

        aviso.setAttribute(
            "role",
            "note"
        );

        aviso.innerHTML = `

            <div class="etraction-hitzz-pdp-cliente__content">

                <div class="etraction-hitzz-pdp-cliente__icon">
                    🎁
                </div>

                <div class="etraction-hitzz-pdp-cliente__copy">

                    <div class="etraction-hitzz-pdp-cliente__top">

                        <span class="etraction-hitzz-pdp-cliente__badge">
                            DIA DO CLIENTE
                        </span>

                        <span class="etraction-hitzz-pdp-cliente__label">
                            PRESENTE ESPECIAL
                        </span>

                    </div>

                    <span class="etraction-hitzz-pdp-cliente__title">

                        Ganhe uma
                        <strong>
                            Necessaire exclusiva
                        </strong>

                    </span>

                    <span class="etraction-hitzz-pdp-cliente__subtitle">

                        Compras acima de
                        <strong>R$ 499,90</strong>
                        + frete grátis

                    </span>

                </div>

            </div>


            <div class="etraction-hitzz-pdp-cliente__time">

                <span class="etraction-hitzz-pdp-cliente__time-label">
                    TERMINA EM
                </span>

                <strong class="${TIMER_CLASS}">
                    00:00:00
                </strong>

            </div>

        `;

        return aviso;
    }

    /* =========================================================
       TIMER
    ========================================================= */

    function iniciarTimer() {

        function formatar(numero) {

            return String(numero).padStart(
                2,
                "0"
            );
        }

        function atualizarTimer() {

            var agora = new Date();

            var diferenca =
                FIM_PROMOCAO.getTime() -
                agora.getTime();

            if (diferenca <= 0) {

                var aviso =
                    document.getElementById(ID);

                if (aviso) {
                    aviso.remove();
                }

                if (
                    window
                        .etractionHitzzPdpClienteTimer
                ) {

                    clearInterval(
                        window
                            .etractionHitzzPdpClienteTimer
                    );

                    window
                        .etractionHitzzPdpClienteTimer =
                        null;
                }

                return;
            }

            var dias =
                Math.floor(
                    diferenca /
                    (1000 * 60 * 60 * 24)
                );

            var horas =
                Math.floor(
                    (
                        diferenca %
                        (1000 * 60 * 60 * 24)
                    ) /
                    (1000 * 60 * 60)
                );

            var minutos =
                Math.floor(
                    (
                        diferenca %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );

            var segundos =
                Math.floor(
                    (
                        diferenca %
                        (1000 * 60)
                    ) /
                    1000
                );

            var texto;

            if (dias > 0) {

                texto =
                    dias +
                    "d " +
                    formatar(horas) +
                    ":" +
                    formatar(minutos) +
                    ":" +
                    formatar(segundos);

            } else {

                texto =
                    formatar(horas) +
                    ":" +
                    formatar(minutos) +
                    ":" +
                    formatar(segundos);
            }

            document
                .querySelectorAll(
                    "." + TIMER_CLASS
                )
                .forEach(function (timer) {

                    timer.textContent =
                        texto;

                });
        }

        atualizarTimer();

        if (
            window
                .etractionHitzzPdpClienteTimer
        ) {

            clearInterval(
                window
                    .etractionHitzzPdpClienteTimer
            );
        }

        window
            .etractionHitzzPdpClienteTimer =
            setInterval(
                atualizarTimer,
                1000
            );
    }

    /* =========================================================
       LOCALIZAR BLOCO DE COR
    ========================================================= */

    function localizarBlocoCor() {

        return (

            document.querySelector(
                ".association-link-products.product-variant-show-images"
            ) ||

            document.querySelector(
                ".association-link-products"
            ) ||

            document.querySelector(
                "#option-selector"
            ) ||

            document.querySelector(
                ".area-derivacoes"
            ) ||

            document.querySelector(
                ".derivacoes-produto"
            )

        );
    }

    /* =========================================================
       INSERIR
    ========================================================= */

    function inserirAviso() {

        if (!promocaoAtiva()) {
            return true;
        }

        if (
            document.getElementById(ID)
        ) {
            return true;
        }

        var blocoCor =
            localizarBlocoCor();

        if (
            !blocoCor ||
            !blocoCor.parentNode
        ) {
            return false;
        }

        adicionarEstilo();

        var aviso =
            criarAviso();

        blocoCor.parentNode.insertBefore(
            aviso,
            blocoCor
        );

        iniciarTimer();

        return true;
    }

    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        adicionarEstilo();

        inserirAviso();

        var tentativas = 0;

        var intervalo =
            setInterval(function () {

                tentativas++;

                if (
                    inserirAviso() ||
                    tentativas >= 100
                ) {

                    clearInterval(
                        intervalo
                    );
                }

            }, 200);

        /* =====================================================
           AJAX / ALTERAÇÕES DA PDP
        ===================================================== */

        var observer =
            new MutationObserver(
                function () {

                    if (
                        promocaoAtiva() &&
                        !document.getElementById(ID)
                    ) {

                        inserirAviso();
                    }

                }
            );

        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();