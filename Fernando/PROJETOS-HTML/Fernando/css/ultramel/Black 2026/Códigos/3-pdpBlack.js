(function () {
  "use strict";

  /* =========================================================
     ULTRAMEL - BLACK 2026
     CÓDIGO 3 - PÁGINA DO PRODUTO
       ULTRAFRIDAY  faixa com o cupom depois do preço; nos kits da
                    Geleia Real, "com o cupom: R$ ..." em cada kit
       ULTRAWEEK    acima do preço: "você economiza R$ X" + relógio
       11.11        Geleia Real: bloco "vida a dois" com depoimentos
       BRINDES      depois do preço: próximo brinde e quanto falta
       SEMPRE       Kits Testosterona: tabela comparando os três
  ========================================================= */

  if (window.__umbfPdpLoaded) {
    return;
  }

  window.__umbfPdpLoaded = true;

  var STYLE_ID = "umbf-pdp-style";

  var CONFIG = {
    cupom: "ULTRAFRIDAY",
    cupomMinimo: 400,
    cupomPercentual: 10,

    // Páginas da Geleia Real que recebem o bloco "vida a dois" no 11/11
    paginasGeleia: ["/geleia-real-pura-liofilizada-9-000mg", "/geleia-real-pura-liofilizada-10-000mg"],

    // Depoimentos que a página da Geleia Real já mostra
    depoimentos: [
      ["Minha energia e a libido melhoraram bastante.", "Marcos F. · compra verificada"],
      ["Com mais disposição, nossa intimidade voltou.", "Beatriz C. · compra verificada"]
    ],

    // false = a tabela dos Kits Testosterona só aparece no 11/11
    tabelaSempre: true,

    kitsTesto: [
      { url: "/kit-testosterona-natural-basic", nome: "Basic" },
      { url: "/kit-testosterona-natural-essencial", nome: "Essencial" },
      { url: "/kit-testosterona-natural-completo", nome: "Completo" }
    ],

    // Linhas da tabela: [item, Basic, Essencial, Completo]. "✓" = tem, "" = não tem
    tabelaLinhas: [
      ["Geleia Real", "", "✓", "✓"],
      ["Mel Cru Branco", "400g", "300g", ""],
      ["Própolis", "Verde 27%", "Vermelho", "Vermelho"],
      ["Pólen 130g", "", "", "✓"],
      ["Camu-Camu", "✓", "", "✓"],
      ["Gengibre em pó", "", "", "✓"]
    ]
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


  /* =========================================================
     CSS
  ========================================================= */

  function injetarCss() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".umbf-pdp{font-family:Montserrat,Arial,sans-serif;box-sizing:border-box;width:100%;clear:both}",
      ".umbf-pdp *{box-sizing:border-box}",
      "#umbf-pdp-save{background:#16120E;color:#fff;border-radius:8px;padding:11px 12px;margin:6px 0 10px;display:flex;flex-direction:column;gap:7px}",
      "#umbf-pdp-save .umbf-ey{display:flex;justify-content:space-between;gap:8px;font-size:11px;font-weight:800;letter-spacing:.08em;color:#F2C85D}",
      "#umbf-pdp-save .umbf-tt{font-size:15px;font-weight:600}",
      "#umbf-pdp-save .umbf-tt b{color:#F2C85D;font-weight:900}",
      ".umbf-clk{display:flex;gap:5px}",
      ".umbf-clk span{background:#fff;color:#16120E;border-radius:4px;padding:3px 6px 2px;min-width:40px;text-align:center;display:flex;flex-direction:column}",
      ".umbf-clk b{font-size:16px;line-height:1.05;font-weight:800;font-variant-numeric:tabular-nums}",
      ".umbf-clk small{font-size:7px;font-weight:700;letter-spacing:.08em}",
      "#umbf-pdp-after{display:flex;flex-direction:column;gap:8px;margin:8px 0 10px}",
      ".umbf-pill{display:flex;flex-direction:column;gap:6px;background:#16120E;color:#fff;border-radius:8px;padding:10px 12px;font-size:13px;line-height:1.35}",
      ".umbf-pill b{color:#F2C85D;font-weight:900}",
      ".umbf-pill small{font-size:12px;opacity:.9}",
      ".umbf-copy{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;border:1px dashed #F2C85D;background:transparent;color:#F2C85D;border-radius:4px;padding:3px 9px;font:800 12px Montserrat,Arial,sans-serif;letter-spacing:.06em;cursor:pointer}",
      ".umbf-copy svg{width:13px;height:13px}",
      ".umbf-gbox{background:#FFF8E6;box-shadow:inset 0 0 0 1px #F0DDB0;border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:7px;color:#222}",
      ".umbf-gbox__t{display:flex;gap:9px;align-items:center;font-size:13px;line-height:1.35}",
      ".umbf-gbox__t svg{width:22px;height:22px;color:#413729;flex:none}",
      ".umbf-gbox__t b{display:block}",
      ".umbf-gbox__mini{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:11px;line-height:1.25;color:#454545;border-top:1px solid #F0DDB0;padding-top:6px;text-align:center}",
      ".umbf-gbox__mini span{display:flex;flex-direction:column}",
      ".umbf-gbox__mini b{color:#222}",
      ".umbf-gbox__mini .ok{color:#2F7A4C}",
      ".umbf-kitline{display:block;margin-top:5px;font-size:10.5px;line-height:1.3;font-weight:700;color:#413729;background:#F2C85D;border-radius:4px;padding:3px 7px;white-space:normal;text-align:left}",
      ".umbf-kitline--m{background:transparent;box-shadow:inset 0 0 0 1px #E0A92A;font-weight:600}",
      "#umbf-pdp-couple{background:#FBEFF3;box-shadow:inset 0 0 0 1px #EBC6D1;border-radius:8px;padding:11px 12px;margin:8px 0;display:flex;flex-direction:column;gap:8px}",
      "#umbf-pdp-couple .umbf-ey{display:flex;justify-content:space-between;font-size:11px;font-weight:800;letter-spacing:.08em;color:#fff;background:#6A1F33;margin:-11px -12px 0;padding:6px 12px;border-radius:8px 8px 0 0}",
      "#umbf-pdp-couple .umbf-tt{font-size:14px;font-weight:800;color:#6A1F33}",
      "#umbf-pdp-couple .umbf-q{display:block;margin:0;background:#fff;border-radius:6px;padding:7px 9px;font-size:13px;line-height:1.35;color:#222}",
      "#umbf-pdp-couple .umbf-q small{display:block;font-size:11px;color:#8C8C8C;margin-top:3px}",
      "#umbf-pdp-table{margin:12px 0}",
      "#umbf-pdp-table h3{font-size:14px;font-weight:800;color:#222;margin:0 0 6px}",
      "#umbf-pdp-table table{width:100%;border-collapse:collapse;font-size:12px;color:#454545}",
      "#umbf-pdp-table th,#umbf-pdp-table td{padding:6px 4px;border-bottom:1px solid #E6E6E6;text-align:center}",
      "#umbf-pdp-table th:first-child,#umbf-pdp-table td:first-child{text-align:left}",
      "#umbf-pdp-table thead th{font-weight:800;color:#222;vertical-align:bottom}",
      "#umbf-pdp-table thead small{display:block;font-size:9px;color:#6A1F33;letter-spacing:.05em}",
      "#umbf-pdp-table .cur{background:#FFF8E6}",
      "#umbf-pdp-table .y{color:#457457;font-weight:800}",
      "#umbf-pdp-table .n{color:#ccc}",
      "#umbf-pdp-table tfoot td{font-weight:800;color:#222;border-bottom:0;white-space:nowrap}",
      "#umbf-pdp-table tfoot a{display:block;font-weight:700;font-size:11px;color:#457457!important}"
    ].join("\n");
    document.head.appendChild(style);
  }


  /* =========================================================
     LEITURA DA PÁGINA
  ========================================================= */

  function caminho() {
    return window.location.pathname.replace(/\/+$/, "").toLowerCase();
  }

  function precoAtual() {
    var el = document.querySelector("#product-price-info .pv-price-sale");
    return el ? reais(el.textContent) : 0;
  }

  function precoDe() {
    var box = document.getElementById("mainBoxPriceOf");
    var el = document.querySelector("#product-price-info .pv-from-price");
    if (!box || !el || getComputedStyle(box).display === "none") return 0;
    return reais(el.textContent);
  }

  // Na Geleia Real, vale o total do kit escolhido
  function precoEscolhido() {
    var total = document.querySelector("[data-etc-summary-total]");
    return total ? reais(total.textContent) : precoAtual();
  }

  function economiaEscolhida() {
    var kit = document.querySelector("[data-etc-summary-saving] strong");
    if (kit) return reais(kit.textContent);
    var de = precoDe(), por = precoAtual();
    return de > por ? de - por : 0;
  }


  /* =========================================================
     BLOCOS
  ========================================================= */

  function blocoEconomia(e) {
    var economia = economiaEscolhida();
    var preco = precoEscolhido();
    if (!economia || !preco) return "";

    // Regra dos 100: acima de R$ 100, reais; abaixo, porcentagem
    var valor = preco + economia >= 100 ? "<b>" + brl(economia) + "</b>" : "<b>" + Math.round(economia / (preco + economia) * 100) + "% OFF</b>";
    var nome = { week: "ULTRAWEEK", wfri: "ULTRA FRIDAY", wknd: "ULTRA WEEKEND", wmon: "ULTRA MONDAY" }[e.fase];
    var prazo = e.fase === "week" ? "ofertas até domingo, 29/11" : "preço válido até 23h59";

    return '<div class="umbf-ey"><span>' + nome + "</span><span>" + prazo + '</span></div><div class="umbf-tt">Você economiza ' + valor + " neste produto</div>" +
      (e.fase === "week" ? "" : relogioBlocos(e.fim, "umbf-clk"));
  }

  function linhaFriday() {
    var preco = precoEscolhido();
    var carrinho = subtotalCarrinho();
    var detalhe;

    if (preco >= CONFIG.cupomMinimo) {
      detalhe = "Com o cupom, este produto sai por <b>" + brl(preco * (1 - CONFIG.cupomPercentual / 100)) + "</b>.";
    } else if (preco + carrinho >= CONFIG.cupomMinimo) {
      detalhe = "Com o que já está no carrinho, seu pedido libera o cupom.";
    } else {
      detalhe = "Com este produto, faltam <b>" + brl(CONFIG.cupomMinimo - preco - carrinho) + "</b> para liberar o cupom.";
    }

    return '<div class="umbf-pill"><span><b>ULTRAFRIDAY</b> · ' + CONFIG.cupomPercentual + "% OFF acima de " + brl(CONFIG.cupomMinimo).replace(",00", "") +
      " com o cupom no pagamento</span>" + botaoCupom(CONFIG.cupom) + "<small>" + detalhe + "</small></div>";
  }

  function linhaBrinde() {
    var total = precoEscolhido() + subtotalCarrinho();
    var idx = faixaAtingida(total);
    var prox = FAIXAS[idx + 1];
    var titulo, sub;

    if (idx < 0) {
      titulo = "Ganhe " + FAIXAS[0].nome;
      sub = "Com este produto, faltam " + brl(FAIXAS[0].valor - total);
    } else if (prox) {
      titulo = "Com este produto, seu pedido ganha " + nomeGanho(idx);
      sub = "Faltam " + brl(prox.valor - total) + (BRINDES_ACUMULAM ? " para ganhar também: " : " para a faixa de cima: ") + prox.nome;
    } else {
      titulo = "Com este produto, seu pedido ganha " + nomeGanho(idx);
      sub = "Você chegou à última faixa de brinde.";
    }

    var mini = FAIXAS.map(function (f, i) {
      return '<span class="' + (i <= idx ? "ok" : "") + '"><b>' + brl(f.valor).replace(",00", "") + "</b>" + f.nome + "</span>";
    }).join("");

    return '<div class="umbf-gbox"><div class="umbf-gbox__t">' + ICONE_PRESENTE + "<span><b>" + titulo + "</b>" + sub + '</span></div><div class="umbf-gbox__mini">' + mini + "</div></div>";
  }

  function blocoCasal() {
    return '<div class="umbf-ey"><span>11.11 ULTRALIBIDO</span><span>só hoje</span></div><div class="umbf-tt">♥ Mais disposição para a vida a dois</div>' +
      CONFIG.depoimentos.map(function (d) { return '<p class="umbf-q">“' + d[0] + "”<small>" + d[1] + "</small></p>"; }).join("");
  }

  var precosTesto = null;

  function carregarPrecosTesto(depois) {
    try {
      var cache = JSON.parse(window.sessionStorage.getItem("umbf-testo") || "null");
      if (cache && Date.now() - cache.t < HORA) { precosTesto = cache.p; depois(); return; }
    } catch (erro) { }

    var pendentes = CONFIG.kitsTesto.length, precos = {};

    CONFIG.kitsTesto.forEach(function (k) {
      fetch(k.url, { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (html) {
        var m = html.match(/pv-price-sale[^>]*>\s*([^<]+)</);
        precos[k.url] = m ? reais(m[1]) : 0;
      }).catch(function () { precos[k.url] = 0; }).then(function () {
        pendentes--;
        if (pendentes) return;
        precosTesto = precos;
        try { window.sessionStorage.setItem("umbf-testo", JSON.stringify({ t: Date.now(), p: precos })); } catch (erro) { }
        depois();
      });
    });
  }

  function blocoTabela() {
    var atual = caminho();
    var cab = CONFIG.kitsTesto.map(function (k) {
      return "<th" + (k.url === atual ? ' class="cur"' : "") + ">" + k.nome + (k.url === atual ? "<small>VOCÊ ESTÁ AQUI</small>" : "") + "</th>";
    }).join("");

    var linhas = CONFIG.tabelaLinhas.map(function (l) {
      return "<tr><td>" + l[0] + "</td>" + CONFIG.kitsTesto.map(function (k, i) {
        var v = l[i + 1], cls = k.url === atual ? "cur" : "";
        var cel = v === "✓" ? '<span class="y">✓</span>' : (v ? v : '<span class="n">—</span>');
        return '<td class="' + cls + '">' + cel + "</td>";
      }).join("") + "</tr>";
    }).join("");

    var pe = CONFIG.kitsTesto.map(function (k) {
      var p = precosTesto && precosTesto[k.url] ? brl(precosTesto[k.url]) : "";
      if (k.url === atual) p = brl(precoAtual());
      return "<td" + (k.url === atual ? ' class="cur"' : "") + ">" + p + (k.url === atual ? "" : '<a href="' + k.url + '">ver este kit</a>') + "</td>";
    }).join("");

    return "<h3>Compare os 3 kits</h3><table><thead><tr><th></th>" + cab + "</tr></thead><tbody>" + linhas + "</tbody><tfoot><tr><td></td>" + pe + "</tr></tfoot></table>";
  }


  /* =========================================================
     RENDER
  ========================================================= */

  function colocar(id, html, antesDe, dentroDe) {
    var el = document.getElementById(id);
    if (!html) {
      if (el) el.parentNode.removeChild(el);
      return;
    }
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = "umbf-pdp";
      if (antesDe) antesDe.parentNode.insertBefore(el, antesDe);
      else if (dentroDe) dentroDe.appendChild(el);
      else return;
    }
    if (el.getAttribute("data-html") !== html) {
      el.setAttribute("data-html", html);
      el.innerHTML = html;
    }
  }

  function linhasKits(e) {
    var cards = document.querySelectorAll(".etc-kit-card");
    for (var i = 0; i < cards.length; i++) {
      var main = cards[i].querySelector(".etc-kit-main");
      var linha = cards[i].querySelector(".umbf-kitline");
      var html = "";

      if (ehFriday(e.fase) && main) {
        var preco = reais((cards[i].querySelector(".etc-kit-price") || {}).textContent);
        html = preco >= CONFIG.cupomMinimo
          ? "com cupom: " + brl(preco * (1 - CONFIG.cupomPercentual / 100))
          : "+ " + brl(CONFIG.cupomMinimo - preco) + " libera o cupom";
      }

      // Só mexe no DOM quando muda, para o observer não entrar em laço
      if (linha && linha.getAttribute("data-html") === html) continue;
      if (linha) linha.parentNode.removeChild(linha);
      if (!html) continue;

      var span = document.createElement("span");
      span.className = "umbf-kitline" + (html.indexOf("libera") > -1 ? " umbf-kitline--m" : "");
      span.setAttribute("data-html", html);
      span.innerHTML = html;
      main.appendChild(span);
    }
  }

  function render() {

    var info = document.getElementById("product-price-info");
    var precoBox = document.querySelector("#product-price-info .product-price-container");
    if (!info || !precoBox) return;

    var e = estado();
    var path = caminho();

    // Acima do preço: economia da ULTRAWEEK
    colocar("umbf-pdp-save", ehSemana(e.fase) ? blocoEconomia(e) : "", info);

    // Depois do preço: cupom e brindes
    var depois = (ehFriday(e.fase) ? linhaFriday() : "") + (e.brinde ? linhaBrinde() : "");
    var ancoraDepois = precoBox.nextElementSibling;
    colocar("umbf-pdp-after", depois, ancoraDepois, precoBox.parentNode);

    linhasKits(e);

    // 11/11 na Geleia Real: entre o título e o preço
    var ehGeleia = CONFIG.paginasGeleia.indexOf(path) > -1;
    colocar("umbf-pdp-couple", e.fase === "lib" && ehGeleia ? blocoCasal() : "", null, document.querySelector(".pdp-slot--2"));

    // Kits Testosterona
    var ehTesto = CONFIG.kitsTesto.some(function (k) { return k.url === path; });
    if (ehTesto && (CONFIG.tabelaSempre || e.fase === "lib")) {
      if (!precosTesto) { carregarPrecosTesto(render); }
      colocar("umbf-pdp-table", blocoTabela(), null, document.querySelector(".pdp-slot--5"));
    } else {
      colocar("umbf-pdp-table", "", null, null);
    }
  }

  var agendado = false;

  function agendar() {
    if (agendado) return;
    agendado = true;
    window.setTimeout(function () { agendado = false; render(); }, 60);
  }

  function iniciar() {
    if (document.body.id !== "page-product-detail") return;
    injetarCss();
    ligarRelogio();
    ligarCopiar();
    render();

    // Troca de kit na Geleia Real
    document.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest(".etc-kit-card, .etc-kit-upgrade")) agendar();
    });

    if (window.jQuery) window.jQuery(document).on("uoou-cart-data-changed uoou-cart-add", agendar);

    // Garante o subtotal do carrinho para as contas de "faltam R$"
    try { if (!Uoou.cart.getData()) Uoou.cart.reload(agendar); } catch (erro) { }

    new MutationObserver(function (lista) {
      for (var i = 0; i < lista.length; i++) {
        var alvo = lista[i].target;
        if (alvo.closest && alvo.closest(".umbf-pdp, .umbf-kitline")) continue;
        agendar();
        return;
      }
    }).observe(document.getElementById("product-price-info") || document.body, { childList: true, subtree: true });

    window.setInterval(render, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
