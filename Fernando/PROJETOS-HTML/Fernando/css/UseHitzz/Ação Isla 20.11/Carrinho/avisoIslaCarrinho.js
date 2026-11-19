/* Ação Isla por R$ 1,00 — INFORMATIVO NO CARRINHO (/cart/) (preto e vermelho, contador até 23:59)
   Entra logo acima da "Sua caixa Black". Lê o subtotal de produtos e
   reconhece a Isla Marrom no carrinho pelo código U26ISLM. */
(function () {
  if (window.__hzIslaCart) return;
  window.__hzIslaCart = true;

  var CFG = {
    minimo: 999,
    sku: 'U26ISLM',
    url: '/isla-chinelo-flat-feminino-marrom',
    img: 'https://adaptive-images.uooucdn.com.br/tr:w-160,h-160,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png'
  };

  if (!document.getElementById('page-cart')) return;

  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var num = function (t) {
    var m = (t || '').match(/R\$\s*([\d.]+,\d{2})/);
    return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : 0;
  };
  var dd = function (n) { return (n < 10 ? '0' : '') + n; };
  function restante() {
    var agora = Date.now();
    var br = new Date(agora - 3 * 3600e3);
    var fim = Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), br.getUTCDate() + 1) + 3 * 3600e3;
    var s = Math.max(0, Math.floor((fim - agora) / 1000));
    return dd(Math.floor(s / 3600)) + ':' + dd(Math.floor(s % 3600 / 60)) + ':' + dd(s % 60);
  }

  var css =
    '#hz-isla-cart{display:flex;gap:14px;align-items:center;margin:0 0 10px;padding:10px 12px;background:#0d0d0d;color:#fff;border-left:4px solid #e3000f;border-radius:3px;font:400 13px/1.35 Roboto,Arial,sans-serif}' +
    '#hz-isla-cart img{width:54px;height:54px;object-fit:cover;border-radius:3px;background:#efebe6;flex:none}' +
    '#hz-isla-cart .hz-tt{font-weight:700;font-size:14px;letter-spacing:.02em;text-transform:uppercase}' +
    '#hz-isla-cart .hz-tt em{font-style:normal;color:#ff2a2a}' +
    '#hz-isla-cart .hz-sb{color:#a8a8a8;font-size:12px}' +
    '#hz-isla-cart .hz-bar{height:4px;background:#2e2e2e;border-radius:2px;margin:7px 0 5px;overflow:hidden;max-width:520px}' +
    '#hz-isla-cart .hz-bar i{display:block;height:100%;background:#e3000f;width:0;transition:width .3s}' +
    '#hz-isla-cart .hz-cd{flex:none;text-align:center;font-size:10.5px;color:#a8a8a8;text-transform:uppercase;letter-spacing:.05em}' +
    '#hz-isla-cart .hz-cd b{display:block;margin-top:3px;color:#fff;font-size:17px;font-weight:700;letter-spacing:.04em;font-variant-numeric:tabular-nums}' +
    '#hz-isla-cart .hz-cta{flex:none;display:inline-block;padding:11px 16px;background:#e3000f;border-radius:3px;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;text-decoration:none;white-space:nowrap}' +
    '#hz-isla-cart .hz-cta:hover{background:#c4000d;color:#fff}' +
    '#hz-isla-cart .hz-ok{flex:none;padding:10px 14px;border:1px solid #3a3a3a;border-radius:3px;font-size:12px;font-weight:700;color:#fff;white-space:nowrap;text-transform:uppercase;letter-spacing:.04em}' +
    '#hz-isla-cart .hz-ok:before{content:"✓ ";color:#ff2a2a}' +
    '@media(max-width:600px){#hz-isla-cart{flex-wrap:wrap;gap:10px}#hz-isla-cart img{width:46px;height:46px}#hz-isla-cart .hz-txt{flex:1 1 calc(100% - 60px)}#hz-isla-cart .hz-tt{font-size:13px}#hz-isla-cart .hz-cd{order:3;flex:1;text-align:left;display:flex;align-items:center;gap:6px}#hz-isla-cart .hz-cd b{display:inline;margin:0;font-size:15px}#hz-isla-cart .hz-cta,#hz-isla-cart .hz-ok{order:4}}';

  function lerCarrinho() {
    var total = 0;
    var sub = document.querySelector('.cartSubtotal');
    if (sub) total = num(sub.textContent);
    if (!total && window.arrCartInfo && arrCartInfo.value) total = +arrCartInfo.value;
    var temIsla = false;
    document.querySelectorAll('tr.CartProduct .CartProductSku').forEach(function (s) {
      if (s.textContent.trim().indexOf(CFG.sku) === 0) temIsla = true;
    });
    return { total: total, temIsla: temIsla };
  }

  function render(el, c) {
    var pct = Math.min(100, (c.total / CFG.minimo) * 100);
    var titulo, sb, direita;
    if (c.total >= CFG.minimo && c.temIsla) {
      titulo = 'Sua Isla Marrom sai por <em>R$ 1,00</em>';
      sb = 'Seu carrinho passou de R$ 999,00. Finalize antes do fim do dia.';
      direita = '<span class="hz-ok">Garantida</span>';
    } else if (c.total >= CFG.minimo) {
      titulo = 'Você já pode levar a Isla Marrom por <em>R$ 1,00</em>';
      sb = 'Seu carrinho passou de R$ 999,00. Escolha o tamanho e adicione.';
      direita = '<a class="hz-cta" href="' + CFG.url + '">Escolher tamanho</a>';
    } else {
      titulo = 'Faltam <em>' + brl(CFG.minimo - c.total) + '</em> para a Isla Marrom por <em>R$ 1,00</em>';
      sb = 'Nas compras acima de R$ 999,00';
      direita = '<a class="hz-cta" href="' + CFG.url + '">Ver a Isla</a>';
    }
    el.innerHTML =
      '<img src="' + CFG.img + '" alt="Isla Marrom">' +
      '<div class="hz-txt" style="flex:1;min-width:0">' +
      '<div class="hz-tt">' + titulo + '</div>' +
      (c.total < CFG.minimo ? '<div class="hz-bar"><i style="width:' + pct + '%"></i></div>' : '') +
      '<div class="hz-sb">' + sb + '</div>' +
      '</div>' +
      '<div class="hz-cd">Acaba em<b>' + restante() + '</b></div>' +
      direita;
  }

  function montar() {
    var box = document.getElementById('cartContainer');
    if (!box) return;
    var el = document.getElementById('hz-isla-cart');
    if (!el) {
      if (!document.getElementById('hz-isla-cart-css')) {
        var st = document.createElement('style'); st.id = 'hz-isla-cart-css'; st.textContent = css; document.head.appendChild(st);
      }
      el = document.createElement('div');
      el.id = 'hz-isla-cart';
      var ref = document.getElementById('hzbf-cart') || box.querySelector('.rowCartPostalCode') || box.firstChild;
      box.insertBefore(el, ref);
    }
    var c = lerCarrinho();
    var chave = c.total + '|' + c.temIsla;
    if (el.getAttribute('data-k') !== chave) {
      el.setAttribute('data-k', chave);
      render(el, c);
    } else {
      var b = el.querySelector('.hz-cd b');
      if (b) b.textContent = restante();
    }
  }

  var iniciar = function () { montar(); setInterval(montar, 1000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
