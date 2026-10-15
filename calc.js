/* Lógica de cálculo do Combinado (sem DOM). */
(function(root){
var ROWS=[['entradas','Entradas'],['combinado','Combinado'],['quentes','Pratos quentes'],['sobremesa','Sobremesa'],['vinho','Vinho']];
var WINES=[['branco','Vinho branco'],['tinto','Vinho tinto'],['rose','Vinho rosé']];
var WINE_PRICE=99;
var HOUSE={entradas:[['guioza-de-suino',2],['harumaki-de-queijo',2],['salmao-marinado',3]],
 combinado:[['sake-tamago-trufado',1],['uramaki-ebi-crispy',1],['sashimi',2],['sake-maki-especial',4],['maravilha',2],['bare',2],['salmao-uramaki',2],['hot-roll',2],['hot-porus',2],['gunka-roll-skin',2]],
 quentes:[],sobremesa:[]};
function clone(o){return JSON.parse(JSON.stringify(o));}
function houseItems(){var r={};for(var k in HOUSE)r[k]=HOUSE[k].map(function(a){return {id:a[0],q:a[1]};});return r;}
function semEbiItems(){var r=houseItems();r.combinado=r.combinado.filter(function(x){return x.id!=='uramaki-ebi-crispy'&&x.id!=='maravilha';});
 r.combinado.forEach(function(x){if(x.id==='sake-maki-especial')x.q=6;});return r;}
function newEvent(n){return {id:'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:n||'Novo evento',people:0,base:'casa',
 items:houseItems(),wine:{on:false,tipo:'tinto'},mode:'330',custom:0,date:new Date().toISOString()};}
function line(it,q,people){
 if(it.plate){var plates=Math.ceil(people/2)*q;return {plate:true,lancar:plates,sai:plates,value:it.price==null?null:plates*it.price,needed:plates};}
 var needed=people*q,l=Math.ceil(needed/it.portion-1e-9),sai=l*it.portion;
 return {lancar:l,sai:sai,needed:needed,value:it.price==null?null:sai/it.portion*it.price,unitValue:it.price==null?null:it.price/it.portion};}
function compute(ev,MENU){
 var by={};MENU.forEach(function(m){by[m.id]=m;});var p=ev.people|0,rows={},missing=false;
 ROWS.forEach(function(r){var k=r[0],lines=[],tot=0;
  if(k==='vinho'){if(ev.wine&&ev.wine.on){var b=Math.ceil(p/3);var w=WINES.filter(function(x){return x[0]===ev.wine.tipo;})[0]||WINES[1];
    lines.push({it:{id:'vinho',name:w[1],price:WINE_PRICE,wine:true},q:1,lancar:b,sai:b,value:b*WINE_PRICE,unitValue:WINE_PRICE,wine:true});tot=b*WINE_PRICE;}}
  else (ev.items[k]||[]).forEach(function(x){var it=by[x.id];if(!it||!(x.q>0))return;var L=line(it,x.q,p);L.it=it;L.q=x.q;if(L.value==null)missing=true;else tot+=L.value;lines.push(L);});
  rows[k]={key:k,title:r[1],lines:lines,total:tot};});
 var pieces=rows.entradas.total+rows.combinado.total,extra=rows.quentes.total+rows.sobremesa.total+rows.vinho.total;
 var pp=ev.mode==='330'?330:ev.mode==='350'?350:ev.mode==='outro'?(+ev.custom||0):null;
 var total=pp==null?pieces+extra:pp*p+extra;
 return {people:p,rows:rows,pieces:pieces,extra:extra,perPersonFixed:pp,total:total,total10:total*1.1,
  perPerson:p?total/p:0,perPerson10:p?total*1.1/p:0,closed:p>0,missing:missing};}
function brl(v){if(v==null)return 'Sem preço';return 'R$ '+v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.').replace(/,00$/,'');}
function num(v){return String(Math.round(v*100)/100).replace('.',',');}
var api={ROWS:ROWS,WINES:WINES,WINE_PRICE:WINE_PRICE,houseItems:houseItems,semEbiItems:semEbiItems,newEvent:newEvent,line:line,compute:compute,brl:brl,num:num,clone:clone};
if(typeof module!=='undefined')module.exports=api;else root.Calc=api;
})(this);
