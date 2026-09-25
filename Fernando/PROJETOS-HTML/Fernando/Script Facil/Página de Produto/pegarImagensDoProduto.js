// O que um leigo precisa saber pra “usar” e ajustar rápido

// Onde ele troca o HERO:
// Procura por #muv-hero-img. Se o seu HERO tiver outro id, troca aqui:

// const hero = document.getElementById("muv-hero-img");


// Onde ele troca as imagens da sua seção:
// Procura por:

// ".mer-section.mer-images .mer-image-section img"


// Se seu HTML usar outra classe/estrutura, é só trocar esse seletor.

// Se ele não estiver achando as imagens da galeria do produto:
// Os seletores estão aqui:

// const selectors = [ ... ];


// Basta adicionar um novo seletor específico do seu template.




(function () {
    // =========================
    // CONFIGURAÇÕES (fáceis)
    // =========================

    // Prefixo que aparece no console (F12 > Console) para você identificar as mensagens do script
    const LOG_PREFIX = "[mer-hero]";

    // Quantas tentativas o script fará para achar as imagens (caso o site carregue devagar)
    const MAX_TRIES = 40;

    // Intervalo (em ms) entre tentativas. 350ms = 0,35s
    const TRY_DELAY = 350;

    // =========================
    // FUNÇÕES DE LOG (console)
    // =========================
    function log(...args) { console.log(LOG_PREFIX, ...args); }
    function warn(...args) { console.warn(LOG_PREFIX, ...args); }

    // Cria um “grupo” no console para organizar os logs (fica mais fácil de ler)
    function group(title, fn) {
      if (console.groupCollapsed) {
        console.groupCollapsed(LOG_PREFIX, title);
        try { fn(); } finally { console.groupEnd(); }
      } else {
        log(title);
        fn();
      }
    }

    // =========================
    // PEGAR A MELHOR URL DE UMA <img>
    // =========================
    // Alguns sites usam "src" normal, outros usam "data-src", "data-zoom" etc.
    // Essa função tenta pegar a melhor URL possível de uma <img>
    function getBestFromImg(img) {
      if (!img) return "";
      return (
        img.getAttribute("data-src-zoom") || // melhor caso: imagem para zoom / alta qualidade
        img.getAttribute("data-zoom") ||
        img.getAttribute("data-src") ||      // lazy-load comum
        img.getAttribute("src") ||           // fallback normal
        ""
      );
    }

    // Remove tudo depois de "?" (parâmetros). Ex: "...jpg?ims=800x800" vira "...jpg"
    // Isso evita duplicatas e “sujeira” na comparação de URLs.
    function cleanUrl(url) { return (url || "").replace(/\?.*$/, ""); }

    // Valida se a url é realmente uma imagem de produto útil
    function isValid(url) {
      if (!url) return false;
      // Ignora imagens inline (base64) ou placeholders
      if (url.startsWith("data:image/")) return false;
      // Ignora svg/gif base64
      if (url.includes("data:image/svg")) return false;
      if (url.includes("data:image/gif")) return false;
      // Ignora imagens de avaliação/anexo (não são as fotos do produto)
      if (url.includes("avaliacao_anexo")) return false;
      return true;
    }

    // Regra do site (Merengue): imagem de produto costuma ter /img/ e /produto/
    // Assim o script evita trocar por banners e outras imagens aleatórias do site.
    function isProduct(url) {
      return url.includes("/img/") && url.includes("/produto/");
    }

    // =========================
    // ESCOLHER A “MAIOR” IMAGEM
    // =========================
    // Alguns sites passam o tamanho via parâmetro, ex: ?ims=800x800
    // Aqui a função lê o "ims" e calcula a área (largura x altura).
    function parseIms(url) {
      const m = (url || "").match(/[\?&]ims=(\d+)x(\d+)/i);
      if (!m) return { area: 0 }; // se não tiver ims, assume área 0
      const w = parseInt(m[1], 10) || 0;
      const h = parseInt(m[2], 10) || 0;
      return { area: w * h };
    }

    // =========================
    // COLETAR IMAGENS DA GALERIA
    // =========================
    function collectGalleryUrls(doc) {
      // Vários seletores possíveis porque o HTML pode mudar de template para template
      const selectors = [
        "#block-imagem .gallery-main .swiper-slide img",
        "#container-swiper .gallery-main .swiper-slide img",
        ".product-img.container-swiper .gallery-main .swiper-slide img",

        "#block-imagem .swiper-slide img",
        ".gallery-main .swiper-slide img",
        ".swiper-slide img"
      ];

      let imgs = [];
      let usedSelector = "";

      // Tenta cada seletor até achar imagens
      for (const sel of selectors) {
        const found = doc.querySelectorAll(sel);
        if (found && found.length) {
          imgs = Array.from(found);
          usedSelector = sel;
          break;
        }
      }

      // Remove imagens que sejam da área de miniaturas (thumbs)
      const filtered = imgs.filter(img => {
        if (img.closest(".thumbs-ctn")) return false;
        if (img.closest(".thumbs-gallery")) return false;
        return true;
      });

      // Pega as URLs das imagens filtradas
      const rawUrls = filtered.map(getBestFromImg).filter(Boolean);

      // Limpa, valida e filtra para manter só imagens de produto
      const urls = rawUrls
        .map(cleanUrl)
        .filter(isValid)
        .filter(isProduct);

      // Logs organizados no console para você debugar
      group("Coleta Merengue", () => {
        log("Selector:", usedSelector);
        log("Imgs:", imgs.length, "| após filtro:", filtered.length);
        log("URLs válidas:", urls.length, urls.slice(0, 10));
      });

      // Remove duplicadas (Set) e devolve lista final
      return Array.from(new Set(urls));
    }

    // Escolhe a “melhor” URL: a que tiver maior área no parâmetro ims (se existir)
    function pickBestUrl(urls) {
      if (!urls.length) return "";
      let best = urls[0];
      let bestArea = parseIms(best).area;

      for (const u of urls) {
        const area = parseIms(u).area;
        if (area > bestArea) {
          best = u;
          bestArea = area;
        }
      }
      return best;
    }

    // =========================
    // TROCAR IMAGENS DA SEÇÃO ESPECÍFICA
    // =========================
    function replaceSectionImages(urls) {
      // Procura as imagens desta seção do seu HTML (onde você quer substituir)
      const targets = Array.from(
        document.querySelectorAll(".mer-section.mer-images .mer-image-section img")
      );

      // Se não achar imagens-alvo, não faz nada
      if (!targets.length) return;

      // Pega até 3 URLs da galeria para usar
      const fill = urls.slice(0, 3);

      // Se tiver menos URLs do que imagens na seção, repete a última
      while (fill.length < targets.length && fill.length) {
        fill.push(fill[fill.length - 1]);
      }

      group("Substituição do bloco", () => {
        log("Targets:", targets.length);
        log("Usando URLs:", fill);
      });

      // Troca o src e atributos de lazy-load para garantir que carregue
      targets.forEach((img, idx) => {
        const u = fill[idx] || fill[fill.length - 1] || "";
        if (!u) return;

        img.setAttribute("src", u);
        img.setAttribute("data-src", u);
        img.setAttribute("data-src-zoom", u);

        // Remove srcset (às vezes ele força outra imagem)
        img.removeAttribute("srcset");
      });
    }

    // =========================
    // FUNÇÃO PRINCIPAL: aplica HERO + seção
    // =========================
    function applyHeroAndSection() {
      // HERO do seu layout (se existir)
      const hero = document.getElementById("muv-hero-img");
      if (!hero) {
        // Não é erro: pode ser que o hero esteja comentado ou não exista nessa página
        warn("Não achei #muv-hero-img (ok se o HERO estiver comentado).");
      }

      // Coleta as imagens da galeria do produto
      let urls = collectGalleryUrls(document);

      // Se não achou nada, tenta fallback com og:image (imagem social da página)
      if (!urls.length) {
        const og = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
        const ogUrl = og ? cleanUrl(og.getAttribute("content") || "") : "";
        if (ogUrl && isValid(ogUrl)) {
          urls = [ogUrl];
          log("Fallback og:image:", ogUrl);
        } else {
          // Não achou nada mesmo: manda "false" para tentar novamente depois
          return false;
        }
      }

      // Escolhe a “melhor” imagem (maior)
      const best = pickBestUrl(urls);

      // Se tiver hero e a imagem for diferente, substitui
      if (hero && best && hero.getAttribute("src") !== best) {
        hero.src = best;
        log("✅ Hero atualizado:", best);
      }

      // Substitui as imagens da seção do HTML
      replaceSectionImages(urls);

      // Retorna true (sucesso) para parar as tentativas
      return true;
    }

    // =========================
    // LOOP DE TENTATIVAS (porque a galeria pode demorar)
    // =========================
    let tries = 0;
    function loop() {
      tries++;
      if (applyHeroAndSection()) return; // deu certo, para aqui

      // Se ainda não deu certo, tenta de novo até o limite
      if (tries < MAX_TRIES) setTimeout(loop, TRY_DELAY);
    }

    // Quando o DOM estiver pronto, começa depois de 250ms
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(loop, 250));
    } else {
      setTimeout(loop, 250);
    }

    // =========================
    // OBSERVADOR DE MUDANÇAS (SPA / lazy load)
    // =========================
    // Se a página muda o HTML após carregar (muito comum), isso detecta e tenta aplicar
    const obs = new MutationObserver(() => {
      if (applyHeroAndSection()) obs.disconnect(); // se deu certo, desliga o observador
    });

    // Observa o documento inteiro procurando mudanças em qualquer lugar
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Depois de 12s, para de observar para não ficar “rodando pra sempre”
    setTimeout(() => obs.disconnect(), 12000);
  })();
