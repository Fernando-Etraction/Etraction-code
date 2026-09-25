(function () {
    "use strict";

    var ID = "etraction-hitzz-topbar-0909";
    var STYLE_ID = "etraction-hitzz-topbar-0909-style";

    var LINK_PROMO = "https://www.usehitzz.com.br/search/?q=Maximalia";

    var DATA_FIM = new Date(
        "2026-09-09T23:59:59-03:00"
    ).getTime();

    var timerInterval = null;


    function adicionarEstilo() {

        var estiloAntigo = document.getElementById(STYLE_ID);

        if (estiloAntigo) {
            estiloAntigo.remove();
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
                z-index: 99999;

                width: 100%;
                height: 32px;

                display: flex;
                align-items: center;
                justify-content: center;

                margin: 0;
                padding: 0 16px;

                background:
                    linear-gradient(
                        90deg,
                        #050505 0%,
                        #111111 50%,
                        #050505 100%
                    );

                color: #ffffff !important;

                border-bottom:
                    1px solid rgba(255,255,255,.12);

                font-family: inherit;

                text-decoration: none !important;

                cursor: pointer;

                overflow: hidden !important;

                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }


            #${ID}::-webkit-scrollbar,
            #${ID} *::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }


            #${ID}:hover,
            #${ID}:focus,
            #${ID}:active,
            #${ID}:visited {
                color: #ffffff !important;
                text-decoration: none !important;
            }


            /* BRILHO SUTIL */

            #${ID}::before {
                content: "";

                position: absolute;

                top: 0;
                left: -180px;

                width: 120px;
                height: 100%;

                background:
                    linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.045),
                        transparent
                    );

                transform: skewX(-20deg);

                transition: left .65s ease;

                pointer-events: none;
            }


            #${ID}:hover::before {
                left: calc(100% + 80px);
            }


            /* CONTEÚDO */

            #${ID} .etraction-hitzz-content {
                width: 100%;
                max-width: 1180px;
                height: 32px;

                margin: 0 auto;

                display: flex;
                align-items: center;
                justify-content: center;

                overflow: hidden !important;
            }


            #${ID} .etraction-hitzz-marquee {
                height: 32px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 10px;

                margin: 0;
                padding: 0;

                white-space: nowrap;

                overflow: hidden !important;
            }


            #${ID} .etraction-hitzz-marquee:nth-child(2) {
                display: none;
            }


            /* 09.09 */

            #${ID} .etraction-hitzz-title {
                height: 20px;

                padding: 0 8px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                border:
                    1px solid rgba(255,255,255,.32);

                border-radius: 3px;

                color: #ffffff;

                font-size: 11px;
                font-weight: 800;

                letter-spacing: 2px;

                line-height: 1;

                white-space: nowrap;
            }


            /* DIVISOR */

            #${ID} .etraction-hitzz-divisor {
                width: 1px;
                height: 14px;

                flex: 0 0 1px;

                background:
                    rgba(255,255,255,.22);
            }


            /* PRINCIPAL */

            #${ID} .etraction-hitzz-main {
                height: 32px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 9px;

                color:
                    rgba(255,255,255,.78);

                font-size: 11px;
                font-weight: 500;

                line-height: 1;

                white-space: nowrap;
            }


            /* 17% OFF */

            #${ID} .etraction-hitzz-offer {
                height: 32px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                margin: 0;
                padding: 0;

                color: #ffffff !important;

                font-size: 17px;
                font-weight: 800;

                line-height: 1;

                letter-spacing: -.35px;

                white-space: nowrap;
            }


            #${ID} .etraction-hitzz-offer-pulse {
                display: inline-block;

                color: #ffffff !important;

                font-size: inherit;
                font-weight: inherit;

                line-height: 1;

                transform-origin: center;

                animation:
                    etractionHitzzOfferPulse
                    1.8s
                    ease-in-out
                    infinite;
            }


            /*
             * PULSO SEM ALTERAR COR OU OPACIDADE
             */

            @keyframes etractionHitzzOfferPulse {

                0%,
                100% {
                    transform: scale(1);
                }

                50% {
                    transform: scale(1.025);
                }

            }


            /* MECÂNICA */

            #${ID} .etraction-hitzz-mechanics {
                height: 32px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                gap: 4px;

                color:
                    rgba(255,255,255,.72);

                font-size: 11px;
                font-weight: 500;

                line-height: 1;

                white-space: nowrap;
            }


            #${ID} .etraction-hitzz-mechanics strong {
                color: #ffffff;

                font-weight: 700;
            }


            /* TIMER */

            #${ID} .etraction-hitzz-timer-wrap {
                height: 32px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                gap: 5px;

                line-height: 1;

                white-space: nowrap;
            }


            #${ID} .etraction-hitzz-timer-dot {
                width: 4px;
                height: 4px;

                flex: 0 0 4px;

                border-radius: 50%;

                background: #ffffff;

                animation:
                    etractionHitzzTimerPulse
                    1.6s
                    ease-in-out
                    infinite;
            }


            @keyframes etractionHitzzTimerPulse {

                0%,
                100% {
                    opacity: .35;
                }

                50% {
                    opacity: 1;
                }

            }


            #${ID} .etraction-hitzz-timer-label {
                height: 32px;

                display: inline-flex;
                align-items: center;

                color:
                    rgba(255,255,255,.58);

                font-size: 11px;
                font-weight: 500;

                line-height: 1;
            }


            #${ID} .etraction-hitzz-timer {
                height: 32px;

                display: inline-flex;
                align-items: center;

                color: #ffffff;

                font-size: 11px;
                font-weight: 800;

                line-height: 1;

                font-variant-numeric:
                    tabular-nums;
            }


            /* CTA */

            #${ID} .etraction-hitzz-cta {
                height: 32px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                color: #ffffff;

                font-size: 9px;
                font-weight: 800;

                letter-spacing: 1.5px;

                line-height: 1;

                text-transform: uppercase;

                white-space: nowrap;
            }


            #${ID} .etraction-hitzz-arrow {
                margin-left: 4px;

                display: inline-flex;
                align-items: center;

                color: #ffffff;

                font-size: 10px;
                font-weight: 700;

                line-height: 1;
            }


            #${ID}:hover .etraction-hitzz-cta {
                text-decoration: underline;
                text-underline-offset: 3px;
            }


            /* MOBILE */

            @media (max-width: 768px) {

                #${ID} {
                    height: 28px;

                    padding: 0;

                    overflow: hidden !important;
                }


                #${ID}::before {
                    display: none;
                }


                #${ID} .etraction-hitzz-content {
                    width: max-content;
                    min-width: max-content;
                    max-width: none;

                    height: 28px;

                    margin: 0;

                    justify-content: flex-start;

                    overflow: visible !important;

                    animation:
                        etractionHitzzMarquee
                        24s
                        linear
                        infinite;

                    will-change: transform;
                }


                #${ID} .etraction-hitzz-marquee,
                #${ID} .etraction-hitzz-marquee:nth-child(2) {
                    display: flex;

                    height: 28px;

                    align-items: center;
                    justify-content: flex-start;

                    gap: 8px;

                    flex: 0 0 auto;

                    padding: 0 18px;

                    overflow: visible !important;
                }


                #${ID} .etraction-hitzz-title {
                    height: 18px;

                    padding: 0 6px;

                    font-size: 8px;

                    letter-spacing: 1.6px;
                }


                #${ID} .etraction-hitzz-divisor {
                    height: 12px;
                }


                #${ID} .etraction-hitzz-main,
                #${ID} .etraction-hitzz-offer,
                #${ID} .etraction-hitzz-mechanics,
                #${ID} .etraction-hitzz-timer-wrap,
                #${ID} .etraction-hitzz-timer-label,
                #${ID} .etraction-hitzz-timer,
                #${ID} .etraction-hitzz-cta {
                    height: 28px;
                }


                #${ID} .etraction-hitzz-main {
                    gap: 6px;

                    font-size: 9px;

                    overflow: visible !important;
                }


                #${ID} .etraction-hitzz-offer {
                    font-size: 13px;
                }


                #${ID} .etraction-hitzz-mechanics {
                    font-size: 9px;
                }


                #${ID} .etraction-hitzz-timer-label,
                #${ID} .etraction-hitzz-timer {
                    font-size: 9px;
                }


                #${ID} .etraction-hitzz-timer-dot {
                    width: 3px;
                    height: 3px;

                    flex-basis: 3px;
                }


                #${ID} .etraction-hitzz-cta {
                    font-size: 7.5px;

                    letter-spacing: 1.2px;
                }


                @keyframes etractionHitzzMarquee {

                    0% {
                        transform: translateX(0);
                    }

                    100% {
                        transform: translateX(-50%);
                    }

                }

            }


            @media (max-width: 420px) {

                #${ID} {
                    height: 26px;
                }


                #${ID} .etraction-hitzz-content,
                #${ID} .etraction-hitzz-marquee,
                #${ID} .etraction-hitzz-main,
                #${ID} .etraction-hitzz-offer,
                #${ID} .etraction-hitzz-mechanics,
                #${ID} .etraction-hitzz-timer-wrap,
                #${ID} .etraction-hitzz-timer-label,
                #${ID} .etraction-hitzz-timer,
                #${ID} .etraction-hitzz-cta {
                    height: 26px;
                }


                #${ID} .etraction-hitzz-content {
                    animation-duration: 22s;
                }


                #${ID} .etraction-hitzz-offer {
                    font-size: 12px;
                }

            }

        `;

        document.head.appendChild(style);
    }


    function formatarNumero(numero) {
        return String(numero).padStart(2, "0");
    }


    function atualizarTimer() {

        var timers = document.querySelectorAll(
            "#" + ID + " .etraction-hitzz-timer"
        );

        if (!timers.length) {
            return;
        }


        var diferenca = DATA_FIM - Date.now();


        if (diferenca <= 0) {

            timers.forEach(function (timer) {
                timer.textContent = "ENCERRADA";
            });

            return;
        }


        var dias = Math.floor(
            diferenca /
            (1000 * 60 * 60 * 24)
        );


        var horas = Math.floor(
            (
                diferenca %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


        var minutos = Math.floor(
            (
                diferenca %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


        var segundos = Math.floor(
            (
                diferenca %
                (1000 * 60)
            ) /
            1000
        );


        var texto = "";


        if (dias > 0) {
            texto += dias + "d ";
        }


        texto +=
            formatarNumero(horas) +
            ":" +
            formatarNumero(minutos) +
            ":" +
            formatarNumero(segundos);


        timers.forEach(function (timer) {
            timer.textContent = texto;
        });

    }


    function conteudoBanner() {

        return `

            <span class="etraction-hitzz-title">
                09.09
            </span>

            <span class="etraction-hitzz-divisor"></span>

            <div class="etraction-hitzz-main">

                <strong class="etraction-hitzz-offer">

                    <span class="etraction-hitzz-offer-pulse">
                        17% OFF
                    </span>

                </strong>

                <span class="etraction-hitzz-divisor"></span>

                <span class="etraction-hitzz-mechanics">

                    <strong>
                        7% no cupom 99HITZZ
                    </strong>

                    <span>+</span>

                    <strong>
                        10% no Pix
                    </strong>

                </span>

                <span class="etraction-hitzz-divisor"></span>

                <span class="etraction-hitzz-timer-wrap">

                    <span class="etraction-hitzz-timer-dot"></span>

                    <span class="etraction-hitzz-timer-label">
                        Termina em
                    </span>

                    <strong class="etraction-hitzz-timer">
                        00:00:00
                    </strong>

                </span>

                <span class="etraction-hitzz-divisor"></span>

                <span class="etraction-hitzz-cta">

                    VER PROMOÇÃO

                    <span class="etraction-hitzz-arrow">
                        &gt;
                    </span>

                </span>

            </div>

        `;
    }


    function criarTarja() {

        var banner = document.createElement("a");

        banner.id = ID;
        banner.href = LINK_PROMO;

        banner.setAttribute(
            "aria-label",
            "Ver promoção 09.09 - 17% OFF"
        );


        var conteudo = conteudoBanner();


        banner.innerHTML = `

            <div class="etraction-hitzz-content">

                <div class="etraction-hitzz-marquee">
                    ${conteudo}
                </div>

                <div
                    class="etraction-hitzz-marquee"
                    aria-hidden="true"
                >
                    ${conteudo}
                </div>

            </div>

        `;


        return banner;
    }


    function inserir() {

        if (!document.body) {
            return false;
        }


        if (document.getElementById(ID)) {
            return true;
        }


        adicionarEstilo();


        var banner = criarTarja();


        var headerMiddle =
            document.querySelector(".header-middle");


        if (headerMiddle) {

            headerMiddle.parentNode.insertBefore(
                banner,
                headerMiddle
            );

        } else {

            document.body.insertBefore(
                banner,
                document.body.firstChild
            );

        }


        atualizarTimer();


        if (!timerInterval) {

            timerInterval = setInterval(
                atualizarTimer,
                1000
            );

        }


        return true;
    }


    var tentativas = 0;


    var intervalo = setInterval(function () {

        tentativas++;


        if (
            inserir() ||
            tentativas >= 30
        ) {

            clearInterval(intervalo);

        }

    }, 200);

})();