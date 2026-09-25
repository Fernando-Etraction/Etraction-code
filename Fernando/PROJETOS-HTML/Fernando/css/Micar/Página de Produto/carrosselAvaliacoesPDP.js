(function () {
    'use strict';

    const SECTION_ID = 'mcr-reviews-carousel';
    const STYLE_ID = 'mcr-reviews-carousel-style';
    const TARGET_ID = 'description-and-technical-information-boxed';

    function log() {
        console.log('[MCR-REVIEWS]', ...arguments);
    }

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) {
            log('Style já existe');
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
      #${SECTION_ID} {
        max-width: 100%;
        background: #ffffff;
        border-radius: 20px;
        padding: 30px 20px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        margin: 40px 0;
        position: relative;
        font-family: 'Poppins', sans-serif;
        --yellow: #f3c511;
        --blue: #135b99;
        box-sizing: border-box;
      }

      #${SECTION_ID} .mcr-title {
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 10px;
        text-align: center;
        color: var(--blue);
      }

      #${SECTION_ID} .mcr-subtitle {
        font-size: 14px;
        text-align: center;
        color: #5f6b7a;
        margin-bottom: 25px;
      }

      #${SECTION_ID} .mcr-track-container {
        overflow: hidden;
        width: 100%;
      }

      #${SECTION_ID} .mcr-track {
        display: flex;
        gap: 20px;
        transition: transform 0.4s ease;
        will-change: transform;
      }

      #${SECTION_ID} .mcr-item {
        width: 250px;
        min-width: 250px;
        max-width: 250px;
        background: #f8fbff;
        border: 1px solid rgba(19, 91, 153, 0.15);
        padding: 22px;
        border-radius: 14px;
        flex-shrink: 0;
        transition: all 0.25s ease;
        cursor: pointer;
        box-sizing: border-box;
      }

      #${SECTION_ID} .mcr-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 24px rgba(19, 91, 153, 0.14);
        border-color: var(--blue);
      }

      #${SECTION_ID} .mcr-item p {
        font-size: 14px;
        line-height: 1.6;
        color: #2d3748;
        margin: 0 0 16px;
        min-height: 92px;
      }

      #${SECTION_ID} .mcr-author {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid rgba(19, 91, 153, 0.12);
      }

      #${SECTION_ID} .mcr-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--blue);
        color: #fff;
        font-weight: 700;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(19, 91, 153, 0.18);
        flex-shrink: 0;
      }

      #${SECTION_ID} .mcr-author-info strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #1a1a1a;
      }

      #${SECTION_ID} .mcr-stars {
        display: flex;
        gap: 3px;
        color: var(--yellow);
        font-size: 14px;
        margin-top: 4px;
      }

      #${SECTION_ID} .mcr-author-info span {
        font-size: 12px;
        color: #6b7280;
      }

      #${SECTION_ID} .mcr-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 25px;
      }

      #${SECTION_ID} .mcr-controls button {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid var(--blue);
        background: #fff;
        color: var(--blue);
        font-size: 18px;
        cursor: pointer;
        transition: 0.25s ease;
      }

      #${SECTION_ID} .mcr-controls button:hover:not(:disabled) {
        background: var(--blue);
        color: #fff;
      }

      #${SECTION_ID} .mcr-controls button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      #${SECTION_ID} .mcr-dots {
        display: flex;
        gap: 6px;
      }

      #${SECTION_ID} .mcr-dot {
        width: 8px;
        height: 8px;
        background: #cfd8e3;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.25s ease;
      }

      #${SECTION_ID} .mcr-dot.active {
        width: 22px;
        border-radius: 4px;
        background: var(--yellow);
      }

      @media (max-width: 768px) {
        #${SECTION_ID} {
          padding: 24px 14px;
          border-radius: 16px;
          margin: 30px 0;
        }

        #${SECTION_ID} .mcr-title {
          font-size: 22px;
        }

        #${SECTION_ID} .mcr-item {
          width: 240px;
          min-width: 240px;
          max-width: 240px;
        }

        #${SECTION_ID} .mcr-item p {
          min-height: 110px;
        }
      }
    `;

        document.head.appendChild(style);
        log('Style injetado');
    }

    function getHtml() {
        return `
      <section id="${SECTION_ID}">
        <h2 class="mcr-title">Quem compra na Micar Construção recomenda</h2>
        <p class="mcr-subtitle">Materiais, acabamentos e utilidades com confiança, bom atendimento e entrega para todo o Brasil</p>

        <div class="mcr-track-container">
          <div class="mcr-track">

            <div class="mcr-item">
              <p>Encontrei tudo o que precisava para a obra em um só lugar. Site fácil de usar, preço bom e entrega dentro do prazo.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">RA</div>
                <div class="mcr-author-info">
                  <strong>Ricardo Alves</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificado • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Comprei metais e acessórios para banheiro e gostei muito da qualidade. Veio tudo bem embalado e certinho.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">CS</div>
                <div class="mcr-author-info">
                  <strong>Camila Souza</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificada • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Atendimento rápido, produtos fiéis às fotos e excelente custo-benefício. Voltarei a comprar para finalizar minha reforma.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">MP</div>
                <div class="mcr-author-info">
                  <strong>Marcos Pereira</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificado • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Gostei muito da experiência. O pedido chegou em perfeito estado e a navegação do site ajudou bastante na escolha dos itens.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">JL</div>
                <div class="mcr-author-info">
                  <strong>Juliana Lima</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificada • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Comprei itens hidráulicos e acessórios de acabamento. Tudo chegou certo e com ótima apresentação. Loja muito confiável.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">FS</div>
                <div class="mcr-author-info">
                  <strong>Felipe Santos</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificado • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Foi minha primeira compra na Micar Construção e me surpreendeu. Processo simples, comunicação clara e entrega rápida.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">AP</div>
                <div class="mcr-author-info">
                  <strong>Ana Paula</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificada • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Ótima variedade de produtos para obra e reforma. Consegui comparar modelos com facilidade e comprei com segurança.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">DG</div>
                <div class="mcr-author-info">
                  <strong>Diego Gomes</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificado • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Entrega organizada, produtos bem protegidos e qualidade excelente. Recomendo para quem busca praticidade na hora de comprar online.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">LN</div>
                <div class="mcr-author-info">
                  <strong>Larissa Nunes</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificada • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Comprei para uma pequena reforma e valeu muito a pena. Produtos bons, preço competitivo e experiência muito positiva.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">VB</div>
                <div class="mcr-author-info">
                  <strong>Vinícius Barros</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificado • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
              <p>Gostei bastante do suporte e da rapidez no envio. Dá tranquilidade comprar em uma loja que passa confiança do início ao fim.</p>
              <div class="mcr-author">
                <div class="mcr-avatar">TC</div>
                <div class="mcr-author-info">
                  <strong>Talita Carvalho</strong>
                  <div class="mcr-stars">★★★★★</div>
                  <span>Cliente verificada • Brasil</span>
                </div>
              </div>
            </div>

            <div class="mcr-item">
  <p>Comprei acessórios para cozinha e alguns itens de acabamento. Chegou tudo certo, bem embalado e com qualidade acima do esperado.</p>
  <div class="mcr-author">
    <div class="mcr-avatar">BM</div>
    <div class="mcr-author-info">
      <strong>Bruna Martins</strong>
      <div class="mcr-stars">★★★★★</div>
      <span>Cliente verificada • Brasil</span>
    </div>
  </div>
