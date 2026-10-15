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
 var b=new Uint8Array(out.length);for(i=0;i<out.length;i++)b[i]=out.charCodeAt(i)&255;return b;}
var api={make:make};if(typeof module!=='undefined')module.exports=api;else root.MiniPDF=api;
})(this);
