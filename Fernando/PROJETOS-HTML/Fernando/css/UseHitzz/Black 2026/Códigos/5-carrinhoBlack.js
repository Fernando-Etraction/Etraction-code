(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 5 - CARRINHO E MINICARRINHO
     - Isla por R$1: a Isla aparece "reservada" com a barra até
       R$999 e libera quando a sacola passa do valor.
     - Ideia 5: quanto a cliente economiza nesta sacola e até
       quando esse preço vale (números do próprio carrinho).
     - Ideia 6: aviso no campo de cupom de que a Black não precisa
       de cupom.
     - Ideia 12: na Isla, pares da Black que fecham os R$999.
     - Minicarrinho: uma linha com o prazo ou o quanto falta.

     MODELOS (bloco do carrinho)
     1  Bloco preto      selo, contador e a economia em destaque
     2  Recibo           a conta aberta, linha a linha
     3  Faixa fina       uma linha só, ocupa pouco espaço
     4  Destaque verde   fundo branco e o valor no verde de preço da loja
  ========================================================= */

  if (window.__hzbfCartLoaded) {
    return;
  }

  window.__hzbfCartLoaded = true;

  var MODELO = 1;

  var IDEIAS = {
    semCupom: true,
    paresQueFecham: true
  };

  var ID = "hzbf-cart";
  var ID_MINI = "hzbf-mini";
  var ID_CUPOM = "hzbf-cupom";
  var STYLE_ID = "hzbf-cart-style";

  var SELETORES = {
    carrinho: "#cartContainer",
    topo: ".rowCartPostalCode",
    linha: "tr.CartProduct",
    precoDe: ".unitPrice .old-price",
    precoPor: ".unitPrice .best-price",
    quantidade: "input.cartItemOriginal",
    subtotal: "#cartContainer .cartSubtotal .itemTotalPrice",
    totalPix: "#cartContainer .cart-cash-payment .cash-price",
    cupomTexto: "#cartContainer .rowCartPromotionCodes .promotionCodeMessage",

    mini: ".minicart-modal__content",
    miniTopo: ".minicart-modal__header",
    miniItem: ".minicart-modal__item",
    barraFrete: "#hz-free-shipping-bar",

    cardLista: ".product[data-sku]"
  };

  // Aviso do app no carrinho do site (05 a 08/11). Deixe false se o
  // carrinho do site não aparecer no app com a mesma conta.
  var MOSTRAR_APP_NO_CARRINHO = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    descontoPix: 0.20,
    minimoIsla: 999,
    precoIsla: 249.90,
    urlIsla: "/isla-chinelo-flat-feminino-marrom",
    imgIsla: "https://adaptive-images.uooucdn.com.br/tr:w-120,h-174,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png",

    // Ideia 12: categoria Black do menor para o maior preço (até 3 páginas)
    urlPares: "/categorizacao/promo?sorting%5Bprice%5D=asc&page=",
    paginasPares: 3,

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
  };

  var TAGS = {
    month: "Black Hitzz",
    app: "Só no app",
    "1111": "11.11",
    isla: "Isla por R$1",
    black: "Black Friday"
  };

  // Ideia 6: texto acima do campo de cupom em cada ação ("" desliga na ação)
  var TEXTO_CUPOM = {
    month: "O desconto já está no preço.",
    app: "O desconto já está no preço. Os 20% no Pix são só no app.",
    "1111": "O preço do 11.11 já está aplicado.",
    isla: "O desconto já está no preço.",
    black: "O desconto já está no preço e os 20% do Pix entram no pagamento."
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

  function lerValor(texto) {

    var limpo = String(texto || "")
      .replace(/[^0-9,.]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(limpo);
  }

  function lerPreco(el) {
    return el ? lerValor(el.textContent) : NaN;
  }

  function formatBRL(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function definirHTML(el, html) {

    if (el && el._hzbfHtml !== html) {
      el._hzbfHtml = html;
      el.innerHTML = html;
    }
  }

  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  function prazoTexto(fim, curto) {

    var meiaNoite = new Date(fim - 3 * 3600000).getUTCHours() === 0;
    var d = new Date(fim - 3 * 3600000 - (meiaNoite ? 60000 : 0));
    var hora = meiaNoite ? "23h59" : d.getUTCHours() + "h";
    var dia = DIAS[d.getUTCDay()];

    return (curto ? dia.slice(0, 3) : dia) + ", " + doisDigitos(d.getUTCDate()) + "/" +
      doisDigitos(d.getUTCMonth() + 1) + (curto ? ", " : ", às ") + hora;
  }

  function relogio(fim, formato) {

    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    var dias = Math.floor(restante / 86400);
    var h = Math.floor(restante % 86400 / 3600);
    var min = Math.floor(restante % 3600 / 60);
    var s = restante % 60;

    if (formato === "curto") {
      return dias > 0
        ? dias + "d " + doisDigitos(h) + "h" + doisDigitos(min)
        : doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s);
    }

    if (formato === "texto") {
      return (dias > 0 ? dias + "d " : "") + doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s);
    }

    function seg(valor, rotulo) {
      return '<span class="hzbf-seg"><b>' + doisDigitos(valor) + '</b><i>' + rotulo + '</i></span>';
    }

    return (dias > 0 ? seg(dias, "d") : "") + seg(h, "h") + seg(min, "m") + seg(s, "s");
  }

  function linkDoApp() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ? CONFIG.appIos : CONFIG.appAndroid;
  }

  function caminho(url) {
    try {
      return new URL(url, window.location.href).pathname.replace(/\/+$/, "") || "/";
    } catch (erro) {
      return "";
    }
  }

  function ehLinkDaIsla(href) {
    return String(href || "").indexOf(CONFIG.urlIsla) !== -1;
  }

  var DOT = '<span class="hzbf-dot" aria-hidden="true"></span>';
  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';


  /* =========================================================
     LEITURA DO CARRINHO
  ========================================================= */

  // Página /cart/: tudo vem da tabela que a loja já mostra
  function lerCarrinho() {

    var carrinho = document.querySelector(SELETORES.carrinho);

    if (!carrinho) {
      return null;
    }

    var linhas = carrinho.querySelectorAll(SELETORES.linha);
    var economiaDe = 0;
    var cheio = 0;
    var valorIsla = 0;
    var temIsla = false;
    var caminhos = [];

    for (var i = 0; i < linhas.length; i++) {

      var por = lerPreco(linhas[i].querySelector(SELETORES.precoPor));

      if (!(por > 0)) {
        continue;
      }

      var de = lerPreco(linhas[i].querySelector(SELETORES.precoDe));
      var campo = linhas[i].querySelector(SELETORES.quantidade);
      var qtd = campo ? parseInt(campo.value, 10) || 1 : 1;
      var link = linhas[i].querySelector("a[href]");

      if (link) {
        caminhos.push(caminho(link.getAttribute("href")));
      }

      if (link && ehLinkDaIsla(link.getAttribute("href"))) {
        temIsla = true;
        valorIsla += por * qtd;
        continue;
      }

      cheio += (de > por ? de : por) * qtd;

      if (de > por) {
        economiaDe += (de - por) * qtd;
      }
    }

    var subtotal = lerPreco(document.querySelector(SELETORES.subtotal));
    var pix = lerPreco(document.querySelector(SELETORES.totalPix));

    if (!(subtotal > 0)) {
      return null;
    }

    return {
      subtotal: subtotal,
      cheio: cheio + valorIsla,
      pix: pix > 0 && pix < subtotal ? pix : subtotal,
      // A Isla não conta para chegar nos R$999
      valorParaIsla: subtotal - valorIsla,
      temIsla: temIsla,
      caminhos: caminhos,
      economiaDe: economiaDe,
      economiaPix: pix > 0 && pix < subtotal ? subtotal - pix : 0
    };
  }

  // Minicarrinho: valor pela API do tema, Isla pelo link do item
  function lerMini() {

    var subtotal = 0;

    try {
      var centavos = window.Uoou && window.Uoou.cart && window.Uoou.cart.getSubTotal();
      subtotal = centavos > 0 ? centavos / 100 : 0;
    } catch (erro) { }

    var valorIsla = 0;
    var temIsla = false;
    var itens = document.querySelectorAll(SELETORES.miniItem);

    for (var i = 0; i < itens.length; i++) {

      var link = itens[i].querySelector("a[href]");

      if (!link || !ehLinkDaIsla(link.getAttribute("href"))) {
        continue;
      }

      // O último valor do item é o preço pago
      var valores = itens[i].textContent.match(/R\$\s?[\d.]+,\d{2}/g);

      temIsla = true;
      valorIsla += valores ? lerValor(valores[valores.length - 1]) : 0;
    }

    return {
      subtotal: subtotal,
      valorParaIsla: subtotal - valorIsla,
      temIsla: temIsla
    };
  }


  /* =========================================================
     IDEIA 12 - PARES QUE FECHAM OS R$999
     Lê a categoria Black do menor para o maior preço e guarda por
     20 minutos na sessão. Mostra os 3 pares mais baratos que cobrem
     o que falta.
  ========================================================= */

  var PARES_KEY = "hzbf-pares";
  var PARES = null;
  var paresBuscando = false;

  function primeiraImagem(card) {

    var img = card.querySelector("img.primaryImage") || card.querySelector("img");

    if (!img) {
      return "";
    }

    var set = img.getAttribute("data-srcset") || img.getAttribute("srcset") || "";
    var primeira = set.split(/\s+\d+w,?\s*/)[0];

    if (/^https?:\/\//.test(primeira)) {
      return primeira;
    }

    var src = img.getAttribute("data-src") || img.getAttribute("src") || "";

    return /^data:/.test(src) ? "" : src;
  }

  function carregarPares() {

    if (PARES || paresBuscando || !window.fetch || !window.DOMParser) {
      return;
    }

    try {

      var salvo = JSON.parse(window.sessionStorage.getItem(PARES_KEY) || "null");

      if (salvo && Date.now() - salvo.t < 20 * 60000 && salvo.itens) {
        PARES = salvo.itens;
        return;
      }

    } catch (erro) { }

    paresBuscando = true;

    var paginas = [];

    for (var p = 1; p <= CONFIG.paginasPares; p++) {
      paginas.push(
        fetch(CONFIG.urlPares + p, { credentials: "same-origin" })
          .then(function (r) { return r.ok ? r.text() : ""; })
          .catch(function () { return ""; })
      );
    }

    Promise.all(paginas).then(function (htmls) {

      var itens = [];
      var vistos = {};

      for (var i = 0; i < htmls.length; i++) {

        var doc = new DOMParser().parseFromString(htmls[i], "text/html");
        var cards = doc.querySelectorAll(SELETORES.cardLista);

        for (var j = 0; j < cards.length; j++) {

          var link = cards[j].querySelector("a[href]");
          var nome = cards[j].querySelector(".product-list-name");
          var por = lerPreco(cards[j].querySelector(".box-price-to > .to-price"));

          if (!link || !(por > 0)) {
            continue;
          }

          var url = caminho(link.getAttribute("href"));
          var texto = nome ? nome.textContent.trim() : "";

          // Um por modelo: "FLORA - RASTEIRA..." e "BOTA ... - NARI" viram FLORA e NARI
          var partes = texto.split(" - ");
          var modelo = partes[0].indexOf(" ") === -1 ? partes[0] : partes[partes.length - 1];

          if (vistos[url] || vistos[modelo] || ehLinkDaIsla(url)) {
            continue;
          }

          vistos[url] = true;
          vistos[modelo] = true;

          itens.push({
            url: url,
            nome: texto,
            por: por,
            img: primeiraImagem(cards[j])
          });
        }
      }

      itens.sort(function (a, b) { return a.por - b.por; });

      PARES = itens;

      try {
        window.sessionStorage.setItem(PARES_KEY, JSON.stringify({ t: Date.now(), itens: itens }));
      } catch (erro) { }

      paresBuscando = false;

      montar();
    });
  }

  function escolherPares(falta, noCarrinho) {

    if (!PARES || !PARES.length) {
      return [];
    }

    var livres = PARES.filter(function (x) {
      return noCarrinho.indexOf(x.url) === -1;
    });

    var cobrem = livres.filter(function (x) {
      return x.por >= falta;
    });

    // Ninguém cobre sozinho: mostra os 3 mais caros
    return (cobrem.length ? cobrem.slice(0, 3) : livres.slice(-3).reverse());
  }

  function paresHTML(c) {

    var falta = CONFIG.minimoIsla - c.valorParaIsla;

    if (!IDEIAS.paresQueFecham || falta <= 0) {
      return "";
    }

    carregarPares();

    var pares = escolherPares(falta, c.caminhos);

    if (!pares.length) {
      return "";
    }

    var html = '';

    for (var i = 0; i < pares.length; i++) {
      html += '<a class="hzbf-par" href="' + esc(pares[i].url) + '" data-hzbf-cta>' +
        (pares[i].img ? '<img src="' + esc(pares[i].img) + '" alt="" loading="lazy">' : '<span class="hzbf-par__img"></span>') +
        '<span class="hzbf-par__nome">' + esc(pares[i].nome) + '</span><b>' + formatBRL(pares[i].por) + '</b></a>';
    }

    return '<div class="hzbf-pares"><p>Da Black, completam os R$999:</p><div class="hzbf-pares__g">' + html + '</div></div>';
  }


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.hzbf-cart{box-sizing:border-box;margin:0 0 16px;padding:16px;border-radius:12px;background:#000;color:#fff;font:inherit;font-size:13px;line-height:1.35;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-cart *{box-sizing:border-box}',
    '.hzbf-cart__top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;margin-bottom:10px}',
    '.hzbf-cart__tag{display:inline-flex;align-items:center;gap:7px;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.12);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-cart--ultimo .hzbf-cart__tag{background:#e5262e;color:#fff}',
    '.hzbf-cart--ultimo .hzbf-dot{background:#fff}',
    '.hzbf-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',
    '.hzbf-cart__clock{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:rgba(255,255,255,.72);font-variant-numeric:tabular-nums}',
    '.hzbf-seg{display:inline-flex;align-items:baseline;gap:2px;padding:4px 5px;border-radius:5px;background:rgba(255,255,255,.12);line-height:1}',
    '.hzbf-seg b{color:#fff;font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hzbf-seg i{color:rgba(255,255,255,.6);font-size:8.5px;font-style:normal;font-weight:700;text-transform:uppercase}',

    '.hzbf-cart__big{margin:0;color:inherit;font-size:16px;line-height:1.3}',
    '.hzbf-cart__big strong{font-size:22px;font-weight:800;white-space:nowrap}',
    '.hzbf-cart__note{margin:5px 0 0;color:rgba(255,255,255,.7);font-size:12px}',
    '.hzbf-cart__cta{display:inline-flex;align-items:center;gap:6px;height:34px;margin-top:12px;padding:0 14px;border-radius:999px;background:#fff;color:#000 !important;font-size:12px;font-weight:700;text-decoration:none !important;white-space:nowrap}',
    '.hzbf-cart__cta svg,.hzbf-mini svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    /* Isla reservada */
    '.hzbf-isla{display:grid;grid-template-columns:56px minmax(0,1fr);gap:12px;align-items:center}',
    '.hzbf-isla__foto{position:relative;width:56px;height:72px;border-radius:8px;overflow:hidden;background:#efefef}',
    '.hzbf-isla__foto img{display:block;width:100%;height:100%;object-fit:cover}',
    '.hzbf-isla__foto span{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.45)}',
    '.hzbf-isla__foto span svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.hzbf-isla.is-livre .hzbf-isla__foto span{display:none}',
    '.hzbf-isla__nome{margin:0;font-size:14px;font-weight:700}',
    '.hzbf-isla__txt{margin:2px 0 0;color:rgba(255,255,255,.78);font-size:12.5px}',
    '.hzbf-isla__txt strong{color:inherit}',
    '.hzbf-meter{height:6px;margin-top:9px;border-radius:99px;background:rgba(255,255,255,.18);overflow:hidden}',
    '.hzbf-meter i{display:block;height:100%;border-radius:99px;background:#fff;transition:width .4s}',
    '.hzbf-isla.is-livre .hzbf-meter i,.hzbf-meter.is-livre i{background:#6fc41a}',

    /* Ideia 12: pares que fecham a conta */
    '.hzbf-pares{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.18);flex-basis:100%}',
    '.hzbf-pares p{margin:0 0 8px;font-size:12px;font-weight:700}',
    '.hzbf-pares__g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
    '.hzbf-par{display:grid;gap:4px;color:inherit !important;text-decoration:none !important;min-width:0}',
    '.hzbf-par img,.hzbf-par__img{display:block;width:100%;aspect-ratio:3/4;border-radius:7px;object-fit:cover;background:#efefef}',
    '.hzbf-par__nome{font-size:10.5px;line-height:1.25;height:26px;overflow:hidden;opacity:.85}',
    '.hzbf-par b{font-size:12.5px;font-weight:800}',

    /* Modelo 2 - Recibo */
    '.hzbf-cart.hzbf-m2{background:#fff;color:#111;border:1.5px dashed #111;border-radius:10px}',
    '.hzbf-m2 .hzbf-cart__tag,.hzbf-m4 .hzbf-cart__tag{background:#000;color:#fff}',
    '.hzbf-m2 .hzbf-cart__clock,.hzbf-m4 .hzbf-cart__clock{color:#555}',
    '.hzbf-m2 .hzbf-cart__clock span,.hzbf-m4 .hzbf-cart__clock span{color:#000;font-weight:800}',
    '.hzbf-rec{margin:0;padding:0;display:grid;gap:6px}',
    '.hzbf-rec div{display:flex;justify-content:space-between;gap:10px;font-size:13px}',
    '.hzbf-rec dt{color:#555;font-weight:400}',
    '.hzbf-rec dd{margin:0;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.hzbf-rec .hzbf-rec__off dd{color:#c81e25}',
    '.hzbf-rec .hzbf-rec__tot{margin-top:3px;padding-top:8px;border-top:1px solid #111;font-size:15px}',
    '.hzbf-rec .hzbf-rec__tot dt{color:#111;font-weight:700}',
    '.hzbf-rec .hzbf-rec__tot dd{font-size:19px;font-weight:800}',
    '.hzbf-rec s{color:#888;margin-right:6px}',
    '.hzbf-m2 .hzbf-cart__note,.hzbf-m4 .hzbf-cart__note{color:#555}',
    '.hzbf-m2 .hzbf-cart__note strong,.hzbf-m4 .hzbf-cart__note strong{color:#111}',
    '.hzbf-m2 .hzbf-cart__cta,.hzbf-m4 .hzbf-cart__cta{background:#000;color:#fff !important}',
    '.hzbf-m2 .hzbf-meter,.hzbf-m4 .hzbf-meter{background:#e6e6e4}',
    '.hzbf-m2 .hzbf-meter i{background:#000}',
    '.hzbf-m2 .hzbf-pares,.hzbf-m4 .hzbf-pares{border-top-color:#e3e3e3}',

    /* Modelo 3 - Faixa fina */
    '.hzbf-cart.hzbf-m3{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:11px 14px;border-radius:10px;font-size:13px}',
    '.hzbf-m3 .hzbf-cart__big{font-size:13px}',
    '.hzbf-m3 .hzbf-cart__big strong{font-size:15px}',
    '.hzbf-m3 .hzbf-cart__big a{color:#fff !important;font-weight:700;text-decoration:underline !important}',
    '.hzbf-m3 .hzbf-meter{flex-basis:100%;margin-top:2px;height:4px}',

    /* Modelo 4 - Destaque verde */
    '.hzbf-cart.hzbf-m4{background:#fff;color:#111;box-shadow:inset 0 0 0 1px #dcdcd8}',
    '.hzbf-verde{display:grid;gap:2px}',
    '.hzbf-verde b{color:#4f9070;font-size:30px;font-weight:800;line-height:1.05;font-variant-numeric:tabular-nums}',
    '.hzbf-verde span{font-size:13px;color:#333}',
    '.hzbf-m4 .hzbf-meter i{background:#4f9070}',
    '.hzbf-m4 .hzbf-isla__txt{color:#555}',

    /* Ideia 6: aviso no campo de cupom */
    '.hzbf-cupom{margin:4px 0 8px;padding:8px 10px;border-radius:6px;background:#f1f1ef;color:#111;font-size:12.5px;line-height:1.35}',
    '.hzbf-cupom b{font-weight:700}',

    /* Minicarrinho */
    '.hzbf-mini{box-sizing:border-box;margin:10px 16px 0;padding:10px 12px;border-radius:10px;background:#000;color:#fff;font-size:12.5px;line-height:1.3}',
    '.hzbf-mini a{color:#fff !important;font-weight:700;text-decoration:underline !important;white-space:nowrap}',
    '.hzbf-mini b{font-weight:800}',
    '.hzbf-mini .hzbf-meter{margin-top:7px;height:5px}',
    '.hzbf-mini .hzbf-dot{margin-right:6px;vertical-align:middle}',

    '@media (prefers-reduced-motion:reduce){.hzbf-meter i{transition:none}}'
  ].join("");


  /* =========================================================
     HTML - CARRINHO
     Cada modelo monta a estrutura uma vez; os números são
     atualizados a cada segundo em atualizarCarrinho().
  ========================================================= */

  var CADEADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function selo(m) {
    return '<span class="hzbf-cart__tag">' + DOT + esc(m.ultimo ? (m.id === "1111" ? "Últimas horas" : "Último dia") : TAGS[m.id]) + '</span>';
  }

  function topo(m, comTimer) {
    return '<div class="hzbf-cart__top">' + selo(m) +
      (comTimer ? '<span class="hzbf-cart__clock">Termina em <span data-hzbf-timer></span></span>' : '') +
    '</div>';
  }

  function temTimer(m) {
    return m.id !== "month" || m.ultimo;
  }

  function carrinhoHTML(m) {

    if (M === 3) {
      return selo(m) + '<p class="hzbf-cart__big" data-hzbf-big></p>' +
        (m.id === "isla" ? '<div class="hzbf-meter" data-hzbf-meter aria-hidden="true"><i data-hzbf-isla-bar></i></div>' : '') +
        '<div data-hzbf-extra style="flex-basis:100%"></div>';
    }

    if (m.id === "isla") {

      var fotoIsla = '<a class="hzbf-isla__foto" href="' + esc(CONFIG.urlIsla) + '" aria-label="Ver a Isla Marrom"><img src="' + esc(CONFIG.imgIsla) + '" alt="" loading="lazy"><span>' + CADEADO + '</span></a>';

      if (M === 2) {
        return topo(m, true) + '<dl class="hzbf-rec" data-hzbf-rec></dl>' +
          '<div class="hzbf-meter" data-hzbf-meter aria-hidden="true"><i data-hzbf-isla-bar></i></div>' +
          '<div data-hzbf-extra></div>';
      }

      if (M === 4) {
        return topo(m, true) +
          '<div class="hzbf-isla" data-hzbf-isla>' + fotoIsla +
            '<div class="hzbf-verde"><b data-hzbf-num></b><span data-hzbf-rot></span>' +
            '<div class="hzbf-meter" aria-hidden="true"><i data-hzbf-isla-bar></i></div></div>' +
          '</div><div data-hzbf-extra></div>';
      }

      return topo(m, true) +
        '<div class="hzbf-isla" data-hzbf-isla>' + fotoIsla +
          '<div><p class="hzbf-isla__nome">Isla Marrom por R$1</p>' +
          '<p class="hzbf-isla__txt" data-hzbf-isla-txt></p>' +
          '<div class="hzbf-meter" aria-hidden="true"><i data-hzbf-isla-bar></i></div></div>' +
        '</div><div data-hzbf-extra></div>';
    }

    if (M === 2) {
      return topo(m, temTimer(m)) + '<dl class="hzbf-rec" data-hzbf-rec></dl>' +
        '<p class="hzbf-cart__note" data-hzbf-note></p><div data-hzbf-extra></div>';
    }

    if (M === 4) {
      return topo(m, temTimer(m)) + '<div class="hzbf-verde"><b data-hzbf-num></b><span data-hzbf-rot></span></div>' +
        '<p class="hzbf-cart__note" data-hzbf-note></p><div data-hzbf-extra></div>';
    }

    return topo(m, temTimer(m)) +
      '<p class="hzbf-cart__big" data-hzbf-big></p>' +
      '<p class="hzbf-cart__note" data-hzbf-note></p><div data-hzbf-extra></div>';
  }

  function linhaRecibo(rotulo, valor, classe) {
    return '<div' + (classe ? ' class="' + classe + '"' : '') + '><dt>' + rotulo + '</dt><dd>' + valor + '</dd></div>';
  }

  function ctaApp() {
    return '<a class="hzbf-cart__cta" href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar o app' + SETA + '</a>';
  }

  function ctaIsla() {
    return '<a class="hzbf-cart__cta" href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta>Escolher o número da Isla' + SETA + '</a>';
  }

  function atualizarCarrinho(m, c) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var q = function (sel) { return bloco.querySelector(sel); };
    var prazo = prazoTexto(m.fimReal, M === 3);
    var extra = "";

    /* ---------- Isla ---------- */

    if (m.id === "isla") {

      var falta = CONFIG.minimoIsla - c.valorParaIsla;
      var livre = falta <= 0;
      var pct = Math.max(2, Math.min(100, c.valorParaIsla / CONFIG.minimoIsla * 100)).toFixed(1) + "%";

      var caixa = q("[data-hzbf-isla]");
      var medidor = q("[data-hzbf-meter]");
      var barra = q("[data-hzbf-isla-bar]");

      if (caixa) {
        caixa.classList.toggle("is-livre", livre);
      }

      if (medidor) {
        medidor.classList.toggle("is-livre", livre);
      }

      if (barra) {
        barra.style.width = pct;
      }

      if (M === 3) {
        definirHTML(q("[data-hzbf-big]"), livre
          ? (c.temIsla ? '<strong>Isla Marrom por R$1</strong> garantida nesta sacola' : '<strong>Isla por R$1 liberada!</strong> <a href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta>Escolher o número</a>')
          : 'Faltam <strong>' + formatBRL(falta) + '</strong> para a Isla Marrom por R$1');
      } else if (M === 2) {
        definirHTML(q("[data-hzbf-rec]"),
          linhaRecibo("Sua sacola", formatBRL(c.valorParaIsla)) +
          linhaRecibo(livre ? "Mínimo de R$999" : "Falta para R$999", livre ? "atingido" : formatBRL(falta), livre ? "" : "hzbf-rec__off") +
          linhaRecibo("Isla Marrom", '<s>' + formatBRL(CONFIG.precoIsla) + '</s>R$ 1,00', "hzbf-rec__tot"));
      } else if (M === 4) {
        definirHTML(q("[data-hzbf-num]"), livre ? "Liberada" : formatBRL(falta));
        definirHTML(q("[data-hzbf-rot]"), livre
          ? (c.temIsla ? "A Isla Marrom por R$1 está na sacola." : "A Isla Marrom por R$1 já pode entrar na sacola.")
          : "faltam para a Isla Marrom por R$1 (sacola: " + formatBRL(c.valorParaIsla) + ")");
      } else {
        definirHTML(q("[data-hzbf-isla-txt]"), livre
          ? (c.temIsla ? 'Garantida nesta sacola.' : 'Liberada! Sua sacola passou de R$999.')
          : 'Faltam <strong>' + formatBRL(falta) + '</strong> para liberar. Sua sacola: ' + formatBRL(c.valorParaIsla) + ' de R$999.');
      }

      extra = livre ? (c.temIsla || M === 3 ? "" : ctaIsla()) : paresHTML(c);

      definirHTML(q("[data-hzbf-extra]"), extra);

      return;
    }

    /* ---------- Só no app ---------- */

    if (m.id === "app") {

      var noApp = c.subtotal * (1 - CONFIG.descontoPix);

      if (M === 3) {
        definirHTML(q("[data-hzbf-big]"), 'No app esta sacola sai <strong>' + formatBRL(noApp) + '</strong> no Pix · <a href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>baixar</a>');
        return;
      }

      if (M === 2) {
        definirHTML(q("[data-hzbf-rec]"),
          linhaRecibo("Sacola no site", formatBRL(c.subtotal)) +
          linhaRecibo("20% no Pix, só no app", "−" + formatBRL(c.subtotal - noApp), "hzbf-rec__off") +
          linhaRecibo("No app, no Pix", formatBRL(noApp), "hzbf-rec__tot"));
      } else if (M === 4) {
        definirHTML(q("[data-hzbf-num]"), formatBRL(noApp));
        definirHTML(q("[data-hzbf-rot]"), "é quanto esta sacola sai no app, no Pix");
      } else {
        definirHTML(q("[data-hzbf-big]"), 'No app, esta sacola sai por <strong>' + formatBRL(noApp) + '</strong> no Pix');
      }

      definirHTML(q("[data-hzbf-note]"), esc("20% OFF no Pix só no app Hitzz, até " + prazo + "."));
      definirHTML(q("[data-hzbf-extra]"), ctaApp());

      return;
    }

    /* ---------- Ideia 5: Black Hitzz, 11.11 e Black Friday ---------- */

    var economia = c.economiaDe + c.economiaPix;
    var quando = m.ultimo && m.id !== "1111"
      ? "Esse preço termina hoje às 23h59."
      : "Esse preço vale até " + prazo + ".";

    if (M === 3) {
      definirHTML(q("[data-hzbf-big]"), economia >= 1
        ? 'Você economiza <strong>' + formatBRL(economia) + '</strong> · até ' + esc(prazo)
        : 'Preço de Black · até ' + esc(prazo));
      return;
    }

    if (M === 2) {

      // O valor vem do carrinho: vale o que a loja estiver dando no Pix
      var rotuloPix = "Desconto no Pix";

      definirHTML(q("[data-hzbf-rec]"),
        linhaRecibo("Preço cheio", formatBRL(c.cheio)) +
        (c.economiaDe >= 0.01 ? linhaRecibo(m.id === "1111" ? "Desconto 11.11" : "Desconto Black", "−" + formatBRL(c.economiaDe), "hzbf-rec__off") : "") +
        (c.economiaPix >= 0.01 ? linhaRecibo(rotuloPix, "−" + formatBRL(c.economiaPix), "hzbf-rec__off") : "") +
        linhaRecibo("Você paga no Pix", formatBRL(c.pix), "hzbf-rec__tot"));

      definirHTML(q("[data-hzbf-note]"), (economia >= 1 ? 'Economia de <strong>' + formatBRL(economia) + '</strong>. ' : '') + esc(quando));

      return;
    }

    var partes = [];

    if (c.economiaDe >= 1 && c.economiaPix >= 1) {
      partes.push(formatBRL(c.economiaDe) + " de desconto + " + formatBRL(c.economiaPix) + " no Pix.");
    }

    partes.push(quando);

    if (M === 4) {
      definirHTML(q("[data-hzbf-num]"), formatBRL(economia));
      definirHTML(q("[data-hzbf-rot]"), "de economia nesta sacola");
    } else {
      definirHTML(q("[data-hzbf-big]"), economia >= 1
        ? 'Você economiza <strong>' + formatBRL(economia) + '</strong> nesta sacola'
        : 'Preço de Black nesta sacola');
    }

    definirHTML(q("[data-hzbf-note]"), esc(partes.join(" ")));
  }


  /* =========================================================
     HTML - MINICARRINHO
  ========================================================= */

  function miniHTML(m, c) {

    if (m.id === "isla") {

      var falta = CONFIG.minimoIsla - c.valorParaIsla;

      if (falta <= 0) {
        return DOT + (c.temIsla
          ? '<b>Isla Marrom por R$1</b> garantida na sacola'
          : '<b>Isla por R$1 liberada!</b> <a href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta>Escolher o número</a>');
      }

      return DOT + 'Faltam <b>' + formatBRL(falta) + '</b> para a Isla Marrom por R$1' +
        '<div class="hzbf-meter" aria-hidden="true"><i style="width:' +
        Math.max(2, Math.min(100, c.valorParaIsla / CONFIG.minimoIsla * 100)).toFixed(1) + '%"></i></div>';
    }

    if (m.id === "app") {
      return MOSTRAR_APP_NO_CARRINHO
        ? DOT + 'No app: <b>+20% OFF no Pix</b> até ' + esc(prazoTexto(m.fimReal)) + '. <a href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar</a>'
        : '';
    }

    if (m.id === "1111") {
      return DOT + '<b>11.11</b> termina em <b>' + relogio(m.fim, "curto") + '</b>';
    }

    if (m.id === "black") {
      return DOT + '<b>Black Friday</b> termina em <b>' + relogio(m.fim, "curto") + '</b> · 20% OFF no Pix';
    }

    if (m.id === "month" && m.ultimo) {
      return DOT + '<b>Último dia</b> da Black Hitzz';
    }

    return '';
  }


  /* =========================================================
     POSICIONAMENTO E MONTAGEM
  ========================================================= */

  function montarCarrinho(m) {

    var c = lerCarrinho();
    var bloco = document.getElementById(ID);

    if (!c || (m.id === "app" && !MOSTRAR_APP_NO_CARRINHO)) {

      if (bloco) {
        bloco.remove();
      }

      return;
    }

    // Black Hitzz (base do mês): só aparece quando há economia para mostrar
    if (m.id === "month" && c.economiaDe < 1) {

      if (bloco) {
        bloco.remove();
      }

      return;
    }

    var ancora = document.querySelector(SELETORES.carrinho + " " + SELETORES.topo);

    if (!ancora || !ancora.parentNode) {
      return;
    }

    if (!bloco) {

      bloco = document.createElement("div");

      bloco.id = ID;
      bloco.className = "hzbf-cart hzbf-m" + M + " hzbf-cart--" + m.id + (m.ultimo ? " hzbf-cart--ultimo" : "");

      bloco.setAttribute("aria-label", "Black Hitzz");

      bloco.innerHTML = carrinhoHTML(m);
    }

    if (bloco.nextElementSibling !== ancora) {
      ancora.parentNode.insertBefore(bloco, ancora);
    }

    atualizarCarrinho(m, c);

    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {
      definirHTML(timers[i], relogio(m.fim, M === 2 || M === 4 ? "texto" : "blocos"));
    }
  }

  // Ideia 6: aviso logo acima do campo de cupom
  function montarSemCupom(m) {

    var aviso = document.getElementById(ID_CUPOM);
    var texto = IDEIAS.semCupom ? TEXTO_CUPOM[m.id] : "";
    var ancora = document.querySelector(SELETORES.cupomTexto);

    if (!texto || !ancora) {

      if (aviso) {
        aviso.remove();
      }

      return;
    }

    if (!aviso) {
      aviso = document.createElement("p");
      aviso.id = ID_CUPOM;
      aviso.className = "hzbf-cupom";
    }

    if (ancora.nextElementSibling !== aviso) {
      ancora.parentNode.insertBefore(aviso, ancora.nextSibling);
    }

    definirHTML(aviso, '<b>Na Black não precisa de cupom.</b> ' + esc(texto));
  }

  function montarMini(m) {

    var mini = document.querySelector(SELETORES.mini);
    var linha = document.getElementById(ID_MINI);

    var html = mini ? miniHTML(m, lerMini()) : "";

    if (!html) {

      if (linha) {
        linha.remove();
      }

      return;
    }

    var ancora = mini.querySelector(SELETORES.barraFrete) || mini.querySelector(SELETORES.miniTopo);

    if (!ancora) {
      return;
    }

    if (!linha) {
      linha = document.createElement("div");
      linha.id = ID_MINI;
      linha.className = "hzbf-mini";
    }

    if (ancora.nextElementSibling !== linha) {
      ancora.parentNode.insertBefore(linha, ancora.nextSibling);
    }

    definirHTML(linha, html);
  }

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

    var chave = m ? m.id + (m.ultimo ? "+ultimo" : "") : null;

    if (chave !== estadoRenderizado) {

      var antigos = [document.getElementById(ID), document.getElementById(ID_MINI), document.getElementById(ID_CUPOM)];

      for (var i = 0; i < antigos.length; i++) {

        if (antigos[i]) {
          antigos[i].remove();
        }
      }

      estadoRenderizado = chave;
    }

    if (!m) {
      return;
    }

    adicionarEstilo();

    montarCarrinho(m);

    montarSemCupom(m);

    montarMini(m);
  }


  /* =========================================================
     EVENTO DE CLIQUE (para medir no GA / MarketDock)
  ========================================================= */

  document.addEventListener("click", function (event) {

    var link = event.target && event.target.closest &&
      event.target.closest("#" + ID + " [data-hzbf-cta], #" + ID_MINI + " [data-hzbf-cta]");

    if (!link) {
      return;
    }

    try {

      var m = momentoDaAcao();

      (window.dataLayer = window.dataLayer || []).push({
        event: "hzbf_clique",
        hzbf_local: link.closest("#" + ID_MINI) ? "minicarrinho" : (link.classList.contains("hzbf-par") ? "carrinho_pares" : "carrinho"),
        hzbf_acao: m ? m.id : "",
        hzbf_modelo: M,
        hzbf_texto: link.textContent.trim()
      });

    } catch (erro) { }
  });


  /* =========================================================
     OBSERVER
     O carrinho e o minicarrinho são redesenhados por AJAX
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
