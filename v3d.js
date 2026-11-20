(function(){
"use strict";
var C={green:[71,115,79],grey:[198,200,198],blue:[61,115,168],dblue:[44,92,140],sand:[201,167,90],base:[178,174,164],panel:[214,212,204],dark:[58,62,66],pipe:[226,224,218],white:[236,234,228],orange:[205,120,40],pvc:[200,140,90]};
function V(x,y,z){return[x,y,z]}
function M(){this.f=[];this.o=0;this.circ=[];this.tk=[];this.tr={P:[],N:[],C:[],M:[]};}
/* peças reais extraídas do projeto Revit da SANEAR (escada com guarda-corpo, acesso superior, filtro de biogás, casa de máquinas, tampa do preliminar) */
var PECAS=null;
M.prototype.tpl=function(k,x,y0,z,ang,sx,sy,sz,col,id){var T=PECAS&&PECAS[k];if(!T)return false;y0+=this.oy||0;var ca=Math.cos(ang),sa=Math.sin(ang),tr=this.tr,p=T.p,n=T.n,c=T.c;
 for(var t=0;t<c.length;t++){var cc=c[t],rgb=cc[4]?[col[0]/255,col[1]/255,col[2]/255]:[cc[0],cc[1],cc[2]];
  for(var j=0;j<3;j++){var i=(t*3+j)*3,lx=p[i]*sx,ly=p[i+1]*sy,lz=p[i+2]*sz,nx=n[i]/sx,ny=n[i+1]/sy,nz=n[i+2]/sz,nl=Math.hypot(nx,ny,nz)||1;
   tr.P.push(x+lx*ca-lz*sa,y0+ly,z+lx*sa+lz*ca);tr.N.push((nx*ca-nz*sa)/nl,ny/nl,(nx*sa+nz*ca)/nl);tr.C.push(rgb[0],rgb[1],rgb[2]);tr.M.push(cc[3],id);}}return true;};
/* tanque como no projeto: corpo liso em PRFV, tampa de acesso 0,60 m e escada com guarda-corpo do Revit */
M.prototype.stank=function(x,z,r,h,c,id,ladAng){var o=this.oy||0;this.cyl(x,0,z,r,h,c,id,Math.max(36,Math.round(r*40)));if(!o)this.circ.push([x,z,r]);if(r>=.45&&!this.nologo){if(!o)this.tk.push([x,z,r,h]);else{var cc=o+h*(h<3.5?.47:.56),ww=cc/.56>=3.5?cc/.56:Math.min(cc/.47,3.49);this.tk.push([x,z,r,ww]);}}
 var a=ladAng===undefined?-.55:ladAng;
 if(!this.tpl("lid",x+Math.cos(a)*r*.5,h,z+Math.sin(a)*r*.5,a-Math.PI,1,1,1,c,id))this.cyl(x+Math.cos(a)*r*.5,h,z+Math.sin(a)*r*.5,.34,.12,C.lid,id,24);
 if(ladAng!==undefined){this.oy=0;var lt=PECAS&&PECAS.ladder;if(lt){var dx=r-lt.r0;this.tpl("ladder",x+Math.cos(a)*dx,0,z+Math.sin(a)*dx,a-Math.PI,1,(o+h+1.08)/(lt.h0+1.08),1,c,id);}else this.cage(x+(r+.12)*Math.cos(a),z+(r+.12)*Math.sin(a),o+h,a,C.ladder,id);this.oy=o;}};
M.prototype.face=function(p,c,id,two,ns){this.f.push({p:p,c:c,id:id,two:!!two,o:this.o,ns:ns});};
M.prototype.box=function(x,y,z,w,h,d,c,id){this.o++;y+=this.oy||0;if(y<=.05&&y>-.01&&id>-2&&Math.min(w,d)>.5&&h>.3)this.circ.push([x,z,Math.min(w,d)*.5]);var a=x-w/2,b=x+w/2,e=z-d/2,g=z+d/2,t=y+h;
 var P=[V(a,y,e),V(b,y,e),V(b,y,g),V(a,y,g),V(a,t,e),V(b,t,e),V(b,t,g),V(a,t,g)];
 var F=[[0,1,2,3],[7,6,5,4],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
 for(var i=0;i<6;i++)this.face(F[i].map(function(k){return P[k]}),c,id);};
M.prototype.cyl=function(x,y,z,r,h,c,id,n,top){this.o++;y+=this.oy||0;if(y<=.3&&r>.2)this.circ.push([x,z,r]);n=n||(r>.5?44:24);var lo=[],hi=[];
 for(var i=0;i<n;i++){var a=i/n*Math.PI*2;lo.push(V(x+r*Math.cos(a),y,z+r*Math.sin(a)));hi.push(V(x+r*Math.cos(a),y+h,z+r*Math.sin(a)));}
 for(i=0;i<n;i++){var j=(i+1)%n,ai=i/n*Math.PI*2,aj=j/n*Math.PI*2;this.face([lo[i],hi[i],hi[j],lo[j]],c,id,false,[[Math.cos(ai),0,Math.sin(ai)],[Math.cos(aj),0,Math.sin(aj)]]);}
 this.face(hi.slice().reverse(),top||c,id);this.face(lo.slice(),c,id);};
M.prototype.hcyl=function(x,y,z,r,len,c,id,n){this.o++;n=n||40;var A=[],B=[];
 for(var i=0;i<n;i++){var a=i/n*Math.PI*2;A.push(V(x-len/2,y+r+r*Math.sin(a),z+r*Math.cos(a)));B.push(V(x+len/2,y+r+r*Math.sin(a),z+r*Math.cos(a)));}
 for(i=0;i<n;i++){var j=(i+1)%n,ai=i/n*Math.PI*2,aj=j/n*Math.PI*2;this.face([A[i],A[j],B[j],B[i]],c,id,false,[[0,Math.sin(ai),Math.cos(ai)],[0,Math.sin(aj),Math.cos(aj)]]);}
 this.face(A.slice(),c,id,true);this.face(B.slice().reverse(),c,id,true);};
M.prototype.ladder=function(x,z,h,c,id,dir){var w=.45;var ox=dir==="z"?0:w/2,oz=dir==="z"?w/2:0;
 this.box(x-ox,0,z-oz,.06,h,.06,c,id);this.box(x+ox,0,z+oz,.06,h,.06,c,id);
 for(var y=.35;y<h;y+=.35)this.box(x,y,z,dir==="z"?.06:w,.04,dir==="z"?w:.06,c,id);};
M.prototype.rail=function(x,z,r,y,c,id){var n=16;for(var i=0;i<n;i++){var a=i/n*Math.PI*2,a2=(i+1)/n*Math.PI*2;
 var p=V(x+r*Math.cos(a),y,z+r*Math.sin(a));this.box(p[0],y,p[2],.04,.9,.04,c,id);
 var q=V(x+r*Math.cos(a2),y,z+r*Math.sin(a2));this.pipe([p[0],y+.9,p[2]],[q[0],y+.9,q[2]],c,id);}};

C.ladder=[219,204,107];C.air=[112,77,51];C.metal=[158,163,160];C.plaster=[204,201,191];C.conc=[168,166,158];C.grass=[78,96,58];C.lid=[110,114,116];C.raw=[205,175,105];
C.gravel=[156,150,140];C.beige=[214,192,150];C.cream=[238,234,220];C.fence=[132,138,142];C.slab=[184,182,174];C.gas=[214,186,64];

/* ---- primitivas finas e arredondadas (tubos, anéis) para aparência de projeto ---- */
M.prototype.tube=function(a,b,r,c,id,n,caps){this.o++;if(this.oy){a=[a[0],a[1]+this.oy,a[2]];b=[b[0],b[1]+this.oy,b[2]];}n=n||10;var d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],L=Math.hypot(d[0],d[1],d[2])||1e-4;d=[d[0]/L,d[1]/L,d[2]/L];
 var t=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];var u=[d[1]*t[2]-d[2]*t[1],d[2]*t[0]-d[0]*t[2],d[0]*t[1]-d[1]*t[0]],ul=Math.hypot(u[0],u[1],u[2]);u=[u[0]/ul,u[1]/ul,u[2]/ul];
 var w=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];var A=[],B=[],N=[];
 for(var i=0;i<n;i++){var g=i/n*Math.PI*2,cs=Math.cos(g),sn=Math.sin(g),nn=[u[0]*cs+w[0]*sn,u[1]*cs+w[1]*sn,u[2]*cs+w[2]*sn];N.push(nn);
  A.push([a[0]+nn[0]*r,a[1]+nn[1]*r,a[2]+nn[2]*r]);B.push([b[0]+nn[0]*r,b[1]+nn[1]*r,b[2]+nn[2]*r]);}
 for(i=0;i<n;i++){var j=(i+1)%n;this.face([A[i],B[i],B[j],A[j]],c,id,true,[N[i],N[j]]);}
 if(caps!==false){this.face(A.slice(),c,id,true);this.face(B.slice().reverse(),c,id,true);}};
M.prototype.ring=function(x,y,z,R,r,c,id,a0,a1,seg){seg=seg||28;a0=a0||0;a1=a1===undefined?Math.PI*2:a1;var prev=null;
 for(var i=0;i<=seg;i++){var g=a0+(a1-a0)*i/seg,p=[x+R*Math.cos(g),y,z+R*Math.sin(g)];if(prev)this.tube(prev,p,r,c,id,6,false);prev=p;}};
M.prototype.pipe=function(a,b,c,id){this.tube(a,b,.055,c||C.pipe,id,12);};
/* tubulação com curvas de 90° e luvas nas emendas, como numa instalação real em PVC */
M.prototype.run=function(pts,c,id,r){r=r||.055;c=c||C.pipe;for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1];if(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])<.01)continue;this.tube(a,b,r,c,id,12,false);}
 for(i=1;i<pts.length-1;i++){var p=pts[i];this.cyl(p[0],p[1]-r*1.35,p[2],r*1.35,r*2.7,c,id,12);}
 for(i=0;i<pts.length-1;i++){a=pts[i];b=pts[i+1];var L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(L<2.2)continue;var k=Math.floor(L/2);for(var s=1;s<=k;s++){var t=s/(k+1),m=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],dx=(b[0]-a[0])/L,dy=(b[1]-a[1])/L,dz=(b[2]-a[2])/L;
  this.tube([m[0]-dx*.07,m[1]-dy*.07,m[2]-dz*.07],[m[0]+dx*.07,m[1]+dy*.07,m[2]+dz*.07],r*1.25,c,id,12);}}};
M.prototype.cage=function(x,z,h,ang,c,id){/* escada marinheiro em PRFV com gaiola de proteção */
 var ux=Math.cos(ang),uz=Math.sin(ang),px=-uz,pz=ux,w=.22,top=h+1.0;
 this.tube([x+px*w,0,z+pz*w],[x+px*w,top,z+pz*w],.028,c,id,8);this.tube([x-px*w,0,z-pz*w],[x-px*w,top,z-pz*w],.028,c,id,8);
 for(var y=.3;y<h+.05;y+=.3)this.tube([x-px*w,y,z-pz*w],[x+px*w,y,z+pz*w],.017,c,id,6);
 var R=.36,cx=x+ux*(R-.05),cz=z+uz*(R-.05),a0=Math.atan2(uz,ux),ang0=a0-Math.PI*.62,ang1=a0+Math.PI*.62;
 for(var hy=2.2;hy<=top+.01;hy+=.62){this.ring(cx,hy,cz,R,.02,c,id,ang0,ang1,12);}
 for(var k=0;k<5;k++){var g=ang0+(ang1-ang0)*k/4;this.tube([cx+R*Math.cos(g),2.2,cz+R*Math.sin(g)],[cx+R*Math.cos(g),top,cz+R*Math.sin(g)],.015,c,id,6);}};
M.prototype.vtank=function(x,z,r,h,c,id,ladAng){/* tanque vertical SANEAR em PRFV: aba de reforço, boca de inspeção flangeada com parafusos, bocais em PVC */
 this.cyl(x,0,z,r,h,c,id,Math.max(36,Math.round(r*40)));if(r>=.45)this.tk.push([x,z,r,h]);
 this.ring(x,h-.02,z,r+.012,.03,c,id,0,Math.PI*2,48);this.ring(x,.06,z,r+.02,.05,c,id,0,Math.PI*2,48);
 if(r<.45){/* tanque pequeno (ex.: filtro de biogás): tampa flangeada e bocais no topo */
  this.cyl(x,h,z,r*.75,.05,C.lid,id,20);for(var bb=0;bb<6;bb++){var gg=bb/6*Math.PI*2;this.cyl(x+r*.62*Math.cos(gg),h+.05,z+r*.62*Math.sin(gg),.014,.025,C.dark,id,6);}
  this.tube([x,h+.05,z],[x,h+.32,z],.035,C.pipe,id,10);return;}
 this.cyl(x,h,z,r*.98,.05,c,id,Math.max(36,Math.round(r*40)));var mx=x+r*.42;this.cyl(mx,h+.05,z,.34,.1,c,id,24);this.cyl(mx,h+.15,z,.3,.03,[51,54,54],id,24);
 this.tube([x-r*.45,h,z+r*.2],[x-r*.45,h+.35,z+r*.2],.05,C.pipe,id,10);this.tube([x-r*.45,h+.35,z+r*.2],[x-r*.45+.18,h+.35,z+r*.2],.05,C.pipe,id,10);
 this.tube([x,h*.82,z+r-.02],[x,h*.82,z+r+.22],.055,C.pipe,id,12);
 this.tube([x+r-.02,.35,z],[x+r+.22,.35,z],.055,C.pipe,id,12);
 this.tube([x+r+.15,.35,z],[x+r+.19,.35,z],.11,C.pvc,id,14);this.tube([x,h*.82,z+r+.15],[x,h*.82,z+r+.19],.11,C.pvc,id,14);
 if(ladAng!==undefined)this.cage(x+(r+.12)*Math.cos(ladAng),z+(r+.12)*Math.sin(ladAng),h,ladAng,C.ladder,id);};

M.prototype.tower=function(x,z,L,h,c,id,cb,sp){/* torre de aeração como no projeto da ETA SANEAR: base de concreto, estrutura metálica azul com contraventamento em X, bandeja coletora larga no topo da estrutura, bandejas de aeração empilhadas, distribuidor e escada com gaiola */
 var self=this,B=cb||h*.4,bz=.35,S=L*.5,BL=C.blue,nt=5,st=sp||.5;
 this.box(x,0,z,L+.6,bz,L+.6,C.conc,id);
 [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(o){self.tube([x+o[0]*S,bz,z+o[1]*S],[x+o[0]*S,B,z+o[1]*S],.055,BL,id,12);self.box(x+o[0]*S,bz,z+o[1]*S,.22,.02,.22,BL,id);});
 var np=Math.max(2,Math.round((B-bz)/1.3)),ph=(B-bz)/np;
 var faces=[[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[1,1],[-1,1]],[[-1,1],[-1,-1]]];
 for(var i=0;i<=np;i++){var y=bz+i*ph;faces.forEach(function(f){self.tube([x+f[0][0]*S,y,z+f[0][1]*S],[x+f[1][0]*S,y,z+f[1][1]*S],.035,BL,id,8);});
  if(i<np){var y2=y+ph;faces.forEach(function(f){self.tube([x+f[0][0]*S,y,z+f[0][1]*S],[x+f[1][0]*S,y2,z+f[1][1]*S],.028,BL,id,8);self.tube([x+f[1][0]*S,y,z+f[1][1]*S],[x+f[0][0]*S,y2,z+f[0][1]*S],.028,BL,id,8);});}}
 /* bandeja coletora: mais larga que as bandejas, com bordas altas; a água sai dela por gravidade para os filtros */
 var CL=L*1.3,rh=.3;this.box(x,B,z,CL,.06,CL,BL,id);
 [[0,-1],[0,1]].forEach(function(o){self.box(x,B+.06,z+o[1]*CL/2,CL,rh,.04,BL,id);});[[-1,0],[1,0]].forEach(function(o){self.box(x+o[0]*CL/2,B+.06,z,.04,rh,CL,BL,id);});
 /* bandejas de aeração, espaçadas sp, apoiadas em montantes nos cantos */
 var top=B+nt*st;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(o){self.tube([x+o[0]*L*.48,B+.06,z+o[1]*L*.48],[x+o[0]*L*.48,top+.2,z+o[1]*L*.48],.025,BL,id,8);});
 for(var t=1;t<=nt;t++){var y=B+t*st,TL=t===nt?L:L*.96;this.box(x,y,z,TL,.04,TL,BL,id);
  this.box(x,y+.04,z-TL/2,TL,.16,.03,BL,id);this.box(x,y+.04,z+TL/2,TL,.16,.03,BL,id);this.box(x-TL/2,y+.04,z,.03,.16,TL,BL,id);this.box(x+TL/2,y+.04,z,.03,.16,TL,BL,id);
  for(var g=0;g<5;g++)for(var k=0;k<5;k++)this.cyl(x-TL*.4+g*TL*.2,y+.041,z-TL*.4+k*TL*.2,.03,.004,C.dblue,id,6);}
 /* recalque do poço: tubo bege subindo pela lateral da torre e descendo no centro da bandeja do topo */
 var px=x-S-.12,yt=top+.55;this.run([[px,0,z+S*.4],[px,yt,z+S*.4],[x,yt,z+S*.4],[x,yt,z],[x,top+.22,z]],C.beige,id,.045);
 /* escada marinheiro com gaiola até a bandeja do topo */
 this.cage(x,z+S+.06,top-.95,Math.PI/2,C.ladder,id);};
