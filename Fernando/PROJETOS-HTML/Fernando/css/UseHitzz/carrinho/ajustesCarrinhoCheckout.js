(function () {
    'use strict';

    var MOBILE = 767;
    var BUTTON_ID = 'etr-mobile-checkout-floating';
    var STYLE_ID = 'etr-mobile-checkout-floating-style';

    function isMobile() {
        return window.innerWidth <= MOBILE;
    }

    function createStyle() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var style = document.createElement('style');

        style.id = STYLE_ID;

        style.textContent = `

#cartContainer > form > div.row.rowCartPromotionCodes > div.col-lg-3.col-md-3.col-sm-3 > a {
    font-size: 0 !important;
}

#cartContainer > form > div.row.rowCartPromotionCodes > div.col-lg-3.col-md-3.col-sm-3 > a::before {
    content: "Continuar para frete e pagamento";
    font-size: 14px;
}

#cartContainer > form > div.row.rowCartPromotionCodes > div.col-lg-3.col-md-3.col-sm-3 > a i {
    font-size: 14px !important;
    margin-left: 6px;
}

#cartContainer > div.row.rowCartPostalCode > div.col-lg-3.col-md-3.col-sm-3 > a{
    display:none !Important;
}

            #${BUTTON_ID} {
                position: fixed !important;
                z-index: 999999 !important;

                left: 18px !important;
                right: 18px !important;
                bottom: calc(10px + env(safe-area-inset-bottom, 0px)) !important;

                width: auto !important;
                min-height: 52px !important;

                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px !important;

                padding: 0 20px !important;
                box-sizing: border-box !important;

                background: #6FC41A !important;
                border: 0 !important;
                border-radius: 4px !important;

                color: #ffffff !important;
                font-family: inherit !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                line-height: 1 !important;
                text-align: center !important;
                text-decoration: none !important;


                cursor: pointer !important;
                visibility: visible !important;
                opacity: 1 !important;

                -webkit-tap-highlight-color: transparent !important;
            }

            #${BUTTON_ID} span {
                color: #ffffff !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                line-height: 1 !important;
            }

            #${BUTTON_ID} svg {
                width: 17px !important;
                height: 17px !important;
                min-width: 17px !important;
                flex: 0 0 auto !important;
                color: #ffffff !important;
            }

            @media (min-width: 768px) {
                #${BUTTON_ID} {
                    display: none !important;
                }
            }
        `;

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    }

    function removeButton() {
        var button = document.getElementById(BUTTON_ID);

        if (button) {
            button.remove();
        }
    }

    function createButton() {
        /* Só aparece no mobile */
        if (!isMobile()) {
            removeButton();
            return;
        }

        /* Aguarda o body existir */
        if (!document.body) {
            return;
        }

        /* Evita duplicar */
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        createStyle();

        var button = document.createElement('a');

        button.id = BUTTON_ID;
        button.href = '/checkout/';

        button.setAttribute('aria-label', 'Continuar para frete e pagamento');

        button.innerHTML = `
            <span>Continuar para frete e pagamento</span>

            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M5 12h14"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                ></path>

                <path
                    d="m14 7 5 5-5 5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>
        `;

        document.body.appendChild(button);
    }

    function updateButton() {
        if (isMobile()) {
            createButton();
        } else {
            removeButton();
        }
    }

    /* =====================================================
       1. TENTA IMEDIATAMENTE
    ===================================================== */

    updateButton();


    /* =====================================================
       2. QUANDO O DOM TERMINAR DE CARREGAR
    ===================================================== */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            updateButton();
        });
    }


    /* =====================================================
       3. QUANDO A PÁGINA TERMINAR COMPLETAMENTE
    ===================================================== */

    window.addEventListener('load', function () {
        updateButton();
    });


    /* =====================================================
       4. TENTATIVAS EXTRAS
       Útil em sites que carregam conteúdo via JS
    ===================================================== */

    setTimeout(updateButton, 300);
    setTimeout(updateButton, 700);
    setTimeout(updateButton, 1500);
    setTimeout(updateButton, 3000);


    /* =====================================================
       5. OBSERVA ALTERAÇÕES DO SITE
       Recria caso React/Vue/etc remova o botão
    ===================================================== */

    var observer = new MutationObserver(function () {
        if (
            isMobile() &&
            document.body &&
            !document.getElementById(BUTTON_ID)
        ) {
            createButton();
        }
    });

    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 100);
            return;
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    startObserver();


    /* =====================================================
       6. RESIZE / ROTAÇÃO
    ===================================================== */

    var resizeTimer;

    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            updateButton();
        }, 150);
    });

    window.addEventListener('orientationchange', function () {
        setTimeout(updateButton, 250);
    });


    /* =====================================================
       7. QUANDO VOLTA PARA A PÁGINA
    ===================================================== */

    window.addEventListener('pageshow', function () {
        updateButton();
    });


    /* =====================================================
       8. GARANTIA PARA SITES COM CARREGAMENTO ASSÍNCRONO
    ===================================================== */

    setInterval(function () {
        if (
            isMobile() &&
            document.body &&
            !document.getElementById(BUTTON_ID)
        ) {
            createButton();
        }
    }, 2000);

})();