(function () {
    "use strict";
    var AVISO_ID = "etraction-promo-0909";
    var STYLE_ID = "etraction-promo-0909-style";
    var CUPOM = "99HITZ";
    var timerInterval = null;
    var resizeTimer = null;
    var FONT_LINK_ID = "etraction-promo-0909-font";
    /* =========================================================
       FONTE — Roboto única em todo o bloco
    ========================================================= */
    function adicionarFonte() {
        if (document.getElementById(FONT_LINK_ID)) {
            return;
        }
        var preconnect1 = document.createElement("link");
        preconnect1.rel = "preconnect";
        preconnect1.href = "https://fonts.googleapis.com";
        var preconnect2 = document.createElement("link");
        preconnect2.rel = "preconnect";
        preconnect2.href = "https://fonts.gstatic.com";
        preconnect2.crossOrigin = "anonymous";
        var folha = document.createElement("link");
        folha.id = FONT_LINK_ID;
        folha.rel = "stylesheet";
        folha.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap";
        document.head.appendChild(preconnect1);
        document.head.appendChild(preconnect2);
        document.head.appendChild(folha);
    }
    /* =========================================================
       ESTILOS
       Oferta direta, sem repetição de informações.
    ========================================================= */
    function adicionarEstilos() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        var style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            #${AVISO_ID},
            #${AVISO_ID} * {
                box-sizing: border-box;
            }
            #${AVISO_ID} {
                width: 100%;
                max-width: 555px;
                margin: 12px 0 16px;
                font-family: "Roboto", Arial, Helvetica, sans-serif;
                color: #111;
            }
            #${AVISO_ID} .promo0909 {
                display: flex;
                align-items: stretch;
                width: 100%;
                margin: 0;
                overflow: hidden;
                background: #fff;
                border: 1px solid rgba(17, 17, 17, .08);
                border-radius: 10px;
                box-shadow: 0 5px 18px rgba(0, 0, 0, .045);
            }
            #${AVISO_ID} .promo0909__offer {
                display: flex;
                flex: 1 1 auto;
                flex-direction: column;
                justify-content: center;
                min-width: 0;
                padding: 13px 15px;
            }
            #${AVISO_ID} .promo0909__summary {
                margin: 0;
                line-height: 1;
            }
            #${AVISO_ID} .promo0909__summary strong {
                display: block;
                font-size: 30px;
                font-weight: 900;
                line-height: 1;
                letter-spacing: -.8px;
                color: #B40200;
            }
            #${AVISO_ID} .promo0909__activation {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                gap: 5px;
                margin-top: 8px;
                font-size: 11px;
                line-height: 1.2;
                color: #111;
            }
            #${AVISO_ID} .promo0909__coupon {
                display: inline-flex;
                align-items: baseline;
                gap: 3px;
                white-space: nowrap;
            }
            #${AVISO_ID} .promo0909__coupon strong {
                font-size: 12px;
                font-weight: 900;
                letter-spacing: .35px;
                color: #111;
            }
            #${AVISO_ID} .promo0909__pix {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
            }
            #${AVISO_ID} .promo0909__pix strong {
                font-size: 12px;
                font-weight: 800;
                color: #111;
            }
            #${AVISO_ID} .promo0909__copy {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 22px;
                margin: 0;
                padding: 2px 7px;
                background: #fff;
                border: 1px solid rgba(180, 2, 0, .58);
                border-radius: 5px;
                font-family: inherit;
                color: #B40200;
                cursor: pointer;
                transition: background-color .15s ease, border-color .15s ease, transform .15s ease;
            }
            #${AVISO_ID} .promo0909__copy:hover,
            #${AVISO_ID} .promo0909__copy:focus-visible {
                background: #efefef;
                border-color: #B40200;
                outline: none;
            }
            #${AVISO_ID} .promo0909__copy:active {
                transform: scale(.97);
            }
            #${AVISO_ID} .promo0909__copy-label {
                font-size: 9px;
                font-weight: 800;
                letter-spacing: .45px;
                text-transform: uppercase;
                color: #B40200;
            }
            #${AVISO_ID} .promo0909__timer {
                display: flex;
                flex: 0 0 140px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px 12px;
                background: #fff;
                border-left: 1px solid rgba(17, 17, 17, .12);
                color: #111;
                text-align: center;
            }
            #${AVISO_ID} .promo0909__timer-label {
                display: block;
                margin-bottom: 5px;
                font-size: 9px;
                font-weight: 500;
                line-height: 1;
                letter-spacing: .75px;
                color: rgba(17, 17, 17, .7);
            }
            #${AVISO_ID} .promo0909__clock {
                display: block;
                font-variant-numeric: tabular-nums;
                font-size: 21px;
                font-weight: 800;
                line-height: 1;
                letter-spacing: .6px;
                color: #B40200;
            }
            @media (max-width: 600px) {
                #${AVISO_ID} {
                    width: 100%;
                    max-width: 390px;
                    margin: 0 auto 14px;
                }
                #${AVISO_ID} .promo0909 {
                    border-radius: 10px;
                }
                #${AVISO_ID} .promo0909__offer {
                    padding: 10px;
                }
                #${AVISO_ID} .promo0909__summary strong {
                    font-size: 27px;
                    letter-spacing: -.5px;
                }
                #${AVISO_ID} .promo0909__activation {
                    gap: 3px;
                    margin-top: 6px;
                    font-size: 12px;
                }
                #${AVISO_ID} .promo0909__coupon {
                    gap: 2px;
                }
                #${AVISO_ID} .promo0909__coupon strong {
                    font-size: 12px;
                }
                #${AVISO_ID} .promo0909__pix strong {
                    font-size: 10px;
                }
                #${AVISO_ID} .promo0909__copy {
                    min-height: 20px;
                    padding: 2px 5px;
                }
                #${AVISO_ID} .promo0909__copy-label {
                    font-size: 8px;
                }
                #${AVISO_ID} .promo0909__timer {
                    flex-basis: 112px;
                    padding: 9px 7px;
                }
                #${AVISO_ID} .promo0909__clock {
                    font-size: 18px;
                    letter-spacing: .2px;
                }
            }
            @media (max-width: 350px) {
                #${AVISO_ID} .promo0909__copy-label {
                    font-size: 7px;
                }
                #${AVISO_ID} .promo0909__timer {
                    flex-basis: 102px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    /* =========================================================
       HTML
    ========================================================= */
    function criarAviso() {
        var aviso = document.createElement("div");
        aviso.id = AVISO_ID;
        aviso.setAttribute("role", "note");
        aviso.setAttribute("aria-label", "Promoção especial 09.09");
        aviso.innerHTML = `
            <div class="promo0909">
                <div class="promo0909__offer">
                    <p class="promo0909__summary">
                        <strong>09.09</strong>
                    </p>
                    <div class="promo0909__activation" aria-label="10% de desconto no Pix">
                        <span class="promo0909__coupon">10% no pix</span>
                        <span class="promo0909__pix">
                            <strong>+ 7%</strong>
                            <span>com o cupom <strong>${CUPOM}</strong></span>
                            <button type="button" class="promo0909__copy" aria-label="Copiar cupom ${CUPOM}">
                                <span class="promo0909__copy-label">copiar</span>
                            </button>
                        </span>
                    </div>
                </div>
                <div class="promo0909__timer" role="timer" aria-label="Tempo restante da promoção">
                    <span class="promo0909__timer-label">Termina em</span>
                    <span class="promo0909__clock">
                        <span data-hours>00</span>:<span data-minutes>00</span>:<span data-seconds>00</span>
                    </span>
                </div>
            </div>
        `;
        return aviso;
    }
    /* =========================================================
       TIMER
    ========================================================= */
    function obterMeiaNoite() {
        var agora = new Date();
        var fim = new Date(agora);
        fim.setHours(24, 0, 0, 0);
        return fim.getTime();
    }
    function pad(numero) {
        return String(numero).padStart(2, "0");
    }
    function iniciarTimer(aviso) {
        var fim = obterMeiaNoite();
        var horasEl = aviso.querySelector("[data-hours]");
        var minutosEl = aviso.querySelector("[data-minutes]");
        var segundosEl = aviso.querySelector("[data-seconds]");
        function atualizar() {
            var restante = fim - Date.now();
            if (restante < 0) {
                restante = 0;
            }
            var total = Math.floor(restante / 1000);
            var horas = Math.floor(total / 3600);
            var minutos = Math.floor((total % 3600) / 60);
            var segundos = total % 60;
            if (horasEl) {
                horasEl.textContent = pad(horas);
            }
            if (minutosEl) {
                minutosEl.textContent = pad(minutos);
            }
            if (segundosEl) {
                segundosEl.textContent = pad(segundos);
            }
            if (restante <= 0 && timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }
        atualizar();
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        timerInterval = window.setInterval(atualizar, 1000);
    }
    /* =========================================================
       COPIAR CUPOM
    ========================================================= */
    function copiarFallback(texto, callback) {
        var textarea = document.createElement("textarea");
        textarea.value = texto;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand("copy");
            if (typeof callback === "function") {
                callback();
            }
        } catch (erro) {
            console.warn("[eTraction] Não foi possível copiar o cupom.", erro);
        }
        if (textarea.parentNode) {
            textarea.parentNode.removeChild(textarea);
        }
    }
    function copiarCupom(botao) {
        function sucesso() {
            var label = botao.querySelector(".promo0909__copy-label");
            var original = label ? label.textContent : "copiar";
            botao.classList.add("is-copied");
            if (label) {
                label.textContent = "copiado!";
            }
            window.setTimeout(function () {
                botao.classList.remove("is-copied");
                if (label) {
                    label.textContent = original;
                }
            }, 1600);
        }
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard
                .writeText(CUPOM)
                .then(sucesso)
                .catch(function () {
                    copiarFallback(CUPOM, sucesso);
                });
        } else {
            copiarFallback(CUPOM, sucesso);
        }
    }
    /* =========================================================
       EVENTOS
    ========================================================= */
    function adicionarEventos(aviso) {
        var botao = aviso.querySelector(".promo0909__copy");
        if (!botao) {
            return;
        }
        botao.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            copiarCupom(botao);
        });
    }
    /* =========================================================
       POSIÇÃO
    ========================================================= */
    function obterAlvo() {
        if (window.matchMedia("(max-width: 600px)").matches) {
            return {
                elemento: document.querySelector("#right-column .product-title, .product-title"),
                posicao: "antes"
            };
        }
        return {
            elemento: document.querySelector("#option-selector"),
            posicao: "depois"
        };
    }
    /* =========================================================
       INSERÇÃO
    ========================================================= */
    function inserirAviso() {
        var alvoInfo = obterAlvo();
        var alvo = alvoInfo.elemento;
        if (!alvo || !alvo.parentNode) {
            return false;
        }
        var aviso = document.getElementById(AVISO_ID);
        if (!aviso) {
            aviso = criarAviso();
            adicionarEventos(aviso);
            iniciarTimer(aviso);
        }
        var jaPosicionado =
            alvoInfo.posicao === "depois"
                ? alvo.nextElementSibling === aviso
                : alvo.previousElementSibling === aviso;
        if (!jaPosicionado) {
            alvo.insertAdjacentElement(
                alvoInfo.posicao === "depois" ? "afterend" : "beforebegin",
                aviso
            );
        }
        return true;
    }
    /* =========================================================
       OBSERVER
    ========================================================= */
    function observarPagina() {
        if (!window.MutationObserver) {
            return;
        }
        var timeout = null;
        var observer = new MutationObserver(function () {
            if (timeout) {
                return;
            }
            timeout = window.setTimeout(function () {
                timeout = null;
                inserirAviso();
            }, 100);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    /* =========================================================
       RESIZE
    ========================================================= */
    function observarResize() {
        window.addEventListener("resize", function () {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = window.setTimeout(inserirAviso, 150);
        });
    }
    /* =========================================================
       START
    ========================================================= */
    function iniciar() {
        adicionarFonte();
        adicionarEstilos();
        inserirAviso();
        observarPagina();
        observarResize();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();