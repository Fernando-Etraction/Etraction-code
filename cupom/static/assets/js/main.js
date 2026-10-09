const API = '';
let mockData = null;

async function loadMockData() {
  if (!mockData) {
    const r = await fetch('/assets/data.json');
    mockData = await r.json();
  }
  return mockData;
}

async function fetchJson(url) {
  // Mock API routes
  const data = await loadMockData();

  // Featured stores
  if (url === '/api/public/stores/featured') {
    return data.stores.slice(0, 4);
  }

  // Carousel coupons
  if (url === '/api/public/coupons/carousel') {
    return data.coupons.filter(c => c.featured);
  }

  // Most used coupons
  if (url === '/api/public/coupons/most-used?period=7d&limit=12') {
    return data.coupons.slice(0, 12);
  }

  // All categories
  if (url === '/api/public/categories') {
    return data.categories;
  }

  // Store by slug
  if (url.startsWith('/api/public/stores/')) {
    const slug = url.replace('/api/public/stores/', '');
    return data.stores.find(s => s.slug === slug) || null;
  }

  // Store coupons by slug
  if (url.includes('/api/public/stores/') && url.includes('/coupons')) {
    const slug = url.split('/')[4];
    return data.coupons.filter(c => c.slug.includes(slug) || c.storeId === data.stores.find(s => s.slug === slug)?.id);
  }

  // Category by slug
  if (url.startsWith('/api/public/categories/')) {
    const slug = url.replace('/api/public/categories/', '');
    return data.categories.find(c => c.slug === slug) || null;
  }

  // All coupons
  if (url === '/api/public/coupons') {
    return data.coupons;
  }

  // Coupon by slug
  if (url.startsWith('/api/public/coupons/') && !url.includes('/click')) {
    const slug = url.replace('/api/public/coupons/', '');
    return data.coupons.find(c => c.slug === slug) || null;
  }

  // Click tracking
  if (url.includes('/api/public/coupons/') && url.includes('/click')) {
    const id = url.split('/')[4];
    const coupon = data.coupons.find(c => c.id === parseInt(id));
    if (coupon) {
      return {
        type: coupon.type,
        code: coupon.code,
        redirectUrl: coupon.redirectUrl
      };
    }
  }

  throw new Error('Rota não encontrada: ' + url);
}

// ---------- MODAL ----------
const modal = document.getElementById('couponModal');
const modalCode = document.getElementById('modalCode');
const modalMsg = document.getElementById('modalMsg');
const modalClose = document.getElementById('modalClose');

function openModal(code, message) {
  modalCode.textContent = code || '';
  modalCode.style.display = code ? 'block' : 'none';
  modalMsg.textContent = message || '';
  modal.classList.add('active');
}

if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('active'));
if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

if (modalCode) {
  modalCode.addEventListener('click', () => {
    navigator.clipboard.writeText(modalCode.textContent).catch(() => {});
  });
}

