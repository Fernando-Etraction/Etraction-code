const API = '';
let token = localStorage.getItem('cupincha_token') || '';

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(API + url, { ...opts, headers: authHeaders() });
  if (res.status === 401) { logout(); return null; }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

function logout() {
  localStorage.removeItem('cupincha_token');
  location.href = '/admin.html';
}

// ---------- VIEWS ----------
const views = {
  login: document.getElementById('view-login'),
  dashboard: document.getElementById('view-dashboard'),
  stores: document.getElementById('view-stores'),
  coupons: document.getElementById('view-coupons'),
  categories: document.getElementById('view-categories'),
};

function showView(name) {
  Object.values(views).forEach(v => v && (v.style.display = 'none'));
  if (views[name]) views[name].style.display = 'block';
  document.querySelectorAll('.sidebar nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === name);
  });
}

// ---------- LOGIN ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    const err = document.getElementById('login-error');
    err.style.display = 'none';
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Credenciais inválidas');
      const data = await res.json();
      token = data.accessToken;
      localStorage.setItem('cupincha_token', token);
      initAdmin();
    } catch (ex) {
      err.textContent = ex.message;
      err.style.display = 'block';
    }
  });
}

// ---------- INIT ----------
function initAdmin() {
  if (!token) { showView('login'); return; }
  showView('dashboard');
  loadDashboard();
}

// ---------- DASHBOARD ----------
async function loadDashboard() {
  showView('dashboard');
  const data = await apiFetch('/api/admin/dashboard');
  if (!data) return;
  document.getElementById('m-stores').textContent = data.totalStores;
  document.getElementById('m-coupons').textContent = data.totalActiveCoupons;
  document.getElementById('m-clicks').textContent = data.totalClicks;
  document.getElementById('m-clicks24h').textContent = data.clicksLast24h;

  const topList = document.getElementById('top-coupons');
  if (topList && data.topCoupons) {
    topList.innerHTML = data.topCoupons.map(c =>
      `<tr><td>${c.title}</td><td>${c.storeName}</td><td>${c.clickCount}</td></tr>`
    ).join('');
  }
}

// ---------- STORES ----------
async function loadStores() {
  showView('stores');
  const stores = await apiFetch('/api/admin/stores');
  if (!stores) return;
  const tbody = document.getElementById('stores-tbody');
  tbody.innerHTML = stores.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.slug}</td>
      <td>${s.affiliateNetwork || '-'}</td>
      <td><span class="tag ${s.status === 'ACTIVE' ? 'tag-active' : 'tag-inactive'}">${s.status}</span></td>
      <td>${s.featured ? '⭐' : ''}</td>
      <td>
        <button onclick="editStore('${s.id}')" class="btn btn-outline" style="width:auto;padding:.2rem .6rem;font-size:.75rem">Editar</button>
        <button onclick="deleteStore('${s.id}')" class="btn" style="width:auto;padding:.2rem .6rem;font-size:.75rem;background:#dc3545;margin-left:.2rem">Del</button>
      </td>
    </tr>
  `).join('');
}

async function deleteStore(id) {
  if (!confirm('Deletar esta loja?')) return;
  await apiFetch(`/api/admin/stores/${id}`, { method: 'DELETE' });
  loadStores();
}

// ---------- CATEGORIES ----------
async function loadCategories() {
  showView('categories');
  const cats = await apiFetch('/api/admin/categories');
  if (!cats) return;
  const tbody = document.getElementById('cats-tbody');
  tbody.innerHTML = cats.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.slug}</td>
      <td><span class="tag ${c.active ? 'tag-active' : 'tag-inactive'}">${c.active ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        <button onclick="deleteCategory('${c.id}')" class="btn" style="width:auto;padding:.2rem .6rem;font-size:.75rem;background:#dc3545">Del</button>
      </td>
    </tr>
  `).join('');
}

async function deleteCategory(id) {
  if (!confirm('Deletar esta categoria?')) return;
  await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
  loadCategories();
}

const catForm = document.getElementById('cat-form');
if (catForm) {
  catForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('cat-name').value;
    const description = document.getElementById('cat-description').value;
    await apiFetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description, active: true })
    });
    catForm.reset();
    loadCategories();
  });
}

// ---------- COUPONS ----------
async function loadCoupons() {
  showView('coupons');
  const coupons = await apiFetch('/api/admin/coupons');
  if (!coupons) return;
  const tbody = document.getElementById('coupons-tbody');
  tbody.innerHTML = coupons.map(c => `
    <tr>
      <td>${c.title}</td>
      <td>${c.storeName}</td>
      <td>${c.type}</td>
      <td>${c.discountText || '-'}</td>
      <td>${c.clickCount}</td>
      <td><span class="tag ${c.active ? 'tag-active' : 'tag-inactive'}">${c.active ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        <button onclick="deleteCoupon('${c.id}')" class="btn" style="width:auto;padding:.2rem .6rem;font-size:.75rem;background:#dc3545">Del</button>
      </td>
    </tr>
  `).join('');
}

async function deleteCoupon(id) {
  if (!confirm('Deletar este cupom?')) return;
  await apiFetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
  loadCoupons();
}

// ---------- SIDEBAR NAV ----------
document.querySelectorAll('.sidebar nav a[data-view]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const v = a.dataset.view;
    if (v === 'stores') loadStores();
    else if (v === 'coupons') loadCoupons();
    else if (v === 'categories') loadCategories();
    else loadDashboard();
  });
});

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Boot
initAdmin();
