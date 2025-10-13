\const LS_CATALOG = "mh_catalog_v1";
const LS_CART    = "mh_cart_v1";

let catalog = JSON.parse(localStorage.getItem(LS_CATALOG) || "[]");
let cart    = JSON.parse(localStorage.getItem(LS_CART) || "[]");
let autoId  = catalog.reduce((m,p)=>Math.max(m,p.id),0) + 1;

const saveCatalog = () => localStorage.setItem(LS_CATALOG, JSON.stringify(catalog));
const saveCart    = () => localStorage.setItem(LS_CART, JSON.stringify(cart));
const money = n => Number(n).toLocaleString("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0});

function seedIfEmpty(){
  if(catalog.length) return;
  const demo = [
  {
    modelo:"Submariner Date 41", marca:"Rolex",
    precio: 35000000,
    imagen:"imagenes/img:rolex-submariner.jpg",
    stock:true
  },
  {
    modelo:"Royal Oak 15510ST", marca:"Audemars Piguet",
    precio: 82000000,
    imagen:"imagenes/img:ap-royal-oak.jpg",
    stock:true
  },
  {
    modelo:"RM 011-03", marca:"Richard Mille",
    precio: 280000000,
    imagen:"imagenes/img:rm-01103.jpg",
    stock:false
  },
  {
    modelo:"Day-Date 40", marca:"Rolex",
    precio: 120000000,
    imagen:"imagenes/img:rolex-daydate.jpg",
    stock:true
  }
];

  catalog = demo.map((w,i)=>({id:i+1, solicitado:false, ...w}));
  autoId = catalog.length + 1;
  saveCatalog();
}

// ====== DOM refs ======
const grid = document.getElementById("grid");
const noResults = document.getElementById("noResults");
const q = document.getElementById("q");
const orden = document.getElementById("orden");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// ====== Filtros/orden ======
function ordenar(arr){
  const o = orden.value;
  const a = [...arr];
  if(o==="modelo") a.sort((x,y)=>x.modelo.localeCompare(y.modelo));
  if(o==="precioAsc") a.sort((x,y)=>x.precio - y.precio);
  if(o==="precioDesc") a.sort((x,y)=>y.precio - x.precio);
  return a;
}
function filtrar(arr){
  const k = q.value.trim().toLowerCase();
  if(!k) return arr;
  return arr.filter(p => p.modelo.toLowerCase().includes(k) || p.marca.toLowerCase().includes(k));
}

// ====== Render catálogo ======
function renderCatalog(){
  const data = ordenar(filtrar(catalog));
  grid.innerHTML = "";
  noResults.classList.toggle("d-none", data.length>0);

  data.forEach(p=>{
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "card-watch animate__animated animate__fadeInUp";

    const pic = document.createElement("div");
    pic.className = "pic";
    pic.style.backgroundImage = `url('${p.imagen || "imagenes/placeholder.jpg"}')`;

    const meta = document.createElement("div");
    meta.className = "meta";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `<h3 class="h6 m-0">${p.modelo}</h3>`;
    if(p.solicitado){
      const b = document.createElement("span");
      b.className = "badge-outline";
      b.textContent = "SOLICITADO";
      title.appendChild(b);
    } else if(!p.stock){
      const b = document.createElement("span");
      b.className = "badge-outline";
      b.textContent = "SIN STOCK";
      title.appendChild(b);
    }

    const brand = document.createElement("div");
    brand.className = "text-muted small mb-1";
    brand.textContent = p.marca;

    const price = document.createElement("div");
    price.className = "fw-semibold mb-2";
    price.textContent = p.precio ? money(p.precio) : "Consultar";

    const actions = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-ink btn-sm letter";
    btn.textContent = p.stock ? "AGREGAR" : "SOLICITAR";
    btn.addEventListener("click", ()=>{
      if(p.stock){
        addToCart(p.id);
      }else{
        if(!p.solicitado){ p.solicitado = true; saveCatalog(); renderCatalog(); }
        addToCart(p.id, true);
      }
    });
    actions.appendChild(btn);

    meta.appendChild(title);
    meta.appendChild(brand);
    meta.appendChild(price);
    meta.appendChild(actions);

    card.appendChild(pic);
    card.appendChild(meta);
    col.appendChild(card);
    grid.appendChild(col);
  });
}

// ====== Carrito ======
function renderCart(){
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  if(cart.length===0){
    cartItems.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`;
  }

  cart.forEach(it=>{
    const p = catalog.find(x=>x.id===it.id);
    if(!p) return;
    total += (p.precio || 0) * it.qty;
    count += it.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    thumb.style.backgroundImage = `url('${p.imagen || "imagenes/placeholder.jpg"}')`;

    const info = document.createElement("div");
    info.innerHTML = `<div class="fw-semibold">${p.modelo} <span class="text-muted fw-normal">• ${p.marca}</span></div>
                      <div class="text-muted">${p.precio?money(p.precio):"Consultar"}</div>`;
    if(it.solicitado || p.solicitado || !p.stock){
      const b = document.createElement("span");
      b.className = "badge-outline d-inline-block mt-1";
      b.textContent = "SOLICITADO";
      info.appendChild(b);
    }

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

  cartTotal.textContent = money(total);
  cartCount.textContent = count;
}

function addToCart(id, solicitado=false){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += 1;
  else cart.push({id, qty:1, solicitado});
  saveCart(); renderCart();
}
function changeQty(id, d){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + d);
  saveCart(); renderCart();
}
function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); renderCart();
}

// ====== Buscar/ordenar/limpiar ======
document.getElementById("btnBuscar").addEventListener("click", renderCatalog);
document.getElementById("btnLimpiar").addEventListener("click", ()=>{ q.value=""; orden.value="recientes"; renderCatalog(); });
orden.addEventListener("change", renderCatalog);

// ====== Solicitud (agregar al catálogo como SOLICITADO) ======
const reqModal = new bootstrap.Modal('#requestModal');
document.getElementById("btnOpenRequest").addEventListener("click", ()=>reqModal.show());
document.getElementById("btnOpenRequest2").addEventListener("click", ()=>reqModal.show());
document.getElementById("requestForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const modelo = document.getElementById("reqModelo").value.trim();
  const marca  = document.getElementById("reqMarca").value.trim();
  const notas  = document.getElementById("reqNotas").value.trim();
  if(!modelo || !marca) return;

  const nuevo = {
    id: ++autoId,
    modelo, marca, notas,
    precio: 0,
    imagen: "",    
    stock: false,
    solicitado: true
  };
  catalog.unshift(nuevo);
  saveCatalog(); reqModal.hide(); renderCatalog();
});

// ====== Checkout ficticio ======
document.getElementById("btnCheckout").addEventListener("click", ()=>{
  if(cart.length===0) { alert("Tu carrito está vacío."); return; }
  alert("¡Gracias! Compra simulada para el TP. Recibirás un correo de confirmación.");
  cart = []; saveCart(); renderCart();
});

seedIfEmpty();
renderCatalog();
renderCart();
