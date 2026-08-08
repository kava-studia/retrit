const MAX_PHONE='+79057195398';
const MAX_WEB='https://max.ru/';
const assets={logo:'/assets/logo.b64',hero:'/assets/hero.b64',real:'/assets/real.b64'};

async function loadAsset(name,path){
  try{
    const b64=(await fetch(path,{cache:'force-cache'}).then(r=>r.text())).trim();
    const url='data:image/webp;base64,'+b64;
    document.querySelectorAll(`[data-img="${name}"]`).forEach((img,i)=>{
      img.decoding='async';
      if(i>0) img.loading='lazy';
      img.src=url;
      img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
    });
  }catch(e){console.warn('asset',name,e)}
}
Object.entries(assets).forEach(([name,path])=>loadAsset(name,path));

const toast=document.getElementById('toast');
function showToast(){
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);
}
async function buy(){
  try{await navigator.clipboard.writeText(MAX_PHONE)}catch(e){
    const t=document.createElement('textarea');t.value=MAX_PHONE;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();
  }
  showToast();
  setTimeout(()=>window.open(MAX_WEB,'_blank','noopener'),320);
}
document.querySelectorAll('.max-cta').forEach(btn=>btn.addEventListener('click',buy));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}
}),{threshold:.08,rootMargin:'0px 0px -3% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const nav=document.querySelector('.nav');
let lastY=0;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  nav.style.boxShadow=y>40?'0 16px 48px rgba(80,65,77,.14)':'0 12px 44px rgba(80,65,77,.10)';
  lastY=y;
},{passive:true});
