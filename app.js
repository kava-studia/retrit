const MAX_PHONE='+79057195398';
const MAX_WEB='https://max.ru/';

// Два новых атмосферных кадра: оставляем их в исходном широком соотношении сторон.
const galleryImgs=document.querySelectorAll('.gallery img');
if(galleryImgs.length>=4){
  galleryImgs[0].dataset.img='sunset';
  galleryImgs[0].alt='Тёплый вечер и общение на загородном ретрите';
  galleryImgs[3].dataset.img='fire';
  galleryImgs[3].alt='Вечер у костра с музыкой и огнями';
}

const assets={logo:'/assets/logo.b64',hero:'/assets/hero.b64',real:'/assets/real.b64'};
const RAW='https://raw.githubusercontent.com/kava-studia/retrit/retreat-images/';
const specialAssets={
  sunset:[
    'assets/retreat-sunset-hd/00.txt','assets/retreat-sunset-hd/01.txt','assets/retreat-sunset-hd/02.txt',
    'assets/retreat-sunset-hd/03.txt','assets/retreat-sunset-hd/04.txt','assets/retreat-sunset-hd/05a.txt',
    'assets/retreat-sunset-hd/05b.txt','assets/retreat-sunset-hd/05c.txt','assets/retreat-sunset-hd/06.txt'
  ],
  fire:[
    'assets/retreat-fire/01.txt','assets/retreat-fire/02.txt','assets/retreat-fire/03.txt',
    'assets/retreat-fire/04.txt','assets/retreat-fire/05.txt'
  ]
};

function applyImage(name,url){
  document.querySelectorAll(`[data-img="${name}"]`).forEach((img,i)=>{
    img.decoding='async';
    if(i>0) img.loading='lazy';
    img.src=url;
    img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
  });
}

async function loadAsset(name,path){
  try{
    const b64=(await fetch(path,{cache:'force-cache'}).then(r=>r.text())).trim();
    applyImage(name,'data:image/webp;base64,'+b64);
  }catch(e){console.warn('asset',name,e)}
}

async function loadChunkedAsset(name,parts){
  try{
    const chunks=await Promise.all(parts.map(path=>fetch(RAW+path,{cache:'force-cache'}).then(r=>{
      if(!r.ok) throw new Error(`${r.status} ${path}`);
      return r.text();
    })));
    applyImage(name,'data:image/webp;base64,'+chunks.map(x=>x.trim()).join(''));
  }catch(e){console.warn('chunked asset',name,e)}
}

Object.entries(assets).forEach(([name,path])=>loadAsset(name,path));
Object.entries(specialAssets).forEach(([name,parts])=>loadChunkedAsset(name,parts));

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
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  nav.style.boxShadow=y>40?'0 16px 48px rgba(80,65,77,.14)':'0 12px 44px rgba(80,65,77,.10)';
},{passive:true});
