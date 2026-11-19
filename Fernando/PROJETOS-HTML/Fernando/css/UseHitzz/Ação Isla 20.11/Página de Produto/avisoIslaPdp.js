/* Ação Isla por R$ 1,00 — INFORMATIVO NA PDP (preto e vermelho, contador até 23:59)
   Onde: página de produto. Entra logo abaixo do bloco de cashback (Hitzzback). */
(function () {
  if (window.__hzIslaPdp) return;
  window.__hzIslaPdp = true;

  var CFG = {
    minimo: 999,
    slug: 'isla-chinelo-flat-feminino-marrom',
    url: '/isla-chinelo-flat-feminino-marrom',
    img: 'https://adaptive-images.uooucdn.com.br/tr:w-160,h-160,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png'
  };

  if (!document.getElementById('page-product-detail')) return;

  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var dd = function (n) { return (n < 10 ? '0' : '') + n; };
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
  var ehIsla = location.pathname.indexOf(CFG.slug) > -1;

  var css =
    '#hz-isla-pdp{margin:10px 0 12px;background:#0d0d0d;color:#fff;border-radius:4px;overflow:hidden;font:400 12.5px/1.35 Roboto,Arial,sans-serif}' +
    '#hz-isla-pdp .hz-top{display:flex;gap:12px;align-items:center;padding:11px 12px}' +
    '#hz-isla-pdp img{width:52px;height:52px;object-fit:cover;border-radius:3px;background:#efebe6;flex:none}' +
    '#hz-isla-pdp .hz-tt{font-weight:700;font-size:14px;letter-spacing:.02em;text-transform:uppercase}' +
    '#hz-isla-pdp .hz-tt em{font-style:normal;color:#ff2a2a}' +
    '#hz-isla-pdp .hz-sb{color:#a8a8a8;margin-top:2px}' +
    '#hz-isla-pdp .hz-sb a{color:#fff;text-decoration:underline;text-underline-offset:2px}' +
    '#hz-isla-pdp .hz-cd{flex:none;text-align:right;font-size:10.5px;color:#a8a8a8;text-transform:uppercase;letter-spacing:.05em}' +
    '#hz-isla-pdp .hz-cd b{display:block;margin-top:3px;background:#e3000f;color:#fff;font-size:15px;font-weight:700;letter-spacing:.04em;padding:4px 7px;border-radius:2px;font-variant-numeric:tabular-nums}' +
    '#hz-isla-pdp .hz-prog{padding:8px 12px 10px;border-top:1px solid #262626}' +
    '#hz-isla-pdp .hz-bar{height:3px;background:#2e2e2e;border-radius:2px;margin-bottom:6px;overflow:hidden}' +
    '#hz-isla-pdp .hz-bar i{display:block;height:100%;background:#e3000f;width:0;transition:width .3s}' +
    '#hz-isla-pdp .hz-st{font-size:12px;color:#dcdcdc}' +
    '#hz-isla-pdp .hz-st strong{color:#fff}' +
    '@media(max-width:420px){#hz-isla-pdp .hz-tt{font-size:13px}#hz-isla-pdp .hz-cd b{font-size:13.5px}}';

  function montar() {
    if (document.getElementById('hz-isla-pdp')) return;
    var ancora = document.querySelector('#right-column .product-cashback-banner') ||
                 document.querySelector('#product-variant-form');
    if (!ancora) return;

    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var titulo = ehIsla ? 'Esta Isla sai por <em>R$ 1,00</em>' : 'Leve a Isla Marrom por <em>R$ 1,00</em>';
    var linha = ehIsla
      ? 'Nas compras acima de R$ 999,00.'
      : 'Nas compras acima de R$ 999,00. <a href="' + CFG.url + '">Ver a Isla</a>';

    var el = document.createElement('div');
    el.id = 'hz-isla-pdp';
    el.innerHTML =
      '<div class="hz-top">' +
      '<img src="' + CFG.img + '" alt="Isla Marrom">' +
      '<div style="flex:1;min-width:0"><div class="hz-tt">' + titulo + '</div><div class="hz-sb">' + linha + '</div></div>' +
      '<div class="hz-cd">Acaba em<b>--:--:--</b></div>' +
      '</div>' +
      '<div class="hz-prog" style="display:none"><div class="hz-bar"><i></i></div><div class="hz-st"></div></div>';

    if (ancora.classList.contains('product-cashback-banner')) ancora.parentNode.insertBefore(el, ancora.nextSibling);
    else ancora.insertBefore(el, ancora.firstChild);

    var cd = el.querySelector('.hz-cd b');
    var ultimo = null;
    var tick = function () {
      cd.textContent = restante();
      var t = lerTotal();
      if (t === ultimo) return;
      ultimo = t;
      var prog = el.querySelector('.hz-prog');
      if (t <= 0) { prog.style.display = 'none'; return; }
      prog.style.display = '';
      el.querySelector('.hz-bar i').style.width = Math.min(100, (t / CFG.minimo) * 100) + '%';
      el.querySelector('.hz-st').innerHTML = t >= CFG.minimo
        ? '<strong>Seu carrinho já passou de R$ 999.</strong> A Isla sai por R$ 1,00.'
        : 'Seu carrinho: ' + brl(t) + ' · <strong>faltam ' + brl(CFG.minimo - t) + '</strong>';
    };
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
