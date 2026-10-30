(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 4 - PÁGINA DE PRODUTO
     Bloco logo abaixo do preço. Cada ação tem o seu conceito, o mesmo
     dos outros códigos, sempre com o valor final já calculado:

     Black Hitzz   a caixa Black: fita de lacre, quanto ela economiza e o
                   preço garantido até 23h59 (garantia de preço)
     Só no app     "no site × no app": o preço do app em destaque
     11.11         cartão de embarque com o preço e o relógio
     Isla por R$1  preço riscado e o R$1 grande: quanto falta com este par
     Black Friday  cotação do par em queda, "travada até 23h59"

     A garantia (Black Hitzz e Black Friday) vai até 23h59 de hoje, ou
     até o fim da ação se for antes: nunca passa de 24h e é igual para
     todo mundo.

     IDEIAS (liga/desliga em IDEIAS)
     4   no celular, prazo e preço final dentro do botão fixo "Comprar agora"
     9   produto esgotado em todos os números leva para a mesma categoria
         dentro da Black

     As classes deste código começam com "hzbfp-" para não trombar
     com as dos outros códigos da Black, que rodam na mesma página.
  ========================================================= */

  if (window.__hzbfPdpLoaded) {
    return;
  }

  window.__hzbfPdpLoaded = true;

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
    titulo: "h1.product-title",
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

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
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

  // "23h59" ou "8h", a partir do fim (exclusivo)
  function horaDoFim(fim) {
    var d = new Date(fim - 3 * 3600000);
    return d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? "23h59" : d.getUTCHours() + "h";
  }

  // Dia de novembro (1 a 30), para o "Dia 12/30"
  function diaDaBlack() {
    var d = new Date(Date.now() - 3 * 3600000);
    return d.getUTCMonth() === 10 ? d.getUTCDate() : 1;
  }

  // Garantia de preço: até 23h59 de hoje (Brasília) ou até o fim da ação
  function fimDaGarantia(m) {

    var hoje = new Date(Date.now() - 3 * 3600000);
    var meiaNoite = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() + 1, 3);

    return Math.min(m.fim, meiaNoite);
  }

  function partesDoTempo(fim) {

    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));

    return {
      total: restante,
      dias: Math.floor(restante / 86400),
      h: Math.floor(restante % 86400 / 3600),
      min: Math.floor(restante % 3600 / 60),
      s: restante % 60
    };
  }

  // "2d 04h59" no botão fixo; "2d 04:59:58" no texto
  function relogio(fim, curto) {

    var t = partesDoTempo(fim);

    if (curto) {
      return t.dias > 0
        ? t.dias + "d " + doisDigitos(t.h) + "h" + doisDigitos(t.min)
        : doisDigitos(t.h) + ":" + doisDigitos(t.min) + ":" + doisDigitos(t.s);
    }

    return (t.dias > 0 ? t.dias + "d " : "") + doisDigitos(t.h) + ":" + doisDigitos(t.min) + ":" + doisDigitos(t.s);
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

  // "BOTA FEMININA ... - NARI" -> "NARI"
  function nomeDoProduto() {

    var h1 = document.querySelector(SELETORES.titulo);
    var partes = String(h1 ? h1.textContent : "").split(" - ");
    var curto = partes[0];

    for (var i = 1; i < partes.length; i++) {

      if (partes[i].length < curto.length) {
        curto = partes[i];
      }
    }

    return curto.trim() || "este par";
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

  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var CADEADO = '<svg class="hzbfp-svg" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace';

  var CSS = [
    '.hzbf-pdp{box-sizing:border-box;width:100%;margin:12px 0 4px;color:#111;font:inherit;font-size:13px;line-height:1.35;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-pdp *{box-sizing:border-box}',
    '.hzbf-pdp p{margin:0}',
    '.hzbf-pdp a{text-decoration:none !important}',
    '.hzbfp-svg{width:14px;height:14px;flex:0 0 14px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.hzbfp-seg{display:inline-flex;align-items:baseline;gap:2px;padding:4px 5px;border-radius:5px;background:rgba(255,255,255,.14);color:#fff;font-size:12.5px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}',
    '.hzbfp-seg i{font-size:8.5px;font-style:normal;opacity:.6}',
    '.hzbfp-segs{display:inline-flex;gap:3px}',
    '.hzbfp-btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 15px;border-radius:999px;background:#000;color:#fff !important;font-size:12.5px;font-weight:700;white-space:nowrap}',
    '.hzbfp-btn--linha{background:#fff;color:#000 !important;box-shadow:inset 0 0 0 1.5px #000}',
    '.hzbfp-btn svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    /* Black Hitzz - a caixa Black: fita de lacre em cima */
    '.hzbfp-cx{overflow:hidden;border-radius:12px;background:#000;color:#fff}',
    '.hzbfp-cx__fita{display:block;height:6px;background:repeating-linear-gradient(-45deg,#fff 0 6px,#000 6px 12px)}',
    '.hzbfp-cx__in{padding:11px 14px 12px}',
    '.hzbfp-cx__topo{display:flex;justify-content:space-between;gap:8px;color:rgba(255,255,255,.7);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.hzbfp-cx__eco{margin-top:6px !important;font-size:14px}',
    '.hzbfp-cx__eco b{color:#ff4b52;font-size:22px;font-weight:900;white-space:nowrap}',
    '.hzbfp-cx__gar{display:flex;align-items:center;gap:6px;margin-top:9px !important;padding-top:9px;border-top:1px solid rgba(255,255,255,.12);font-size:12px}',
    '.hzbfp-cx__gar b{font-variant-numeric:tabular-nums}',

    /* Só no app - no site × no app */
    '.hzbfp-push{display:flex;gap:10px;padding:11px 12px;border-radius:14px;background:#1c1c1e;color:#fff}',
    '.hzbfp-push__ic{display:flex;align-items:center;justify-content:center;flex:0 0 30px;width:30px;height:30px;border-radius:8px;background:#000;box-shadow:inset 0 0 0 1px #3a3a3c;font-size:16px;font-weight:800}',
    '.hzbfp-push__txt{min-width:0;line-height:1.3}',
    '.hzbfp-push__txt small{display:block;color:#9a9a9a;font-size:10.5px}',
    '.hzbfp-push__txt b{display:block;margin-top:2px;font-size:14px}',
    '.hzbfp-push__txt em{color:#ff4b52;font-style:normal;white-space:nowrap}',
    '.hzbfp-push__txt span{display:block;margin-top:2px;color:#cfcfcf;font-size:12px}',
    '.hzbfp-push+.hzbfp-botoes{margin-top:10px}',
    '.hzbfp-botoes{display:flex;flex-wrap:wrap;gap:8px}',

    /* 11.11 - cartão de embarque */
    '.hzbfp-pass{display:grid;grid-template-columns:minmax(0,1fr) 104px;overflow:hidden;border:1.5px solid #000;border-radius:12px}',
    '.hzbfp-pass__l{padding:10px 12px}',
    '.hzbfp-pass__l small,.hzbfp-pass__r small{display:block;color:#777;' + MONO + ';font-size:9px;letter-spacing:.1em;text-transform:uppercase}',
    '.hzbfp-pass__titulo{margin:3px 0 8px !important;font-size:16px;font-weight:800;line-height:1.2}',
    '.hzbfp-pass__g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;' + MONO + ';font-size:11.5px;font-weight:700}',
    '.hzbfp-pass__g small{font-weight:500}',
    '.hzbfp-pass__r{position:relative;padding:10px 8px;border-left:2px dashed #fff;background:#000;color:#fff;text-align:center}',
    '.hzbfp-pass__r small{color:#aaa}',
    '.hzbfp-pass__r b{display:block;margin:4px 0 7px;' + MONO + ';font-size:14px;font-variant-numeric:tabular-nums}',
    '.hzbfp-faixa{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:10px;background:#000;color:#fff !important;font-size:12.5px}',
    '.hzbfp-faixa b{' + MONO + '}',

    /* Isla - preço riscado e o R$1 grande */
    '.hzbfp-isla{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;align-items:center;padding:12px 14px;border-radius:12px;background:#000;color:#fff}',
    '.hzbfp-isla__preco{line-height:1}',
    '.hzbfp-isla__preco small{display:block;color:rgba(255,255,255,.7);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.hzbfp-isla__preco s{display:block;margin-top:4px;color:rgba(255,255,255,.55);font-size:13px;font-weight:700}',
    '.hzbfp-isla__preco b{display:block;color:#ff4b52;font-size:44px;font-weight:900;letter-spacing:-.04em}',
    '.hzbfp-isla__txt{color:rgba(255,255,255,.85);font-size:12.5px;line-height:1.35}',
    '.hzbfp-isla__txt b{color:#fff;white-space:nowrap}',

    /* Black Friday - cotação */
    '.hzbfp-cot{padding:12px 13px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:radial-gradient(110% 150% at 100% 0%,rgba(255,255,255,.14) 0%,rgba(255,255,255,0) 52%),linear-gradient(160deg,#1b1b1b 0%,#080808 58%,#000 100%);color:#fff}',
    '.hzbfp-cot__topo{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.6);' + MONO + ';font-size:10px;letter-spacing:.12em;text-transform:uppercase}',
    '.hzbfp-aovivo{display:inline-flex;align-items:center;gap:5px;color:#fff;font-family:inherit;font-weight:800}',
    '.hzbfp-aovivo i{width:6px;height:6px;border-radius:50%;background:#e5262e;animation:hzbfp-pisca 1.4s infinite}',
    '@keyframes hzbfp-pisca{50%{opacity:.25}}',
    '.hzbfp-cot__meio{display:flex;align-items:center;gap:12px;padding:9px 0}',
    '.hzbfp-cot__meio b{font-size:23px;font-weight:800;letter-spacing:-.02em;white-space:nowrap}',
    '.hzbfp-cot__meio small{display:block;color:rgba(255,255,255,.6);font-size:12px}',
    '.hzbfp-cot__meio em{display:block;margin-top:3px;color:#ff4b52;' + MONO + ';font-size:11.5px;font-style:normal;font-weight:700}',
    '.hzbfp-cot__meio svg{flex:1;min-width:60px;height:42px}',
    '.hzbfp-cot__pe{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:9px;border-top:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.82);font-size:12px}',
    '.hzbfp-cot__pe span:first-child{display:inline-flex;align-items:center;gap:6px}',

    /* Ideia 9 - Esgotado */
    '.hzbfp-esg{padding:12px 14px;border-radius:12px;background:#f4f4f2;box-shadow:inset 0 0 0 1px #e1e1de}',
    '.hzbfp-esg p{font-size:14px}',
    '.hzbfp-esg .hzbfp-btn{margin-top:10px}',

    /* Ideia 4: prazo e preço dentro do botão fixo do celular */
    SELETORES.botaoFixo + '.hzbfp-com-sub{display:flex !important;flex-direction:column;align-items:center;justify-content:center;line-height:1.1 !important;min-height:52px;padding-top:7px !important;padding-bottom:7px !important}',
    '.hzbfp-sub{display:block;margin-top:3px;font-size:11px;font-weight:500;letter-spacing:.01em;text-transform:none;opacity:.92;font-variant-numeric:tabular-nums;white-space:nowrap}',

    '@media (prefers-reduced-motion:reduce){.hzbfp-aovivo i{animation:none}}'
  ].join("");


  /* =========================================================
     HTML - UM CONCEITO POR AÇÃO
  ========================================================= */

  function appBotoes() {

    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/i.test(ua);
    var android = /Android/i.test(ua);
    var html = '';

    if (!android) {
      html += '<a class="hzbfp-btn" href="' + esc(CONFIG.appIos) + '" target="_blank" rel="noopener" data-hzbf-cta>Abrir na App Store' + SETA + '</a>';
    }

    if (!ios) {
      html += '<a class="hzbfp-btn' + (android ? '' : ' hzbfp-btn--linha') + '" href="' + esc(CONFIG.appAndroid) + '" target="_blank" rel="noopener" data-hzbf-cta>Abrir no Google Play' + SETA + '</a>';
    }

    return html;
  }

  // Ideia 9
  function esgotadoHTML() {

    var destino = destinoDoEsgotado();
    var nome = destino ? destino.nome : "pares";
    var url = destino ? destino.url + "?sorting%5Bdiscount%5D=desc" : CONFIG.urlBlack;

    return {
      classe: "hzbfp-esg",
      html: '<p>Este par esgotou nos números. <strong>Na Black tem ' + esc(nome) + ' com até 70% OFF.</strong></p>' +
        '<a class="hzbfp-btn" href="' + esc(url) + '" data-hzbf-cta>Ver ' + esc(nome) + ' da Black' + SETA + '</a>'
    };
  }

  var CONCEITOS = {

    // Black Hitzz: a caixa Black, com quanto ela economiza e o preço garantido até 23h59
    month: function (m, p) {

      if (!produtoDaBlack() || !(p.de > p.por)) {
        return null;
      }

      var pix = p.pixNativo > 0 ? p.pixNativo : p.por;

      return {
        html: '<div class="hzbfp-cx"><i class="hzbfp-cx__fita" aria-hidden="true"></i><div class="hzbfp-cx__in">' +
          '<p class="hzbfp-cx__topo"><span>Black Hitzz</span><span>' + (m.ultimo ? 'Último dia' : 'Dia ' + doisDigitos(diaDaBlack()) + '/30') + '</span></p>' +
          '<p class="hzbfp-cx__eco">Você economiza <b>' + formatBRL(p.de - pix) + '</b> neste par</p>' +
          '<p class="hzbfp-cx__gar">' + CADEADO + 'Preço garantido até 23h59 · <b data-hzbf-garantia></b></p>' +
        '</div></div>'
      };
    },

    // Só no app: o preço do site riscado e o do app em destaque
    app: function (m, p) {

      if (!produtoDaBlack()) {
        return null;
      }

      // Quanto ela economiza a mais no app, em cima do Pix que o site já mostra
      var aMais = (p.pixNativo > 0 ? p.pixNativo : p.por) - p.pix20;

      return {
        html: '<div class="hzbfp-push"><span class="hzbfp-push__ic" aria-hidden="true">h</span><div class="hzbfp-push__txt">' +
          '<small>HITZZ · só no app, até ' + esc(prazoTexto(m.fimReal)) + '</small>' +
          '<b>No app você economiza mais <em>' + formatBRL(aMais) + '</em> neste par</b>' +
          '<span>20% OFF no Pix, só no app Hitzz.</span>' +
        '</div></div>' +
        '<div class="hzbfp-botoes">' + appBotoes() + '</div>'
      };
    },

    // 11.11: cartão de embarque
    "1111": function (m, p) {

      if (p.por > CONFIG.limite1111) {
        return {
          html: '<a class="hzbfp-faixa" href="' + esc(CONFIG.url1111) + '" data-hzbf-cta><span>✈ 11.11: + de 24 Hitzz por até R$124</span><b>Ver →</b></a>'
        };
      }

      return {
        html: '<div class="hzbfp-pass">' +
          '<div class="hzbfp-pass__l"><small>Cartão de embarque · 11.11</small>' +
            '<p class="hzbfp-pass__titulo">Este Hitzz embarca no 11.11</p>' +
            '<div class="hzbfp-pass__g">' +
              '<div><small>Economia</small>' + (p.de > p.por ? '−' + formatBRL(p.de - p.por) : '—') + '</div>' +
              '<div><small>Embarque</small>até ' + horaDoFim(m.fimReal) + '</div>' +
              '<div><small>Assento</small>seu nº</div>' +
            '</div></div>' +
          '<div class="hzbfp-pass__r"><small>' + (m.ultimo ? 'Últimas horas' : 'Encerra em') + '</small><b data-hzbf-timer></b></div>' +
        '</div>'
      };
    },

    // Isla: o preço cheio riscado, o R$1 grande e quanto falta
    isla: function () {
      return {
        html: '<div class="hzbfp-isla">' +
          '<p class="hzbfp-isla__preco"><small>Isla Marrom</small><s>' + formatBRL(CONFIG.precoIsla) + '</s><b>R$1</b></p>' +
          '<p class="hzbfp-isla__txt" data-hzbf-falta></p>' +
        '</div>'
      };
    },

    // Black Friday: cotação do par em queda, travada até 23h59
    black: function (m, p) {

      if (!produtoDaBlack()) {
        return {
          html: '<a class="hzbfp-faixa" href="' + esc(CONFIG.urlBlack) + '" data-hzbf-cta><span>▼ Black Friday · fecha em <b data-hzbf-timer></b></span><b>Ver →</b></a>'
        };
      }

      var de = p.de > p.por ? p.de : p.por;
      var queda = de - p.pix20;

      return {
        html: '<div class="hzbfp-cot">' +
          '<div class="hzbfp-cot__topo"><span>Cotação · ' + esc(nomeDoProduto()) + '</span><span class="hzbfp-aovivo"><i aria-hidden="true"></i>Ao vivo</span></div>' +
          '<div class="hzbfp-cot__meio"><div><small>Você economiza</small><b>' + formatBRL(queda) + '</b>' +
            '<em>▼ ' + Math.round(queda / de * 100) + '% no Pix</em></div>' +
            '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,4 18,8 32,7 46,18 60,16 74,28 88,30 100,36" fill="none" stroke="#e5262e" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>' +
          '</div>' +
          '<div class="hzbfp-cot__pe"><span>' + CADEADO +
            (m.ultimo ? 'Último dia: travada até 23h59' : 'Cotação travada até 23h59') + '</span><span class="hzbfp-segs" data-hzbf-garantia-segs></span></div>' +
        '</div>'
      };
    }
  };

  // Devolve { html, classe } ou null quando a ação não tem nada para este produto
  function conteudo(m, p) {

    if (IDEIAS.esgotadoParaBlack && esgotado()) {
      return esgotadoHTML();
    }

    return CONCEITOS[m.id](m, p);
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
      bloco.className = "hzbf-pdp hzbf-pdp--" + m.id + (m.ultimo ? " hzbf-pdp--ultimo" : "") + (c.classe ? " " + c.classe : "");

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

  // Isla: a sacola de verdade e quanto falta (com este par, fora da página da Isla)
  function atualizarIsla(bloco, p) {

    var sacola = valorDaSacola();
    var comEste = ehAIsla() ? sacola : sacola + p.por;
    var falta = CONFIG.minimoIsla - comEste;
    var texto;

    if (sacola >= CONFIG.minimoIsla) {
      texto = 'Sua sacola já passou de R$999: <b>a Isla sai por R$1</b>.';
    } else if (ehAIsla()) {
      texto = 'Em compras acima de R$999. Sua sacola: <b>' + formatBRL(sacola) + '</b>, faltam <b>' + formatBRL(falta) + '</b>.';
    } else if (falta > 0) {
      texto = 'Em compras acima de R$999. Com este par, sua sacola fica em <b>' + formatBRL(comEste) + '</b>: faltam <b>' + formatBRL(falta) + '</b>.';
    } else {
      texto = 'Com este par, sua sacola passa de R$999: <b>a Isla sai por R$1</b>.';
    }

    definirHTML(bloco.querySelector("[data-hzbf-falta]"), texto);
  }


  /* =========================================================
     IDEIA 4 - BOTÃO FIXO
  ========================================================= */

  function textoDoBotao(m, p) {

    if (!IDEIAS.prazoNoBotao || esgotado()) {
      return "";
    }

    if (m.id === "black" && produtoDaBlack()) {
      var economia = (p.de > p.por ? p.de : p.por) - p.pix20;
      return "Você economiza " + formatBRL(economia) + " · fecha em " + relogio(m.fim, true);
    }

    if (m.id === "1111" && p.por <= CONFIG.limite1111) {
      return "11.11 encerra em " + relogio(m.fim, true);
    }

    if (m.id === "isla" && !ehAIsla()) {

      var falta = CONFIG.minimoIsla - valorDaSacola();

      return falta > 0
        ? "Faltam " + formatBRL(falta) + " para a Isla por R$1"
        : "Isla por R$1 liberada na sua sacola";
    }

    if (m.id === "month" && produtoDaBlack()) {
      return m.ultimo ? "Último dia da Black Hitzz" : "Preço garantido até 23h59";
    }

    return "";
  }

  function atualizarBotaoFixo(m, p) {

    var botao = document.querySelector(SELETORES.botaoFixo);

    if (!botao) {
      return;
    }

    var sub = botao.querySelector(".hzbfp-sub");
    var texto = m && p ? textoDoBotao(m, p) : "";

    if (!texto) {

      if (sub) {
        sub.remove();
        botao.classList.remove("hzbfp-com-sub");
      }

      return;
    }

    if (!sub) {
      sub = document.createElement("span");
      sub.className = "hzbfp-sub";
      botao.appendChild(sub);
      botao.classList.add("hzbfp-com-sub");
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

    atualizarTimer(m, p);
  }


  /* =========================================================
     TIMER
  ========================================================= */

  function atualizarTimer(m, p) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var texto = relogio(m.fim);
    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {
      definirTexto(timers[i], texto);
    }

    // Garantia: nunca passa de 24h, então são só horas, minutos e segundos
    var g = partesDoTempo(fimDaGarantia(m));
    var garantia = doisDigitos(g.dias * 24 + g.h) + ":" + doisDigitos(g.min) + ":" + doisDigitos(g.s);

    definirTexto(bloco.querySelector("[data-hzbf-garantia]"), garantia);

    function seg(valor, rotulo) {
      return '<span class="hzbfp-seg">' + doisDigitos(valor) + '<i>' + rotulo + '</i></span>';
    }

    definirHTML(bloco.querySelector("[data-hzbf-garantia-segs]"),
      seg(g.dias * 24 + g.h, "H") + seg(g.min, "M") + seg(g.s, "S"));

    if (m.id === "isla") {
      atualizarIsla(bloco, p);
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