M.prototype.parshall=function(cx,cz,un,c,id){/* caixa de areia + calha Parshall em PRFV sobre plataforma de concreto: a água chega pelo início do canal e sai no fim da calha para o floculador, por gravidade */
 var self=this,B=un.b||0,L=un.d,W=un.wz,h=un.h,x0=cx-L/2,t=.05,bca=un.bca||.4,lca=un.lca||1.5,lp=L-lca-.4,wt=Math.max(.1,(un.pw||1)*.0254+.06),CO=C.conc;
 if(B>0){var nx=Math.max(2,Math.ceil(L/2.2)+1);for(var i=0;i<nx;i++){var xx=x0+.15+(L-.3)*i/(nx-1);[-1,1].forEach(function(s){self.box(xx,0,cz+s*(W/2-.15),.25,B-.15,.25,CO,id);});}
  this.box(cx,B-.15,cz,L,.15,W,CO,id);
  this.cage(x0+L*.5,cz+W/2+.08,B,Math.PI/2,C.ladder,id);
  /* guarda-corpo da plataforma */
  [-1,1].forEach(function(s){self.tube([x0,B+1.0,cz+s*(W/2-.03)],[x0+L,B+1.0,cz+s*(W/2-.03)],.022,C.ladder,id,8);for(var k=0;k<=Math.round(L/1.2);k++){var xx=x0+L*k/Math.round(L/1.2);self.tube([xx,B,cz+s*(W/2-.03)],[xx,B+1.0,cz+s*(W/2-.03)],.02,C.ladder,id,8);}});}
 this.oy=B;
 function seg(xa,xb,w,fl){var xm=(xa+xb)/2,lx=xb-xa;self.box(xm,fl,cz,lx,t,w+2*t,c,id);self.box(xm,fl,cz-w/2-t/2,lx,h-fl,t,c,id);self.box(xm,fl,cz+w/2+t/2,lx,h-fl,t,c,id);}
 var xa=x0+.2;seg(xa,xa+lca,bca,0);this.box(xa-t/2,0,cz,t,h,bca+2*t,c,id);
 /* calha Parshall: convergente, garganta (com degrau) e divergente */
 var x1=xa+lca,lc=lp*.45,lg=lp*.2,ld=lp*.35,N=5;
 for(var i=0;i<N;i++){var w=bca+(wt-bca)*(i+.5)/N;seg(x1+lc*i/N,x1+lc*(i+1)/N,w,0);}
 seg(x1+lc,x1+lc+lg,wt,-.0);this.box(x1+lc+lg*.5,0,cz,.04,.06,wt,C.dblue,id);
 for(var i=0;i<N;i++){var w=wt+(bca*.8-wt)*(i+.5)/N;seg(x1+lc+lg+ld*i/N,x1+lc+lg+ld*(i+1)/N,w,0);}
 /* dosagem de coagulante e de correção de pH no ressalto da calha */
 var xd=x1+lc+lg*.5;[-1,1].forEach(function(s){self.tube([xd+s*.08,h+.6,cz+s*.25],[xd+s*.08,h+.25,cz+s*.25],.018,C.dark,id,8);self.tube([xd+s*.08,h+.25,cz+s*.25],[xd+s*.08,h+.25,cz],.018,C.dark,id,8);self.tube([xd+s*.08,h+.25,cz],[xd+s*.08,h*.55,cz],.012,C.dark,id,6);});
 this.oy=0;
 /* chegada da água bruta: tubo bege subindo até o início do canal */
 this.run([[x0-.25,0,cz],[x0-.25,B+h-.12,cz],[x0+.3,B+h-.12,cz]],C.beige,id,.05);};
M.prototype.htank=function(x,z,r,len,c,id){/* tanque horizontal SANEAR: boca de visita flangeada no topo, bocal flangeado lateral */
 this.box(x-len*.35,0,z,.3,.25,r*1.6,C.conc,-1);this.box(x+len*.35,0,z,.3,.25,r*1.6,C.conc,-1);
 this.hcyl(x,.25,z,r,len,c,id);
 this.cyl(x-len*.28,.25+2*r-.05,z,.38,.32,c,id,18);this.cyl(x-len*.28,.25+2*r+.27,z,.46,.07,c,id,18);
 this.cyl(x+len*.32,.25+2*r-.05,z,.09,.25,C.raw,id,10);
 this.box(x+len*.28,.25+r*.55,z+r-.02,.42,.42,.3,c,id);this.box(x+len*.28,.25+r*.55,z+r+.14,.5,.5,.05,C.raw,id);};
/* tanque horizontal compartimentado da Linha Compacta SANEAR: berços em PRFV sobre base de concreto, divisórias marcadas, uma boca de inspeção por compartimento */
M.prototype.hcomp=function(x,z,un,c,id){var r=un.d/2,len=un.len,yb=un.yb,x0=x-len/2,x1=x+len/2,self=this,Y=C.ladder;
 /* berços em PRFV (selas) sobre a base de concreto; o tanque também pode ser enterrado */
 var b0=un.bur?yb-.2:0,nb=len>3.2?3:2;for(var i=0;i<nb;i++){var bx=x0+.5+(len-1)*i/(nb-1);this.box(bx,b0,z,.34,.12,un.d*.95,c,id);this.box(bx,b0+.12,z,.2,yb-b0-.12+r*.55,un.d*.8,c,id);}
 this.hcyl(x,yb,z,r,len,c,id,Math.max(40,Math.round(r*44)));
 function vring(px,rr,col){var prev=null;for(var k=0;k<=36;k++){var a=k/36*Math.PI*2,p=[px,yb+r+(r+.012)*Math.sin(a),z+(r+.012)*Math.cos(a)];if(prev)self.tube(prev,p,rr,col,id,6,false);prev=p;}}
 if(un.bur){/* enterrado: chaminés de inspeção em PRFV até o nível do terreno, com tampas */
  var ac=x0;un.comp.forEach(function(cp,k){var mid=ac+cp[1]/2;if(k)vring(ac,.03,C.raw);var lr=Math.min(.3,cp[1]*.28),y0=yb+2*r-.08;
   this.cyl(mid,y0,z,lr,-y0+.12,c,id,20);this.cyl(mid,.12,z,lr+.06,.05,C.lid,id,20);this.box(mid,-.02,z,2*lr+.5,.1,2*lr+.5,C.conc,id);
   if(/Desinf/.test(cp[0]))this.cyl(mid,.17,z,.08,.3,C.cream,id,12);ac+=cp[1];},this);
  var yi0=yb+2*r-.3,yo0=yb+2*r-.45;this.run([[x0-1.0,yi0,z],[x0+.02,yi0,z]],C.pipe,id,.055);this.run([[x1-.02,yo0,z],[x1+1.0,yo0,z]],C.pipe,id,.055);
  this.tk.push([x,z,r,(yb+r)/.47]);return;}
 /* plataforma de inspeção em cima do tanque, com guarda-corpo e escada amarelos */
 var yd=yb+2*r+.02,W=Math.max(1.1,Math.min(1.5,un.d*.75)),zl=z+W/2;
 this.box(x,yd,z,len+.1,.05,W,C.metal,id);
 var acc=x0;un.comp.forEach(function(cp,k){var mid=acc+cp[1]/2;if(k)vring(acc,.03,C.raw);
  var lr=Math.min(.3,cp[1]*.28);this.cyl(mid,yd-.1,z-W*.12,lr,.28,c,id,20);this.cyl(mid,yd+.18,z-W*.12,lr+.05,.05,C.lid,id,20);/* boca de inspeção de cada compartimento */
  if(/Desinf/.test(cp[0]))this.cyl(mid,yd+.05,z+W*.25,.08,.4,C.cream,id,12);/* clorador de pastilhas */
  acc+=cp[1];},this);
 /* escada fora do tanque, junto ao tampo de saída; a plataforma avança até ela */
 var LD=.55,zs=z-Math.min(W/2-.25,.35),yt=yd+1.05,ym=yd+.55,xa=x0-.05,xb=x1+LD,za=z-W/2,zb=z+W/2,lx=x1+.32,gap=.32;
 this.box(x1+(LD+.05)/2,yd,z,LD+.05,.05,W,C.metal,id);
 function post(px,pz){self.tube([px,yd,pz],[px,yt,pz],.025,Y,id,8);}
 function rail(a,b){self.tube([a[0],yt,a[1]],[b[0],yt,b[1]],.022,Y,id,8,false);self.tube([a[0],ym,a[1]],[b[0],ym,b[1]],.016,Y,id,6,false);self.tube([a[0],yd+.08,a[1]],[b[0],yd+.08,b[1]],.012,Y,id,6,false);}
 var np=Math.max(2,Math.ceil((xb-xa)/1.2));for(var k=0;k<=np;k++){var px=xa+(xb-xa)*k/np;post(px,za);post(px,zb);}
 post(xa,z);post(xb,zs-gap);post(xb,zs+gap);
 rail([xa,za],[xb,za]);rail([xa,zb],[xb,zb]);rail([xa,za],[xa,zb]);rail([xb,za],[xb,zs-gap]);rail([xb,zs+gap],[xb,zb]);
 this.cage(xb+.14,zs,yd,0,Y,id);/* escada marinheiro com gaiola, por fora do tanque, na altura da plataforma */
 var yi=yb+2*r-.3,yo=yb+2*r-.45;
 this.run([[x0-1.0,-.05,z],[x0-1.0,yi,z],[x0+.02,yi,z]],C.pipe,id,.055);/* entrada do esgoto */
 var zp=z+Math.min(r*.55,.6);this.run([[x1-.02,yo,zp],[x1+1.25,yo,zp],[x1+1.25,-.05,zp]],C.pipe,id,.055);/* saída para drenagem ou vala de infiltração */
 this.tk.push([x,z,r,(yb+r)/.47]);};
M.prototype.rtank=function(x,z,w,h,d,c,id){/* tanque retangular SANEAR com aba superior e nervuras */
 this.box(x,0,z,w,h,d,c,id);this.box(x,h-.08,z,w+.24,.08,d+.24,c,id);
 for(var y=h*.3;y<h-.2;y+=h*.3)this.box(x,y,z,w+.08,.07,d+.08,c,id);};
M.prototype.house=function(x,z,w,h,d,id){this.box(x,0,z,w,h,d,C.plaster,id);this.box(x,h,z,w+.16,.1,d+.16,C.plaster,id);
 this.box(x-w*.18,0,z+d/2+.005,w*.46,h*.82,.03,C.conc,id);this.box(x-w*.18,.05,z+d/2+.02,w*.4,h*.76,.02,[92,98,100],id);for(var k=0;k<6;k++)this.box(x-w*.18,h*.3+k*.12,z+d/2+.035,w*.32,.025,.01,[70,74,76],id);
 this.box(x+w*.3,h*.42,z+d/2+.03,.42,.56,.06,C.panel,id);this.box(x+w*.3,h*.78,z+d/2+.065,.05,.05,.02,C.orange,id);this.tube([x+w*.3,h*.42,z+d/2+.04],[x+w*.3,.05,z+d/2+.04],.025,[60,60,60],id,6);};
/* alambrado de proteção em volta da área da estação, com portão */
M.prototype.fence=function(W,D,cx,cz){var x0=cx-W/2,x1=cx+W/2,z0=cz-D/2,z1=cz+D/2,c=C.fence,h=1.8,self=this,gate=[-1.1,1.1];
 function side(a,b,isFront){var L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/2.5));
  for(var i=0;i<=n;i++){var t=i/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;self.tube([x,0,z],[x,h,z],.035,c,-1,8);}
  [h-.02,h*.55,.12].forEach(function(y){if(isFront){var gx0=cx+gate[0],gx1=cx+gate[1];self.tube([a[0],y,a[1]],[gx0,y,a[1]],.012,c,-1,5,false);self.tube([gx1,y,a[1]],[b[0],y,b[1]],.012,c,-1,5,false);}else self.tube([a[0],y,a[1]],[b[0],y,b[1]],.012,c,-1,5,false);});
  /* malha: fios verticais finos */
  var m=Math.round(L/.35);for(i=0;i<m;i++){t=(i+.5)/m;x=a[0]+(b[0]-a[0])*t;z=a[1]+(b[1]-a[1])*t;if(isFront&&x>cx+gate[0]&&x<cx+gate[1])continue;self.tube([x,.12,z],[x,h-.02,z],.006,c,-1,4,false);}}
 side([x0,z1],[x1,z1],true);side([x1,z1],[x1,z0]);side([x1,z0],[x0,z0]);side([x0,z0],[x0,z1]);
 [cx+gate[0],cx+gate[1]].forEach(function(gx){self.tube([gx,0,z1],[gx,h+.1,z1],.05,c,-1,10);});};

function eteV(){/* baseado em projeto as built da SANEAR (tratamento preliminar, elevatória, UASB, FAS, DS, TD e casa de máquinas) */
 var m=new M(),u=[],G=C.green,Z=.7;
 m.box(0,-.05,-.3,320,.05,320,C.grass,-2);m.box(-.1,0,-.3,10.2,.08,5,C.conc,-2);
 m.box(-.1,0,2.25,10.2,1.4,.15,C.conc,-3);m.box(-5.2,0,-.3,.15,1.4,5,C.conc,-3);
 u.push({id:0,n:"Tratamento preliminar",t:"Caixas em concreto com grade, caixa de areia e medidor de vazão: retêm sólidos grosseiros e areia antes do tratamento biológico (ABNT NBR 12209).",at:[-3,1.2,-1.6]});
 m.box(-2.6,0,-1.6,3.2,.7,1.2,C.conc,0);for(var i=0;i<4;i++)m.box(-3.9+i*.8,.7,-1.6,.7,.04,1,[150,152,150],0);
 for(i=0;i<6;i++)m.box(-1.6+i*.08,.72,-1.6,.03,.03,.9,C.dark,0);
 u.push({id:1,n:"Estação elevatória",t:"Poço com bomba submersível que recalca o esgoto já peneirado até o reator UASB.",at:[.5,1.2,-1.6]});
 m.box(.35,0,-1.6,1.6,.7,1.2,C.conc,1);m.box(.35,.7,-1.6,.8,.05,.8,[150,152,150],1);
 u.push({id:2,n:"Reator UASB",t:"Reator anaeróbio de fluxo ascendente em PRFV (Ø 2,00 m × 4,50 m; volume útil 12,56 m³). Bactérias sem oxigênio decompõem a maior parte da matéria orgânica.",at:[-2,5.2,Z]});
 m.vtank(-2,Z,1,4.5,G,2,-.55);
 u.push({id:3,n:"Filtro de biogás",t:"Tanque em PRFV (Ø 0,60 m × 1,00 m) que trata o biogás gerado no UASB antes de liberá-lo.",at:[-3.6,1.6,.3]});
 m.vtank(-3.6,.3,.3,1,G,3);m.pipe([-3.3,.9,.3],[-2.95,.9,.3],C.pipe,3);
 u.push({id:4,n:"Filtro aerado submerso (FAS)",t:"Tanque em PRFV (Ø 1,50 m × 3,50 m; 5,30 m³) que recebe ar do soprador. Bactérias aeróbias completam a remoção da matéria orgânica.",at:[.45,4.1,Z]});
 m.vtank(.45,Z,.75,3.5,G,4,-.55);
 u.push({id:5,n:"Decantador secundário (DS)",t:"Tanque em PRFV (Ø 1,50 m × 3,00 m). O lodo se deposita no fundo e o líquido clarificado segue para a desinfecção.",at:[2.25,3.6,Z]});
 m.vtank(2.25,Z,.75,3,G,5,-.55);
 u.push({id:6,n:"Tanque de desinfecção (TD)",t:"Tanque em PRFV (Ø 1,50 m × 1,50 m; 1,77 m³) onde o esgoto tratado recebe cloro antes de seguir para a drenagem, dentro dos padrões do CONAMA e do órgão ambiental.",at:[4,2.1,Z]});
 m.vtank(4,Z,.75,1.5,G,6);
 u.push({id:7,n:"Casa de máquinas",t:"Abriga o quadro de comando, o soprador de ar do FAS e o sistema de dosagem de cloro.",at:[3.5,2.4,-1.85]});
 m.house(3.5,-1.85,2.4,1.9,1.4,7);m.cyl(2.8,0,-1.2,.22,.5,C.dblue,7,12);
 m.run([[-1.1,4.25,Z],[-.4,4.25,Z],[-.4,3.3,Z]]);m.run([[1.05,3.25,Z],[1.75,3.25,Z],[1.75,2.8,Z]]);m.run([[2.75,2.75,Z],[3.6,2.75,Z],[3.6,1.5,Z]]);
 m.run([[.35,.75,-1.4],[.35,4.85,-1.4],[-2,4.85,-1.4],[-2,4.85,Z],[-2,4.5,Z]]);m.run([[2.6,.3,-1.15],[2.6,.3,0],[.45,.3,0]]);
 m.run([[4.6,1.3,Z],[5.6,1.3,Z],[5.6,.1,Z]]);
 return{m:m,u:u,title:"ETE em PRFV, baseada em projeto SANEAR",span:11,yaw:-1.2};}