</div>

<div class="mcr-item">
  <p>Loja organizada, produtos fáceis de encontrar e ótimo atendimento. Foi uma compra tranquila do início ao fim para minha reforma.</p>
  <div class="mcr-author">
    <div class="mcr-avatar">RC</div>
    <div class="mcr-author-info">
      <strong>Rafael Costa</strong>
      <div class="mcr-stars">★★★★★</div>
      <span>Cliente verificado • Brasil</span>
    </div>
  </div>
</div>

<div class="mcr-item">
  <p>Já é a segunda vez que compro na Micar Construção e novamente tive uma ótima experiência. Preço justo, envio rápido e produtos excelentes.</p>
  <div class="mcr-author">
    <div class="mcr-avatar">PS</div>
    <div class="mcr-author-info">
      <strong>Patrícia Silva</strong>
      <div class="mcr-stars">★★★★★</div>
      <span>Cliente verificada • Brasil</span>
    </div>
  </div>
</div>

          </div>
        </div>

        <div class="mcr-controls">
          <button class="mcr-prev" type="button" aria-label="Anterior">‹</button>
          <div class="mcr-dots"></div>
          <button class="mcr-next" type="button" aria-label="Próximo">›</button>
        </div>
      </section>
    `;
    }

    function initCarousel() {
        const root = document.getElementById(SECTION_ID);
        if (!root) {
            log('Carrossel não encontrado para iniciar');
            return;
        }

        const track = root.querySelector('.mcr-track');
        const items = root.querySelectorAll('.mcr-item');
        const dotsContainer = root.querySelector('.mcr-dots');
        const prevBtn = root.querySelector('.mcr-prev');
        const nextBtn = root.querySelector('.mcr-next');

        if (!track || !items.length || !dotsContainer || !prevBtn || !nextBtn) {
            log('Estrutura incompleta');
            return;
        }

        let index = 0;
        const gap = 20;

        function getItemWidth() {
            const first = root.querySelector('.mcr-item');
            if (!first) return 270;
            return first.offsetWidth + gap;
        }

        function getVisibleItems() {
            const container = root.querySelector('.mcr-track-container');
            const itemWidth = getItemWidth();
            if (!container || !itemWidth) return 1;
            return Math.max(1, Math.floor(container.offsetWidth / itemWidth));
        }

        function getPages() {
            return Math.max(1, Math.ceil(items.length / getVisibleItems()));
        }

        function renderDots() {
            const pages = getPages();
            dotsContainer.innerHTML = '';

            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('div');
                dot.className = 'mcr-dot' + (i === index ? ' active' : '');
                dot.addEventListener('click', function () {
                    go(i);
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateButtons() {
            const pages = getPages();
            prevBtn.disabled = index <= 0;
            nextBtn.disabled = index >= pages - 1;
        }

        function go(newIndex) {
            const visible = getVisibleItems();
            const pages = getPages();
            const itemWidth = getItemWidth();

            index = Math.max(0, Math.min(newIndex, pages - 1));
            track.style.transform = 'translateX(' + (-(index * itemWidth * visible)) + 'px)';

            const dots = root.querySelectorAll('.mcr-dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });

            updateButtons();
        }

        prevBtn.addEventListener('click', function () {
            go(index - 1);
        });

        nextBtn.addEventListener('click', function () {
            go(index + 1);
        });

        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                const pages = getPages();
                if (index > pages - 1) index = pages - 1;
                renderDots();
                go(index);
            }, 120);
        });

        renderDots();
        go(0);
        log('Carrossel iniciado');
    }

    function insertSection() {
        if (document.getElementById(SECTION_ID)) {
            log('Bloco já existe');
            return true;
        }

        const target = document.getElementById(TARGET_ID);
        if (!target) {
            log('Alvo ainda não encontrado:', TARGET_ID);
            return false;
        }

        target.insertAdjacentHTML('afterend', getHtml());
        log('Bloco inserido após #' + TARGET_ID);
        initCarousel();
        return true;
    }

    function start() {
        injectStyle();

        if (insertSection()) return;

        const observer = new MutationObserver(function () {
            if (insertSection()) {
                observer.disconnect();
                log('Observer finalizado');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('Observer iniciado');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();