(function () {
  "use strict";

  /* =========================================================
     HITZZ - EM ALTA
     TOPO DA CATEGORIA
     Troca o título simples da página Em Alta por uma faixa escura
     com o título em fogo, uma frase, labaredas na base e brasas subindo.
     O <h1> da loja é aproveitado (só muda de lugar e de visual).
     Aparece somente nas páginas de CONFIG.paginas.
  ========================================================= */

  if (window.__hzEmAltaTopoLoaded) {
    return;
  }

  window.__hzEmAltaTopoLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    paginas: ["/ver-todos/em-alta"],
    selo: "Seleção Hitzz",                  // linha pequena acima do título ("" = sem)
    frase: "Os mais desejados do momento",  // linha abaixo do título ("" = sem)
    chamas: 30,                             // quantidade de labaredas na base
    brasas: 16                              // quantidade de brasas subindo
  };

  var SELETOR_TITULO = ".products-filter h1.taxon-title-text";

  var STYLE_ID = "hz-em-alta-topo-style";
  var TOPO_CLASS = "hz-em-alta-topo";
  var VAZIO_CLASS = "hz-em-alta-topo-vazio";

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
    '.hz-em-alta-topo{position:relative;box-sizing:border-box;overflow:hidden;margin:0 0 18px;padding:34px 16px 70px;border-radius:6px;background:radial-gradient(120% 95% at 50% 100%,#6b1900 0%,#200b05 46%,#0b0b0b 100%);color:#fff;text-align:center}',
    '.hz-em-alta-topo *{box-sizing:border-box}',

    /* Clarão da fogueira subindo da base */
    '.hz-em-alta-topo::after{content:"";position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(0deg,rgba(255,96,0,.5),rgba(255,96,0,0));pointer-events:none;animation:hz-em-alta-topo-clarao 2.4s ease-in-out infinite}',

    '.hz-em-alta-topo .hz-em-alta-topo__conteudo{position:relative;z-index:3}',
    '.hz-em-alta-topo .hz-em-alta-topo__selo{display:block;margin:0;color:#ffb469;font-size:11px;font-weight:600;line-height:1.2;letter-spacing:.32em;text-transform:uppercase}',
    '.hz-em-alta-topo .hz-em-alta-topo__frase{display:block;margin:0;color:#f6dccb;font-size:14px;line-height:1.4;letter-spacing:.04em}',

    /* Título da loja com o degradê de fogo correndo por dentro das letras */
    '.products-filter .hz-em-alta-topo h1.taxon-title-text{margin:10px 0 8px !important;padding:0 !important;color:#ff8a1f;font-size:46px !important;font-weight:800 !important;line-height:1 !important;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(90deg,#ffd75e,#ff8a1f,#ff3b0a,#ff8a1f,#ffd75e);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 12px rgba(255,90,0,.55));animation:hz-em-alta-topo-texto 2.6s linear infinite}',

    /* Labaredas: o tamanho de cada uma é em "em", então a fonte do bloco dá a escala */
    '.hz-em-alta-topo .hz-em-alta-topo__fogo{position:absolute;left:0;right:0;bottom:-8px;z-index:2;height:0;font-size:10px;pointer-events:none}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo svg{position:absolute;bottom:0;overflow:visible}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo path{transform-box:fill-box;transform-origin:50% 100%;animation:hz-em-alta-topo-chama 1s ease-in-out infinite}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo .hz-c0 path{fill:#d92200}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo .hz-c1 path{fill:#ff5a0a}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo .hz-c2 path{fill:#ffb02e}',

    /* Brasas */
    '.hz-em-alta-topo .hz-em-alta-topo__brasa{position:absolute;bottom:10px;z-index:1;border-radius:50%;background:#ffc04a;box-shadow:0 0 5px #ff7a00;opacity:0;pointer-events:none;animation:hz-em-alta-topo-brasa 4s ease-out infinite}',

    /* Coluna/linha do título original, que ficam vazias depois da troca */
    '.hz-em-alta-topo-vazio{display:none !important}',

    '@keyframes hz-em-alta-topo-chama{0%,100%{transform:scale(1,1) rotate(0)}20%{transform:scale(.9,1.14) rotate(-5deg)}40%{transform:scale(1.07,.93) rotate(4deg)}60%{transform:scale(.94,1.18) rotate(-3deg)}80%{transform:scale(1.05,.97) rotate(5deg)}}',
    '@keyframes hz-em-alta-topo-brasa{0%{opacity:0;transform:translate(0,0) scale(1)}12%{opacity:1}100%{opacity:0;transform:translate(18px,-150px) scale(.3)}}',
    '@keyframes hz-em-alta-topo-texto{to{background-position:-200% 0}}',
    '@keyframes hz-em-alta-topo-clarao{0%,100%{opacity:.75}50%{opacity:1}}',

    '@media (max-width:767px){',
    '.hz-em-alta-topo{margin-bottom:14px;padding:24px 12px 52px;border-radius:4px}',
    '.hz-em-alta-topo .hz-em-alta-topo__selo{font-size:9px}',
    '.hz-em-alta-topo .hz-em-alta-topo__frase{font-size:12px}',
    '.products-filter .hz-em-alta-topo h1.taxon-title-text{font-size:32px !important}',
    '.hz-em-alta-topo .hz-em-alta-topo__fogo{font-size:7px}',
    '}',

    /* Visitante que pediu menos animação no aparelho: tudo parado, sem brasas */
    '@media (prefers-reduced-motion:reduce){',
    '.hz-em-alta-topo::after,.products-filter .hz-em-alta-topo h1.taxon-title-text,.hz-em-alta-topo .hz-em-alta-topo__fogo path{animation:none}',
    '.hz-em-alta-topo .hz-em-alta-topo__brasa{display:none}',
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
     TOPO
  ========================================================= */

  var CHAMA =
    '<path d="M12 0c1.5 5-2 7.5-4.2 10.6C5.6 13.6 4 16.2 4 20a8 8 0 0 0 16 0c0-3-1.2-5.4-2.7-7.2-.5 2-1.5 3.1-2.7 3.8.5-5-.6-11.8-2.6-16.6z"/>';

  // Sorteio que dá sempre o mesmo resultado para o mesmo número:
  // o desenho do fogo não muda a cada visita
  function sorteio(n) {

    var x = Math.sin(n * 127.1) * 43758.5453;

    return x - Math.floor(x);
  }

  function criarFogo() {

    var fogo = document.createElement("div");
    var html = "";

    fogo.className = "hz-em-alta-topo__fogo";
    fogo.setAttribute("aria-hidden", "true");

    for (var i = 0; i < CONFIG.chamas; i++) {

      var cor = i % 3;

      // As vermelhas (fundo) são as mais altas; as amarelas (frente), as menores
      var altura = (cor === 0 ? 5.5 : cor === 1 ? 4 : 2.6) + sorteio(i + 1) * 2.6;
      var largura = altura * 0.8;
      var posicao = (i / (CONFIG.chamas - 1)) * 100;
      var duracao = 0.7 + sorteio(i + 50) * 0.7;
      var atraso = -sorteio(i + 90);

      html +=
        '<svg class="hz-c' + cor + '" viewBox="0 0 24 30" style="left:' +
        posicao.toFixed(2) + '%;width:' + largura.toFixed(2) + 'em;height:' +
        altura.toFixed(2) + 'em;margin-left:' + (-largura / 2).toFixed(2) +
        'em;z-index:' + cor + '">' +
        CHAMA.replace('<path ', '<path style="animation-duration:' +
          duracao.toFixed(2) + 's;animation-delay:' + atraso.toFixed(2) + 's" ') +
        '</svg>';
    }

    fogo.innerHTML = html;

    return fogo;
  }

  function criarBrasa(i) {

    var brasa = document.createElement("span");
    var tamanho = 2 + Math.round(sorteio(i + 200) * 2);

    brasa.className = "hz-em-alta-topo__brasa";
    brasa.setAttribute("aria-hidden", "true");

    brasa.style.left = (4 + sorteio(i + 300) * 92).toFixed(2) + "%";
    brasa.style.width = tamanho + "px";
    brasa.style.height = tamanho + "px";
    brasa.style.animationDuration = (2.8 + sorteio(i + 400) * 2.6).toFixed(2) + "s";
    brasa.style.animationDelay = (-sorteio(i + 500) * 5).toFixed(2) + "s";

    return brasa;
  }

  function criarLinha(classe, texto) {

    var linha = document.createElement("span");

    linha.className = classe;
    linha.textContent = texto;

    return linha;
  }

  function aplicar() {

    if (document.querySelector("." + TOPO_CLASS)) {
      return;
    }

    var titulo = document.querySelector(SELETOR_TITULO);

    if (!titulo) {
      return;
    }

    adicionarEstilo();

    var coluna = titulo.parentNode;
    var linha = titulo.closest(".row") || coluna;

    var topo = document.createElement("div");
    var conteudo = document.createElement("div");

    topo.className = TOPO_CLASS;
    conteudo.className = "hz-em-alta-topo__conteudo";

    for (var i = 0; i < CONFIG.brasas; i++) {
      topo.appendChild(criarBrasa(i));
    }

    if (CONFIG.selo) {
      conteudo.appendChild(criarLinha("hz-em-alta-topo__selo", CONFIG.selo));
    }

    linha.parentNode.insertBefore(topo, linha);

    // O <h1> da loja muda de lugar: continua sendo o título da página
    conteudo.appendChild(titulo);

    if (CONFIG.frase) {
      conteudo.appendChild(criarLinha("hz-em-alta-topo__frase", CONFIG.frase));
    }

    topo.appendChild(conteudo);
    topo.appendChild(criarFogo());

    // Esconde o que sobrou vazio no lugar antigo do título
    if (!coluna.textContent.trim() && !coluna.querySelector("img, svg, input, select")) {
      coluna.classList.add(VAZIO_CLASS);
    }

    if (linha !== coluna && !linha.querySelector(":scope > :not(." + VAZIO_CLASS + ")")) {
      linha.classList.add(VAZIO_CLASS);
    }
  }


  /* =========================================================
     OBSERVER
     Cobre o topo redesenhado depois (filtros aplicados, paginação)
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
