import { products, categories, imageOf } from './products.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';
const catName = (id) => categories.find((c) => c.id === id)?.name || '';
const byId = (id) => products.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- хранилище (только в этом браузере) ---------- */
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('elfoxo-demo:' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('elfoxo-demo:' + k, JSON.stringify(v)); } catch { /* приватный режим */ } },
};

const state = {
  filter: 'all',
  sort: 'default',
  cart: store.get('cart', []).filter((l) => byId(l.id)),
  favs: new Set(store.get('favs', []).filter(byId)),
  chosen: {}, // выбранный цвет в карточке каталога
};

/* ---------- иконки ---------- */
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

/* ---------- категории ---------- */
function renderCategories() {
  $('#cats').innerHTML = categories.map((c) => {
    const n = products.filter((p) => p.category === c.id).length;
    const p = products.find((x) => c.cover.startsWith(x.id + '-'));
    const color = c.cover.slice(p.id.length + 1);
    return `<button class="cat reveal" type="button" data-cat="${c.id}">
      <div class="cat__img"><img src="${imageOf(p, color)}" alt="Демо-иллюстрация: ${esc(c.name.toLowerCase())}" loading="lazy" width="800" height="1000"></div>
      <h3>${esc(c.name)} <small>${n}</small></h3>
      <p>${esc(c.note)}</p>
    </button>`;
  }).join('');
}

/* ---------- фильтры ---------- */
function renderFilters() {
  const list = [{ id: 'all', name: 'Все' }, ...categories, { id: 'new', name: 'Новая коллекция' }, { id: 'fav', name: 'Избранное' }];
  $('#filters').innerHTML = list.map((f) => {
    const n = f.id === 'all' ? products.length : f.id === 'new' ? products.filter((p) => p.collection).length : f.id === 'fav' ? state.favs.size : products.filter((p) => p.category === f.id).length;
    return `<button class="chip" type="button" role="tab" data-filter="${f.id}" aria-selected="${state.filter === f.id}">${esc(f.name)}<sup>${n}</sup></button>`;
  }).join('');
}

