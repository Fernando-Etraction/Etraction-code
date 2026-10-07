(function () {
    'use strict';

    const CONFIG = {
        cupom: 'PRIMEIRACOMPRA',
        desconto: '5%',
        widgetId: 'etraction-abcbebe-primeira-compra',
        styleId: 'etraction-abcbebe-primeira-compra-style'
    };

    const controllerKey = '__etractionAbcbebeCupom';
    if (typeof window[controllerKey] === 'function') {
        window[controllerKey]();
    }

    let observer = null;
    let frame = null;
    let feedbackTimer = null;
    let stopped = false;

    function cleanup() {
        stopped = true;
        if (observer) observer.disconnect();
        if (frame !== null) cancelAnimationFrame(frame);
        clearTimeout(feedbackTimer);
        document.removeEventListener('DOMContentLoaded', iniciar);
    }
    window[controllerKey] = cleanup;

    document.getElementById(CONFIG.widgetId)?.remove();
    document.getElementById(CONFIG.styleId)?.remove();

    /* =========================
       CSS
    ========================= */

    const style = document.createElement('style');
    style.id = CONFIG.styleId;

    style.textContent = `
        #${CONFIG.widgetId},
        #${CONFIG.widgetId} * {
            box-sizing: border-box !important;
        }

        #${CONFIG.widgetId} {
            width: 100% !important;
            max-width: 366px !important;

            margin: 12px 0 0 !important;
            padding: 0 !important;

            position: relative !important;
            overflow: hidden !important;

            background:
                linear-gradient(
                    135deg,
                    #fff9fb 0%,
                    #fffdf9 50%,
                    #f7ffff 100%
                ) !important;

            border: 1px solid #f0dfe6 !important;
            border-radius: 11px !important;

            box-shadow:
                0 2px 7px rgba(0,0,0,.035) !important;

            font-family: inherit !important;

            float: none !important;
            clear: both !important;
        }

        #${CONFIG.widgetId}::before {
            content: "" !important;

            display: block !important;

            width: 100% !important;
            height: 3px !important;

            background:
                linear-gradient(
                    90deg,
                    #49b6b6 0%,
                    #49b6b6 33%,
                    #f6ba17 33%,
                    #f6ba17 66%,
                    #e94d83 66%,
                    #e94d83 100%
                ) !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__inner {
            padding: 11px 13px 12px !important;
        }

        /* =========================
           TOPO
        ========================= */

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;

            gap: 8px !important;

            margin: 0 0 8px !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__principal {
            min-width: 0 !important;

            display: flex !important;
            align-items: center !important;

            gap: 8px !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__icone {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            border-radius: 50% !important;

            background: #fff !important;
            border: 1px solid #f2dfe6 !important;

            color: #e94d83 !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__icone svg {
            width: 16px !important;
            height: 16px !important;

            display: block !important;
            stroke: currentColor !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__texto {
            min-width: 0 !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__eyebrow {
            display: block !important;

            margin: 0 0 2px !important;

            font-size: 9px !important;
            font-weight: 800 !important;
            line-height: 1.15 !important;

            letter-spacing: .35px !important;
            text-transform: uppercase !important;

            color: #49aeb1 !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__titulo {
            display: block !important;

            margin: 0 !important;

            font-size: 13px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;

            color: #3d3d3d !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__titulo strong {
            color: #e94d83 !important;
            font-weight: 800 !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__badge {
            flex: 0 0 auto !important;

            padding: 5px 7px !important;

            border-radius: 999px !important;

            background: #fff0f5 !important;
            border: 1px solid #f6cfdd !important;

            font-size: 10px !important;
            font-weight: 800 !important;
            line-height: 1 !important;

            color: #e94d83 !important;

            white-space: nowrap !important;
        }

        /* =========================
           DESCRIÇÃO
        ========================= */

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__descricao {
            margin: 0 0 9px !important;

            font-size: 11px !important;
            font-weight: 400 !important;
            line-height: 1.4 !important;

            color: #747474 !important;
        }

        /* =========================
           CUPOM
        ========================= */

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__box {
            width: 100% !important;

            display: flex !important;
            align-items: stretch !important;

            gap: 6px !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__codigo-box {
            flex: 1 1 auto !important;
            min-width: 0 !important;

            min-height: 38px !important;

            padding: 8px 10px !important;

            display: flex !important;
            align-items: center !important;

            background: rgba(255,255,255,.88) !important;

            border: 1px dashed #ddb7c5 !important;
            border-radius: 7px !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__codigo {
            width: 100% !important;

            overflow: hidden !important;
            text-overflow: ellipsis !important;

            font-size: 11px !important;
            font-weight: 800 !important;
            line-height: 1 !important;

            letter-spacing: .2px !important;

            color: #454545 !important;

            text-transform: uppercase !important;
            white-space: nowrap !important;
        }

        /* =========================
           BOTÃO
        ========================= */

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__botao {
            flex: 0 0 auto !important;

            min-width: 88px !important;
            min-height: 38px !important;

            margin: 0 !important;
            padding: 8px 10px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            gap: 5px !important;

            appearance: none !important;
            -webkit-appearance: none !important;

            background: #e94d83 !important;

            border: 0 !important;
            border-radius: 7px !important;

            box-shadow:
                0 2px 5px rgba(233,77,131,.16) !important;

            cursor: pointer !important;

            font-family: inherit !important;
            font-size: 10px !important;
            font-weight: 800 !important;
            line-height: 1 !important;

            color: #fff !important;

            text-transform: uppercase !important;
            white-space: nowrap !important;

            transition:
                transform .15s ease,
                background .15s ease !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__botao:hover {
            background: #dc3e75 !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__botao:active {
            transform: scale(.97) !important;
        }

        #${CONFIG.widgetId}
        .etraction-abcbebe-cupom__botao svg {
            width: 12px !important;
            height: 12px !important;

            display: block !important;
            stroke: currentColor !important;
        }

        /* COPIADO */

        #${CONFIG.widgetId}.etraction-abcbebe-cupom--copiado
        .etraction-abcbebe-cupom__botao {
            background: #49aeb1 !important;
        }

        #${CONFIG.widgetId}.etraction-abcbebe-cupom--copiado
        .etraction-abcbebe-cupom__codigo-box {
            border-color: #77c9ca !important;
            background: #f2ffff !important;
        }

        /* MOBILE */

        @media (max-width: 370px) {

            #${CONFIG.widgetId} {
                max-width: 366px !important;
            }

            #${CONFIG.widgetId}
            .etraction-abcbebe-cupom__inner {
                padding: 10px 11px 11px !important;
            }

            #${CONFIG.widgetId}
            .etraction-abcbebe-cupom__titulo {
                font-size: 12px !important;
            }

            #${CONFIG.widgetId}
            .etraction-abcbebe-cupom__descricao {
                font-size: 10px !important;
            }

            #${CONFIG.widgetId}
            .etraction-abcbebe-cupom__codigo {
                font-size: 10px !important;
            }
        }
    `;

    document.head.appendChild(style);

    /* =========================
       HTML
    ========================= */

    const widget = document.createElement('div');

    widget.id = CONFIG.widgetId;

    widget.innerHTML = `
        <div class="etraction-abcbebe-cupom__inner">

            <div class="etraction-abcbebe-cupom__header">

                <div class="etraction-abcbebe-cupom__principal">

                    <div class="etraction-abcbebe-cupom__icone">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M20 12v9H4v-9"></path>
                            <path d="M2 7h20v5H2z"></path>
                            <path d="M12 21V7"></path>
                            <path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5C10 7 12 7 12 7Z"></path>
                            <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5C14 7 12 7 12 7Z"></path>
                        </svg>
                    </div>

                    <div class="etraction-abcbebe-cupom__texto">

                        <span class="etraction-abcbebe-cupom__eyebrow">
                            Presente de boas-vindas
                        </span>

                        <span class="etraction-abcbebe-cupom__titulo">
                            Sua primeira compra com
                            <strong>${CONFIG.desconto} OFF</strong>
                        </span>

                    </div>

                </div>

                <span class="etraction-abcbebe-cupom__badge">
                    -${CONFIG.desconto}
                </span>

            </div>

            <p class="etraction-abcbebe-cupom__descricao">
                Um mimo para começar 💕 Use o cupom no fechamento do pedido.
            </p>

            <div class="etraction-abcbebe-cupom__box">

                <div class="etraction-abcbebe-cupom__codigo-box">

                    <span class="etraction-abcbebe-cupom__codigo">
                        ${CONFIG.cupom}
                    </span>

                </div>

                <button
                    type="button"
                    class="etraction-abcbebe-cupom__botao"
                    aria-label="Copiar cupom ${CONFIG.cupom}"
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <rect
                            x="9"
                            y="9"
                            width="11"
                            height="11"
                            rx="2"
                        ></rect>

                        <path
                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        ></path>
                    </svg>

                    <span class="etraction-abcbebe-cupom__acao">
                        Copiar
                    </span>

                </button>

            </div>

        </div>
    `;

    // O cupom sera inserido quando o bloco de parcelas estiver disponivel.

    /* =========================
       COPIAR
    ========================= */

    const botao = widget.querySelector(
        '.etraction-abcbebe-cupom__botao'
    );

    const acao = widget.querySelector(
        '.etraction-abcbebe-cupom__acao'
    );

    function feedback() {

        widget.classList.add(
            'etraction-abcbebe-cupom--copiado'
        );

        acao.textContent = 'Copiado!';

        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(function () {

            if (!document.body.contains(widget)) return;

            widget.classList.remove(
                'etraction-abcbebe-cupom--copiado'
            );

            acao.textContent = 'Copiar';

        }, 1600);
    }

    function fallback() {

        const textarea = document.createElement('textarea');

        textarea.value = CONFIG.cupom;

        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);

        textarea.select();

        try {
            const copied = document.execCommand('copy');
            if (copied) feedback();
            else acao.textContent = 'Tente de novo';
        } catch (e) {
            acao.textContent = 'Tente de novo';
        } finally {
            textarea.remove();
        }
    }

    botao.addEventListener('click', function () {

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === 'function' &&
            window.isSecureContext
        ) {

            navigator.clipboard
                .writeText(CONFIG.cupom)
                .then(feedback)
                .catch(fallback);

        } else {

            fallback();

        }

    });

    function posicionar() {
        if (stopped) return;

        // Mantem a busca na area principal, fora dos produtos relacionados.
        const principal = document.querySelector('.produto .principal');
        if (!principal) return;

        const target = principal.querySelector('.parcelamento-full') ||
            principal.querySelector('.parcelas-produto');
        if (!target) return;

        // So altera o DOM quando necessario, evitando duplicacao e loops.
        if (target.nextElementSibling !== widget) {
            target.insertAdjacentElement('afterend', widget);
        }

        // Depois de localizar o produto, observa apenas sua area principal.
        if (observer && observer.root !== principal) {
            observer.disconnect();
            observer.observe(principal, { childList: true, subtree: true });
            observer.root = principal;
        }
    }

    function iniciar() {
        if (stopped) return;
        observer = new MutationObserver(function () {
            if (frame !== null || stopped) return;
            frame = requestAnimationFrame(function () {
                frame = null;
                posicionar();
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        posicionar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar, { once: true });
    } else {
        iniciar();
    }
})();