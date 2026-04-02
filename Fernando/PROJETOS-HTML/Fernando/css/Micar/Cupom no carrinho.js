(function () {
  'use strict';

  var FLAG = '__uoou_cupom_consumidor_loaded__';
  var STYLE_ID = 'uoou-cupom-consumidor-style';
  var COMPONENT_CLASS = 'content-cupom';
  var MAX_RETRIES = 80;
  var RETRY_INTERVAL = 500;

  var TARGET_SELECTORS = [
    '#cartContainer .row.rowCartPostalCode',
    '#cartContainer .rowCartPostalCode',
    '.row.rowCartPostalCode',
    '.rowCartPostalCode'
  ];

  if (window[FLAG]) {
    console.log('[UOOU CUPOM CONSUMIDOR] Script já inicializado.');
    return;
  }
  window[FLAG] = true;

  function log() {
    console.log.apply(console, ['[UOOU CUPOM CONSUMIDOR]'].concat([].slice.call(arguments)));
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = `
      .${COMPONENT_CLASS} .descricao-desconto p.obs {
        color: #505050 !important;
        margin-bottom: 16px !important;
        font-weight: 300;
        text-align: center;
      }

      h1.title-pesquisa {
        display: none;
      }

      .descricao-pesquisa {
        margin-top: 0px;
      }

      .${COMPONENT_CLASS} {
        padding: 30px 55px;
        background: #EAEAEA;
        color: #505050;
        display: table;
        width: 100%;
        box-sizing: border-box;
        margin: 16px 0;
        display:flex;
        justify-content: center;
        align-items: center;
      }

      .${COMPONENT_CLASS}.clearfix::after {
        content: "";
        display: block;
        clear: both;
      }

      .${COMPONENT_CLASS} .descricao-desconto {
        width: 50%;
        float: left;
      }

      .${COMPONENT_CLASS} .descricao-desconto .title {
        display: block;
        font-size: 25px;
        text-transform: uppercase;
        line-height: 30px;
        position: relative;
        margin-bottom: 25px;
      }

      .${COMPONENT_CLASS} .descricao-desconto .title:before {
        content: "";
        position: absolute;
        bottom: -13px;
        background-color: #CF9E1A;
        padding: 3px 35px;
        width: 75px;
      }

      .${COMPONENT_CLASS} .descricao-desconto div {
        display: block;
        font-size: 35px;
        text-transform: uppercase;
        font-weight: 300;
        font-style: italic;
        text-align: center;
      }

      #main-area .descricao-pesquisa .descricao .content p.obs {
        color: #505050;
        padding-right: 80px;
        margin-top: 25px;
      }

      .${COMPONENT_CLASS} .aplicar-desconto {
        width: 50%;
        float: left;
        text-align: center;
      }

      .${COMPONENT_CLASS} .aplicar-desconto .title-desconto {
        font-size: 15px;
        text-transform: uppercase;
      }

      .${COMPONENT_CLASS} .area-desconto {
        background: #fff;
        padding: 5px;
        margin-top: 10px;
        border: 4px dashed #f2f2f2;
        border-radius: 5%;
      }

      .${COMPONENT_CLASS} .area-desconto .cupom {
        width: 100%;
        height: 60px;
        color: #505050;
        font-weight: bold;
        font-size: 35px !important;
        text-align: center;
        border: 1px solid #000;
        box-sizing: border-box;
      }

      .${COMPONENT_CLASS} .area-desconto .cupom:hover {
        cursor: pointer;
      }

      .${COMPONENT_CLASS} .area-desconto .something {
        display: block;
        font-size: 12px;
        color: #505050;
        margin-top: 10px;
      }

      .${COMPONENT_CLASS} span.something del {
        font-size: 21px;
      }

      @media (max-width: 800px) {
        .conteudo-adicional-footer {
          padding: 0;
        }

        .exibir-mais-conteudo-adicional {
          display: none;
        }

        .${COMPONENT_CLASS} {
          padding: 10px;
          text-align: center;
          flex-direction: column;
        }

        .${COMPONENT_CLASS} .descricao-desconto,
        .${COMPONENT_CLASS} .aplicar-desconto {
          width: 100%;
        }

        .conteudo-adicional .description li,
        .conteudo-adicional .description p {
          color: #000;
          text-align: center;
        }

        .${COMPONENT_CLASS} .area-desconto {
          padding: 5px;
        }

        .${COMPONENT_CLASS} .descricao-desconto div,
        .${COMPONENT_CLASS} .descricao-desconto .title {
          text-align: center;
          font-size: 25px;
        }

        .${COMPONENT_CLASS} .descricao-desconto p.obs {
          font-size: .7125em;
          line-height: 15px;
          margin: 10px 0;
        }

        .${COMPONENT_CLASS} .descricao-desconto div {
          display: inline-block;
        }

        .${COMPONENT_CLASS} .descricao-desconto .title:before {
          margin: auto;
          left: 0;
          right: 0;
        }
      }
    `;

    document.head.appendChild(style);
    log('CSS injetado.');
  }

  function createComponent() {
    var wrapper = document.createElement('div');
    wrapper.className = COMPONENT_CLASS + ' clearfix';

    wrapper.innerHTML = `
      <div class="descricao-desconto">
        <div><strong>APROVEITE 5% OFF&nbsp;</strong></div>
        <p class="obs">Aplique o cupom e garanta o <strong>desconto&nbsp;</strong></p>
      </div>
      <div class="aplicar-desconto">
        <span class="title-desconto">Use o cupom na página de checkout</span>
        <div class="area-desconto">
          <input class="cupom" readonly="readonly" type="text" value="MICAR" />
          <div class="something">Clique e copie o cupom!</div>
        </div>
      </div>
    `;

    bindCopy(wrapper);
    return wrapper;
  }

  function bindCopy(context) {
    var inputCupom = context.querySelector('.cupom');
    var textoCupom = context.querySelector('.something');

    if (!inputCupom || !textoCupom) {
      log('Elementos do cupom não encontrados.');
      return;
    }

    inputCupom.addEventListener('click', function () {
      inputCupom.select();
      inputCupom.setSelectionRange(0, 99999);

      function success() {
        textoCupom.innerHTML = 'Código copiado com sucesso';
      }

      function reset() {
        setTimeout(function () {
          textoCupom.innerHTML = 'Clique e copie o cupom!';
        }, 2000);
      }

      function fallbackCopy() {
        try {
          document.execCommand('copy');
          success();
          reset();
          log('Cupom copiado com fallback.');
        } catch (e) {
          log('Erro no fallback copy:', e);
        }
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(inputCupom.value).then(function () {
            success();
            reset();
            log('Cupom copiado com clipboard API.');
          }).catch(function () {
            fallbackCopy();
          });
        } else {
          fallbackCopy();
        }
      } catch (e) {
        fallbackCopy();
      }
    });
  }

  function getTarget() {
    for (var i = 0; i < TARGET_SELECTORS.length; i++) {
      var el = document.querySelector(TARGET_SELECTORS[i]);
      if (el) {
        log('Target encontrado com seletor:', TARGET_SELECTORS[i]);
        return el;
      }
    }
    log('Nenhum target encontrado.');
    return null;
  }

  function isInsertedAfterTarget(target) {
    if (!target) return false;
    var next = target.nextElementSibling;
    return !!(next && next.classList.contains(COMPONENT_CLASS));
  }

  function insertComponent() {
    var target = getTarget();
    if (!target) return false;

    if (isInsertedAfterTarget(target)) {
      log('Componente já inserido após o target.');
      return true;
    }

    var existing = document.querySelector('.' + COMPONENT_CLASS);
    if (existing) {
      existing.remove();
      log('Componente antigo removido para reinserção.');
    }

    var component = createComponent();
    target.insertAdjacentElement('afterend', component);
    log('Componente inserido com sucesso.');
    return true;
  }

  function startObserver() {
    var root = document.querySelector('#cartContainer') || document.querySelector('#main-cart-area') || document.body;
    if (!root) return;

    var observer = new MutationObserver(function () {
      var target = getTarget();
      var component = document.querySelector('.' + COMPONENT_CLASS);

      if (target && (!component || !isInsertedAfterTarget(target))) {
        log('Mudança detectada no DOM. Reinserindo componente...');
        insertComponent();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true
    });

    log('MutationObserver iniciado.');
  }

  function init() {
    injectStyle();

    var retries = 0;

    function tryInsert() {
      if (insertComponent()) {
        startObserver();
        return;
      }

      retries++;
      if (retries <= MAX_RETRIES) {
        log('Tentativa', retries, 'de', MAX_RETRIES);
        setTimeout(tryInsert, RETRY_INTERVAL);
      } else {
        log('Não foi possível encontrar o local de inserção.');
      }
    }

    tryInsert();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();