function visibleProducts() {
  let list = products.filter((p) =>
    state.filter === 'all' ? true :
    state.filter === 'new' ? p.collection :
    state.filter === 'fav' ? state.favs.has(p.id) :
    p.category === state.filter);
  if (state.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return list;
}

function cardHTML(p, i) {
  const color = state.chosen[p.id] || p.colors[0].key;
  const badge = p.badge ? `<span class="card__badge ${p.badge === 'Новинка' ? 'card__badge--new' : ''}">${esc(p.badge)}</span>` : '';
  return `<article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms" data-id="${p.id}">
    ${badge}
    <button class="fav" type="button" data-action="fav" aria-pressed="${state.favs.has(p.id)}" aria-label="Добавить в избранное: ${esc(p.name)}">${heart}</button>
    <button class="card__media" type="button" data-action="open" aria-label="Открыть товар: ${esc(p.name)}">
      <img src="${imageOf(p, color)}" alt="Демо-иллюстрация: ${esc(p.name)}" loading="lazy" width="800" height="1000">
      <span class="demo-chip">Демо</span>
    </button>
    <button class="btn btn--dark btn--sm card__quick" type="button" data-action="quick">В корзину</button>
    <h3 class="card__title"><button type="button" data-action="open">${esc(p.name)}</button></h3>
    <div class="card__row">
      <span class="price">${rub(p.price)}<small>демо</small></span>
      <div class="swatches">${p.colors.map((c) => `<button class="swatch" type="button" data-action="color" data-color="${c.key}" style="background:${c.hex}" aria-pressed="${c.key === color}" aria-label="Цвет: ${esc(c.name)}" title="${esc(c.name)}"></button>`).join('')}</div>
    </div>
  </article>`;
}

function renderGrid() {
  const list = visibleProducts();
  const info = $('#catalogInfo');
  if (state.filter === 'all') info.textContent = `Показано ${list.length} товаров`;
  else {
    const label = state.filter === 'new' ? 'Новая коллекция' : state.filter === 'fav' ? 'Избранное' : catName(state.filter);
    info.innerHTML = `${esc(label)}: ${list.length} · <button type="button" data-filter="all">показать все</button>`;
  }
  $('#grid').innerHTML = list.length ? list.map(cardHTML).join('') :
    `<div class="empty"><p>${state.filter === 'fav' ? 'В избранном пока пусто — нажмите на сердечко на карточке товара.' : 'В этой категории пока нет товаров.'}</p><button class="btn btn--ghost btn--sm" type="button" data-filter="all">Смотреть все товары</button></div>`;
}

function setFilter(f, scroll = false) {
  state.filter = f;
  renderFilters();
  renderGrid();
  if (scroll) $('#catalog').scrollIntoView({ behavior: 'smooth' });
}

/* ---------- новая коллекция ---------- */
function renderCollection() {
  $('#collectionGrid').innerHTML = products.filter((p) => p.collection).slice(0, 4).map((p) => `
    <button class="mini reveal" type="button" data-open="${p.id}">
      <img src="${imageOf(p)}" alt="Демо-иллюстрация: ${esc(p.name)}" loading="lazy" width="800" height="1000">
      <div><b>${esc(p.name)}</b><span>${rub(p.price)}</span></div>
    </button>`).join('');
}

/* ---------- карточка товара ---------- */
let current = null;
let lastFocus = null;

function openProduct(id, colorKey) {
  const p = byId(id);
  if (!p) return;
  current = { p, color: colorKey || state.chosen[id] || p.colors[0].key, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
  renderProduct();
  openModal('#productModal');
  history.replaceState(null, '', '#product-' + id);
}

function renderProduct() {
  const { p, color, size, qty } = current;
  const c = p.colors.find((x) => x.key === color);
  $('#pm').innerHTML = `
    <div class="pm__media">
      <img src="${imageOf(p, color)}" alt="Демо-иллюстрация: ${esc(p.name)}, цвет ${esc(c.name.toLowerCase())}" width="800" height="1000">
      <div class="pm__thumbs">${p.colors.map((x) => `<button type="button" data-pm-color="${x.key}" aria-pressed="${x.key === color}" aria-label="${esc(x.name)}"><img src="${imageOf(p, x.key)}" alt=""></button>`).join('')}</div>
      <span class="demo-chip">Демо-иллюстрация</span>
    </div>
    <div class="pm__info">
      <div>
        <span class="pm__cat">${esc(catName(p.category))}</span>
        <h3 id="pmTitle">${esc(p.name)}</h3>
      </div>
      <div class="pm__price">${rub(p.price)}<small>демонстрационная цена</small></div>
      <div>
        <p class="pm__label">Цвет: <b>${esc(c.name)}</b></p>
        <div class="swatches">${p.colors.map((x) => `<button class="swatch" type="button" data-pm-color="${x.key}" style="background:${x.hex}" aria-pressed="${x.key === color}" aria-label="Цвет: ${esc(x.name)}" title="${esc(x.name)}"></button>`).join('')}</div>
      </div>
      <div>
        <p class="pm__label">Размер${p.sizes[0].includes('год') || p.sizes[0].includes('лет') ? ' (возраст)' : p.sizes[0] === 'Единый' ? '' : ' (обхват головы, см)'}: <b>${size ? esc(size) : 'не выбран'}</b></p>
        <div class="sizes">${p.sizes.map((s) => `<button class="size" type="button" data-pm-size="${esc(s)}" aria-pressed="${s === size}">${esc(s)}</button>`).join('')}</div>
      </div>
      <div class="pm__buy">
        <div class="qty" aria-label="Количество"><button type="button" data-pm-qty="-1" aria-label="Меньше">−</button><span>${qty}</span><button type="button" data-pm-qty="1" aria-label="Больше">+</button></div>
        <button class="btn btn--dark" type="button" data-action="pm-add">В корзину · ${rub(p.price * qty)}</button>
      </div>
      <p class="pm__text">${esc(p.text)}</p>
      <div class="pm__details">
        <details><summary>Состав и уход</summary><p>Состав, рекомендации по уходу и страна производства будут указаны по данным бренда. В демоверсии они не приводятся.</p></details>
        <details><summary>Доставка и возврат</summary><p>Условия доставки и возврата будут добавлены по официальной информации ElFoxo.</p></details>
        <details><summary>Об изображении</summary><p>Это демонстрационная иллюстрация, созданная для макета сайта. Она не является фотографией реального товара бренда.</p></details>
      </div>
      <button class="btn btn--ghost btn--sm" type="button" data-action="pm-fav" aria-pressed="${state.favs.has(p.id)}">${state.favs.has(p.id) ? '♥ В избранном' : '♡ В избранное'}</button>
    </div>`;
}

$('#pm').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t || !current) return;
  if (t.dataset.pmColor) { current.color = t.dataset.pmColor; state.chosen[current.p.id] = current.color; renderProduct(); renderGrid(); }
  else if (t.dataset.pmSize) { current.size = t.dataset.pmSize; renderProduct(); }
  else if (t.dataset.pmQty) { current.qty = Math.max(1, Math.min(9, current.qty + Number(t.dataset.pmQty))); renderProduct(); }
  else if (t.dataset.action === 'pm-fav') { toggleFav(current.p.id); renderProduct(); }
  else if (t.dataset.action === 'pm-add') {
    if (!current.size) { toast('Выберите размер'); $('.sizes', $('#pm')).animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    addToCart(current.p.id, current.color, current.size, current.qty);
    closeModals();
    openCart();
  }
});

