(function () {
  "use strict";

  /* =========================================================
     HITZZ - BLACK EM TELA CHEIA PELO CLIMA
     A Black no formato de stories: uma peça por tela, como no
     Instagram. A ordem muda conforme a previsão do tempo da cidade
     da cliente: se vai esfriar em Curitiba, começa pelas botas; se
     vai fazer calor no Rio, pelos tamancos.

     - Cidade: pelo IP (get.geojs.io) ou pelo link com ?cidade=Curitiba
     - Previsão: Open-Meteo (gratuita, sem chave, sem cadastro)
     - Peças: lidas da categoria CONFIG.categoriaUrl, na ordem do admin
     - Botão "Recomendados para o seu clima" nas páginas de CONFIG.entradas
     - Quem chega do Instagram, ou pelo link com ?black=tela-cheia,
       já entra direto na tela cheia
     - Adiciona à sacola pela mesma rota da compra rápida da UOOU

     Para testar:
       /?cidade=Curitiba                 botão com o clima de Curitiba
       /?cidade=Manaus&black=tela-cheia  abre direto, ordem de calor
     A cidade do link fica guardada no navegador por CONFIG.cacheClimaHoras;
     para voltar à cidade do IP, limpe "hz-black-clima" do localStorage.
  ========================================================= */

  if (window.__hzBlackClimaLoaded) {
    return;
  }

  window.__hzBlackClimaLoaded = true;


  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  var CONFIG = {
    titulo: "Black Hitzz",
    categoriaUrl: "/categorizacao/promo",
    maxPaginas: 3,       // páginas da categoria lidas (40 peças cada)
    maxPecas: 24,        // peças na tela cheia
    segundosPorPeca: 7,  // tempo de cada peça antes de passar sozinha
    freteGratis: 499.90,

    // Onde o botão de entrada aparece
    entradas: [
      { pagina: "/", seletor: ".responsive-banner-widescreen-v2", posicao: "afterend" },
      { pagina: "/categorizacao/promo", seletor: ".category-fullwidth-products", posicao: "beforebegin" }
    ],

    abrirDoInstagram: true,
    parametroAbrir: "black",    // ?black=tela-cheia abre direto
    parametroCidade: "cidade",  // ?cidade=Curitiba troca a cidade

    clima: {
      dias: 5,          // dias olhados à frente, contando hoje
      frioMaxima: 19,   // dia com máxima até 19°C = frio
      frioMinima: 10,   // ou mínima até 10°C
      calorMaxima: 29,  // dia com máxima a partir de 29°C = calor
      chuvaChance: 75   // chance de chuva a partir de 75% = chuva
    },

    // Grupos de peça pelo nome do produto. Vale o primeiro grupo da
    // lista que bater: "BOTA TAMANCO" é bota, "PAPETE PELOS" é peludinho
    grupos: [
      { id: "botas", comeco: "pelas botas", termos: ["BOTA", "COTURNO"] },
      { id: "pelos", comeco: "pelos peludinhos", termos: ["PELO", "PELUCIA", "PELUCIADO", "PELUCIADA"] },
      { id: "tamancos", comeco: "pelos tamancos", termos: ["TAMANCO", "TAMANCA"] },
      { id: "sandalias", comeco: "pelas sandálias", termos: ["SANDALIA", "RASTEIRA", "PAPETE", "CHINELO"] },
      { id: "fechados", comeco: "pelos sapatos fechados", termos: ["TENIS", "MOCASSIM", "SAPATILHA", "SCARPIN", "SLINGBACK", "MULE", "CLOG", "SAPATO", "LOAFER"] }
    ],

    // Ordem dos grupos para cada clima. Vazio = ordem da categoria
    ordens: {
      frio: ["botas", "pelos", "fechados", "tamancos", "sandalias"],
      chuva: ["fechados", "botas", "tamancos", "pelos", "sandalias"],
      calor: ["tamancos", "sandalias", "fechados", "botas", "pelos"],
      ameno: []
    },

    // Botão de entrada
    selo: "Recomendados para o seu clima",
    chamadas: {
      frio: "Separamos o que aquece",
      calor: "Separamos o que refresca",
      chuva: "Separamos o que encara a chuva",
      ameno: "Separamos o melhor da Black pra você",
      semCidade: "A Black em tela cheia"
    },

    // Cidades que não levam "em" na frase
    cidades: {
      "Rio de Janeiro": "no Rio"
    },

    cacheClimaHoras: 3,
    cachePecasMinutos: 10
  };

  var STYLE_ID = "hz-black-clima-style";
  var CACHE_CLIMA = "hz-black-clima";
  var CACHE_PECAS = "hz-black-clima-pecas";
  var CHAVE_NUMERO = "hz-black-clima-numero";
  var CHAVE_AUTO = "hz-black-clima-auto";

  var DIAS = ["no domingo", "na segunda", "na terça", "na quarta", "na quinta", "na sexta", "no sábado"];

  var ICONES = {
    frio: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"/>',
    calor: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    chuva: '<path d="M7 14h10a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.8 6.3 4 4 0 0 0 7 14zM8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
    ameno: '<path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z"/>'
  };

  var dados = null;  // { pecas, clima }
  var ui = null;
  var reduzirMovimento = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);


  /* =========================================================
     UTILIDADES
  ========================================================= */

  function caminhoAtual() {
    return window.location.pathname.replace(/\/+$/, "") || "/";
  }

  function paramUrl(nome) {

    var busca = new RegExp("[?&]" + nome + "=([^&#]*)").exec(window.location.search);

    return busca ? decodeURIComponent(busca[1].replace(/\+/g, " ")) : "";
  }

  function semAcento(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toUpperCase();
  }

  function formatarBRL(valor) {
    return "R$ " + valor
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function lerBRL(texto) {

    var valor = parseFloat(String(texto)
      .replace(/[^0-9.,]/g, "")
      .replace(/\./g, "")
      .replace(",", "."));

    return isNaN(valor) ? 0 : valor;
  }

  function capitalizar(texto) {
    return texto.toLowerCase().replace(/(^|\s)\S/g, function (letra) {
      return letra.toUpperCase();
    });
  }

  function lerLocal(chave, armazenamento) {

    try {
      return JSON.parse(window[armazenamento].getItem(chave));
    } catch (erro) { }

    return null;
  }

  function gravarLocal(chave, valor, armazenamento) {

    try {
      window[armazenamento].setItem(chave, JSON.stringify(valor));
    } catch (erro) { }
  }

  function el(tag, classe, texto) {

    var elemento = document.createElement(tag);

    if (classe) {
      elemento.className = classe;
    }

    if (texto !== undefined) {
      elemento.textContent = texto;
    }

    return elemento;
  }

  function icone(humor) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      ICONES[humor] + "</svg>";
  }

  function registrar(acao, extra) {

    window.dataLayer = window.dataLayer || [];

    var evento = {
      event: "hz_black_clima",
      acao: acao,
      humor: dados ? dados.clima.humor : "",
      cidade: dados ? dados.clima.cidade : ""
    };

    for (var chave in extra) {
      evento[chave] = extra[chave];
    }

    window.dataLayer.push(evento);
  }


  /* =========================================================
     CSS
  ========================================================= */

  var CSS = [
    /* ---------- Botão de entrada ---------- */
    '.hz-bc-entrada{box-sizing:border-box;max-width:1200px;margin:16px auto 24px;padding:0 15px;font-family:inherit;text-align:left}',
    '.hz-bc-entrada *{box-sizing:border-box}',

    '.hz-bc-chamada{appearance:none;-webkit-appearance:none;display:flex!important;flex-direction:column;gap:8px;width:100%;margin:0!important;padding:14px 16px!important;border:0!important;border-radius:8px!important;background:#111!important;color:#fff!important;font:inherit;text-align:left;text-transform:none;letter-spacing:normal;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.14)!important;transition:transform .15s}',
    '.hz-bc-chamada:active{transform:scale(.985)}',
    '.hz-bc-chamada:focus-visible{outline:2px solid #111;outline-offset:3px}',

    '.hz-bc-chamada__topo,.hz-bc-chamada__corpo{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%}',

    /* Fotos em bolinha com o aro dos stories */
    '.hz-bc-chamada__fotos{flex:none;display:flex;padding-left:9px}',
    '.hz-bc-chamada__foto{display:block;width:32px;height:32px;margin-left:-9px;padding:2px;border-radius:50%;background:linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)}',
    '.hz-bc-chamada__foto img{display:block;width:100%;height:100%;border:2px solid #111;border-radius:50%;object-fit:cover;background:#eee}',

    '.hz-bc-chamada__textos{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}',
    '.hz-bc-chamada__selo{display:flex;align-items:center;gap:6px;min-width:0;color:#c9c9c9;font-size:10px;font-weight:700;line-height:1.2;letter-spacing:.1em;text-transform:uppercase}',
    '.hz-bc-chamada__selo svg{flex:none;width:13px;height:13px}',
    '.hz-bc-chamada__titulo{font-size:17px;font-weight:800;line-height:1.2}',
    '.hz-bc-chamada__fato{color:#c9c9c9;font-size:12px;line-height:1.3}',

    '.hz-bc-chamada__play{flex:none;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#fff;color:#111}',
    '.hz-bc-chamada__play svg{width:11px;height:12px;margin-left:2px}',

    '@media (min-width:768px){',
    '.hz-bc-chamada{max-width:560px;margin:0 auto!important}',
    '.hz-bc-chamada__titulo{font-size:18px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.hz-bc-chamada{transition:none}}',

    /* ---------- Tela cheia ---------- */
    'html.hz-bc-aberto,html.hz-bc-aberto body{overflow:hidden!important}',
    /* Selos flutuantes da loja (VIP, WhatsApp) não ficam por cima da tela cheia */
    'html.hz-bc-aberto #etr-vip-safe-popup{display:none!important}',
    '.hz-bc{position:fixed;inset:0;z-index:2147483647;background:#0d0d0d;color:#fff;font-family:inherit;-webkit-tap-highlight-color:transparent}',
    '.hz-bc *{box-sizing:border-box}',
    '.hz-bc p{margin:0}',
    '.hz-bc button{appearance:none;-webkit-appearance:none;margin:0;padding:0;border:0;background:none;font:inherit;color:inherit;text-transform:none;letter-spacing:normal;line-height:inherit;cursor:pointer;box-shadow:none;min-height:0}',
    '.hz-bc button:focus-visible,.hz-bc a:focus-visible{outline:2px solid #fff;outline-offset:2px}',

    '.hz-bc__palco{position:relative;width:100%;max-width:460px;height:100%;margin:0 auto;overflow:hidden;overflow:clip;background:#8c7a66;touch-action:none;user-select:none;-webkit-user-select:none}',
    '.hz-bc__fundo{position:absolute;inset:-12%;background-position:center;background-size:cover;filter:blur(30px) sepia(.45) saturate(1.1) brightness(.8);transform:scale(1.1)}',
    '.hz-bc__veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.38) 0,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 48%,rgba(0,0,0,.7) 100%)}',

    '.hz-bc__barras{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);left:10px;right:10px;display:flex;gap:3px;z-index:3}',
    '.hz-bc__barra{flex:1;height:2px;overflow:hidden;border-radius:2px;background:rgba(255,255,255,.35)}',
    '.hz-bc__barra i{display:block;width:0;height:100%;background:#fff}',

    '.hz-bc__topo{position:absolute;top:calc(env(safe-area-inset-top,0px) + 20px);left:12px;right:4px;display:flex;align-items:center;gap:8px;z-index:3;font-size:12px;line-height:1.2}',
    '.hz-bc__avatar{flex:none;display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#111;color:#fff;font-size:12px;font-weight:800;box-shadow:0 0 0 1.5px rgba(255,255,255,.7)}',
    '.hz-bc__legenda{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-shadow:0 1px 2px rgba(0,0,0,.35)}',
    '.hz-bc__legenda b{font-weight:700}',
    '.hz-bc__fechar{flex:none;display:flex!important;align-items:center;justify-content:center;width:40px;height:40px}',
    '.hz-bc__fechar svg{width:22px;height:22px}',

    '.hz-bc__foto{position:absolute;top:calc(env(safe-area-inset-top,0px) + 66px);bottom:calc(env(safe-area-inset-bottom,0px) + 214px);left:28px;right:28px;display:flex;align-items:center;justify-content:center;z-index:1;pointer-events:none}',
    '.hz-bc__foto img{display:block;height:100%;max-width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:14px;background:#efefef;box-shadow:0 18px 40px rgba(0,0,0,.28)}',

    '.hz-bc__info{position:absolute;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);z-index:3;transition:transform .2s}',
    '.hz-bc__nome{font-size:14px;font-weight:700;line-height:1.3;text-transform:uppercase;text-shadow:0 1px 2px rgba(0,0,0,.3)}',
    '.hz-bc__preco{margin-top:6px!important;font-size:12px}',
    '.hz-bc__preco b{margin-right:4px;font-size:22px;font-weight:800}',
    '.hz-bc__preco s{margin-left:6px;opacity:.65}',

    '.hz-bc__tamanhos{display:flex;justify-content:center;gap:4px;margin-top:12px;padding:4px;border:1px solid rgba(255,255,255,.55);border-radius:4px}',
    '.hz-bc__tamanho{flex:0 1 40px;height:30px;border:1px solid rgba(255,255,255,.35)!important;border-radius:3px;font-size:13px!important;font-weight:600!important}',
    '.hz-bc__tamanho[aria-pressed=true]{background:#fff!important;color:#111!important;border-color:#fff!important}',
    '.hz-bc__tamanho:disabled{opacity:.3;text-decoration:line-through;cursor:default}',
    '.hz-bc__tamanhos.hz-bc--chamar{animation:hz-bc-chamar .45s}',

    '.hz-bc__dica{display:flex!important;flex-direction:column;align-items:center;gap:2px;width:100%;padding:10px 0 2px!important;font-size:12px!important;font-weight:700!important;letter-spacing:.08em!important}',
    '.hz-bc__dica svg{width:16px;height:16px;animation:hz-bc-subir 1.6s ease-in-out infinite}',

    '.hz-bc__aviso{position:absolute;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 200px);z-index:4;padding:10px 12px;border-radius:6px;background:#fff;color:#111;font-size:13px;text-align:center;opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;pointer-events:none}',
    '.hz-bc__aviso.hz-bc--visivel{opacity:1;transform:none}',

    /* Camada da sacola e do fim */
    '.hz-bc__camada{position:absolute;inset:0;z-index:5;display:none;flex-direction:column;align-items:center;justify-content:center;padding:24px 22px calc(env(safe-area-inset-bottom,0px) + 70px);background:rgba(40,32,24,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.hz-bc__camada.hz-bc--visivel{display:flex}',
    '.hz-bc__caixa{width:100%;max-width:340px;padding:18px 16px 14px;border-radius:10px;background:#fff;color:#111;box-shadow:0 18px 50px rgba(0,0,0,.3);animation:hz-bc-entrar .25s ease-out}',
    '.hz-bc__caixa-titulo{font-size:16px;font-weight:800;line-height:1.3}',
    '.hz-bc__caixa-texto{margin-top:6px!important;font-size:13px;line-height:1.4;color:#444}',
    '.hz-bc__frete{height:6px;margin-top:10px;overflow:hidden;border-radius:999px;background:#e8e8e8}',
    '.hz-bc__frete i{display:block;height:100%;width:0;border-radius:inherit;background:#111;transition:width .6s ease-out}',
    '.hz-bc__finalizar{display:flex;align-items:center;justify-content:center;height:44px;margin-top:14px;border-radius:5px;background:#2ea44f;color:#fff!important;font-size:13px;font-weight:800;letter-spacing:.08em;text-decoration:none!important}',
    '.hz-bc__continuar{display:block!important;width:100%;margin-top:12px!important;font-size:12px!important;text-decoration:underline!important;text-align:center}',
    '.hz-bc__proxima{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);font-size:12px!important;font-weight:700!important;letter-spacing:.08em!important;text-align:center}',

    '.hz-bc__carregando{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center}',
    '.hz-bc__carregando i{width:34px;height:34px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:hz-bc-girar .8s linear infinite}',

    /* Setas só no computador */
    '.hz-bc__seta{position:absolute;top:50%;z-index:2;display:none!important;align-items:center;justify-content:center;width:44px;height:44px;margin-top:-22px!important;border-radius:50%!important;background:rgba(255,255,255,.9)!important;color:#111!important}',
    '.hz-bc__seta svg{width:20px;height:20px}',
    '@media (min-width:768px){',
    '.hz-bc__seta{display:flex!important}',
    '.hz-bc__seta--anterior{left:calc(50% - 290px)}',
    '.hz-bc__seta--proxima{right:calc(50% - 290px)}',
    '.hz-bc__palco{border-radius:0}',
    '}',

    '@keyframes hz-bc-subir{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '@keyframes hz-bc-chamar{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}',
    '@keyframes hz-bc-entrar{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
    '@keyframes hz-bc-girar{to{transform:rotate(360deg)}}',

    '@media (prefers-reduced-motion:reduce){',
    '.hz-bc__dica svg,.hz-bc__tamanhos.hz-bc--chamar,.hz-bc__caixa{animation:none}',
    '.hz-bc__frete i,.hz-bc__info,.hz-bc__aviso{transition:none}',
    '}'
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
     CIDADE E PREVISÃO
  ========================================================= */

  function buscarJson(url) {
    return fetch(url).then(function (resposta) {
      if (!resposta.ok) {
        throw new Error(resposta.status);
      }
      return resposta.json();
    });
  }

  // Cidade escolhida no link (?cidade=) ou a do IP
  function descobrirLocal(cidadeLink) {

    if (cidadeLink) {
      return buscarJson(
        "https://geocoding-api.open-meteo.com/v1/search?count=1&language=pt&countryCode=BR&name=" +
        encodeURIComponent(cidadeLink)
      ).then(function (json) {

        var achou = json.results && json.results[0];

        if (!achou) {
          throw new Error("cidade");
        }

        return { cidade: achou.name, lat: achou.latitude, lon: achou.longitude };
      });
    }

    return buscarJson("https://get.geojs.io/v1/ip/geo.json").then(function (json) {

      if (!json.city || !json.latitude) {
        throw new Error("ip");
      }

      return { cidade: json.city, lat: +json.latitude, lon: +json.longitude };
    });
  }

  function buscarPrevisao(local) {
    return buscarJson(
      "https://api.open-meteo.com/v1/forecast?timezone=auto&forecast_days=7" +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&latitude=" + local.lat + "&longitude=" + local.lon
    ).then(function (json) {
      return json.daily;
    });
  }

  function carregarClima() {

    var cidadeLink = paramUrl(CONFIG.parametroCidade);
    var cache = lerLocal(CACHE_CLIMA, "localStorage");

    // A cidade do link fica guardada: o resto da visita segue nela
    if (!cidadeLink && cache && cache.cidadeLink) {
      cidadeLink = cache.cidadeLink;
    }

    var chave = cidadeLink || "ip";

    if (cache && cache.chave === chave &&
      Date.now() - cache.em < CONFIG.cacheClimaHoras * 3600000) {
      return Promise.resolve(cache);
    }

    var local;

    return descobrirLocal(cidadeLink)
      .then(function (achado) {
        local = achado;
        return buscarPrevisao(local);
      })
      .then(function (previsao) {

        var novo = {
          em: Date.now(),
          chave: chave,
          cidadeLink: cidadeLink,
          local: local,
          previsao: previsao
        };

        gravarLocal(CACHE_CLIMA, novo, "localStorage");

        return novo;
      });
  }

  function hojeIso() {

    var hoje = new Date();

    return hoje.getFullYear() + "-" +
      ("0" + (hoje.getMonth() + 1)).slice(-2) + "-" +
      ("0" + hoje.getDate()).slice(-2);
  }

  // Lê a previsão e decide o "humor" da Black: frio, calor, chuva ou ameno
  function lerHumor(cache) {

    var semClima = { humor: "ameno", cidade: "", dia: null };

    if (!cache || !cache.previsao || !cache.previsao.time) {
      return semClima;
    }

    var p = cache.previsao;
    var c = CONFIG.clima;
    var hoje = hojeIso();
    var dias = [];

    for (var i = 0; i < p.time.length && dias.length < c.dias; i++) {

      if (p.time[i] < hoje) {
        continue;
      }

      var partes = p.time[i].split("-");

      dias.push({
        i: dias.length,
        data: new Date(+partes[0], +partes[1] - 1, +partes[2]),
        max: p.temperature_2m_max[i],
        min: p.temperature_2m_min[i],
        chuva: p.precipitation_probability_max[i] || 0
      });
    }

    if (!dias.length) {
      return semClima;
    }

    function primeiro(teste) {
      for (var j = 0; j < dias.length; j++) {
        if (teste(dias[j])) {
          return dias[j];
        }
      }
      return null;
    }

    var resultado = { cidade: cache.local.cidade, dia: dias[0], humor: "ameno" };

    var frio = primeiro(function (d) { return d.max <= c.frioMaxima || d.min <= c.frioMinima; });
    var calor = primeiro(function (d) { return d.max >= c.calorMaxima; });
    var chuva = primeiro(function (d) { return d.chuva >= c.chuvaChance; });

    if (frio) {
      resultado.humor = "frio";
      resultado.dia = frio;
    } else if (calor) {
      resultado.humor = "calor";
      resultado.dia = calor;
    } else if (chuva) {
      resultado.humor = "chuva";
      resultado.dia = chuva;
    }

    return resultado;
  }

  function naCidade(cidade) {
    return CONFIG.cidades[cidade] || "em " + cidade;
  }

  function quando(dia) {

    if (dia.i === 0) {
      return "hoje";
    }

    if (dia.i === 1) {
      return "amanhã";
    }

    return DIAS[dia.data.getDay()];
  }

  // Frases do botão de entrada e da legenda da tela cheia
  function textos(clima, pecas) {

    var lugar = clima.cidade ? naCidade(clima.cidade) : "";
    var d = clima.dia;
    var t = { titulo: "", temp: "", legenda: "" };

    if (!clima.cidade) {
      t.titulo = "A Black inteira, uma peça por tela.";
    } else if (clima.humor === "frio") {
      t.titulo = (d.i === 0 ? "Frio " + lugar + " hoje." : "Esfria " + lugar + " " + quando(d) + ".");
      t.temp = "mín. " + Math.round(d.min) + "°";
      t.legenda = "frio " + lugar;
    } else if (clima.humor === "calor") {
      t.titulo = (d.i === 0 ? "Calor " + lugar + " hoje." : "Esquenta " + lugar + " " + quando(d) + ".");
      t.temp = "máx. " + Math.round(d.max) + "°";
      t.legenda = "calor " + lugar;
    } else if (clima.humor === "chuva") {
      t.titulo = "Chuva " + lugar + " " + quando(d) + ".";
      t.temp = Math.round(d.chuva) + "% de chance";
      t.legenda = "chuva " + lugar;
    } else {
      t.titulo = "Tempo firme " + lugar + " nos próximos dias.";
      t.temp = "máx. " + Math.round(d.max) + "°";
      t.legenda = "tempo firme " + lugar;
    }

    var ordem = CONFIG.ordens[clima.humor] || [];
    var grupo = ordem.length && pecas.length ? grupoPorId(pecas[0].grupo) : null;

    t.texto = grupo
      ? "Começamos a sua Black " + grupo.comeco + "."
      : "Começamos pelas peças mais desejadas da Black.";

    // Botão de entrada: frase do clima + o fato da previsão
    t.chamada = clima.cidade ? CONFIG.chamadas[clima.humor] : CONFIG.chamadas.semCidade;
    t.fato = clima.cidade
      ? t.titulo.replace(/\.$/, "") + (t.temp ? " · " + t.temp : "")
      : "Uma peça por tela, como nos stories";

    return t;
  }


  /* =========================================================
     PEÇAS DA BLACK
     Lê a categoria na ordem do admin e guarda na sessão
  ========================================================= */

  function grupoPorId(id) {
    for (var i = 0; i < CONFIG.grupos.length; i++) {
      if (CONFIG.grupos[i].id === id) {
        return CONFIG.grupos[i];
      }
    }
    return null;
  }

  function descobrirGrupo(nome) {

    var palavras = semAcento(nome).split(/[^A-Z0-9]+/);

    for (var g = 0; g < CONFIG.grupos.length; g++) {

      var termos = CONFIG.grupos[g].termos;

      for (var p = 0; p < palavras.length; p++) {
        for (var t = 0; t < termos.length; t++) {
          if (palavras[p] === termos[t] || palavras[p] === termos[t] + "S") {
            return CONFIG.grupos[g].id;
          }
        }
      }
    }

    return "";
  }

  // "BOTA FEMININA CANO MÉDIO SUEDE PRETO - NARI" => modelo NARI, tipo BOTA CANO MÉDIO SUEDE PRETO
  function separarNome(nome) {

    var partes = nome.split(/\s+[-–]\s+/);
    var modelo = "";
    var tipo = nome;

    if (partes.length >= 2) {
      if (partes[0].split(/\s+/).length <= 2) {
        modelo = partes[0];
        tipo = partes.slice(1).join(" - ");
      } else {
        modelo = partes[partes.length - 1];
        tipo = partes.slice(0, -1).join(" - ");
      }
    }

    tipo = tipo.replace(/\s+FEMININ[OA]S?\b/gi, "").replace(/\s{2,}/g, " ").trim();

    return { modelo: modelo.trim(), tipo: tipo };
  }

  function imagens(produto) {

    var img = produto.querySelector("img.primaryImage") || produto.querySelector(".product-list-image-container img");

    if (!img) {
      return null;
    }

    // As URLs da UOOU têm vírgula ("tr:w-265,h-397,..."): separa pelo "265w", não pela vírgula
    var srcset = img.getAttribute("data-srcset") || img.getAttribute("srcset") || "";
    var regra = /,?\s*(\S+)\s+(\d+)w/g;
    var lista = [];
    var achado;

    while ((achado = regra.exec(srcset))) {
      if (achado[1].indexOf("data:") !== 0) {
        lista.push({ url: achado[1], w: parseInt(achado[2], 10) });
      }
    }

    if (!lista.length) {

      var src = img.getAttribute("data-src") || img.getAttribute("src") || "";

      return src && src.indexOf("data:") !== 0 ? { grande: src, pequena: src } : null;
    }

    lista.sort(function (a, b) { return a.w - b.w; });

    var pequena = lista[0];

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].w >= 333) {
        pequena = lista[i];
        break;
      }
    }

    return { grande: lista[lista.length - 1].url, pequena: pequena.url };
  }

  function texto(produto, seletor) {
    var achado = produto.querySelector(seletor);
    return achado ? achado.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function lerProduto(produto) {

    var nome = texto(produto, ".product-list-name a");
    var link = produto.querySelector(".product-list-name a[href], a.grid-card-link[href]");
    var fotos = imagens(produto);
    var botoes = produto.querySelectorAll(".size-bt[data-option-value]");
    var tamanhos = [];
    var id = "";

    for (var i = 0; i < botoes.length; i++) {

      var variante = botoes[i].getAttribute("data-variant-id");

      id = id || botoes[i].getAttribute("data-product-id") || "";

      tamanhos.push({
        t: botoes[i].getAttribute("data-option-value"),
        v: botoes[i].classList.contains("disabled") ? "" : (variante || "")
      });
    }

    var disponivel = tamanhos.some(function (tamanho) { return !!tamanho.v; });

    if (!nome || !fotos || !id || !disponivel) {
      return null;
    }

    var desconto = /(\d+)\s*%/.exec(texto(produto, ".promotion .discount"));
    var nomes = separarNome(nome);

    return {
      id: id,
      sku: produto.getAttribute("data-sku") || "",
      url: link ? link.getAttribute("href") : "",
      nome: nome,
      modelo: nomes.modelo,
      tipo: nomes.tipo,
      grupo: descobrirGrupo(nome),
      foto: fotos.grande,
      miniatura: fotos.pequena,
      pix: texto(produto, ".cash-payment-container .to-price"),
      preco: texto(produto, ".box-price-to > .to-price"),
      de: texto(produto, ".from-price"),
      desconto: desconto ? "-" + desconto[1] + "%" : "",
      tamanhos: tamanhos
    };
  }

  function buscarPagina(url, lista, pagina) {

    return fetch(url, { credentials: "same-origin" })
      .then(function (resposta) {
        return resposta.ok ? resposta.text() : "";
      })
      .then(function (html) {

        var doc = new DOMParser().parseFromString(html, "text/html");
        var produtos = doc.querySelectorAll(".product[data-sku]");

        for (var i = 0; i < produtos.length; i++) {

          var peca = lerProduto(produtos[i]);

          if (peca && !lista.some(function (item) { return item.id === peca.id; })) {
            lista.push(peca);
          }
        }

        var proxima = doc.querySelector(".pagination li.next:not(.disabled) a[href]");

        if (proxima && pagina < CONFIG.maxPaginas) {
          return buscarPagina(proxima.getAttribute("href"), lista, pagina + 1);
        }

        return lista;
      });
  }

  function carregarPecas() {

    var cache = lerLocal(CACHE_PECAS, "sessionStorage");

    if (cache && Date.now() - cache.em < CONFIG.cachePecasMinutos * 60000) {
      return Promise.resolve(cache.pecas);
    }

    return buscarPagina(CONFIG.categoriaUrl, [], 1).then(function (lista) {

      gravarLocal(CACHE_PECAS, { em: Date.now(), pecas: lista }, "sessionStorage");

      return lista;
    });
  }

  // Ordena pelos grupos do clima, mantendo a ordem do admin dentro de cada grupo
  function ordenar(pecas, humor) {

    var ordem = CONFIG.ordens[humor] || [];

    return pecas
      .map(function (peca, i) {

        var posicao = ordem.indexOf(peca.grupo);

        return { peca: peca, i: i, r: posicao === -1 ? ordem.length : posicao };
      })
      .sort(function (a, b) {
        return a.r - b.r || a.i - b.i;
      })
      .map(function (item) {
        return item.peca;
      })
      .slice(0, CONFIG.maxPecas);
  }


  /* =========================================================
     BOTÃO DE ENTRADA
  ========================================================= */

  function montarBotao(entrada) {

    var ancora = document.querySelector(entrada.seletor);

    if (!ancora || document.querySelector(".hz-bc-entrada")) {
      return;
    }

    var t = dados.textos;
    var secao = el("section", "hz-bc-entrada");
    var botao = el("button", "hz-bc-chamada");
    var fotos = el("span", "hz-bc-chamada__fotos");
    var topo = el("span", "hz-bc-chamada__topo");
    var corpo = el("span", "hz-bc-chamada__corpo");
    var textosBox = el("span", "hz-bc-chamada__textos");
    var selo = el("span", "hz-bc-chamada__selo");
    var play = el("span", "hz-bc-chamada__play");

    secao.setAttribute("aria-label", CONFIG.titulo + " pelo clima");

    botao.type = "button";
    botao.setAttribute("aria-label", CONFIG.selo + ": " + t.chamada + ". " + t.fato + ". Abrir em tela cheia");

    // As três primeiras peças da ordem do clima, em bolinha de stories
    dados.pecas.slice(0, 3).forEach(function (peca) {

      var bolinha = el("span", "hz-bc-chamada__foto");
      var foto = el("img");

      foto.src = peca.miniatura;
      foto.alt = "";
      foto.loading = "lazy";

      bolinha.appendChild(foto);
      fotos.appendChild(bolinha);
    });

    selo.innerHTML = icone(dados.clima.humor);
    selo.appendChild(el("span", "", CONFIG.selo));

    textosBox.appendChild(el("span", "hz-bc-chamada__titulo", t.chamada));
    textosBox.appendChild(el("span", "hz-bc-chamada__fato", t.fato));

    play.innerHTML = '<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="currentColor"/></svg>';

    // Em cima: selo e bolinhas. Embaixo: frase, previsão e play
    topo.appendChild(selo);
    topo.appendChild(fotos);
    corpo.appendChild(textosBox);
    corpo.appendChild(play);

    botao.appendChild(topo);
    botao.appendChild(corpo);

    botao.addEventListener("click", function () {
      abrir(0, "botao", botao);
    });

    secao.appendChild(botao);

    ancora.insertAdjacentElement(entrada.posicao, secao);
  }


  /* =========================================================
     TELA CHEIA
  ========================================================= */

  var SVG_FECHAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var SVG_SUBIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
  var SVG_ANTERIOR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var SVG_PROXIMA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  var tela = {
    indice: 0,
    aberto: false,
    historico: false,
    voltarFoco: null,
    escolhido: {},     // número escolhido em cada peça
    enviando: false,
    pausas: {},
    rodando: false,
    inicio: 0,
    decorrido: 0,
    quadro: null,
    toque: null,
    avisoTimer: null
  };

  function montarTela() {

    if (ui) {
      return;
    }

    ui = {};

    ui.raiz = el("div", "hz-bc");
    ui.raiz.setAttribute("role", "dialog");
    ui.raiz.setAttribute("aria-modal", "true");
    ui.raiz.setAttribute("aria-label", CONFIG.titulo + " em tela cheia");

    ui.palco = el("div", "hz-bc__palco");
    ui.fundo = el("div", "hz-bc__fundo");
    ui.veu = el("div", "hz-bc__veu");
    ui.barras = el("div", "hz-bc__barras");

    ui.topo = el("div", "hz-bc__topo");
    ui.topo.appendChild(el("span", "hz-bc__avatar", "H"));
    ui.legenda = el("p", "hz-bc__legenda");
    ui.topo.appendChild(ui.legenda);
    ui.fechar = el("button", "hz-bc__fechar");
    ui.fechar.type = "button";
    ui.fechar.setAttribute("aria-label", "Fechar");
    ui.fechar.innerHTML = SVG_FECHAR;
    ui.topo.appendChild(ui.fechar);

    ui.foto = el("div", "hz-bc__foto");
    ui.img = el("img");
    ui.foto.appendChild(ui.img);

    ui.info = el("div", "hz-bc__info");
    ui.nome = el("p", "hz-bc__nome");
    ui.nome.setAttribute("aria-live", "polite");
    ui.preco = el("p", "hz-bc__preco");
    ui.tamanhos = el("div", "hz-bc__tamanhos");
    ui.tamanhos.setAttribute("role", "group");
    ui.tamanhos.setAttribute("aria-label", "Escolha seu número");
    ui.dica = el("button", "hz-bc__dica");
    ui.dica.type = "button";
    ui.info.appendChild(ui.nome);
    ui.info.appendChild(ui.preco);
    ui.info.appendChild(ui.tamanhos);
    ui.info.appendChild(ui.dica);

    ui.aviso = el("p", "hz-bc__aviso");
    ui.aviso.setAttribute("role", "status");

    ui.anterior = el("button", "hz-bc__seta hz-bc__seta--anterior");
    ui.anterior.type = "button";
    ui.anterior.setAttribute("aria-label", "Peça anterior");
    ui.anterior.innerHTML = SVG_ANTERIOR;

    ui.proxima = el("button", "hz-bc__seta hz-bc__seta--proxima");
    ui.proxima.type = "button";
    ui.proxima.setAttribute("aria-label", "Próxima peça");
    ui.proxima.innerHTML = SVG_PROXIMA;

    // Sacola
    ui.sacola = el("div", "hz-bc__camada");
    ui.sacolaCaixa = el("div", "hz-bc__caixa");
    ui.sacolaCaixa.setAttribute("role", "status");
    ui.sacolaTitulo = el("p", "hz-bc__caixa-titulo");
    ui.sacolaTexto = el("p", "hz-bc__caixa-texto");
    ui.frete = el("div", "hz-bc__frete");
    ui.freteBarra = el("i");
    ui.frete.appendChild(ui.freteBarra);
    ui.finalizar = el("a", "hz-bc__finalizar", "FINALIZAR");
    ui.finalizar.href = "/cart/";
    ui.continuar = el("button", "hz-bc__continuar", "continuar vendo a Black");
    ui.continuar.type = "button";
    ui.sacolaCaixa.appendChild(ui.sacolaTitulo);
    ui.sacolaCaixa.appendChild(ui.sacolaTexto);
    ui.sacolaCaixa.appendChild(ui.frete);
    ui.sacolaCaixa.appendChild(ui.finalizar);
    ui.sacolaCaixa.appendChild(ui.continuar);
    ui.sacolaProxima = el("button", "hz-bc__proxima", "PRÓXIMA PEÇA ›");
    ui.sacolaProxima.type = "button";
    ui.sacola.appendChild(ui.sacolaCaixa);
    ui.sacola.appendChild(ui.sacolaProxima);

    // Fim
    ui.fim = el("div", "hz-bc__camada");
    var fimCaixa = el("div", "hz-bc__caixa");
    var verTudo = el("a", "hz-bc__finalizar", "VER TODAS AS PEÇAS");
    ui.recomecar = el("button", "hz-bc__continuar", "ver de novo do começo");
    ui.recomecar.type = "button";
    verTudo.href = CONFIG.categoriaUrl;
    verTudo.style.background = "#111";
    fimCaixa.appendChild(el("p", "hz-bc__caixa-titulo", "Você viu a Black por aqui."));
    fimCaixa.appendChild(el("p", "hz-bc__caixa-texto", "Tem mais peças com desconto na página da Black."));
    fimCaixa.appendChild(verTudo);
    fimCaixa.appendChild(ui.recomecar);
    ui.fim.appendChild(fimCaixa);

    ui.carregando = el("div", "hz-bc__carregando");
    ui.carregando.appendChild(el("i"));

    ui.palco.appendChild(ui.fundo);
    ui.palco.appendChild(ui.veu);
    ui.palco.appendChild(ui.barras);
    ui.palco.appendChild(ui.topo);
    ui.palco.appendChild(ui.foto);
    ui.palco.appendChild(ui.info);
    ui.palco.appendChild(ui.aviso);
    ui.palco.appendChild(ui.sacola);
    ui.palco.appendChild(ui.fim);
    ui.palco.appendChild(ui.carregando);

    ui.raiz.appendChild(ui.palco);
    ui.raiz.appendChild(ui.anterior);
    ui.raiz.appendChild(ui.proxima);

    ui.fechar.addEventListener("click", function () { fechar(); });
    ui.anterior.addEventListener("click", function () { mostrar(tela.indice - 1); });
    ui.proxima.addEventListener("click", function () { mostrar(tela.indice + 1); });
    ui.dica.addEventListener("click", adicionar);
    ui.continuar.addEventListener("click", function () { fecharSacola(); mostrar(tela.indice + 1); });
    ui.sacolaProxima.addEventListener("click", function () { fecharSacola(); mostrar(tela.indice + 1); });
    ui.recomecar.addEventListener("click", function () { ui.fim.classList.remove("hz-bc--visivel"); mostrar(0); });

    ui.palco.addEventListener("pointerdown", toqueInicio);
    ui.palco.addEventListener("pointermove", toqueMove);
    ui.palco.addEventListener("pointerup", toqueFim);
    ui.palco.addEventListener("pointercancel", toqueCancelar);

    ui.raiz.addEventListener("keydown", teclado);

    document.body.appendChild(ui.raiz);
  }

  function montarBarras() {

    ui.barras.innerHTML = "";
    ui.barrasLista = [];

    for (var i = 0; i < dados.pecas.length; i++) {

      var barra = el("span", "hz-bc__barra");
      var cheio = el("i");

      barra.appendChild(cheio);
      ui.barras.appendChild(barra);
      ui.barrasLista.push(cheio);
    }
  }

  function numeroGuardado() {
    try {
      return window.localStorage.getItem(CHAVE_NUMERO) || "";
    } catch (erro) {
      return "";
    }
  }

  function tamanhoDaPeca(peca) {

    var escolhido = tela.escolhido[peca.id] || numeroGuardado();

    for (var i = 0; i < peca.tamanhos.length; i++) {
      if (peca.tamanhos[i].t === escolhido && peca.tamanhos[i].v) {
        return peca.tamanhos[i];
      }
    }

    return null;
  }

  function atualizarLegenda() {

    var partes = [CONFIG.titulo];
    var numero = numeroGuardado();

    if (dados.textos.legenda) {
      partes.push(dados.textos.legenda);
    }

    if (numero) {
      partes.push("no " + numero);
    }

    ui.legenda.textContent = partes.join(" · ");
  }

  function atualizarTamanhos(peca) {

    var atual = tamanhoDaPeca(peca);

    ui.tamanhos.innerHTML = "";

    peca.tamanhos.forEach(function (tamanho) {

      var botao = el("button", "hz-bc__tamanho", tamanho.t);

      botao.type = "button";
      botao.disabled = !tamanho.v;
      botao.setAttribute("aria-pressed", atual && atual.t === tamanho.t ? "true" : "false");
      botao.setAttribute("aria-label", tamanho.v ? "Número " + tamanho.t : "Número " + tamanho.t + " esgotado");

      botao.addEventListener("click", function () {

        tela.escolhido[peca.id] = tamanho.t;

        // Escolheu o número: a peça para de passar sozinha
        tela.pausas.escolhendo = true;
        atualizarTimer();

        atualizarTamanhos(peca);
      });

      ui.tamanhos.appendChild(botao);
    });

    ui.dica.innerHTML = "";

    if (atual) {
      ui.dica.insertAdjacentHTML("beforeend", SVG_SUBIR);
      ui.dica.appendChild(el("span", "", "ARRASTE PARA ADICIONAR O " + atual.t));
      ui.dica.setAttribute("aria-label", "Adicionar o " + atual.t + " na sacola");
    } else {
      ui.dica.appendChild(el("span", "", "ESCOLHA SEU NÚMERO"));
      ui.dica.removeAttribute("aria-label");
    }
  }

  function mostrar(i) {

    if (i < 0) {
      i = 0;
    }

    if (i >= dados.pecas.length) {
      mostrarFim();
      return;
    }

    var peca = dados.pecas[i];

    tela.indice = i;
    tela.pausas.escolhendo = false;

    ui.fim.classList.remove("hz-bc--visivel");

    // O foco num botão pode rolar o palco e esconder as barrinhas do topo
    ui.palco.scrollTop = 0;

    pararTimer();
    tela.decorrido = 0;

    for (var j = 0; j < ui.barrasLista.length; j++) {
      ui.barrasLista[j].style.width = j < i || (j === i && reduzirMovimento) ? "100%" : "0";
    }

    ui.fundo.style.backgroundImage = 'url("' + peca.miniatura + '")';
    ui.img.src = peca.foto;
    ui.img.alt = peca.nome;

    ui.nome.textContent = (peca.modelo ? peca.modelo + " · " : "") + peca.tipo;

    ui.preco.innerHTML = "";
    ui.preco.appendChild(el("b", "", peca.pix || peca.preco));
    ui.preco.appendChild(document.createTextNode(
      (peca.pix ? "no Pix" : "") + (peca.desconto ? " · " + peca.desconto : "")
    ));

    if (peca.de) {
      ui.preco.appendChild(el("s", "", peca.de));
    }

    ui.anterior.style.visibility = i === 0 ? "hidden" : "";

    atualizarLegenda();
    atualizarTamanhos(peca);

    // Já baixa a próxima foto
    if (dados.pecas[i + 1]) {
      new Image().src = dados.pecas[i + 1].foto;
    }

    atualizarTimer();
  }

  function mostrarFim() {

    pararTimer();

    for (var j = 0; j < ui.barrasLista.length; j++) {
      ui.barrasLista[j].style.width = "100%";
    }

    ui.fim.classList.add("hz-bc--visivel");
    ui.recomecar.focus();

    registrar("fim", {});
  }


  /* ---------- Tempo de cada peça ---------- */

  function pausado() {

    if (reduzirMovimento) {
      return true;
    }

    for (var motivo in tela.pausas) {
      if (tela.pausas[motivo]) {
        return true;
      }
    }

    return false;
  }

  function quadro() {

    if (!tela.rodando) {
      return;
    }

    var total = CONFIG.segundosPorPeca * 1000;
    var feito = (tela.decorrido + performance.now() - tela.inicio) / total;
    var barra = ui.barrasLista[tela.indice];

    if (barra) {
      barra.style.width = Math.min(feito, 1) * 100 + "%";
    }

    if (feito >= 1) {
      tela.rodando = false;
      mostrar(tela.indice + 1);
      return;
    }

    tela.quadro = requestAnimationFrame(quadro);
  }

  function pararTimer() {

    if (tela.rodando) {
      tela.decorrido += performance.now() - tela.inicio;
    }

    tela.rodando = false;
    cancelAnimationFrame(tela.quadro);
  }

  function atualizarTimer() {

    if (!tela.aberto || pausado()) {
      pararTimer();
      return;
    }

    if (!tela.rodando) {
      tela.rodando = true;
      tela.inicio = performance.now();
      tela.quadro = requestAnimationFrame(quadro);
    }
  }


  /* ---------- Toques: tocar dos lados, arrastar para cima ou para baixo ---------- */

  function toqueInicio(evento) {

    if (evento.target.closest("button, a, .hz-bc__camada")) {
      return;
    }

    tela.toque = { x: evento.clientX, y: evento.clientY, em: Date.now(), id: evento.pointerId };
    tela.pausas.segurando = true;

    try {
      ui.palco.setPointerCapture(evento.pointerId);
    } catch (erro) { }

    atualizarTimer();
  }

  function toqueMove(evento) {

    if (!tela.toque || evento.pointerId !== tela.toque.id) {
      return;
    }

    var dy = evento.clientY - tela.toque.y;

    ui.info.style.transform = dy < 0 ? "translateY(" + Math.max(dy * 0.4, -60) + "px)" : "";
  }

  function toqueCancelar() {
    tela.toque = null;
    tela.pausas.segurando = false;
    ui.info.style.transform = "";
    atualizarTimer();
  }

  function toqueFim(evento) {

    var toque = tela.toque;

    if (!toque || evento.pointerId !== toque.id) {
      return;
    }

    toqueCancelar();

    var dx = evento.clientX - toque.x;
    var dy = evento.clientY - toque.y;
    var rapido = Date.now() - toque.em < 300;

    if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
      adicionar();
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      fechar();
    } else if (Math.abs(dx) > 60) {
      mostrar(tela.indice + (dx < 0 ? 1 : -1));
    } else if (rapido && Math.abs(dx) < 12 && Math.abs(dy) < 12) {

      var caixa = ui.palco.getBoundingClientRect();

      mostrar(tela.indice + (evento.clientX - caixa.left < caixa.width * 0.3 ? -1 : 1));
    }
  }

  function teclado(evento) {

    var camadaAberta = ui.sacola.classList.contains("hz-bc--visivel") ||
      ui.fim.classList.contains("hz-bc--visivel");

    if (evento.key === "Escape") {
      evento.preventDefault();
      if (ui.sacola.classList.contains("hz-bc--visivel")) {
        fecharSacola();
      } else {
        fechar();
      }
    } else if (evento.key === "ArrowRight" && !camadaAberta) {
      mostrar(tela.indice + 1);
    } else if (evento.key === "ArrowLeft" && !camadaAberta) {
      mostrar(tela.indice - 1);
    } else if (evento.key === "ArrowUp" && !camadaAberta) {
      evento.preventDefault();
      adicionar();
    } else if (evento.key === "Tab") {
      prenderFoco(evento);
    }
  }

  // O Tab circula só dentro da tela cheia
  function prenderFoco(evento) {

    var focaveis = Array.prototype.filter.call(
      ui.raiz.querySelectorAll("button:not(:disabled), a[href]"),
      function (item) { return item.offsetParent !== null && item.style.visibility !== "hidden"; }
    );

    if (!focaveis.length) {
      return;
    }

    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function avisar(mensagem) {

    ui.aviso.textContent = mensagem;
    ui.aviso.classList.add("hz-bc--visivel");

    clearTimeout(tela.avisoTimer);

    tela.avisoTimer = setTimeout(function () {
      ui.aviso.classList.remove("hz-bc--visivel");
    }, 2600);
  }


  /* ---------- Sacola ---------- */

  function adicionar() {

    var peca = dados.pecas[tela.indice];

    if (!peca || tela.enviando) {
      return;
    }

    var tamanho = tamanhoDaPeca(peca);

    if (!tamanho) {

      ui.tamanhos.classList.remove("hz-bc--chamar");
      void ui.tamanhos.offsetWidth;
      ui.tamanhos.classList.add("hz-bc--chamar");

      avisar("Escolha seu número primeiro.");
      return;
    }

    var $ = window.jQuery;

    // Sem o jQuery da loja, leva para a página do produto
    if (!$ || !window.Uoou || !window.Uoou.routes) {
      window.location.href = peca.url;
      return;
    }

    tela.enviando = true;
    tela.pausas.sacola = true;
    atualizarTimer();

    ui.dica.innerHTML = "";
    ui.dica.appendChild(el("span", "", "ADICIONANDO O " + tamanho.t + "…"));

    $.ajax({
      url: window.Uoou.routes.getCartItemAdd() + "?id=" + encodeURIComponent(peca.id),
      type: "POST",
      dataType: "json",
      data: {
        "uoou_cart_item[variant]": tamanho.v,
        "uoou_cart_item[quantity]": 1
      }
    })
      .done(function (resposta) {

        tela.enviando = false;

        if (resposta && resposta.status === "error") {
          falhou(peca, resposta.message);
          return;
        }

        try {
          window.localStorage.setItem(CHAVE_NUMERO, tamanho.t);
        } catch (erro) { }

        atualizarLegenda();
        atualizarTamanhos(peca);
        abrirSacola(peca, tamanho);

        // Avisa os pixels/analytics da loja, como na compra rápida
        $(document).trigger("product-add-to-cart", [{ productId: peca.id }]);

        registrar("sacola", { sku: peca.sku, numero: tamanho.t, posicao: tela.indice + 1 });
      })
      .fail(function () {
        tela.enviando = false;
        falhou(peca);
      });
  }

  function falhou(peca, mensagem) {

    tela.pausas.sacola = false;
    atualizarTamanhos(peca);
    atualizarTimer();

    avisar(mensagem || "Não deu para adicionar. Tente de novo.");
  }

  function abrirSacola(peca, tamanho) {

    var nome = capitalizar(peca.modelo || peca.tipo.split(" ")[0]);

    ui.sacolaTitulo.textContent = nome + " no " + tamanho.t + " na sacola ✓";
    ui.sacolaTexto.textContent = "Atualizando sua sacola…";
    ui.freteBarra.style.width = "0";
    ui.sacola.classList.add("hz-bc--visivel");

    ui.finalizar.focus();

    var Uoou = window.Uoou;

    function comCarrinho(carrinho) {

      if (!carrinho || carrinho.cart_subtotal === undefined) {
        ui.sacolaTexto.textContent = "Peça guardada na sua sacola.";
        return;
      }

      // cart_subtotal vem em centavos (37990); o texto formatado vem em reais
      var total = carrinho.cart_subtotal_format
        ? lerBRL(carrinho.cart_subtotal_format)
        : (parseFloat(carrinho.cart_subtotal) || 0) / 100;
      var falta = CONFIG.freteGratis - total;

      ui.sacolaTexto.textContent = falta > 0
        ? "Faltam " + formatarBRL(falta) + " para o frete grátis"
        : "Frete grátis garantido ✓";

      ui.freteBarra.style.width = Math.min(100, (total / CONFIG.freteGratis) * 100) + "%";
    }

    // reload com função atualiza o contador e o minicarrinho sem abrir o minicarrinho
    if (Uoou.cart && typeof Uoou.cart.reload === "function") {
      Uoou.cart.reload(comCarrinho);
    } else {
      window.jQuery.post(Uoou.routes.getCartInfo(), comCarrinho);
    }
  }

  function fecharSacola() {
    ui.sacola.classList.remove("hz-bc--visivel");
    tela.pausas.sacola = false;
    atualizarTimer();
  }


  /* ---------- Abrir e fechar ---------- */

  function abrir(indice, origem, voltarFoco) {

    if (!dados || !dados.pecas.length || tela.aberto) {
      return;
    }

    adicionarEstilo();
    montarTela();
    montarBarras();

    tela.aberto = true;
    tela.voltarFoco = voltarFoco || document.activeElement;
    tela.pausas = { oculto: document.hidden };

    ui.carregando.style.display = "none";
    ui.sacola.classList.remove("hz-bc--visivel");
    ui.fim.classList.remove("hz-bc--visivel");
    ui.raiz.style.display = "";

    document.documentElement.classList.add("hz-bc-aberto");

    // O voltar do celular fecha a tela cheia em vez de sair da página
    try {
      window.history.pushState({ hzBlackClima: true }, "");
      tela.historico = true;
    } catch (erro) { }

    mostrar(indice || 0);

    ui.fechar.focus();

    registrar("abrir", { origem: origem });
  }

  function fechar(peloVoltar) {

    if (!tela.aberto) {
      return;
    }

    tela.aberto = false;

    pararTimer();

    ui.raiz.style.display = "none";
    document.documentElement.classList.remove("hz-bc-aberto");

    if (tela.historico) {
      tela.historico = false;
      if (!peloVoltar) {
        window.history.back();
      }
    }

    if (tela.voltarFoco && tela.voltarFoco.focus && document.contains(tela.voltarFoco)) {
      tela.voltarFoco.focus();
    }

    registrar("fechar", { posicao: tela.indice + 1 });
  }

  window.addEventListener("popstate", function () {
    if (tela.aberto) {
      tela.historico = false;
      fechar(true);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (tela.aberto) {
      tela.pausas.oculto = document.hidden;
      atualizarTimer();
    }
  });


  /* =========================================================
     ENTRADA DIRETA (INSTAGRAM OU LINK)
  ========================================================= */

  function veioDoInstagram() {
    return /Instagram/i.test(navigator.userAgent || "") ||
      /instagram\.com/i.test(document.referrer || "");
  }

  function deveAbrirSozinho() {

    if (paramUrl(CONFIG.parametroAbrir)) {
      return "link";
    }

    if (!CONFIG.abrirDoInstagram || !veioDoInstagram()) {
      return "";
    }

    // Uma vez por visita: no navegador do Instagram toda página "vem do Instagram"
    if (lerLocal(CHAVE_AUTO, "sessionStorage")) {
      return "";
    }

    gravarLocal(CHAVE_AUTO, 1, "sessionStorage");

    return "instagram";
  }


  /* =========================================================
     START
  ========================================================= */

  function entradasDaPagina() {

    var atual = caminhoAtual();

    return CONFIG.entradas.filter(function (entrada) {
      return entrada.pagina === atual;
    });
  }

  function init() {

    var entradas = entradasDaPagina();
    var abrirSozinho = deveAbrirSozinho();

    if (!entradas.length && !abrirSozinho) {
      return;
    }

    adicionarEstilo();

    // Quem vai abrir direto já vê a tela cheia carregando
    if (abrirSozinho) {
      montarTela();
      ui.raiz.style.display = "";
      document.documentElement.classList.add("hz-bc-aberto");
    }

    var clima = carregarClima().catch(function () { return null; });

    Promise.all([carregarPecas(), clima])
      .then(function (resultado) {

        var leitura = lerHumor(resultado[1]);
        var pecas = ordenar(resultado[0], leitura.humor);

        if (!pecas.length) {
          throw new Error("sem peças");
        }

        dados = { pecas: pecas, clima: leitura };
        dados.textos = textos(leitura, pecas);

        entradas.forEach(montarBotao);

        if (abrirSozinho) {
          abrir(0, abrirSozinho);
        }
      })
      .catch(function () {
        if (ui) {
          ui.raiz.style.display = "none";
          document.documentElement.classList.remove("hz-bc-aberto");
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
