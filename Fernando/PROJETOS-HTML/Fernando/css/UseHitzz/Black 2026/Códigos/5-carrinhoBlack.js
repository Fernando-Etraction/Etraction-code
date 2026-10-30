(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 5 - CARRINHO E MINICARRINHO
     Bloco acima do CEP, com os números do próprio carrinho. Cada ação
     tem o seu conceito, o mesmo dos outros códigos:

     Black Hitzz   "Sua caixa Black": quantos pares e quanto economiza (ideia 5)
     Só no app     aviso do app: quanto a sacola sai mais barata no app
     11.11         embarque: quantos Hitzz do 11.11 estão na sacola + relógio
     Isla por R$1  preço riscado e o R$1 grande: quanto falta na sacola
                   (ideia 12: os pares da Black que fecham os R$999)
     Black Friday  "Seu fechamento": a economia em queda, desconto + Pix (ideia 5)

     Também: aviso no campo de cupom de que a Black não precisa de
     cupom (ideia 6) e uma linha no minicarrinho.

     As classes deste código começam com "hzbfs-" para não trombar
     com as dos outros códigos da Black, que rodam na mesma página.
  ========================================================= */

  if (window.__hzbfCartLoaded) {
    return;
  }

  window.__hzbfCartLoaded = true;

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
    limite1111: 124,
    minimoIsla: 999,
    precoIsla: 249.90,
    urlIsla: "/isla-chinelo-flat-feminino-marrom",

    // Ideia 12: categoria Black do menor para o maior preço (até 3 páginas)
    urlPares: "/categorizacao/promo?sorting%5Bprice%5D=asc&page=",
    paginasPares: 3,

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
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

  // Sem o "R$": "1.234,50"
  function numeroBRL(valor) {
    return formatBRL(valor).slice(3);
  }

  function definirHTML(el, html) {

    if (el && el._hzbfHtml !== html) {
      el._hzbfHtml = html;
      el.innerHTML = html;
    }
  }

  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  function prazoTexto(fim) {

    var meiaNoite = new Date(fim - 3 * 3600000).getUTCHours() === 0;
    var d = new Date(fim - 3 * 3600000 - (meiaNoite ? 60000 : 0));
    var hora = meiaNoite ? "23h59" : d.getUTCHours() + "h";

    return DIAS[d.getUTCDay()] + ", " + doisDigitos(d.getUTCDate()) + "/" +
      doisDigitos(d.getUTCMonth() + 1) + ", às " + hora;
  }

  // "23h59" ou "8h", a partir do fim (exclusivo)
  function horaDoFim(fim) {
    var d = new Date(fim - 3 * 3600000);
    return d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? "23h59" : d.getUTCHours() + "h";
  }

  // "2d 04:59:58" ou "04:59:58"; com "curto", "2d 04h59"
  function relogio(fim, curto) {

    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    var dias = Math.floor(restante / 86400);
    var h = Math.floor(restante % 86400 / 3600);
    var min = Math.floor(restante % 3600 / 60);
    var s = restante % 60;

    if (curto && dias > 0) {
      return dias + "d " + doisDigitos(h) + "h" + doisDigitos(min);
    }

    return (dias > 0 ? dias + "d " : "") + doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s);
  }

  // 11.11: horas corridas, como num painel ("33:59")
  function relogioPainel(fim) {
    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    return doisDigitos(Math.min(99, Math.floor(restante / 3600))) + ":" + doisDigitos(Math.floor(restante % 3600 / 60));
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
    var pares = 0;
    var ate124 = 0;
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

      pares += qtd;

      if (por <= CONFIG.limite1111) {
        ate124 += qtd;
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
      pares: pares,
      ate124: ate124,
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

    // As URLs da Uoou têm vírgulas: o srcset é cortado pela largura ("265w,")
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
      html += '<a class="hzbfs-par" href="' + esc(pares[i].url) + '" data-hzbf-cta>' +
        (pares[i].img ? '<img src="' + esc(pares[i].img) + '" alt="" loading="lazy">' : '<span class="hzbfs-par__img"></span>') +
        '<span class="hzbfs-par__nome">' + esc(pares[i].nome) + '</span><b>' + formatBRL(pares[i].por) + '</b></a>';
    }

    return '<div class="hzbfs-pares"><p>Da Black, completam os R$999:</p><div class="hzbfs-pares__g">' + html + '</div></div>';
  }


  /* =========================================================
     CSS
  ========================================================= */

  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace';

  var CSS = [
    // Fundo preto, como os outros blocos da Black
    '.hzbf-cart{box-sizing:border-box;margin:0 0 16px;overflow:hidden;border:0;border-radius:10px;background:#000;color:#fff;font:inherit;font-size:13px;line-height:1.35;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-cart *{box-sizing:border-box}',
    '.hzbf-cart p{margin:0}',
    '.hzbf-cart a{text-decoration:none !important}',
    '.hzbfs-in{padding:12px 14px}',
    '.hzbfs-btn{display:inline-flex;align-items:center;gap:6px;height:34px;margin-top:10px;padding:0 14px;border-radius:999px;background:#fff;color:#000 !important;font-size:12px;font-weight:700;white-space:nowrap}',
    '.hzbfs-btn svg,.hzbfs-mini svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    /* Black Hitzz - sua caixa Black */
    '.hzbfs-fita{display:block;height:7px;background:repeating-linear-gradient(-45deg,#fff 0 6px,#000 6px 12px)}',
    '.hzbfs-caixa{display:flex;align-items:center;justify-content:space-between;gap:12px}',
    '.hzbfs-caixa__titulo{display:block;font-size:14px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}',
    '.hzbfs-caixa__txt{display:block;margin-top:2px;font-size:13px}',
    '.hzbfs-caixa__txt b{font-weight:800}',
    '.hzbfs-caixa__nota{display:block;margin-top:3px;color:rgba(255,255,255,.65);font-size:11.5px}',
    '.hzbfs-lacre{flex:0 0 auto;padding:4px 7px;background:#fff;color:#000;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;transform:rotate(-4deg)}',

    /* Só no app - aviso do app */
    '.hzbfs-aviso{display:flex;align-items:center;gap:10px;color:#fff !important}',
    '.hzbfs-aviso__ic{display:flex;align-items:center;justify-content:center;flex:0 0 30px;width:30px;height:30px;border-radius:8px;background:#1c1c1e;box-shadow:inset 0 0 0 1px #3a3a3c;color:#fff;font-size:16px;font-weight:800}',
    '.hzbfs-aviso__txt{flex:1;min-width:0;line-height:1.3}',
    '.hzbfs-aviso__txt small{display:block;color:#9a9a9a;font-size:10.5px}',
    '.hzbfs-aviso__txt b{font-weight:800}',
    '.hzbfs-aviso__ir{flex:0 0 auto;padding:6px 12px;border-radius:999px;background:#fff;color:#000;font-size:11.5px;font-weight:700}',

    /* 11.11 - embarque */
    '.hzbfs-embarque{display:flex;align-items:center;justify-content:space-between;gap:12px}',
    '.hzbfs-embarque small{display:block;color:#9a9a9a;' + MONO + ';font-size:9.5px;letter-spacing:.1em;text-transform:uppercase}',
    '.hzbfs-embarque b{font-size:14px;font-weight:800}',
    '.hzbfs-embarque [data-hzbf-txt] span{display:block;color:rgba(255,255,255,.7);font-size:12px}',
    '.hzbfs-placas{display:inline-flex;align-items:center;gap:2px;flex:0 0 auto}',
    '.hzbfs-placa{display:inline-flex;align-items:center;justify-content:center;width:16px;height:24px;border-radius:2px;background:linear-gradient(#262626 0 49%,#000 49% 53%,#1b1b1b 53%);box-shadow:inset 0 0 0 1px #333;color:#fff;' + MONO + ';font-size:14px;font-weight:700;line-height:1}',
    '.hzbfs-sep{' + MONO + ';font-size:14px;font-weight:700}',

    /* Isla - preço riscado e o R$1 grande */
    '.hzbfs-isla{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;align-items:center}',
    '.hzbfs-isla__preco{line-height:1}',
    '.hzbfs-isla__preco small{display:block;color:rgba(255,255,255,.7);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.hzbfs-isla__preco s{display:block;margin-top:3px;color:rgba(255,255,255,.55);font-size:13px;font-weight:700}',
    '.hzbfs-isla__preco b{display:block;color:#ff4b52;font-size:40px;font-weight:900;letter-spacing:-.04em}',
    '.hzbfs-isla__txt{font-size:13px;line-height:1.35}',
    '.hzbfs-isla__txt b{font-weight:800;white-space:nowrap}',

    /* Black Friday - seu fechamento */
    '.hzbfs-fech{display:flex;align-items:baseline;justify-content:space-between;gap:10px}',
    '.hzbfs-fech small{color:rgba(255,255,255,.6);font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}',
    '.hzbfs-fech b{color:#ff4b52;font-size:20px;font-weight:900;white-space:nowrap}',
    '.hzbfs-fech__det{margin-top:5px !important;color:rgba(255,255,255,.7);font-size:12px}',
    '.hzbfs-fech__fim{margin-top:6px !important;font-size:12px}',
    '.hzbfs-fech__fim b{font-variant-numeric:tabular-nums}',

    /* Ideia 12: pares que fecham a conta */
    '.hzbfs-pares{margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.15)}',
    '.hzbfs-pares p{margin:0 0 8px;font-size:12px;font-weight:700}',
    '.hzbfs-pares__g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
    '.hzbfs-par{display:grid;gap:4px;min-width:0;color:inherit !important}',
    '.hzbfs-par img,.hzbfs-par__img{display:block;width:100%;aspect-ratio:3/4;border-radius:7px;object-fit:cover;background:#efefef}',
    '.hzbfs-par__nome{height:26px;overflow:hidden;font-size:10.5px;line-height:1.25;opacity:.85}',
    '.hzbfs-par b{font-size:12.5px;font-weight:800}',

    /* Ideia 6: aviso no campo de cupom */
    '.hzbfs-semcupom{margin:4px 0 8px;padding:8px 10px;border-radius:6px;background:#f1f1ef;color:#111;font-size:12.5px;line-height:1.35}',
    '.hzbfs-semcupom b{font-weight:700}',

    /* Minicarrinho */
    '.hzbfs-mini{box-sizing:border-box;margin:10px 16px 0;padding:10px 12px;border-radius:10px;background:#000;color:#fff;font-size:12.5px;line-height:1.3}',
    '.hzbfs-mini a{color:#fff !important;font-weight:700;text-decoration:underline !important;white-space:nowrap}',
    '.hzbfs-mini b{font-weight:800}',
    '.hzbfs-mini__trilha{height:5px;margin-top:7px;background:rgba(255,255,255,.18)}',
    '.hzbfs-mini__trilha i{display:block;height:100%;background:#fff}'


  ].join("");


  /* =========================================================
     HTML - CARRINHO
     Cada conceito monta a estrutura uma vez; os números são
     atualizados a cada segundo em atualizarCarrinho().
  ========================================================= */

  var ESTRUTURA = {

    month: function () {
      return '<i class="hzbfs-fita" aria-hidden="true"></i>' +
        '<div class="hzbfs-in hzbfs-caixa"><div>' +
          '<span class="hzbfs-caixa__titulo">Sua caixa Black</span>' +
          '<span class="hzbfs-caixa__txt" data-hzbf-txt></span>' +
          '<span class="hzbfs-caixa__nota" data-hzbf-nota></span>' +
        '</div><span class="hzbfs-lacre">Lacrada</span></div>';
    },

    app: function () {
      return '<a class="hzbfs-in hzbfs-aviso" href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>' +
        '<span class="hzbfs-aviso__ic" aria-hidden="true">h</span>' +
        '<span class="hzbfs-aviso__txt" data-hzbf-txt></span>' +
        '<span class="hzbfs-aviso__ir">Abrir ›</span>' +
      '</a>';
    },

    "1111": function () {
      return '<div class="hzbfs-in hzbfs-embarque"><div data-hzbf-txt></div><span class="hzbfs-placas" data-hzbf-painel></span></div>';
    },

    isla: function () {
      return '<div class="hzbfs-in"><div class="hzbfs-isla">' +
        '<p class="hzbfs-isla__preco"><small>Isla Marrom</small><s>' + formatBRL(CONFIG.precoIsla) + '</s><b>R$1</b></p>' +
        '<p class="hzbfs-isla__txt" data-hzbf-isla></p>' +
      '</div><div data-hzbf-extra></div></div>';
    },

    black: function () {
      return '<div class="hzbfs-in">' +
        '<div class="hzbfs-fech"><small>Seu fechamento</small><b data-hzbf-total></b></div>' +
        '<p class="hzbfs-fech__det" data-hzbf-det></p>' +
        '<p class="hzbfs-fech__fim" data-hzbf-fim></p>' +
      '</div>';
    }
  };

  function atualizarCarrinho(m, c) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var q = function (sel) { return bloco.querySelector(sel); };

    /* ---------- Black Hitzz: sua caixa Black (ideia 5) ---------- */

    if (m.id === "month") {
      definirHTML(q("[data-hzbf-txt]"), c.pares + (c.pares === 1 ? ' par' : ' pares') + ' · você economiza <b>' + formatBRL(c.economiaDe + c.economiaPix) + '</b>');
      definirHTML(q("[data-hzbf-nota]"), m.ultimo ? "Último dia da Black Hitzz: termina hoje às 23h59." : "Preço garantido até 23h59 de hoje.");
      return;
    }

    /* ---------- Só no app ---------- */

    if (m.id === "app") {

      // Quanto sai mais barata no app, em cima do Pix que o site já mostra
      var noApp = c.subtotal * (1 - CONFIG.descontoPix);
      var aMais = (c.pix > 0 ? c.pix : c.subtotal) - noApp;

      definirHTML(q("[data-hzbf-txt]"),
        '<small>HITZZ · até ' + esc(prazoTexto(m.fimReal)) + '</small>' +
        'Essa sacola sai <b>' + formatBRL(aMais) + ' mais barata</b> no app, com 20% OFF no Pix.');
      return;
    }

    /* ---------- 11.11: embarque ---------- */

    if (m.id === "1111") {

      definirHTML(q("[data-hzbf-txt]"), c.ate124 > 0
        ? '<small>Embarque 11.11</small><b>' + c.ate124 + ' Hitzz do 11.11 na sacola</b><span>O embarque encerra às ' + horaDoFim(m.fimReal) + '.</span>'
        : '<small>Embarque 11.11</small><b>+ de 24 Hitzz por até R$124</b><span>O embarque encerra às ' + horaDoFim(m.fimReal) + '.</span>');

      var painel = q("[data-hzbf-painel]");
      var texto = relogioPainel(m.fim);

      if (painel) {

        var html = "";

        for (var i = 0; i < texto.length; i++) {
          html += texto.charAt(i) === ":" ? '<span class="hzbfs-sep">:</span>' : '<span class="hzbfs-placa">' + texto.charAt(i) + '</span>';
        }

        definirHTML(painel, html);
      }

      return;
    }

    /* ---------- Isla: preço riscado e quanto falta ---------- */

    if (m.id === "isla") {

      var falta = CONFIG.minimoIsla - c.valorParaIsla;
      var livre = falta <= 0;

      definirHTML(q("[data-hzbf-isla]"), livre
        ? 'Sua sacola passou de R$999: <b>' + (c.temIsla ? 'a Isla está garantida por R$1' : 'a Isla já sai por R$1') + '</b>.'
        : 'Sua sacola: <b>' + formatBRL(c.valorParaIsla) + '</b>. Faltam <b>' + formatBRL(falta) + '</b> para a Isla sair por R$1.');

      definirHTML(q("[data-hzbf-extra]"), livre
        ? (c.temIsla ? "" : '<a class="hzbfs-btn" href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta>Escolher o número da Isla' + SETA + '</a>')
        : paresHTML(c));

      return;
    }

    /* ---------- Black Friday: seu fechamento (ideia 5) ---------- */

    var economia = c.economiaDe + c.economiaPix;
    var det = [];

    if (c.economiaDe >= 0.01) {
      det.push("desconto ▼ " + numeroBRL(c.economiaDe));
    }

    if (c.economiaPix >= 0.01) {
      det.push("pix ▼ " + numeroBRL(c.economiaPix));
    }

    det.push("sem cupom");

    definirHTML(q("[data-hzbf-total]"), "▼ " + formatBRL(economia));
    definirHTML(q("[data-hzbf-det]"), esc(det.join(" · ")));
    definirHTML(q("[data-hzbf-fim]"), (m.ultimo ? 'Último dia · fecha em <b>' : 'Fecha em <b>') + relogio(m.fim) + '</b> · ' + esc(prazoTexto(m.fimReal)));
  }


  /* =========================================================
     HTML - MINICARRINHO
  ========================================================= */

  function miniHTML(m, c) {

    if (m.id === "isla") {

      var falta = CONFIG.minimoIsla - c.valorParaIsla;

      if (falta <= 0) {
        return c.temIsla
          ? '<b>Isla Marrom por R$1</b> garantida na sacola'
          : '<b>Isla por R$1 liberada!</b> <a href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta>Escolher o número</a>';
      }

      return 'Faltam <b>' + formatBRL(falta) + '</b> para a Isla Marrom por R$1' +
        '<div class="hzbfs-mini__trilha" aria-hidden="true"><i style="width:' +
        Math.max(2, Math.min(100, c.valorParaIsla / CONFIG.minimoIsla * 100)).toFixed(1) + '%"></i></div>';
    }

    if (m.id === "app") {
      return MOSTRAR_APP_NO_CARRINHO
        ? 'No app: <b>+20% OFF no Pix</b> até ' + esc(prazoTexto(m.fimReal)) + '. <a href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>Abrir</a>'
        : '';
    }

    if (m.id === "1111") {
      return '✈ <b>11.11</b> encerra em <b>' + relogio(m.fim, true) + '</b>';
    }

    if (m.id === "black") {
      return '▼ <b>Black Friday</b> fecha em <b>' + relogio(m.fim, true) + '</b> · 20% OFF no Pix';
    }

    if (m.id === "month" && m.ultimo) {
      return '<b>Último dia</b> da Black Hitzz';
    }

    return '';
  }


  /* =========================================================
     POSICIONAMENTO E MONTAGEM
  ========================================================= */

  function montarCarrinho(m) {

    var c = lerCarrinho();
    var bloco = document.getElementById(ID);

    // Black Hitzz só aparece quando há economia; o app, se o carrinho for o mesmo
    var mostrar = c &&
      !(m.id === "app" && !MOSTRAR_APP_NO_CARRINHO) &&
      !(m.id === "month" && c.economiaDe < 1);

    if (!mostrar) {

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
      bloco.className = "hzbf-cart hzbf-cart--" + m.id + (m.ultimo ? " hzbf-cart--ultimo" : "");

      bloco.setAttribute("aria-label", "Black Hitzz");

      bloco.innerHTML = ESTRUTURA[m.id]();
    }

    if (bloco.nextElementSibling !== ancora) {
      ancora.parentNode.insertBefore(bloco, ancora);
    }

    atualizarCarrinho(m, c);
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
      aviso.className = "hzbfs-semcupom";
    }

    if (ancora.nextElementSibling !== aviso) {
      ancora.parentNode.insertBefore(aviso, ancora.nextSibling);
    }

    definirHTML(aviso, '<b>Na Black não precisa de cupom.</b> ' + esc(texto));
  }

  function montarMini(m) {

    var mini = document.querySelector(SELETORES.mini);
    var linhaMini = document.getElementById(ID_MINI);

    var html = mini ? miniHTML(m, lerMini()) : "";

    if (!html) {

      if (linhaMini) {
        linhaMini.remove();
      }

      return;
    }

    var ancora = mini.querySelector(SELETORES.barraFrete) || mini.querySelector(SELETORES.miniTopo);

    if (!ancora) {
      return;
    }

    if (!linhaMini) {
      linhaMini = document.createElement("div");
      linhaMini.id = ID_MINI;
      linhaMini.className = "hzbfs-mini";
    }

    if (ancora.nextElementSibling !== linhaMini) {
      ancora.parentNode.insertBefore(linhaMini, ancora.nextSibling);
    }

    definirHTML(linhaMini, html);
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
        hzbf_local: link.closest("#" + ID_MINI) ? "minicarrinho" : (link.classList.contains("hzbfs-par") ? "carrinho_pares" : "carrinho"),
        hzbf_acao: m ? m.id : "",
        hzbf_texto: link.textContent.trim().slice(0, 60)
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
