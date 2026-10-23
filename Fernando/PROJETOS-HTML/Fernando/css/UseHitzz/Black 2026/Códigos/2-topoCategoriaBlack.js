(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 2 - TOPO DA CATEGORIA BLACK
     Logo abaixo do título da categoria Black: a oferta do momento,
     o prazo e atalhos de ordenação e de preço (nativos da Uoou).

     MODELOS
     1  Card preto        selo, contador, título e prazo
     2  Número gigante    o número da oferta em destaque à esquerda
     3  Linha fina        sem caixa, só linhas finas: mostra os produtos antes
     4  Contador central  o contador grande no meio do bloco

     IDEIAS (liga/desliga em IDEIAS)
     2   atalhos por faixa de preço
     7   atalhos "Mais vendidos" e "Maior desconto"
     11  atalhos fixos no topo ao rolar a lista (celular)
  ========================================================= */

  if (window.__hzbfCatLoaded) {
    return;
  }

  window.__hzbfCatLoaded = true;

  var MODELO = 1;

  var IDEIAS = {
    faixasDePreco: true,
    ordenacoes: true,
    atalhosFixos: true
  };

  var ID = "hzbf-cat";
  var STYLE_ID = "hzbf-cat-style";

  var SELETOR_TITULO = ".products-filter .taxon-title-text";

  // Páginas da Black: a categoria e as subcategorias (começam com estes caminhos)
  var PAGINAS_BLACK = ["/categorizacao/promo", "/esquenta-black"];

  // Ideia 2: as faixas (em centavos) são as que o filtro da loja já tem
  var FAIXAS = [
    { nome: "Até R$150", valores: ["5000|10000", "10000|15000"] },
    { nome: "R$150 a R$300", valores: ["15000|20000", "20000|30000"] },
    { nome: "R$300 a R$550", valores: ["30000|40000", "40000|55000"] },
    { nome: "Acima de R$550", valores: ["55000|70000"] }
  ];

  // Ideia 7: ordenações que a loja já tem
  var ORDENACOES = [
    { nome: "Mais vendidos", chave: "sorting[bestseller]", valor: "asc" },
    { nome: "Maior desconto", chave: "sorting[discount]", valor: "desc" }
  ];


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    // Trocar pelo link da coleção dos 24 Hitzz do 11.11 quando a cliente criar
    url1111: "/categorizacao/promo?sorting%5Bprice%5D=asc",

    urlIsla: "/isla-chinelo-flat-feminino-marrom",
    imgIsla: "https://adaptive-images.uooucdn.com.br/tr:w-160,h-232,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png",

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
  };

  // {prazo} vira a data de fim por extenso, ex.: "domingo, 08/11, às 23h59".
  // "numero" é o destaque do modelo 2.
  var TEXTOS = {
    month: {
      tag: "Black Hitzz",
      titulo: "Até 70% OFF em botas, flats, tamancos e sandálias",
      sub: "Os maiores descontos aparecem primeiro.",
      numero: { antes: "até", n: "70%", depois: "OFF" }
    },
    app: {
      tag: "Só no app",
      titulo: "No app, tudo isso com mais 20% OFF no Pix",
      sub: "Só até {prazo}.",
      numero: { antes: "no app", n: "+20%", depois: "no Pix" }
    },
    "1111": {
      tag: "11.11",
      titulo: "+ de 24 Hitzz por até R$124",
      sub: "Por 24 horas: até {prazo}.",
      numero: { antes: "24 Hitzz", n: "R$124", depois: "ou menos" }
    },
    isla: {
      tag: "Isla por R$1",
      titulo: "Acima de R$999, a Isla Marrom sai por R$1",
      sub: "Até {prazo}. A sacola mostra quanto falta.",
      numero: { antes: "Isla", n: "R$1", depois: "acima de R$999" }
    },
    black: {
      tag: "Black Friday",
      titulo: "Até 70% OFF + 20% OFF no Pix",
      sub: "Só até {prazo}.",
      numero: { antes: "até", n: "70%", depois: "+20% no Pix" }
    }
  };

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     AGENDA DA BLACK - AUTOMÁTICA (horário de Brasília)

     01/11 a 30/11            Black Hitzz: até 70% OFF na categoria Black
     05/11 22h a 08/11 23h59  Só no app: até 70% OFF + 20% OFF no Pix
     10/11 22h a 12/11 08h    11.11: + de 24 Hitzz por até R$124
     19/11 22h a 22/11 23h59  Isla Marrom por R$1 acima de R$999
     26/11 22h a 29/11 23h59  Black Friday: até 70% OFF + 20% OFF no Pix

     Só para conferir antes da data, na URL:
     ?hzbf=month | app | 1111 | isla | black
     ?hzbf=black:ultimo   força o "último dia"
     ?hzbf=off            volta ao calendário
     ?hzbfm=1 a 4         mostra outro modelo (?hzbfm=off volta ao MODELO daqui)
  ========================================================= */

  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  // Para a Black Friday ir até 30/11, troque por brasilia(2026, 12, 1, 0)
  var FIM_BLACK_FRIDAY = brasilia(2026, 11, 30, 0); // 29/11 23h59

  var AGENDA = [
    { id: "app", inicio: brasilia(2026, 11, 5, 22), fim: brasilia(2026, 11, 9, 0), ultimoHoras: 24 },
    { id: "1111", inicio: brasilia(2026, 11, 10, 22), fim: brasilia(2026, 11, 12, 8), ultimoHoras: 8 },
    { id: "isla", inicio: brasilia(2026, 11, 19, 22), fim: brasilia(2026, 11, 23, 0), ultimoHoras: 24 },
    { id: "black", inicio: brasilia(2026, 11, 26, 22), fim: FIM_BLACK_FRIDAY, ultimoHoras: 24 },
    { id: "month", inicio: brasilia(2026, 11, 1, 0), fim: brasilia(2026, 12, 1, 0), ultimoHoras: 24 }
  ];

  var PREVIEW_KEY = "hzbf-preview";

  function lerPreview() {

    var valor = null;

    try {

      var param = new URLSearchParams(window.location.search).get("hzbf");

      if (param === "off") {
        window.sessionStorage.removeItem(PREVIEW_KEY);
        return null;
      }

      if (param) {
        window.sessionStorage.setItem(PREVIEW_KEY, param);
      }

      valor = window.sessionStorage.getItem(PREVIEW_KEY);

    } catch (erro) { }

    var partes = String(valor || "").split(":");

    for (var i = 0; i < AGENDA.length; i++) {

      if (AGENDA[i].id === partes[0]) {

        var ultimo = partes[1] === "ultimo";

        return {
          id: partes[0],
          ultimo: ultimo,
          // No preview o timer conta um prazo de exemplo, mas o texto usa a data real
          fim: Date.now() + (ultimo ? 5 * 3600000 + 42 * 60000 : 2 * 86400000 + 5 * 3600000),
          fimReal: AGENDA[i].fim
        };
      }
    }

    return null;
  }

  var PREVIEW = lerPreview();

  function lerModelo() {

    var valor = null;

    try {

      var param = new URLSearchParams(window.location.search).get("hzbfm");

      if (param === "off") {
        window.sessionStorage.removeItem("hzbfm");
      } else if (param) {
        window.sessionStorage.setItem("hzbfm", param);
      }

      valor = window.sessionStorage.getItem("hzbfm");

    } catch (erro) { }

    var n = parseInt(valor, 10);

    return n >= 1 && n <= 4 ? n : MODELO;
  }

  var M = lerModelo();

  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();

    for (var i = 0; i < AGENDA.length; i++) {

      var acao = AGENDA[i];

      if (agora >= acao.inicio && agora < acao.fim) {
        return {
          id: acao.id,
          ultimo: acao.fim - agora <= acao.ultimoHoras * 3600000,
          fim: acao.fim,
          fimReal: acao.fim
        };
      }
    }

    return null;
  }


  /* =========================================================
     UTILITÁRIOS
  ========================================================= */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  // "domingo, 08/11, às 23h59" a partir do fim (exclusivo) da ação
  function prazoTexto(fim) {

    var meiaNoite = new Date(fim - 3 * 3600000).getUTCHours() === 0;

    // Fim à meia-noite: mostra o dia anterior às 23h59
    var d = new Date(fim - 3 * 3600000 - (meiaNoite ? 60000 : 0));

    var hora = meiaNoite ? "23h59" : d.getUTCHours() + "h";

    return DIAS[d.getUTCDay()] + ", " + doisDigitos(d.getUTCDate()) + "/" +
      doisDigitos(d.getUTCMonth() + 1) + ", às " + hora;
  }

  function caminho(url) {
    return url.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }

  function paginaBlack() {

    var atual = caminho(window.location.pathname);

    for (var i = 0; i < PAGINAS_BLACK.length; i++) {

      var base = caminho(PAGINAS_BLACK[i]);

      if (atual === base || atual.indexOf(base + "/") === 0) {
        return true;
      }
    }

    return false;
  }

  function temTimer(m) {
    return m.id !== "month" || m.ultimo;
  }

  var DOT = '<span class="hzbf-dot" aria-hidden="true"></span>';
  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.hzbf-cat{box-sizing:border-box;margin:14px 0 18px;padding:18px 20px;border-radius:14px;background:#000;color:#fff;font:inherit;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-cat *{box-sizing:border-box}',
    '.hzbf-cat__top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin-bottom:10px}',
    '.hzbf-cat__tag{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.12);font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-cat--ultimo .hzbf-cat__tag{background:#e5262e}',
    '.hzbf-cat--ultimo .hzbf-dot{background:#fff}',
    '.hzbf-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',

    '.hzbf-cat__clock{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:rgba(255,255,255,.72);font-variant-numeric:tabular-nums}',
    '.hzbf-seg{display:inline-flex;align-items:baseline;gap:2px;padding:5px 6px;border-radius:6px;background:rgba(255,255,255,.12);line-height:1}',
    '.hzbf-seg b{color:#fff;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hzbf-seg i{color:rgba(255,255,255,.6);font-size:9px;font-style:normal;font-weight:700;text-transform:uppercase}',

    '.hzbf-cat__main{display:flex;align-items:center;gap:14px}',
    '.hzbf-cat__isla{flex:0 0 64px;width:64px;height:80px;border-radius:10px;overflow:hidden;background:#efefef}',
    '.hzbf-cat__isla img{display:block;width:100%;height:100%;object-fit:cover}',
    '.hzbf-cat__title{margin:0;color:inherit;font-size:22px;font-weight:700;line-height:1.15;letter-spacing:0;text-transform:none}',
    '.hzbf-cat__sub{margin:6px 0 0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.35}',

    '.hzbf-cat__ctas{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '.hzbf-cat__cta{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 16px;border-radius:999px;background:#fff;color:#000 !important;font-size:12.5px;font-weight:700;text-decoration:none !important;white-space:nowrap}',
    '.hzbf-cat__cta--line{background:transparent;color:#fff !important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}',
    '.hzbf-cat__cta svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    /* Modelo 2 - Número gigante */
    '.hzbf-cat.hzbf-m2{display:grid;grid-template-columns:auto minmax(0,1fr);gap:0 18px;align-items:center}',
    '.hzbf-cat__big{display:grid;justify-items:start;padding-right:18px;border-right:1px solid rgba(255,255,255,.22);line-height:1}',
    '.hzbf-cat__big small{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}',
    '.hzbf-cat__big b{margin:4px 0;font-size:56px;font-weight:900;letter-spacing:-.04em;white-space:nowrap}',
    '.hzbf-m2 .hzbf-cat__title{font-size:18px}',

    /* Modelo 3 - Linha fina */
    '.hzbf-cat.hzbf-m3{background:transparent;color:#111;border-radius:0;border-top:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3;padding:16px 4px;text-align:center}',
    '.hzbf-m3 .hzbf-cat__top{justify-content:center;gap:8px 12px}',
    '.hzbf-m3 .hzbf-cat__tag{background:#000;color:#fff}',
    '.hzbf-m3 .hzbf-cat__clock{color:#555}',
    '.hzbf-m3 .hzbf-cat__clock span{color:#000;font-weight:800}',
    '.hzbf-m3 .hzbf-cat__main{justify-content:center}',
    '.hzbf-m3 .hzbf-cat__title{font-size:19px}',
    '.hzbf-m3 .hzbf-cat__sub{color:#555}',
    '.hzbf-m3 .hzbf-cat__ctas{justify-content:center}',
    '.hzbf-m3 .hzbf-cat__cta{background:#000;color:#fff !important}',
    '.hzbf-m3 .hzbf-cat__cta--line{background:#fff;color:#000 !important;box-shadow:inset 0 0 0 1px #000}',

    /* Modelo 4 - Contador central */
    '.hzbf-cat.hzbf-m4{text-align:center}',
    '.hzbf-m4 .hzbf-cat__top{justify-content:center;margin-bottom:10px}',
    '.hzbf-m4 .hzbf-cat__main{justify-content:center}',
    '.hzbf-cat__bigclock{display:flex;justify-content:center;gap:6px;margin:14px 0 4px}',
    '.hzbf-cat__bigclock .hzbf-seg{flex-direction:column;align-items:center;gap:5px;min-width:58px;padding:10px 6px 8px;border-radius:10px}',
    '.hzbf-cat__bigclock .hzbf-seg b{font-size:28px}',
    '.hzbf-cat__bigclock .hzbf-seg i{font-size:9.5px;letter-spacing:.12em}',
    '.hzbf-m4 .hzbf-cat__ctas{justify-content:center}',

    /* Atalhos: ordenações (ideia 7) e faixas de preço (ideia 2) */
    '.hzbf-precos{display:flex;align-items:center;gap:8px;margin:0 0 18px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px}',
    '.hzbf-precos::-webkit-scrollbar{display:none}',
    '.hzbf-precos a{flex:0 0 auto;display:inline-flex;align-items:center;height:34px;padding:0 14px;border:1px solid #d9d9d9;border-radius:999px;background:#fff;color:#000 !important;font-size:13px;font-weight:500;text-decoration:none !important;white-space:nowrap}',
    '.hzbf-precos a.is-active{background:#000;border-color:#000;color:#fff !important}',
    '.hzbf-precos i{flex:0 0 1px;align-self:stretch;margin:6px 2px;background:#d9d9d9}',

    /* Ideia 11: atalhos fixos ao rolar (só celular) */
    '.hzbf-fixo{position:fixed;left:0;right:0;top:0;z-index:150;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:#fff;border-bottom:1px solid #e3e3e3;box-shadow:0 6px 16px rgba(0,0,0,.08);transform:translateY(-110%);transition:transform .2s}',
    '.hzbf-fixo.is-on{transform:none}',
    '.hzbf-fixo .hzbf-precos{margin:0}',
    '@media (min-width:768px){.hzbf-fixo{display:none}}',

    '@media (max-width:600px){',
    '.hzbf-cat{margin:10px 0 14px;padding:16px;border-radius:12px}',
    '.hzbf-cat__title{font-size:19px}',
    '.hzbf-cat__isla{flex-basis:56px;width:56px;height:70px}',
    '.hzbf-cat.hzbf-m2{gap:0 14px}',
    '.hzbf-cat__big{padding-right:14px}',
    '.hzbf-cat__big b{font-size:42px}',
    '.hzbf-m2 .hzbf-cat__title{font-size:16px}',
    '.hzbf-m2 .hzbf-cat__isla{display:none}',
    '.hzbf-cat.hzbf-m3{padding:14px 2px;border-radius:0}',
    '.hzbf-cat__bigclock .hzbf-seg{min-width:54px}',
    '.hzbf-cat__bigclock .hzbf-seg b{font-size:24px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hzbf-fixo{transition:none}}'
  ].join("");


  /* =========================================================
     HTML
  ========================================================= */

  function appCtas() {

    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/i.test(ua);
    var android = /Android/i.test(ua);

    var html = '';

    if (!android) {
      html += '<a class="hzbf-cat__cta" href="' + esc(CONFIG.appIos) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar na App Store' + SETA + '</a>';
    }

    if (!ios) {
      html += '<a class="hzbf-cat__cta' + (android ? '' : ' hzbf-cat__cta--line') + '" href="' + esc(CONFIG.appAndroid) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar no Google Play' + SETA + '</a>';
    }

    return html;
  }

  function categoriaHTML(m) {

    var t = TEXTOS[m.id];

    var tag = '<span class="hzbf-cat__tag">' + DOT + esc(m.ultimo ? (m.id === "1111" ? "Últimas horas" : "Último dia") : t.tag) + '</span>';

    var timer = temTimer(m) && M !== 4
      ? '<span class="hzbf-cat__clock">Termina em <span data-hzbf-timer></span></span>'
      : '';

    var sub = t.sub.replace("{prazo}", prazoTexto(m.fimReal));

    var isla = m.id === "isla"
      ? '<a class="hzbf-cat__isla" href="' + esc(CONFIG.urlIsla) + '" aria-label="Ver a Isla Marrom"><img src="' + esc(CONFIG.imgIsla) + '" alt="" loading="lazy"></a>'
      : '';

    var ctas = '';

    if (m.id === "app") {
      ctas = appCtas();
    } else if (m.id === "1111") {
      ctas = '<a class="hzbf-cat__cta" href="' + esc(CONFIG.url1111) + '" data-hzbf-cta>Ver os 24 Hitzz' + SETA + '</a>';
    }

    ctas = ctas ? '<div class="hzbf-cat__ctas">' + ctas + '</div>' : '';

    var texto = '<div><p class="hzbf-cat__title">' + esc(t.titulo) + '</p><p class="hzbf-cat__sub">' + esc(sub) + '</p></div>';

    if (M === 2) {
      return '<div class="hzbf-cat__big"><small>' + esc(t.numero.antes) + '</small><b>' + esc(t.numero.n) + '</b><small>' + esc(t.numero.depois) + '</small></div>' +
        '<div><div class="hzbf-cat__top">' + tag + timer + '</div>' +
        '<div class="hzbf-cat__main">' + isla + texto + '</div>' + ctas + '</div>';
    }

    if (M === 4) {
      return '<div class="hzbf-cat__top">' + tag + '</div>' +
        '<div class="hzbf-cat__main">' + isla + texto + '</div>' +
        (temTimer(m) ? '<div class="hzbf-cat__bigclock" data-hzbf-timer></div>' : '') + ctas;
    }

    return '<div class="hzbf-cat__top">' + tag + timer + '</div>' +
      '<div class="hzbf-cat__main">' + isla + texto + '</div>' + ctas;
  }

  // URL com os mesmos filtros e ordenação da página, trocando só o que for pedido
  function montarUrl(trocar) {

    var params = new URLSearchParams(window.location.search);
    var novo = new URLSearchParams();

    params.forEach(function (valor, chave) {

      var ehOrdem = chave.indexOf("sorting") === 0;
      var ehPreco = chave === "filters[][price_sell]";

      if ((ehOrdem && !trocar.ordem) || (ehPreco && !trocar.preco)) {
        novo.append(chave, valor);
      }
    });

    if (trocar.ordem && trocar.ordem.chave) {
      novo.append(trocar.ordem.chave, trocar.ordem.valor);
    }

    if (trocar.preco && trocar.preco.valores) {

      for (var i = 0; i < trocar.preco.valores.length; i++) {
        novo.append("filters[][price_sell]", trocar.preco.valores[i]);
      }
    }

    var qs = novo.toString();

    return window.location.pathname + (qs ? "?" + qs : "");
  }

  function faixaAtiva(faixa) {

    var ativos = new URLSearchParams(window.location.search).getAll("filters[][price_sell]");

    if (ativos.length !== faixa.valores.length) {
      return false;
    }

    for (var i = 0; i < faixa.valores.length; i++) {

      if (ativos.indexOf(faixa.valores[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  function ordemAtiva(ordem) {
    return new URLSearchParams(window.location.search).get(ordem.chave) === ordem.valor;
  }

  function atalhosHTML() {

    var html = '';

    if (IDEIAS.ordenacoes) {

      for (var i = 0; i < ORDENACOES.length; i++) {

        var ativa = ordemAtiva(ORDENACOES[i]);

        // Clicar na ordenação ativa volta à ordem padrão
        var url = montarUrl({ ordem: ativa ? {} : ORDENACOES[i] });

        html += '<a href="' + esc(url) + '" data-hzbf-atalho="ordem"' + (ativa ? ' class="is-active" aria-current="true"' : '') + '>' + esc(ORDENACOES[i].nome) + '</a>';
      }
    }

    if (IDEIAS.faixasDePreco) {

      if (html) {
        html += '<i aria-hidden="true"></i>';
      }

      for (var j = 0; j < FAIXAS.length; j++) {

        var ativaF = faixaAtiva(FAIXAS[j]);

        // Clicar na faixa ativa tira o filtro
        var urlF = montarUrl({ preco: ativaF ? {} : FAIXAS[j] });

        html += '<a href="' + esc(urlF) + '" data-hzbf-atalho="preco"' + (ativaF ? ' class="is-active" aria-current="true"' : '') + '>' + esc(FAIXAS[j].nome) + '</a>';
      }
    }

    return html;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function montarBloco(m) {

    // Desktop: .row-title seguido de .row-filters. Mobile: só a linha do
    // título dentro de .products-filter, com os filtros logo depois.
    var h1 = document.querySelector(SELETOR_TITULO);
    var titulo = h1 && (h1.closest(".row") || h1);

    if (!titulo || !titulo.parentNode) {
      return;
    }

    var bloco = document.getElementById(ID);

    if (!bloco) {

      bloco = document.createElement("section");

      bloco.id = ID;
      bloco.className = "hzbf-cat hzbf-m" + M + " hzbf-cat--" + m.id + (m.ultimo ? " hzbf-cat--ultimo" : "");

      bloco.setAttribute("aria-label", "Black Hitzz");

      bloco.innerHTML = categoriaHTML(m);
    }

    if (bloco.previousElementSibling !== titulo) {
      titulo.parentNode.insertBefore(bloco, titulo.nextSibling);
    }

    var html = atalhosHTML();

    if (!html) {
      return;
    }

    var atalhos = document.getElementById(ID + "-precos");

    if (!atalhos) {

      atalhos = document.createElement("nav");

      atalhos.id = ID + "-precos";
      atalhos.className = "hzbf-precos";

      atalhos.setAttribute("aria-label", "Atalhos da Black");

      atalhos.innerHTML = html;
    }

    if (atalhos.previousElementSibling !== bloco) {
      bloco.parentNode.insertBefore(atalhos, bloco.nextSibling);
    }

    if (IDEIAS.atalhosFixos && !document.getElementById(ID + "-fixo")) {

      var fixo = document.createElement("div");

      fixo.id = ID + "-fixo";
      fixo.className = "hzbf-fixo";

      fixo.setAttribute("aria-hidden", "true");

      fixo.innerHTML = '<nav class="hzbf-precos" aria-label="Atalhos da Black">' + html + '</nav>';

      document.body.appendChild(fixo);

      verificarFixo();
    }
  }


  /* =========================================================
     IDEIA 11 - ATALHOS FIXOS AO ROLAR
  ========================================================= */

  var fixoFrame = null;

  function verificarFixo() {

    var atalhos = document.getElementById(ID + "-precos");
    var fixo = document.getElementById(ID + "-fixo");

    if (!atalhos || !fixo) {
      return;
    }

    // Aparece depois que os atalhos originais saem da tela pelo topo
    var ligado = atalhos.getBoundingClientRect().bottom < 0;

    if (fixo.classList.contains("is-on") !== ligado) {
      fixo.classList.toggle("is-on", ligado);
      fixo.setAttribute("aria-hidden", ligado ? "false" : "true");
    }
  }

  window.addEventListener("scroll", function () {

    if (fixoFrame) {
      return;
    }

    fixoFrame = requestAnimationFrame(function () {
      fixoFrame = null;
      verificarFixo();
    });

  }, { passive: true });


  /* =========================================================
     MONTAGEM
  ========================================================= */

  function adicionarEstilo() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);
  }

  function remover() {

    var antigos = [document.getElementById(ID), document.getElementById(ID + "-precos"), document.getElementById(ID + "-fixo")];

    for (var i = 0; i < antigos.length; i++) {

      if (antigos[i]) {
        antigos[i].remove();
      }
    }
  }

  function montar() {

    var m = paginaBlack() ? momentoDaAcao() : null;

    var chave = m ? m.id + (m.ultimo ? "+ultimo" : "") : null;

    if (chave !== estadoRenderizado) {
      remover();
      estadoRenderizado = chave;
    }

    if (!m) {
      return;
    }

    adicionarEstilo();

    montarBloco(m);

    atualizarTimer(m);
  }


  /* =========================================================
     TIMER
  ========================================================= */

  function atualizarTimer(m) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var restante = Math.max(0, Math.floor((m.fim - Date.now()) / 1000));

    var dias = Math.floor(restante / 86400);
    var h = Math.floor(restante % 86400 / 3600);
    var min = Math.floor(restante % 3600 / 60);
    var s = restante % 60;

    function seg(valor, rotulo) {
      return '<span class="hzbf-seg"><b>' + doisDigitos(valor) + '</b><i>' + rotulo + '</i></span>';
    }

    var html;

    if (M === 3) {
      html = (dias > 0 ? dias + "d " : "") + doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s);
    } else if (M === 4) {
      html = (dias > 0 ? seg(dias, "dias") : "") + seg(h, "horas") + seg(min, "min") + seg(s, "seg");
    } else {
      html = (dias > 0 ? seg(dias, "d") : "") + seg(h, "h") + seg(min, "m") + seg(s, "s");
    }

    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i]._hzbfHtml !== html) {
        timers[i]._hzbfHtml = html;
        timers[i].innerHTML = html;
      }
    }
  }


  /* =========================================================
     EVENTOS DE CLIQUE (para medir no GA / MarketDock)
  ========================================================= */

  document.addEventListener("click", function (event) {

    var alvo = event.target && event.target.closest &&
      event.target.closest("#" + ID + " [data-hzbf-cta], .hzbf-precos [data-hzbf-atalho]");

    if (!alvo) {
      return;
    }

    try {

      var m = momentoDaAcao();
      var atalho = alvo.getAttribute("data-hzbf-atalho");

      (window.dataLayer = window.dataLayer || []).push({
        event: "hzbf_clique",
        hzbf_local: atalho
          ? (alvo.closest("#" + ID + "-fixo") ? "categoria_atalho_fixo_" : "categoria_atalho_") + atalho
          : "categoria",
        hzbf_acao: m ? m.id : "",
        hzbf_modelo: M,
        hzbf_texto: alvo.textContent.trim()
      });

    } catch (erro) { }
  });


  /* =========================================================
     OBSERVER
  ========================================================= */

  function iniciarObserver() {

    if (observer || !window.MutationObserver) {
      return;
    }

    observer = new MutationObserver(function () {

      if (observerFrame) {
        return;
      }

      observerFrame = requestAnimationFrame(function () {

        observerFrame = null;

        montar();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    montar();

    iniciarObserver();

    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
