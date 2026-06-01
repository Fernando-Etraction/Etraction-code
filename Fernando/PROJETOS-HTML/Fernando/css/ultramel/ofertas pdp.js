(function () {
  const oldStyle = document.querySelector("#etc-kit-prices-layout");
  const oldBox = document.querySelector(".etc-kit-wrapper");

  if (oldStyle) oldStyle.remove();
  if (oldBox) oldBox.remove();

  const style = document.createElement("style");
  style.id = "etc-kit-prices-layout";

  style.innerHTML = `
    .etc-kit-wrapper {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 14px 0;
      font-family: Arial, sans-serif;
    }

    .etc-kit-card {
      position: relative;
      min-height: 116px;
      border: 1px solid #e6e1d6;
      border-radius: 12px;
      background: #fffdf8;
      padding: 18px 10px 12px;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      transition: all .2s ease;
      overflow: visible;
    }

    .etc-kit-card:hover {
      border-color: #d6a843;
      background: #fffaf0;
    }

    .etc-kit-card.etc-active {
      border: 2px solid #c9942f;
      background: #fff7e5;
      box-shadow: 0 4px 12px rgba(201, 148, 47, .14);
    }

    .etc-kit-radio {
      position: absolute;
      top: 9px;
      left: 9px;
      width: 10px;
      height: 10px;
      border: 2px solid #9c9c9c;
      border-radius: 50%;
      box-sizing: border-box;
      background: #fff;
    }

    .etc-kit-card.etc-active .etc-kit-radio {
      border-color: #c9942f;
    }

    .etc-kit-card.etc-active .etc-kit-radio::after {
      content: "";
      position: absolute;
      inset: 2px;
      background: #c9942f;
      border-radius: 50%;
    }

    .etc-kit-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #c9942f;
      color: #fff;
      font-size: 8px;
      font-weight: 900;
      padding: 6px 13px;
      border-radius: 999px;
      white-space: nowrap;
      text-transform: uppercase;
      line-height: 1;
      z-index: 2;
    }

    .etc-kit-title {
      font-size: 13px;
      color: #2f240f;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 3px;
    }

    .etc-kit-old {
      display: block;
      font-size: 10px;
      color: #9d927c;
      text-decoration: line-through;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .etc-kit-price {
      font-size: 15px;
      font-weight: 900;
      color: #2f240f;
      line-height: 1;
      margin-bottom: 12px;
    }

    .etc-kit-line {
      width: 100%;
      height: 1px;
      border-top: 1px dashed #e5dcc8;
      margin: 0 0 10px;
    }

    .etc-kit-ml {
      font-size: 11px;
      color: #2f240f;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 2px;
    }

    .etc-kit-desc {
      font-size: 9px;
      color: #8a7a5a;
      font-weight: 700;
      line-height: 1.15;
      max-width: 105px;
      margin: 0 auto;
    }

    @media(max-width: 520px) {
      .etc-kit-wrapper {
        gap: 6px;
        margin: 12px 0;
      }

      .etc-kit-card {
        min-height: 108px;
        padding: 17px 6px 10px;
        border-radius: 10px;
      }

      .etc-kit-radio {
        top: 8px;
        left: 8px;
        width: 9px;
        height: 9px;
      }

      .etc-kit-badge {
        top: -10px;
        font-size: 6px;
        padding: 5px 9px;
      }

      .etc-kit-title {
        font-size: 11px;
      }

      .etc-kit-old {
        font-size: 9px;
      }

      .etc-kit-price {
        font-size: 13px;
        margin-bottom: 9px;
      }

      .etc-kit-line {
        margin-bottom: 8px;
      }

      .etc-kit-ml {
        font-size: 9px;
      }

      .etc-kit-desc {
        font-size: 7px;
        max-width: 86px;
      }
    }
  `;

  const wrapper = document.createElement("div");
  wrapper.className = "etc-kit-wrapper";

  wrapper.innerHTML = `
    <div class="etc-kit-card" data-qty="1">
      <span class="etc-kit-radio"></span>
      <div class="etc-kit-title">1 Mês</div>
      <span class="etc-kit-old">R$ 248,88</span>
      <div class="etc-kit-price">R$ 198,88</div>
      <div class="etc-kit-line"></div>
      <div class="etc-kit-ml">30 cápsulas</div>
      <div class="etc-kit-desc">Ideal para começar por 1 mês</div>
    </div>

    <div class="etc-kit-card etc-active" data-qty="2">
      <div class="etc-kit-badge">Mais vendido</div>
      <span class="etc-kit-radio"></span>
      <div class="etc-kit-title">2 Meses</div>
      <span class="etc-kit-old">R$ 497,76</span>
      <div class="etc-kit-price">R$ 228,88</div>
      <div class="etc-kit-line"></div>
      <div class="etc-kit-ml">60 cápsulas</div>
      <div class="etc-kit-desc">Mais volume para até 2 meses de uso</div>
    </div>

    <div class="etc-kit-card" data-qty="3">
      <span class="etc-kit-radio"></span>
      <div class="etc-kit-title">3 Meses</div>
      <span class="etc-kit-old">R$ 746,64</span>
      <div class="etc-kit-price">R$ 248,88</div>
      <div class="etc-kit-line"></div>
      <div class="etc-kit-ml">90 cápsulas</div>
      <div class="etc-kit-desc">Estoque completo para até 3 meses</div>
    </div>
  `;

  document.head.appendChild(style);

  const target = document.getElementById("product-price-info");

  if (target) {
    target.insertAdjacentElement("afterend", wrapper);
  } else {
    console.warn('ID "product-price-info" não encontrado.');
  }

  const quantityInput = document.querySelector("#sylius_cart_item_quantity");

  function updateQuantity(qty) {
    if (!quantityInput) {
      console.warn('Input "#sylius_cart_item_quantity" não encontrado.');
      return;
    }

    quantityInput.value = qty;
    quantityInput.setAttribute("value", qty);

    quantityInput.dispatchEvent(new Event("input", { bubbles: true }));
    quantityInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  wrapper.querySelectorAll(".etc-kit-card").forEach(function (card) {
    card.addEventListener("click", function () {
      const qty = this.getAttribute("data-qty");

      wrapper.querySelectorAll(".etc-kit-card").forEach(function (item) {
        item.classList.remove("etc-active");
      });

      this.classList.add("etc-active");
      updateQuantity(qty);
    });
  });

  updateQuantity(2);
})();