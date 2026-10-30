(function () {
    if (window.__etrEbFx) { window.__etrEbFx.stop(); }
    document.querySelectorAll('.etr-eb-fx,#etr-eb-fx-css').forEach(e => e.remove());

    var css = document.createElement('style'); css.id = 'etr-eb-fx-css';
    css.textContent = `
.hz-eb-tag{overflow:visible!important}
.hz-eb-tag .hz-eb-tag__in{position:relative;z-index:2}
.hz-eb-tag .hz-eb-tag__txt{background:linear-gradient(90deg,#fff 0%,#fff 42%,#ff2b3f 50%,#fff 58%,#fff 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:etrEbTxt 3.2s linear infinite}
@keyframes etrEbTxt{from{background-position:100% 0}to{background-position:-160% 0}}
.etr-eb-fx{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4}
.etr-eb-fx__clip{position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:-1;box-shadow:inset 0 0 0 1px rgba(229,20,40,.5)}
.etr-eb-fx__clip:after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,60,75,.55),transparent);transform:skewX(-20deg);animation:etrEbShine 3s ease-in-out infinite}
@keyframes etrEbShine{0%{left:-60%}55%,100%{left:130%}}
.hz-eb-tag.etr-flash .etr-eb-fx__clip{animation:etrEbFlash .7s ease-out}
@keyframes etrEbFlash{0%{box-shadow:inset 0 0 0 1px #ff2b3f,0 0 14px rgba(255,43,63,.7)}100%{box-shadow:inset 0 0 0 1px rgba(229,20,40,.5),0 0 0 rgba(255,43,63,0)}}
.etr-eb-p{position:absolute;width:2px;height:7px;margin:-3.5px 0 0 -1px;border-radius:2px;will-change:transform,opacity}
.etr-eb-c{position:absolute;width:2px;height:2px;margin:-1px;border-radius:50%;background:#fff;box-shadow:0 0 5px #ffd166}
.etr-eb-core{position:absolute;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff;box-shadow:0 0 10px 3px rgba(255,43,63,.7)}
@media (prefers-reduced-motion:reduce){.hz-eb-tag .hz-eb-tag__txt,.etr-eb-fx__clip:after{animation:none!important}}`;
    document.head.appendChild(css);

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PALETAS = [['#ff2b3f', '#ff6b7a', '#ffffff'], ['#ffd166', '#ffffff', '#ff2b3f']];
    var visiveis = new Set(), timer = null;

    function el(fx, cls, x, y) { var s = document.createElement('span'); s.className = cls; s.style.left = x + 'px'; s.style.top = y + 'px'; fx.appendChild(s); return s; }

    function burst(fx) {
        var tag = fx.parentElement, w = fx.offsetWidth || 130, h = fx.offsetHeight || 30;
        var x = w * .3 + Math.random() * w * .75, y = Math.random() < .5 ? -6 - Math.random() * 6 : h + 6 + Math.random() * 8;
        var pal = PALETAS[Math.random() * PALETAS.length | 0];

        tag.classList.remove('etr-flash'); void tag.offsetWidth; tag.classList.add('etr-flash');
        var core = el(fx, 'etr-eb-core', x, y);
        core.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1.8)', opacity: 0 }], { duration: 350, easing: 'ease-out' }).onfinish = function () { core.remove(); };

        var n = 14;
        for (var i = 0; i < n; i++) {
            (function (i) {
                var ang = (Math.PI * 2 / n) * i + (Math.random() - .5) * .3, dist = 18 + Math.random() * 12;
                var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist, rot = (ang * 180 / Math.PI) + 90;
                var c = pal[Math.random() * pal.length | 0];
                var p = el(fx, 'etr-eb-p', x, y);
                p.style.background = 'linear-gradient(' + c + ',rgba(255,255,255,0))'; p.style.boxShadow = '0 0 5px ' + c;
                p.animate([
                    { transform: 'translate(0,0) rotate(' + rot + 'deg) scaleY(.5)', opacity: 1 },
                    { transform: 'translate(' + dx * .8 + 'px,' + dy * .8 + 'px) rotate(' + rot + 'deg) scaleY(1.2)', opacity: 1, offset: .4 },
                    { transform: 'translate(' + dx + 'px,' + (dy + 10) + 'px) rotate(' + rot + 'deg) scaleY(.4)', opacity: 0 }
                ], { duration: 950 + Math.random() * 250, easing: 'cubic-bezier(.15,.7,.3,1)' }).onfinish = function () {
                    p.remove();
                    if (Math.random() < .15) {
                        var c2 = el(fx, 'etr-eb-c', x + dx, y + dy + 10);
                        c2.animate([{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: 0, offset: .6 }, { opacity: .8, offset: .8 }, { opacity: 0 }], { duration: 400 }).onfinish = function () { c2.remove(); };
                    }
                };
            })(i);
        }
    }

    function loop() {
        visiveis.forEach(function (fx) { if (Math.random() < .4) setTimeout(function () { burst(fx); }, Math.random() * 900); });
        timer = setTimeout(loop, 1800 + Math.random() * 800);
    }

    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
        es.forEach(e => { e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target); });
    }) : null;

    function run() {
        document.querySelectorAll('.hz-eb-tag').forEach(function (tag) {
            if (tag.querySelector(':scope > .etr-eb-fx')) return;
            var fx = document.createElement('span'); fx.className = 'etr-eb-fx';
            fx.innerHTML = '<span class="etr-eb-fx__clip"></span>';
            tag.appendChild(fx);
            if (io) io.observe(fx); else visiveis.add(fx);
        });
    }

    run();
    if (!reduce) loop();
    var t, mo = new MutationObserver(function (m) {
        if (m.every(x => { var n = x.target.nodeType === 1 ? x.target : x.target.parentElement; return n && n.closest('.etr-eb-fx'); })) return;
        clearTimeout(t); t = setTimeout(run, 150);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.__etrEbFx = { stop: function () { clearTimeout(timer); mo.disconnect(); io && io.disconnect(); document.querySelectorAll('.etr-eb-fx').forEach(e => e.remove()); } };
})();