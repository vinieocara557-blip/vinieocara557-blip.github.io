(function(){'use strict';
var $=function(s){return document.querySelector(s);},C=window.Calc,M=window.MENU,BY={};M.forEach(function(m){BY[m.id]=m;});
var KEY='combinado.events.v1',LAST='combinado.last.v1',evs=load(),ev,openInc=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return [];}}
function save(){ev.date=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(evs));localStorage.setItem(LAST,ev.id);}catch(e){}}
function h(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&'+'amp;','<':'&'+'lt;','>':'&'+'gt;','"':'&'+'quot;'}[c];});}
var B=C.brl,N=C.num;
ev=evs.filter(function(e){return e.id===localStorage.getItem(LAST);})[0]||evs[0];
if(!ev){ev=C.newEvent('Evento');evs.unshift(ev);save();}
var ORDER=['entradas','combinado','quentes','sobremesa'];
function u(it){return it.unit==='fatias'?'fatias':it.unit==='porção'?'porção':'un';}
function optLabel(it){var p=it.plate?'1 prato':it.dupla?'dupla':it.plabel;return p+' · '+B(it.price);}
function render(){
 $('#evName').value=ev.name;var r=C.compute(ev,M),p=ev.people,html='';
 html+='<section class="card"><h2>Pessoas</h2><div class="people"><button class="step" data-a="pp" data-d="-1" aria-label="menos">−</button>'+
  '<input id="ppl" type="number" inputmode="numeric" min="0" max="999" value="'+p+'"><button class="step" data-a="pp" data-d="1" aria-label="mais">+</button></div>'+
  (p?'':'<p class="warn">Coloque o número de pessoas para a conta fechar</p>')+
  '<div class="bases"><button class="btn sm '+(ev.base==='casa'?'':'ghost')+'" data-a="base" data-v="casa">Base da casa</button><button class="btn sm '+(ev.base==='semebi'?'':'ghost')+'" data-a="base" data-v="semebi">Sem Ebi</button></div>'+
  (ev.base==='montado'?'<p class="warn" style="color:var(--soft)">Montado à mão</p>':'')+'</section>';
 C.ROWS.forEach(function(row,i){var k=row[0],R=r.rows[k];
  html+='<section class="card"><h2>'+(i+1)+'. '+row[1]+'<small class="num">'+(p?B(R.total):'—')+'</small></h2>';
  if(k==='vinho'){html+='<div class="bases"><button class="btn sm '+(ev.wine.on?'':'ghost')+'" data-a="wine">'+(ev.wine.on?'Vinho incluído':'Incluir vinho')+'</button></div>';
   if(ev.wine.on){html+='<div class="bases">'+C.WINES.map(function(w){return '<button class="btn sm '+(ev.wine.tipo===w[0]?'':'ghost')+'" data-a="wt" data-v="'+w[0]+'">'+w[1].replace('Vinho ','')+'</button>';}).join('')+'</div>';
    var L=R.lines[0];html+='<div class="it"><div><div class="nm">'+h(L.it.name)+'</div><div class="meta">1 garrafa a cada 3 pessoas · '+B(99)+' a garrafa</div></div><div class="num">'+L.lancar+' garrafas</div></div>';}
   html+='</section>';return;}
  R.lines.forEach(function(L){var it=L.it;
   var meta=it.plate?'1 prato · para 2 pessoas · '+B(it.price)+' o prato<br>lançar <b class="num">'+L.lancar+'</b> pratos · <span class="num">'+B(L.value)+'</span>':
    N(L.q)+' '+(u(it)==='fatias'&&L.q<=1?'fatia':u(it))+'/pessoa · porção '+(it.dupla?'dupla':it.plabel)+' · '+B(it.price)+'<br>lançar <b class="num">'+L.lancar+'</b> · sai <b class="num">'+L.sai+' '+u(it)+'</b> · <span class="num">'+B(L.value)+'</span>';
   html+='<div class="it"><div><div class="nm">'+h(it.name)+'</div><div class="meta">'+meta+'</div></div><div class="ctl"><button class="step" data-a="q" data-k="'+k+'" data-id="'+it.id+'" data-d="-1">−</button><span class="q num">'+N(L.q)+'</span><button class="step" data-a="q" data-k="'+k+'" data-id="'+it.id+'" data-d="1">+</button></div></div>';});
  html+='<button class="btn ghost add" data-a="inc" data-k="'+k+'">'+(openInc===k?'Fechar lista':'+ Adicionar item (Incluir)')+'</button>';
  if(openInc===k){var have={};(ev.items[k]||[]).forEach(function(x){if(x.q>0)have[x.id]=1;});var g='';html+='<div class="opts">';
   M.forEach(function(it){if(it.row!==k||have[it.id])return;if(it.group!==g){g=it.group;html+='<div class="grp">'+h(g)+'</div>';}
    html+='<button class="opt" data-a="add" data-k="'+k+'" data-id="'+it.id+'"><span>'+h(it.name)+'</span><span>'+optLabel(it)+'</span></button>';});html+='</div>';}
  html+='</section>';});
 $('#app').innerHTML=html;renderBar(r);}
function renderBar(r){var p=r.people,fx=r.perPersonFixed,s='';
 s+='<div class="modes">'+[['330','330'],['350','350'],['outro','Outro'],['pecas','Peças']].map(function(m){return '<button class="btn sm '+(ev.mode===m[0]?'':'ghost')+'" data-a="mode" data-v="'+m[0]+'">'+m[1]+'</button>';}).join('')+'</div>';
 if(ev.mode==='outro')s+='<input id="custom" class="custom" type="number" inputmode="decimal" placeholder="Valor por pessoa" value="'+(ev.custom||'')+'">';
 if(!p)s+='<p class="warn">Coloque o número de pessoas para a conta fechar</p>';
 else{s+='<div class="sum">';
  if(fx!=null){s+='<span>Por pessoa (peças)</span><b class="num">'+B(fx)+'</b>';if(r.extra)s+='<span>Extra prato/vinho/sobremesa</span><b class="num">'+B(r.extra)+'</b>';s+='<span>Peças no cardápio (à parte)</span><span class="num">'+B(r.pieces)+'</span>';}
  else s+='<span>Por pessoa</span><b class="num">'+B(r.perPerson)+'</b><span>Por pessoa com 10%</span><b class="num">'+B(r.perPerson10)+'</b>';
  s+='<span class="big">Total</span><b class="num big">'+B(r.total)+'</b><span class="big">Total com 10%</span><b class="num big">'+B(r.total10)+'</b></div>';}
 s+='<div class="acts"><button class="btn sm ghost" data-a="copy">Copiar</button><button class="btn sm ghost" data-a="pdf">PDF</button></div>';
 $('#bar').innerHTML=s;document.documentElement.style.setProperty('--barh',($('#bar').offsetHeight+16)+'px');}
function setBase(v){ev.base=v;ev.items=v==='semebi'?C.semEbiItems():C.houseItems();}
function edited(){if(ev.base!=='montado')ev.base='montado';}
function onClick(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,k=b.dataset.k,id=b.dataset.id;
 if(a==='pp'){ev.people=Math.max(0,Math.min(999,(ev.people|0)+ +b.dataset.d));}
 else if(a==='base')setBase(b.dataset.v);
 else if(a==='wine')ev.wine.on=!ev.wine.on;
 else if(a==='wt')ev.wine.tipo=b.dataset.v;
 else if(a==='mode')ev.mode=b.dataset.v;
 else if(a==='inc'){openInc=openInc===k?null:k;}
 else if(a==='add'){var it=BY[id];ev.items[k]=(ev.items[k]||[]).filter(function(x){return x.id!==id;});ev.items[k].push({id:id,q:1});openInc=null;edited();}
 else if(a==='q'){var st=BY[id].plate?1:0.5,list=ev.items[k];list.forEach(function(x){if(x.id===id)x.q=Math.max(0,Math.round((x.q+st*b.dataset.d)*2)/2);});
  ev.items[k]=list.filter(function(x){return x.q>0;});edited();}
 else if(a==='copy'){return showCopy();}else if(a==='pdf'){return showSheet();}
 else return;save();render();}
document.addEventListener('click',onClick);
document.addEventListener('change',function(e){var t=e.target;
 if(t.id==='ppl'){var v=parseInt(t.value,10);ev.people=isNaN(v)?0:Math.max(0,Math.min(999,v));save();render();}
 else if(t.id==='custom'){ev.custom=Math.max(0,parseFloat(String(t.value).replace(',','.'))||0);save();render();}
 else if(t.id==='evName'){ev.name=t.value.trim()||'Evento';save();}});
$('#evName').addEventListener('input',function(){ev.name=this.value||'Evento';save();});
/* Texto WhatsApp */
function text(){var r=C.compute(ev,M),o=['*'+ev.name+'* — '+r.people+' pessoas',''];
 C.ROWS.forEach(function(row){var R=r.rows[row[0]];if(!R.lines.length)return;o.push('*'+row[1]+'*');
  R.lines.forEach(function(L){var it=L.it;
   if(L.wine)o.push('• '+it.name+': '+L.lancar+' garrafas · '+B(L.value)+' · '+B(99)+' a garrafa');
   else if(it.plate)o.push('• '+it.name+': '+L.lancar+' pratos · '+B(L.value)+' · 1 prato para 2 pessoas · '+B(it.price)+' o prato');
   else o.push('• '+it.name+': sai '+L.sai+' '+u(it)+' · '+B(L.value)+' · '+N(L.q)+' por pessoa · lançar '+L.lancar+' · '+B(L.unitValue)+(it.unit==='fatias'?' a fatia':' a unidade'));});
  o.push('_Valor '+row[1]+': '+B(R.total)+'_','');});
 o.push('Valor das peças: '+B(r.pieces));if(r.perPersonFixed!=null)o.push('Valor por pessoa: '+B(r.perPersonFixed));
 if(r.extra)o.push('Extra (prato/vinho/sobremesa): '+B(r.extra));
 if(!r.closed)o.push('Coloque o número de pessoas para a conta fechar');else{o.push('*Valor total: '+B(r.total)+'*','*Total com 10%: '+B(r.total10)+'*');}
 return o.join('\n');}
function modal(html){var m=$('#modal');m.innerHTML='<div class="box">'+html+'</div>';m.hidden=false;window.scrollTo(0,0);}
function close(){$('#modal').hidden=true;$('#modal').innerHTML='';}
function copyStr(s,ta){function fb(){ta.focus();ta.select();ta.setSelectionRange(0,s.length);try{document.execCommand('copy');}catch(e){}flash();}
 function flash(){var b=$('#doCopy');if(b)b.textContent='Copiado';}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(flash,fb);else fb();}
function showCopy(){var s=text();modal('<div class="acts noprint"><button class="btn sm ghost" id="mBack">Voltar</button><button class="btn sm" id="doCopy">Copiar</button></div><p></p><textarea id="cpTa" readonly></textarea>');
 $('#cpTa').value=s;$('#mBack').onclick=close;$('#doCopy').onclick=function(){copyStr(s,$('#cpTa'));};}
function sheetLines(){var r=C.compute(ev,M),L=[{t:'Mirai Iguatemi - Ficha do evento',b:1,s:16},{t:ev.name+' · '+r.people+' pessoas · '+new Date().toLocaleDateString('pt-BR'),s:11},{t:' '}];
 C.ROWS.forEach(function(row){var R=r.rows[row[0]];if(!R.lines.length)return;L.push({t:row[1],b:1,s:13});
  R.lines.forEach(function(x){var it=x.it;L.push({t:'  '+it.name+'  |  lançar '+x.lancar+(x.wine?' garrafas':it.plate?' pratos':'')+(x.wine||it.plate?'':'  |  sai '+x.sai+' '+u(it))+'  |  '+B(x.value)});});
  L.push({t:'  Total '+row[1]+': '+B(R.total),b:1},{t:' '});});
 L.push({t:'Peças: '+B(r.pieces)});if(r.perPersonFixed!=null)L.push({t:'Por pessoa: '+B(r.perPersonFixed)});if(r.extra)L.push({t:'Extra: '+B(r.extra)});
 if(r.closed)L.push({t:'Total: '+B(r.total),b:1,s:12},{t:'Total com 10%: '+B(r.total10),b:1,s:14});else L.push({t:'Coloque o número de pessoas para a conta fechar',b:1});return L;}
function showSheet(){var L=sheetLines(),hh=L.map(function(x){return x.b?'<div style="font-weight:700;font-size:'+(x.s||12)+'px">'+h(x.t)+'</div>':'<div>'+h(x.t)+'</div>';}).join('');
 modal('<div class="acts noprint"><button class="btn sm ghost" id="mBack">Voltar</button><button class="btn sm" id="mSave">Salvar</button><button class="btn sm ghost" id="mCopy">Copiar</button></div><p class="noprint"></p><div class="sheet">'+hh+'</div>');
 $('#mBack').onclick=close;$('#mCopy').onclick=showCopy;
 $('#mSave').onclick=function(){makeSheet(function(bytes){var name=(ev.name||'evento').replace(/[^\wÀ-ú -]/g,'').trim()+'.pdf',blob=new Blob([bytes],{type:'application/pdf'});
  var f;try{f=new File([blob],name,{type:'application/pdf'});}catch(e){}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).catch(function(){});return;}
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();});};}
function sheetData(){var r=C.compute(ev,M),ml={'330':'R$ 330 por pessoa','350':'R$ 350 por pessoa','outro':'Outro valor por pessoa','pecas':'Por peças'}[ev.mode]||'';
 var v=[];if(r.perPersonFixed!=null)v.push(['Valor por pessoa',B(r.perPersonFixed)],['Combinado ('+r.people+' x '+B(r.perPersonFixed)+')',B(r.perPersonFixed*r.people)]);
 else v.push(['Peças (entradas + combinado)',r.rows.entradas.lines.concat(r.rows.combinado.lines).some(function(x){return x.value==null;})&&!r.pieces?'Sem preço':B(r.pieces)]);
 ['quentes','sobremesa','vinho'].forEach(function(k){var R=r.rows[k];if(R.lines.length)v.push([R.title,R.lines.every(function(x){return x.value==null;})?'Sem preço':B(R.total)]);});
 if(r.closed)v.push(['Por pessoa com 10%',B(r.perPerson10)]);
 var rows=[];C.ROWS.forEach(function(row){var R=r.rows[row[0]];if(!R.lines.length)return;
  rows.push({title:row[1],items:R.lines.map(function(x){var it=x.it;return {name:it.name,lancar:x.lancar,unit:x.wine?'garrafas':it.plate?'pratos':'',
   sub:(x.wine?x.sai+' garrafas':it.plate?'Sai '+x.sai+' pratos':'Sai '+x.sai+' '+u(it))+'  ·  '+B(x.value)};})});});
 return {name:ev.name||'Evento',date:new Date().toLocaleDateString('pt-BR'),info:r.people+' pessoas  ·  '+ml,vals:v,closed:r.closed,total:B(r.total),total10:B(r.total10),
  warn:'Coloque o número de pessoas para a conta fechar',missing:r.missing,rows:rows};}
