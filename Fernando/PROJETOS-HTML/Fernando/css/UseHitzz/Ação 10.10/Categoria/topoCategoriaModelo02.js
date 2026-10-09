(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     TOPO DA CATEGORIA - MODELO 02
     Faixa clara full width: 10% do cupom + 10% do Pix lado a lado
     Usar no lugar do topoCategoria.js (não instalar os dois)
  ========================================================= */

  if (window.__hz1010CategoriaLoaded) {
    return;
  }

  window.__hz1010CategoriaLoaded = true;

  var ID = "hz1010-cat";
  var STYLE_ID = "hz1010-cat-style";

  // No aquecimento o cupom ainda não é revelado
  var NO_AQUECIMENTO = false;

  var SELETOR_TITULO = ".products-filter .taxon-title-text";

  // Páginas onde o bloco aparece. Lista vazia = todas as categorias
  var PAGINAS = ["/ver-todos", "/ver-todos/em-alta"];

  // Filtro de categoria (pílulas abaixo da faixa)
  var FILTROS = [
    { nome: "Todos", url: "/ver-todos" },
    { nome: "Em alta", url: "/ver-todos/em-alta" },
    { nome: "Botas", url: "/bota-feminina-de-salto" },
    { nome: "Flats", url: "/calcado-flat-flats" },
    { nome: "Tamancos", url: "/tamancos" },
    { nome: "Saltos", url: "/sapato-de-salto" },
    { nome: "Sandálias", url: "/sandalias" },
    { nome: "Bolsas & Acessórios", url: "/acessorios-femininos" }
  ];

  // Páginas que já têm filtro próprio (ex.: Esquenta Black) não recebem outro
  var SELETOR_FILTRO_EXISTENTE = ".etraction-filtro-container";


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    name: "10.10",
    coupon: "1010",
    couponLabel: "10% OFF",
    pixLabel: "10% OFF",
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
    /* ---------- Faixa clara, de ponta a ponta ---------- */
    '.hz1010-cat{position:relative;left:50%;box-sizing:border-box;width:100vw;max-width:none;margin:20px -50vw;overflow:hidden;background:#f3f1ed;color:#111;font:inherit;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hz1010-cat *{box-sizing:border-box}',
    '.hz1010-cat__inner{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,380px);align-items:center;gap:24px 64px;width:100%;max-width:1240px;margin:0 auto;padding:36px}',

    /* Ponto vermelho (o mesmo do letreiro "Esquenta") */
    '.hz1010-cat .hz1010-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#e5262e;flex-shrink:0}',

    /* ---------- Chamada ---------- */
    '.hz1010-eyebrow{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 18px;color:#111;font-size:11px;font-weight:700;line-height:1.2;letter-spacing:.2em;text-transform:uppercase}',
    '.hz1010-eyebrow__soft{color:#777}',

    /* ---------- 10% + 10% ---------- */
    '.hz1010-sum{display:flex;align-items:flex-start;gap:28px;margin:0}',
    '.hz1010-sum__item{display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.hz1010-sum__num{color:#000;font-size:64px;font-weight:800;line-height:.9;letter-spacing:-.045em;white-space:nowrap}',
    '.hz1010-sum__num small{margin-left:6px;font-size:.32em;font-weight:800;letter-spacing:.08em}',
    '.hz1010-sum__txt{color:#555;font-size:14px;line-height:1.3}',
    '.hz1010-sum__txt strong{color:#000;font-weight:700}',
    '.hz1010-sum__plus{color:#e5262e;font-size:44px;font-weight:300;line-height:56px}',
    '.hz1010-note{margin:20px 0 0;color:#555;font-size:13px;line-height:1.4}',

    /* ---------- Cartão do cupom ---------- */
    '.hz1010-ticket{padding:20px;border:1px solid #e2dfd9;border-radius:16px;background:#fff}',
    '.hz1010-ticket__label{display:block;color:#777;font-size:10px;font-weight:700;line-height:1;letter-spacing:.2em;text-transform:uppercase}',
    '.hz1010-ticket__row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}',
    '.hz1010-ticket__code{color:#000;font-size:34px;font-weight:800;line-height:1;letter-spacing:.12em}',
    '.hz1010-fine{margin:16px 0 0;padding-top:14px;border-top:1px dashed #d6d2cb;color:#666;font-size:12px;line-height:1.4}',

    /* ---------- Botão copiar ---------- */
    '.hz1010-cat .hz1010-copy{-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;gap:8px;width:auto;height:44px;min-width:0;margin:0;padding:0 20px;border:0;border-radius:999px;background:#000;box-shadow:none;color:#fff;font:inherit;font-size:13px;font-weight:600;line-height:1;letter-spacing:0;text-transform:none;white-space:nowrap;cursor:pointer;flex-shrink:0;transition:background-color .15s,transform .15s}',
    '.hz1010-cat .hz1010-copy:hover{background:#2a2a2a}',
    '.hz1010-cat .hz1010-copy:active{transform:scale(.97)}',
    '.hz1010-cat .hz1010-copy.is-copied{background:#1f7a4d}',
    '.hz1010-cat .hz1010-copy:focus-visible{outline:2px solid #000;outline-offset:3px}',

    /* Ícones copiar / copiado */
    '.hz1010-ico{display:block;width:14px;height:14px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.hz1010-ico--check{display:none}',
    '.is-copied .hz1010-ico--copy{display:none}',
    '.is-copied .hz1010-ico--check{display:block}',

    /* ---------- Timer (último dia) ---------- */
    '.hz1010-clock{display:inline-flex;align-items:center;gap:4px}',
    '.hz1010-cat .hz1010-seg{display:inline-flex;align-items:baseline;gap:2px;padding:5px 6px;border-radius:6px;background:#111;line-height:1;letter-spacing:0}',
    '.hz1010-cat .hz1010-seg b{color:#fff;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hz1010-cat .hz1010-seg i{color:rgba(255,255,255,.65);font-size:9px;font-style:normal;font-weight:700;text-transform:uppercase}',

    /* ---------- Filtro de categoria ---------- */
    '.hz1010-filtro{display:flex;gap:10px;margin:0;padding:18px 15px 2px;background:#fff;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
    '.hz1010-filtro::-webkit-scrollbar{display:none}',
    '.hz1010-filtro a{flex:0 0 auto;display:inline-flex;align-items:center;height:42px;padding:0 22px;border:1px solid #ddd;border-radius:999px;background:#fff;color:#333;font-size:14px;font-weight:500;line-height:1;text-decoration:none;white-space:nowrap;transition:border-color .15s,color .15s}',
    '.hz1010-filtro a:hover{border-color:#000;color:#000}',
    '.hz1010-filtro a.is-active{background:#000;border-color:#000;color:#fff;font-weight:700}',
    '.hz1010-filtro a:focus-visible{outline:2px solid #000;outline-offset:2px}',

    '@media (max-width:900px){',
    '.hz1010-cat__inner{grid-template-columns:minmax(0,1fr);gap:24px;padding:28px 20px}',
    '}',

    '@media (max-width:600px){',
    '.hz1010-cat{margin:14px -50vw}',
    '.hz1010-cat__inner{gap:20px;padding:24px 16px}',
    '.hz1010-eyebrow{margin-bottom:16px;font-size:10px;letter-spacing:.16em}',
    '.hz1010-sum{gap:14px}',
    '.hz1010-sum__item{gap:8px}',
    '.hz1010-sum__num{font-size:44px}',
    '.hz1010-sum__num small{margin-left:4px}',
    '.hz1010-sum__txt{font-size:12px}',
    '.hz1010-sum__plus{font-size:30px;line-height:38px}',
    '.hz1010-note{margin-top:16px;font-size:12px}',
    '.hz1010-ticket{padding:16px}',
    '.hz1010-ticket__code{font-size:28px}',
    '.hz1010-cat .hz1010-copy{height:42px;padding:0 16px}',
    '.hz1010-filtro{gap:8px;padding:14px 15px 2px}',
    '.hz1010-filtro a{height:38px;padding:0 16px;font-size:13px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hz1010-copy{transition:none}.hz1010-copy:active{transform:none}}'
  ].join("");


  /* =========================================================
     HTML
  ========================================================= */

  function numeroHTML(rotulo) {

    // "10% OFF" → "10%" grande com "OFF" pequeno ao lado
    var partes = rotulo.match(/^(\d+\s*%)\s*(.*)$/);

    if (!partes) {
      return esc(rotulo);
    }

    return esc(partes[1]) + (partes[2] ? '<small>' + esc(partes[2]) + '</small>' : '');
  }

  function categoryHTML(state) {

    var eyebrow = comTimer(state)
      ? DOT + '<span>' + (state === "last" ? 'Último dia' : 'Ação ' + esc(CONFIG.name)) + '</span><span class="hz1010-eyebrow__soft">Termina em</span><span class="hz1010-clock" data-hz1010-timer></span>'
      : DOT + '<span>Ação ' + esc(CONFIG.name) + '</span><span class="hz1010-eyebrow__soft">Em todo o site</span>';

    return '<div class="hz1010-cat__inner">' +
        '<div class="hz1010-cat__main">' +
          '<p class="hz1010-eyebrow">' + eyebrow + '</p>' +
          '<div class="hz1010-sum">' +
            '<div class="hz1010-sum__item">' +
              '<span class="hz1010-sum__num">' + numeroHTML(CONFIG.couponLabel) + '</span>' +
              '<span class="hz1010-sum__txt">com o cupom <strong>' + esc(CONFIG.coupon) + '</strong></span>' +
            '</div>' +
            '<span class="hz1010-sum__plus" aria-hidden="true">+</span>' +
            '<div class="hz1010-sum__item">' +
              '<span class="hz1010-sum__num">' + numeroHTML(CONFIG.pixLabel) + '</span>' +
              '<span class="hz1010-sum__txt">pagando no <strong>Pix</strong></span>' +
            '</div>' +
          '</div>' +
          '<p class="hz1010-note">Os dois descontos valem juntos, na mesma compra.</p>' +
        '</div>' +
        '<div class="hz1010-cat__side">' +
          '<div class="hz1010-ticket">' +
            '<span class="hz1010-ticket__label">Seu cupom</span>' +
            '<div class="hz1010-ticket__row">' +
              '<span class="hz1010-ticket__code">' + esc(CONFIG.coupon) + '</span>' +
              '<button type="button" class="hz1010-copy" data-hz1010-copy data-hz1010-loc="categoria" aria-label="Copiar cupom ' + esc(CONFIG.coupon) + '">' +
                ICONS + '<span class="hz1010-copy-label">Copiar cupom</span>' +
              '</button>' +
            '</div>' +
            '<p class="hz1010-fine">Cole no carrinho e pague no Pix. Válido até ' + esc(CONFIG.deadlineLabel) + '.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      filtroHTML();
  }

  function caminho(url) {
    return url.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }

  function filtroHTML() {

    if (document.querySelector(SELETOR_FILTRO_EXISTENTE)) {
      return '';
    }

    var atual = caminho(window.location.pathname);
    var html = '';

    for (var i = 0; i < FILTROS.length; i++) {

      var ativo = caminho(FILTROS[i].url) === atual;

      html += '<a href="' + esc(FILTROS[i].url) + '"' +
        (ativo ? ' class="is-active" aria-current="page"' : '') + '>' +
        esc(FILTROS[i].nome) + '</a>';
    }

    return '<nav class="hz1010-filtro" aria-label="Filtrar por categoria">' + html + '</nav>';
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function paginaValida() {

    if (!PAGINAS.length) {
      return true;
    }

    var atual = caminho(window.location.pathname);

    for (var i = 0; i < PAGINAS.length; i++) {

      if (caminho(PAGINAS[i]) === atual) {
        return true;
      }
    }

    return false;
  }

  function montarBloco(state) {

    if (!paginaValida()) {
      return;
    }

    // Desktop: .row-title seguido de .row-filters. Mobile: só a linha do
    // título dentro de .products-filter, com os filtros logo depois.
    var h1 = document.querySelector(SELETOR_TITULO);
    var titulo = h1 && (h1.closest(".row") || h1);

    if (!titulo || !titulo.parentNode) {
      return;
    }

    var bloco = document.getElementById(ID);

    if (!bloco) {

      bloco = document.createElement("section");

      bloco.id = ID;
      bloco.className = "hz1010-cat";

      bloco.setAttribute("aria-label", "Oferta " + CONFIG.name);

      bloco.innerHTML = categoryHTML(state);
    }

    if (bloco.previousElementSibling !== titulo) {
      titulo.parentNode.insertBefore(bloco, titulo.nextSibling);
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
