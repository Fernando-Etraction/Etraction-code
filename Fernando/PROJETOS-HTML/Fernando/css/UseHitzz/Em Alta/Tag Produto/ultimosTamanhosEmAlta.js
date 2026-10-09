(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     ÚLTIMOS TAMANHOS
     Aviso "Últimos tamanhos" embaixo do preço, com os números que
     ainda têm estoque, nos produtos em que parte da grade já acabou.
     Usa o estoque real por tamanho que a loja entrega em cada card
     (data-etraction-home-tamanhos="34:1|35:0|..."): nada é inventado.
     Aparece somente nas páginas de CONFIG.paginas.
  ========================================================= */

  if (window.__hzEmAltaTamanhosLoaded) {
    return;
  }

  window.__hzEmAltaTamanhosLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    paginas: ["/ver-todos/em-alta"],
    label: "Últimos tamanhos",
    minEsgotados: 2 // o aviso aparece quando pelo menos X tamanhos da grade acabaram
  };

  var SELETOR_PRODUTO = ".product[data-etraction-home-tamanhos]";
  var SELETOR_INFO = ".product-list-info";

  var STYLE_ID = "hz-em-alta-tamanhos-style";
  var AVISO_CLASS = "hz-em-alta-tamanhos";

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
    '.product-list-info .hz-em-alta-tamanhos{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:3px 6px;width:100%;margin:8px 0 6px;padding:6px 9px;border-radius:5px;background:#fff3ea;color:#c52b00;font-family:inherit;font-size:11px;font-weight:700;line-height:1.2;text-align:left}',
    '.product-list-info .hz-em-alta-tamanhos .hz-em-alta-tamanhos__txt{font-size:inherit;letter-spacing:.04em;text-transform:uppercase}',
    '.product-list-info .hz-em-alta-tamanhos .hz-em-alta-tamanhos__lista{font-size:inherit;font-weight:500;color:#7a3a1f}',

    /* Ponto pulsando, como luz de alerta */
    '.hz-em-alta-tamanhos .hz-em-alta-tamanhos__ponto{flex:none;width:7px;height:7px;border-radius:50%;background:#ff3b0a;animation:hz-em-alta-tamanhos-pulso 1.4s ease-out infinite}',

    '@keyframes hz-em-alta-tamanhos-pulso{0%{box-shadow:0 0 0 0 rgba(255,59,10,.6)}100%{box-shadow:0 0 0 7px rgba(255,59,10,0)}}',

    '@media (max-width:767px){',
    '.product-list-info .hz-em-alta-tamanhos{margin-top:6px;padding:5px 7px;font-size:10px}',
    '}',

    '@media (prefers-reduced-motion:reduce){',
    '.hz-em-alta-tamanhos .hz-em-alta-tamanhos__ponto{animation:none}',
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
     AVISO
  ========================================================= */

  // "34:1|35:0|36:1" -> { disponiveis: ["34", "36"], esgotados: 1 }
  function lerGrade(valor) {

    var grade = { disponiveis: [], esgotados: 0 };
    var itens = (valor || "").split("|");

    for (var i = 0; i < itens.length; i++) {

      var partes = itens[i].split(":");

      if (partes.length !== 2 || !partes[0]) {
        continue;
      }

      if (partes[1] === "1") {
        grade.disponiveis.push(partes[0]);
      } else {
        grade.esgotados++;
      }
    }

    return grade;
  }

  function criarAviso(disponiveis) {

    var aviso = document.createElement("div");
    var ponto = document.createElement("span");
    var texto = document.createElement("span");
    var lista = document.createElement("span");

    aviso.className = AVISO_CLASS;

    ponto.className = "hz-em-alta-tamanhos__ponto";
    ponto.setAttribute("aria-hidden", "true");

    texto.className = "hz-em-alta-tamanhos__txt";
    texto.textContent = CONFIG.label;

    lista.className = "hz-em-alta-tamanhos__lista";
    lista.textContent = disponiveis.join(" · ");

    aviso.appendChild(ponto);
    aviso.appendChild(texto);
    aviso.appendChild(lista);

    return aviso;
  }

  function aplicar() {

    var produtos =
      document.querySelectorAll(SELETOR_PRODUTO + ":not([data-hz-em-alta-tamanhos])");

    for (var i = 0; i < produtos.length; i++) {

      var produto = produtos[i];

      // Marca o card como já conferido: evita aviso duplicado
      produto.setAttribute("data-hz-em-alta-tamanhos", "1");

      var grade =
        lerGrade(produto.getAttribute("data-etraction-home-tamanhos"));

      // Sem estoque nenhum não é "últimos tamanhos"
      if (grade.esgotados < CONFIG.minEsgotados || !grade.disponiveis.length) {
        continue;
      }

      var info = produto.querySelector(SELETOR_INFO);

      if (!info) {
        continue;
      }

      adicionarEstilo();

      // Logo depois do preço; sem preço no card, no fim das informações
      var preco = info.querySelector(".price");
      var aviso = criarAviso(grade.disponiveis);

      info.insertBefore(aviso, preco ? preco.nextSibling : null);

      // O card da loja é ordenado por "order" no CSS: copia o do preço
      // para o aviso ficar colado embaixo dele
      if (preco) {
        aviso.style.order = window.getComputedStyle(preco).order;
      }
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

    aplicar();

    iniciarObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
