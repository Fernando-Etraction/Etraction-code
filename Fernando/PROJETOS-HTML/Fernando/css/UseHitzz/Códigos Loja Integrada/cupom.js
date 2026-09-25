/* ===== CUPOM CARNAPIX (SEU CÓDIGO + FIX SAFARI/MOBILE) =====
   - Aparece mesmo sem selecionar tamanho (injeta em âncora estável)
   - Depois move pra afterend do .comprar quando ele existir
   - Copy funciona no Safari/iOS (fallback forte)
*/
(() => {
          console.log("🧹🧹🧹 ");
  const CONFIG = {
    targetSelector: ".parcelas-produto",
    fallbackTargetSelector: "#corpo .acoes-produto div.comprar",

    // ✅ âncoras estáveis (existem antes de selecionar tamanho)
    stableAnchors: [
      "#corpo .produto .acoes-produto",
      "#corpo .acoes-produto",
      "#corpo .produto",
      "#corpo"
    ],

    couponCode: "CARNAPIX",
    headlineBadge: "Cupom 12% + Pix 5% = ATÉ 17% de desconto",
    discountText: "12%",
    endTimeISO: "2026-02-16T23:59:59-03:00",
    timerIntervalMs: 250,
  };

  const GLOBAL_KEY = "__CP_CARNAPIX_LIVE__";
  if (window[GLOBAL_KEY]) return;
  window[GLOBAL_KEY] = { mounted: false, cleanup: null };

  // ✅ IDs (fixos por load) — não precisa ser randômico
  const ROOT_ID = "cpCouponRoot";
  const TIMER_ID = "cpTimerDisplay";
  const COPYBOX_ID = "cpCopyBox";
  const COPIED_ID = "cpCopiedMessage";
  const STYLE_ID = "cp-carnapix-style-live";

  // ✅ seu CSS (mantido), só removi dependência de template em seletor e adicionei uns !important úteis
  const CSS = `

  .v-tamanho-produto { display: none !important; }

  .cp-coupon {
    max-width: 600px;
    height: 150px;
    background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(192, 132, 252, 0.3);
    padding: 10px !important;
  }

  .cp-bg-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image:
      repeating-linear-gradient(45deg, transparent, transparent 10px, #c084fc 10px, #c084fc 11px),
      repeating-linear-gradient(-45deg, transparent, transparent 10px, #c084fc 10px, #c084fc 11px);
    pointer-events: none;
  }

  .cp-slide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .cp-event-title {
    font-size: 38px;
    font-weight: 900;
    font-style: italic;
    line-height: 0.9;
    letter-spacing: -0.5px;
    display: flex;
  }

  .cp-event-title .cp-carna { color: #ffffff; display: block; }
  .cp-event-title .cp-pix {
    background: linear-gradient(135deg, #c084fc 0%, #e879f9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    padding: 0 4px 0 0;
  }

  .cp-date-badge {
    margin: 4px 0;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.85);
    padding: 4px 7px;
    border-radius: 999px;
    border: 1px solid rgba(192, 132, 252, 0.35);
    background: rgba(192, 132, 252, 0.12);
    width: fit-content;
  }

  .cp-timer {
    background: rgba(192, 132, 252, 0.15);
    border: 1px solid rgba(192, 132, 252, 0.4);
    border-radius: 8px;
    padding: 5px 10px;
    text-align: center;
    min-width: 250px;
  }

  .cp-timer-label {
    font-size: 12px;
    color: #c084fc;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .cp-timer-value {
    font-size: 18px;
    font-weight: 900;
    color: #ffffff;
    font-family: "Courier New", monospace;
    margin-top: 2px;
    white-space: nowrap;
  }

  .cp-slide-content { display: flex; gap: 10px; align-items: center; }

  .cp-discount-box {
    background: rgba(192, 132, 252, 0.12);
    border-radius: 10px;
    padding: 10px;
    flex: 1;
    text-align: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgb(192 132 252 / 78%);
  }

  .cp-discount-box::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    animation: cp-shimmer 3s infinite;
  }

  @keyframes cp-shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }

  .cp-discount-amount {
    font-size: 26px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
  }

  .cp-discount-amount span { font-size: 15px; color: rgba(255, 255, 255, 0.9); }
  .cp-classe-ate { font-size: 15px; }

  .cp-discount-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.92);
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 2px;
    position: relative;
    z-index: 1;
  }

  .cp-coupon-code-box {
    background: rgba(0, 0, 0, 0.28);
    border: 1.5px dashed #c084fc;
    border-radius: 8px;
    padding: 8px;
    flex: 1;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .cp-coupon-code-box:hover { background: rgba(192, 132, 252, 0.1); transform: scale(1.04); }

  .cp-code-label {
    font-size: 10px;
    color: #c084fc;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .cp-code-value {
    font-size: 18px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .cp-code-instruction { font-size: 10px; color: rgba(192, 132, 252, 0.85); }

  .cp-copied-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: rgba(192, 132, 252, 0.95);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 800;
    z-index: 100;
    transition: transform 0.25s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
  }

  .cp-copied-message.show { transform: translate(-50%, -50%) scale(1); }

  @media (max-width: 768px){
    .cp-coupon { max-width: 500px; }
    .cp-event-title { font-size: 20px; }
    .cp-timer { min-width: 115px; }
    .cp-timer-value { font-size: 14px; }
  }

  @media (max-width: 600px){
    .cp-coupon { height: 160px; }
    .cp-event-title { font-size: 18px; }
    .cp-discount-amount { font-size: 24px; }
    .cp-classe-ate { font-size: 14px; }
  }

  @media (max-width: 400px){
    .cp-coupon { height: 110px; border-radius: 14px; padding: 8px; width: auto; }
    .cp-slide-header { gap: 6px; flex-wrap: wrap; }
    .cp-event-title { font-size: 18px; line-height: 0.95; }
    .cp-date-badge { font-size: 6.5px; padding: 3px 6px; }

    .cp-timer { min-width: 110px; padding: 4px 8px; }
    .cp-timer-label { font-size: 6px; }
    .cp-timer-value { font-size: 14px; }

    .cp-slide-content { gap: 8px; justify-content: space-between; }

    .cp-discount-box { padding: 8px; max-width: 140px; }
    .cp-discount-amount { font-size: 18px; gap: 3px; }
    .cp-discount-label { font-size: 7px; }

    .cp-coupon-code-box { padding: 7px; max-width: 140px; }
    .cp-code-label { font-size: 6.5px; }
    .cp-code-value { font-size: 12px; }
    .cp-code-instruction { font-size: 5.5px; }

    .cp-copied-message { font-size: 10px; padding: 7px 12px; }
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
    const code = escapeHtml(CONFIG.couponCode);
    const badge = escapeHtml(CONFIG.headlineBadge);
    const discount = escapeHtml(CONFIG.discountText);

    return `
<div class="cp-coupon" id="${ROOT_ID}">
  <div class="cp-bg-pattern"></div>
  <div class="swiper-slide">
    <div class="cp-slide-header">
      <div>
        <div class="cp-event-title">
          <span class="cp-carna">CARNA</span>
          <span class="cp-pix">PIX</span>
        </div>
      </div>

      <div class="cp-timer">
        <div class="cp-timer-label">Termina em</div>
        <div class="cp-timer-value" id="${TIMER_ID}">00d 00:00:00</div>
      </div>
    </div>

    <div class="cp-date-badge">${badge}</div>

    <div class="cp-slide-content">
      <div class="cp-discount-box">
        <div class="cp-discount-label">Use o cupom e garanta</div>
        <div class="cp-discount-amount">
          ${discount} <span>OFF</span>
        </div>
      </div>

      <div class="cp-coupon-code-box" id="${COPYBOX_ID}" role="button" aria-label="Copiar cupom">
        <div class="cp-code-label">Use o cupom</div>
        <div class="cp-code-value">${code}</div>
        <div class="cp-code-instruction">Toque para copiar</div>
      </div>
    </div>
  </div>

  <div class="cp-copied-message" id="${COPIED_ID}">✓ Cupom ${code} copiado!</div>
</div>`.trim();
  }

  function addStyleOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function findComprar() {
    return (
      document.querySelector(CONFIG.targetSelector) ||
      document.querySelector(CONFIG.fallbackTargetSelector)
    );
  }

  // ✅ âncora estável pra aparecer antes do tamanho
  function findStableAnchor() {
    for (let i = 0; i < CONFIG.stableAnchors.length; i++) {
      const el = document.querySelector(CONFIG.stableAnchors[i]);
      if (el) return el;
    }
    return null;
  }

  function ensureInjectedSomewhere() {
    let existing = document.getElementById(ROOT_ID);
    if (existing) return existing;

    addStyleOnce();

    const anchor = findStableAnchor();
    if (!anchor) return null;

    const wrap = document.createElement("div");
    wrap.innerHTML = buildHTML();
    const couponEl = wrap.firstElementChild;

    // insere primeiro numa âncora que existe sempre
    anchor.insertAdjacentElement("beforebegin", couponEl);
    return couponEl;
  }

  function moveAfterComprarIfExists() {
    const couponEl = ensureInjectedSomewhere();
    if (!couponEl) return;

    const comprar = findComprar();
    if (!comprar) return;

    // move só se não estiver logo depois
    if (couponEl.previousElementSibling === comprar) return;
    comprar.insertAdjacentElement("afterend", couponEl);
  }

  function showCopied(el) {
    if (!el) return;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2000);
  }

  // ✅ Safari/iOS: fallback SEMPRE disponível
  function hardCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
    return ok;
  }

  async function copyText(text) {
    // tenta Clipboard API, mas não confia (Safari falha)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {}
    }
    return hardCopy(text);
  }

  function bindCopyOnce() {
    const copyBox = document.getElementById(COPYBOX_ID);
    const copiedMsg = document.getElementById(COPIED_ID);
    if (!copyBox || copyBox.__cpBound) return;
    copyBox.__cpBound = true;

    const doCopy = async (ev) => {
      if (ev) ev.preventDefault();
      const ok = await copyText(CONFIG.couponCode);
      if (ok) showCopied(copiedMsg);
    };

    // ✅ melhor sequência pra iOS
    copyBox.addEventListener("touchend", doCopy, { passive: false });
    copyBox.addEventListener("pointerup", doCopy, { passive: false });
    copyBox.addEventListener("click", doCopy, { passive: false });
  }

  function startTimerOnce() {
    const timerEl = document.getElementById(TIMER_ID);
    if (!timerEl || timerEl.__cpTimerRunning) return;
    timerEl.__cpTimerRunning = true;

    const endTime = new Date(CONFIG.endTimeISO).getTime();

    function updateTimer() {
      const el = document.getElementById(TIMER_ID);
      if (!el) return;

      const now = Date.now();
      const distance = endTime - now;

      if (distance <= 0) {
        el.textContent = "00d 00:00:00";
        return;
      }

      const totalSeconds = Math.floor(distance / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      el.textContent =
        `${String(days).padStart(2, "0")}d ` +
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
    }

    updateTimer();
    setInterval(updateTimer, CONFIG.timerIntervalMs);
  }

  function mount() {
    // 1) garante que existe mesmo sem tamanho
    ensureInjectedSomewhere();

    // 2) se comprar existir, move pro lugar certo
    moveAfterComprarIfExists();

    // 3) liga copy + timer
    bindCopyOnce();
    startTimerOnce();

    window[GLOBAL_KEY].mounted = true;
  }

  const observer = new MutationObserver(() => mount());

  function start() {
    mount();
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // “poke” extra pra Safari/mobile
    let tries = 0;
    const poke = setInterval(() => {
      tries++;
      mount();
      if (tries > 40) clearInterval(poke); // ~20s
    }, 500);

    window.__CP_CARNAPIX_REMOVE__ = () => {
      try { observer.disconnect(); } catch {}
      const el = document.getElementById(ROOT_ID);
      if (el) el.remove();
      const st = document.getElementById(STYLE_ID);
      if (st) st.remove();
      delete window[GLOBAL_KEY];
      console.log("🧹 Cupom removido.");
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