function eta(){var m=new M(),u=[];
 m.box(0,-.05,0,320,.05,320,C.grass,-2);m.box(0,0,0,11.5,.1,4.8,C.conc,-2);
 u.push({id:0,n:"Correção de pH",t:"A água bruta da região costuma ser ácida. Neste tanque em PRFV o pH é ajustado com dosagem de produto, protegendo a tubulação.",at:[-4.7,2.5,0]});
 m.vtank(-4.7,0,.75,1.6,C.blue,0);m.cyl(-4.7,1.67,-.35,.22,.45,C.white,0,20);m.box(-4.7,2.12,-.35,.26,.12,.22,C.dark,0);
 u.push({id:1,n:"Torre de aeração",t:"A água desce pelas bandejas da torre em contato com o ar. O oxigênio oxida o ferro dissolvido e ajuda a eliminar gases e odores.",at:[-2,6.2,0]});
 m.tower(-2,0,1.6,5.6,C.blue,1);
 u.push({id:2,n:"Filtros",t:"Filtros em PRFV que retêm as partículas e o ferro oxidado na aeração, deixando a água limpa e sem cor.",at:[.9,3.3,0]});
 m.vtank(.9,-.85,.75,2.6,C.blue,2,-.55);m.vtank(.9,.85,.75,2.6,C.blue,2);
 u.push({id:3,n:"Desinfecção",t:"Elimina microrganismos e mantém cloro residual na rede. É obrigatória para água fornecida coletivamente (Portaria GM/MS nº 888/2021).",at:[3,2.1,1.5]});
 m.vtank(3,1.5,.5,1.3,C.blue,3);m.box(3.6,0,1.5,.3,.9,.3,C.white,3);
 u.push({id:4,n:"Reservatório de água tratada",t:"Tanque vertical em PRFV que armazena a água tratada, dentro do padrão de potabilidade, antes de seguir para a rede.",at:[4.6,4.4,-.6]});
 m.vtank(4.6,-.6,1.4,3.8,C.blue,4,-1.0);
 m.run([[-3.95,.4,0],[-2.8,.4,0],[-2.8,5.5,0],[-2,5.5,0]]);m.run([[-2,2.2,0],[.9,2.2,0]]);m.run([[.9,2.6,-.85],[.9,2.2,-.85],[.9,2.2,.85],[.9,2.6,.85]]);m.run([[1.5,2.4,.85],[3,2.4,.85],[3,2.4,1.5],[3,1.3,1.5]]);m.run([[3.45,.3,1.5],[3.9,.3,1.5],[3.9,4,1.5],[3.9,4,-.6],[4.6,4,-.6],[4.6,3.8,-.6]]);
 return{m:m,u:u,title:"ETA em PRFV",span:12,yaw:-.6};}

/* modelo gerado pelo simulador: units=[{n,d,h,kind,label}] */
/* ETE em linhas de tratamento: a vazão se divide em linhas iguais e, em cada linha, os tanques seguem na mesma direção (UASB → FAS → decantador → desinfecção); filtro de biogás ao lado do seu reator UASB */
function eteLines(spec){var m=new M(),u=[],col=C.green,ESG=C.pipe,AF=C.air,RE=.05,RA=.03;
 function SP(w){return Math.max(.4,Math.round(w*.25*20)/20);}
 var US=spec.units,F=function(re){for(var i=0;i<US.length;i++)if(re.test(US[i].label))return{un:US[i],id:i};return null;};
 var gU=F(/UASB/),gG=F(/biogás/),gF=F(/FAS/),gD=F(/Decantador/),gT=F(/desinfec/i),gP=F(/preliminar/),gE=F(/elevatória/),gC=F(/Casa/);
 var grp=[gU,gF,gD,gT].filter(Boolean),L=Math.max(1,Math.min.apply(0,[gF,gD,gT].filter(Boolean).map(function(g){return g.un.n}).concat([gU.un.n])));
 function share(n,k){return Math.floor(n/L)+(k<n%L?1:0);}
 var Dmax=Math.max.apply(0,grp.map(function(g){return g.un.d})),P=Dmax+Math.max(1.1,SP(Dmax)+.2),x=0,GX=Math.max(1.0,SP(Dmax)+.1);
 grp.forEach(function(g){g.mx=0;for(var k=0;k<L;k++)g.mx=Math.max(g.mx,share(g.un.n,k));g.sp=SP(g.un.d);g.x0=x;g.w=g.mx*g.un.d+(g.mx-1)*g.sp;x+=g.w+GX;});
 var Wt=x-GX,x0s=-Wt/2,zs=-(L-1)*P/2;grp.forEach(function(g){g.x0+=x0s;g.cs=[];for(var k=0;k<L;k++){var n=share(g.un.n,k),row=[];for(var j=0;j<n;j++)row.push([g.x0+g.un.d/2+j*(g.un.d+g.sp),zs+k*P]);g.cs.push(row);}});
 var zmin=zs-Dmax/2-.6,zmax=zs+(L-1)*P+Dmax/2+.6,xmin=x0s-3.4,xmax=x0s+Wt+.8;
 if(gC){gC.cx=x0s+Wt+.9+gC.un.d/2;gC.cz=zs+(L-1)*P/2;xmax=gC.cx+gC.un.d/2+.4;}
 var cx0=(xmin+xmax)/2,cz0=(zmin+zmax)/2;function X(v){return v-cx0}function Zz(v){return v-cz0}
 var W=xmax-xmin,D=zmax-zmin,FW=W+3.2,FD=D+3.4;
 m.box(0,-.05,0,320,.05,320,C.grass,-2);m.box(0,-.02,0,FW,.04,FD,C.gravel,-2);m.box(0,-.02,FD/2+2.2,2.2,.03,4.4,C.gravel,-2);m.box(0,0,0,W+1.4,.15,D+1.4,C.slab,-2);
 /* tanques */
 grp.forEach(function(g){var un=g.un,R=un.d/2,first=null;g.cs.forEach(function(row){row.forEach(function(c){var cx=X(c[0]),cz=Zz(c[1]);if(!first)first=[cx,cz];m.stank(cx,cz,R,un.h,col,g.id,un.h>2.6?Math.PI:undefined);});});
  var mid=X(g.x0+g.w/2);u.push({id:g.id,n:un.label,t:un.info||"",at:[mid,un.h+1.15,Zz(zs)],g:{x:first[0],z:first[1],y0:0,r:R,h:un.h,n:un.n}});});
 /* filtros de biogás: ao lado (+z) de cada reator UASB; com menos filtros que reatores, os primeiros reatores recebem um filtro e os outros ligam no mais próximo */
 if(gG&&gU){var all=[];gU.cs.forEach(function(row){row.forEach(function(c){all.push(c)})});var RU=gU.un.d/2,rg=gG.un.d/2,gpos=[];
  var gap=gU.sp;for(var i=0;i<gG.un.n&&i<all.length;i++){var c=all[i];gpos.push([c[0]+RU+gap/2,c[1]+RU*.55]);}
  gpos.forEach(function(p){var gx=X(p[0]),gz=Zz(p[1]);if(!m.tpl("gas",gx,.15,gz,0,gG.un.d/2/.32,gG.un.h/1.05,gG.un.d/2/.32,col,gG.id))m.vtank(gx,gz,rg,gG.un.h,col,gG.id);else m.circ.push([gx,gz,rg]);});
  u.push({id:gG.id,n:gG.un.label,t:gG.un.info||"",at:[X(gpos[0][0]),gG.un.h+1.0,Zz(gpos[0][1])],g:null});
  all.forEach(function(c){var best=gpos[0],bd=1e9;gpos.forEach(function(p){var d=Math.hypot(p[0]-c[0],p[1]-c[1]);if(d<bd){bd=d;best=p;}});
   var cx=X(c[0]),cz=Zz(c[1]),yt=gU.un.h,bx=X(best[0]),bz=Zz(best[1]);
   m.run([[cx+RU*.35,yt,cz+RU*.3],[cx+RU*.35,yt+.15,cz+RU*.3],[bx,yt+.15,cz+RU*.3],[bx,yt+.15,bz],[bx,gG.un.h+.15,bz]],ESG,-1,.025);});}
 /* tratamento preliminar e elevatória, antes das linhas */
 var xe=x0s-1.3,ze=zs+(L-1)*P/2;
 if(gP){var pw=gP.un.d,pd=pw*.6,px=X(xe-.4-pd/2-(gE?gE.un.d/2:0)),pz=Zz(ze);m.box(px,0,pz,pd+.3,.2,pw+.3,C.conc,gP.id);for(var g=0;g<3;g++){var tw=(pw-.1)/3;m.box(px,.2,pz-pw/2+.05+tw*(g+.5),pd-.1,.025,tw-.04,C.metal,gP.id);}
  u.push({id:gP.id,n:gP.un.label,t:gP.un.info||"",at:[px,1.2,pz],g:null});}
 if(gE){var lw=gE.un.d,ex=X(xe),ez=Zz(ze);m.box(ex,0,ez,lw+.3,.2,lw+.3,C.conc,gE.id);for(var g=0;g<2;g++){var tw=(lw-.1)/2;m.box(ex-lw/2+.05+tw*(g+.5),.2,ez,tw-.04,.025,lw-.1,C.metal,gE.id);}
  u.push({id:gE.id,n:gE.un.label,t:gE.un.info||"",at:[ex,1.2,ez],g:null});
  /* recalque: barrilete enterrado ao longo das linhas, sobe em cada linha e distribui por igual no topo de cada UASB */
  var hx=X(gU.x0-.8),RU2=gU.un.d/2,ytop=gU.un.h+.3;m.run([[ex,-.35,ez],[hx,-.35,ez]],AF,-1,RA*1.3);
  var zA=Zz(zs),zB=Zz(zs+(L-1)*P);if(L>1)m.run([[hx,-.35,zA],[hx,-.35,zB]],AF,-1,RA*1.3);
  gU.cs.forEach(function(row,k){var zl=Zz(zs+k*P),xl=X(row[row.length-1][0]);m.run([[hx,-.35,zl],[hx,ytop,zl],[xl,ytop,zl]],AF,-1,RA);row.forEach(function(c){m.run([[X(c[0]),ytop,zl],[X(c[0]),ytop,zl-RU2*.45],[X(c[0]),gU.un.h,zl-RU2*.45]],AF,-1,RA*.8);});});}
 /* entre grupos, em cada linha: coletor da saída de todos os tanques e distribuição por igual na entrada dos tanques seguintes (lados alternados) */
 for(var gi=0;gi<grp.length-1;gi++){var a=grp[gi],b=grp[gi+1],s=gi%2?1:-1;
  for(var k=0;k<L;k++){var ra=a.cs[k],rb=b.cs[k];if(!ra.length||!rb.length)continue;var zl=zs+k*P,Rm=Math.max(a.un.d,b.un.d)/2,zc=Zz(zl+s*(Rm+.4)),y1=a.un.h-.5,y2=b.un.h-.25,xm=X(b.x0-GX/2);
   if(y2>y1-.05)y2=y1-.1;
   ra.forEach(function(c){m.run([[X(c[0]),y1,Zz(c[1]+s*(a.un.d/2-.03))],[X(c[0]),y1,zc]],ESG,-1,RE*.85);});
   rb.forEach(function(c){m.run([[X(c[0]),y2,zc],[X(c[0]),y2,Zz(c[1]+s*(b.un.d/2-.03))]],ESG,-1,RE*.85);});
   m.run([[X(ra[0][0]),y1,zc],[xm,y1,zc],[xm,y2,zc],[X(rb[rb.length-1][0]),y2,zc]],ESG,-1,RE);}}
 /* saída do efluente tratado em cada linha */
 var gl=grp[grp.length-1];gl.cs.forEach(function(row){if(!row.length)return;var c=row[row.length-1],R=gl.un.d/2;m.run([[X(c[0]+R-.05),gl.un.h-.45,Zz(c[1])],[X(c[0]+R+.3),gl.un.h-.45,Zz(c[1])],[X(c[0]+R+.3),-.05,Zz(c[1])]],ESG,-1,RE);});
 /* casa de máquinas: ar para os FAS e cloro para a desinfecção */
 if(gC){var hx2=X(gC.cx),hz=Zz(gC.cz);if(!m.tpl("casa",hx2,.15,hz,0,gC.un.d/1.65,gC.un.h/2.65,gC.un.d*.8/1.65,col,gC.id))m.house(hx2,hz,gC.un.d,gC.un.h,gC.un.d*.8,gC.id);
  u.push({id:gC.id,n:gC.un.label,t:gC.un.info||"",at:[hx2,gC.un.h+1.0,hz],g:null});
  function feed(g,r,yy){if(!g)return;var R=g.un.d/2;g.cs.forEach(function(row,k){var zl=zs+k*P,zf=Zz(zl-(Math.max(Dmax/2,R)+.9));row.forEach(function(c){var cx=X(c[0]);
   m.run([[hx2-gC.un.d/2,yy,hz],[hx2-gC.un.d/2-.3,yy,hz],[hx2-gC.un.d/2-.3,yy,zf],[cx,yy,zf],[cx,g.un.h+.15,zf],[cx,g.un.h+.15,Zz(c[1]-R*.55)],[cx,g.un.h,Zz(c[1]-R*.55)]],AF,-1,r);});});}
  feed(gF,RA,.18);feed(gT,.018,.15);}
 return{m:m,u:u,title:spec.title||"",span:Math.max(7,Math.max(FW,FD)*1.1+1),yaw:-.55,area:{w:W+1.4,d:D+1.4}};}
