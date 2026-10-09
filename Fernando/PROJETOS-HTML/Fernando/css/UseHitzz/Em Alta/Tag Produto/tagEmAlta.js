(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     TAG NOS PRODUTOS
     Selo preto com fogueira animada (chama em 3 camadas, brasas
     subindo e texto em brasa) no canto direito da foto dos produtos
     que estão na categoria Em Alta.
     O texto é um carrossel: alterna entre as frases de
     CONFIG.mensagens ("Em Alta" e "20% OFF").
     Aparece somente nas páginas de CONFIG.paginas.
     Automática: colocou ou tirou o produto da categoria no admin,
     a tag acompanha (não precisa mexer no script).
     Usar um modelo só por vez (este ou o tagEmAltaModelo02.js).
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
    // Frases do carrossel, na ordem. Uma só = tag fixa, sem troca
    mensagens: ["Em Alta", "20% OFF"],
    trocaSegundos: 2.5, // tempo de cada frase na tela
    cacheMinutos: 10, // tempo que a lista de produtos fica guardada no navegador
    maxPaginas: 5     // limite de páginas lidas da categoria
  };

  var SELETOR_PRODUTO = ".product[data-sku]";
  var SELETOR_FOTO = ".product-list-image-container";

  var STYLE_ID = "hz-em-alta-tag-style";
  var TAG_CLASS = "hz-em-alta-tag";
  var CACHE_KEY = "hz-em-alta-skus";

  var skus = null;
  var indice = 0;      // frase do carrossel que está na tela
  var carrossel = null;
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
    /* Selo preto no canto direito da foto: a fogueira fica à esquerda dele e passa da borda de cima */
    '.product-list-image-container .hz-em-alta-tag{position:absolute;top:20px;right:14px;z-index:6;box-sizing:border-box;display:inline-flex;align-items:center;min-height:27px;margin:0;padding:6px 13px 6px 31px;border:1px solid #2a1206;border-radius:999px;background:linear-gradient(180deg,#1c1310,#0b0b0b);font-family:inherit;font-size:12px;font-weight:800;line-height:1;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap;pointer-events:none;-webkit-font-smoothing:antialiased;animation:hz-em-alta-brilho 1.6s ease-in-out infinite}',

    /* Carrossel: as frases ficam uma em cima da outra (o selo tem a largura da maior);
       a da vez sobe para o lugar e a anterior sai por cima */
    '.hz-em-alta-tag .hz-em-alta-tag__frases{display:inline-grid;overflow:hidden;padding:2px 0;margin:-2px 0}',
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt{grid-area:1/1;text-align:center;opacity:0;transform:translateY(120%);transition:transform .45s cubic-bezier(.3,.9,.3,1),opacity .3s ease}',
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt.is-ativa{opacity:1;transform:translateY(0)}',
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt.is-saindo{opacity:0;transform:translateY(-120%)}',

    /* Texto em brasa: degradê correndo por dentro das letras */
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt{font-size:inherit;line-height:1;color:#ff8a1f;background:linear-gradient(90deg,#ffd75e,#ff8a1f,#ff3b0a,#ff8a1f,#ffd75e);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:hz-em-alta-texto 2.2s linear infinite}',

    /* Fogueira: três chamas tremulando em tempos diferentes */
    '.hz-em-alta-tag .hz-em-alta-tag__fogo{position:absolute;left:6px;bottom:4px;width:21px;height:27px;overflow:visible;filter:drop-shadow(0 0 4px rgba(255,120,0,.85))}',
    '.hz-em-alta-tag .hz-em-alta-tag__fogo path{transform-box:fill-box;transform-origin:50% 100%}',
    '.hz-em-alta-tag .hz-em-alta-tag__chama{fill:#ff3b0a;animation:hz-em-alta-chama 1s ease-in-out infinite}',
    '.hz-em-alta-tag .hz-em-alta-tag__meio{fill:#ff9a1f;animation:hz-em-alta-chama .75s ease-in-out infinite reverse}',
    '.hz-em-alta-tag .hz-em-alta-tag__miolo{fill:#ffe27a;animation:hz-em-alta-chama .5s ease-in-out infinite}',

    /* Brasas: pontinhos que sobem da fogueira e apagam */
    '.hz-em-alta-tag .hz-em-alta-tag__brasa{position:absolute;left:15px;bottom:16px;width:3px;height:3px;border-radius:50%;background:#ffc04a;box-shadow:0 0 4px #ff7a00;opacity:0;animation:hz-em-alta-brasa 1.8s ease-out infinite}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa:nth-of-type(2){left:10px;width:2px;height:2px;animation-delay:.6s;animation-duration:2.1s}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa:nth-of-type(3){left:20px;width:2px;height:2px;animation-delay:1.2s;animation-duration:1.5s}',

    '@keyframes hz-em-alta-chama{0%,100%{transform:scale(1,1) rotate(0)}20%{transform:scale(.9,1.14) rotate(-5deg)}40%{transform:scale(1.07,.93) rotate(4deg)}60%{transform:scale(.94,1.18) rotate(-3deg)}80%{transform:scale(1.05,.97) rotate(5deg)}}',
    '@keyframes hz-em-alta-brasa{0%{opacity:0;transform:translate(0,0) scale(1)}15%{opacity:1}100%{opacity:0;transform:translate(7px,-26px) scale(.3)}}',
    '@keyframes hz-em-alta-texto{to{background-position:-200% 0}}',
    '@keyframes hz-em-alta-brilho{0%,100%{box-shadow:0 2px 6px rgba(0,0,0,.25),0 0 0 rgba(255,90,0,0)}50%{box-shadow:0 2px 6px rgba(0,0,0,.25),0 0 14px rgba(255,90,0,.75)}}',

    '@media (max-width:600px){',
    '.product-list-image-container .hz-em-alta-tag{top:15px;right:10px;min-height:22px;padding:5px 10px 5px 25px;font-size:10px}',
    '.hz-em-alta-tag .hz-em-alta-tag__fogo{left:5px;bottom:3px;width:17px;height:22px}',

    /* No celular a foto é estreita e o selo encostaria nas tags da loja
       (Pré Venda etc.): elas descem para a linha de baixo */
    '.product.tag-em-alta .product-list-image-container .uoou-product-tag-badges{top:44px}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa{left:12px;bottom:13px}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa:nth-of-type(2){left:8px}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa:nth-of-type(3){left:16px}',
    '}',

    /* Visitante que pediu menos animação no aparelho: tag parada, sem brasas */
    '@media (prefers-reduced-motion:reduce){',
    '.product-list-image-container .hz-em-alta-tag,.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt,.hz-em-alta-tag .hz-em-alta-tag__fogo path{animation:none}',
    '.product-list-image-container .hz-em-alta-tag .hz-em-alta-tag__txt{transition:none}',
    '.hz-em-alta-tag .hz-em-alta-tag__brasa{display:none}',
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

  var FOGO =
    '<svg class="hz-em-alta-tag__fogo" viewBox="0 0 24 30" aria-hidden="true">' +
    '<path class="hz-em-alta-tag__chama" d="M12 0c1.5 5-2 7.5-4.2 10.6C5.6 13.6 4 16.2 4 20a8 8 0 0 0 16 0c0-3-1.2-5.4-2.7-7.2-.5 2-1.5 3.1-2.7 3.8.5-5-.6-11.8-2.6-16.6z"/>' +
    '<path class="hz-em-alta-tag__meio" d="M12 9c.8 3-1.2 4.6-2.5 6.5C8.3 17.2 7.5 18.6 7.5 20.8a4.5 4.5 0 0 0 9 0c0-1.7-.7-3-1.5-4-.3 1-.8 1.7-1.5 2.1.3-2.8-.4-6.9-1.5-9.9z"/>' +
    '<path class="hz-em-alta-tag__miolo" d="M12 17c.4 1.6-.6 2.4-1.2 3.4-.5.8-.8 1.4-.8 2.3a2 2 0 0 0 4 0c0-1.5-1.2-2.4-2-5.7z"/>' +
    '</svg>';

  var BRASAS =
    '<i class="hz-em-alta-tag__brasa"></i>' +
    '<i class="hz-em-alta-tag__brasa"></i>' +
    '<i class="hz-em-alta-tag__brasa"></i>';

  function criarTag() {

    var tag = document.createElement("span");

    tag.className = TAG_CLASS;
    tag.innerHTML = BRASAS + FOGO;

    var frases = document.createElement("span");

    frases.className = "hz-em-alta-tag__frases";

    for (var i = 0; i < CONFIG.mensagens.length; i++) {

      var texto = document.createElement("span");

      // Tag nova já entra na frase que as outras estão mostrando
      texto.className =
        "hz-em-alta-tag__txt" + (i === indice ? " is-ativa" : "");
      texto.textContent = CONFIG.mensagens[i];

      frases.appendChild(texto);
    }

    tag.appendChild(frases);

    return tag;
  }


  /* =========================================================
     CARROSSEL
     Um relógio só para a página: todas as tags trocam juntas
  ========================================================= */

  function trocarFrase() {

    var anterior = indice;

    indice = (indice + 1) % CONFIG.mensagens.length;

    var tags = document.querySelectorAll("." + TAG_CLASS);

    for (var i = 0; i < tags.length; i++) {

      var textos = tags[i].querySelectorAll(".hz-em-alta-tag__txt");

      for (var j = 0; j < textos.length; j++) {
        textos[j].classList.toggle("is-ativa", j === indice);
        textos[j].classList.toggle("is-saindo", j === anterior);
      }
    }
  }

  function iniciarCarrossel() {

    if (carrossel || CONFIG.mensagens.length < 2) {
      return;
    }

    carrossel = setInterval(trocarFrase, CONFIG.trocaSegundos * 1000);
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

      // Direto na foto, no canto direito: não disputa lugar com as tags
      // da loja (Pré Venda etc.), que ficam à esquerda
      foto.appendChild(criarTag());

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
        iniciarCarrossel();
      })
      .catch(function () { });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
