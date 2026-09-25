(function () {
    const HITZZ_ID = 'etraction-hitzz-scratch-cart';
    const STYLE_ID = 'etraction-hitzz-scratch-cart-style';

    const IMAGE_URL =
        'https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/usehitzz/chatgpt-image-31-de-ago.png';

    function inserirEstilos() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;

        style.textContent = `
      #${HITZZ_ID} {
        --scratch-cart-ink: #17130f;
        --scratch-cart-muted: #655c51;
        --scratch-cart-paper: #f8f2e7;
        --scratch-cart-line: #d7c4a4;
        --scratch-cart-accent: #9b672a;

        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 124px;
        margin: 12px 0;
        padding: 12px 20px 12px 12px;
        overflow: hidden;

        border: 1px solid var(--scratch-cart-line);
        border-radius: 12px;

        background:
          radial-gradient(
            circle at 0 0,
            rgb(255 255 255 / 85%),
            transparent 40%
          ),
          linear-gradient(
            135deg,
            #fbf8f1 0%,
            var(--scratch-cart-paper) 100%
          );

        box-shadow: 0 5px 16px rgb(61 43 25 / 8%);

        color: var(--scratch-cart-ink);
        font-family: Arial, Helvetica, sans-serif;
        box-sizing: border-box;
      }

      #${HITZZ_ID}::after {
        content: "";
        position: absolute;
        inset: 5px;
        border: 1px solid rgb(155 103 42 / 10%);
        border-radius: 8px;
        pointer-events: none;
      }

      /* ==========================
         IMAGEM
      ========================== */

      #${HITZZ_ID} .hitzz-scratch-cart__art {
        position: relative;
        z-index: 2;

        flex: 0 0 115px;
        width: 115px;

        display: flex;
        align-items: center;
        justify-content: center;

        margin-right: 20px;

        transform: translateX(5px);
      }

      #${HITZZ_ID} .hitzz-scratch-cart__art img {
        display: block;

        width: 125px;
        max-width: none;
        height: auto;

        filter:
          drop-shadow(0 6px 6px rgb(45 30 15 / 16%));

        transform-origin: center center;

        animation:
          hitzz-image-pulse 2s ease-in-out infinite;

        will-change: transform;
      }

      @keyframes hitzz-image-pulse {
        0% {
          transform: scale(1) rotate(-1deg);
        }

        50% {
          transform: scale(1.07) rotate(1deg);
        }

        100% {
          transform: scale(1) rotate(-1deg);
        }
      }

      /* ==========================
         CONTEÚDO
      ========================== */

      #${HITZZ_ID} .hitzz-scratch-cart__content {
        position: relative;
        z-index: 2;

        flex: 1 1 auto;
        min-width: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 30px;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__copy {
        flex: 1 1 auto;
        min-width: 0;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__title {
        display: block;
        width: 100%;
        max-width: 650px;
        margin: 0;

        color: var(--scratch-cart-ink);

        font-family: Georgia, "Times New Roman", serif;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -.01em;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__title span {
        color: var(--scratch-cart-accent);
        font-size: .8em;
        white-space: nowrap;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__text {
        width: 100%;
        max-width: 700px;

        margin: 7px 0 0;

        color: var(--scratch-cart-muted);

        font-size: 13px;
        font-weight: 400;
        line-height: 1.45;
      }

      /* ==========================
         CTA DIREITA
      ========================== */

      #${HITZZ_ID} .hitzz-scratch-cart__link {
        flex: 0 0 auto;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        min-height: 42px;

        padding: 0 18px;

        border: 1px solid var(--scratch-cart-accent);
        border-radius: 7px;

        background: rgb(255 255 255 / 45%);

        color: var(--scratch-cart-ink);

        font-size: 12px;
        font-weight: 700;
        line-height: 1;

        text-decoration: none;

        white-space: nowrap;

        transition:
          background .2s ease,
          color .2s ease,
          transform .2s ease;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__link:hover {
        background: var(--scratch-cart-accent);
        color: #fff;

        transform: translateY(-1px);
      }

      #${HITZZ_ID} .hitzz-scratch-cart__link span {
        font-size: 15px;
        transition: transform .2s ease;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__link:hover span {
        transform: translateX(3px);
      }

      /* ==========================
         BRILHOS
      ========================== */

      #${HITZZ_ID} .hitzz-scratch-cart__spark {
        position: absolute;
        z-index: 3;

        color: var(--scratch-cart-accent);

        font-family: Georgia, serif;
        line-height: 1;

        animation:
          hitzz-cart-twinkle 2.4s ease-in-out infinite;

        pointer-events: none;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__spark--one {
        top: 2px;
        right: 2px;
        font-size: 12px;
      }

      #${HITZZ_ID} .hitzz-scratch-cart__spark--two {
        right: 16px;
        bottom: 2px;
        font-size: 8px;
        animation-delay: 1.1s;
      }

      @keyframes hitzz-cart-twinkle {
        0%,
        100% {
          opacity: .35;
          transform: scale(.8) rotate(0);
        }

        50% {
          opacity: 1;
          transform: scale(1.15) rotate(12deg);
        }
      }

      /* ==========================
         TABLET
      ========================== */

      @media (max-width: 900px) {
        #${HITZZ_ID} .hitzz-scratch-cart__content {
          gap: 15px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__title {
          font-size: 16px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__text {
          font-size: 12px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__link {
          padding: 0 14px;
        }
      }

      /* ==========================
         MOBILE
      ========================== */

      @media (max-width: 600px) {
        #${HITZZ_ID} {
          min-height: 104px;

          padding:
            10px
            11px
            10px
            5px;

          border-radius: 10px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__art {
          flex: 0 0 88px;
          width: 88px;

          margin-right: 10px;

          transform: translateX(5px);
        }

        #${HITZZ_ID} .hitzz-scratch-cart__art img {
          width: 96px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__content {
          display: block;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__title {
          max-width: none;

          font-size: 13.5px;
          line-height: 1.2;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__text {
          max-width: none;

          margin: 5px 0 7px;

          font-size: 10.5px;
          line-height: 1.32;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__link {
          display: inline-flex;

          min-height: auto;

          padding: 0;

          border: 0;
          border-radius: 0;

          background: transparent;

          color: var(--scratch-cart-ink);

          font-size: 10.5px;

          text-decoration: underline;
          text-decoration-color: var(--scratch-cart-accent);
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__link:hover {
          background: transparent;
          color: var(--scratch-cart-accent);

          transform: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${HITZZ_ID} .hitzz-scratch-cart__spark,
        #${HITZZ_ID} .hitzz-scratch-cart__art img {
          animation: none;
        }

        #${HITZZ_ID} .hitzz-scratch-cart__link {
          transition: none;
        }
      }
    `;

        document.head.appendChild(style);
    }

    function inserirInformativo() {
        const cartBody = document.getElementById('cartBody');

        if (!cartBody) return false;

        if (document.getElementById(HITZZ_ID)) {
            return true;
        }

        inserirEstilos();

        const elemento = document.createElement('aside');

        elemento.id = HITZZ_ID;
        elemento.className = 'hitzz-scratch-cart';

        elemento.setAttribute(
            'aria-labelledby',
            'hitzz-scratch-cart-title'
        );

        elemento.innerHTML = `
      <div
        class="hitzz-scratch-cart__art"
        aria-hidden="true"
      >

        <span
          class="hitzz-scratch-cart__spark hitzz-scratch-cart__spark--one"
        >
          ✦
        </span>

        <span
          class="hitzz-scratch-cart__spark hitzz-scratch-cart__spark--two"
        >
          ✦
        </span>

        <img
          src="${IMAGE_URL}"
          alt=""
          width="720"
          height="480"
          loading="lazy"
          decoding="async"
        >

      </div>

      <div class="hitzz-scratch-cart__content">

        <div class="hitzz-scratch-cart__copy">

          <strong
            class="hitzz-scratch-cart__title"
            id="hitzz-scratch-cart-title"
          >
            Seu pedido acompanha uma raspadinha surpresa
            <span aria-hidden="true">✦</span>
          </strong>

          <p class="hitzz-scratch-cart__text">
            Raspe e descubra: você pode desbloquear benefícios
            para usar na sua próxima compra.
          </p>

        </div>

        <a
          class="hitzz-scratch-cart__link"
          href="https://www.usehitzz.com.br/mes-da-cliente-hitzz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Confira as regras
          <span aria-hidden="true">→</span>
        </a>

      </div>
    `;

        cartBody.parentNode.insertBefore(
            elemento,
            cartBody
        );

        return true;
    }

    function iniciar() {
        if (inserirInformativo()) return;

        const observer = new MutationObserver(function () {
            if (inserirInformativo()) {
                observer.disconnect();
            }
        });

        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );

        setTimeout(function () {
            observer.disconnect();
        }, 15000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            iniciar
        );
    } else {
        iniciar();
    }
})();