(function () {
  let inited = false;
  const REQUIRED_CLASS = "taxon-exclusive";  // Usar a classe "taxon-exclusive" para ativar o cupom

  const init = () => {
    if (inited) return;
    inited = true;

    // === CSS para o cupom ===
    const style = document.createElement("style");
    style.textContent = `
      .coupon-container {
        position: relative;
        width: 100%;
        max-width: 380px;
        height: auto;
        min-height: 110px;
        margin: 18px auto;
        padding: 0 16px;
        box-sizing: border-box;
        visibility: visible !important;
        z-index: 9999 !important;
        display: block !important;
      }

      .coupon-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: transform 0.3s ease;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }

      .coupon-wrapper:active {
        transform: scale(0.98);
      }

      .coupon-torn {
        position: relative;
        width: 100%;
        min-height: 110px;
        background: linear-gradient(135deg, #c31432 0%, #240b36 100%);
        border-radius: 14px;
        overflow: hidden;
        box-shadow:
          0 10px 30px rgba(195, 20, 50, 0.3),
          0 0 60px rgba(195, 20, 50, 0.2);
      }

      .coupon-torn::before {
        content: '❄ ❅ ❆';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 52px;
        opacity: 0.08;
        white-space: nowrap;
        letter-spacing: 26px;
        color: white;
        pointer-events: none;
      }

      .coupon-cover {
        position: absolute;
        top: 0;
        right: 0;
        width: 45%;
        height: 100%;
        background: linear-gradient(135deg, #0f4c3a 0%, #1a7a5e 50%, #0f4c3a 100%);
        clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 10% 100%, 12% 95%, 8% 88%, 14% 82%, 10% 75%, 15% 68%, 11% 60%, 16% 52%, 12% 45%, 17% 38%, 13% 30%, 18% 22%, 14% 15%, 19% 8%, 15% 3%);
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
      }

      .coupon-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 16px 18px;
        z-index: 10;
        gap: 14px;
      }

      .coupon-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
      }

      .coupon-title {
        font-size: 9px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0;
      }

      .coupon-code {
        font-size: 21px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        margin: 0;
        word-break: break-word;
        line-height: 1.2;
      }

      .coupon-validity {
        font-size: 8px;
        color: rgba(255, 255, 255, 0.75);
        font-weight: 500;
        line-height: 1.4;
        margin: 0;
      }

      .coupon-timer {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 700;
        margin: 0;
        animation: pulse 1.5s infinite;
      }

      .coupon-right {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .copy-icon {
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        cursor: pointer;
        touch-action: manipulation;
      }

      .copy-icon:active {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0.95);
      }

      .copy-icon svg {
        width: 22px;
        height: 22px;
        stroke: white;
        stroke-width: 2;
        fill: none;
      }

      .copy-feedback {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.92);
        color: white;
        padding: 18px 36px;
        border-radius: 14px;
        font-size: 17px;
        font-weight: 600;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        white-space: nowrap;
        z-index: 10000 !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      }

      .copy-feedback.show {
        opacity: 1;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }

      /* Tablets (768px) */
      @media (max-width: 768px) {
        .coupon-container {
          max-width: 350px;
          margin: 16px auto;
          padding: 0 14px;
        }

        .coupon-torn {
          min-height: 105px;
        }

        .coupon-torn::before {
          font-size: 48px;
          letter-spacing: 24px;
        }

        .coupon-content {
          padding: 15px 18px;
          gap: 12px;
        }

        .coupon-code {
          font-size: 20px;
        }

        .copy-icon {
          width: 42px;
          height: 42px;
        }

        .copy-icon svg {
          width: 21px;
          height: 21px;
        }
      }

      /* Mobile (480px) */
      @media (max-width: 480px) {
        .coupon-container {
          max-width: 100%;
          margin: 12px auto;
          padding: 0 10px;
        }

        .coupon-torn {
          min-height: 100px;
          border-radius: 12px;
        }

        .coupon-torn::before {
          font-size: 42px;
          letter-spacing: 20px;
        }

        .coupon-content {
          padding: 14px 14px;
          gap: 10px;
        }

        .coupon-title {
          font-size: 8px;
          letter-spacing: 0.8px;
        }

        .coupon-code {
          font-size: 18px;
        }

        .coupon-validity {
          font-size: 7px;
          line-height: 1.3;
        }

        .coupon-timer {
          font-size: 7px;
        }

        .coupon-right {
          margin-left: 6px;
        }

        .copy-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .copy-icon svg {
          width: 20px;
          height: 20px;
        }

        .copy-feedback {
          padding: 12px 24px;
          font-size: 14px;
        }
      }

      /* Celulares pequenos (360px) */
      @media (max-width: 360px) {
        .coupon-container {
          padding: 0 8px;
          margin: 10px auto;
        }

        .coupon-torn {
          min-height: 95px;
        }

        .coupon-content {
          padding: 12px 12px;
          gap: 8px;
        }

        .coupon-title {
          font-size: 7px;
        }

        .coupon-code {
          font-size: 17px;
        }

        .coupon-validity {
          font-size: 7px;
        }

        .copy-icon {
          width: 38px;
          height: 38px;
        }

        .copy-icon svg {
          width: 19px;
          height: 19px;
        }

        .coupon-cover {
          width: 40%;
        }
      }
    `;
    document.head.appendChild(style);

    // === HTML do cupom ===
    const cupomHTML = `
      <div class="coupon-container">
        <div class="coupon-wrapper">
          <div class="coupon-torn">
            <div class="coupon-content">
              <div class="coupon-left">
                <div class="coupon-timer" id="timer">Expira em: --:--:--</div>
                <div class="coupon-title">Oferta Exclusiva</div>
                <div class="coupon-validity">Você ganhou 8% OFF</div>
                <div class="coupon-code">NATALMALOA</div>
                <div class="coupon-validity">*válido apenas para a linha exclusive</div>
              </div>
              <div class="coupon-right">
                <div class="copy-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="coupon-cover"></div>
        </div>
        <div class="copy-feedback">✓ Cupom copiado!</div>
      </div>
    `;

    // === Inserir o cupom ===
    const target = document.querySelector(".txt-frete");
    if (target) {
      target.insertAdjacentHTML("beforebegin", cupomHTML);
      console.log("✅ Cupom inserido antes de .txt-frete");
    } else {
      document.body.insertAdjacentHTML("beforeend", cupomHTML);
      console.warn("⚠️ .txt-frete não encontrado. Inserido no final do body.");
    }

    // === Lógica do timer ===
    const timerEl = document.getElementById("timer");
    const endDate = new Date(new Date().getTime() + 72 * 60 * 60 * 1000).getTime();

    function updateTimer() {
      const now = Date.now();
      const diff = endDate - now;

      if (diff <= 0) {
        timerEl.textContent = "Oferta expirada";
        timerEl.style.color = "rgba(255, 100, 100, 0.8)";
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      timerEl.textContent = `Expira em: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // === Lógica de cópia ===
    const copyIcon = document.querySelector(".copy-icon");
    const copyFeedback = document.querySelector(".copy-feedback");
    const couponWrapper = document.querySelector(".coupon-wrapper");
    const couponCode = "NATALMALOA";

    function copiarCupom() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(couponCode)
          .then(() => {
            copyFeedback.classList.add("show");
            setTimeout(() => {
              copyFeedback.classList.remove("show");
            }, 2000);
          })
          .catch(() => usarFallback());
      } else {
        usarFallback();
      }
    }

    function usarFallback() {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = couponCode;
        textarea.style.position = "fixed";
        textarea.style.top = "-999999px";
        textarea.style.left = "-999999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);

        if (navigator.userAgent.match(/ipad|iphone/i)) {
          const range = document.createRange();
          range.selectNodeContents(textarea);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textarea.setSelectionRange(0, 999999);
        } else {
          textarea.select();
        }

        document.execCommand("copy");
        document.body.removeChild(textarea);

        copyFeedback.classList.add("show");
        setTimeout(() => {
          copyFeedback.classList.remove("show");
        }, 2000);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }

    if (copyIcon && couponWrapper) {
      copyIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarCupom();
      });
      copyIcon.addEventListener("touchend", (e) => {
        e.stopPropagation();
        copiarCupom();
      });
      couponWrapper.addEventListener("click", copiarCupom);
      couponWrapper.addEventListener("touchend", copiarCupom);
    }

    console.log("✅ Timer e cupom ativos com classe taxon-exclusive");
  };

  // === Ativação condicional ===
  const hasRequired = () => document.body.classList.contains(REQUIRED_CLASS);
  if (hasRequired()) { init(); return; }

  const obs = new MutationObserver(() => {
    if (hasRequired()) {
      obs.disconnect();
      init();
    }
  });
  obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  let tries = 0;
  const iv = setInterval(() => {
    if (hasRequired()) {
      clearInterval(iv);
      obs.disconnect();
      init();
    }
    if (++tries > 40) clearInterval(iv);
  }, 500);
})();
