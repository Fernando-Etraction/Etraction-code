(function () {
  "use strict";

  /* =========================================================
     HITZZ - AÇÃO 10.10
     CUPOM COM CARROSSEL E TIMER NOS PRODUTOS - MODELO 02
     Barra preta com botão branco "Copiar cupom"
     Usar no lugar do cupomCarrossel.js (não instalar os dois)
     Faixa entre o nome e o preço de todos os cards de produto,
     alternando o cupom e o tempo que falta. Clicar copia o cupom.
  ========================================================= */

  if (window.__hz1010CupomCardLoaded) {
    return;
  }

  window.__hz1010CupomCardLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    coupon: "1010",
    couponLabel: "10% OFF",

    // Segundos que cada mensagem fica na tela
    slideSeconds: 3
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

  var SELETORES = {
    card: ".product",
    info: ".product-list-info",
    preco: ".price"
  };

  var STYLE_ID = "hz1010-cupom-card-style";
  var CLASSE = "hz1010-cc";

  var ativoRenderizado = null;
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

  function ofertaAberta() {

    // No aquecimento o cupom ainda não é revelado
    var momento = momentoDaAcao();

    return momento === "active" || momento === "last";
  }


  /* =========================================================
     CSS
  ========================================================= */

  var CICLO = CONFIG.slideSeconds * 2;

  // Os seletores internos levam ".hz1010-cc" na frente de propósito: nas vitrines
  // em carrossel a loja tem ".owl-item span{font-size:14px}", que ganharia de uma classe só
  var CSS = [
    /* Barra preta fixa: texto que alterna à esquerda e botão branco "Copiar cupom" à direita.
       Largura explícita: um <button> não estica sozinho quando o card não é flex */
    '.hz1010-cc{-webkit-appearance:none;appearance:none;position:relative;display:flex;align-items:center;box-sizing:border-box;flex:0 0 auto;align-self:stretch;width:calc(100% - 4px);max-width:none;min-width:0;height:34px;margin:4px 2px 8px;padding:0 4px 0 0;overflow:hidden;container-type:inline-size;border:0;border-radius:8px;background:#111;box-shadow:none;color:#fff;font:inherit;font-size:12px;font-weight:500;line-height:1;letter-spacing:.01em;text-transform:none;text-align:left;cursor:pointer;transition:background-color .15s;-webkit-font-smoothing:antialiased}',
    '.hz1010-cc *{box-sizing:border-box}',
    '.hz1010-cc:hover{background:#000}',
    '.hz1010-cc:focus-visible{outline:2px solid #e5262e;outline-offset:2px}',

    /* Miolo: só aqui o conteúdo alterna, uma mensagem sobe e a outra entra por baixo */
    '.hz1010-cc .hz1010-cc__view{font-size:inherit;line-height:1;letter-spacing:inherit;position:relative;align-self:stretch;flex:1 1 auto;min-width:0;overflow:hidden}',
    '.hz1010-cc .hz1010-cc__slide{font-size:inherit;line-height:1;letter-spacing:inherit;position:absolute;top:0;left:0;display:flex;align-items:center;gap:5px;width:100%;height:100%;padding:0 6px 0 12px;color:#fff;white-space:nowrap}',
    '.hz1010-cc .hz1010-cc__slide b{color:#fff;font-weight:800}',
    '.hz1010-cc .hz1010-cc__slide--a{animation:hz1010-cc-a ' + CICLO + 's ease-in-out infinite}',
    '.hz1010-cc .hz1010-cc__slide--b{animation:hz1010-cc-b ' + CICLO + 's ease-in-out infinite}',
    '.hz1010-cc .hz1010-cc__code{font-size:14px;line-height:1;letter-spacing:.1em}',
    '.hz1010-cc .hz1010-cc__slide .hz1010-cc__off{color:#ff5a61;font-size:inherit;line-height:1;letter-spacing:inherit}',
    '.hz1010-cc .hz1010-cc__sep{color:rgba(255,255,255,.4);font-size:inherit;line-height:1}',
    '.hz1010-cc .hz1010-cc__sm{display:none}',
    '.hz1010-cc .hz1010-cc__soft{color:rgba(255,255,255,.7);font-size:inherit;line-height:1;letter-spacing:inherit}',
    '.hz1010-cc .hz1010-cc__time,.hz1010-cc .hz1010-cc__sec{font-size:inherit;line-height:1;letter-spacing:inherit;font-variant-numeric:tabular-nums}',

    '@keyframes hz1010-cc-a{0%,42%{transform:translateY(0);opacity:1}50%{transform:translateY(-100%);opacity:0}50.01%,92%{transform:translateY(100%);opacity:0}100%{transform:translateY(0);opacity:1}}',
    '@keyframes hz1010-cc-b{0%,42%{transform:translateY(100%);opacity:0}50%,92%{transform:translateY(0);opacity:1}100%{transform:translateY(-100%);opacity:0}}',

    /* Botão "Copiar cupom" */
    '.hz1010-cc .hz1010-cc__copy{display:flex;align-items:center;justify-content:center;flex:0 0 auto;height:26px;padding:0 12px;border-radius:999px;background:#fff;color:#111;font-size:11px;font-weight:700;line-height:1;letter-spacing:.01em;white-space:nowrap}',

    /* Aviso de cupom copiado: cobre a barra por alguns segundos */
    '.hz1010-cc .hz1010-cc__ok{position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center;gap:5px;width:100%;height:100%;background:#1f7a4d;color:#fff;font-size:inherit;font-weight:700;line-height:1}',
    '.hz1010-cc.is-copied .hz1010-cc__ok{display:flex}',

    '@media (max-width:600px){',
    '.hz1010-cc{width:100%;height:32px;margin:3px 0 6px;font-size:10px;letter-spacing:0}',
    '}',

    /* Card estreito: sai "com o cupom" (entra um ponto no lugar) e o botão encolhe */
    '@container (max-width:270px){.hz1010-cc .hz1010-cc__lg{display:none}.hz1010-cc .hz1010-cc__sm{display:inline}.hz1010-cc .hz1010-cc__slide{padding:0 4px 0 10px}.hz1010-cc .hz1010-cc__copy{padding:0 9px;font-size:10px}}',

    /* Card de celular (2 por linha): aperta os espaços e esconde os segundos do timer */
    '@container (max-width:200px){.hz1010-cc .hz1010-cc__slide{gap:3px;padding:0 2px 0 8px}.hz1010-cc .hz1010-cc__code{font-size:12px;letter-spacing:.04em}.hz1010-cc .hz1010-cc__copy{height:24px;padding:0 7px;font-size:9px;letter-spacing:0}.hz1010-cc .hz1010-cc__sec{display:none}}',

    /* Sem timer, a mensagem do cupom fica parada */
    '.hz1010-cc.hz1010-cc--sem-timer .hz1010-cc__slide--a{animation:none}',

    /* Sem animação: fica só a mensagem do cupom */
    '@media (prefers-reduced-motion:reduce){.hz1010-cc{transition:none}.hz1010-cc .hz1010-cc__slide{animation:none}.hz1010-cc .hz1010-cc__slide--b{display:none}}'
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
     FAIXA
  ========================================================= */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function criarFaixa() {

    var faixa = document.createElement("button");

    faixa.type = "button";
    faixa.className = CLASSE + (timerLigado() ? "" : " hz1010-cc--sem-timer");

    faixa.setAttribute("aria-label", "Copiar cupom " + CONFIG.coupon + ": " + CONFIG.couponLabel);

    faixa.innerHTML =
      '<span class="hz1010-cc__view">' +
        '<span class="hz1010-cc__slide hz1010-cc__slide--a">' +
          '<b class="hz1010-cc__off">' + esc(CONFIG.couponLabel) + '</b><span class="hz1010-cc__soft hz1010-cc__lg">com o cupom</span><span class="hz1010-cc__sep hz1010-cc__sm">·</span><b class="hz1010-cc__code">' + esc(CONFIG.coupon) + '</b>' +
        '</span>' +
        (timerLigado()
          ? '<span class="hz1010-cc__slide hz1010-cc__slide--b" aria-hidden="true">' +
              '<span class="hz1010-cc__soft">Faltam</span><b class="hz1010-cc__time" data-hz1010-cc-timer></b>' +
            '</span>'
          : '') +
      '</span>' +
      '<span class="hz1010-cc__copy" aria-hidden="true">Copiar cupom</span>' +
      '<span class="hz1010-cc__ok" aria-hidden="true">Cupom copiado ✓</span>';

    return faixa;
  }

  function removerFaixas() {

    var faixas = document.querySelectorAll("." + CLASSE);

    for (var i = 0; i < faixas.length; i++) {
      faixas[i].remove();
    }
  }

  function aplicar() {

    var aberta = ofertaAberta();

    // Redesenha quando a oferta abre/fecha ou quando o timer liga
    var chave = aberta ? "aberta" + (timerLigado() ? "+timer" : "") : null;

    if (chave !== ativoRenderizado) {
      removerFaixas();
      ativoRenderizado = chave;
    }

    if (!aberta) {
      return;
    }

    adicionarEstilo();

    var cards = document.querySelectorAll(SELETORES.card);

    for (var i = 0; i < cards.length; i++) {

      var info = cards[i].querySelector(SELETORES.info);
      var preco = info && info.querySelector(SELETORES.preco);

      // Entre o nome e o preço; um por card
      if (!preco || info.querySelector("." + CLASSE)) {
        continue;
      }

      var faixa = criarFaixa();

      // A loja ordena nome e preço com "order" no flex: a faixa pega a
      // mesma ordem do preço para cair logo acima dele
      faixa.style.order = window.getComputedStyle(preco).order;

      preco.parentNode.insertBefore(faixa, preco);
    }

    atualizarTimer();
  }


  /* =========================================================
     TIMER
     Com mais de 24h mostra dias e esconde os segundos
  ========================================================= */

  function doisDigitos(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function atualizarTimer() {

    var restante = Math.max(0, Math.floor((proximaVirada(24) - Date.now()) / 1000));

    var dias = Math.floor(restante / 86400);
    var horas = doisDigitos(Math.floor(restante % 86400 / 3600)) + "h ";
    var minutos = doisDigitos(Math.floor(restante % 3600 / 60)) + "m";

    var html = dias > 0
      ? dias + "d " + horas + minutos
      : horas + minutos + '<span class="hz1010-cc__sec"> ' + doisDigitos(restante % 60) + 's</span>';

    var timers = document.querySelectorAll("[data-hz1010-cc-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i]._hz1010Html !== html) {
        timers[i]._hz1010Html = html;
        timers[i].innerHTML = html;
      }
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

  function copiarCupom(faixa) {

    function sucesso() {

      faixa.classList.add("is-copied");

      clearTimeout(faixa._hz1010Timer);

      faixa._hz1010Timer = setTimeout(function () {
        faixa.classList.remove("is-copied");
      }, 2200);

      try {

        // Avisa os outros blocos da ação (a PDP marca o passo 1)
        document.dispatchEvent(new CustomEvent("hz1010:copiado"));

        (window.dataLayer = window.dataLayer || []).push({
          event: "hz1010_copiar_cupom",
          hz1010_local: "card"
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

    var faixa =
      event.target &&
      event.target.closest &&
      event.target.closest("." + CLASSE);

    if (!faixa) {
      return;
    }

    // O clique copia o cupom e não abre o produto
    event.preventDefault();
    event.stopPropagation();

    copiarCupom(faixa);

  }, true);


  /* =========================================================
     OBSERVER
     Cobre produtos carregados depois (paginação, filtros, vitrines)
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

        aplicar();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    aplicar();

    iniciarObserver();

    // Atualiza o timer e abre/encerra a faixa sem recarregar a página
    setInterval(aplicar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
