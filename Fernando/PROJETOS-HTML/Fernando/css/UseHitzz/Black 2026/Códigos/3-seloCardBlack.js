(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 3 - SELOS NOS CARDS
     Em todas as listagens (categoria, busca, vitrines):

     - Ideia 3: o selo "33% OFF" vira o desconto em reais
       ("R$ 170 OFF") quando o par custa mais de R$100
       (regra dos 100, Baymard). Vale no site todo durante a Black.
     - Nos cards da Black: selo da ação na foto e, nas ações de
       20% no Pix, o preço final do Pix embaixo do preço.
     - Ideia 7: "Top 10 da Black" nos 10 primeiros da ordenação
       "Mais vendidos" da própria loja.
     - Ideia 8: "Termina hoje" nos cards no último dia da ação.

     MODELOS (só nos cards da Black)
     1  Fita            fita da ação no canto + selo da loja em reais
     2  Etiqueta        etiqueta pendurada com a ação e o desconto
     3  Faixa no topo   faixa preta de ponta a ponta no topo da foto
     4  Selo redondo    círculo preto com o desconto em reais
  ========================================================= */

  if (window.__hzbfCardLoaded) {
    return;
  }

  window.__hzbfCardLoaded = true;

  var MODELO = 1;

  var IDEIAS = {
    descontoEmReais: true,
    top10: true,
    terminaHoje: true
  };

  var STYLE_ID = "hzbf-card-style";

  var SELETORES = {
    card: ".product",
    foto: ".product-list-image-container",
    selo: ".discount",
    info: ".product-list-info",
    preco: ".price",
    de: ".box-price-of .from-price",
    por: ".box-price-to > .to-price",
    pix: ".cash-payment-container .to-price",
    pixBox: ".cash-payment-container",
    fitaEsquenta: ".hz-eb-tag"
  };

  // Cards são da Black quando estão nestas páginas...
  var PAGINAS_BLACK = ["/categorizacao/promo", "/esquenta-black"];

  // ...ou quando têm esta tag (ex.: "tag-black-2026"). Vazio = só pelas páginas.
  var TAG_BLACK = "";


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    descontoPix: 0.20,   // app (05 a 08/11) e Black Friday (27 a 29/11)
    limite1111: 124,     // 11.11: pares por até R$124 ganham o selo
    reaisAPartirDe: 100, // regra dos 100: acima disso, desconto em R$

    // Ideia 7: a ordenação "Mais vendidos" da categoria Black
    urlMaisVendidos: "/categorizacao/promo?sorting%5Bbestseller%5D=asc&page=1",
    topQuantos: 10,
    topValidadeMin: 30
  };

  var SELOS = {
    month: "Black",
    app: "+20% no app",
    "1111": "11.11",
    isla: "Black",
    black: "Black Friday"
  };

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;

  var TOP = null;      // caminhos dos mais vendidos
  var topVersao = 0;   // muda quando a lista chega, para redesenhar os cards


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
        return { id: partes[0], ultimo: partes[1] === "ultimo", fim: AGENDA[i].fim };
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

  // Devolve { id, ultimo, fim } ou null fora da Black
  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();

    for (var i = 0; i < AGENDA.length; i++) {

      var acao = AGENDA[i];

      if (agora >= acao.inicio && agora < acao.fim) {
        return { id: acao.id, ultimo: acao.fim - agora <= acao.ultimoHoras * 3600000, fim: acao.fim };
      }
    }

    return null;
  }


  /* =========================================================
     UTILITÁRIOS
  ========================================================= */

  function lerPreco(el) {

    if (!el) {
      return NaN;
    }

    var limpo = String(el.textContent || "")
      .replace(/[^0-9,.]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(limpo);
  }

  function formatBRL(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function caminho(url) {
    return url.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }

  function caminhoDoLink(href) {
    try {
      return caminho(new URL(href, window.location.href).pathname);
    } catch (erro) {
      return "";
    }
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

  function cardDaBlack(card, naPaginaBlack) {
    return naPaginaBlack || (TAG_BLACK && card.classList.contains(TAG_BLACK));
  }

  // "às 23h59" ou "às 8h", a partir do fim (exclusivo) da ação
  function horaDoFim(fim) {
    var d = new Date(fim - 3 * 3600000);
    return d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? "23h59" : d.getUTCHours() + "h";
  }

  var CELULAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.hzbf-tem-selo ' + SELETORES.foto + '{position:relative}',
    '.hzbf-tem-selo ' + SELETORES.fitaEsquenta + '{display:none !important}',
    // Mais forte que ".etraction-home-vitrine .promotion .discount" (outro código da loja)
    '.product.hzbf-sem-selo-loja .promotion ' + SELETORES.selo + ',.product.hzbf-sem-selo-loja ' + SELETORES.selo + '{display:none !important}',

    /* Modelo 1 - Fita (também usada no modelo 4) */
    '.hzbf-fita{position:absolute;left:8px;top:8px;z-index:3;display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;background:#000;color:#fff;font-size:10px;font-weight:700;line-height:1.1;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;pointer-events:none}',
    '.hzbf-fita i{display:block;width:5px;height:5px;border-radius:50%;background:#e5262e}',
    '.hzbf-fita--1111{background:#fff;color:#000;box-shadow:inset 0 0 0 1.5px #000}',

    /* Modelo 2 - Etiqueta */
    '.hzbf-etq{position:absolute;right:8px;top:10px;z-index:3;display:grid;justify-items:center;gap:1px;min-width:62px;padding:12px 8px 7px;border-radius:5px;background:#fff;color:#000;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,.18);transform:rotate(4deg);transform-origin:50% 0;pointer-events:none}',
    '.hzbf-etq::before{content:"";position:absolute;top:4px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#efefef;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}',
    '.hzbf-etq small{font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;line-height:1.1}',
    '.hzbf-etq b{font-size:14px;font-weight:900;line-height:1.05;white-space:nowrap}',

    /* Modelo 3 - Faixa no topo */
    '.hzbf-faixa{position:absolute;left:0;right:0;top:0;z-index:3;display:flex;align-items:center;justify-content:center;gap:7px;padding:6px 8px;background:#000;color:#fff;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;pointer-events:none}',
    '.hzbf-faixa i{display:block;width:5px;height:5px;border-radius:50%;background:#e5262e}',
    '.hzbf-faixa--1111{background:#fff;color:#000;box-shadow:inset 0 -1.5px 0 #000}',

    /* Modelo 4 - Selo redondo */
    '.hzbf-redondo{position:absolute;right:8px;top:8px;z-index:3;display:grid;place-content:center;width:58px;height:58px;border-radius:50%;background:#000;color:#fff;text-align:center;line-height:1;pointer-events:none}',
    '.hzbf-redondo small{font-size:9px;font-weight:700;letter-spacing:.06em}',
    '.hzbf-redondo b{font-size:17px;font-weight:900;letter-spacing:-.02em}',

    /* Preço final do Pix / app embaixo do preço */
    '.hzbf-pix{display:flex;align-items:center;flex-wrap:wrap;gap:4px 6px;margin-top:5px;color:#000;font-size:12px;line-height:1.25;text-align:inherit}',
    '.hzbf-pix b{font-size:13.5px;font-weight:800}',
    '.hzbf-pix svg{width:13px;height:13px;flex:0 0 13px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}',
    '.hzbf-chip{display:inline-block;padding:2px 5px;border-radius:4px;background:#000;color:#fff;font-size:9.5px;font-weight:800;letter-spacing:.04em;line-height:1.2;vertical-align:middle}',
    '.hzbf-pixbox-chip{margin-left:5px}',

    /* Ideia 7 - Top 10 */
    '.hzbf-top{display:inline-flex;align-items:center;gap:4px;margin:2px 0 4px;padding:3px 7px;border-radius:4px;background:#f1f1ef;color:#000;font-size:10.5px;font-weight:800;letter-spacing:.02em;line-height:1.2}',

    /* Ideia 8 - Termina hoje */
    '.hzbf-hoje{margin-top:4px;color:#c81e25;font-size:11.5px;font-weight:800;line-height:1.25}'
  ].join("");


  /* =========================================================
     IDEIA 7 - MAIS VENDIDOS DA BLACK
     Lê a 1ª página da categoria Black na ordenação "Mais vendidos"
     (a mesma que a cliente vê no seletor de ordenação) e guarda por
     30 minutos na sessão.
  ========================================================= */

  var TOP_KEY = "hzbf-top10";
  var topBuscando = false;

  function carregarTop() {

    if (!IDEIAS.top10 || TOP || topBuscando) {
      return;
    }

    try {

      var salvo = JSON.parse(window.sessionStorage.getItem(TOP_KEY) || "null");

      if (salvo && Date.now() - salvo.t < CONFIG.topValidadeMin * 60000 && salvo.caminhos) {
        TOP = salvo.caminhos;
        topVersao++;
        return;
      }

    } catch (erro) { }

    if (!window.fetch || !window.DOMParser) {
      return;
    }

    topBuscando = true;

    fetch(CONFIG.urlMaisVendidos, { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (html) {

        var doc = new DOMParser().parseFromString(html, "text/html");
        var cards = doc.querySelectorAll(SELETORES.card + " a[href]");
        var caminhos = [];

        for (var i = 0; i < cards.length && caminhos.length < CONFIG.topQuantos; i++) {

          var c = caminhoDoLink(cards[i].getAttribute("href"));

          if (c && c !== "/" && caminhos.indexOf(c) === -1) {
            caminhos.push(c);
          }
        }

        TOP = caminhos;
        topVersao++;

        try {
          window.sessionStorage.setItem(TOP_KEY, JSON.stringify({ t: Date.now(), caminhos: caminhos }));
        } catch (erro) { }

        montar();
      })
      .catch(function () { })
      .then(function () { topBuscando = false; });
  }

  function ehTop(card) {

    if (!TOP || !TOP.length) {
      return false;
    }

    var link = card.querySelector("a[href]");

    return !!link && TOP.indexOf(caminhoDoLink(link.getAttribute("href"))) !== -1;
  }


  /* =========================================================
     CARD
  ========================================================= */

  function limparCard(card) {

    var meus = card.querySelectorAll(".hzbf-fita, .hzbf-etq, .hzbf-faixa, .hzbf-redondo, .hzbf-pix, .hzbf-pixbox-chip, .hzbf-top, .hzbf-hoje");

    for (var i = 0; i < meus.length; i++) {
      meus[i].remove();
    }

    var selo = card.querySelector(SELETORES.selo);

    if (selo && selo.hasAttribute("data-hzbf-orig")) {
      selo.textContent = selo.getAttribute("data-hzbf-orig");
      selo.removeAttribute("data-hzbf-orig");
      selo.removeAttribute("title");
    }

    card.classList.remove("hzbf-tem-selo", "hzbf-sem-selo-loja");
    card.removeAttribute("data-hzbf");
  }

  // Ideia 3: "33% OFF" -> "R$ 170 OFF"
  function seloEmReais(card, economia) {

    var selo = card.querySelector(SELETORES.selo);

    if (!selo || !economia) {
      return;
    }

    if (!selo.hasAttribute("data-hzbf-orig")) {
      selo.setAttribute("data-hzbf-orig", selo.textContent);
      selo.setAttribute("title", selo.textContent.trim());
    }

    var texto = "R$ " + economia + " OFF";

    if (selo.textContent !== texto) {
      selo.textContent = texto;
    }
  }

  // Selo da ação na foto, conforme o modelo
  function seloDaFoto(foto, card, acao, economia) {

    var nome = SELOS[acao];
    var el = document.createElement("span");

    if (M === 2) {

      el.className = "hzbf-etq";
      el.innerHTML = '<small>' + nome + '</small>' + (economia ? '<b>R$ ' + economia + ' OFF</b>' : '');

      card.classList.add("hzbf-sem-selo-loja");

    } else if (M === 3) {

      el.className = "hzbf-faixa hzbf-faixa--" + acao;
      el.innerHTML = '<i aria-hidden="true"></i>' + nome + (economia ? ' · R$ ' + economia + ' OFF' : '');

      card.classList.add("hzbf-sem-selo-loja");

    } else {

      el.className = "hzbf-fita hzbf-fita--" + acao;
      el.innerHTML = '<i aria-hidden="true"></i>' + nome;

      if (M === 4 && economia) {

        var redondo = document.createElement("span");

        redondo.className = "hzbf-redondo";
        redondo.innerHTML = '<small>R$</small><b>' + economia + '</b><small>OFF</small>';

        foto.appendChild(redondo);

        card.classList.add("hzbf-sem-selo-loja");
      }
    }

    foto.appendChild(el);

    card.classList.add("hzbf-tem-selo");
  }

  function processarCard(card, m, chave, naPaginaBlack) {

    if (card.getAttribute("data-hzbf") === chave) {
      return;
    }

    limparCard(card);

    card.setAttribute("data-hzbf", chave);

    var acao = m.id;
    var precoBox = card.querySelector(SELETORES.preco);
    var de = lerPreco(card.querySelector(SELETORES.de));
    var por = lerPreco(card.querySelector(SELETORES.por));

    if (!precoBox || !(por > 0)) {
      return;
    }

    var economia = IDEIAS.descontoEmReais && de > por && por >= CONFIG.reaisAPartirDe
      ? Math.round(de - por)
      : 0;

    if (economia < 1) {
      economia = 0;
    }

    seloEmReais(card, economia);

    // Ideia 7: vale em qualquer listagem, porque a lista é da categoria Black
    if (IDEIAS.top10 && ehTop(card)) {

      var top = document.createElement("div");

      top.className = "hzbf-top";
      top.textContent = "★ Top 10 da Black";

      precoBox.parentNode.insertBefore(top, precoBox);
    }

    if (!cardDaBlack(card, naPaginaBlack)) {
      return;
    }

    // Selo na foto. No 11.11 só nos pares por até R$124.
    var foto = card.querySelector(SELETORES.foto);

    if (foto && (acao !== "1111" || por <= CONFIG.limite1111)) {
      seloDaFoto(foto, card, acao, economia);
    }

    // Ideia 8: último dia da ação
    if (IDEIAS.terminaHoje && m.ultimo && (acao !== "1111" || por <= CONFIG.limite1111)) {

      var hoje = document.createElement("div");

      hoje.className = "hzbf-hoje";
      hoje.textContent = "Termina hoje às " + horaDoFim(m.fim);

      precoBox.appendChild(hoje);
    }

    if (acao !== "app" && acao !== "black") {
      return;
    }

    var final = Math.round(por * (1 - CONFIG.descontoPix) * 100) / 100;

    if (acao === "black") {

      // Se a loja já mostra o Pix com 20%, só marca o selo; não repete o preço
      var pixNativo = lerPreco(card.querySelector(SELETORES.pix));
      var pixBox = card.querySelector(SELETORES.pixBox);

      if (pixNativo > 0 && pixNativo <= final + 0.01 && pixBox) {

        var chip = document.createElement("span");

        chip.className = "hzbf-chip hzbf-pixbox-chip";
        chip.textContent = "20% OFF";

        pixBox.appendChild(chip);

        return;
      }
    }

    var linha = document.createElement("div");

    linha.className = "hzbf-pix";

    linha.innerHTML = acao === "app"
      ? CELULAR + '<span>No app: <b>' + formatBRL(final) + '</b> no Pix</span>'
      : '<span><b>' + formatBRL(final) + '</b> no Pix</span><span class="hzbf-chip">20% OFF</span>';

    var hojeEl = precoBox.querySelector(".hzbf-hoje");

    precoBox.insertBefore(linha, hojeEl);
  }


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

  function montar() {

    var m = momentoDaAcao();
    var estado = m ? m.id + (m.ultimo ? "+ultimo" : "") : null;
    var cards = document.querySelectorAll(SELETORES.card);

    if (estado !== estadoRenderizado) {

      for (var i = 0; i < cards.length; i++) {
        limparCard(cards[i]);
      }

      estadoRenderizado = estado;
    }

    if (!m) {
      return;
    }

    adicionarEstilo();

    carregarTop();

    var chave = estado + "|m" + M + "|t" + topVersao;
    var naPaginaBlack = paginaBlack();

    for (var j = 0; j < cards.length; j++) {
      processarCard(cards[j], m, chave, naPaginaBlack);
    }
  }


  /* =========================================================
     OBSERVER
     Cards novos (paginação, carregar mais, vitrines em carrossel)
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

    // Troca de ação sem recarregar a página
    setInterval(montar, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