function simModel(spec){window.__simSpec=spec;if(spec.tipo!=="agua"&&spec.units.some(function(un){return/UASB/.test(un.label)}))return eteLines(spec);var m=new M(),u=[],eta=spec.tipo==="agua",col=eta?C.cream:C.green;
 /* afastamento padrão entre paredes dos tanques, tirado dos projetos SANEAR: 0,40 m nos tanques até Ø 1,50 m e cerca de 1/4 do diâmetro nos maiores (0,70 m no UASB Ø 2,00 m; 0,90 m nos de Ø 3,50 m) */
 function SP(w){return Math.max(.4,Math.round(w*.25*20)/20);}
 var items=spec.units.map(function(un){var rows=un.n>2?2:1,cols=Math.ceil(un.n/rows),w=un.d,g=SP(w);if(un.kind==="gas"){rows=1;cols=un.n;}if(un.kind==="horiz"){rows=1;cols=1;w=un.len;return{un:un,rows:1,cols:1,w:w,g:g,wid:w+2.2,depth:un.d};}return{un:un,rows:rows,cols:cols,w:w,g:g,wid:cols*w+(cols-1)*g,depth:un.wz||rows*w+(rows-1)*g};});
 function BG(a,b){return Math.max(a.g,b.g);}
 var stk=items.filter(function(it){return it.un.on!=null}),items0=items;var psh=items.filter(function(it){return it.un.kind==="parshall"})[0];items=items.filter(function(it){return it.un.on==null&&it.un.kind!=="parshall"});
 var sum=items.reduce(function(s,it){return s+it.wid+it.g},0),lim=items.length>3?Math.max(6,sum/2+.5):1e9;
 /* distribui em fileiras (vai e volta), para o desenho ficar compacto */
 var rowsA=[[]],x=0;items.forEach(function(it){if(x>0&&x+it.wid>lim){rowsA.push([]);x=0;}rowsA[rowsA.length-1].push(it);x+=it.wid+it.g;});
 var z=0,W=0,prevG=0;rowsA.forEach(function(r,ri){var d=0,gg=0,xx=0;r.forEach(function(it){d=Math.max(d,it.depth);gg=Math.max(gg,it.g);});
  var rw=0;r.forEach(function(it,k){rw+=it.wid+(k?BG(r[k-1],it):0);});W=Math.max(W,rw);
  if(ri)z+=Math.max(gg,prevG);
  var seq=ri%2?r.slice().reverse():r;xx=-rw/2;seq.forEach(function(it,k){if(k)xx+=BG(seq[k-1],it);it.x=xx;it.z=z+d/2;xx+=it.wid;});z+=d;prevG=gg;});
 var D=z;if(psh){/* calha Parshall no alto, atrás das unidades, terminando sobre o floculador */var fl=items0[items0.indexOf(psh)+1]||items[0],fcx=fl.x+fl.w/2;psh.x=fcx-psh.wid+.35;psh.z=D+.9+psh.depth/2;D+=.9+psh.depth;W=Math.max(W,psh.wid+2*Math.abs(fcx));items.push(psh);}
 items.forEach(function(it){it.z-=D/2;});items=items0;stk.forEach(function(it){var t=items[it.un.on];it.x=t.x;it.z=t.z;it.rows=t.rows;it.cols=t.cols;it.g=t.g;it.w=Math.min(it.w,t.w);it.wid=t.wid;});
 /* terreno: grama, área em brita cercada por alambrado e base de concreto sob os tanques */
 var FW=W+3.2,FD=D+3.4;
 var bur=items.filter(function(it){return it.un.kind==="horiz"&&it.un.bur})[0];
 if(bur){/* tanque enterrado: vala aberta no terreno (corte), com paredes de terra e laje de fundo */
  var hx=bur.x+bur.wid/2,hz=bur.z,hw=bur.un.len/2+.45,hd=bur.un.d/2+.45,fy=bur.un.yb-.2;
  function hole(y,h,Wd,Dd,c){/* só a face de cima, para não marcar emendas no gramado */var L=-Wd/2,R=Wd/2,B=-Dd/2,T=Dd/2,Y=y+h,a=hx-hw,b2=hx+hw,c0=hz-hd,c1=hz+hd;
   function q(x0,x1,z0,z1){if(x1-x0<1e-3||z1-z0<1e-3)return;m.face([V(x0,Y,z0),V(x0,Y,z1),V(x1,Y,z1),V(x1,Y,z0)],c,-2,true);}
   q(L,a,B,T);q(b2,R,B,T);q(a,b2,B,c0);q(a,b2,c1,T);}
  hole(-.05,.05,320,320,C.grass);hole(-.02,.04,FW,FD,C.gravel);m.box(0,-.02,FD/2+2.2,2.2,.03,4.4,C.gravel,-2);
  var E=[150,112,72];m.box(hx,fy-.1,hz,2*hw,.1,2*hd,C.conc,-2);
  m.box(hx-hw+.04,fy,hz,.08,-fy,2*hd,E,-2);m.box(hx+hw-.04,fy,hz,.08,-fy,2*hd,E,-2);m.box(hx,fy,hz-hd+.04,2*hw,-fy,.08,E,-2);m.box(hx,fy,hz+hd-.04,2*hw,-fy,.08,E,-2);}
 else{m.box(0,-.05,0,320,.05,320,C.grass,-2);m.box(0,-.02,0,FW,.04,FD,C.gravel,-2);m.box(0,-.02,FD/2+2.2,2.2,.03,4.4,C.gravel,-2);
 m.box(0,0,0,W+1.4,.15,D+1.4,C.slab,-2);}
 items.forEach(function(it,idx){var un=it.un,id=idx,top=0,B0=un.b||0;it.cs=[];
  for(var k=0;k<un.n;k++){var c=k%it.cols,r=Math.floor(k/it.cols);var cx=it.x+c*(it.w+it.g)+it.w/2,cz=it.z+(r-(it.rows-1)/2)*(it.w+it.g);it.cs.push([cx,cz]);
   if(un.kind==="horiz"){m.hcomp(cx,cz,un,col,id);top=un.bur?.5:un.yb+un.d;}
   else if(un.kind==="torre"){m.tower(cx,cz,un.d,un.h,col,id,un.out,un.sp);}
   else if(un.kind==="casa"){if(!m.tpl("casa",cx,.15,cz,0,un.d/1.65,un.h/2.65,un.d*.8/1.65,col,id))m.house(cx,cz,un.d,un.h,un.d*.8,id);}
   else if(un.kind==="gas"){if(!m.tpl("gas",cx,.15,cz,0,un.d/2/.32,un.h/1.05,un.d/2/.32,col,id))m.vtank(cx,cz,un.d/2,un.h,col,id);else m.circ.push([cx,cz,un.d/2]);}
   else if(un.kind==="elev"||un.kind==="prelim"){/* unidade enterrada: só aparecem o colar de concreto e as tampas metálicas no nível do piso */
    var lw=un.d,ld=un.kind==="elev"?un.d:un.d*.6;m.box(cx,0,cz,lw+.3,.2,ld+.3,C.conc,id);
    var nt=un.kind==="elev"?2:3;for(var g=0;g<nt;g++){var tw=(lw-.1)/nt;m.box(cx-lw/2+.05+tw*(g+.5),.2,cz,tw-.04,.025,ld-.1,C.metal,id);m.box(cx-lw/2+.05+tw*(g+.5),.225,cz+ld/2-.18,.12,.02,.03,[51,54,54],id);}}
   else if(un.kind==="parshall"){m.parshall(cx,cz,un,col,id);}
   else if(B0>0&&un.kind!=="torre"){/* unidade elevada para escoar por gravidade: base de concreto, ou em cima da unidade anterior */
    if(un.on!=null)m.box(cx,B0-.15,cz,un.d+.1,.15,un.d+.1,C.conc,id);else m.box(cx,0,cz,un.d+.4,B0,un.d+.4,C.conc,id);
    m.oy=B0;m.nologo=un.on!=null;m.stank(cx,cz,un.d/2,un.h,col,id,un.on==null&&un.h+B0>2.6?Math.PI/2:undefined);m.oy=0;m.nologo=false;}
   else if(eta&&/Filtro/.test(un.label)){/* filtro como no projeto: tanque vertical em PRFV branco, escada com gaiola azul no último filtro */
    m.stank(cx,cz,un.d/2,un.h,C.cream,id);if(k===un.n-1){var lt=PECAS&&PECAS.ladder,la=0,rr=un.d/2;if(lt)m.tpl("ladder",cx+(rr-lt.r0),0,cz,la-Math.PI,1,(un.h+1.08)/(lt.h0+1.08),1,C.ladder,id);else m.cage(cx+rr+.06,cz,un.h,la,C.ladder,id);}}
   else{m.stank(cx,cz,un.d/2,un.h,col,id,un.h>2.6?Math.PI/2:undefined);}
   if(un.kind!=="horiz")top=Math.max(top,B0+un.h);}
  it.cx=it.x+it.wid/2;
  var g0=it.cs[0];u.push({id:id,n:un.label,t:un.info||"",at:[it.cx,top+1.15,it.z],g:(un.kind==="casa"||un.kind==="prelim"||un.kind==="elev"||un.nod)?null:{x:g0[0],z:g0[1],y0:B0,r:un.d/2,h:un.h,sq:un.kind==="torre",n:un.n}});});
 var lk=items.filter(function(it){return it.un.kind!=="casa"&&it.un.kind!=="gas"&&it.un.kind!=="horiz"});
 /* tubulações no mesmo traçado do projeto Revit da SANEAR */
 var ESG=C.pipe,AF=C.air,RE=.05,RA=.03;
 function rad(it){return it.un.kind==="torre"?it.w*.67:(it.un.kind==="prelim"||it.un.kind==="elev")?0:it.w/2;}
 function near(it,P){var best=it.cs[0],bd=1e9;it.cs.forEach(function(c){var d=Math.hypot(c[0]-P[0],c[1]-P[1]);if(d<bd){bd=d;best=c;}});return best;}
 function ortho(a,b,y){/* caminho em L no plano, como tubulação real */var pts=[[a[0],y,a[1]]];if(Math.abs(a[0]-b[0])>.01&&Math.abs(a[1]-b[1])>.01)pts.push([b[0],y,a[1]]);pts.push([b[0],y,b[1]]);return pts;}
 function HB(it){return it.un.b||0;}
 lk.forEach(function(p,i){var q=lk[i+1];if(p.un.kind!=="parshall"||!q)return;/* saída no fim da calha: desce por fora e entra no alto do floculador */
  var xe=p.x+p.wid,cz=p.z,c0=near(q,[xe,cz]),yt=HB(q)+q.un.h,yo=HB(p)+.1;
  var pts=[[xe-.25,yo,cz]].concat(ortho([xe+.15,cz],[c0[0]+.15,c0[1]+q.w*.3],yo));pts.push([c0[0]+.15,yt,c0[1]+q.w*.3]);m.run(pts,C.pipe,-1,.05);});
 for(var i=0;i<lk.length-1;i++){var p=lk[i],q=lk[i+1];if(p.un.kind==="parshall")continue;
  if(p.un.on!=null&&lk.indexOf(items[p.un.on])===i+1){/* coagulação em cima do floculador: sai pela lateral, desce e entra no alto do floculador */
   p.cs.forEach(function(c){var rr=p.w/2,yo=HB(p)+.3,yi=HB(q)+q.un.h-.3;m.run([[c[0]-rr+.03,yo,c[1]],[c[0]-rr-.25,yo,c[1]],[c[0]-rr-.25,yi,c[1]],[c[0]-q.w/2+.03,yi,c[1]]],C.pipe,-1,.05);});continue;}
  if(p.un.kind==="prelim"&&q.un.kind==="elev")continue;/* ligação enterrada, como no projeto */
  if(p.un.kind==="prelim"||p.un.kind==="elev"){/* recalque da elevatória: PVC marrom pelo chão, sobe pela parede do reator e entra pelo topo */
   var A=[p.cx,p.z],B=near(q,A),rq=rad(q),dx=A[0]-B[0],dz=A[1]-B[1],dl=Math.hypot(dx,dz)||1,WP=[B[0]+dx/dl*(rq+.12),B[1]+dz/dl*(rq+.12)],T=[B[0]+dx/dl*(rq*.55),B[1]+dz/dl*(rq*.55)];
   var pts=ortho([A[0],A[1]],WP,-.35);var top=q.un.h+.18;pts.push([WP[0],top,WP[1]],[T[0],top,T[1]],[T[0],q.un.h,T[1]]);m.run(pts,AF,-1,RA);continue;}
  if(eta&&/Filtro|Decant/.test(q.un.label)&&p.un.kind!=="prelim"){/* unidades ascendentes (decantadores e filtros), como no projeto da ETA SANEAR: barrilete no piso com entrada individual pelo fundo de cada tanque, e coletor no alto de cada tanque; a vazão se divide por igual */
   var R=q.w/2,yb=.32,yo=HB(q)+q.un.h-.25,zH=q.z-q.depth/2-.45,A=near(p,[q.cx,zH]),rp=rad(p),sx=q.cx>=A[0]?1:-1,tw=p.un.kind==="torre",E=[A[0]+sx*(tw?p.w*.6:rp-.05),A[1]],O=tw?E:[A[0]+sx*(rp+.2),A[1]],y1=p.un.kind==="torre"?(p.un.out||p.un.h*.4):HB(p)+p.un.h-.5;
   var PB=C.beige,xs=q.cs.map(function(c){return c[0]}),x0=Math.min.apply(0,xs),x1=Math.max.apply(0,xs),S;
   if(p.outEnd){S=p.outEnd;var pts=[S,[S[0],yb,S[2]]].concat(ortho([S[0],S[2]],[S[0],zH],yb).slice(1));m.run(pts,PB,-1,RE);m.run([[Math.min(S[0],x0),yb,zH],[Math.max(S[0],x1),yb,zH]],PB,-1,RE);}
   else if(tw)m.run([[A[0],y1+.02,A[1]],[A[0],yb,A[1]],[A[0],yb,zH],[sx>0?x1:x0,yb,zH]],PB,-1,RE);
   else{m.run([[E[0],y1,E[1]],[O[0],y1,O[1]],[O[0],yb,O[1]],[O[0],yb,zH]],PB,-1,RE);m.run([[Math.min(O[0],x0),yb,zH],[Math.max(O[0],x1),yb,zH]],PB,-1,RE);}
   q.cs.forEach(function(c){var front=c[1]<=q.z+.01;
    if(front||q.rows===1)m.run([[c[0],yb,zH],[c[0],yb,c[1]-R+.04]],PB,-1,RE*.85);
    else{var gx=c[0]+(c[0]<q.x+q.wid-q.w?1:-1)*(R+q.g/2);m.run([[gx,yb,zH],[gx,yb,c[1]],[c[0]+(gx>c[0]?1:-1)*(R-.04),yb,c[1]]],PB,-1,RE*.85);}});
   var nxt=lk[i+2],so=nxt?(nxt.cx>=q.cx?1:-1):sx,ends=[];
   var rowsZ={};q.cs.forEach(function(c){var k=c[1].toFixed(2);(rowsZ[k]=rowsZ[k]||[]).push(c);});
   Object.keys(rowsZ).forEach(function(k){var cs=rowsZ[k],cz=+k,s=(q.rows===1||cz>q.z+.01)?1:-1;var zc=cz+s*(R+.35);
    cs.forEach(function(c){m.run([[c[0],yo,c[1]+s*(R-.04)],[c[0],yo,zc]],PB,-1,RE*.85);});
    var xa=Math.min.apply(0,cs.map(function(c){return c[0]})),xb=Math.max.apply(0,cs.map(function(c){return c[0]})),xe=(so>0?xb:xa)+so*(R+.4);
    m.run([[so>0?xa:xb,yo,zc],[xe,yo,zc]],PB,-1,RE);ends.push([xe,yo,zc]);});
   if(/Decant/.test(q.un.label)&&nxt){/* coletores dos decantadores juntam num tubo só, que desce para o barrilete dos filtros */
    if(ends.length>1)m.run([ends[0],ends[ends.length-1]],PB,-1,RE);q.outEnd=ends[0];}
   else ends.forEach(function(e){m.run([e,[e[0],-.05,e[2]]],PB,-1,RE);});
   continue;}
  var A=near(p,[q.cx,q.z]),B=near(q,A),ux=B[0]-A[0],uz=B[1]-A[1],L=Math.hypot(ux,uz)||1;ux/=L;uz/=L;
  var rp=rad(p),rq=rad(q),y1=p.un.kind==="torre"?(p.un.out||p.un.h*.4):HB(p)+p.un.h-.5,y2=q.un.kind==="torre"?q.un.h-.1:HB(q)+q.un.h-.25;
  var E=[A[0]+ux*(rp-.05),A[1]+uz*(rp-.05)],O=[A[0]+ux*(rp+.18),A[1]+uz*(rp+.18)],N=[B[0]-ux*(rq-.05),B[1]-uz*(rq-.05)];
  if(y2<y1-.05&&q.un.kind!=="torre"){/* sai pela lateral no alto, desce no vão entre os tanques e entra pela lateral no alto do próximo */
   var g=(rp+.18<L-rq-.1)?Math.min(.5,(L-rp-rq)/2):(L-rp-rq)/2,G=[A[0]+ux*(rp+g),A[1]+uz*(rp+g)];
   m.run([[E[0],y1,E[1]],[G[0],y1,G[1]],[G[0],y2,G[1]],[N[0],y2,N[1]]],ESG,-1,RE);}
  else{/* próximo mais alto: sobe por fora e entra por cima */var qt=HB(q)+q.un.h,top=Math.max(y1,qt)+.3,T=[B[0]-ux*rq*.5,B[1]-uz*rq*.5];
   m.run([[E[0],y1,E[1]],[O[0],y1,O[1]],[O[0],top,O[1]],[T[0],top,T[1]],[T[0],qt,T[1]]],ESG,-1,RE);}}
 /* saída do efluente tratado: lateral do último tanque, descendo até o chão */
 if(!eta&&lk.length){var z0=lk[lk.length-1],c0=z0.cs[z0.cs.length-1],r0=rad(z0),pv=lk.length>1?lk[lk.length-2]:null,ox=pv?(c0[0]>=pv.cx?1:-1):1;
  m.run([[c0[0]+ox*(r0-.05),z0.un.h-.45,c0[1]],[c0[0]+ox*(r0+.25),z0.un.h-.45,c0[1]],[c0[0]+ox*(r0+.25),-.05,c0[1]]],ESG,-1,RE);}
 /* biogás: do topo do UASB, pela borda, descendo até a base do filtro de biogás */
 var ua=items.filter(function(it){return/UASB/.test(it.un.label)})[0],gs=items.filter(function(it){return it.un.kind==="gas"})[0];
 if(ua&&gs){gs.cs.forEach(function(e0){var s0=near(ua,e0),r=ua.w/2,dx=e0[0]-s0[0],dz=e0[1]-s0[1],dl=Math.hypot(dx,dz)||1;dx/=dl;dz/=dl;var rg=gs.w/2;
  var S=[s0[0]+dx*r*.35,s0[1]+dz*r*.35],Ed=[s0[0]+dx*(r+.12),s0[1]+dz*(r+.12)],F=[e0[0]-dx*(rg+.12),e0[1]-dz*(rg+.12)],yt=ua.un.h+.12;
  var pts=[[S[0],ua.un.h,S[1]],[S[0],yt,S[1]],[Ed[0],yt,Ed[1]],[Ed[0],.25,Ed[1]]];ortho(Ed,F,.25).slice(1).forEach(function(p){pts.push(p)});pts.push([e0[0]-dx*(rg-.03),.25,e0[1]-dz*(rg-.03)]);m.run(pts,ESG,-1,.025);/* biogás: PVC esgoto DN 50 */});}
 /* ar do compressor (casa de máquinas) e dosagem de cloro: PVC marrom pelo chão, subindo pela parede do tanque */
 var cs=items.filter(function(it){return it.un.kind==="casa"})[0];
 function feed(it,r,yy){if(!cs||!it)return;it.cs.forEach(function(c){var R=it.w/2,side=c[1]>=cs.z?1:-1,WP=[c[0],c[1]+side*(R+.1)];
  var pts=ortho([cs.cx,cs.z+side*cs.depth*.3],[WP[0],cs.z+side*cs.depth*.3],yy).concat([[WP[0],yy,WP[1]],[WP[0],it.un.h+.15,WP[1]],[c[0],it.un.h+.15,c[1]+side*R*.55],[c[0],it.un.h,c[1]+side*R*.55]]);m.run(pts,AF,-1,r);});}
 feed(items.filter(function(it){return/FAS/.test(it.un.label)})[0],RA,.18);
 feed(items.filter(function(it){return/desinfec/i.test(it.un.label)})[0],.018,.15);
 return{m:m,u:u,title:spec.title||"",span:Math.max(7,Math.max(FW,FD)*1.1+1),yaw:-.55,area:{w:W+1.4,d:D+1.4}};}
