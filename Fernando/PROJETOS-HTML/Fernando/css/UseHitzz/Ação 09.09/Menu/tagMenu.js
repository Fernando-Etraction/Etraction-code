$(document).ready(function () {

    /* =========================================================
       HITZZ
       17% OFF + TIMER
       
       DESKTOP:
       Balão abaixo de "MAIS VENDIDOS"

       MOBILE:
       Tag pequena ao lado de "MAIS VENDIDOS"
    ========================================================= */


    /* =========================================================
       CSS
    ========================================================= */

    if (!$("#hz-promo-menu-style").length) {

        $("head").append(`
            <style id="hz-promo-menu-style">

                /* =====================================================
                   DESKTOP
                ===================================================== */

                #navbar-top-first
                .main-menu
                li[data-code="maisvendido"] {
                    position: relative !important;
                    overflow: visible !important;
                }


                .hz-mini-chat-desktop {
                    position: absolute;

                    top: calc(100% + 6px);
                    left: 50%;

                    transform: translateX(-50%);

                    display: inline-flex;
                    align-items: center;

                    gap: 6px;

                    height: 24px;

                    padding: 0 9px;

                    background: #111111;

                    border: 1px solid #e32222;
                    border-radius: 11px;

                    box-shadow:
                        0 5px 14px rgba(0,0,0,.22);

                    white-space: nowrap;

                    z-index: 999;

                    pointer-events: none;

                    font-family: inherit;
                }


                /* BICO DO BALÃO */

                .hz-mini-chat-desktop::before {
                    content: "";

                    position: absolute;

                    top: -5px;
                    left: 18px;

                    width: 8px;
                    height: 8px;

                    background: #111111;

                    border-top: 1px solid #e32222;
                    border-left: 1px solid #e32222;

                    transform: rotate(45deg);
                }


                /* 17% OFF */

                .hz-promo-off {
                    color: #ff3434;

                    font-size: 10px;
                    font-weight: 900;

                    line-height: 1;

                    letter-spacing: .1px;

                    white-space: nowrap;
                }


                /* DIVISOR */

                .hz-promo-divider {
                    width: 1px;
                    height: 10px;

                    background: rgba(255,255,255,.25);
                }


                /* TIMER */

                .hz-promo-timer {
                    display: inline-flex;
                    align-items: center;

                    color: #ffffff;

                    font-size: 10px;
                    font-weight: 800;

                    line-height: 1;

                    white-space: nowrap;
                }


                /* PONTO DE URGÊNCIA */

                .hz-promo-dot {
                    width: 5px;
                    height: 5px;

                    margin-right: 4px;

                    background: #ff3434;

                    border-radius: 50%;

                    animation:
                        hzPromoPulse 1.4s infinite;
                }


                @keyframes hzPromoPulse {

                    0% {
                        box-shadow:
                            0 0 0 0 rgba(255,52,52,.60);
                    }

                    70% {
                        box-shadow:
                            0 0 0 4px rgba(255,52,52,0);
                    }

                    100% {
                        box-shadow:
                            0 0 0 0 rgba(255,52,52,0);
                    }

                }


                /* =====================================================
                   MOBILE
                ===================================================== */

                .hz-mobile-promo {
                    display: none;
                }


                @media (max-width: 991px) {

                    /* ESCONDE DESKTOP */

                    .hz-mini-chat-desktop {
                        display: none !important;
                    }


                    /* ITEM MAIS VENDIDOS */

                    #mm-content-inner
                    .permalink-hitzz-em-alta > a {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: flex-start !important;

                        gap: 8px !important;
                    }


                    /* TAG MOBILE */

                    .hz-mobile-promo {
                        display: inline-flex !important;
                        align-items: center;

                        gap: 5px;

                        height: 20px;

                        padding: 0 7px;

                        margin-left: 3px;

                        background: #111111;

                        border-radius: 8px;

                        box-shadow:
                            0 2px 6px rgba(0,0,0,.16);

                        white-space: nowrap;

                        flex-shrink: 0;

                        vertical-align: middle;
                    }


                    /* 17% */

                    .hz-mobile-promo .hz-promo-off {
                        font-size: 9px;
                        font-weight: 900;

                        color: #ff3434;
                    }


                    /* DIVISOR */

                    .hz-mobile-promo .hz-promo-divider {
                        height: 9px;

                        background:
                            rgba(255,255,255,.24);
                    }


                    /* TIMER */

                    .hz-mobile-promo .hz-promo-timer {
                        font-size: 9px;
                        font-weight: 800;

                        color: #ffffff;
                    }


                    /* PONTO */

                    .hz-mobile-promo .hz-promo-dot {
                        width: 4px;
                        height: 4px;

                        margin-right: 3px;
                    }

                }

            </style>
        `);

    }


    /* =========================================================
       DESKTOP
    ========================================================= */

    function hzInsertDesktop() {

        var $desktopItem = $(
            '#navbar-top-first .main-menu li[data-code="maisvendido"]'
        ).first();


        if (!$desktopItem.length) {
            return false;
        }


        if ($desktopItem.find(".hz-mini-chat-desktop").length) {
            return true;
        }


        $desktopItem.append(`
            <div class="hz-mini-chat-desktop">

                <span class="hz-promo-off">
                    17% OFF
                </span>

                <span class="hz-promo-divider"></span>

                <span class="hz-promo-timer">

                    <span class="hz-promo-dot"></span>

                    <span class="hz-hours">00</span>
                    :
                    <span class="hz-minutes">00</span>
                    :
                    <span class="hz-seconds">00</span>

                </span>

            </div>
        `);


        return true;
    }


    /* =========================================================
       MOBILE
    ========================================================= */

    function hzInsertMobile() {

        var $mobileLink = $(
            '#mm-content-inner .permalink-hitzz-em-alta > a'
        ).first();


        if (!$mobileLink.length) {
            return false;
        }


        if ($mobileLink.find(".hz-mobile-promo").length) {
            return true;
        }


        $mobileLink.append(`
            <span class="hz-mobile-promo">

                <span class="hz-promo-off">
                    17% OFF
                </span>

                <span class="hz-promo-divider"></span>

                <span class="hz-promo-timer">

                    <span class="hz-promo-dot"></span>

                    <span class="hz-hours">00</span>
                    :
                    <span class="hz-minutes">00</span>
                    :
                    <span class="hz-seconds">00</span>

                </span>

            </span>
        `);


        return true;
    }


    /* =========================================================
       TIMER
       RESETA DIARIAMENTE ÀS 23:59:59
    ========================================================= */

    function hzUpdateTimer() {

        var now = new Date();


        var end = new Date();

        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        end.setMilliseconds(999);


        var diff =
            end.getTime() -
            now.getTime();


        if (diff < 0) {
            diff = 0;
        }


        var hours = Math.floor(
            diff /
            (1000 * 60 * 60)
        );


        var minutes = Math.floor(
            (
                diff %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


        var seconds = Math.floor(
            (
                diff %
                (1000 * 60)
            ) /
            1000
        );


        $(".hz-hours").text(
            String(hours).padStart(2, "0")
        );


        $(".hz-minutes").text(
            String(minutes).padStart(2, "0")
        );


        $(".hz-seconds").text(
            String(seconds).padStart(2, "0")
        );

    }


    /* =========================================================
       INICIALIZAÇÃO
    ========================================================= */

    hzInsertDesktop();

    hzInsertMobile();

    hzUpdateTimer();


    setInterval(
        hzUpdateTimer,
        1000
    );


    /* =========================================================
       UOOU PODE MONTAR O MENU MOBILE DEPOIS
       TENTA NOVAMENTE SEM CRIAR DUPLICATAS
    ========================================================= */

    var hzAttempts = 0;

    var hzMenuCheck = setInterval(function () {

        hzAttempts++;

        hzInsertDesktop();

        var mobileReady =
            hzInsertMobile();


        if (
            mobileReady ||
            hzAttempts >= 20
        ) {

            clearInterval(
                hzMenuCheck
            );

        }

    }, 500);

});