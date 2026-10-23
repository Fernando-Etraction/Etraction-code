(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 1 - TARJA TOPO
     Acima do header, em todas as páginas. Troca a mensagem
     sozinha conforme a ação da Black que estiver no ar.

     MODELOS
     1  Clássica   preta, selo + contador em blocos + botão
     2  Letreiro   uma linha só, texto correndo e contador fixo
     3  Branca     fundo branco, contador em texto e link sublinhado
     4  Dividida   selo da ação num bloco vermelho à esquerda
  ========================================================= */

  if (window.__hzbfTarjaLoaded) {
    return;
  }

  window.__hzbfTarjaLoaded = true;

  var MODELO = 1;

  var ID = "hzbf-bar";
  var STYLE_ID = "hzbf-bar-style";

  var SELETOR_NAVBAR = ".navbar.navbar-tshop";

  // Quantas horas antes de cada ação a tarja avisa "Começa hoje às 22h".
  // 0 desliga o aviso.
  var AVISO_ANTES_HORAS = 4;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    // Ideia 1: a Black abre pelo maior desconto (ordenação nativa da Uoou)
    urlBlack: "/categorizacao/promo?sorting%5Bdiscount%5D=desc",

    // Trocar pelo link da coleção dos 24 Hitzz do 11.11 quando a cliente criar
    url1111: "/categorizacao/promo?sorting%5Bprice%5D=asc",

    urlIsla: "/isla-chinelo-flat-feminino-marrom",

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
  };

  // Textos de cada ação. Regra de copy (Ogilvy): número, preço e prazo,
  // nada de "imperdível".
  var TEXTOS = {
    month: {
      tag: "Black Hitzz",
      msg: "<strong>Até 70% OFF</strong> na categoria Black",
      cta: "Ver ofertas",
      url: "urlBlack"
    },
    app: {
      tag: "Só no app",
      msg: "<strong>Até 70% OFF + 20% OFF no Pix</strong> no app Hitzz",
      cta: "Baixar o app",
      url: "app"
    },
    "1111": {
      tag: "11.11",
      msg: "<strong>+ de 24 Hitzz por até R$124</strong> por 24 horas",
      cta: "Ver os 24",
      url: "url1111"
    },
    isla: {
      tag: "Isla por R$1",
      msg: "Compras acima de <strong>R$999</strong> levam a <strong>Isla Marrom por R$1</strong>",
      cta: "Ver ofertas",
      url: "urlBlack"
    },
    black: {
      tag: "Black Friday",
      msg: "<strong>Até 70% OFF + 20% OFF no Pix</strong>",
      cta: "Ver ofertas",
      url: "urlBlack"
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

     O script pode ficar instalado desde já: ele liga, troca de
     ação e desliga sozinho, sem recarregar a página.

     Só para conferir antes da data, na URL:
     ?hzbf=month | app | 1111 | isla | black
     ?hzbf=black:ultimo   força o "último dia"
     ?hzbf=app:antes      força o aviso "começa hoje às 22h"
     ?hzbf=off            volta ao calendário
     ?hzbfm=1 a 4         mostra outro modelo (?hzbfm=off volta ao MODELO daqui)
  ========================================================= */

  // Horário de Brasília (UTC-3), independente do relógio do visitante
  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  // Para a Black Friday ir até 30/11, troque por brasilia(2026, 12, 1, 0)
  var FIM_BLACK_FRIDAY = brasilia(2026, 11, 30, 0); // 29/11 23h59

  // Vale a primeira ação da lista que estiver no ar. "month" é a base e fica por último.
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
          antes: partes[1] === "antes",
          // No preview o timer conta um prazo de exemplo
          fim: Date.now() + (ultimo ? 5 * 3600000 + 42 * 60000 : 2 * 86400000 + 5 * 3600000)
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

  // Devolve { id, ultimo, antes, fim } ou null fora da Black
  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();
    var antes = AVISO_ANTES_HORAS * 3600000;

    for (var i = 0; i < AGENDA.length; i++) {

      var acao = AGENDA[i];

      if (agora >= acao.inicio && agora < acao.fim) {
        return {
          id: acao.id,
          ultimo: acao.fim - agora <= acao.ultimoHoras * 3600000,
          antes: false,
          fim: acao.fim
        };
      }

      // Aviso de abertura: só para as ações por cima da base
      if (acao.id !== "month" && antes > 0 && agora >= acao.inicio - antes && agora < acao.inicio) {
        return { id: acao.id, ultimo: false, antes: true, fim: acao.inicio };
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

  function semTags(html) {
    return String(html).replace(/<[^>]+>/g, "");
  }

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function linkDoApp() {

    var ua = navigator.userAgent || "";

    if (/iPhone|iPad|iPod/i.test(ua)) {
      return CONFIG.appIos;
    }

    return CONFIG.appAndroid;
  }

  function urlDoCta(chave) {
    return chave === "app" ? linkDoApp() : CONFIG[chave];
  }

  function textoDoSelo(m) {

    if (m.ultimo) {
      return m.id === "1111" ? "Últimas horas" : "Último dia";
    }

    return TEXTOS[m.id].tag;
  }

  // Na base do mês o timer só aparece no último dia (30/11)
  function temTimer(m) {
    return m.antes || m.id !== "month" || m.ultimo;
  }

  var DOT = '<span class="hzbf-dot" aria-hidden="true"></span>';
  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.hzbf-bar{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 16px;width:100%;min-height:46px;margin:0;padding:8px 16px;background:#000;color:#fff;font:inherit;font-size:13px;font-weight:400;line-height:1.3;letter-spacing:.02em;text-transform:none;text-align:center;position:relative;z-index:2;-webkit-font-smoothing:antialiased}',
    '.hzbf-bar *{box-sizing:border-box}',

    /* Selo da ação */
    '.hzbf-bar__tag{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-bar--ultimo .hzbf-bar__tag{background:#e5262e}',
    '.hzbf-bar--ultimo .hzbf-dot{background:#fff}',

    '.hzbf-bar__msg{color:rgba(255,255,255,.86)}',
    '.hzbf-bar__msg strong{color:#fff;font-weight:800}',

    /* Timer */
    '.hzbf-bar__timer{display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,.72);font-size:12px;white-space:nowrap}',
    '.hzbf-bar__clock{display:inline-flex;align-items:center;gap:4px;font-variant-numeric:tabular-nums}',
    '.hzbf-seg{display:inline-flex;align-items:baseline;gap:2px;padding:5px 6px;border-radius:6px;background:rgba(255,255,255,.12);line-height:1}',
    '.hzbf-seg b{color:#fff;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hzbf-seg i{color:rgba(255,255,255,.6);font-size:9px;font-style:normal;font-weight:700;text-transform:uppercase}',

    /* Botão */
    '.hzbf-bar__cta{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 14px;border-radius:999px;background:#fff;color:#000 !important;font-size:12px;font-weight:700;line-height:1;text-decoration:none !important;white-space:nowrap;transition:background-color .15s}',
    '.hzbf-bar__cta:hover{background:#ececec}',
    '.hzbf-bar__cta:focus-visible{outline:2px solid #fff;outline-offset:3px}',
    '.hzbf-bar__cta svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',

    '.hzbf-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',

    /* Modelo 2 - Letreiro */
    '.hzbf-bar.hzbf-m2{display:block;min-height:0;height:38px;padding:0;overflow:hidden}',
    '.hzbf-run{position:absolute;inset:0;display:flex;align-items:center;overflow:hidden;color:#fff !important;text-decoration:none !important}',
    '.hzbf-run__track{display:inline-flex;white-space:nowrap;animation:hzbf-run 26s linear infinite}',
    '.hzbf-run__item{display:inline-flex;align-items:center;gap:10px;padding-right:28px;font-size:12.5px;color:rgba(255,255,255,.88)}',
    '.hzbf-run__item b{font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff}',
    '.hzbf-run__item::after{content:"";width:5px;height:5px;border-radius:50%;background:#e5262e;margin-left:18px}',
    '@keyframes hzbf-run{to{transform:translateX(-50%)}}',
    '.hzbf-run__fix{position:absolute;right:0;top:0;bottom:0;display:flex;align-items:center;gap:6px;padding:0 14px 0 26px;background:linear-gradient(90deg,rgba(0,0,0,0),#000 22px);color:#fff;font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.hzbf-bar--ultimo .hzbf-run__fix{color:#ff6b6f}',

    /* Modelo 3 - Branca */
    '.hzbf-bar.hzbf-m3{background:#fff;color:#111;border-bottom:1px solid #e6e6e6}',
    '.hzbf-m3 .hzbf-bar__tag{background:#000;color:#fff}',
    '.hzbf-m3 .hzbf-bar__msg{color:#333}',
    '.hzbf-m3 .hzbf-bar__msg strong{color:#000}',
    '.hzbf-m3 .hzbf-bar__timer{color:#555}',
    '.hzbf-m3 .hzbf-bar__clock{color:#000;font-weight:800;font-size:13px}',
    '.hzbf-m3 .hzbf-bar__cta{height:auto;padding:0;border-radius:0;background:none;color:#000 !important;text-decoration:underline !important;text-underline-offset:3px}',
    '.hzbf-m3 .hzbf-bar__cta:hover{background:none}',

    /* Modelo 4 - Dividida */
    '.hzbf-bar.hzbf-m4{display:grid;grid-template-columns:auto minmax(0,1fr);gap:0;padding:0;align-items:stretch}',
    '.hzbf-bar__side{display:flex;align-items:center;justify-content:center;max-width:120px;padding:8px 16px;background:#e5262e;color:#fff;font-size:12px;font-weight:900;line-height:1.05;letter-spacing:.1em;text-transform:uppercase;text-align:center}',
    '.hzbf-bar--ultimo .hzbf-bar__side{background:#fff;color:#e5262e}',
    '.hzbf-bar__body{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 14px;padding:8px 14px;min-width:0}',

    /* Mobile: mensagem na primeira linha; selo, timer e botão na segunda */
    '@media (max-width:600px){',
    '.hzbf-bar{gap:7px 10px;padding:9px 12px;font-size:12px}',
    '.hzbf-bar__msg{flex-basis:100%;order:1}',
    '.hzbf-bar__tag,.hzbf-bar__timer,.hzbf-bar__cta{order:2}',
    '.hzbf-bar__tag{padding:5px 9px;letter-spacing:.12em}',
    '.hzbf-lg{display:none}',
    /* Com timer: selo, timer e botão compactos para caber numa linha só */
    '.hzbf-bar--timer{gap:7px 6px}',
    '.hzbf-bar--timer .hzbf-bar__cta{height:28px;padding:0 9px;gap:4px;font-size:11.5px}',
    '.hzbf-bar--timer .hzbf-bar__tag{padding:4px 7px;gap:5px;letter-spacing:.05em}',
    '.hzbf-bar__clock{gap:3px}',
    '.hzbf-seg{padding:4px 3px}',
    '.hzbf-seg b{font-size:12px}',
    '.hzbf-m3.hzbf-bar--timer .hzbf-bar__cta{height:auto;padding:0}',
    '.hzbf-bar.hzbf-m4{padding:0}',
    '.hzbf-bar__side{max-width:86px;padding:8px 10px;font-size:11px}',
    '.hzbf-bar__body{gap:6px 10px;padding:8px 10px}',
    '.hzbf-m4 .hzbf-bar__msg{flex-basis:100%}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hzbf-bar__cta{transition:none}.hzbf-run__track{animation:none}}'
  ].join("");


  /* =========================================================
     HTML
  ========================================================= */

  function timerHTML(m, rotulo) {
    return '<span class="hzbf-bar__timer"><span class="hzbf-lg">' + rotulo + '</span><span class="hzbf-bar__clock" data-hzbf-timer></span></span>';
  }

  function ctaHTML(t) {
    return '<a class="hzbf-bar__cta" href="' + esc(urlDoCta(t.url)) + '" data-hzbf-cta' +
      (t.url === "app" ? ' target="_blank" rel="noopener"' : '') + '>' + esc(t.cta) + SETA + '</a>';
  }

  function msgHTML(m, t) {
    return '<span class="hzbf-bar__msg">' + (m.antes ? 'Começa hoje às 22h: ' : '') + t.msg + '</span>';
  }

  // Modelo 2: uma linha correndo, contador fixo à direita
  function letreiroHTML(m, t) {

    var texto = (m.antes ? "Começa hoje às 22h: " : "") + semTags(t.msg);
    var item = '<span class="hzbf-run__item"><b>' + esc(textoDoSelo(m)) + '</b>' + esc(texto) + '</span>';
    var metade = item + item + item + item;

    var fixo = temTimer(m)
      ? '<span class="hzbf-run__fix">' + (m.antes ? 'Faltam ' : '') + '<span data-hzbf-timer></span></span>'
      : '<span class="hzbf-run__fix">' + esc(t.cta) + ' →</span>';

    return '<a class="hzbf-run" href="' + esc(urlDoCta(t.url)) + '" data-hzbf-cta' +
      (t.url === "app" ? ' target="_blank" rel="noopener"' : '') + '>' +
      '<span class="hzbf-run__track">' + metade + metade + '</span>' + fixo + '</a>';
  }

  function barHTML(m) {

    var t = TEXTOS[m.id];

    if (M === 2) {
      return letreiroHTML(m, t);
    }

    var timer = temTimer(m) ? timerHTML(m, m.antes ? "Faltam" : (M === 3 ? "termina em" : "Termina em")) : '';
    var cta = m.antes ? '' : ctaHTML(t);

    if (M === 4) {
      return '<span class="hzbf-bar__side">' + esc(textoDoSelo(m)) + '</span>' +
        '<span class="hzbf-bar__body">' + msgHTML(m, t) + timer + cta + '</span>';
    }

    return '<span class="hzbf-bar__tag">' + DOT + esc(textoDoSelo(m)) + '</span>' + msgHTML(m, t) + timer + cta;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function montarBloco(m) {

    var navbar = document.querySelector(SELETOR_NAVBAR);

    if (!navbar || !navbar.parentNode) {
      return;
    }

    var barra = document.getElementById(ID);

    if (!barra) {

      barra = document.createElement("div");

      barra.id = ID;
      barra.className = "hzbf-bar hzbf-m" + M + " hzbf-bar--" + m.id +
        (m.ultimo ? " hzbf-bar--ultimo" : "") +
        (temTimer(m) ? " hzbf-bar--timer" : "");

      barra.setAttribute("role", "region");
      barra.setAttribute("aria-label", "Black Hitzz");

      barra.innerHTML = barHTML(m);
    }

    if (barra.nextElementSibling !== navbar) {
      navbar.parentNode.insertBefore(barra, navbar);
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

    // Redesenha quando muda a ação, o "último dia" ou o aviso de abertura
    var chave = m ? m.id + (m.ultimo ? "+ultimo" : "") + (m.antes ? "+antes" : "") : null;

    if (chave !== estadoRenderizado) {

      var antigo = document.getElementById(ID);

      if (antigo) {
        antigo.remove();
      }

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

    // Modelos 2 e 3 usam o contador em texto
    var html = M === 2 || M === 3
      ? (dias > 0 ? dias + "d " : "") + doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s)
      : (dias > 0 ? seg(dias, "d") : "") + seg(h, "h") + seg(min, "m") + seg(s, "s");

    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i]._hzbfHtml !== html) {
        timers[i]._hzbfHtml = html;
        timers[i].innerHTML = html;
      }
    }
  }


  /* =========================================================
     EVENTO DE CLIQUE (para medir no GA / MarketDock)
  ========================================================= */

  document.addEventListener("click", function (event) {

    var link =
      event.target &&
      event.target.closest &&
      event.target.closest("#" + ID + " [data-hzbf-cta]");

    if (!link) {
      return;
    }

    try {

      var m = momentoDaAcao();

      (window.dataLayer = window.dataLayer || []).push({
        event: "hzbf_clique",
        hzbf_local: "tarja",
        hzbf_acao: m ? m.id : "",
        hzbf_modelo: M
      });

    } catch (erro) { }
  });


  /* =========================================================
     OBSERVER
     Recoloca o bloco após alterações da página (AJAX)
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

    // Atualiza o timer e troca de ação sem recarregar a página
    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
