(function () {
    'use strict';

    const CONFIG = {
        texto: 'Frete grátis nas compras acima de <strong>R$ 1.800</strong>',
        widgetId: 'etraction-abcbebe-frete-gratis',
        styleId: 'etraction-abcbebe-frete-gratis-style'
    };

    const controllerKey = '__etractionAbcbebeFreteGratis';
    if (typeof window[controllerKey] === 'function') {
        window[controllerKey]();
    }

    let observer = null;
    let frame = null;
    let stopped = false;

    function cleanup() {
        stopped = true;
        if (observer) observer.disconnect();
        if (frame !== null) cancelAnimationFrame(frame);
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
        #${CONFIG.widgetId} {
            box-sizing: border-box !important;
            width: 100% !important;

            margin: 12px 0 10px !important;
            padding: 9px 12px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;

            background: #f2ffff !important;
            border: 1px dashed #77c9ca !important;
            border-radius: 8px !important;

            font-family: inherit !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            line-height: 1.3 !important;
            text-align: center !important;

            color: #3d3d3d !important;

            float: none !important;
            clear: both !important;
        }

        #${CONFIG.widgetId} strong {
            color: #e94d83 !important;
            font-weight: 800 !important;
        }

        #${CONFIG.widgetId} svg {
            width: 20px !important;
            height: 20px !important;
            flex: 0 0 auto !important;

            display: block !important;
            stroke: #49aeb1 !important;
        }

        @media (max-width: 370px) {
            #${CONFIG.widgetId} {
                font-size: 12px !important;
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
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M1 3h15v13H1z"></path>
            <path d="M16 8h4l3 3v5h-7z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
        <span>${CONFIG.texto}</span>
    `;

    function posicionar() {
        if (stopped) return;

        // Mantem a busca na area principal, fora dos produtos relacionados.
        const principal = document.querySelector('.produto .principal');
        if (!principal) return;

        const target = principal.querySelector('.acoes-produto .comprar');
        if (!target) return;

        // So altera o DOM quando necessario, evitando duplicacao e loops.
        if (target.previousElementSibling !== widget) {
            target.insertAdjacentElement('beforebegin', widget);
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
