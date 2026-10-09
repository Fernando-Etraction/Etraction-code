(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     TAG NOS PRODUTOS - MODELO 02 (FITA EM CHAMAS + MOLDURA)
     Usar um modelo só por vez (este ou o tagEmAlta.js).
     Nos produtos que estão na categoria Em Alta:
     - fita laranja "Em Alta" colada na borda da foto, com labaredas
       subindo por cima;
     - moldura de fogo girando em volta da foto (CONFIG.moldura).
     Aparece somente nas páginas de CONFIG.paginas.
     Automática: colocou ou tirou o produto da categoria no admin,
     a tag acompanha (não precisa mexer no script).
  ========================================================= */

  if (window.__hzEmAltaTagLoaded) {
    return;
  }

  window.__hzEmAltaTagLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    // Páginas onde a tag aparece. Lista vazia [] = site todo
    paginas: ["/ver-todos/em-alta"],
    categoriaUrl: "/ver-todos/em-alta",
    label: "Em Alta",
    moldura: true,    // false = só a fita, sem a borda de fogo na foto
    cacheMinutos: 10, // tempo que a lista de produtos fica guardada no navegador
    maxPaginas: 5     // limite de páginas lidas da categoria
  };

  var SELETOR_PRODUTO = ".product[data-sku]";
  var SELETOR_FOTO = ".product-list-image-container";

  var STYLE_ID = "hz-em-alta-tag-style";
  var TAG_CLASS = "hz-em-alta-tag";
  var MOLDURA_CLASS = "hz-em-alta-moldura";
  var CACHE_KEY = "hz-em-alta-skus";

  var skus = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     PÁGINA
  ========================================================= */

  function paginaPermitida() {

    // Usado só pelo preview local (Preview/preview.html)
    if (window.__hzEmAltaPreview || !CONFIG.paginas.length) {
      return true;
    }

    var atual = window.location.pathname.replace(/\/+$/, "") || "/";

    return CONFIG.paginas.indexOf(atual) !== -1;
  }


  /* =========================================================
     CSS
  ========================================================= */

  // Seletores com a classe da foto na frente: nas vitrines em carrossel a loja tem
  // ".owl-item span{font-size:14px}", que ganharia de uma classe só
  var CSS = [
    /* Fita colada na borda esquerda da foto, com o degradê correndo */
    '.product-list-image-container .hz-em-alta-tag{position:absolute;top:26px;left:0;z-index:6;box-sizing:border-box;display:inline-flex;align-items:center;margin:0;padding:8px 16px 8px 12px;border-radius:0 999px 999px 0;background:linear-gradient(90deg,#ff2d00,#ff7a00,#ffb300,#ff7a00,#ff2d00);background-size:200% 100%;box-shadow:0 2px 8px rgba(120,30,0,.35);color:#fff;font-family:inherit;font-size:12px;font-weight:800;line-height:1;letter-spacing:.1em;text-transform:uppercase;text-shadow:0 1px 2px rgba(120,20,0,.5);white-space:nowrap;pointer-events:none;-webkit-font-smoothing:antialiased;animation:hz-em-alta-fundo 2.5s linear infinite}',
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt{font-size:inherit;line-height:1;color:#fff}',

    /* Labaredas: cinco chamas em cima da fita, cada uma num tempo */
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas{position:absolute;left:4px;right:14px;bottom:100%;display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:-5px}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg{flex:none;width:13px;height:17px;overflow:visible}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(2n){width:10px;height:13px}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas path{fill:#ff3b0a;transform-box:fill-box;transform-origin:50% 100%;animation:hz-em-alta-chama 1s ease-in-out infinite}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(2n) path{fill:#ff9a1f;animation-duration:.75s}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(2) path{animation-delay:-.3s}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(3) path{animation-delay:-.6s}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(4) path{animation-delay:-.15s}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(5) path{animation-delay:-.45s}',

    /* As tags da loja (Pré Venda etc.) descem para baixo da fita */
    '.product.tag-em-alta .product-list-image-container .uoou-product-tag-badges{top:64px}',

    /* Moldura: anel de 3px por dentro da foto; a máscara vaza o miolo e sobra só a borda */
    '.product-list-image-container .hz-em-alta-moldura{position:absolute;top:0;right:0;bottom:0;left:0;z-index:4;box-sizing:border-box;padding:3px;overflow:hidden;pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}',
    '.product-list-image-container .hz-em-alta-moldura::before{content:"";position:absolute;left:50%;top:50%;width:200%;padding-bottom:200%;margin:-100% 0 0 -100%;background:conic-gradient(#ff2d00,#ffb300,#fff3c4,#ff7a00,#ff2d00,#2a0a00,#ff2d00);animation:hz-em-alta-giro 3s linear infinite}',

    '@keyframes hz-em-alta-chama{0%,100%{transform:scale(1,1) rotate(0)}20%{transform:scale(.9,1.14) rotate(-5deg)}40%{transform:scale(1.07,.93) rotate(4deg)}60%{transform:scale(.94,1.18) rotate(-3deg)}80%{transform:scale(1.05,.97) rotate(5deg)}}',
    '@keyframes hz-em-alta-fundo{to{background-position:-200% 0}}',
    '@keyframes hz-em-alta-giro{to{transform:rotate(360deg)}}',

    '@media (max-width:767px){',
    '.product-list-image-container .hz-em-alta-tag{top:20px;padding:6px 12px 6px 9px;font-size:10px}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas{left:3px;right:10px;margin-bottom:-4px}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg{width:10px;height:13px}',
    '.hz-em-alta-tag .hz-em-alta-tag__labaredas svg:nth-child(2n){width:8px;height:10px}',
    '.product.tag-em-alta .product-list-image-container .uoou-product-tag-badges{top:50px}',
    '.product-list-image-container .hz-em-alta-moldura{padding:2px}',
    '}',

    /* Visitante que pediu menos animação no aparelho: tudo parado */
    '@media (prefers-reduced-motion:reduce){',
    '.product-list-image-container .hz-em-alta-tag,.hz-em-alta-tag .hz-em-alta-tag__labaredas path,.product-list-image-container .hz-em-alta-moldura::before{animation:none}',
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
     PRODUTOS DA CATEGORIA
     Lê a própria categoria Em Alta e guarda os SKUs no navegador
  ========================================================= */

  function lerCache() {

    try {

      var cache = JSON.parse(window.sessionStorage.getItem(CACHE_KEY));

      if (cache && Date.now() - cache.em < CONFIG.cacheMinutos * 60000) {
        return cache.skus;
      }

    } catch (erro) { }

    return null;
  }

  function gravarCache(lista) {

    try {

      window.sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ em: Date.now(), skus: lista })
      );

    } catch (erro) { }
  }

  function buscarPagina(url, lista, pagina) {

    return fetch(url, { credentials: "same-origin" })
      .then(function (resposta) {
        return resposta.ok ? resposta.text() : "";
      })
      .then(function (html) {

        var doc = new DOMParser().parseFromString(html, "text/html");
        var produtos = doc.querySelectorAll(SELETOR_PRODUTO);

        for (var i = 0; i < produtos.length; i++) {
          lista[produtos[i].getAttribute("data-sku")] = 1;
        }

        var proxima =
          doc.querySelector(".pagination li.next:not(.disabled) a[href]");

        if (proxima && pagina < CONFIG.maxPaginas) {
          return buscarPagina(proxima.getAttribute("href"), lista, pagina + 1);
        }

        return lista;
      });
  }

  function carregarSkus() {

    var cache = lerCache();

    if (cache) {
      return Promise.resolve(cache);
    }

    return buscarPagina(CONFIG.categoriaUrl, {}, 1).then(function (lista) {

      gravarCache(lista);

      return lista;
    });
  }


  /* =========================================================
     TAG
  ========================================================= */

  var CHAMA =
    '<svg viewBox="0 0 24 30" aria-hidden="true">' +
    '<path d="M12 0c1.5 5-2 7.5-4.2 10.6C5.6 13.6 4 16.2 4 20a8 8 0 0 0 16 0c0-3-1.2-5.4-2.7-7.2-.5 2-1.5 3.1-2.7 3.8.5-5-.6-11.8-2.6-16.6z"/>' +
    '</svg>';

  function criarTag() {

    var tag = document.createElement("span");

    tag.className = TAG_CLASS;

    var labaredas = document.createElement("span");

    labaredas.className = "hz-em-alta-tag__labaredas";
    labaredas.innerHTML = CHAMA + CHAMA + CHAMA + CHAMA + CHAMA;

    var texto = document.createElement("span");

    texto.className = "hz-em-alta-tag__txt";
    texto.textContent = CONFIG.label;

    tag.appendChild(labaredas);
    tag.appendChild(texto);

    return tag;
  }

  function criarMoldura() {

    var moldura = document.createElement("span");

    moldura.className = MOLDURA_CLASS;
    moldura.setAttribute("aria-hidden", "true");

    return moldura;
  }

  function aplicar() {

    if (!skus) {
      return;
    }

    var produtos =
      document.querySelectorAll(SELETOR_PRODUTO + ":not([data-hz-em-alta])");

    for (var i = 0; i < produtos.length; i++) {

      var produto = produtos[i];

      // Marca o card como já conferido: evita tag duplicada
      produto.setAttribute("data-hz-em-alta", "1");

      if (!skus[produto.getAttribute("data-sku")]) {
        continue;
      }

      var foto = produto.querySelector(SELETOR_FOTO);

      if (!foto) {
        continue;
      }

      if (CONFIG.moldura) {
        foto.appendChild(criarMoldura());
      }

      foto.appendChild(criarTag());

      // A classe também empurra as tags da loja para baixo da fita (ver CSS)
      produto.classList.add("tag-em-alta");
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

    if (!paginaPermitida()) {
      return;
    }

    carregarSkus()
      .then(function (lista) {

        skus = lista;

        adicionarEstilo();
        aplicar();

        iniciarObserver();
      })
      .catch(function () { });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
