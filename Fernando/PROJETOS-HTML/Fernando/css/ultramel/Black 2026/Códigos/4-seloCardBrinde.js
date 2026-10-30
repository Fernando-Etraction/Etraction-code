(function () {
  "use strict";

  /* =========================================================
     ULTRAMEL - BLACK 2026
     CÓDIGO 4 - ETIQUETA DE BRINDE NOS CARDS
     Vitrines, categorias e busca. Durante os brindes, cada card que
     sozinho já passa de uma faixa ganha "Ganha própolis + pegador"
     (ou a garrafa, ou a ecobag) logo abaixo do preço. Se faltar pouco
     para a próxima faixa, aparece uma segunda linha.
  ========================================================= */

  if (window.__umbfCardLoaded) {
    return;
  }

  window.__umbfCardLoaded = true;

  var TAG_CLASS = "umbf-tag";
  var STYLE_ID = "umbf-tag-style";

  var CONFIG = {
    // Mostra "faltam R$ X para..." quando a diferença for até este valor
    faltaPouco: 60
  };

  /* =========================================================
     AGENDA DA BLACK (horário de Brasília) - igual nos 5 códigos
     Detalhes e preview (?umbf=...) no topo do código 1.
     Ao mudar uma data, mudar nos 5 códigos.
  ========================================================= */

  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, (hora || 0) + 3, 0, 0);
  }

  var HORA = 3600000;
  var DIA = 24 * HORA;

  var FASES = [
    { id: "lib-aviso", inicio: brasilia(2026, 11, 10), fim: brasilia(2026, 11, 11) },
    { id: "lib", inicio: brasilia(2026, 11, 11), fim: brasilia(2026, 11, 12) },
    { id: "week", inicio: brasilia(2026, 11, 23), fim: brasilia(2026, 11, 27) },
    { id: "wfri", inicio: brasilia(2026, 11, 27), fim: brasilia(2026, 11, 28) },
    { id: "wknd", inicio: brasilia(2026, 11, 28), fim: brasilia(2026, 11, 30) },
    { id: "wmon", inicio: brasilia(2026, 11, 30), fim: brasilia(2026, 12, 1) }
  ];

  var SEXTAS = [brasilia(2026, 10, 30), brasilia(2026, 11, 6), brasilia(2026, 11, 13), brasilia(2026, 11, 20)];
  var AVISO_HORAS_ANTES = 12;

  // Brindes por faixa: preencher quando a cliente confirmar o período.
  var BRINDES = { inicio: null, fim: null };

  var PREVIEW_KEY = "umbf-preview";
  var PREVIEW_FIM = { "fri": 2 * DIA + 5 * HORA, "fri-dom": 5 * HORA + 42 * 60000, "fri-aviso": 5 * HORA, "lib-aviso": 5 * HORA, "lib": 5 * HORA + 42 * 60000, "week": 2 * DIA, "wfri": 5 * HORA + 42 * 60000, "wknd": DIA + 5 * HORA, "wmon": 5 * HORA + 42 * 60000 };

  function lerPreview() {
    var valor = null;
    try {
      var param = new URLSearchParams(window.location.search).get("umbf");
      if (param === "off") { window.sessionStorage.removeItem(PREVIEW_KEY); return null; }
      if (param) { window.sessionStorage.setItem(PREVIEW_KEY, param); }
      valor = window.sessionStorage.getItem(PREVIEW_KEY);
    } catch (erro) { }
    if (!valor) return null;
    var partes = valor.split(/[+ ,]/), fase = null, brinde = false;
    for (var i = 0; i < partes.length; i++) {
      if (partes[i] === "gift") brinde = true;
      else if (PREVIEW_FIM[partes[i]]) fase = partes[i];
    }
    var inicio = Date.now();
    try {
      var guardado = Number(window.sessionStorage.getItem(PREVIEW_KEY + "-t"));
      if (guardado && Date.now() - guardado < 6 * HORA) inicio = guardado;
      else window.sessionStorage.setItem(PREVIEW_KEY + "-t", String(inicio));
    } catch (erro) { }
    return { fase: fase, fim: fase ? inicio + PREVIEW_FIM[fase] : null, brinde: brinde, preview: true };
  }

  var PREVIEW = lerPreview();

  function estado() {
    if (PREVIEW) return PREVIEW;
    var agora = Date.now(), fase = null, fim = null, i;
    for (i = 0; i < FASES.length; i++) {
      if (agora >= FASES[i].inicio && agora < FASES[i].fim) { fase = FASES[i].id; fim = FASES[i].fim; }
    }
    for (i = 0; !fase && i < SEXTAS.length; i++) {
      var sexta = SEXTAS[i];
      if (agora >= sexta && agora < sexta + 3 * DIA) { fase = agora >= sexta + 2 * DIA ? "fri-dom" : "fri"; fim = sexta + 3 * DIA; }
      else if (agora >= sexta - AVISO_HORAS_ANTES * HORA && agora < sexta) { fase = "fri-aviso"; fim = sexta; }
    }
    var brinde = !!(BRINDES.inicio && BRINDES.fim && agora >= BRINDES.inicio && agora < BRINDES.fim);
    return { fase: fase, fim: fim, brinde: brinde };
  }

  var ehSemana = function (f) { return f === "week" || f === "wfri" || f === "wknd" || f === "wmon"; };
  var ehFriday = function (f) { return f === "fri" || f === "fri-dom"; };


  /* =========================================================
     UTILITÁRIOS (relógio, copiar, preço, faixas de brinde)
  ========================================================= */

  function reais(txt) {
    var n = String(txt || "").replace(/[^\d,]/g, "").replace(",", ".");
    return n ? parseFloat(n) : 0;
  }

  function brl(v) {
    var p = (Math.round(v * 100) / 100).toFixed(2).split(".");
    return "R$ " + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + p[1];
  }

  function subtotalCarrinho() {
    try { return (window.Uoou && Uoou.cart && Uoou.cart.getSubTotal ? Number(Uoou.cart.getSubTotal()) || 0 : 0) / 100; }
    catch (erro) { return 0; }
  }

  function duasCasas(n) { return (n < 10 ? "0" : "") + n; }

  function partesTempo(fim) {
    var s = Math.floor(Math.max(0, fim - Date.now()) / 1000);
    return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60];
  }

  function textoTempo(fim) {
    var p = partesTempo(fim);
    return duasCasas(p[0]) + ":" + duasCasas(p[1]) + ":" + duasCasas(p[2]);
  }

  function relogioBlocos(fim, cls) {
    var p = partesTempo(fim);
    return '<div class="' + cls + '" data-umbf-fim="' + fim + '" data-umbf-fmt="blocos">' +
      "<span><b>" + duasCasas(p[0]) + "</b><small>HORAS</small></span>" +
      "<span><b>" + duasCasas(p[1]) + "</b><small>MIN</small></span>" +
      "<span><b>" + duasCasas(p[2]) + "</b><small>SEG</small></span></div>";
  }

  function ligarRelogio() {
    if (window.__umbfRelogio) return;
    window.__umbfRelogio = window.setInterval(function () {
      var lista = document.querySelectorAll("[data-umbf-fim]");
      for (var i = 0; i < lista.length; i++) {
        var el = lista[i], fim = Number(el.getAttribute("data-umbf-fim"));
        if (el.getAttribute("data-umbf-fmt") === "blocos") {
          var p = partesTempo(fim), b = el.querySelectorAll("b");
          for (var j = 0; j < b.length && j < 3; j++) b[j].textContent = duasCasas(p[j]);
        } else {
          el.textContent = textoTempo(fim);
        }
      }
    }, 1000);
  }

  function ligarCopiar() {
    if (window.__umbfCopiar) return;
    window.__umbfCopiar = true;
    document.addEventListener("click", function (evento) {
      var botao = evento.target.closest ? evento.target.closest(".umbf-copy") : null;
      if (!botao) return;
      evento.preventDefault();
      evento.stopPropagation();
      var codigo = botao.getAttribute("data-code"), rotulo = botao.querySelector(".umbf-copy__txt");
      function avisar() {
        if (!rotulo) return;
        rotulo.textContent = "copiado";
        window.setTimeout(function () { rotulo.textContent = codigo; }, 1800);
      }
      try { navigator.clipboard.writeText(codigo).then(avisar, avisar); } catch (erro) { avisar(); }
    }, true);
  }

  var ICONE_COPIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var ICONE_PRESENTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="6.8" width="18" height="3.6" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 6.8V20M12 6.8C10.6 3.6 7 3.3 7 5.5 7 6.8 12 6.8 12 6.8zm0 0c1.4-3.2 5-3.5 5-1.3 0 1.3-5 1.3-5 1.3z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  var ICONE_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function botaoCupom(codigo) {
    return '<button type="button" class="umbf-copy" data-code="' + codigo + '" aria-label="Copiar o cupom ' + codigo + '"><span class="umbf-copy__txt">' + codigo + "</span>" + ICONE_COPIAR + "</button>";
  }

  // Faixas de brinde. acumula: o pedido acima de R$ 699 leva os três? (confirmar)
  var FAIXAS = [
    { valor: 299, nome: "própolis + pegador" },
    { valor: 499, nome: "garrafa térmica" },
    { valor: 699, nome: "ecobag" }
  ];
  var BRINDES_ACUMULAM = false;

  // Índice da maior faixa atingida (-1 = nenhuma)
  function faixaAtingida(valor) {
    var idx = -1;
    for (var i = 0; i < FAIXAS.length; i++) if (valor >= FAIXAS[i].valor) idx = i;
    return idx;
  }

  function nomeGanho(idx) {
    if (idx < 0) return "";
    if (!BRINDES_ACUMULAM) return FAIXAS[idx].nome;
    var nomes = [];
    for (var i = 0; i <= idx; i++) nomes.push(FAIXAS[i].nome);
    return nomes.join(", ");
  }


  function injetarCss() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".umbf-tag{display:flex;gap:5px;align-items:center;justify-content:center;background:#FFF8E6;color:#413729;box-shadow:inset 0 0 0 1px #F0DDB0;border-radius:4px;padding:4px 6px;margin:5px auto 2px;font:700 11px/1.25 Montserrat,Arial,sans-serif;text-align:left;max-width:100%}",
      ".umbf-tag svg{width:15px;height:15px;flex:none}",
      ".umbf-tag small{display:block;font-weight:500;font-size:10px;color:#454545}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function etiqueta(preco) {
    var idx = faixaAtingida(preco);
    if (idx < 0) return "";
    var prox = FAIXAS[idx + 1];
    var falta = prox ? prox.valor - preco : 0;
    var sub = prox && falta <= CONFIG.faltaPouco ? "<small>faltam " + brl(falta) + " p/ " + prox.nome + "</small>" : "";
    return ICONE_PRESENTE + "<span>Ganha " + nomeGanho(idx) + sub + "</span>";
  }

  function render() {
    var e = estado();
    var cards = document.querySelectorAll(".product .product-list-info");

    for (var i = 0; i < cards.length; i++) {
      var info = cards[i];
      var tag = info.querySelector("." + TAG_CLASS);
      var html = "";

      if (e.brinde) {
        var preco = info.querySelector(".box-price-to .to-price") || info.querySelector(".to-price");
        html = preco ? etiqueta(reais(preco.textContent)) : "";
      }

      if (tag && tag.getAttribute("data-html") === html) continue;
      if (tag) tag.parentNode.removeChild(tag);
      if (!html) continue;

      var precoBox = info.querySelector(".price");
      if (!precoBox) continue;

      tag = document.createElement("div");
      tag.className = TAG_CLASS;
      tag.setAttribute("data-html", html);
      tag.innerHTML = html;
      precoBox.parentNode.insertBefore(tag, precoBox.nextSibling);
    }
  }

  var agendado = false;

  function agendar() {
    if (agendado) return;
    agendado = true;
    window.setTimeout(function () { agendado = false; render(); }, 120);
  }

  function iniciar() {
    injetarCss();
    render();
    // Vitrines carregadas depois (carrosséis, paginação, filtros)
    new MutationObserver(function (lista) {
      for (var i = 0; i < lista.length; i++) {
        var alvo = lista[i].target;
        if (alvo.closest && alvo.closest("." + TAG_CLASS)) continue;
        if (lista[i].addedNodes.length === 1 && lista[i].addedNodes[0].className === TAG_CLASS) continue;
        agendar();
        return;
      }
    }).observe(document.body, { childList: true, subtree: true });
    window.setInterval(render, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