window.SANEAR3D={simModel:simModel};
fetch("modelos/pecas.json").then(function(r){return r.json()}).then(function(j){PECAS=j;document.querySelectorAll(".simv").forEach(function(el){if(el._v3&&window.__simSpec)el._v3.setModel(simModel(window.__simSpec));});}).catch(function(){});
var MODELS={ete:eteV,ete2:eteV,eta:eta};var LABEL={ete:"ETE compacta",ete2:"ETE de maior porte",eta:"ETA"};

/* ===== Renderizador fotorrealista (WebGL2): perspectiva real, céu e névoa, sombras suaves, oclusão ambiente (SSAO), materiais PBR e tone mapping ===== */
var GLSL_COMMON=`
const float PI=3.14159265;
float h(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return .5*n3(p)+.25*n3(p*2.03)+.125*n3(p*4.01)+.0625*n3(p*8.07);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
uniform vec3 uL;
const vec3 HORIZ=vec3(.80,.86,.92);
vec3 skyCol(vec3 r){float y=r.y;
 vec3 zen=vec3(.22,.42,.78),hor=HORIZ*1.15;
 vec3 c=mix(hor,zen,pow(clamp(y,0.,1.),.55));
 if(y<0.)c=mix(HORIZ*1.05,vec3(.42,.47,.40),clamp(-y*3.,0.,1.));
 float s=max(dot(r,uL),0.);c+=vec3(1.,.86,.62)*(pow(s,9.)*.35+pow(s,350.)*6.);
 /* nuvens altas e suaves */
 if(y>.02){vec2 q=r.xz/(y+.12)*1.4;float cl=smoothstep(.55,.85,fbm(vec3(q,.0)*1.1+vec3(3.,0.,1.)));c=mix(c,vec3(1.05,1.05,1.07),cl*.55*smoothstep(.02,.25,y));}
 return c;}
vec3 finish(vec3 col,vec2 fc,vec2 res){col=aces(col*.72);vec2 uv=fc/res-.5;col*=1.-.22*pow(length(uv*vec2(1.,.9))*1.25,2.6);return pow(col,vec3(1./2.2));}
`;
function GLR(cv){var gl=cv.getContext("webgl2",{antialias:true,alpha:false,premultipliedAlpha:false,preserveDrawingBuffer:true});if(!gl)throw 0;this.gl=gl;this.cv=cv;
 var VS=`#version 300 es
 precision highp float;precision highp int;
 in vec3 aP;in vec3 aN;in vec3 aC;in vec2 aM;in float aPI;in float aU;
 uniform int uMesh;uniform vec4 uPal[64];uniform float uPS;
 uniform vec4 uCam;uniform vec4 uScr;uniform vec3 uLR,uLU,uLF;uniform vec4 uLB;uniform vec2 uLZ;uniform int uMode;
 out vec3 vP;out vec3 vN;out vec3 vC;flat out vec2 vM;out vec3 vLS;out vec3 vV;out vec3 vVN;
 const float NEAR=1.,FAR=320.;
 void main(){vec3 p=aP,n=aN;
  if(uMesh==1){p=aP*uPS;vec4 pe=uPal[int(aPI+.5)];vC=pe.rgb;vM=vec2(pe.a,aU);}else{vC=aC;vM=aM;}
  vP=p;vN=n;
  float lx=dot(p,uLR),ly=dot(p,uLU),lz=dot(p,uLF);
  vLS=vec3((lx-uLB.x)/(uLB.y-uLB.x),(ly-uLB.z)/(uLB.w-uLB.z),(lz-uLZ.x)/(uLZ.y-uLZ.x));
  if(uMode==1){gl_Position=vM.x>1.5&&vM.x<2.5?vec4(9.,9.,9.,1.):vec4(vLS.xy*2.-1.,vLS.z*2.-1.,1.);return;}
  float cy=uCam.x,sy=uCam.y,cp=uCam.z,sp=uCam.w;
  float x1=p.x*cy-p.z*sy,z1=p.x*sy+p.z*cy,y=p.y-1.4;float y2=y*cp+z1*sp,z2=-y*sp+z1*cp;
  float nx1=n.x*cy-n.z*sy,nz1=n.x*sy+n.z*cy;vVN=vec3(nx1,n.y*cp+nz1*sp,-n.y*sp+nz1*cp);
  vV=vec3(x1,y2,z2);float d=30.+z2,S=uScr.z*30.;
  gl_Position=vec4(x1*S*2./uScr.x,-.2*d+y2*S*2./uScr.y,((FAR+NEAR)*d-2.*FAR*NEAR)/(FAR-NEAR),d);}`;
 var FS=`#version 300 es
 precision highp float;precision highp int;precision highp sampler2DShadow;
 in vec3 vP;in vec3 vN;in vec3 vC;flat in vec2 vM;in vec3 vLS;in vec3 vV;in vec3 vVN;
 uniform sampler2DShadow uSM;uniform sampler2D uAO;uniform vec3 uV;uniform vec3 uEye;uniform int uMode;uniform float uSel;uniform vec3 uCirc[48];uniform int uNC;uniform vec2 uRes;uniform float uSSAO;uniform sampler2D uLogo;uniform vec4 uTk[24];uniform int uNT;uniform float uDA;
 out vec4 o;`+GLSL_COMMON+`
 /* tela de alambrado: arame em losango, filtrado para não serrilhar */
 float chain(vec3 p,vec3 n){vec2 t=normalize(vec2(-n.z,n.x)+1e-5);float u=dot(p.xz,t),v=p.y,s=.06,k=s*.7071,w=.0019;
  float a=(u+v)/s,b=(u-v)/s;float wa=(.5-abs(fract(a)-.5))*k,wb=(.5-abs(fract(b)-.5))*k;
  float fa=fwidth(a)*k+1e-5,fb=fwidth(b)*k+1e-5,avg=2.*w/k;
  float ca=clamp((w-wa)/fa+.5,0.,1.),cb=clamp((w-wb)/fb+.5,0.,1.);
  ca=mix(ca,avg,smoothstep(.25,1.,fa/(k*.4)));cb=mix(cb,avg,smoothstep(.25,1.,fb/(k*.4)));
  return clamp(max(ca,cb)*1.6,0.,1.);}
 float D_GGX(float nh,float r){float a=r*r,a2=a*a,d=nh*nh*(a2-1.)+1.;return a2/(PI*d*d);}
 void main(){
  float mat=vM.x,id=vM.y;vec3 n=normalize(vN);vec3 V=normalize(uEye-vP);
  float cov=1.;if(mat>5.5&&mat<6.5)cov=chain(vP,n);
  if(uMode==1){if(cov<.35)discard;o=vec4(1);return;}
  if(uMode==3){if(cov<.35)discard;o=vec4((id+1.)/255.,0.,0.,1.);return;}
  vec3 vn=normalize(vVN);if(dot(vn,-vec3(vV.x,vV.y,vV.z+30.))<0.)vn=-vn;
  if(uMode==2){if(cov<.35)discard;o=vec4(vn*.5+.5,1.);return;}
  if(dot(n,uV)<0.)n=-n;
  vec3 base=pow(vC,vec3(2.2));float rough=.8,metal=0.,f0=.04,clear=0.;
  float dist=length(uEye-vP);float fw=fwidth(vP.x)+fwidth(vP.z);
  if(mat<.5){/* fibra de vidro (PRFV): gel coat brilhante, manta levemente aparente, sujeira junto ao chão */
   float f=fbm(vP*vec3(5.,1.6,5.));float fib=n3(vP*vec3(70.,9.,70.));float st=n3(vec3((vP.x+vP.z)*9.,vP.y*.7,1.));
   base*=.95+.07*f+.03*fib*(1.-smoothstep(.01,.05,fw));base*=1.-.06*st*smoothstep(.2,2.,vP.y);
   float g=1.-smoothstep(.0,.55,vP.y);base=mix(base,base*vec3(.70,.66,.55),g*.45);rough=.28+.1*f;clear=.5;
   /* adesivo com a logo da SANEAR em cada tanque (dois lados opostos) */
   if(abs(n.y)<.5)for(int k=0;k<24;k++){if(k>=uNT)break;vec4 t=uTk[k];vec2 d=vP.xz-t.xy;float rr=length(d);
    if(abs(rr-t.z)<.14+.05*t.z){float a=atan(d.y,d.x)-uDA;a=mod(a+PI*.5,PI)-PI*.5;float R=clamp(min(t.z*.6,t.w*.17),.2,.62);
     vec2 q=vec2(a*t.z,vP.y-t.w*(t.w<3.5?.47:.56));float l=length(q);if(l<R){vec2 uv=q/(2.*R)+.5;uv.y=1.-uv.y;vec3 lg=pow(texture(uLogo,uv).rgb,vec3(2.2));
      float e=1.-smoothstep(R-.012,R,l);base=mix(base,lg*.92,e);rough=mix(rough,.22,e);}break;}}}
  else if(mat<1.5){/* concreto / reboco */ float f=fbm(vP*3.5)*.6+n3(vP*31.)*.4*(1.-smoothstep(.02,.08,fw));base*=.84+.26*f;
   base=mix(base,base*vec3(.72,.70,.64),(1.-smoothstep(0.,.45,vP.y))*.5);rough=.92;}
  else if(mat<2.5){/* grama: manchas, variação de tom e folhas finas só onde a resolução permite */
   vec2 q=vP.xz;float big=fbm(vec3(q*.11,0.)),mid=fbm(vec3(q*.9,2.)),fine=n3(vec3(q*55.,3.));
   float dfade=1.-smoothstep(.02,.12,fw);
   vec3 g1=vec3(.11,.21,.06),g2=vec3(.19,.29,.09),g3=vec3(.30,.31,.15);
   base=mix(g1,g2,smoothstep(.3,.75,big));base=mix(base,g3,smoothstep(.72,.92,mid)*.3);
   float tuft=n3(vec3(q*7.,5.));base*=.80+.22*tuft+.36*(mix(.5,fine,dfade)-.5)+.08*mid;rough=.95;
   n=normalize(n+vec3(fine-.5,0.,n3(vec3(q*55.,7.))-.5)*.35*dfade);}
  else if(mat<3.5){rough=.38;clear=.25;base*=.97+.05*n3(vP*20.);}
  else if(mat<4.5){/* brita: pedras com tons variados; de longe vira textura média, sem serrilhado */
   vec2 q=vP.xz*19.;vec2 c=floor(q),fq=fract(q)-.5;float r=h(vec3(c,3.));float d=length(fq+vec2(h(vec3(c,7.))-.5,h(vec3(c,9.))-.5)*.35);
   float df=1.-smoothstep(.015,.05,fw);float stone=smoothstep(.55,.22,d);
   base=vec3(.50,.48,.44)*mix(.82,mix(.6,1.,stone)*(.8+.45*r),df)*(.88+.24*fbm(vec3(vP.xz*1.7,2.)));rough=.9;}
  else if(mat<6.5){/* metal: galvanizado claro é metálico; pintado escuro é dielétrico */
   float lum=dot(vC,vec3(.3,.59,.11)),sat=max(vC.r,max(vC.g,vC.b))-min(vC.r,min(vC.g,vC.b));
   metal=lum>.5&&sat<.12?.55:0.;rough=metal>.3?.48+.12*n3(vP*40.):.5;}
  else {rough=.75;}
  /* sombra suave (PCF 5×5) */
  float sh=0.;vec2 ts=vec2(1./2048.);float nlr=dot(n,uL);float bias=.0012+.0025*(1.-max(nlr,0.));
  for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++){sh+=texture(uSM,vec3(vLS.xy+vec2(i,j)*ts*1.8,vLS.z-bias));}
  sh/=25.;if(vLS.x<0.||vLS.x>1.||vLS.y<0.||vLS.y>1.||vLS.z>1.)sh=1.;
  /* oclusão: SSAO + sombra de contato sob os tanques */
  float ao=uSSAO>.5?texture(uAO,gl_FragCoord.xy/uRes).r:1.;
  if(vP.y<.2){for(int k=0;k<48;k++){if(k>=uNC)break;vec3 c=uCirc[k];float d=length(vP.xz-c.xy)-c.z;ao*=1.-.45*exp(-max(d,0.)/.28);}}
  float nl=max(nlr,0.);vec3 H=normalize(uL+V);float nv=max(dot(n,V),1e-3),nh=max(dot(n,H),0.),vh=max(dot(V,H),0.);
  vec3 F0=mix(vec3(f0),base,metal);vec3 F=F0+(1.-F0)*pow(1.-vh,5.);
  float k=(rough+1.)*(rough+1.)/8.,G=nv/(nv*(1.-k)+k)*nl/(nl*(1.-k)+k);
  vec3 spec=D_GGX(nh,rough)*F*G/max(4.*nv*nl,1e-3);
  vec3 sun=vec3(1.,.93,.82)*2.7;
  vec3 kd=(1.-F)*(1.-metal);
  vec3 amb=mix(vec3(.36,.34,.27),vec3(.54,.65,.84),n.y*.5+.5)*1.5;
  vec3 R=reflect(-V,n);vec3 env=skyCol(normalize(R));if(R.y<0.)env=mix(env,vec3(.10,.13,.07),.6);
  vec3 Fe=F0+(max(vec3(1.-rough),F0)-F0)*pow(1.-nv,5.);
  vec3 col=kd*base/PI*sun*nl*sh*PI+base*kd*amb*ao+spec*sun*nl*sh+env*Fe*ao*(1.-rough*.85)*(1.+clear);
  if(uSel>-.5){if(abs(id-uSel)<.1)col=mix(col,vec3(1.6,.75,.18),.30);else if(id>-.5)col=mix(col,vec3(1.1),.30);}
  /* névoa atmosférica até o horizonte */
  float fog=smoothstep(28.,150.,dist)*.92+smoothstep(150.,240.,dist)*.08;col=mix(col,HORIZ*1.05,fog);
  o=vec4(finish(col,gl_FragCoord.xy,uRes),cov);}`;
 var FSQ=`#version 300 es
 void main(){vec2 p=vec2(gl_VertexID==1?3.:-1.,gl_VertexID==2?3.:-1.);gl_Position=vec4(p,0.,1.);}`;
 var SKY=`#version 300 es
 precision highp float;uniform vec4 uCam;uniform vec4 uScr;uniform vec2 uRes;out vec4 o;`+GLSL_COMMON+`
 void main(){vec2 f=gl_FragCoord.xy/uRes;float sx=f.x*uScr.x,sy=(1.-f.y)*uScr.y,S=uScr.z*30.;
  vec3 d=normalize(vec3((sx-uScr.x*.5)/S,(uScr.y*.6-sy)/S,1.));float cy=uCam.x,sny=uCam.y,cp=uCam.z,sp=uCam.w;
  float y=d.y*cp-d.z*sp,z1=d.y*sp+d.z*cp;vec3 w=vec3(d.x*cy+z1*sny,y,-d.x*sny+z1*cy);
  o=vec4(finish(skyCol(normalize(w)),gl_FragCoord.xy,uRes),1.);}`;
 /* oclusão ambiente em espaço de tela, em meia resolução */
 var AO=`#version 300 es
 precision highp float;uniform sampler2D uD;uniform sampler2D uN;uniform vec4 uScr;uniform vec2 uRes;out vec4 o;
 const float NEAR=1.,FAR=320.;
 float ld(float z){z=z*2.-1.;return 2.*FAR*NEAR/((FAR+NEAR)-z*(FAR-NEAR));}
 vec3 vpos(vec2 uv){float d=ld(texture(uD,uv).r),S=uScr.z*30.;return vec3((uv.x*uScr.x-uScr.x*.5)*d/S,(uScr.y*.6-(1.-uv.y)*uScr.y)*d/S,d-30.);}
 vec2 proj(vec3 p){float d=30.+p.z,S=uScr.z*30.;return vec2((uScr.x*.5+p.x*S/d)/uScr.x,1.-(uScr.y*.6-p.y*S/d)/uScr.y);}
 float hs(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec2 uv=gl_FragCoord.xy/uRes;float z=texture(uD,uv).r;if(z>=1.){o=vec4(1);return;}
  vec3 P=vpos(uv),N=normalize(texture(uN,uv).xyz*2.-1.);
  vec2 cell=mod(floor(gl_FragCoord.xy),4.);float a0=(cell.x*4.+cell.y)/16.*6.2831+hs(cell)*.3;
  vec3 t=normalize(abs(N.y)<.9?cross(N,vec3(0,1,0)):cross(N,vec3(1,0,0)));vec3 b=cross(N,t);
  float occ=0.,R=.55;
  for(int i=0;i<14;i++){float fi=float(i);float r=(fi+.5)/14.;r=R*mix(.12,1.,r*r);float a=a0+fi*2.39996;float ct=sqrt(1.-(fi+.5)/14.*.85);float st=sqrt(1.-ct*ct);
   vec3 dir=t*cos(a)*st+b*sin(a)*st+N*ct;vec3 S=P+dir*r;vec2 su=proj(S);if(su.x<0.||su.x>1.||su.y<0.||su.y>1.)continue;
   float sd=ld(texture(uD,su).r)-30.;float diff=S.z-sd;
   occ+=step(.025,diff)*smoothstep(0.,1.,R/abs(P.z-sd));}
  float ao=clamp(1.-occ/14.*1.25,0.,1.);o=vec4(ao,ao,ao,1.);}`;
 var BLUR=`#version 300 es
 precision highp float;uniform sampler2D uA;uniform vec2 uRes;out vec4 o;
 void main(){vec2 px=1./uRes,uv=gl_FragCoord.xy*px;float s=0.;for(int i=-2;i<2;i++)for(int j=-2;j<2;j++)s+=texture(uA,uv+(vec2(i,j)+.5)*px).r;s/=16.;o=vec4(s,s,s,1.);}`;
 function sh(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);return x;}
 function prog(v,f,names){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);var u={};names.forEach(function(n){u[n]=gl.getUniformLocation(p,n)});return{p:p,u:u};}
 this.P=prog(VS,FS,["uCam","uScr","uLR","uLU","uLF","uLB","uLZ","uMode","uSM","uAO","uL","uV","uSel","uCirc","uNC","uRes","uSSAO","uMesh","uPal","uPS","uEye","uLogo","uTk","uNT","uDA"]);
 gl.useProgram(this.P.p);gl.uniform1i(this.P.u.uSM,0);gl.uniform1i(this.P.u.uAO,3);gl.uniform1i(this.P.u.uLogo,4);
 var self0=this;this.logo=gl.createTexture();gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,this.logo);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));gl.activeTexture(gl.TEXTURE0);
 var li=new Image();li.onload=function(){gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,self0.logo);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,li);gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.activeTexture(gl.TEXTURE0);self0.logoOK=true;if(self0.onready)self0.onready();};li.src="media/logo.jpg";
 this.PS=prog(FSQ,SKY,["uCam","uScr","uRes","uL"]);this.PA=prog(FSQ,AO,["uD","uN","uScr","uRes"]);this.PB=prog(FSQ,BLUR,["uA","uRes"]);
 this.sm=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.sm);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,2048,2048);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 this.fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,this.sm,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 this.vaoE=gl.createVertexArray();/* VAO vazio para os passes de tela cheia */
 this.ssao=!window.V3_NOAO;this.vao=null;this.mod=null;}
