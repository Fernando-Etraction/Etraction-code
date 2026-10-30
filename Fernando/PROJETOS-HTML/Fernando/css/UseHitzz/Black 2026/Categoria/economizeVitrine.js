(function () {
    document.querySelectorAll('.etr-hz-tag,#etr-hz-tag-css').forEach(e => e.remove());
    var css = document.createElement('style'); css.id = 'etr-hz-tag-css';
    css.textContent = `
.etr-hz-tag{order:3;display:flex;align-items:center;gap:6px;margin:6px 0 8px;padding:5px 0;background:#fff;border-top:1px solid #e51428;border-bottom:1px solid #e51428;color:#1a1a1a;font-family:inherit;font-size:12px;line-height:1.2}
.etr-hz-tag__dot{width:6px;height:6px;border-radius:50%;background:#e51428;flex:none;animation:etrHzTagBlink 1.2s infinite}
@keyframes etrHzTagBlink{50%{opacity:.3}}
.etr-hz-tag b{color:#e51428;font-weight:800}
.etr-hz-tag__pct{background:#e51428;color:#fff;font-weight:800;font-size:11px;padding:1px 5px;border-radius:4px}
@media (prefers-reduced-motion:reduce){.etr-hz-tag__dot{animation:none}}`;
    document.head.appendChild(css);

    var num = t => parseFloat((t || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    var brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function run() {
        document.querySelectorAll('.product-list-info').forEach(function (info) {
            var btn = info.querySelector(':scope > .etraction-home-ver-produto');
            var p = info.querySelector('.price');
            var tag = info.querySelector('.etr-hz-tag');
            if (!btn || !p) { if (tag) tag.remove(); return; }
            var fromEl = p.querySelector('.box-price-of .from-price');
            var porEl = p.querySelector('.cash-payment-container .to-price') || p.querySelector('.box-price-to > .to-price');
            var de = num(fromEl && fromEl.textContent), por = num(porEl && porEl.textContent);
            if (!de || !por || por >= de) { if (tag) tag.remove(); return; }
            var eco = de - por;
            var html = '<span class="etr-hz-tag__dot"></span>Economize <b>' + brl(eco) + '</b><span class="etr-hz-tag__pct">-' + Math.round(eco / de * 100) + '%</span>';
            if (!tag) { tag = document.createElement('div'); tag.className = 'etr-hz-tag'; }
            if (tag.nextElementSibling !== btn) info.insertBefore(tag, btn);
            tag.style.order = getComputedStyle(btn).order;   // acompanha o order do botão
            if (tag.innerHTML !== html) tag.innerHTML = html;
        });
    }

    run();
    var t;
    new MutationObserver(function (m) {
        if (m.every(x => { var n = x.target.nodeType === 1 ? x.target : x.target.parentElement; return n && n.closest('.etr-hz-tag'); })) return;
        clearTimeout(t); t = setTimeout(run, 150);
    }).observe(document.body, { childList: true, subtree: true });
})();