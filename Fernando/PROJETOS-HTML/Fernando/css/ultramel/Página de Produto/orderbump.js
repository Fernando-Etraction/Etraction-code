(function() {
  try {
    var ORDER_BUMP_CONFIG = {
      productId: 'OFZqTXptRDlsZz09',
      quantity: 1,

      productUrl: 'https://www.ultramel.com.br/ultrablue-azul-de-metileno-2-30ml',
      image: 'https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22571-ogxytxlxut0/pv/04/8c/2e/e65ecd569fd25c8ec3cb73d5df/ultrablue-azul-de-metileno-2-30ml-large-1.png',
      name: 'UltraBlue - Azul de Metileno 2% - 30ml',

      oldPrice: 'R$ 107,32',
      price: 'R$ 88,88',
      savingText: 'Economize R$ 18,44',

      tag: 'Oferta exclusiva',
      researchText: 'Estudo PMID 27551895comprova: Azul demetileno melhora a memória e acelera a tomada de decisoes',

      buttonDefault: 'Quero melhorar a memória e tomar decisões mais rápidas',
      buttonLoading: 'Adicionando produto...',
      buttonSelected: 'Produto adicionado ao pedido',

      smallText: 'Ao clicar, o checkout será atualizado automaticamente.',

      addEndpoint: '/cart/add?id=OFZqTXptRDlsZz09'
    };

    var orderBumpState = {
      loading: false,
      added: false,
      observerStarted: false,
      bootTries: 0,
      maxBootTries: 80
    };

    function safeJqueryReady(callback) {
      if (window.jQuery) {
        window.jQuery(callback);
      } else {
        setTimeout(function() {
          safeJqueryReady(callback);
        }, 100);
      }
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function injectOrderBumpStyles() {
      if (document.getElementById('cv2-orderbump-styles')) return;

      var css = ''
        + '.cv2-orderbump{'
          + '--cv2-primary:#F2C85D;'
          + '--cv2-primary-dark:#d9ad3f;'
          + '--cv2-primary-soft:rgba(242,200,93,.18);'
          + '--cv2-primary-border:rgba(242,200,93,.45);'
          + '--cv2-text:#111827;'
          + '--cv2-muted:#6b7280;'
          + '--cv2-bg-soft:#fffaf0;'
          + 'width:100%;'
          + 'margin:18px 0 22px;'
          + 'box-sizing:border-box;'
          + 'font-family:inherit;'
        + '}'

        + '.cv2-orderbump *{box-sizing:border-box;}'

        + '.cv2-orderbump__card{'
          + 'position:relative;'
          + 'width:100%;'
          + 'padding:18px;'
          + 'border:1px solid var(--cv2-primary-border);'
          + 'border-radius:16px;'
          + 'background:linear-gradient(135deg,#ffffff 0%,var(--cv2-bg-soft) 100%);'
          + 'box-shadow:0 12px 28px rgba(17,24,39,.08);'
          + 'overflow:hidden;'
        + '}'

        + '.cv2-orderbump__card::before{'
          + 'content:"";'
          + 'position:absolute;'
          + 'left:0;'
          + 'top:0;'
          + 'width:100%;'
          + 'height:5px;'
          + 'background:linear-gradient(90deg,var(--cv2-primary),#ffe39a);'
        + '}'

        + '.cv2-orderbump__card::after{'
          + 'content:"";'
          + 'position:absolute;'
          + 'right:-70px;'
          + 'top:-70px;'
          + 'width:150px;'
          + 'height:150px;'
          + 'border-radius:999px;'
          + 'background:var(--cv2-primary-soft);'
          + 'pointer-events:none;'
        + '}'

        + '.cv2-orderbump__header{'
          + 'position:relative;'
          + 'z-index:1;'
          + 'display:flex;'
          + 'align-items:center;'
          + 'justify-content:space-between;'
          + 'gap:10px;'
          + 'margin-bottom:14px;'
        + '}'

        + '.cv2-orderbump__tag{'
          + 'display:inline-flex;'
          + 'align-items:center;'
          + 'gap:7px;'
          + 'padding:7px 11px;'
          + 'border-radius:999px;'
          + 'background:var(--cv2-primary-soft);'
          + 'color:#7a5700;'
          + 'font-size:11px;'
          + 'font-weight:900;'
          + 'text-transform:uppercase;'
          + 'letter-spacing:.35px;'
          + 'line-height:1;'
        + '}'

        + '.cv2-orderbump__tag-icon{'
          + 'width:18px;'
          + 'height:18px;'
          + 'border-radius:999px;'
          + 'background:var(--cv2-primary);'
          + 'color:#1f1f1f;'
          + 'display:inline-flex;'
          + 'align-items:center;'
          + 'justify-content:center;'
          + 'font-size:13px;'
          + 'font-weight:900;'
          + 'line-height:1;'
        + '}'

        + '.cv2-orderbump__secure{'
          + 'display:inline-flex;'
          + 'align-items:center;'
          + 'gap:5px;'
          + 'color:var(--cv2-muted);'
          + 'font-size:11px;'
          + 'font-weight:700;'
          + 'white-space:nowrap;'
        + '}'

        + '.cv2-orderbump__secure-dot{'
          + 'width:7px;'
          + 'height:7px;'
          + 'border-radius:999px;'
          + 'background:var(--cv2-primary);'
          + 'display:inline-block;'
        + '}'

        + '.cv2-orderbump__top{'
          + 'position:relative;'
          + 'z-index:1;'
          + 'display:grid;'
          + 'grid-template-columns:86px 1fr;'
          + 'gap:14px;'
          + 'align-items:center;'
          + 'margin-bottom:15px;'
        + '}'

        + '.cv2-orderbump__image{'
          + 'width:86px;'
          + 'height:86px;'
          + 'border-radius:14px;'
          + 'background:#fff;'
          + 'padding:9px;'
          + 'display:flex;'
          + 'align-items:center;'
          + 'justify-content:center;'
          + 'border:1px solid rgba(17,24,39,.07);'
          + 'box-shadow:0 8px 18px rgba(17,24,39,.08);'
        + '}'

        + '.cv2-orderbump__image img{'
          + 'max-width:100%;'
          + 'max-height:100%;'
          + 'object-fit:contain;'
          + 'display:block;'
        + '}'

        + '.cv2-orderbump__product-link{'
          + 'text-decoration:none;'
          + 'color:inherit;'
          + 'display:block;'
        + '}'

        + '.cv2-orderbump__product-link:hover .cv2-orderbump__product-name{'
          + 'text-decoration:underline;'
        + '}'

        + '.cv2-orderbump__overline{'
          + 'display:block;'
          + 'max-width:100%;'
          + 'margin-bottom:6px;'
          + 'color:#7a5700;'
          + 'font-size:11px;'
          + 'font-weight:900;'
          + 'text-transform:none;'
          + 'letter-spacing:0;'
          + 'line-height:1.35;'
        + '}'

        + '.cv2-orderbump__product-name{'
          + 'margin:0 0 9px;'
          + 'font-size:14px;'
          + 'font-weight:800;'
          + 'line-height:1.35;'
          + 'color:var(--cv2-text);'
        + '}'

        + '.cv2-orderbump__prices{'
          + 'display:flex;'
          + 'align-items:center;'
          + 'gap:8px;'
          + 'flex-wrap:wrap;'
        + '}'

        + '.cv2-orderbump__old-price{'
          + 'font-size:12px;'
          + 'color:#9ca3af;'
          + 'text-decoration:line-through;'
          + 'font-weight:700;'
        + '}'

        + '.cv2-orderbump__price{'
          + 'font-size:22px;'
          + 'font-weight:950;'
          + 'color:var(--cv2-text);'
          + 'line-height:1;'
        + '}'

        + '.cv2-orderbump__saving{'
          + 'display:inline-flex;'
          + 'align-items:center;'
          + 'min-height:22px;'
          + 'padding:4px 8px;'
          + 'border-radius:999px;'
          + 'background:#fff3d6;'
          + 'color:#9a5b00;'
          + 'font-size:11px;'
          + 'font-weight:900;'
          + 'line-height:1;'
        + '}'

        + '.cv2-orderbump__button{'
          + 'position:relative;'
          + 'z-index:1;'
          + 'width:100%;'
          + 'min-height:56px;'
          + 'border:0!important;'
          + 'border-radius:12px!important;'
          + 'background:var(--cv2-primary)!important;'
          + 'color:#1f1f1f!important;'
          + 'font-size:13px!important;'
          + 'font-weight:950!important;'
          + 'line-height:1.25!important;'
          + 'text-transform:uppercase!important;'
          + 'letter-spacing:.25px!important;'
          + 'cursor:pointer!important;'
          + 'display:flex!important;'
          + 'align-items:center!important;'
          + 'justify-content:center!important;'
          + 'gap:10px!important;'
          + 'box-shadow:0 10px 20px rgba(242,200,93,.32)!important;'
          + 'transition:transform .18s ease,filter .18s ease,box-shadow .18s ease,background .18s ease!important;'
        + '}'

        + '.cv2-orderbump__button:hover{'
          + 'filter:brightness(.96)!important;'
          + 'transform:translateY(-1px)!important;'
          + 'box-shadow:0 12px 24px rgba(242,200,93,.42)!important;'
        + '}'

        + '.cv2-orderbump__button:active{'
          + 'transform:translateY(0)!important;'
          + 'box-shadow:0 6px 14px rgba(242,200,93,.28)!important;'
        + '}'

        + '.cv2-orderbump__button.is-loading{'
          + 'pointer-events:none!important;'
          + 'opacity:.78!important;'
          + 'background:var(--cv2-primary-dark)!important;'
        + '}'

        + '.cv2-orderbump__button.is-selected{'
          + 'pointer-events:none!important;'
          + 'background:var(--cv2-primary-dark)!important;'
          + 'color:#1f1f1f!important;'
          + 'box-shadow:0 10px 20px rgba(242,200,93,.26)!important;'
        + '}'

        + '.cv2-orderbump__checkbox{'
          + 'width:19px;'
          + 'height:19px;'
          + 'min-width:19px;'
          + 'border-radius:6px;'
          + 'background:#fff;'
          + 'border:2px solid #fff;'
          + 'position:relative;'
          + 'box-shadow:inset 0 0 0 1px rgba(17,24,39,.08);'
        + '}'

        + '.cv2-orderbump__button.is-selected .cv2-orderbump__checkbox::after{'
          + 'content:"";'
          + 'position:absolute;'
          + 'left:5px;'
          + 'top:1px;'
          + 'width:5px;'
          + 'height:10px;'
          + 'border:solid #1f1f1f;'
          + 'border-width:0 2px 2px 0;'
          + 'transform:rotate(45deg);'
        + '}'

        + '.cv2-orderbump__small{'
          + 'position:relative;'
          + 'z-index:1;'
          + 'display:block;'
          + 'margin-top:9px;'
          + 'font-size:11px;'
          + 'line-height:1.4;'
          + 'color:var(--cv2-muted);'
          + 'text-align:center;'
        + '}'

        + '@media(max-width:767px){'
          + '.cv2-orderbump{margin:14px 0 18px;}'
          + '.cv2-orderbump__card{padding:14px;border-radius:14px;}'
          + '.cv2-orderbump__header{align-items:flex-start;margin-bottom:12px;}'
          + '.cv2-orderbump__tag{font-size:10px;padding:7px 9px;}'
          + '.cv2-orderbump__secure{font-size:10px;}'
          + '.cv2-orderbump__top{grid-template-columns:72px 1fr;gap:12px;margin-bottom:12px;}'
          + '.cv2-orderbump__image{width:72px;height:72px;border-radius:12px;padding:8px;}'
          + '.cv2-orderbump__overline{font-size:10px;margin-bottom:5px;line-height:1.3;}'
          + '.cv2-orderbump__product-name{font-size:13px;margin-bottom:7px;}'
          + '.cv2-orderbump__price{font-size:19px;}'
          + '.cv2-orderbump__saving{font-size:10px;padding:4px 7px;}'
          + '.cv2-orderbump__button{min-height:52px!important;font-size:12px!important;border-radius:11px!important;padding:0 12px!important;}'
          + '.cv2-orderbump__small{font-size:10px;}'
        + '}';

      var style = document.createElement('style');
      style.id = 'cv2-orderbump-styles';
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }

    function buildOrderBumpHtml() {
      return ''
        + '<div class="cv2-orderbump" id="cv2-orderbump" data-product-id="' + escapeHtml(ORDER_BUMP_CONFIG.productId) + '">'
          + '<div class="cv2-orderbump__card">'

            + '<div class="cv2-orderbump__header">'
              + '<div class="cv2-orderbump__tag">'
                + '<span class="cv2-orderbump__tag-icon">+</span>'
                + '<span>' + escapeHtml(ORDER_BUMP_CONFIG.tag) + '</span>'
              + '</div>'

              + '<span class="cv2-orderbump__secure">'
                + '<span class="cv2-orderbump__secure-dot"></span>'
                + '<span>No checkout</span>'
              + '</span>'
            + '</div>'

            + '<div class="cv2-orderbump__top">'
              + '<a class="cv2-orderbump__product-link" href="' + escapeHtml(ORDER_BUMP_CONFIG.productUrl) + '" target="_blank" rel="noopener">'
                + '<div class="cv2-orderbump__image">'
                  + '<img loading="lazy" src="' + escapeHtml(ORDER_BUMP_CONFIG.image) + '" alt="' + escapeHtml(ORDER_BUMP_CONFIG.name) + '">'
                + '</div>'
              + '</a>'

              + '<div class="cv2-orderbump__product">'
                + '<span class="cv2-orderbump__overline">' + escapeHtml(ORDER_BUMP_CONFIG.researchText) + '</span>'

                + '<a class="cv2-orderbump__product-link" href="' + escapeHtml(ORDER_BUMP_CONFIG.productUrl) + '" target="_blank" rel="noopener">'
                  + '<p class="cv2-orderbump__product-name">' + escapeHtml(ORDER_BUMP_CONFIG.name) + '</p>'
                + '</a>'

                + '<div class="cv2-orderbump__prices">'
                  + '<span class="cv2-orderbump__old-price">' + escapeHtml(ORDER_BUMP_CONFIG.oldPrice) + '</span>'
                  + '<strong class="cv2-orderbump__price">' + escapeHtml(ORDER_BUMP_CONFIG.price) + '</strong>'
                  + '<span class="cv2-orderbump__saving">' + escapeHtml(ORDER_BUMP_CONFIG.savingText) + '</span>'
                + '</div>'
              + '</div>'
            + '</div>'

            + '<button type="button" class="cv2-orderbump__button" id="cv2-orderbump-button" aria-live="polite">'
              + '<span class="cv2-orderbump__checkbox"></span>'
              + '<span class="cv2-orderbump__button-text">' + escapeHtml(ORDER_BUMP_CONFIG.buttonDefault) + '</span>'
            + '</button>'

            + '<small class="cv2-orderbump__small">' + escapeHtml(ORDER_BUMP_CONFIG.smallText) + '</small>'

          + '</div>'
        + '</div>';
    }

    function findInsertionPoint() {
      var $ = window.jQuery;

      var selectors = [
        '#payment-panel .payment-method-pix',
        '#payment-panel [data-payment-method="pix"]',
        '#payment-panel .pix',
        '#payment-panel .cv2-step__body',
        '#payment-panel',
        '#checkout-v2-container',
        '.checkout-v2-container'
      ];

      for (var i = 0; i < selectors.length; i++) {
        var $target = $(selectors[i]).first();

        if ($target.length) {
          return $target;
        }
      }

      return $();
    }

    function injectOrderBump() {
      try {
        var $ = window.jQuery;

        injectOrderBumpStyles();

        if ($('#cv2-orderbump').length) return true;

        var $target = findInsertionPoint();

        if (!$target.length) return false;

        if (
          $target.attr('id') === 'payment-panel' ||
          $target.attr('id') === 'checkout-v2-container' ||
          $target.hasClass('checkout-v2-container')
        ) {
          $target.append(buildOrderBumpHtml());
        } else {
          $target.after(buildOrderBumpHtml());
        }

        bindOrderBumpEvents();

        return true;
      } catch (e) {
        console.warn('[cv2-orderbump] Erro ao injetar order bump:', e);
        return false;
      }
    }

    function setButtonState(state) {
      var $ = window.jQuery;
      var $button = $('#cv2-orderbump-button');
      var $text = $button.find('.cv2-orderbump__button-text');

      $button.removeClass('is-loading is-selected');
      $button.prop('disabled', false);
      $button.attr('aria-busy', 'false');

      if (state === 'loading') {
        $button.addClass('is-loading');
        $button.prop('disabled', true);
        $button.attr('aria-busy', 'true');
        $text.text(ORDER_BUMP_CONFIG.buttonLoading);
      }

      if (state === 'selected') {
        $button.addClass('is-selected');
        $button.prop('disabled', true);
        $button.attr('aria-busy', 'false');
        $text.text(ORDER_BUMP_CONFIG.buttonSelected);
      }

      if (state === 'default') {
        $text.text(ORDER_BUMP_CONFIG.buttonDefault);
      }
    }

    function addOrderBumpToCart() {
      try {
        var $ = window.jQuery;

        if (orderBumpState.loading || orderBumpState.added) return;

        orderBumpState.loading = true;
        $('#cv2-orderbump').addClass('is-loading');
        setButtonState('loading');

        $.ajax({
          url: ORDER_BUMP_CONFIG.addEndpoint,
          type: 'POST',
          dataType: 'json',
          cache: false,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          },
          data: {
            'sylius_cart_item[quantity]': ORDER_BUMP_CONFIG.quantity
          },
          success: function(response) {
            var isSuccess = false;

            if (!response) {
              isSuccess = true;
            }

            if (response && response.status === 'success') {
              isSuccess = true;
            }

            if (response && response.success === true) {
              isSuccess = true;
            }

            if (isSuccess) {
              orderBumpState.added = true;
              setButtonState('selected');

              setTimeout(function() {
                window.location.reload();
              }, 600);

              return;
            }

            console.warn('[cv2-orderbump] Resposta inesperada:', response);

            orderBumpState.loading = false;
            $('#cv2-orderbump').removeClass('is-loading');
            setButtonState('default');
          },
          error: function(xhr) {
            console.warn('[cv2-orderbump] Erro ao adicionar produto:', xhr);

            orderBumpState.loading = false;
            $('#cv2-orderbump').removeClass('is-loading');
            setButtonState('default');
          }
        });
      } catch (e) {
        console.warn('[cv2-orderbump] Erro ao adicionar produto:', e);

        orderBumpState.loading = false;
        $('#cv2-orderbump').removeClass('is-loading');
        setButtonState('default');
      }
    }

    function bindOrderBumpEvents() {
      var $ = window.jQuery;

      $(document)
        .off('click.cv2OrderBump', '#cv2-orderbump-button')
        .on('click.cv2OrderBump', '#cv2-orderbump-button', function(event) {
          event.preventDefault();
          event.stopPropagation();

          addOrderBumpToCart();

          return false;
        });
    }

    function startObserver() {
      if (orderBumpState.observerStarted) return;

      var container =
        document.getElementById('checkout-v2-container') ||
        document.body;

      if (!container || typeof MutationObserver === 'undefined') return;

      orderBumpState.observerStarted = true;

      var observer = new MutationObserver(function() {
        setTimeout(function() {
          injectOrderBump();
        }, 150);
      });

      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }

    function bootOrderBump() {
      orderBumpState.bootTries++;

      injectOrderBump();
      startObserver();

      if (!document.getElementById('cv2-orderbump') && orderBumpState.bootTries < orderBumpState.maxBootTries) {
        setTimeout(bootOrderBump, 250);
      }
    }

    safeJqueryReady(function() {
      bootOrderBump();

      window.jQuery(document).on('cv2:content:refreshed ajaxComplete checkout:updated', function() {
        setTimeout(function() {
          injectOrderBump();
        }, 150);
      });
    });

    window.injectCv2OrderBump = function() {
      bootOrderBump();
    };

    window.addCv2OrderBumpToCart = function() {
      addOrderBumpToCart();
    };

  } catch (e) {
    console.warn('[cv2-orderbump] Erro fatal - order bump desabilitado:', e);
  }
})();