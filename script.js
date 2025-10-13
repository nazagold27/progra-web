function seedIfEmpty(){
  if(localStorage.getItem("mh_catalog_v1")) return;

  const relojes = [
    { modelo:"Submariner Date 41", marca:"Rolex", precio:35000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/10/Rolex-Submariner-Date-41-126610LN-1.jpg" },
    { modelo:"Day-Date 40", marca:"Rolex", precio:120000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/11/Rolex-Day-Date-President-40-Green-Dial-228235.jpg" },
    { modelo:"GMT-Master II", marca:"Rolex", precio:98000000, imagen:"https://www.swisswatchexpo.com/TheWatchClub/wp-content/uploads/2021/07/Rolex-GMT-Master-II-Pepsi-126710BLRO.jpg" },
    { modelo:"Royal Oak 15510ST", marca:"Audemars Piguet", precio:82000000, imagen:"https://www.watchcollecting.com/media/11886/audemars-piguet-royal-oak-15510st-00-1220st-01-41mm-stainless-steel-2022-4.jpg" },
    { modelo:"Royal Oak Offshore", marca:"Audemars Piguet", precio:110000000, imagen:"https://cdn2.chrono24.com/images/uhren/25496332-6b9uhg6be3y5nl4jqcc3g2p1-ExtraLarge.jpg" },
    { modelo:"Code 11.59", marca:"Audemars Piguet", precio:135000000, imagen:"https://cdn.watchtime.me/wt/uploads/2020/02/Audemars-Piguet-Code-11.59-Chronograph-3.jpg" },
    { modelo:"RM 011-03", marca:"Richard Mille", precio:280000000, imagen:"https://monochrome-watches.com/wp-content/uploads/2016/01/Richard-Mille-RM-011-Flyback-Chronograph-Felipe-Massa-2016-Edition.jpg" },
    { modelo:"RM 035", marca:"Richard Mille", precio:210000000, imagen:"https://www.watchcollecting.com/media/10761/richard-mille-rm-035-rafael-nadal-babygro-1.jpg" },
    { modelo:"RM 72-01", marca:"Richard Mille", precio:260000000, imagen:"https://watchesbysjx.com/wp-content/uploads/2020/09/Richard-Mille-RM-72-01-Lifestyle-Automatic-Chronograph-7.jpg" }
  ];

  localStorage.setItem("mh_catalog_v1", JSON.stringify(relojes));
}

seedIfEmpty();

const catalogo = JSON.parse(localStorage.getItem("mh_catalog_v1"));
const grid = document.getElementById("grid");
const noResults = document.getElementById("noResults");

function renderCatalogo(lista){
  grid.innerHTML = "";
  lista.forEach(r => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <article class="card-watch">
        <div class="pic" style="background-image:url('${r.imagen}')"></div>
        <div class="meta">
          <div class="title"><h3 class="h6 m-0">${r.modelo}</h3></div>
          <div class="text-muted small">${r.marca}</div>
          <div class="fw-semibold">$${r.precio.toLocaleString("es-AR")}</div>
        </div>
      </article>
    `;
    grid.appendChild(col);
  });
}

function filtrar(){
  const q = document.getElementById("q").value.trim().toLowerCase();
  const o = document.getElementById("orden").value;
  let lista = catalogo.filter(r =>
    r.modelo.toLowerCase().includes(q) ||
    r.marca.toLowerCase().includes(q)
  );

  if(o==="modelo") lista.sort((a,b)=>a.modelo.localeCompare(b.modelo));
  if(o==="precioAsc") lista.sort((a,b)=>a.precio-b.precio);
  if(o==="precioDesc") lista.sort((a,b)=>b.precio-a.precio);

  noResults.classList.toggle("d-none", lista.length>0);
  renderCatalogo(lista);
}

document.getElementById("btnBuscar").addEventListener("click", filtrar);
document.getElementById("btnLimpiar").addEventListener("click", ()=>{
  document.getElementById("q").value = "";
  document.getElementById("orden").value = "recientes";
  filtrar();
});

renderCatalogo(catalogo);
