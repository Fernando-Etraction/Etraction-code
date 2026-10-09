(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     FILTRO DE CATEGORIA
     Adiciona "Em Alta" (com foguinho) no topo da lista "Categorias"
     das páginas de categoria e busca (computador e celular).
     Onde a loja já lista a categoria, só destaca e sobe o item,
     sem duplicar.
  ========================================================= */

  if (window.__hzEmAltaFiltroLoaded) {
    return;
  }

  window.__hzEmAltaFiltroLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    categoriaUrl: "/ver-todos/em-alta",
    label: "EM ALTA"
  };

  // Computador: lista "Categorias" | Celular: lista "Navegar por" dentro do Filtrar
  var SELETOR_LISTA =
    "#show-category ul, #collapseCategory .panel-body > ul";

  var STYLE_ID = "hz-em-alta-filtro-style";
  var LINK_CLASS = "hz-em-alta-filtro";

  var observer = null;
  var observerFrame = null;


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '#show-category a.hz-em-alta-filtro,#collapseCategory a.hz-em-alta-filtro{display:inline-flex;align-items:center;gap:5px;color:#ff3d00;font-weight:700}',
    '#show-category a.hz-em-alta-filtro:hover,#collapseCategory a.hz-em-alta-filtro:hover{color:#d92f00}',

    /* Celular: o link ocupa a linha toda, como os outros da lista */
    '#collapseCategory a.hz-em-alta-filtro{display:flex}',

    '.hz-em-alta-filtro .hz-em-alta-filtro__fogo{flex:none;width:14px;height:14px;margin-top:-2px;overflow:visible}',
    '.hz-em-alta-filtro .hz-em-alta-filtro__fogo path{transform-box:fill-box;transform-origin:50% 100%}',
    '.hz-em-alta-filtro .hz-em-alta-filtro__chama{fill:#ff3d00;animation:hz-em-alta-filtro-chama .9s ease-in-out infinite}',
    '.hz-em-alta-filtro .hz-em-alta-filtro__miolo{fill:#ffb300;animation:hz-em-alta-filtro-chama .6s ease-in-out infinite reverse}',

    '@keyframes hz-em-alta-filtro-chama{0%,100%{transform:scale(1,1) rotate(0)}20%{transform:scale(.92,1.12) rotate(-4deg)}40%{transform:scale(1.06,.94) rotate(3deg)}60%{transform:scale(.95,1.16) rotate(-2deg)}80%{transform:scale(1.04,.98) rotate(4deg)}}',

    '@media (prefers-reduced-motion:reduce){',
    '.hz-em-alta-filtro .hz-em-alta-filtro__fogo path{animation:none}',
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
     ITEM DO FILTRO
  ========================================================= */

  var FOGO =
    '<svg class="hz-em-alta-filtro__fogo" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path class="hz-em-alta-filtro__chama" d="M12 1.5c1 3.6-1.4 5.7-3 7.8C7.4 11.4 6 13.3 6 16a6 6 0 0 0 12 0c0-2.2-.9-4-2-5.3-.4 1.5-1.1 2.3-2 2.8.4-3.7-.5-8.6-2-12z"/>' +
    '<path class="hz-em-alta-filtro__miolo" d="M12 21.5a3 3 0 0 1-3-3c0-1.8 1.3-2.7 2.2-4.2.4 1.2 1 1.9 1.9 2.5.9.7 1.9 1.4 1.9 2.7a3 3 0 0 1-3 2z"/>' +
    '</svg>';

  function aplicar() {

    var listas = document.querySelectorAll(SELETOR_LISTA);

    for (var i = 0; i < listas.length; i++) {

      var lista = listas[i];

      if (lista.querySelector("." + LINK_CLASS)) {
        continue;
      }

      adicionarEstilo();

      // Aproveita o item da loja quando a categoria já está na lista
      var link =
        lista.querySelector('a[href$="' + CONFIG.categoriaUrl + '"]');

      var item = link ? link.parentNode : document.createElement("li");

      if (!link) {
        link = document.createElement("a");
        link.href = CONFIG.categoriaUrl;
        item.appendChild(link);
      }

      link.className = LINK_CLASS;
      link.innerHTML = FOGO;

      var texto = document.createElement("span");

      texto.textContent = CONFIG.label;

      link.appendChild(texto);

      lista.insertBefore(item, lista.firstChild);
    }
  }


  /* =========================================================
     OBSERVER
     Cobre o filtro redesenhado depois (filtros aplicados, paginação)
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
