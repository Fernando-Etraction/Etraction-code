(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 1 - TARJA TOPO
     Acima do header, em todas as páginas. Cada ação da Black tem
     o seu conceito, o mesmo nos 5 códigos:

     Black Hitzz   a caixa Black: fita de lacre + "Dia 12/30"
     Só no app     a notificação: um push do app Hitzz
     11.11         o painel de embarque: letras que viram + relógio
     Isla por R$1  preço riscado: "Isla R$ 249,90 R$1 acima de R$999"
     Black Friday  o pregão: letreiro de cotações em queda
  ========================================================= */

  if (window.__hzbfTarjaLoaded) {
    return;
  }

  window.__hzbfTarjaLoaded = true;

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
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR",

    // Black Friday: as "cotações" do letreiro
    cotacoes: ["Botas", "Flats", "Tamancos", "Saltos", "Sandálias"]
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

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function linkDoApp() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ? CONFIG.appIos : CONFIG.appAndroid;
  }

  // Dia de novembro no horário de Brasília (1 a 30), para o "Dia 12/30"
  function diaDaBlack() {

    var d = new Date(Date.now() - 3 * 3600000);

    return d.getUTCMonth() === 10 ? d.getUTCDate() : 1;
  }

  // "2d 04:59:58" ou "04:59:58"
  function tempoTexto(fim) {

    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    var dias = Math.floor(restante / 86400);

    return (dias > 0 ? dias + "d " : "") +
      doisDigitos(Math.floor(restante % 86400 / 3600)) + ":" +
      doisDigitos(Math.floor(restante % 3600 / 60)) + ":" +
      doisDigitos(restante % 60);
  }

  // 11.11: horas corridas, como num painel ("33:59:59")
  function tempoPainel(fim) {

    var restante = Math.max(0, Math.floor((fim - Date.now()) / 1000));

    return doisDigitos(Math.min(99, Math.floor(restante / 3600))) + ":" +
      doisDigitos(Math.floor(restante % 3600 / 60)) + ":" +
      doisDigitos(restante % 60);
  }

  var TIMER = '<span class="hzbf-tempo" data-hzbf-timer></span>';


  /* =========================================================
     CSS
  ========================================================= */

  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace';

  var CSS = [
    '.hzbf-bar{box-sizing:border-box;position:relative;z-index:2;width:100%;margin:0;padding:0;background:#000;color:#fff;box-shadow:inset 0 -1px 0 rgba(255,255,255,.22);font:inherit;font-size:13px;font-weight:400;line-height:1.3;letter-spacing:0;text-transform:none;text-align:center;-webkit-font-smoothing:antialiased}',
    '.hzbf-bar *{box-sizing:border-box}',
    '.hzbf-bar a{color:inherit !important;text-decoration:none !important}',
    '.hzbf-bar a:focus-visible{outline:2px solid #fff;outline-offset:-4px}',
    '.hzbf-tempo{font-variant-numeric:tabular-nums;white-space:nowrap}',
    '@keyframes hzbf-corre{to{transform:translateX(-50%)}}',

    /* Black Hitzz - fita de lacre */
    '.hzbf-fita{position:relative;display:flex;align-items:center;height:40px;overflow:hidden;background:#000}',
    '.hzbf-fita::before,.hzbf-fita::after{content:"";position:absolute;left:0;right:0;z-index:2;height:4px;background:repeating-linear-gradient(-45deg,#fff 0 5px,#000 5px 10px)}',
    '.hzbf-fita::before{top:0}',
    '.hzbf-fita::after{bottom:0}',
    '.hzbf-fita__janela{flex:1;min-width:0;overflow:hidden}',
    '.hzbf-fita__trilho{display:inline-flex;white-space:nowrap;animation:hzbf-corre 34s linear infinite}',
    '.hzbf-fita__item{display:inline-flex;align-items:center;gap:14px;padding-right:14px;font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}',
    '.hzbf-fita__x{color:#e5262e;font-weight:900;letter-spacing:0}',
    '.hzbf-fita__dia{position:relative;z-index:3;flex:0 0 auto;margin:0 8px 0 4px;padding:4px 7px;background:#fff;color:#000;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;box-shadow:-14px 0 10px #000}',
    '.hzbf-bar--ultimo .hzbf-fita__dia{background:#e5262e;color:#fff}',

    /* Só no app - notificação */
    '.hzbf-push{display:block;padding:6px 10px;background:#000}',
    '.hzbf-push__card{display:flex;align-items:center;gap:10px;max-width:520px;margin:0 auto;padding:6px 8px 6px 7px;border-radius:13px;background:#1c1c1e;text-align:left}',
    '.hzbf-push__ic{display:flex;align-items:center;justify-content:center;flex:0 0 26px;width:26px;height:26px;border-radius:7px;background:#000;box-shadow:inset 0 0 0 1px #3a3a3c;color:#fff;font-size:14px;font-weight:800;line-height:1}',
    '.hzbf-push__txt{flex:1;min-width:0;line-height:1.2}',
    '.hzbf-push__txt small{display:block;color:#8e8e93;font-size:10px;letter-spacing:.02em}',
    '.hzbf-push__txt b{display:block;overflow:hidden;font-size:12.5px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}',
    '.hzbf-push__abrir{flex:0 0 auto;padding:5px 11px;border-radius:999px;background:#3a3a3c;font-size:11.5px;font-weight:600}',

    /* 11.11 - painel de embarque */
    '.hzbf-painel{display:flex;align-items:center;justify-content:center;gap:9px;min-height:42px;padding:6px 12px;background:#000}',
    '.hzbf-placas{display:inline-flex;align-items:center;gap:2px;perspective:200px}',
    '.hzbf-placa{display:inline-flex;align-items:center;justify-content:center;width:14px;height:22px;border-radius:2px;background:linear-gradient(#262626 0 49%,#000 49% 53%,#1b1b1b 53%);color:#fff;' + MONO + ';font-size:13px;font-weight:700;line-height:1}',
    '.hzbf-placa.hzbf-vira{animation:hzbf-vira .28s ease-out}',
    '@keyframes hzbf-vira{from{transform:rotateX(85deg)}to{transform:none}}',
    '.hzbf-sep{color:#fff;' + MONO + ';font-size:13px;font-weight:700;line-height:1}',
    '.hzbf-painel__txt{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-bar--ultimo .hzbf-painel__txt{color:#ff5a5f}',

    /* Isla - preço riscado e o R$1 grande */
    '.hzbf-isla{display:flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:6px 12px;background:#000;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-isla__de{color:#8a8a8a;font-weight:500;text-decoration:line-through}',
    '.hzbf-isla__por{color:#ff4b52;font-size:17px;font-weight:900;letter-spacing:0}',
    '.hzbf-isla__resto{color:#d6d6d6;font-weight:500;letter-spacing:.02em;text-transform:none}',
    '.hzbf-bar--ultimo .hzbf-isla__nome{color:#ff4b52}',

    /* Black Friday - pregão */
    '.hzbf-pregao{display:flex;align-items:stretch;height:40px;overflow:hidden;background:#000}',
    '.hzbf-pregao__selo{display:flex;align-items:center;flex:0 0 auto;padding:0 12px;background:#e5262e;color:#fff;font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}',
    '.hzbf-pregao__janela{display:flex;align-items:center;flex:1;min-width:0;overflow:hidden}',
    '.hzbf-pregao__trilho{display:inline-flex;align-items:center;white-space:nowrap;animation:hzbf-corre 44s linear infinite;' + MONO + ';font-size:11px;letter-spacing:.03em;text-transform:uppercase}',
    '.hzbf-cot{display:inline-flex;align-items:center;gap:6px;padding:0 14px}',
    '.hzbf-cot span{color:#9a9a9a}',
    '.hzbf-cot b{color:#ff4b52;font-weight:700}',
    '.hzbf-cot--branco b{color:#fff}',

    /* Celular */
    '@media (max-width:600px){',
    '.hzbf-painel{gap:6px;padding:6px 8px}',
    '.hzbf-placa{width:13px;height:21px;font-size:12px}',
    '.hzbf-painel__txt{font-size:9.5px;letter-spacing:.08em}',
    '.hzbf-isla{gap:6px;font-size:10.5px}',
    '.hzbf-isla__fim{display:none}',
    '.hzbf-pregao__selo{padding:0 10px;font-size:10px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hzbf-fita__trilho,.hzbf-pregao__trilho,.hzbf-placa.hzbf-vira{animation:none}}'
  ].join("");


  /* =========================================================
     HTML - UM CONCEITO POR AÇÃO
  ========================================================= */

  function link(classe, url, externo) {
    return '<a class="' + classe + '" href="' + esc(url) + '" data-hzbf-cta' +
      (externo ? ' target="_blank" rel="noopener"' : '') + '>';
  }

  // Letreiro: o conteúdo vai duas vezes para a rolagem não ter emenda
  function trilho(classe, item, vezes) {

    var metade = "";

    for (var i = 0; i < vezes; i++) {
      metade += item;
    }

    return '<span class="' + classe + '">' + metade + metade + '</span>';
  }

  var CONCEITOS = {

    // Black Hitzz: fita de lacre da caixa Black
    month: function (m) {

      var x = '<span class="hzbf-fita__x">✕</span>';
      var item = '<span class="hzbf-fita__item">Black Hitzz' + x + 'Até 70% OFF na categoria Black' + x + '</span>';

      return link("hzbf-fita", CONFIG.urlBlack) +
        '<span class="hzbf-fita__janela">' + trilho("hzbf-fita__trilho", item, 3) + '</span>' +
        '<span class="hzbf-fita__dia">' +
          (m.ultimo ? 'Último dia · ' + TIMER : 'Dia ' + diaDaBlack() + '/30') +
        '</span>' +
      '</a>';
    },

    // Só no app: um push do app Hitzz
    app: function (m) {

      var linha = m.antes ? 'HITZZ · faltam ' + TIMER
        : m.ultimo ? 'HITZZ · último dia · ' + TIMER
        : 'HITZZ · termina em ' + TIMER;

      var titulo = m.antes ? 'Só no app começa hoje às 22h' : 'Só no app: +20% OFF no Pix';

      return link("hzbf-push", linkDoApp(), true) +
        '<span class="hzbf-push__card">' +
          '<span class="hzbf-push__ic" aria-hidden="true">h</span>' +
          '<span class="hzbf-push__txt"><small>' + linha + '</small><b>' + esc(titulo) + '</b></span>' +
          '<span class="hzbf-push__abrir">Abrir</span>' +
        '</span>' +
      '</a>';
    },

    // 11.11: painel de embarque com letras que viram
    "1111": function (m) {

      var texto = m.antes ? "Começa às 22h" : m.ultimo ? "Últimas horas" : "24 Hitzz até R$124";

      return link("hzbf-painel", CONFIG.url1111) +
        '<span class="hzbf-placas" aria-label="11.11">' +
          '<span class="hzbf-placa">1</span><span class="hzbf-placa">1</span><span class="hzbf-sep">.</span>' +
          '<span class="hzbf-placa">1</span><span class="hzbf-placa">1</span>' +
        '</span>' +
        '<span class="hzbf-painel__txt">' + esc(texto) + '</span>' +
        '<span class="hzbf-placas" data-hzbf-painel></span>' +
      '</a>';
    },

    // Isla: o preço cheio riscado e o R$1 grande
    isla: function (m) {

      return link("hzbf-isla", CONFIG.urlIsla) +
        '<span class="hzbf-isla__nome">' + (m.antes ? 'Começa às 22h · Isla' : m.ultimo ? 'Último dia · Isla' : 'Isla') + '</span>' +
        '<span class="hzbf-isla__de">R$ 249,90</span>' +
        '<b class="hzbf-isla__por">R$1</b>' +
        '<span class="hzbf-isla__resto">acima de R$999</span>' +
        (m.antes ? '' : '<span class="hzbf-isla__resto hzbf-isla__fim">· até ' + TIMER + '</span>') +
      '</a>';
    },

    // Black Friday: letreiro de cotações em queda
    black: function (m) {

      var item = "";

      if (m.antes) {
        item = '<span class="hzbf-cot hzbf-cot--branco"><span>Começa hoje às 22h · faltam</span><b>' + TIMER + '</b></span>' +
          '<span class="hzbf-cot"><span>Até</span><b>▼70%</b><span>+ Pix</span><b>▼20%</b></span>';
      } else {

        for (var i = 0; i < CONFIG.cotacoes.length; i++) {
          item += '<span class="hzbf-cot"><span>' + esc(CONFIG.cotacoes[i]) + '</span><b>▼70%</b></span>';
        }

        item += '<span class="hzbf-cot"><span>Pix</span><b>▼20%</b></span>' +
          '<span class="hzbf-cot hzbf-cot--branco"><span>Fecha em</span><b>' + TIMER + '</b></span>';
      }

      return link("hzbf-pregao", CONFIG.urlBlack) +
        '<span class="hzbf-pregao__selo">▼ ' + (m.ultimo ? 'Último dia' : 'Black Friday') + '</span>' +
        '<span class="hzbf-pregao__janela">' + trilho("hzbf-pregao__trilho", item, 2) + '</span>' +
      '</a>';
    }
  };


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
      barra.className = "hzbf-bar hzbf-bar--" + m.id + (m.ultimo ? " hzbf-bar--ultimo" : "") + (m.antes ? " hzbf-bar--antes" : "");

      barra.setAttribute("role", "region");
      barra.setAttribute("aria-label", "Black Hitzz");

      barra.innerHTML = CONCEITOS[m.id](m);
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

  // 11.11: uma placa por caractere; só a placa que mudou vira
  function atualizarPainel(el, texto) {

    if (el.children.length !== texto.length) {

      var html = "";

      for (var i = 0; i < texto.length; i++) {
        html += texto.charAt(i) === ":" ? '<span class="hzbf-sep">:</span>' : '<span class="hzbf-placa"></span>';
      }

      el.innerHTML = html;
    }

    for (var j = 0; j < texto.length; j++) {

      var placa = el.children[j];
      var c = texto.charAt(j);

      if (c !== ":" && placa.textContent !== c) {
        placa.textContent = c;
        placa.classList.remove("hzbf-vira");
        void placa.offsetWidth;
        placa.classList.add("hzbf-vira");
      }
    }
  }

  function atualizarTimer(m) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var texto = tempoTexto(m.fim);
    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i].textContent !== texto) {
        timers[i].textContent = texto;
      }
    }

    var painel = bloco.querySelector("[data-hzbf-painel]");

    if (painel) {
      atualizarPainel(painel, tempoPainel(m.fim));
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
        hzbf_acao: m ? m.id : ""
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
