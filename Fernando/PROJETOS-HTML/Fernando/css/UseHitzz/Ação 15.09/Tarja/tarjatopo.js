(function () {
    "use strict";

    var ID = "etraction-hitzz-topbar-cliente";
    var STYLE_ID = "etraction-hitzz-topbar-cliente-style";


    /* =========================================================
       CONFIGURAÇÃO DA AÇÃO DE HOJE
    ========================================================= */

    var DATA_PROMOCAO = {
        ano: 2026,
        mes: 8, // setembro = 8
        dia: 11
    };


    function promocaoEstaAtiva() {

        var agora = new Date();

        return (
            agora.getFullYear() === DATA_PROMOCAO.ano &&
            agora.getMonth() === DATA_PROMOCAO.mes &&
            agora.getDate() === DATA_PROMOCAO.dia
        );
    }


    /* =========================================================
       ESTILO
    ========================================================= */

    function adicionarEstilo() {

        var estiloAntigo =
            document.getElementById(STYLE_ID);

        if (estiloAntigo) {
            estiloAntigo.remove();
        }


        var style =
            document.createElement("style");

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


            /* =====================================================
               BRILHO
            ===================================================== */

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
                        rgba(255,255,255,.05),
                        transparent
                    );

                transform: skewX(-20deg);

                animation:
                    etractionHitzzTopShine
                    6s
                    ease-in-out
                    infinite;

                pointer-events: none;
            }


            @keyframes etractionHitzzTopShine {

                0%,
                70% {
                    left: -180px;
                }

                100% {
                    left: calc(100% + 80px);
                }

            }


            /* =====================================================
               CONTEÚDO
            ===================================================== */

            #${ID}
            .etraction-hitzz-content {
                width: 100%;
                max-width: 1180px;
                height: 32px;

                margin: 0 auto;

                display: flex;
                align-items: center;
                justify-content: center;

                overflow: hidden !important;
            }


            #${ID}
            .etraction-hitzz-marquee {
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


            #${ID}
            .etraction-hitzz-marquee:nth-child(2) {
                display: none;
            }


            /* =====================================================
               DIA DO CLIENTE
            ===================================================== */

            #${ID}
            .etraction-hitzz-title {
                height: 20px;

                padding: 0 8px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                border:
                    1px solid rgba(255,255,255,.35);

                border-radius: 3px;

                color: #ffffff;

                font-size: 10px;
                font-weight: 800;

                letter-spacing: 1.4px;

                line-height: 1;

                text-transform: uppercase;

                white-space: nowrap;
            }


            /* =====================================================
               SOMENTE HOJE
            ===================================================== */

            #${ID}
            .etraction-hitzz-today {
                height: 20px;

                padding: 0 7px;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                background: #ffffff;
                color: #050505;

                border-radius: 3px;

                font-size: 9px;
                font-weight: 900;

                line-height: 1;

                letter-spacing: .8px;

                text-transform: uppercase;

                white-space: nowrap;
            }


            /* =====================================================
               DIVISOR
            ===================================================== */

            #${ID}
            .etraction-hitzz-divisor {
                width: 1px;
                height: 14px;

                flex: 0 0 1px;

                background:
                    rgba(255,255,255,.22);
            }


            /* =====================================================
               TEXTO PRINCIPAL
            ===================================================== */

            #${ID}
            .etraction-hitzz-main {
                height: 32px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 6px;

                color:
                    rgba(255,255,255,.78);

                font-size: 11px;
                font-weight: 500;

                line-height: 1;

                white-space: nowrap;
            }


            #${ID}
            .etraction-hitzz-gift {
                display: inline-flex;
                align-items: center;

                color: #ffffff;

                font-size: 13px;
                font-weight: 800;

                line-height: 1;

                white-space: nowrap;
            }


            #${ID}
            .etraction-hitzz-info {
                display: inline-flex;
                align-items: center;

                color:
                    rgba(255,255,255,.78);

                font-size: 11px;
                font-weight: 500;

                line-height: 1;

                white-space: nowrap;
            }


            #${ID}
            .etraction-hitzz-info strong {
                margin: 0 3px;

                color: #ffffff;

                font-weight: 800;
            }


            #${ID}
            .etraction-hitzz-shipping {
                display: inline-flex;
                align-items: center;

                color: #ffffff;

                font-size: 11px;
                font-weight: 800;

                line-height: 1;

                white-space: nowrap;
            }


            /* =====================================================
               MOBILE
            ===================================================== */

            @media (max-width: 768px) {

                #${ID} {
                    height: 28px;

                    padding: 0;

                    overflow: hidden !important;
                }


                #${ID}::before {
                    display: none;
                }


                #${ID}
                .etraction-hitzz-content {
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


                #${ID}
                .etraction-hitzz-marquee,
                #${ID}
                .etraction-hitzz-marquee:nth-child(2) {
                    display: flex;

                    height: 28px;

                    align-items: center;
                    justify-content: flex-start;

                    gap: 8px;

                    flex: 0 0 auto;

                    padding: 0 18px;

                    overflow: visible !important;
                }


                #${ID}
                .etraction-hitzz-title {
                    height: 18px;

                    padding: 0 6px;

                    font-size: 8px;

                    letter-spacing: 1.2px;
                }


                #${ID}
                .etraction-hitzz-today {
                    height: 18px;

                    padding: 0 6px;

                    font-size: 7.5px;
                }


                #${ID}
                .etraction-hitzz-divisor {
                    height: 12px;
                }


                #${ID}
                .etraction-hitzz-main {
                    height: 28px;

                    gap: 5px;

                    font-size: 9px;
                }


                #${ID}
                .etraction-hitzz-gift {
                    font-size: 11px;
                }


                #${ID}
                .etraction-hitzz-info,
                #${ID}
                .etraction-hitzz-shipping {
                    font-size: 9px;
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


                #${ID}
                .etraction-hitzz-content,
                #${ID}
                .etraction-hitzz-marquee,
                #${ID}
                .etraction-hitzz-main {
                    height: 26px;
                }


                #${ID}
                .etraction-hitzz-content {
                    animation-duration: 22s;
                }


                #${ID}
                .etraction-hitzz-gift {
                    font-size: 10.5px;
                }


                #${ID}
                .etraction-hitzz-info,
                #${ID}
                .etraction-hitzz-shipping {
                    font-size: 8.5px;
                }

            }

        `;


        document.head.appendChild(style);
    }


    /* =========================================================
       BLOCO SOMENTE HOJE
    ========================================================= */

    function conteudoSomenteHoje() {

        if (!promocaoEstaAtiva()) {
            return "";
        }


        return `

            <span class="etraction-hitzz-divisor"></span>

            <strong class="etraction-hitzz-today">
                SOMENTE HOJE
            </strong>

        `;
    }


    /* =========================================================
       CONTEÚDO
    ========================================================= */

    function conteudoBanner() {

        return `

            <span class="etraction-hitzz-title">
                DIA DO CLIENTE
            </span>

            <span class="etraction-hitzz-divisor"></span>


            <div class="etraction-hitzz-main">

                <strong class="etraction-hitzz-gift">
                    Necessaire de presente
                </strong>


                <span class="etraction-hitzz-info">
                    nas compras acima de
                    <strong>
                        R$ 499,90
                    </strong>
                </span>


                <span class="etraction-hitzz-divisor"></span>


                <strong class="etraction-hitzz-shipping">
                    + Frete grátis
                </strong>


                ${conteudoSomenteHoje()}

            </div>

        `;
    }


    /* =========================================================
       CRIAR TARJA
    ========================================================= */

    function criarTarja() {

        var banner =
            document.createElement("div");

        banner.id = ID;


        banner.setAttribute(
            "aria-label",
            "Dia do Cliente Hitzz. Necessaire de presente nas compras acima de R$ 499,90 mais frete grátis."
        );


        var conteudo =
            conteudoBanner();


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


    /* =========================================================
       INSERIR
    ========================================================= */

    function inserir() {

        if (!document.body) {
            return false;
        }


        if (
            document.getElementById(ID)
        ) {
            return true;
        }


        adicionarEstilo();


        var banner =
            criarTarja();


        var headerMiddle =
            document.querySelector(
                ".header-middle"
            );


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


        return true;
    }


    /* =========================================================
       INIT
    ========================================================= */

    var tentativas = 0;


    var intervalo =
        setInterval(function () {

            tentativas++;


            if (
                inserir() ||
                tentativas >= 30
            ) {

                clearInterval(
                    intervalo
                );
            }

        }, 200);

})();