GLR.prototype.tex=function(w,h,fmt,ifmt,type,filter){var gl=this.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,fmt,type,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
GLR.prototype.targets=function(W,H){var gl=this.gl,w=Math.max(1,W>>1),h=Math.max(1,H>>1);if(this.tw===w&&this.th===h)return;this.tw=w;this.th=h;
 (this.tts||[]).forEach(function(t){gl.deleteTexture(t)});(this.fbs||[]).forEach(function(f){gl.deleteFramebuffer(f)});
 this.tN=this.tex(w,h,gl.RGBA,gl.RGBA8,gl.UNSIGNED_BYTE,gl.NEAREST);this.tD=this.tex(w,h,gl.DEPTH_COMPONENT,gl.DEPTH_COMPONENT24,gl.UNSIGNED_INT,gl.NEAREST);
 this.tA=this.tex(w,h,gl.RGBA,gl.RGBA8,gl.UNSIGNED_BYTE,gl.LINEAR);this.tB=this.tex(w,h,gl.RGBA,gl.RGBA8,gl.UNSIGNED_BYTE,gl.LINEAR);
 function fbo(c,d){var f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,c,0);if(d)gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,d,0);return f;}
 this.fN=fbo(this.tN,this.tD);this.fA=fbo(this.tA);this.fB=fbo(this.tB);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 this.tts=[this.tN,this.tD,this.tA,this.tB];this.fbs=[this.fN,this.fA,this.fB];gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.shOK?this.sm:null);};
var MATOF=function(c){if(c===C.conc||c===C.base||c===C.lid||c===C.slab||c===C.plaster)return 1;if(c===C.metal)return 5;if(c===C.grass)return 2;if(c===C.gravel)return 4;if(c===C.fence)return 5;if(c===C.ladder||c===C.beige||c===C.pipe||c===C.air||c===C.dark||c===C.panel||c===C.orange||c===C.gas||c===C.pvc)return 3;return 0;};
GLR.prototype.upload=function(mod){var gl=this.gl,P=[],N=[],Cc=[],Mm=[],circ=[],self=this,pr=this.P;
 mod.m.f.forEach(function(f){var p=f.p;if(p.length<3)return;
  var a=p[0],b=p[1],c=p[2],u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
  var n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(n[0],n[1],n[2])||1;n=[n[0]/l,n[1]/l,n[2]/l];
  var cx=0,cy=0,cz=0;p.forEach(function(q){cx+=q[0];cy+=q[1];cz+=q[2]});cx/=p.length;cy/=p.length;cz/=p.length;
  var vn=p.map(function(q){if(!f.ns)return n;var d=[q[0]-cx,q[1]-cy,q[2]-cz],a0=f.ns[0],a1=f.ns[1];return(d[0]*a0[0]+d[1]*a0[1]+d[2]*a0[2])>=(d[0]*a1[0]+d[1]*a1[1]+d[2]*a1[2])?a0:a1;});
  var col=f.c.map(function(x){return x/255}),mt=MATOF(f.c),id=f.id;
  for(var i=1;i<p.length-1;i++)[0,i,i+1].forEach(function(k){P.push(p[k][0],p[k][1],p[k][2]);N.push(vn[k][0],vn[k][1],vn[k][2]);Cc.push(col[0],col[1],col[2]);Mm.push(mt,id);});});
 var tr=mod.m.tr;if(tr&&tr.P.length){for(var q=0;q<tr.P.length;q++){P.push(tr.P[q]);N.push(tr.N[q]);Cc.push(tr.C[q]);}for(q=0;q<tr.M.length;q++)Mm.push(tr.M[q]);}
 (mod.m.circ||[]).concat(mod.circ||[]).forEach(function(c){if(circ.length<48*3)circ.push(c[0],c[1],c[2]);});
 var bx=[1e9,-1e9,1e9,-1e9,1e9,-1e9];for(var i=0;i<P.length;i+=3){if(Mm[i/3*2]===2)continue;bx[0]=Math.min(bx[0],P[i]);bx[1]=Math.max(bx[1],P[i]);bx[2]=Math.min(bx[2],P[i+1]);bx[3]=Math.max(bx[3],P[i+1]);bx[4]=Math.min(bx[4],P[i+2]);bx[5]=Math.max(bx[5],P[i+2]);}
 if(mod.mesh){var mb=mod.mesh.bmin,mx=mod.mesh.bmax;bx=[Math.min(bx[0],mb[0]),Math.max(bx[1],mx[0]),Math.min(bx[2],Math.max(mb[1],-.2)),Math.max(bx[3],mx[1]),Math.min(bx[4],mb[2]),Math.max(bx[5],mx[2])];}
 var tk=(mod.m.tk||[]).concat(mod.tanks||[]).slice(0,24);this.tk=new Float32Array(24*4);tk.forEach(function(t,i){self.tk.set(t,i*4)});this.ntk=tk.length;
 this.box=bx;this.n=P.length/3;this.circ=new Float32Array(48*3);this.circ.set(circ);this.nc=circ.length/3;
 (this.bufs||[]).forEach(function(b){gl.deleteBuffer(b)});this.bufs=[];if(this.vao)gl.deleteVertexArray(this.vao);if(this.vaoM){gl.deleteVertexArray(this.vaoM);this.vaoM=null;}
 function loc(n){return gl.getAttribLocation(pr.p,n)}
 this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);
 [["aP",P,3],["aN",N,3],["aC",Cc,3],["aM",Mm,2]].forEach(function(a){var L=loc(a[0]);if(L<0)return;var b=gl.createBuffer();self.bufs.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a[1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,a[2],gl.FLOAT,false,0,0);});
 if(mod.mesh){var ms=mod.mesh;this.vaoM=gl.createVertexArray();gl.bindVertexArray(this.vaoM);var vb=gl.createBuffer(),ib=gl.createBuffer();this.bufs.push(vb,ib);
  gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,ms.vb,gl.STATIC_DRAW);
  var L=loc("aP");gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,3,gl.SHORT,false,12,0);
  L=loc("aN");gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,3,gl.BYTE,true,12,6);
  L=loc("aPI");if(L>=0){gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,1,gl.UNSIGNED_BYTE,false,12,9);}
  L=loc("aU");if(L>=0){gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,1,gl.BYTE,false,12,10);}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,ms.ib,gl.STATIC_DRAW);
  this.ni=ms.ni;this.itype=ms.i32?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT;var pal=new Float32Array(64*4);ms.pal.forEach(function(p,i){if(i<64)pal.set(p,i*4)});this.pal=pal;}
 gl.bindVertexArray(null);this.mod=mod;
 /* câmera de sombra ortográfica, ajustada à cena */
 var F=[-LW[0],-LW[1],-LW[2]],R=[F[2],0,-F[0]],rl=Math.hypot(R[0],R[2]);R=[R[0]/rl,0,R[2]/rl];var U=[R[1]*F[2]-R[2]*F[1],R[2]*F[0]-R[0]*F[2],R[0]*F[1]-R[1]*F[0]];
 var lb=[1e9,-1e9,1e9,-1e9],lz=[1e9,-1e9];for(var x=0;x<2;x++)for(var y=0;y<2;y++)for(var z=0;z<2;z++){var q=[bx[x],bx[2+y],bx[4+z]];var a=q[0]*R[0]+q[1]*R[1]+q[2]*R[2],b2=q[0]*U[0]+q[1]*U[1]+q[2]*U[2],c2=q[0]*F[0]+q[1]*F[1]+q[2]*F[2];
  lb[0]=Math.min(lb[0],a);lb[1]=Math.max(lb[1],a);lb[2]=Math.min(lb[2],b2);lb[3]=Math.max(lb[3],b2);lz[0]=Math.min(lz[0],c2);lz[1]=Math.max(lz[1],c2);}
 this.L={R:R,U:U,F:F,B:[lb[0]-.5,lb[1]+.5,lb[2]-.5,lb[3]+.5],Z:[lz[0]-.5,lz[1]+.5]};this.shOK=false;};
GLR.prototype.geom=function(mode){var gl=this.gl,u=this.P.u;gl.uniform1i(u.uMode,mode);
 gl.uniform1i(u.uMesh,0);gl.bindVertexArray(this.vao);gl.drawArrays(gl.TRIANGLES,0,this.n);
 if(this.vaoM){gl.uniform1i(u.uMesh,1);gl.uniform1f(u.uPS,.001);gl.uniform4fv(u.uPal,this.pal);gl.bindVertexArray(this.vaoM);gl.drawElements(gl.TRIANGLES,this.ni,this.itype,0);}
 gl.bindVertexArray(null);};
