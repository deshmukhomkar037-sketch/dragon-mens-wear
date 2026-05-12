// ===================== PRODUCT DATA =====================
const products = [
  { id:1, name:'Dragon Fire Formal Shirt', cat:'Shirts', price:1299, original:2499, emoji:'<img src="https://images.unsplash.com/photo-1602810319428-019690571b5b" style="width:100%;height:100%;object-fit:cover;">', badge:'new', rating:4.8, reviews:124, desc:'Premium cotton formal shirt with subtle dragon embroidery on cuff. Perfect for office and events. Available in slim fit.', sizes:['S','M','L','XL','XXL'] },
  { id:2, name:'Shadow Rider Leather Jacket', cat:'Jackets', price:3999, original:7999, emoji:'<img src="https://images.unsplash.com/photo-1520975661595-6453be3f7070" style="width:100%;height:100%;object-fit:cover;">', badge:'sale', rating:4.9, reviews:89, desc:'Full-grain leather jacket with dragon scale texture on shoulders. Lined with premium fleece for warmth and style.', sizes:['M','L','XL','XXL'] },
  { id:3, name:'Street Dragon Denim', cat:'Pants', price:1599, original:2999, emoji:'<img src="https://images.unsplash.com/photo-1582552938357-32b906df40cb" style="width:100%;height:100%;object-fit:cover;">', badge:'hot', rating:4.7, reviews:201, desc:'Slim-fit stretch denim jeans with dragon claw distress marks. Ultra-comfortable for all-day wear.', sizes:['30','32','34','36','38'] },
  { id:4, name:'Dragon Kurta Set', cat:'Ethnic', price:2199, original:3999, emoji:'🥷', badge:'new', rating:4.6, reviews:67, desc:'Premium cotton kurta with intricate dragon motif embroidery. Perfect for festive and traditional occasions.', sizes:['S','M','L','XL','XXL'] },
  { id:5, name:'Flame Polo T-Shirt', cat:'Casual', price:799, original:1499, emoji:'👕', badge:'sale', rating:4.5, reviews:312, desc:'Breathable pique cotton polo with flame dragon graphic on chest. Relaxed fit, perfect for weekends.', sizes:['S','M','L','XL','XXL'] },
  { id:6, name:'Dragon Claw Hoodie', cat:'Casual', price:1899, original:3499, emoji:'🫱', badge:'hot', rating:4.9, reviews:156, desc:'Heavyweight fleece hoodie with all-over dragon claw print. Kangaroo pocket with hidden zipper.', sizes:['M','L','XL','XXL'] },
  { id:7, name:'Royal Sherwani Dragon', cat:'Ethnic', price:5999, original:9999, emoji:'🤴', badge:'new', rating:5.0, reviews:43, desc:'Regal sherwani with dragon gold thread work. Complete set with churidar and dupatta. Perfect for weddings.', sizes:['S','M','L','XL'] },
  { id:8, name:'Fire Bomber Jacket', cat:'Jackets', price:2799, original:4999, emoji:'✈️', badge:'sale', rating:4.7, reviews:98, desc:'Classic bomber jacket with dragon embroidery on back. Satin lining with ribbed cuffs and waistband.', sizes:['M','L','XL','XXL'] },
];

// ===================== STATE =====================
let cart = [];
let currentModal = null;
let modalQty = 1;
let selectedSize = null;
let currentFilter = 'All';

