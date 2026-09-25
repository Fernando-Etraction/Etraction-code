import React, { useEffect, useRef, useState, memo, useCallback } from "react";

/* =========================================================================
   ETRACTION PARTNER PREMIUM — CONVITE
   ========================================================================= */

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfuKdz6vECxDgoVVcmblRqFtXZb2_aLAyK7ON-4oxD2iZBaww/formResponse";

const FIELDS = {
  google: "entry.1442541145",
  meta: "entry.840646251",
  dinner: "entry.1566782500",
  name: "entry.253195025",
  company: "entry.722262274",
};

/* ------------------------------------------------------------------ STYLES */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

    :root{
      --bg:#050402; --bg-warm:#0e0a05; --bg-warmer:#150f08;
      --gold:#d4a05a; --gold-bright:#f0c987; --gold-soft:#a07a3e; --gold-deep:#5c4220;
      --ember:#ff9a3c;
      --ivory:#f5ead4; --ivory-dim:#b5a890; --ivory-mute:#6b6052;
      --line:rgba(212,160,90,0.18); --line-warm:rgba(245,234,212,0.06);
      --serif:'Cormorant Garamond','Times New Roman',serif;
      --sans:'Inter',system-ui,sans-serif;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{background:var(--bg);color:var(--ivory);font-family:var(--sans);-webkit-font-smoothing:antialiased}
    body{overflow-x:hidden}

    .ep-root{position:relative;min-height:100vh;
      background:
        radial-gradient(1200px 800px at 50% -10%, rgba(212,160,90,.08), transparent 60%),
        radial-gradient(900px 700px at 90% 110%, rgba(255,154,60,.05), transparent 60%),
        linear-gradient(180deg,var(--bg) 0%,var(--bg-warm) 50%,var(--bg) 100%);
      color:var(--ivory);overflow:hidden;}

    .ep-canvas{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.55}
    .ep-vignette{position:fixed;inset:0;pointer-events:none;z-index:2;
      background:radial-gradient(120% 80% at 50% 50%,transparent 50%,rgba(0,0,0,.55) 85%,rgba(0,0,0,.85) 100%)}
    .ep-grain{position:fixed;inset:0;pointer-events:none;z-index:3;opacity:.06;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.91 0 0 0 0 0.83 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}

    .ep-intro{position:fixed;inset:0;z-index:60;
      background:radial-gradient(1000px 700px at 50% 50%, rgba(212,160,90,.05), transparent 60%),var(--bg);
      display:flex;align-items:center;justify-content:center;
      transition:opacity 1.1s ease, visibility 1.1s ease}
    .ep-intro.hide{opacity:0;visibility:hidden;pointer-events:none}
    .ep-intro-logo{width:min(560px,78vw);position:relative}
    .ep-intro-logo svg{width:100%;height:auto;display:block}

    .ep-logo .stroke{fill:transparent;stroke:var(--ivory);stroke-width:1;
      stroke-dasharray:var(--len);stroke-dashoffset:var(--len);
      animation:draw 1600ms cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--delay,0ms)}
    .ep-logo .fillin{opacity:0;animation:fillin 900ms ease-out 1700ms forwards}
    .ep-logo .sub{opacity:0;animation:fillin 900ms ease-out 2100ms forwards}
    .ep-logo .shimmer{animation:shimmer 1800ms ease-in-out 1900ms 1 forwards;transform-origin:center}
    @keyframes draw{to{stroke-dashoffset:0}}
    @keyframes fillin{to{opacity:1}}
    @keyframes shimmer{0%{opacity:0;transform:translateX(-30%)}40%{opacity:1}100%{opacity:0;transform:translateX(40%)}}

    .ep-nav{position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;
      justify-content:space-between;padding:26px 40px;
      transition:padding .35s ease,background .35s ease,backdrop-filter .35s ease,border-color .35s ease;
      border-bottom:1px solid transparent}
    .ep-nav.scrolled{padding:14px 40px;background:rgba(5,4,2,.65);
      backdrop-filter:blur(14px) saturate(110%);-webkit-backdrop-filter:blur(14px) saturate(110%);
      border-bottom-color:var(--line-warm)}
    .ep-nav-brand{font-family:var(--serif);font-size:18px;letter-spacing:.5px;color:var(--ivory);font-weight:500}
    .ep-nav-brand .dot{color:var(--gold);font-style:italic}
    .ep-nav-meta{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--ivory-mute)}

    .ep-section{position:relative;z-index:5;padding:140px 32px;display:flex;justify-content:center}
    .ep-wrap{width:100%;max-width:980px;margin:0 auto}
    .ep-reveal{opacity:0;transform:translateY(28px);
      transition:opacity 1.1s cubic-bezier(.2,.7,.2,1),transform 1.1s cubic-bezier(.2,.7,.2,1)}
    .ep-reveal.in{opacity:1;transform:none}

    .ep-eyebrow{font-family:var(--sans);font-size:11px;letter-spacing:.34em;text-transform:uppercase;
      color:var(--gold);display:inline-flex;align-items:center;gap:14px}
    .ep-eyebrow::before,.ep-eyebrow::after{content:"";width:34px;height:1px;
      background:linear-gradient(90deg,transparent,var(--gold-soft),transparent)}

    .ep-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;
      text-align:center;padding:120px 32px 80px;position:relative;z-index:5}
    .ep-hero-inner{max-width:880px}
    .ep-hero h1{font-family:var(--serif);font-weight:400;font-size:clamp(44px,7vw,96px);
      line-height:1.02;letter-spacing:-.02em;color:var(--ivory);margin:28px 0 24px}
    .ep-hero h1 em{font-style:italic;color:var(--gold-bright);font-weight:400}
    .ep-hero-sub{font-family:var(--serif);font-style:italic;font-size:clamp(17px,1.6vw,21px);
      color:var(--ivory-dim);max-width:520px;margin:0 auto}
    .ep-hero-meta{margin-top:54px;font-size:11px;letter-spacing:.34em;text-transform:uppercase;
      color:var(--ivory-mute);display:flex;justify-content:center;gap:18px;flex-wrap:wrap;align-items:center}
    .ep-hero-meta .sep{width:4px;height:4px;border-radius:50%;background:var(--gold);opacity:.7}
    .ep-hero-cta{margin-top:80px;display:inline-flex;flex-direction:column;align-items:center;gap:14px;
      color:var(--ivory-dim);font-size:11px;letter-spacing:.34em;text-transform:uppercase;
      cursor:pointer;background:none;border:0;font-family:inherit;transition:color .3s ease}
    .ep-hero-cta:hover{color:var(--gold-bright)}
    .ep-hero-cta .arrow{width:1px;height:42px;background:linear-gradient(180deg,var(--gold),transparent);position:relative}
    .ep-hero-cta .arrow::after{content:"";position:absolute;left:-3px;bottom:-1px;width:7px;height:7px;
      border-right:1px solid var(--gold);border-bottom:1px solid var(--gold);transform:rotate(45deg);
      animation:bob 2.4s ease-in-out infinite}
    @keyframes bob{0%,100%{transform:rotate(45deg) translate(0,0)}50%{transform:rotate(45deg) translate(3px,3px)}}

    .ep-letter{text-align:center}
    .ep-letter-title{font-family:var(--serif);font-style:italic;font-weight:400;
      font-size:clamp(24px,2.6vw,34px);color:var(--gold-bright);margin-bottom:60px}
    .ep-letter p{font-family:var(--serif);font-weight:300;font-size:clamp(22px,2.6vw,34px);
      line-height:1.45;color:var(--ivory);margin:0 auto 36px;max-width:760px}
    .ep-letter .dots{font-size:18px;color:var(--gold);letter-spacing:.6em;margin:30px 0}
    .ep-letter .arrived{display:inline-block;margin-top:30px;
      font-family:var(--serif);font-style:italic;font-size:clamp(28px,3.4vw,44px);
      background:linear-gradient(180deg,var(--ivory) 0%,var(--gold-bright) 60%,var(--gold) 100%);
      -webkit-background-clip:text;background-clip:text;color:transparent}

    .ep-invite{display:flex;justify-content:center}
    .ep-card{position:relative;width:min(720px,100%);padding:72px 56px;
      background:linear-gradient(160deg,rgba(20,15,8,.72),rgba(8,6,3,.78));
      backdrop-filter:blur(12px) saturate(110%);-webkit-backdrop-filter:blur(12px) saturate(110%);
      border:1px solid var(--line);text-align:center;overflow:hidden}
    .ep-card::before{content:"";position:absolute;inset:0;pointer-events:none;
      background:radial-gradient(600px 200px at 50% 0%,rgba(212,160,90,.12),transparent 70%)}
    .ep-card .corner{position:absolute;width:32px;height:32px;border-color:var(--gold)}
    .ep-card .corner.tl{top:14px;left:14px;border-top:1px solid;border-left:1px solid}
    .ep-card .corner.tr{top:14px;right:14px;border-top:1px solid;border-right:1px solid}
    .ep-card .corner.bl{bottom:14px;left:14px;border-bottom:1px solid;border-left:1px solid}
    .ep-card .corner.br{bottom:14px;right:14px;border-bottom:1px solid;border-right:1px solid}
    .ep-card-label{font-family:var(--sans);font-size:11px;letter-spacing:.36em;text-transform:uppercase;color:var(--gold)}
    .ep-card h3{font-family:var(--serif);font-weight:400;font-size:clamp(28px,3.2vw,40px);
      color:var(--ivory);margin:22px 0 56px;letter-spacing:-.01em;line-height:1.15}
    .ep-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;
      border-top:1px solid var(--line-warm);border-bottom:1px solid var(--line-warm);padding:30px 0}
    .ep-card-grid > div{display:flex;flex-direction:column;gap:8px}
    .ep-card-grid .k{font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--ivory-mute)}
    .ep-card-grid .v{font-family:var(--serif);font-size:22px;color:var(--ivory);font-weight:400}
    .ep-card-grid .v.gold{color:var(--gold-bright)}

    .ep-xp h2{font-family:var(--serif);font-weight:400;font-size:clamp(36px,5vw,68px);
      line-height:1.05;letter-spacing:-.02em;color:var(--ivory);text-align:center;margin:18px 0 80px}
    .ep-xp h2 em{font-style:italic;color:var(--gold-bright)}
    .ep-xp-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
    .ep-xp-block{position:relative;padding:54px 40px;
      background:linear-gradient(160deg,rgba(20,15,8,.55),rgba(5,4,2,.6));
      border:1px solid var(--line-warm);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      transition:border-color .4s ease, transform .4s ease}
    .ep-xp-block:hover{border-color:var(--line);transform:translateY(-2px)}
    .ep-xp-block .num{font-family:var(--serif);font-style:italic;font-size:13px;color:var(--gold);letter-spacing:.2em}
    .ep-xp-block h4{font-family:var(--serif);font-weight:400;font-size:32px;color:var(--ivory);margin:18px 0 14px}
    .ep-xp-block p{font-size:15px;line-height:1.7;color:var(--ivory-dim);font-weight:300;max-width:340px}

    .ep-closing{text-align:center}
    .ep-closing h2{font-family:var(--serif);font-weight:400;font-size:clamp(40px,5.6vw,72px);
      line-height:1.05;color:var(--ivory);letter-spacing:-.02em;margin-bottom:42px}
    .ep-closing h2 em{font-style:italic;color:var(--gold-bright)}
    .ep-closing .sig{font-family:var(--serif);font-style:italic;font-weight:300;
      font-size:clamp(18px,2vw,24px);color:var(--ivory-dim);max-width:560px;margin:0 auto}
    .ep-divider{width:60px;height:1px;
      background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:60px auto}

    .ep-form-wrap{display:flex;justify-content:center}
    .ep-form{width:min(680px,100%);padding:60px 50px;
      background:linear-gradient(160deg,rgba(20,15,8,.7),rgba(8,6,3,.78));
      border:1px solid var(--line);
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .ep-form-head{text-align:center;margin-bottom:48px}
    .ep-form-head h3{font-family:var(--serif);font-weight:400;font-size:clamp(28px,3.2vw,40px);
      color:var(--ivory);margin:14px 0 12px}
    .ep-form-head p{color:var(--ivory-dim);font-size:14px;letter-spacing:.04em}

    .ep-field{margin-bottom:34px}
    .ep-field-label{display:block;font-size:10px;letter-spacing:.34em;text-transform:uppercase;
      color:var(--ivory-mute);margin-bottom:12px}
    .ep-input{width:100%;background:transparent;color:var(--ivory);
      border:0;border-bottom:1px solid var(--line-warm);
      padding:10px 0 12px;font-family:var(--sans);font-size:16px;
      transition:border-color .3s ease;outline:none}
    .ep-input:focus{border-bottom-color:var(--gold)}
    .ep-input::placeholder{color:var(--ivory-mute)}

    .ep-radio-group{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .ep-radio{cursor:pointer;padding:14px 18px;border:1px solid var(--line-warm);
      background:rgba(245,234,212,.015);font-size:13px;letter-spacing:.06em;color:var(--ivory-dim);
      display:flex;align-items:center;gap:12px;transition:all .3s ease;
      user-select:none;font-family:var(--sans)}
    .ep-radio:hover{border-color:var(--line);color:var(--ivory)}
    .ep-radio .dot{width:10px;height:10px;border-radius:50%;
      border:1px solid var(--ivory-mute);transition:all .3s ease;flex-shrink:0}
    .ep-radio.selected{border-color:var(--gold);
      background:linear-gradient(160deg,rgba(212,160,90,.08),rgba(212,160,90,.02));color:var(--ivory)}
    .ep-radio.selected .dot{background:var(--gold);border-color:var(--gold);
      box-shadow:0 0 0 3px rgba(212,160,90,.15)}

    .ep-form-error{margin:-8px 0 22px;text-align:center;font-family:var(--serif);font-style:italic;color:var(--gold-bright);font-size:15px}
    .ep-submit{width:100%;margin-top:18px;padding:18px;
      font-family:var(--sans);font-size:12px;letter-spacing:.34em;text-transform:uppercase;font-weight:500;
      color:#1a1108;border:0;cursor:pointer;
      background:linear-gradient(135deg,#fbec85 0%,#d39528 35%,#fbed8a 60%,#f6e37c 80%,#da9e2e 100%);
      background-size:220% 100%;background-position:0% 50%;
      transition:background-position .6s ease,transform .25s ease,box-shadow .4s ease;
      box-shadow:0 10px 40px -12px rgba(212,160,90,.4)}
    .ep-submit:hover{background-position:100% 50%;box-shadow:0 14px 50px -10px rgba(212,160,90,.55)}
    .ep-submit:disabled{opacity:.6;cursor:not-allowed}
    .ep-form-foot{text-align:center;margin-top:30px;font-size:10px;
      letter-spacing:.34em;text-transform:uppercase;color:var(--ivory-mute)}

    .ep-success{text-align:center;padding:40px 0;animation:fadein .8s ease}
    .ep-success .check{width:64px;height:64px;border:1px solid var(--gold);border-radius:50%;
      display:flex;align-items:center;justify-content:center;margin:0 auto 30px;
      background:radial-gradient(circle,rgba(212,160,90,.15),transparent 70%)}
    .ep-success h3{font-family:var(--serif);font-weight:400;font-size:clamp(28px,3.2vw,40px);
      color:var(--ivory);margin:0 0 16px;line-height:1.15}
    .ep-success h3 em{font-style:italic;color:var(--gold-bright)}
    .ep-success p{color:var(--ivory-dim);font-size:14px;max-width:380px;margin:0 auto}
    @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

    .ep-sticky{position:fixed;bottom:24px;right:24px;z-index:25;padding:14px 24px;
      font-family:var(--sans);font-size:11px;letter-spacing:.32em;text-transform:uppercase;font-weight:500;
      color:#1a1108;border:0;cursor:pointer;
      background:linear-gradient(135deg,#fbec85,#d39528,#fbed8a,#f6e37c,#da9e2e);
      background-size:220% 100%;background-position:0% 50%;
      box-shadow:0 12px 40px -10px rgba(212,160,90,.5),0 0 0 1px rgba(212,160,90,.3);
      opacity:0;transform:translateY(20px);pointer-events:none;
      transition:opacity .5s ease,transform .5s ease,background-position .5s ease}
    .ep-sticky.visible{opacity:1;transform:none;pointer-events:auto}
    .ep-sticky:hover{background-position:100% 50%}

    .ep-footer{position:relative;z-index:5;padding:60px 32px 48px;text-align:center;
      border-top:1px solid var(--line-warm)}
    .ep-footer .brand{font-family:var(--serif);font-size:14px;color:var(--ivory-dim);letter-spacing:.18em}
    .ep-footer .brand .gold{color:var(--gold)}
    .ep-footer .meta{margin-top:14px;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--ivory-mute)}

    @media (max-width:760px){
      .ep-nav{padding:18px 20px}
      .ep-nav.scrolled{padding:12px 20px}
      .ep-nav-meta{display:none}
      .ep-section{padding:90px 22px}
      .ep-hero{padding:110px 22px 70px}
      .ep-hero-meta{flex-direction:column;gap:10px}
      .ep-hero-meta .sep{display:none}
      .ep-card{padding:50px 26px}
      .ep-card-grid{grid-template-columns:1fr;gap:24px}
      .ep-xp-grid{grid-template-columns:1fr;gap:18px}
      .ep-xp-block{padding:38px 28px}
      .ep-form{padding:40px 24px}
      .ep-radio-group{grid-template-columns:1fr}
      .ep-sticky{bottom:18px;right:18px;padding:12px 18px;font-size:10px;letter-spacing:.28em}
    }
    @media (prefers-reduced-motion: reduce){
      .ep-reveal{transition:none;opacity:1;transform:none}
      .ep-logo .stroke{animation-duration:0ms;stroke-dashoffset:0}
      .ep-logo .fillin,.ep-logo .sub{animation-duration:0ms;opacity:1}
      .ep-logo .shimmer{display:none}
      .ep-hero-cta .arrow::after{animation:none}
      .ep-canvas{display:none}
    }
  `}</style>
);

/* ----------------------------------------------------- PARTICLES (canvas) */
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let w = 0, h = 0, particles = [];
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.01;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(212,160,90,${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="ep-canvas" aria-hidden="true" />;
};

/* ------------------------------------------------------------- LOGO MARK */
const LogoMark = () => {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = svgRef.current; if (!svg) return;
    svg.querySelectorAll(".stroke").forEach((el, i) => {
      try {
        const len = typeof el.getTotalLength === "function" ? el.getTotalLength() : 800;
        el.style.setProperty("--len", String(len));
        el.style.setProperty("--delay", `${i * 110}ms`);
      } catch { el.style.setProperty("--len", "800"); }
    });
  }, []);
  return (
    <div className="ep-intro-logo ep-logo">
      <svg ref={svgRef} viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Etraction Partner Premium">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbec85" />
            <stop offset="25%" stopColor="#d39528" />
            <stop offset="50%" stopColor="#fbed8a" />
            <stop offset="75%" stopColor="#f6e37c" />
            <stop offset="100%" stopColor="#da9e2e" />
          </linearGradient>
          <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,240,200,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <mask id="logoMask">
            <rect width="600" height="240" fill="black" />
            <text x="300" y="135" textAnchor="middle"
              fontFamily="Cormorant Garamond, serif" fontWeight="500"
              fontSize="92" letterSpacing="-2" fill="white">etraction</text>
          </mask>
        </defs>
        <text className="stroke" x="300" y="135" textAnchor="middle"
          fontFamily="Cormorant Garamond, serif" fontWeight="500"
          fontSize="92" letterSpacing="-2"
          stroke="#f5ead4" fill="none" strokeWidth="1.1">etraction</text>
        <g className="fillin">
          <text x="300" y="135" textAnchor="middle"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="92" letterSpacing="-2" fill="#f5ead4">etraction</text>
          <circle cx="430" cy="138" r="3.6" fill="url(#goldGrad)" />
        </g>
        <g mask="url(#logoMask)" className="shimmer">
          <rect x="-200" y="0" width="200" height="240" fill="url(#shimmerGrad)" />
        </g>
        <g className="sub">
          <line x1="220" y1="170" x2="280" y2="170" stroke="#a07a3e" strokeWidth="0.8" />
          <circle cx="300" cy="170" r="1.6" fill="#d4a05a" />
          <line x1="320" y1="170" x2="380" y2="170" stroke="#a07a3e" strokeWidth="0.8" />
          <text x="300" y="200" textAnchor="middle"
            fontFamily="Inter, sans-serif" fontWeight="500"
            fontSize="14" letterSpacing="6"
            fill="url(#goldGrad)">PARTNER PREMIUM</text>
        </g>
      </svg>
    </div>
  );
};

const Intro = ({ done }) => (
  <div className={`ep-intro${done ? " hide" : ""}`} aria-hidden={done}><LogoMark /></div>
);

const Background = () => (
  <>
    <ParticleCanvas />
    <div className="ep-vignette" aria-hidden="true" />
    <div className="ep-grain" aria-hidden="true" />
  </>
);

/* ------------------------------------------------------------- REVEAL */
const Reveal = memo(function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.disconnect();
        }
      }),
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className={`ep-reveal${shown ? " in" : ""}`}>{children}</div>;
});

/* ----------------------------------------------------------------- NAV */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`ep-nav${scrolled ? " scrolled" : ""}`}>
      <div className="ep-nav-brand">e.traction <span className="dot">·</span> premium</div>
      <div className="ep-nav-meta">São Paulo · 11.06.26</div>
    </nav>
  );
};

/* ------------------------------------------------------------ STICKY CTA */
const StickyCTA = ({ onClick }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const formEl = document.getElementById("ep-form-anchor");
      const nearForm = formEl ? window.innerHeight + y > formEl.offsetTop - 80 : false;
      setVisible(y > window.innerHeight * 0.6 && !nearForm);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button className={`ep-sticky${visible ? " visible" : ""}`} onClick={onClick} type="button">
      Confirmar presença
    </button>
  );
};

/* ----------------------------------------------------------------- HERO */
const Hero = ({ onContinue }) => (
  <section className="ep-hero" id="hero">
    <div className="ep-hero-inner">
      <Reveal><span className="ep-eyebrow">Convite pessoal</span></Reveal>
      <Reveal delay={120}>
        <h1>Nem todo mundo<br/>vai entender<br/><em>essa mensagem.</em></h1>
      </Reveal>
      <Reveal delay={240}>
        <p className="ep-hero-sub">Porque ela não é pra todo mundo.</p>
      </Reveal>
      <Reveal delay={360}>
        <div className="ep-hero-meta">
          <span>11 junho 2026</span><span className="sep" />
          <span>São Paulo</span><span className="sep" />
          <span>Meta · Google</span>
        </div>
      </Reveal>
      <Reveal delay={500}>
        <button className="ep-hero-cta" onClick={onContinue} type="button">
          Continuar<span className="arrow" />
        </button>
      </Reveal>
    </div>
  </section>
);

const Letter = () => (
  <section className="ep-section">
    <div className="ep-wrap ep-letter">
      <Reveal><div className="ep-letter-title">Uma carta para você</div></Reveal>
      <Reveal delay={120}><p>Existe um momento em que o jogo muda.</p></Reveal>
      <Reveal delay={240}><p>E algumas mesas simplesmente não estão disponíveis para todos.</p></Reveal>
      <Reveal delay={320}><div className="dots">· · ·</div></Reveal>
      <Reveal delay={400}><p>A gente presta atenção nisso.</p></Reveal>
      <Reveal delay={500}><p>Entre muitos, poucos chegam nesse ponto.</p></Reveal>
      <Reveal delay={680}><div className="arrived">Você chegou.</div></Reveal>
    </div>
  </section>
);

const Invitation = () => (
  <section className="ep-section">
    <div className="ep-wrap ep-invite">
      <Reveal>
        <div className="ep-card">
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <div className="ep-card-label">O encontro</div>
          <h3>Um dia dentro do<br/>Facebook Brasil e Google Brasil</h3>
          <div className="ep-card-grid">
            <div><span className="k">Data</span><span className="v gold">11 de junho</span></div>
            <div><span className="k">Cidade</span><span className="v">São Paulo</span></div>
            <div><span className="k">Ano</span><span className="v">MMXXVI</span></div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Experience = () => (
  <section className="ep-section">
    <div className="ep-wrap ep-xp">
      <Reveal>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span className="ep-eyebrow">A experiência</span>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <h2>Não é sobre assistir.<br/><em>É sobre estar dentro.</em></h2>
      </Reveal>
      <div className="ep-xp-grid">
        <Reveal delay={200}>
          <div className="ep-xp-block">
            <div className="num">— Dia</div>
            <h4>Meta + Google</h4>
            <p>Acesso presencial aos ambientes que influenciam o mercado digital.</p>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="ep-xp-block">
            <div className="num">— Noite</div>
            <h4>Jantar reservado</h4>
            <p>Uma mesa menor, conversas diretas e conexões entre players.</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const Closing = () => (
  <section className="ep-section">
    <div className="ep-wrap ep-closing">
      <Reveal><h2>Isso não é mais um convite.<br/><em>É um acesso.</em></h2></Reveal>
      <Reveal delay={160}><div className="ep-divider" /></Reveal>
      <Reveal delay={260}>
        <p className="sig">Você foi colocado nesse grupo por um motivo.</p>
      </Reveal>
    </div>
  </section>
);

const RadioGroup = ({ name }) => {
  const opts = [{ v: "Sim", label: "Sim" }, { v: "Não", label: "Não" }];
  return (
    <div className="ep-radio-group">
      {opts.map((o) => (
        <label key={o.v} className="ep-radio">
          <input type="radio" name={name} value={o.v} required />
          <span className="dot" />
          {o.label}
        </label>
      ))}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="ep-field">
    <label className="ep-field-label">{label}</label>
    {children}
  </div>
);

const FormSection = () => (
  <section className="ep-section" id="ep-form-anchor">
    <div className="ep-wrap ep-form-wrap">
      <Reveal>
        <div className="ep-form">
          <div className="ep-form-head">
            <span className="ep-eyebrow">RSVP</span>
            <h3>Confirme sua presença.</h3>
            <p>Leva menos de um minuto.</p>
          </div>

          <form action={GOOGLE_FORM_ACTION} method="POST" target="_blank" acceptCharset="UTF-8">
            <input type="hidden" name="fvv" value="1" />
            <input type="hidden" name="pageHistory" value="0" />
            <input type="hidden" name="partialResponse" value="[]" />
            <input type="hidden" name="fbzx" value="-1" />

            <Field label="Nome completo">
              <input
                type="text"
                name={FIELDS.name}
                className="ep-input"
                placeholder="Seu nome"
                autoComplete="name"
                required
              />
            </Field>

            <Field label="Empresa">
              <input
                type="text"
                name={FIELDS.company}
                className="ep-input"
                placeholder="Nome da empresa"
                autoComplete="organization"
                required
              />
            </Field>

            <Field label="Participa da reunião no Google Brasil?">
              <RadioGroup name={FIELDS.google} />
            </Field>

            <Field label="Participa da reunião na Meta Brasil?">
              <RadioGroup name={FIELDS.meta} />
            </Field>

            <Field label="Participa do jantar reservado?">
              <RadioGroup name={FIELDS.dinner} />
            </Field>

            <button type="submit" className="ep-submit">
              Confirmar resposta
            </button>

            <div className="ep-form-foot">
              Convite intransferível · Seu lugar está reservado
            </div>
          </form>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="ep-footer">
    <div className="brand">e.traction <span className="gold">·</span> partner premium</div>
    <div className="meta">São Paulo · MMXXVI · Convite pessoal</div>
  </footer>
);

/* =================================================================== APP */
export default function PremiumInvitationPage() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setIntroDone(true), reduced ? 400 : 3200);
    return () => clearTimeout(t);
  }, []);

  const scrollToForm = useCallback(() => {
    document.getElementById("ep-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const scrollToLetter = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <>
      <Styles />
      <div className="ep-root">
        <Background />
        <Intro done={introDone} />
        <Nav />
        <main style={{ visibility: introDone ? "visible" : "hidden" }}>
          <Hero onContinue={scrollToLetter} />
          <Letter />
          <Invitation />
          <Experience />
          <Closing />
          <FormSection />
          <Footer />
        </main>
        <StickyCTA onClick={scrollToForm} />
      </div>
    </>
  );
}