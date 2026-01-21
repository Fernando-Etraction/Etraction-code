document.addEventListener("DOMContentLoaded", () => {
  // =============== CSS (MOBILE-FIRST) ===============
  const style = document.createElement("style");
  style.textContent = `
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

  /* Container menor */
  .blh-promos{
    --bg:#000; --ink:#fff; --muted:rgba(255,255,255,.72);
    --card:rgba(255,255,255,.06); --line:rgba(255,255,255,.14);
    --radius:14px; --accent:#00B125; --shadow:0 10px 30px rgba(0,0,0,.35);
    background:var(--bg); color:var(--ink); border-radius:var(--radius);
    padding:14px; font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;
    display:flex !important; flex-direction:column; gap:12px; width:92%;
    max-width:420px; margin:12px auto; box-sizing:border-box;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative;
    z-index: 2 !important;
  }

  .blh-promos__grid{display:grid; grid-template-columns:1fr; gap:10px}

  .blh-card{
    background:var(--card); border:1px solid var(--line); border-radius:12px;
    box-shadow:var(--shadow); padding:12px; text-align:center
  }
  .blh-card__title{margin:0 0 6px}
  .blh-card__lead{font-size:16px;font-weight:800;line-height:1.25;display:block}
  .blh-highlight{color:var(--accent)}
  .blh-card__sub{margin:0 0 8px;color:var(--muted);font-size:12px}

  .blh-copy{
    width:100%; background:var(--accent); color:#000;
    border:none; border-radius:10px; padding:12px 14px;
    font-weight:800; font-size:15px; letter-spacing:.2px;
    text-align:center; cursor:pointer; user-select:none;
    transition:transform .08s ease, filter .2s ease, opacity .2s;
    outline:none; -webkit-tap-highlight-color:rgba(0,0,0,0)
  }
  .blh-copy:active{transform:scale(.98)}
  .blh-copy[aria-disabled="true"]{opacity:.75;pointer-events:none}

  .blh-timer{text-align:center;border-radius:12px}
  .blh-timer__label{color:var(--muted);font-size:12px;margin-bottom:4px}
  .blh-timer__count{font-size:18px;font-weight:800;color:var(--accent)}

  .blh-note{font-size:11px;color:var(--muted);margin:0}
  .blh-note--strong{color:var(--ink);margin-top:6px;text-transform:uppercase;font-weight:800}
  `;
  document.head.appendChild(style);

  // =============== HTML (MOBILE) ===============
  const uid = "blh-timer-" + Math.random().toString(36).slice(2, 7);
  const html = `
  <section class="blh-promos" role="region" aria-labelledby="blh-promos-title">
    <h2 id="blh-promos-title" class="sr-only">Black Friday na Floresta Carpintaria</h2>

    <div class="blh-promos__grid">
      <article class="blh-card" aria-label="Ganhe R$ 50,00 de desconto acima de R$ 1.200">
        <h3 class="blh-card__title"><span class="blh-card__lead">GANHE <span class="blh-highlight">R$ 50,00 OFF</span> ACIMA DE R$ 1.200</span></h3>
        <p class="blh-card__sub">Aplique o cupom no carrinho:</p>
        <div class="blh-copy" role="button" tabindex="0" data-cupom="BLACK50" aria-label="Copiar cupom BLACK50">BLACK50</div>
      </article>

      <article class="blh-card" aria-label="Ganhe R$ 100,00 de desconto acima de R$ 2.000">
        <h3 class="blh-card__title"><span class="blh-card__lead">GANHE <span class="blh-highlight">R$ 100,00 OFF</span> ACIMA DE R$ 2.000</span></h3>
        <p class="blh-card__sub">Aplique o cupom no carrinho:</p>
        <div class="blh-copy" role="button" tabindex="0" data-cupom="BLACK100" aria-label="Copiar cupom BLACK100">BLACK100</div>
      </article>

      <article class="blh-card" aria-label="Ganhe R$ 150,00 de desconto acima de R$ 3.000">
        <h3 class="blh-card__title"><span class="blh-card__lead">GANHE <span class="blh-highlight">R$ 150,00 OFF</span> ACIMA DE R$ 3.000</span></h3>
        <p class="blh-card__sub">Aplique o cupom no carrinho:</p>
        <div class="blh-copy" role="button" tabindex="0" data-cupom="BLACK150" aria-label="Copiar cupom BLACK150">BLACK150</div>
      </article>
    </div>

    <div class="blh-timer" aria-live="polite">
      <p class="blh-timer__label">Oferta acaba em:</p>
      <div id="${uid}" class="blh-timer__count">--d --h --m --s</div>
    </div>

    <p class="blh-note blh-note--strong">BLACK FRIDAY NA FLORESTA CARPINTARIA</p>
    <p class="blh-note">Aplique o cupom no carrinho para garantir o desconto.</p>
  </section>`;

  // =============== Inserção (DEPOIS de .product-price-container) ===============
  const target = document.querySelector(".texto-banner");
  let sectionEl;
  if (target) {
    target.insertAdjacentHTML("afterend", html);
    sectionEl = target.nextElementSibling;
    console.log("[BF FLORESTA] inserido após .texto-banner:", !!sectionEl);
  } else {
    document.body.insertAdjacentHTML("afterend", html);
    sectionEl = document.body.lastElementChild;
    console.log("[BF FLORESTA] inserido no body:", !!sectionEl);
  }

  // debug: mostrar estilo computado (útil no mobile DevTools)
  if (sectionEl) {
    const cs = window.getComputedStyle(sectionEl);
    console.log("[BF FLORESTA] computed display:", cs.display, "visibility:", cs.visibility, "opacity:", cs.opacity, "height:", cs.height);
  }

  // =============== Timer robusto ===============
  (function initTimer(root, timerId, endStr) {
    const el = root.querySelector("#" + timerId);
    if (!el) return;

    const end = new Date(endStr).getTime();
    if (isNaN(end)) {
      el.textContent = "Encerrado";
      return;
    }

    const render = (d, h, m, s) => (el.textContent = `${d}d ${h}h ${m}m ${s}s`);

    function tick() {
      const now = Date.now();
      let dist = end - now;
      if (dist <= 0) {
        el.textContent = "Encerrado";
        clearInterval(iv);
        return;
      }
      const d = Math.floor(dist / 86400000);
      const h = Math.floor((dist % 86400000) / 3600000);
      const m = Math.floor((dist % 3600000) / 60000);
      const s = Math.floor((dist % 60000) / 1000);
      render(d, h, m, s);
    }

    tick();
    const iv = setInterval(tick, 1000);
  })(sectionEl, uid, "2025-11-28T23:59:59");

  // =============== Copiar cupom (com fallback) ===============
  function copyToClipboard(text) {
    // 1) API moderna quando disponível e em contexto seguro
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // 2) Fallback com textarea (funciona em HTTP também)
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.setAttribute("readonly", "");
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }

  sectionEl.addEventListener("click", (e) => {
    const el = e.target.closest(".blh-copy");
    if (!el) return;
    const code = el.dataset.cupom;
    copyToClipboard(code)
      .then(() => {
        const original = el.textContent;
        el.textContent = "Copiado!";
        el.setAttribute("aria-disabled", "true");
        setTimeout(() => {
          el.textContent = original;
          el.removeAttribute("aria-disabled");
        }, 1400);
      })
      .catch(() => {
        /* silencioso */
      });
  });

  sectionEl.addEventListener("keydown", (e) => {
    const el = e.target.closest(".blh-copy");
    if (!el) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});