// ===================== RENDER PRODUCTS =====================
function renderProducts(filter = 'All') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'All' ? products : products.filter(p => p.cat === filter);
  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.animationDelay = `${i * 0.1}s`;
    const badgeHtml = p.badge ? `<span class="badge badge-${p.badge}">${p.badge === 'new' ? 'NEW' : p.badge === 'sale' ? 'SALE' : '🔥 HOT'}</span>` : '';
    const discount = Math.round((1 - p.price/p.original)*100);
    card.innerHTML = `
      <div class="product-img-wrap" onclick="openModal(${p.id})">
        <div class="product-img">${p.emoji}</div>
        <div class="product-badges">${badgeHtml}</div>
        <div class="product-actions">
          <div class="action-btn" onclick="event.stopPropagation();addToCart(${p.id})">🛒</div>
          <div class="action-btn" onclick="event.stopPropagation();wishlist(${p.id})">🤍</div>
          <div class="action-btn" onclick="event.stopPropagation();openModal(${p.id})">👁️</div>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${p.cat}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '½' : ''}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="sizes-row">
          ${p.sizes.slice(0,4).map(s => `<div class="size-dot">${s}</div>`).join('')}
        </div>
        <div class="product-footer">
          <div class="price-wrap">
            <span class="price">₹${p.price.toLocaleString()}</span>
            <span class="price-original">₹${p.original.toLocaleString()} (${discount}% off)</span>
          </div>
          <button class="add-cart" id="btn-${p.id}" onclick="addToCart(${p.id})">+ CART</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  observeReveal();
}

// ===================== FILTER =====================
function filterProducts(cat, btn) {
  currentFilter = cat;
  if(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderProducts(cat);
  if(cat !== 'All') document.getElementById('products').scrollIntoView({behavior:'smooth'});
}

// ===================== CART =====================
function addToCart(id, size='M', qty=1) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id && i.size === size);
  if(existing) {
    existing.qty += qty;
  } else {
    cart.push({...product, size, qty});
  }
  updateCartUI();
  showToast(`🔥 ${product.name} added to cart!`);
  const btn = document.getElementById(`btn-${id}`);
  if(btn) {
    btn.textContent = '✓ ADDED';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+ CART'; btn.classList.remove('added'); }, 2000);
  }
}

function addToCartFromModal() {
  if(!currentModal) return;
  if(!selectedSize) { showToast('⚠️ Please select a size!'); return; }
  addToCart(currentModal.id, selectedSize, modalQty);
  closeModal();
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  updateCartUI();
  showToast('🗑️ Item removed from cart');
}

function updateCartUI() {
  const count = cart.reduce((a,b) => a+b.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const total = cart.reduce((a,b) => a + b.price*b.qty, 0);
  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
  const container = document.getElementById('cartItems');
  if(cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><span class="cart-empty-icon">🛒</span><p class="cart-empty-text">Your cart is empty.<br>Add some fire! 🔥</p></div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Size: ${item.size} | Qty: ${item.qty}</div>
        </div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${item.size}')">✕</button>
      </div>
    `).join('');
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

function checkout() {
  if(cart.length === 0) { showToast('⚠️ Cart is empty!'); return; }
  showToast('🎉 Order placed! Thank you for shopping at Dragon!');
  cart = [];
  updateCartUI();
  closeCart();
}

// ===================== MODAL =====================
function openModal(id) {
  const p = products.find(x => x.id === id);
  currentModal = p;
  modalQty = 1;
  selectedSize = null;
  document.getElementById('modalImg').innerHTML = p.emoji;
  document.getElementById('modalCat').textContent = p.cat;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalPrice').textContent = `₹${p.price.toLocaleString()}`;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalQty').textContent = 1;
  const sizesDiv = document.getElementById('modalSizes');
  sizesDiv.innerHTML = p.sizes.map(s => `<button class="size-btn" onclick="selectSize('${s}',this)">${s}</button>`).join('');
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
  currentModal = null;
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('#modalSizes .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modalQty').textContent = modalQty;
}

function buyNow() {
  if(!selectedSize) { showToast('⚠️ Please select a size!'); return; }
  addToCart(currentModal.id, selectedSize, modalQty);
  closeModal();
  setTimeout(() => { openCart(); }, 300);
}

function wishlist(id) {
  const p = products.find(x => x.id === id);
  showToast(`❤️ ${p.name} added to wishlist!`);
}

document.getElementById('productModal').addEventListener('click', function(e) {
  if(e.target === this) closeModal();
});

// ===================== TOAST =====================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===================== CURSOR =====================
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => { cursor.style.transform = 'translate(-50%,-50%) scale(0.7)'; });
document.addEventListener('mouseup', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });

// ===================== PARTICLES =====================
const pbg = document.getElementById('particles-bg');
for(let i = 0; i < 35; i++) {
  const s = document.createElement('div');
  s.className = 'spark';
  s.style.left = Math.random()*100 + '%';
  s.style.width = s.style.height = Math.random()*3+1 + 'px';
  s.style.animationDuration = Math.random()*8+5 + 's';
  s.style.animationDelay = Math.random()*10 + 's';
  s.style.background = Math.random()>0.5 ? '#ff4500' : '#d4a017';
  pbg.appendChild(s);
}

// ===================== REVEAL ANIMATION =====================
function observeReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
observeReveal();

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth'});
  });
});

// ===================== INIT =====================
renderProducts();

// Hero entrance animation
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if(heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-40px)';
    setTimeout(() => {
      heroContent.style.transition = 'all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateX(0)';
    }, 200);
  }
});