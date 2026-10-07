(function () {
    'use strict';

    const PRODUTOS_PERMITIDOS = [
        '/ultramel-mel-cru-cremoso-dourado-400g',
        '/ultramel-mel-cru-cremoso-dourado-300g',
        '/ultramel-mel-cru-cremoso-dourado-1kg'
    ];

    const path = window.location.pathname
        .replace(/\/+$/, '')
        .toLowerCase();

    if (!PRODUTOS_PERMITIDOS.includes(path)) {
        return;
    }


    /* =========================================================
       CONFIG
    ========================================================= */

    const CONFIG = {

        blockId:
            'etraction-complete-pedido-pdp',

        styleId:
            'etraction-ultramel-completo-style',

        accessoryUrl:
            '/pegador-de-mel-em-madeira-macica-17cm',

        accessoryName:
            'Adicionar pegador de mel 17 cm',

        fallbackPrice:
            'R$ 16,88',

        cartUrl:
            '/cart/',

        width:
            '500px',

        redirectFallbackDelay:
            2600,

        operationTimeout: 20000
    };


    /* =========================================================
       ESTADO
    ========================================================= */

    const STATE = {

        productData: null,

        productPromise: null,

        accessoryAdded: false,

        accessoryPromise: null,

        bypassNativeClick: false,

        buyNow: {

            active: false,

            submitSeen: false,

            button: null,

            observer: null,

            redirectTimer: null,

            operationTimer: null
        }
    };


    /* =========================================================
       CSS
    ========================================================= */

    const ETRACTION_BOUND_BUY = new WeakSet();
    const ETRACTION_BOUND_BLOCK = new WeakSet();


    /*
     * Lê a quantidade real do carrinho no servidor.
     * Retorna null quando não foi possível ler.
     */
    function getCartQuantityFromServer() {

        return new Promise( function ( resolve ) {

            let settled = false;

            const finish = function ( value ) {

                if ( settled ) {
                    return;
                }

                settled = true;
                resolve( value );
            };

            setTimeout( function () {
                finish( null );
            }, 4000 );

            try {

                window.Uoou.cart.reload( function ( data ) {

                    finish(
                        data && data.cart_quantity !== undefined
                            ? Number( data.cart_quantity )
                            : null
                    );
                } );

            } catch ( error ) {

                finish( null );
            }
        } );
    }


    /*
     * true  = item entrou no carrinho
     * false = confirmado que NAO entrou
     * null  = nao deu para saber
     */
    async function waitForCartGrowth( baseline, timeout ) {

        if ( baseline === null ) {
            return null;
        }

        const deadline = Date.now() + timeout;
        let sawReading = false;

        while ( Date.now() < deadline ) {

            const current = await getCartQuantityFromServer();

            if ( current !== null ) {

                sawReading = true;

                if ( current > baseline ) {
                    return true;
                }
            }

            await new Promise( function ( resolve ) {
                setTimeout( resolve, 350 );
            } );
        }

        return sawReading ? false : null;
    }


    function insertStyles() {

        if (
            document.getElementById(
                CONFIG.styleId
            )
        ) {
            return;
        }


        const style =
            document.createElement('style');


        style.id =
            CONFIG.styleId;


        style.textContent = `

            /* =================================================
               COMPLETE SEU PEDIDO
            ================================================= */

            #${CONFIG.blockId} {

                width:
                    100% !important;

                max-width:
                    calc( ${CONFIG.width} + 30px ) !important;

                margin:
                    14px 0 18px !important;

                /*
                 * O bloco vive dentro de um .row
                 * com margin 0 -15px, que anula o
                 * padding da coluna. Esse padding
                 * devolve o alinhamento.
                 */
                padding:
                    0 15px !important;

                box-sizing:
                    border-box !important;

                font-family:
                    inherit !important;
            }


            #${CONFIG.blockId} * {

                box-sizing:
                    border-box !important;
            }


            /* =================================================
               TÍTULO
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__title {

                margin:
                    0 0 8px !important;

                color:
                    #332d26 !important;

                font-size:
                    13px !important;

                font-weight:
                    600 !important;

                line-height:
                    1.3 !important;
            }


            /* =================================================
               CARD
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__card {

                display:
                    grid !important;

                grid-template-columns:
                    32px
                    72px
                    minmax(0, 1fr)
                    auto !important;

                align-items:
                    center !important;

                gap:
                    10px !important;

                width:
                    100% !important;

                min-height:
                    96px !important;

                padding:
                    11px 14px !important;

                background:
                    #fff !important;

                border:
                    1px solid #e5d2ad !important;

                border-radius:
                    8px !important;

                cursor:
                    pointer !important;

                transition:
                    border-color .2s ease,
                    background-color .2s ease,
                    box-shadow .2s ease !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__card:hover {

                border-color:
                    #d8bd89 !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__card.is-selected {

                background:
                    #f7faf7 !important;

                border-color:
                    #6f9a7e !important;

                box-shadow:
                    0 0 0 1px
                    rgba(71, 121, 93, .08) !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__card.is-loading {

                opacity:
                    .72 !important;
            }


            /* =================================================
               CHECK
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__check-wrap {

                position:
                    relative !important;

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    32px !important;

                height:
                    32px !important;

                margin:
                    0 !important;

                cursor:
                    pointer !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check {

                position:
                    absolute !important;

                width:
                    1px !important;

                height:
                    1px !important;

                opacity:
                    0 !important;

                pointer-events:
                    none !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check-ui {

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    20px !important;

                height:
                    20px !important;

                background:
                    #fff !important;

                border:
                    1.5px solid #bcae99 !important;

                border-radius:
                    5px !important;

                transition:
                    .18s ease !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check-svg {

                display:
                    block !important;

                width:
                    12px !important;

                height:
                    12px !important;

                opacity:
                    0 !important;

                transform:
                    scale(.65) !important;

                transition:
                    .15s ease !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check-svg path {

                fill:
                    none !important;

                stroke:
                    #fff !important;

                stroke-width:
                    2.4 !important;

                stroke-linecap:
                    round !important;

                stroke-linejoin:
                    round !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check:checked
            +
            .etraction-complete__check-ui {

                background:
                    #47795d !important;

                border-color:
                    #47795d !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__check:checked
            +
            .etraction-complete__check-ui
            .etraction-complete__check-svg {

                opacity:
                    1 !important;

                transform:
                    scale(1) !important;
            }


            /* =================================================
               IMAGEM
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__image-link {

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    72px !important;

                height:
                    72px !important;

                overflow:
                    hidden !important;

                background:
                    #faf8f3 !important;

                border-radius:
                    8px !important;

                text-decoration:
                    none !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__image {

                display:
                    block !important;

                width:
                    100% !important;

                height:
                    100% !important;

                padding:
                    6px !important;

                object-fit:
                    contain !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__placeholder {

                color:
                    #a09a90 !important;

                font-size:
                    9px !important;

                text-align:
                    center !important;
            }


            /* =================================================
               INFO
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__info {

                display:
                    flex !important;

                flex-direction:
                    column !important;

                justify-content:
                    center !important;

                min-width:
                    0 !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__eyebrow {

                display:
                    block !important;

                margin:
                    0 0 4px !important;

                color:
                    #47795d !important;

                font-size:
                    8px !important;

                font-weight:
                    700 !important;

                letter-spacing:
                    1px !important;

                text-transform:
                    uppercase !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__name {

                display:
                    block !important;

                margin:
                    0 !important;

                color:
                    #332d26 !important;

                font-size:
                    13px !important;

                font-weight:
                    600 !important;

                line-height:
                    1.25 !important;

                text-decoration:
                    none !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__description {

                display:
                    block !important;

                margin:
                    4px 0 0 !important;

                color:
                    #8a837a !important;

                font-size:
                    10px !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__feedback {

                display:
                    none !important;

                margin:
                    5px 0 0 !important;

                color:
                    #47795d !important;

                font-size:
                    9px !important;

                font-weight:
                    600 !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__feedback.is-visible {

                display:
                    block !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__feedback.is-error {

                color:
                    #a34f4f !important;
            }


            /* =================================================
               PREÇO
            ================================================= */

            #${CONFIG.blockId}
            .etraction-complete__price {

                display:
                    flex !important;

                flex-direction:
                    column !important;

                align-items:
                    flex-end !important;

                justify-content:
                    center !important;

                min-width:
                    95px !important;

                text-align:
                    right !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__price-label {

                display:
                    block !important;

                margin:
                    0 0 4px !important;

                color:
                    #928b82 !important;

                font-size:
                    8px !important;

                white-space:
                    nowrap !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__price-value {

                display:
                    block !important;

                color:
                    #47795d !important;

                font-size:
                    18px !important;

                font-weight:
                    700 !important;

                white-space:
                    nowrap !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__price-value::before {

                content:
                    '+ ' !important;
            }


            #${CONFIG.blockId}
            .etraction-complete__helper {

                margin:
                    7px 0 0 !important;

                color:
                    #8c857b !important;

                font-size:
                    9px !important;
            }


            /* =================================================
               BLOCO DE COMPRA
            ================================================= */

            #product-price-info
            .cart-actions-container {

                width:
                    calc( ${CONFIG.width} + 30px ) !important;

                max-width:
                    calc( ${CONFIG.width} + 30px ) !important;

                float:
                    none !important;

                flex:
                    none !important;

                margin:
                    0 !important;

                box-sizing:
                    border-box !important;

                /*
                 * Compensa o margin -15px do .row
                 * para alinhar com o resto da coluna.
                 */
                padding:
                    0 15px !important;
            }


            #product-price-info
            .cart-actions-container
            .cart-actions {

                display:
                    grid !important;

                grid-template-columns:
                    110px
                    minmax(0, 1fr) !important;

                gap:
                    8px !important;

                width:
                    100% !important;

                max-width:
                    ${CONFIG.width} !important;

                margin:
                    0 !important;

                padding:
                    0 !important;

                align-items:
                    stretch !important;
            }


            #product-price-info
            .cart-actions-container
            .in-stock-label {

                display:
                    none !important;
            }


            /* =================================================
               QUANTIDADE
            ================================================= */

            #product-price-info
            .cart-quantity-container {

                width:
                    110px !important;

                max-width:
                    110px !important;

                margin:
                    0 !important;

                padding:
                    0 !important;
            }


            #product-price-info
            .cart-quantity-container
            .form-group {

                width:
                    100% !important;

                margin:
                    0 !important;

                padding:
                    0 !important;
            }


            #product-price-info
            .cart-quantity-container
            .input-group {

                display:
                    flex !important;

                width:
                    100% !important;

                height:
                    42px !important;

                margin:
                    0 !important;
            }


            #product-price-info
            .cart-quantity-container
            .input-group-btn {

                display:
                    flex !important;

                width:
                    36px !important;

                min-width:
                    36px !important;

                height:
                    42px !important;
            }


            #product-price-info
            .quantity-subtract,

            #product-price-info
            .quantity-increase {

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    36px !important;

                min-width:
                    36px !important;

                max-width:
                    36px !important;

                height:
                    42px !important;

                padding:
                    0 !important;

                margin:
                    0 !important;

                background:
                    #fff !important;

                border:
                    1px solid #777 !important;

                border-radius:
                    0 !important;

                box-shadow:
                    none !important;

                color:
                    #e1ae43 !important;

                font-size:
                    12px !important;
            }


            #product-price-info
            .quantity-subtract {

                border-radius:
                    3px 0 0 3px !important;

                border-right:
                    0 !important;
            }


            #product-price-info
            .quantity-increase {

                border-radius:
                    0 3px 3px 0 !important;

                border-left:
                    0 !important;
            }


            #product-price-info
            .cart-quantity-field {

                width:
                    38px !important;

                min-width:
                    38px !important;

                max-width:
                    38px !important;

                height:
                    42px !important;

                padding:
                    0 !important;

                margin:
                    0 !important;

                background:
                    #fff !important;

                border:
                    1px solid #777 !important;

                border-radius:
                    0 !important;

                box-shadow:
                    none !important;

                color:
                    #555 !important;

                font-size:
                    14px !important;

                font-weight:
                    500 !important;

                text-align:
                    center !important;
            }


            /* =================================================
               ADICIONAR AO CARRINHO
            ================================================= */

            #product-price-info
            #btn-cart-right {

                display:
                    block !important;

                visibility:
                    visible !important;

                width:
                    100% !important;

                max-width:
                    none !important;

                height:
                    42px !important;

                float:
                    none !important;

                margin:
                    0 !important;

                padding:
                    0 !important;
            }


            #product-price-info
            #btn-cart-right
            .btn-cart {

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    100% !important;

                height:
                    42px !important;

                margin:
                    0 !important;

                padding:
                    0 20px !important;

                background:
                    #44795d !important;

                border:
                    1px solid #44795d !important;

                border-radius:
                    3px !important;

                box-shadow:
                    none !important;

                color:
                    #fff !important;

                font-family:
                    inherit !important;

                font-size:
                    13px !important;

                font-weight:
                    700 !important;

                text-transform:
                    uppercase !important;

                white-space:
                    nowrap !important;

                animation:
                    none !important;

                transform:
                    none !important;
            }


            /* =================================================
               COMPRAR AGORA
            ================================================= */

            #product-price-info
            .etraction-comprar-agora {

                grid-column:
                    1 / -1 !important;

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                width:
                    100% !important;

                max-width:
                    ${CONFIG.width} !important;

                height:
                    40px !important;

                margin:
                    0 !important;

                padding:
                    0 20px !important;

                background:
                    #fff !important;

                border:
                    1px solid #44795d !important;

                border-radius:
                    3px !important;

                color:
                    #44795d !important;

                cursor:
                    pointer !important;

                font-family:
                    inherit !important;

                font-size:
                    13px !important;

                font-weight:
                    700 !important;

                text-transform:
                    uppercase !important;
            }


            #product-price-info
            .etraction-comprar-agora:hover {

                background:
                    #44795d !important;

                color:
                    #fff !important;
            }


            #product-price-info
            .etraction-comprar-agora:disabled {

                opacity:
                    .65 !important;

                cursor:
                    wait !important;
            }


            #product-price-info
            .cart-actions
            > div[style*="clear"] {

                display:
                    none !important;
            }


            /* =================================================
               MOBILE
            ================================================= */

            @media (max-width: 767px) {

                #${CONFIG.blockId} {

                    max-width:
                        100% !important;

                    margin:
                        12px 0 14px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__card {

                    grid-template-columns:
                        28px
                        58px
                        minmax(0, 1fr)
                        auto !important;

                    gap:
                        7px !important;

                    min-height:
                        82px !important;

                    padding:
                        9px 10px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__check-wrap {

                    width:
                        28px !important;

                    height:
                        28px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__check-ui {

                    width:
                        18px !important;

                    height:
                        18px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__image-link {

                    width:
                        58px !important;

                    height:
                        62px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__name {

                    font-size:
                        11px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__description {

                    font-size:
                        9px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__price {

                    min-width:
                        70px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__price-value {

                    font-size:
                        14px !important;
                }


                #product-price-info
                .cart-actions-container {

                    width:
                        100% !important;

                    max-width:
                        100% !important;
                }


                #product-price-info
                .cart-actions-container
                .cart-actions {

                    grid-template-columns:
                        100px
                        minmax(0, 1fr) !important;

                    gap:
                        7px !important;

                    max-width:
                        100% !important;
                }


                #product-price-info
                .cart-quantity-container {

                    width:
                        100px !important;

                    max-width:
                        100px !important;
                }


                #product-price-info
                .cart-quantity-container
                .input-group-btn,

                #product-price-info
                .quantity-subtract,

                #product-price-info
                .quantity-increase {

                    width:
                        32px !important;

                    min-width:
                        32px !important;

                    max-width:
                        32px !important;
                }


                #product-price-info
                .cart-quantity-field {

                    width:
                        36px !important;

                    min-width:
                        36px !important;

                    max-width:
                        36px !important;
                }


                #product-price-info
                #btn-cart-right
                .btn-cart,

                #product-price-info
                .etraction-comprar-agora {

                    font-size:
                        12px !important;
                }
            }


            @media (max-width: 390px) {

                #${CONFIG.blockId}
                .etraction-complete__card {

                    grid-template-columns:
                        24px
                        54px
                        minmax(0, 1fr) !important;

                    grid-template-areas:
                        "check image info"
                        "check image price";

                    gap:
                        5px 7px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__check-wrap {

                    grid-area:
                        check !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__image-link {

                    grid-area:
                        image !important;

                    width:
                        54px !important;

                    height:
                        58px !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__info {

                    grid-area:
                        info !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__price {

                    grid-area:
                        price !important;

                    align-items:
                        flex-start !important;

                    min-width:
                        0 !important;

                    text-align:
                        left !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__price-label {

                    display:
                        none !important;
                }


                #${CONFIG.blockId}
                .etraction-complete__price-value {

                    font-size:
                        13px !important;
                }
            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =========================================================
       CRIA COMPLETE SEU PEDIDO
    ========================================================= */

    function createCompleteBlock() {

        const wrapper =
            document.createElement('div');


        wrapper.id =
            CONFIG.blockId;


        wrapper.innerHTML = `

            <div class="etraction-complete__title">
                Complete seu pedido
            </div>


            <div class="etraction-complete__card">

                <label class="etraction-complete__check-wrap">

                    <input
                        type="checkbox"
                        class="etraction-complete__check"
                        aria-label="${CONFIG.accessoryName}"
                    >

                    <span class="etraction-complete__check-ui">

                        <svg
                            class="etraction-complete__check-svg"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >

                            <path
                                d="M3 8.2L6.4 11.5L13 4.8"
                            ></path>

                        </svg>

                    </span>

                </label>


                <a
                    href="${CONFIG.accessoryUrl}"
                    class="etraction-complete__image-link"
                    target="_blank"
                    rel="noopener"
                >

                    <span class="etraction-complete__placeholder">
                        Carregando...
                    </span>

                </a>


                <div class="etraction-complete__info">

                    <span class="etraction-complete__eyebrow">
                        COMBINE COM SEU MEL
                    </span>

                    <a
                        href="${CONFIG.accessoryUrl}"
                        class="etraction-complete__name"
                        target="_blank"
                        rel="noopener"
                    >
                        ${CONFIG.accessoryName}
                    </a>

                    <span class="etraction-complete__description">
                        Fabricado em madeira
                    </span>

                    <span
                        class="etraction-complete__feedback"
                    ></span>

                </div>


                <div class="etraction-complete__price">

                    <span class="etraction-complete__price-label">
                        Adicione por
                    </span>

                    <strong
                        class="etraction-complete__price-value"
                    >
                        ${CONFIG.fallbackPrice}
                    </strong>

                </div>

            </div>


            <div class="etraction-complete__helper">
                Marque a opção para incluir o acessório no pedido.
            </div>

        `;


        return wrapper;
    }


    /* =========================================================
       HELPERS
    ========================================================= */

    function getBlock() {

        return document.getElementById(
            CONFIG.blockId
        );
    }


    function isAccessorySelected() {

        const block =
            getBlock();


        const checkbox =
            block &&
            block.querySelector(
                '.etraction-complete__check'
            );


        return !!(
            checkbox &&
            checkbox.checked
        );
    }


    function setAccessoryFeedback(
        text,
        error
    ) {

        const block =
            getBlock();


        if (!block) {
            return;
        }


        const feedback =
            block.querySelector(
                '.etraction-complete__feedback'
            );


        const card =
            block.querySelector(
                '.etraction-complete__card'
            );


        if (card) {

            card.classList.toggle(
                'is-loading',
                text ===
                'Incluindo o acessório...'
            );
        }


        if (!feedback) {
            return;
        }


        feedback.textContent =
            text || '';


        feedback.classList.toggle(
            'is-visible',
            !!text
        );


        feedback.classList.toggle(
            'is-error',
            !!error
        );
    }


    /* =========================================================
       PEGA DADOS DO PEGADOR
    ========================================================= */

    async function getProductData() {

        if (STATE.productData) {

            return STATE.productData;
        }


        if (STATE.productPromise) {

            return STATE.productPromise;
        }


        STATE.productPromise =
            (
                async function () {

                    const response =
                        await fetch(
                            CONFIG.accessoryUrl +
                            '?etraction_crosssell=' +
                            Date.now(),
                            {
                                method:
                                    'GET',

                                credentials:
                                    'same-origin',

                                cache:
                                    'no-store'
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            'Não foi possível carregar o pegador.'
                        );
                    }


                    const html =
                        await response.text();


                    const doc =
                        new DOMParser()
                            .parseFromString(
                                html,
                                'text/html'
                            );


                    const form =
                        doc.querySelector(
                            '#product-variant-form'
                        );


                    if (!form) {

                        throw new Error(
                            'Formulário do pegador não encontrado.'
                        );
                    }


                    const action =
                        form.getAttribute(
                            'action'
                        );


                    if (!action) {

                        throw new Error(
                            'Endpoint do pegador não encontrado.'
                        );
                    }


                    const entries =
                        [];


                    form.querySelectorAll(
                        'input[name], select[name], textarea[name]'
                    )
                    .forEach(
                        function (
                            control
                        ) {

                            if (
                                control.disabled
                            ) {
                                return;
                            }


                            if (
                                (
                                    control.type ===
                                    'checkbox' ||

                                    control.type ===
                                    'radio'
                                ) &&

                                !control.checked
                            ) {
                                return;
                            }


                            entries.push({
                                name:
                                    control.name,

                                value:
                                    control.value
                            });
                        }
                    );


                    /* QUANTIDADE */

                    let quantityFound =
                        false;


                    entries.forEach(
                        function (
                            entry
                        ) {

                            if (
                                entry.name ===
                                'sylius_cart_item[quantity]' ||

                                entry.name.indexOf(
                                    '[quantity]'
                                ) !== -1
                            ) {

                                entry.value =
                                    '1';


                                quantityFound =
                                    true;
                            }
                        }
                    );


                    if (!quantityFound) {

                        entries.push({

                            name:
                                'sylius_cart_item[quantity]',

                            value:
                                '1'
                        });
                    }


                    /* IMAGEM */

                    let image =
                        '';


                    const ogImage =
                        doc.querySelector(
                            'meta[property="og:image"]'
                        );


                    if (ogImage) {

                        image =
                            ogImage.getAttribute(
                                'content'
                            ) || '';
                    }


                    if (!image) {

                        const img =

                            doc.querySelector(
                                '#gallery-image-and-product-options img'
                            ) ||

                            doc.querySelector(
                                'img[itemprop="image"]'
                            );


                        if (img) {

                            image =

                                img.getAttribute(
                                    'src'
                                ) ||

                                img.getAttribute(
                                    'data-src'
                                ) ||

                                '';
                        }
                    }


                    /* PREÇO */

                    let price =
                        CONFIG.fallbackPrice;


                    const priceElement =

                        doc.querySelector(
                            '[data-is-available="true"] .pv-price-sale'
                        ) ||

                        doc.querySelector(
                            '.pv-price-sale'
                        ) ||

                        doc.querySelector(
                            '.price-sales'
                        );


                    if (priceElement) {

                        const value =

                            priceElement
                                .textContent
                                .replace(
                                    /\s+/g,
                                    ' '
                                )
                                .trim();


                        if (value) {

                            price =
                                value;
                        }
                    }


                    STATE.productData = {

                        action:
                            action,

                        method:
                            (
                                form.getAttribute(
                                    'method'
                                ) ||
                                'POST'
                            )
                            .toUpperCase(),

                        entries:
                            entries,

                        image:
                            image,

                        price:
                            price
                    };


                    return STATE.productData;
                }
            )();


        try {

            return await STATE.productPromise;

        } catch (error) {

            STATE.productPromise =
                null;


            throw error;
        }
    }


    /* =========================================================
       CARREGA VISUAL
    ========================================================= */

    async function loadVisualData() {

        try {

            const data =
                await getProductData();


            const block =
                getBlock();


            if (!block) {
                return;
            }


            const price =
                block.querySelector(
                    '.etraction-complete__price-value'
                );


            const image =
                block.querySelector(
                    '.etraction-complete__image-link'
                );


            if (
                price &&
                data.price
            ) {

                price.textContent =
                    data.price;
            }


            if (
                image &&
                data.image
            ) {

                image.innerHTML =

                    '<img src="' +
                    data.image +
                    '" alt="' +
                    CONFIG.accessoryName +
                    '" class="etraction-complete__image">';
            }

        } catch (error) {

            console.warn(
                '[eTraction Complete Pedido]',
                error
            );
        }
    }


    /* =========================================================
       GARANTE QUE ACESSÓRIO ENTROU NO CARRINHO

       ESTA É A PARTE PRINCIPAL DA CORREÇÃO.
    ========================================================= */

    async function ensureAccessoryAdded() {

        if (
            !isAccessorySelected()
        ) {

            return true;
        }


        if (
            STATE.accessoryAdded
        ) {

            return true;
        }


        if (
            STATE.accessoryPromise
        ) {

            return STATE.accessoryPromise;
        }


        setAccessoryFeedback(
            'Incluindo o acessório...',
            false
        );


        STATE.accessoryPromise =
            (
                async function () {

                    const data =
                        await getProductData();


                    const formData =
                        new FormData();


                    data.entries.forEach(
                        function (
                            entry
                        ) {

                            formData.append(
                                entry.name,
                                entry.value
                            );
                        }
                    );


                    const url =
                        new URL(
                            data.action,
                            window.location.origin
                        )
                        .href;


                    /*
                     * NÃO USA SENDBEACON.
                     *
                     * Precisamos ESPERAR a resposta
                     * para garantir que o pegador
                     * realmente entrou no carrinho.
                     */

                    const response =
                        await fetch(
                            url,
                            {
                                method:
                                    data.method,

                                body:
                                    formData,

                                credentials:
                                    'same-origin',

                                redirect:
                                    'follow',

                                cache:
                                    'no-store'
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            'Erro HTTP ' +
                            response.status
                        );
                    }


                    STATE.accessoryAdded =
                        true;


                    setAccessoryFeedback(
                        'Acessório incluído ✓',
                        false
                    );


                    return true;
                }
            )();


        try {

            return await STATE.accessoryPromise;

        } catch (error) {

            STATE.accessoryAdded =
                false;


            setAccessoryFeedback(
                'Não foi possível incluir o acessório.',
                true
            );


            console.error(
                '[eTraction Upsell]',
                error
            );


            throw error;

        } finally {

            STATE.accessoryPromise =
                null;
        }
    }


    /* =========================================================
       CHECKBOX
    ========================================================= */

    function bindCompleteBlock(
        block
    ) {

        if (
            !block ||
            ETRACTION_BOUND_BLOCK.has( block )
        ) {

            return;
        }


        ETRACTION_BOUND_BLOCK.add( block );

        block.dataset.etractionBound =
            'true';


        const checkbox =
            block.querySelector(
                '.etraction-complete__check'
            );


        const card =
            block.querySelector(
                '.etraction-complete__card'
            );


        const helper =
            block.querySelector(
                '.etraction-complete__helper'
            );


        if (
            !checkbox ||
            !card
        ) {

            return;
        }


        checkbox.addEventListener(
            'change',
            function () {

                /*
                 * Mudou a seleção:
                 * permite adicionar novamente.
                 */

                STATE.accessoryAdded =
                    false;


                STATE.accessoryPromise =
                    null;


                card.classList.toggle(
                    'is-selected',
                    checkbox.checked
                );


                card.classList.remove(
                    'is-loading'
                );


                setAccessoryFeedback(
                    checkbox.checked
                        ?
                        'Será adicionado junto ao seu produto.'
                        :
                        '',
                    false
                );


                if (helper) {

                    helper.textContent =
                        checkbox.checked
                            ?
                            'Desmarque caso não queira incluir o acessório.'
                            :
                            'Marque a opção para incluir o acessório no pedido.';
                }


                if (
                    checkbox.checked
                ) {

                    /*
                     * Pré-carrega os dados.
                     */

                    getProductData()
                        .catch(
                            function () {}
                        );
                }
            }
        );


        card.addEventListener(
            'click',
            function (
                event
            ) {

                if (
                    event.target.closest(
                        'a'
                    ) ||

                    event.target.closest(
                        '.etraction-complete__check-wrap'
                    )
                ) {

                    return;
                }


                checkbox.checked =
                    !checkbox.checked;


                checkbox.dispatchEvent(
                    new Event(
                        'change',
                        {
                            bubbles:
                                true
                        }
                    )
                );
            }
        );
    }


    /* =========================================================
       COMPRAR AGORA - HELPERS
    ========================================================= */

    function clearBuyNowTimers() {

        const b =
            STATE.buyNow;


        if (
            b.redirectTimer
        ) {

            clearTimeout(
                b.redirectTimer
            );
        }


        if (
            b.operationTimer
        ) {

            clearTimeout(
                b.operationTimer
            );
        }


        if (
            b.observer
        ) {

            b.observer.disconnect();
        }


        b.redirectTimer =
            null;


        b.operationTimer =
            null;


        b.observer =
            null;
    }


    function resetBuyNow() {

        const b =
            STATE.buyNow;


        clearBuyNowTimers();


        b.active =
            false;


        b.submitSeen =
            false;


        if (
            b.button
        ) {

            b.button.disabled =
                false;


            b.button.textContent =
                'COMPRAR AGORA';
        }


        b.button =
            null;
    }


    function goToCart() {

        const b =
            STATE.buyNow;


        if (
            !b.active
        ) {

            return;
        }


        clearBuyNowTimers();


        if (
            b.button
        ) {

            b.button.textContent =
                'REDIRECIONANDO...';
        }


        b.active =
            false;


        window.location.href =
            CONFIG.cartUrl;
    }


    function isVisible(
        element
    ) {

        if (!element) {
            return false;
        }


        const style =
            window.getComputedStyle(
                element
            );


        if (
            style.display ===
            'none' ||

            style.visibility ===
            'hidden' ||

            parseFloat(
                style.opacity ||
                '1'
            ) === 0
        ) {

            return false;
        }


        const rect =
            element.getBoundingClientRect();


        return (
            rect.width > 0 ||
            rect.height > 0
        );
    }


    function hasPurchaseSuccess() {

        const selectors = [

            '.popup-adicionado-ao-carrinho.swal2-show',

            '.swal2-popup.popup-adicionado-ao-carrinho',

            '.swal2-popup.swal2-show .swal2-success',

            '.swal2-popup.swal2-show .swal2-icon-success',

            '.minicart-modal.show',

            '.minicart-modal.active',

            '.minicart-modal.is-open',

            '.minicart-modal.open',

            '.minicart-modal[aria-hidden="false"]'
        ];


        return selectors.some(
            function (
                selector
            ) {

                return isVisible(
                    document.querySelector(
                        selector
                    )
                );
            }
        );
    }


    function startSuccessObserver() {

        const b =
            STATE.buyNow;


        if (
            b.observer
        ) {

            b.observer.disconnect();
        }


        b.observer =
            new MutationObserver(
                function () {

                    if (
                        !b.active ||
                        !b.submitSeen
                    ) {

                        return;
                    }


                    if (
                        hasPurchaseSuccess()
                    ) {

                        setTimeout(
                            goToCart,
                            180
                        );
                    }
                }
            );


        b.observer.observe(
            document.body,
            {
                childList:
                    true,

                subtree:
                    true,

                attributes:
                    true,

                attributeFilter: [
                    'class',
                    'style',
                    'aria-hidden'
                ]
            }
        );
    }


    /* =========================================================
       OBSERVA SUBMIT PRINCIPAL

       NÃO CANCELA O SUBMIT.
    ========================================================= */

    document.addEventListener(
        'submit',
        function (
            event
        ) {

            const b =
                STATE.buyNow;


            if (
                !b.active
            ) {

                return;
            }


            if (
                !event.target ||

                event.target.id !==
                'product-variant-form'
            ) {

                return;
            }


            b.submitSeen =
                true;


            if (
                b.button
            ) {

                b.button.textContent =
                    'FINALIZANDO...';
            }


            if (
                b.redirectTimer
            ) {

                clearTimeout(
                    b.redirectTimer
                );
            }


            /*
             * Caso as classes do popup mudem,
             * existe fallback para /cart/.
             */

            b.redirectTimer =
                null;


            /* redirect imediato removido */

        },
        true
    );


    /* =========================================================
       ADICIONAR AO CARRINHO NATIVO

       SE COMPLETE ESTIVER MARCADO:
       1. segura apenas o primeiro clique
       2. adiciona pegador
       3. espera concluir
       4. refaz o clique nativo
    ========================================================= */

    document.addEventListener(
        'click',
        function (
            event
        ) {

            const nativeButton =
                event.target.closest(
                    '#product-price-info ' +
                    '#btn-cart-right ' +
                    '.btn-cart'
                );


            if (
                !nativeButton
            ) {

                return;
            }


            /*
             * Este é o clique disparado por nós
             * depois que o acessório já entrou.
             *
             * Deixa a Magazord trabalhar
             * normalmente.
             */

            if (
                STATE.bypassNativeClick
            ) {

                STATE.bypassNativeClick =
                    false;


                return;
            }


            /*
             * Sem acessório:
             * 100% nativo.
             */

            if (
                !isAccessorySelected() ||

                STATE.accessoryAdded
            ) {

                return;
            }


            /*
             * Só seguramos o primeiro clique.
             */

            event.preventDefault();

            event.stopImmediatePropagation();


            const oldDisabled =
                nativeButton.disabled;


            nativeButton.disabled =
                true;


            ensureAccessoryAdded()

                .catch(
                    function () {

                        /*
                         * Se o pegador falhar,
                         * NÃO bloqueia o produto principal.
                         */
                    }
                )

                .finally(
                    function () {

                        nativeButton.disabled =
                            oldDisabled;


                        STATE.bypassNativeClick =
                            true;


                        /*
                         * AGORA executa o clique
                         * verdadeiro da Magazord.
                         */

                        nativeButton.click();
                    }
                );

        },
        true
    );


    /* =========================================================
       COMPRAR AGORA
    ========================================================= */

    async function startBuyNow(
        button,
        nativeButton
    ) {

        const b =
            STATE.buyNow;


        if (
            b.active
        ) {

            return;
        }


        b.active =
            true;


        b.submitSeen =
            false;


        b.button =
            button;


        button.disabled =
            true;


        button.textContent =
            isAccessorySelected()
                ?
                'INCLUINDO ACESSÓRIO...'
                :
                'ADICIONANDO...';


        /*
         * =====================================================
         * PONTO PRINCIPAL:
         *
         * Se Complete seu pedido estiver marcado,
         * ESPERA o pegador entrar ANTES de adicionar
         * o mel.
         * =====================================================
         */

        try {

            if (
                isAccessorySelected()
            ) {

                await ensureAccessoryAdded();
            }

        } catch (error) {

            /*
             * Não trava a compra do mel.
             */
        }


        if (
            !b.active
        ) {

            return;
        }


        button.textContent =
            'ADICIONANDO...';


        /* startSuccessObserver() desativado. */


        b.operationTimer = setTimeout(
            function () {

                if (
                    b.active &&
                    !b.submitSeen
                ) {

                    resetBuyNow();
                }
            },
            CONFIG.operationTimeout
        );


        /*
         * Quantidade ANTES de adicionar o mel.
         */
        const baseline =
            await getCartQuantityFromServer();


        /*
         * Re-busca o botao nativo: o tema
         * re-renderiza esse bloco o tempo todo.
         */
        const freshNative =
            document.querySelector(
                '#product-price-info ' +
                '#btn-cart-right ' +
                '.btn-cart'
            ) || nativeButton;


        /*
         * Acessorio ja processado: deixa
         * passar o clique nativo.
         */
        STATE.bypassNativeClick = true;

        freshNative.click();


        /*
         * So redireciona quando o carrinho
         * realmente cresceu no servidor.
         */
        const grew =
            await waitForCartGrowth(
                baseline,
                15000
            );

        if ( !b.active ) {
            return;
        }

        if ( grew === false ) {

            resetBuyNow();

            setAccessoryFeedback(
                'Não foi possível adicionar. Tente novamente.',
                true
            );

            return;
        }

        goToCart();
    }


    /* =========================================================
       MONTA BOTÕES
    ========================================================= */

    function applyBuyButtons() {

        const container =
            document.querySelector(
                '#product-price-info ' +
                '.cart-actions-container'
            );


        if (!container) {
            return;
        }


        container.classList.remove(
            'col-lg-5',
            'col-md-5',
            'col-sm-5',
            'col-xs-6'
        );


        const actions =
            container.querySelector(
                '.cart-actions'
            );


        if (!actions) {
            return;
        }


        const btnContainer =
            actions.querySelector(
                '#btn-cart-right'
            );


        if (!btnContainer) {
            return;
        }


        btnContainer.classList.remove(
            'visible-md',
            'visible-lg'
        );


        const nativeButton =
            btnContainer.querySelector(
                '.btn-cart'
            );


        if (!nativeButton) {
            return;
        }


        const text =
            nativeButton
                .textContent
                .replace(
                    /\s+/g,
                    ' '
                )
                .trim()
                .toUpperCase();


        if (
            text === 'COMPRAR' ||

            text === 'ADICIONAR' ||

            text ===
            'ADICIONAR AO CARRINHO'
        ) {

            nativeButton.textContent =
                'ADICIONAR AO CARRINHO';
        }


        /* =====================================================
           BOTÃO COMPRAR AGORA
        ===================================================== */

        let buyNow =
            actions.querySelector(
                '.etraction-comprar-agora'
            );


        if (!buyNow) {

            buyNow =
                document.createElement(
                    'button'
                );


            buyNow.type =
                'button';


            buyNow.className =
                'etraction-comprar-agora';


            buyNow.textContent =
                'COMPRAR AGORA';


            buyNow.setAttribute(
                'aria-label',
                'Comprar agora'
            );


            actions.appendChild(
                buyNow
            );
        }


        buyNow.dataset.etractionReady =
            'true';
    }


    /* =========================================================
       INSERE COMPLETE SEU PEDIDO
    ========================================================= */

    function insertCompleteBlock() {
        const target = document.querySelector('#product-price-info');

        if (!target) return;

        let block = getBlock();
        const isNew = !block;

        if (isNew) {
            block = createCompleteBlock();
        }

        if (target.nextElementSibling !== block) {
            target.insertAdjacentElement('afterend', block);
        }

        bindCompleteBlock(block);

        if (isNew) {
            loadVisualData();
        }
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        insertStyles();

        insertCompleteBlock();

        applyBuyButtons();
    }


    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            init,
            {
                once:
                    true
            }
        );

    } else {

        init();
    }


    /* =========================================================
       OBSERVER MAGAZORD
    ========================================================= */

    let mutationTimer =
        null;

    let lastSync =
        0;

    /*
     * O tema muta o DOM a cada ~100ms.
     * Um debounce puro nunca dispara, entao
     * aqui existe um teto de 400ms.
     */
    function syncEtractionBlocks() {

        lastSync = Date.now();

        insertCompleteBlock();

        applyBuyButtons();
    }


    const observer =
        new MutationObserver(
            function () {

                clearTimeout(
                    mutationTimer
                );


                if (
                    Date.now() - lastSync > 400
                ) {

                    syncEtractionBlocks();

                    return;
                }


                mutationTimer =
                    setTimeout(
                        syncEtractionBlocks,
                        120
                    );
            }
        );


    function startObserver() {

        if (!document.body) {

            setTimeout(
                startObserver,
                100
            );


            return;
        }


        observer.observe(
            document.body,
            {
                childList:
                    true,

                subtree:
                    true
            }
        );
    }

    /*
     * Delegacao: o tema recria os botoes,
     * entao o clique NAO pode depender de
     * listener preso a um no especifico.
     */
    document.addEventListener(
        'click',
        function ( event ) {

            const buyNow =
                event.target.closest &&
                event.target.closest(
                    '.etraction-comprar-agora'
                );

            if ( !buyNow ) {
                return;
            }

            event.preventDefault();

            event.stopPropagation();


            const currentNativeButton =
                document.querySelector(
                    '#product-price-info ' +
                    '#btn-cart-right ' +
                    '.btn-cart'
                );

            if ( !currentNativeButton ) {
                return;
            }

            startBuyNow(
                buyNow,
                currentNativeButton
            );
        },
        true
    );

    /*
     * Voltar pelo historico (bfcache) restaura
     * a pagina com o STATE congelado: o botao
     * fica disabled em "REDIRECIONANDO...".
     * Aqui o estado volta ao inicial.
     */
    window.addEventListener(
        'pageshow',
        function () {

            resetBuyNow();


            /*
             * Numa restauracao de bfcache o STATE
             * volta congelado. Sem isso,
             * accessoryAdded continua true e o
             * pegador NAO e adicionado de novo
             * mesmo com o checkbox marcado.
             */
            STATE.accessoryAdded = false;

            STATE.accessoryPromise = null;

            STATE.bypassNativeClick = false;


            const checkbox =
                document.querySelector(
                    '#' + CONFIG.blockId +
                    ' .etraction-complete__check'
                );

            if ( checkbox ) {

                setAccessoryFeedback(
                    checkbox.checked
                        ? 'Será adicionado junto ao seu produto.'
                        : '',
                    false
                );
            }


            const buyNow =
                document.querySelector(
                    '.etraction-comprar-agora'
                );

            if ( buyNow ) {

                buyNow.disabled = false;

                buyNow.textContent =
                    'COMPRAR AGORA';
            }


            syncEtractionBlocks();
        }
    );


    startObserver();

})();