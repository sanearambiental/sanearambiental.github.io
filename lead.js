/* SANEAR AMBIENTAL: registra cada simulação do site (nome, WhatsApp e resumo) na planilha "Simulações do site SANEAR" e avisa contato@sanearambiental.com */
(function(){
var URL="https://script.google.com/macros/s/AKfycbzKe-A-onYYRUTQ9eCJjuQKETO7TJd8jExSug_SLKdQoBX5wpUf3yFfuEwF8K71xCww/exec",sent={},n=0,tm=null;
function lead(){try{return JSON.parse(localStorage.getItem("sanear_lead")||"null")||window.__lead||null}catch(e){return window.__lead||null}}
function send(motivo){
 if(location.hash==="#interno")return;/* uso interno da equipe não é registrado */
 var ld=lead(),d=window.SANEAR_DIM&&SANEAR_DIM.last();if(!ld||!d||!d.msg)return;
 var key=motivo+"|"+d.msg;if(sent[key]||n>=8)return;sent[key]=1;n++;
 var tel=String(ld.tel||"").replace(/\D/g,"").replace(/^0+/,"");if(tel.indexOf("55")!==0)tel="55"+tel;
 var cid=(document.getElementById("s_cid")||{}).value||"";
 try{fetch(URL,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({k:"sanear-site",nome:ld.nome,whatsapp:ld.tel,wa:"https://wa.me/"+tel,cidade:cid,sistema:d.sist||"",solucao:d.sol||"",acao:motivo,resumo:d.msg})}).catch(function(){});}catch(e){}}
addEventListener("sanear:sim",function(){clearTimeout(tm);tm=setTimeout(function(){tm=null;send("Fez uma simulação")},12000);});
document.addEventListener("submit",function(e){if(e.target&&e.target.id==="gatef")setTimeout(function(){send("Cadastrou nome e WhatsApp para ver o resultado")},1500);},true);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("#r_wa,#r_png");if(!a)return;clearTimeout(tm);tm=null;send(a.id==="r_wa"?"Clicou em enviar a simulação pelo WhatsApp":"Baixou o desenho 3D");},true);
addEventListener("pagehide",function(){if(tm){clearTimeout(tm);tm=null;send("Fez uma simulação")}});
})();
