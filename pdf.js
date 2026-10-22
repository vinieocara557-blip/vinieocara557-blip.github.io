/* Gerador de PDF de texto simples, offline (Helvetica, WinAnsi). */
(function(root){
function lat(s){return String(s).replace(/[—–]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/×/g,'x').replace(/[^\x20-\xff]/g,'?');}
function esc(s){return lat(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function make(lines){ // lines: [{t, b(bold), s(size)}]
 var pages=[],cur=[],y=800;
 lines.forEach(function(L){var s=L.s||10,h=s+4;if(y-h<40){pages.push(cur);cur=[];y=800;}
  cur.push('BT /'+(L.b?'F2':'F1')+' '+s+' Tf 40 '+y+' Td ('+esc(L.t)+') Tj ET');y-=h;});
 pages.push(cur);
 var objs=[],n=pages.length,kids=[];
 objs[1]='<< /Type /Catalog /Pages 2 0 R >>';
 objs[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
 objs[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
 pages.forEach(function(p,i){var po=5+i*2,co=po+1,c=p.join('\n');kids.push(po+' 0 R');
  objs[po]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+co+' 0 R >>';
  objs[co]='<< /Length '+c.length+' >>\nstream\n'+c+'\nendstream';});
 objs[2]='<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+n+' >>';
 var out='%PDF-1.4\n',off=[];
 for(var i=1;i<objs.length;i++){off[i]=out.length;out+=i+' 0 obj\n'+objs[i]+'\nendobj\n';}
 var x=out.length;out+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';
 for(i=1;i<objs.length;i++)out+=('000000000'+off[i]).slice(-10)+' 00000 n \n';
 out+='trailer\n<< /Size '+objs.length+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF';
 var b=new Uint8Array(out.length);for(i=0;i<out.length;i++)b[i]=out.charCodeAt(i)%256;return b;}

/* Ficha bonita: fundo escuro, valores no topo, pratos em cartões. d: dados, logo: {bytes,w,h} JPEG opcional */
function W(s,z,b){s=lat(s);var w=0;for(var i=0;i<s.length;i++){var c=s.charAt(i);w+=/[0-9]/.test(c)?.556:c===' '?.278:/[il.,:;|!'I]/.test(c)?.26:/[mwMW]/.test(c)?.85:/[A-Z]/.test(c)?.68:.54;}return w*z*(b?1.06:1);}
function col(h){return [1,3,5].map(function(i){return (parseInt(h.substr(i,2),16)/255).toFixed(3);}).join(' ');}
function sheet(d,logo){
 var PW=595,PH=842,M=36,pages=[],o,y;
 function np(){o=[];pages.push(o);o.push(col('#05070a')+' rg 0 0 '+PW+' '+PH+' re f');y=PH-M;}
 function rr(x,yy,w,hh,r,fill,stroke){var k=.5523*r,s=fill?col(fill)+' rg ':'';if(stroke)s+=col(stroke)+' RG 1 w ';
  s+=(x+r)+' '+yy+' m '+(x+w-r)+' '+yy+' l '+(x+w-r+k)+' '+yy+' '+(x+w)+' '+(yy+r-k)+' '+(x+w)+' '+(yy+r)+' c '+(x+w)+' '+(yy+hh-r)+' l '+(x+w)+' '+(yy+hh-r+k)+' '+(x+w-r+k)+' '+(yy+hh)+' '+(x+w-r)+' '+(yy+hh)+' c '+(x+r)+' '+(yy+hh)+' l '+(x+r-k)+' '+(yy+hh)+' '+x+' '+(yy+hh-r+k)+' '+x+' '+(yy+hh-r)+' c '+x+' '+(yy+r)+' l '+x+' '+(yy+r-k)+' '+(x+r-k)+' '+yy+' '+(x+r)+' '+yy+' c h '+(fill&&stroke?'B':fill?'f':'S');o.push(s);}
 function T(t,x,yy,z,b,c,al){var w=W(t,z,b);if(al==='r')x-=w;else if(al==='c')x-=w/2;o.push('BT '+col(c||'#eef6f9')+' rg /'+(b?'F2':'F1')+' '+z+' Tf '+x.toFixed(1)+' '+yy.toFixed(1)+' Td ('+esc(t)+') Tj ET');}
 function need(hh){if(y-hh<M){np();}}
 np();
 // Cabeçalho
 if(logo){var lh=70,lw=lh*logo.w/logo.h;o.push('q '+lw.toFixed(1)+' 0 0 '+lh+' '+((PW-lw)/2).toFixed(1)+' '+(y-lh)+' cm /Im1 Do Q');y-=lh+14;}
 else{T('MIRAI',PW/2,y-30,30,1,'#5ce1ff','c');y-=44;}
 T('FICHA DO EVENTO',PW/2,y-10,9,1,'#5ce1ff','c');y-=26;
 // Valores
 var vals=d.vals,bh=64+vals.length*17+(d.closed?58:30);rr(M,y-bh,PW-2*M,bh,12,'#0d141b','#1f3a46');
 var x0=M+18,x1=PW-M-18,yy=y-28;T(d.name,x0,yy,17,1);T(d.date,x1,yy,10,0,'#8aa3ad','r');yy-=18;
 T(d.info,x0,yy,10.5,0,'#8aa3ad');yy-=12;o.push(col('#1f3a46')+' RG .7 w '+x0+' '+yy+' m '+x1+' '+yy+' l S');yy-=18;
 vals.forEach(function(v){T(v[0],x0,yy,10.5,0,'#c9d6db');T(v[1],x1,yy,10.5,1,v[1]==='Sem preço'?'#f5b041':'#eef6f9','r');yy-=17;});
 if(d.closed){yy-=4;rr(x0-6,yy-34,x1-x0+12,44,8,'#0f2a33');T('Total',x0+4,yy-4,11,0,'#c9d6db');T(d.total,x1-4,yy-4,11,1,'#eef6f9','r');
  T('Total com 10%',x0+4,yy-25,13,1,'#5ce1ff');T(d.total10,x1-4,yy-26,16,1,'#5ce1ff','r');}
 else T(d.warn,x0,yy-4,11,1,'#f5b041');
 if(d.missing)T('* Itens sem preço não entram na soma.',x0,y-bh+8,8,0,'#8aa3ad');
 y-=bh+26;
 // Pratos
 d.rows.forEach(function(R){need(30+52);T(R.title.toUpperCase(),M,y-12,11,1,'#5ce1ff');var tw=W(R.title.toUpperCase(),11,1)+10;
  o.push(col('#1f3a46')+' RG .7 w '+(M+tw)+' '+(y-8)+' m '+(PW-M)+' '+(y-8)+' l S');y-=26;
  R.items.forEach(function(it){var ch=46;need(ch+8);var cy=y-ch;rr(M,cy,PW-2*M,ch,9,'#0f1720','#18262f');
   rr(M,cy,4,ch,2,'#5ce1ff');
   T(it.name,M+16,cy+27,12.5,1);T(it.sub,M+16,cy+11,9,0,'#8aa3ad');
   var bw=Math.max(70,W(String(it.lancar),20,1)+W(it.unit,8,0)+30),bx=PW-M-10-bw;rr(bx,cy+7,bw,ch-14,7,'#5ce1ff');
   T('LANÇAR',bx+bw/2,cy+ch-17,6.5,1,'#05070a','c');T(String(it.lancar)+(it.unit?'':''),bx+bw/2-(it.unit?W(it.unit,8,0)/2+2:0),cy+11,17,1,'#05070a','c');
   if(it.unit)T(it.unit,bx+bw/2+W(String(it.lancar),17,1)/2-W(it.unit,8,0)/2+1,cy+11,8,0,'#05070a');
   y-=ch+7;});
  y-=14;});
 pages.forEach(function(p,i){p.push('BT '+col('#5b707a')+' rg /F1 7.5 Tf '+M+' 20 Td ('+esc('Mirai Iguatemi · Combinado')+') Tj ET');
  var t='Página '+(i+1)+' de '+pages.length;p.push('BT '+col('#5b707a')+' rg /F1 7.5 Tf '+(PW-M-W(t,7.5)).toFixed(1)+' 20 Td ('+esc(t)+') Tj ET');});
 return build(pages,logo);}
function build(pages,logo){
 var objs=[],kids=[],n=pages.length,img=logo?5:0,base=logo?6:5;
 objs[1]='<< /Type /Catalog /Pages 2 0 R >>';
 objs[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
 objs[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
 var bin='';for(var j=0;logo&&j<logo.bytes.length;j++)bin+=String.fromCharCode(logo.bytes[j]);
 if(logo)objs[5]='<< /Type /XObject /Subtype /Image /Width '+logo.w+' /Height '+logo.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+bin.length+' >>\nstream\n'+bin+'\nendstream';
 pages.forEach(function(p,i){var po=base+i*2,co=po+1,c=p.join('\n');kids.push(po+' 0 R');
  objs[po]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>'+(logo?' /XObject << /Im1 5 0 R >>':'')+' >> /Contents '+co+' 0 R >>';
  objs[co]='<< /Length '+c.length+' >>\nstream\n'+c+'\nendstream';});
 objs[2]='<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+n+' >>';
 var out='%PDF-1.4\n',off=[];
 for(var i=1;i<objs.length;i++){off[i]=out.length;out+=i+' 0 obj\n'+objs[i]+'\nendobj\n';}
 var x=out.length;out+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';
 for(i=1;i<objs.length;i++)out+=('000000000'+off[i]).slice(-10)+' 00000 n \n';
 out+='trailer\n<< /Size '+objs.length+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF';
 var b=new Uint8Array(out.length);for(i=0;i<out.length;i++)b[i]=out.charCodeAt(i)%256;return b;}
var api={make:make,sheet:sheet};if(typeof module!=='undefined')module.exports=api;else root.MiniPDF=api;
})(this);
