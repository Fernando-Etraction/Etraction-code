/* ===== VERSÃO A: PRETO/BRANCO (Pedido do Cliente) =====
   Máximo contraste - muito chamativo
   ⚠️ Pode competir com o CTA de compra

   Ajustes:
   - mantém padrão UOOU
   - evita observer infinito
   - observer desliga sozinho quando o bloco estabiliza
   - retries continuam limitados
*/
(() => {
  console.log("💖 [HITZZ TOPO] Script iniciado - VERSÃO A (Preto/Branco)");

  const CONFIG = {
    targetSelector: ".parcelas-produto",
    fallbackTargets: [
      "#corpo .acoes-produto div.comprar",
      "#corpo .span12.produto",
      "#corpo .produto",
      "#corpo"
    ],
    retries: 50,
    retryDelay: 500,
    observerTimeout: 15000,

    badgeText: "Ação do Mês",
    promoTitle: "1 Ano de Hitzz",
    promoSubtitle: "Compras acima de R$ 699,90 concorrem a 1 Hitzz por mês durante 12 meses",
    promoFooter: "Sorteio realizado no final do mês"
  };

  const GLOBAL_KEY = "__HITZZ_TOPO_PROMO__";
  const ROOT_ID = "hitzzPromoTopoRoot";
  const STYLE_ID = "hitzz-promo-topo-style-live";

  if (window[GLOBAL_KEY] && window[GLOBAL_KEY].mounted) {
    console.log("⚠️ [HITZZ TOPO] Script já inicializado");
    return;
  }

  window[GLOBAL_KEY] = {
    mounted: false,
    observer: null,
    retryTimer: null,
    stopObserverTimer: null,
    isMounting: false,
    observerStopped: false
  };

  const CSS = `
    #${ROOT_ID}.hitzz-promo-wrap-topo {
      width: 100%;
      box-sizing: border-box;
      margin: 0 0 18px 0;
      display: block;
      clear: both;
    }

    #${ROOT_ID} .hitzz-promo {
      font-family: Roboto, Arial, sans-serif;
      width: 100%;
      margin: 0;
      border: none;
      border-radius: 12px;
      padding: 18px 22px;
      box-sizing: border-box;
      text-align: center;
      background: #1a1a1a;
      position: relative;
      overflow: hidden;
    }

    #${ROOT_ID} .hitzz-promo::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #fff, #ccc, #fff);
    }

    #${ROOT_ID} .hitzz-promo-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 8px;
      opacity: 0.85;
    }

    #${ROOT_ID} .hitzz-promo-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0px;
      line-height: 1.3;
      letter-spacing: .3px;
    }

    #${ROOT_ID} .hitzz-promo-desc {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.75);
      margin: 0 0 0px;
      line-height: 1.5;
    }

    #${ROOT_ID} .hitzz-promo-highlight {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 6px;
      padding: 5px 12px;
      margin: 2px 0 8px;
    }

    #${ROOT_ID} .hitzz-promo-footer {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      font-style: italic;
    }

    @media (max-width: 480px) {
      #${ROOT_ID} .hitzz-promo {
        padding: 14px 16px;
        border-radius: 10px;
      }

      #${ROOT_ID} .hitzz-promo-title {
        font-size: 14px;
      }

      #${ROOT_ID} .hitzz-promo-desc {
        font-size: 12px;
      }

      #${ROOT_ID} .hitzz-promo-highlight {
        font-size: 11px;
      }
    }
  `;

  function log() {
    console.log("[HITZZ TOPO]", ...arguments);
  }

  function warn() {
    console.warn("[HITZZ TOPO]", ...arguments);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addStyleOnce() {
    if (document.getElementById(STYLE_ID)) {
      log("CSS já existe");
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
    log("CSS injetado");
  }

  function buildHTML() {
    return `
      <div class="hitzz-promo-wrap-topo" id="${ROOT_ID}">
        <div class="hitzz-promo">
          <p class="hitzz-promo-badge">✦ ${escapeHtml(CONFIG.badgeText)}</p>
          <p class="hitzz-promo-title">${escapeHtml(CONFIG.promoTitle)}</p>
          <p class="hitzz-promo-desc">${escapeHtml(CONFIG.promoSubtitle)}</p>
          <span class="hitzz-promo-highlight">1 Hitzz/mês × 12 meses</span>
          <p class="hitzz-promo-footer">${escapeHtml(CONFIG.promoFooter)}</p>
        </div>
      </div>
    `.trim();
  }

  function getTarget() {
    let el = document.querySelector(CONFIG.targetSelector);
    log("Testando target principal:", CONFIG.targetSelector, "=>", !!el);

    if (el) {
      return {
        element: el,
        selector: CONFIG.targetSelector,
        mode: "beforebegin"
      };
    }

    for (let i = 0; i < CONFIG.fallbackTargets.length; i++) {
      const selector = CONFIG.fallbackTargets[i];
      el = document.querySelector(selector);
      log("Testando fallback:", selector, "=>", !!el);

      if (el) {
        return {
          element: el,
          selector: selector,
          mode: "beforebegin"
        };
      }
    }

    return null;
  }

  function getExistingRoot() {
    return document.getElementById(ROOT_ID);
  }

  function isCorrectPosition(targetData, promoEl) {
    if (!targetData || !targetData.element || !promoEl) return false;
    return promoEl.nextElementSibling === targetData.element;
  }

  function insertOrMoveBlock() {
    addStyleOnce();

    const targetData = getTarget();
    if (!targetData || !targetData.element) {
      warn("Nenhum target encontrado");
      return false;
    }

    let promoEl = getExistingRoot();

    if (!promoEl) {
      const temp = document.createElement("div");
      temp.innerHTML = buildHTML();
      promoEl = temp.firstElementChild;

      if (!promoEl) {
        warn("Falha ao montar HTML");
        return false;
      }

      try {
        targetData.element.insertAdjacentElement(targetData.mode, promoEl);
        log("Bloco inserido com sucesso em:", targetData.selector, "| modo:", targetData.mode);
        return true;
      } catch (e) {
        console.error("[HITZZ TOPO] Erro ao inserir bloco:", e);
        return false;
      }
    }

    if (isCorrectPosition(targetData, promoEl)) {
      log("Bloco já está na posição correta");
      return true;
    }

    try {
      targetData.element.insertAdjacentElement(targetData.mode, promoEl);
      log("Bloco movido para:", targetData.selector, "| modo:", targetData.mode);
      return true;
    } catch (e) {
      console.error("[HITZZ TOPO] Erro ao mover bloco:", e);
      return false;
    }
  }

  function stopObserver(reason) {
    const state = window[GLOBAL_KEY];
    if (!state || state.observerStopped) return;

    state.observerStopped = true;

    if (state.observer) {
      try {
        state.observer.disconnect();
      } catch (e) {}
      state.observer = null;
    }

    if (state.stopObserverTimer) {
      clearTimeout(state.stopObserverTimer);
      state.stopObserverTimer = null;
    }

    log("MutationObserver finalizado:", reason);
  }

  function mount() {
    const state = window[GLOBAL_KEY];
    if (!state) return false;

    if (state.isMounting) {
      log("mount ignorado: execução em andamento");
      return false;
    }

    state.isMounting = true;

    try {
      log("mount()");
      const success = insertOrMoveBlock();
      const root = getExistingRoot();
      const targetData = getTarget();

      state.mounted = !!root;

      if (success && root && targetData && isCorrectPosition(targetData, root)) {
        stopObserver("bloco estabilizado");
      }

      return success;
    } finally {
      state.isMounting = false;
    }
  }

  function startObserver() {
    const state = window[GLOBAL_KEY];
    if (!state || state.observerStopped) return;

    state.observer = new MutationObserver((mutations) => {
      const root = getExistingRoot();

      const relevant = mutations.some((mutation) => {
        if (!mutation.addedNodes || !mutation.addedNodes.length) return false;

        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (!(node instanceof Element)) continue;

          if (
            node.matches?.(CONFIG.targetSelector) ||
            node.querySelector?.(CONFIG.targetSelector) ||
            node.id === ROOT_ID ||
            node.querySelector?.("#" + ROOT_ID) ||
            CONFIG.fallbackTargets.some((selector) => node.matches?.(selector) || node.querySelector?.(selector))
          ) {
            return true;
          }
        }

        return false;
      });

      if (!relevant && root) {
        return;
      }

      log("MutationObserver detectou mudança relevante, tentando validar bloco");
      mount();
    });

    state.observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    state.stopObserverTimer = setTimeout(() => {
      stopObserver("timeout de observação");
    }, CONFIG.observerTimeout);

    log("MutationObserver iniciado");
  }

  function startRetries() {
    const state = window[GLOBAL_KEY];
    if (!state) return;

    let tries = 0;

    state.retryTimer = setInterval(() => {
      tries++;
      log("retry:", tries);

      const success = mount();

      if (success || tries >= CONFIG.retries) {
        clearInterval(state.retryTimer);
        state.retryTimer = null;
        log("Retries finalizados");
      }
    }, CONFIG.retryDelay);
  }

  function cleanup() {
    const state = window[GLOBAL_KEY];

    if (state) {
      if (state.observer) {
        try {
          state.observer.disconnect();
        } catch (e) {}
      }

      if (state.retryTimer) {
        clearInterval(state.retryTimer);
      }

      if (state.stopObserverTimer) {
        clearTimeout(state.stopObserverTimer);
      }
    }

    const root = document.getElementById(ROOT_ID);
    if (root) root.remove();

    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();

    delete window[GLOBAL_KEY];
    log("Bloco removido com sucesso");
  }

  function start() {
    mount();

    const root = getExistingRoot();
    const targetData = getTarget();

    if (!(root && targetData && isCorrectPosition(targetData, root))) {
      startObserver();
      startRetries();
    } else {
      log("Bloco já estabilizado na inicialização");
    }

    window.__HITZZ_TOPO_PROMO_REMOVE__ = cleanup;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();