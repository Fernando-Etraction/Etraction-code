(function () {
    "use strict";

    var ID = "etraction-desconto-pix-cupom";
    var STYLE_ID = "etraction-desconto-pix-cupom-style";

    var TARGET =
        "#product-price-info > div.product-price-container.col-lg-7.col-md-7.col-sm-7.col-xs-6";

    /* ALTERE O CUPOM AQUI */
    var CUPOM = "DIADAMODA";

    /* SEXTA-FEIRA 21/08/2026 ÀS 12:00 */
    var DATA_FIM = new Date("2026-08-21T12:00:00-03:00").getTime();

    var timerContagem = null;

    function adicionarEstilo() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `
            #${ID} {
                width: 100%;
                clear: both;
                box-sizing: border-box;

                margin: 8px 0;
                padding: 10px 12px;

                background: #f7f7f7;
                border: 1px solid #e5e5e5;
                border-radius: 8px;

                font-family: inherit;
                color: #111;
            }

            #${ID} .etraction-desconto-conteudo {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                gap: 10px;
            }

            #${ID} .etraction-desconto-info {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }

            #${ID} .etraction-desconto-badge {
                width: 56px;
                height: 48px;
                flex: 0 0 56px;

                display: flex;
                align-items: center;
                justify-content: center;

                background: #111;
                border-radius: 6px;

                color: #fff;

                font-size: 14px;
                font-weight: 800;
                line-height: 1.05;
                text-align: center;
            }

            #${ID} .etraction-desconto-textos {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;

                min-width: 0;
                text-align: left;
            }

            #${ID} .etraction-desconto-titulo {
                margin: 0 0 2px;

                color: #111;

                font-size: 16px;
                font-weight: 800;
                line-height: 1.15;
                letter-spacing: -0.2px;

                text-align: left;
            }

            #${ID} .etraction-desconto-subtitulo {
                margin: 0 0 3px;

                color: #666;

                font-size: 11px;
                font-weight: 400;
                line-height: 1.25;

                text-align: left;
            }

            #${ID} .etraction-desconto-timer {
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;

                width: fit-content;
                gap: 5px;

                line-height: 1;
                text-align: left;
            }

            #${ID} .etraction-timer-label {
                color: #777;

                font-size: 9px;
                font-weight: 600;

                text-transform: uppercase;
                letter-spacing: .3px;
            }

            #${ID} .etraction-timer-tempo {
                color: #111;

                font-size: 13px;
                font-weight: 800;

                white-space: nowrap;
                letter-spacing: .2px;
            }

            #${ID} .etraction-cupom {
                flex-shrink: 0;

                padding: 8px 10px;

                background: #fff;
                border: 1px dashed #999;
                border-radius: 6px;

                color: #111;

                font-family: inherit;
                font-size: 11px;
                font-weight: 700;

                cursor: pointer;

                transition:
                    border-color .2s ease,
                    background .2s ease;
            }

            #${ID} .etraction-cupom:hover {
                border-color: #111;
                background: #fafafa;
            }

            @media (max-width: 600px) {

                #${ID} {
                    margin: 7px 0;
                    padding: 9px;
                }

                #${ID} .etraction-desconto-conteudo {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    width: 100%;
                    gap: 6px;
                }

                #${ID} .etraction-desconto-info {
                    gap: 6px;
                }

                #${ID} .etraction-desconto-badge {
                    width: 48px;
                    height: 44px;
                    flex-basis: 48px;

                    font-size: 12px;
                }

                #${ID} .etraction-desconto-titulo {
                    margin-bottom: 2px;

                    font-size: 14px;
                    line-height: 1.15;
                }

                #${ID} .etraction-desconto-subtitulo {
                    margin-bottom: 3px;

                    font-size: 10px;
                    line-height: 1.2;
                }

                #${ID} .etraction-desconto-timer {
                    gap: 4px;
                }

                #${ID} .etraction-timer-label {
                    font-size: 8px;
                }

                #${ID} .etraction-timer-tempo {
                    font-size: 11px;
                }

                #${ID} .etraction-cupom {
                    padding: 7px 8px;
                    font-size: 9px;
                }
            }

            @media (max-width: 400px) {

                #${ID} {
                    padding: 8px 6px;
                }

                #${ID} .etraction-desconto-conteudo {
                    gap: 5px;
                }

                #${ID} .etraction-desconto-info {
                    gap: 5px;
                }

                #${ID} .etraction-desconto-badge {
                    width: 44px;
                    height: 42px;
                    flex-basis: 44px;

                    font-size: 11px;
                }

                #${ID} .etraction-desconto-titulo {
                    font-size: 13px;
                }

                #${ID} .etraction-desconto-subtitulo {
                    font-size: 9px;
                }

                #${ID} .etraction-timer-label {
                    font-size: 7px;
                }

                #${ID} .etraction-timer-tempo {
                    font-size: 10px;
                }

                #${ID} .etraction-cupom {
                    padding: 6px 7px;
                    font-size: 8px;
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
            "#" + ID + " .etraction-timer-tempo"
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
            diferenca / (1000 * 60 * 60 * 24)
        );

        var horas = Math.floor(
            (diferenca % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        var minutos = Math.floor(
            (diferenca % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        var segundos = Math.floor(
            (diferenca % (1000 * 60)) /
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

    function copiarCupom(botao) {
        var textoOriginal = CUPOM;

        function sucesso() {
            botao.textContent = "COPIADO";

            setTimeout(function () {
                botao.textContent = textoOriginal;
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

    function copiarFallback(callback) {
        var textarea = document.createElement("textarea");

        textarea.value = CUPOM;
        textarea.setAttribute("readonly", "");

        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.select();
        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        try {
            document.execCommand("copy");

            if (callback) {
                callback();
            }
        } catch (e) {}

        textarea.remove();
    }

    function inserir() {
        if (document.getElementById(ID)) {
            return true;
        }

        var target;

        try {
            target = document.querySelector(TARGET);
        } catch (e) {
            return false;
        }

        if (!target) {
            return false;
        }

        adicionarEstilo();

        var aviso = document.createElement("div");
        aviso.id = ID;

        aviso.innerHTML = `
            <div class="etraction-desconto-conteudo">

                <div class="etraction-desconto-info">

                    <div class="etraction-desconto-badge">
                        20%<br>OFF
                    </div>

                    <div class="etraction-desconto-textos">

                        <div class="etraction-desconto-titulo">
                            10% OFF no Pix + 10% OFF com cupom
                        </div>

                        <div class="etraction-desconto-subtitulo">
                            Aproveite e economize até 20% na sua compra
                        </div>

                        <div class="etraction-desconto-timer">

                            <span class="etraction-timer-label">
                                Termina em
                            </span>

                            <span class="etraction-timer-tempo">
                                00h:00m:00s
                            </span>

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    class="etraction-cupom"
                    aria-label="Copiar cupom ${CUPOM}"
                >
                    ${CUPOM}
                </button>

            </div>
        `;

        target.insertAdjacentElement(
            "afterend",
            aviso
        );

        var botao = aviso.querySelector(
            ".etraction-cupom"
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