(() => {
  'use strict';
  const P=window.Patatines, $=s=>document.querySelector(s), mode=document.body.dataset.mode==='pos'?'pos':'web';
  const STORAGE='patatines-shop-demo-v1';
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state=P.initial(),category='all',favoritesOnly=false,active=null,selectedSize='',lastTrigger=null;
  function read(){try{state=P.clean(JSON.parse(localStorage.getItem(STORAGE)));}catch{state=P.initial();}}
  function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{toast('Tu navegador no permite guardar la demo. Puedes seguir en esta sesión.');}}
  function toast(message){$('#shop-toast').textContent=message;$('#shop-toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#shop-toast').classList.remove('show'),4200);}
  const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(){
    const query=($('#shop-search')?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const brand=$('#brand-filter')?.value||'all',sort=$('#sort-products')?.value||'selected';
    let list=P.products.filter(p=>(category==='all'||p.categories.includes(category))&&(brand==='all'||p.brand===brand)&&(!favoritesOnly||state.favorites.includes(p.id))&&(`${p.name} ${p.brand} ${p.color}`).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query));
    if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);
    $('#product-count').textContent=`${list.length} ${list.length===1?'producto':'productos'}${favoritesOnly?(list.length===1?' guardado':' guardados'):''}`;
    $('#product-grid').innerHTML=list.length?list.map((p,i)=>`<article class="product-card" style="--card-delay:${Math.min(i,7)*35}ms"><div class="product-photo"><button class="product-open" data-product="${p.id}" aria-label="Ver ${p.name}"><img src="${p.image}" alt="${p.name} en ${p.color.toLowerCase()}" width="480" height="600" loading="lazy"></button><span class="product-tag">${p.categories.includes('regalos')?'Un regalo especial':p.categories.includes('bebe')?'Sus primeros días':'Selección Patatines'}</span>${mode==='web'?`<button class="favorite ${state.favorites.includes(p.id)?'active':''}" data-favorite="${p.id}" aria-label="Guardar ${p.name}" aria-pressed="${state.favorites.includes(p.id)}">${heart}</button>`:''}<button class="quick-add" data-product="${p.id}">${mode==='pos'?'Añadir al ticket':'Elegir talla'} <span aria-hidden="true">+</span></button></div><div class="product-info"><span>${p.brand}</span><h3><button data-product="${p.id}">${p.name}</button></h3><div><strong>${P.currency(p.price)}</strong><small>Precio demo</small></div><p>${p.color} · ${p.sizes.length>1?p.sizes.length+' tallas':'Talla única'}</p></div></article>`).join(''):'<div class="empty-shop"><span aria-hidden="true">♡</span><h3>No encontramos esa combinación.</h3><p>Prueba otra búsqueda o elimina los filtros para volver a la colección.</p><button class="button button--ink" data-reset-filters>Ver toda la colección</button></div>';
    document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=state.carts[mode].reduce((s,r)=>s+r.qty,0));
    document.querySelectorAll('[data-favorites-count]').forEach(el=>el.textContent=state.favorites.length);
    if(mode==='pos'){
      $('#stock-count').textContent=Object.values(state.stock).reduce((s,n)=>s+n,0);
      $('#sales-count').textContent=state.orders.length;
      renderCart();
    }
  }
  function openDialog(id){lastTrigger=document.activeElement;$(id).showModal();document.body.classList.add('shop-modal-open');}
  function closeDialog(dialog){dialog.close();}
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);}});
    dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.body.classList.remove('shop-modal-open');const target=lastTrigger?.isConnected&&lastTrigger.getClientRects().length?lastTrigger:document.querySelector('[data-open-cart],#cart-checkout');target?.focus({preventScroll:true});}});
  });
  function openProduct(id){
    active=P.find(id);if(!active)return;selectedSize='';
    $('#product-detail').innerHTML=`<div class="detail-image"><img src="${active.image}" alt="${active.name}" width="480" height="600"></div><div class="detail-copy"><p class="eyebrow">${active.brand}</p><h2 id="product-title">${active.name}</h2><p class="detail-price">${P.currency(active.price)} <small>precio simulado</small></p><p>${active.description}</p><p class="product-color"><span></span> ${active.color}</p><fieldset><legend>Elige su talla <span id="selected-size"></span></legend><div class="size-options">${active.sizes.map(size=>`<button type="button" data-size="${size}" aria-pressed="false" ${state.stock[P.key(id,size)]===0?'disabled':''}>${size}${state.stock[P.key(id,size)]===0?'<span class="sr-only"> — agotada en la demo</span>':''}</button>`).join('')}</div></fieldset><p class="size-caption">${active.sizesVerified?'Tallas de la publicación. Stock simulado.':'Tallas y stock de ejemplo, pendientes de confirmar.'}</p><p id="product-error" class="field-error" role="alert"></p><button class="button button--coral add-product" data-add-product>${mode==='pos'?'Añadir al ticket':'Añadir a mi cesta'} <span aria-hidden="true">↗</span></button><details class="detail-faq"><summary>Envíos, cambios y tallas</summary><p>Esta es una preview: el plazo, los gastos de envío y las condiciones de cambios se validarán con Patatines antes de abrir la tienda. No se realiza ningún cobro.</p></details><a class="source-link" href="${active.source}" target="_blank" rel="noopener noreferrer">Ver la prenda en su Instagram ↗</a><p class="demo-fine">Foto real de su selección. La demo no confirma el precio ni la disponibilidad actual.</p></div>`;
    openDialog('#product-modal');
  }
  function renderCart(){
    const cart=state.carts[mode],sub=P.subtotal(state,mode);
    $('#cart-lines').innerHTML=cart.length?cart.map(row=>{const p=P.find(row.id);return `<article class="cart-line"><img src="${p.image}" alt="${p.name}" width="72" height="88"><div><small>${p.brand}</small><h3>${p.name}</h3><p>Talla ${row.size} · ${P.currency(p.price)}</p><div class="quantity"><button data-quantity="-1" data-id="${p.id}" data-row-size="${row.size}" aria-label="Quitar una unidad de ${p.name}">−</button><output aria-label="Cantidad">${row.qty}</output><button data-quantity="1" data-id="${p.id}" data-row-size="${row.size}" aria-label="Añadir una unidad de ${p.name}" ${row.qty>=state.stock[P.key(p.id,row.size)]?'disabled':''}>+</button><button class="remove-line" data-remove="${p.id}" data-row-size="${row.size}">Eliminar</button></div></div><strong>${P.currency(p.price*row.qty)}</strong></article>`;}).join(''):'<div class="empty-cart"><span aria-hidden="true">♡</span><h3>Pequeñas cosas bonitas<br>caben en esta cesta.</h3><p>Elige una prenda y su talla para comenzar.</p></div>';
    $('#cart-subtotal').textContent=P.currency(sub);
    $('#cart-checkout').disabled=!cart.length;
    if($('#shipping-progress')){const rest=Math.max(0,6000-sub);$('#shipping-progress').textContent=rest?`Te faltan ${P.currency(rest)} para el envío gratuito de ejemplo.`:'¡Envío gratuito en esta simulación!';$('#shipping-bar').style.width=`${Math.min(100,sub/60)}%`;}
  }
  function openCart(){renderCart();openDialog('#cart-modal');}
  function checkoutSummary(){const sub=P.subtotal(state,mode),delivery=$('input[name="delivery"]:checked')?.value||'pickup',shipping=mode==='web'&&delivery==='shipping'&&sub<6000?495:0;$('#checkout-total').textContent=P.currency(sub+shipping);$('#checkout-shipping').textContent=shipping?`${P.currency(shipping)} (ejemplo)`:'Sin coste (demo)';}
  function startCheckout(){if(!state.carts[mode].length)return;$('#cart-modal')?.close();$('#checkout-form').hidden=false;$('#checkout-success').hidden=true;$('#checkout-error').textContent='';checkoutSummary();openDialog('#checkout-modal');}
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.matches('[data-product]'))openProduct(b.dataset.product);
    if(b.matches('[data-category]')){category=b.dataset.category;favoritesOnly=false;$('#favorite-filter')?.setAttribute('aria-pressed','false');render();}
    if(b.matches('[data-shop-category]')){category=b.dataset.shopCategory;favoritesOnly=false;$('#favorite-filter')?.setAttribute('aria-pressed','false');render();}
    if(b.matches('[data-favorite]')){const id=b.dataset.favorite;state.favorites=state.favorites.includes(id)?state.favorites.filter(f=>f!==id):[...state.favorites,id];save();render();const focusTarget=document.querySelector(`[data-favorite="${id}"]`)||$('#favorite-filter');focusTarget?.focus({preventScroll:true});}
    if(b.matches('#favorite-filter')){favoritesOnly=!favoritesOnly;category='all';$('#brand-filter').value='all';$('#shop-search').value='';b.setAttribute('aria-pressed',String(favoritesOnly));render();$('#catalogo').scrollIntoView({behavior:reducedMotion?'auto':'smooth'});}
    if(b.matches('#shop-motion')){const paused=document.body.classList.toggle('motion-paused');b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'Reanudar animaciones':'Pausar animaciones');b.textContent=paused?'▷':'Ⅱ';}
    if(b.matches('[data-reset-filters]')){category='all';favoritesOnly=false;$('#shop-search').value='';$('#brand-filter').value='all';$('#favorite-filter')?.setAttribute('aria-pressed','false');render();}
    if(b.matches('[data-open-cart]'))openCart();
    if(b.matches('[data-close]'))closeDialog(b.closest('dialog'));
    if(b.matches('[data-size]')){selectedSize=b.dataset.size;document.querySelectorAll('[data-size]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));$('#selected-size').textContent=selectedSize;$('#product-error').textContent='';}
    if(b.matches('[data-add-product]')){
      if(!selectedSize){$('#product-error').textContent='Elige una talla antes de añadir la prenda.';return;}
      if(!P.add(state,mode,active.id,selectedSize)){ $('#product-error').textContent='Has llegado al stock disponible de prueba para esta talla.';return;}
      save();render();closeDialog($('#product-modal'));toast(`${active.name} · ${selectedSize}, ${mode==='pos'?'añadido al ticket':'¡ya está en tu cesta!'}`);
      document.querySelectorAll('[data-open-cart]').forEach(el=>{el.classList.remove('cart-pop');void el.offsetWidth;el.classList.add('cart-pop');});
    }
    if(b.matches('[data-quantity]')){P.add(state,mode,b.dataset.id,b.dataset.rowSize,Number(b.dataset.quantity));save();render();renderCart();}
    if(b.matches('[data-remove]')){state.carts[mode]=state.carts[mode].filter(r=>!(r.id===b.dataset.remove&&r.size===b.dataset.rowSize));save();render();renderCart();}
    if(b.matches('#cart-checkout'))startCheckout();
    if(b.matches('[data-reset-demo]')){state=P.initial();save();render();toast('Demo reiniciada: cestas y ventas vacías, stock de prueba restaurado.');}
  });
  $('#shop-search')?.addEventListener('input',render);$('#brand-filter')?.addEventListener('change',render);$('#sort-products')?.addEventListener('change',render);
  document.querySelectorAll('input[name="delivery"]').forEach(el=>el.addEventListener('change',checkoutSummary));
  $('#checkout-form').addEventListener('submit',e=>{
    e.preventDefault();
    // Reconcile shared local demo stock before finalising. No network/payment request.
    try{const fresh=localStorage.getItem(STORAGE);if(fresh)state=P.clean(JSON.parse(fresh));}catch{}
    const result=P.checkout(state,mode,$('input[name="delivery"]:checked')?.value||'pickup');
    if(!result.ok){$('#checkout-error').textContent=result.error;return;}
    save();render();$('#checkout-form').hidden=true;$('#checkout-success').hidden=false;
    const successHeading=$('#checkout-success h2');successHeading.setAttribute('tabindex','-1');successHeading.focus();
    $('#order-number').textContent=result.number;$('#order-total').textContent=P.currency(result.total);
  });
  window.addEventListener('storage',e=>{if(e.key===STORAGE){read();render();if($('#cart-modal')?.open)renderCart();if($('#checkout-modal')?.open)checkoutSummary();}});
  read();render();
})();
