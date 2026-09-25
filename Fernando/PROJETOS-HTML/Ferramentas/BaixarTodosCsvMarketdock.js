/* MarketDock – Exportar métricas em CSV (painel)
 * Cole no console (F12 → Console) na página "Resumo Ecommerce" e aperte Enter.
 * Rodar de novo apenas mostra/esconde o painel.
 */
(() => {
  if (window.__mdCsv) { window.__mdCsv.toggle(); return; }

  // ---------- utilidades ----------
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = async (fn, timeout = 6000, step = 100) => {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) { const v = fn(); if (v) return v; await sleep(step); }
    return null;
  };
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const br = s => s.split('-').reverse().join('/');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => iso(new Date());

  const EXP_SEL = 'button[aria-label="Expandir card para visualização completa"]';
  const SEC_SEL = 'h3.uppercase.tracking-wider';
  const DLG_SEL = '[role="dialog"][data-state="open"]';

  // ---------- monitor de rede (pra saber quando os dados terminaram de carregar) ----------
  let inflight = 0;
  const origFetch = window.fetch;
  window.fetch = function (...a) { inflight++; return origFetch.apply(this, a).finally(() => inflight--); };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...a) {
    inflight++; this.addEventListener('loadend', () => inflight--, { once: true });
    return origSend.apply(this, a);
  };
  async function waitIdle(quiet = 700, max = 30000) {
    const t0 = Date.now(); let calmSince = Date.now();
    while (Date.now() - t0 < max) {
      if (inflight > 0) calmSince = Date.now();
      else if (Date.now() - calmSince >= quiet) return;
      await sleep(100);
    }
  }

  // ---------- métricas ----------
  function scanMetrics() {
    const secs = [...document.querySelectorAll(SEC_SEL)];
    const seen = {};
    return [...document.querySelectorAll(EXP_SEL)].map((btn, idx) => {
      const name = btn.parentElement.innerText.split('\n').map(s => s.trim()).filter(Boolean)[0] || `Métrica ${idx + 1}`;
      let section = 'Outros';
      for (const s of secs) if (s.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING) section = s.textContent.trim();
      const base = section + '::' + name;
      seen[base] = (seen[base] || 0) + 1;
      return { key: base + '::' + seen[base], name, section };
    });
  }
  function findCardBtn(key) {
    const list = scanMetrics();
    const i = list.findIndex(m => m.key === key);
    return i >= 0 ? document.querySelectorAll(EXP_SEL)[i] : null;
  }

  // ---------- datas ----------
  const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s*-\s*(\d{2})\/(\d{2})\/(\d{4}))?$/;
  const dateBtn = () => [...document.querySelectorAll('button[aria-haspopup="dialog"]')]
    .find(b => DATE_RE.test(b.innerText.trim()) && b.offsetParent);
  function readRange() {
    const m = dateBtn()?.innerText.trim().match(DATE_RE);
    if (!m) return null;
    const from = `${m[3]}-${m[2]}-${m[1]}`;
    return { from, to: m[4] ? `${m[6]}-${m[5]}-${m[4]}` : from }; // um dia só aparece sem o " - "
  }
  async function pickDay(pop, day) {
    for (let i = 0; i < 150; i++) {
      const td = pop.querySelector(`td[data-day="${day}"]:not([data-outside])`);
      if (td) { td.querySelector('button').click(); return; }
      const cur = pop.querySelector('td[data-day]:not([data-outside])')?.dataset.day;
      if (!cur) break;
      const nav = pop.querySelector(`button[aria-label="Go to the ${day < cur ? 'Previous' : 'Next'} Month"]`);
      if (!nav) break;
      nav.click(); await sleep(70);
    }
    throw new Error('não encontrei o dia ' + br(day) + ' no calendário');
  }
  async function setRange(from, to) {
    const cur = readRange();
    if (cur && cur.from === from && cur.to === to) return;
    const b = dateBtn();
    if (!b) throw new Error('seletor de datas não encontrado');
    if (b.dataset.state !== 'open') b.click();
    const pop = await waitFor(() => document.getElementById(b.getAttribute('aria-controls')));
    if (!pop) throw new Error('calendário não abriu');
    await sleep(200);
    await pickDay(pop, from); await sleep(250);
    const pop2 = document.getElementById(b.getAttribute('aria-controls')) || pop;
    await pickDay(pop2, to);
    const ok = await waitFor(() => { const r = readRange(); return r && r.from === from && r.to === to; }, 6000);
    if (b.dataset.state === 'open') { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(200); }
    if (!ok) throw new Error(`não consegui aplicar o período ${br(from)} – ${br(to)}`);
    await sleep(400);
    await waitIdle();
  }
  function splitMonths(from, to) {
    const out = []; let [y, m] = from.split('-').map(Number); let start = from;
    while (start <= to) {
      let end = iso(new Date(y, m, 0)); if (end > to) end = to;
      out.push({ from: start, to: end });
      m++; if (m > 12) { m = 1; y++; }
      start = `${y}-${pad(m)}-01`;
    }
    return out;
  }

  // ---------- captura do CSV (modo "um arquivo só") ----------
  let capturing = false, lastBlob = null, lastName = null;
  const origCreate = URL.createObjectURL;
  URL.createObjectURL = function (o) { if (capturing) lastBlob = o; return origCreate.call(URL, o); };
  const origAClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (capturing && /\.csv$/i.test(this.download || '')) { lastName = this.download; return; }
    return origAClick.call(this);
  };
  function saveFile(name, text) {
    const url = origCreate.call(URL, new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); origAClick.call(a); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ---------- baixa uma métrica ----------
  async function downloadMetric(m) {
    let dlg = null;
    for (let tent = 0; tent < 3 && !dlg; tent++) { // tenta abrir até 3x
      await waitFor(() => !document.querySelector('[role="dialog"]'), 3000);
      const btn = findCardBtn(m.key);
      if (!btn) throw new Error('card não encontrado');
      btn.scrollIntoView({ block: 'center' });
      await sleep(200);
      btn.click();
      dlg = await waitFor(() => document.querySelector(DLG_SEL), 4000);
    }
    if (!dlg) throw new Error('modal não abriu');
    await sleep(350); await waitIdle(400, 6000);
    const csvBtn = await waitFor(() => dlg.querySelector('button[aria-label="Baixar CSV"]'));
    if (!csvBtn) throw new Error('botão CSV não encontrado');
    lastBlob = null; lastName = null;
    csvBtn.click();
    let text = null;
    if (capturing) {
      await waitFor(() => lastBlob, 4000, 50);
      text = lastBlob ? await lastBlob.text() : null;
      if (text == null) throw new Error('CSV não foi gerado');
    } else {
      await sleep(700);
    }
    dlg.querySelector('button[aria-label="Fechar"]')?.click();
    await waitFor(() => !document.querySelector('[role="dialog"]'), 4000);
    await sleep(150);
    return text;
  }

  // ---------- interface ----------
  const host = document.createElement('div');
  host.id = 'md-csv-export';
  host.style.cssText = 'position:fixed;inset:auto 20px 20px auto;z-index:2147483647;pointer-events:auto;';
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
  <style>
    :host{all:initial}
    *{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,sans-serif}
    .fab{all:unset;cursor:pointer;display:flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font:600 13px Inter,system-ui,sans-serif;padding:10px 14px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    .fab:hover{background:#1d4ed8}
    .panel{position:absolute;right:0;bottom:52px;width:380px;max-width:calc(100vw - 40px);max-height:min(640px,calc(100vh - 100px));display:none;flex-direction:column;background:#141821;color:#e5e7eb;border:1px solid #2a3040;border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,.5);overflow:hidden;font-size:13px}
    .panel.open{display:flex}
    header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #2a3040}
    header b{font-size:14px}
    .x{all:unset;cursor:pointer;color:#9ca3af;padding:2px 6px;border-radius:6px}.x:hover{background:#232a38;color:#fff}
    .body{overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:14px}
    h4{margin:0 0 6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9ca3af;display:flex;justify-content:space-between;align-items:center}
    h4 span{text-transform:none;letter-spacing:0;font-weight:400}
    .row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    input[type=date],input[type=search]{background:#0d1017;color:#e5e7eb;border:1px solid #2a3040;border-radius:8px;padding:6px 8px;font-size:12px;color-scheme:dark}
    input[type=search]{width:100%}
    .btn{all:unset;cursor:pointer;background:#232a38;color:#e5e7eb;padding:6px 10px;border-radius:8px;font-size:12px}
    .btn:hover{background:#2d3547}
    .btn.primary{background:#2563eb;color:#fff;font-weight:600;text-align:center;padding:9px 12px}
    .btn.primary:hover{background:#1d4ed8}
    .btn.danger{background:#7f1d1d}
    .btn[disabled]{opacity:.5;pointer-events:none}
    .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .chip{display:flex;align-items:center;gap:6px;background:#1e3a8a;color:#dbeafe;border-radius:999px;padding:4px 6px 4px 10px;font-size:12px}
    .chip button{all:unset;cursor:pointer;opacity:.7;padding:0 4px}.chip button:hover{opacity:1}
    .muted{color:#9ca3af;font-size:12px}
    .list{border:1px solid #2a3040;border-radius:10px;max-height:240px;overflow:auto;padding:4px 0;background:#0d1017}
    .grp{padding:6px 10px 2px;font-size:11px;font-weight:600;color:#93c5fd;text-transform:uppercase;letter-spacing:.05em;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
    .grp small{color:#9ca3af;font-weight:400;text-transform:none;letter-spacing:0}
    label.m{display:flex;align-items:center;gap:8px;padding:4px 10px 4px 14px;cursor:pointer}
    label.m:hover{background:#171c27}
    input[type=checkbox]{accent-color:#2563eb;width:14px;height:14px;margin:0}
    .opts label{display:flex;align-items:center;gap:8px;cursor:pointer;padding:3px 0}
    footer{border-top:1px solid #2a3040;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
    .bar{height:6px;background:#232a38;border-radius:99px;overflow:hidden;display:none}
    .bar i{display:block;height:100%;width:0;background:#2563eb;transition:width .2s}
    .status{font-size:12px;color:#9ca3af;min-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .fails{font-size:11px;color:#fca5a5;max-height:70px;overflow:auto;display:none;white-space:pre-line}
  </style>
  <button class="fab" id="fab">⬇ Exportar CSV</button>
  <div class="panel" id="panel">
    <header><b>Exportar métricas (CSV)</b><button class="x" id="close">✕</button></header>
    <div class="body">
      <section>
        <h4>Períodos <span id="pcount"></span></h4>
        <div class="row">
          <input type="date" id="from"> <span class="muted">até</span> <input type="date" id="to">
          <button class="btn" id="add">+ Adicionar</button>
        </div>
        <div class="row" style="margin-top:6px">
          <button class="btn" data-preset="screen">Período da tela</button>
          <button class="btn" data-preset="mtd">Mês atual</button>
          <button class="btn" data-preset="lm">Mês passado</button>
          <button class="btn" data-preset="ytd">Ano atual</button>
        </div>
        <div class="chips" id="chips"></div>
      </section>
      <section>
        <h4>Métricas <span id="mcount"></span></h4>
        <div class="row" style="margin-bottom:6px">
          <input type="search" id="q" placeholder="Buscar métrica…" style="flex:1;width:auto">
          <button class="btn" id="all">Todas</button><button class="btn" id="none">Nenhuma</button>
        </div>
        <div class="list" id="list"></div>
      </section>
      <section class="opts">
        <h4>Opções</h4>
        <label><input type="checkbox" id="split"> Quebrar cada período em meses</label>
        <label><input type="checkbox" id="merge"> Juntar tudo em um único CSV</label>
        <label><input type="checkbox" id="restore" checked> Voltar ao período original no final</label>
      </section>
    </div>
    <footer>
      <div class="bar" id="bar"><i></i></div>
      <div class="status" id="status"></div>
      <div class="fails" id="fails"></div>
      <button class="btn primary" id="run">Baixar</button>
    </footer>
  </div>`;

  const $ = s => root.querySelector(s);
  const panel = $('#panel');
  let metrics = [];
  const selected = new Set();
  let periods = [];
  let running = false, cancel = false;

  function renderPeriods() {
    $('#chips').innerHTML = periods.map((p, i) =>
      `<span class="chip">${br(p.from)} – ${br(p.to)}<button data-i="${i}" title="Remover">✕</button></span>`).join('')
      || '<span class="muted">Nenhum período — será usado o período atual da tela.</span>';
    $('#pcount').textContent = periods.length ? `${periods.length} selecionado(s)` : '';
  }
  function addPeriod(from, to) {
    if (!from || !to) return;
    if (from > to) [from, to] = [to, from];
    if (!periods.some(p => p.from === from && p.to === to)) periods.push({ from, to });
    renderPeriods();
  }
  function renderMetrics() {
    const q = $('#q').value.trim().toLowerCase();
    const groups = {};
    metrics.forEach(m => {
      if (q && !(m.name + ' ' + m.section).toLowerCase().includes(q)) return;
      (groups[m.section] ||= []).push(m);
    });
    $('#list').innerHTML = Object.entries(groups).map(([sec, ms]) => {
      const n = ms.filter(m => selected.has(m.key)).length;
      return `<div class="grp" data-sec="${esc(sec)}">${esc(sec)} <small>${n}/${ms.length} · alternar</small></div>` +
        ms.map(m => `<label class="m"><input type="checkbox" data-key="${esc(m.key)}" ${selected.has(m.key) ? 'checked' : ''}>${esc(m.name)}</label>`).join('');
    }).join('') || '<div class="muted" style="padding:10px">Nenhuma métrica encontrada.</div>';
    $('#mcount').textContent = `${selected.size}/${metrics.length} selecionada(s)`;
  }
  function visibleKeys() { return [...$('#list').querySelectorAll('input[data-key]')].map(i => i.dataset.key); }

  // eventos
  $('#fab').onclick = () => toggle();
  $('#close').onclick = () => panel.classList.remove('open');
  $('#add').onclick = () => addPeriod($('#from').value, $('#to').value);
  $('#chips').onclick = e => { const i = e.target.dataset?.i; if (i != null) { periods.splice(+i, 1); renderPeriods(); } };
  root.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => {
    const d = new Date(), t = today();
    const p = b.dataset.preset;
    if (p === 'screen') { const r = readRange(); if (r) addPeriod(r.from, r.to); }
    if (p === 'mtd') addPeriod(iso(new Date(d.getFullYear(), d.getMonth(), 1)), t);
    if (p === 'lm') addPeriod(iso(new Date(d.getFullYear(), d.getMonth() - 1, 1)), iso(new Date(d.getFullYear(), d.getMonth(), 0)));
    if (p === 'ytd') addPeriod(`${d.getFullYear()}-01-01`, t);
  });
  $('#q').oninput = renderMetrics;
  $('#all').onclick = () => { visibleKeys().forEach(k => selected.add(k)); renderMetrics(); };
  $('#none').onclick = () => { visibleKeys().forEach(k => selected.delete(k)); renderMetrics(); };
  $('#list').onchange = e => { const k = e.target.dataset?.key; if (!k) return; e.target.checked ? selected.add(k) : selected.delete(k); renderMetrics(); };
  $('#list').onclick = e => {
    const g = e.target.closest('.grp'); if (!g) return;
    const keys = [...$('#list').querySelectorAll('input[data-key]')].filter(i => metrics.find(m => m.key === i.dataset.key)?.section === g.dataset.sec).map(i => i.dataset.key);
    const allOn = keys.every(k => selected.has(k));
    keys.forEach(k => allOn ? selected.delete(k) : selected.add(k));
    renderMetrics();
  };

  const setStatus = (txt, pct) => {
    $('#status').textContent = txt;
    if (pct != null) { $('#bar').style.display = 'block'; $('#bar i').style.width = pct + '%'; }
  };

  $('#run').onclick = async () => {
    if (running) { cancel = true; setStatus('Cancelando…'); return; }
    const chosen = metrics.filter(m => selected.has(m.key));
    if (!chosen.length) { setStatus('Selecione pelo menos uma métrica.'); return; }
    const original = readRange();
    let ps = periods.length ? periods.slice() : (original ? [original] : []);
    if (!ps.length) { setStatus('Não consegui ler o período da tela.'); return; }
    if ($('#split').checked) ps = ps.flatMap(p => splitMonths(p.from, p.to));
    const merge = $('#merge').checked;

    running = true; cancel = false;
    $('#fails').style.display = 'none';
    $('#run').textContent = 'Cancelar'; $('#run').classList.add('danger');
    const total = ps.length * chosen.length; let done = 0; const fails = []; const parts = [];
    capturing = merge;
    try {
      for (let pi = 0; pi < ps.length && !cancel; pi++) {
        const p = ps[pi];
        setStatus(`Aplicando período ${br(p.from)} – ${br(p.to)}…`, (done / total) * 100);
        try { await setRange(p.from, p.to); }
        catch (e) { fails.push(`${br(p.from)}–${br(p.to)}: ${e.message}`); done += chosen.length; continue; }
        for (let mi = 0; mi < chosen.length && !cancel; mi++) {
          const m = chosen[mi];
          setStatus(`${ps.length > 1 ? `Período ${pi + 1}/${ps.length} · ` : ''}${mi + 1}/${chosen.length} – ${m.name}`, (done / total) * 100);
          try {
            const text = await downloadMetric(m);
            if (merge && text != null) parts.push({ m, p, text });
          } catch (e) {
            fails.push(`${m.name} (${br(p.from)}–${br(p.to)}): ${e.message}`);
            document.querySelector(DLG_SEL + ' button[aria-label="Fechar"]')?.click();
            await sleep(400);
          }
          done++;
        }
      }
      if (merge && parts.length) {
        const csv = parts.map(({ m, p, text }) =>
          `"### ${m.name.replace(/"/g, '""')} | ${m.section} | ${br(p.from)} a ${br(p.to)}"\r\n${text.replace(/^﻿/, '').replace(/\s+$/, '')}`
        ).join('\r\n\r\n') + '\r\n';
        const f = ps.length === 1 ? `${ps[0].from}_${ps[0].to}` : `${ps[0].from}_a_${ps[ps.length - 1].to}`;
        saveFile(`MarketDock_metricas_${f}.csv`, csv);
      }
    } finally {
      capturing = false;
      if ($('#restore').checked && original && !cancel) {
        const r = readRange();
        if (!r || r.from !== original.from || r.to !== original.to) {
          setStatus('Voltando ao período original…');
          try { await setRange(original.from, original.to); } catch (e) { fails.push('restaurar período: ' + e.message); }
        }
      }
      running = false;
      $('#run').textContent = 'Baixar'; $('#run').classList.remove('danger');
      const ok = merge ? parts.length : done - fails.filter(f => !f.startsWith('restaurar')).length;
      setStatus(`${cancel ? 'Cancelado' : 'Concluído'}: ${ok} CSV(s)${merge && parts.length ? ' juntos em 1 arquivo' : ''}${fails.length ? ` · ${fails.length} falha(s) (abaixo)` : ''}`, 100);
      if (fails.length) console.warn('[MarketDock CSV] Falhas:\n' + fails.join('\n'));
      $('#fails').textContent = fails.join('\n');
      $('#fails').style.display = fails.length ? 'block' : 'none';
    }
  };

  function toggle() {
    const open = !panel.classList.contains('open');
    if (open && !running) {
      metrics = scanMetrics();
      if (!selected.size) metrics.forEach(m => selected.add(m.key));
      [...selected].forEach(k => { if (!metrics.some(m => m.key === k)) selected.delete(k); });
      const r = readRange();
      $('#to').max = $('#from').max = today();
      if (r && !$('#from').value) { $('#from').value = r.from; $('#to').value = r.to; }
      renderMetrics(); renderPeriods();
    }
    panel.classList.toggle('open', open);
  }

  window.__mdCsv = {
    toggle,
    destroy() {
      window.fetch = origFetch; XMLHttpRequest.prototype.send = origSend;
      URL.createObjectURL = origCreate; HTMLAnchorElement.prototype.click = origAClick;
      host.remove(); delete window.__mdCsv;
    }
  };
  toggle();
})();