(function () {
    "use strict";

    if (window.location.pathname !== "/hitzz-em-alta") {
        return;
    }

    var ID = "etraction-banner-categoria-hitzz";
    var STYLE_ID = "etraction-banner-categoria-hitzz-style";

    var CUPOM = "DIADAMODA";

    /* SEXTA-FEIRA 21/08/2026 ÀS 12:00 */
    var DATA_FIM = new Date(
        "2026-08-21T12:00:00-03:00"
    ).getTime();

    var timerContagem = null;

    function adicionarEstilo() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `
            #${ID} {
                width: 100vw;

                margin-left: calc(50% - 50vw);
                margin-right: calc(50% - 50vw);

                margin-top: 0;
                margin-bottom: 26px;

                background: #f7f7f7;

                border-top: 1px solid #ededed;
                border-bottom: 1px solid #ededed;

                color: #111;
                font-family: inherit;
            }

            #${ID},
            #${ID} * {
                box-sizing: border-box;
            }

            /* =========================
               CONTAINER
            ========================= */

            #${ID} .etraction-hitzz-inner {
                width: calc(100% - 40px);
                max-width: 1240px;

                margin: 0 auto;
            }

            /* =========================
               DESKTOP
            ========================= */

            #${ID} .etraction-hitzz-main {
                min-height: 160px;

                padding: 28px 0 26px;

                display: grid;

                grid-template-columns:
                    170px
                    minmax(0, 1fr)
                    245px;

                align-items: center;

                gap: 42px;
            }

            /* DESCONTO */

            #${ID} .etraction-hitzz-discount {
                min-height: 100px;

                display: flex;
                align-items: center;
                justify-content: flex-start;

                padding-right: 36px;

                border-right: 1px solid #dcdcdc;
            }

            #${ID} .etraction-hitzz-discount-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            #${ID} .etraction-hitzz-discount-number {
                color: #111;

                font-size: 54px;
                font-weight: 800;
                line-height: .82;

                letter-spacing: -3px;
            }

            #${ID} .etraction-hitzz-discount-number span {
                font-size: 25px;
                font-weight: 700;

                letter-spacing: -1px;
            }

            #${ID} .etraction-hitzz-discount-off {
                margin-top: 8px;

                color: #555;

                font-size: 10px;
                font-weight: 700;
                line-height: 1;

                text-transform: uppercase;
                letter-spacing: 1.4px;
            }

            /* COPY */

            #${ID} .etraction-hitzz-copy {
                min-width: 0;

                display: flex;
                flex-direction: column;
                align-items: flex-start;

                text-align: left;
            }

            #${ID} .etraction-hitzz-eyebrow {
                margin: 0 0 7px;

                color: #888;

                font-size: 9px;
                font-weight: 700;
                line-height: 1;

                text-transform: uppercase;
                letter-spacing: 1.5px;
            }

            #${ID} .etraction-hitzz-title {
                max-width: 620px;

                margin: 0 0 7px;

                color: #111;

                font-size: 27px;
                font-weight: 800;
                line-height: 1.08;

                letter-spacing: -.7px;
            }

            #${ID} .etraction-hitzz-description {
                max-width: 570px;

                margin: 0;

                color: #666;

                font-size: 12px;
                line-height: 1.45;
            }

            #${ID} .etraction-hitzz-description strong {
                color: #111;
                font-weight: 700;
            }

            /* CUPOM */

            #${ID} .etraction-hitzz-cupom-area {
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }

            #${ID} .etraction-hitzz-cupom {
                width: 235px;
                min-height: 76px;

                padding: 14px 16px;

                display: flex;
                align-items: center;
                justify-content: space-between;

                gap: 18px;

                background: #111;

                border: 1px solid #111;
                border-radius: 5px;

                color: #fff;

                font-family: inherit;

                cursor: pointer;

                transition:
                    background .2s ease,
                    color .2s ease,
                    transform .2s ease;
            }

            #${ID} .etraction-hitzz-cupom:hover {
                background: #fff;
                color: #111;

                transform: translateY(-2px);
            }

            #${ID} .etraction-hitzz-cupom-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                gap: 5px;

                text-align: left;
            }

            #${ID} .etraction-hitzz-cupom-label {
                font-size: 8px;
                font-weight: 600;
                line-height: 1;

                text-transform: uppercase;
                letter-spacing: .7px;

                opacity: .6;
            }

            #${ID} .etraction-hitzz-cupom-code {
                font-size: 19px;
                font-weight: 800;
                line-height: 1;

                letter-spacing: .2px;
            }

            #${ID} .etraction-hitzz-cupom-action {
                flex-shrink: 0;

                padding-left: 13px;

                border-left: 1px solid rgba(255,255,255,.22);

                font-size: 8px;
                font-weight: 700;

                text-transform: uppercase;
                letter-spacing: .7px;

                opacity: .72;
            }

            #${ID} .etraction-hitzz-cupom:hover
            .etraction-hitzz-cupom-action {
                border-left-color: rgba(0,0,0,.18);
            }

            /* =========================
               TIMER
            ========================= */

            #${ID} .etraction-hitzz-timer-section {
                min-height: 46px;

                display: flex;
                align-items: center;
                justify-content: center;

                gap: 9px;

                border-top: 1px solid #dedede;
            }

            #${ID} .etraction-hitzz-timer-label {
                color: #888;

                font-size: 8px;
                font-weight: 700;

                text-transform: uppercase;
                letter-spacing: 1px;
            }

            #${ID} .etraction-hitzz-timer {
                color: #111;

                font-size: 16px;
                font-weight: 800;
                line-height: 1;

                white-space: nowrap;
            }

            #${ID} .etraction-hitzz-timer-dot {
                width: 3px;
                height: 3px;

                margin: 0 4px;

                background: #aaa;

                border-radius: 50%;
            }

            #${ID} .etraction-hitzz-timer-extra {
                color: #777;

                font-size: 9px;
            }

            /* =========================
               TABLET
            ========================= */

            @media (max-width: 950px) and (min-width: 701px) {

                #${ID} .etraction-hitzz-main {
                    grid-template-columns:
                        130px
                        minmax(0, 1fr)
                        190px;

                    gap: 24px;
                }

                #${ID} .etraction-hitzz-discount {
                    padding-right: 20px;
                }

                #${ID} .etraction-hitzz-discount-number {
                    font-size: 42px;
                }

                #${ID} .etraction-hitzz-discount-number span {
                    font-size: 19px;
                }

                #${ID} .etraction-hitzz-title {
                    font-size: 21px;
                }

                #${ID} .etraction-hitzz-cupom {
                    width: 190px;
                }

                #${ID} .etraction-hitzz-cupom-code {
                    font-size: 16px;
                }
            }

            /* =========================
               MOBILE
            ========================= */

            @media (max-width: 700px) {

                #${ID} {
                    margin-bottom: 16px;

                    background: #f8f8f8;
                }

                #${ID} .etraction-hitzz-inner {
                    width: calc(100% - 28px);
                }

                #${ID} .etraction-hitzz-main {
                    min-height: 0;

                    padding: 18px 0 14px;

                    display: grid;

                    grid-template-columns:
                        76px
                        minmax(0, 1fr);

                    align-items: center;

                    column-gap: 14px;
                    row-gap: 15px;
                }

                /* DESCONTO */

                #${ID} .etraction-hitzz-discount {
                    width: 76px;
                    min-height: 76px;

                    padding: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-right: 0;
                }

                #${ID} .etraction-hitzz-discount-content {
                    width: 76px;
                    height: 76px;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    background: #111;

                    border-radius: 4px;

                    color: #fff;
                }

                #${ID} .etraction-hitzz-discount-number {
                    color: #fff;

                    font-size: 32px;
                    font-weight: 800;
                    line-height: .9;

                    letter-spacing: -1.5px;
                }

                #${ID} .etraction-hitzz-discount-number span {
                    color: #fff;

                    font-size: 14px;
                    font-weight: 700;
                }

                #${ID} .etraction-hitzz-discount-off {
                    margin-top: 6px;

                    color: rgba(255,255,255,.7);

                    font-size: 7px;
                    font-weight: 600;

                    letter-spacing: .7px;
                }

                /* COPY */

                #${ID} .etraction-hitzz-copy {
                    width: 100%;

                    align-items: flex-start;

                    text-align: left;
                }

                #${ID} .etraction-hitzz-eyebrow {
                    margin-bottom: 5px;

                    font-size: 8px;
                    letter-spacing: .9px;
                }

                #${ID} .etraction-hitzz-title {
                    max-width: none;

                    margin-bottom: 6px;

                    font-size: 19px;
                    font-weight: 800;
                    line-height: 1.08;

                    letter-spacing: -.35px;
                }

                #${ID} .etraction-hitzz-description {
                    max-width: none;

                    font-size: 10px;
                    line-height: 1.4;
                }

                /* CUPOM GRANDE */

                #${ID} .etraction-hitzz-cupom-area {
                    grid-column: 1 / -1;

                    width: 100%;

                    display: block;
                }

                #${ID} .etraction-hitzz-cupom {
                    width: 100%;
                    max-width: none;

                    min-height: 60px;

                    padding: 12px 15px;

                    border-radius: 4px;
                }

                #${ID} .etraction-hitzz-cupom-info {
                    gap: 5px;
                }

                #${ID} .etraction-hitzz-cupom-label {
                    font-size: 8px;

                    letter-spacing: .55px;
                }

                #${ID} .etraction-hitzz-cupom-code {
                    font-size: 17px;
                }

                #${ID} .etraction-hitzz-cupom-action {
                    padding-left: 17px;

                    font-size: 8px;
                }

                /* TIMER */

                #${ID} .etraction-hitzz-timer-section {
                    min-height: 45px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    gap: 6px;

                    padding: 0 4px;

                    white-space: nowrap;
                }

                #${ID} .etraction-hitzz-timer-label {
                    font-size: 7px;

                    letter-spacing: .65px;
                }

                #${ID} .etraction-hitzz-timer {
                    font-size: 14px;
                }

                #${ID} .etraction-hitzz-timer-dot {
                    width: 2px;
                    height: 2px;

                    margin: 0 2px;
                }

                #${ID} .etraction-hitzz-timer-extra {
                    font-size: 8px;
                }
            }

            /* =========================
               MOBILE PEQUENO
            ========================= */

            @media (max-width: 390px) {

                #${ID} .etraction-hitzz-inner {
                    width: calc(100% - 20px);
                }

                #${ID} .etraction-hitzz-main {
                    grid-template-columns:
                        68px
                        minmax(0, 1fr);

                    column-gap: 10px;
                }

                #${ID} .etraction-hitzz-discount,
                #${ID} .etraction-hitzz-discount-content {
                    width: 68px;
                    height: 68px;
                    min-height: 68px;
                }

                #${ID} .etraction-hitzz-discount-number {
                    font-size: 28px;
                }

                #${ID} .etraction-hitzz-discount-number span {
                    font-size: 12px;
                }

                #${ID} .etraction-hitzz-discount-off {
                    font-size: 6px;
                }

                #${ID} .etraction-hitzz-eyebrow {
                    font-size: 7px;
                }

                #${ID} .etraction-hitzz-title {
                    font-size: 17px;
                }

                #${ID} .etraction-hitzz-description {
                    font-size: 9px;
                }

                #${ID} .etraction-hitzz-cupom {
                    min-height: 56px;

                    padding: 11px 12px;
                }

                #${ID} .etraction-hitzz-cupom-label {
                    font-size: 7px;
                }

                #${ID} .etraction-hitzz-cupom-code {
                    font-size: 15px;
                }

                #${ID} .etraction-hitzz-cupom-action {
                    font-size: 7px;
                }

                #${ID} .etraction-hitzz-timer-label {
                    font-size: 6px;
                }

                #${ID} .etraction-hitzz-timer {
                    font-size: 13px;
                }

                #${ID} .etraction-hitzz-timer-extra {
                    display: none;
                }

                #${ID} .etraction-hitzz-timer-dot {
                    display: none;
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
            "#" + ID + " .etraction-hitzz-timer"
        );

        if (!elemento) return;

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
        var codigo = botao.querySelector(
            ".etraction-hitzz-cupom-code"
        );

        if (!codigo) return;

        function sucesso() {
            codigo.textContent = "COPIADO";

            setTimeout(function () {
                codigo.textContent = CUPOM;
            }, 1500);
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

    function encontrarTituloCategoria() {
        var titulos = document.querySelectorAll(
            "h1, .page-title, .category-title"
        );

        for (var i = 0; i < titulos.length; i++) {
            var texto = (
                titulos[i].textContent || ""
            )
                .replace(/\s+/g, " ")
                .trim()
                .toUpperCase();

            if (texto === "MAIS VENDIDOS") {
                return titulos[i];
            }
        }

        return null;
    }

    function inserir() {
        if (document.getElementById(ID)) {
            return true;
        }

        var titulo = encontrarTituloCategoria();

        if (!titulo) {
            return false;
        }

        adicionarEstilo();

        var banner =
            document.createElement("div");

        banner.id = ID;

        banner.innerHTML = `
            <div class="etraction-hitzz-inner">

                <div class="etraction-hitzz-main">

                    <div class="etraction-hitzz-discount">

                        <div class="etraction-hitzz-discount-content">

                            <div class="etraction-hitzz-discount-number">
                                20<span>%</span>
                            </div>

                            <span class="etraction-hitzz-discount-off">
                                de desconto
                            </span>

                        </div>

                    </div>

                    <div class="etraction-hitzz-copy">

                        <div class="etraction-hitzz-eyebrow">
                            Oferta especial
                        </div>

                        <div class="etraction-hitzz-title">
                            10% OFF no Pix + 10% OFF com cupom
                        </div>

                        <p class="etraction-hitzz-description">
                            Aproveite os mais vendidos da Hitzz
                            com <strong>até 20% de desconto</strong>
                            por tempo limitado.
                        </p>

                    </div>

                    <div class="etraction-hitzz-cupom-area">

                        <button
                            type="button"
                            class="etraction-hitzz-cupom"
                            aria-label="Copiar cupom ${CUPOM}"
                        >

                            <span class="etraction-hitzz-cupom-info">

                                <span class="etraction-hitzz-cupom-label">
                                    Cupom de 10% OFF
                                </span>

                                <span class="etraction-hitzz-cupom-code">
                                    ${CUPOM}
                                </span>

                            </span>

                            <span class="etraction-hitzz-cupom-action">
                                Copiar
                            </span>

                        </button>

                    </div>

                </div>

                <div class="etraction-hitzz-timer-section">

                    <span class="etraction-hitzz-timer-label">
                        Oferta termina em
                    </span>

                    <strong class="etraction-hitzz-timer">
                        00h:00m:00s
                    </strong>

                    <span class="etraction-hitzz-timer-dot"></span>

                    <span class="etraction-hitzz-timer-extra">
                        Sexta-feira às 12h
                    </span>

                </div>

            </div>
        `;

        titulo.insertAdjacentElement(
            "beforebegin",
            banner
        );

        var botao = banner.querySelector(
            ".etraction-hitzz-cupom"
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
    var maxTentativas = 30;

    var timerInsercao = setInterval(
        function () {
            tentativas++;

            if (
                inserir() ||
                tentativas >= maxTentativas
            ) {
                clearInterval(timerInsercao);
            }
        },
        300
    );

})();