/* SANEAR AMBIENTAL — pré-dimensionamento de ETE e ETA pelas normas, com desenho 3D */
(function(){
"use strict";
try{document.getElementById("y").textContent=new Date().getFullYear();}catch(e){}
function $(i){return document.getElementById(i)}
function num(id,def){var v=parseFloat(String($(id).value).replace(",","."));return isFinite(v)?v:def;}
function fmt(x,d){return(+x).toLocaleString("pt-BR",{maximumFractionDigits:d,minimumFractionDigits:d})}
function f2(x){return fmt(x,2)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

var DS=[1.0,1.5,2.0,2.5,3.0];/* diâmetros das formas da fábrica SANEAR */
var MAXN=12;
function A(d){return Math.PI*d*d/4}
/* menor quantidade de tanques e, nela, o menor diâmetro que atende ao volume e à área mínima */
function pick(V,hu,o){o=o||{};var dmin=o.dmin||1.5,amin=o.amin||0,nmin=o.nmin||1;
 for(var n=nmin;n<=MAXN;n++)for(var i=0;i<DS.length;i++){var d=DS[i];if(d<dmin)continue;var h=typeof hu==="function"?hu(d):hu;
  if(n*A(d)*h>=V-1e-9&&n*A(d)>=amin-1e-9)return{n:n,d:d,hu:h,v:A(d)*h,A:n*A(d),V:n*A(d)*h};}
 var d=3,h=typeof hu==="function"?hu(3):hu,n=Math.ceil(Math.max(V/(A(d)*h),amin/A(d),nmin));return{n:n,d:d,hu:h,v:A(d)*h,A:n*A(d),V:n*A(d)*h,big:true};}

/* ETA: tanques podem chegar a 8,00 m de altura total (7,50 m úteis + 0,50 m de borda).
   Para cada quantidade, tenta primeiro a altura padrão; se não couber, usa o maior diâmetro com a altura necessária até 7,50 m; só então acrescenta tanques. */
var HMAX=7.5;
function pickH(V,hb,o){o=o||{};var dmin=o.dmin||1.0,nmin=o.nmin||1;
 for(var n=nmin;n<=MAXN;n++){for(var i=0;i<DS.length;i++){var d=DS[i];if(d<dmin)continue;if(n*A(d)*hb>=V-1e-9)return{n:n,d:d,hu:hb,v:A(d)*hb,A:n*A(d),V:n*A(d)*hb};}
  var dM=DS[DS.length-1],h=Math.ceil(V/(n*A(dM))*10)/10;if(h<=HMAX)return{n:n,d:dM,hu:Math.max(hb,h),v:A(dM)*Math.max(hb,h),A:n*A(dM),V:n*A(dM)*Math.max(hb,h)};}
 var d=DS[DS.length-1],n=Math.ceil(V/(A(d)*HMAX));return{n:n,d:d,hu:HMAX,v:A(d)*HMAX,A:n*A(d),V:n*A(d)*HMAX,big:true};}

/* ---------- ETE ---------- */
function ete(Qmed,ctx){
 var K1=ctx.K1,K2=ctx.K2,T=ctx.T,S0=ctx.S0,Qmax=Qmed*K1*K2,qh=Qmed/24,qx=Qmax/24,U=[],R=[],big=false;
 var carga0=Qmed*S0/1000;
 if(ctx.biodig){U.push({label:"Biodigestor SB 1200",n:1,d:1.2,h:1.5,nod:true,info:"Biodigestor em PRFV da SANEAR para famílias de até 5 pessoas."});
  R.push(["Biodigestor","Vazão de esgoto",fmt(Qmed*1000,0)+" L/dia","até 12.000 L/dia","NBR 17076:2024",Qmed<=12]);
  return{U:U,R:R,Qmed:Qmed,Qmax:Qmax,sol:"Biodigestor SB 1200",txt:"Biodigestor em PRFV que atende famílias de até 5 pessoas.",nb:"Sistema de menor porte: ABNT NBR 17076:2024",S2:null};}
 /* Reator UASB — NBR 12209:2011, 6.4 */
 var tdh=T>25?6:T>=22?7:T>=18?8:10,tl=T>25?"esgoto acima de 25 °C":T>=22?"esgoto entre 22 e 25 °C":T>=18?"esgoto entre 18 e 21 °C":"esgoto abaixo de 18 °C";
 var hU=4.5;/* altura útil padrão SANEAR (altura total 5,00 m) */
 var ua=pick(qh*tdh,hU,{amin:Math.max(qh/0.7,qx/1.2)});big=big||ua.big;
 var tdhU=ua.V/qh,vm=qh/ua.A,vx=qx/ua.A;
 R.push(["Reator UASB","Tempo de detenção (vazão média)",f2(tdhU)+" h","≥ "+tdh+" h ("+tl+")","NBR 12209:2011, 6.4.3",tdhU>=tdh-1e-6]);
 R.push(["Reator UASB","Velocidade ascensional (vazão média)",f2(vm)+" m/h","≤ 0,70 m/h","NBR 12209:2011, 6.4",vm<=.7+1e-6]);
 R.push(["Reator UASB","Velocidade ascensional (vazão máxima)",f2(vx)+" m/h","≤ 1,20 m/h","NBR 12209:2011, 6.4",vx<=1.2+1e-6]);
 R.push(["Reator UASB","Profundidade útil",f2(ua.hu)+" m","4,00 a 6,00 m","NBR 12209:2011, 6.4.5",ua.hu>=4&&ua.hu<=6]);
 var S1=S0*(1-.65),carga1=Qmed*S1/1000;
 /* Filtro aerado submerso (biofiltro aerado submerso) */
 var hF=4.0;/* altura útil padrão SANEAR (altura total 4,50 m) */
 var fs=pick(qh*1.2,hF,{dmin:1.0});big=big||fs.big;
 var cov=carga1/fs.V,tdhF=fs.V/qh;
 R.push(["Filtro aerado (FAS)","Tempo de detenção (vazão média)",f2(tdhF)+" h","≥ 1,20 h","Planilha de dimensionamento SANEAR",tdhF>=1.2-1e-6]);
 /* Decantador secundário */
 var hD=2.0;/* planilha SANEAR: volume útil na parte cilíndrica de 2,00 m (altura útil 3,60 m com o fundo cônico; altura total 4,00 m) */
 var dc=pick(qh*1.5,hD,{amin:Qmed/36,dmin:1.0});big=big||dc.big;
 var tm=Qmed/dc.A,tx=Qmax/dc.A,tdhD=dc.V/qh;
 R.push(["Decantador (DS)","Taxa de aplicação superficial (vazão média)",f2(tm)+" m³/m²·dia","≤ 36 m³/m²·dia","Planilha de dimensionamento SANEAR",tm<=36+1e-6]);
 R.push(["Decantador (DS)","Tempo de detenção (vazão média)",f2(tdhD)+" h","≥ 1,50 h","Critério de projeto adotado",tdhD>=1.5-1e-6]);
 /* Desinfecção */
 var hT=1.5;/* altura útil padrão SANEAR (altura total 2,00 m) */
 var td=pick(qh*.5,hT,{dmin:1.0});big=big||td.big;
 var tc=td.V/qh*60;
 R.push(["Desinfecção (TD)","Tempo de contato com cloro (vazão média)",fmt(tc,0)+" min","≥ 30 min","NBR 12209:2011",tc>=30-1e-6]);
 /* Filtros de biogás: carvão ativado, troca mensal, forma Ø0,60 × 1,00 m (método do memorial SANEAR) */
 var mca=Qmed/451.2*1.564,kgf=Math.PI*0.09*0.6*500,nbg=Math.max(1,Math.ceil(mca*30/kgf));
 var S2=S1*(1-.80),ef=(1-S2/S0)*100;
 R.push(["Efluente tratado","DBO estimada na saída",fmt(S2,0)+" mg/L ("+fmt(ef,0)+"% de remoção)","≤ 120 mg/L","CONAMA 430/2011, art. 21",S2<=120]);
 U.push({label:"Tratamento preliminar",kind:"prelim",n:1,d:Math.min(3.5,1.6+Qmed/400),h:.8,info:"Grade, caixa de areia e medidor de vazão, em concreto. Retêm sólidos grosseiros e areia (NBR 12209).",nodim:true});
 /* Estação elevatória: poço com 2 bombas submersíveis (1 reserva), ciclo mínimo de 10 min (NBR 12208) */
 var qb=Qmax/1440,vel=Math.max(.5,qb*10/4),le=Math.max(1.3,Math.ceil(Math.sqrt(vel/1.2)*10)/10);
 R.push(["Estação elevatória","Volume útil do poço (ciclo de 10 min)",f2(vel)+" m³","≥ "+f2(qb*10/4)+" m³","NBR 12208:2020",true]);
 U.push({label:"Estação elevatória",kind:"elev",n:1,d:le,h:.8,info:"Poço em concreto de "+f2(le)+" × "+f2(le)+" m com duas bombas submersíveis (uma reserva), volume útil de "+f2(vel)+" m³ para ciclo de 10 min (NBR 12208). Recalca o esgoto até o reator UASB.",nodim:true});
 U.push({label:"Reator UASB",n:ua.n,d:ua.d,h:ua.hu+.5,hu:ua.hu,v:ua.v,info:"Reator anaeróbio em PRFV. Tempo de detenção de "+f2(tdhU)+" h e velocidade ascensional de "+f2(vm)+" m/h na vazão média (NBR 12209). Remove cerca de 65% da DBO."});
 U.push({label:"Filtro de biogás",kind:"gas",n:nbg,d:.6,h:1,info:"Forma Ø 0,60 × 1,00 m com carvão ativado (cerca de "+fmt(kgf,0)+" kg por filtro). Quantidade para troca do carvão a cada 30 dias: consumo estimado de "+f2(mca)+" kg/dia."});
 U.push({label:"Filtro aerado submerso (FAS)",n:fs.n,d:fs.d,h:fs.hu+.5,hu:fs.hu,v:fs.v,info:"Biofiltro aerado em PRFV, com ar do soprador. Carga orgânica de "+f2(cov)+" kgDBO/m³·dia e tempo de detenção de "+f2(tdhF)+" h."});
 U.push({label:"Decantador secundário (DS)",n:dc.n,d:dc.d,h:dc.hu+2,hu:dc.hu,v:dc.v,info:"Taxa de aplicação de "+f2(tm)+" m³/m²·dia na vazão média. O lodo se deposita no fundo e o líquido clarificado segue para a desinfecção."});
 U.push({label:"Tanque de desinfecção (TD)",n:td.n,d:td.d,h:td.hu+.5,hu:td.hu,v:td.v,info:"Contato com cloro por "+fmt(tc,0)+" min na vazão média (mínimo de 30 min)."});
 U.push({label:"Casa de máquinas",kind:"casa",n:1,d:2.2,h:2.1,info:"Quadro de comando, soprador de ar do FAS e dosagem de cloro.",nodim:true});
 var small=Qmed<=12&&carga0<=3.8;
 return{U:U,R:R,Qmed:Qmed,Qmax:Qmax,S2:S2,ef:ef,big:big,sol:"ETE em PRFV: UASB + FAS + decantador + desinfecção",txt:"Estação com tanques fabricados na nossa fábrica, quadro de comando e soprador.",nb:small?"Vazão até 12 m³/dia: também se enquadra na ABNT NBR 17076:2024 (menor porte)":"Norma de referência: ABNT NBR 12209:2011"};}

/* ---------- ETA ---------- */
function eta(Qp,ctx){
 var Hop=Math.max(4,Math.min(24,ctx.Hop)),Qh=Qp/Hop,U=[],R=[],big=false;
 var HF=4.0;/* altura total dos filtros */
 var rio=ctx.orig==="rio",fe=ctx.fe,mn=ctx.mn,ph=ctx.ph,tu=ctx.tu;
 var temFe=fe>0.3,temMn=mn>0.1,ciclo=rio,aera=!rio;/* água de rio: tratamento convencional; torre só em poço *//* torre de aeração só em água de poço */
 var etapas=[];
 /* Poço: correção de pH dosada por bomba dosadora direto na tubulação que vai para a torre (sem tanque).
    Rio: tanque de coagulação e correção de pH. */
 R.push(["Água bruta","pH",f2(ph),"6,0 a 9,0 na água tratada","Portaria GM/MS nº 888/2021",true]);
 if(rio){/* caixa de areia com medidor Parshall: a calha Parshall é a mistura rápida, onde se dosa o coagulante e se corrige o pH (sem tanque de coagulação) */
  var Qls=Qh/3.6,PS=[[1,5.4,.9],[2,13.2,1.0],[3,53.8,1.2],[6,110.4,1.6],[9,251.9,1.8],[12,455.6,2.4]],ps=PS[PS.length-1];for(var k=0;k<PS.length;k++){if(Qls<=PS[k][1]){ps=PS[k];break;}}
  var vh=.30,Qs=Qh/3600,bca=Math.max(.4,Math.ceil(Qs/vh/.6*20)/20),hca,vr,Lca;/* caixa de areia curta (até 3,00 m): se precisar, alarga o canal */for(var it=0;it<60;it++){hca=Math.max(.25,Math.ceil(Qs/vh/bca*20)/20);vr=Qs/(bca*hca);Lca=Math.max(1.5,Math.ceil(hca*vr/.02*1.5*2)/2);if(Lca<=3)break;bca=Math.round((bca+.05)*100)/100;}var Lt=Math.round((Lca+ps[2]+.4)*10)/10,hc=Math.round((hca+.35)*100)/100;
  R.push(["Caixa de areia","Velocidade horizontal",f2(vr)+" m/s","≤ 0,30 m/s","Critério de projeto adotado (desarenador)",vr<=.30+1e-6]);
  R.push(["Caixa de areia","Comprimento",f2(Lca)+" m","remoção de areia ≥ 0,2 mm","Critério de projeto adotado",true]);
  R.push(["Calha Parshall","Garganta",ps[0]+"\"","vazão até "+fmt(ps[1],1)+" L/s","ABNT NBR ISO 9826 (medição em calha Parshall)",Qls<=ps[1]]);
  R.push(["Calha Parshall","Mistura rápida (coagulação e correção de pH)","no ressalto da calha","dosagem de coagulante e de alcalinizante","NBR 12216",true]);
  U.push({label:"Caixa de areia e calha Parshall",kind:"parshall",n:1,d:Lt,wz:bca+.4,h:hc,lca:Lca,bca:bca,pw:ps[0],nod:true,info:"Caixa de areia ("+f2(Lca)+" × "+f2(bca)+" m) seguida de calha Parshall de "+ps[0]+"\" que mede a vazão ("+fmt(Qls,1)+" L/s). No ressalto da calha são dosados o coagulante e o produto de correção de pH: a calha faz a mistura rápida, sem tanque de coagulação. pH da água bruta: "+f2(ph)+"."});
  etapas.push("caixa de areia e calha Parshall (coagulação e correção de pH)");}
 else{R.push(["Correção de pH","Dosagem","na tubulação de entrada da torre","bomba dosadora","Critério de projeto SANEAR",true]);
  etapas.push("correção de pH na tubulação (bomba dosadora)");}
 /* Torre de aeração: oxida o ferro e remove gás carbônico (sobe o pH) */
 if(aera){/* taxa nas bandejas reduzida com o ferro: mais ferro, mais tempo de contato com o ar, torre mais larga */var TA=fe<=1?40:fe<=3?30:fe<=6?25:20;var ta=Math.max(.9,Math.sqrt(Qh/TA)),nt=1;if(ta>2.2){nt=Math.ceil(Qh/TA/(2.2*2.2));ta=Math.sqrt(Qh/TA/nt);}ta=Math.ceil(ta*10)/10;var tx=Qh/(nt*ta*ta);
  R.push(["Torre de aeração","Taxa de aplicação nas bandejas",f2(tx)+" m³/m²·h","≤ "+TA+" m³/m²·h"+(TA<40?" (ferro "+f2(fe)+" mg/L)":""),"Literatura técnica (aerador de bandejas)",tx<=TA+1e-6]);
  R.push(["Torre de aeração","Número de bandejas","5","≥ 3","Literatura técnica",true]);
  var hto=HF+.5,esp=.5,hT=Math.round((hto+5*esp+.4)*100)/100;/* bandeja coletora 0,50 m acima do topo dos filtros (gravidade); 5 bandejas espaçadas 0,50 m (faixa de 0,30 a 0,75 m) */
  R.push(["Torre de aeração","Espaçamento entre bandejas",f2(esp)+" m","0,30 a 0,75 m","NBR 12216 / literatura técnica",true]);
  R.push(["Torre de aeração","Bandeja coletora acima do topo dos filtros",f2(hto)+" m",">"+" "+f2(HF)+" m (escoamento por gravidade)","Critério de projeto SANEAR",hto>HF]);
  U.push({label:"Torre de aeração",kind:"torre",n:nt,d:ta,h:hT,out:hto,sp:esp,sq:true,info:"Torre com "+f2(hT)+" m de altura. Bandeja coletora a "+f2(hto)+" m, acima dos filtros: a água cai por gravidade nos filtros. 5 bandejas de "+f2(ta)+" × "+f2(ta)+" m espaçadas "+f2(esp)+" m, taxa de "+f2(tx)+" m³/m²·h. "+(temFe?"Oxida o ferro ("+f2(fe)+" mg/L) e remove":"Remove")+" gás carbônico e odores."});
  etapas.push("torre de aeração");}
 /* Pré-oxidação do manganês: o ar não oxida o manganês, precisa de oxidante (cloro ou permanganato) */
 if(temMn){var po=pickH(Qh/3,aera?HF:1.2);/* entre a torre e os filtros: nível acima dos filtros, para seguir por gravidade */big=big||po.big;var tpo=po.V/Qh*60;
  R.push(["Pré-oxidação","Tempo de contato com oxidante",fmt(tpo,0)+" min","≥ 20 min","Critério de projeto adotado (manganês)",tpo>=20-1e-6]);
  U.push({label:"Pré-oxidação (manganês)",n:po.n,d:po.d,h:po.hu+.5,hu:po.hu,v:po.v,info:"Contato com oxidante por "+fmt(tpo,0)+" min para precipitar o manganês ("+f2(mn)+" mg/L) antes dos filtros."});
  etapas.push("pré-oxidação do manganês");}
 /* Floculação e decantação: água de rio com turbidez acima de 10 uT */
 if(ciclo){var fc=pickH(Qh*.5,2.5);big=big||fc.big;var tfc=fc.V/Qh*60;
  R.push(["Floculação","Tempo de floculação",fmt(tfc,0)+" min","20 a 40 min","NBR 12216",tfc>=20-1e-6]);
  U.push({label:"Floculador",n:fc.n,d:fc.d,h:fc.hu+.5,hu:fc.hu,v:fc.v,info:"Floculação hidráulica com "+fmt(tfc,0)+" min de detenção (NBR 12216)."});
  var dc=pick(0,4.0,{amin:Qh*24/150,nmin:1});big=big||dc.big;var tdc=Qh*24/dc.A;/* decantador de alta taxa (módulos lamelares) */
  R.push(["Decantação","Taxa de aplicação na área do decantador",f2(tdc)+" m³/m²·dia","≤ 150 m³/m²·dia","Critério de projeto adotado (decantador de alta taxa com módulos lamelares, NBR 12216)",tdc<=150+1e-6]);
  U.push({label:"Decantador de alta taxa",n:dc.n,d:dc.d,h:dc.hu+.5,hu:dc.hu,v:dc.v,info:"Decantador com módulos lamelares e taxa de "+f2(tdc)+" m³/m²·dia. Turbidez da água bruta: "+fmt(tu,0)+" uT."});
  etapas.push("floculação","decantação de alta taxa");}
 /* Filtros: taxa menor quando há muito ferro ou manganês */
 var txmax=(fe>5||temMn)?120:180;
 var fl=pick(0,HF-.5,{amin:Qh*24/txmax,nmin:2});/* filtros com 4,00 m de altura total (3,50 m úteis) */big=big||fl.big;var tf=Qh*24/fl.A;
 R.push(["Filtros","Taxa de filtração",f2(tf)+" m³/m²·dia","≤ "+txmax+" m³/m²·dia",txmax<180?"Critério de projeto (ferro/manganês altos)":"NBR 12216 (filtro rápido)",tf<=txmax+1e-6]);
 R.push(["Filtros","Número de filtros",String(fl.n),"≥ 2","NBR 12216",fl.n>=2]);
 if(temFe)R.push(["Água bruta","Ferro",f2(fe)+" mg/L","≤ 0,3 mg/L na água tratada","Portaria GM/MS nº 888/2021",true]);
 if(temMn)R.push(["Água bruta","Manganês",f2(mn)+" mg/L","≤ 0,1 mg/L na água tratada","Portaria GM/MS nº 888/2021",true]);
 if(rio)R.push(["Água bruta","Turbidez",fmt(tu,0)+" uT","≤ 5 uT na água tratada (tratamento convencional)","Portaria GM/MS nº 888/2021",true]);
 U.push({label:"Filtros",n:fl.n,d:fl.d,h:fl.hu+.5,hu:fl.hu,v:fl.v,info:"Filtros ascendentes em PRFV: a água entra pelo fundo de cada filtro (entrada individual a partir do barrilete) e sai pelo alto. Taxa de "+f2(tf)+" m³/m²·dia ("+(txmax<180?"reduzida pela carga de "+(temMn?"manganês":"ferro"):"NBR 12216")+")."});
 etapas.push("filtração");
 R.push(["Desinfecção","Local da cloração","no reservatório de água tratada","tempo de contato ≥ 30 min","Portaria GM/MS nº 888/2021",true]);
 if(rio&&temMn){/* na água de rio, a pré-oxidação vem antes da coagulação */var iu=U.findIndex(function(u){return/Pré-oxidação/.test(u.label)});U.unshift(U.splice(iu,1)[0]);var ie=etapas.indexOf("pré-oxidação do manganês");etapas.unshift(etapas.splice(ie,1)[0]);}
 var nome=rio?"ETA convencional em PRFV":temMn?"ETA para ferro e manganês em PRFV":temFe?"ETA para remoção de ferro em PRFV":"ETA em PRFV";
 var por=rio?"Água de rio ou igarapé: tratamento convencional, com coagulação, floculação e decantador de alta taxa antes dos filtros (turbidez da água bruta: "+fmt(tu,0)+" uT).":(temMn?"Água de poço com manganês: o ar não remove o manganês, por isso entra a pré-oxidação antes dos filtros.":temFe?"Água de poço com ferro ("+f2(fe)+" mg/L): a aeração oxida o ferro e os filtros retêm o precipitado.":"Água de poço: aeração para remover gás carbônico e subir o pH, seguida de filtração.");
 var txt=etapas.join(", ").replace(/, ([^,]*)$/," e $1");txt=txt.charAt(0).toUpperCase()+txt.slice(1)+". A desinfecção (cloração) é feita no reservatório de água tratada. "+por;
 /* tudo por gravidade: só a caixa de areia com calha Parshall fica numa base alta; os tanques ficam no chão e mudam de altura para a água descer de uma unidade para a outra */
 var fi=-1;U.forEach(function(u,i){if(/Filtro/.test(u.label))fi=i;});
 if(rio&&fi>0){var need=U[fi].h+.5;/* nível mínimo de saída da unidade anterior aos filtros (filtros ascendentes) */
  function setRow(k,val,ok){R.forEach(function(r){if(r[0]===k){r[2]=val;r[5]=ok;}});}
  for(var i=fi-1;i>=0;i--){var u=U[i],nx=U[i+1],top=(nx.b||0)+nx.h,hreq=Math.round((top+.5)*100)/100;/* cada unidade 0,50 m mais alta que a seguinte */
   if(u.kind==="parshall"){u.b=Math.round((top+.3)*100)/100;u.info+=" Fica numa plataforma de concreto a "+f2(u.b)+" m de altura, acima dos tanques: dali a água segue por gravidade.";}
   else{var hu=Math.min(HMAX,hreq-.5);
    if(/Flocul/.test(u.label)){/* altura fixada pela gravidade (máximo 6,00 m de altura total): escolhe diâmetro e quantidade que mantêm 20 a 40 min */hu=Math.min(hu,5.5);var f=null;for(var nn=1;nn<=MAXN&&!f;nn++)for(var di=0;di<DS.length;di++){var VV=nn*A(DS[di])*hu,tt=VV/Qh*60;if(tt>=20&&tt<=40){f={n:nn,d:DS[di],hu:hu,v:A(DS[di])*hu,V:VV};break;}}if(!f){/* vazão muito pequena: até o menor tanque passa de 40 min */var d0=DS[0];f={n:1,d:d0,hu:hu,v:A(d0)*hu,V:A(d0)*hu};}
     u.n=f.n;u.d=f.d;u.hu=f.hu;u.v=f.v;var t=f.V/Qh*60;setRow("Floculação",fmt(t,0)+" min"+(t>40?" (tanque mínimo)":""),t>=20-1e-6);u.info="Floculação hidráulica com "+fmt(t,0)+" min de detenção (NBR 12216).";}
    else if(/Pré-oxid/.test(u.label)){var f=pickH(Qh/3,hu);u.n=f.n;u.d=f.d;u.hu=f.hu;u.v=f.v;var t=f.V/Qh*60;setRow("Pré-oxidação",fmt(t,0)+" min",t>=20-1e-6);}
    else{u.hu=hu;u.v=A(u.d)*hu;}
    u.h=Math.round((u.hu+.5)*100)/100;u.info+=" Altura de "+f2(u.h)+" m: 0,50 m acima da unidade seguinte, para a água seguir por gravidade.";}}
  R.push(["Hidráulica","Escoamento entre as unidades","por gravidade","sem bombeamento intermediário","Critério de projeto SANEAR",true]);}
 return{U:U,R:R,Qp:Qp,Qh:Qh,big:big,sol:nome+": "+etapas.join(" + "),txt:txt,nb:"Normas de referência: ABNT NBR 12216 e Portaria GM/MS nº 888/2021"};}

/* ---------- interface ---------- */
var TIPOS={esgoto:[["Residência / condomínio residencial",160,"Pessoas atendidas"],["Escritório / comércio",50,"Pessoas atendidas"],["Escola (externato)",50,"Alunos e funcionários"],["Indústria (por funcionário)",70,"Funcionários"],["Hotel / pousada",120,"Hóspedes e funcionários"],["Hospital (por leito)",250,"Leitos"],["Comunidade rural / ribeirinha",100,"Moradores"]],
agua:[["Abastecimento residencial / condomínio",200,"Pessoas atendidas"],["Comunidade rural / ribeirinha",100,"Moradores"],["Abastecimento público (município/distrito)",200,"Habitantes"],["Escola",50,"Alunos e funcionários"],["Indústria (por funcionário)",70,"Funcionários"],["Hospital (por leito)",250,"Leitos"]]};
var L="esgoto",MODE="vaz",last=null;
function fill(){var s=$("s_tipo");s.innerHTML="";TIPOS[L].forEach(function(t,i){var o=document.createElement("option");o.value=i;o.textContent=t[0];s.appendChild(o)});setRef();}
function setRef(){var t=TIPOS[L][$("s_tipo").value];$("s_q").value=t[1];$("s_plab").textContent=t[2];calc();}
function toM3d(v,u){return u==="h"?v*24:u==="s"?v*86.4:v}
function calc(){
 var t=TIPOS[L][$("s_tipo").value],P=Math.max(0,num("s_pop",0)),q=Math.max(0,num("s_q",0)),vin=Math.max(0,num("s_v",0)),vu=$("s_vu").value,res,lines=[];
 if(L==="esgoto"){
  var Qmed=MODE==="pes"?P*q*.8/1000:toM3d(vin,vu);
  var dboUser=num("p_dbo",NaN),S0=isFinite(dboUser)&&dboUser>0?dboUser:(MODE==="pes"&&q>0?Math.round(54/(q*.8)*1000):350);
  $("p_dboh").textContent=MODE==="pes"?"Em branco: "+fmt(MODE==="pes"&&q>0?Math.round(54/(q*.8)*1000):350,0)+" mg/L (54 g de DBO por pessoa por dia).":"Em branco: 350 mg/L (esgoto doméstico típico).";
  var biodig=MODE==="pes"?(P>0&&P<=5&&t[0].indexOf("Residência")===0):(Qmed>0&&Qmed<=.6);
  if(Qmed<=0){return empty();}
  if(MODE==="pes"?P>LIM:Qmed>LIM*(q>0?q:160)*.8/1000)return acima();
  res=ete(Qmed,{K1:num("p_k1",1.2),K2:num("p_k2",1.5),T:num("p_t",26),S0:S0,biodig:biodig});
  $("r_med_l").textContent="Vazão média";$("r_pk_l").textContent="Vazão máxima";
  $("r_med").textContent=fmt(res.Qmed,1)+" m³/dia";$("r_med2").textContent=f2(res.Qmed/86.4)+" L/s · "+f2(res.Qmed/24)+" m³/h";
  $("r_pk").textContent=fmt(res.Qmax,1)+" m³/dia";$("r_pk2").textContent=f2(res.Qmax/86.4)+" L/s · "+f2(res.Qmax/24)+" m³/h";
  lines.push("Vazão média "+fmt(res.Qmed,1)+" m³/dia · vazão máxima "+fmt(res.Qmax,1)+" m³/dia · DBO afluente "+fmt(S0,0)+" mg/L"+(res.S2?" · DBO na saída ≈ "+fmt(res.S2,0)+" mg/L":""));
 }else{
  var K1a=num("p_k1a",1.2),Qp=MODE==="pes"?P*q*K1a/1000:toM3d(vin,vu);
  if(Qp<=0){return empty();}
  if(MODE==="pes"?P>LIM:Qp>LIM*(q>0?q:200)*K1a/1000)return acima();
  var orig=$("s_orig").value,rio=orig==="rio",fe=num("s_fe",NaN),mn=num("s_mn",NaN),phv=num("s_ph",NaN),tu=num("s_tu",NaN);
  var dfe=rio?0.3:2,dmn=0,dph=rio?6.5:5.5,dtu=rio?40:5;
  $("s_qh").textContent="Em branco: ferro "+f2(dfe).replace(",00","")+" mg/L, manganês "+dmn+" mg/L, pH "+String(dph).replace(".",",")+" e turbidez "+dtu+" uT, valores típicos de "+(rio?"rio ou igarapé":"poço")+" na região.";
  fe=isFinite(fe)&&fe>=0?fe:dfe;mn=isFinite(mn)&&mn>=0?mn:dmn;phv=isFinite(phv)&&phv>0?phv:dph;tu=isFinite(tu)&&tu>=0?tu:dtu;
  res=eta(Qp,{Hop:num("p_hop",24),orig:orig,fe:fe,mn:mn,ph:phv,tu:tu});
  $("r_med_l").textContent=MODE==="pes"?"Consumo médio":"Vazão de projeto";$("r_pk_l").textContent="Produção da ETA";
  $("r_med").textContent=fmt(MODE==="pes"?Qp/K1a:Qp,1)+" m³/dia";$("r_med2").textContent=MODE==="pes"?"Dia de maior consumo: "+fmt(Qp,1)+" m³/dia":f2(Qp/86.4)+" L/s";
  $("r_pk").textContent=f2(res.Qh)+" m³/h";$("r_pk2").textContent=fmt(num("p_hop",24),0)+" h de operação por dia";
  lines.push("Vazão de projeto "+fmt(Qp,1)+" m³/dia · produção "+f2(res.Qh)+" m³/h · água de "+(rio?"rio/igarapé":"poço")+" · ferro "+f2(fe)+" mg/L · manganês "+f2(mn)+" mg/L · pH "+f2(phv)+" · turbidez "+fmt(tu,0)+" uT");
 }
 last=res;
 $("r_sol").textContent=res.sol;$("r_txt").textContent=res.txt;$("r_nb").textContent=res.nb;
 /* tabela de tanques */
 var tb="";res.U.forEach(function(u){if(u.nodim)return;tb+="<tr><td>"+esc(u.label)+"</td><td>"+u.n+"</td><td>"+(u.nod?"–":u.sq?f2(u.d)+" × "+f2(u.d)+" (bandeja)":f2(u.d))+"</td><td>"+(u.nod?"–":f2(u.h))+"</td><td>"+(u.v?f2(u.v)+(u.n>1?" cada":""):"–")+"</td></tr>";});
 $("r_tab").innerHTML=tb;
 /* verificação */
 var ok=res.R.every(function(r){return r[5]}),vb="",prev="";
 res.R.forEach(function(r){vb+="<tr"+(r[0]!==prev?' class="g"':"")+"><td>"+(r[0]!==prev?esc(r[0]):"")+"</td><td>"+esc(r[1])+"</td><td><b>"+esc(r[2])+"</b></td><td>"+esc(r[3])+"</td><td class=ref>"+esc(r[4])+"</td><td class="+(r[5]?"ok":"no")+">"+(r[5]?"✓":"✗")+"</td></tr>";prev=r[0];});
 $("r_ver").innerHTML=vb;
 $("r_vnote").textContent="Altura total = altura útil + 0,50 m de borda livre. Diâmetros das formas SANEAR: 1,00; 1,50; 2,00; 2,50 e 3,00 m. "+(L==="esgoto"?"Vazão máxima com K1 = "+fmt(num("p_k1",1.2),2)+" e K2 = "+fmt(num("p_k2",1.5),2)+". Eficiências adotadas: UASB 65% e FAS 80% de remoção de DBO. ":"")+"Critérios marcados como literatura técnica ou critério de projeto complementam a norma onde ela não fixa valor.";
 $("r_ok").className="okbox "+(ok?"ok":"no");
 $("r_ok").innerHTML=res.big?"⚠️ Vazão acima da faixa padrão dos nossos tanques: fale com a equipe para um projeto sob medida.":ok?"✓ Todos os "+res.R.length+" critérios verificados atendem às normas":"✗ Algum critério não atende: confira a memória de cálculo";
 /* 3D */
 var ar=null;try{var el=document.querySelector(".simv");var sm=window.SANEAR3D?SANEAR3D.simModel({tipo:L,units:res.U,title:""}):null;if(sm)ar=sm.area;if(el&&el._v3&&sm){el._v3.setModel(sm);}}catch(e){}
 /* área necessária: base da estação (arranjo do desenho) e terreno com 1,50 m de circulação em volta */
 if(ar){var bw=Math.ceil(ar.w*2)/2,bd=Math.ceil(ar.d*2)/2,tw=bw+3,tdp=bd+3;
  $("r_area").textContent=fmt(Math.ceil(tw*tdp),0)+" m²";$("r_area2").textContent="Terreno de cerca de "+fmt(Math.max(tw,tdp),1)+" × "+fmt(Math.min(tw,tdp),1)+" m · base da estação "+fmt(Math.ceil(bw*bd),0)+" m²";
  lines.push("Área necessária estimada: "+fmt(Math.ceil(tw*tdp),0)+" m² (cerca de "+fmt(Math.max(tw,tdp),1)+" × "+fmt(Math.min(tw,tdp),1)+" m)");}
 else{$("r_area").textContent="–";$("r_area2").textContent="";}
 /* WhatsApp */
 var dimTxt=res.U.filter(function(u){return!u.nodim}).map(function(u){return u.nod?"• "+u.label:"• "+u.label+": "+u.n+" × Ø "+f2(u.d)+" m × "+f2(u.h)+" m"}).join("\n");
 var ld=(window.SANEAR_LEAD&&window.SANEAR_LEAD())||window.__lead||null;var m="Olá, usei o simulador de dimensionamento no site da SANEAR AMBIENTAL."+(ld?"\n• Nome: "+ld.nome+"\n• WhatsApp: "+ld.tel:"")+"\n• Sistema: "+(L==="esgoto"?"ETE (esgoto)":"ETA (água)")+"\n"+(MODE==="pes"?"• Empreendimento: "+t[0]+"\n• "+t[2]+": "+P+"\n• Consumo: "+q+" L/pessoa·dia\n":"")+"• "+lines[0]+"\n• Solução: "+res.sol+($("s_cid").value?"\n• Local: "+$("s_cid").value:"")+(ar?"\n• "+lines[lines.length-1]:"")+"\nTanques (estimativa de tamanhos):\n"+dimTxt+"\nGostaria de um orçamento.";
 $("r_wa").href="https://wa.me/5591989138154?text="+encodeURIComponent(m);last.msg=m;last.sist=(L==="esgoto"?"ETE (esgoto)":"ETA (água)");try{dispatchEvent(new CustomEvent("sanear:sim"))}catch(_){}
 last.lines=lines.slice(0,1).concat(ar?[lines[lines.length-1]]:[]).concat([res.U.filter(function(u){return!u.nodim&&!u.nod}).map(function(u){return u.label.replace(/ \(.+\)/,"")+" "+u.n+"× Ø"+f2(u.d)+"×"+f2(u.h)}).join("  ·  ")]);
}
var LIM=15000;
function acima(){empty();$("r_sol").textContent="Acima de 15 mil pessoas";$("r_txt").innerHTML='O simulador atende estações de até 15 mil pessoas. Para estações maiores, entre em contato conosco: <a href="https://wa.me/5591989138154?text='+encodeURIComponent("Olá! Preciso de uma estação para mais de 15 mil pessoas.")+'" target="_blank" rel="noopener">WhatsApp (91) 98913-8154</a>.';}
function empty(){last=null;$("r_med").textContent="–";$("r_pk").textContent="–";$("r_med2").textContent="";$("r_pk2").textContent="";$("r_sol").textContent="–";$("r_txt").textContent="Informe a vazão ou o número de pessoas.";$("r_nb").textContent="";$("r_tab").innerHTML="";$("r_ver").innerHTML="";$("r_ok").className="okbox";$("r_ok").textContent="";}
function setMode(m){MODE=m;document.querySelectorAll(".seg button").forEach(function(b){var on=b.dataset.m===m;b.classList.toggle("on",on);b.setAttribute("aria-checked",on)});$("g_vaz").hidden=m!=="vaz";$("g_pes").hidden=m!=="pes";calc();}
function setL(l){L=l;document.querySelectorAll("#simulador .tabs .tab").forEach(function(x){x.classList.toggle("on",x.dataset.l===l)});
 document.querySelectorAll("[data-only]").forEach(function(d){d.hidden=d.dataset.only!==l});
 $("s_vlab").textContent=l==="esgoto"?"Vazão média de esgoto":"Vazão de projeto da ETA";$("s_vh").textContent=l==="esgoto"?"Vazão média diária que chega à estação.":"Volume de água tratada necessário no dia de maior consumo.";
 if(l==="agua"&&MODE==="vaz"&&num("s_v",0)===20)$("s_v").value=30;if(l==="esgoto"&&MODE==="vaz"&&num("s_v",0)===30)$("s_v").value=20;
 var el=document.querySelector(".simv");if(el&&el._v3)el._v3.simInit=false;fill();}
document.querySelectorAll("#simulador .tabs .tab").forEach(function(b){b.addEventListener("click",function(){setL(b.dataset.l)})});
document.querySelectorAll(".seg button").forEach(function(b){b.addEventListener("click",function(){setMode(b.dataset.m)})});
$("s_tipo").addEventListener("change",setRef);
["s_pop","s_q","s_cid","s_v","p_t","p_dbo","p_k1","p_k2","p_hop","p_k1a","s_fe","s_mn","s_ph","s_tu"].forEach(function(i){$(i).addEventListener("input",calc)});
$("s_orig").addEventListener("change",calc);
$("s_vu").addEventListener("change",calc);
$("simf").addEventListener("submit",function(e){e.preventDefault()});
/* baixar o desenho */
var logo=new Image();logo.src="media/logo.jpg";
$("r_png").addEventListener("click",function(){var el=document.querySelector(".simv");if(!el||!el._v3||!last)return;
 var title=(L==="esgoto"?"ETE":"ETA")+" em PRFV — "+last.sol.replace(/^.*?: /,"");var c=el._v3.snapshot({title:title,lines:last.lines,logo:logo});
 var name="SANEAR-"+(L==="esgoto"?"ETE":"ETA")+"-dimensionamento.png";
 var url=c.toDataURL("image/png"),md=document.createElement("div");md.className="imgmd";md.setAttribute("role","dialog");md.setAttribute("aria-label","Desenho da estação");
 md.innerHTML='<div class="imgbox"><img alt="Desenho 3D da estação dimensionada"><p>No celular, toque e segure na imagem para salvar ou compartilhar.</p><div class="imgbt"><a class="btn" download="'+name+'">⬇ Baixar</a><button type="button" class="btn alt">Fechar</button></div></div>';
 md.querySelector("img").src=url;md.querySelector("a").href=url;md.querySelector("button").onclick=function(){md.remove()};md.onclick=function(e){if(e.target===md)md.remove()};document.body.appendChild(md);});
setL("esgoto");
window.SANEAR_DIM={ete:ete,eta:eta,pick:pick,last:function(){return last}};
})();
