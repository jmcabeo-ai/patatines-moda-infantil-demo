/* Fotografías/productos: Instagram oficial. Importes y existencias: SOLO DEMO. */
(function (root) {
  const post = id => `https://www.instagram.com/patatines.moda.infantil/p/${id}/`;
  const products = [
    {id:'punto-agua',name:'Tres piezas de punto agua',brand:'Mac Ilusión',price:4990,image:'assets/instagram-10.jpg',color:'Verde agua',categories:['mini','punto'],sizes:['12 m','18 m','24 m','36 m'],sizesVerified:false,source:post('Dbs0DlgF6nu'),description:'Un conjunto de tres piezas en punto verde agua. La selección que Patatines ha compartido para los pequeños planes de otoño.'},
    {id:'pelele-rosa',name:'Pelele floral con chaleco',brand:'Mac Ilusión',price:4290,image:'assets/instagram-11.jpg',color:'Rosa',categories:['bebe','punto'],sizes:['1 m','3 m','6 m','12 m'],sizesVerified:false,source:post('Dbszyc4l6tf'),description:'Flores, rosa y un chaleco de punto con volantes. Pelele publicado por Patatines de la colección de otoño e invierno.'},
    {id:'corona',name:'Corona de cumpleaños',brand:'Little Dutch',price:1995,image:'assets/instagram-06.jpg',color:'Rosa',categories:['regalos'],sizes:['Única'],sizesVerified:true,source:post('DbyDfq5l3Iq'),description:'Para celebrar sus grandes pequeños días. Corona con los números del 1 al 5, tal como aparece en el Instagram de Patatines.'},
    {id:'chaqueton',name:'Chaquetón con capucha',brand:'Abel & Lula',price:7990,image:'assets/instagram-02.jpg',color:'Beige',categories:['junior','abrigos'],sizes:['4 a','6 a','8 a','10 a','12 a'],sizesVerified:true,source:post('DcWYopfl4r6'),description:'Chaquetón acolchado en beige con capucha. Las tallas del selector son las publicadas por la tienda; la disponibilidad actual debe confirmarse.'},
    {id:'abrigo',name:'Abrigo de vestir arena',brand:'Abel & Lula',price:6990,image:'assets/instagram-03.jpg',color:'Arena',categories:['bebe','mini','abrigos'],sizes:['12 m','18 m','24 m','36 m'],sizesVerified:true,source:post('DcWYUMFl4EK'),description:'Abrigo de vestir para sus primeras ocasiones especiales. Cuello redondeado, botones y un tono arena fácil de combinar.'},
    {id:'sudadera-oliva',name:'Sudadera con cinturón',brand:'Abel & Lula',price:4590,image:'assets/instagram-05.jpg',color:'Oliva',categories:['junior'],sizes:['6 a','8 a','10 a','12 a'],sizesVerified:true,source:post('DcWXuWlF5AJ'),description:'Una sudadera de vestir con cinturón, en verde oliva. Un look con personalidad de la selección de Abel & Lula de Patatines.'},
    {id:'polaina',name:'Conjunto cielo y estrellas',brand:'Mayoral',price:2990,image:'assets/instagram-07.jpg',color:'Azul cielo',categories:['bebe'],sizes:['1 m','3 m','6 m','9 m'],sizesVerified:false,source:post('DbyDH6nl4tj'),description:'Camiseta y polaina de dos piezas. Azul cielo y pequeños motivos para vestir sus primeros días.'},
    {id:'sudadera-negra',name:'Sudadera de vestir negra',brand:'Abel & Lula',price:3990,image:'assets/instagram-04.jpg',color:'Negro',categories:['junior'],sizes:['6 a','8 a','10 a','12 a'],sizesVerified:true,source:post('DcWYBICF3dz'),description:'Líneas sencillas y detalles de volumen. Una prenda de vestir de Abel & Lula publicada por Patatines.'}
  ];
  const currency = value => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(value/100);
  const key = (id,size) => `${id}|${size}`;
  const find = id => products.find(p=>p.id===id);
  const initial = () => ({version:1,stock:Object.fromEntries(products.flatMap(p=>p.sizes.map((s,i)=>[key(p.id,s),i===3?0:4]))),carts:{web:[],pos:[]},favorites:[],orders:[]});
  function clean(raw) {
    const state=initial();
    if (!raw || raw.version!==1) return state;
    for (const k of Object.keys(state.stock)) if(Number.isInteger(raw.stock?.[k])&&raw.stock[k]>=0&&raw.stock[k]<=4) state.stock[k]=raw.stock[k];
    for (const channel of ['web','pos']) {
      const seen=new Set();
      state.carts[channel]=(Array.isArray(raw.carts?.[channel])?raw.carts[channel]:[]).filter(row=>{
        const p=find(row?.id),k=key(row?.id,row?.size);
        if(!p?.sizes.includes(row.size)||!Number.isInteger(row.qty)||row.qty<1||row.qty>4||seen.has(k))return false;
        seen.add(k);return true;
      }).map(({id,size,qty})=>({id,size,qty}));
    }
    state.favorites=(Array.isArray(raw.favorites)?raw.favorites:[]).filter((id,i,a)=>find(id)&&a.indexOf(id)===i);
    // No personal data is stored. Only aggregate demo order counters survive reload.
    state.orders=(Array.isArray(raw.orders)?raw.orders:[]).filter(o=>['web','pos'].includes(o.channel)&&Number.isInteger(o.total)&&o.total>=0).slice(-20).map(o=>({channel:o.channel,total:o.total}));
    return state;
  }
  function add(state,channel,id,size,delta=1) {
    const p=find(id);
    if(!p?.sizes.includes(size)||!['web','pos'].includes(channel)||!Number.isInteger(delta)) return false;
    const cart=state.carts[channel],row=cart.find(r=>r.id===id&&r.size===size),qty=(row?.qty||0)+delta;
    if(qty>state.stock[key(id,size)]||qty>4)return false;
    if(qty<=0){state.carts[channel]=cart.filter(r=>r!==row);return true;}
    if(row)row.qty=qty;else cart.push({id,size,qty});
    return true;
  }
  const subtotal=(state,channel)=>state.carts[channel].reduce((sum,row)=>sum+find(row.id).price*row.qty,0);
  function checkout(state,channel,delivery='pickup') {
    const cart=state.carts[channel];
    if(!cart?.length) return {ok:false,error:'La cesta está vacía.'};
    if(cart.some(r=>r.qty>state.stock[key(r.id,r.size)]))return {ok:false,error:'El stock de prueba ha cambiado. Ajusta las cantidades antes de continuar.'};
    const sub=subtotal(state,channel),shipping=channel==='web'&&delivery==='shipping'&&sub<6000?495:0;
    const order={channel,total:sub+shipping};
    cart.forEach(r=>state.stock[key(r.id,r.size)]-=r.qty);
    state.orders.push(order);state.orders=state.orders.slice(-20);state.carts[channel]=[];
    return {ok:true,...order,shipping,number:`DEMO-${String(state.orders.length).padStart(3,'0')}`};
  }
  const api={products,currency,key,find,initial,clean,add,subtotal,checkout};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Patatines=api;
})(typeof window!=='undefined'?window:globalThis);
