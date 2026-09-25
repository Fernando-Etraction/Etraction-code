(function () {
    "use strict";

    var META = 499.90;

    var ID = "etraction-hitzz-presente-liberado";
    var STYLE_ID = "etraction-hitzz-presente-liberado-style";

    var IMAGEM =
        "https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/imagenecessaire.png";

    var estavaLiberado = false;


    /* =========================================================
       LIMPEZA
    ========================================================= */

    function limparAntigos() {

        [
            "etraction-hitzz-gift-success",
            "etraction-hitzz-gift-success-style",
            "etraction-hitzz-presente-carrinho",
            "etraction-hitzz-presente-carrinho-style",
            "etraction-hitzz-celebration-fx"
        ].forEach(function (id) {

            var elemento =
                document.getElementById(id);

            if (elemento) {
                elemento.remove();
            }

        });

    }


    /* =========================================================
       CONVERTER PREÇO
    ========================================================= */

    function converterPreco(texto) {

        if (!texto) {
            return 0;
        }


        var valor =
            String(texto)
                .replace(/\s/g, "")
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .replace(/[^\d.-]/g, "");


        valor =
            parseFloat(valor);


        return isNaN(valor)
            ? 0
            : valor;
    }


    /* =========================================================
       TOTAL DOS PRODUTOS
    ========================================================= */

    function pegarTotalProdutos() {

        var linhas =
            document.querySelectorAll(
                '#cartTableWidget tbody[data-cart="body"] tr.CartProduct'
            );


        var total = 0;


        linhas.forEach(function (linha) {

            var precoElemento =
                linha.querySelector(
                    ".unitPrice .best-price"
                );


            var quantidadeElemento =
                linha.querySelector(
                    ".CartItemQuantityField"
                );


            var preco =
                converterPreco(
                    precoElemento
                        ? precoElemento.textContent
                        : ""
                );


            var quantidade =
                quantidadeElemento
                    ? parseInt(
                        quantidadeElemento.value,
                        10
                    )
                    : 1;


            if (
                isNaN(quantidade) ||
                quantidade < 1
            ) {
                quantidade = 1;
            }


            total +=
                preco *
                quantidade;

        });


        /*
         * FALLBACK
         */

        if (total <= 0) {

            var subtotal =
                document.querySelector(
                    "#cartContainer .cartSubtotal .itemTotalPrice"
                );


            total =
                converterPreco(
                    subtotal
                        ? subtotal.textContent
                        : ""
                );

        }


        return total;
    }


    /* =========================================================
       CSS
    ========================================================= */

    function adicionarCSS() {

        var antigo =
            document.getElementById(
                STYLE_ID
            );


        if (antigo) {
            antigo.remove();
        }


        var style =
            document.createElement(
                "style"
            );


        style.id =
            STYLE_ID;


        style.textContent = `

            #${ID},
            #${ID} * {
                box-sizing: border-box !important;
            }


            /* =====================================================
               CARD
            ===================================================== */

            #${ID} {

                position: relative !important;

                width: 100% !important;

                margin:
                    10px 0 14px !important;

                padding:
                    13px 15px !important;

                display:
                    flex !important;

                align-items:
                    center !important;

                gap:
                    13px !important;

                border:
                    1px solid #dddddd !important;

                border-radius:
                    11px !important;

                background:
                    #ffffff !important;

                color:
                    #111111 !important;

                font-family:
                    inherit !important;

                text-align:
                    left !important;

                overflow:
                    hidden !important;

                isolation:
                    isolate !important;

                box-shadow:
                    0 4px 14px
                    rgba(0,0,0,.055) !important;
            }


            /* =====================================================
               ENTRADA DO CARD
            ===================================================== */

            #${ID}.is-celebrating {

                animation:
                    hitzzGiftCardIn
                    .65s
                    cubic-bezier(
                        .16,
                        1.2,
                        .3,
                        1
                    )
                    both;

            }


            @keyframes hitzzGiftCardIn {

                0% {
                    opacity: 0;

                    transform:
                        translateY(-10px)
                        scale(.97);
                }

                65% {
                    opacity: 1;

                    transform:
                        translateY(2px)
                        scale(1.01);
                }

                100% {
                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);
                }

            }


            /* =====================================================
               GLOW DISCRETO
            ===================================================== */

            #${ID}
            .hitzz-gift__glow {

                position: absolute;

                left: -55px;
                top: 50%;

                width: 145px;
                height: 145px;

                border-radius:
                    50%;

                background:
                    radial-gradient(
                        circle,
                        rgba(24,166,83,.15) 0%,
                        rgba(24,166,83,.06) 40%,
                        rgba(24,166,83,0) 72%
                    );

                transform:
                    translateY(-50%)
                    scale(.7);

                opacity: .6;

                pointer-events:
                    none;

                z-index:
                    0;
            }


            #${ID}.is-celebrating
            .hitzz-gift__glow {

                animation:
                    hitzzGiftGlow
                    1s
                    ease-out
                    both;

            }


            @keyframes hitzzGiftGlow {

                0% {
                    opacity: 0;

                    transform:
                        translateY(-50%)
                        scale(.4);
                }

                100% {
                    opacity: .6;

                    transform:
                        translateY(-50%)
                        scale(1);
                }

            }


            /* =====================================================
               BRILHO
            ===================================================== */

            #${ID}
            .hitzz-gift__shine {

                position: absolute;

                top: 0;
                left: -35%;

                width: 22%;
                height: 100%;

                background:
                    linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.85),
                        transparent
                    );

                transform:
                    skewX(-20deg);

                opacity: 0;

                pointer-events:
                    none;

                z-index:
                    8;
            }


            #${ID}.is-celebrating
            .hitzz-gift__shine {

                animation:
                    hitzzGiftShine
                    .8s
                    .55s
                    ease-out
                    forwards;

            }


            @keyframes hitzzGiftShine {

                0% {
                    left: -35%;
                    opacity: 0;
                }

                20% {
                    opacity: .75;
                }

                100% {
                    left: 120%;
                    opacity: 0;
                }

            }


            /* =====================================================
               IMAGEM
            ===================================================== */

            #${ID}
            .hitzz-gift__image-wrap {

                position:
                    relative !important;

                width:
                    62px !important;

                height:
                    62px !important;

                flex:
                    0 0 62px !important;

                z-index:
                    4 !important;
            }


            #${ID}
            .hitzz-gift__image {

                display:
                    block !important;

                width:
                    62px !important;

                height:
                    62px !important;

                margin:
                    0 !important;

                padding:
                    2px !important;

                border:
                    1px solid #e2e2e2 !important;

                border-radius:
                    9px !important;

                background:
                    #ffffff !important;

                object-fit:
                    contain !important;

                transform-origin:
                    center bottom;
            }


            #${ID}.is-celebrating
            .hitzz-gift__image {

                animation:
                    hitzzGiftImagePop
                    .7s
                    .08s
                    cubic-bezier(
                        .16,
                        1.3,
                        .3,
                        1
                    )
                    both;

            }


            @keyframes hitzzGiftImagePop {

                0% {
                    opacity: 0;

                    transform:
                        translateY(10px)
                        scale(.75)
                        rotate(-4deg);
                }

                65% {
                    opacity: 1;

                    transform:
                        translateY(-2px)
                        scale(1.07)
                        rotate(2deg);
                }

                100% {
                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1)
                        rotate(0);
                }

            }


            /* =====================================================
               CHECK
            ===================================================== */

            #${ID}
            .hitzz-gift__check {

                position:
                    absolute !important;

                top:
                    -6px !important;

                right:
                    -6px !important;

                width:
                    22px !important;

                height:
                    22px !important;

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                border:
                    2px solid #ffffff !important;

                border-radius:
                    50% !important;

                background:
                    #111111 !important;

                color:
                    #ffffff !important;

                font-size:
                    11px !important;

                font-weight:
                    900 !important;

                line-height:
                    1 !important;

                box-shadow:
                    0 3px 7px
                    rgba(0,0,0,.17) !important;

                z-index:
                    7 !important;
            }


            #${ID}
            .hitzz-gift__check::before {

                content: "";

                position: absolute;

                inset: -5px;

                border:
                    2px solid
                    rgba(17,17,17,.18);

                border-radius:
                    50%;

                opacity: 0;

                pointer-events:
                    none;
            }


            #${ID}.is-celebrating
            .hitzz-gift__check {

                animation:
                    hitzzGiftCheck
                    .5s
                    .42s
                    cubic-bezier(
                        .16,
                        1.4,
                        .3,
                        1
                    )
                    both;

            }


            #${ID}.is-celebrating
            .hitzz-gift__check::before {

                animation:
                    hitzzGiftRing
                    .6s
                    .55s
                    ease-out
                    forwards;

            }


            @keyframes hitzzGiftCheck {

                0% {
                    opacity: 0;

                    transform:
                        scale(0)
                        rotate(-40deg);
                }

                70% {
                    opacity: 1;

                    transform:
                        scale(1.18)
                        rotate(4deg);
                }

                100% {
                    opacity: 1;

                    transform:
                        scale(1)
                        rotate(0);
                }

            }


            @keyframes hitzzGiftRing {

                from {
                    opacity: .6;

                    transform:
                        scale(.7);
                }

                to {
                    opacity: 0;

                    transform:
                        scale(1.65);
                }

            }


            /* =====================================================
               CONTEÚDO
            ===================================================== */

            #${ID}
            .hitzz-gift__content {

                position:
                    relative !important;

                min-width:
                    0 !important;

                flex:
                    1 1 auto !important;

                z-index:
                    4 !important;
            }


            #${ID}
            .hitzz-gift__eyebrow {

                display:
                    inline-block !important;

                margin:
                    0 0 2px !important;

                color:
                    #777777 !important;

                font-size:
                    9px !important;

                font-weight:
                    800 !important;

                line-height:
                    1 !important;

                letter-spacing:
                    .7px !important;

                text-transform:
                    uppercase !important;
            }


            #${ID}
            .hitzz-gift__title {

                margin:
                    0 0 3px !important;

                color:
                    #111111 !important;

                font-size:
                    16px !important;

                font-weight:
                    900 !important;

                line-height:
                    1.18 !important;
            }


            #${ID}
            .hitzz-gift__text {

                margin:
                    0 !important;

                color:
                    #555555 !important;

                font-size:
                    12px !important;

                font-weight:
                    500 !important;

                line-height:
                    1.35 !important;
            }


            #${ID}
            .hitzz-gift__benefit {

                color:
                    #111111 !important;

                font-weight:
                    900 !important;
            }


            #${ID}.is-celebrating
            .hitzz-gift__eyebrow {

                animation:
                    hitzzGiftText
                    .4s
                    .15s
                    ease
                    both;

            }


            #${ID}.is-celebrating
            .hitzz-gift__title {

                animation:
                    hitzzGiftText
                    .45s
                    .25s
                    ease
                    both;

            }


            #${ID}.is-celebrating
            .hitzz-gift__text {

                animation:
                    hitzzGiftText
                    .45s
                    .35s
                    ease
                    both;

            }


            @keyframes hitzzGiftText {

                from {
                    opacity: 0;

                    transform:
                        translateX(8px);
                }

                to {
                    opacity: 1;

                    transform:
                        translateX(0);
                }

            }


            /* =====================================================
               STATUS
            ===================================================== */

            #${ID}
            .hitzz-gift__status {

                position:
                    relative !important;

                z-index:
                    4 !important;

                flex:
                    0 0 auto !important;

                display:
                    inline-flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                padding:
                    7px 10px !important;

                border-radius:
                    999px !important;

                background:
                    #111111 !important;

                color:
                    #ffffff !important;

                font-size:
                    9px !important;

                font-weight:
                    900 !important;

                line-height:
                    1 !important;

                text-transform:
                    uppercase !important;

                white-space:
                    nowrap !important;
            }


            #${ID}.is-celebrating
            .hitzz-gift__status {

                animation:
                    hitzzGiftStatus
                    .5s
                    .55s
                    cubic-bezier(
                        .16,
                        1.25,
                        .3,
                        1
                    )
                    both;

            }


            @keyframes hitzzGiftStatus {

                0% {
                    opacity: 0;

                    transform:
                        scale(.75);
                }

                70% {
                    opacity: 1;

                    transform:
                        scale(1.07);
                }

                100% {
                    opacity: 1;

                    transform:
                        scale(1);
                }

            }


            /* =====================================================
               BARRA VERDE
            ===================================================== */

            #${ID}
            .hitzz-gift__line {

                position: absolute;

                left: 0;
                bottom: 0;

                width: 100%;
                height: 3px;

                background:
                    #e8e8e8;

                overflow:
                    hidden;

                z-index: 5;
            }


            #${ID}
            .hitzz-gift__line::after {

                content: "";

                position: absolute;

                inset: 0;

                background:
                    linear-gradient(
                        90deg,
                        #0c783b,
                        #19b85b,
                        #42db7d
                    );

                transform:
                    scaleX(0);

                transform-origin:
                    left center;
            }


            #${ID}.is-celebrating
            .hitzz-gift__line::after {

                animation:
                    hitzzGiftLine
                    .75s
                    .75s
                    cubic-bezier(
                        .16,
                        1,
                        .3,
                        1
                    )
                    forwards;

            }


            #${ID}.is-ready
            .hitzz-gift__line::after {

                transform:
                    scaleX(1);
            }


            @keyframes hitzzGiftLine {

                from {
                    transform:
                        scaleX(0);
                }

                to {
                    transform:
                        scaleX(1);
                }

            }


            /* =====================================================
               PARTÍCULAS
            ===================================================== */

            #${ID}
            .hitzz-gift__particle {

                position: absolute;

                left: 48px;
                top: 50%;

                width:
                    var(--size);

                height:
                    var(--size);

                border-radius:
                    50%;

                background:
                    var(--color);

                pointer-events:
                    none;

                opacity: 0;

                z-index:
                    10;
            }


            #${ID}
            .hitzz-gift__particle.is-running {

                animation:
                    hitzzGiftParticle
                    var(--duration)
                    var(--delay)
                    cubic-bezier(
                        .16,
                        .7,
                        .25,
                        1
                    )
                    forwards;

            }


            @keyframes hitzzGiftParticle {

                0% {
                    opacity: 0;

                    transform:
                        translate(0,0)
                        scale(.3);
                }

                15% {
                    opacity: 1;
                }

                70% {
                    opacity: .8;
                }

                100% {
                    opacity: 0;

                    transform:
                        translate(
                            var(--tx),
                            var(--ty)
                        )
                        scale(1);
                }

            }


            /* =====================================================
               MOBILE
            ===================================================== */

            @media(max-width:767px) {

                #${ID} {

                    padding:
                        10px !important;

                    gap:
                        10px !important;
                }


                #${ID}
                .hitzz-gift__image-wrap {

                    width:
                        52px !important;

                    height:
                        52px !important;

                    flex-basis:
                        52px !important;
                }


                #${ID}
                .hitzz-gift__image {

                    width:
                        52px !important;

                    height:
                        52px !important;
                }


                #${ID}
                .hitzz-gift__check {

                    width:
                        19px !important;

                    height:
                        19px !important;

                    font-size:
                        9px !important;
                }


                #${ID}
                .hitzz-gift__title {

                    font-size:
                        14px !important;
                }


                #${ID}
                .hitzz-gift__text {

                    font-size:
                        10.5px !important;
                }


                #${ID}
                .hitzz-gift__eyebrow {

                    font-size:
                        8px !important;
                }


                #${ID}
                .hitzz-gift__status {

                    padding:
                        5px 7px !important;

                    font-size:
                        8px !important;
                }

            }


            @media(max-width:480px) {

                #${ID}
                .hitzz-gift__status {

                    display:
                        none !important;
                }

            }


            /* =====================================================
               ACESSIBILIDADE
            ===================================================== */

            @media(
                prefers-reduced-motion:
                reduce
            ) {

                #${ID},
                #${ID} * {

                    animation:
                        none !important;

                    transition:
                        none !important;
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================================
       CRIAR AVISO
    ========================================================= */

    function criarAviso() {

        var existente =
            document.getElementById(
                ID
            );


        if (existente) {
            return existente;
        }


        var aviso =
            document.createElement(
                "div"
            );


        aviso.id =
            ID;


        aviso.setAttribute(
            "role",
            "status"
        );


        aviso.setAttribute(
            "aria-live",
            "polite"
        );


        aviso.innerHTML = `

            <span
                class="hitzz-gift__glow"
                aria-hidden="true"
            ></span>


            <span
                class="hitzz-gift__shine"
                aria-hidden="true"
            ></span>


            <span
                class="hitzz-gift__line"
                aria-hidden="true"
            ></span>


            <div
                class="hitzz-gift__image-wrap"
            >

                <img
                    class="hitzz-gift__image"
                    src="${IMAGEM}"
                    alt="Necessaire de presente"
                    loading="lazy"
                    decoding="async"
                >


                <span
                    class="hitzz-gift__check"
                    aria-hidden="true"
                >
                    ✓
                </span>

            </div>


            <div
                class="hitzz-gift__content"
            >

                <span
                    class="hitzz-gift__eyebrow"
                >
                    Dia do Cliente Hitzz
                </span>


                <p
                    class="hitzz-gift__title"
                >
                    Você ganhou seu presente!
                </p>


                <p
                    class="hitzz-gift__text"
                >

                    <strong
                        class="hitzz-gift__benefit"
                    >
                        Necessaire de presente + frete grátis
                    </strong>

                    liberados para sua compra.

                </p>

            </div>


            <span
                class="hitzz-gift__status"
            >
                ✓ Liberado
            </span>

        `;


        return aviso;

    }


    /* =========================================================
       PARTÍCULAS
    ========================================================= */

    function criarParticulas(
        aviso
    ) {

        if (!aviso) {
            return;
        }


        var cores = [
            "#111111",
            "#18a653",
            "#18a653",
            "#b9b9b9"
        ];


        /*
         * POUCAS PARTÍCULAS
         */

        var quantidade = 12;


        for (
            var i = 0;
            i < quantidade;
            i++
        ) {

            var particle =
                document.createElement(
                    "span"
                );


            particle.className =
                "hitzz-gift__particle";


            var angulo =
                (
                    -120 +
                    (
                        240 /
                        Math.max(
                            quantidade - 1,
                            1
                        )
                    ) *
                    i
                ) *
                (
                    Math.PI /
                    180
                );


            var distancia =
                40 +
                Math.random() *
                55;


            var x =
                Math.cos(
                    angulo
                ) *
                distancia;


            var y =
                Math.sin(
                    angulo
                ) *
                distancia;


            var tamanho =
                3 +
                Math.random() *
                2.5;


            particle.style.setProperty(
                "--tx",
                x.toFixed(0) +
                "px"
            );


            particle.style.setProperty(
                "--ty",
                y.toFixed(0) +
                "px"
            );


            particle.style.setProperty(
                "--size",
                tamanho.toFixed(1) +
                "px"
            );


            particle.style.setProperty(
                "--duration",
                (
                    .6 +
                    Math.random() *
                    .25
                ).toFixed(2) +
                "s"
            );


            particle.style.setProperty(
                "--delay",
                (
                    .45 +
                    Math.random() *
                    .15
                ).toFixed(2) +
                "s"
            );


            particle.style.setProperty(
                "--color",
                cores[
                    Math.floor(
                        Math.random() *
                        cores.length
                    )
                ]
            );


            aviso.appendChild(
                particle
            );


            void particle.offsetWidth;


            particle.classList.add(
                "is-running"
            );


            (function (
                elemento
            ) {

                setTimeout(
                    function () {

                        if (
                            elemento &&
                            elemento.parentNode
                        ) {

                            elemento.remove();

                        }

                    },
                    1300
                );

            })(particle);

        }

    }


    /* =========================================================
       ANIMAR
    ========================================================= */

    function animarAviso(
        aviso
    ) {

        if (!aviso) {
            return;
        }


        aviso.classList.remove(
            "is-ready"
        );


        aviso.classList.remove(
            "is-celebrating"
        );


        void aviso.offsetWidth;


        aviso.classList.add(
            "is-celebrating"
        );


        criarParticulas(
            aviso
        );


        /*
         * TERMINA RÁPIDO
         */

        setTimeout(
            function () {

                aviso.classList.remove(
                    "is-celebrating"
                );


                aviso.classList.add(
                    "is-ready"
                );

            },
            1800
        );

    }


    /* =========================================================
       POSICIONAR
    ========================================================= */

    function mostrarAviso(
        animar
    ) {

        var aviso =
            criarAviso();


        var areaCep =
            document.querySelector(
                "#cartContainer .rowCartPostalCode"
            );


        if (
            areaCep &&
            areaCep.parentNode
        ) {

            if (
                areaCep.nextElementSibling !==
                aviso
            ) {

                areaCep.insertAdjacentElement(
                    "afterend",
                    aviso
                );

            }


            if (animar) {

                setTimeout(
                    function () {

                        animarAviso(
                            aviso
                        );

                    },
                    50
                );

            } else {

                aviso.classList.add(
                    "is-ready"
                );

            }


            return true;

        }


        /*
         * FALLBACK:
         * ANTES DA RASPADINHA
         */

        var raspadinha =
            document.getElementById(
                "etraction-hitzz-scratch-cart"
            );


        if (
            raspadinha &&
            raspadinha.parentNode
        ) {

            if (
                raspadinha.previousElementSibling
                !== aviso
            ) {

                raspadinha.parentNode.insertBefore(
                    aviso,
                    raspadinha
                );

            }


            if (animar) {

                setTimeout(
                    function () {

                        animarAviso(
                            aviso
                        );

                    },
                    50
                );

            } else {

                aviso.classList.add(
                    "is-ready"
                );

            }


            return true;

        }


        /*
         * FALLBACK:
         * TOPO DO CARRINHO
         */

        var cart =
            document.getElementById(
                "cartContainer"
            );


        if (cart) {

            if (
                cart.firstElementChild
                !== aviso
            ) {

                cart.insertBefore(
                    aviso,
                    cart.firstChild
                );

            }


            if (animar) {

                setTimeout(
                    function () {

                        animarAviso(
                            aviso
                        );

                    },
                    50
                );

            } else {

                aviso.classList.add(
                    "is-ready"
                );

            }


            return true;

        }


        return false;

    }


    /* =========================================================
       REMOVER
    ========================================================= */

    function removerAviso() {

        var aviso =
            document.getElementById(
                ID
            );


        if (aviso) {
            aviso.remove();
        }

    }


    /* =========================================================
       ATUALIZAR
    ========================================================= */

    function atualizar() {

        var total =
            pegarTotalProdutos();


        window.etractionHitzzTotalProdutos =
            total;


        var liberado =
            total >= META;


        /*
         * ACABOU DE ATINGIR
         */

        if (
            liberado &&
            !estavaLiberado
        ) {

            mostrarAviso(
                true
            );

        }


        /*
         * JÁ ESTAVA LIBERADO
         */

        else if (
            liberado
        ) {

            mostrarAviso(
                false
            );

        }


        /*
         * ABAIXO DA META
         */

        else {

            removerAviso();

        }


        estavaLiberado =
            liberado;

    }


    /* =========================================================
       EVENTOS
    ========================================================= */

    function adicionarEventos() {

        document.addEventListener(
            "input",
            function (event) {

                if (
                    event.target &&
                    event.target.classList &&
                    event.target.classList.contains(
                        "CartItemQuantityField"
                    )
                ) {

                    atualizar();

                }

            },
            true
        );


        document.addEventListener(
            "change",
            function (event) {

                if (
                    event.target &&
                    event.target.classList &&
                    event.target.classList.contains(
                        "CartItemQuantityField"
                    )
                ) {

                    atualizar();


                    setTimeout(
                        atualizar,
                        300
                    );


                    setTimeout(
                        atualizar,
                        800
                    );

                }

            },
            true
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !event.target.closest
                ) {
                    return;
                }


                if (
                    event.target.closest(
                        ".bootstrap-touchspin-up, " +
                        ".bootstrap-touchspin-down, " +
                        ".delete, " +
                        ".remove"
                    )
                ) {

                    setTimeout(
                        atualizar,
                        60
                    );


                    setTimeout(
                        atualizar,
                        300
                    );


                    setTimeout(
                        atualizar,
                        800
                    );

                }

            },
            true
        );


        /*
         * AJAX MAGAZORD
         */

        if (window.jQuery) {

            window
                .jQuery(document)
                .ajaxComplete(
                    function () {

                        setTimeout(
                            atualizar,
                            80
                        );


                        setTimeout(
                            atualizar,
                            400
                        );

                    }
                );

        }

    }


    /* =========================================================
       INIT
    ========================================================= */

    function iniciar() {

        limparAntigos();

        adicionarCSS();

        adicionarEventos();

        atualizar();


        /*
         * GARANTIA PARA AJAX
         */

        setInterval(
            atualizar,
            500
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciar,
            {
                once: true
            }
        );

    } else {

        iniciar();

    }

})();