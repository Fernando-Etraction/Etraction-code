/* ===== ACORDEON WIDDE - VÍDEO PRÉ-VENDA =====
- Insere acordeon abaixo do target configurado
- Mantém padrão UOOU com CONFIG + observer + retries + logs
*/
(() => {
  console.log("📂 Acordeon Widde - Vídeo Pré-venda");

  const CONFIG = {
    targetSelector: ".parcelas-produto",
    fallbackTargets: [
      "#corpo .acoes-produto div.comprar",
      "#corpo .span12.produto",
      "#corpo"
    ],
    insertPosition: "afterend",

    retries: 40,
    retryDelay: 500,

    accordeonLabel: "+ Vídeo Pré-venda"
  };

  const GLOBAL_KEY = "__HITZZ_ACORDEON_WIDDE__";
  if (window[GLOBAL_KEY]) return;
  window[GLOBAL_KEY] = { mounted: false, cleanup: null };

  const ROOT_ID = "hitzzAcordeonWiddeRoot";
  const STYLE_ID = "hitzz-acordeon-widde-style";

  const CSS = `
    .hitzz-acordeon-container {
      width: 100%;
      box-sizing: border-box;
      margin: 10px 0;
    }

    .hitzz-acordeon-btn {
      cursor: pointer;
      padding: 10px;
      width: fit-content;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
      font-weight: 700;
      border-bottom: 1px solid #ccc;
      border-radius: 10px;
      background: none;
    }

    .hitzz-acordeon-btn.active,
    .hitzz-acordeon-btn:hover {
      background-color: #ccc;
    }

    .hitzz-acordeon-content {
      padding: 0 18px;
      display: none;
      overflow: hidden;
      background-color: #f9f9f9;
    }

    @media (max-width: 480px) {
      .hitzz-acordeon-btn {
        font-size: 14px;
        padding: 8px;
      }
    }
  `;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildHTML() {
    const label = escapeHtml(CONFIG.accordeonLabel);

    return `
      <div class="hitzz-acordeon-container" id="${ROOT_ID}">
        <div class="hitzz-acordeon-btn">${label}</div>
        <div class="hitzz-acordeon-content">
          <p></p>
        </div>
      </div>
    `.trim();
  }

  function bindToggle(rootEl) {
    const btn = rootEl.querySelector(".hitzz-acordeon-btn");
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const content = btn.nextElementSibling;
      content.style.display = btn.classList.contains("active") ? "block" : "none";
    });
  }

  function addStyleOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
    console.log("[ACORDEON WIDDE] CSS injetado");
  }

  function findTarget() {
    let el = document.querySelector(CONFIG.targetSelector);
    console.log("[ACORDEON WIDDE] testando target principal:", CONFIG.targetSelector, !!el);
    if (el) return el;

    for (let i = 0; i < CONFIG.fallbackTargets.length; i++) {
      const selector = CONFIG.fallbackTargets[i];
      el = document.querySelector(selector);
      console.log("[ACORDEON WIDDE] testando fallback:", selector, !!el);
      if (el) return el;
    }

    return null;
  }

  function ensureInjected() {
    let existing = document.getElementById(ROOT_ID);
    if (existing) {
      console.log("[ACORDEON WIDDE] bloco já existe");
      return existing;
    }

    addStyleOnce();

    const target = findTarget();
    if (!target) {
      console.warn("[ACORDEON WIDDE] nenhum target encontrado");
      return null;
    }

    const wrap = document.createElement("div");
    wrap.innerHTML = buildHTML();
    const el = wrap.firstElementChild;

    if (!el) {
      console.error("[ACORDEON WIDDE] falha ao montar HTML");
      return null;
    }

    target.insertAdjacentElement(CONFIG.insertPosition, el);
    console.log("[ACORDEON WIDDE] inserido com", CONFIG.insertPosition, "em:", CONFIG.targetSelector);

    bindToggle(el);
    return el;
  }

  function mount() {
    console.log("[ACORDEON WIDDE] mount()");
    ensureInjected();
    window[GLOBAL_KEY].mounted = true;
  }

  const observer = new MutationObserver(() => mount());

  function start() {
    mount();

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    console.log("[ACORDEON WIDDE] MutationObserver iniciado");

    let tries = 0;
    const poke = setInterval(() => {
      tries++;
      console.log("[ACORDEON WIDDE] retry:", tries);
      mount();

      if (tries > CONFIG.retries) {
        clearInterval(poke);
        console.log("[ACORDEON WIDDE] retries finalizados");
      }
    }, CONFIG.retryDelay);

    window.__HITZZ_ACORDEON_WIDDE_REMOVE__ = () => {
      try {
        observer.disconnect();
      } catch (e) {}

      const el = document.getElementById(ROOT_ID);
      if (el) el.remove();

      const st = document.getElementById(STYLE_ID);
      if (st) st.remove();

      delete window[GLOBAL_KEY];
      console.log("🧹 Acordeon Widde removido.");
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();