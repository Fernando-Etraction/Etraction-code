(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     TARJA TOPO
     Acima do header, em todas as páginas
  ========================================================= */

  if (window.__hz1010TarjaLoaded) {
    return;
  }

  window.__hz1010TarjaLoaded = true;

  var ID = "hz1010-bar";
  var STYLE_ID = "hz1010-bar-style";

  // No aquecimento só a tarja aparece, com contagem até a abertura
  var NO_AQUECIMENTO = true;

  var SELETOR_NAVBAR = ".navbar.navbar-tshop";


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    name: "10.10",
    coupon: "1010",
    couponLabel: "10% OFF",
    pixLabel: "10% OFF",
    breakdownLabel: "10% do cupom + 10% do Pix.",
    offerStartLabel: "22h",
    deadlineLabel: "12/10, às 23h59"
  };

  // Timer diário: conta até a próxima virada da hora indicada, no horário de
  // Brasília (UTC-3), e recomeça sozinho no dia seguinte. 24 = meia-noite.
  function proximaVirada(hora) {

    var agora = Date.now();
    var brasilia = new Date(agora - 3 * 3600000);

    var alvo = Date.UTC(
      brasilia.getUTCFullYear(),
      brasilia.getUTCMonth(),
      brasilia.getUTCDate(),
      hora + 3, 0, 0
    );

    return alvo > agora ? alvo : alvo + 86400000;
  }

  // Hora de abertura da oferta, usada na contagem do aquecimento
  var HORA_ABERTURA = 22;

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     MOMENTO DA AÇÃO - AUTOMÁTICO (horário de Brasília)

     09/10, 20h às 22h   aquecimento: só a tarja, com contagem até a abertura
     09/10 22h a 11/10   oferta ativa
     desde 09/10 22h     timers ligados: contam até a meia-noite e recomeçam todo dia
     12/10               último dia, com timer até 23h59
     depois de 12/10     nada aparece

     O script pode ficar instalado desde já: ele liga, troca de
     momento e desliga sozinho, sem recarregar a página.

     Só para conferir antes da data, na URL:
     ?hz1010=warmup | active | last   (?hz1010=off volta ao calendário)
  ========================================================= */

  // Horário de Brasília (UTC-3), independente do relógio do visitante
  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  var AGENDA = {
    warmup: brasilia(2026, 10, 9, 20),  // 09/10 20h
    active: brasilia(2026, 10, 9, 22),  // 09/10 22h
    timer: brasilia(2026, 10, 9, 22),   // 09/10 22h: os timers ligam junto com a oferta
    last: brasilia(2026, 10, 12, 0),    // 12/10 00h
    end: brasilia(2026, 10, 13, 0)      // 12/10 23h59
  };

  var PREVIEW_KEY = "hz1010-preview";

  function lerPreview() {

    var valor = null;

    try {

      var param =
        new URLSearchParams(window.location.search).get("hz1010");

      if (param === "off") {
        window.sessionStorage.removeItem(PREVIEW_KEY);
        return null;
      }

      if (param) {
        window.sessionStorage.setItem(PREVIEW_KEY, param);
      }

      valor = window.sessionStorage.getItem(PREVIEW_KEY);

    } catch (erro) { }

    return valor === "warmup" || valor === "active" || valor === "last"
      ? valor
      : null;
  }

  var PREVIEW = lerPreview();

  // Devolve "warmup", "active", "last" ou null (fora da ação)
  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();

    if (agora < AGENDA.warmup || agora >= AGENDA.end) {
      return null;
    }

    if (agora < AGENDA.active) {
      return "warmup";
    }

    return agora < AGENDA.last ? "active" : "last";
  }

  // Os timers ligam junto com a oferta (09/10 às 22h). No preview aparecem sempre.
  function timerLigado() {
    return PREVIEW ? true : Date.now() >= AGENDA.timer;
  }

  // Este bloco mostra timer? (oferta ativa e último dia)
  function comTimer(state) {
    return state === "last" || (state === "active" && timerLigado());
  }

  function estadoAtual() {
    return momentoDaAcao();
  }

  function alvoDoTimer(estado) {
    return proximaVirada(estado === "warmup" ? HORA_ABERTURA : 24);
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

  function definirTexto(el, texto) {

    if (el && el.textContent !== texto) {
      el.textContent = texto;
    }
  }

  var ICONS =
    '<svg class="hz1010-ico hz1010-ico--copy" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H3a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 3 10.5h.5"/></svg>' +
    '<svg class="hz1010-ico hz1010-ico--check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';

  var DOT = '<span class="hz1010-dot" aria-hidden="true"></span>';


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    /* ---------- Tarja ---------- */
    '.hz1010-bar{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 16px;width:100%;min-height:46px;margin:0;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,.16);background:#000;color:#fff;font:inherit;font-size:13px;font-weight:400;line-height:1.3;letter-spacing:.02em;text-transform:none;text-align:center;position:relative;z-index:2;-webkit-font-smoothing:antialiased}',
    '.hz1010-bar *{box-sizing:border-box}',

    /* Selo da ação ("10.10" / "Último dia") */
    '.hz1010-bar__tag{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}',
    '.hz1010-bar--last .hz1010-bar__tag{background:rgba(229,38,46,.24)}',

    /* Mensagem */
    '.hz1010-bar__msg{color:rgba(255,255,255,.86)}',
    '.hz1010-bar__msg strong{color:#fff;font-weight:800}',

    /* Timer */
    '.hz1010-bar__timer{display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,.72);font-size:12px;white-space:nowrap}',
    '.hz1010-bar__clock{display:inline-flex;align-items:center;gap:4px}',
    '.hz1010-seg{display:inline-flex;align-items:baseline;gap:2px;padding:5px 6px;border-radius:6px;background:rgba(255,255,255,.12);line-height:1}',
    '.hz1010-seg b{color:#fff;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hz1010-seg i{color:rgba(255,255,255,.6);font-size:9px;font-style:normal;font-weight:700;text-transform:uppercase}',

    /* Botão do cupom */
    '.hz1010-bar__coupon{-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;gap:8px;width:auto;height:30px;min-width:0;margin:0;padding:0 12px 0 14px;border:0;border-radius:999px;background:#fff;box-shadow:none;color:#000;font:inherit;font-size:12px;font-weight:600;line-height:1;letter-spacing:0;text-transform:none;white-space:nowrap;cursor:pointer;transition:background-color .15s,color .15s,transform .15s}',
    '.hz1010-bar__coupon:hover{background:#ececec}',
    '.hz1010-bar__coupon:active{transform:scale(.97)}',
    '.hz1010-bar__coupon.is-copied{background:#dcf2e4;color:#0f5132}',
    '.hz1010-bar__coupon:focus-visible{outline:2px solid #fff;outline-offset:3px}',
    '.hz1010-bar__code{padding-right:9px;border-right:1px solid #d9d9d9;font-weight:800;letter-spacing:.14em}',
    '.hz1010-bar__coupon.is-copied .hz1010-bar__code{border-right-color:#b5dcc4}',

    /* Ponto vermelho (o mesmo do letreiro "Esquenta") */
    '.hz1010-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',

    /* Ícones copiar / copiado */
    '.hz1010-ico{display:block;width:12px;height:12px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.hz1010-ico--check{display:none}',
    '.is-copied .hz1010-ico--copy{display:none}',
    '.is-copied .hz1010-ico--check{display:block}',

    '.hz1010-sm{display:none}',

    /* Mobile: mensagem na primeira linha; selo, timer e cupom na segunda */
    '@media (max-width:600px){',
    '.hz1010-bar{gap:7px 10px;padding:9px 12px;font-size:12px}',
    '.hz1010-bar__msg{flex-basis:100%;order:1}',
    '.hz1010-bar__tag,.hz1010-bar__timer,.hz1010-bar__coupon{order:2}',
    '.hz1010-bar__tag{padding:5px 9px;letter-spacing:.12em}',
    '.hz1010-lg{display:none}',
    '.hz1010-sm{display:inline}',
    /* Com timer o botão mostra só o código, para caber ao lado dele */
    '.hz1010-bar--timer .hz1010-copy-label{display:none}',
    '.hz1010-bar--timer .hz1010-bar__code{padding-right:0;border-right:0}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hz1010-bar__coupon{transition:none}.hz1010-bar__coupon:active{transform:none}}'
  ].join("");


  /* =========================================================
     HTML
  ========================================================= */

  function barHTML(state) {

    var tag = '<span class="hz1010-bar__tag">' + DOT +
      (state === "last" ? 'Último dia' : esc(CONFIG.name)) + '</span>';

    if (state === "warmup") {
      return '<span class="hz1010-bar__msg">' + DOT + ' <strong>' + esc(CONFIG.name) + '</strong> começa hoje às ' + esc(CONFIG.offerStartLabel) + '</span>' +
        '<span class="hz1010-bar__timer">Faltam <span class="hz1010-bar__clock" data-hz1010-timer></span></span>';
    }

    var msg = '<span class="hz1010-bar__msg">' +
      '<strong>' + esc(CONFIG.couponLabel) + '</strong> com o cupom + ' +
      '<strong>' + esc(CONFIG.pixLabel) + '</strong> no Pix' +
    '</span>';

    var coupon = '<button type="button" class="hz1010-bar__coupon" data-hz1010-copy data-hz1010-loc="barra" aria-label="Copiar cupom ' + esc(CONFIG.coupon) + '">' +
      '<span class="hz1010-bar__code">' + esc(CONFIG.coupon) + '</span>' + ICONS + '<span class="hz1010-copy-label">Copiar</span>' +
    '</button>';

    var timer = comTimer(state)
      ? '<span class="hz1010-bar__timer"><span class="hz1010-lg">Termina em</span><span class="hz1010-bar__clock" data-hz1010-timer></span></span>'
      : '';

    return tag + msg + timer + coupon;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function montarBloco(state) {

    var navbar = document.querySelector(SELETOR_NAVBAR);

    if (!navbar || !navbar.parentNode) {
      return;
    }

    var barra = document.getElementById(ID);

    if (!barra) {

      barra = document.createElement("div");

      barra.id = ID;
      barra.className = "hz1010-bar hz1010-bar--" + state + (comTimer(state) ? " hz1010-bar--timer" : "");

      barra.setAttribute("role", "region");
      barra.setAttribute("aria-label", "Oferta " + CONFIG.name);

      barra.innerHTML = barHTML(state);
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

    var state = estadoAtual();

    if (state === "warmup" && !NO_AQUECIMENTO) {
      state = null;
    }

    // Redesenha quando muda o momento ou quando o timer liga
    var chave = state ? state + (comTimer(state) ? "+timer" : "") : null;

    if (chave !== estadoRenderizado) {

      var antigo = document.getElementById(ID);

      if (antigo) {
        antigo.remove();
      }

      estadoRenderizado = chave;
    }

    if (!state) {
      return;
    }

    adicionarEstilo();

    montarBloco(state);

    atualizarTimer(state);
  }


  /* =========================================================
     TIMER
  ========================================================= */

  function atualizarTimer(state) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var restante =
      Math.max(0, Math.floor((alvoDoTimer(state) - Date.now()) / 1000));

    var dias = Math.floor(restante / 86400);

    function seg(valor, rotulo) {
      return '<span class="hz1010-seg"><b>' + doisDigitos(valor) + '</b><i>' + rotulo + '</i></span>';
    }

    var html =
      (dias > 0 ? seg(dias, "d") : "") +
      seg(Math.floor(restante % 86400 / 3600), "h") +
      seg(Math.floor(restante % 3600 / 60), "m") +
      seg(restante % 60, "s");

    var timers = bloco.querySelectorAll("[data-hz1010-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i]._hz1010Html !== html) {
        timers[i]._hz1010Html = html;
        timers[i].innerHTML = html;
      }
    }
  }


  /* =========================================================
     COPIAR CUPOM
  ========================================================= */

  function copiarFallback(texto) {

    var textarea = document.createElement("textarea");

    textarea.value = texto;

    textarea.setAttribute("readonly", "");

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (erro) { }

    textarea.remove();
  }

  function copiarCupom(botao) {

    var label = botao.querySelector(".hz1010-copy-label");

    function sucesso() {

      if (label && !label.hasAttribute("data-o")) {
        label.setAttribute("data-o", label.textContent);
      }

      if (label) {
        label.textContent = "Copiado";
      }

      botao.classList.add("is-copied");

      clearTimeout(botao._hz1010Timer);

      botao._hz1010Timer = setTimeout(function () {

        if (label) {
          label.textContent = label.getAttribute("data-o");
        }

        botao.classList.remove("is-copied");

      }, 2200);

      try {

        // Avisa os outros blocos da ação (a PDP marca o passo 1)
        document.dispatchEvent(new CustomEvent("hz1010:copiado"));

        (window.dataLayer = window.dataLayer || []).push({
          event: "hz1010_copiar_cupom",
          hz1010_local: botao.getAttribute("data-hz1010-loc")
        });

      } catch (erro) { }
    }

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {

      navigator.clipboard
        .writeText(CONFIG.coupon)
        .then(sucesso)
        .catch(function () {
          copiarFallback(CONFIG.coupon);
          sucesso();
        });

      return;
    }

    copiarFallback(CONFIG.coupon);

    sucesso();
  }

  document.addEventListener("click", function (event) {

    var botao =
      event.target &&
      event.target.closest &&
      event.target.closest("#" + ID + " [data-hz1010-copy]");

    if (!botao) {
      return;
    }

    event.preventDefault();

    copiarCupom(botao);
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

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    montar();

    iniciarObserver();

    // Atualiza o timer e vira o momento da ação sem recarregar a página
    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
