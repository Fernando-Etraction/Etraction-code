/* Nítido Moda Evangélica · filtro de topo (categorias + "Meu número")
   Celular e desktop. Aparece em Lançamentos e nas páginas de categoria para onde os círculos levam,
   com ou sem filtro na URL. Lê os tamanhos do filtro nativo da Magazord e usa o mesmo
   parâmetro (?derivacao=ID). Não altera o catálogo nem o filtro nativo. */
(function () {
    'use strict';

    var CFG = {
        inicio: { nome: 'Tudo', url: '/lancamentos' },   // primeiro círculo
        tituloTamanho: 'Meu número',
        categorias: [                       // chave = primeira palavra do nome do produto (para achar a foto)
            { nome: 'Vestidos', url: '/feminino/vestidos', chave: 'VESTIDO' },
            { nome: 'Saias', url: '/feminino/saias', chave: 'SAIA' },
            { nome: 'Blusas', url: '/feminino/blusas', chave: 'BLUSA' },
            { nome: 'Camisas', url: '/feminino/camisas', chave: 'CAMISA' }
        ],
        paginasExtras: []                   // outros caminhos onde o bloco deve aparecer, ex.: '/promocao'
    };

    var CSS = '' +
        '#nft{font-family:inherit;background:#fff;padding:10px 0 4px;clear:both}' +
        '#nft *{box-sizing:border-box}' +
        '#nft .nft-row{display:flex;gap:10px;overflow-x:auto;padding:2px 10px 8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}' +
        '#nft .nft-row::-webkit-scrollbar{display:none}' +
        '#nft .nft-cat{flex:0 0 auto;width:68px;text-align:center;text-decoration:none;color:#252525;font-size:12px;line-height:1.2}' +
        '#nft .nft-foto{display:block;width:64px;height:64px;margin:0 auto 5px;border-radius:50%;border:1px solid #d9d9d9;background:#f3f1ee center top/cover no-repeat;overflow:hidden}' +
        '#nft .nft-cat.nft-on .nft-foto{border:2px solid #2f3741}' +
        '#nft .nft-cat.nft-on{font-weight:700}' +
        '#nft .nft-letra .nft-foto{display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:.04em;color:#2f3741;background:#f3f1ee}' +
        '#nft .nft-tam{align-items:center;gap:6px;padding-top:6px}' +
        '#nft .nft-lab{flex:0 0 auto;font-size:13px;font-weight:700;color:#252525;margin-right:2px;white-space:nowrap}' +
        '#nft .nft-chip{flex:0 0 auto;min-width:44px;height:40px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #2f3741;background:#fff;color:#2f3741;font-size:14px;font-weight:500;text-decoration:none}' +
        '#nft .nft-chip.nft-on{background:#2f3741;color:#fff;font-weight:700}' +
        '#nft .nft-limpar{flex:0 0 auto;height:40px;display:inline-flex;align-items:center;padding:0 6px;font-size:13px;color:#252525;text-decoration:underline;white-space:nowrap}' +
        '#nft .nft-letra svg{display:block;width:26px;height:26px;fill:#2f3741}' +
        '#nft .nft-wrap{position:relative}' +
        /* celular: carrossel com encaixe, próxima peça aparecendo e sombra na borda enquanto há mais para rolar */
        'body.device-mobile #nft .nft-row{scroll-snap-type:x proximity;scroll-padding-left:10px;gap:12px}' +
        'body.device-mobile #nft .nft-row > *{scroll-snap-align:start}' +
        'body.device-mobile #nft .nft-cat{width:86px;font-size:13px}' +
        'body.device-mobile #nft .nft-foto{width:82px;height:82px;margin-bottom:6px}' +
        'body.device-mobile #nft .nft-tam{gap:8px}' +
        'body.device-mobile #nft .nft-chip{min-width:48px;height:42px;font-size:15px}' +
        'body.device-mobile #nft .nft-wrap:before,body.device-mobile #nft .nft-wrap:after{content:"";position:absolute;top:0;bottom:8px;width:28px;pointer-events:none;opacity:0;transition:opacity .2s;z-index:1}' +
        'body.device-mobile #nft .nft-wrap:before{left:0;background:linear-gradient(90deg,#fff,rgba(255,255,255,0))}' +
        'body.device-mobile #nft .nft-wrap:after{right:0;background:linear-gradient(270deg,#fff,rgba(255,255,255,0))}' +
        'body.device-mobile #nft .nft-wrap.nft-tem-antes:before,body.device-mobile #nft .nft-wrap.nft-tem-depois:after{opacity:1}' +
        /* desktop: centralizado, círculos maiores, realce ao passar o mouse */
        'body.device-desktop #nft{max-width:1200px;margin:0 auto;padding:14px 0 10px}' +
        'body.device-desktop #nft .nft-row{justify-content:center;gap:22px;overflow:visible;flex-wrap:wrap}' +
        'body.device-desktop #nft .nft-cat{width:96px;font-size:14px}' +
        'body.device-desktop #nft .nft-foto{width:88px;height:88px;margin-bottom:8px}' +
        'body.device-desktop #nft .nft-letra .nft-foto{font-size:13px}' +
        'body.device-desktop #nft .nft-cat:hover .nft-foto{border-color:#2f3741}' +
        'body.device-desktop #nft .nft-tam{gap:8px}' +
        'body.device-desktop #nft .nft-lab{font-size:14px;margin-right:6px}' +
        'body.device-desktop #nft .nft-chip{min-width:48px}' +
        'body.device-desktop #nft .nft-chip:hover{background:#2f3741;color:#fff}';

    var CHAVE_CACHE = 'nft_fotos_v1';
    var UM_DIA = 24 * 60 * 60 * 1000;

    function lerCache() {
        try {
            var c = JSON.parse(localStorage.getItem(CHAVE_CACHE) || '{}');
            if (!c.t || Date.now() - c.t > UM_DIA) return { t: Date.now(), f: {} };
            return c;
        } catch (e) { return { t: Date.now(), f: {} }; }
    }
    function gravarCache(c) { try { localStorage.setItem(CHAVE_CACHE, JSON.stringify(c)); } catch (e) { } }

    function evento(tipo, valor) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'filtro_topo', filtro_tipo: tipo, filtro_valor: valor });
        } catch (e) { }
    }

    function el(tag, cls, txt) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (txt) n.textContent = txt;
        return n;
    }

    // carrossel: marca se ainda há conteúdo antes ou depois, para a sombra da borda
    function embrulhar(linha) {
        var w = el('div', 'nft-wrap');
        w.appendChild(linha);
        function medir() {
            w.classList.toggle('nft-tem-antes', linha.scrollLeft > 4);
            w.classList.toggle('nft-tem-depois', linha.scrollLeft + linha.clientWidth < linha.scrollWidth - 4);
        }
        linha.addEventListener('scroll', medir, { passive: true });
        window.addEventListener('resize', medir);
        setTimeout(medir, 0); setTimeout(medir, 600);
        return w;
    }

    function miniatura(src) { return src.replace(/fit-in\/\d+x\d+/, 'fit-in/200x300'); }

    function montar() {
        var caminho = location.pathname.replace(/\/+$/, '') || '/';
        var paginas = [CFG.inicio.url].concat(CFG.categorias.map(function (c) { return c.url; }), CFG.paginasExtras);
        if (paginas.indexOf(caminho) < 0) return;
        if (document.getElementById('nft')) return;

        var ancora = document.querySelector('.descricao-pesquisa');
        if (!ancora) return;

        // tamanhos vêm do filtro nativo (celular: .tamanho · desktop: .filtro-tamanho)
        var tamanhos = [], vistos = {};
        [].forEach.call(document.querySelectorAll('.filtro-container.tamanho [data-filter-value], .filtro-container.filtro-tamanho [data-filter-value]'), function (n) {
            var id = String(n.getAttribute('data-filter-value'));
            var d = n.querySelector('.filtro-desc');
            if (d && !vistos[id]) { vistos[id] = 1; tamanhos.push({ id: id, nome: d.textContent.trim() }); }
        });
        var idsTamanho = tamanhos.map(function (t) { return t.id; });

        var params = new URLSearchParams(location.search);
        var marcados = (params.get('derivacao') || '').split(',').filter(Boolean);
        var tamanhoAtual = marcados.filter(function (id) { return idsTamanho.indexOf(id) >= 0; })[0] || '';
        var outros = marcados.filter(function (id) { return idsTamanho.indexOf(id) < 0; }); // cores do filtro nativo

        function urlTamanho(id) {
            var p = new URLSearchParams(location.search);
            var lista = outros.slice();
            if (id) lista.push(id);
            if (lista.length) p.set('derivacao', lista.join(',')); else p.delete('derivacao');
            p.delete('pagina'); p.delete('page');
            var q = p.toString();
            return location.pathname + (q ? '?' + q : '');
        }
        function urlCategoria(url) { return url + (tamanhoAtual ? '?derivacao=' + tamanhoAtual : ''); }

        var box = el('div');
        box.id = 'nft';

        // linha 1: categorias
        var linhaCat = el('nav', 'nft-row');
        linhaCat.setAttribute('aria-label', 'Categorias');
        var tudo = el('a', 'nft-cat nft-letra' + (caminho === CFG.inicio.url ? ' nft-on' : ''));
        tudo.href = urlCategoria(CFG.inicio.url);
        var icone = el('span', 'nft-foto');
        icone.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>';
        tudo.appendChild(icone);
        tudo.appendChild(el('span', '', CFG.inicio.nome));
        tudo.addEventListener('click', function () { evento('categoria', CFG.inicio.nome); });
        linhaCat.appendChild(tudo);
        CFG.categorias.forEach(function (c) {
            var a = el('a', 'nft-cat' + (caminho === c.url ? ' nft-on' : ''));
            a.href = urlCategoria(c.url);
            a.setAttribute('data-chave', c.chave);
            a.setAttribute('data-url', c.url);
            a.appendChild(el('span', 'nft-foto'));
            a.appendChild(el('span', '', c.nome));
            a.addEventListener('click', function () { evento('categoria', c.nome); });
            linhaCat.appendChild(a);
        });
        box.appendChild(embrulhar(linhaCat));

        // linha 2: tamanhos
        if (tamanhos.length) {
            var linhaTam = el('div', 'nft-row nft-tam');
            linhaTam.setAttribute('role', 'group');
            linhaTam.setAttribute('aria-label', CFG.tituloTamanho);
            linhaTam.appendChild(el('span', 'nft-lab', CFG.tituloTamanho + ':'));
            tamanhos.forEach(function (t) {
                var ligado = t.id === tamanhoAtual;
                var a = el('a', 'nft-chip' + (ligado ? ' nft-on' : ''), t.nome);
                a.href = urlTamanho(ligado ? '' : t.id);
                a.setAttribute('aria-pressed', ligado ? 'true' : 'false');
                a.addEventListener('click', function () { evento('tamanho', ligado ? 'limpar' : t.nome); });
                linhaTam.appendChild(a);
            });
            if (tamanhoAtual) {
                var limpar = el('a', 'nft-limpar', 'Ver todos');
                limpar.href = urlTamanho('');
                linhaTam.appendChild(limpar);
            }
            box.appendChild(embrulhar(linhaTam));
        }

        var st = el('style');
        st.textContent = CSS;
        box.appendChild(st);
        ancora.parentNode.insertBefore(box, ancora.nextSibling);

        // deixa o número e a categoria escolhidos à vista no celular
        [].forEach.call(box.querySelectorAll('.nft-on'), function (on) {
            try { on.parentNode.scrollLeft = Math.max(0, on.offsetLeft - on.parentNode.offsetLeft - 120); } catch (e) { }
        });

        // fotos: 1) guardadas do dia · 2) peças da própria vitrine · 3) primeira peça da página da categoria
        var cache = lerCache();
        function pintar(a, src) {
            a.querySelector('.nft-foto').style.backgroundImage = 'url("' + miniatura(src) + '")';
            cache.f[a.getAttribute('data-chave')] = src;
            gravarCache(cache);
        }
        function semFoto(a) {
            var foto = a.querySelector('.nft-foto');
            if (foto.style.backgroundImage) return;
            a.classList.add('nft-letra');
            foto.textContent = a.textContent.trim().charAt(0);
        }
        var pendentes = [].slice.call(box.querySelectorAll('.nft-cat[data-chave]'));
        pendentes.forEach(function (a) {
            var salvo = cache.f[a.getAttribute('data-chave')];
            if (salvo) a.querySelector('.nft-foto').style.backgroundImage = 'url("' + miniatura(salvo) + '")';
        });
        var tentativas = 0;
        (function daVitrine() {
            var falta = [];
            pendentes.forEach(function (a) {
                if (a.querySelector('.nft-foto').style.backgroundImage) return;
                var chave = a.getAttribute('data-chave'), img = null;
                [].some.call(document.querySelectorAll('ul.product-list > li'), function (li) {
                    var nome = '';
                    try { nome = decodeURIComponent(li.getAttribute('data-name') || ''); } catch (e) { }
                    if (nome.toUpperCase().indexOf(chave) !== 0) return false;
                    img = li.querySelector('figure img');
                    return !!img;
                });
                var src = img && (img.getAttribute('data-src') || img.currentSrc || img.src);
                if (src) pintar(a, src); else falta.push(a);
            });
            if (falta.length && ++tentativas < 4) { setTimeout(daVitrine, 500); return; }
            falta.forEach(function (a) {
                if (!window.fetch) { semFoto(a); return; }
                fetch(a.getAttribute('data-url'), { credentials: 'same-origin' })
                    .then(function (r) { return r.text(); })
                    .then(function (html) {
                        var m = html.match(/"midia_url":"([^"]+)"/);
                        if (m) pintar(a, m[1].replace(/\\\//g, '/')); else semFoto(a);
                    })
                    .catch(function () { semFoto(a); });
            });
        })();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
    else montar();
})();
