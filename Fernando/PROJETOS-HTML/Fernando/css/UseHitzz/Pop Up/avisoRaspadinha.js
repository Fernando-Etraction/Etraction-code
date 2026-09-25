(function () {
  const WIDGET_ID = 'etraction-hitzz-scratch-floating';
  const STYLE_ID = 'etraction-hitzz-scratch-floating-style';

  const IMAGE_URL =
    'https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/usehitzz/chatgpt-image-31-de-ago.png';

  const RULES_URL =
    'https://www.usehitzz.com.br/mes-da-cliente-hitzz';

  function adicionarEstilos() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;

    style.textContent = `
      #${WIDGET_ID} {
        --hitzz-ink: #211a14;
        --hitzz-muted: #6c6155;
        --hitzz-paper: #f5ead7;
        --hitzz-gold: #9b672a;
        --hitzz-gold-dark: #744817;

        position: fixed;

        left: 35px;
        bottom: 25px;

        z-index: 9998;

        font-family:
          Arial,
          Helvetica,
          sans-serif;

        isolation: isolate;
      }

      #${WIDGET_ID} * {
        box-sizing: border-box;
      }

      /* =========================================
         IMAGEM
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__trigger-wrap {
        position: relative;

        width: 100px;
        height: 82px;
      }

      #${WIDGET_ID} .hitzz-scratch__trigger {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100px;
        height: 82px;

        padding: 0;
        margin: 0;

        border: 0;
        outline: 0;

        background: transparent;

        cursor: pointer;

        -webkit-tap-highlight-color:
          transparent;
      }

      #${WIDGET_ID} .hitzz-scratch__image {
        position: relative;

        z-index: 3;

        display: block;

        width: 94px;
        max-width: none;
        height: auto;

        pointer-events: none;

        filter:
          contrast(1.12)
          saturate(1.12)
          drop-shadow(
            0 7px 7px
            rgba(40, 25, 10, .28)
          );

        transform-origin:
          center;

        animation:
          hitzz-image-float
          2.5s
          ease-in-out
          infinite;

        transition:
          transform .22s ease,
          filter .22s ease;
      }

      #${WIDGET_ID} .hitzz-scratch__trigger:hover
      .hitzz-scratch__image {
        animation: none;

        transform:
          translateY(-3px)
          rotate(-2deg)
          scale(1.07);

        filter:
          contrast(1.15)
          saturate(1.15)
          drop-shadow(
            0 9px 9px
            rgba(40,25,10,.32)
          );
      }

      /* =========================================
         PULSO ATRÁS DA IMAGEM
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__pulse {
        position: absolute;

        left: 50%;
        top: 50%;

        width: 58px;
        height: 58px;

        z-index: 0;

        border:
          1.5px solid
          rgba(155,103,42,.35);

        border-radius: 50%;

        transform:
          translate(-50%, -50%);

        animation:
          hitzz-pulse
          2.2s
          ease-out
          infinite;

        pointer-events: none;
      }

      #${WIDGET_ID} .hitzz-scratch__pulse--2 {
        animation-delay: 1.1s;
      }

      /* =========================================
         X
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__close {
        position: absolute;

        top: 0;
        right: -2px;

        z-index: 10;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 21px;
        height: 21px;

        padding: 0;

        border:
          1px solid
          rgba(155,103,42,.38);

        border-radius: 50%;

        background:
          #fffaf2;

        color:
          #806849;

        box-shadow:
          0 3px 8px
          rgba(50,30,12,.12);

        font-size: 12px;
        font-weight: 500;

        line-height: 1;

        cursor: pointer;

        transition:
          transform .18s ease,
          background .18s ease,
          color .18s ease;
      }

      #${WIDGET_ID} .hitzz-scratch__close:hover {
        transform:
          scale(1.08);

        background:
          #ead7b9;

        color:
          var(--hitzz-gold-dark);
      }

      /* =========================================
         MENSAGEM TEMPORÁRIA
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__message {
        position: absolute;

        left: 108px;
        bottom: 16px;

        z-index: 20;

        display: flex;
        align-items: center;

        min-width: 175px;
        min-height: 45px;

        padding:
          10px
          13px;

        border:
          1px solid
          rgba(155,103,42,.28);

        border-radius: 11px;

        background:
          #fffaf2;

        color:
          var(--hitzz-ink);

        box-shadow:
          0 10px 28px
          rgba(42,27,13,.18);

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size: 13px;
        font-weight: 700;

        line-height: 1.15;

        opacity: 0;
        visibility: hidden;

        pointer-events: none;

        transform:
          translateX(-8px)
          scale(.96);

        transition:
          opacity .22s ease,
          transform .25s ease,
          visibility .22s;
      }

      #${WIDGET_ID} .hitzz-scratch__message::before {
        content: "";

        position: absolute;

        left: -6px;
        bottom: 15px;

        width: 11px;
        height: 11px;

        border-left:
          1px solid
          rgba(155,103,42,.28);

        border-bottom:
          1px solid
          rgba(155,103,42,.28);

        background:
          #fffaf2;

        transform:
          rotate(45deg);
      }

      #${WIDGET_ID}.show-message
      .hitzz-scratch__message {
        opacity: 1;
        visibility: visible;

        transform:
          translateX(0)
          scale(1);

        animation:
          hitzz-message-in
          .5s
          cubic-bezier(.2,.9,.25,1.15);
      }

      /* =========================================
         MODAL
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__panel {
        position: absolute;

        left: 108px;
        bottom: 0;

        width: 220px;

        padding:
          12px
          13px
          13px;

        border:
          1px solid
          rgba(155,103,42,.28);

        border-radius: 12px;

        background:
          linear-gradient(
            145deg,
            #fffdf8 0%,
            #f4e6d0 100%
          );

        color:
          var(--hitzz-ink);

        box-shadow:
          0 15px 34px
          rgba(37,23,10,.20);

        opacity: 0;
        visibility: hidden;

        pointer-events: none;

        transform:
          translateX(-9px)
          scale(.96);

        transform-origin:
          left bottom;

        transition:
          opacity .22s ease,
          transform .25s ease,
          visibility .22s;
      }

      #${WIDGET_ID} .hitzz-scratch__panel::before {
        content: "";

        position: absolute;

        left: -6px;
        bottom: 25px;

        width: 11px;
        height: 11px;

        border-left:
          1px solid
          rgba(155,103,42,.25);

        border-bottom:
          1px solid
          rgba(155,103,42,.25);

        background:
          #f6e9d5;

        transform:
          rotate(45deg);
      }

      #${WIDGET_ID}.is-open
      .hitzz-scratch__panel {
        opacity: 1;
        visibility: visible;

        pointer-events: auto;

        transform:
          translateX(0)
          scale(1);
      }

      #${WIDGET_ID}.is-open
      .hitzz-scratch__message {
        opacity: 0;
        visibility: hidden;
      }

      #${WIDGET_ID}.is-auto-open
      .hitzz-scratch__panel {
        animation:
          hitzz-modal-auto
          .55s
          cubic-bezier(.2,.9,.25,1.15);
      }

      /* =========================================
         COPY MODAL
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__title {
        display: block;

        margin: 0;

        color:
          var(--hitzz-ink);

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size: 14px;
        font-weight: 700;

        line-height: 1.1;
      }

      #${WIDGET_ID} .hitzz-scratch__text {
        display: block;

        margin-top: 5px;

        color:
          var(--hitzz-muted);

        font-size: 9px;

        line-height: 1.38;
      }

      /* =========================================
         CTA
      ========================================= */

      #${WIDGET_ID} .hitzz-scratch__cta {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 6px;

        width: 100%;

        min-height: 37px;

        margin-top: 9px;

        padding:
          0
          10px;

        border: 0;

        border-radius: 7px;

        background:
          linear-gradient(
            135deg,
            #9b672a 0%,
            #744817 100%
          );

        color:
          #fff !important;

        box-shadow:
          0 7px 16px
          rgba(116,72,23,.25);

        font-size: 8.5px;
        font-weight: 900;

        line-height: 1;

        letter-spacing: .025em;

        text-align: center;

        text-decoration:
          none !important;

        text-transform: uppercase;

        transition:
          transform .2s ease,
          box-shadow .2s ease;
      }

      #${WIDGET_ID} .hitzz-scratch__cta::after {
        content: "→";

        font-size: 13px;

        transition:
          transform .2s ease;
      }

      #${WIDGET_ID} .hitzz-scratch__cta:hover {
        transform:
          translateY(-2px);

        box-shadow:
          0 10px 21px
          rgba(116,72,23,.31);
      }

      #${WIDGET_ID} .hitzz-scratch__cta:hover::after {
        transform:
          translateX(3px);
      }

      /* =========================================
         FECHAMENTO
      ========================================= */

      #${WIDGET_ID}.is-closing {
        pointer-events: none;

        animation:
          hitzz-close
          .22s
          ease
          forwards;
      }

      /* =========================================
         ANIMAÇÕES
      ========================================= */

      @keyframes hitzz-image-float {
        0%,
        100% {
          transform:
            translateY(0)
            rotate(-1deg);
        }

        50% {
          transform:
            translateY(-3px)
            rotate(1deg)
            scale(1.035);
        }
      }

      @keyframes hitzz-pulse {
        0% {
          opacity: .6;

          transform:
            translate(-50%, -50%)
            scale(.7);
        }

        100% {
          opacity: 0;

          transform:
            translate(-50%, -50%)
            scale(1.55);
        }
      }

      @keyframes hitzz-message-in {
        0% {
          opacity: 0;

          transform:
            translateX(-12px)
            scale(.9);
        }

        70% {
          opacity: 1;

          transform:
            translateX(2px)
            scale(1.02);
        }

        100% {
          opacity: 1;

          transform:
            translateX(0)
            scale(1);
        }
      }

      @keyframes hitzz-modal-auto {
        0% {
          opacity: 0;

          transform:
            translateX(-16px)
            scale(.9);
        }

        60% {
          opacity: 1;

          transform:
            translateX(3px)
            scale(1.02);
        }

        100% {
          opacity: 1;

          transform:
            translateX(0)
            scale(1);
        }
      }

      @keyframes hitzz-close {
        from {
          opacity: 1;
          transform: scale(1);
        }

        to {
          opacity: 0;
          transform: scale(.94);
        }
      }

      /* =========================================
         MOBILE
      ========================================= */

      @media (max-width: 600px) {

        #${WIDGET_ID} {
          left: 18px;
          bottom: 16px;
        }

        #${WIDGET_ID} .hitzz-scratch__trigger-wrap,
        #${WIDGET_ID} .hitzz-scratch__trigger {
          width: 82px;
          height: 70px;
        }

        #${WIDGET_ID} .hitzz-scratch__image {
          width: 78px;
        }

        #${WIDGET_ID} .hitzz-scratch__pulse {
          width: 49px;
          height: 49px;
        }

        #${WIDGET_ID} .hitzz-scratch__close {
          top: 0;
          right: -2px;

          width: 20px;
          height: 20px;

          font-size: 11px;
        }

        #${WIDGET_ID} .hitzz-scratch__message {
          position: fixed;

          left: 18px;
          bottom: 93px;

          min-width: 0;
          width: 200px;

          font-size: 12px;
        }

        #${WIDGET_ID} .hitzz-scratch__message::before {
          left: 28px;
          bottom: -6px;

          border-left: 0;
          border-bottom:
            1px solid
            rgba(155,103,42,.28);

          border-right:
            1px solid
            rgba(155,103,42,.28);

          transform:
            rotate(45deg);
        }

        #${WIDGET_ID} .hitzz-scratch__panel {
          position: fixed;

          left: 18px;
          bottom: 93px;

          width: 205px;

          padding:
            11px
            12px
            12px;
        }

        #${WIDGET_ID} .hitzz-scratch__panel::before {
          display: none;
        }

        #${WIDGET_ID} .hitzz-scratch__title {
          font-size: 13px;
        }

        #${WIDGET_ID} .hitzz-scratch__text {
          font-size: 8.5px;
        }

        #${WIDGET_ID} .hitzz-scratch__cta {
          min-height: 35px;

          margin-top: 8px;

          font-size: 8px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${WIDGET_ID} *,
        #${WIDGET_ID} *::before,
        #${WIDGET_ID} *::after {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function configurarEventos(widget) {
    const trigger =
      widget.querySelector(
        '.hitzz-scratch__trigger'
      );

    const close =
      widget.querySelector(
        '.hitzz-scratch__close'
      );

    const panel =
      widget.querySelector(
        '.hitzz-scratch__panel'
      );

    let interagiu = false;

    let timerMensagem = null;
    let timerFecharMensagem = null;
    let timerModal = null;

    function limparTimers() {
      if (timerMensagem) {
        clearTimeout(timerMensagem);
        timerMensagem = null;
      }

      if (timerFecharMensagem) {
        clearTimeout(timerFecharMensagem);
        timerFecharMensagem = null;
      }

      if (timerModal) {
        clearTimeout(timerModal);
        timerModal = null;
      }
    }

    function mostrarMensagem() {
      if (
        interagiu ||
        !document.body.contains(widget)
      ) {
        return;
      }

      widget.classList.add(
        'show-message'
      );
    }

    function esconderMensagem() {
      widget.classList.remove(
        'show-message'
      );
    }

    function setOpen(open, automatico) {
      esconderMensagem();

      widget.classList.toggle(
        'is-open',
        open
      );

      trigger.setAttribute(
        'aria-expanded',
        String(open)
      );

      panel.setAttribute(
        'aria-hidden',
        String(!open)
      );

      if (automatico && open) {
        widget.classList.remove(
          'is-auto-open'
        );

        void widget.offsetWidth;

        widget.classList.add(
          'is-auto-open'
        );

        setTimeout(
          function () {
            widget.classList.remove(
              'is-auto-open'
            );
          },
          900
        );
      }
    }

    function fecharWidget() {
      interagiu = true;

      limparTimers();

      esconderMensagem();

      widget.classList.remove(
        'is-open'
      );

      widget.classList.add(
        'is-closing'
      );

      setTimeout(
        function () {
          if (widget.parentNode) {
            widget.remove();
          }
        },
        220
      );
    }

    trigger.addEventListener(
      'click',
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        interagiu = true;

        limparTimers();

        setOpen(
          !widget.classList.contains(
            'is-open'
          ),
          false
        );
      }
    );

    close.addEventListener(
      'click',
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        fecharWidget();
      }
    );

    document.addEventListener(
      'click',
      function (event) {
        if (
          document.body.contains(widget) &&
          !widget.contains(event.target)
        ) {
          setOpen(false, false);
        }
      }
    );

    document.addEventListener(
      'keydown',
      function (event) {
        if (
          event.key === 'Escape' &&
          document.body.contains(widget)
        ) {
          setOpen(false, false);
        }
      }
    );

    /* =========================================
       5s -> MOSTRA MENSAGEM
    ========================================= */

    timerMensagem =
      setTimeout(
        function () {
          mostrarMensagem();
        },
        5000
      );

    /* =========================================
       10s -> FECHA MENSAGEM
       Ficou aberta por 5 segundos
    ========================================= */

    timerFecharMensagem =
      setTimeout(
        function () {
          esconderMensagem();
        },
        10000
      );

    /* =========================================
       15s -> ABRE MODAL
    ========================================= */

    timerModal =
      setTimeout(
        function () {
          if (
            interagiu ||
            !document.body.contains(widget)
          ) {
            return;
          }

          setOpen(true, true);
        },
        15000
      );
  }

  function criarWidget() {
    if (
      document.getElementById(
        WIDGET_ID
      )
    ) {
      return true;
    }

    if (!document.body) {
      return false;
    }

    adicionarEstilos();

    const widget =
      document.createElement('aside');

    widget.id =
      WIDGET_ID;

    widget.setAttribute(
      'aria-label',
      'Raspadinha surpresa'
    );

    widget.innerHTML = `
      <div
        class="hitzz-scratch__trigger-wrap"
      >

        <button
          class="hitzz-scratch__trigger"
          type="button"
          aria-expanded="false"
          aria-label="Abrir surpresa"
        >

          <span
            class="hitzz-scratch__pulse"
            aria-hidden="true"
          ></span>

          <span
            class="hitzz-scratch__pulse hitzz-scratch__pulse--2"
            aria-hidden="true"
          ></span>

          <img
            class="hitzz-scratch__image"
            src="${IMAGE_URL}"
            alt=""
            width="360"
            height="240"
            loading="eager"
            decoding="async"
          >

        </button>

        <button
          class="hitzz-scratch__close"
          type="button"
          aria-label="Fechar"
          title="Fechar"
        >
          ×
        </button>

      </div>

      <div
        class="hitzz-scratch__message"
        aria-live="polite"
      >
        Temos uma surpresa para você ✦
      </div>

      <div
        class="hitzz-scratch__panel"
        aria-hidden="true"
      >

        <strong
          class="hitzz-scratch__title"
        >
          Temos uma surpresa para você.
        </strong>

        <span
          class="hitzz-scratch__text"
        >
          Faça seu pedido, receba sua raspadinha
          e descubra um benefício para aproveitar
          na próxima compra.
        </span>

        <a
          class="hitzz-scratch__cta"
          href="${RULES_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver regras e benefícios
        </a>

      </div>
    `;

    document.body.appendChild(
      widget
    );

    configurarEventos(
      widget
    );

    return true;
  }

  function iniciar() {
    if (criarWidget()) {
      return;
    }

    const observer =
      new MutationObserver(
        function () {
          if (criarWidget()) {
            observer.disconnect();
          }
        }
      );

    observer.observe(
      document.documentElement,
      {
        childList: true,
        subtree: true
      }
    );

    setTimeout(
      function () {
        observer.disconnect();
      },
      15000
    );
  }

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      iniciar
    );
  } else {
    iniciar();
  }
})();