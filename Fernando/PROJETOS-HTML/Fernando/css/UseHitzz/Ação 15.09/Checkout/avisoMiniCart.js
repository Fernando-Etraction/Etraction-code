(function () {
  'use strict';

  var CONFIG = {
    meta: 499.90,
    imagem: 'https://cdn-secure.uoou.com.br/static/images/loja_virtual/use-hitzz/imagenecessaire.png'
  };

  var ID = 'etraction-necessaire-progress';
  var STYLE_ID = 'etraction-necessaire-progress-style';
  var timerAtualizacao = null;

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function valorNumerico(texto) {
    if (!texto) return 0;

    var normalizado = texto
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    var valor = parseFloat(normalizado);

    return isNaN(valor) ? 0 : valor;
  }

  function obterSubtotalProdutos() {
    var seletores = [
      '.minicart-modal__summary > .minicart-modal__subtotal .minicart-modal__subtotal-price',
      '.minicart-modal__subtotal > .minicart-modal__subtotal-price',
      '.minicart-modal__total .minicart-modal__subtotal-price'
    ];

    for (var i = 0; i < seletores.length; i++) {
      var elemento = document.querySelector(seletores[i]);
      var valor = valorNumerico(elemento && elemento.textContent);

      if (valor > 0) {
        return valor;
      }
    }

    return 0;
  }

  function adicionarEstilos() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');

    style.id = STYLE_ID;

    style.textContent = `
      #${ID},
      #${ID} * {
        box-sizing: border-box;
      }

      #${ID} {
        width: auto;
        max-width: 100%;
        margin: 10px 15px 14px;
        padding: 12px;
        border: 1px solid #e7e2dc;
        border-radius: 10px;
        background: #fffaf6;
        color: #242424;
        font-family: inherit;
        overflow: hidden;
      }

      #${ID} .etraction-necessaire__main {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      #${ID} .etraction-necessaire__image-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 64px;
        width: 64px;
        height: 64px;
        padding: 4px;
        border: 1px solid #ece7e2;
        border-radius: 8px;
        background: #fff;
        overflow: hidden;
      }

      #${ID} .etraction-necessaire__image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      #${ID} .etraction-necessaire__badge {
        position: absolute;
        top: 4px;
        left: 4px;
        padding: 2px 5px;
        border-radius: 999px;
        background: #161616;
        color: #fff;
        font-size: 8px;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      #${ID} .etraction-necessaire__content {
        flex: 1 1 auto;
        min-width: 0;
      }

      #${ID} .etraction-necessaire__eyebrow {
        display: block;
        margin: 0 0 3px;
        color: #6d5141;
        font-size: 10px;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      #${ID} .etraction-necessaire__message {
        display: block;
        margin: 0 0 9px;
        color: #222;
        font-size: 12.5px;
        font-weight: 500;
        line-height: 1.35;
      }

      #${ID} .etraction-necessaire__message strong {
        color: #111;
        font-weight: 800;
      }

      #${ID} .etraction-necessaire__track {
        position: relative;
        width: 100%;
        height: 7px;
        border-radius: 999px;
        background: #e7e2de;
        overflow: hidden;
      }

      #${ID} .etraction-necessaire__fill {
        display: block;
        width: 0;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(
          90deg,
          #7b5744 0%,
          #b38168 100%
        );
        transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }

      #${ID} .etraction-necessaire__values {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 5px;
        color: #777;
        font-size: 9.5px;
        font-weight: 600;
        line-height: 1.2;
      }

      #${ID}.etraction-necessaire--success {
        border-color: #badcc5;
        background: #f5fbf7;
      }

      #${ID}.etraction-necessaire--success
      .etraction-necessaire__eyebrow {
        color: #087b37;
      }

      #${ID}.etraction-necessaire--success
      .etraction-necessaire__fill {
        background: #0d9745;
      }

      #${ID}.etraction-necessaire--success
      .etraction-necessaire__badge {
        background: #0d8740;
      }

      @media (max-width: 480px) {
        #${ID} {
          margin: 9px 10px 12px;
          padding: 10px;
        }

        #${ID} .etraction-necessaire__main {
          gap: 10px;
        }

        #${ID} .etraction-necessaire__image-wrap {
          flex-basis: 58px;
          width: 58px;
          height: 58px;
        }

        #${ID} .etraction-necessaire__message {
          font-size: 12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function criarBloco() {
    var bloco = document.createElement('section');

    bloco.id = ID;
    bloco.setAttribute('role', 'status');
    bloco.setAttribute('aria-live', 'polite');

    bloco.innerHTML = `
      <div class="etraction-necessaire__main">

        <div class="etraction-necessaire__image-wrap">
          <span class="etraction-necessaire__badge">
            Brinde
          </span>

          <img
            class="etraction-necessaire__image"
            src="${CONFIG.imagem}"
            alt="Nécessaire feminina animal print"
            loading="lazy"
            decoding="async"
          >
        </div>

        <div class="etraction-necessaire__content">

          <span class="etraction-necessaire__eyebrow">
            Presente para você
          </span>

          <span class="etraction-necessaire__message"></span>

          <div
            class="etraction-necessaire__track"
            role="progressbar"
            aria-label="Progresso para ganhar a nécessaire"
            aria-valuemin="0"
            aria-valuemax="${CONFIG.meta}"
            aria-valuenow="0"
          >
            <span class="etraction-necessaire__fill"></span>
          </div>

          <div class="etraction-necessaire__values">
            <span class="etraction-necessaire__current">
              R$ 0,00
            </span>

            <span>
              Meta: ${moeda(CONFIG.meta)}
            </span>
          </div>

        </div>
      </div>
    `;

    return bloco;
  }

  function posicionarBloco(bloco) {
    var produtos = document.querySelector(
      '.minicart-modal__products'
    );

    if (!produtos) return false;

    var barraFrete = produtos.querySelector(
      '#hz-free-shipping-bar'
    );

    if (barraFrete) {
      if (barraFrete.nextElementSibling !== bloco) {
        barraFrete.insertAdjacentElement(
          'afterend',
          bloco
        );
      }
    } else if (produtos.firstElementChild !== bloco) {
      produtos.insertAdjacentElement(
        'afterbegin',
        bloco
      );
    }

    return true;
  }

  function atualizar() {
    adicionarEstilos();

    var produtos = document.querySelector(
      '.minicart-modal__products'
    );

    if (!produtos) return;

    var bloco =
      document.getElementById(ID) ||
      criarBloco();

    posicionarBloco(bloco);

    var subtotal = obterSubtotalProdutos();
    var atingiu = subtotal >= CONFIG.meta;
    var restante = Math.max(
      CONFIG.meta - subtotal,
      0
    );

    var percentual = Math.min(
      (subtotal / CONFIG.meta) * 100,
      100
    );

    var mensagem = atingiu
      ? 'Parabéns! Você <strong>ganhou uma nécessaire</strong>.'
      : 'Faltam <strong>' +
        moeda(restante) +
        '</strong> para você ganhar uma nécessaire.';

    var messageEl = bloco.querySelector(
      '.etraction-necessaire__message'
    );

    var fillEl = bloco.querySelector(
      '.etraction-necessaire__fill'
    );

    var currentEl = bloco.querySelector(
      '.etraction-necessaire__current'
    );

    var trackEl = bloco.querySelector(
      '.etraction-necessaire__track'
    );

    if (messageEl.innerHTML !== mensagem) {
      messageEl.innerHTML = mensagem;
    }

    if (
      fillEl.style.width !==
      percentual.toFixed(2) + '%'
    ) {
      fillEl.style.width =
        percentual.toFixed(2) + '%';
    }

    if (
      currentEl.textContent !== moeda(subtotal)
    ) {
      currentEl.textContent = moeda(subtotal);
    }

    trackEl.setAttribute(
      'aria-valuenow',
      Math.min(
        subtotal,
        CONFIG.meta
      ).toFixed(2)
    );

    bloco.classList.toggle(
      'etraction-necessaire--success',
      atingiu
    );
  }

  function agendarAtualizacao() {
    clearTimeout(timerAtualizacao);

    timerAtualizacao = setTimeout(
      atualizar,
      80
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      atualizar
    );
  } else {
    atualizar();
  }

  document.addEventListener(
    'click',
    function (event) {
      var seletor = [
        '.minicart-modal__quantity-increase',
        '.minicart-modal__quantity-subtract',
        '.minicart-modal__remove'
      ].join(', ');

      if (event.target.closest(seletor)) {
        setTimeout(atualizar, 250);
        setTimeout(atualizar, 700);
      }
    }
  );

  document.addEventListener(
    'change',
    function (event) {
      if (
        event.target.matches(
          '.CartItemQuantityField'
        )
      ) {
        setTimeout(atualizar, 250);
        setTimeout(atualizar, 700);
      }
    }
  );

  var observer = new MutationObserver(
    function (mutations) {
      var precisaAtualizar = mutations.some(
        function (mutation) {
          var alvo =
            mutation.target.nodeType === 1
              ? mutation.target
              : mutation.target.parentElement;

          if (!alvo) return false;

          var alterouMinicart =
            alvo.closest('.minicart-modal');

          var adicionouMinicart =
            Array.prototype.some.call(
              mutation.addedNodes || [],
              function (node) {
                if (node.nodeType !== 1) {
                  return false;
                }

                return (
                  node.matches(
                    '.minicart-modal, .minicart-modal__content'
                  ) ||
                  node.querySelector(
                    '.minicart-modal'
                  )
                );
              }
            );

          return (
            alterouMinicart ||
            adicionouMinicart
          );
        }
      );

      if (precisaAtualizar) {
        agendarAtualizacao();
      }
    }
  );

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();