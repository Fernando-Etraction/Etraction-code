/* Ação Isla por R$ 1,00 — AVISO FLUTUANTE (preto e vermelho, contador até 23:59)
   Onde: todas as páginas (scripts globais). Não aparece no carrinho nem no checkout.
   Abre completo por 5 s e vira um pop pequeno com o contador. Clicou no pop, abre de novo.
   No X, some até a próxima sessão. */
(function () {
  if (window.__hzIslaFloat) return;
  window.__hzIslaFloat = true;

  var CFG = {
    minimo: 999,
    url: '/isla-chinelo-flat-feminino-marrom',
    img: 'https://adaptive-images.uooucdn.com.br/tr:w-160,h-160,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png',
    atraso: 2500,   // espera para aparecer (ms)
    aberto: 5000    // tempo aberto antes de virar pop (ms)
  };

  if (/\/cart|\/checkout/.test(location.pathname)) return;
  try { if (sessionStorage.getItem('hzIslaFloatOff')) return; } catch (e) {}

  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var dd = function (n) { return (n < 10 ? '0' : '') + n; };
  function restante() {
    var agora = Date.now();
    var br = new Date(agora - 3 * 3600e3);
    var fim = Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), br.getUTCDate() + 1) + 3 * 3600e3;
    var s = Math.max(0, Math.floor((fim - agora) / 1000));
    return [dd(Math.floor(s / 3600)), dd(Math.floor(s % 3600 / 60)), dd(s % 60)];
  }
  function lerTotal() {
    try { if (window.Uoou && Uoou.cart && Uoou.cart.getSubTotal) return (Uoou.cart.getSubTotal() || 0) / 100; } catch (e) {}
    return 0;
  }

  var css =
    '#hz-isla-float{position:fixed;left:16px;bottom:16px;z-index:9998;font:400 12.5px/1.35 Roboto,Arial,sans-serif;color:#fff}' +
    /* card completo */
    '#hz-isla-float .hz-card{position:relative;width:330px;background:#0d0d0d;border-radius:6px;border-top:3px solid #e3000f;box-shadow:0 4px 18px rgba(0,0,0,.25);transform-origin:left bottom;transition:opacity .25s,transform .25s}' +
    '#hz-isla-float a.hz-in{display:flex;gap:11px;align-items:center;padding:11px 32px 11px 11px;color:#fff;text-decoration:none}' +
    '#hz-isla-float .hz-card img{width:54px;height:54px;object-fit:cover;border-radius:3px;background:#efebe6;flex:none}' +
    '#hz-isla-float .hz-tt{font-weight:700;font-size:13.5px;letter-spacing:.02em;text-transform:uppercase}' +
    '#hz-isla-float em{font-style:normal;color:#ff2a2a}' +
    '#hz-isla-float .hz-sb{color:#a8a8a8;font-size:12px;margin-top:2px}' +
    '#hz-isla-float .hz-cd{display:flex;align-items:center;gap:4px;margin-top:7px;font-size:11px;color:#a8a8a8;text-transform:uppercase;letter-spacing:.04em}' +
    '#hz-isla-float .hz-cd b{background:#e3000f;color:#fff;font-size:13px;font-weight:700;padding:3px 5px;border-radius:2px;min-width:26px;text-align:center;font-variant-numeric:tabular-nums}' +
    '#hz-isla-float .hz-cd i{font-style:normal;color:#e3000f;font-weight:700}' +
    '#hz-isla-float .hz-cd span{margin-right:4px}' +
    '#hz-isla-float .hz-bar{height:3px;background:#2e2e2e;border-radius:2px;margin:8px 0 4px;overflow:hidden}' +
    '#hz-isla-float .hz-bar i{display:block;height:100%;background:#e3000f;width:0;transition:width .3s}' +
    '#hz-isla-float .hz-st{font-size:12px;color:#fff;font-weight:500}' +
    '#hz-isla-float .hz-x{position:absolute;top:5px;right:5px;width:24px;height:24px;border:0;background:none;color:#8a8a8a;font-size:17px;line-height:24px;cursor:pointer;padding:0}' +
    /* pop pequeno */
    '#hz-isla-float .hz-pop{display:inline-flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;background:#0d0d0d;border:1px solid #e3000f;border-radius:999px;box-shadow:0 3px 12px rgba(0,0,0,.25);cursor:pointer;transform-origin:left bottom;transition:opacity .25s,transform .25s}' +
    '#hz-isla-float .hz-pop img{width:34px;height:34px;object-fit:cover;border-radius:50%;background:#efebe6;flex:none}' +
    '#hz-isla-float .hz-pop .hz-pt{font-weight:700;font-size:12px;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap}' +
    '#hz-isla-float .hz-pop .hz-pc{background:#e3000f;font-weight:700;font-size:12px;padding:3px 6px;border-radius:2px;font-variant-numeric:tabular-nums;letter-spacing:.03em}' +
    /* estados */
    '#hz-isla-float .hz-off{opacity:0;transform:scale(.92) translateY(6px);pointer-events:none;position:absolute;left:0;bottom:0}' +
    '@media(max-width:600px){#hz-isla-float{left:10px;bottom:12px}#hz-isla-float .hz-card{width:calc(100vw - 92px);max-width:330px}#hz-isla-float .hz-card img{width:46px;height:46px}}';

  function montar() {
    if (document.getElementById('hz-isla-float')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var el = document.createElement('div');
    el.id = 'hz-isla-float';
    el.innerHTML =
      '<div class="hz-card hz-off">' +
        '<a class="hz-in" href="' + CFG.url + '">' +
        '<img src="' + CFG.img + '" alt="Isla Marrom">' +
        '<div style="flex:1;min-width:0">' +
        '<div class="hz-tt">Isla Marrom por <em>R$ 1,00</em></div>' +
        '<div class="hz-sb">Nas compras acima de R$ 999</div>' +
        '<div class="hz-cd"><span>Acaba em</span><b class="h">00</b><i>:</i><b class="m">00</b><i>:</i><b class="s">00</b></div>' +
        '<div class="hz-prog" style="display:none"><div class="hz-bar"><i></i></div><div class="hz-st"></div></div>' +
        '</div></a>' +
        '<button class="hz-x" type="button" aria-label="Fechar">×</button>' +
      '</div>' +
      '<div class="hz-pop hz-off" role="button" aria-label="Ver oferta da Isla">' +
        '<img src="' + CFG.img + '" alt="">' +
        '<span class="hz-pt">Isla por <em>R$ 1</em></span>' +
        '<span class="hz-pc">--:--:--</span>' +
      '</div>';
    document.body.appendChild(el);

    var card = el.querySelector('.hz-card');
    var pop = el.querySelector('.hz-pop');
    var timer = null;

    function abrir() {
      pop.classList.add('hz-off');
      card.classList.remove('hz-off');
      clearTimeout(timer);
      timer = setTimeout(fechar, CFG.aberto);
    }
    function fechar() {
      card.classList.add('hz-off');
      pop.classList.remove('hz-off');
    }

    pop.addEventListener('click', abrir);
    // com o mouse em cima, não recolhe
    card.addEventListener('mouseenter', function () { clearTimeout(timer); });
    card.addEventListener('mouseleave', function () { clearTimeout(timer); timer = setTimeout(fechar, 2000); });

    el.querySelector('.hz-x').addEventListener('click', function () {
      el.remove();
      try { sessionStorage.setItem('hzIslaFloatOff', '1'); } catch (e) {}
    });

    var h = el.querySelector('.hz-cd .h'), m = el.querySelector('.hz-cd .m'), s = el.querySelector('.hz-cd .s');
    var pc = el.querySelector('.hz-pc');
    var ultimo = null;
    var tick = function () {
      var r = restante();
      h.textContent = r[0]; m.textContent = r[1]; s.textContent = r[2];
      pc.textContent = r.join(':');

      var lg = document.getElementById('lgdp');
      var lgOn = lg && lg.offsetHeight > 0 && getComputedStyle(lg).display !== 'none';
      el.style.marginBottom = lgOn ? (lg.offsetHeight + 8) + 'px' : '';

      var t = lerTotal();
      if (t === ultimo) return;
      ultimo = t;
      var prog = el.querySelector('.hz-prog');
      if (t <= 0) { prog.style.display = 'none'; return; }
      prog.style.display = '';
      el.querySelector('.hz-bar i').style.width = Math.min(100, (t / CFG.minimo) * 100) + '%';
      el.querySelector('.hz-st').textContent = t >= CFG.minimo
        ? 'Você já garantiu. Adicione a sua Isla.'
        : 'Faltam ' + brl(CFG.minimo - t) + ' no seu carrinho';
    };
    tick();
    setInterval(tick, 1000);
    requestAnimationFrame(abrir);
  }

  var iniciar = function () { setTimeout(montar, CFG.atraso); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