GLR.prototype.common=function(v){var gl=this.gl,u=this.P.u,L=this.L;gl.useProgram(this.P.p);
 gl.uniform3fv(u.uLR,L.R);gl.uniform3fv(u.uLU,L.U);gl.uniform3fv(u.uLF,L.F);gl.uniform4fv(u.uLB,L.B);gl.uniform2fv(u.uLZ,L.Z);
 var cy=Math.cos(v.yaw),sy=Math.sin(v.yaw),cp=Math.cos(v.pitch),sp=Math.sin(v.pitch);
 gl.uniform4f(u.uCam,cy,sy,cp,sp);gl.uniform4f(u.uScr,v.w,v.h,v.scale(),0);
 var dv=[sy*cp,-sp,cy*cp];gl.uniform3f(u.uV,-dv[0],-dv[1],-dv[2]);gl.uniform3fv(u.uL,LW);gl.uniform3f(u.uEye,-30*cp*sy,30*sp+1.4,-30*cp*cy);
 gl.uniform1f(u.uSel,v.sel>=0?v.sel:-1);gl.uniform3fv(u.uCirc,this.circ);gl.uniform1i(u.uNC,this.nc);gl.uniform4fv(u.uTk,this.tk);gl.uniform1i(u.uNT,this.logoOK?this.ntk:0);var y0=this.mod.yaw||0;gl.uniform1f(u.uDA,Math.atan2(-Math.cos(y0),-Math.sin(y0)));return[cy,sy,cp,sp];};
GLR.prototype.render=function(v){var gl=this.gl;if(this.mod!==v.mod)this.upload(v.mod);var u=this.P.u,W=this.cv.width,H=this.cv.height;
 gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);
 var cam=this.common(v);
 if(!this.shOK){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,null);gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb);gl.viewport(0,0,2048,2048);gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(2,4);this.geom(1);gl.disable(gl.POLYGON_OFFSET_FILL);this.shOK=true;}
 /* SSAO: normais e profundidade em meia resolução, oclusão e desfoque */
 if(this.ssao){try{this.targets(W,H);var tw=this.tw,th=this.th;
  gl.bindFramebuffer(gl.FRAMEBUFFER,this.fN);gl.viewport(0,0,tw,th);gl.clearColor(.5,.5,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);this.geom(2);
  gl.disable(gl.DEPTH_TEST);gl.bindVertexArray(this.vaoE);
  gl.useProgram(this.PA.p);gl.bindFramebuffer(gl.FRAMEBUFFER,this.fA);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.tD);gl.uniform1i(this.PA.u.uD,1);
  gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,this.tN);gl.uniform1i(this.PA.u.uN,2);gl.uniform4f(this.PA.u.uScr,v.w,v.h,v.scale(),0);gl.uniform2f(this.PA.u.uRes,tw,th);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.useProgram(this.PB.p);gl.bindFramebuffer(gl.FRAMEBUFFER,this.fB);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.tA);gl.uniform1i(this.PB.u.uA,1);gl.uniform2f(this.PB.u.uRes,tw,th);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,null);
  gl.bindVertexArray(null);gl.enable(gl.DEPTH_TEST);}catch(e){this.ssao=false;}}
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.clearColor(.8,.86,.92,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 /* céu */
 gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.useProgram(this.PS.p);gl.uniform4f(this.PS.u.uCam,cam[0],cam[1],cam[2],cam[3]);gl.uniform4f(this.PS.u.uScr,v.w,v.h,v.scale(),0);gl.uniform2f(this.PS.u.uRes,W,H);gl.uniform3fv(this.PS.u.uL,LW);
 gl.bindVertexArray(this.vaoE);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindVertexArray(null);gl.depthMask(true);gl.enable(gl.DEPTH_TEST);
 /* cena */
 this.common(v);gl.uniform2f(u.uRes,W,H);gl.uniform1f(u.uSSAO,this.ssao?1:0);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.sm);gl.uniform1i(u.uSM,0);
 gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,this.logo);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,this.ssao?this.tB:null);gl.uniform1i(u.uAO,3);
 gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);this.geom(0);gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
 gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE0);};
/* seleção pelo toque: desenha o número de cada unidade numa imagem fora da tela e lê o pixel */
GLR.prototype.pickAt=function(v,x,y){var gl=this.gl,W=this.cv.width,H=this.cv.height;if(this.mod!==v.mod)this.upload(v.mod);
 if(!this.fP||this.pw!==W||this.ph!==H){if(this.fP){gl.deleteFramebuffer(this.fP);gl.deleteTexture(this.tP);gl.deleteRenderbuffer(this.rP);}this.pw=W;this.ph=H;
  this.tP=this.tex(W,H,gl.RGBA,gl.RGBA8,gl.UNSIGNED_BYTE,gl.NEAREST);this.rP=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,this.rP);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,W,H);
  this.fP=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,this.fP);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.tP,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.rP);gl.bindTexture(gl.TEXTURE_2D,null);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.sm);}
 gl.bindFramebuffer(gl.FRAMEBUFFER,this.fP);gl.viewport(0,0,W,H);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
 this.common(v);this.geom(3);var px=new Uint8Array(4),d=v.dpr||1;gl.readPixels(Math.round(x*d),Math.round(H-y*d),1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 return px[0]-1;};

/* ===== modelos reais (geometria dos projetos IFC/Revit da SANEAR, convertida e compactada) ===== */
var MESHURL={ete:"modelos/ms.json",ete2:"modelos/cm.json",eta:"modelos/eta.json"},MESHC={};
function unitBoxes(hd,vb){var B={},dv=new DataView(vb.buffer,vb.byteOffset,vb.byteLength);for(var i=0;i<hd.nv;i++){var u=dv.getInt8(i*12+10);if(u<0)continue;var x=dv.getInt16(i*12,true)/1e3,y=dv.getInt16(i*12+2,true)/1e3,z=dv.getInt16(i*12+4,true)/1e3;if(y<0)continue;var b=B[u]||(B[u]=[1e9,1e9,1e9,-1e9,-1e9,-1e9]);
  if(x<b[0])b[0]=x;if(y<b[1])b[1]=y;if(z<b[2])b[2]=z;if(x>b[3])b[3]=x;if(y>b[4])b[4]=y;if(z>b[5])b[5]=z;}return B;}
function meshTanks(hd,vb){var dv=new DataView(vb.buffer,vb.byteOffset,vb.byteLength),out=[],tc=hd.pal.map(function(p){return p[3]===0&&p[0]<.6;});
 (hd.circ||[]).forEach(function(c){var r0=c[2]+.45,h=0,i,x,y,z,d;
  for(i=0;i<hd.nv;i++){if(!tc[dv.getUint8(i*12+9)])continue;x=dv.getInt16(i*12,true)/1e3-c[0];z=dv.getInt16(i*12+4,true)/1e3-c[1];d=Math.hypot(x,z);if(d<c[2]+.25){y=dv.getInt16(i*12+2,true)/1e3;if(y>h)h=y;}}
  var hist={},r=0,best=0;for(i=0;i<hd.nv;i++){if(!tc[dv.getUint8(i*12+9)])continue;if(Math.abs(dv.getInt8(i*12+7))>60)continue;x=dv.getInt16(i*12,true)/1e3-c[0];z=dv.getInt16(i*12+4,true)/1e3-c[1];d=Math.hypot(x,z);if(d<c[2]+.15&&d>.3){var kk=Math.round(d*50);hist[kk]=(hist[kk]||0)+1;}}
  for(var kk in hist){if(hist[kk]>best){best=hist[kk];r=kk/50;}}
  if(r>=.45&&h>.8)out.push([c[0],c[1],r,h]);});return out;}
function loadMesh(k){if(MESHC[k])return MESHC[k];
 MESHC[k]=fetch(MESHURL[k]).then(function(r){if(!r.ok)throw r.status;return r.json();}).then(function(js){var bs=atob(js.b),u8=new Uint8Array(bs.length);for(var q=0;q<bs.length;q++)u8[q]=bs.charCodeAt(q);var buf=u8.buffer;var dv=new DataView(buf);
  if(dv.getUint32(0,true)!==0x33524e53)throw"fmt";var hl=dv.getUint32(4,true),hd=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,8,hl))),o=8+hl;
  var vb=new Uint8Array(buf,o,hd.nv*12);o+=hd.nv*12;var ib=hd.i32?new Uint32Array(buf,o,hd.ni):new Uint16Array(buf,o,hd.ni);
  var m=new M();m.box(0,-.07,0,320,.05,320,C.grass,-2);m.box((hd.bmin[0]+hd.bmax[0])/2,-.055,(hd.bmin[2]+hd.bmax[2])/2,hd.bmax[0]-hd.bmin[0]+3,.05,hd.bmax[2]-hd.bmin[2]+3,C.gravel,-2);
  var ext=Math.max(hd.bmax[0]-hd.bmin[0],hd.bmax[2]-hd.bmin[2]);
  var hgt=hd.bmax[1];return{m:m,u:hd.units,title:hd.title,span:ext*1.05+1,vh:Math.max(9.5,ext*.6+hgt*.45),yaw:hd.yaw,circ:hd.circ,occ:unitBoxes(hd,vb),tanks:meshTanks(hd,vb),mesh:{vb:vb,ib:ib,ni:hd.ni,i32:hd.i32,pal:hd.pal,bmin:hd.bmin,bmax:hd.bmax}};});
 MESHC[k].catch(function(){delete MESHC[k];});return MESHC[k];}

function View(root){var self=this;this.root=root;
 var kinds=(root.getAttribute("data-models")||"ete,eta").split(",");
 var bar=root.querySelector(".v3tabs");
 this.cv=root.querySelector("canvas");
 try{if(window.V3_NOGL)throw 0;this.glr=new GLR(this.cv);var ov=document.createElement("canvas");ov.className="v3ov";ov.setAttribute("aria-hidden","true");this.cv.parentNode.insertBefore(ov,this.cv.nextSibling);this.ov=ov;this.ctx=ov.getContext("2d");this.glr.onready=function(){self.draw();};}catch(e){window.V3_ERR=String(e);this.glr=null;var nc=this.cv.cloneNode(false);this.cv.parentNode.replaceChild(nc,this.cv);this.cv=nc;this.ctx=this.cv.getContext("2d");}
 this.info=root.querySelector(".v3info");this.list=root.querySelector(".v3list");
 this.yaw=-.6;this.pitch=.42;this.zoom=1;this.auto=true;this.sel=-1;this.cotas=root.hasAttribute("data-cotas")&&(window.innerWidth||0)>=600;
 if(bar){kinds.forEach(function(k,i){var b=document.createElement("button");b.type="button";b.className="tab"+(i?"":" on");b.textContent=LABEL[k];b.onclick=function(){bar.querySelectorAll(".tab").forEach(function(x){x.classList.remove("on")});b.classList.add("on");self.load(k)};bar.appendChild(b);});}
 var drag=null,pts={},pinch=null;
 this.cv.addEventListener("pointerdown",function(e){pts[e.pointerId]=[e.clientX,e.clientY];var ks=Object.keys(pts);if(ks.length===2){var a=pts[ks[0]],b=pts[ks[1]];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),z:self.zoom};drag=null;return;}
  drag={x:e.clientX,y:e.clientY,yaw:self.yaw,p:self.pitch,moved:false};self.auto=false;try{self.cv.setPointerCapture(e.pointerId)}catch(_){}});
 this.cv.addEventListener("pointermove",function(e){if(pts[e.pointerId])pts[e.pointerId]=[e.clientX,e.clientY];
  if(pinch){var ks=Object.keys(pts);if(ks.length===2){var a=pts[ks[0]],b=pts[ks[1]];self.zoom=Math.max(.6,Math.min(3,pinch.z*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch.d));self.draw();}return;}
  if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;self.yaw=drag.yaw+dx*.01;self.pitch=Math.max(.05,Math.min(1.35,drag.p+dy*.008));self.draw();});
 function up(e){delete pts[e.pointerId];if(pinch){if(Object.keys(pts).length<2)pinch=null;drag=null;return;}if(drag&&!drag.moved&&e.type==="pointerup"){var r=self.cv.getBoundingClientRect();self.pick(e.clientX-r.left,e.clientY-r.top);}drag=null;}
 this.cv.addEventListener("pointerup",up);this.cv.addEventListener("pointercancel",up);
 this.cv.addEventListener("wheel",function(e){if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();self.zoom=Math.max(.6,Math.min(3,self.zoom*(e.deltaY<0?1.1:1/1.1)));self.draw();},{passive:false});
 root.querySelectorAll("[data-z]").forEach(function(b){b.onclick=function(){var z=b.getAttribute("data-z");if(z==="r"){self.yaw=self.mod.yaw;self.pitch=.42;self.zoom=1;self.auto=true;}else if(z==="c"){self.cotas=!self.cotas;b.classList.toggle("on",self.cotas);}else self.zoom=Math.max(.6,Math.min(3,self.zoom*(z==="+"?1.2:1/1.2)));self.draw();};if(b.getAttribute("data-z")==="c")b.classList.toggle("on",self.cotas);});
 window.addEventListener("resize",function(){self.size();self.draw();});
 if(kinds[0]==="sim"){this.mod=simModel({tipo:"esgoto",units:[{n:1,d:2,h:4.5,label:"UASB"}]});}else this.load(kinds[0]);this.size();
 var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduce)this.auto=false;
 var last=0;function loop(t){if(self.auto&&self.visible){self.yaw+=Math.min(50,t-last)*.00025;self.draw();}last=t;requestAnimationFrame(loop);}requestAnimationFrame(loop);
 this.visible=true;if("IntersectionObserver"in window){new IntersectionObserver(function(es){self.visible=es[0].isIntersecting;}).observe(this.cv);}
 this.draw();}
View.prototype.scale=function(){return Math.min(this.w/(this.mod.span*.8+1.5),this.h/(this.mod.vh||9.5))*this.zoom;};
View.prototype.size=function(){var r=this.cv.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);this.w=r.width;this.h=r.height;this.cv.width=r.width*d;this.cv.height=r.height*d;if(this.ov){this.ov.width=r.width*d;this.ov.height=r.height*d;}this.ctx.setTransform(d,0,0,d,0,0);this.dpr=d;};
View.prototype.load=function(k){var self=this;this.cur=k;this.sel=-1;this.pitch=.42;this.zoom=1;
 function show(mod){self.mod=mod;self.yaw=mod.yaw;self.list.innerHTML="";mod.u.forEach(function(u,i){var b=document.createElement("button");b.type="button";b.className="st";b.innerHTML="<i>"+(i+1)+"</i>"+u.n;b.onclick=function(){self.select(u.id)};self.list.appendChild(b);});
  self.info.innerHTML="<b>"+mod.title+"</b><p>Toque em uma unidade no desenho ou na lista para ver o que acontece nela. Arraste para girar.</p>";self.draw();}
 if(this.glr&&MESHURL[k]){if(!this.mod)show(MODELS[k]());this.busy(true);
  loadMesh(k).then(function(mod){if(self.cur!==k)return;self.busy(false);show(mod);}).catch(function(){if(self.cur!==k)return;self.busy(false);show(MODELS[k]());});}
 else show(MODELS[k]());};
View.prototype.busy=function(on){var w=this.cv.parentNode,b=w.querySelector(".v3load");if(on&&!b){b=document.createElement("span");b.className="v3load";b.textContent="Carregando o modelo 3D do projeto…";w.appendChild(b);}if(!on&&b)b.remove();};
View.prototype.select=function(id){this.sel=this.sel===id?-1:id;id=this.sel;var u=this.mod.u.filter(function(x){return x.id===id})[0];
 if(this.list)this.list.querySelectorAll(".st").forEach(function(b,i){b.classList.toggle("on",i===id)});
 if(this.info)this.info.innerHTML=u?"<b>"+(id+1)+". "+u.n+"</b><p>"+u.t+"</p>":"";this.draw();};
View.prototype.tf=function(p){var cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
 var x=p[0]*cy-p[2]*sy,z=p[0]*sy+p[2]*cy,y=p[1]-1.4;var y2=y*cp+z*sp,z2=-y*sp+z*cp;
 var D=30,s=this.scale()*D/(D+z2);return[this.w/2+x*s,this.h*.6-y2*s,z2];};
var LW=(function(){var l=[-.45,1,-.55],n=Math.hypot(l[0],l[1],l[2]);return[l[0]/n,l[1]/n,l[2]/n];})();
var MATTE=[C.conc,C.grass,C.base,C.dark,C.lid,C.gravel,C.slab];
function noisePat(ctx,base,amp,fib){var c=document.createElement("canvas");c.width=c.height=128;var g=c.getContext("2d"),im=g.createImageData(128,128);
 for(var i=0;i<im.data.length;i+=4){var r=(Math.random()-.5)*amp;im.data[i]=base+r;im.data[i+1]=base+r;im.data[i+2]=base+r;im.data[i+3]=255;}g.putImageData(im,0,0);
 if(fib){g.globalAlpha=.35;for(var k=0;k<260;k++){g.strokeStyle=Math.random()<.5?"#fff":"#000";g.lineWidth=.6;var x=Math.random()*128,y=Math.random()*128,a=Math.random()*6.3,l=4+Math.random()*9;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}}
 return ctx.createPattern(c,"repeat");}
