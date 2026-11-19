/* Ação Isla por R$ 1,00 — INFORMATIVO NO MINI CARRINHO (preto e vermelho, contador até 23:59)
   Onde: todas as páginas (scripts globais). Entra acima do resumo "Produtos / Frete / Subtotal"
   e se refaz sozinho sempre que a gaveta recarrega. */
(function () {
  if (window.__hzIslaMini) return;
  window.__hzIslaMini = true;

  var CFG = {
    minimo: 999,
    slug: 'isla-chinelo-flat-feminino-marrom',
    url: '/isla-chinelo-flat-feminino-marrom'
  };

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
    '#hz-isla-mini{margin:0 0 10px;padding:10px 11px;background:#0d0d0d;color:#fff;border-left:3px solid #e3000f;border-radius:3px;font:400 12.5px/1.35 Roboto,Arial,sans-serif}' +
    '#hz-isla-mini .hz-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}' +
    '#hz-isla-mini .hz-tt{font-weight:700;font-size:12.5px;text-transform:uppercase;letter-spacing:.02em}' +
    '#hz-isla-mini .hz-tt em{font-style:normal;color:#ff2a2a}' +
    '#hz-isla-mini .hz-cd{flex:none;background:#e3000f;color:#fff;font-weight:700;font-size:12px;padding:3px 6px;border-radius:2px;font-variant-numeric:tabular-nums;letter-spacing:.03em}' +
    '#hz-isla-mini .hz-bar{height:3px;background:#2e2e2e;border-radius:2px;margin:7px 0 5px;overflow:hidden}' +
    '#hz-isla-mini .hz-bar i{display:block;height:100%;background:#e3000f;width:0;transition:width .3s}' +
    '#hz-isla-mini .hz-sb{font-size:11.5px;color:#a8a8a8;margin-top:3px}' +
    '#hz-isla-mini a{color:#fff;text-decoration:underline;text-underline-offset:2px;font-weight:500}';

  function lerMini(modal) {
    var p = modal.querySelector('.minicart-modal__subtotal .minicart-modal__subtotal-price') ||
            modal.querySelector('.minicart-modal__subtotal-price');
    return {
      total: p ? num(p.textContent) : 0,
      temIsla: !!modal.querySelector('.minicart-modal__item a[href*="' + CFG.slug + '"]')
    };
  }

  function texto(c) {
    var cd = '<span class="hz-cd">' + restante() + '</span>';
    if (c.total >= CFG.minimo && c.temIsla) {
      return '<div class="hz-row"><div class="hz-tt">✓ Sua Isla Marrom sai por <em>R$ 1,00</em></div>' + cd + '</div>' +
             '<div class="hz-sb">Finalize antes do fim do dia.</div>';
    }
    if (c.total >= CFG.minimo) {
      return '<div class="hz-row"><div class="hz-tt">Já pode levar a Isla Marrom por <em>R$ 1,00</em></div>' + cd + '</div>' +
             '<div class="hz-sb"><a href="' + CFG.url + '">Escolher tamanho</a></div>';
    }
    return '<div class="hz-row"><div class="hz-tt">Faltam <em>' + brl(CFG.minimo - c.total) + '</em> para a Isla por <em>R$ 1,00</em></div>' + cd + '</div>' +
           '<div class="hz-bar"><i style="width:' + Math.min(100, (c.total / CFG.minimo) * 100) + '%"></i></div>' +
           '<div class="hz-sb">Nas compras acima de R$ 999,00 · <a href="' + CFG.url + '">Ver a Isla</a></div>';
  }

  function aplicar() {
    var modal = document.querySelector('.minicart-modal');
    if (!modal) return;
    var summary = modal.querySelector('.minicart-modal__summary');
    var antigo = modal.querySelector('#hz-isla-mini');
    if (!summary || !modal.querySelector('.minicart-modal__item')) {
      if (antigo) antigo.remove();
      return;
    }
    var c = lerMini(modal);
    var chave = c.total + '|' + c.temIsla;
    if (antigo && antigo.getAttribute('data-k') === chave && antigo.nextElementSibling === summary) return;
    if (antigo) antigo.remove();
    var el = document.createElement('div');
    el.id = 'hz-isla-mini';
    el.setAttribute('data-k', chave);
    el.innerHTML = texto(c);
    summary.parentNode.insertBefore(el, summary);
  }

  function iniciar() {
    if (!document.getElementById('hz-isla-mini-css')) {
      var st = document.createElement('style'); st.id = 'hz-isla-mini-css'; st.textContent = css; document.head.appendChild(st);
    }
    aplicar();
    var agendado = null;
    new MutationObserver(function (muts) {
      // ignora as mudanças do próprio contador
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        if (!(t.closest && t.closest('#hz-isla-mini'))) {
          if (!agendado) agendado = setTimeout(function () { agendado = null; aplicar(); }, 120);
          break;
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
    setInterval(function () {
      var cd = document.querySelector('#hz-isla-mini .hz-cd');
      if (cd) cd.textContent = restante();
    }, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
