(function () {
  "use strict";

  /* =========================================================
     HITZZ - TAG "EM ALTA"
     Aparece em todas as páginas, sobre a foto de todo produto
     que tiver a classe "tag-em-alta" (a plataforma coloca essa
     classe no card quando o produto recebe a tag "em alta").
     Na página do produto, entra acima do título quando o
     <body> tiver a mesma classe.

     Não tem calendário: enquanto o produto tiver a tag, aparece.
  ========================================================= */

  if (window.__hzEmAltaLoaded) {
    return;
  }

  window.__hzEmAltaLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    label: "Em alta",
    icon: "🔥",

    // Classe que a plataforma põe no produto com a tag
    classeDoProduto: "tag-em-alta"
  };

  var SELETORES = {
    card: ".product." + CONFIG.classeDoProduto,
    foto: ".product-list-image-container",
    paginaDeProduto: "body." + CONFIG.classeDoProduto,
    tituloDoProduto: "#right-column h1.product-title, h1.product-title"
  };

  var STYLE_ID = "hz-em-alta-style";
  var TAG_CLASS = "hz-em-alta";

  var observer = null;
  var observerFrame = null;


  /* =========================================================
     CSS
     Mesmo estilo dos selos da loja ("Pré Venda"): preto, cantos
     de 5px, texto branco em negrito. Fica no canto superior
     direito da foto, para não disputar espaço com os selos da
     esquerda.
  ========================================================= */

  var CSS = [
    // Seletor com a classe da foto na frente: nas vitrines em carrossel a loja tem
    // ".owl-item span{font-size:14px}", que ganharia de uma classe só
    '.product-list-image-container .hz-em-alta,.hz-em-alta.hz-em-alta--pdp{box-sizing:border-box;display:inline-flex;align-items:center;gap:5px;margin:0;padding:6px 10px;border-radius:5px;background:#000;color:#fff;font-family:inherit;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;-webkit-font-smoothing:antialiased}',
    '.product-list-image-container .hz-em-alta{position:absolute;top:10px;right:10px;z-index:11;pointer-events:none}',
    '.hz-em-alta .hz-em-alta__txt{font-size:inherit;line-height:1.2;letter-spacing:inherit}',
    '.hz-em-alta .hz-em-alta__icon{font-size:12px;letter-spacing:0;line-height:1}',

    /* Na página do produto: acima do título */
    '.hz-em-alta.hz-em-alta--pdp{margin:0 0 8px}',

    '@media (max-width:600px){',
    '.product-list-image-container .hz-em-alta{top:8px;right:8px;gap:4px;padding:5px 8px;font-size:9px}',
    '.hz-em-alta .hz-em-alta__icon{font-size:11px}',
    /* Card estreito com a tag "Último dia" da ação 10.10 na mesma linha: "Em alta" desce
       para a linha de baixo. Se houver selo da loja (ex.: "Pré Venda"), é a "Último dia"
       que desce, e "Em alta" continua em cima. */
    '.product-list-image-container:has(.hz1010-tag):not(:has(.uoou-product-tag-badge)) .hz-em-alta{top:40px}',
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

  function criarTag(naPaginaDeProduto) {

    var tag = document.createElement("span");

    tag.className = TAG_CLASS + (naPaginaDeProduto ? " hz-em-alta--pdp" : "");

    var texto = document.createElement("span");

    texto.className = "hz-em-alta__txt";
    texto.textContent = CONFIG.label;

    var icone = document.createElement("span");

    icone.className = "hz-em-alta__icon";
    icone.textContent = CONFIG.icon;
    icone.setAttribute("aria-hidden", "true");

    tag.appendChild(texto);
    tag.appendChild(icone);

    return tag;
  }

  function temTag(pai) {

    // Só os filhos diretos contam: evita tag duplicada no mesmo lugar
    for (var i = 0; i < pai.children.length; i++) {

      if (pai.children[i].classList.contains(TAG_CLASS)) {
        return true;
      }
    }

    return false;
  }

  function aplicar() {

    var cards = document.querySelectorAll(SELETORES.card);
    var pdp = document.querySelector(SELETORES.paginaDeProduto);

    // Tira a tag de cards que perderam a classe (listas recarregadas por AJAX)
    var tags = document.querySelectorAll(SELETORES.foto + " > ." + TAG_CLASS);

    for (var t = 0; t < tags.length; t++) {

      if (!tags[t].closest(SELETORES.card)) {
        tags[t].remove();
      }
    }

    if (!cards.length && !pdp) {
      return;
    }

    adicionarEstilo();

    // Cards de produto (home, categorias, busca, vitrines)
    for (var i = 0; i < cards.length; i++) {

      var foto = cards[i].querySelector(SELETORES.foto);

      if (foto && !temTag(foto)) {
        foto.appendChild(criarTag(false));
      }
    }

    // Página do produto: acima do título
    if (pdp) {

      var titulo = document.querySelector(SELETORES.tituloDoProduto);

      if (
        titulo &&
        titulo.parentNode &&
        !(titulo.previousElementSibling && titulo.previousElementSibling.classList.contains(TAG_CLASS))
      ) {
        titulo.parentNode.insertBefore(criarTag(true), titulo);
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

      // setTimeout em vez de requestAnimationFrame: funciona também com a aba em segundo plano
      observerFrame = setTimeout(function () {

        observerFrame = null;

        aplicar();
      }, 60);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
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
