(function () {
    "use strict";

    var ID = "etraction-topbar-dia-da-moda";
    var STYLE_ID = "etraction-topbar-dia-da-moda-style";

    var CUPOM = "DIADAMODA";

    /* SEXTA-FEIRA 21/08/2026 ÀS 12:00 */
    var DATA_FIM = new Date(
        "2026-08-21T12:00:00-03:00"
    ).getTime();

    var timerContagem = null;

    function adicionarEstilo() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `
            #${ID} {
                position: relative;
                z-index: 99999;

                width: 100%;

                margin: 0;
                padding: 0;

                background: #090909;
                color: #fff;

                border-bottom: 1px solid #242424;

                font-family: inherit;
            }

            #${ID},
            #${ID} * {
                box-sizing: border-box;
            }

            #${ID} .etraction-topbar-inner {
                width: calc(100% - 32px);
                max-width: 1240px;

                min-height: 44px;

                margin: 0 auto;
                padding: 6px 0;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 18px;
            }

            /* =========================
               OFERTA
            ========================= */

            #${ID} .etraction-topbar-oferta {
                display: flex;
                align-items: center;

                gap: 10px;
            }

            #${ID} .etraction-topbar-off {
                color: #fff;

                font-size: 15px;
                font-weight: 800;
                line-height: 1;

                white-space: nowrap;
            }

            #${ID} .etraction-topbar-copy {
                color: rgba(255,255,255,.65);

                font-size: 11px;
                font-weight: 400;
                line-height: 1.2;

                white-space: nowrap;
            }

            #${ID} .etraction-topbar-copy strong {
                color: #fff;

                font-weight: 700;
            }

            /* =========================
               DIVISÓRIAS
            ========================= */

            #${ID} .etraction-topbar-divider {
                width: 1px;
                height: 17px;

                flex: 0 0 1px;

                background: rgba(255,255,255,.14);
            }

            /* =========================
               TIMER
            ========================= */

            #${ID} .etraction-topbar-timer-area {
                display: flex;
                align-items: center;

                gap: 6px;

                white-space: nowrap;
            }

            #${ID} .etraction-topbar-timer-label {
                color: rgba(255,255,255,.48);

                font-size: 8px;
                font-weight: 600;

                text-transform: uppercase;
                letter-spacing: .7px;
            }

            #${ID} .etraction-topbar-timer {
                color: #d33a16;

                font-size: 12px;
                font-weight: 800;
                line-height: 1;

                white-space: nowrap;
            }

            /* =========================
               CUPOM
            ========================= */

            #${ID} .etraction-topbar-cupom {
                min-height: 32px;

                padding: 0;

                display: flex;
                align-items: stretch;

                overflow: hidden;

                background: #4a0805;

                border: 1px solid #a5230d;
                border-radius: 4px;

                color: #fff;

                font-family: inherit;

                cursor: pointer;

                box-shadow:
                    0 3px 10px rgba(0,0,0,.30);

                transition:
                    transform .15s ease,
                    box-shadow .15s ease,
                    background .15s ease,
                    border-color .15s ease;
            }

            #${ID} .etraction-topbar-cupom:hover {
                background: #a5230d;
                border-color: #d33a16;

                transform: translateY(-1px);

                box-shadow:
                    0 5px 14px rgba(0,0,0,.38);
            }

            #${ID} .etraction-topbar-cupom:active {
                transform: scale(.97);
            }

            #${ID} .etraction-topbar-cupom-code {
                min-width: 92px;

                padding: 0 11px;

                display: flex;
                align-items: center;
                justify-content: center;

                color: #fff;

                font-size: 11px;
                font-weight: 800;
                line-height: 1;

                letter-spacing: .2px;

                white-space: nowrap;
            }

            #${ID} .etraction-topbar-cupom-action {
                min-width: 54px;

                padding: 0 9px;

                display: flex;
                align-items: center;
                justify-content: center;

                background: rgba(255,255,255,.08);

                border-left:
                    1px dashed rgba(255,255,255,.30);

                color: rgba(255,255,255,.76);

                font-size: 7px;
                font-weight: 800;
                line-height: 1;

                text-transform: uppercase;
                letter-spacing: .6px;

                white-space: nowrap;
            }

            #${ID} .etraction-topbar-cupom:hover
            .etraction-topbar-cupom-action {
                background: rgba(255,255,255,.12);
                color: #fff;
            }

            #${ID} .etraction-topbar-cupom.etraction-copiado
            .etraction-topbar-cupom-action {
                background: #fff;
                color: #4a0805;

                border-left-color: #fff;
            }

            /* =========================
               TABLET
            ========================= */

            @media (max-width: 900px) and (min-width: 701px) {

                #${ID} .etraction-topbar-inner {
                    gap: 12px;
                }

                #${ID} .etraction-topbar-off {
                    font-size: 14px;
                }

                #${ID} .etraction-topbar-copy {
                    font-size: 10px;
                }
            }

            /* =========================
               MOBILE
            ========================= */

            @media (max-width: 700px) {

                #${ID} .etraction-topbar-inner {
                    width: calc(100% - 18px);

                    min-height: 70px;

                    padding: 8px 0 7px;

                    display: grid;

                    grid-template-columns:
                        auto
                        minmax(0, 1fr)
                        auto;

                    grid-template-areas:
                        "off copy cupom"
                        "timer timer timer";

                    align-items: center;

                    column-gap: 7px;
                    row-gap: 7px;
                }

                /* OFERTA */

                #${ID} .etraction-topbar-oferta {
                    display: contents;
                }

                #${ID} .etraction-topbar-off {
                    grid-area: off;

                    color: #fff;

                    font-size: 15px;
                    font-weight: 800;

                    letter-spacing: -.25px;
                }

                #${ID} .etraction-topbar-copy {
                    grid-area: copy;

                    min-width: 0;

                    color: rgba(255,255,255,.65);

                    font-size: 9px;
                    line-height: 1.15;

                    white-space: normal;
                }

                #${ID} .etraction-topbar-copy strong {
                    color: #fff;
                }

                /* DIVISORES */

                #${ID} .etraction-topbar-divider {
                    display: none;
                }

                /* CUPOM */

                #${ID} .etraction-topbar-cupom {
                    grid-area: cupom;

                    min-height: 31px;

                    background: #4a0805;

                    border-color: #a5230d;

                    border-radius: 4px;
                }

                #${ID} .etraction-topbar-cupom-code {
                    min-width: 75px;

                    padding: 0 7px;

                    font-size: 9px;
                }

                #${ID} .etraction-topbar-cupom-action {
                    min-width: 42px;

                    padding: 0 6px;

                    font-size: 6px;

                    letter-spacing: .3px;
                }

                /* TIMER */

                #${ID} .etraction-topbar-timer-area {
                    grid-area: timer;

                    width: 100%;

                    padding-top: 6px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 6px;

                    border-top:
                        1px solid rgba(255,255,255,.12);
                }

                #${ID} .etraction-topbar-timer-label {
                    color: rgba(255,255,255,.48);

                    font-size: 7px;

                    letter-spacing: .6px;
                }

                #${ID} .etraction-topbar-timer {
                    color: #d33a16;

                    font-size: 11px;
                    font-weight: 800;
                }
            }

            /* =========================
               MOBILE PEQUENO
            ========================= */

            @media (max-width: 390px) {

                #${ID} .etraction-topbar-inner {
                    width: calc(100% - 12px);

                    column-gap: 5px;
                }

                #${ID} .etraction-topbar-off {
                    font-size: 14px;
                }

                #${ID} .etraction-topbar-copy {
                    font-size: 8px;
                }

                #${ID} .etraction-topbar-cupom-code {
                    min-width: 68px;

                    padding: 0 5px;

                    font-size: 8px;
                }

                #${ID} .etraction-topbar-cupom-action {
                    min-width: 38px;

                    padding: 0 4px;

                    font-size: 5.5px;
                }

                #${ID} .etraction-topbar-timer-label {
                    font-size: 6px;
                }

                #${ID} .etraction-topbar-timer {
                    font-size: 10px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function formatarNumero(numero) {
        return String(numero).padStart(2, "0");
    }

    function atualizarTimer() {
        var elemento = document.querySelector(
            "#" + ID + " .etraction-topbar-timer"
        );

        if (!elemento) {
            return;
        }

        var diferenca = DATA_FIM - Date.now();

        if (diferenca <= 0) {
            elemento.textContent = "ENCERRADA";

            if (timerContagem) {
                clearInterval(timerContagem);
                timerContagem = null;
            }

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
            formatarNumero(horas) + "h:" +
            formatarNumero(minutos) + "m:" +
            formatarNumero(segundos) + "s";

        elemento.textContent = texto;
    }

    function copiarFallback(callback) {
        var textarea =
            document.createElement("textarea");

        textarea.value = CUPOM;
        textarea.setAttribute("readonly", "");

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";

        document.body.appendChild(textarea);

        textarea.select();

        try {
            document.execCommand("copy");

            if (callback) {
                callback();
            }
        } catch (e) {}

        textarea.remove();
    }

    function copiarCupom(botao) {
        var acao = botao.querySelector(
            ".etraction-topbar-cupom-action"
        );

        function sucesso() {
            botao.classList.add(
                "etraction-copiado"
            );

            if (acao) {
                acao.textContent = "COPIADO ✓";
            }

            setTimeout(function () {
                botao.classList.remove(
                    "etraction-copiado"
                );

                if (acao) {
                    acao.textContent = "COPIAR";
                }
            }, 1800);
        }

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === "function"
        ) {
            navigator.clipboard
                .writeText(CUPOM)
                .then(sucesso)
                .catch(function () {
                    copiarFallback(sucesso);
                });

            return;
        }

        copiarFallback(sucesso);
    }

    function criarTarja() {
        var tarja =
            document.createElement("div");

        tarja.id = ID;

        tarja.innerHTML = `
            <div class="etraction-topbar-inner">

                <div class="etraction-topbar-oferta">

                    <strong class="etraction-topbar-off">
                        20% OFF
                    </strong>

                    <span class="etraction-topbar-copy">
                        <strong>10% no Pix</strong>
                        + 10% com cupom
                    </span>

                </div>

                <span class="etraction-topbar-divider"></span>

                <div class="etraction-topbar-timer-area">

                    <span class="etraction-topbar-timer-label">
                        Termina em
                    </span>

                    <strong class="etraction-topbar-timer">
                        00h:00m:00s
                    </strong>

                </div>

                <span class="etraction-topbar-divider"></span>

                <button
                    type="button"
                    class="etraction-topbar-cupom"
                    aria-label="Copiar cupom ${CUPOM}"
                    title="Clique para copiar o cupom ${CUPOM}"
                >

                    <span class="etraction-topbar-cupom-code">
                        ${CUPOM}
                    </span>

                    <span class="etraction-topbar-cupom-action">
                        COPIAR
                    </span>

                </button>

            </div>
        `;

        return tarja;
    }

    function inserir() {
        if (!document.body) {
            return false;
        }

        if (document.getElementById(ID)) {
            return true;
        }

        adicionarEstilo();

        var tarja = criarTarja();

        document.body.insertBefore(
            tarja,
            document.body.firstChild
        );

        var botao = tarja.querySelector(
            ".etraction-topbar-cupom"
        );

        if (botao) {
            botao.addEventListener(
                "click",
                function () {
                    copiarCupom(botao);
                }
            );
        }

        atualizarTimer();

        if (!timerContagem) {
            timerContagem = setInterval(
                atualizarTimer,
                1000
            );
        }

        return true;
    }

    var tentativas = 0;

    var timerInsercao = setInterval(
        function () {
            tentativas++;

            if (
                inserir() ||
                tentativas >= 30
            ) {
                clearInterval(timerInsercao);
            }
        },
        200
    );

})();