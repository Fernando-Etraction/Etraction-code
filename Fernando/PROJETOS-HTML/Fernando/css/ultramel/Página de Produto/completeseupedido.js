(function () {
    'use strict';

    const CONFIG = {
        id: 'etraction-complete-pedido-pdp',
        styleId: 'etraction-complete-pedido-pdp-style',

        productUrl: '/pegador-de-mel-em-madeira-macica-17cm',
        productPath: '/pegador-de-mel-em-madeira-macica-17cm',

        fallbackName: 'Adicionar pegador de mel 17 cm',
        fallbackPrice: 'R$ 16,88',

        eyebrow: 'COMBINE COM SEU MEL',
        description: 'Fabricado em madeira'
    };

    let productData = null;
    let loadingProduct = false;
    let addingAccessory = false;
    let allowNativeSubmit = false;


    /* =========================================================
       NÃO MOSTRA NA PDP DO PRÓPRIO PEGADOR
       ========================================================= */

    const currentPath = window.location.pathname
        .replace(/\/+$/, '')
        .toLowerCase();

    const accessoryPath = CONFIG.productPath
        .replace(/\/+$/, '')
        .toLowerCase();

    if (currentPath === accessoryPath) {
        return;
    }


    /* =========================================================
       CSS
       ========================================================= */

    function insertStyles() {

        if (document.getElementById(CONFIG.styleId)) {
            return;
        }

        const style = document.createElement('style');

        style.id = CONFIG.styleId;

        style.textContent = `

            #${CONFIG.id} {
                width: 100% !important;
                max-width: 500px !important;

                margin: 0 0 18px !important;
                padding: 0 !important;

                box-sizing: border-box !important;

                font-family: inherit !important;
            }


            /* =================================================
               TÍTULO
               ================================================= */

            #${CONFIG.id} .etraction-complete__title {
                margin: 0 0 8px !important;
                padding: 0 !important;

                color: #332d26 !important;

                font-size: 13px !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
            }


            /* =================================================
               CARD
               ================================================= */

            #${CONFIG.id} .etraction-complete__card {
                display: grid !important;

                grid-template-columns:
                    32px
                    72px
                    minmax(0, 1fr)
                    auto !important;

                align-items: center !important;

                gap: 10px !important;

                width: 100% !important;
                min-height: 96px !important;

                margin: 0 !important;
                padding: 11px 14px !important;

                box-sizing: border-box !important;

                background: #fff !important;

                border: 1px solid #e5d2ad !important;
                border-radius: 8px !important;

                box-shadow: none !important;

                cursor: pointer !important;

                transition:
                    border-color .2s ease,
                    background-color .2s ease,
                    box-shadow .2s ease !important;
            }


            #${CONFIG.id} .etraction-complete__card:hover {
                border-color: #d8bd89 !important;
            }


            #${CONFIG.id} .etraction-complete__card.is-selected {
                background: #f7faf7 !important;

                border-color: #6f9a7e !important;

                box-shadow:
                    0 0 0 1px
                    rgba(71, 121, 93, .08) !important;
            }


            #${CONFIG.id} .etraction-complete__card.is-loading {
                opacity: .72 !important;
                pointer-events: none !important;
            }


            /* =================================================
               CHECKBOX
               ================================================= */

            #${CONFIG.id} .etraction-complete__check-wrap {
                position: relative !important;

                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 32px !important;
                height: 32px !important;

                margin: 0 !important;
                padding: 0 !important;

                cursor: pointer !important;
            }


            /*
             * CHECKBOX NATIVO INVISÍVEL
             */

            #${CONFIG.id} .etraction-complete__check {
                position: absolute !important;

                width: 1px !important;
                height: 1px !important;

                margin: 0 !important;
                padding: 0 !important;

                opacity: 0 !important;

                pointer-events: none !important;
            }


            /*
             * BOX VISUAL
             */

            #${CONFIG.id} .etraction-complete__check-ui {
                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 20px !important;
                height: 20px !important;

                flex: 0 0 20px !important;

                margin: 0 !important;
                padding: 0 !important;

                box-sizing: border-box !important;

                background: #fff !important;

                border: 1.5px solid #bcae99 !important;
                border-radius: 5px !important;

                transition:
                    background-color .18s ease,
                    border-color .18s ease,
                    transform .15s ease,
                    box-shadow .18s ease !important;
            }


            #${CONFIG.id}
            .etraction-complete__check-wrap:hover
            .etraction-complete__check-ui {
                border-color: #47795d !important;
            }


            /*
             * SVG
             */

            #${CONFIG.id} .etraction-complete__check-svg {
                display: block !important;

                width: 12px !important;
                height: 12px !important;

                flex: 0 0 12px !important;

                margin: 0 !important;
                padding: 0 !important;

                opacity: 0 !important;

                transform: scale(.65) !important;

                transition:
                    opacity .15s ease,
                    transform .15s ease !important;
            }


            #${CONFIG.id} .etraction-complete__check-svg path {
                fill: none !important;

                stroke: #fff !important;
                stroke-width: 2.4 !important;

                stroke-linecap: round !important;
                stroke-linejoin: round !important;
            }


            /*
             * CHECKADO
             */

            #${CONFIG.id}
            .etraction-complete__check:checked
            + .etraction-complete__check-ui {
                background: #47795d !important;
                border-color: #47795d !important;

                box-shadow:
                    0 2px 5px
                    rgba(71, 121, 93, .20) !important;
            }


            #${CONFIG.id}
            .etraction-complete__check:checked
            + .etraction-complete__check-ui
            .etraction-complete__check-svg {
                opacity: 1 !important;

                transform: scale(1) !important;
            }


            /* =================================================
               IMAGEM
               ================================================= */

            #${CONFIG.id} .etraction-complete__image-link {
                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                width: 72px !important;
                height: 72px !important;

                margin: 0 !important;
                padding: 0 !important;

                overflow: hidden !important;

                background: #faf8f3 !important;

                border-radius: 8px !important;

                text-decoration: none !important;
            }


            #${CONFIG.id} .etraction-complete__image {
                display: block !important;

                width: 100% !important;
                height: 100% !important;

                padding: 6px !important;

                box-sizing: border-box !important;

                object-fit: contain !important;
            }


            #${CONFIG.id} .etraction-complete__placeholder {
                color: #a09a90 !important;

                font-size: 9px !important;
                line-height: 1.2 !important;

                text-align: center !important;
            }


            /* =================================================
               INFORMAÇÕES
               ================================================= */

            #${CONFIG.id} .etraction-complete__info {
                display: flex !important;

                flex-direction: column !important;
                justify-content: center !important;

                min-width: 0 !important;

                margin: 0 !important;
                padding: 0 !important;
            }


            #${CONFIG.id} .etraction-complete__eyebrow {
                display: block !important;

                margin: 0 0 4px !important;

                color: #47795d !important;

                font-size: 8px !important;
                font-weight: 700 !important;

                line-height: 1.2 !important;

                letter-spacing: 1px !important;

                text-transform: uppercase !important;
            }


            #${CONFIG.id} .etraction-complete__name {
                display: block !important;

                margin: 0 !important;
                padding: 0 !important;

                color: #332d26 !important;

                font-size: 13px !important;
                font-weight: 600 !important;

                line-height: 1.25 !important;

                text-decoration: none !important;
            }


            #${CONFIG.id} .etraction-complete__description {
                display: block !important;

                margin: 4px 0 0 !important;

                color: #8a837a !important;

                font-size: 10px !important;
                font-weight: 400 !important;

                line-height: 1.25 !important;
            }


            #${CONFIG.id} .etraction-complete__feedback {
                display: none !important;

                margin: 5px 0 0 !important;

                color: #47795d !important;

                font-size: 9px !important;
                font-weight: 600 !important;

                line-height: 1.25 !important;
            }


            #${CONFIG.id} .etraction-complete__feedback.is-visible {
                display: block !important;
            }


            #${CONFIG.id} .etraction-complete__feedback.is-error {
                color: #a34f4f !important;
            }


            /* =================================================
               PREÇO
               ================================================= */

            #${CONFIG.id} .etraction-complete__price {
                display: flex !important;

                flex-direction: column !important;

                align-items: flex-end !important;
                justify-content: center !important;

                min-width: 95px !important;

                margin: 0 !important;
                padding: 0 !important;

                text-align: right !important;
            }


            #${CONFIG.id} .etraction-complete__price-label {
                display: block !important;

                margin: 0 0 4px !important;

                color: #928b82 !important;

                font-size: 8px !important;

                line-height: 1 !important;

                white-space: nowrap !important;
            }


            #${CONFIG.id} .etraction-complete__price-value {
                display: block !important;

                color: #47795d !important;

                font-size: 18px !important;
                font-weight: 700 !important;

                line-height: 1 !important;

                white-space: nowrap !important;
            }


            #${CONFIG.id} .etraction-complete__price-value::before {
                content: '+ ' !important;
            }


            /* =================================================
               HELPER
               ================================================= */

            #${CONFIG.id} .etraction-complete__helper {
                margin: 7px 0 0 !important;
                padding: 0 !important;

                color: #8c857b !important;

                font-size: 9px !important;
                font-weight: 400 !important;

                line-height: 1.25 !important;
            }


            /* =================================================
               MOBILE
               ================================================= */

            @media (max-width: 767px) {

                #${CONFIG.id} {
                    width: 100% !important;
                    max-width: 500px !important;

                    margin: 0 0 14px !important;
                }


                #${CONFIG.id} .etraction-complete__card {
                    grid-template-columns:
                        28px
                        58px
                        minmax(0, 1fr)
                        auto !important;

                    gap: 7px !important;

                    min-height: 82px !important;

                    padding: 9px 10px !important;
                }


                #${CONFIG.id} .etraction-complete__check-wrap {
                    width: 28px !important;
                    height: 28px !important;
                }


                #${CONFIG.id} .etraction-complete__check-ui {
                    width: 18px !important;
                    height: 18px !important;

                    flex-basis: 18px !important;
                }


                #${CONFIG.id} .etraction-complete__check-svg {
                    width: 11px !important;
                    height: 11px !important;

                    flex-basis: 11px !important;
                }


                #${CONFIG.id} .etraction-complete__image-link {
                    width: 58px !important;
                    height: 62px !important;
                }


                #${CONFIG.id} .etraction-complete__name {
                    font-size: 11px !important;
                }


                #${CONFIG.id} .etraction-complete__description {
                    font-size: 9px !important;
                }


                #${CONFIG.id} .etraction-complete__price {
                    min-width: 70px !important;
                }


                #${CONFIG.id} .etraction-complete__price-label {
                    font-size: 7px !important;
                }


                #${CONFIG.id} .etraction-complete__price-value {
                    font-size: 14px !important;
                }

            }


            @media (max-width: 390px) {

                #${CONFIG.id} .etraction-complete__card {
                    grid-template-columns:
                        24px
                        54px
                        minmax(0, 1fr) !important;

                    grid-template-areas:
                        "check image info"
                        "check image price";

                    gap: 5px 7px !important;
                }


                #${CONFIG.id} .etraction-complete__check-wrap {
                    grid-area: check !important;
                }


                #${CONFIG.id} .etraction-complete__image-link {
                    grid-area: image !important;

                    width: 54px !important;
                    height: 58px !important;
                }


                #${CONFIG.id} .etraction-complete__info {
                    grid-area: info !important;
                }


                #${CONFIG.id} .etraction-complete__price {
                    grid-area: price !important;

                    align-items: flex-start !important;

                    min-width: 0 !important;

                    text-align: left !important;
                }


                #${CONFIG.id} .etraction-complete__price-label {
                    display: none !important;
                }


                #${CONFIG.id} .etraction-complete__price-value {
                    font-size: 13px !important;
                }

            }

        `;

        document.head.appendChild(style);
    }


    /* =========================================================
       CRIA BLOCO
       ========================================================= */

    function createBlock() {

        const wrapper = document.createElement('div');

        wrapper.id = CONFIG.id;

        wrapper.innerHTML = `

            <div class="etraction-complete__title">
                Complete seu pedido
            </div>


            <div class="etraction-complete__card">

                <label class="etraction-complete__check-wrap">

                    <input
                        type="checkbox"
                        class="etraction-complete__check"
                        aria-label="Adicionar ${CONFIG.fallbackName}"
                    >

                    <span class="etraction-complete__check-ui">

                        <svg
                            class="etraction-complete__check-svg"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M3 8.2L6.4 11.5L13 4.8"></path>
                        </svg>

                    </span>

                </label>


                <a
                    href="${CONFIG.productUrl}"
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
                        ${CONFIG.eyebrow}
                    </span>


                    <a
                        href="${CONFIG.productUrl}"
                        class="etraction-complete__name"
                        target="_blank"
                        rel="noopener"
                    >
                        ${CONFIG.fallbackName}
                    </a>


                    <span class="etraction-complete__description">
                        ${CONFIG.description}
                    </span>


                    <span class="etraction-complete__feedback"></span>

                </div>


                <div class="etraction-complete__price">

                    <span class="etraction-complete__price-label">
                        Adicione por
                    </span>


                    <strong class="etraction-complete__price-value">
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
       DADOS DO PEGADOR
       ========================================================= */

    async function getProductData() {

        if (productData) {
            return productData;
        }


        if (loadingProduct) {

            return new Promise(function (resolve, reject) {

                const interval = setInterval(function () {

                    if (!loadingProduct) {

                        clearInterval(interval);

                        if (productData) {

                            resolve(productData);

                        } else {

                            reject(
                                new Error(
                                    'Produto não carregado.'
                                )
                            );

                        }

                    }

                }, 80);

            });

        }


        loadingProduct = true;


        try {

            const response = await fetch(
                CONFIG.productUrl +
                '?etraction_crosssell=' +
                Date.now(),
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    cache: 'no-store'
                }
            );


            if (!response.ok) {

                throw new Error(
                    'Não foi possível carregar o Pegador.'
                );

            }


            const html = await response.text();


            const doc = new DOMParser().parseFromString(
                html,
                'text/html'
            );


            const form = doc.querySelector(
                '#product-variant-form'
            );


            if (!form) {

                throw new Error(
                    'Formulário do Pegador não encontrado.'
                );

            }


            const action = form.getAttribute(
                'action'
            );


            if (!action) {

                throw new Error(
                    'Endpoint do Pegador não encontrado.'
                );

            }


            const entries = [];


            form.querySelectorAll(
                'input[name], select[name], textarea[name]'
            ).forEach(function (control) {

                if (control.disabled) {
                    return;
                }


                if (
                    (
                        control.type === 'checkbox' ||
                        control.type === 'radio'
                    ) &&
                    !control.checked
                ) {
                    return;
                }


                entries.push({
                    name: control.name,
                    value: control.value
                });

            });


            /* QUANTIDADE */

            let quantityFound = false;


            entries.forEach(function (entry) {

                if (
                    entry.name ===
                    'sylius_cart_item[quantity]' ||
                    entry.name.indexOf('[quantity]') !== -1
                ) {

                    entry.value = '1';

                    quantityFound = true;

                }

            });


            if (!quantityFound) {

                entries.push({
                    name: 'sylius_cart_item[quantity]',
                    value: '1'
                });

            }


            /* IMAGEM */

            let image = '';


            const ogImage = doc.querySelector(
                'meta[property="og:image"]'
            );


            if (ogImage) {

                image =
                    ogImage.getAttribute('content') ||
                    '';

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
                        img.getAttribute('src') ||
                        img.getAttribute('data-src') ||
                        '';

                }

            }


            /* PREÇO */

            let price = CONFIG.fallbackPrice;


            const priceElement =
                doc.querySelector(
                    '[data-is-available="true"] .pv-price-sale'
                ) ||
                doc.querySelector('.pv-price-sale') ||
                doc.querySelector('.price-sales');


            if (priceElement) {

                const value =
                    priceElement
                        .textContent
                        .replace(/\s+/g, ' ')
                        .trim();


                if (value) {
                    price = value;
                }

            }


            productData = {
                action: action,

                method:
                    (
                        form.getAttribute('method') ||
                        'POST'
                    ).toUpperCase(),

                entries: entries,

                image: image,

                price: price
            };


            return productData;


        } finally {

            loadingProduct = false;

        }

    }


    /* =========================================================
       VISUAL
       ========================================================= */

    async function loadVisualData() {

        try {

            const data =
                await getProductData();


            const block =
                document.getElementById(
                    CONFIG.id
                );


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

                image.innerHTML = `

                    <img
                        src="${data.image}"
                        alt="${CONFIG.fallbackName}"
                        class="etraction-complete__image"
                    >

                `;

            }


        } catch (error) {

            console.warn(
                '[eTraction Complete Pedido]',
                error
            );

        }

    }


    /* =========================================================
       ADICIONA ACESSÓRIO
       ========================================================= */

    async function addAccessory() {

        if (addingAccessory) {
            return;
        }


        addingAccessory = true;


        try {

            const data =
                await getProductData();


            const formData =
                new FormData();


            data.entries.forEach(function (entry) {

                formData.append(
                    entry.name,
                    entry.value
                );

            });


            const url =
                new URL(
                    data.action,
                    window.location.origin
                ).href;


            const response =
                await fetch(
                    url,
                    {
                        method: data.method,

                        body: formData,

                        credentials: 'same-origin',

                        redirect: 'follow'
                    }
                );


            if (!response.ok) {

                throw new Error(
                    'Erro HTTP ' +
                    response.status
                );

            }


        } finally {

            addingAccessory = false;

        }

    }


    /* =========================================================
       CHECKBOX
       ========================================================= */

    function bindCheckbox(block) {

        const checkbox =
            block.querySelector(
                '.etraction-complete__check'
            );


        const card =
            block.querySelector(
                '.etraction-complete__card'
            );


        const feedback =
            block.querySelector(
                '.etraction-complete__feedback'
            );


        const helper =
            block.querySelector(
                '.etraction-complete__helper'
            );


        if (
            !checkbox ||
            !card ||
            !feedback
        ) {
            return;
        }


        checkbox.addEventListener(
            'change',
            function () {

                if (checkbox.checked) {

                    card.classList.add(
                        'is-selected'
                    );


                    feedback.classList.remove(
                        'is-error'
                    );


                    feedback.classList.add(
                        'is-visible'
                    );


                    feedback.textContent =
                        'Será adicionado junto ao seu produto.';


                    if (helper) {

                        helper.textContent =
                            'Desmarque caso não queira incluir o acessório.';

                    }


                    return;
                }


                card.classList.remove(
                    'is-selected',
                    'is-loading'
                );


                feedback.classList.remove(
                    'is-visible',
                    'is-error'
                );


                feedback.textContent = '';


                if (helper) {

                    helper.textContent =
                        'Marque a opção para incluir o acessório no pedido.';

                }

            }
        );


        /* =====================================================
           CLIQUE NO CARD
           ===================================================== */

        card.addEventListener(
            'click',
            function (event) {

                if (
                    event.target.closest('a') ||
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
                            bubbles: true
                        }
                    )
                );

            }
        );

    }


    /* =========================================================
       CONTINUA SUBMIT NATIVO
       ========================================================= */

    function continueNativeSubmit(
        form,
        submitter
    ) {

        allowNativeSubmit = true;


        try {

            if (
                typeof form.requestSubmit ===
                'function'
            ) {

                if (
                    submitter &&
                    submitter.form === form
                ) {

                    form.requestSubmit(
                        submitter
                    );

                } else {

                    form.requestSubmit();

                }

            } else if (submitter) {

                submitter.click();

            } else {

                HTMLFormElement
                    .prototype
                    .submit
                    .call(form);

            }


        } finally {

            setTimeout(function () {

                allowNativeSubmit = false;

            }, 100);

        }

    }


    /* =========================================================
       FORM PRINCIPAL
       ========================================================= */

    function bindMainProductForm() {

        const form =
            document.querySelector(
                '#product-variant-form'
            );


        if (!form) {
            return;
        }


        if (
            form.dataset.etractionUpsellBound ===
            'true'
        ) {
            return;
        }


        form.dataset.etractionUpsellBound =
            'true';


        form.addEventListener(
            'submit',
            async function (event) {

                if (allowNativeSubmit) {
                    return;
                }


                const block =
                    document.getElementById(
                        CONFIG.id
                    );


                if (!block) {
                    return;
                }


                const checkbox =
                    block.querySelector(
                        '.etraction-complete__check'
                    );


                /*
                 * NÃO MARCADO:
                 * comportamento nativo.
                 */

                if (
                    !checkbox ||
                    !checkbox.checked
                ) {
                    return;
                }


                event.preventDefault();
                event.stopImmediatePropagation();


                if (addingAccessory) {
                    return;
                }


                const card =
                    block.querySelector(
                        '.etraction-complete__card'
                    );


                const feedback =
                    block.querySelector(
                        '.etraction-complete__feedback'
                    );


                const submitter =
                    event.submitter ||
                    document.activeElement;


                card.classList.add(
                    'is-loading'
                );


                feedback.classList.remove(
                    'is-error'
                );


                feedback.classList.add(
                    'is-visible'
                );


                feedback.textContent =
                    'Incluindo o acessório...';


                try {

                    await addAccessory();


                    feedback.textContent =
                        'Acessório incluído ✓';


                    continueNativeSubmit(
                        form,
                        submitter
                    );


                } catch (error) {

                    console.error(
                        '[eTraction Upsell]',
                        error
                    );


                    card.classList.remove(
                        'is-loading'
                    );


                    feedback.classList.add(
                        'is-error'
                    );


                    feedback.textContent =
                        'Não foi possível incluir o acessório.';


                    continueNativeSubmit(
                        form,
                        submitter
                    );

                }

            },
            true
        );

    }


    /* =========================================================
       INSERE BLOCO
       ========================================================= */

    function insertBlock() {

        const existing =
            document.getElementById(
                CONFIG.id
            );


        if (existing) {

            bindMainProductForm();

            return;
        }


        const target =
            document.querySelector(
                '#product-variant-form ' +
                '.association-link-products.product-variant-show-images'
            );


        if (!target) {
            return;
        }


        insertStyles();


        const block =
            createBlock();


        target.insertAdjacentElement(
            'beforebegin',
            block
        );


        bindCheckbox(
            block
        );


        bindMainProductForm();


        loadVisualData();

    }


    /* =========================================================
       INIT
       ========================================================= */

    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            insertBlock
        );

    } else {

        insertBlock();

    }


    /* =========================================================
       OBSERVER
       ========================================================= */

    let observerTimer = null;


    const observer =
        new MutationObserver(function () {

            clearTimeout(
                observerTimer
            );


            observerTimer =
                setTimeout(
                    insertBlock,
                    150
                );

        });


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
                childList: true,
                subtree: true
            }
        );

    }


    startObserver();

})();