const WHATSAPP_NUMBER = "905000000000";

const products = [
{id:1,name:"Antep Fıstığı",cat:"fistik",desc:"İri taneli, özel kavrulmuş premium fıstık.",price:690,img:"https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80"},
{id:2,name:"Karışık Kuruyemiş",cat:"karisik",desc:"Fındık, kaju, badem ve fıstık karışımı.",price:420,img:"https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=80"},
{id:3,name:"Badem",cat:"badem",desc:"Çıtır dokulu, taze ve yüksek kalite badem.",price:360,img:"https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=900&q=80"},
{id:4,name:"Kaju",cat:"kaju",desc:"Kremamsı lezzetiyle özel seçilmiş kaju.",price:470,img:"https://images.unsplash.com/photo-1563412885-139e4045ebaa?auto=format&fit=crop&w=900&q=80"},
{id:5,name:"Fındık İçi",cat:"findik",desc:"Taze kırımlı, aroması güçlü fındık içi.",price:390,img:"https://images.unsplash.com/photo-1600147184950-b0a367a98bc3?auto=format&fit=crop&w=900&q=80"},
{id:6,name:"Ceviz İçi",cat:"ceviz",desc:"Tatlı, günlük kullanıma uygun ceviz içi.",price:330,img:"https://images.unsplash.com/photo-1615485291262-1408fef3d6f8?auto=format&fit=crop&w=900&q=80"}
];

function money(n){return "₺"+n.toLocaleString("tr-TR")}
function getCart(){return JSON.parse(localStorage.getItem("cart")||"[]")}
function saveCart(c){localStorage.setItem("cart",JSON.stringify(c));updateCartCount()}

function addToCart(id){
  let c=getCart();
  let item=c.find(x=>x.id===id);
  item ? item.qty++ : c.push({id,qty:1});
  saveCart(c);
  alert("Ürün sepete eklendi");
}

function removeFromCart(id){
  saveCart(getCart().filter(x=>x.id!==id));
  renderCart();
}

function changeQty(id,delta){
  let c=getCart();
  let item=c.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<1)c=c.filter(x=>x.id!==id);
  saveCart(c);
  renderCart();
}

function updateCartCount(){
  let el=document.querySelector("#cartCount");
  if(el)el.textContent=getCart().reduce((a,b)=>a+b.qty,0);
}

function renderProducts(cat="all"){
  const wrap=document.querySelector("#productGrid");
  if(!wrap)return;

  wrap.innerHTML=products.filter(p=>cat==="all"||p.cat===cat).map(p=>`
  <div class="card">
    <img src="${p.img}" alt="${p.name}">
    <div class="card-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}</div>
      <button class="btn btn-dark" onclick="addToCart(${p.id})">Sepete Ekle</button>
    </div>
  </div>`).join("");
}

function renderCart(){
  const wrap=document.querySelector("#cartRows");
  if(!wrap)return;

  const cart=getCart();
  let total=0;

  if(cart.length===0){
    wrap.innerHTML="<p>Sepetin boş. Ürünlerden ekleme yapabilirsin.</p>";
    document.querySelector("#cartTotal").textContent="Toplam: ₺0";
    return;
  }

  wrap.innerHTML=cart.map(i=>{
    let p=products.find(x=>x.id===i.id);
    let sub=p.price*i.qty;
    total+=sub;

    return `
    <div class="cart-row">
      <b>${p.name}</b>
      <div class="qty">
        <button onclick="changeQty(${p.id},-1)">-</button>
        <span>${i.qty}</span>
        <button onclick="changeQty(${p.id},1)">+</button>
      </div>
      <b>${money(sub)}</b>
      <button class="btn btn-dark" onclick="removeFromCart(${p.id})">Sil</button>
    </div>`;
  }).join("");

  document.querySelector("#cartTotal").textContent="Toplam: "+money(total);
}

function sendOrder(){
  const name=document.querySelector("#name")?.value||"";
  const phone=document.querySelector("#phone")?.value||"";
  const address=document.querySelector("#address")?.value||"";
  const pay=document.querySelector("#pay")?.value||"";
  const note=document.querySelector("#note")?.value||"";
  const cart=getCart();

  if(!cart.length){
    alert("Sepet boş");
    return;
  }

  let lines=cart.map(i=>{
    let p=products.find(x=>x.id===i.id);
    return `- ${p.name} x ${i.qty} = ${money(p.price*i.qty)}`;
  }).join("%0A");

  let total=cart.reduce((sum,i)=>sum+(products.find(p=>p.id===i.id).price*i.qty),0);

  let msg=`Merhaba Çerez Deposu, sipariş vermek istiyorum.%0A%0A${lines}%0A%0AToplam: ${money(total)}%0AAd Soyad: ${name}%0ATelefon: ${phone}%0AAdres: ${address}%0AÖdeme: ${pay}%0ANot: ${note}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}

function setup(){
  updateCartCount();
  renderProducts();
  renderCart();

  document.querySelectorAll(".filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(btn.dataset.cat);
    });
  });

  if(localStorage.getItem("dark")==="1")document.body.classList.add("dark");

  document.querySelector("#darkBtn")?.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem("dark",document.body.classList.contains("dark")?"1":"0");
  });

  if(!sessionStorage.getItem("popupSeen")){
    setTimeout(()=>{
      document.querySelector("#popup")?.classList.add("show");
      sessionStorage.setItem("popupSeen","1");
    },900);
  }

  document.querySelector("#closePopup")?.addEventListener("click",()=>{
    document.querySelector("#popup").classList.remove("show");
  });
}

document.addEventListener("DOMContentLoaded",setup);
