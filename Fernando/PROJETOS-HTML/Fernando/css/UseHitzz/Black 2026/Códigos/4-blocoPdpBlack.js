(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 4 - PÁGINA DE PRODUTO
     - Bloco logo abaixo do preço com a oferta do momento, já com
       o valor final calculado (sem a cliente fazer conta).
     - Ideia 4: no celular, prazo e preço final dentro do botão
       fixo "Comprar agora".
     - Ideia 9: produto esgotado em todos os números leva para a
       mesma categoria dentro da Black.

     MODELOS
     1  Bloco preto     selo, contador, preço final e prazo
     2  Contorno        o mesmo bloco em branco com borda preta
     3  Faixa compacta  uma linha só: selo, preço final e contador
     4  Recibo          a conta aberta: preço cheio, descontos e quanto paga
  ========================================================= */

  if (window.__hzbfPdpLoaded) {
    return;
  }

  window.__hzbfPdpLoaded = true;

  var MODELO = 1;

  var IDEIAS = {
    prazoNoBotao: true,
    esgotadoParaBlack: true
  };

  var ID = "hzbf-pdp";
  var STYLE_ID = "hzbf-pdp-style";

  var SELETORES = {
    preco: "#right-column .pdp-payment, #product-variant-form .pdp-payment, .pdp-payment",
    precoContainer: ".product-price-container",
    form: "#product-variant-form",
    de: ".pdp-payment__from-value",
    precoCheio: ".pdp-payment__price--normal",
    precoPix: ".pdp-payment__price--cash-payment",
    precos: ".pdp-payment__price",
    tamanhos: "#product-variant-form .size-bt",
    botaoFixo: "#btn-cart-row-mobile-fixed .btn-cart"
  };

  // A PDP traz no <body> as categorias do produto (taxon-...).
  // Produto da Black = tem uma destas classes. Alguns produtos da Black
  // têm só "taxon-esquenta-black" (ex.: Misaki), por isso as duas.
  var TAXONS_BLACK = ["taxon-promo", "taxon-esquenta-black"];

  // Ideia 9: para onde mandar quem cai num produto esgotado, pelo tipo
  var BLACK_POR_TIPO = [
    { taxons: ["taxon-botas"], nome: "botas", url: "/esquenta-black/botas" },
    { taxons: ["taxon-tamancos", "taxon-tamanco"], nome: "tamancos", url: "/esquenta-black/tamancos" },
    { taxons: ["taxon-sandalias", "taxon-sandalia"], nome: "sandálias", url: "/esquenta-black/sandalias" },
    { taxons: ["taxon-flats", "taxon-rasteira", "taxon-sapatilha"], nome: "flats", url: "/esquenta-black/flats" },
    { taxons: ["taxon-saltos"], nome: "saltos", url: "/esquenta-black/saltos" }
  ];


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    descontoPix: 0.20,   // app (05 a 08/11) e Black Friday (27 a 29/11)
    limite1111: 124,
    minimoIsla: 999,
    precoIsla: 249.90,

    urlBlack: "/categorizacao/promo?sorting%5Bdiscount%5D=desc",
    url1111: "/categorizacao/promo?sorting%5Bprice%5D=asc",
    urlIsla: "/isla-chinelo-flat-feminino-marrom",
    imgIsla: "https://adaptive-images.uooucdn.com.br/tr:w-120,h-174,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png",

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

  function definirTexto(el, texto) {

    if (el && el.textContent !== texto) {
      el.textContent = texto;
    }
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

  // curto: "2d 04h59" (botão fixo); texto: "2d 04:59:58"; senão, blocos
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

  // Valor da sacola em reais (a Uoou devolve em centavos)
  function valorDaSacola() {

    try {
      var centavos = window.Uoou && window.Uoou.cart && window.Uoou.cart.getSubTotal();
      return centavos > 0 ? centavos / 100 : 0;
    } catch (erro) {
      return 0;
    }
  }

  function temClasse(lista) {

    for (var i = 0; i < lista.length; i++) {

      if (document.body.classList.contains(lista[i])) {
        return true;
      }
    }

    return false;
  }

  function produtoDaBlack() {
    return temClasse(TAXONS_BLACK);
  }

  function ehAIsla() {
    return window.location.pathname.indexOf(CONFIG.urlIsla) === 0;
  }

  // Ideia 9: todos os números do produto estão indisponíveis
  function esgotado() {

    var botoes = document.querySelectorAll(SELETORES.tamanhos);

    if (!botoes.length) {
      return false;
    }

    for (var i = 0; i < botoes.length; i++) {

      if (!botoes[i].disabled && !botoes[i].classList.contains("disabled")) {
        return false;
      }
    }

    return true;
  }

  function destinoDoEsgotado() {

    for (var i = 0; i < BLACK_POR_TIPO.length; i++) {

      if (temClasse(BLACK_POR_TIPO[i].taxons)) {
        return BLACK_POR_TIPO[i];
      }
    }

    return null;
  }

  // Preço do produto: cheio (cartão), "De" e Pix já mostrados pela loja
  function lerPrecos() {

    var bloco = document.querySelector(SELETORES.preco);

    if (!bloco) {
      return null;
    }

    var por = lerPreco(bloco.querySelector(SELETORES.precoCheio));

    if (!(por > 0)) {

      var precos = bloco.querySelectorAll(SELETORES.precos);

      for (var i = 0; i < precos.length; i++) {

        var v = lerPreco(precos[i]);

        if (v > 0 && !(v <= por)) {
          por = v;
        }
      }
    }

    if (!(por > 0)) {
      return null;
    }

    var pixNativo = lerPreco(bloco.querySelector(SELETORES.precoPix));
    var pix20 = Math.round(por * (1 - CONFIG.descontoPix) * 100) / 100;

    return {
      bloco: bloco,
      de: lerPreco(bloco.querySelector(SELETORES.de)),
      por: por,
      pixNativo: pixNativo > 0 ? pixNativo : NaN,
      // Se a loja já estiver mostrando o Pix com 20%, vale o número dela
      pix20: pixNativo > 0 && pixNativo <= pix20 ? pixNativo : pix20
    };
  }

  var DOT = '<span class="hzbf-dot" aria-hidden="true"></span>';
  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.hzbf-pdp{box-sizing:border-box;width:100%;margin:12px 0 4px;padding:14px 16px;border-radius:12px;background:#000;color:#fff;font:inherit;font-size:13px;line-height:1.35;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-pdp *{box-sizing:border-box}',
    '.hzbf-pdp__top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;margin-bottom:8px}',
    '.hzbf-pdp__tag{display:inline-flex;align-items:center;gap:7px;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.12);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-pdp--ultimo .hzbf-pdp__tag{background:#e5262e;color:#fff}',
    '.hzbf-pdp--ultimo .hzbf-dot{background:#fff}',
    '.hzbf-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',
    '.hzbf-pdp__clock{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:rgba(255,255,255,.72);font-variant-numeric:tabular-nums}',
    '.hzbf-seg{display:inline-flex;align-items:baseline;gap:2px;padding:4px 5px;border-radius:5px;background:rgba(255,255,255,.12);line-height:1}',
    '.hzbf-seg b{color:#fff;font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hzbf-seg i{color:rgba(255,255,255,.6);font-size:8.5px;font-style:normal;font-weight:700;text-transform:uppercase}',

    '.hzbf-pdp__line{margin:0;color:inherit;font-size:15px;line-height:1.3}',
    '.hzbf-pdp__line strong{font-size:22px;font-weight:800;letter-spacing:-.01em;white-space:nowrap}',
    '.hzbf-pdp__note{margin:4px 0 0;color:rgba(255,255,255,.7);font-size:12px}',

    '.hzbf-pdp__ctas{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '.hzbf-pdp__cta{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:999px;background:#fff;color:#000 !important;font-size:12px;font-weight:700;text-decoration:none !important;white-space:nowrap}',
    '.hzbf-pdp__cta--line{background:transparent;color:#fff !important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}',
    '.hzbf-pdp__cta svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    /* Isla: miniatura + barra */
    '.hzbf-pdp__isla{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;align-items:center}',
    '.hzbf-pdp__isla img{display:block;width:48px;height:62px;border-radius:8px;object-fit:cover;background:#efefef}',
    '.hzbf-bar{position:relative;height:6px;margin-top:9px;border-radius:99px;background:rgba(255,255,255,.18);overflow:hidden}',
    '.hzbf-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:99px}',
    '.hzbf-bar .hzbf-bar__com{background:rgba(255,255,255,.4)}',
    '.hzbf-bar .hzbf-bar__sacola{background:#fff}',

    /* Versão discreta (mês da Black e produtos fora da Black) */
    '.hzbf-pdp--leve{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:10px 14px}',
    '.hzbf-pdp--leve .hzbf-pdp__top{margin:0}',
    '.hzbf-pdp--leve .hzbf-pdp__line{font-size:13px}',
    '.hzbf-pdp--leve .hzbf-pdp__line strong{font-size:13px}',
    '.hzbf-pdp--leve a{color:inherit !important;text-decoration:underline !important}',

    /* Modelo 2 - Contorno */
    '.hzbf-pdp.hzbf-m2{background:#fff;color:#111;box-shadow:inset 0 0 0 1.5px #111}',
    '.hzbf-m2 .hzbf-pdp__tag{background:#000;color:#fff}',
    '.hzbf-m2 .hzbf-pdp__clock{color:#555}',
    '.hzbf-m2 .hzbf-seg{background:#f1f1ef}',
    '.hzbf-m2 .hzbf-seg b{color:#000}',
    '.hzbf-m2 .hzbf-seg i{color:#777}',
    '.hzbf-m2 .hzbf-pdp__note{color:#555}',
    '.hzbf-m2 .hzbf-pdp__cta{background:#000;color:#fff !important}',
    '.hzbf-m2 .hzbf-pdp__cta--line{background:#fff;color:#000 !important;box-shadow:inset 0 0 0 1px #000}',
    '.hzbf-m2 .hzbf-bar{background:#e6e6e4}',
    '.hzbf-m2 .hzbf-bar .hzbf-bar__com{background:#bdbdbd}',
    '.hzbf-m2 .hzbf-bar .hzbf-bar__sacola{background:#000}',

    /* Modelo 3 - Faixa compacta */
    '.hzbf-pdp.hzbf-m3{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:10px 12px;border-radius:10px}',
    '.hzbf-m3 .hzbf-pdp__line{font-size:13px}',
    '.hzbf-m3 .hzbf-pdp__line strong{font-size:15px}',
    '.hzbf-m3 .hzbf-pdp__line a{color:#fff !important;font-weight:700;text-decoration:underline !important}',
    '.hzbf-m3 .hzbf-pdp__clock{margin-left:auto;color:#fff;font-weight:800}',
    '.hzbf-m3 .hzbf-bar{flex-basis:100%;margin-top:2px;height:4px}',

    /* Modelo 4 - Recibo */
    '.hzbf-pdp.hzbf-m4{background:#fff;color:#111;border:1.5px dashed #111;border-radius:10px;padding:12px 14px}',
    '.hzbf-m4 .hzbf-pdp__tag{background:#000;color:#fff}',
    '.hzbf-m4 .hzbf-pdp__clock{color:#555}',
    '.hzbf-m4 .hzbf-pdp__clock span{color:#000;font-weight:800}',
    '.hzbf-rec{margin:4px 0 0;padding:0;display:grid;gap:5px}',
    '.hzbf-rec div{display:flex;justify-content:space-between;gap:10px;margin:0;font-size:13px}',
    '.hzbf-rec dt{color:#555;font-weight:400}',
    '.hzbf-rec dd{margin:0;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.hzbf-rec .hzbf-rec__off dd{color:#c81e25}',
    '.hzbf-rec .hzbf-rec__tot{margin-top:3px;padding-top:7px;border-top:1px solid #111;font-size:15px}',
    '.hzbf-rec .hzbf-rec__tot dt{color:#111;font-weight:700}',
    '.hzbf-rec .hzbf-rec__tot dd{font-size:19px;font-weight:800}',
    '.hzbf-rec s{color:#888;margin-right:6px}',
    '.hzbf-m4 .hzbf-pdp__note{color:#555}',
    '.hzbf-m4 .hzbf-pdp__cta{background:#000;color:#fff !important}',
    '.hzbf-m4 .hzbf-pdp__cta--line{background:#fff;color:#000 !important;box-shadow:inset 0 0 0 1px #000}',
    '.hzbf-m4 .hzbf-bar{background:#e6e6e4}',
    '.hzbf-m4 .hzbf-bar .hzbf-bar__com{background:#bdbdbd}',
    '.hzbf-m4 .hzbf-bar .hzbf-bar__sacola{background:#000}',

    /* Ideia 9 - Esgotado */
    '.hzbf-pdp.hzbf-esg{background:#f4f4f2;color:#111;box-shadow:inset 0 0 0 1px #e1e1de}',
    '.hzbf-esg .hzbf-pdp__line{font-size:14px}',
    '.hzbf-esg .hzbf-pdp__line strong{font-size:14px}',
    '.hzbf-esg .hzbf-pdp__cta{background:#000;color:#fff !important}',

    /* Ideia 4: prazo e preço dentro do botão fixo do celular */
    SELETORES.botaoFixo + '.hzbf-com-sub{display:flex !important;flex-direction:column;align-items:center;justify-content:center;line-height:1.1 !important;min-height:52px;padding-top:7px !important;padding-bottom:7px !important}',
    '.hzbf-sub{display:block;margin-top:3px;font-size:11px;font-weight:500;letter-spacing:.01em;text-transform:none;opacity:.92;font-variant-numeric:tabular-nums;white-space:nowrap}'
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
      html += '<a class="hzbf-pdp__cta" href="' + esc(CONFIG.appIos) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar na App Store' + SETA + '</a>';
    }

    if (!ios) {
      html += '<a class="hzbf-pdp__cta' + (android ? '' : ' hzbf-pdp__cta--line') + '" href="' + esc(CONFIG.appAndroid) + '" target="_blank" rel="noopener" data-hzbf-cta>Baixar no Google Play' + SETA + '</a>';
    }

    return html;
  }

  function linkDoApp() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ? CONFIG.appIos : CONFIG.appAndroid;
  }

  function selo(m) {
    return '<span class="hzbf-pdp__tag">' + DOT + esc(m.ultimo ? (m.id === "1111" ? "Últimas horas" : "Último dia") : TAGS[m.id]) + '</span>';
  }

  function relogioHTML() {
    return '<span class="hzbf-pdp__clock">' + (M === 3 ? '' : 'Termina em ') + '<span data-hzbf-timer></span></span>';
  }

  function topo(m, comTimer) {
    return '<div class="hzbf-pdp__top">' + selo(m) + (comTimer ? relogioHTML() : '') + '</div>';
  }

  var BARRA_ISLA = '<div class="hzbf-bar" aria-hidden="true"><i class="hzbf-bar__com" data-hzbf-isla-com></i><i class="hzbf-bar__sacola" data-hzbf-isla-sacola></i></div>';

  // Ideia 9
  function esgotadoHTML(m) {

    var destino = destinoDoEsgotado();
    var nome = destino ? destino.nome : "pares";
    var url = destino ? destino.url + "?sorting%5Bdiscount%5D=desc" : CONFIG.urlBlack;

    return {
      classe: "hzbf-esg",
      html: topo(m, false) +
        '<p class="hzbf-pdp__line">Este par esgotou nos números. <strong>Na Black tem ' + esc(nome) + ' com até 70% OFF.</strong></p>' +
        '<div class="hzbf-pdp__ctas"><a class="hzbf-pdp__cta" href="' + esc(url) + '" data-hzbf-cta>Ver ' + esc(nome) + ' da Black' + SETA + '</a></div>'
    };
  }

  // Modelo 4: a conta em linhas
  function linhaRecibo(rotulo, valor, classe) {
    return '<div' + (classe ? ' class="' + classe + '"' : '') + '><dt>' + rotulo + '</dt><dd>' + valor + '</dd></div>';
  }

  function recibo(p, rotuloDesconto, extra, total) {

    var html = '';

    if (p.de > p.por) {
      html += linhaRecibo("Preço cheio", formatBRL(p.de));
      html += linhaRecibo(rotuloDesconto, "−" + formatBRL(p.de - p.por), "hzbf-rec__off");
    }

    if (extra) {
      html += linhaRecibo(extra.rotulo, "−" + formatBRL(extra.valor), "hzbf-rec__off");
    }

    html += linhaRecibo(total.rotulo, formatBRL(total.valor), "hzbf-rec__tot");

    return '<dl class="hzbf-rec">' + html + '</dl>';
  }

  // Devolve { html, classe } ou null quando a ação não tem nada para este produto
  function conteudo(m, p) {

    var daBlack = produtoDaBlack();
    var prazo = prazoTexto(m.fimReal);

    if (IDEIAS.esgotadoParaBlack && esgotado()) {
      return esgotadoHTML(m);
    }

    if (m.id === "month") {

      // Ideia 3: economia em reais
      if (!daBlack || !(p.de > p.por)) {
        return null;
      }

      if (M === 4) {
        return { html: topo(m, m.ultimo) + recibo(p, "Desconto Black", null, { rotulo: "Você paga", valor: p.por }) };
      }

      return {
        classe: M === 3 ? "" : "hzbf-pdp--leve",
        html: selo(m) + (m.ultimo && M !== 3 ? relogioHTML() : '') +
          '<p class="hzbf-pdp__line">Você economiza <strong>R$ ' + Math.round(p.de - p.por) + '</strong> neste par</p>' +
          (m.ultimo && M === 3 ? relogioHTML() : '')
      };
    }

    if (m.id === "app") {

      if (!daBlack) {
        return null;
      }

      if (M === 3) {
        return {
          html: selo(m) + '<p class="hzbf-pdp__line">No app: <strong>' + formatBRL(p.pix20) + '</strong> no Pix · <a href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>baixar</a></p>' + relogioHTML()
        };
      }

      if (M === 4) {
        return {
          html: topo(m, true) +
            recibo(p, "Desconto Black", { rotulo: "20% no Pix, só no app", valor: p.por - p.pix20 }, { rotulo: "No app, no Pix", valor: p.pix20 }) +
            '<div class="hzbf-pdp__ctas">' + appCtas() + '</div>'
        };
      }

      return {
        html: topo(m, true) +
          '<p class="hzbf-pdp__line">No app, este par sai por <strong>' + formatBRL(p.pix20) + '</strong> no Pix</p>' +
          '<p class="hzbf-pdp__note">20% OFF no Pix só no app Hitzz, até ' + esc(prazo) + '.</p>' +
          '<div class="hzbf-pdp__ctas">' + appCtas() + '</div>'
      };
    }

    if (m.id === "1111") {

      if (p.por <= CONFIG.limite1111) {

        if (M === 3) {
          return { html: selo(m) + '<p class="hzbf-pdp__line">Este par: <strong>' + formatBRL(p.por) + '</strong></p>' + relogioHTML() };
        }

        if (M === 4) {
          return { html: topo(m, true) + recibo(p, "Desconto 11.11", null, { rotulo: "Você paga", valor: p.por }) };
        }

        return {
          html: topo(m, true) +
            '<p class="hzbf-pdp__line">Este par está no 11.11: <strong>' + formatBRL(p.por) + '</strong></p>' +
            '<p class="hzbf-pdp__note">+ de 24 Hitzz por até R$124, só até ' + esc(prazo) + '.</p>'
        };
      }

      return {
        classe: "hzbf-pdp--leve",
        html: selo(m) + '<p class="hzbf-pdp__line">+ de 24 Hitzz por até R$124 · <a href="' + esc(CONFIG.url1111) + '" data-hzbf-cta>ver todos</a></p>'
      };
    }

    if (m.id === "isla") {

      if (ehAIsla()) {
        return {
          html: topo(m, M !== 3) +
            '<p class="hzbf-pdp__line">Esta é a Isla do R$1</p>' +
            '<p class="hzbf-pdp__note">Ela sai por R$1 em compras acima de R$999, até ' + esc(prazo) + '.</p>'
        };
      }

      if (M === 3) {
        return { html: selo(m) + '<p class="hzbf-pdp__line" data-hzbf-isla-txt></p>' + BARRA_ISLA };
      }

      if (M === 4) {
        return {
          html: topo(m, true) +
            '<dl class="hzbf-rec">' +
              linhaRecibo("Sua sacola agora", '<span data-hzbf-sacola></span>') +
              linhaRecibo("Este par", formatBRL(p.por)) +
              linhaRecibo("Com este par", '<span data-hzbf-total></span>', "hzbf-rec__tot") +
              linhaRecibo("Isla Marrom", '<s>' + formatBRL(CONFIG.precoIsla) + '</s>R$ 1,00') +
            '</dl>' +
            '<p class="hzbf-pdp__note" data-hzbf-isla-txt></p>' + BARRA_ISLA
        };
      }

      return {
        html: topo(m, true) +
          '<div class="hzbf-pdp__isla"><a href="' + esc(CONFIG.urlIsla) + '" aria-label="Ver a Isla Marrom"><img src="' + esc(CONFIG.imgIsla) + '" alt="" loading="lazy"></a>' +
          '<div><p class="hzbf-pdp__line" data-hzbf-isla-txt></p>' + BARRA_ISLA + '</div></div>'
      };
    }

    if (m.id === "black") {

      if (!daBlack) {
        return { classe: "hzbf-pdp--leve", html: topo(m, true) };
      }

      if (M === 3) {
        return { html: selo(m) + '<p class="hzbf-pdp__line"><strong>' + formatBRL(p.pix20) + '</strong> no Pix</p>' + relogioHTML() };
      }

      if (M === 4) {
        return {
          html: topo(m, true) +
            recibo(p, "Desconto Black", { rotulo: "20% no Pix", valor: p.por - p.pix20 }, { rotulo: "Você paga no Pix", valor: p.pix20 })
        };
      }

      return {
        html: topo(m, true) +
          '<p class="hzbf-pdp__line"><strong>' + formatBRL(p.pix20) + '</strong> no Pix</p>' +
          '<p class="hzbf-pdp__note">Até 70% OFF + 20% OFF no Pix, só até ' + esc(prazo) + '.</p>'
      };
    }

    return null;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function pontoDeInsercao(blocoPreco) {

    var form = document.querySelector(SELETORES.form);
    var container = blocoPreco.closest(SELETORES.precoContainer);

    // O preço fica numa coluna posicionada no topo do form via order:-1.
    // O primeiro filho do form cai logo abaixo do preço.
    if (
      form &&
      container &&
      form.contains(container) &&
      window.getComputedStyle(form).display.indexOf("flex") !== -1 &&
      parseInt(window.getComputedStyle(container).order, 10) < 0
    ) {
      return { pai: form, antes: form.firstChild, coluna: container };
    }

    return { pai: blocoPreco.parentNode, antes: blocoPreco.nextSibling, coluna: null };
  }

  function montarBloco(m, p) {

    var bloco = document.getElementById(ID);

    if (!bloco) {

      var c = conteudo(m, p);

      if (!c) {
        return;
      }

      bloco = document.createElement("div");

      bloco.id = ID;
      bloco.className = "hzbf-pdp hzbf-m" + M + " hzbf-pdp--" + m.id +
        (m.ultimo ? " hzbf-pdp--ultimo" : "") + (c.classe ? " " + c.classe : "");

      bloco.setAttribute("aria-label", "Black Hitzz");

      bloco.innerHTML = c.html;
    }

    var ponto = pontoDeInsercao(p.bloco);

    // A coluna do preço tem altura fixa e o "ver parcelas" vaza para baixo
    // dela: o bloco desce o quanto vazou para não cobrir o link
    if (ponto.coluna) {

      var margem = (Math.max(0, ponto.coluna.scrollHeight - ponto.coluna.offsetHeight) + 12) + "px";

      if (bloco.style.marginTop !== margem) {
        bloco.style.marginTop = margem;
      }
    }

    // Já está no lugar
    if (ponto.antes === bloco || (bloco.parentNode === ponto.pai && bloco.nextSibling === ponto.antes)) {
      return;
    }

    ponto.pai.insertBefore(bloco, ponto.antes);
  }

  function textoDaIsla(p, curto) {

    var sacola = valorDaSacola();
    var falta = CONFIG.minimoIsla - sacola;

    if (falta <= 0) {
      return curto ? 'Isla por R$1 <strong>liberada</strong> na sua sacola' : 'Sua sacola já liberou a <strong>Isla por R$1</strong>';
    }

    if (sacola + p.por >= CONFIG.minimoIsla) {
      return curto ? 'Este par <strong>libera a Isla por R$1</strong>' : 'Com este par você libera a <strong>Isla Marrom por R$1</strong>';
    }

    return curto
      ? 'Faltam <strong>' + formatBRL(falta) + '</strong> para a Isla por R$1'
      : 'Faltam <strong>' + formatBRL(falta) + '</strong> para a Isla Marrom por R$1. Este par soma ' + formatBRL(p.por) + '.';
  }

  function atualizarIsla(p) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var sacola = valorDaSacola();

    definirHTML(bloco.querySelector("[data-hzbf-isla-txt]"), textoDaIsla(p, M === 3 || M === 4));
    definirTexto(bloco.querySelector("[data-hzbf-sacola]"), formatBRL(sacola));
    definirTexto(bloco.querySelector("[data-hzbf-total]"), formatBRL(sacola + p.por));

    var pct = function (v) {
      return Math.max(0, Math.min(100, v / CONFIG.minimoIsla * 100)).toFixed(1) + "%";
    };

    var barSacola = bloco.querySelector("[data-hzbf-isla-sacola]");
    var barCom = bloco.querySelector("[data-hzbf-isla-com]");

    if (barSacola) {
      barSacola.style.width = pct(sacola);
    }

    if (barCom) {
      barCom.style.width = pct(sacola + p.por);
    }
  }


  /* =========================================================
     IDEIA 4 - BOTÃO FIXO
  ========================================================= */

  function textoDoBotao(m, p) {

    if (!IDEIAS.prazoNoBotao || esgotado()) {
      return "";
    }

    if (m.id === "black" && produtoDaBlack()) {
      return formatBRL(p.pix20) + " no Pix · termina em " + relogio(m.fim, "curto");
    }

    if (m.id === "1111" && p.por <= CONFIG.limite1111) {
      return "11.11 termina em " + relogio(m.fim, "curto");
    }

    if (m.id === "isla" && !ehAIsla()) {

      var falta = CONFIG.minimoIsla - valorDaSacola();

      return falta > 0
        ? "Faltam " + formatBRL(falta) + " para a Isla por R$1"
        : "Isla por R$1 liberada na sua sacola";
    }

    if (m.id === "month" && m.ultimo && produtoDaBlack()) {
      return "Último dia da Black Hitzz";
    }

    return "";
  }

  function atualizarBotaoFixo(m, p) {

    var botao = document.querySelector(SELETORES.botaoFixo);

    if (!botao) {
      return;
    }

    var sub = botao.querySelector(".hzbf-sub");
    var texto = m && p ? textoDoBotao(m, p) : "";

    if (!texto) {

      if (sub) {
        sub.remove();
        botao.classList.remove("hzbf-com-sub");
      }

      return;
    }

    if (!sub) {
      sub = document.createElement("span");
      sub.className = "hzbf-sub";
      botao.appendChild(sub);
      botao.classList.add("hzbf-com-sub");
    }

    definirTexto(sub, texto);
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

    var p = lerPrecos();
    var m = p ? momentoDaAcao() : null;

    var chave = m ? m.id + (m.ultimo ? "+ultimo" : "") + (esgotado() ? "+esgotado" : "") : null;

    if (chave !== estadoRenderizado) {

      var antigo = document.getElementById(ID);

      if (antigo) {
        antigo.remove();
      }

      estadoRenderizado = chave;
    }

    if (m) {
      adicionarEstilo();
    }

    atualizarBotaoFixo(m, p);

    if (!m) {
      return;
    }

    montarBloco(m, p);

    atualizarTimer(m);

    if (m.id === "isla") {
      atualizarIsla(p);
    }
  }


  /* =========================================================
     TIMER
  ========================================================= */

  function atualizarTimer(m) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var html = relogio(m.fim, M === 3 || M === 4 ? "texto" : "blocos");
    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {
      definirHTML(timers[i], html);
    }
  }


  /* =========================================================
     EVENTO DE CLIQUE (para medir no GA / MarketDock)
  ========================================================= */

  document.addEventListener("click", function (event) {

    var link = event.target && event.target.closest &&
      event.target.closest("#" + ID + " [data-hzbf-cta]");

    if (!link) {
      return;
    }

    try {

      var m = momentoDaAcao();

      (window.dataLayer = window.dataLayer || []).push({
        event: "hzbf_clique",
        hzbf_local: esgotado() ? "pdp_esgotado" : "pdp",
        hzbf_acao: m ? m.id : "",
        hzbf_modelo: M,
        hzbf_texto: link.textContent.trim()
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

    // Timer, sacola (Isla) e troca de ação sem recarregar a página
    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
