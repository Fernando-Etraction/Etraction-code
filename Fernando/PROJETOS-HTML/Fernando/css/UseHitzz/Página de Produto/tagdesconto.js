(function () {
  'use strict';

  const CONFIG = {
    id: 'etraction-pix-discount',
    styleId: 'etraction-pix-discount-style'
  };

  function addStyles() {
    if (document.getElementById(CONFIG.styleId)) return;

    const style = document.createElement('style');
    style.id = CONFIG.styleId;

    style.textContent = `
      .pdp-payment__price-off--cash-payment {
        display: none !important;
      }

      .pdp-payment__row--cash-payment .pdp-payment__main-line {
        display: inline-flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 5px !important;
        overflow: visible !important;
      }

      .pdp-payment__price--cash-payment {
        display: inline-flex !important;
        align-items: center !important;
        margin: 0 !important;
        line-height: 1 !important;
      }

      .pdp-payment__label--cash-payment {
        display: inline-flex !important;
        align-items: center !important;
        margin: 0 !important;
        line-height: 1 !important;
        white-space: nowrap !important;
      }

      .etraction-pix-discount {
        position: relative !important;

        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        flex: 0 0 auto !important;

        min-height: 14px !important;
        height: 14px !important;

        margin: 0 1px 0 2px !important;
        padding: 1px 4px !important;

        box-sizing: border-box !important;

        background: #ff2035 !important;
        color: #ffffff !important;

        font-family: inherit !important;
        font-size: 9px !important;
        font-weight: 700 !important;
        line-height: 1 !important;

        white-space: nowrap !important;

        border: 0 !important;
        border-radius: 0 !important;

        transform: translateY(-1px) !important;
      }

      .etraction-pix-discount::before {
        content: "" !important;

        position: absolute !important;
        top: 0 !important;
        left: -5px !important;

        width: 0 !important;
        height: 0 !important;

        border-top: 7px solid transparent !important;
        border-bottom: 7px solid transparent !important;
        border-right: 5px solid #ff2035 !important;
      }

      .etraction-pix-discount::after {
        content: "" !important;

        position: absolute !important;
        left: -1px !important;
        top: 50% !important;

        width: 2px !important;
        height: 2px !important;

        background: #ffffff !important;
        border-radius: 50% !important;

        transform: translateY(-50%) !important;
      }

      @media (max-width: 767px) {
        .pdp-payment__row--cash-payment .pdp-payment__main-line {
          gap: 5px !important;
        }

        .etraction-pix-discount {
          min-height: 16px !important;
          height: 16px !important;

          margin-left: 2px !important;
          padding: 1px 5px !important;

          font-size: 10px !important;

          transform: translateY(-1px) !important;
        }

        .etraction-pix-discount::before {
          left: -6px !important;

          border-top-width: 8px !important;
          border-bottom-width: 8px !important;
          border-right-width: 6px !important;
        }

        .etraction-pix-discount::after {
          width: 2px !important;
          height: 2px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function moneyToNumber(value) {
    if (!value) return 0;

    return Number(
      value
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );
  }

  function getDiscount() {
    const discountElement = document.querySelector(
      '.pdp-payment__price-off-value'
    );

    if (discountElement) {
      const value = discountElement.textContent.trim();

      if (value) {
        return '-' + value.replace(/^[-+]/, '');
      }
    }

    const pixElement = document.querySelector(
      '.pdp-payment__price--cash-payment'
    );

    const normalElement = document.querySelector(
      '.pdp-payment__price--normal'
    );

    if (!pixElement || !normalElement) {
      return null;
    }

    const pixPrice = moneyToNumber(pixElement.textContent);
    const normalPrice = moneyToNumber(normalElement.textContent);

    if (
      !pixPrice ||
      !normalPrice ||
      pixPrice >= normalPrice
    ) {
      return null;
    }

    const discount = Math.round(
      ((normalPrice - pixPrice) / normalPrice) * 100
    );

    return '-' + discount + '%';
  }

  function render() {
    const price = document.querySelector(
      '.pdp-payment__price--cash-payment'
    );

    if (!price) return;

    const discount = getDiscount();

    if (!discount) return;

    let tag = document.getElementById(CONFIG.id);

    if (!tag) {
      tag = document.createElement('span');
      tag.id = CONFIG.id;
      tag.className = 'etraction-pix-discount';
    }

    tag.textContent = discount;

    if (price.nextElementSibling !== tag) {
      price.insertAdjacentElement('afterend', tag);
    }
  }

  function init() {
    addStyles();
    render();

    let scheduled = false;

    const observer = new MutationObserver(function () {
      if (scheduled) return;

      scheduled = true;

      requestAnimationFrame(function () {
        scheduled = false;
        render();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();