const MAX_PHONE='+79057195398';
const MAX_WEB='https://max.ru/';

// Финальные три кадра. На сайте больше не используем никакие другие фотографии.
const FINAL_IMAGES={
  yogaWide:'/assets/final/yoga-wide.png',
  fire:'/assets/final/fire.png',
  yogaClose:'/assets/final/yoga-close.jpg'
};

function setImage(img,src,alt){
  if(!img)return;
  img.src=src;
  img.alt=alt||img.alt||'';
  img.decoding='async';
  img.style.width='100%';
  img.style.height='auto';
  img.style.objectFit='contain';
  img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
}

async function loadLogo(){
  try{
    const b64=(await fetch('/assets/logo.b64',{cache:'force-cache'}).then(r=>r.text())).trim();
    document.querySelectorAll('img[data-img="logo"]').forEach(img=>setImage(img,'data:image/webp;base64,'+b64,'Будем знакомы'));
  }catch(e){console.warn('logo',e)}
}
loadLogo();

setImage(document.querySelector('.hero-visual img'),FINAL_IMAGES.yogaWide,'Йога на загородном ретрите «Будем знакомы»');

const galleryFigures=[...document.querySelectorAll('.gallery figure')];
while(galleryFigures.length>3){galleryFigures.pop().remove()}
const galleryImgs=[...document.querySelectorAll('.gallery img')];
setImage(galleryImgs[0],FINAL_IMAGES.yogaWide,'Утренняя йога на природе');
setImage(galleryImgs[1],FINAL_IMAGES.fire,'Вечер у костра');
setImage(galleryImgs[2],FINAL_IMAGES.yogaClose,'Йога с видом на поля');

setImage(document.querySelector('.alone-img img'),FINAL_IMAGES.fire,'Тёплый вечер у костра и новые знакомства');
setImage(document.querySelector('.place-photo img'),FINAL_IMAGES.yogaClose,'Загородная площадка ретрита');

const toast=document.getElementById('toast');
function showToast(){
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);
}
async function buy(){
  try{await navigator.clipboard.writeText(MAX_PHONE)}catch(e){
    const t=document.createElement('textarea');
    t.value=MAX_PHONE;t.style.position='fixed';t.style.opacity='0';
    document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();
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
  nav.style.boxShadow=window.scrollY>40?'0 16px 48px rgba(80,65,77,.14)':'0 12px 44px rgba(80,65,77,.10)';
},{passive:true});
