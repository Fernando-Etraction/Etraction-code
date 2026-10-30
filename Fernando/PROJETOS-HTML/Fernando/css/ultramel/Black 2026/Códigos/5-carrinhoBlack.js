(function () {
  "use strict";

  /* =========================================================
     ULTRAMEL - BLACK 2026
     CÓDIGO 5 - CARRINHO (lateral e página /cart/)
       ULTRAFRIDAY  régua "faltam R$ X para 10% OFF" (marca do frete
                    em R$ 500); na página do carrinho, prateleira de
                    complementos baratos para fechar os R$ 400
       BRINDES      escada com os três brindes; aviso antes de remover
                    um item e cair de faixa (uma vez por visita)
       ULTRAWEEK    resumo com o total economizado, brinde e frete, e
                    o valor dentro do botão de finalizar
  ========================================================= */

  if (window.__umbfCartLoaded) {
    return;
  }

  window.__umbfCartLoaded = true;

  var STYLE_ID = "umbf-cart-style";

  var CONFIG = {
    cupom: "ULTRAFRIDAY",
    cupomMinimo: 400,
    cupomPercentual: 10,
    freteFixoMinimo: 500,

    // Complementos da prateleira "feche os R$ 400" (definir com a cliente)
    complementos: [
      { url: "/propolis-verde-27-base-alcool-de-cereais-30ml", id: "OFZqTXptRDNsUT09", nome: "Própolis Verde 27% - 30ml" },
      { url: "/tamara-jumbo-medjoul-gold-label-220g", id: "OFZqT3lXenluQT09", nome: "Tâmara Medjoul 220g" },
      { url: "/bala-de-gengibre-da-amazonia-com-propolis-e-mel", id: "OFZqTXptRDlsQT09", nome: "Bala de Gengibre com Própolis" }
    ],

    imgPropolis: "https://adaptive-images.uooucdn.com.br/tr:w-60,h-100,c-at_max,q-80/a22571-ogxytxlxut0/pv/00/db/6e/e5f7707cd02ff2a988c2984999.jpg",
    imgPegador: "https://adaptive-images.uooucdn.com.br/tr:w-40,h-100,c-at_max,q-80/a22571-ogxytxlxut0/pv/d1/bc/af/fc5c3f4eac28bdab94216597bd.jpg"
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
      ".umbf-c{font-family:Montserrat,Arial,sans-serif;box-sizing:border-box}",
      ".umbf-c *{box-sizing:border-box}",
      "html.umbf-cart-fri #frete-dinamico-banner{display:none!important}",
      ".umbf-ctop{display:flex;flex-direction:column;gap:8px;margin:10px 0}",
      ".umbf-regua{border-radius:8px;background:#16120E;color:#fff;padding:10px 12px 8px}",
      ".umbf-regua__t{display:flex;flex-direction:column;gap:2px;font-size:13px}",
      ".umbf-regua__t b{color:#F2C85D;font-weight:800}",
      ".umbf-regua__t span{font-size:11px;opacity:.85}",
      ".umbf-regua__bar{position:relative;height:7px;border-radius:4px;background:rgba(255,255,255,.2);margin:10px 0 4px}",
      ".umbf-regua__bar i{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#F2C85D}",
      ".umbf-regua__bar u{position:absolute;top:-3px;width:2px;height:13px;background:#fff}",
      ".umbf-regua__scale{position:relative;height:24px;font-size:10px}",
      ".umbf-regua__scale span{position:absolute;top:0;transform:translateX(-100%);text-align:right;line-height:1.2;white-space:nowrap}",
      ".umbf-regua__scale b{display:block;font-size:11px}",
      ".umbf-regua .umbf-copy{display:inline-flex;align-items:center;gap:6px;border:1px dashed #F2C85D;background:transparent;color:#F2C85D;border-radius:4px;padding:3px 9px;font:800 12px Montserrat,Arial,sans-serif;letter-spacing:.06em;cursor:pointer;margin-top:6px;align-self:flex-start}",
      ".umbf-regua .umbf-copy svg{width:13px;height:13px}",
      ".umbf-lad{border-radius:9px;background:#FFF8E6;box-shadow:inset 0 0 0 1px #F0DDB0;padding:10px 12px;color:#222}",
      ".umbf-lad__h{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:800;letter-spacing:.08em;color:#413729;margin-bottom:8px}",
      ".umbf-lad__h svg{width:15px;height:15px}",
      ".umbf-lad__g{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center}",
      ".umbf-g{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;line-height:1.2;color:#454545}",
      ".umbf-g__ic{width:46px;height:46px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1.5px #E6E6E6;display:flex;align-items:center;justify-content:center;gap:1px;position:relative}",
      ".umbf-g.is-ok .umbf-g__ic{box-shadow:inset 0 0 0 1.5px #457457}",
      ".umbf-g__ic img{height:34px;width:auto;object-fit:contain}",
      ".umbf-g__ic svg{height:32px;width:auto}",
      ".umbf-g__ok{position:absolute;right:-5px;top:-5px;width:17px;height:17px;border-radius:50%;background:#457457;color:#fff;display:flex;align-items:center;justify-content:center}",
      ".umbf-g__ok svg{width:11px;height:11px}",
      ".umbf-g b{font-size:11px;color:#222}",
      ".umbf-g.is-next span{color:#2F7A4C;font-weight:700}",
      ".umbf-lad__seg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:8px}",
      ".umbf-lad__seg i{height:6px;border-radius:3px;background:#E6E6E6;overflow:hidden;display:block}",
      ".umbf-lad__seg i b{display:block;height:100%;background:#E0A92A}",
      ".umbf-lad__msg{font-size:12px;margin-top:8px}",
      ".umbf-lad__msg b{color:#2F7A4C}",
      "#umbf-cart-gain{display:flex;flex-direction:column;gap:4px;background:#F2F2F2;border-radius:6px;padding:8px 10px;margin-bottom:8px}",
      "#umbf-cart-gain div{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#222}",
      "#umbf-cart-gain span{display:flex;align-items:center;gap:5px}",
      "#umbf-cart-gain svg{width:12px;height:12px;color:#457457}",
      "#umbf-cart-gain .umbf-eco{color:#2F7A4C;font-weight:800}",
      ".umbf-shelf{border-radius:8px;box-shadow:inset 0 0 0 1px #E6E6E6;padding:12px;margin:12px 0;background:#fff}",
      ".umbf-shelf__h{display:flex;flex-direction:column;gap:2px;font-size:14px;color:#222;margin-bottom:10px}",
      ".umbf-shelf__h b{font-weight:800}",
      ".umbf-shelf__h span{font-size:12px;color:#2F7A4C;font-weight:700}",
      ".umbf-shelf__row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}",
      ".umbf-mini{display:flex;flex-direction:column;gap:3px;font-size:11px;line-height:1.25;color:#454545}",
      ".umbf-mini img{width:100%;height:84px;object-fit:cover;border-radius:5px;background:#F2F2F2}",
      ".umbf-mini b{font-size:13px;color:#222}",
      ".umbf-mini button{border:1px solid #457457;background:#fff;color:#457457;border-radius:3px;padding:5px 0;font:700 11px Montserrat,Arial,sans-serif;cursor:pointer}",
      ".umbf-mini button[disabled]{opacity:.6}",
      ".umbf-warn{border-radius:7px;background:#FFF8E6;box-shadow:inset 0 0 0 1px #E0A92A;padding:9px 10px;margin:6px 0;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#222;line-height:1.35}",
      ".umbf-warn__bt{display:flex;gap:8px}",
      ".umbf-warn__bt button{flex:1;border:0;border-radius:3px;padding:7px;font:700 12px Montserrat,Arial,sans-serif;cursor:pointer}",
      ".umbf-warn__keep{background:#457457;color:#fff}",
      ".umbf-warn__rm{background:transparent;color:#454545;text-decoration:underline}"
    ].join("\n");
    document.head.appendChild(style);
  }


  /* =========================================================
     LEITURA DO CARRINHO
  ========================================================= */

  function naPaginaCarrinho() {
    return !!document.getElementById("cartTableWidget");
  }

  function subtotal() {
    var v = subtotalCarrinho();
    if (v) return v;
    var el = document.querySelector(".minicart-modal__subtotal-price") || document.querySelector(".itemTotalPrice");
    return el ? reais(el.textContent) : 0;
  }

  // Soma dos "De" menos "Por" dos itens do carrinho lateral
  function economiaCarrinho() {
    var total = 0;
    var itens = document.querySelectorAll(".minicart-modal__item");
    for (var i = 0; i < itens.length; i++) {
      var de = itens[i].querySelector(".minicart-modal__item-old-price");
      var por = itens[i].querySelector(".minicart-modal__item-best-price");
      var qtd = itens[i].querySelector(".CartItemQuantityField");
      if (!de || !por) continue;
      total += (reais(de.textContent) - reais(por.textContent)) * (qtd ? Number(qtd.value) || 1 : 1);
    }
    return total;
  }


  /* =========================================================
     BLOCOS
  ========================================================= */

  var SVG_GARRAFA = '<svg viewBox="0 0 24 40" aria-hidden="true"><rect x="7" y="1.5" width="10" height="5" rx="1.5" fill="#222"/><path d="M5.5 8.5h13v26.5a3.5 3.5 0 0 1-3.5 3.5H9a3.5 3.5 0 0 1-3.5-3.5z" fill="#222"/><rect x="5.5" y="17" width="13" height="8" fill="#F2C85D"/></svg>';
  var SVG_ECOBAG = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M10.5 11V8a5.5 5.5 0 0 1 11 0v3" fill="none" stroke="#413729" stroke-width="2.2"/><path d="M4 11h24l-1.6 22.5H5.6z" fill="#E3D6B8" stroke="#413729" stroke-width="1.4"/><circle cx="16" cy="22" r="3.4" fill="#F2C85D"/></svg>';

  function regua(sub) {
    var largura = Math.min(100, sub / CONFIG.freteFixoMinimo * 100);
    var marca = CONFIG.cupomMinimo / CONFIG.freteFixoMinimo * 100;
    var topo;

    if (sub >= CONFIG.cupomMinimo) {
      topo = "<b>Liberado! Use o cupom no pagamento</b>" + botaoCupom(CONFIG.cupom) +
        (sub < CONFIG.freteFixoMinimo ? "<span>Faltam " + brl(CONFIG.freteFixoMinimo - sub) + " para o frete fixo de R$ 10 (Sul e Sudeste)</span>" : "<span>Frete fixo de R$ 10 para Sul e Sudeste liberado</span>");
    } else {
      topo = "<b>Faltam " + brl(CONFIG.cupomMinimo - sub) + " para " + CONFIG.cupomPercentual + "% OFF</b><span>cupom " + CONFIG.cupom + ", até domingo, 23h59</span>";
    }

    return '<div class="umbf-regua"><div class="umbf-regua__t">' + topo + "</div>" +
      '<div class="umbf-regua__bar"><i style="width:' + largura.toFixed(1) + '%"></i><u style="left:' + marca + '%"></u></div>' +
      '<div class="umbf-regua__scale"><span style="left:' + marca + '%"><b>' + brl(CONFIG.cupomMinimo).replace(",00", "") + "</b>" + CONFIG.cupomPercentual + '% OFF</span><span style="left:100%"><b>' + brl(CONFIG.freteFixoMinimo).replace(",00", "") + "</b>frete R$ 10</span></div></div>";
  }

  function escada(sub) {
    var idx = faixaAtingida(sub);
    var icones = [
      '<img src="' + CONFIG.imgPropolis + '" alt=""><img src="' + CONFIG.imgPegador + '" alt="">',
      SVG_GARRAFA,
      SVG_ECOBAG
    ];
    var nomes = ["Própolis + pegador", "Garrafa térmica", "Ecobag"];
    var anterior = 0;

    var segs = FAIXAS.map(function (f) {
      var parte = Math.max(0, Math.min(1, (sub - anterior) / (f.valor - anterior)));
      anterior = f.valor;
      return '<i><b style="width:' + Math.round(parte * 100) + '%"></b></i>';
    }).join("");

    var itens = FAIXAS.map(function (f, i) {
      // Se não acumulam, só a maior faixa atingida leva o check
      var ganho = BRINDES_ACUMULAM ? i <= idx : i === idx;
      var cls = ganho ? " is-ok" : (i === idx + 1 ? " is-next" : "");
      var txt = ganho ? "garantido" : (i < idx ? "trocado pela próxima" : (i === idx + 1 ? "faltam " + brl(f.valor - sub) : "acima de " + brl(f.valor).replace(",00", "")));
      return '<div class="umbf-g' + cls + '"><span class="umbf-g__ic">' + icones[i] + (ganho ? '<span class="umbf-g__ok">' + ICONE_CHECK + "</span>" : "") + "</span><b>" + nomes[i] + "</b><span>" + txt + "</span></div>";
    }).join("");

    var prox = FAIXAS[idx + 1];
    var msg = idx < 0
      ? "Faltam <b>" + brl(FAIXAS[0].valor - sub) + "</b> para ganhar " + FAIXAS[0].nome + "."
      : "Você já ganhou <b>" + nomeGanho(idx) + "</b>." + (prox ? " Faltam <b>" + brl(prox.valor - sub) + "</b> para a " + prox.nome + "." : "");

    return '<div class="umbf-lad"><div class="umbf-lad__h">' + ICONE_PRESENTE + 'SEUS BRINDES</div><div class="umbf-lad__g">' + itens +
      '</div><div class="umbf-lad__seg">' + segs + '</div><div class="umbf-lad__msg">' + msg + "</div></div>";
  }

  function ganhos(sub) {
    var economia = economiaCarrinho();
    var linhas = "";
    if (economia > 0.009) linhas += '<div><span class="umbf-eco">Você economiza nesta compra</span><span class="umbf-eco">' + brl(economia) + "</span></div>";
    var idx = faixaAtingida(sub);
    if (estado().brinde && idx > -1) linhas += "<div><span>" + ICONE_CHECK + "Brinde: " + nomeGanho(idx) + "</span><span>grátis</span></div>";
    if (sub >= CONFIG.freteFixoMinimo) linhas += "<div><span>" + ICONE_CHECK + "Frete fixo Sul e Sudeste</span><span>R$ 10,00</span></div>";
    return linhas;
  }


  /* =========================================================
     PRATELEIRA DE COMPLEMENTOS (página do carrinho)
  ========================================================= */

  var complementos = null;

  function carregarComplementos(depois) {
    try {
      var cache = JSON.parse(window.sessionStorage.getItem("umbf-compl") || "null");
      if (cache && Date.now() - cache.t < HORA) { complementos = cache.c; depois(); return; }
    } catch (erro) { }

    var lista = [], pendentes = CONFIG.complementos.length;

    CONFIG.complementos.forEach(function (c, i) {
      fetch(c.url, { credentials: "same-origin" }).then(function (r) { return r.text(); }).then(function (html) {
        var preco = html.match(/pv-price-sale[^>]*>\s*([^<]+)</);
        var img = html.match(/property="og:image"\s+content="([^"]+)"/);
        lista[i] = {
          id: c.id, nome: c.nome, url: c.url,
          preco: preco ? reais(preco[1]) : 0,
          img: img ? img[1].replace(/tr:[^/]+/, "tr:w-200,h-260,c-at_max,q-75") : ""
        };
      }).catch(function () { }).then(function () {
        pendentes--;
        if (pendentes) return;
        complementos = lista.filter(function (x) { return x && x.preco; });
        try { window.sessionStorage.setItem("umbf-compl", JSON.stringify({ t: Date.now(), c: complementos })); } catch (erro) { }
        depois();
      });
    });
  }

  function prateleira(sub) {
    if (!complementos || !complementos.length) return "";
    var falta = CONFIG.cupomMinimo - sub;
    // Primeiro o que mais se aproxima do que falta
    var ordem = complementos.slice().sort(function (a, b) { return Math.abs(falta - a.preco) - Math.abs(falta - b.preco); });
    return '<div class="umbf-shelf__h"><b>Feche os ' + brl(CONFIG.cupomMinimo).replace(",00", "") + " do " + CONFIG.cupom + "</b><span>faltam " + brl(falta) + '</span></div><div class="umbf-shelf__row">' +
      ordem.slice(0, 3).map(function (c) {
        return '<div class="umbf-mini"><a href="' + c.url + '"><img src="' + c.img + '" alt=""></a><span>' + c.nome + "</span><b>" + brl(c.preco) + '</b><button type="button" data-umbf-add="' + c.id + '">+ adicionar</button></div>';
      }).join("") + "</div>";
  }

  function adicionar(botao) {
    botao.disabled = true;
    botao.textContent = "adicionando…";
    fetch("/cart/add?id=" + encodeURIComponent(botao.getAttribute("data-umbf-add")), {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest", "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: "sylius_cart_item%5Bquantity%5D=1"
    }).then(function () {
      window.location.reload();
    }).catch(function () {
      botao.disabled = false;
      botao.textContent = "+ adicionar";
    });
  }


  /* =========================================================
     AVISO ANTES DE PERDER O BRINDE
  ========================================================= */

  var passar = false;

  function jaAvisou() {
    try { return window.sessionStorage.getItem("umbf-perda") === "1"; } catch (erro) { return false; }
  }

  function interceptar(evento) {

    if (passar || !estado().brinde || jaAvisou() || !evento.target.closest) return;

    var botao = evento.target.closest(".minicart-modal__remove, .minicart-modal__quantity-subtract, #cartTableWidget td.delete a");
    if (!botao) return;

    var item = botao.closest(".minicart-modal__item, tr.CartProduct");
    if (!item) return;

    var qtdEl = item.querySelector(".CartItemQuantityField");
    var qtd = qtdEl ? Number(qtdEl.value) || 1 : 1;
    var precoEl = item.querySelector(".minicart-modal__item-best-price, .best-price");
    var unit = precoEl ? reais(precoEl.textContent) : 0;
    var remove = !botao.classList.contains("minicart-modal__quantity-subtract");
    if (!remove && qtd <= 1) return;

    var sub = subtotal();
    var novo = sub - unit * (remove ? qtd : 1);
    var antes = faixaAtingida(sub), depois = faixaAtingida(novo);
    if (depois >= antes) return;

    evento.preventDefault();
    evento.stopPropagation();
    if (evento.stopImmediatePropagation) evento.stopImmediatePropagation();

    try { window.sessionStorage.setItem("umbf-perda", "1"); } catch (erro) { }

    var perde = FAIXAS[antes].nome;
    var aviso = document.createElement("div");
    aviso.className = "umbf-c umbf-warn";
    aviso.innerHTML = "<span>Se " + (remove ? "remover este item" : "diminuir a quantidade") + ", o pedido fica em <b>" + brl(novo) + "</b> e você perde " +
      "o brinde: " + "<b>" + perde + '</b>.</span><div class="umbf-warn__bt"><button type="button" class="umbf-warn__keep">Manter no carrinho</button><button type="button" class="umbf-warn__rm">' +
      (remove ? "Remover" : "Diminuir") + " mesmo assim</button></div>";

    if (item.tagName === "TR") {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = item.children.length;
      td.appendChild(aviso);
      tr.appendChild(td);
      item.parentNode.insertBefore(tr, item.nextSibling);
      aviso = tr;
    } else {
      item.parentNode.insertBefore(aviso, item.nextSibling);
    }

    aviso.querySelector(".umbf-warn__keep").addEventListener("click", function (ev) {
      ev.preventDefault();
      aviso.parentNode.removeChild(aviso);
    });

    aviso.querySelector(".umbf-warn__rm").addEventListener("click", function (ev) {
      ev.preventDefault();
      aviso.parentNode.removeChild(aviso);
      passar = true;
      botao.click();
      passar = false;
    });
  }


  /* =========================================================
     RENDER
  ========================================================= */

  function colocar(id, html, pai, antesDe) {
    var el = document.getElementById(id);
    if (!html || !pai) {
      if (el) el.parentNode.removeChild(el);
      return;
    }
    if (!el || el.parentNode !== pai) {
      if (el) el.parentNode.removeChild(el);
      el = document.createElement("div");
      el.id = id;
      el.className = "umbf-c";
      pai.insertBefore(el, antesDe || null);
    }
    if (el.getAttribute("data-html") !== html) {
      el.setAttribute("data-html", html);
      el.innerHTML = html;
    }
  }

  function render() {

    var e = estado();
    var sub = subtotal();
    var topo = (ehFriday(e.fase) ? regua(sub) : "") + (e.brinde ? escada(sub) : "");

    document.documentElement.classList.toggle("umbf-cart-fri", ehFriday(e.fase));

    // Carrinho lateral: régua e escada no topo da lista
    var lista = document.querySelector(".minicart-modal__products");
    var temItens = lista && lista.querySelector(".minicart-modal__item");
    colocar("umbf-cart-top", temItens && topo ? '<div class="umbf-ctop">' + topo + "</div>" : "", lista, lista ? lista.firstChild : null);

    // Carrinho lateral: resumo da ULTRAWEEK
    var resumo = document.querySelector(".minicart-modal__summary");
    colocar("umbf-cart-gain", temItens && ehSemana(e.fase) ? ganhos(sub) : "", resumo, resumo ? resumo.firstChild : null);

    var botao = document.querySelector(".minicart-modal__button-checkout");
    if (botao) {
      if (!botao.hasAttribute("data-umbf-txt")) botao.setAttribute("data-umbf-txt", botao.textContent.trim());
      var texto = temItens && ehSemana(e.fase) ? botao.getAttribute("data-umbf-txt") + " · " + brl(sub) : botao.getAttribute("data-umbf-txt");
      if (botao.textContent.trim() !== texto) botao.textContent = texto;
    }

    // Página do carrinho
    if (naPaginaCarrinho()) {
      var slot = document.getElementById("generic-progress-bar");
      colocar("umbf-cartpage-top", topo ? '<div class="umbf-ctop">' + topo + "</div>" : "", slot, null);

      var querPrateleira = ehFriday(e.fase) && sub > 0 && sub < CONFIG.cupomMinimo;
      if (querPrateleira && !complementos) {
        carregarComplementos(render);
      }
      var conteudo = document.querySelector("#cartBody .cartContent");
      colocar("umbf-shelf", querPrateleira ? prateleira(sub) : "", conteudo ? conteudo.parentNode : null, conteudo ? conteudo.nextSibling : null);
      var shelf = document.getElementById("umbf-shelf");
      if (shelf) shelf.className = "umbf-c umbf-shelf";
    }
  }

  var agendado = false;

  function agendar() {
    if (agendado) return;
    agendado = true;
    window.setTimeout(function () { agendado = false; render(); }, 80);
  }

  function iniciar() {
    injetarCss();
    ligarRelogio();
    ligarCopiar();
    render();

    document.addEventListener("click", interceptar, true);
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("[data-umbf-add]") : null;
      if (b) { ev.preventDefault(); adicionar(b); }
    });

    if (window.jQuery) window.jQuery(document).on("uoou-cart-data-changed uoou-cart-add", agendar);

    // O carrinho lateral é refeito a cada mudança
    new MutationObserver(function (lista) {
      for (var i = 0; i < lista.length; i++) {
        var alvo = lista[i].target;
        if (alvo.closest && alvo.closest(".umbf-c")) continue;
        if (alvo.closest && alvo.closest(".minicart_modal__lazyload, .minicart-modal, #cartContainer")) { agendar(); return; }
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
