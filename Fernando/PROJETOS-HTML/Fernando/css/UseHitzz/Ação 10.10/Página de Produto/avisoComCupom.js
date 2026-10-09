(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     PÁGINA DE PRODUTO
     Logo abaixo do preço nativo, com o valor final calculado
  ========================================================= */

  if (window.__hz1010PdpLoaded) {
    return;
  }

  window.__hz1010PdpLoaded = true;

  var ID = "hz1010-pdp";
  var STYLE_ID = "hz1010-pdp-style";

  // No aquecimento o cupom ainda não é revelado
  var NO_AQUECIMENTO = false;

  // O cupom dá 10% sobre o preço no Pix, que já vem com 10% por padrão
  var DESCONTO_CUPOM = 0.10;

  // Usado só se a PDP não exibir o preço no Pix
  var DESCONTO_PIX = 0.10;

  var SELETORES = {
    preco: "#right-column .pdp-payment, #product-variant-form .pdp-payment, .pdp-payment",
    precoContainer: ".product-price-container",
    form: "#product-variant-form",
    precoCheio: ".pdp-payment__price--normal",
    precoPix: ".pdp-payment__price--cash-payment",
    precos: ".pdp-payment__price"
  };

  var cupomCopiado = false;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    name: "10.10",
    coupon: "1010",
    discountLabel: "20% OFF",
    breakdownLabel: "10% do cupom + 10% do Pix.",
    offerStartLabel: "22h",
    deadlineLabel: "12/10, às 23h59"
  };

  // Timer diário: conta até a próxima virada da hora indicada, no horário de
  // Brasília (UTC-3), e recomeça sozinho no dia seguinte. 24 = meia-noite.
  function proximaVirada(hora) {

    var agora = Date.now();
    var brasilia = new Date(agora - 3 * 3600000);

    var alvo = Date.UTC(
      brasilia.getUTCFullYear(),
      brasilia.getUTCMonth(),
      brasilia.getUTCDate(),
      hora + 3, 0, 0
    );

    return alvo > agora ? alvo : alvo + 86400000;
  }

  // Hora de abertura da oferta, usada na contagem do aquecimento
  var HORA_ABERTURA = 22;

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     MOMENTO DA AÇÃO - AUTOMÁTICO (horário de Brasília)

     09/10, 20h às 22h   aquecimento: só a tarja, com contagem até a abertura
     09/10 22h a 11/10   oferta ativa
     desde 09/10 22h     timers ligados: contam até a meia-noite e recomeçam todo dia
     12/10               último dia, com timer até 23h59
     depois de 12/10     nada aparece

     O script pode ficar instalado desde já: ele liga, troca de
     momento e desliga sozinho, sem recarregar a página.

     Só para conferir antes da data, na URL:
     ?hz1010=warmup | active | last   (?hz1010=off volta ao calendário)
  ========================================================= */

  // Horário de Brasília (UTC-3), independente do relógio do visitante
  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  var AGENDA = {
    warmup: brasilia(2026, 10, 9, 20),  // 09/10 20h
    active: brasilia(2026, 10, 9, 22),  // 09/10 22h
    timer: brasilia(2026, 10, 9, 22),   // 09/10 22h: os timers ligam junto com a oferta
    last: brasilia(2026, 10, 12, 0),    // 12/10 00h
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

  // Devolve "warmup", "active", "last" ou null (fora da ação)
  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();

    if (agora < AGENDA.warmup || agora >= AGENDA.end) {
      return null;
    }

    if (agora < AGENDA.active) {
      return "warmup";
    }

    return agora < AGENDA.last ? "active" : "last";
  }

  // Os timers ligam junto com a oferta (09/10 às 22h). No preview aparecem sempre.
  function timerLigado() {
    return PREVIEW ? true : Date.now() >= AGENDA.timer;
  }

  // Este bloco mostra timer? (oferta ativa e último dia)
  function comTimer(state) {
    return state === "last" || (state === "active" && timerLigado());
  }

  function estadoAtual() {
    return momentoDaAcao();
  }

  function alvoDoTimer(estado) {
    return proximaVirada(estado === "warmup" ? HORA_ABERTURA : 24);
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

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function definirTexto(el, texto) {

    if (el && el.textContent !== texto) {
      el.textContent = texto;
    }
  }

  var ICONS =
    '<svg class="hz1010-ico hz1010-ico--copy" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H3a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 3 10.5h.5"/></svg>' +
    '<svg class="hz1010-ico hz1010-ico--check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';

  var DOT = '<span class="hz1010-dot" aria-hidden="true"></span>';

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


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    /* Ponto vermelho (o mesmo do letreiro "Esquenta") */
    '.hz1010-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#e5262e;flex-shrink:0}',

    /* ---------- Cartão escuro com brilho ---------- */
    '.hz1010-card{position:relative;overflow:hidden;box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:radial-gradient(110% 150% at 100% 0%,rgba(255,255,255,.14) 0%,rgba(255,255,255,0) 52%),linear-gradient(160deg,#1b1b1b 0%,#080808 58%,#000 100%);color:#fff;font:inherit;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hz1010-card *{box-sizing:border-box}',
    '.hz1010-card>*:not(.hz1010-card__ghost){position:relative}',

    /* ---------- Botão copiar ---------- */
    '.hz1010-copy{-webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;gap:8px;width:auto;height:42px;min-width:0;margin:0;padding:0 18px;border:0;border-radius:999px;background:#fff;box-shadow:none;color:#000;font:inherit;font-size:13px;font-weight:600;line-height:1;letter-spacing:0;text-transform:none;white-space:nowrap;cursor:pointer;flex-shrink:0;transition:background-color .15s,color .15s,transform .15s}',
    '.hz1010-copy:hover{background:#ececec}',
    '.hz1010-copy:active{transform:scale(.97)}',
    '.hz1010-copy.is-copied{background:#dcf2e4;color:#0f5132}',
    '.hz1010-copy:focus-visible{outline:2px solid #fff;outline-offset:3px}',

    /* Ícones copiar / copiado */
    '.hz1010-ico{display:block;width:14px;height:14px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
    '.hz1010-ico--check{display:none}',
    '.is-copied .hz1010-ico--copy{display:none}',
    '.is-copied .hz1010-ico--check{display:block}',

    /* ---------- Bloco da PDP (faixa compacta) ---------- */
    '.hz1010-pdp{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px 12px;margin:14px 0;padding:12px 12px 12px 18px;border-radius:14px}',
    '.hz1010-pdp__top{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:0;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.55);font-size:10px;font-weight:600;line-height:1.2;letter-spacing:.18em;text-transform:uppercase;font-variant-numeric:tabular-nums}',
    '.hz1010-pdp__top b{color:#fff;font-weight:700}',
    '.hz1010-pdp__info{min-width:0}',
    '.hz1010-pdp__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 6px;margin:0;color:rgba(255,255,255,.66);font-size:13px;line-height:1.1}',
    '.hz1010-pdp__final{color:#fff;font-size:22px;font-weight:800;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}',
    '.hz1010-pdp__from{display:block;margin:0 0 4px;color:rgba(255,255,255,.55);font-size:12px;line-height:1.2}',
    '.hz1010-pdp__from s{color:rgba(255,255,255,.55)}',
    '.hz1010-steps{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin:0;padding:10px 0 2px;border-top:1px solid rgba(255,255,255,.08);list-style:none;color:rgba(255,255,255,.78);font-size:12px;line-height:1.2}',
    '.hz1010-steps li{display:inline-flex;align-items:center;gap:6px;margin:0;padding:0}',
    '.hz1010-steps i{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:10px;font-style:normal;font-weight:700;line-height:1}',
    '.hz1010-steps .hz1010-step-check{display:none;width:9px;height:9px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}',
    '.hz1010-pdp.is-done .hz1010-step--1 i{background:#3aa66a}',
    '.hz1010-pdp.is-done .hz1010-step--1 .hz1010-step-num{display:none}',
    '.hz1010-pdp.is-done .hz1010-step--1 .hz1010-step-check{display:block}',
    '.hz1010-pdp.is-done .hz1010-step--1 span{color:rgba(255,255,255,.5);text-decoration:line-through}',
    '.hz1010-pdp .hz1010-copy{height:40px;padding:0 14px;gap:8px}',
    '.hz1010-copy__code{padding-right:10px;border-right:1px solid #d9d9d9;font-weight:700;letter-spacing:.14em}',
    '.hz1010-copy.is-copied .hz1010-copy__code{border-right-color:#b5dcc4}',

    '@media (max-width:600px){',
    '.hz1010-pdp{gap:10px;padding:10px 10px 10px 16px;border-radius:12px}',
    '.hz1010-pdp__top{letter-spacing:.14em}',
    '.hz1010-steps{gap:6px 8px;font-size:11px;letter-spacing:-.01em}',
    '.hz1010-steps li{gap:5px}',
    '.hz1010-steps i{width:15px;height:15px;font-size:9px}',
    '.hz1010-pdp__final{font-size:20px}',
    '.hz1010-pdp .hz1010-copy{padding:0 12px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hz1010-copy{transition:none}.hz1010-copy:active{transform:none}}'
  ].join("");


  /* =========================================================
     HTML
  ========================================================= */

  function pdpHTML(state, finalPrice, fromPrice) {

    // Contexto (campanha + prazo) → De/por → como resgatar → ação (copiar)
    var top = comTimer(state)
      ? DOT + '<b>' + (state === "last" ? 'Último dia' : esc(CONFIG.name)) + '</b><span>Termina em <b data-hz1010-timer>--:--:--</b></span>'
      : DOT + '<b>' + esc(CONFIG.name) + '</b><span>Até ' + esc(CONFIG.deadlineLabel) + '</span>';

    var check = '<svg class="hz1010-step-check" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 5.2l2.3 2.3 4.7-4.9"/></svg>';

    function step(n, text) {
      return '<li class="hz1010-step--' + n + '"><i><span class="hz1010-step-num">' + n + '</span>' + (n === 1 ? check : '') + '</i><span>' + text + '</span></li>';
    }

    return '<p class="hz1010-pdp__top">' + top + '</p>' +
      '<div class="hz1010-pdp__info">' +
        '<span class="hz1010-pdp__from">De <s data-hz1010-from>' + formatBRL(fromPrice) + '</s> por</span>' +
        '<p class="hz1010-pdp__line"><strong class="hz1010-pdp__final" data-hz1010-final>' + formatBRL(finalPrice) + '</strong>no Pix</p>' +
      '</div>' +
      '<button type="button" class="hz1010-copy" data-hz1010-copy data-hz1010-loc="pdp" aria-label="Copiar cupom ' + esc(CONFIG.coupon) + '">' +
        '<span class="hz1010-copy__code">' + esc(CONFIG.coupon) + '</span>' + ICONS + '<span class="hz1010-copy-label">Copiar</span>' +
      '</button>' +
      '<ol class="hz1010-steps" aria-label="Como resgatar o desconto">' +
        step(1, "Copie o cupom") +
        step(2, "Cole no carrinho") +
        step(3, "Pague no Pix") +
      '</ol>';
  }


  /* =========================================================
     PREÇO
  ========================================================= */

  function precoCheioPdp(blocoPreco) {

    var cheio = lerPreco(blocoPreco.querySelector(SELETORES.precoCheio));

    if (cheio > 0) {
      return cheio;
    }

    // Sem linha de cartão: o maior preço exibido é o preço cheio
    var maior = NaN;

    var precos = blocoPreco.querySelectorAll(SELETORES.precos);

    for (var i = 0; i < precos.length; i++) {

      var valor = lerPreco(precos[i]);

      if (valor > 0 && !(valor <= maior)) {
        maior = valor;
      }
    }

    return maior;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function pontoDeInsercao(blocoPreco) {

    var form = document.querySelector(SELETORES.form);
    var container = blocoPreco.closest(SELETORES.precoContainer);

    // O preço fica numa coluna de altura fixa, posicionada no topo do form
    // via order:-1. O primeiro filho do form cai logo abaixo do preço.
    if (
      form &&
      container &&
      form.contains(container) &&
      window.getComputedStyle(form).display.indexOf("flex") !== -1 &&
      parseInt(window.getComputedStyle(container).order, 10) < 0
    ) {
      return { pai: form, antes: form.firstChild };
    }

    return { pai: blocoPreco.parentNode, antes: blocoPreco.nextSibling };
  }

  function montarBloco(state) {

    var blocoPreco = document.querySelector(SELETORES.preco);

    if (!blocoPreco || !blocoPreco.parentNode) {
      return;
    }

    var cheio = precoCheioPdp(blocoPreco);

    if (!(cheio > 0)) {
      return;
    }

    var pix = lerPreco(blocoPreco.querySelector(SELETORES.precoPix));

    if (!(pix > 0)) {
      pix = cheio * (1 - DESCONTO_PIX);
    }

    var final = Math.round(pix * (1 - DESCONTO_CUPOM) * 100) / 100;

    var bloco = document.getElementById(ID);

    if (!bloco) {

      bloco = document.createElement("div");

      bloco.id = ID;
      bloco.className = "hz1010-card hz1010-pdp" + (cupomCopiado ? " is-done" : "");

      bloco.setAttribute("aria-label", "Oferta " + CONFIG.name);

      bloco.innerHTML = pdpHTML(state, final, cheio);

    } else {

      // Troca de variação pode alterar o preço nativo
      definirTexto(bloco.querySelector("[data-hz1010-from]"), formatBRL(cheio));
      definirTexto(bloco.querySelector("[data-hz1010-final]"), formatBRL(final));
    }

    var ponto = pontoDeInsercao(blocoPreco);

    if (bloco.parentNode !== ponto.pai) {
      ponto.pai.insertBefore(bloco, ponto.antes);
    }
  }

  // Cupom copiado em qualquer bloco da ação marca o passo 1
  document.addEventListener("hz1010:copiado", function () {

    cupomCopiado = true;

    var bloco = document.getElementById(ID);

    if (bloco) {
      bloco.classList.add("is-done");
    }
  });


  /* =========================================================
     MONTAGEM
  ========================================================= */

  function adicionarEstilo() {

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);
  }

  function montar() {

    var state = estadoAtual();

    if (state === "warmup" && !NO_AQUECIMENTO) {
      state = null;
    }

    // Redesenha quando muda o momento ou quando o timer liga
    var chave = state ? state + (comTimer(state) ? "+timer" : "") : null;

    if (chave !== estadoRenderizado) {

      var antigo = document.getElementById(ID);

      if (antigo) {
        antigo.remove();
      }

      estadoRenderizado = chave;
    }

    if (!state) {
      return;
    }

    adicionarEstilo();

    montarBloco(state);

    atualizarTimer(state);
  }


  /* =========================================================
     TIMER
  ========================================================= */

  function atualizarTimer(state) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var restante =
      Math.max(0, Math.floor((alvoDoTimer(state) - Date.now()) / 1000));

    var texto =
      doisDigitos(Math.floor(restante / 3600)) + ":" +
      doisDigitos(Math.floor(restante % 3600 / 60)) + ":" +
      doisDigitos(restante % 60);

    var timers = bloco.querySelectorAll("[data-hz1010-timer]");

    for (var i = 0; i < timers.length; i++) {
      definirTexto(timers[i], texto);
    }
  }


  /* =========================================================
     COPIAR CUPOM
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

  function copiarCupom(botao) {

    var label = botao.querySelector(".hz1010-copy-label");

    function sucesso() {

      if (label && !label.hasAttribute("data-o")) {
        label.setAttribute("data-o", label.textContent);
      }

      if (label) {
        label.textContent = "Copiado";
      }

      botao.classList.add("is-copied");

      clearTimeout(botao._hz1010Timer);

      botao._hz1010Timer = setTimeout(function () {

        if (label) {
          label.textContent = label.getAttribute("data-o");
        }

        botao.classList.remove("is-copied");

      }, 2200);

      try {

        // Avisa os outros blocos da ação (a PDP marca o passo 1)
        document.dispatchEvent(new CustomEvent("hz1010:copiado"));

        (window.dataLayer = window.dataLayer || []).push({
          event: "hz1010_copiar_cupom",
          hz1010_local: botao.getAttribute("data-hz1010-loc")
        });

      } catch (erro) { }
    }

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {

      navigator.clipboard
        .writeText(CONFIG.coupon)
        .then(sucesso)
        .catch(function () {
          copiarFallback(CONFIG.coupon);
          sucesso();
        });

      return;
    }

    copiarFallback(CONFIG.coupon);

    sucesso();
  }

  document.addEventListener("click", function (event) {

    var botao =
      event.target &&
      event.target.closest &&
      event.target.closest("#" + ID + " [data-hz1010-copy]");

    if (!botao) {
      return;
    }

    event.preventDefault();

    copiarCupom(botao);
  });


  /* =========================================================
     OBSERVER
     Recoloca o bloco após alterações da página (AJAX)
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

    // Atualiza o timer e vira o momento da ação sem recarregar a página
    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
