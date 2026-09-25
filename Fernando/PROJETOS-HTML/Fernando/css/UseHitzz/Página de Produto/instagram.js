(function () {
    "use strict";

    var ETRACTION_HITZZ_IG = {
        instagramUrl: "https://www.instagram.com/usehitzz/",
        followersText: "450 mil seguidores aprovam",
        avatarImage: "https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/usehitzz/750424088-18606764344017285-8228233618139697294-n.jpg"
    };

    var COMPONENT_ID = "etraction-hitzz-ig-proof";
    var STYLE_ID = "etraction-hitzz-ig-proof-style";
    var observerStarted = false;

    /* =========================================================
       CSS
    ========================================================= */

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        var style = document.createElement("style");

        style.id = STYLE_ID;

        style.innerHTML = `
            #${COMPONENT_ID},
            #${COMPONENT_ID} * {
                box-sizing: border-box;
            }

            #${COMPONENT_ID} {
                display: inline-flex;
                align-items: center;
                width: fit-content;
                max-width: 100%;
                gap: 9px;
                padding: 5px 9px;
                margin: 0 0 12px 0;
                background: #f5f5f5;
                border: 1px solid #e5e5e5;
                border-radius: 2px;
                color: #222;
                font-family: inherit;
                line-height: 1;
                text-decoration: none;
                cursor: pointer;
                transition: background .2s ease, transform .2s ease;
            }

            #${COMPONENT_ID}:hover {
                background: #eeeeee;
                transform: translateY(-1px);
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__avatars {
                display: flex;
                align-items: center;
                flex: 0 0 auto;
                padding-left: 1px;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__avatar {
                position: relative;
                display: block;
                width: 22px;
                height: 22px;
                flex: 0 0 22px;
                margin-left: -6px;
                overflow: hidden;
                border: 1.5px solid #fff;
                border-radius: 50%;
                background: #ddd;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__avatar:first-child {
                margin-left: 0;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__avatar img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                border-radius: 50%;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__fallback {
                display: none;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: #222;
                color: #fff;
                font-size: 9px;
                font-weight: 700;
                border-radius: 50%;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__text {
                display: flex;
                align-items: center;
                gap: 4px;
                min-width: 0;
                color: #222;
                font-size: 12px;
                font-weight: 400;
                white-space: nowrap;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__name {
                font-weight: 700;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__verified {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #3897f0;
                color: #fff;
                font-size: 8px;
                font-weight: 700;
                line-height: 1;
            }

            #${COMPONENT_ID} .etraction-hitzz-ig-proof__copy {
                font-weight: 400;
            }

            @media (max-width: 767px) {
                #${COMPONENT_ID} {
                    width: 100%;
                    padding: 6px 8px;
                    gap: 8px;
                }

                #${COMPONENT_ID} .etraction-hitzz-ig-proof__avatar {
                    width: 21px;
                    height: 21px;
                    flex-basis: 21px;
                    margin-left: -6px;
                }

                #${COMPONENT_ID} .etraction-hitzz-ig-proof__text {
                    font-size: 11px;
                    white-space: normal;
                    line-height: 1.2;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* =========================================================
       CRIA AVATAR
    ========================================================= */

    function createAvatar() {
        var avatar = document.createElement("span");
        avatar.className = "etraction-hitzz-ig-proof__avatar";

        var img = document.createElement("img");
        img.src = ETRACTION_HITZZ_IG.avatarImage;
        img.alt = "Hitzz";
        img.loading = "eager";
        img.referrerPolicy = "no-referrer";

        var fallback = document.createElement("span");
        fallback.className = "etraction-hitzz-ig-proof__fallback";
        fallback.textContent = "H";

        img.onerror = function () {
            img.style.display = "none";
            fallback.style.display = "flex";
        };

        avatar.appendChild(img);
        avatar.appendChild(fallback);

        return avatar;
    }

    /* =========================================================
       CRIA COMPONENTE
    ========================================================= */

    function createComponent() {
        var link = document.createElement("a");

        link.id = COMPONENT_ID;
        link.href = ETRACTION_HITZZ_IG.instagramUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Ver Instagram da Hitzz");

        var avatars = document.createElement("div");
        avatars.className = "etraction-hitzz-ig-proof__avatars";

        avatars.appendChild(createAvatar());
        avatars.appendChild(createAvatar());
        avatars.appendChild(createAvatar());

        var text = document.createElement("div");
        text.className = "etraction-hitzz-ig-proof__text";

        text.innerHTML = `
            <span class="etraction-hitzz-ig-proof__name">Hitzz</span>
            <span class="etraction-hitzz-ig-proof__verified" aria-label="Verificado">✓</span>
            <span class="etraction-hitzz-ig-proof__copy">e ${ETRACTION_HITZZ_IG.followersText} no Instagram</span>
        `;

        link.appendChild(avatars);
        link.appendChild(text);

        return link;
    }

    /* =========================================================
       ENCONTRA TÍTULO
    ========================================================= */

    function findProductTitle() {
        var selectors = [
            'h1[itemprop="name"]',
            '.product-block h1',
            '.product-title h1',
            '.product_title',
            '.info-produto h1',
            '.produto-info h1',
            '.detalhes-produto h1',
            '.produto-detalhes h1',
            '.product-info h1',
            '.product-details h1',
            'main h1'
        ];

        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);

            if (el && el.textContent && el.textContent.trim().length > 0) {
                return el;
            }
        }

        var h1s = document.querySelectorAll("h1");

        for (var j = 0; j < h1s.length; j++) {
            if (h1s[j].textContent && h1s[j].textContent.trim().length > 0) {
                return h1s[j];
            }
        }

        return null;
    }

    /* =========================================================
       VALIDA PDP
    ========================================================= */

    function isProductPage() {
        var title = findProductTitle();

        var buyButton = document.querySelector(
            '.button-buy,' +
            '.btn-comprar,' +
            '.comprar,' +
            '[class*="buy"],' +
            '[class*="comprar"],' +
            'button[type="submit"]'
        );

        return !!(title && buyButton);
    }

    /* =========================================================
       INSERE ANTES DO TÍTULO
    ========================================================= */

    function insertComponent() {
        if (document.getElementById(COMPONENT_ID)) {
            return true;
        }

        if (!isProductPage()) {
            return false;
        }

        var title = findProductTitle();

        if (!title || !title.parentNode) {
            return false;
        }

        injectStyles();

        var component = createComponent();

        title.parentNode.insertBefore(component, title);

        return true;
    }

    /* =========================================================
       OBSERVER UOOU
    ========================================================= */

    function startObserver() {
        if (observerStarted) {
            return;
        }

        observerStarted = true;

        var observer = new MutationObserver(function () {
            insertComponent();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(function () {
            observer.disconnect();
        }, 20000);
    }

    /* =========================================================
       INIT
    ========================================================= */

    function init() {
        insertComponent();

        var tries = 0;

        var interval = setInterval(function () {
            tries++;

            if (insertComponent() || tries >= 40) {
                clearInterval(interval);
            }
        }, 500);

        startObserver();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();