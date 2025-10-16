/* ========= Claves de storage (forzamos reseed con un nombre nuevo) ========= */
const LS_CATALOG = "mh_catalog_v10_weserv";
const LS_CART    = "mh_cart_v1";

/* ========= Estado ========= */
let catalog = JSON.parse(localStorage.getItem(LS_CATALOG) || "[]");
let cart    = JSON.parse(localStorage.getItem(LS_CART)    || "[]");
let autoId  = catalog.reduce((m,p)=>Math.max(m,p.id||0),0) + 1;

const saveCatalog = () => localStorage.setItem(LS_CATALOG, JSON.stringify(catalog));
const saveCart    = () => localStorage.setItem(LS_CART,    JSON.stringify(cart));
const money = n => Number(n).toLocaleString("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0});

/* ========= Ayuda de chat con las fotos porque el dominio me las bloquea ========= */
function toWeserv(url) {
  try {
    const u = new URL(url);
    // Muchos servidores usan query (?imwidth=840). Normalmente Weserv ignora o conviene quitarla.
    const hostPath = `${u.hostname}${u.pathname}`; 
    // Puedes ajustar w (ancho) a gusto. 'output=webp' y 'il' (interlaced/low) suelen ir bien.
    return `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}&w=1400&output=webp&il`;
  } catch {
    return url; // si no es URL absoluta, devuelvo tal cual (probablemente local)
  }
}

/* ========= Ayuda de chat con las fotos porque el dominio me las bloquea ========= */
const PLACEHOLDER_DATAURI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1066' viewBox='0 0 800 1066'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='28'>Imagen no disponible</text></svg>";

/* ========= Ayuda de chat con las fotos porque el dominio me las bloquea ========= */
function setBackgroundWithFallback(el, urls) {
  let i = 0;
  const tryNext = () => {
    if (i >= urls.length) {
      el.style.backgroundImage = `url("${PLACEHOLDER_DATAURI}")`;
      return;
    }
    const src = urls[i++];
    const img = new Image();
    // Cargar sin credenciales; si falla por hotlink, saltamos a la siguiente
    img.crossOrigin = "anonymous";
    img.onload  = () => { el.style.backgroundImage = `url("${src}")`; };
    img.onerror = tryNext;
    img.src = src;
  };
  tryNext();
}

/* ========= Semilla de catálogo (12 relojes) =========
   imagenHD: URL pública (la “de Google / sitio oficial”)
   imagenLocal: tu archivo local en /imagenes por si querés fallback local
*/
function seedIfEmpty(){
  if (Array.isArray(catalog) && catalog.length >= 12) return;

  catalog = [
    // ROLEX
    {
      id:1, modelo:"Submariner Date 41", marca:"Rolex", precio:35000000, stock:true, solicitado:false,
      imagenHD:"https://www.rolex.com/content/dam/rolex-com/new-watches/2020/new-submariner/new-submariner-date-m126610ln-0001/asset-2.jpg",
      imagenLocal:"imagenes/img:rolex-submariner.jpg"
    },
    {
      id:2, modelo:"Day-Date 40", marca:"Rolex", precio:120000000, stock:true, solicitado:false,
      imagenHD:"https://content.rolex.com/dam/2024/upright-bba-with-shadow/m128238-0069.png?imwidth=840",
      imagenLocal:"imagenes/img:rolex-daydate.jpg"
    },
    {
      id:3, modelo:"GMT-Master II", marca:"Rolex", precio:98000000, stock:true, solicitado:false,
      imagenHD:"https://content.rolex.com/dam/2022/upright-bba-with-shadow/m126710blro-0002.png?imwidth=840",
      imagenLocal:"imagenes/img:rolex-gmt.jpg"
    },
    {
      id:4, modelo:"Rolex Heritage", marca:"Rolex", precio:42000000, stock:false, solicitado:false,
      imagenHD:"https://content.rolex.com/dam/2024/upright-bba-with-shadow/m124300-0001.png?imwidth=840",
      imagenLocal:"imagenes/img:rolex-hero.jpg"
    },

    // AUDEMARS PIGUET
    {
      id:5, modelo:"Royal Oak 15510ST", marca:"Audemars Piguet", precio:82000000, stock:true, solicitado:false,
      imagenHD:"https://www.audemarspiguet.com/content/dam/ap/com/products/15510ST.OO.1320ST.06/15510ST.OO.1320ST.06_1.png",
      imagenLocal:"imagenes/img:ap-royal-oak.jpg"
    },
    {
      id:6, modelo:"Royal Oak Offshore", marca:"Audemars Piguet", precio:110000000, stock:true, solicitado:false,
      imagenHD:"https://www.audemarspiguet.com/content/dam/ap/com/products/26238TI.OO.A056CA.01/26238TI.OO.A056CA.01_1.png",
      imagenLocal:"imagenes/img:ap-offshore.jpg"
    },
    {
      id:7, modelo:"Code 11.59", marca:"Audemars Piguet", precio:135000000, stock:false, solicitado:false,
      imagenHD:"https://www.audemarspiguet.com/content/dam/ap/com/products/15210BC.OO.A002CR.01/15210BC.OO.A002CR.01_1.png",
      imagenLocal:"imagenes/img:ap-code11-59.jpg"
    },
    {
      id:8, modelo:"AP Maison Gold", marca:"Audemars Piguet", precio:90000000, stock:true, solicitado:false,
      imagenHD:"https://www.audemarspiguet.com/content/dam/ap/com/products/15500OR.OO.D002CR.01/15500OR.OO.D002CR.01_1.png",
      imagenLocal:"imagenes/img:ap-hero.jpg"
    },

    // RICHARD MILLE
    {
      id:9,  modelo:"RM 011-03", marca:"Richard Mille", precio:280000000, stock:false, solicitado:false,
      imagenHD:"https://www.richardmille.com/sites/default/files/styles/full_width_image/public/rm11-03-automatic-flyback-chronograph_1.jpg",
      imagenLocal:"imagenes/img:rm-01103.jpg"
    },
    {
      id:10, modelo:"RM 035", marca:"Richard Mille", precio:210000000, stock:true, solicitado:false,
      imagenHD:"https://www.richardmille.com/sites/default/files/styles/full_width_image/public/rm35-03-automatic-rafael-nadal_1.jpg",
      imagenLocal:"imagenes/img:rm-035.jpg"
    },
    {
      id:11, modelo:"RM 72-01", marca:"Richard Mille", precio:260000000, stock:true, solicitado:false,
      imagenHD:"https://www.richardmille.com/sites/default/files/styles/full_width_image/public/rm-72-01-lifestyle_0.jpg",
      imagenLocal:"imagenes/img:rm-072.jpg"
    },
    {
      id:12, modelo:"RM Lifestyle", marca:"Richard Mille", precio:230000000, stock:true, solicitado:false,
      imagenHD:"https://www.richardmille.com/sites/default/files/styles/full_width_image/public/rm67-02-automatic-extra-flat_1.jpg",
      imagenLocal:"imagenes/img:rm-hero.jpg"
    },
  ];

  autoId = catalog.length + 1;
  saveCatalog();
}

/* ========= DOM ========= */
const grid      = document.getElementById("grid");
const noResults = document.getElementById("noResults");
const q         = document.getElementById("q");
const orden     = document.getElementById("orden");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

/* ========= Filtros / Orden ========= */
function ordenar(arr){
  const sel = orden?.value || "recientes";
  const a = [...arr];
  if(sel==="modelo")     a.sort((x,y)=>x.modelo.localeCompare(y.modelo));
  if(sel==="precioAsc")  a.sort((x,y)=>x.precio - y.precio);
  if(sel==="precioDesc") a.sort((x,y)=>y.precio - x.precio);
  return a;
}
function filtrar(arr){
  const k = (q?.value || "").trim().toLowerCase();
  if(!k) return arr;
  return arr.filter(p => p.modelo.toLowerCase().includes(k) || p.marca.toLowerCase().includes(k));
}

/* ========= Render catálogo ========= */
function renderCatalog(){
  if(!grid) return;
  const data = ordenar(filtrar(catalog));
  grid.innerHTML = "";
  noResults?.classList.toggle("d-none", data.length>0);

  data.forEach(p=>{
    const col  = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("article");
    card.className = "card-watch animate__animated animate__fadeInUp";

    const pic  = document.createElement("div");
    pic.className = "pic";

    // Cadena de candidatos: proxy(HD) -> original(HD) -> local -> placeholder
    const candidates = [ toWeserv(p.imagenHD), p.imagenHD, p.imagenLocal, PLACEHOLDER_DATAURI ];
    setBackgroundWithFallback(pic, candidates);

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

    meta.append(title, brand, price, actions);
    card.append(pic, meta);
    col.appendChild(card);
    grid.appendChild(col);
  });
}

/* ========= Carrito ========= */
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
    total += (p.precio || 0) * it.qty;
    count += it.qty;

    const row   = document.createElement("div");
    row.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    const candidates = [ toWeserv(p.imagenHD), p.imagenHD, p.imagenLocal, PLACEHOLDER_DATAURI ];
    setBackgroundWithFallback(thumb, candidates);

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

  cartTotal && (cartTotal.textContent = money(total));
  cartCount && (cartCount.textContent = count);
}

