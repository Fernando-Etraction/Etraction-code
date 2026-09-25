(function () {
    'use strict';

    const CONFIG = {
        cartUrl: 'https://www.ultramel.com.br/cart/',
        redirectDelay: 1200,
        width: '500px'
    };

    /* =========================================================
       ESTILOS
       ========================================================= */

    function inserirEstilos() {

        if (document.getElementById('etraction-buy-style')) return;

        const style = document.createElement('style');

        style.id = 'etraction-buy-style';

        style.textContent = `

            /* =================================================
               REMOVE LIMITAÇÃO DO BOOTSTRAP
               ================================================= */

            #product-price-info .cart-actions-container {
                width: ${CONFIG.width} !important;
                max-width: ${CONFIG.width} !important;

                float: none !important;
                flex: none !important;

                margin: 0 !important;
                padding: 0 !important;
            }


            /* =================================================
               ÁREA INTERNA
               ================================================= */

            #product-price-info .cart-actions-container .cart-actions {
                display: grid !important;

                grid-template-columns:
                    110px
                    minmax(0, 1fr) !important;

                gap: 8px !important;

                width: 100% !important;
                max-width: ${CONFIG.width} !important;

                margin: 0 !important;
                padding: 0 !important;

                align-items: stretch !important;
            }


            /* =================================================
               ESCONDE EM ESTOQUE
               ================================================= */

            #product-price-info
            .cart-actions-container
            .in-stock-label {
                display: none !important;
            }


            /* =================================================
               QUANTIDADE
               ================================================= */

            #product-price-info .cart-quantity-container {
                width: 110px !important;
                max-width: 110px !important;

                margin: 0 !important;
                padding: 0 !important;
            }

            #product-price-info
            .cart-quantity-container
            .form-group {
                width: 100% !important;

                margin: 0 !important;
                padding: 0 !important;
            }

            #product-price-info
            .cart-quantity-container
            .input-group {
                display: flex !important;

                width: 100% !important;
                height: 42px !important;

                margin: 0 !important;
            }

            #product-price-info
            .cart-quantity-container
            .input-group-btn {
                display: flex !important;

                width: 36px !important;
                min-width: 36px !important;

                height: 42px !important;
            }


            /* =================================================
               BOTÕES - / +
               ================================================= */

            #product-price-info .quantity-subtract,
            #product-price-info .quantity-increase {
                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 36px !important;
                min-width: 36px !important;
                max-width: 36px !important;

                height: 42px !important;

                padding: 0 !important;
                margin: 0 !important;

                background: #fff !important;

                border: 1px solid #777 !important;
                border-radius: 0 !important;

                box-shadow: none !important;

                color: #e1ae43 !important;

                font-size: 12px !important;

                transition:
                    background-color .18s ease,
                    border-color .18s ease !important;
            }

            #product-price-info .quantity-subtract {
                border-radius: 3px 0 0 3px !important;
                border-right: 0 !important;
            }

            #product-price-info .quantity-increase {
                border-radius: 0 3px 3px 0 !important;
                border-left: 0 !important;
            }

            #product-price-info .quantity-subtract:hover,
            #product-price-info .quantity-increase:hover {
                background: #f7f7f7 !important;
            }

            #product-price-info .quantity-subtract:disabled {
                opacity: .45 !important;
            }


            /* =================================================
               INPUT QUANTIDADE
               ================================================= */

            #product-price-info .cart-quantity-field {
                width: 38px !important;
                min-width: 38px !important;
                max-width: 38px !important;

                height: 42px !important;

                padding: 0 !important;
                margin: 0 !important;

                background: #fff !important;

                border: 1px solid #777 !important;
                border-radius: 0 !important;

                box-shadow: none !important;

                color: #555 !important;

                font-family: inherit !important;
                font-size: 14px !important;
                font-weight: 500 !important;

                text-align: center !important;

                appearance: textfield !important;
                -moz-appearance: textfield !important;
            }

            #product-price-info
            .cart-quantity-field::-webkit-inner-spin-button,
            #product-price-info
            .cart-quantity-field::-webkit-outer-spin-button {
                -webkit-appearance: none !important;
                margin: 0 !important;
            }

            #product-price-info .cart-quantity-field:focus {
                outline: none !important;
                box-shadow: none !important;
            }


            /* =================================================
               CONTAINER BOTÃO NATIVO
               ================================================= */

            #product-price-info #btn-cart-right {
                display: block !important;
                visibility: visible !important;

                width: 100% !important;
                max-width: none !important;

                height: 42px !important;

                float: none !important;

                margin: 0 !important;
                padding: 0 !important;
            }


            /* =================================================
               ADICIONAR AO CARRINHO
               ANIMAÇÃO SUAVE
               ================================================= */

            #product-price-info #btn-cart-right .btn-cart {
                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 100% !important;
                max-width: none !important;

                height: 42px !important;

                margin: 0 !important;
                padding: 0 20px !important;

                background: #44795d !important;

                border: 1px solid #44795d !important;
                border-radius: 3px !important;

                box-shadow: none !important;

                color: #fff !important;

                font-family: inherit !important;
                font-size: 13px !important;
                font-weight: 700 !important;

                line-height: 1 !important;

                text-align: center !important;
                text-transform: uppercase !important;

                white-space: nowrap !important;

                animation: none !important;
                transform: none !important;

                transition:
                    background-color .22s ease,
                    border-color .22s ease,
                    box-shadow .22s ease,
                    transform .12s ease !important;
            }

            #product-price-info
            #btn-cart-right
            .btn-cart:hover {
                background: #3d7055 !important;
                border-color: #3d7055 !important;

                transform: translateY(-1px) !important;

                box-shadow:
                    0 3px 8px rgba(0, 0, 0, .08) !important;
            }

            #product-price-info
            #btn-cart-right
            .btn-cart:active {
                transform: scale(.995) !important;

                box-shadow:
                    0 1px 3px rgba(0, 0, 0, .06) !important;

                transition-duration: .08s !important;
            }

            #product-price-info
            #btn-cart-right
            .btn-cart:focus {
                outline: none !important;

                box-shadow:
                    0 0 0 2px rgba(68, 121, 93, .15) !important;
            }

            #product-price-info
            #btn-cart-right
            .btn-cart::before,
            #product-price-info
            #btn-cart-right
            .btn-cart::after {
                animation: none !important;
            }


            /* =================================================
               COMPRAR AGORA
               ================================================= */

            #product-price-info .etraction-comprar-agora {
                grid-column: 1 / -1 !important;

                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 100% !important;
                max-width: ${CONFIG.width} !important;

                height: 40px !important;

                margin: 0 !important;
                padding: 0 20px !important;

                background: #fff !important;

                border: 1px solid #44795d !important;
                border-radius: 3px !important;

                box-shadow: none !important;

                color: #44795d !important;

                cursor: pointer !important;

                font-family: inherit !important;
                font-size: 13px !important;
                font-weight: 700 !important;

                line-height: 1 !important;

                text-align: center !important;
                text-transform: uppercase !important;

                transition:
                    background-color .22s ease,
                    color .22s ease,
                    border-color .22s ease,
                    box-shadow .22s ease,
                    transform .12s ease !important;
            }

            #product-price-info
            .etraction-comprar-agora:hover {
                background: #44795d !important;
                color: #fff !important;

                transform: translateY(-1px) !important;

                box-shadow:
                    0 3px 8px rgba(0, 0, 0, .06) !important;
            }

            #product-price-info
            .etraction-comprar-agora:active {
                transform: scale(.995) !important;
            }

            #product-price-info
            .etraction-comprar-agora:disabled {
                opacity: .6 !important;
                cursor: wait !important;
                transform: none !important;
            }


            /* =================================================
               REMOVE CLEAR ANTIGO
               ================================================= */

            #product-price-info
            .cart-actions
            > div[style*="clear"] {
                display: none !important;
            }


            /* =================================================
               MOBILE
               ================================================= */

            @media (max-width: 767px) {

                #product-price-info .cart-actions-container {
                    width: 100% !important;
                    max-width: 100% !important;

                    float: none !important;

                    padding: 0 !important;
                }

                #product-price-info
                .cart-actions-container
                .cart-actions {
                    width: 100% !important;
                    max-width: 100% !important;

                    grid-template-columns:
                        100px
                        minmax(0, 1fr) !important;

                    gap: 7px !important;
                }

                #product-price-info
                .cart-quantity-container {
                    width: 100px !important;
                    max-width: 100px !important;
                }

                #product-price-info
                .cart-quantity-container
                .input-group-btn {
                    width: 32px !important;
                    min-width: 32px !important;
                }

                #product-price-info .quantity-subtract,
                #product-price-info .quantity-increase {
                    width: 32px !important;
                    min-width: 32px !important;
                    max-width: 32px !important;
                }

                #product-price-info
                .cart-quantity-field {
                    width: 36px !important;
                    min-width: 36px !important;
                    max-width: 36px !important;
                }

                #product-price-info
                #btn-cart-right
                .btn-cart {
                    font-size: 12px !important;
                    padding: 0 10px !important;
                }

                #product-price-info
                .etraction-comprar-agora {
                    max-width: 100% !important;
                    font-size: 12px !important;
                }

            }

        `;

        document.head.appendChild(style);
    }


    /* =========================================================
       MONTA BLOCO
       ========================================================= */

    function aplicarBloco() {

        const container = document.querySelector(
            '#product-price-info .cart-actions-container'
        );

        if (!container) return;


        /* =====================================================
           REMOVE BOOTSTRAP
           ===================================================== */

        container.classList.remove(
            'col-lg-5',
            'col-md-5',
            'col-sm-5',
            'col-xs-6'
        );


        const cartActions = container.querySelector(
            '.cart-actions'
        );

        if (!cartActions) return;


        const btnContainer = cartActions.querySelector(
            '#btn-cart-right'
        );

        if (!btnContainer) return;


        btnContainer.classList.remove(
            'visible-md',
            'visible-lg'
        );


        const btnCarrinho = btnContainer.querySelector(
            '.btn-cart'
        );

        if (!btnCarrinho) return;


        /* =====================================================
           ALTERA COPY
           ===================================================== */

        const texto = btnCarrinho.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();


        if (
            texto === 'COMPRAR' ||
            texto === 'ADICIONAR' ||
            texto === 'ADICIONAR AO CARRINHO'
        ) {
            btnCarrinho.textContent =
                'ADICIONAR AO CARRINHO';
        }


        btnCarrinho.setAttribute(
            'title',
            'Adicionar ao carrinho'
        );

        btnCarrinho.setAttribute(
            'aria-label',
            'Adicionar ao carrinho'
        );


        /* =====================================================
           CRIA COMPRAR AGORA
           ===================================================== */

        let comprarAgora = cartActions.querySelector(
            '.etraction-comprar-agora'
        );


        if (!comprarAgora) {

            comprarAgora =
                document.createElement('button');

            comprarAgora.type = 'button';

            comprarAgora.className =
                'etraction-comprar-agora';

            comprarAgora.textContent =
                'COMPRAR AGORA';

            comprarAgora.setAttribute(
                'aria-label',
                'Comprar agora'
            );

            cartActions.appendChild(
                comprarAgora
            );
        }


        /* =====================================================
           EVITA DUPLICAR EVENTO
           ===================================================== */

        if (
            comprarAgora.dataset.etractionReady ===
            'true'
        ) {
            return;
        }


        comprarAgora.dataset.etractionReady =
            'true';


        /* =====================================================
           EVENTO COMPRAR AGORA
           ===================================================== */

        comprarAgora.addEventListener(
            'click',
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const botaoOriginal =
                    document.querySelector(
                        '#product-price-info #btn-cart-right .btn-cart'
                    );


                if (!botaoOriginal) return;


                comprarAgora.disabled = true;

                comprarAgora.textContent =
                    'ADICIONANDO...';


                /* =============================================
                   ACIONA O BOTÃO ORIGINAL
                   ============================================= */

                botaoOriginal.click();


                /* =============================================
                   VAI PARA O CARRINHO
                   ============================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            CONFIG.cartUrl;

                    },
                    CONFIG.redirectDelay
                );

            }
        );

    }


    /* =========================================================
       INIT
       ========================================================= */

    function init() {

        inserirEstilos();

        aplicarBloco();

    }


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            init
        );

    } else {

        init();

    }


    /* =========================================================
       OBSERVER
       ========================================================= */

    let timer = null;


    const observer = new MutationObserver(
        function () {

            clearTimeout(timer);

            timer = setTimeout(
                aplicarBloco,
                100
            );

        }
    );


    function iniciarObserver() {

        if (!document.body) {

            setTimeout(
                iniciarObserver,
                100
            );

            return;
        }


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    iniciarObserver();

})();