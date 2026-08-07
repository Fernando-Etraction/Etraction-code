(function () {
  'use strict';

  var CUPOM = 'FINALIZE10';
  var BOX_ID = 'etraction-finalize10';
  var STYLE_ID = 'etraction-finalize10-style';

  function adicionarCSS() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;

    style.textContent = `
      #${BOX_ID} {
        width: 100% !important;
        margin: 12px 0 !important;
        padding: 12px !important;
        box-sizing: border-box !important;
        background: #f5f5f5 !important;
        border: 1px solid #d7d7d7 !important;
        color: #161616 !important;
        font-family: Arial, Helvetica, sans-serif !important;
        clear: both !important;
      }

      #${BOX_ID},
      #${BOX_ID} * {
        box-sizing: border-box !important;
      }

      #${BOX_ID} .etraction-cupom-header {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        margin-bottom: 10px !important;
      }

      #${BOX_ID} .etraction-cupom-icon {
        width: 30px !important;
        height: 30px !important;
        min-width: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #111 !important;
        color: #fff !important;
        border-radius: 3px !important;
        font-size: 15px !important;
        font-weight: 700 !important;
      }

      #${BOX_ID} .etraction-cupom-info {
        flex: 1 !important;
        min-width: 0 !important;
      }

      #${BOX_ID} .etraction-cupom-title {
        display: block !important;
        margin: 0 0 2px !important;
        color: #161616 !important;
        font-size: 13px !important;
        line-height: 17px !important;
        font-weight: 700 !important;
      }

      #${BOX_ID} .etraction-cupom-subtitle {
        display: block !important;
        margin: 0 !important;
        color: #666 !important;
        font-size: 11px !important;
        line-height: 15px !important;
        font-weight: 400 !important;
      }

      #${BOX_ID} .etraction-cupom-area {
        width: 100% !important;
        display: flex !important;
        align-items: stretch !important;
        gap: 6px !important;
      }

      #${BOX_ID} .etraction-cupom-code {
        flex: 1 !important;
        min-width: 0 !important;
        height: 38px !important;
        padding: 0 12px !important;
        display: flex !important;
        align-items: center !important;
        background: #fff !important;
        border: 1px dashed #999 !important;
        color: #111 !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        letter-spacing: .5px !important;
      }

      #${BOX_ID} .etraction-cupom-button {
        height: 38px !important;
        min-width: 115px !important;
        margin: 0 !important;
        padding: 0 15px !important;
        border: 1px solid #111 !important;
        border-radius: 2px !important;
        background: #111 !important;
        color: #fff !important;
        font-family: Arial, Helvetica, sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        white-space: nowrap !important;
      }

      #${BOX_ID} .etraction-cupom-button:hover {
        background: #333 !important;
        border-color: #333 !important;
      }

      #${BOX_ID} .etraction-cupom-button:disabled {
        opacity: .6 !important;
        cursor: default !important;
      }

      #${BOX_ID} .etraction-cupom-feedback {
        display: none !important;
        margin-top: 7px !important;
        color: #555 !important;
        font-size: 10px !important;
        line-height: 14px !important;
      }

      #${BOX_ID} .etraction-cupom-feedback.ativo {
        display: block !important;
      }

      /* esconde apenas o campo original */
      #cart-coupons {
        display: none !important;
      }

      @media (max-width: 767px) {
        #${BOX_ID} {
          margin: 10px 0 !important;
          padding: 10px !important;
        }

        #${BOX_ID} .etraction-cupom-header {
          gap: 8px !important;
          margin-bottom: 9px !important;
        }

        #${BOX_ID} .etraction-cupom-icon {
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          font-size: 14px !important;
        }

        #${BOX_ID} .etraction-cupom-title {
          font-size: 12px !important;
          line-height: 16px !important;
        }

        #${BOX_ID} .etraction-cupom-subtitle {
          font-size: 10px !important;
          line-height: 14px !important;
        }

        #${BOX_ID} .etraction-cupom-code {
          height: 36px !important;
          padding: 0 10px !important;
          font-size: 12px !important;
        }

        #${BOX_ID} .etraction-cupom-button {
          min-width: 105px !important;
          height: 36px !important;
          padding: 0 11px !important;
          font-size: 10px !important;
        }
      }

      @media (max-width: 350px) {
        #${BOX_ID} .etraction-cupom-area {
          flex-direction: column !important;
        }

        #${BOX_ID} .etraction-cupom-code,
        #${BOX_ID} .etraction-cupom-button {
          width: 100% !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function criarBox() {
    var box = document.createElement('div');
    box.id = BOX_ID;

    box.innerHTML = `
      <div class="etraction-cupom-header">
        <div class="etraction-cupom-icon">%</div>

        <div class="etraction-cupom-info">
          <strong class="etraction-cupom-title">
            Ganhe 10% OFF no seu pedido
          </strong>

          <span class="etraction-cupom-subtitle">
            Use o cupom antes de finalizar sua compra.
          </span>
        </div>
      </div>

      <div class="etraction-cupom-area">
        <div class="etraction-cupom-code">
          ${CUPOM}
        </div>

        <button
          type="button"
          class="etraction-cupom-button"
        >
          Aplicar cupom
        </button>
      </div>

      <div class="etraction-cupom-feedback"></div>
    `;

    return box;
  }

  function preencherCampo(input, valor) {
    input.value = valor;

    input.dispatchEvent(new Event('input', {
      bubbles: true
    }));

    input.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  function aplicarCupom(box) {
    var botao = box.querySelector('.etraction-cupom-button');
    var feedback = box.querySelector('.etraction-cupom-feedback');

    var campoNativo = document.querySelector(
      '#uoou_cart_promotionCoupons_0'
    );

    var botaoNativo = document.querySelector(
      '#apply-coupon'
    );

    if (!campoNativo || !botaoNativo) {
      feedback.textContent = 'Não foi possível localizar o cupom do carrinho.';
      feedback.classList.add('ativo');
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Aplicando...';

    preencherCampo(campoNativo, CUPOM);

    setTimeout(function () {
      botaoNativo.click();
    }, 100);
  }

  function inserir() {
    if (document.getElementById(BOX_ID)) {
      return true;
    }

    /*
     * ÂNCORA EXATA:
     * <div class="row rowCartPostalCode">
     */
    var referencia = document.querySelector(
      '.row.rowCartPostalCode'
    );

    if (!referencia) {
      return false;
    }

    var box = criarBox();

    /*
     * INSERE FORA DA ROW,
     * IMEDIATAMENTE DEPOIS DELA
     */
    referencia.insertAdjacentElement(
      'afterend',
      box
    );

    var botao = box.querySelector(
      '.etraction-cupom-button'
    );

    botao.addEventListener('click', function () {
      aplicarCupom(box);
    });

    console.log(
      '[eTraction] Cupom inserido após .row.rowCartPostalCode'
    );

    return true;
  }

  function executar() {
    adicionarCSS();
    return inserir();
  }

  /* primeira tentativa */
  executar();

  /*
   * Aguarda caso o carrinho seja carregado
   * depois via AJAX.
   */
  var tentativas = 0;

  var intervalo = setInterval(function () {
    tentativas++;

    if (executar()) {
      clearInterval(intervalo);
    }

    if (tentativas >= 40) {
      clearInterval(intervalo);

      console.log(
        '[eTraction] .row.rowCartPostalCode não encontrada'
      );
    }
  }, 250);

  /*
   * Reinsere caso o carrinho seja
   * reconstruído por AJAX.
   */
  var observerTimeout;

  var observer = new MutationObserver(function () {
    clearTimeout(observerTimeout);

    observerTimeout = setTimeout(function () {
      if (!document.getElementById(BOX_ID)) {
        inserir();
      }
    }, 200);
  });

  function iniciarObserver() {
    var carrinho = document.querySelector(
      '#cartContainer'
    );

    if (!carrinho) return;

    observer.observe(carrinho, {
      childList: true,
      subtree: true
    });
  }

  iniciarObserver();

})();