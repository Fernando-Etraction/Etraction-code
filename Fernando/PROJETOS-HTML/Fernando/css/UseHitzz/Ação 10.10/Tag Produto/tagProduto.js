(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     TAG NOS PRODUTOS
     "Último dia" sobre a foto de todos os cards de produto do site.
     Automática: aparece sozinha em 12/10 (último dia) e some às 23h59.
     Pode ficar instalada desde já.
     (home, categorias, busca e vitrines da página de produto)
  ========================================================= */

  if (window.__hz1010TagLoaded) {
    return;
  }

  window.__hz1010TagLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    lastDayLabel: "Último dia",
    icon: "🔥" // foguinho
  };

  var SELETOR_FOTO = ".product-list-image-container";

  var STYLE_ID = "hz1010-tag-style";
  var TAG_CLASS = "hz1010-tag";

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     MOMENTO DA AÇÃO - AUTOMÁTICO (horário de Brasília)

     09/10, 20h às 22h   aquecimento: só a tarja, com contagem até a abertura
     09/10 22h a 11/10   oferta ativa
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

  function estadoAtual() {

    // A tag só existe no último dia
    return momentoDaAcao() === "last" ? "last" : null;
  }


  /* =========================================================
     CSS
  ========================================================= */

  // Seletores com a classe da foto na frente: nas vitrines em carrossel a loja tem
  // ".owl-item span{font-size:14px}", que ganharia de uma classe só
  var CSS = [
    '.product-list-image-container .hz1010-tag{position:absolute;top:10px;left:0;z-index:11;box-sizing:border-box;display:inline-flex;align-items:center;gap:5px;margin:0;padding:7px 11px 7px 10px;border-radius:0 999px 999px 0;background:#e5262e;box-shadow:0 2px 8px rgba(0,0,0,.18);color:#fff;font-family:inherit;font-size:13px;font-weight:800;line-height:1;letter-spacing:.08em;text-transform:uppercase;text-align:left;white-space:nowrap;pointer-events:none;-webkit-font-smoothing:antialiased}',

    /* Foguinho: sem espaçamento de letra e um pouco maior que o texto */
    '.hz1010-tag .hz1010-tag__txt{font-size:inherit;line-height:1}',
    '.hz1010-tag .hz1010-tag__icon{font-size:14px;letter-spacing:0;line-height:1}',

    '@media (max-width:600px){',
    '.product-list-image-container .hz1010-tag{top:8px;gap:4px;padding:6px 9px 6px 8px;font-size:11px}',
    '.hz1010-tag .hz1010-tag__icon{font-size:12px}',
    '}'
  ].join("");

  function adicionarEstilo() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);
  }


  /* =========================================================
     TAG
  ========================================================= */

  function criarTag() {

    var tag = document.createElement("span");

    tag.className = TAG_CLASS;

    var texto = document.createElement("span");

    texto.className = "hz1010-tag__txt";
    texto.textContent = CONFIG.lastDayLabel;

    var icone = document.createElement("span");

    icone.className = "hz1010-tag__icon";
    icone.textContent = CONFIG.icon;
    icone.setAttribute("aria-hidden", "true");

    tag.appendChild(texto);
    tag.appendChild(icone);

    return tag;
  }

  function removerTags() {

    var tags = document.querySelectorAll("." + TAG_CLASS);

    for (var i = 0; i < tags.length; i++) {
      tags[i].remove();
    }
  }

  function aplicar() {

    var state = estadoAtual();

    if (state !== estadoRenderizado) {
      removerTags();
      estadoRenderizado = state;
    }

    if (!state) {
      return;
    }

    adicionarEstilo();

    var fotos = document.querySelectorAll(SELETOR_FOTO);

    for (var i = 0; i < fotos.length; i++) {

      // Só os filhos diretos contam: evita tag duplicada no mesmo card
      var existente = false;

      for (var j = 0; j < fotos[i].children.length; j++) {

        if (fotos[i].children[j].className === TAG_CLASS) {
          existente = true;
          break;
        }
      }

      if (!existente) {
        fotos[i].appendChild(criarTag());
      }
    }
  }


  /* =========================================================
     OBSERVER
     Cobre produtos carregados depois (paginação, filtros, vitrines)
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

        aplicar();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    aplicar();

    iniciarObserver();

    // Liga a tag na virada para o último dia e desliga no fim, sem recarregar a página
    setInterval(aplicar, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