/* ========= Operaciones de carrito ========= */
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

/* ========= Comprar ========= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#btnCheckout");
  if (!btn) return;

  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert("¡Gracias! Compra simulada para el TP. Recibirás un correo de confirmación.");
  cart = [];
  saveCart();
  renderCart();

  try {
    const canvas = bootstrap.Offcanvas.getOrCreateInstance('#cartCanvas');
    canvas?.hide();
  } catch (_) {}
});

/* ========= Solicitar modelo ========= */
const reqModalEl = document.getElementById("requestModal");
const reqModal   = reqModalEl ? new bootstrap.Modal('#requestModal') : null;

document.getElementById("btnOpenRequest")?.addEventListener("click", ()=>reqModal?.show());
document.getElementById("btnOpenRequest2")?.addEventListener("click", ()=>reqModal?.show());

document.getElementById("requestForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const modelo = document.getElementById("reqModelo").value.trim();
  const marca  = document.getElementById("reqMarca").value.trim();
  const notas  = document.getElementById("reqNotas").value.trim();
  if(!modelo || !marca) return;

  const nuevo = {
    id: ++autoId, modelo, marca, notas,
    precio: 0,
    imagenHD: marca.toLowerCase().includes("rolex")
      ? "https://content.rolex.com/dam/2024/upright-bba-with-shadow/m124300-0001.png"
      : marca.toLowerCase().includes("audemars")
      ? "https://www.audemarspiguet.com/content/dam/ap/com/products/15510ST.OO.1320ST.06/15510ST.OO.1320ST.06_1.png"
      : "https://www.richardmille.com/sites/default/files/styles/full_width_image/public/rm67-02-automatic-extra-flat_1.jpg",
    imagenLocal: marca.toLowerCase().includes("rolex")
      ? "imagenes/img:rolex-hero.jpg"
      : marca.toLowerCase().includes("audemars")
      ? "imagenes/img:ap-hero.jpg"
      : "imagenes/img:rm-hero.jpg",
    stock: false,
    solicitado: true
  };
  catalog.unshift(nuevo);
  saveCatalog(); reqModal?.hide(); renderCatalog();
});

/* ========= Eventos de filtros ========= */
document.getElementById("btnBuscar")?.addEventListener("click", (e)=>{
  e.preventDefault();
  renderCatalog();
});
q?.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") { e.preventDefault(); renderCatalog(); }
});
orden?.addEventListener("change", renderCatalog);
document.getElementById("btnLimpiar")?.addEventListener("click", (e)=>{
  e.preventDefault();
  if (q) q.value = "";
  if (orden) orden.value = "recientes";
  renderCatalog();
});

/* ========= Init ========= */
seedIfEmpty();
renderCatalog();
renderCart();
