(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     CUPOM NO CARRINHO
     Caixa no topo do carrinho: chamada "Últimas horas para garantir
     o preço da promoção 10.10", timer até a meia-noite, economia com
     o 1010 e o cupom em destaque. O botão preenche e aplica o cupom nativo.
  ========================================================= */

  if (window.__hz1010CarrinhoLoaded) {
    return;
  }

  window.__hz1010CarrinhoLoaded = true;

  var ID = "hz1010-cart";
  var STYLE_ID = "hz1010-cart-style";


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    name: "10.10",

    // Chamada do bloco: o trecho em destaque e o restante da frase
    headlineStrong: "Últimas horas",
    headlineRest: "para garantir o preço da promoção 10.10",
    coupon: "1010",

    // O cupom dá 10% sobre o valor dos produtos
    couponDiscount: 0.10
  };

  var SELETORES = {
    carrinho: "#cartContainer",
    topo: ".rowCartPostalCode",
    linhaCupom: ".rowCartPromotionCodes",
    campoCupom: "#uoou_cart_promotionCoupons_0",
    botaoCupom: "#apply-coupon",
    subtotal: "#cartContainer .cartSubtotal .itemTotalPrice"
  };


  /* =========================================================
     MOMENTO DA AÇÃO - AUTOMÁTICO (horário de Brasília)

     09/10 22h a 12/10 23h59   bloco visível
     antes e depois            nada aparece

     O script pode ficar instalado desde já: ele liga e desliga
     sozinho, sem recarregar a página.

     Só para conferir antes da data, na URL:
     ?hz1010=active | last   (?hz1010=off volta ao calendário)
  ========================================================= */

  // Horário de Brasília (UTC-3), independente do relógio do visitante
  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  var AGENDA = {
    active: brasilia(2026, 10, 9, 22),  // 09/10 22h
    end: brasilia(2026, 10, 13, 0)      // 12/10 23h59
  };

  var PREVIEW_KEY = "hz1010-preview";

  function lerPreview() {

    var valor = null;

    try {

      var param =
        new URLSearchParams(window.location.search).get("hz1010");

      if (param === "off") {
        window.sessionStorage.removeItem(PREVIEW_KEY);
        return null;
      }

      if (param) {
        window.sessionStorage.setItem(PREVIEW_KEY, param);
      }

      valor = window.sessionStorage.getItem(PREVIEW_KEY);

    } catch (erro) { }

    return valor === "warmup" || valor === "active" || valor === "last"
      ? valor
      : null;
  }

  var PREVIEW = lerPreview();

  function ofertaAberta() {

    // No aquecimento o cupom ainda não é revelado
    if (PREVIEW) {
      return PREVIEW !== "warmup";
    }

    var agora = Date.now();

    return agora >= AGENDA.active && agora < AGENDA.end;
  }

  // Timer diário: conta até a próxima virada da hora indicada, no horário de
  // Brasília (UTC-3), e recomeça sozinho no dia seguinte. 24 = meia-noite.
  function proximaVirada(hora) {

    var agora = Date.now();
    var brasiliaAgora = new Date(agora - 3 * 3600000);

    var alvo = Date.UTC(
      brasiliaAgora.getUTCFullYear(),
      brasiliaAgora.getUTCMonth(),
      brasiliaAgora.getUTCDate(),
      hora + 3, 0, 0
    );

    return alvo > agora ? alvo : alvo + 86400000;
  }


  /* =========================================================
     UTILITÁRIOS
  ========================================================= */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatBRL(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function lerPreco(el) {

    if (!el) {
      return NaN;
    }

    var achado = (el.textContent || "").match(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})/);

    if (!achado) {
      return NaN;
    }

    return parseFloat(achado[1].replace(/\./g, "") + "." + achado[2]);
  }

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function definirTexto(el, texto) {

    if (el && el.textContent !== texto) {
      el.textContent = texto;
    }
  }


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    /* Caixa cinza-clara, como as linhas do resumo do carrinho.
       Em cima: chamada + timer. Embaixo: economia com o cupom + botão. */
    '.hz1010-cart{position:relative;box-sizing:border-box;width:100%;margin:0 0 16px;padding:14px 16px;border:1px solid #e0e0e0;border-radius:6px;background:#f6f6f6;color:#111;font-family:inherit;font-size:14px;line-height:1.3;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hz1010-cart *{box-sizing:border-box}',

    /* Chamada + timer */
    '.hz1010-cart__head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 20px}',
    '.hz1010-cart__title{margin:0;color:#111;font-size:17px;font-weight:500;line-height:1.25}',
    '.hz1010-cart__title strong{color:#e5262e;font-weight:800;letter-spacing:.02em;text-transform:uppercase}',
    '.hz1010-cart__clock{display:inline-flex;align-items:center;gap:4px;flex-shrink:0}',
    '.hz1010-cart__seg{display:inline-flex;align-items:baseline;gap:2px;padding:7px 8px;border-radius:5px;background:#111;line-height:1}',
    '.hz1010-cart__seg b{color:#fff;font-size:16px;font-weight:800;font-variant-numeric:tabular-nums}',
    '.hz1010-cart__seg i{color:rgba(255,255,255,.65);font-size:9px;font-style:normal;font-weight:700;text-transform:uppercase}',

    /* Economia com o cupom + botão */
    '.hz1010-cart__foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 20px;margin-top:12px;padding-top:12px;border-top:1px solid #e0e0e0}',
    '.hz1010-cart__saving{display:flex;flex-wrap:wrap;align-items:center;gap:4px 7px;margin:0;color:#444;font-size:14px;line-height:1.2}',
    '.hz1010-cart__value{color:#111;font-size:20px;font-weight:800;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}',
    '.hz1010-cart__code{display:inline-block;padding:5px 10px;border:1px dashed #8a8a8a;border-radius:4px;background:#fff;color:#111;font-size:15px;font-weight:800;line-height:1;letter-spacing:.14em}',
    '.hz1010-cart__btn{-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;justify-content:center;width:auto;height:40px;min-width:0;margin:0;padding:0 22px;border:0;border-radius:4px;background:#111;box-shadow:none;color:#fff;font:inherit;font-size:14px;font-weight:700;line-height:1;letter-spacing:0;text-transform:none;white-space:nowrap;cursor:pointer;transition:background-color .15s}',
    '.hz1010-cart__btn:hover{background:#333}',
    '.hz1010-cart__btn:focus-visible{outline:2px solid #111;outline-offset:2px}',
    '.hz1010-cart__btn[disabled]{opacity:.75;cursor:default}',

    /* Cupom já aplicado */
    '.hz1010-cart.is-applied .hz1010-cart__value{color:#1f9d57}',
    '.hz1010-cart.is-applied .hz1010-cart__code{border-style:solid;border-color:#8fcaa5;background:#eef8f1}',
    '.hz1010-cart.is-applied .hz1010-cart__btn{background:#1f9d57;color:#fff;opacity:1;cursor:default}',

    /* Celular: tudo um pouco menor, com economia e cupom na mesma linha */
    '@media (max-width:700px){',
    '.hz1010-cart{margin-bottom:12px;padding:10px 12px}',
    '.hz1010-cart__head{gap:7px 12px}',
    '.hz1010-cart__title{font-size:14px;line-height:1.2}',
    '.hz1010-cart__clock{gap:3px}',
    '.hz1010-cart__seg{padding:5px 6px;border-radius:4px}',
    '.hz1010-cart__seg b{font-size:13px}',
    '.hz1010-cart__seg i{font-size:8px}',
    '.hz1010-cart__foot{gap:8px;margin-top:8px;padding-top:8px}',
    '.hz1010-cart__saving{gap:3px 5px;font-size:12px}',
    '.hz1010-cart__value{font-size:17px}',
    '.hz1010-cart__code{padding:4px 8px;font-size:13px}',
    '.hz1010-cart__btn{width:100%;height:36px;font-size:13px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hz1010-cart__btn{transition:none}}'
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
     HTML
  ========================================================= */

  function blocoHTML() {
    return '<div class="hz1010-cart__head">' +
        '<p class="hz1010-cart__title"><strong>' + esc(CONFIG.headlineStrong) + '</strong> ' + esc(CONFIG.headlineRest) + '</p>' +
        '<span class="hz1010-cart__clock" data-hz1010-cart-timer aria-hidden="true"></span>' +
      '</div>' +
      '<div class="hz1010-cart__foot">' +
        '<p class="hz1010-cart__saving"><span data-hz1010-cart-lead></span><strong class="hz1010-cart__value" data-hz1010-cart-saving></strong><span>com o cupom</span><span class="hz1010-cart__code">' + esc(CONFIG.coupon) + '</span></p>' +
        '<button type="button" class="hz1010-cart__btn" data-hz1010-cart-apply></button>' +
      '</div>';
  }


  /* =========================================================
     VALORES
  ========================================================= */

  function cupomAplicado() {

    var campo = document.querySelector(SELETORES.campoCupom);

    // Depois de aplicado, o carrinho volta com o código no campo
    return !!campo &&
      campo.defaultValue.replace(/\s+/g, "").toUpperCase() === CONFIG.coupon.toUpperCase();
  }

  function atualizarValores(bloco) {

    var subtotal = lerPreco(document.querySelector(SELETORES.subtotal));

    if (!(subtotal > 0)) {
      return false;
    }

    var economia = Math.round(subtotal * CONFIG.couponDiscount * 100) / 100;
    var aplicado = cupomAplicado();

    bloco.classList.toggle("is-applied", aplicado);

    definirTexto(
      bloco.querySelector("[data-hz1010-cart-lead]"),
      aplicado ? "Você economizou" : "Você economiza"
    );

    definirTexto(bloco.querySelector("[data-hz1010-cart-saving]"), formatBRL(economia));

    var botao = bloco.querySelector("[data-hz1010-cart-apply]");

    if (!botao._hz1010Aplicando) {
      definirTexto(botao, aplicado ? "Cupom aplicado ✓" : "Aplicar cupom");
      botao.disabled = aplicado;
    }

    return true;
  }


  /* =========================================================
     TIMER
     Diário: conta até a meia-noite e recomeça no dia seguinte
  ========================================================= */

  function atualizarTimer(bloco) {

    var restante =
      Math.max(0, Math.floor((proximaVirada(24) - Date.now()) / 1000));

    function seg(valor, rotulo) {
      return '<span class="hz1010-cart__seg"><b>' + doisDigitos(valor) + '</b><i>' + rotulo + '</i></span>';
    }

    var html =
      seg(Math.floor(restante / 3600), "h") +
      seg(Math.floor(restante % 3600 / 60), "m") +
      seg(restante % 60, "s");

    var relogio = bloco.querySelector("[data-hz1010-cart-timer]");

    if (relogio && relogio._hz1010Html !== html) {
      relogio._hz1010Html = html;
      relogio.innerHTML = html;
    }
  }


  /* =========================================================
     APLICAR CUPOM
     Preenche o campo nativo e clica no "Aplicar" do carrinho
  ========================================================= */

  function copiarFallback(texto) {

    var textarea = document.createElement("textarea");

    textarea.value = texto;

    textarea.setAttribute("readonly", "");

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (erro) { }

    textarea.remove();
  }

  function aplicarCupom(botao) {

    var campo = document.querySelector(SELETORES.campoCupom);
    var nativo = document.querySelector(SELETORES.botaoCupom);

    try {
      (window.dataLayer = window.dataLayer || []).push({
        event: "hz1010_aplicar_cupom",
        hz1010_local: "carrinho"
      });
    } catch (erro) { }

    // Sem o campo nativo, pelo menos copia o código
    if (!campo || !nativo) {

      copiarFallback(CONFIG.coupon);

      botao.textContent = "Cupom copiado";

      return;
    }

    botao._hz1010Aplicando = true;
    botao.disabled = true;
    botao.textContent = "Aplicando...";

    campo.value = CONFIG.coupon;

    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));

    setTimeout(function () {
      nativo.click();
    }, 100);
  }

  document.addEventListener("click", function (event) {

    var botao =
      event.target &&
      event.target.closest &&
      event.target.closest("#" + ID + " [data-hz1010-cart-apply]");

    if (!botao || botao.disabled) {
      return;
    }

    event.preventDefault();

    aplicarCupom(botao);
  });


  /* =========================================================
     MONTAGEM
     No topo do carrinho
  ========================================================= */

  function montar() {

    var bloco = document.getElementById(ID);

    if (!ofertaAberta()) {

      if (bloco) {
        bloco.remove();
      }

      return;
    }

    // No topo do carrinho, antes da linha do CEP. Sem ela, acima do campo de cupom
    var ancora =
      document.querySelector(SELETORES.carrinho + " " + SELETORES.topo) ||
      document.querySelector(SELETORES.carrinho + " " + SELETORES.linhaCupom);

    if (!ancora || !ancora.parentNode) {
      return;
    }

    adicionarEstilo();

    if (!bloco) {

      bloco = document.createElement("div");

      bloco.id = ID;
      bloco.className = "hz1010-cart";

      bloco.setAttribute("role", "region");
      bloco.setAttribute("aria-label", "Oferta " + CONFIG.name);

      bloco.innerHTML = blocoHTML();
    }

    // Sem valor de produtos não há o que mostrar
    if (!atualizarValores(bloco)) {
      return;
    }

    atualizarTimer(bloco);

    if (bloco.nextElementSibling !== ancora) {
      ancora.parentNode.insertBefore(bloco, ancora);
    }
  }


  /* =========================================================
     OBSERVER
     Recoloca o bloco e refaz a conta quando o carrinho muda
  ========================================================= */

  var observer = null;
  var observerFrame = null;

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

        montar();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    montar();

    iniciarObserver();

    // Atualiza o timer e abre/encerra o bloco sem recarregar a página
    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
