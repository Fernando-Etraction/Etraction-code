(function () {
  if (window.__fittatoReviewsLoaded) {
    console.log('[FITTATO REVIEWS] Script já carregado, abortando duplicação.');
    return;
  }
  window.__fittatoReviewsLoaded = true;

  console.log('[FITTATO REVIEWS] Iniciando script...');

  var MAX_TRIES = 80;
  var tries = 0;

  function injectFont() {
    console.log('[FITTATO REVIEWS] Verificando fonte Mulish...');

    if (document.getElementById('fittato-mulish-font')) {
      console.log('[FITTATO REVIEWS] Fonte já existe.');
      return;
    }

    var linkPre1 = document.createElement('link');
    linkPre1.rel = 'preconnect';
    linkPre1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(linkPre1);

    var linkPre2 = document.createElement('link');
    linkPre2.rel = 'preconnect';
    linkPre2.href = 'https://fonts.gstatic.com';
    linkPre2.crossOrigin = 'anonymous';
    document.head.appendChild(linkPre2);

    var fontLink = document.createElement('link');
    fontLink.id = 'fittato-mulish-font';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);

    console.log('[FITTATO REVIEWS] Fonte Mulish injetada com sucesso.');
  }

  function injectStyle() {
    console.log('[FITTATO REVIEWS] Verificando CSS...');

    if (document.getElementById('fittato-reviews-style')) {
      console.log('[FITTATO REVIEWS] CSS já existe.');
      return;
    }

    var style = document.createElement('style');
    style.id = 'fittato-reviews-style';
    style.innerHTML = `
      .fittato-reviews-section {
        width: 100%;
        max-width: 100%;
        background: #ffffff;
        border: 1px solid rgba(0, 164, 153, 0.14);
        border-radius: 24px;
        padding: 34px 22px;
        margin: 32px 0 40px;
        box-shadow: 0 14px 34px rgba(31, 37, 38, 0.08);
        font-family: 'Mulish', sans-serif !important;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
      }

      .fittato-reviews-section * {
        box-sizing: border-box;
        font-family: 'Mulish', sans-serif !important;
      }

      .fittato-reviews-header {
        text-align: center;
        margin-bottom: 26px;
      }

      .fittato-reviews-kicker {
        display: inline-block;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #00A499;
        background: rgba(0, 164, 153, 0.08);
        padding: 8px 14px;
        border-radius: 999px;
        margin-bottom: 14px;
      }

      .fittato-reviews-title {
        margin: 0;
        font-size: 30px;
        line-height: 1.15;
        font-weight: 800;
        color: #1F2526;
      }

      .fittato-reviews-subtitle {
        margin: 12px auto 0;
        max-width: 760px;
        font-size: 15px;
        line-height: 1.6;
        color: rgba(31, 37, 38, 0.78);
        font-weight: 500;
      }

      .fittato-reviews-slider {
        position: relative;
      }

      .fittato-reviews-track-wrap {
        overflow: hidden;
        width: 100%;
      }

      .fittato-reviews-track {
        display: flex;
        gap: 18px;
        transition: transform 0.45s ease;
        will-change: transform;
      }

      .fittato-review-card {
        flex: 0 0 calc(25% - 13.5px);
        min-width: calc(25% - 13.5px);
        background: #ffffff;
        border: 1px solid rgba(0, 164, 153, 0.16);
        border-radius: 18px;
        padding: 22px 18px 18px;
        box-shadow: 0 8px 22px rgba(31, 37, 38, 0.05);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }

      .fittato-review-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 28px rgba(0, 164, 153, 0.12);
        border-color: rgba(0, 164, 153, 0.35);
      }

      .fittato-review-stars {
        color: #FFCB37;
        font-size: 15px;
        letter-spacing: 1px;
        margin-bottom: 14px;
        font-weight: 800;
      }

      .fittato-review-text {
        margin: 0 0 18px;
        color: #1F2526;
        font-size: 14px;
        line-height: 1.7;
        min-height: 120px;
        font-weight: 500;
      }

      .fittato-review-footer {
        display: flex;
        align-items: center;
        gap: 12px;
        border-top: 1px solid rgba(31, 37, 38, 0.08);
        padding-top: 14px;
      }

      .fittato-review-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #00A499;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 800;
        flex-shrink: 0;
      }

      .fittato-review-meta {
        min-width: 0;
      }

      .fittato-review-name {
        display: block;
        font-size: 14px;
        line-height: 1.3;
        color: #1F2526;
        font-weight: 800;
        margin-bottom: 4px;
      }

      .fittato-review-role {
        display: block;
        font-size: 12px;
        line-height: 1.4;
        color: rgba(31, 37, 38, 0.66);
        font-weight: 700;
      }

      .fittato-reviews-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 24px;
      }

      .fittato-reviews-btn {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 2px solid #00A499;
        background: #ffffff;
        color: #00A499;
        font-size: 18px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .fittato-reviews-btn:hover:not(:disabled) {
        background: #00A499;
        color: #ffffff;
      }

      .fittato-reviews-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .fittato-reviews-dots {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .fittato-reviews-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: rgba(31, 37, 38, 0.18);
        cursor: pointer;
        transition: all 0.25s ease;
        border: none;
        padding: 0;
      }

      .fittato-reviews-dot.is-active {
        width: 24px;
        background: #00A499;
      }

      @media (max-width: 1024px) {
        .fittato-review-card {
          flex: 0 0 calc(50% - 9px);
          min-width: calc(50% - 9px);
        }
      }

      @media (max-width: 767px) {
        .fittato-reviews-section {
          padding: 26px 16px;
          border-radius: 18px;
          margin: 24px 0 32px;
        }

        .fittato-reviews-title {
          font-size: 24px;
        }

        .fittato-reviews-subtitle {
          font-size: 14px;
        }

        .fittato-review-card {
          flex: 0 0 100%;
          min-width: 100%;
          padding: 20px 16px 16px;
        }

        .fittato-review-text {
          min-height: auto;
        }
      }
    `;
    document.head.appendChild(style);

    console.log('[FITTATO REVIEWS] CSS injetado com sucesso.');
  }

  function createSection() {
    console.log('[FITTATO REVIEWS] Criando seção de avaliações...');

    var wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="fittato-reviews-section">
        <div class="fittato-reviews-header">
          <span class="fittato-reviews-kicker">Avaliações reais</span>
          <h2 class="fittato-reviews-title">Quem compra na Fittato, recomenda</h2>
          <p class="fittato-reviews-subtitle">
            Experiências de clientes que compraram em nosso ecommerce e aprovaram a qualidade,
            o atendimento e a entrega.
          </p>
        </div>

        <div class="fittato-reviews-slider">
          <div class="fittato-reviews-track-wrap">
            <div class="fittato-reviews-track">

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  A compra foi super tranquila e o produto chegou exatamente como eu esperava.
                  Qualidade ótima e acabamento impecável.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">AM</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Amanda Martins</strong>
                    <span class="fittato-review-role">Cliente verificada • Compra online</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Entrega dentro do prazo, produto muito bem embalado e tudo com aparência premium.
                  Foi minha primeira compra e gostei demais.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">RC</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Rafaela Costa</strong>
                    <span class="fittato-review-role">Cliente satisfeita • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  O site passa muita confiança e a experiência de compra foi excelente do início ao fim.
                  Com certeza vou comprar novamente.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">JL</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Juliana Lima</strong>
                    <span class="fittato-review-role">Pedido recebido • Cliente verificada</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Produto fiel às fotos, atendimento eficiente e entrega rápida.
                  Dá para perceber o cuidado da marca em cada detalhe.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">CS</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Camila Souza</strong>
                    <span class="fittato-review-role">Compra confirmada • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Gostei muito da qualidade e do caimento. A loja cumpriu tudo o que prometeu
                  e o processo de compra foi simples.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">LF</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Larissa Ferreira</strong>
                    <span class="fittato-review-role">Cliente verificada • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Minha encomenda chegou certinha e muito bem apresentada. Já indiquei para amigas,
                  porque realmente valeu a pena.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">BP</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Bianca Prado</strong>
                    <span class="fittato-review-role">Cliente satisfeita • Compra online</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Fiquei impressionada com a rapidez da entrega e com a qualidade do produto.
                  Veio tudo muito bem cuidado e superou minhas expectativas.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">MN</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Mariana Nogueira</strong>
                    <span class="fittato-review-role">Cliente verificada • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Atendimento muito bom e compra fácil de finalizar. O produto chegou lindo,
                  exatamente como mostrado nas fotos do site.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">TS</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Talita Santos</strong>
                    <span class="fittato-review-role">Pedido entregue • Cliente satisfeita</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Já comprei mais de uma vez e sempre tive uma ótima experiência.
                  Qualidade constante, entrega rápida e ótima apresentação.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">PR</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Paula Ribeiro</strong>
                    <span class="fittato-review-role">Cliente recorrente • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  O acabamento me surpreendeu bastante. Dá para perceber que a marca se preocupa
                  com qualidade e experiência de compra.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">FC</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Fernanda Castro</strong>
                    <span class="fittato-review-role">Compra online • Brasil</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  O pedido chegou no prazo certinho e o produto vestiu muito bem.
                  Loja confiável e processo de compra super prático.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">AB</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Aline Barbosa</strong>
                    <span class="fittato-review-role">Cliente verificada • Compra aprovada</span>
                  </div>
                </div>
              </article>

              <article class="fittato-review-card">
                <div class="fittato-review-stars">★★★★★</div>
                <p class="fittato-review-text">
                  Gostei tanto da minha compra que voltei para pegar mais peças.
                  O site é intuitivo, o envio é rápido e a qualidade é excelente.
                </p>
                <div class="fittato-review-footer">
                  <div class="fittato-review-avatar">GS</div>
                  <div class="fittato-review-meta">
                    <strong class="fittato-review-name">Gabriela Silva</strong>
                    <span class="fittato-review-role">Cliente recorrente • Compra online</span>
                  </div>
                </div>
              </article>

            </div>
          </div>

          <div class="fittato-reviews-controls">
            <button class="fittato-reviews-btn fittato-reviews-prev" type="button" aria-label="Anterior">‹</button>
            <div class="fittato-reviews-dots"></div>
            <button class="fittato-reviews-btn fittato-reviews-next" type="button" aria-label="Próximo">›</button>
          </div>
        </div>
      </section>
    `;

    return wrapper.firstElementChild;
  }

  function findTarget() {
    var selectors = [
      '#description-and-technical-information',
      '.product-description',
      '.product-info',
      '.product-details',
      '.product_tabs',
      '.tabs-product',
      '.tabs',
      '.descricao-produto',
      '.conteudo-produto',
      '[data-product-description]',
      '.product__info',
      '.productView-description'
    ];

    console.log('[FITTATO REVIEWS] Procurando alvo para inserção...');

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      console.log('[FITTATO REVIEWS] Testando seletor:', selectors[i], '=>', el);

      if (el) {
        console.log('[FITTATO REVIEWS] Alvo encontrado com seletor:', selectors[i]);
        return el;
      }
    }

    console.log('[FITTATO REVIEWS] Nenhum seletor alvo encontrado.');
    return null;
  }

  function setupCarousel(section) {
    console.log('[FITTATO REVIEWS] Iniciando carrossel...');

    var track = section.querySelector('.fittato-reviews-track');
    var cards = section.querySelectorAll('.fittato-review-card');
    var dotsWrap = section.querySelector('.fittato-reviews-dots');
    var prevBtn = section.querySelector('.fittato-reviews-prev');
    var nextBtn = section.querySelector('.fittato-reviews-next');
    var currentPage = 0;

    console.log('[FITTATO REVIEWS] Cards encontrados:', cards.length);

    function getPerPage() {
      if (window.innerWidth <= 767) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 4;
    }

    function getPages() {
      return Math.ceil(cards.length / getPerPage());
    }

    function getStepWidth() {
      var firstCard = cards[0];
      if (!firstCard) return 0;

      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || 18) || 18;
      var step = firstCard.offsetWidth + gap;

      console.log('[FITTATO REVIEWS] Largura do card:', firstCard.offsetWidth, '| Gap:', gap, '| Step:', step);
      return step;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var pages = getPages();

      console.log('[FITTATO REVIEWS] Construindo dots. Total de páginas:', pages);

      for (var i = 0; i < pages; i++) {
        (function (page) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'fittato-reviews-dot' + (page === currentPage ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Ir para avaliação ' + (page + 1));
          dot.addEventListener('click', function () {
            console.log('[FITTATO REVIEWS] Clique no dot:', page);
            goTo(page);
          });
          dotsWrap.appendChild(dot);
        })(i);
      }
    }

    function updateButtons() {
      var pages = getPages();
      prevBtn.disabled = currentPage <= 0;
      nextBtn.disabled = currentPage >= pages - 1;

      console.log('[FITTATO REVIEWS] Botões atualizados. Página:', currentPage, '| Total páginas:', pages);
    }

    function updateDots() {
      var dots = dotsWrap.querySelectorAll('.fittato-reviews-dot');
      for (var i = 0; i < dots.length; i++) {
        if (i === currentPage) dots[i].classList.add('is-active');
        else dots[i].classList.remove('is-active');
      }
    }

    function goTo(page) {
      var perPage = getPerPage();
      var pages = getPages();
      var stepWidth = getStepWidth();

      currentPage = Math.max(0, Math.min(page, pages - 1));
      var moveBy = currentPage * stepWidth * perPage;

      console.log('[FITTATO REVIEWS] Indo para página:', currentPage, '| perPage:', perPage, '| moveBy:', moveBy);

      track.style.transform = 'translateX(-' + moveBy + 'px)';

      updateButtons();
      updateDots();
    }

    prevBtn.addEventListener('click', function () {
      console.log('[FITTATO REVIEWS] Clique em anterior');
      goTo(currentPage - 1);
    });

    nextBtn.addEventListener('click', function () {
      console.log('[FITTATO REVIEWS] Clique em próximo');
      goTo(currentPage + 1);
    });

    buildDots();
    goTo(0);

    window.addEventListener('resize', function () {
      console.log('[FITTATO REVIEWS] Resize detectado');
      buildDots();
      goTo(currentPage);
    });

    console.log('[FITTATO REVIEWS] Carrossel iniciado com sucesso.');
  }

  function insertSection() {
    console.log('[FITTATO REVIEWS] Tentando inserir seção...');

    if (document.querySelector('.fittato-reviews-section')) {
      console.log('[FITTATO REVIEWS] Seção já existe na página.');
      return true;
    }

    var target = findTarget();
    var section = createSection();

    if (target && target.parentNode) {
      console.log('[FITTATO REVIEWS] Inserindo depois do alvo encontrado:', target);
      target.parentNode.insertBefore(section, target.nextSibling);
      setupCarousel(section);
      console.log('[FITTATO REVIEWS] Inserção concluída com sucesso no alvo principal.');
      return true;
    }

    var mainProduct = document.querySelector('main') ||
      document.querySelector('.main-content') ||
      document.querySelector('.product') ||
      document.querySelector('.product-page');

    console.log('[FITTATO REVIEWS] Fallback mainProduct:', mainProduct);

    if (mainProduct) {
      mainProduct.appendChild(section);
      setupCarousel(section);
      console.log('[FITTATO REVIEWS] Inserção concluída no fallback.');
      return true;
    }

    console.log('[FITTATO REVIEWS] Não foi possível inserir a seção nesta tentativa.');
    return false;
  }

  function init() {
    console.log('[FITTATO REVIEWS] init() executado');

    injectFont();
    injectStyle();

    if (insertSection()) {
      console.log('[FITTATO REVIEWS] Inserido já na primeira tentativa.');
      return;
    }

    console.log('[FITTATO REVIEWS] Iniciando tentativas por intervalo...');

    var interval = setInterval(function () {
      tries++;
      console.log('[FITTATO REVIEWS] Tentativa interval:', tries, '/', MAX_TRIES);

      if (insertSection() || tries >= MAX_TRIES) {
        clearInterval(interval);
        console.log('[FITTATO REVIEWS] Interval encerrado.');
      }
    }, 500);

    var observer = new MutationObserver(function (mutations) {
      console.log('[FITTATO REVIEWS] MutationObserver disparado. Mutations:', mutations.length);

      if (document.querySelector('.fittato-reviews-section')) {
        console.log('[FITTATO REVIEWS] Seção já inserida, encerrando observer.');
        observer.disconnect();
        return;
      }

      if (insertSection()) {
        console.log('[FITTATO REVIEWS] Inserção feita via MutationObserver.');
        observer.disconnect();
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('[FITTATO REVIEWS] MutationObserver iniciado.');
    } else {
      console.log('[FITTATO REVIEWS] document.body não encontrado.');
    }
  }

  if (document.readyState === 'loading') {
    console.log('[FITTATO REVIEWS] Documento ainda carregando, aguardando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', init);
  } else {
    console.log('[FITTATO REVIEWS] Documento já carregado, executando init imediatamente.');
    init();
  }
})();