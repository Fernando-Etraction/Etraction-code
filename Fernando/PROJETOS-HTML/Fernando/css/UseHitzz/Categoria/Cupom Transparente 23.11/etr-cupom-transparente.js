/* Use Hitzz | Cupom TRANSPARENTE 15% OFF – banner categoria (formato Semana da Black) – só em /transparente – 15h, prorrogado até 17h */
(function(){
if(!/^\/transparente\/?$/i.test(location.pathname))return;
var FIM_1=15, FIM_2=17; // até 15h normal; das 15h às 17h aparece "Prorrogado"; depois das 17h o banner some
function run(){
var h1=document.querySelector('h1.taxon-title-text');var alvo=document.querySelector('.products-filter .row-title')||(h1&&h1.closest('.row'));if(!alvo||document.getElementById('etr-tp'))return;
var lk=document.createElement('link');lk.rel='stylesheet';lk.href='https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap';document.head.appendChild(lk);
var st=document.createElement('style');st.textContent=`
#etr-tp{position:relative;overflow:hidden;width:100vw;max-width:100vw;margin:6px 0 26px calc(50% - 50vw);min-height:330px;background:radial-gradient(ellipse at 70% 50%,#1c1c1c 0,#0b0b0b 60%);color:#fff;display:flex;align-items:center;justify-content:center;gap:60px;padding:40px 60px;font-family:Roboto,sans-serif;box-sizing:border-box}
#etr-tp *{box-sizing:border-box}
html,body{overflow-x:hidden}
#etr-tp .rb{position:absolute;background:#e1262d;color:#fff;font:12px/1 "Archivo Black","Arial Black",sans-serif;letter-spacing:.14em;white-space:nowrap;padding:7px 0;width:520px;text-align:center;z-index:1}
#etr-tp .rb.a{top:20px;left:-150px;transform:rotate(-20deg)}
#etr-tp .rb.z{bottom:20px;right:-150px;transform:rotate(-20deg)}
#etr-tp .sd{position:absolute;top:50%;font:500 10px/1 Roboto,sans-serif;letter-spacing:.5em;color:#555;writing-mode:vertical-rl}
#etr-tp .sd.l{left:16px;transform:translateY(-50%) rotate(180deg)}#etr-tp .sd.r{right:16px;transform:translateY(-50%)}
#etr-tp .tl{text-align:center;position:relative;z-index:2}
#etr-tp .ey{font:500 15px/1 Roboto,sans-serif;letter-spacing:.7em;padding-left:.7em;margin-bottom:10px}
#etr-tp h2{margin:0;font:60px/.88 "Archivo Black","Arial Black",sans-serif;letter-spacing:-.03em;color:#fff}
#etr-tp h2 em{display:block;font-style:normal;color:#e1262d}
#etr-tp .tl p{font:400 18px/1.3 Roboto,sans-serif;margin:14px 0 0;color:#ddd}#etr-tp .tl p b{color:#fff}
#etr-tp .card{position:relative;z-index:2;width:690px;max-width:100%;min-height:220px;background:#e1262d;border-radius:28px;display:flex;align-items:center;padding:30px 34px 34px 40px;gap:34px}
#etr-tp .tab{position:absolute;top:-16px;left:30px;background:#fff;color:#e1262d;font:700 15px/1 Roboto,sans-serif;padding:9px 16px;border-radius:8px 8px 0 0}
#etr-tp .tab[hidden]{display:none}
#etr-tp .pc{text-align:center}
#etr-tp .pc small,#etr-tp .pc span{display:block;font:italic 700 24px/1.1 Roboto,sans-serif}
#etr-tp .pc b{display:block;font:112px/.9 "Archivo Black","Arial Black",sans-serif;letter-spacing:-.05em}
#etr-tp .rt{flex:1;text-align:center}
#etr-tp .cp{width:100%;display:flex;align-items:center;justify-content:space-between;background:none;border:2px solid #fff;border-radius:999px;padding:4px 4px 4px 18px;gap:14px;cursor:pointer;color:#fff;font-family:inherit}
#etr-tp .cp span{font:500 15px/1 Roboto,sans-serif;white-space:nowrap}#etr-tp .cp span b{font-weight:700}
#etr-tp .cp i{font:19px/1 "Archivo Black","Arial Black",sans-serif;font-style:normal;background:#fff;color:#e1262d;border-radius:999px;padding:12px 16px;transition:transform .2s}
#etr-tp .cp:hover i{transform:scale(1.04)}
#etr-tp .cp:focus-visible{outline:3px solid #fff;outline-offset:3px}
#etr-tp .hint{font:500 13px/1 Roboto,sans-serif;margin:9px 0 16px}
#etr-tp .tm{display:flex;align-items:center;justify-content:center;gap:16px;background:#0b0b0b;border-radius:14px;padding:12px 14px}
#etr-tp .tm small{font:700 11px/1 Roboto,sans-serif;letter-spacing:.16em;color:#e1262d}
#etr-tp .tm b{font:30px/1 "Archivo Black","Arial Black",sans-serif;font-variant-numeric:tabular-nums}
#etr-tp .disc{position:absolute;right:30px;bottom:12px;font:400 11px/1 Roboto,sans-serif;opacity:.85}
@media(max-width:1100px){#etr-tp{flex-direction:column;gap:34px;padding:44px 20px 40px}}
@media(max-width:640px){#etr-tp{min-height:0;margin:4px 0 18px calc(50% - 50vw);padding:30px 12px 22px;gap:22px}#etr-tp .sd,#etr-tp .disc,#etr-tp .rb.z{display:none}#etr-tp .ey{font-size:11px;letter-spacing:.5em;margin-bottom:6px}#etr-tp .tl p{font-size:13px;margin-top:8px}#etr-tp .rb{width:320px;font-size:9px;padding:6px 0}#etr-tp .rb.a{left:-120px;top:10px}#etr-tp h2{font-size:34px;line-height:.92}#etr-tp .card{min-height:0;flex-direction:row;gap:14px;padding:28px 14px 16px;border-radius:20px}#etr-tp .tab{top:-14px;left:16px;font-size:13px;padding:7px 12px}#etr-tp .pc small,#etr-tp .pc span{font-size:17px}#etr-tp .pc b{font-size:62px}#etr-tp .rt{width:auto;min-width:0}#etr-tp .cp{flex-direction:column;gap:6px;border-radius:16px;padding:8px 6px 6px}#etr-tp .cp span{font-size:12px}#etr-tp .cp i{display:block;width:100%;font-size:15px;padding:10px 6px;border-radius:12px}#etr-tp .hint{font-size:11px;margin:6px 0 10px}#etr-tp .tm{flex-direction:column;gap:4px;padding:8px;border-radius:12px}#etr-tp .tm small{font-size:10px}#etr-tp .tm b{font-size:24px}}`;document.head.appendChild(st);
var fita='BEST SELLERS • BLACK HITZZ • BEST SELLERS • BLACK HITZZ';
var el=document.createElement('section');el.id='etr-tp';el.setAttribute('aria-label','Best Sellers Hitzz com 15% OFF no cupom TRANSPARENTE');
el.innerHTML='<div class="rb a" aria-hidden="true">'+fita+'</div><div class="rb z" aria-hidden="true">'+fita+'</div><div class="sd l" aria-hidden="true">USEHITZZ.COM.BR</div><div class="sd r" aria-hidden="true">USEHITZZ.COM.BR</div>'+
'<div class="tl"><div class="ey">ESPECIAL</div><h2>BEST SELLERS<em>HITZZ</em></h2><p>OS MAIS DESEJADOS <b>COM DESCONTO</b></p></div>'+
'<div class="card"><div class="tab" hidden>Prorrogado</div><div class="pc"><small>Ganhe</small><b>15%</b><span>OFF</span></div>'+
'<div class="rt"><button type="button" class="cp" aria-label="Copiar cupom TRANSPARENTE"><span>Use o <b>cupom</b></span><i>TRANSPARENTE</i></button><div class="hint" aria-live="polite">Clique para copiar</div>'+
'<div class="tm" role="timer"><small>ACABA EM</small><b data-t>00:00:00</b></div></div>'+
'<div class="disc">*Válido somente para a categoria Transparente</div></div>';
alvo.insertAdjacentElement('afterend',el);
var t=el.querySelector('[data-t]'),iv;
var tab=el.querySelector('.tab');
function tk(){var n=new Date(),f=new Date(n);f.setHours(FIM_1,0,0,0);if(f-n<=0){f.setHours(FIM_2,0,0,0);tab.hidden=false}var d=f-n;if(d<=0){clearInterval(iv);el.remove();return}var p=function(x){return String(x).padStart(2,'0')};t.textContent=p(Math.floor(d/36e5))+':'+p(Math.floor(d/6e4)%60)+':'+p(Math.floor(d/1e3)%60)}
tk();iv=setInterval(tk,1000);
var b=el.querySelector('.cp'),h=el.querySelector('.hint');
function fb(){var x=document.createElement('textarea');x.value='TRANSPARENTE';x.setAttribute('readonly','');x.style.cssText='position:fixed;top:0;left:0;opacity:0;font-size:16px';document.body.appendChild(x);x.focus();x.select();x.setSelectionRange(0,99);var r=false;try{r=document.execCommand('copy')}catch(e){}x.remove();return r}
b.addEventListener('click',function(){var ok=function(){h.textContent='Cupom copiado! ✓';setTimeout(function(){h.textContent='Clique para copiar'},2500)},err=function(){h.textContent='Copie: TRANSPARENTE'};
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText('TRANSPARENTE').then(ok,function(){fb()?ok():err()})}else{fb()?ok():err()}});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