// ---------- CLICK HANDLER ----------
async function handleCouponClick(couponId, couponSlug) {
  try {
    const data = await loadMockData();
    const coupon = data.coupons.find(c => c.id === parseInt(couponId));
    
    if (!coupon) {
      openModal(null, 'Cupom não encontrado');
      return;
    }

    if (coupon.type === 'CUPOM' && coupon.code) {
      openModal(coupon.code, 'Copie o código e cole na loja!');
    } else {
      openModal(null, 'Você será redirecionado para a loja.');
    }

    setTimeout(() => {
      window.open(coupon.redirectUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  } catch (e) {
    console.error(e);
    openModal(null, 'Erro ao processar cupom');
  }
}

// ---------- CARD BUILDER ----------
function buildCouponCard(c) {
  const badge = c.type === 'CUPOM' ? '<span class="badge badge-cupom">CUPOM</span>' : '<span class="badge badge-oferta">OFERTA</span>';
  const hasCode = c.hasCode ? '🏷️ Possui código' : '';
  const btnLabel = c.type === 'CUPOM' ? 'Ver Cupom' : 'Pegar Desconto';

  const div = document.createElement('div');
  div.className = 'card coupon-card';
  div.innerHTML = `
    ${badge}
    <h3>${c.title}</h3>
    ${c.discountText ? `<div class="discount">${c.discountText}</div>` : ''}
    <div class="store-name">${c.storeName}</div>
    ${hasCode ? `<div style="font-size:.75rem;color:var(--muted);margin-bottom:.4rem">${hasCode}</div>` : ''}
    <button class="btn" onclick="handleCouponClick('${c.id}','${c.slug}')">${btnLabel}</button>
  `;
  return div;
}

function buildStoreCard(s) {
  const div = document.createElement('div');
  div.className = 'card store-card';
  div.innerHTML = `
    ${s.logoUrl ? `<img src="${s.logoUrl}" alt="${s.name}" loading="lazy">` : `<div style="width:80px;height:80px;background:#eee;border-radius:4px;margin-bottom:.5rem"></div>`}
    <h3>${s.name}</h3>
    <a href="/loja.html?slug=${s.slug}" class="btn btn-outline" style="margin-top:.6rem;font-size:.8rem">Ver cupons</a>
  `;
  return div;
}

// ---------- HOME ----------
async function loadHome() {
  const featured = document.getElementById('featured-stores');
  const carousel = document.getElementById('carousel-coupons');
  const mostUsed = document.getElementById('most-used');
  const categoriesEl = document.getElementById('categories');

  if (featured) {
    fetchJson('/api/public/stores/featured').then(stores => {
      stores.forEach(s => featured.appendChild(buildStoreCard(s)));
    }).catch(() => { featured.innerHTML = '<p>Não foi possível carregar lojas.</p>'; });
  }

  if (carousel) {
    fetchJson('/api/public/coupons/carousel').then(coupons => {
      coupons.forEach(c => carousel.appendChild(buildCouponCard(c)));
    }).catch(() => {});
  }

  if (mostUsed) {
    fetchJson('/api/public/coupons/most-used?period=7d&limit=12').then(coupons => {
      coupons.forEach(c => mostUsed.appendChild(buildCouponCard(c)));
    }).catch(() => {});
  }

  if (categoriesEl) {
    fetchJson('/api/public/categories').then(cats => {
      cats.filter(c => c.active).forEach(cat => {
        const a = document.createElement('a');
        a.href = `/categoria.html?slug=${cat.slug}`;
        a.className = 'category-tag';
        a.textContent = cat.name;
        categoriesEl.appendChild(a);
      });
    }).catch(() => {});
  }
}

// ---------- LOJA PAGE ----------
async function loadLoja() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) return;

  try {
    const data = await loadMockData();
    const store = data.stores.find(s => s.slug === slug);
    
    if (!store) {
      document.body.innerHTML = '<p>Loja não encontrada</p>';
      return;
    }

    document.title = store.name + ' - Cupincha';
    document.getElementById('store-logo') && (document.getElementById('store-logo').src = store.logoUrl || '');
    document.getElementById('store-name') && (document.getElementById('store-name').textContent = store.name);
    document.getElementById('store-desc') && (document.getElementById('store-desc').textContent = store.description || '');

    const grid = document.getElementById('store-coupons');
    if (grid) {
      const coupons = data.coupons.filter(c => c.storeId === store.id);
      if (coupons.length === 0) { grid.innerHTML = '<p>Nenhum cupom ativo no momento.</p>'; return; }
      coupons.forEach(c => grid.appendChild(buildCouponCard(c)));
    }
  } catch (e) {
    console.error(e);
  }
}

// ---------- CATEGORIA PAGE ----------
async function loadCategoria() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) return;

  try {
    const data = await loadMockData();
    const cat = data.categories.find(c => c.slug === slug);
    
    if (!cat) {
      document.body.innerHTML = '<p>Categoria não encontrada</p>';
      return;
    }

    document.title = cat.name + ' - Cupincha';
    document.getElementById('cat-name') && (document.getElementById('cat-name').textContent = cat.name);
    document.getElementById('cat-desc') && (document.getElementById('cat-desc').textContent = cat.description || '');

    const grid = document.getElementById('cat-coupons');
    if (grid) {
      const coupons = data.coupons.filter(c => c.categorySlug === slug);
      if (coupons.length === 0) { grid.innerHTML = '<p>Nenhum cupom nesta categoria.</p>'; return; }
      coupons.forEach(c => grid.appendChild(buildCouponCard(c)));
    }
  } catch (e) { console.error(e); }
}

// ---------- CUPOM PAGE ----------
async function loadCupom() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if (!slug) return;

  try {
    const data = await loadMockData();
    const c = data.coupons.find(cp => cp.slug === slug);
    
    if (!c) {
      document.body.innerHTML = '<p>Cupom não encontrado</p>';
      return;
    }

    document.title = c.title + ' - Cupincha';
    document.getElementById('cpn-title') && (document.getElementById('cpn-title').textContent = c.title);
    document.getElementById('cpn-desc') && (document.getElementById('cpn-desc').textContent = c.description || '');
    document.getElementById('cpn-discount') && (document.getElementById('cpn-discount').textContent = c.discountText || '');
    document.getElementById('cpn-store') && (document.getElementById('cpn-store').textContent = c.storeName);
    const btn = document.getElementById('cpn-btn');
    if (btn) {
      btn.textContent = c.type === 'CUPOM' ? 'Ver Cupom' : 'Pegar Desconto';
      btn.onclick = () => handleCouponClick(c.id, c.slug);
    }
  } catch (e) { console.error(e); }
}

// Route
const path = location.pathname;
if (path === '/' || path === '/index.html') loadHome();
else if (path === '/loja.html') loadLoja();
else if (path === '/categoria.html') loadCategoria();
else if (path === '/cupom.html') loadCupom();
