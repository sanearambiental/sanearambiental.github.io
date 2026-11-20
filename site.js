(function(){var hd=document.getElementById("hd");if(hd){var b=hd.querySelector(".mt");if(b)b.addEventListener("click",function(){var o=hd.classList.toggle("open");b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Fechar menu":"Abrir menu");});
hd.querySelectorAll("nav a").forEach(function(a){a.addEventListener("click",function(){hd.classList.remove("open");});});
var f=function(){hd.classList.toggle("sc",scrollY>8)};addEventListener("scroll",f,{passive:true});f();}
var y=document.getElementById("y");if(y&&!y.textContent)y.textContent=new Date().getFullYear();})();