/* ---------- избранное ---------- */
function toggleFav(id) {
  state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
  store.set('favs', [...state.favs]);
  toast(state.favs.has(id) ? 'Добавлено в избранное' : 'Удалено из избранного');
  updateCounters();
  renderFilters();
  if (state.filter === 'fav') renderGrid();
  else $$(`.card[data-id="${id}"] .fav`).forEach((b) => b.setAttribute('aria-pressed', state.favs.has(id)));
}

/* ---------- корзина ---------- */
function addToCart(id, color, size, qty = 1) {
  const line = state.cart.find((l) => l.id === id && l.color === color && l.size === size);
  if (line) line.qty = Math.min(9, line.qty + qty);
  else state.cart.push({ id, color, size, qty });
  saveCart();
  toast('Товар добавлен в корзину');
}
function saveCart() { store.set('cart', state.cart); renderCart(); updateCounters(true); }

function renderCart() {
  const body = $('#cartBody');
  if (!state.cart.length) {
    body.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg><p>Корзина пока пуста</p><button class="btn btn--dark btn--sm" type="button" data-action="to-catalog">Перейти в каталог</button></div>`;
    $('#cartFoot').hidden = true;
    return;
  }
  $('#cartFoot').hidden = false;
  body.innerHTML = state.cart.map((l, i) => {
    const p = byId(l.id), c = p.colors.find((x) => x.key === l.color) || p.colors[0];
    return `<div class="line">
      <img src="${imageOf(p, c.key)}" alt="">
      <div><b>${esc(p.name)}</b><small>${esc(c.name)} · ${esc(l.size)}</small>
        <div class="qty"><button type="button" data-line="${i}" data-d="-1" aria-label="Меньше">−</button><span>${l.qty}</span><button type="button" data-line="${i}" data-d="1" aria-label="Больше">+</button></div>
      </div>
      <div class="line__side"><b>${rub(p.price * l.qty)}</b><button class="line__remove" type="button" data-remove="${i}">Удалить</button></div>
    </div>`;
  }).join('');
  $('#cartTotal').textContent = rub(state.cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0));
}

$('#cartBody').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.line) {
    const l = state.cart[t.dataset.line];
    l.qty += Number(t.dataset.d);
    if (l.qty < 1) state.cart.splice(t.dataset.line, 1);
    else l.qty = Math.min(9, l.qty);
    saveCart();
  } else if (t.dataset.remove) { state.cart.splice(t.dataset.remove, 1); saveCart(); }
  else if (t.dataset.action === 'to-catalog') { closeCart(); setFilter('all', true); }
});

function updateCounters(bump) {
  const n = state.cart.reduce((s, l) => s + l.qty, 0);
  const cc = $('#cartCount'), fc = $('#favCount');
  cc.hidden = !n; cc.textContent = n;
  fc.hidden = !state.favs.size; fc.textContent = state.favs.size;
  if (bump) { cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump'); }
}

/* ---------- модальные окна ---------- */
function openModal(sel) {
  lastFocus = document.activeElement;
  $$('.modal').forEach((m) => (m.hidden = true));
  const m = $(sel);
  m.hidden = false;
  document.body.classList.add('locked');
  $('.modal__close', m).focus({ preventScroll: true });
}
function closeModals() {
  const wasProduct = !$('#productModal').hidden;
  $$('.modal').forEach((m) => (m.hidden = true));
  if ($('#cart').hidden) document.body.classList.remove('locked');
  if (wasProduct) history.replaceState(null, '', location.pathname + location.search);
  lastFocus?.focus?.({ preventScroll: true });
}
function openCart() {
  renderCart();
  $('#cart').hidden = false;
  document.body.classList.add('locked');
  $('#cart .modal__close').focus({ preventScroll: true });
}
function closeCart() { $('#cart').hidden = true; document.body.classList.remove('locked'); }
function info(title, text) { $('#imTitle').textContent = title; $('#imText').textContent = text; openModal('#infoModal'); }

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- общий обработчик кликов ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action], [data-filter], [data-cat], [data-open]');
  if (!t) return;
  const card = t.closest('.card');
  const id = card?.dataset.id;

  if (t.dataset.filter) return setFilter(t.dataset.filter);
  if (t.dataset.cat) return setFilter(t.dataset.cat, true);
  if (t.dataset.open) return openProduct(t.dataset.open);

  switch (t.dataset.action) {
    case 'open': return openProduct(id);
    case 'fav': return toggleFav(id);
    case 'color': {
      state.chosen[id] = t.dataset.color;
      const p = byId(id);
      const img = $('.card__media img', card);
      img.style.opacity = 0;
      setTimeout(() => { img.src = imageOf(p, t.dataset.color); img.onload = () => (img.style.opacity = 1); }, 150);
      $$('.swatch', card).forEach((s) => s.setAttribute('aria-pressed', s === t));
      return;
    }
    case 'quick': {
      const p = byId(id);
      if (p.sizes.length > 1) return openProduct(id);
      addToCart(id, state.chosen[id] || p.colors[0].key, p.sizes[0]);
      return;
    }
    case 'show-favorites': closeMenu(); return setFilter('fav', true);
    case 'show-collection': return setFilter('new', true);
    case 'open-cart': closeMenu(); return openCart();
    case 'close-cart': return closeCart();
    case 'close-modal': return closeModals();
    case 'close-demo': $('#demoBar').remove(); store.set('demoBarHidden', true); return;
    case 'checkout':
      closeCart();
      return info('Оформление отключено', 'Это демонстрационная версия сайта: оплата не подключена, заказ не создаётся, а персональные данные не запрашиваются и не отправляются. Корзина хранится только в вашем браузере.');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('#productModal').hidden || !$('#infoModal').hidden) closeModals();
  else if (!$('#cart').hidden) closeCart();
  else closeMenu();
});

$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); });

/* ---------- мобильное меню ---------- */
const burger = $('#burger'), nav = $('#nav');
function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Открыть меню'); }
burger.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });

/* ---------- шапка и активный раздел ---------- */
const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });

const navLinks = $$('#nav a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['categories', 'catalog', 'collection', 'about', 'order', 'contacts'].forEach((id) => spy.observe(document.getElementById(id)));

/* ---------- появление при прокрутке ---------- */
const revealer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
function observeReveal() { $$('.reveal:not(.in)').forEach((el) => (revealer ? revealer.observe(el) : el.classList.add('in'))); }

/* ---------- подбор размера (демо-сетка) ---------- */
$('#sizer').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = Number($('#headSize').value);
  const out = $('#sizerResult');
  if (!v || v < 34 || v > 60) { out.textContent = 'Введите обхват головы от 34 до 60 см.'; return; }
  const grid = [[36, 38, '36–38'], [38, 40, '38–40'], [40, 42, '40–42'], [43, 46, '44–46'], [47, 50, '48–50'], [51, 54, '52–54'], [55, 60, '56–58']];
  const hit = grid.find(([a, b]) => v >= a && v <= b) || grid.reduce((best, g) => (Math.abs((g[0] + g[1]) / 2 - v) < Math.abs((best[0] + best[1]) / 2 - v) ? g : best));
  out.innerHTML = `Рекомендуемый размер: <b>${hit[2]}</b>. Если значение на границе, выбирайте больший размер. Сетка демонстрационная — уточняйте по таблице бренда.`;
});

/* ---------- старт ---------- */
if (store.get('demoBarHidden', false)) $('#demoBar')?.remove();
$('#year').textContent = new Date().getFullYear();
renderCategories();
renderFilters();
renderGrid();
renderCollection();
renderCart();
updateCounters();
observeReveal();
const m = location.hash.match(/^#product-(.+)$/);
if (m && byId(m[1])) openProduct(m[1]);
