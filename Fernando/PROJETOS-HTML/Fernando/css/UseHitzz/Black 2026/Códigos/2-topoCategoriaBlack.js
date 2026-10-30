(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK 2026
     CÓDIGO 2 - TOPO DA CATEGORIA BLACK
     Logo abaixo do título da categoria Black. Cada ação tem o seu
     conceito, o mesmo da tarja (código 1):

     Black Hitzz   a caixa Black: fita de lacre, "Black Hitzz" grande e fotos da página
     Só no app     a notificação: tela de bloqueio com os avisos do app
     11.11         o painel de embarque: os primeiros Hitzz da página como voos
     Isla por R$1  preço riscado: R$ 249,90 e o R$1 grande, com a sacola da cliente
     Black Friday  o pregão: gráfico em queda e cotações dos produtos da página

     IDEIAS (liga/desliga em IDEIAS)
     2   atalhos por faixa de preço
     7   atalhos "Mais vendidos" e "Maior desconto"
     11  atalhos fixos no topo ao rolar a lista (celular)
  ========================================================= */

  if (window.__hzbfCatLoaded) {
    return;
  }

  window.__hzbfCatLoaded = true;

  var IDEIAS = {
    faixasDePreco: true,
    ordenacoes: true,
    atalhosFixos: true
  };

  var ID = "hzbf-cat";
  var STYLE_ID = "hzbf-cat-style";

  var SELETOR_TITULO = ".products-filter .taxon-title-text";

  var SELETORES_CARD = {
    card: ".product",
    foto: "img.primaryImage, .product-list-image-container img",
    nome: "h3, .description",
    link: "a.grid-card-link, a[href]",
    pix: ".cash-payment-container .to-price",
    por: ".box-price-to > .to-price",
    de: ".box-price-of .from-price"
  };

  // Páginas da Black: a categoria e as subcategorias (começam com estes caminhos)
  var PAGINAS_BLACK = ["/categorizacao/promo", "/esquenta-black"];

  // Ideia 2: as faixas (em centavos) são as que o filtro da loja já tem
  var FAIXAS = [
    { nome: "Até R$150", valores: ["5000|10000", "10000|15000"] },
    { nome: "R$150 a R$300", valores: ["15000|20000", "20000|30000"] },
    { nome: "R$300 a R$550", valores: ["30000|40000", "40000|55000"] },
    { nome: "Acima de R$550", valores: ["55000|70000"] }
  ];

  // Ideia 7: ordenações que a loja já tem
  var ORDENACOES = [
    { nome: "Mais vendidos", chave: "sorting[bestseller]", valor: "asc" },
    { nome: "Maior desconto", chave: "sorting[discount]", valor: "desc" }
  ];


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    // Trocar pelo link da coleção dos 24 Hitzz do 11.11 quando a cliente criar
    url1111: "/categorizacao/promo?sorting%5Bprice%5D=asc",

    urlIsla: "/isla-chinelo-flat-feminino-marrom",
    imgIsla: "https://adaptive-images.uooucdn.com.br/tr:w-400,h-580,c-at_max,pr-true,q-80/a22613-ogxyuhoywt0/pv/35/9b/f5/67061bb74f2448dfb4a7085899.png",
    precoIsla: 249.90,
    minimoIsla: 999,

    appIos: "https://apps.apple.com/br/app/use-hitzz/id6793275985",
    appAndroid: "https://play.google.com/store/apps/details?id=com.uoou.usehitzz&hl=pt_BR"
  };

  var estadoRenderizado = null;
  var observer = null;
  var observerFrame = null;


  /* =========================================================
     AGENDA DA BLACK - AUTOMÁTICA (horário de Brasília)

     01/11 a 30/11            Black Hitzz: até 70% OFF na categoria Black
     05/11 22h a 08/11 23h59  Só no app: até 70% OFF + 20% OFF no Pix
     10/11 22h a 12/11 08h    11.11: + de 24 Hitzz por até R$124
     19/11 22h a 22/11 23h59  Isla Marrom por R$1 acima de R$999
     26/11 22h a 29/11 23h59  Black Friday: até 70% OFF + 20% OFF no Pix

     Só para conferir antes da data, na URL:
     ?hzbf=month | app | 1111 | isla | black
     ?hzbf=black:ultimo   força o "último dia"
     ?hzbf=off            volta ao calendário
  ========================================================= */

  function brasilia(ano, mes, dia, hora) {
    return Date.UTC(ano, mes - 1, dia, hora + 3, 0, 0);
  }

  // Para a Black Friday ir até 30/11, troque por brasilia(2026, 12, 1, 0)
  var FIM_BLACK_FRIDAY = brasilia(2026, 11, 30, 0); // 29/11 23h59

  var AGENDA = [
    { id: "app", inicio: brasilia(2026, 11, 5, 22), fim: brasilia(2026, 11, 9, 0), ultimoHoras: 24 },
    { id: "1111", inicio: brasilia(2026, 11, 10, 22), fim: brasilia(2026, 11, 12, 8), ultimoHoras: 8 },
    { id: "isla", inicio: brasilia(2026, 11, 19, 22), fim: brasilia(2026, 11, 23, 0), ultimoHoras: 24 },
    { id: "black", inicio: brasilia(2026, 11, 26, 22), fim: FIM_BLACK_FRIDAY, ultimoHoras: 24 },
    { id: "month", inicio: brasilia(2026, 11, 1, 0), fim: brasilia(2026, 12, 1, 0), ultimoHoras: 24 }
  ];

  var PREVIEW_KEY = "hzbf-preview";

  function lerPreview() {

    var valor = null;

    try {

      var param = new URLSearchParams(window.location.search).get("hzbf");

      if (param === "off") {
        window.sessionStorage.removeItem(PREVIEW_KEY);
        return null;
      }

      if (param) {
        window.sessionStorage.setItem(PREVIEW_KEY, param);
      }

      valor = window.sessionStorage.getItem(PREVIEW_KEY);

    } catch (erro) { }

    var partes = String(valor || "").split(":");

    for (var i = 0; i < AGENDA.length; i++) {

      if (AGENDA[i].id === partes[0]) {

        var ultimo = partes[1] === "ultimo";

        return {
          id: partes[0],
          ultimo: ultimo,
          // No preview o timer conta um prazo de exemplo, mas o texto usa a data real
          fim: Date.now() + (ultimo ? 5 * 3600000 + 42 * 60000 : 2 * 86400000 + 5 * 3600000),
          fimReal: AGENDA[i].fim
        };
      }
    }

    return null;
  }

  var PREVIEW = lerPreview();

  function momentoDaAcao() {

    if (PREVIEW) {
      return PREVIEW;
    }

    var agora = Date.now();

    for (var i = 0; i < AGENDA.length; i++) {

      var acao = AGENDA[i];

      if (agora >= acao.inicio && agora < acao.fim) {
        return {
          id: acao.id,
          ultimo: acao.fim - agora <= acao.ultimoHoras * 3600000,
          fim: acao.fim,
          fimReal: acao.fim
        };
      }
    }

    return null;
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

  function lerPreco(el) {

    if (!el) {
      return NaN;
    }

    return parseFloat(String(el.textContent || "").replace(/[^0-9,.]/g, "").replace(/\./g, "").replace(",", "."));
  }

  function formatBRL(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var DIAS_LONGOS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function agoraBrasilia() {
    return new Date(Date.now() - 3 * 3600000);
  }

  // "domingo, 08/11, às 23h59" a partir do fim (exclusivo) da ação
  function prazoTexto(fim) {

    var meiaNoite = new Date(fim - 3 * 3600000).getUTCHours() === 0;
    var d = new Date(fim - 3 * 3600000 - (meiaNoite ? 60000 : 0));
    var hora = meiaNoite ? "23h59" : d.getUTCHours() + "h";

    return DIAS[d.getUTCDay()] + ", " + doisDigitos(d.getUTCDate()) + "/" +
      doisDigitos(d.getUTCMonth() + 1) + ", às " + hora;
  }

  // Dia de novembro (1 a 30), para o "Dia 12/30"
  function diaDaBlack() {

    var d = agoraBrasilia();

    return d.getUTCMonth() === 10 ? d.getUTCDate() : 1;
  }

  function caminho(url) {
    return url.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  }

  function paginaBlack() {

    var atual = caminho(window.location.pathname);

    for (var i = 0; i < PAGINAS_BLACK.length; i++) {

      var base = caminho(PAGINAS_BLACK[i]);

      if (atual === base || atual.indexOf(base + "/") === 0) {
        return true;
      }
    }

    return false;
  }

  function linkDoApp() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ? CONFIG.appIos : CONFIG.appAndroid;
  }

  // Valor da sacola em reais (a Uoou devolve em centavos)
  function valorDaSacola() {

    try {
      var centavos = window.Uoou && window.Uoou.cart && window.Uoou.cart.getSubTotal();
      return centavos > 0 ? centavos / 100 : 0;
    } catch (erro) {
      return 0;
    }
  }

  // "SARINA - BOTA FEMININA..." ou "BOTA FEMININA... - NARI": fica o nome do modelo
  function nomeCurto(nome) {

    var partes = String(nome || "").split(" - ");
    var curto = partes[0];

    for (var i = 1; i < partes.length; i++) {

      if (partes[i].length < curto.length) {
        curto = partes[i];
      }
    }

    return curto.trim();
  }

  function fotoDoCard(card) {

    var img = card.querySelector(SELETORES_CARD.foto);

    if (!img) {
      return "";
    }

    // As URLs da Uoou têm vírgulas: o srcset é cortado pela largura ("265w,")
    var set = img.getAttribute("data-srcset") || img.getAttribute("srcset") || "";
    var url = set.split(/\s+\d+w,?\s*/)[0];

    if (!/^https?:\/\//.test(url)) {
      url = img.currentSrc || img.getAttribute("data-src") || img.getAttribute("src") || "";
    }

    return /^https?:\/\//.test(url) ? url : "";
  }

  // Os primeiros produtos da própria página (já carregados pela loja)
  function produtosDaPagina(quantos) {

    var lista = [];
    var cards = document.querySelectorAll(SELETORES_CARD.card);

    for (var i = 0; i < cards.length && lista.length < quantos; i++) {

      var nomeEl = cards[i].querySelector(SELETORES_CARD.nome);
      var linkEl = cards[i].querySelector(SELETORES_CARD.link);
      var pix = lerPreco(cards[i].querySelector(SELETORES_CARD.pix));
      var por = lerPreco(cards[i].querySelector(SELETORES_CARD.por));
      var de = lerPreco(cards[i].querySelector(SELETORES_CARD.de));
      var preco = pix > 0 ? pix : por;

      if (!nomeEl || !(preco > 0)) {
        continue;
      }

      lista.push({
        nome: nomeCurto(nomeEl.textContent),
        url: linkEl ? linkEl.getAttribute("href") : "",
        foto: fotoDoCard(cards[i]),
        preco: preco,
        por: por > 0 ? por : preco,
        queda: de > preco ? Math.round((1 - preco / de) * 100) : 0,
        economia: de > preco ? de - preco : 0
      });
    }

    return lista;
  }

  var SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var DOT = '<i class="hzbfc-dot" aria-hidden="true"></i>';


  /* =========================================================
     CSS
  ========================================================= */

  var MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace';

  var CSS = [
    '.hzbf-cat{box-sizing:border-box;position:relative;margin:14px 0 18px;border-radius:16px;overflow:hidden;background:#000;color:#fff;font:inherit;text-align:left;-webkit-font-smoothing:antialiased}',
    '.hzbf-cat *{box-sizing:border-box}',
    '.hzbf-cat p{margin:0}',
    '.hzbf-cat a{color:inherit !important;text-decoration:none !important}',
    '.hzbf-cat img{display:block;width:100%;height:100%;object-fit:cover}',
    '.hzbfc-tempo{font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.hzbfc-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#e5262e;flex-shrink:0}',
    '.hzbf-cat a.hzbfc-btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 16px;border-radius:999px;background:#fff;color:#000 !important;font-size:12.5px;font-weight:700;white-space:nowrap}',
    '.hzbfc-btn svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '@keyframes hzbfc-corre{to{transform:translateX(-50%)}}',
    '@keyframes hzbfc-pisca{50%{opacity:.25}}',

    /* Black Hitzz - a caixa Black: fita de lacre em cima e o nome grande */
    '.hzbfc-cx{position:relative;min-height:230px;padding:30px 18px 22px}',
    '.hzbfc-cx::before{content:"";position:absolute;left:0;right:0;top:0;height:7px;background:repeating-linear-gradient(-45deg,#fff 0 6px,#000 6px 12px)}',
    '.hzbfc-cx__fotos{position:absolute;right:-6px;top:24px;display:flex;gap:8px;transform:rotate(7deg)}',
    '.hzbfc-cx__fotos span{display:block;width:92px;aspect-ratio:3/4;border-radius:8px;overflow:hidden;background:#efefef}',
    '.hzbfc-cx__fotos span:nth-child(2){margin-top:26px}',
    '.hzbfc-cx__fotos span:nth-child(3){display:none}',
    '.hzbfc-cx__txt{position:relative;max-width:62%}',
    '.hzbfc-cx__dia{display:inline-block;padding:4px 8px;background:#fff;color:#000;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}',
    '.hzbf-cat--ultimo .hzbfc-cx__dia{background:#e5262e;color:#fff}',
    '.hzbfc-cx__titulo{margin-top:10px !important;font-size:44px;font-weight:900;line-height:.88;letter-spacing:-.02em;text-transform:uppercase}',
    '.hzbfc-cx__oferta{margin-top:10px !important;font-size:15px}',
    '.hzbfc-cx__oferta b{color:#ff4b52;font-size:22px;font-weight:900}',
    '.hzbfc-cx__sub{margin-top:6px !important;color:rgba(255,255,255,.7);font-size:12px}',

    /* Só no app - tela de bloqueio */
    '.hzbf-cat--app{background:radial-gradient(120% 80% at 50% 0%,#303030 0%,#000 70%);border-radius:22px}',
    '.hzbfc-lock{max-width:460px;margin:0 auto;padding:18px 14px 16px;text-align:center}',
    '.hzbfc-lock__data{color:#d0d0d0;font-size:12px}',
    '.hzbfc-lock__hora{margin:2px 0 12px !important;font-size:60px;font-weight:300;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}',
    '.hzbfc-notif{display:flex;align-items:center;gap:10px;margin-top:6px;padding:9px 10px;border-radius:15px;background:rgba(255,255,255,.15);text-align:left}',
    '.hzbfc-notif__ic{display:flex;align-items:center;justify-content:center;flex:0 0 28px;width:28px;height:28px;border-radius:7px;background:#000;box-shadow:inset 0 0 0 1px #3a3a3c;font-size:15px;font-weight:800}',
    '.hzbfc-notif__txt{flex:1;min-width:0;line-height:1.25}',
    '.hzbfc-notif__txt small{display:block;color:#b5b5b5;font-size:10px}',
    '.hzbfc-notif__txt b{display:block;font-size:13px}',
    '.hzbfc-notif__txt span{display:block;color:#dcdcdc;font-size:11.5px}',
    '.hzbfc-notif__foto{flex:0 0 40px;width:40px;height:40px;border-radius:8px;overflow:hidden;background:#efefef}',
    '.hzbfc-notif-pilha{display:block;height:9px;margin:0 14px;border-radius:0 0 12px 12px;background:rgba(255,255,255,.08)}',
    '.hzbfc-lojas{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:14px}',

    /* 11.11 - painel de embarque */
    '.hzbf-cat--1111{background:#0b0b0b}',
    '.hzbfc-painel{padding:14px 14px 16px;font-size:12px}',
    '.hzbfc-painel__topo,.hzbfc-painel__linha,.hzbfc-painel__fim{' + MONO + '}',
    '.hzbfc-painel__topo{display:flex;justify-content:space-between;gap:8px;padding-bottom:10px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}',
    '.hzbfc-painel__topo em{color:#ff4b52;font-style:normal}',
    '.hzbfc-painel__linha{display:grid;grid-template-columns:40px minmax(0,1fr) auto 86px;gap:8px;align-items:center;padding:7px 2px;border-bottom:1px solid #1f1f1f;color:#fff !important;text-transform:uppercase}',
    '.hzbfc-painel__linha--cab{padding:4px 2px;border-bottom-color:#2a2a2a;color:#7a7a7a !important;font-size:9.5px}',
    '.hzbfc-painel__linha span:nth-child(2){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.hzbfc-painel__st{padding:3px 4px;background:#fff;color:#000;font-size:9.5px;font-weight:700;text-align:center}',
    '.hzbfc-painel__fim{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}',
    '.hzbfc-painel__fim small{color:#9a9a9a;font-size:10px;letter-spacing:.1em;text-transform:uppercase}',
    '.hzbfc-placas{display:inline-flex;align-items:center;gap:2px;perspective:200px}',
    '.hzbfc-placa{display:inline-flex;align-items:center;justify-content:center;width:18px;height:28px;border-radius:3px;background:linear-gradient(#262626 0 49%,#000 49% 53%,#1b1b1b 53%);color:#fff;font-size:17px;font-weight:700;line-height:1}',
    '.hzbfc-placa.hzbfc-vira{animation:hzbfc-vira .28s ease-out}',
    '@keyframes hzbfc-vira{from{transform:rotateX(85deg)}to{transform:none}}',
    '.hzbfc-sep{font-size:17px;font-weight:700}',
    '.hzbf-cat .hzbfc-painel a.hzbfc-btn{display:flex;justify-content:center;margin-top:12px}',

    /* Isla - preço riscado e o R$1 grande */
    '.hzbfc-isla{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:14px;align-items:center;padding:18px 16px}',
    '.hzbfc-isla__nome{color:rgba(255,255,255,.7);font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}',
    '.hzbfc-isla__de{margin-top:4px !important;color:rgba(255,255,255,.55);font-size:17px;font-weight:700;text-decoration:line-through}',
    '.hzbfc-isla__por{color:#ff4b52;font-size:72px;font-weight:900;line-height:.85;letter-spacing:-.04em}',
    '.hzbfc-isla__regra{margin-top:8px !important;color:rgba(255,255,255,.8);font-size:12px}',
    '.hzbfc-isla__sacola{margin-top:8px !important;padding-top:8px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.8);font-size:12px}',
    '.hzbfc-isla__sacola b{color:#fff;white-space:nowrap}',
    '.hzbfc-isla__foto{display:block;aspect-ratio:3/4;border-radius:10px;overflow:hidden;background:#efefef}',

    /* Black Friday - pregão */
    '.hzbf-cat--black{background:radial-gradient(110% 150% at 100% 0%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 52%),linear-gradient(160deg,#1b1b1b 0%,#080808 58%,#000 100%)}',
    '.hzbfc-pregao{padding:14px 16px 0}',
    '.hzbfc-pregao__topo{display:flex;justify-content:space-between;align-items:center;gap:8px}',
    '.hzbfc-aovivo{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.hzbfc-aovivo .hzbfc-dot{animation:hzbfc-pisca 1.4s infinite}',
    '.hzbfc-pregao__nome{color:rgba(255,255,255,.55);font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}',
    '.hzbfc-pregao__meio{display:flex;align-items:flex-end;gap:14px;margin-top:10px}',
    '.hzbfc-pregao__num{font-size:64px;font-weight:900;line-height:.85;letter-spacing:-.05em;white-space:nowrap}',
    '.hzbfc-pregao__num em{color:#e5262e;font-size:32px;font-style:normal;vertical-align:top}',
    '.hzbfc-pregao__num small{font-size:26px}',
    '.hzbfc-pregao__lado{padding-bottom:4px;line-height:1.25}',
    '.hzbfc-pregao__lado b{display:block;font-size:17px}',
    '.hzbfc-pregao__lado span{color:rgba(255,255,255,.6);font-size:12px}',
    '.hzbfc-grafico{display:block;width:100%;height:76px;margin-top:10px}',
    '.hzbfc-pregao__fim{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;border-top:1px solid rgba(255,255,255,.1)}',
    '.hzbfc-pregao__fim small{color:rgba(255,255,255,.55);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}',
    '.hzbfc-seg{display:inline-flex;align-items:baseline;gap:2px;padding:5px 6px;border-radius:6px;background:rgba(255,255,255,.14);font-size:13px;font-weight:800;line-height:1}',
    '.hzbfc-seg i{font-size:9px;font-style:normal;opacity:.6}',
    '.hzbfc-segs{display:inline-flex;gap:4px}',
    '.hzbfc-cotacoes{margin:0 -16px;padding:8px 0;overflow:hidden;background:rgba(255,255,255,.06);white-space:nowrap}',
    '.hzbfc-cotacoes__trilho{display:inline-flex;animation:hzbfc-corre 38s linear infinite;' + MONO + ';font-size:11px;text-transform:uppercase}',
    '.hzbfc-cotacao{display:inline-flex;gap:6px;padding:0 14px;color:#9a9a9a !important}',
    '.hzbfc-cotacao b{color:#ff4b52}',
    '.hzbfc-cotacao span:last-child{color:#fff}',

    /* Atalhos: ordenações (ideia 7) e faixas de preço (ideia 2) */
    '.hzbf-precos{display:flex;align-items:center;gap:8px;margin:0 0 18px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px}',
    '.hzbf-precos::-webkit-scrollbar{display:none}',
    '.hzbf-precos a{flex:0 0 auto;display:inline-flex;align-items:center;height:34px;padding:0 14px;border:1px solid #d9d9d9;border-radius:999px;background:#fff;color:#000 !important;font-size:13px;font-weight:500;text-decoration:none !important;white-space:nowrap}',
    '.hzbf-precos a.is-active{background:#000;border-color:#000;color:#fff !important}',
    '.hzbf-precos i{flex:0 0 1px;align-self:stretch;margin:6px 2px;background:#d9d9d9}',

    /* Ideia 11: atalhos fixos ao rolar (só celular) */
    '.hzbf-fixo{position:fixed;left:0;right:0;top:0;z-index:150;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:#fff;border-bottom:1px solid #e3e3e3;box-shadow:0 6px 16px rgba(0,0,0,.08);transform:translateY(-110%);transition:transform .2s}',
    '.hzbf-fixo.is-on{transform:none}',
    '.hzbf-fixo .hzbf-precos{margin:0}',

    '@media (min-width:768px){',
    '.hzbf-fixo{display:none}',
    '.hzbfc-cx{min-height:280px;padding:34px 32px 28px}',
    '.hzbfc-cx__fotos{right:28px;top:30px;transform:rotate(5deg)}',
    '.hzbfc-cx__fotos span{width:130px}',
    '.hzbfc-cx__fotos span:nth-child(3){display:block}',
    '.hzbfc-cx__titulo{font-size:64px}',
    '.hzbfc-painel,.hzbfc-pregao{padding-left:28px;padding-right:28px}',
    '.hzbfc-cotacoes{margin:0 -28px}',
    '.hzbfc-isla{grid-template-columns:minmax(0,1fr) 170px;gap:28px;padding:26px 28px}',
    '.hzbfc-isla__por{font-size:96px}',
    '.hzbfc-grafico{height:110px}',
    '}',

    '@media (max-width:600px){',
    '.hzbf-cat{margin:10px 0 14px;border-radius:14px}',
    '.hzbf-cat--app{border-radius:20px}',
    '.hzbfc-painel{padding:12px 10px 14px;font-size:11px}',
    '.hzbfc-painel__linha{grid-template-columns:34px minmax(0,1fr) auto 76px;gap:6px}',
    '.hzbfc-isla{grid-template-columns:minmax(0,1fr) 104px;gap:12px}',
    '.hzbfc-isla__por{font-size:64px}',
    '.hzbfc-cx__fotos{right:4px;top:30px}',
    '.hzbfc-cx__fotos span{width:104px}',
    '.hzbfc-cx__fotos span:nth-child(2){display:none}',
    '.hzbfc-pregao__num{font-size:58px}',
    '}',

    '@media (prefers-reduced-motion:reduce){.hzbf-fixo{transition:none}.hzbfc-cotacoes__trilho,.hzbfc-aovivo .hzbfc-dot,.hzbfc-placa.hzbfc-vira{animation:none}}'
  ].join("");


  /* =========================================================
     HTML - UM CONCEITO POR AÇÃO
  ========================================================= */

  function appBotoes() {

    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/i.test(ua);
    var android = /Android/i.test(ua);
    var html = '';

    if (!android) {
      html += '<a class="hzbfc-btn" href="' + esc(CONFIG.appIos) + '" target="_blank" rel="noopener" data-hzbf-cta>App Store' + SETA + '</a>';
    }

    if (!ios) {
      html += '<a class="hzbfc-btn" href="' + esc(CONFIG.appAndroid) + '" target="_blank" rel="noopener" data-hzbf-cta>Google Play' + SETA + '</a>';
    }

    return html;
  }

  function foto(url) {
    return '<span>' + (url ? '<img src="' + esc(url) + '" alt="" loading="lazy">' : '') + '</span>';
  }

  var CONCEITOS = {

    // Black Hitzz: a caixa Black, com a fita de lacre e as fotos da página
    month: function (m) {

      var produtos = produtosDaPagina(8);
      var fotos = "";

      // Só os produtos com foto, até 3
      for (var i = 0, n = 0; i < produtos.length && n < 3; i++) {

        if (produtos[i].foto) {
          fotos += foto(produtos[i].foto);
          n++;
        }
      }

      return '<div class="hzbfc-cx">' +
        (fotos ? '<div class="hzbfc-cx__fotos" aria-hidden="true">' + fotos + '</div>' : '') +
        '<div class="hzbfc-cx__txt">' +
          '<p class="hzbfc-cx__dia">' + (m.ultimo ? 'Último dia' : 'Dia ' + doisDigitos(diaDaBlack()) + '/30') + '</p>' +
          '<p class="hzbfc-cx__titulo">Black<br>Hitzz</p>' +
          '<p class="hzbfc-cx__oferta">até <b>70% OFF</b></p>' +
          '<p class="hzbfc-cx__sub">' + (m.ultimo ? 'Termina em <span class="hzbfc-tempo" data-hzbf-timer></span>' : 'Botas, flats e tamancos, até 30/11') + '</p>' +
        '</div>' +
      '</div>';
    },

    // Só no app: tela de bloqueio com as notificações do app
    app: function (m) {

      var produto = produtosDaPagina(1)[0];

      return '<div class="hzbfc-lock">' +
        '<p class="hzbfc-lock__data" data-hzbf-data></p>' +
        '<p class="hzbfc-lock__hora" data-hzbf-hora></p>' +
        '<a class="hzbfc-notif" href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>' +
          '<span class="hzbfc-notif__ic" aria-hidden="true">h</span>' +
          '<span class="hzbfc-notif__txt"><small>HITZZ · agora</small>' +
            '<b>' + (m.ultimo ? 'Último dia do Só no app' : 'Só no app começou') + '</b>' +
            '<span>Até 70% OFF + 20% no Pix. Até ' + esc(prazoTexto(m.fimReal)) + '.</span></span>' +
        '</a>' +
        '<a class="hzbfc-notif" href="' + esc(linkDoApp()) + '" target="_blank" rel="noopener" data-hzbf-cta>' +
          '<span class="hzbfc-notif__ic" aria-hidden="true">h</span>' +
          '<span class="hzbfc-notif__txt"><small>HITZZ · termina em <span class="hzbfc-tempo" data-hzbf-timer></span></small>' +
            '<b>No app, mais 20% OFF no Pix</b>' +
            '<span>' + (produto ? esc(produto.nome) + ': −' + formatBRL(produto.por * 0.2) + ' a mais no app' : 'Em cima dos preços da Black') + '</span></span>' +
          (produto && produto.foto ? '<span class="hzbfc-notif__foto">' + '<img src="' + esc(produto.foto) + '" alt="" loading="lazy"></span>' : '') +
        '</a>' +
        '<i class="hzbfc-notif-pilha" aria-hidden="true"></i>' +
        '<div class="hzbfc-lojas">' + appBotoes() + '</div>' +
      '</div>';
    },

    // 11.11: painel de embarque com os primeiros Hitzz da página
    "1111": function (m) {

      var produtos = produtosDaPagina(4);
      var linhas = "";

      for (var i = 0; i < produtos.length; i++) {
        linhas += '<a class="hzbfc-painel__linha" href="' + esc(produtos[i].url) + '" data-hzbf-cta>' +
          '<span>' + doisDigitos(i + 1) + '/24</span>' +
          '<span>' + esc(produtos[i].nome) + '</span>' +
          '<span>' + (produtos[i].economia > 0 ? '−' + formatBRL(produtos[i].economia) : '—') + '</span>' +
          '<span class="hzbfc-painel__st">Embarque</span>' +
        '</a>';
      }

      return '<div class="hzbfc-painel">' +
        '<div class="hzbfc-painel__topo"><span>✈ Partidas · 11.11</span><em>' + (m.ultimo ? 'Últimas horas' : '24 horas') + '</em></div>' +
        (linhas ? '<div class="hzbfc-painel__linha hzbfc-painel__linha--cab"><span>Nº</span><span>Hitzz</span><span>Economia</span><span>Status</span></div>' + linhas : '') +
        '<div class="hzbfc-painel__fim"><small>Encerra em</small><span class="hzbfc-placas" data-hzbfc-painel></span></div>' +
        '<a class="hzbfc-btn" href="' + esc(CONFIG.url1111) + '" data-hzbf-cta>Ver os 24 Hitzz' + SETA + '</a>' +
      '</div>';
    },

    // Isla: o preço cheio riscado, o R$1 grande e a sacola da cliente
    isla: function (m) {

      return '<div class="hzbfc-isla">' +
        '<div>' +
          '<p class="hzbfc-isla__nome">' + (m.ultimo ? 'Último dia · ' : '') + 'Isla Marrom</p>' +
          '<p class="hzbfc-isla__de">' + formatBRL(CONFIG.precoIsla) + '</p>' +
          '<p class="hzbfc-isla__por">R$1</p>' +
          '<p class="hzbfc-isla__regra">em compras acima de R$999, até ' + esc(prazoTexto(m.fimReal)) + '</p>' +
          '<p class="hzbfc-isla__sacola" data-hzbf-falta></p>' +
        '</div>' +
        '<a class="hzbfc-isla__foto" href="' + esc(CONFIG.urlIsla) + '" data-hzbf-cta><img src="' + esc(CONFIG.imgIsla) + '" alt="Isla Marrom" loading="lazy"></a>' +
      '</div>';
    },

    // Black Friday: pregão, com gráfico em queda e as cotações da página
    black: function (m) {

      var produtos = produtosDaPagina(8);
      var cotacoes = "";

      for (var i = 0; i < produtos.length; i++) {

        if (produtos[i].queda > 0) {
          cotacoes += '<a class="hzbfc-cotacao" href="' + esc(produtos[i].url) + '" data-hzbf-cta><span>' + esc(produtos[i].nome) + '</span><b>▼' + produtos[i].queda + '%</b><span>−' + formatBRL(produtos[i].economia) + '</span></a>';
        }
      }

      return '<div class="hzbfc-pregao">' +
        '<div class="hzbfc-pregao__topo"><span class="hzbfc-aovivo">' + DOT + 'Ao vivo</span><span class="hzbfc-pregao__nome">' + (m.ultimo ? 'Último pregão' : 'Pregão Black Friday') + '</span></div>' +
        '<div class="hzbfc-pregao__meio"><p class="hzbfc-pregao__num"><em>▼</em>70<small>%</small></p><p class="hzbfc-pregao__lado"><b>+20% no Pix</b><span>sem cupom</span></p></div>' +
        '<svg class="hzbfc-grafico" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">' +
          '<g stroke="rgba(255,255,255,.08)" stroke-width="1"><line x1="0" y1="10" x2="300" y2="10"/><line x1="0" y1="40" x2="300" y2="40"/><line x1="0" y1="70" x2="300" y2="70"/></g>' +
          '<polygon points="0,10 40,16 70,14 100,30 130,27 160,46 190,42 220,58 260,63 296,72 296,80 0,80" fill="rgba(229,38,46,.16)"/>' +
          '<polyline points="0,10 40,16 70,14 100,30 130,27 160,46 190,42 220,58 260,63 296,72" fill="none" stroke="#e5262e" stroke-width="2.5" vector-effect="non-scaling-stroke"/>' +
        '</svg>' +
        '<div class="hzbfc-pregao__fim"><small>Fechamento ' + esc(prazoTexto(m.fimReal)) + '</small><span class="hzbfc-segs" data-hzbfc-segs></span></div>' +
        (cotacoes ? '<div class="hzbfc-cotacoes" aria-label="Cotações"><span class="hzbfc-cotacoes__trilho">' + cotacoes + cotacoes + '</span></div>' : '') +
      '</div>';
    }
  };


  // URL com os mesmos filtros e ordenação da página, trocando só o que for pedido
  function montarUrl(trocar) {

    var params = new URLSearchParams(window.location.search);
    var novo = new URLSearchParams();

    params.forEach(function (valor, chave) {

      var ehOrdem = chave.indexOf("sorting") === 0;
      var ehPreco = chave === "filters[][price_sell]";

      if ((ehOrdem && !trocar.ordem) || (ehPreco && !trocar.preco)) {
        novo.append(chave, valor);
      }
    });

    if (trocar.ordem && trocar.ordem.chave) {
      novo.append(trocar.ordem.chave, trocar.ordem.valor);
    }

    if (trocar.preco && trocar.preco.valores) {

      for (var i = 0; i < trocar.preco.valores.length; i++) {
        novo.append("filters[][price_sell]", trocar.preco.valores[i]);
      }
    }

    var qs = novo.toString();

    return window.location.pathname + (qs ? "?" + qs : "");
  }

  function faixaAtiva(faixa) {

    var ativos = new URLSearchParams(window.location.search).getAll("filters[][price_sell]");

    if (ativos.length !== faixa.valores.length) {
      return false;
    }

    for (var i = 0; i < faixa.valores.length; i++) {

      if (ativos.indexOf(faixa.valores[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  function ordemAtiva(ordem) {
    return new URLSearchParams(window.location.search).get(ordem.chave) === ordem.valor;
  }

  function atalhosHTML() {

    var html = '';

    if (IDEIAS.ordenacoes) {

      for (var i = 0; i < ORDENACOES.length; i++) {

        var ativa = ordemAtiva(ORDENACOES[i]);

        // Clicar na ordenação ativa volta à ordem padrão
        var url = montarUrl({ ordem: ativa ? {} : ORDENACOES[i] });

        html += '<a href="' + esc(url) + '" data-hzbf-atalho="ordem"' + (ativa ? ' class="is-active" aria-current="true"' : '') + '>' + esc(ORDENACOES[i].nome) + '</a>';
      }
    }

    if (IDEIAS.faixasDePreco) {

      if (html) {
        html += '<i aria-hidden="true"></i>';
      }

      for (var j = 0; j < FAIXAS.length; j++) {

        var ativaF = faixaAtiva(FAIXAS[j]);

        // Clicar na faixa ativa tira o filtro
        var urlF = montarUrl({ preco: ativaF ? {} : FAIXAS[j] });

        html += '<a href="' + esc(urlF) + '" data-hzbf-atalho="preco"' + (ativaF ? ' class="is-active" aria-current="true"' : '') + '>' + esc(FAIXAS[j].nome) + '</a>';
      }
    }

    return html;
  }


  /* =========================================================
     POSICIONAMENTO
  ========================================================= */

  function montarBloco(m) {

    // Desktop: .row-title seguido de .row-filters. Mobile: só a linha do
    // título dentro de .products-filter, com os filtros logo depois.
    var h1 = document.querySelector(SELETOR_TITULO);
    var titulo = h1 && (h1.closest(".row") || h1);

    if (!titulo || !titulo.parentNode) {
      return;
    }

    var bloco = document.getElementById(ID);

    if (!bloco) {

      bloco = document.createElement("section");

      bloco.id = ID;
      bloco.className = "hzbf-cat hzbf-cat--" + m.id + (m.ultimo ? " hzbf-cat--ultimo" : "");

      bloco.setAttribute("aria-label", "Black Hitzz");

      bloco.innerHTML = CONCEITOS[m.id](m);
    }

    if (bloco.previousElementSibling !== titulo) {
      titulo.parentNode.insertBefore(bloco, titulo.nextSibling);
    }

    var html = atalhosHTML();

    if (!html) {
      return;
    }

    var atalhos = document.getElementById(ID + "-precos");

    if (!atalhos) {

      atalhos = document.createElement("nav");

      atalhos.id = ID + "-precos";
      atalhos.className = "hzbf-precos";

      atalhos.setAttribute("aria-label", "Atalhos da Black");

      atalhos.innerHTML = html;
    }

    if (atalhos.previousElementSibling !== bloco) {
      bloco.parentNode.insertBefore(atalhos, bloco.nextSibling);
    }

    if (IDEIAS.atalhosFixos && !document.getElementById(ID + "-fixo")) {

      var fixo = document.createElement("div");

      fixo.id = ID + "-fixo";
      fixo.className = "hzbf-fixo";

      fixo.setAttribute("aria-hidden", "true");

      fixo.innerHTML = '<nav class="hzbf-precos" aria-label="Atalhos da Black">' + html + '</nav>';

      document.body.appendChild(fixo);

      verificarFixo();
    }
  }


  /* =========================================================
     IDEIA 11 - ATALHOS FIXOS AO ROLAR
  ========================================================= */

  var fixoFrame = null;

  function verificarFixo() {

    var atalhos = document.getElementById(ID + "-precos");
    var fixo = document.getElementById(ID + "-fixo");

    if (!atalhos || !fixo) {
      return;
    }

    // Aparece depois que os atalhos originais saem da tela pelo topo
    var ligado = atalhos.getBoundingClientRect().bottom < 0;

    if (fixo.classList.contains("is-on") !== ligado) {
      fixo.classList.toggle("is-on", ligado);
      fixo.setAttribute("aria-hidden", ligado ? "false" : "true");
    }
  }

  window.addEventListener("scroll", function () {

    if (fixoFrame) {
      return;
    }

    fixoFrame = requestAnimationFrame(function () {
      fixoFrame = null;
      verificarFixo();
    });

  }, { passive: true });


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

  function remover() {

    var antigos = [document.getElementById(ID), document.getElementById(ID + "-precos"), document.getElementById(ID + "-fixo")];

    for (var i = 0; i < antigos.length; i++) {

      if (antigos[i]) {
        antigos[i].remove();
      }
    }
  }

  function montar() {

    var m = paginaBlack() ? momentoDaAcao() : null;

    var chave = m ? m.id + (m.ultimo ? "+ultimo" : "") : null;

    if (chave !== estadoRenderizado) {
      remover();
      estadoRenderizado = chave;
    }

    if (!m) {
      return;
    }

    adicionarEstilo();

    montarBloco(m);

    atualizar(m);
  }


  /* =========================================================
     TIMER, RELÓGIO E SACOLA
  ========================================================= */

  function definir(el, html) {

    if (el && el._hzbfHtml !== html) {
      el._hzbfHtml = html;
      el.innerHTML = html;
    }
  }

  // 11.11: uma placa por caractere; só a placa que mudou vira
  function atualizarPainel(el, texto) {

    if (el.children.length !== texto.length) {

      var html = "";

      for (var i = 0; i < texto.length; i++) {
        html += texto.charAt(i) === ":" ? '<span class="hzbfc-sep">:</span>' : '<span class="hzbfc-placa"></span>';
      }

      el.innerHTML = html;
    }

    for (var j = 0; j < texto.length; j++) {

      var placa = el.children[j];
      var c = texto.charAt(j);

      if (c !== ":" && placa.textContent !== c) {
        placa.textContent = c;
        placa.classList.remove("hzbfc-vira");
        void placa.offsetWidth;
        placa.classList.add("hzbfc-vira");
      }
    }
  }

  function atualizar(m) {

    var bloco = document.getElementById(ID);

    if (!bloco) {
      return;
    }

    var restante = Math.max(0, Math.floor((m.fim - Date.now()) / 1000));
    var dias = Math.floor(restante / 86400);
    var h = Math.floor(restante % 86400 / 3600);
    var min = Math.floor(restante % 3600 / 60);
    var s = restante % 60;

    var texto = (dias > 0 ? dias + "d " : "") + doisDigitos(h) + ":" + doisDigitos(min) + ":" + doisDigitos(s);
    var timers = bloco.querySelectorAll("[data-hzbf-timer]");

    for (var i = 0; i < timers.length; i++) {

      if (timers[i].textContent !== texto) {
        timers[i].textContent = texto;
      }
    }

    function seg(valor, rotulo) {
      return '<span class="hzbfc-seg">' + doisDigitos(valor) + '<i>' + rotulo + '</i></span>';
    }

    definir(bloco.querySelector("[data-hzbfc-segs]"),
      (dias > 0 ? seg(dias, "D") : "") + seg(h, "H") + seg(min, "M") + (dias > 0 ? "" : seg(s, "S")));

    var painel = bloco.querySelector("[data-hzbfc-painel]");

    if (painel) {
      atualizarPainel(painel, doisDigitos(Math.min(99, Math.floor(restante / 3600))) + ":" + doisDigitos(min) + ":" + doisDigitos(s));
    }

    // Só no app: data e hora de agora, como na tela de bloqueio
    var agora = agoraBrasilia();

    definir(bloco.querySelector("[data-hzbf-data]"),
      DIAS_LONGOS[agora.getUTCDay()] + ", " + agora.getUTCDate() + " de " + MESES[agora.getUTCMonth()]);
    definir(bloco.querySelector("[data-hzbf-hora]"),
      doisDigitos(agora.getUTCHours()) + ":" + doisDigitos(agora.getUTCMinutes()));

    // Isla: a sacola de verdade e quanto falta
    var sacola = valorDaSacola();
    var falta = CONFIG.minimoIsla - sacola;

    definir(bloco.querySelector("[data-hzbf-falta]"), falta > 0
      ? 'Sua sacola: <b>' + formatBRL(sacola) + '</b> · faltam <b>' + formatBRL(falta) + '</b>'
      : 'Sua sacola já passou de R$999: <b>a Isla sai por R$1</b>');
  }


  /* =========================================================
     EVENTOS DE CLIQUE (para medir no GA / MarketDock)
  ========================================================= */

  document.addEventListener("click", function (event) {

    var alvo = event.target && event.target.closest &&
      event.target.closest("#" + ID + " [data-hzbf-cta], .hzbf-precos [data-hzbf-atalho]");

    if (!alvo) {
      return;
    }

    try {

      var m = momentoDaAcao();
      var atalho = alvo.getAttribute("data-hzbf-atalho");

      (window.dataLayer = window.dataLayer || []).push({
        event: "hzbf_clique",
        hzbf_local: atalho
          ? (alvo.closest("#" + ID + "-fixo") ? "categoria_atalho_fixo_" : "categoria_atalho_") + atalho
          : "categoria",
        hzbf_acao: m ? m.id : "",
        hzbf_texto: alvo.textContent.trim().slice(0, 60)
      });

    } catch (erro) { }
  });


  /* =========================================================
     OBSERVER
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

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }


  /* =========================================================
     START
  ========================================================= */

  function init() {

    montar();

    iniciarObserver();

    setInterval(montar, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