function hull(P){P.sort(function(a,b){return a[0]-b[0]||a[1]-b[1]});if(P.length<3)return P;var cr=function(o,a,b){return(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])};var lo=[],up=[],i;
 for(i=0;i<P.length;i++){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],P[i])<=0)lo.pop();lo.push(P[i]);}
 for(i=P.length-1;i>=0;i--){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],P[i])<=0)up.pop();up.push(P[i]);}up.pop();lo.pop();return lo.concat(up);}
View.prototype.shade=function(n,c,gl,flip){var s=flip?-1:1,nx=n[0]*s,ny=n[1]*s,nz=n[2]*s;
 var d=Math.max(0,nx*LW[0]+ny*LW[1]+nz*LW[2]),amb=.40+.14*ny;
 var V=this.V,hx=LW[0]+V[0],hy=LW[1]+V[1],hz=LW[2]+V[2],hl=Math.hypot(hx,hy,hz)||1,sp=gl?Math.pow(Math.max(0,(nx*hx+ny*hy+nz*hz)/hl),38)*gl:0;
 var rim=gl?Math.pow(1-Math.abs(nx*V[0]+ny*V[1]+nz*V[2]),3)*.12:0;var k=amb+.68*d;
 return[Math.min(255,c[0]*k+255*(sp+rim)),Math.min(255,c[1]*k+255*(sp+rim)),Math.min(255,c[2]*k+255*(sp+rim))];};
function f2(x){return x.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
/* cotas: linhas de dimensão (altura e diâmetro) desenhadas sobre o 3D, como num desenho técnico */
View.prototype.drawCotas=function(ctx){var self=this,cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),R=[cy,0,-sy];
 ctx.save();ctx.lineWidth=1.2;ctx.font="600 11.5px system-ui,sans-serif";ctx.textBaseline="middle";
 function lab(t,x,y,al){ctx.textAlign=al||"center";var w=ctx.measureText(t).width+8,x0=al==="left"?x:al==="right"?x-w:x-w/2;ctx.fillStyle="rgba(255,255,255,.88)";ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x0,y-8,w,16,4);else ctx.rect(x0,y-8,w,16);ctx.fill();ctx.fillStyle="#0b2f6e";ctx.fillText(t,al==="left"?x+4:al==="right"?x-4:x,y+.5);}
 function tick(p,ang){var dx=Math.cos(ang)*5,dy=Math.sin(ang)*5;ctx.beginPath();ctx.moveTo(p[0]-dx,p[1]-dy);ctx.lineTo(p[0]+dx,p[1]+dy);ctx.stroke();}
 this.mod.u.forEach(function(u){var g=u.g;if(!g)return;if(self.sel>=0&&self.sel!==u.id)return;ctx.strokeStyle="#0b2f6e";
  var r=g.sq?g.r*Math.SQRT2:g.r,off=r+.32,bx=g.x+R[0]*off,bz=g.z+R[2]*off;
  var a=self.tf([bx,g.y0||0,bz]),b=self.tf([bx,(g.y0||0)+g.h,bz]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();var an=Math.atan2(b[1]-a[1],b[0]-a[0])+Math.PI/4;tick(a,an);tick(b,an);
  lab(f2(g.h)+" m",(a[0]+b[0])/2+6,(a[1]+b[1])/2,"left");
  var yt=(g.y0||0)+g.h+.12,p=self.tf([g.x-R[0]*g.r,yt,g.z-R[2]*g.r]),q=self.tf([g.x+R[0]*g.r,yt,g.z+R[2]*g.r]);
  ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();var aq=Math.atan2(q[1]-p[1],q[0]-p[0])+Math.PI/4;tick(p,aq);tick(q,aq);
  lab((g.sq?"":"Ø ")+f2(g.r*2)+(g.sq?" × "+f2(g.r*2):"")+" m"+(g.n>1?"  ("+g.n+"×)":""),(p[0]+q[0])/2,(p[1]+q[1])/2-12);});
 ctx.restore();};
View.prototype.hidden=function(u){var B=this.mod.occ;if(!B)return false;var cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
 var e=[-30*cp*sy,30*sp+1.4,-30*cp*cy],t=u.at,d=[t[0]-e[0],t[1]-e[1],t[2]-e[2]];
 for(var k in B){if(+k===u.id)continue;var b=B[k],t0=0,t1=1,ok=true;for(var a=0;a<3&&ok;a++){if(Math.abs(d[a])<1e-9){if(e[a]<b[a]||e[a]>b[a+3])ok=false;continue;}var q0=(b[a]-e[a])/d[a],q1=(b[a+3]-e[a])/d[a];if(q0>q1){var w=q0;q0=q1;q1=w;}t0=Math.max(t0,q0);t1=Math.min(t1,q1);if(t0>t1)ok=false;}
  if(ok&&t1<.995)return true;}return false;};
View.prototype.marks=function(ctx){var self=this;if(window.V3_NOMARK)return;
 this.mod.u.forEach(function(u,i){var p=self.tf(u.at),on=self.sel===u.id,hid=!on&&self.hidden(u);ctx.globalAlpha=hid?.38:1;ctx.beginPath();ctx.arc(p[0],p[1],on?14:12,0,Math.PI*2);ctx.fillStyle=on?"#e98a15":"#0b46b8";ctx.fill();ctx.lineWidth=2;ctx.strokeStyle="#fff";ctx.stroke();
  ctx.fillStyle="#fff";ctx.font="bold 13px system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(i+1),p[0],p[1]+.5);ctx.globalAlpha=1;u.sp=p;});};
View.prototype.draw=function(){if(!this.mod||!this.w)return;var ctx=this.ctx,self=this;
 if(this.glr){try{this.glr.render(this);ctx.clearRect(0,0,this.w,this.h);this.F=null;if(this.cotas)this.drawCotas(ctx);this.marks(ctx);return;}catch(e){this.glr=null;if(this.ov){this.ov.remove();this.ov=null;}this.cv=this.cv;}}
 if(!this.pat){this.pat={conc:noisePat(ctx,128,70),grass:noisePat(ctx,128,120),fib:noisePat(ctx,128,30,true)};}
 ctx.clearRect(0,0,this.w,this.h);
 var cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);
 /* vetor da superfície para a câmera, no mundo (eixo de profundidade invertido) */
 var dv=[sy*cp,-sp,cy*cp];this.V=[-dv[0],-dv[1],-dv[2]];
 var F=[],objs={};this.mod.m.f.forEach(function(f){var q=f.p.map(function(p){return self.tf(p)});
  var a=q[0],b=q[1],c=q[2];var cr=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  if(f.id>-2){var O=objs[f.o]||(objs[f.o]=[]);if(O.length<400)f.p.forEach(function(p){O.push(p)});}
  if(cr<0&&!f.two)return;
  var p0=f.p[0],p1=f.p[1],p2=f.p[2];var u=[p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2]],v=[p2[0]-p0[0],p2[1]-p0[1],p2[2]-p0[2]];
  var n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],nl=Math.hypot(n[0],n[1],n[2])||1;n=[n[0]/nl,n[1]/nl,n[2]/nl];
  var flip=(n[0]*self.V[0]+n[1]*self.V[1]+n[2]*self.V[2])<0;
  var z=0;q.forEach(function(p){z+=p[2]});
  F.push({q:q,z:z/q.length,o:f.o,c:f.c,n:n,flip:flip,ns:f.ns,id:f.id,g:f.id===-2?(f.p[0][1]<-.01?3:2):(f.id===-3?1:0)});});
 var OD={},ON={};F.forEach(function(f){OD[f.o]=(OD[f.o]||0)+f.z;ON[f.o]=(ON[f.o]||0)+1;});F.forEach(function(f){f.oz=OD[f.o]/ON[f.o];});
 F.sort(function(a,b){return (b.g-a.g)||(b.oz-a.oz)||(b.z-a.z)});this.F=F;
 var shadowsDone=false;
 function shadows(){ctx.save();ctx.fillStyle="rgba(18,28,18,.26)";
  for(var k in objs){var P=objs[k].map(function(p){var t=Math.max(0,p[1]-.08)/LW[1];var g=self.tf([p[0]-LW[0]*t,.081,p[2]-LW[2]*t]);return[g[0],g[1]];});
   var H=hull(P);if(H.length<3)continue;ctx.beginPath();H.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();ctx.fill();}
  ctx.restore();shadowsDone=true;}
 F.forEach(function(f){if(!shadowsDone&&f.g<2)shadows();
  var c=f.c,hl=self.sel>=0&&f.id===self.sel,dim=self.sel>=0&&f.id!==self.sel&&f.id>=0;
  var matte=MATTE.indexOf(c)>=0||f.g>0,gl=matte?0:.55;
  var tint=function(r){if(hl)r=[r[0]*.75+255*.25,r[1]*.75+190*.25,r[2]*.75+60*.25];if(dim)r=[r[0]*.7+235*.3,r[1]*.7+235*.3,r[2]*.7+235*.3];return"rgb("+(r[0]|0)+","+(r[1]|0)+","+(r[2]|0)+")";};
  var fill;
  if(f.ns){var a1=self.shade(f.ns[0],c,gl,false),a2=self.shade(f.ns[1],c,gl,false);
   var e1=[(f.q[0][0]+f.q[1][0])/2,(f.q[0][1]+f.q[1][1])/2],e2=[(f.q[2][0]+f.q[3][0])/2,(f.q[2][1]+f.q[3][1])/2];
   if(f.q.length>3&&Math.hypot(e2[0]-e1[0],e2[1]-e1[1])>.5){fill=ctx.createLinearGradient(e1[0],e1[1],e2[0],e2[1]);fill.addColorStop(0,tint(a1));fill.addColorStop(1,tint(a2));}else fill=tint(a1);}
  else fill=tint(self.shade(f.n,c,gl,f.flip));
  ctx.beginPath();f.q.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=.7;ctx.stroke();
  var pat=c===C.conc||c===C.base||c===C.gravel?self.pat.conc:c===C.grass?self.pat.grass:(!matte&&f.id>=0?self.pat.fib:null);
  if(pat){ctx.globalAlpha=c===C.grass?.22:(pat===self.pat.fib?.10:.16);ctx.globalCompositeOperation="overlay";ctx.fillStyle=pat;ctx.fill();ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";}});
 if(!shadowsDone)shadows();
 if(this.cotas)this.drawCotas(ctx);this.marks(ctx);};
View.prototype.pick=function(x,y){var u=this.mod.u;for(var i=0;i<u.length;i++){if(u[i].sp&&Math.hypot(u[i].sp[0]-x,u[i].sp[1]-y)<18){this.select(u[i].id);return;}}
 if(this.glr){try{var id=this.glr.pickAt(this,x,y);this.draw();if(id>=0&&id<u.length){this.select(id);return;}if(this.sel>=0)this.select(this.sel);return;}catch(e){}}
 if(!this.F)this.F=this.projF();
 for(var j=this.F.length-1;j>=0;j--){var f=this.F[j];if(f.id<0)continue;if(inside(x,y,f.q)){this.select(f.id);return;}}
 if(this.sel>=0)this.select(this.sel);};
View.prototype.projF=function(){var self=this,F=[],OD={},ON={};this.mod.m.f.forEach(function(f){if(f.id<0)return;var q=f.p.map(function(p){return self.tf(p)});var a=q[0],b=q[1],c=q[2];var cr=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(cr<0&&!f.two)return;var z=0;q.forEach(function(p){z+=p[2]});F.push({q:q,z:z/q.length,o:f.o,id:f.id});});
 F.forEach(function(f){OD[f.o]=(OD[f.o]||0)+f.z;ON[f.o]=(ON[f.o]||0)+1;});F.forEach(function(f){f.oz=OD[f.o]/ON[f.o];});F.sort(function(a,b){return(b.oz-a.oz)||(b.z-a.z)});return F;};
function inside(x,y,q){var c=false;for(var i=0,j=q.length-1;i<q.length;j=i++){if(((q[i][1]>y)!==(q[j][1]>y))&&(x<(q[j][0]-q[i][0])*(y-q[i][1])/(q[j][1]-q[i][1])+q[i][0]))c=!c;}return c;}
/* novo modelo do simulador: mantém o ângulo que a pessoa escolheu enquanto ela digita */
View.prototype.setModel=function(mod){var first=!this.mod||!this.simInit;this.mod=mod;if(this.sel>=mod.u.length)this.sel=-1;if(first){this.yaw=mod.yaw;this.simInit=true;}
 if(this.info&&this.sel<0)this.info.innerHTML="";if(this.list){var self=this;this.list.innerHTML="";mod.u.forEach(function(u,i){var b=document.createElement("button");b.type="button";b.className="st";b.innerHTML="<i>"+(i+1)+"</i>"+u.n;b.onclick=function(){self.select(u.id)};self.list.appendChild(b);});this.list.hidden=false;}
 this.draw();};
/* imagem do desenho em alta, com carimbo da SANEAR, para baixar ou enviar ao cliente */
View.prototype.snapshot=function(o){o=o||{};var W=1600,H=1130,c=document.createElement("canvas");c.width=W;c.height=H;var g=c.getContext("2d");
 var bg=g.createLinearGradient(0,0,0,860);bg.addColorStop(0,"#bcd6ef");bg.addColorStop(.55,"#dfeaf4");bg.addColorStop(1,"#eef2ef");g.fillStyle=bg;g.fillRect(0,0,W,860);
 var ow=this.w,oh=this.h,od=this.dpr;this.w=W;this.h=860;this.dpr=1;
 if(this.glr){this.cv.width=W;this.cv.height=860;}
 var oc=document.createElement("canvas");oc.width=W;oc.height=860;var octx=oc.getContext("2d"),keepCtx=this.ctx;this.ctx=octx;
 try{if(this.glr){this.glr.render(this);g.drawImage(this.cv,0,0,W,860);}else{this.draw();}
  if(this.glr){if(this.cotas)this.drawCotas(octx);this.marks(octx);}
  g.drawImage(oc,0,0);}finally{this.ctx=keepCtx;this.w=ow;this.h=oh;this.dpr=od;this.size();this.draw();}
 /* carimbo */
 g.fillStyle="#fff";g.fillRect(0,860,W,H-860);g.fillStyle="#0b46b8";g.fillRect(0,860,W,6);
 g.fillStyle="#0b3a9c";g.font="800 34px system-ui,sans-serif";g.textAlign="left";g.textBaseline="alphabetic";var lx=40;
 if(o.logo&&o.logo.complete&&o.logo.naturalWidth){g.save();g.beginPath();g.arc(80,935,44,0,Math.PI*2);g.clip();g.drawImage(o.logo,36,891,88,88);g.restore();lx=140;}
 g.fillText("SANEAR AMBIENTAL",lx,925);g.fillStyle="#4e8a1c";g.font="600 17px system-ui,sans-serif";g.fillText("Preservar | Cuidar | Transformar",lx,952);
 g.fillStyle="#10262e";g.font="700 22px system-ui,sans-serif";g.fillText(o.title||"",lx,990);
 g.fillStyle="#4b6670";g.font="16px system-ui,sans-serif";(o.lines||[]).slice(0,4).forEach(function(t,i){g.fillText(t,lx,1020+i*24);});
 g.textAlign="right";g.fillStyle="#4b6670";g.font="15px system-ui,sans-serif";
 var rt=["Simulador de dimensionamento",new Date().toLocaleDateString("pt-BR"),"(91) 98913-8154 · sanearambiental.com"];rt.forEach(function(t,i){g.fillText(t,W-40,925+i*26);});
 g.font="13px system-ui,sans-serif";g.fillText("Desenho ilustrativo. O projeto executivo é elaborado pela equipe técnica da SANEAR.",W-40,H-24);
 return c;};
window.SANEAR3D.View=View;
document.querySelectorAll(".v3").forEach(function(el){try{el._v3=new View(el)}catch(e){}});
})();
