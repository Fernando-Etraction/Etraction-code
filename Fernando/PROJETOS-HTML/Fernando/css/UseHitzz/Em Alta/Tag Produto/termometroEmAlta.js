(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     TERMÔMETRO
     Barrinha de "temperatura" embaixo da foto de cada produto da
     categoria Em Alta: quanto mais no começo da categoria, mais
     cheia e mais vermelha.
     A posição vem da ordem padrão da categoria no admin, mesmo que
     o visitante reordene a página por preço: para o termômetro
     fazer sentido, deixe os mais procurados primeiro.
     Aparece somente nas páginas de CONFIG.paginas.
  ========================================================= */

  if (window.__hzEmAltaTermometroLoaded) {
    return;
  }

  window.__hzEmAltaTermometroLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    paginas: ["/ver-todos/em-alta"],
    categoriaUrl: "/ver-todos/em-alta",
    minimo: 45,       // quanto da barra o último produto enche (%)
    // Do terço mais quente da categoria para o menos quente
    rotulos: ["Pegando fogo", "Muito quente", "Quente"],
    cacheMinutos: 10, // tempo que a ordem da categoria fica guardada no navegador
    maxPaginas: 5     // limite de páginas lidas da categoria
  };

  var SELETOR_PRODUTO = ".product[data-sku]";
  var SELETOR_INFO = ".product-list-info";

  var STYLE_ID = "hz-em-alta-termo-style";
  var TERMO_CLASS = "hz-em-alta-termo";
  var CACHE_KEY = "hz-em-alta-ordem";

  var ordem = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     PÁGINA
  ========================================================= */

  function paginaPermitida() {

    if (!CONFIG.paginas.length) {
      return true;
    }

    var atual = window.location.pathname.replace(/\/+$/, "") || "/";

    return CONFIG.paginas.indexOf(atual) !== -1;
  }


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    '.product-list-info .hz-em-alta-termo{box-sizing:border-box;display:block;order:-1;width:100%;margin:0 0 8px;padding:0;font-family:inherit;text-align:left}',

    '.product-list-info .hz-em-alta-termo .hz-em-alta-termo__rotulo{display:flex;align-items:center;gap:4px;margin:0 0 4px;color:#c52b00;font-size:10px;font-weight:700;line-height:1;letter-spacing:.08em;text-transform:uppercase}',
    '.hz-em-alta-termo .hz-em-alta-termo__rotulo svg{flex:none;width:9px;height:11px;margin-top:-2px;overflow:visible}',
    '.hz-em-alta-termo .hz-em-alta-termo__rotulo path{fill:#ff3b0a;transform-box:fill-box;transform-origin:50% 100%;animation:hz-em-alta-termo-chama .9s ease-in-out infinite}',

    '.hz-em-alta-termo .hz-em-alta-termo__trilho{position:relative;display:block;height:5px;border-radius:999px;background:#efe9e6}',

    /* A barra enche ao aparecer. O degradê é do tamanho do trilho inteiro,
       então barra curta fica amarela/laranja e barra cheia chega ao vermelho */
    '.hz-em-alta-termo .hz-em-alta-termo__barra{position:relative;display:block;height:100%;border-radius:999px;background-image:linear-gradient(90deg,#ffc93d,#ff7a00 55%,#ff2d00);background-repeat:no-repeat;transform-origin:0 50%;animation:hz-em-alta-termo-encher 1.1s cubic-bezier(.2,.8,.2,1) both}',

    /* Ponta acesa pulsando */
    '.hz-em-alta-termo .hz-em-alta-termo__barra::after{content:"";position:absolute;right:-3px;top:50%;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;background:#ff3b0a;box-shadow:0 0 6px #ff7a00;animation:hz-em-alta-termo-ponta 1.4s ease-in-out infinite}',

    /* Os menos quentes ficam mais discretos */
    '.product-list-info .hz-em-alta-termo--2 .hz-em-alta-termo__rotulo{color:#b8612f}',
    '.hz-em-alta-termo--2 .hz-em-alta-termo__rotulo path{fill:#ff9a1f}',
    '.hz-em-alta-termo--2 .hz-em-alta-termo__barra::after{background:#ff9a1f}',

    '@keyframes hz-em-alta-termo-encher{from{transform:scaleX(0)}to{transform:scaleX(1)}}',
    '@keyframes hz-em-alta-termo-ponta{0%,100%{box-shadow:0 0 4px #ff7a00}50%{box-shadow:0 0 10px 2px #ff7a00}}',
    '@keyframes hz-em-alta-termo-chama{0%,100%{transform:scale(1,1) rotate(0)}25%{transform:scale(.9,1.14) rotate(-5deg)}50%{transform:scale(1.07,.93) rotate(4deg)}75%{transform:scale(.94,1.16) rotate(-3deg)}}',

    '@media (max-width:767px){',
    '.product-list-info .hz-em-alta-termo{margin-bottom:6px}',
    '.product-list-info .hz-em-alta-termo .hz-em-alta-termo__rotulo{font-size:9px}',
    '.hz-em-alta-termo .hz-em-alta-termo__trilho{height:4px}',
    '.hz-em-alta-termo .hz-em-alta-termo__barra::after{width:8px;height:8px;margin-top:-4px}',
    '}',

    /* Visitante que pediu menos animação no aparelho: barra já cheia, parada */
    '@media (prefers-reduced-motion:reduce){',
    '.hz-em-alta-termo .hz-em-alta-termo__barra,.hz-em-alta-termo .hz-em-alta-termo__barra::after,.hz-em-alta-termo .hz-em-alta-termo__rotulo path{animation:none}',
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
     ORDEM DA CATEGORIA
     Lê a categoria Em Alta na ordem padrão e guarda no navegador
  ========================================================= */

  function lerCache() {

    try {

      var cache = JSON.parse(window.sessionStorage.getItem(CACHE_KEY));

      if (cache && Date.now() - cache.em < CONFIG.cacheMinutos * 60000) {
        return cache.ordem;
      }

    } catch (erro) { }

    return null;
  }

  function gravarCache(lista) {

    try {

      window.sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ em: Date.now(), ordem: lista })
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

          var sku = produtos[i].getAttribute("data-sku");

          if (lista.indexOf(sku) === -1) {
            lista.push(sku);
          }
        }

        var proxima =
          doc.querySelector(".pagination li.next:not(.disabled) a[href]");

        if (proxima && pagina < CONFIG.maxPaginas) {
          return buscarPagina(proxima.getAttribute("href"), lista, pagina + 1);
        }

        return lista;
      });
  }

  function carregarOrdem() {

    var cache = lerCache();

    if (cache) {
      return Promise.resolve(cache);
    }

    return buscarPagina(CONFIG.categoriaUrl, [], 1).then(function (lista) {

      gravarCache(lista);

      return lista;
    });
  }


  /* =========================================================
     TERMÔMETRO
  ========================================================= */

  var CHAMA =
    '<svg viewBox="0 0 24 30" aria-hidden="true">' +
    '<path d="M12 0c1.5 5-2 7.5-4.2 10.6C5.6 13.6 4 16.2 4 20a8 8 0 0 0 16 0c0-3-1.2-5.4-2.7-7.2-.5 2-1.5 3.1-2.7 3.8.5-5-.6-11.8-2.6-16.6z"/>' +
    '</svg>';

  function criarTermometro(posicao, total) {

    // Primeiro da categoria = 100%; último = CONFIG.minimo
    var cheio = total > 1
      ? 100 - (posicao / (total - 1)) * (100 - CONFIG.minimo)
      : 100;

    var faixa = Math.min(2, Math.floor((posicao / total) * 3));

    var termo = document.createElement("div");
    var rotulo = document.createElement("span");
    var texto = document.createElement("span");
    var trilho = document.createElement("span");
    var barra = document.createElement("span");

    termo.className = TERMO_CLASS + " " + TERMO_CLASS + "--" + faixa;

    rotulo.className = "hz-em-alta-termo__rotulo";
    rotulo.innerHTML = CHAMA;

    texto.textContent = CONFIG.rotulos[faixa];
    rotulo.appendChild(texto);

    trilho.className = "hz-em-alta-termo__trilho";
    trilho.setAttribute("aria-hidden", "true");

    barra.className = "hz-em-alta-termo__barra";
    barra.style.width = cheio.toFixed(1) + "%";
    barra.style.backgroundSize = (10000 / cheio).toFixed(1) + "% 100%";

    trilho.appendChild(barra);

    termo.appendChild(rotulo);
    termo.appendChild(trilho);

    return termo;
  }

  function aplicar() {

    if (!ordem || !ordem.length) {
      return;
    }

    var produtos =
      document.querySelectorAll(SELETOR_PRODUTO + ":not([data-hz-em-alta-termo])");

    for (var i = 0; i < produtos.length; i++) {

      var produto = produtos[i];

      // Marca o card como já conferido: evita termômetro duplicado
      produto.setAttribute("data-hz-em-alta-termo", "1");

      var posicao = ordem.indexOf(produto.getAttribute("data-sku"));

      if (posicao === -1) {
        continue;
      }

      var info = produto.querySelector(SELETOR_INFO);

      if (!info) {
        continue;
      }

      info.insertBefore(
        criarTermometro(posicao, ordem.length),
        info.firstChild
      );
    }
  }


  /* =========================================================
     OBSERVER
     Cobre produtos carregados depois (paginação, filtros)
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

    carregarOrdem()
      .then(function (lista) {

        ordem = lista;

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
