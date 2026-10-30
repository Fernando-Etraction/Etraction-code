(function () {
  "use strict";

  /* =========================================================
     ULTRAMEL - BLACK 2026
     CÓDIGO 1 - TARJA DO TOPO + ITEM NO MENU
     Todas as páginas. Durante cada ação, a faixa amarela que corre
     (#navbar__top) dá lugar a uma linha parada com a oferta e o prazo.
     Na ULTRAWEEK, a campanha também vira o primeiro item do menu.
  ========================================================= */

  if (window.__umbfTarjaLoaded) {
    return;
  }

  window.__umbfTarjaLoaded = true;

  var BAR_ID = "umbf-bar";
  var MENU_ID = "umbf-menu";
  var MENU_DESK_ID = "umbf-menu-desk";
  var STYLE_ID = "umbf-bar-style";


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    cupom: "ULTRAFRIDAY",

    // Aparece na tarja do ULTRAFRIDAY. Ex.: "Não acumula com outros cupons."
    // Deixar vazio até a cliente confirmar a regra.
    cupomNota: "",

    // Categoria da ULTRAWEEK. Trocar quando a cliente criar a coleção.
    urlCampanha: "/oportunidades",

    // Fases em que a campanha entra como primeiro item do menu
    menuNasFases: ["week", "wfri", "wknd", "wmon"]
  };


  /* =========================================================
     AGENDA DA BLACK (horário de Brasília) - igual nos 5 códigos

     ULTRAFRIDAY    toda sexta 0h a domingo 23h59 (30/10 a 22/11)
                    quinta, a partir de 12h, avisa
     ULTRALIBIDO    11/11, 0h a 23h59 (10/11 avisa)
     ULTRAWEEK      23/11 a 26/11
     ULTRA FRIDAY   27/11
     ULTRA WEEKEND  28 e 29/11
     ULTRA MONDAY   30/11
     BRINDES        período a confirmar (preencher BRINDES abaixo)

     O script pode ficar instalado desde já: liga, troca de fase e
     desliga sozinho, sem recarregar a página.

     Para conferir antes da data, na URL:
     ?umbf=fri | fri-dom | fri-aviso | lib | lib-aviso
     ?umbf=week | wfri | wknd | wmon
     ?umbf=gift          só os brindes
     ?umbf=fri+gift      fase + brindes juntos
     ?umbf=off           volta ao calendário
  ========================================================= */

  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, (hora || 0) + 3, 0, 0);
  }

  var HORA = 3600000;
  var DIA = 24 * HORA;

  var FASES = [
    { id: "lib-aviso", inicio: brasilia(2026, 11, 10), fim: brasilia(2026, 11, 11) },
    { id: "lib", inicio: brasilia(2026, 11, 11), fim: brasilia(2026, 11, 12) },
    { id: "week", inicio: brasilia(2026, 11, 23), fim: brasilia(2026, 11, 27) },
    { id: "wfri", inicio: brasilia(2026, 11, 27), fim: brasilia(2026, 11, 28) },
    { id: "wknd", inicio: brasilia(2026, 11, 28), fim: brasilia(2026, 11, 30) },
    { id: "wmon", inicio: brasilia(2026, 11, 30), fim: brasilia(2026, 12, 1) }
  ];

  // Sextas do ULTRAFRIDAY. A primeira (30/10) ainda depende da cliente.
  var SEXTAS = [
    brasilia(2026, 10, 30),
    brasilia(2026, 11, 6),
    brasilia(2026, 11, 13),
    brasilia(2026, 11, 20)
  ];

  // Quantas horas antes da sexta a quinta começa a avisar
  var AVISO_HORAS_ANTES = 12;

  // Brindes por faixa: preencher quando a cliente confirmar o período.
  // Ex.: { inicio: brasilia(2026, 11, 23), fim: brasilia(2026, 12, 1) }
  // Enquanto estiver null, os brindes aparecem só no preview.
  var BRINDES = { inicio: null, fim: null };

  var PREVIEW_KEY = "umbf-preview";

  var PREVIEW_FIM = {
    "fri": 2 * DIA + 5 * HORA,
    "fri-dom": 5 * HORA + 42 * 60000,
    "fri-aviso": 5 * HORA,
    "lib-aviso": 5 * HORA,
    "lib": 5 * HORA + 42 * 60000,
    "week": 2 * DIA,
    "wfri": 5 * HORA + 42 * 60000,
    "wknd": DIA + 5 * HORA,
    "wmon": 5 * HORA + 42 * 60000
  };

  function lerPreview() {

    var valor = null;

    try {

      var param = new URLSearchParams(window.location.search).get("umbf");

      if (param === "off") {
        window.sessionStorage.removeItem(PREVIEW_KEY);
        return null;
      }

      if (param) {
        window.sessionStorage.setItem(PREVIEW_KEY, param);
      }

      valor = window.sessionStorage.getItem(PREVIEW_KEY);

    } catch (erro) { }

    if (!valor) {
      return null;
    }

    var partes = valor.split(/[+ ,]/);
    var fase = null;
    var brinde = false;

    for (var i = 0; i < partes.length; i++) {

      if (partes[i] === "gift") {
        brinde = true;
      } else if (PREVIEW_FIM[partes[i]]) {
        fase = partes[i];
      }
    }

    // O fim do preview fica fixo durante a visita, para o relógio não reiniciar
    var inicio = Date.now();

    try {
      var guardado = Number(window.sessionStorage.getItem(PREVIEW_KEY + "-t"));
      if (guardado && Date.now() - guardado < 6 * HORA) {
        inicio = guardado;
      } else {
        window.sessionStorage.setItem(PREVIEW_KEY + "-t", String(inicio));
      }
    } catch (erro) { }

    return {
      fase: fase,
      fim: fase ? inicio + PREVIEW_FIM[fase] : null,
      brinde: brinde,
      preview: true
    };
  }

  var PREVIEW = lerPreview();

  // Devolve { fase, fim, brinde }. fase = null fora das ações.
  function estado() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();
    var fase = null;
    var fim = null;
    var i;

    for (i = 0; i < FASES.length; i++) {
      if (agora >= FASES[i].inicio && agora < FASES[i].fim) {
        fase = FASES[i].id;
        fim = FASES[i].fim;
      }
    }

    for (i = 0; !fase && i < SEXTAS.length; i++) {

      var sexta = SEXTAS[i];

      if (agora >= sexta && agora < sexta + 3 * DIA) {
        fase = agora >= sexta + 2 * DIA ? "fri-dom" : "fri";
        fim = sexta + 3 * DIA;
      } else if (agora >= sexta - AVISO_HORAS_ANTES * HORA && agora < sexta) {
        fase = "fri-aviso";
        fim = sexta;
      }
    }

    var brinde = !!(BRINDES.inicio && BRINDES.fim && agora >= BRINDES.inicio && agora < BRINDES.fim);

    return { fase: fase, fim: fim, brinde: brinde };
  }


  /* =========================================================
     RELÓGIO E BOTÃO DE COPIAR (compartilhados pelos 5 códigos)
  ========================================================= */

  function duasCasas(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function partesTempo(fim) {
    var resto = Math.max(0, fim - Date.now());
    var s = Math.floor(resto / 1000);
    return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60];
  }

  function textoTempo(fim) {
    var p = partesTempo(fim);
    return duasCasas(p[0]) + ":" + duasCasas(p[1]) + ":" + duasCasas(p[2]);
  }

  function ligarRelogio() {

    if (window.__umbfRelogio) {
      return;
    }

    window.__umbfRelogio = window.setInterval(function () {

      var lista = document.querySelectorAll("[data-umbf-fim]");

      for (var i = 0; i < lista.length; i++) {

        var el = lista[i];
        var fim = Number(el.getAttribute("data-umbf-fim"));

        if (el.getAttribute("data-umbf-fmt") === "blocos") {
          var p = partesTempo(fim);
          var b = el.querySelectorAll("b");
          for (var j = 0; j < b.length && j < 3; j++) {
            b[j].textContent = duasCasas(p[j]);
          }
        } else {
          el.textContent = textoTempo(fim);
        }
      }
    }, 1000);
  }

  function ligarCopiar() {

    if (window.__umbfCopiar) {
      return;
    }

    window.__umbfCopiar = true;

    document.addEventListener("click", function (evento) {

      var botao = evento.target.closest ? evento.target.closest(".umbf-copy") : null;

      if (!botao) {
        return;
      }

      evento.preventDefault();
      evento.stopPropagation();

      var codigo = botao.getAttribute("data-code");
      var rotulo = botao.querySelector(".umbf-copy__txt");

      function avisar() {
        if (!rotulo) return;
        rotulo.textContent = "copiado";
        window.setTimeout(function () { rotulo.textContent = codigo; }, 1800);
      }

      try {
        navigator.clipboard.writeText(codigo).then(avisar, avisar);
      } catch (erro) {
        avisar();
      }
    }, true);
  }

  var ICONE_COPIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function botaoCupom(codigo) {
    return '<button type="button" class="umbf-copy" data-code="' + codigo + '" aria-label="Copiar o cupom ' + codigo + '">' +
      '<span class="umbf-copy__txt">' + codigo + '</span>' + ICONE_COPIAR + '</button>';
  }


  /* =========================================================
     CSS
  ========================================================= */

  function injetarCss() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "html.umbf-bar-on #navbar__top{display:none!important}",
      "#umbf-bar{font-family:Montserrat,Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;gap:4px;min-height:36px;padding:7px 14px;text-align:center;line-height:1.3;font-size:12px;font-weight:600;position:relative;z-index:2}",
      "#umbf-bar a{color:inherit;text-decoration:none}",
      "#umbf-bar b{font-weight:900;letter-spacing:.05em}",
      "#umbf-bar .umbf-bar__l1{display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}",
      "#umbf-bar .umbf-bar__l2{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;font-size:11px;font-weight:500}",
      "#umbf-bar time{font-weight:800;font-variant-numeric:tabular-nums;border-radius:3px;padding:1px 6px}",
      "#umbf-bar.umbf-bar--fri{background:#16120E;color:#F2C85D}",
      "#umbf-bar.umbf-bar--fri .umbf-bar__l2{color:#fff}",
      "#umbf-bar.umbf-bar--lib{background:#6A1F33;color:#fff}",
      "#umbf-bar.umbf-bar--lib time{background:#fff;color:#6A1F33}",
      "#umbf-bar.umbf-bar--week{background:#16120E;color:#fff}",
      "#umbf-bar.umbf-bar--week b{color:#F2C85D}",
      "#umbf-bar.umbf-bar--wfri{background:#F2C85D;color:#16120E}",
      "#umbf-bar.umbf-bar--wfri time{background:#16120E;color:#F2C85D}",
      "#umbf-bar.umbf-bar--wknd{background:#16120E;color:#F2C85D}",
      "#umbf-bar.umbf-bar--wknd span{color:#fff}",
      "#umbf-bar.umbf-bar--wknd time{background:#F2C85D;color:#16120E}",
      "#umbf-bar.umbf-bar--wmon{background:#fff;color:#16120E;box-shadow:inset 0 0 0 2px #16120E}",
      "#umbf-bar.umbf-bar--wmon time{background:#16120E;color:#fff}",
      ".umbf-copy{display:inline-flex;align-items:center;gap:5px;border:1px dashed #F2C85D;background:transparent;color:#F2C85D;border-radius:4px;padding:2px 8px;font:800 11px/1.4 Montserrat,Arial,sans-serif;letter-spacing:.06em;cursor:pointer}",
      ".umbf-copy svg{width:12px;height:12px}",
      "#umbf-menu{background:#16120E}",
      "#umbf-menu>a{display:flex!important;align-items:center;gap:10px;color:#fff!important;padding:12px 15px!important}",
      "#umbf-menu b{color:#F2C85D;font-weight:900;letter-spacing:.04em}",
      "#umbf-menu small{display:block;font-size:11px;opacity:.85;font-weight:500}",
      ".umbf-dot{width:9px;height:9px;border-radius:50%;background:#F2C85D;flex:none;animation:umbfPulse 1.6s ease-in-out infinite}",
      "#umbf-menu-desk>a{color:#16120E!important;font-weight:800!important;display:flex!important;align-items:center;gap:6px}",
      "@keyframes umbfPulse{50%{opacity:.25}}",
      "@media (prefers-reduced-motion:reduce){.umbf-dot{animation:none}}",
      "@media (min-width:992px){#umbf-bar{font-size:13px;flex-direction:row;gap:16px}}"
    ].join("\n");

    document.head.appendChild(style);
  }


  /* =========================================================
     CONTEÚDO DE CADA FASE
  ========================================================= */

  function relogio(fim) {
    return '<time data-umbf-fim="' + fim + '">' + textoTempo(fim) + "</time>";
  }

  // Último dia do fim de semana (domingo) ou não
  function ultimoDia(e) {
    return e.fim && e.fim - Date.now() <= DIA;
  }

  function tarja(e) {

    var nota = CONFIG.cupomNota ? "<span>" + CONFIG.cupomNota + "</span>" : "";

    switch (e.fase) {

      case "fri-aviso":
        return { cls: "fri", html: '<div class="umbf-bar__l1"><span>Amanhã, 0h, começa o <b>ULTRAFRIDAY</b> · 10% OFF acima de R$ 400</span></div>' };

      case "fri":
      case "fri-dom":
        return {
          cls: "fri",
          html: '<div class="umbf-bar__l1"><span><b>ULTRAFRIDAY</b> · 10% OFF acima de R$ 400</span></div>' +
            '<div class="umbf-bar__l2">' + botaoCupom(CONFIG.cupom) +
            "<span>" + (e.fase === "fri-dom" ? "termina hoje, 23h59" : "até domingo, 23h59") + "</span>" + nota + "</div>"
        };

      case "lib-aviso":
        return { cls: "lib", html: '<div class="umbf-bar__l1"><span>Amanhã tem <b>11.11 ULTRALIBIDO</b> · toque no ♥ para salvar seus favoritos</span></div>' };

      case "lib":
        return { cls: "lib", html: '<div class="umbf-bar__l1"><b>11.11 ULTRALIBIDO</b><span>termina em ' + relogio(e.fim) + "</span></div>" };

      case "week":
        return { cls: "week", html: '<a class="umbf-bar__l1" href="' + CONFIG.urlCampanha + '"><b>ULTRAWEEK</b><span>ofertas até domingo, 29/11</span></a>' };

      case "wfri":
        return { cls: "wfri", html: '<a class="umbf-bar__l1" href="' + CONFIG.urlCampanha + '"><b>ULTRA FRIDAY É HOJE</b><span>termina em ' + relogio(e.fim) + "</span></a>" };

      case "wknd":
        return {
          cls: "wknd",
          html: '<a class="umbf-bar__l1" href="' + CONFIG.urlCampanha + '"><b>ULTRA WEEKEND</b>' +
            (ultimoDia(e) ? "<span>último dia, termina em " + relogio(e.fim) + "</span>" : "<span>últimos 2 dias</span>") + "</a>"
        };

      case "wmon":
        return { cls: "wmon", html: '<a class="umbf-bar__l1" href="' + CONFIG.urlCampanha + '"><b>ULTRA MONDAY</b><span>última chance · ' + relogio(e.fim) + "</span></a>" };
    }

    return null;
  }

  function itemMenu(e) {

    var textos = {
      week: ["ULTRAWEEK", "ofertas da semana, até 29/11"],
      wfri: ["ULTRA FRIDAY", "ofertas de hoje, até 23h59"],
      wknd: ["ULTRA WEEKEND", ultimoDia(e) ? "último dia, até 23h59" : "últimos 2 dias"],
      wmon: ["ULTRA MONDAY", "última chance, até 23h59"]
    };

    return textos[e.fase] || null;
  }


  /* =========================================================
     RENDER
  ========================================================= */

  var chaveRenderizada = null;

  function remover(id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function render() {

    var e = estado();
    var t = tarja(e);
    var m = CONFIG.menuNasFases.indexOf(e.fase) > -1 ? itemMenu(e) : null;
    var chave = e.fase + "|" + (t ? t.html : "") + "|" + (m ? m.join() : "");

    var navbar = document.querySelector(".navbar.navbar-tshop");
    var barAtual = document.getElementById(BAR_ID);
    var menuMobile = document.getElementById("mm-content-inner");
    var menuDesk = document.querySelector(".navbar-collapse .main-menu");

    var faltaBar = t && navbar && !barAtual;
    var faltaMenu = m && ((menuMobile && !document.getElementById(MENU_ID)) || (menuDesk && !document.getElementById(MENU_DESK_ID)));

    if (chave === chaveRenderizada && !faltaBar && !faltaMenu) {
      return;
    }

    chaveRenderizada = chave;

    remover(BAR_ID);
    remover(MENU_ID);
    remover(MENU_DESK_ID);
    document.documentElement.classList.remove("umbf-bar-on");

    if (t && navbar) {
      var bar = document.createElement("div");
      bar.id = BAR_ID;
      bar.className = "umbf-bar--" + t.cls;
      bar.setAttribute("role", "region");
      bar.setAttribute("aria-label", "Oferta da Black Ultramel");
      bar.innerHTML = t.html;
      navbar.insertBefore(bar, navbar.firstChild);
      document.documentElement.classList.add("umbf-bar-on");
    }

    if (m && menuMobile) {
      var li = document.createElement("li");
      li.id = MENU_ID;
      li.className = "mm-no-next-level level1";
      li.innerHTML = '<a href="' + CONFIG.urlCampanha + '"><span class="umbf-dot"></span><span><b>' + m[0] + "</b><small>" + m[1] + "</small></span></a>";
      menuMobile.insertBefore(li, menuMobile.firstChild);
    }

    if (m && menuDesk) {
      var liDesk = document.createElement("li");
      liDesk.id = MENU_DESK_ID;
      liDesk.innerHTML = '<a href="' + CONFIG.urlCampanha + '"><span class="umbf-dot"></span>' + m[0] + "</a>";
      menuDesk.insertBefore(liDesk, menuDesk.firstChild);
    }
  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  var agendado = false;

  function agendar() {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(function () {
      agendado = false;
      render();
    });
  }

  function iniciar() {

    injetarCss();
    ligarRelogio();
    ligarCopiar();
    render();

    // O menu do celular e o header podem ser montados depois do carregamento
    new MutationObserver(agendar).observe(document.body, { childList: true, subtree: true });

    // Troca de fase sem recarregar a página
    window.setInterval(render, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
