(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 3 - SELOS NOS CARDS
     Em todas as listagens (categoria, busca, vitrines). Nos cards da
     Black, cada ação tem o seu conceito, o mesmo dos outros códigos:

     Black Hitzz   fita "BLACK HITZZ" atravessando o canto da foto
     Só no app     bolinha vermelha de notificação + preço do app
     11.11         etiqueta de embarque "Nº 07/24" nos pares de até R$124
     Isla por R$1  "Leve a Isla R$ 249,90 R$1" embaixo do nome
     Black Friday  cotação: "▼ 46%" na foto e a queda em reais

     IDEIAS (liga/desliga em IDEIAS)
     3   o selo "33% OFF" da loja vira o desconto em reais ("R$ 170 OFF")
         quando o par custa mais de R$100 (regra dos 100, Baymard)
     7   "Top 10 da Black" nos 10 primeiros da ordenação "Mais vendidos"
     8   "Termina hoje" nos cards no último dia da ação

     As classes deste código começam com "hzbfk-" para não trombar
     com as dos outros códigos da Black, que rodam na mesma página.
  ========================================================= */

  if (window.__hzbfCardLoaded) {
    return;
  }

  window.__hzbfCardLoaded = true;

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
    preco: ".price",
    de: ".box-price-of .from-price",
    por: ".box-price-to > .to-price",
    pix: ".cash-payment-container .to-price",
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
    limite1111: 124,     // 11.11: pares por até R$124 ganham a etiqueta
    reaisAPartirDe: 100, // regra dos 100: acima disso, desconto em R$
    urlIsla: "/isla-chinelo-flat-feminino-marrom",

    // Ideia 7: a ordenação "Mais vendidos" da categoria Black
    urlMaisVendidos: "/categorizacao/promo?sorting%5Bbestseller%5D=asc&page=1",
    topQuantos: 10,
    topValidadeMin: 30
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

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
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

  function ehAIsla(card) {
    var link = card.querySelector("a[href]");
    return !!link && caminhoDoLink(link.getAttribute("href")) === caminho(CONFIG.urlIsla);
  }

  // "às 23h59" ou "às 8h", a partir do fim (exclusivo) da ação
  function horaDoFim(fim) {
    var d = new Date(fim - 3 * 3600000);
    return d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? "23h59" : d.getUTCHours() + "h";
  }

  function criar(tag, classe, html) {

    var el = document.createElement(tag);

    el.className = classe;
    el.innerHTML = html;

    return el;
  }

  var CELULAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace';

  var CSS = [
    '.hzbfk-tem-selo ' + SELETORES.foto + '{position:relative;overflow:hidden}',
    '.hzbfk-tem-selo ' + SELETORES.fitaEsquenta + '{display:none !important}',
    // Mais forte que ".etraction-home-vitrine .promotion .discount" (outro código da loja)
    '.product.hzbfk-sem-selo-loja .promotion ' + SELETORES.selo + ',.product.hzbfk-sem-selo-loja ' + SELETORES.selo + '{display:none !important}',

    /* Black Hitzz - fita da caixa Black no canto da foto */
    '.hzbfk-fita{position:absolute;left:-34px;top:16px;z-index:3;width:140px;padding:5px 0;background:#000;color:#fff;font-size:9px;font-weight:900;line-height:1;letter-spacing:.16em;text-align:center;text-transform:uppercase;transform:rotate(-45deg);border-top:1.5px dashed rgba(255,255,255,.7);border-bottom:1.5px dashed rgba(255,255,255,.7);pointer-events:none}',

    /* Só no app - notificação */
    '.hzbfk-bolha{position:absolute;right:8px;top:8px;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;width:40px;height:40px;border:2px solid #fff;border-radius:50%;background:#e5262e;color:#fff;font-size:10px;font-weight:800;line-height:1.05;text-align:center;pointer-events:none}',
    '.hzbfk-app{display:inline-flex;align-items:center;gap:5px;margin-top:5px;padding:4px 9px 4px 7px;border-radius:999px;background:#000;color:#fff;font-size:11px;line-height:1.2}',
    '.hzbfk-app b{font-weight:800}',
    '.hzbfk-app svg{width:12px;height:12px;flex:0 0 12px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}',

    /* 11.11 - etiqueta de embarque */
    '.hzbfk-embarque{position:absolute;left:8px;top:8px;z-index:3;display:flex;overflow:hidden;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.18);' + MONO + ';font-size:10px;font-weight:700;line-height:1;pointer-events:none}',
    '.hzbfk-embarque span{padding:5px 6px;background:#fff;color:#000}',
    '.hzbfk-embarque span+span{background:#000;color:#fff;border-left:1.5px dashed #fff}',

    /* Isla - preço riscado e o R$1 */
    '.hzbfk-isla{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 6px;margin:4px 0 6px;padding:5px 8px;background:#000;color:#fff;font-size:11px;font-weight:700;line-height:1.2}',
    '.hzbfk-isla s{color:#9a9a9a;font-weight:500}',
    '.hzbfk-isla b{color:#ff4b52;font-size:14px;font-weight:900}',
    '.hzbfk-isla span{color:#ddd;font-weight:500}',

    /* Black Friday - cotação */
    '.hzbfk-cotacao{position:absolute;left:8px;top:8px;z-index:3;display:inline-flex;align-items:center;gap:4px;padding:5px 9px;border-radius:999px;background:#000;color:#fff;' + MONO + ';font-size:11px;font-weight:700;line-height:1;pointer-events:none}',
    '.hzbfk-cotacao b{color:#ff4b52}',
    '.hzbfk-queda{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px;margin-top:5px;color:#000;font-size:12px;line-height:1.25}',
    '.hzbfk-queda b{font-size:13.5px;font-weight:800}',
    '.hzbfk-queda em{color:#e5262e;' + MONO + ';font-size:11px;font-style:normal;font-weight:700}',

    /* Ideia 7 - Top 10 */
    '.hzbfk-top{display:inline-flex;align-items:center;gap:4px;margin:2px 0 4px;padding:3px 7px;border-radius:4px;background:#f1f1ef;color:#000;font-size:10.5px;font-weight:800;letter-spacing:.02em;line-height:1.2}',

    /* Ideia 8 - Termina hoje */
    '.hzbfk-hoje{margin-top:4px;color:#c81e25;font-size:11.5px;font-weight:800;line-height:1.25}'
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

    var meus = card.querySelectorAll('[class^="hzbfk-"],[class*=" hzbfk-"]');

    for (var i = 0; i < meus.length; i++) {
      meus[i].remove();
    }

    var selo = card.querySelector(SELETORES.selo);

    if (selo && selo.hasAttribute("data-hzbf-orig")) {
      selo.textContent = selo.getAttribute("data-hzbf-orig");
      selo.removeAttribute("data-hzbf-orig");
      selo.removeAttribute("title");
    }

    card.classList.remove("hzbfk-tem-selo", "hzbfk-sem-selo-loja");
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

  // Coloca o conceito da ação no card. "n" é a posição do card entre os do 11.11.
  function conceito(card, m, p, n) {

    var foto = card.querySelector(SELETORES.foto);
    var precoBox = card.querySelector(SELETORES.preco);
    var final = Math.round(p.por * (1 - CONFIG.descontoPix) * 100) / 100;

    function naFoto(el) {
      if (foto) {
        foto.appendChild(el);
        card.classList.add("hzbfk-tem-selo");
      }
    }

    if (m.id === "month") {
      naFoto(criar("span", "hzbfk-fita", "Black Hitzz"));
      return;
    }

    if (m.id === "app") {
      naFoto(criar("span", "hzbfk-bolha", "−20%<br>app"));
      // Quanto ela economiza a mais no app, em cima do Pix que o site já mostra
      var pixSite = lerPreco(card.querySelector(SELETORES.pix));
      var aMais = (pixSite > 0 ? pixSite : p.por) - final;

      if (aMais > 0) {
        precoBox.appendChild(criar("div", "hzbfk-app", CELULAR + '<span>No app: <b>−' + formatBRL(aMais) + '</b> a mais</span>'));
      }
      return;
    }

    if (m.id === "1111") {

      if (p.por <= CONFIG.limite1111 && n <= 24) {
        naFoto(criar("span", "hzbfk-embarque", '<span>Nº ' + doisDigitos(n) + '/24</span><span>11.11</span>'));
      }

      return;
    }

    if (m.id === "isla") {

      precoBox.parentNode.insertBefore(criar("div", "hzbfk-isla", ehAIsla(card)
        ? '<s>R$ 249,90</s><b>R$1</b><span>acima de R$999</span>'
        : '<span>Leve a Isla</span><s>R$ 249,90</s><b>R$1</b>'), precoBox);

      return;
    }

    // Black Friday: a queda do preço cheio até o Pix com 20%
    var de = p.de > p.por ? p.de : p.por;
    var queda = Math.round((1 - final / de) * 100);

    if (queda > 0) {
      naFoto(criar("span", "hzbfk-cotacao", '<b>▼</b> ' + queda + '%'));
      card.classList.add("hzbfk-sem-selo-loja");
    }

    // Se a loja já mostra o Pix com os 20%, não repete o preço: fica só a queda
    var pixNativo = lerPreco(card.querySelector(SELETORES.pix));
    var jaMostra = pixNativo > 0 && pixNativo <= final + 0.01;

    precoBox.appendChild(criar("div", "hzbfk-queda",
      (jaMostra ? '' : '<span><b>' + formatBRL(final) + '</b> no Pix</span>') + '<em>▼ ' + formatBRL(de - final) + ' hoje</em>'));
  }

  function processarCard(card, m, chave, naPaginaBlack, n) {

    if (card.getAttribute("data-hzbf") === chave) {
      return;
    }

    limparCard(card);

    card.setAttribute("data-hzbf", chave);

    var precoBox = card.querySelector(SELETORES.preco);
    var p = {
      de: lerPreco(card.querySelector(SELETORES.de)),
      por: lerPreco(card.querySelector(SELETORES.por))
    };

    if (!precoBox || !(p.por > 0)) {
      return;
    }

    var economia = IDEIAS.descontoEmReais && p.de > p.por && p.por >= CONFIG.reaisAPartirDe
      ? Math.round(p.de - p.por)
      : 0;

    seloEmReais(card, economia >= 1 ? economia : 0);

    // Ideia 7: vale em qualquer listagem, porque a lista é da categoria Black
    if (IDEIAS.top10 && ehTop(card)) {
      precoBox.parentNode.insertBefore(criar("div", "hzbfk-top", "★ Top 10 da Black"), precoBox);
    }

    if (!cardDaBlack(card, naPaginaBlack)) {
      return;
    }

    conceito(card, m, p, n);

    // Ideia 8: último dia da ação (no 11.11, só nos pares de até R$124)
    if (IDEIAS.terminaHoje && m.ultimo && (m.id !== "1111" || p.por <= CONFIG.limite1111)) {
      precoBox.appendChild(criar("div", "hzbfk-hoje", "Termina hoje às " + horaDoFim(m.fim)));
    }
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

    var chave = estado + "|t" + topVersao;
    var naPaginaBlack = paginaBlack();

    // 11.11: numera só os pares de até R$124, na ordem da página
    var n = 0;

    for (var j = 0; j < cards.length; j++) {

      if (m.id === "1111" && lerPreco(cards[j].querySelector(SELETORES.por)) <= CONFIG.limite1111) {
        n++;
      }

      processarCard(cards[j], m, chave + "|n" + n, naPaginaBlack, n);
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
