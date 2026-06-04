// blh-regua-beneficios.js (FIX RELOAD - executa imediato + render instantâneo)
(function () {
  const LOG = (...args) => console.log("[blh-regua]", ...args);

  // ✅ FIX PRINCIPAL: função que inicializa tudo
  function initRegua() {
    if (window.__BLH_REGUA_ON__) return;
    window.__BLH_REGUA_ON__ = true;

    // ===== CONFIG =====
    const FRETE_GRATIS_MIN = 1000;
    const FRETE_REGIOES = "Sul, Sudeste e Centro-Oeste";
    const DESCONTOS = [
      { value: 1000, discount: 80 },
      { value: 1500, discount: 120 },
      { value: 1800, discount: 200 },
    ];
    const MAX_TIER = DESCONTOS[DESCONTOS.length - 1].value;

    const MARK_SHIFT_PCT = 2;
    const MIN_EDGE_PCT = 6;
    const MAX_EDGE_PCT = 92;
    const MIN_GAP_PCT = 12;

    const TURBO_MS = 120;
    const TURBO_FOR = 2500;

    const TRACK_PAD_TIER = 1900;
    const MOBILE_BAR_SLOW_FACTOR = 0.5;

    // ===== CSS =====
    if (!document.querySelector("#blh-regua-style")) {
      const style = document.createElement("style");
      style.id = "blh-regua-style";
      style.textContent = `
     .blh-regua-host {
  width: 95%;
  margin: 0 auto;
}
.blh-regua {
  --bg: #5b5b5b;
  --ink: #fff;
  --muted: rgba(255, 255, 255, 0.72);
  --line: rgba(255, 255, 255, 0.14);
  --yellow: #5994B2;
  background: var(--bg);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  margin: 0 0 16px 0;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    Arial;
}
.blh-regua__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-start;
}
.blh-regua__title {
  font-size: 16px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.2px;
}
.blh-regua__desc {
  font-size: 14px;
  color: var(--muted);
  margin-top: 6px;
  line-height: 1.35;
}
.blh-regua__desc strong {
  color: #fff;
  font-weight: 900;
}
.blh-regua__badge {
  background: var(--yellow);
  color: #000;
  font-weight: 900;
  font-size: 12px;
  padding: 7px 10px;
  border-radius: 999px;
  white-space: nowrap;
  line-height: 1;
  margin-top: 2px;
}
.blh-regua__trackWrap {
  position: relative;
  margin-top: 10px;
}
.blh-regua__track {
  background: rgba(255, 255, 255, 0.15);
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.blh-regua__bar {
  height: 100%;
  width: 0%;
  background: var(--yellow);
  transition: width 0.25s ease;
  will-change: width;
}
.blh-regua__marks {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transform: translateY(-8px);
  pointer-events: none;
}
.blh-regua__mark {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.18);
  transform: translate(-50%, -50%);
  top: -4px;
}
.blh-regua__mark.is-on {
  background: var(--yellow);
  border-color: rgba(0, 0, 0, 0.35);
}
.blh-regua__levels {
  position: relative;
  height: 48px;
  margin-top: 14px;
  z-index: 1;
}
.blh-regua__level {
clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 50%, 0% 0%);
  padding: 4px 8px;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    text-align: center;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.1;
    max-width: 162px;
    height: 60px;
    white-space: normal;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}
.blh-regua__level:hover {
  filter: brightness(1.08);
  transform: translateX(-50%) scale(1.01);
}
.blh-regua__level.copied small {
  animation: copyPulse 0.6s ease;
}
@keyframes copyPulse {
  0%, 100% { background-color: inherit; }
  50% { background-color: #4bb777; }
}
.blh-regua__level b {
  display: block;
  color: #fff;
  font-weight: 900;
  margin-bottom: 2px;
  line-height: 1.1;
}
.blh-regua__level small {
  display: block;
  font-size: 10px;
  opacity: 0.9;
  line-height: 1.05;
  word-break: break-word;
}
.blh-regua__level.is-last {
  transform: translateX(-100%);
  padding-right: 6px;
  max-width: 160px;
  width:156px;
}
.blh-regua__level.is-last:hover {
  transform: translateX(-100%) scale(1.01);
}
.blh-regua__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  font-size: 14px;
  color: var(--muted);
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: row-reverse;
}
.blh-regua__meta strong {
  color: #4bb777;
  font-weight: 900;
}
.blh-regua__cta {
  font-size: 15px;
  font-weight: 900;
  color: #fff;
  line-height: 1.25;
  margin-top: 21px;
}

@media (min-width: 800px) {
.blh-regua__level:last-child{
    margin-left: 105px !important;
}
.blh-regua__level{
    clip-path: none !important;
    border-radius: 100000px ;
}
}
@media (max-width: 748px) {
.blh-regua__desc{
    font-size:12px !important;
}

.blh-regua__top{
    flex-direction: column;
    margin-bottom: 17px;
}
@media (max-width: 500px) {
.blh-regua__level:last-child{
height: 72px;
    
}
    
}




  .blh-regua__meta {
    margin-top: 0px !important;
    text-align: center;
    
    flex-direction: column-reverse;
        text-align: end;
        justify-content: end;
        align-items: end;
  } 
  .blh-regua__levels {
    height: 60px !important;
  }
  .blh-regua__mark[data-el="m1"],
  .blh-regua__level[data-el="l1"] {
    left: 0% !important;
    transform: translateX(0) !important;
    text-align: left !important;
  }
  .blh-regua__mark[data-el="m2"],
  .blh-regua__level[data-el="l2"] {
    left: 50% !important;
    transform: translateX(-50%) !important;
    text-align: center !important;
  }
  .blh-regua__mark[data-el="m3"],
  .blh-regua__level[data-el="l3"] {
    left: 100% !important;
    transform: translateX(-100%) !important;
    text-align: right !important;
  }
  .blh-regua__level {
    top: 0 !important;
    line-height: 1.1 !important;
    max-width: 95px;
  }
  .blh-regua__levels {
    height: 52px;
    margin-left:-4px;
  }
  .blh-regua__level {
    max-width: 95px;
        font-size: 10px;
        height: auto;
        align-items: center;
        justify-content: center;
        display: flex;
        flex-direction: column;
  }
  .blh-regua__level small {
    font-size: 10px;
  }
  .blh-regua__cta {
    width: 100%;
  }
  .blh-regua__level.is-last {
    max-width: 105px;
    padding-right: 6px;
  }
  .blh-regua__foot {
    max-width: 100% !important;
    display: none;
  }
  .blh-regua__level:first-child {
  clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 50%, 0% 0%);
    text-align: center !important;
    margin-left: 0px;
    width: auto;
    max-width: 95px;
    background: #313246 !important;
  }
  .blh-regua__level:first-child small {
    padding: 0px;
    border-radius: 100px;
    font-weight: bold;
    color: white;
    background: #2D2D45 !important;
  }
  .blh-regua__level:nth-child(2) {
        background: #2D2D45;
    clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%) !important;
    margin-left: 17px;
  }
  .blh-regua__level:nth-child(2) small {
    padding: 4px !important;
    border-radius: 100px;
    font-weight: bold;
     background: #2D2D45 !important;
    color: white;
  }
  .blh-regua__level:last-child {
   background: #6E93B0;
    clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%) !important;
    text-align: center !important;
  }
  .blh-regua__level:last-child small {
    color: white;
    padding: 4px !important;
    border-radius: 100px;
    font-weight: bold;
    text-align: center !important;
    background: #2D2D45 !important;
  }

  .blh-regua__track {
    padding: 0 0% !important;
    box-sizing: border-box !important;
  }
  .blh-regua__bar {
    border-radius: 999px;
  }
}

.blh-regua__level:first-child {
  background: #313246;
}
.blh-regua__level:first-child small {
  background: #2F5981;
  padding: 5px;
  border-radius: 100px;
  font-weight: bold;
  color: white;
}

.blh-regua__level:nth-child(2) {
  background: #2D2D45;
}
.blh-regua__level:nth-child(2) small {
  padding: 5px;
  border-radius: 100px;
  font-weight: bold;
  color: white;
  background:#325B85;
}

.blh-regua__level:last-child {
  background: #2D2D45;
}
.blh-regua__level:last-child small {
  background: #2F5981;
  color: white !important;
  padding: 5px;
  border-radius: 100px;
  font-weight: bold;
}
.blh-regua__level:last-child > b {
  color: white;
}

.blh-regua__meta:first-child span > strong {
  color: red !important;
}
.blh-regua__track {
  padding: 0 8% 0 0 !important;
  box-sizing: border-box !important;
}

.blh-regua.is-max .blh-regua__track {
  padding: 0 0% !important;
  box-sizing: border-box !important;
}

    `;
      document.head.appendChild(style);
    }

    // ===== HELPERS =====
    function parseBRL(text) {
      if (!text) return 0;
      let s = String(text)
        .replace(/\s/g, "")
        .replace(/[^\d.,-]/g, "");
      if (s.includes(".") && s.includes(","))
        s = s.replace(/\./g, "").replace(",", ".");
      else if (s.includes(",")) s = s.replace(",", ".");
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    }

    function formatBRL(v) {
      return (v || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    function getSubtotal() {
      const el =
        document.querySelector(".itemTotalPrice") ||
        document.querySelector(".totalPrice");
      return el ? parseBRL(el.textContent) : 0;
    }

    function getPixtotal() {
      const ele =
        document.querySelector(".cash-price") ||
        document.querySelector(".cash-total span");
      return ele ? parseBRL(ele.textContent) : 0;
    }

    function bestDiscountTier(subtotal) {
      let best = null;
      for (const t of DESCONTOS) if (subtotal >= t.value) best = t;
      return best;
    }

    function nextDiscountTier(subtotal) {
      return DESCONTOS.find((t) => subtotal < t.value) || null;
    }

    function progressOverall(subtotal) {
      const p = (Math.max(0, subtotal) / MAX_TIER) * 100;
      return Math.max(0, Math.min(100, p));
    }

    function isMobileBar() {
      try {
        return (
          window.matchMedia && window.matchMedia("(max-width: 748px)").matches
        );
      } catch (e) {
        return false;
      }
    }

    function progressForViewport(subtotal) {
      const base = progressOverall(subtotal);
      if (subtotal >= MAX_TIER) return 100;
      if (!isMobileBar()) return base;
      const slow = base * MOBILE_BAR_SLOW_FACTOR;
      return Math.max(0, Math.min(100, slow));
    }

    function clampPct(p) {
      return Math.max(MIN_EDGE_PCT, Math.min(MAX_EDGE_PCT, p));
    }

    function rawPosPctFromValue(v) {
      const base = (v / MAX_TIER) * 100;
      return clampPct(base + MARK_SHIFT_PCT);
    }

    function computeMarkPositions() {
      let p1 = rawPosPctFromValue(1000);
      let p2 = rawPosPctFromValue(1500);
      let p3 = rawPosPctFromValue(1800);

      p3 = clampPct(p3);

      if (p3 - p2 < MIN_GAP_PCT) p2 = p3 - MIN_GAP_PCT;
      if (p2 - p1 < MIN_GAP_PCT) p1 = p2 - MIN_GAP_PCT;

      p1 = clampPct(p1);
      p2 = clampPct(p2);
      p3 = clampPct(p3);

      if (p3 - p2 < MIN_GAP_PCT) p2 = p3 - MIN_GAP_PCT;
      if (p2 - p1 < MIN_GAP_PCT) p1 = p2 - MIN_GAP_PCT;

      p1 = clampPct(p1);
      p2 = clampPct(p2);

      return { p1, p2, p3 };
    }

    function ensureHost() {
      let host = document.querySelector(".blh-regua-host");
      if (!host) {
        host = document.createElement("div");
        host.className = "blh-regua-host";
      }

      const header = document.querySelector("#simplified-step-header");
      if (header) {
        if (
          host.parentElement !== header.parentElement ||
          host.previousElementSibling !== header
        ) {
          header.insertAdjacentElement("afterend", host);
        }
        return host;
      }

      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (
          host.parentElement !== navbar.parentElement ||
          host.previousElementSibling !== navbar
        ) {
          navbar.insertAdjacentElement("afterend", host);
        }
        return host;
      }

      const main = document.querySelector("main") || document.body;
      if (main.firstElementChild !== host)
        main.insertAdjacentElement("afterbegin", host);
      return host;
    }

    const UI = {
      mounted: false,
      lastKey: "",
      host: null,
      els: {},
      hostObs: null,
    };

    function mountUI(host) {
      if (UI.mounted && UI.host === host && host.querySelector(".blh-regua"))
        return;

      host.innerHTML = `
        <section class="blh-regua">
          <div class="blh-regua__top">
            <div>
              <p class="blh-regua__title" data-el="title"></p>
              <div class="blh-regua__desc" data-el="desc"></div>
            </div>
            <div class="blh-regua__badge" data-el="badge"></div>
          </div>

          <div class="blh-regua__trackWrap">
            <div class="blh-regua__track">
              <div class="blh-regua__bar" data-el="bar"></div>
            </div>

            <div class="blh-regua__marks" aria-hidden="true">
              <span class="blh-regua__mark" data-el="m1"></span>
              <span class="blh-regua__mark" data-el="m2"></span>
              <span class="blh-regua__mark" data-el="m3"></span>
            </div>

            <div class="blh-regua__levels">
              <span class="blh-regua__level" data-el="l1">
                <b data-el="l1b"></b>
                <small data-el="l1s"></small>
              </span>

              <span class="blh-regua__level" data-el="l2">
                <b data-el="l2b"></b>
                <small data-el="l2s"></small>
              </span>

              <span class="blh-regua__level is-last" data-el="l3">
                <b data-el="l3b"></b>
                <small data-el="l3s"></small>
              </span>
            </div>
          </div>

          <div class="blh-regua__meta">
            <span>Valor total sem desconto: <strong style="color: #ffaeae !important" data-el="total"></strong></span>
            <span class="blh-regua__cta" data-el="cta"></span>
          </div>

          <span style="display:flex;justify-content:end;">
            Valor total com desconto:
            <strong style="color: #4bb777 !important; margin-left:6px" data-el="totalPix"></strong>
          </span>

          <div class="blh-regua__foot" data-el="foot"></div>
        </section>
      `;

      const root = host.querySelector(".blh-regua");
      UI.host = host;
      UI.els = {
        root,
        title: root.querySelector('[data-el="title"]'),
        desc: root.querySelector('[data-el="desc"]'),
        badge: root.querySelector('[data-el="badge"]'),
        bar: root.querySelector('[data-el="bar"]'),
        m1: root.querySelector('[data-el="m1"]'),
        m2: root.querySelector('[data-el="m2"]'),
        m3: root.querySelector('[data-el="m3"]'),
        l1: root.querySelector('[data-el="l1"]'),
        l2: root.querySelector('[data-el="l2"]'),
        l3: root.querySelector('[data-el="l3"]'),
        l1b: root.querySelector('[data-el="l1b"]'),
        l2b: root.querySelector('[data-el="l2b"]'),
        l3b: root.querySelector('[data-el="l3b"]'),
        l1s: root.querySelector('[data-el="l1s"]'),
        l2s: root.querySelector('[data-el="l2s"]'),
        l3s: root.querySelector('[data-el="l3s"]'),
        total: root.querySelector('[data-el="total"]'),
        totalPix: root.querySelector('[data-el="totalPix"]'),
        cta: root.querySelector('[data-el="cta"]'),
        foot: root.querySelector('[data-el="foot"]'),
      };

      const { p1, p2, p3 } = computeMarkPositions();

      UI.els.m1.style.left = `${p1}%`;
      UI.els.m2.style.left = `${p2}%`;
      UI.els.m3.style.left = `${p3}%`;

      UI.els.l1.style.left = `${p1}%`;
      UI.els.l2.style.left = `${p2}%`;
      UI.els.l3.style.left = `${p3}%`;

      // ✅ TEXTOS (IGUAIS À IMAGEM)
      UI.els.l1b.textContent = `R$ 80 OFF acima de R$999`;
      UI.els.l1s.textContent = `Use o cupom: CLIENTE80`;
      UI.els.l2b.textContent = `R$ 120 OFF acima de R$1500`;
      UI.els.l2s.textContent = `Use o cupom: CLIENTE120`;
      UI.els.l3b.textContent = `R$ 200 OFF acima de R$1800`;
      UI.els.l3s.textContent = `Use o cupom: CLIENTE200`;

      UI.mounted = true;
      UI.lastKey = "";

      if (UI.hostObs) UI.hostObs.disconnect();
      UI.hostObs = new MutationObserver(() => {
        if (!UI.host) return;
        if (!UI.host.querySelector(".blh-regua")) {
          UI.mounted = false;
          scheduleRender();
        }
      });
      UI.hostObs.observe(host, { childList: true, subtree: false });
    }

    // ✅ FUNÇÃO PARA COPIAR CUPOM
    function attachCopyListener() {
      document.addEventListener("click", (e) => {
        const level = e.target && e.target.closest && e.target.closest(".blh-regua__level");
        if (!level) return;

        const small = level.querySelector("small");
        if (!small) return;

        const cupomText = small.textContent.trim();
        if (!cupomText) return;

        // Extrair só o código do cupom (ex: "CLIENTE80" de "Use o cupom: CLIENTE80")
        const cupom = cupomText.replace(/^[^:]*:\s*/, "").trim();

        // Copiar para clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cupom).then(() => {
            // Adicionar classe de feedback
            level.classList.add("copied");
            
            // Remover classe após 2 segundos
            setTimeout(() => {
              level.classList.remove("copied");
            }, 2000);
          });
        } else {
          // Fallback para browsers antigos
          try {
            const textarea = document.createElement("textarea");
            textarea.value = cupom;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            
            level.classList.add("copied");
            setTimeout(() => {
              level.classList.remove("copied");
            }, 2000);
          } catch (err) {
            console.error("Erro ao copiar:", err);
          }
        }
      });
    }

    function updateUI(subtotal) {
      const bestTier = bestDiscountTier(subtotal);
      const nextTier = nextDiscountTier(subtotal);
      const progress = progressForViewport(subtotal);
      const pixTotal = getPixtotal();

      const key = `${subtotal.toFixed(2)}|${bestTier ? bestTier.value : 0}|${
        nextTier ? nextTier.value : 0
      }|${pixTotal.toFixed(2)}|${isMobileBar() ? "m" : "d"}`;
      if (key === UI.lastKey) return;
      UI.lastKey = key;

      // ✅ TEXTOS (IGUAIS À IMAGEM)
      const title = "Mês do Consumidor Maloa termina em:";
      const desc = `<strong>EXCLUSIVO PARA ESTA CATEGORIA</strong>`;
      const ctaText = `Frete grátis acima de R$999 para ${FRETE_REGIOES}`;

      const badge = bestTier
        ? `${formatBRL(bestTier.discount)} OFF`
        : "BENEFÍCIOS";

      UI.els.title.textContent = title;
      UI.els.desc.innerHTML = desc;
      UI.els.badge.textContent = badge;
      UI.els.bar.style.width = `${progress}%`;
      UI.els.total.textContent = formatBRL(subtotal);
      if (UI.els.totalPix) UI.els.totalPix.textContent = formatBRL(pixTotal);
      UI.els.cta.innerHTML = ctaText;

      UI.els.m1.classList.toggle("is-on", subtotal >= 1000);
      UI.els.m2.classList.toggle("is-on", subtotal >= 1500);
      UI.els.m3.classList.toggle("is-on", subtotal >= 1800);

      if (UI.els.root)
        UI.els.root.classList.toggle("is-max", subtotal >= TRACK_PAD_TIER);

      // ✅ TEXTO DO RODAPÉ (IGUAL À IMAGEM)
    }

    function render() {
      const host = ensureHost();
      mountUI(host);
      updateUI(getSubtotal());
    }

    let rafLock = false;
    function scheduleRender() {
      if (rafLock) return;
      rafLock = true;
      requestAnimationFrame(() => {
        rafLock = false;
        render();
      });
    }

    let aliveLock = false;
    function ensureAlive() {
      if (aliveLock) return;
      aliveLock = true;

      requestAnimationFrame(() => {
        aliveLock = false;

        const host = ensureHost();
        const regua =
          host && host.querySelector && host.querySelector(".blh-regua");

        if (!regua) {
          UI.mounted = false;
          scheduleRender();
          setTimeout(scheduleRender, 40);
          setTimeout(scheduleRender, 120);
        }
      });
    }

    const NORMAL_WATCH_MS = 320;
    let watchTimer = null;

    function startWatch(ms) {
      if (watchTimer) clearInterval(watchTimer);
      watchTimer = setInterval(() => {
        const host = ensureHost();
        if (!host.querySelector(".blh-regua")) UI.mounted = false;
        scheduleRender();
      }, ms);
    }

    function turboWatch() {
      startWatch(TURBO_MS);
      clearTimeout(window.__BLH_TURBO_TO__);
      window.__BLH_TURBO_TO__ = setTimeout(
        () => startWatch(NORMAL_WATCH_MS),
        TURBO_FOR
      );
    }

    startWatch(NORMAL_WATCH_MS);
    attachCopyListener();

    window.addEventListener("resize", () => {
      scheduleRender();
      ensureAlive();
    });

    document.addEventListener(
      "click",
      (e) => {
        const plusBtn =
          e.target &&
          e.target.closest &&
          e.target.closest(".input-group-btn:last-child>.btn");
        if (!plusBtn) return;

        scheduleRender();
        setTimeout(scheduleRender, 60);
        setTimeout(scheduleRender, 160);
        turboWatch();

        ensureAlive();
        setTimeout(ensureAlive, 30);
        setTimeout(ensureAlive, 90);
        setTimeout(ensureAlive, 180);
      },
      true
    );

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        ensureAlive();
        setTimeout(ensureAlive, 120);
      }
    });

    window.addEventListener("pageshow", () => {
      ensureAlive();
      setTimeout(ensureAlive, 120);
    });

    const bodyObs = new MutationObserver((mutList) => {
      let should = false;

      for (const m of mutList) {
        const t =
          (m.target && m.target.nodeType === 1 && m.target) ||
          (m.target && m.target.parentElement);

        if (t && t.closest && t.closest(".blh-regua-host")) continue;
        should = true;
      }

      if (!should) return;

      clearTimeout(window.__blhTO);
      window.__blhTO = setTimeout(() => {
        scheduleRender();
        ensureAlive();
      }, 80);
    });
    bodyObs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    render();
    setTimeout(render, 100);
    setTimeout(render, 300);
    setTimeout(render, 600);

    LOG("Régua ativa (render instantâneo + anti-reload).");
  }

  // ✅ EXECUTA IMEDIATAMENTE se o DOM já estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegua);
  } else {
    // DOM já está pronto - executa imediatamente
    initRegua();
  }
})();