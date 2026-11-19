/* Ação Isla por R$ 1,00 — TARJA TOPO (preto e vermelho, contador até 23:59)
   Onde: todas as páginas (scripts globais). Não aparece no checkout. */
(function () {
  if (window.__hzIslaTarja) return;
  window.__hzIslaTarja = true;

  var CFG = { minimo: 999, url: '/isla-chinelo-flat-feminino-marrom' };
  if (/\/checkout/.test(location.pathname)) return;

  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var dd = function (n) { return (n < 10 ? '0' : '') + n; };
  // tempo até 23:59:59 de hoje, horário de Brasília (UTC-3)
  function restante() {
    var agora = Date.now();
    var br = new Date(agora - 3 * 3600e3);
    var fim = Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), br.getUTCDate() + 1) + 3 * 3600e3;
    var s = Math.max(0, Math.floor((fim - agora) / 1000));
    return dd(Math.floor(s / 3600)) + ':' + dd(Math.floor(s % 3600 / 60)) + ':' + dd(s % 60);
  }
  function lerTotal() {
    try { if (window.Uoou && Uoou.cart && Uoou.cart.getSubTotal) return (Uoou.cart.getSubTotal() || 0) / 100; } catch (e) {}
    return 0;
  }

  var css =
    '#hz-isla-tarja{background:#0d0d0d;color:#fff;font:400 12.5px/1 Roboto,Arial,sans-serif;border-bottom:2px solid #e3000f}' +
    '#hz-isla-tarja a{display:flex;align-items:center;justify-content:center;gap:12px;color:#fff;text-decoration:none;padding:7px 12px;flex-wrap:wrap}' +
    '#hz-isla-tarja .hz-of{font-weight:700;letter-spacing:.03em}' +
    '#hz-isla-tarja .hz-of em{font-style:normal;color:#ff2a2a}' +
    '#hz-isla-tarja .hz-cd{display:inline-flex;align-items:center;gap:6px;color:#bdbdbd;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em}' +
    '#hz-isla-tarja .hz-cd b{background:#e3000f;color:#fff;font-weight:700;font-size:12.5px;letter-spacing:.04em;padding:3px 6px;border-radius:2px;font-variant-numeric:tabular-nums}' +
    '#hz-isla-tarja .hz-st{color:#bdbdbd}' +
    '@media(max-width:600px){#hz-isla-tarja{font-size:11.5px}#hz-isla-tarja a{gap:8px;padding:6px 8px}#hz-isla-tarja .hz-st,#hz-isla-tarja .hz-lb{display:none}}';

  function montar() {
    if (document.getElementById('hz-isla-tarja')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var el = document.createElement('div');
    el.id = 'hz-isla-tarja';
    el.innerHTML =
      '<a href="' + CFG.url + '">' +
      '<span class="hz-of">ISLA MARROM POR <em>R$ 1,00</em> ACIMA DE R$ 999</span>' +
      '<span class="hz-st"></span>' +
      '<span class="hz-cd"><span class="hz-lb">Acaba em</span><b>--:--:--</b></span>' +
      '</a>';

    var topo = document.getElementById('navbar__top');
    var nav = document.querySelector('.navbar-uoou') || document.querySelector('.navbar');
    if (topo && topo.parentNode) topo.parentNode.insertBefore(el, topo);
    else if (nav) nav.insertBefore(el, nav.firstChild);
    else document.body.insertBefore(el, document.body.firstChild);

    var cd = el.querySelector('.hz-cd b');
    var stt = el.querySelector('.hz-st');
    var ultimo = null;
    var tick = function () {
      cd.textContent = restante();
      var t = lerTotal();
      if (t === ultimo) return;
      ultimo = t;
      stt.textContent = t <= 0 ? '' : (t >= CFG.minimo ? 'Você já garantiu a sua' : 'Faltam ' + brl(CFG.minimo - t));
      stt.style.display = t <= 0 ? 'none' : '';
    };
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
