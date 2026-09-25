(() => {
  if (window.__HITZZ_TARJA_FIXA__) return;
  window.__HITZZ_TARJA_FIXA__ = true;

  const CONFIG = {
    id: "cpTarjaTopo",
    styleId: "cpTarjaTopoStyle",
    timerId: "cpTarjaTopoTimer",
    mobileBreakpoint: 900,
    endTime: "2026-04-05T23:59:59-03:00",
    badge: "04 & 05 de Abril · Páscoa da Hitzz",
    ctaLink: "https://www.usehitzz.com.br/48-horas",  // TODO: substituir pela URL da landing page quando o cliente enviar
    hideOnScrollAfter: 10
  };

  const CSS = `

  .box-header-wrapper{
  display:none;
}

@media (max-width: 767px) {
    div#cabecalho {
        padding-top: 58px;
    }
}


#${CONFIG.id}{
  width:100%;
  background:#000;
  color:#fff;
  position:relative;
  z-index:9999;
  overflow:hidden;
  font-family:Arial,Helvetica,sans-serif;
  box-sizing:border-box;
  transition:transform .28s ease, opacity .28s ease;
}
#${CONFIG.id} *{box-sizing:border-box}
#${CONFIG.id}::after{
  content:"";
  position:absolute;
  left:0;right:0;bottom:0;
  height:2px;
  background:linear-gradient(90deg,transparent,#fff,#ccc,#fff,transparent);
}
#${CONFIG.id}.cp-topo-hidden{
  transform:translateY(-100%);
  opacity:0;
}
.cp-topo-inner{
  max-width:1280px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:10px 16px;
  gap:20px;
}
.cp-topo-badge{
  display:flex;
  align-items:center;
  gap:8px;
  white-space:nowrap;
  flex-shrink:0;
}
.cp-topo-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#fff;
  box-shadow:0 0 8px rgba(255,255,255,.6);
}
.cp-topo-badge-text{
  font-size:9px;
  font-weight:700;
  letter-spacing:2px;
  text-transform:uppercase;
  color:#999;
}
.cp-topo-copy{
  display:flex;
  align-items:center;
  gap:6px;
  white-space:nowrap;
}
.cp-topo-egg{
  font-size:22px;
  line-height:1;
}
.cp-topo-highlight{
  font-size:18px;
  color:#fff;
  line-height:1;
}
.cp-topo-sep{
  font-size:18px;
  color:#666;
  margin:0 2px;
}
.cp-topo-text{
  font-size:18px;
  color:#fff;
  line-height:1;
}
.cp-topo-price{
  font-size:22px;
  font-weight:900;
  color:#fff;
  line-height:1;
}
.cp-topo-cta{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#000;
  color:#fff;
  padding:7px 18px;
  font-size:12px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:1px;
  text-decoration:none;
  white-space:nowrap;
  flex-shrink:0;
  transition:background .2s ease, transform .15s ease;
  cursor:pointer;
  border:1px solid #fff;
}
.cp-topo-cta:hover{
  background:#333;
  transform:scale(1.04);
}
.cp-topo-cta svg{
  width:14px;
  height:14px;
  fill:currentColor;
}
.cp-topo-timer{
  display:flex;
  align-items:center;
  gap:8px;
  flex-shrink:0;
  white-space:nowrap;
}
.cp-topo-timer-label{
  font-size:8px;
  letter-spacing:2px;
  color:#999;
  text-transform:uppercase;
}
.cp-topo-timer-value{
  font-size:14px;
  font-weight:700;
  font-variant-numeric:tabular-nums;
  color:#fff;
}
.cp-topo-close{
  position:absolute;
  top:50%;
  right:12px;
  transform:translateY(-50%);
  background:none;
  border:none;
  color:#999;
  font-size:18px;
  cursor:pointer;
  padding:4px 6px;
  line-height:1;
  transition:color .2s ease;
  z-index:1;
}
.cp-topo-close:hover{
  color:#fff;
}
@media (max-width:900px){
  #${CONFIG.id}{
    position:fixed;
    top:0;
    left:0;
    right:0;
    z-index:99999;
  }
  .cp-topo-badge{display:none}
  .cp-topo-inner{
    padding:8px 10px;
    gap:8px;
    flex-wrap:wrap;
    justify-content:center;
  }
  .cp-topo-copy{
    width:100%;
    justify-content:center;
    gap:4px;
    flex-wrap:wrap;
  }
  .cp-topo-egg{font-size:16px}
  .cp-topo-highlight{font-size:16px}
  .cp-topo-text{font-size:12px}
  .cp-topo-price{font-size:16px}
  .cp-topo-sep{font-size:14px}
  .cp-topo-cta{
    font-size:10px;
    padding:5px 14px;
  }
  .cp-topo-timer{
    width:100%;
    justify-content:center;
    border-top:1px solid rgba(255,255,255,.1);
    padding-top:6px;
  }
}
@media (max-width:480px){
  .cp-topo-highlight{font-size:14px}
  .cp-topo-text{font-size:11px}
  .cp-topo-price{font-size:14px}
  .cp-topo-timer-value{font-size:12px}
}
`;

  function addStyle() {
    if (document.getElementById(CONFIG.styleId)) return;
    const style = document.createElement("style");
    style.id = CONFIG.styleId;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function html() {
    return `
<div id="${CONFIG.id}">
  <div class="cp-topo-inner">

    <div class="cp-topo-copy">
      <span class="cp-topo-egg">🐇</span>
      <span class="cp-topo-highlight">48 Horas</span>
      <span class="cp-topo-sep">·</span>
      <span class="cp-topo-highlight">48 Produtos</span>
      <span class="cp-topo-sep">·</span>
      <span class="cp-topo-text">por até</span>
      <span class="cp-topo-price">R$148</span>
    </div>

    <a href="${CONFIG.ctaLink}" class="cp-topo-cta">
      Clique aqui
      <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
    </a>

    <div class="cp-topo-timer">
      <span class="cp-topo-timer-label">TERMINA EM</span>
      <span class="cp-topo-timer-value" id="${CONFIG.timerId}">00d 00:00:00</span>
    </div>

    <button class="cp-topo-close" aria-label="Fechar" title="Fechar">&times;</button>
  </div>
</div>`;
  }

  function getTarja() {
    return document.getElementById(CONFIG.id);
  }

  function getHeader() {
    return document.querySelector(".box-header-wrapper");
  }

  function getAtalhos() {
    return document.querySelector(".atalhos-mobile.visible-phone.borda-principal");
  }

  function inject() {
    if (getTarja()) return;
    addStyle();

    const wrap = document.createElement("div");
    wrap.innerHTML = html();
    const el = wrap.firstElementChild;

    document.body.insertBefore(el, document.body.firstChild);
  }

  function isHidden() {
    const tarja = getTarja();
    return tarja ? tarja.classList.contains("cp-topo-hidden") : false;
  }

  function setHidden(hidden) {
    const tarja = getTarja();
    if (!tarja) return;
    tarja.classList.toggle("cp-topo-hidden", hidden);
    applyOffsets();
  }

  function applyOffsets() {
    const tarja = getTarja();
    const header = getHeader();
    const atalhos = getAtalhos();

    if (!tarja) return;

    const visibleTarjaH = isHidden() ? 0 : Math.ceil(tarja.getBoundingClientRect().height);

    if (window.innerWidth <= CONFIG.mobileBreakpoint) {
      const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

      document.body.style.setProperty("padding-top", visibleTarjaH + "px", "important");

      if (header) {
        header.style.setProperty("top", visibleTarjaH + "px", "important");
      }

      if (atalhos) {
        atalhos.style.setProperty("top", (visibleTarjaH + headerH) + "px", "important");
      }
    } else {
      document.body.style.removeProperty("padding-top");
      if (header) header.style.removeProperty("top");
      if (atalhos) atalhos.style.removeProperty("top");
    }
  }

  function startTimer() {
    const el = document.getElementById(CONFIG.timerId);
    if (!el || el.dataset.running) return;
    el.dataset.running = "true";

    const end = new Date(CONFIG.endTime).getTime();

    function update() {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        el.textContent = "00d 00:00:00";
        return;
      }

      const total = Math.floor(diff / 1000);
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;

      el.textContent =
        String(d).padStart(2, "0") + "d " +
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");
    }

    update();
    setInterval(update, CONFIG.timerIntervalMs);
  }
  function stopTimer() {
    const el = document.getElementById(CONFIG.timerId);
    if (!el || !el.dataset.running) return;
    delete el.dataset.running;
  }

  let closedByUser = false;

  function bindScrollHide() {
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;

    function onScroll() {
      if (ticking || closedByUser) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset || 0;

        if (currentY <= CONFIG.hideOnScrollAfter) {
          setHidden(false);
        } else if (currentY > lastScrollY) {
          setHidden(true);
        } else {
          setHidden(false);
        }

        lastScrollY = currentY;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function bindClose() {
    const tarja = getTarja();
    if (!tarja) return;
    const btn = tarja.querySelector(".cp-topo-close");
    if (!btn) return;
    btn.addEventListener("click", () => {
      closedByUser = true;
      setHidden(true);
    });
  }

  function mount() {
    inject();
    startTimer();
    requestAnimationFrame(() => {
      applyOffsets();
      requestAnimationFrame(applyOffsets);
    });
  }

  function start() {
    mount();
    bindScrollHide();
    bindClose();

    window.addEventListener("load", applyOffsets);
    window.addEventListener("resize", applyOffsets);

    const observer = new MutationObserver(() => {
      applyOffsets();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.__CP_TARJA_TOPO_REMOVE__ = () => {
      const tarja = getTarja();
      const header = getHeader();
      const atalhos = getAtalhos();
      const style = document.getElementById(CONFIG.styleId);

      if (tarja) tarja.remove();
      if (style) style.remove();

      document.body.style.removeProperty("padding-top");
      if (header) header.style.removeProperty("top");
      if (atalhos) atalhos.style.removeProperty("top");

      observer.disconnect();
      delete window.__HITZZ_TARJA_FIXA__;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
