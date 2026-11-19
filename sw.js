/* Tuca Idiomas: funciona sin conexión. La página se busca primero en internet (para recibir mejoras) y, sin señal
   o si tarda más de 5 s, se usa la guardada. Nunca se guarda una página de error en lugar de la buena. */
const V='tuca-v5';
const BASE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','assets/fuentes.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(r.mode==='navigate'){
  e.respondWith(new Promise(ok=>{let listo=false;const da=x=>{if(!listo){listo=true;ok(x)}};
   const guardada=()=>caches.match('index.html');
   const t=setTimeout(()=>guardada().then(m=>{if(m)da(m)}),5000);
   fetch(r).then(res=>{clearTimeout(t);if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));da(res)}else guardada().then(m=>da(m||res))})
    .catch(()=>{clearTimeout(t);guardada().then(m=>da(m||new Response('Sin conexión',{status:504})))})}));
  return}
 if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))}});
