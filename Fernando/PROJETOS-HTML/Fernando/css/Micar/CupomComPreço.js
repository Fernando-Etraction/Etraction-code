(function () {
  'use strict';

  var FLAG = '__uoouMicarCupomReady__';
  var STYLE_ID = 'uoou-micar-cupom-style';
  var CARD_ID = 'uoou-micar-cupom-card';
  var CUPOM = 'MICAR';
  var DESCONTO_PERCENTUAL = 5.555;
  var PRECO_PIX_SELECTOR = '.uoou-price-pix-value';

  if (window[FLAG]) {
    console.log('[UOOU MICAR CUPOM] Já iniciado.');
    return;
  }
  window[FLAG] = true;

  function log() {
    console.log.apply(console, ['[UOOU MICAR CUPOM]'].concat([].slice.call(arguments)));
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${CARD_ID}{
        width:100%;
        margin:14px 0;
        padding:14px;
        background:#fff;
        border:1px solid rgba(19,91,153,.18);
        border-left:4px solid #135b99;
        border-radius:12px;
        box-sizing:border-box;
        display:grid;
        grid-template-columns:1fr auto;
        gap:12px;
        align-items:center;
        box-shadow:0 8px 24px rgba(19,91,153,.08);
        font-family:Arial,sans-serif;
      }

      #${CARD_ID} .uoou-micar-texto{min-width:0;}

      #${CARD_ID} .uoou-micar-kicker{
        font-size:12px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#135b99;
        margin:0 0 6px 0;
        line-height:1.1;
      }

      #${CARD_ID} .uoou-micar-titulo{
        margin:0;
        font-size:16px;
        line-height:1.25;
        font-weight:800;
        color:#1f2937;
        word-break:break-word;
      }

      #${CARD_ID} .uoou-micar-sub{
        margin-top:6px;
        font-size:13px;
        line-height:1.4;
        color:#6b7280;
      }

      #${CARD_ID} .uoou-micar-sub strong{
        color:#135b99;
        font-weight:800;
      }

      #${CARD_ID} .uoou-micar-copy{
        appearance:none;
        border:1px dashed #f3c511;
        background:linear-gradient(180deg,#fffdf3 0%,#fff8d9 100%);
        border-radius:10px;
        padding:10px 14px;
        min-width:120px;
        cursor:pointer;
        text-align:center;
        transition:all .2s ease;
        position:relative;
      }

      #${CARD_ID} .uoou-micar-copy:hover{
        background:#fff6c8;
        border-color:#135b99;
        transform:translateY(-1px);
      }

      #${CARD_ID} .uoou-micar-codigo{
        display:block;
        font-size:14px;
        font-weight:900;
        letter-spacing:.10em;
        color:#135b99;
      }

      #${CARD_ID} .uoou-micar-copiado{
        position:absolute;
        top:8px;
        right:10px;
        padding:4px 8px;
        border-radius:999px;
        font-size:11px;
        font-weight:700;
        background:rgba(19,91,153,.08);
        border:1px solid rgba(19,91,153,.16);
        color:#135b99;
        opacity:0;
        transform:translateY(-6px);
        transition:opacity .18s ease, transform .18s ease;
        pointer-events:none;
      }

      #${CARD_ID}.is-copied .uoou-micar-copiado{
        opacity:1;
        transform:translateY(0);
      }

      @media (max-width:768px){
        #${CARD_ID}{
          grid-template-columns:1fr;
        }

        #${CARD_ID} .uoou-micar-copy{
          width:100%;
          min-width:0;
        }
      }
    `;
    document.head.appendChild(style);
    log('Style injetado.');
  }

  function parseBRL(text) {
    if (!text) return NaN;

    var cleaned = String(text)
      .replace(/\s+/g, '')
      .replace(/R\$/gi, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();

    var value = parseFloat(cleaned);
    return isFinite(value) ? value : NaN;
  }

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function getInsertTarget() {
    return (
      document.querySelector('.product-price-container') ||
      document.querySelector('#product-price-info .product-price-container') ||
      document.querySelector('.price-box') ||
      document.querySelector('.product-info')
    );
  }

  function getPixPriceElement() {
    var el = document.querySelector(PRECO_PIX_SELECTOR);

    if (!el) {
      log('Preço PIX não encontrado no seletor:', PRECO_PIX_SELECTOR);
      return null;
    }

    var text = (el.textContent || '').trim();
    var value = parseBRL(text);

    log('Preço PIX encontrado:', text, value, el);

    if (!isFinite(value) || value <= 0) {
      log('Preço PIX inválido.');
      return null;
    }

    return el;
  }

  function calcularEconomia() {
    var priceEl = getPixPriceElement();
    if (!priceEl) return null;

    var preco = parseBRL(priceEl.textContent || '');
    if (!isFinite(preco) || preco <= 0) {
      log('Preço PIX inválido para cálculo:', priceEl.textContent);
      return null;
    }

    var economia = preco * (DESCONTO_PERCENTUAL / 100);

    return {
      preco: preco,
      economia: economia,
      economiaFormatada: formatBRL(economia)
    };
  }

  function buildCard() {
    if (document.getElementById(CARD_ID)) {
      log('Card já existe.');
      return;
    }

    var card = document.createElement('div');
    card.id = CARD_ID;
    card.innerHTML = `
      <div class="uoou-micar-texto">
        <div class="uoou-micar-kicker">Cupom disponível</div>
        <p class="uoou-micar-titulo">Ganhe 5% OFF no PIX</p>
        <div class="uoou-micar-sub">
          Economize até <strong class="uoou-micar-economia">R$ —</strong> usando o cupom
        </div>
      </div>
      <button type="button" class="uoou-micar-copy" aria-label="Copiar cupom ${CUPOM}">
        <span class="uoou-micar-codigo">${CUPOM}</span>
        <span class="uoou-micar-copiado">✔ Copiado!</span>
      </button>
    `;

    var target = getInsertTarget();

    if (target && target.parentNode) {
      target.parentNode.insertBefore(card, target.nextSibling);
      log('Card inserido após .product-price-container');
    } else {
      var fallback =
        document.querySelector('.product-info') ||
        document.querySelector('main') ||
        document.body;

      fallback.insertBefore(card, fallback.firstChild);
      log('Card inserido em fallback.');
    }
  }

  function updateEconomia() {
    var card = document.getElementById(CARD_ID);
    if (!card) return;

    var economiaEl = card.querySelector('.uoou-micar-economia');
    if (!economiaEl) return;

    var result = calcularEconomia();
    var novoTexto = result ? result.economiaFormatada : 'R$ —';

    if (economiaEl.textContent !== novoTexto) {
      economiaEl.textContent = novoTexto;
      log('Economia atualizada para:', novoTexto);
    }
  }

  function setCopiedState() {
    var card = document.getElementById(CARD_ID);
    if (!card) return;

    card.classList.add('is-copied');

    clearTimeout(window.__uoouMicarCupomTimer);
    window.__uoouMicarCupomTimer = setTimeout(function () {
      card.classList.remove('is-copied');
    }, 1400);
  }

  function fallbackCopy(text) {
    var input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand('copy');
      setCopiedState();
      log('Cupom copiado via fallback.');
    } catch (e) {
      log('Erro ao copiar via fallback:', e);
    }

    document.body.removeChild(input);
  }

  function bindCopy() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest('#' + CARD_ID + ' .uoou-micar-copy');
      if (!button) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CUPOM)
          .then(function () {
            setCopiedState();
            log('Cupom copiado via Clipboard API.');
          })
          .catch(function (err) {
            log('Erro Clipboard API:', err);
            fallbackCopy(CUPOM);
          });
      } else {
        fallbackCopy(CUPOM);
      }
    });
  }

  function observeChanges() {
    var root =
      document.querySelector('.product-price-container') ||
      document.querySelector('#product-price-info') ||
      document.body;

    var debounce = null;

    try {
      var observer = new MutationObserver(function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
          if (!document.getElementById(CARD_ID)) buildCard();
          updateEconomia();
        }, 120);
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true
      });

      log('Observer iniciado.');
    } catch (e) {
      log('Erro ao iniciar observer:', e);
    }
  }

  function init() {
    injectStyle();
    buildCard();
    bindCopy();
    updateEconomia();

    setTimeout(updateEconomia, 500);
    setTimeout(updateEconomia, 1200);
    setTimeout(updateEconomia, 2200);

    observeChanges();
    log('Inicialização concluída.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();