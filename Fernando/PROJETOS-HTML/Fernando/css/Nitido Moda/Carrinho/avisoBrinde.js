/* Nítido Moda Evangélica · aviso de brinde
   1) No carrinho (/checkout/cart): resumo acima da lista de produtos, lido do bloco nativo #area-brinde.
   2) No mini-carrinho lateral (todas as outras páginas): o mesmo resumo no topo da lista. Como o
      mini-carrinho não traz os dados do brinde, o script consulta a página do carrinho em segundo plano.
   Não muda a regra do brinde nem os blocos nativos. */
(function () {
    'use strict';

    var CFG = {
        meta: null,            // valor da meta em reais. null = calcula pela barra nativa (falta ÷ parte que falta)
        mostrarMeta: true,     // false = esconde "R$ X de R$ Y" e deixa só a barra
        miniCarrinho: true,    // false = aviso só na página do carrinho
        urlCarrinho: '/checkout/cart'
    };

    var CSS = '' +
        '.nab{font-family:inherit;box-sizing:border-box;display:flex;gap:12px;align-items:center;margin:0 0 12px;padding:12px;background:#f1faf5;border:1px solid #2cbb6a;border-radius:3px;color:#122d47;text-decoration:none;cursor:pointer}' +
        '.nab *{box-sizing:border-box}' +
        '.nab .nab-foto{flex:0 0 56px;width:56px;height:56px;border-radius:3px;background:#fff center/cover no-repeat;border:1px solid #d5e9dd}' +
        '.nab .nab-txt{flex:1 1 auto;min-width:0;font-size:14px;line-height:1.35;text-align:left}' +
        '.nab .nab-txt strong{font-weight:700}' +
        '.nab .nab-barra{display:block;height:8px;margin-top:8px;background:#d5e9dd;border-radius:4px;overflow:hidden}' +
        '.nab .nab-barra i{display:block;height:100%;background:#2cbb6a;border-radius:4px}' +
        '.nab .nab-meta{display:flex;justify-content:space-between;gap:8px;margin-top:5px;font-size:12px;color:#184f32}' +
        '.nab .nab-ver{text-decoration:underline;white-space:nowrap}' +
        '.nab.nab-ganhou{background:#1b7a45;border-color:#1b7a45;color:#fff}' +
        '.nab.nab-ganhou .nab-meta{color:#fff}' +
        '.nab.nab-ok{cursor:default;padding:10px 12px}' +
        '.nab.nab-ok .nab-foto{flex-basis:40px;width:40px;height:40px}' +
        /* mini-carrinho: mais compacto e com o canto arredondado dos cartões de produto */
        '.nab.nab-mini{flex:0 0 auto;margin:0 0 12px;padding:10px;border-radius:6px;gap:10px}' +
        '.nab.nab-mini .nab-foto{flex-basis:44px;width:44px;height:44px}' +
        '.nab.nab-mini .nab-txt{font-size:13px}' +
        '.nab.nab-mini .nab-barra{height:6px;margin-top:6px}';

    function reais(n) { return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function numero(txt) {
        var m = String(txt || '').match(/R\$\s*([\d.]+,\d{2})/);
        return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null;
    }
    function evento(acao) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'aviso_brinde', aviso_acao: acao });
        } catch (e) { }
    }
    function el(tag, cls, txt) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (txt) n.textContent = txt;
        return n;
    }
    function estilo() {
        if (document.getElementById('nab-css')) return;
        var st = el('style'); st.id = 'nab-css'; st.textContent = CSS;
        (document.head || document.documentElement).appendChild(st);
    }

    // lê o bloco nativo de brindes, na página atual ou no HTML do carrinho buscado em segundo plano
    function ler(raiz) {
        var area = raiz.querySelector('#area-brinde');
        if (!area) return null;
        var itens = area.querySelectorAll('.item-brinde');
        if (!itens.length) return null;
        // primeiro brinde ainda não resgatado; se todos já foram, fica o último
        var item = area.querySelector('.item-brinde:not(.resgatado)') || itens[itens.length - 1];
        var resgatado = item.classList.contains('resgatado');
        var faltaEl = area.querySelector('.box-btns .falta, .txt-mobile');
        var falta = faltaEl && /falta/i.test(faltaEl.textContent) ? numero(faltaEl.textContent) : null;
        var barra = area.querySelector('.barra-status');
        var pct = barra ? parseFloat(barra.style.width || (barra.getAttribute('style') || '').replace(/^.*width:\s*/, '')) : NaN;
        var nome = (item.querySelector('.nome-brinde') || {}).textContent || '';
        var img = item.querySelector('.img-brinde img');
        var meta = CFG.meta;
        if (!meta && falta && pct > 0 && pct < 100) meta = Math.round(falta / (1 - pct / 100) / 10) * 10;
        return {
            falta: falta,
            pct: isNaN(pct) ? null : Math.max(0, Math.min(100, pct)),
            meta: meta || null,
            nome: nome.trim(),
            foto: img ? (img.getAttribute('data-src') || img.getAttribute('src') || '').replace(/fit-in\/\d+x\d+/, 'fit-in/160x160') : '',
            resgatado: resgatado,
            ganhou: !falta && !resgatado
        };
    }

    function assinatura(d) { return [d.falta, d.pct, d.nome, d.ganhou, d.resgatado].join('|'); }

    function desenhar(d, mini) {
        var a = el('a', 'nab' + (mini ? ' nab-mini' : '') + (d.resgatado ? ' nab-ok' : (d.ganhou ? ' nab-ganhou' : '')));
        a.href = CFG.urlCarrinho + '#area-brinde';
        a.setAttribute('data-estado', assinatura(d));

        if (d.foto) { var f = el('span', 'nab-foto'); f.style.backgroundImage = 'url("' + d.foto + '")'; a.appendChild(f); }

        var t = el('span', 'nab-txt');
        var brinde = d.nome ? d.nome : 'um brinde';
        if (d.resgatado) {
            t.appendChild(el('strong', '', 'Brinde garantido: ' + brinde + '.'));
            t.appendChild(document.createTextNode(' Ele vai junto com o seu pedido.'));
        } else if (d.ganhou) {
            t.appendChild(el('strong', '', 'Você ganhou: ' + brinde + '.'));
            t.appendChild(document.createTextNode(mini ? ' Resgate no carrinho.' : ' Resgate antes de finalizar.'));
        } else {
            t.appendChild(document.createTextNode('Faltam '));
            t.appendChild(el('strong', '', reais(d.falta)));
            t.appendChild(document.createTextNode(' para ganhar de brinde: '));
            t.appendChild(el('strong', '', brinde));
        }
        if (d.pct !== null && !d.ganhou && !d.resgatado) {
            var b = el('span', 'nab-barra'); var i = el('i'); i.style.width = d.pct + '%'; b.appendChild(i); t.appendChild(b);
        }
        if (!d.resgatado) {
            var m = el('span', 'nab-meta');
            m.appendChild(el('span', '', (!d.ganhou && CFG.mostrarMeta && d.meta && d.falta) ? reais(d.meta - d.falta) + ' de ' + reais(d.meta) : ''));
            m.appendChild(el('span', 'nab-ver', d.ganhou ? 'Resgatar brinde' : 'Ver brinde'));
            t.appendChild(m);
        }
        a.appendChild(t);
        return a;
    }

    /* ---------- 1) página do carrinho ---------- */
    var visto = false;

    function montarCarrinho() {
        var d = ler(document);
        var antigo = document.getElementById('nab');
        var lista = document.querySelector('#cart-area .lista-carrinho') || document.querySelector('.lista-carrinho');
        if (!d || !lista) { if (antigo) antigo.remove(); return; }
        if (antigo && antigo.getAttribute('data-estado') === assinatura(d) && antigo.nextSibling === lista) return;
        if (antigo) antigo.remove();

        var a = desenhar(d, false);
        a.id = 'nab';
        a.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (d.resgatado) return;
            evento(d.ganhou ? 'clique_resgatar' : 'clique_ver');
            var area = document.getElementById('area-brinde');
            try { area.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { area.scrollIntoView(); }
        });
        lista.parentNode.insertBefore(a, lista);
        if (!visto) { visto = true; evento(d.resgatado ? 'visto_resgatado' : (d.ganhou ? 'visto_ganhou' : 'visto_falta')); }
    }

    /* ---------- 2) mini-carrinho lateral ---------- */
    var mini = { dados: null, chave: '', buscando: false, visto: false };

    function chaveItens(lista) {
        var txt = '';
        [].forEach.call(lista.querySelectorAll('.cart-item'), function (it) { txt += it.textContent.replace(/\s+/g, ' ') + '#'; });
        return txt;
    }

    function buscarBrinde(chave) {
        if (mini.buscando) return;
        mini.buscando = true;
        fetch(CFG.urlCarrinho, { credentials: 'same-origin' })
            .then(function (r) { return r.text(); })
            .then(function (html) {
                mini.dados = ler(new DOMParser().parseFromString(html, 'text/html'));
                mini.chave = chave;
            })
            .catch(function () { mini.dados = null; mini.chave = chave; })
            .then(function () { mini.buscando = false; montarMini(); });
    }

    function montarMini() {
        var lista = document.querySelector('#cart-preview-area .cart-items');
        var antigo = document.getElementById('nab-mini');
        if (!lista || !lista.querySelector('.cart-item')) { if (antigo) antigo.remove(); return; }

        var chave = chaveItens(lista);
        if (chave !== mini.chave) { buscarBrinde(chave); return; }   // itens mudaram: consulta de novo e volta aqui
        var d = mini.dados;
        if (!d) { if (antigo) antigo.remove(); return; }
        if (antigo && antigo.getAttribute('data-estado') === assinatura(d) && antigo.parentNode === lista && lista.firstChild === antigo) return;
        if (antigo) antigo.remove();

        var a = desenhar(d, true);
        a.id = 'nab-mini';
        a.addEventListener('click', function () { evento(d.resgatado ? 'mini_clique_resgatado' : (d.ganhou ? 'mini_clique_resgatar' : 'mini_clique_ver')); });
        lista.insertBefore(a, lista.firstChild);
        // alinha com os cartões de produto (no desktop a lista não tem margem própria)
        var dx = lista.querySelector('.cart-item').getBoundingClientRect().left - a.getBoundingClientRect().left;
        if (dx > 0) { a.style.marginLeft = a.style.marginRight = a.style.marginTop = dx + 'px'; }
        if (!mini.visto) { mini.visto = true; evento(d.resgatado ? 'mini_visto_resgatado' : (d.ganhou ? 'mini_visto_ganhou' : 'mini_visto_falta')); }
    }

    function observar(alvo, fn, opcoes) {
        var espera = null;
        new MutationObserver(function () {
            clearTimeout(espera);
            espera = setTimeout(fn, 250);
        }).observe(alvo, opcoes);
    }

    function iniciar() {
        estilo();
        if (location.pathname.replace(/\/+$/, '') === CFG.urlCarrinho) {
            montarCarrinho();
            // o carrinho recarrega trechos ao mudar quantidade ou cupom: remonta quando isso acontece
            observar(document.getElementById('main-cart-area') || document.body, montarCarrinho,
                { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
            return;
        }
        if (!CFG.miniCarrinho || !window.fetch || !window.DOMParser) return;
        var area = document.getElementById('cart-preview-area');
        if (!area) return;
        montarMini();
        // o mini-carrinho carrega os itens ao abrir e redesenha ao remover peça
        observar(area, montarMini, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
