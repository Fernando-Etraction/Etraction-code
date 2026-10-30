(function () {
  "use strict";

  /* =========================================================
     ULTRAMEL - BLACK 2026
     CÓDIGO 2 - HOME
     Logo abaixo do banner principal, um bloco que muda com a fase:
       ULTRAFRIDAY   quinta avisa, sexta e sábado oferta, domingo contagem
       11.11         topo vinho com a vitrine ULTRALIBIDO
       ULTRAWEEK     agenda dos 8 dias com o dia de hoje destacado
       ULTRA MONDAY  "segunda é dia de começar" + aviso do carrinho
     Durante os brindes, a faixa de benefícios (.info-bar) dá lugar
     aos três brindes em foto.
  ========================================================= */

  if (window.__umbfHomeLoaded) {
    return;
  }

  window.__umbfHomeLoaded = true;

  var BLOCO_ID = "umbf-home";
  var BRINDES_ID = "umbf-home-gifts";
  var STYLE_ID = "umbf-home-style";

  var CONFIG = {
    cupom: "ULTRAFRIDAY",
    urlCampanha: "/oportunidades",
    urlLibido: "/geleia-real-pura-liofilizada-9-000mg",
    urlGeleia: "/geleia-real-pura-liofilizada-9-000mg",
    imgGeleia: "https://adaptive-images.uooucdn.com.br/tr:w-300,h-400,c-at_max,q-80/a22571-ogxytxlxut0/pv/17/8c/97/e7463570bf9ac44a37b2d8e8f7.png",

    // Fotos dos brindes. Vazio = ilustração. Pedir as fotos reais à cliente.
    imgPropolis: "https://adaptive-images.uooucdn.com.br/tr:w-120,h-200,c-at_max,q-80/a22571-ogxytxlxut0/pv/00/db/6e/e5f7707cd02ff2a988c2984999.jpg",
    imgPegador: "https://adaptive-images.uooucdn.com.br/tr:w-80,h-200,c-at_max,q-80/a22571-ogxytxlxut0/pv/d1/bc/af/fc5c3f4eac28bdab94216597bd.jpg",
    imgGarrafa: "",
    imgEcobag: "",

    // Linha abaixo do título dos brindes (confirmar se entram sozinhos no pedido)
    brindesNota: "O brinde vai junto no seu pedido."
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
      "#umbf-home,#umbf-home-gifts{font-family:Montserrat,Arial,sans-serif;box-sizing:border-box}",
      "#umbf-home *,#umbf-home-gifts *{box-sizing:border-box}",
      ".umbf-hero{background:#16120E;color:#fff;padding:22px 18px 24px;display:flex;flex-direction:column;align-items:flex-start;gap:10px}",
      ".umbf-hero--lib{background:#6A1F33}",
      ".umbf-hero__ey{font-size:11px;font-weight:700;letter-spacing:.14em;color:#F2C85D;text-transform:uppercase}",
      ".umbf-hero--lib .umbf-hero__ey{color:#F3C9D4}",
      ".umbf-hero__tt{font-size:30px;line-height:1;font-weight:900;letter-spacing:-.01em;margin:0}",
      ".umbf-hero__tt em{font-style:normal;color:#F2C85D}",
      ".umbf-hero__sb{font-size:14px;opacity:.92;margin:0}",
      ".umbf-hero__cta{display:inline-block;background:#F2C85D;color:#16120E!important;font-weight:800;font-size:13px;padding:10px 16px;border-radius:3px;text-decoration:none!important;letter-spacing:.03em}",
      ".umbf-hero--lib .umbf-hero__cta{background:#fff;color:#6A1F33!important}",
      ".umbf-clk{display:flex;gap:6px}",
      ".umbf-clk span{background:#fff;color:#16120E;border-radius:5px;padding:5px 8px 4px;min-width:48px;text-align:center;display:flex;flex-direction:column}",
      ".umbf-clk b{font-size:20px;line-height:1.05;font-weight:800;font-variant-numeric:tabular-nums}",
      ".umbf-clk small{font-size:8px;font-weight:700;letter-spacing:.08em}",
      ".umbf-hero .umbf-copy{display:inline-flex;align-items:center;gap:6px;border:1px dashed #F2C85D;background:transparent;color:#F2C85D;border-radius:4px;padding:5px 10px;font:800 13px Montserrat,Arial,sans-serif;letter-spacing:.06em;cursor:pointer}",
      ".umbf-hero .umbf-copy svg{width:14px;height:14px}",
      ".umbf-strip{background:#16120E;color:#fff;padding:14px 18px;font-size:14px;line-height:1.4;text-align:center}",
      ".umbf-strip b{color:#F2C85D;font-weight:900}",
      ".umbf-strip--lib{background:#6A1F33}",
      ".umbf-strip--lib b{color:#FFE4EB}",
      ".umbf-days{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;width:100%;max-width:520px}",
      ".umbf-days span{display:flex;flex-direction:column;align-items:center;padding:6px 0 5px;border-radius:5px;background:rgba(255,255,255,.14);font-size:10px;line-height:1.15}",
      ".umbf-days b{font-size:16px;font-variant-numeric:tabular-nums}",
      ".umbf-days i{font-style:normal;font-size:8px;font-weight:800;letter-spacing:.03em;margin-top:2px}",
      ".umbf-days .is-f{box-shadow:inset 0 0 0 1px #F2C85D;color:#F2C85D}",
      ".umbf-days .is-hoje{background:#F2C85D;color:#16120E;box-shadow:none}",
      ".umbf-days .is-passou{opacity:.4}",
      ".umbf-nag{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 18px;background:#FFF8E6;border-bottom:1px solid #F0DDB0;font-size:14px;color:#222}",
      ".umbf-nag a{font-weight:800;color:#2F7A4C!important;white-space:nowrap}",
      ".umbf-rot{display:grid;grid-template-columns:110px 1fr;gap:14px;align-items:center;padding:18px;background:#fff}",
      ".umbf-rot img{width:110px;height:140px;object-fit:cover;border-radius:8px}",
      ".umbf-rot__ey{font-size:11px;font-weight:800;letter-spacing:.12em;color:#2F7A4C}",
      ".umbf-rot__tt{font-size:19px;line-height:1.15;font-weight:800;color:#222;margin:4px 0}",
      ".umbf-rot__sb{font-size:13px;color:#454545;margin:0 0 8px}",
      ".umbf-rot a.umbf-rot__cta{display:inline-block;background:#457457;color:#fff!important;font-weight:800;font-size:12px;padding:9px 12px;border-radius:3px;text-decoration:none!important}",
      "#umbf-home-gifts{background:#FFF8E6;padding:20px 14px;text-align:center}",
      "#umbf-home-gifts h2{font-size:17px;font-weight:800;color:#413729;letter-spacing:.02em;margin:0}",
      "#umbf-home-gifts p{font-size:12px;color:#454545;margin:4px 0 14px}",
      ".umbf-gifts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:640px;margin:0 auto}",
      ".umbf-gift{background:#fff;border-radius:10px;padding:12px 6px 10px;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:12px;color:#454545;line-height:1.25}",
      ".umbf-gift__img{height:72px;display:flex;align-items:flex-end;justify-content:center;gap:2px}",
      ".umbf-gift__img img{height:72px;width:auto;max-width:60px;object-fit:contain}",
      ".umbf-gift__img svg{height:66px;width:auto}",
      ".umbf-gift b{font-size:13px;color:#222}",
      ".umbf-gift small{font-size:10px;color:#8C8C8C}",
      ".umbf-gift em{font-style:normal;font-weight:800;font-size:12px;color:#413729;background:#F2C85D;border-radius:3px;padding:2px 6px}",
      ".umbf-hide{display:none!important}",
      "@media (min-width:768px){.umbf-hero{align-items:center;text-align:center;padding:28px}.umbf-hero__tt{font-size:40px}.umbf-rot{max-width:640px;margin:0 auto}}"
    ].join("\n");
    document.head.appendChild(style);
  }


  /* =========================================================
     BLOCOS
  ========================================================= */

  var SVG_GARRAFA = '<svg viewBox="0 0 24 40" aria-hidden="true"><rect x="7" y="1.5" width="10" height="5" rx="1.5" fill="#222"/><path d="M5.5 8.5h13v26.5a3.5 3.5 0 0 1-3.5 3.5H9a3.5 3.5 0 0 1-3.5-3.5z" fill="#222"/><rect x="5.5" y="17" width="13" height="8" fill="#F2C85D"/></svg>';
  var SVG_ECOBAG = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M10.5 11V8a5.5 5.5 0 0 1 11 0v3" fill="none" stroke="#413729" stroke-width="2.2"/><path d="M4 11h24l-1.6 22.5H5.6z" fill="#E3D6B8" stroke="#413729" stroke-width="1.4"/><circle cx="16" cy="22" r="3.4" fill="#F2C85D"/></svg>';

  function dataCurta(ms) {
    var d = new Date(ms - 3 * HORA);
    return duasCasas(d.getUTCDate()) + "/" + duasCasas(d.getUTCMonth() + 1);
  }

  function proximaSexta() {
    var agora = Date.now();
    for (var i = 0; i < SEXTAS.length; i++) if (SEXTAS[i] > agora) return SEXTAS[i];
    return null;
  }

  function diasDaSemana() {
    var hoje = new Date(Date.now() - 3 * HORA).getUTCDate();
    var mes = new Date(Date.now() - 3 * HORA).getUTCMonth() + 1;
    var dias = [["seg", 23, ""], ["ter", 24, ""], ["qua", 25, ""], ["qui", 26, ""], ["sex", 27, "FRIDAY"], ["sáb", 28, "WKND"], ["dom", 29, "WKND"], ["seg", 30, "MON"]];
    return '<div class="umbf-days">' + dias.map(function (d) {
      var cls = [];
      if (d[2]) cls.push("is-f");
      if (mes === 11 && d[1] === hoje) cls.push("is-hoje");
      else if (mes === 11 && d[1] < hoje) cls.push("is-passou");
      var marca = cls.indexOf("is-hoje") > -1 ? "HOJE" : d[2];
      return '<span class="' + cls.join(" ") + '">' + d[0] + "<b>" + d[1] + "</b>" + (marca ? "<i>" + marca + "</i>" : "") + "</span>";
    }).join("") + "</div>";
  }

  function blocoFase(e) {

    switch (e.fase) {

      case "fri-aviso":
        return '<div class="umbf-strip">Amanhã, 0h, começa o <b>ULTRAFRIDAY</b>: 10% OFF nas compras acima de R$ 400, até domingo, 23h59.</div>';

      case "fri":
        return '<div class="umbf-hero"><span class="umbf-hero__ey">Sexta a domingo</span><h2 class="umbf-hero__tt">ULTRA<em>FRIDAY</em></h2>' +
          '<p class="umbf-hero__sb">10% OFF nas compras acima de R$ 400. Até domingo, 23h59.</p>' + botaoCupom(CONFIG.cupom) + "</div>";

      case "fri-dom":
        var prox = proximaSexta();
        var depois = prox ? "Toda sexta, 0h, tem de novo. Próxima: " + dataCurta(prox) + "." : "Amanhã começa a ULTRAWEEK.";
        return '<div class="umbf-hero"><span class="umbf-hero__ey">Domingo, ' + dataCurta(Date.now()) + '</span><h2 class="umbf-hero__tt">ULTRAFRIDAY <em>termina hoje</em></h2>' +
          relogioBlocos(e.fim, "umbf-clk") + '<p class="umbf-hero__sb">10% OFF nas compras acima de R$ 400</p>' + botaoCupom(CONFIG.cupom) +
          '<p class="umbf-hero__sb">' + depois + "</p></div>";

      case "lib-aviso":
        return '<div class="umbf-strip umbf-strip--lib">Amanhã, 11/11: <b>ULTRALIBIDO</b>. Toque no ♥ dos seus favoritos para achar rápido.</div>';

      case "lib":
        return '<div class="umbf-hero umbf-hero--lib"><span class="umbf-hero__ey">Só hoje, 11/11 · até 23h59</span><h2 class="umbf-hero__tt">ULTRALIBIDO</h2>' +
          '<p class="umbf-hero__sb">Geleia Real e kits para a vida a dois.</p>' + relogioBlocos(e.fim, "umbf-clk") +
          '<a class="umbf-hero__cta" href="' + CONFIG.urlLibido + '">VER A VITRINE</a></div>';

      case "week":
      case "wfri":
      case "wknd":
        var ey = { week: "23 a 30 de novembro", wfri: "É hoje · ULTRA FRIDAY", wknd: "ULTRA WEEKEND · últimos dias" }[e.fase];
        return '<div class="umbf-hero"><span class="umbf-hero__ey">' + ey + '</span><h2 class="umbf-hero__tt">ULTRA<em>WEEK</em></h2>' +
          diasDaSemana() + '<a class="umbf-hero__cta" href="' + CONFIG.urlCampanha + '">VER AS OFERTAS DE HOJE</a></div>';

      case "wmon":
        var qtd = 0;
        try { qtd = Number(Uoou.cart.getQuantity()) || 0; } catch (erro) { }
        return (qtd ? '<div class="umbf-nag"><span>Seu carrinho tem ' + qtd + " ite" + (qtd > 1 ? "ns" : "m") + ' esperando</span><a href="/cart/">ver carrinho ›</a></div>' : "") +
          '<div class="umbf-rot"><img src="' + CONFIG.imgGeleia + '" alt="Geleia Real Pura Liofilizada"><div>' +
          '<div class="umbf-rot__ey">SEGUNDA É DIA DE COMEÇAR</div><div class="umbf-rot__tt">Rotina de 30 dias com a Geleia Real</div>' +
          '<p class="umbf-rot__sb">1 cápsula por dia, pela manhã. ULTRA MONDAY: última chance, até 23h59.</p>' +
          '<a class="umbf-rot__cta" href="' + CONFIG.urlGeleia + '">COMEÇAR MINHA ROTINA</a></div></div>';
    }

    return "";
  }

  function blocoBrindes() {

    function img(url, svg, alt) {
      return url ? '<img src="' + url + '" alt="' + alt + '">' : svg;
    }

    var prop = '<img src="' + CONFIG.imgPropolis + '" alt="Própolis"><img src="' + CONFIG.imgPegador + '" alt="Pegador de mel">';

    return "<h2>GANHE BRINDES NO SEU PEDIDO</h2><p>" + CONFIG.brindesNota + '</p><div class="umbf-gifts">' +
      '<div class="umbf-gift"><span class="umbf-gift__img">' + prop + "</span><b>Própolis + pegador</b><small>acima de</small><em>R$ 299</em></div>" +
      '<div class="umbf-gift"><span class="umbf-gift__img">' + img(CONFIG.imgGarrafa, SVG_GARRAFA, "Garrafa térmica") + "</span><b>Garrafa térmica</b><small>acima de</small><em>R$ 499</em></div>" +
      '<div class="umbf-gift"><span class="umbf-gift__img">' + img(CONFIG.imgEcobag, SVG_ECOBAG, "Ecobag") + "</span><b>Ecobag Ultramel</b><small>acima de</small><em>R$ 699</em></div></div>";
  }


  /* =========================================================
     RENDER
  ========================================================= */

  var chaveRenderizada = null;

  function ancora() {
    // Logo depois do banner principal
    return document.querySelector('body > [id^="layout-gallery"]') || document.querySelector('[id^="layout-gallery"]');
  }

  function faixaBeneficios() {
    var bar = document.querySelector(".info-bar");
    return bar ? bar.closest(".homepage-custom-html-container") || bar : null;
  }

  function render() {

    var e = estado();
    var htmlFase = blocoFase(e);
    var chave = e.fase + "|" + e.brinde + "|" + (e.fase === "wmon" ? htmlFase : "") + "|" + new Date(Date.now() - 3 * HORA).getUTCDate();
    var falta = (htmlFase && !document.getElementById(BLOCO_ID)) || (e.brinde && !document.getElementById(BRINDES_ID));

    if (chave === chaveRenderizada && !falta) return;

    var ref = ancora();
    if (!ref) return;

    chaveRenderizada = chave;

    var antigo = document.getElementById(BLOCO_ID);
    if (antigo) antigo.parentNode.removeChild(antigo);
    var antigoB = document.getElementById(BRINDES_ID);
    if (antigoB) antigoB.parentNode.removeChild(antigoB);

    var info = faixaBeneficios();
    if (info) info.classList.toggle("umbf-hide", !!e.brinde);

    var depois = ref;

    if (htmlFase) {
      var bloco = document.createElement("section");
      bloco.id = BLOCO_ID;
      bloco.innerHTML = htmlFase;
      depois.parentNode.insertBefore(bloco, depois.nextSibling);
      depois = bloco;
    }

    if (e.brinde) {
      var brindes = document.createElement("section");
      brindes.id = BRINDES_ID;
      brindes.innerHTML = blocoBrindes();
      depois.parentNode.insertBefore(brindes, depois.nextSibling);
    }
  }

  var agendado = false;

  function agendar() {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(function () { agendado = false; render(); });
  }

  function iniciar() {
    if (document.body.id !== "page-homepage") return;
    injetarCss();
    ligarRelogio();
    ligarCopiar();
    render();
    new MutationObserver(agendar).observe(document.body, { childList: true });
    if (window.jQuery) window.jQuery(document).on("uoou-cart-data-changed", agendar);
    // O aviso da ULTRA MONDAY precisa da quantidade do carrinho
    try { if (!Uoou.cart.getData()) Uoou.cart.reload(agendar); } catch (erro) { }
    window.setInterval(render, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