var LOGO=null;function loadLogo(){var im=new Image();im.onload=function(){try{var w=642,hh=Math.round(w*im.naturalHeight/im.naturalWidth)||507,c=document.createElement('canvas');c.width=w;c.height=hh;var x=c.getContext('2d');
  x.fillStyle='#05070a';x.fillRect(0,0,w,hh);x.drawImage(im,0,0,w,hh);var s=atob(c.toDataURL('image/jpeg',.92).split(',')[1]),b=new Uint8Array(s.length);
  for(var i=0;i<s.length;i++)b[i]=s.charCodeAt(i);LOGO={bytes:b,w:w,h:hh};}catch(e){}};im.src='logo.svg';}
function makeSheet(cb){cb(MiniPDF.sheet(sheetData(),LOGO));}
loadLogo();
/* Eventos */
function showEvents(){var s='<div class="acts"><button class="btn sm ghost" id="mBack">Voltar</button><button class="btn sm" id="mNew">Novo evento</button></div>';
 evs.forEach(function(e){s+='<div class="ev"><div class="t"><b>'+h(e.name)+'</b><div class="meta" style="color:var(--soft);font-size:13px">'+e.people+' pessoas · '+new Date(e.date).toLocaleString('pt-BR')+'</div></div><button class="btn sm ghost" data-o="'+e.id+'">Abrir</button><button class="btn sm ghost" data-del="'+e.id+'" style="border-color:var(--amber);color:var(--amber)">Apagar</button></div>';});
 modal(s);$('#mBack').onclick=close;$('#mNew').onclick=function(){ev=C.newEvent('Evento '+(evs.length+1));evs.unshift(ev);save();close();render();};
 $('#modal').onclick=function(e){var o=e.target.dataset.o,d=e.target.dataset.del;
  if(o){ev=evs.filter(function(x){return x.id===o;})[0];save();close();render();}
  if(d&&confirm('Apagar este evento? Apagou, não volta.')){evs=evs.filter(function(x){return x.id!==d;});if(!evs.length)evs=[C.newEvent('Evento')];if(ev.id===d)ev=evs[0];save();showEvents();render();}};}
$('#btnEventos').onclick=showEvents;
$('#btnCardapio').onclick=function(){var url='cardapio-mirai.pdf';
 fetch(url,{method:'HEAD'}).then(function(r){if(r.ok)window.open(url,'_blank');else nopdf();}).catch(nopdf);
 function nopdf(){modal('<p>O PDF do cardápio do Mirai ainda não foi colocado no app.</p><button class="btn sm" id="mBack">Voltar</button>');$('#mBack').onclick=close;}};
/* Instalar */
var standalone=window.navigator.standalone||matchMedia('(display-mode: standalone)').matches,ins=$('#install');
if(!standalone){var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);ins.hidden=false;
 ins.innerHTML=ios?'Instalar no iPhone: toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>.':'Instalar no Android: menu do navegador → <b>Instalar app</b>.';
 window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();ins.innerHTML='<button class="btn" id="insBtn" style="width:100%">Instalar app</button>';$('#insBtn').onclick=function(){e.prompt();};});}
render();
if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
})();
