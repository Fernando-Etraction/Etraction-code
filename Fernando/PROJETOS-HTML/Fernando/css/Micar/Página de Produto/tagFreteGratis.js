(function () {
  'use strict';

  var UOOU_FLAG = '__uoou_frete_progressivo_gallery_options_js_only__';
  var STYLE_ID = 'uoou-style-frete-progressivo';

  function log() {
    console.log('[UOOU FRETE PROGRESSIVO]', ...arguments);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      log('⚠️ style já existe');
      return;
    }

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        .content-cupom {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin: auto;
            max-width: 530px;
            font-family: 'Poppins', sans-serif;
        }

        .step {
            height: 85px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            background: #D9D9D9;
            color: black;
            padding: 18px 34px 18px 48px;
            text-transform: uppercase;
            flex: 1;
            clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%);
            position: relative;
        }

        .step:first-child {
            clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 50%, 0% 0%);
            padding-left: 20px;
    background: linear-gradient(90deg, #1b6ea8 0%, #0b467d 100%) !important;
            color: white;
        }

        .step:nth-child(2) {
            background: linear-gradient(90deg, #0b467d 0%, #0b467d 100%) !important;
            color: white;
        }

        .step:last-child {
            clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 10% 50%, 0% 0%);
    background: linear-gradient(90deg, #0b467d 0%, #083866 100%) !important;
            color: white;
        }

        .step + .step {
            margin-left: -14px;
        }

        .step:nth-child(1){ z-index:3; }
        .step:nth-child(2){ z-index:2; }
        .step:nth-child(3){ z-index:1; }

        .step span {
            font-size: 10px;
            display: block;
            width: 120%;
            font-weight: 600;
        }

        .step p {
            margin: 5px 0;
            font-size: 19px;
            font-weight: 700;
        }

        .step.active {
            background: #D9D9D9;
        }

        .content-title {
            color: #ffffff;
        }

        .content-title-last {
            color: #FEC72F;
        }

        .title-content {
            font-family: "Poppins", sans-serif;
            font-weight: 700;
            margin: auto;
            max-width: 530px;
            margin: 0 auto;
            text-transform: uppercase;
            font-size: 16px;
        }

        @media (max-width: 600px) {
            .frete-progressivo {
                margin-top: 0px !important;
            }

            .step {
                height: 95px;
            }

            .title-content {
                font-size: 12px;
            }

            .content-cupom {
                font-size: 10px;
            }

            .step p {
                font-size: 14px;
                width: 83%;
            }

            .step:nth-child(2) {
                clip-path: polygon(89% -5%, 100% 50%, 88% 101%, 0% 100%, 9% 51%, 0% 0%);
                color: white;
            }

            .step:first-child {
                padding-left: 0;
            }

            .step {
                width: 100%;
                clip-path: none;
                padding: 12px 0;
            }

            .step + .step {
                margin-left: -6px;
            }

            .frete-progressivo {
                max-width: 100%;
                margin: 0 auto !important;
            }

            .step span {
                font-size: 10px;
                width: 80%;
            }

            .step:last-child {
                clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 10% 50%, 0% 0%);
                color: white;
            }
        }

        .frete-progressivo {
            float: left;
        }

        .minibanner {
            float: left;
        }
    `;
    document.head.appendChild(style);
    log('✅ style injetado');
  }

  function getHtml() {
    return `
      <div class="frete-progressivo">
        <h3 class="title-content">Frete progressivo</h3>
        <div class="content-cupom">
          <div class="step">
            <span>Compre um e ganhe</span>
            <p class="content-title">50% OFF</p>
          </div>

          <div class="step">
            <span> Compre 2 e ganhe </span>
            <p class="content-title">75% OFF</p>
          </div>

          <div class="step">
            <span>Compre 3 e ganhe </span>
            <p class="content-title-last">Frete Gratis</p>
          </div>
        </div>
      </div>
    `;
  }

  function insertBlock() {
    var target = document.querySelector('.shipping-calculator');

    if (!target) {
      log('❌ target .shipping-calculator não encontrado');
      return false;
    }

    var next = target.nextElementSibling;
    if (next && next.classList && next.classList.contains('frete-progressivo')) {
      log('⚠️ bloco já inserido corretamente');
      return true;
    }

    var existing = document.querySelector('.frete-progressivo');
    if (existing) {
      existing.remove();
      log('🗑️ bloco antigo removido');
    }

    target.insertAdjacentHTML('afterend', getHtml());
    log('✅ bloco inserido após .shipping-calculator');
    return true;
  }

  function init() {
    if (window[UOOU_FLAG]) {
      log('⚠️ script já inicializado');
      return;
    }

    window[UOOU_FLAG] = true;
    log('🚀 iniciando script');

    injectStyle();

    if (insertBlock()) return;

    var tries = 0;
    var maxTries = 40;

    var interval = setInterval(function () {
      tries++;
      log('🔁 tentativa', tries, 'de', maxTries);

      if (insertBlock() || tries >= maxTries) {
        clearInterval(interval);
        log('🛑 polling finalizado');
      }
    }, 500);

    var observer = new MutationObserver(function () {
      insertBlock();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    log('👀 MutationObserver iniciado');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();