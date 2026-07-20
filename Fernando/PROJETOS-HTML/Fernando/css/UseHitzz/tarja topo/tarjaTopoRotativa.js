(function () {
  "use strict";

  var TOPBAR_ID = "hitzz-topbar";
  var STYLE_ID = "hitzz-topbar-style";
  var AUTOPLAY_TIME = 2000;
  var TARGET_URL = "https://www.usehitzz.com.br/leve-3-pague-2";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${TOPBAR_ID},
      #${TOPBAR_ID} * {
        box-sizing: border-box;
      }

      #${TOPBAR_ID} {
        position: relative;
        z-index: 9999;
        width: 100%;
        height: 40px;
        overflow: hidden;
        background: #000000;
        color: #ffffff;
        font-family: inherit;
        cursor: pointer;
        outline: none;
      }

      #${TOPBAR_ID}:focus-visible {
        outline: 2px solid #ffffff;
        outline-offset: -3px;
      }

      #${TOPBAR_ID} .hitzz-topbar__container,
      #${TOPBAR_ID} .hitzz-topbar__viewport {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #${TOPBAR_ID} .hitzz-topbar__track {
        display: flex;
        width: 100%;
        height: 100%;
        transform: translate3d(0, 0, 0);
        transition: transform 0.45s ease;
        will-change: transform;
      }

      #${TOPBAR_ID} .hitzz-topbar__slide {
        display: flex;
        flex: 0 0 100%;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0 55px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }

      #${TOPBAR_ID} .hitzz-topbar__text {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: 0.04em;
        text-align: center;
        text-transform: uppercase;
        pointer-events: none;
      }

      #${TOPBAR_ID} strong {
        font-weight: 700;
      }

      #${TOPBAR_ID} .hitzz-topbar__button {
        position: absolute;
        top: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: #ffffff;
        cursor: pointer;
        opacity: 0.75;
        transition: opacity 0.2s ease;
      }

      #${TOPBAR_ID} .hitzz-topbar__button:hover {
        opacity: 1;
      }

      #${TOPBAR_ID} .hitzz-topbar__button:focus-visible {
        outline: 2px solid #ffffff;
        outline-offset: -3px;
      }

      #${TOPBAR_ID} .hitzz-topbar__button--previous {
        left: 0;
      }

      #${TOPBAR_ID} .hitzz-topbar__button--next {
        right: 0;
      }

      #${TOPBAR_ID} .hitzz-topbar__button svg {
        display: block;
        width: 15px;
        height: 15px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
      }

      @media (max-width: 767px) {
        #${TOPBAR_ID} {
          height: 44px;
        }

        #${TOPBAR_ID} .hitzz-topbar__slide {
          padding: 0 42px;
        }

        #${TOPBAR_ID} .hitzz-topbar__text {
          max-width: 290px;
          font-size: 10px;
          line-height: 1.3;
          letter-spacing: 0.025em;
        }

        #${TOPBAR_ID} .hitzz-topbar__button {
          width: 38px;
        }

        #${TOPBAR_ID} .hitzz-topbar__button svg {
          width: 13px;
          height: 13px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${TOPBAR_ID} .hitzz-topbar__track {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createArrow(direction) {
    var svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    var path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    path.setAttribute(
      "d",
      direction === "previous"
        ? "M15 18l-6-6 6-6"
        : "M9 6l6 6-6 6"
    );

    svg.appendChild(path);

    return svg;
  }

  function createButton(direction) {
    var button = document.createElement("button");

    button.type = "button";

    button.className =
      "hitzz-topbar__button hitzz-topbar__button--" + direction;

    button.setAttribute(
      "aria-label",
      direction === "previous"
        ? "Informação anterior"
        : "Próxima informação"
    );

    button.appendChild(createArrow(direction));

    return button;
  }

  function createSlide(html) {
    var slide = document.createElement("div");
    var text = document.createElement("span");

    slide.className = "hitzz-topbar__slide";
    slide.setAttribute("aria-hidden", "true");

    text.className = "hitzz-topbar__text";
    text.innerHTML = html;

    slide.appendChild(text);

    return slide;
  }

  function initializeCarousel(topbar) {
    var track = topbar.querySelector(".hitzz-topbar__track");

    var slides = Array.prototype.slice.call(
      topbar.querySelectorAll(".hitzz-topbar__slide")
    );

    var previousButton = topbar.querySelector(
      ".hitzz-topbar__button--previous"
    );

    var nextButton = topbar.querySelector(
      ".hitzz-topbar__button--next"
    );

    var currentIndex = 0;
    var autoplayTimer = null;
    var touchStartX = 0;
    var touchEndX = 0;
    var wasDragging = false;

    function updateSlide() {
      track.style.transform =
        "translate3d(-" + currentIndex * 100 + "%, 0, 0)";

      slides.forEach(function (slide, index) {
        slide.setAttribute(
          "aria-hidden",
          index === currentIndex ? "false" : "true"
        );
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlide();
    }

    function previousSlide() {
      currentIndex =
        (currentIndex - 1 + slides.length) % slides.length;

      updateSlide();
    }

    function stopAutoplay() {
      if (!autoplayTimer) {
        return;
      }

      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }

    function startAutoplay() {
      stopAutoplay();

      autoplayTimer = window.setTimeout(function autoplay() {
        nextSlide();

        autoplayTimer = window.setTimeout(
          autoplay,
          AUTOPLAY_TIME
        );
      }, AUTOPLAY_TIME);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function redirectToPage() {
      window.location.href = TARGET_URL;
    }

    topbar.addEventListener("click", function (event) {
      if (event.target.closest(".hitzz-topbar__button")) {
        return;
      }

      if (wasDragging) {
        wasDragging = false;
        return;
      }

      redirectToPage();
    });

    topbar.addEventListener("keydown", function (event) {
      if (
        event.target.closest(".hitzz-topbar__button") ||
        (event.key !== "Enter" && event.key !== " ")
      ) {
        return;
      }

      event.preventDefault();
      redirectToPage();
    });

    previousButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      previousSlide();
      restartAutoplay();
    });

    nextButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      nextSlide();
      restartAutoplay();
    });

    track.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
        touchEndX = touchStartX;
        wasDragging = false;

        stopAutoplay();
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      function (event) {
        touchEndX = event.changedTouches[0].clientX;

        if (Math.abs(touchStartX - touchEndX) > 10) {
          wasDragging = true;
        }
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      function () {
        var movement = touchStartX - touchEndX;

        if (Math.abs(movement) >= 40) {
          if (movement > 0) {
            nextSlide();
          } else {
            previousSlide();
          }
        }

        restartAutoplay();

        window.setTimeout(function () {
          wasDragging = false;
        }, 100);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        restartAutoplay();
      }
    });

    updateSlide();
    startAutoplay();
  }

  function createTopbar() {
    if (document.getElementById(TOPBAR_ID)) {
      return;
    }

    injectStyles();

    var items = [
      "Frete grátis acima de&nbsp;<strong>R$ 499,90</strong>",
      "<strong>5% OFF extra</strong>&nbsp;pagando no Pix",
      "Parcelamento em até&nbsp;<strong>8x sem juros</strong>",
      "Cadastre-se e receba&nbsp;<strong>8% OFF</strong>&nbsp;na sua primeira compra"
    ];

    var topbar = document.createElement("div");
    var container = document.createElement("div");
    var viewport = document.createElement("div");
    var track = document.createElement("div");

    var previousButton = createButton("previous");
    var nextButton = createButton("next");

    topbar.id = TOPBAR_ID;
    topbar.tabIndex = 0;

    topbar.setAttribute("role", "link");
    topbar.setAttribute(
      "aria-label",
      "Acessar promoção Leve 3 e Pague 2"
    );

    container.className = "hitzz-topbar__container";
    viewport.className = "hitzz-topbar__viewport";
    track.className = "hitzz-topbar__track";

    items.forEach(function (item) {
      track.appendChild(createSlide(item));
    });

    viewport.appendChild(track);

    container.appendChild(previousButton);
    container.appendChild(viewport);
    container.appendChild(nextButton);

    topbar.appendChild(container);

    var currentTopbar = document.querySelector("#navbar__top");

    if (currentTopbar && currentTopbar.parentNode) {
      currentTopbar.parentNode.insertBefore(
        topbar,
        currentTopbar
      );

      currentTopbar.remove();
    } else {
      document.body.insertBefore(
        topbar,
        document.body.firstChild
      );
    }

    initializeCarousel(topbar);
  }

  function init() {
    createTopbar();

    var observer = new MutationObserver(function () {
      var oldTopbar = document.querySelector("#navbar__top");

      if (oldTopbar) {
        oldTopbar.remove();
      }

      if (!document.getElementById(TOPBAR_ID)) {
        createTopbar();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();