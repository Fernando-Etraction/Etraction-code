$(document).ready(function () {

    const STORAGE_KEY = "promo_deadline_72h";
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 72 horas exatas

    // ====== CRIA / RECUPERA DEADLINE ======
    function getOrSetDeadline() {
        const saved = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();

        if (saved && Number(saved) > now) {
            return new Date(Number(saved));
        } else {
            const newDeadline = new Date(now + THREE_DAYS_MS);
            localStorage.setItem(STORAGE_KEY, newDeadline.getTime());
            return newDeadline;
        }
    }

    const deadline = getOrSetDeadline();

    // ====== INJETA HTML ======
    $(`
  <style>
    .container-menu{z-index:100;}
    .promo-banner-unico{background:#333;color:#fff;padding:10px 5%;width:100%;z-index:9;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:clamp(.8em,2.5vw,1em);text-align:center;box-sizing:border-box;position:relative;transition:.3s;}
    .promo-banner-fixo{position:fixed !important;top:0;left:0;}
    .promo-texto-unico{display:flex;align-items:center;text-align:center;width:100%;justify-content:center;flex-wrap:wrap;gap:.5em;}
    .promo-texto-unico p{margin:0 !important;}
    .close-btn{position:absolute;top:10px;right:10px;background:transparent;border:none;color:#fff;font-size:1.5em;cursor:pointer;z-index:10;}
    .close-btn:hover{color:yellow;}
    @media(max-width:768px){.promo-texto-unico{flex-direction:column;gap:0;}}
    @media(max-width:480px){.promo-banner-unico{padding:10px 2%;}.close-btn{top:5px;right:5px;font-size:1.2em;}.promo-banner-fixo{position:fixed !important;}}
    .timer-unico{display:flex;align-items:center;gap:8px;font-weight:bold;font-size:clamp(1em,3vw,1.2em);}
    .timer-bloco{background:#00B22F;color:#fff;padding:2px 6px;border-radius:5px;font-weight:bold;font-size:1em;display:flex;flex-direction:column;align-items:center;min-width:45px;}
    .timer-bloco .label{font-size:.6em;font-weight:normal;text-transform:uppercase;line-height:1.1;}
    .not-hover:hover{color:#fff !important;}
  </style>

  <a href="https://www.florestacarpintaria.com.br/para-seu-estabelecimento?sorting%5Bbestseller%5D=asc&amp;page=1" class="promo-banner-unico" id="promo-banner">
    <button class="close-btn" aria-label="Fechar">×</button>
    <div class="promo-texto-unico">
      <p class="not-hover"><span style="font-weight:bold;">Black Friday</span> com desconto de verdade!<strong> Até 34% Off</strong> | Expira em:</p>
      <div class="timer-unico" aria-live="polite">
        <div class="timer-bloco" id="horas">00<div class="label">HRS</div></div>
        <div class="timer-bloco" id="minutos">00<div class="label">MIN</div></div>
        <div class="timer-bloco" id="segundos">00<div class="label">SEC</div></div>
      </div>
    </div>
  </a>`).insertBefore('.navbar');

    const $banner = document.getElementById('promo-banner');

    // ====== FUNÇÃO AUXILIAR ======
    function pad2(n) { return String(n).padStart(2, '0'); }

    // ====== CRONÔMETRO ======
    function atualizarCronometro() {
        const agora = new Date();
        let t = deadline - agora;

        // Se expirou, reinicia o ciclo de 72h exatas
        if (t <= 0) {
            const novoPrazo = new Date(Date.now() + THREE_DAYS_MS);
            localStorage.setItem(STORAGE_KEY, novoPrazo.getTime());
            window.location.reload(); // reinicia o cronômetro automaticamente
            return;
        }

        const totalSeg = Math.floor(t / 1000);
        const totalHoras = Math.floor(totalSeg / 3600); // inclui dias
        const minutos = Math.floor((totalSeg % 3600) / 60);
        const segundos = totalSeg % 60;

        document.getElementById('horas').firstChild.nodeValue = pad2(totalHoras);
        document.getElementById('minutos').firstChild.nodeValue = pad2(minutos);
        document.getElementById('segundos').firstChild.nodeValue = pad2(segundos);
    }

    const intervaloCronometro = setInterval(atualizarCronometro, 1000);
    atualizarCronometro();

    // ====== FECHAR ======
    document.querySelector(".close-btn").addEventListener("click", function () {
        $banner.style.display = "none";
    });

    // ====== FIXAR AO ROLAR ======
    window.addEventListener("scroll", function () {
        if (!$banner) return;
        if (window.scrollY > 100) $banner.classList.add("promo-banner-fixo");
        else $banner.classList.remove("promo-banner-fixo");
    });
});