(function () {
    document.querySelectorAll('.etr-hz-eco,#etr-hz-eco-css').forEach(e => e.remove());
    var APP = 12; // 0 para ocultar a linha do app
    var css = document.createElement('style'); css.id = 'etr-hz-eco-css';
    css.textContent = `
.etr-hz-eco{position:relative;overflow:hidden;margin:10px 0;padding:10px 14px;border-radius:10px;background:#0d0d0f;border:1px solid #2a2a2e;border-left:4px solid #e51428;font-family:inherit;color:#fff;line-height:1.35}
.etr-hz-eco:after{content:"";position:absolute;top:0;left:-40%;width:30%;height:100%;background:linear-gradient(90deg,transparent,rgba(229,20,40,.35),transparent);transform:skewX(-20deg);animation:etrHzShine 3.5s ease-in-out infinite;pointer-events:none}
@keyframes etrHzShine{0%{left:-40%}60%,100%{left:130%}}
.etr-hz-eco__hook{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#ff2b3f;margin-bottom:2px}
.etr-hz-eco__dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#e51428;margin-right:7px;vertical-align:1px;animation:etrHzPulse 1.4s infinite}
@keyframes etrHzPulse{0%{box-shadow:0 0 0 0 rgba(229,20,40,.8)}100%{box-shadow:0 0 0 9px rgba(229,20,40,0)}}
.etr-hz-eco__main{font-size:15px}
.etr-hz-eco__main b{color:#ff2b3f;font-weight:800}
.etr-hz-eco__pct{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:6px;background:#e51428;color:#fff;font-size:12px;font-weight:800;vertical-align:1px}
.etr-hz-eco__app{margin-top:3px;font-size:12px;color:#bdbdc2}
.etr-hz-eco__app b{color:#ff2b3f}`;
    document.head.appendChild(css);

    var num = t => parseFloat((t || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    var brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    var q = (...s) => s.map(x => document.querySelector(x)).find(Boolean);

    function render() {
        var de = num(q('.pdp-payment__from-value', '.pv-from-price')?.textContent);
        var pixEl = q('.pdp-payment__price--cash-payment');
        var por = num((pixEl || q('.pv-price-sale'))?.textContent);
        var box = document.querySelector('.etr-hz-eco');
        if (!de || !por || por >= de) { if (box) box.style.display = 'none'; return; }
        if (!box) {
            var ref = q('.pdp-payment', '.product-price'); if (!ref) return;
            box = document.createElement('div'); box.className = 'etr-hz-eco';
            ref.after(box);
        }
        box.style.display = '';
        var eco = de - por;
        var html = '<div class="etr-hz-eco__hook"><span class="etr-hz-eco__dot"></span>Garanta antes que a Black acabe</div>' +
            '<div class="etr-hz-eco__main">Você economiza <b>' + brl(eco) + '</b>' + (pixEl ? ' no Pix' : '') +
            '<span class="etr-hz-eco__pct">-' + Math.round(eco / de * 100) + '%</span></div>' +
            (APP ? '<div class="etr-hz-eco__app">E no app, +' + APP + '% OFF na 1ª compra: economia de <b>' + brl(de - por * (1 - APP / 100)) + '</b></div>' : '');
        if (box.innerHTML !== html) box.innerHTML = html;
    }

    render();
    var t;
    new MutationObserver(function (m) {
        if (m.every(x => { var n = x.target.nodeType === 1 ? x.target : x.target.parentElement; return n && n.closest('.etr-hz-eco'); })) return;
        clearTimeout(t); t = setTimeout(render, 120);
    }).observe(q('.pdp-payment', '.product-price') || document.body, { childList: true, subtree: true, characterData: true });
})();