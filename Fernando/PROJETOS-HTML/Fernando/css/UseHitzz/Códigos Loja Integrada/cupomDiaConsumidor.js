    /* ===== INFORMATIVO DIA DO CONSUMIDOR HITZZ (DESCONTO PROGRESSIVO) =====
    - Aparece mesmo sem selecionar tamanho (injeta em âncora estável)
    - Depois move pra afterend do .comprar quando ele existir
    - Desconto progressivo: 10% / 15% / 20% por quantidade de peças
    - Acima de 4 peças: 20% OFF + MEIA DE PRESENTE
    */
    (() => {
        console.log("💖 Informativo Dia do Consumidor HITZZ");

        const CONFIG = {
            targetSelector: ".parcelas-produto",
            fallbackTargetSelector: "#corpo .acoes-produto div.comprar",

            stableAnchors: [
                "#corpo .produto .acoes-produto",
                "#corpo .acoes-produto",
                "#corpo .produto",
                "#corpo"
            ],

            headlineBadge: "15 de Março · Dia do Consumidor",
            endTimeISO: "2026-03-15T23:59:59-03:00",
            timerIntervalMs: 250,
        };

        const GLOBAL_KEY = "__CP_CONSUMIDOR_LIVE__";
        if (window[GLOBAL_KEY]) return;
        window[GLOBAL_KEY] = { mounted: false, cleanup: null };

        const ROOT_ID = "cpConsumidorRoot";
        const TIMER_ID = "cpTimerDisplay";
        const STYLE_ID = "cp-consumidor-style-live";

        /* ═══════════════════════════════════════════════════
        CSS — Design editorial neutro (creme / areia / ouro)
        Mantém TODOS os nomes de classe originais
        ════════════════════════════════════════════════════ */
        const CSS = `

    /* ── oculta seletor de tamanho (original mantido) ── */
    .v-tamanho-produto { display: none !important; }

    /* ══════════════════════════════════════ */
        CARD PRINCIPAL
    ══════════════════════════════════════ */
    .cp-consumidor {
        max-width: 600px;
        background: #FFFFFF;
        border-radius: 6px;
        position: relative;
        padding: 0 !important;
        border: 1.5px solid #8B2E4D;
        box-shadow: 0 4px 20px rgba(139, 46, 77, 0.12);
    }

    /* ── grain texture overlay ── */
    .cp-bg-pattern {
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 0;
    }

    /* ── wrapper interno (swiper-slide já no HTML) ── */
    .cp-consumidor .swiper-slide {
        padding: 20px 22px 18px;
        position: relative;
        z-index: 1;
        border: 1px solid #8B2E4D;
        border-radius: 10px;
    }

    /* ══════════════════════════════════════
        HEADER (título + timer)
    ══════════════════════════════════════ */
    .cp-slide-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 14px;
        border-bottom: 1px solid #DFC4D6;

    }

    /* ── título ── */
    .cp-event-title {
        line-height: 0.93;
        letter-spacing: -0.5px;
    }

    .cp-event-title .cp-dia {
        font-style: normal;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #8B2E4D;
        display: flex;
        align-items: center;
        gap: 7px;
    }

    .cp-event-title .cp-consumidor {
        color: #333;
        display: block;
        font-size: 30px;
    }

    /* ── timer ── */
    .cp-timer {
        border: 1px solid #8B2E4D;
        border-radius: 6px;
        padding: 9px 16px;
        text-align: center;
        min-width: 160px;
    }

    .cp-timer-label {
        font-size: 10px;
        color: #8B2E4D;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 6px;
    }

    .cp-timer-value {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        white-space: nowrap;
        letter-spacing: 1px;
    }

    /* ══════════════════════════════════════
        DATE BADGE
    ══════════════════════════════════════ */
    .cp-date-badge {
        gap: 6px;
        font-size: 10px;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: #8B2E4D;
        margin: 12px 0;
        font-weight: 600;
    }


    /* ══════════════════════════════════════
        GRADE DE DESCONTOS PROGRESSIVOS
    ══════════════════════════════════════ */
    .cp-progressive-container {
        display: flex;
        gap: 7px;
        align-items: stretch;
        flex-wrap: nowrap;
        margin-top: 0;
    }

    .cp-discount-item {
        background: #FAF6F9;
        border: 1px solid #DFC4D6;
        border-radius: 5px;
        padding: 12px 8px 10px;
        flex: 1;
        min-width: 0;
        text-align: center;
        position: relative;
        overflow: hidden;
        transition: all 0.25s ease;
    }
    .cp-discount-item:hover {
        background: #F5E8ED;
        border-color: #8B2E4D;
    }

    /* remove shimmer do original */
    .cp-discount-item::before { display: none; }

    .cp-discount-amount {
        font-size: 28px;
        font-weight: 900;
        color: #8B2E4D;
        line-height: 1;
        position: relative;
        z-index: 1;
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 1px;
    }

    .cp-discount-amount span {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
    }

    .cp-discount-label {
        font-size: 9px;
        color: #333333;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-top: 5px;
        position: relative;
        z-index: 1;
    }

    /* ── caixa bônus (4+ peças) ── */
    .cp-bonus-box {
        background: #8B2E4D;
        border: none;
        border-radius: 5px;
        padding: 12px 10px 10px;
        text-align: center;
        position: relative;
        overflow: hidden;
        min-width: 120px;
        flex-shrink: 0;
        transition: all 0.25s ease;
    }
    .cp-bonus-box:hover { background: #6A1F3C; }

    /* remove shimmer do original */
    .cp-bonus-box::before { display: none; }

    .cp-bonus-icon {
        font-size: 22px;
        position: relative;
        z-index: 1;
        margin-bottom: 5px;
        line-height: 1;
    }

    .cp-bonus-text {
        font-size: 9px;
        color: #FFFFFF;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        position: relative;
        z-index: 1;
        line-height: 1.4;
    }

    /* ══════════════════════════════════════
        RODAPÉ
    ══════════════════════════════════════ */
    .cp-validity-text {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #DFC4D6;
        font-size: 8.5px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #666666;
        font-weight: 600;
    }
    .cp-validity-text::before {
        content: "";
        display: inline-block;
        width: 6px; height: 6px;
        background: #B8966A;
        border-radius: 50%;
        flex-shrink: 0;
    }

    /* ══════════════════════════════════════
        RESPONSIVO
    ══════════════════════════════════════ */
    @media (max-width: 768px) {
        .cp-consumidor .swiper-slide { padding: 16px; }
        .cp-event-title { font-size: 24px; }
        .cp-event-title { font-size: 22px; }
        .cp-timer { min-width: 130px; padding: 6px 10px; }
        .cp-timer-value { font-size: 16px; }
        .cp-progressive-container { gap: 5px; }
        .cp-discount-item { padding: 10px 6px 8px; }
        .cp-discount-amount { font-size: 24px; }
        .cp-bonus-box { min-width: 100px; }
    }

    @media (max-width: 600px) {
        .cp-consumidor .swiper-slide { padding: 14px; }
        .cp-slide-header { gap: 10px; margin-bottom: 10px; }
        .cp-event-title { font-size: 20px; }
        .cp-event-title .cp-dia { font-size: 11px; }
        .cp-event-title { font-size: 18px; }
        .cp-timer { min-width: 110px; padding: 5px 8px; }
        .cp-timer-value { font-size: 14px; }
        .cp-timer-label { font-size: 7px; }
        .cp-date-badge { font-size: 9px;
        padding: 4px 9px;
        letter-spacing: 3px;
        margin: 10px 0px; }
        .cp-discount-amount { font-size: 20px; }
        .cp-progressive-container { gap: 4px; }
        .cp-discount-item { padding: 8px 5px 7px; }
        .cp-discount-label { font-size: 8px; }
        .cp-bonus-box { min-width: 88px; padding: 8px; }
        .cp-bonus-icon { font-size: 18px; }
        .cp-bonus-text { font-size: 8px; }
        .cp-validity-text { font-size: 8px; margin-top: 10px; padding-top: 10px; }
    }

    @media (max-width: 380px) {
        .cp-consumidor .swiper-slide { padding: 12px; }
        .cp-event-title { font-size: 18px; }
        .cp-event-title .cp-dia { font-size: 10px; letter-spacing: 1.5px; }
        .cp-event-title .cp-consumidor { font-size: 16px; }
        .cp-date-badge { font-size: 7.5px; padding: 3px 7px; }
        .cp-timer { min-width: 95px; padding: 4px 7px; }
        .cp-timer-label { font-size: 6.5px; }
        .cp-timer-value { font-size: 12px; }
        .cp-progressive-container { gap: 3px; }
        .cp-discount-item { padding: 7px 4px 6px; }
        .cp-discount-amount { font-size: 17px; }
        .cp-discount-label { font-size: 7px; }
        .cp-bonus-box { min-width: 76px; padding: 7px 6px; }
        .cp-bonus-icon { font-size: 16px; }
        .cp-bonus-text { font-size: 7px; }
        .cp-validity-text { font-size: 7.5px; gap: 5px; }
    }
    `;

        /* ══════════════════════════════════════
        FUNÇÕES UTILITÁRIAS (originais)
        ══════════════════════════════════════ */
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function buildHTML() {
            const badge = escapeHtml(CONFIG.headlineBadge);

            return `
    <div class="cp-consumidor" id="${ROOT_ID}">
    <div class="cp-bg-pattern"></div>
    <div class="swiper-slide">
        <div class="cp-slide-header">
        <div>
            <div class="cp-event-title">
        <div class="cp-date-badge">${badge}</div>

            <span class="cp-consumidor">Dia do Consumidor</span>

            </div>
        </div>

        <div class="cp-timer">
            <div class="cp-timer-label">Termina em</div>
            <div class="cp-timer-value" id="${TIMER_ID}">00d 00:00:00</div>
        </div>
        </div>


        <div class="cp-progressive-container">
        <div class="cp-discount-item">
            <div class="cp-discount-amount">10<span>%</span></div>
            <div class="cp-discount-label">1 peça</div>
        </div>

        <div class="cp-discount-item">
            <div class="cp-discount-amount">15<span>%</span></div>
            <div class="cp-discount-label">2 peças</div>
        </div>

        <div class="cp-discount-item">
            <div class="cp-discount-amount">20<span>%</span></div>
            <div class="cp-discount-label">3 peças</div>
        </div>

        <div class="cp-bonus-box">
            <div class="cp-bonus-icon">🎁</div>
            <div class="cp-bonus-text">4+ peças<br>20% + MEIA</div>
        </div>
        </div>

        <div class="cp-validity-text">Válido em todo o site · Desconto automático no carrinho</div>
    </div>
    </div>`.trim();
        }

        /* ══════════════════════════════════════
        LÓGICA DE INJEÇÃO (original intacta)
        ══════════════════════════════════════ */
        function addStyleOnce() {
            if (document.getElementById(STYLE_ID)) return;
            const s = document.createElement("style");
            s.id = STYLE_ID;
            s.textContent = CSS;
            document.head.appendChild(s);
        }

        function findComprar() {
            return (
                document.querySelector(CONFIG.targetSelector) ||
                document.querySelector(CONFIG.fallbackTargetSelector)
            );
        }

        function findStableAnchor() {
            for (let i = 0; i < CONFIG.stableAnchors.length; i++) {
                const el = document.querySelector(CONFIG.stableAnchors[i]);
                if (el) return el;
            }
            return null;
        }

        function ensureInjectedSomewhere() {
            let existing = document.getElementById(ROOT_ID);
            if (existing) return existing;

            addStyleOnce();

            const anchor = findStableAnchor();
            if (!anchor) return null;

            const wrap = document.createElement("div");
            wrap.innerHTML = buildHTML();
            const infoEl = wrap.firstElementChild;

            anchor.insertAdjacentElement("beforebegin", infoEl);
            return infoEl;
        }

        function moveAfterComprarIfExists() {
            const infoEl = ensureInjectedSomewhere();
            if (!infoEl) return;

            const comprar = findComprar();
            if (!comprar) return;

            if (infoEl.previousElementSibling === comprar) return;
            comprar.insertAdjacentElement("afterend", infoEl);
        }

        function startTimerOnce() {
            const timerEl = document.getElementById(TIMER_ID);
            if (!timerEl || timerEl.__cpTimerRunning) return;
            timerEl.__cpTimerRunning = true;

            const endTime = new Date(CONFIG.endTimeISO).getTime();

            function updateTimer() {
                const el = document.getElementById(TIMER_ID);
                if (!el) return;

                const now = Date.now();
                const distance = endTime - now;

                if (distance <= 0) {
                    el.textContent = "00d 00:00:00";
                    return;
                }

                const totalSeconds = Math.floor(distance / 1000);
                const days = Math.floor(totalSeconds / (24 * 60 * 60));
                const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
                const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
                const seconds = totalSeconds % 60;

                el.textContent =
                    `${String(days).padStart(2, "0")}d ` +
                    `${String(hours).padStart(2, "0")}:` +
                    `${String(minutes).padStart(2, "0")}:` +
                    `${String(seconds).padStart(2, "0")}`;
            }

            updateTimer();
            setInterval(updateTimer, CONFIG.timerIntervalMs);
        }

        function mount() {
            ensureInjectedSomewhere();
            moveAfterComprarIfExists();
            startTimerOnce();
            window[GLOBAL_KEY].mounted = true;
        }

        const observer = new MutationObserver(() => mount());

        function start() {
            mount();
            observer.observe(document.documentElement, { childList: true, subtree: true });

            let tries = 0;
            const poke = setInterval(() => {
                tries++;
                mount();
                if (tries > 40) clearInterval(poke);
            }, 500);

            window.__CP_CONSUMIDOR_REMOVE__ = () => {
                try { observer.disconnect(); } catch { }
                const el = document.getElementById(ROOT_ID);
                if (el) el.remove();
                const st = document.getElementById(STYLE_ID);
                if (st) st.remove();
                delete window[GLOBAL_KEY];
                console.log("🧹 Informativo Consumidor removido.");
            };
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", start, { once: true });
        } else {
            start();
        }
    })();