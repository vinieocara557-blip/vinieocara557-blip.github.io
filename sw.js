var C='combinado-v2',A=['./','index.html','styles.css','app.js','calc.js','data.js','pdf.js','logo.svg','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','cardapio-mirai.pdf'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(A);}).catch(function(){}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(new Promise(function(res){var done=false;
  function fromCache(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||(r.mode==='navigate'?caches.match('index.html'):null);});}
  function fail(){fromCache().then(function(m){res(m||new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="background:#05070a;color:#eef6f9;font-family:sans-serif;padding:24px"><h2 style="color:#5ce1ff">Sem internet</h2><p>Abra o Combinado uma vez com internet para ele funcionar offline.</p>',{headers:{'Content-Type':'text/html; charset=utf-8'}}));});}
  var t=setTimeout(function(){if(!done){done=true;fail();}},4000);
  fetch(r).then(function(n){if(n&&n.ok){var cp=n.clone();caches.open(C).then(function(c){c.put(r,cp);});}if(!done){done=true;clearTimeout(t);res(n);}})
   .catch(function(){if(!done){done=true;clearTimeout(t);fail();}});}));});
