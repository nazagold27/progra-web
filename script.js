// ====== Claves de storage
const LS_CATALOG = "mh_catalog_v1";
const LS_CART    = "mh_cart_v1";

// ====== Helpers
const money = n => Number(n).toLocaleString("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0});

// ====== Seed con imágenes ONLINE (no requiere archivos locales)
function seedIfEmpty(){
  if(localStorage.getItem(LS_CATALOG)) return;

  const demo = [
    // ROLEX
    { modelo:"Submariner Date 41", marca:"Rolex", precio: 35000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/10/Rolex-Submariner-Date-41-126610LN-1.jpg", stock:true },
    { modelo:"Day-Date 40",        marca:"Rolex", precio:120000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/11/Rolex-Day-Date-President-40-Green-Dial-228235.jpg", stock:true },
    { modelo:"GMT-Master II",      marca:"Rolex", precio: 98000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/07/Rolex-GMT-Master-II-Pepsi-126710BLRO.jpg", stock:true },
    { modelo:"Oyster Perpetual",   marca:"Rolex", precio: 42000000, imagen:"https://cdn.watchcharts.com/watch_images/15/15429-Rolex-Oyster-Perpetual-36-126000-blue-2020.jpg", stock:false },

    // AUDEMARS PIGUET
    { modelo:"Royal Oak 15510ST",  marca:"Audemars Piguet", precio: 82000000, imagen:"https://www.watchcollecting.com/media/11886/audemars-piguet-royal-oak-15510st-00-1220st-01-41mm-stainless-steel-2022-4.jpg", stock:true },
    { modelo:"Royal Oak Offshore", marca:"Audemars Piguet", precio:110000000, imagen:"https://cdn2.chrono24.com/images/uhren/25496332-6b9uhg6be3y5nl4jqcc3g2p1-ExtraLarge.jpg", stock:true },
    { modelo:"Code 11.59",         marca:"Audemars Piguet", precio:135000000, imagen:"https://cdn.watchtime.me/wt/uploads/2020/02/Audemars-Piguet-Code-11.59-Chronograph-3.jpg", stock:false },
    { modelo:"AP Heritage",        marca:"Audemars Piguet", precio: 90000000, imagen:"https://cdn.watchtime.com/wp-content/uploads/2019/02/Audemars-Piguet-Royal-Oak-Chronograph-38mm-gold-1000.jpg", stock:true },

    // RICHARD MILLE
    { modelo:"RM 011-03",          marca:"Richard Mille",   precio:280000000, imagen:"https://monochrome-watches.com/wp-content/uploads/2016/01/Richard-Mille-RM-011-Flyback-Chronograph-Felipe-Massa-2016-Edition.jpg", stock:false },
    { modelo:"RM 035",             marca:"Richard Mille",   precio:210000000, imagen:"https://www.watchcollecting.com/media/10761/richard-mille-rm-035-rafael-nadal-babygro-1.jpg", stock:true },
    { modelo:"RM 72-01",           marca:"Richard Mille",   precio:260000000, imagen:"https://watchesbysjx.com/wp-content/uploads/2020/09/Richard-Mille-RM-72-01-Lifestyle-Automatic-Chronograph-7.jpg", stock:true },
    { modelo:"RM Hero",            marca:"Richard Mille",   precio:230000000, imagen:"https://i.imgur.com/1Wk2h3y.jpeg", stock:true }
  ];

  localStorage.setItem(LS_CATALOG, JSON.stringify(demo.map((p,i)=>({id:i+1, solicitado:false, ...p}))));
  localStorage.setItem(LS_CART, JSON.stringify([]));
}
seedIfEmpty();

// ====== Estado
let catalog = JSON.parse(localStorage.getItem(LS_CATALOG));
let cart    = JSON.parse(localStorage.getItem(LS_CART));
let autoId  = catalog.reduce((m,p)=>Math.max(m,p.id),0) + 1;

// ====== DOM
const grid      = document.getElementById("grid");
const noResults = document.getElementById("noResults");
const q         = document.getElementById("q");
const orden     = document.getElementById("orden");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// ====== Render catálogo
function filtrar(arr){
  const k = (q?.value || "").trim().toLowerCase();
  if(!k) return arr;
  return arr.filter(p =>
    p.modelo.toLowerCase().includes(k) ||
    p.marca.toLowerCase().includes(k)
  );
}
function ordenarLista(arr){
  const a = [...arr];
  const o = orden?.value || "recientes";
  if(o==="modelo")     a.sort((x,y)=>x.modelo.localeCompare(y.modelo));
  if(o==="precioAsc")  a.sort((x,y)=>x.precio - y.precio);
  if(o==="precioDesc") a.sort((x,y)=>y.precio - x.precio);
  return a;
}
function renderCatalog(){
  if(!grid) return;
  const data = ordenarLista(filtrar(catalog));
  grid.innerHTML = "";
  noResults?.classList.toggle("d-none", data.length>0);

  data.forEach(p=>{
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "card-watch animate__animated animate__fadeInUp";

    const pic = document.createElement("div");
    pic.className = "pic";
    pic.style.backgroundImage = `url('${p.imagen}')`;

    const meta = document.createElement("div");
    meta.className = "meta";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `<h3 class="h6 m-0">${p.modelo}</h3>`;

    const badges = document.createElement("div");
    if(p.solicitado){ badges.innerHTML += `<span class="badge-outline">SOLICITADO</span>`; }
    if(!p.stock){     badges.innerHTML += `<span class="badge-outline ms-2">SIN STOCK</span>`; }

    const brand = document.createElement("div");
    brand.className = "text-muted small mb-1";
    brand.textContent = p.marca;

    const price = document.createElement("div");
    price.className = "fw-semibold mb-2";
    price.textContent = money(p.precio);

    const actions = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-ink btn-sm letter";
    btn.textContent = p.stock ? "AGREGAR" : "SOLICITAR";
    btn.addEventListener("click", ()=>{
      if(p.stock){ addToCart(p.id); }
      else{
        if(!p.solicitado){ p.solicitado = true; persist(); renderCatalog(); }
        addToCart(p.id, true);
      }
    });
    actions.appendChild(btn);

    meta.append(title,badges,brand,price,actions);
    card.append(pic,meta);
    col.append(card);
    grid.append(col);
  });
}

// ====== Carrito
function renderCart(){
  if(!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  if(cart.length===0){
    cartItems.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
  }

  cart.forEach(it=>{
    const p = catalog.find(x=>x.id===it.id);
    if(!p) return;
    total += p.precio * it.qty;
    count += it.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    thumb.style.backgroundImage = `url('${p.imagen}')`;

    const info = document.createElement("div");
    info.innerHTML = `<div class="fw-semibold">${p.modelo} <span class="text-muted fw-normal">• ${p.marca}</span></div>
                      <div class="text-muted">${money(p.precio)}</div>
                      ${ (it.solicitado || p.solicitado || !p.stock) ? '<span class="badge-outline d-inline-block mt-1">SOLICITADO</span>' : '' }
                      `;

    const controls = document.createElement("div");
    controls.className = "d-flex align-items-center gap-2";
    const btnMinus = document.createElement("button"); btnMinus.className = "qty-btn"; btnMinus.textContent = "−";
    const amount   = document.createElement("span");   amount.textContent = it.qty;
    const btnPlus  = document.createElement("button"); btnPlus.className  = "qty-btn"; btnPlus.textContent = "+";
    const btnDel   = document.createElement("button"); btnDel.className   = "btn btn-sm btn-outline-secondary"; btnDel.textContent = "🗑";
    btnMinus.addEventListener("click", ()=> changeQty(it.id, -1));
    btnPlus .addEventListener("click", ()=> changeQty(it.id, +1));
    btnDel  .addEventListener("click", ()=> removeFromCart(it.id));
    controls.append(btnMinus, amount, btnPlus, btnDel);

    row.append(thumb, info, controls);
    cartItems.appendChild(row);
  });

  cartTotal && (cartTotal.textContent = money(total));
  cartCount && (cartCount.textContent = count);
}

function addToCart(id, solicitado=false){
  const f = cart.find(i=>i.id===id);
  if(f) f.qty += 1; else cart.push({id, qty:1, solicitado});
  persist(); renderCart();
}
function changeQty(id, d){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + d);
  persist(); renderCart();
}
function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  persist(); renderCart();
}
function persist(){
  localStorage.setItem(LS_CATALOG, JSON.stringify(catalog));
  localStorage.setItem(LS_CART, JSON.stringify(cart));
}

// ====== Eventos UI
document.getElementById("btnBuscar")?.addEventListener("click", renderCatalog);
document.getElementById("btnLimpiar")?.addEventListener("click", ()=>{ q.value=""; orden.value="recientes"; renderCatalog(); });
orden?.addEventListener("change", renderCatalog);

const reqModal = document.getElementById("requestModal") ? new bootstrap.Modal('#requestModal') : null;
document.getElementById("btnOpenRequest")?.addEventListener("click", ()=>reqModal.show());
document.getElementById("btnOpenRequest2")?.addEventListener("click", ()=>reqModal.show());
document.getElementById("requestForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const modelo = document.getElementById("reqModelo").value.trim();
  const marca  = document.getElementById("reqMarca").value.trim();
  const notas  = document.getElementById("reqNotas").value.trim();
  if(!modelo || !marca) return;
  const nuevo = { id: ++autoId, modelo, marca, notas, precio: 0, imagen: "https://i.imgur.com/tpU5IVn.jpeg", stock:false, solicitado:true };
  catalog.unshift(nuevo); persist();
  reqModal.hide(); renderCatalog();
});

document.getElementById("btnCheckout")?.addEventListener("click", ()=>{
  if(cart.length===0){ alert("Tu carrito está vacío."); return; }
  alert("¡Gracias! Compra simulada para el TP.");
  cart = []; persist(); renderCart();
});

// ====== Init
renderCatalog();
renderCart();
