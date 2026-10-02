const topbar=document.querySelector('.topbar');
const menuBtn=document.querySelector('.menu-btn');
const mobileMenu=document.querySelector('.mobile-menu');
const toast=document.querySelector('.toast');

window.addEventListener('scroll',()=>topbar.classList.toggle('scrolled',scrollY>30));

menuBtn?.addEventListener('click',e=>{
  e.preventDefault();
  const open=mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',open);
  mobileMenu.setAttribute('aria-hidden',!open);
});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-demo]').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault(); showToast(`${el.dataset.demo} — connect your YouTube video URL here.`);
}));
document.querySelectorAll('.circle-play').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault(); showToast('Connect your featured YouTube film URL here.');
}));

document.querySelectorAll('[data-social]').forEach(el=>el.addEventListener('click',e=>{
  e.preventDefault(); showToast(`Add your exact ${el.dataset.social} profile URL in index.html.`);
}));

function showToast(msg){
  toast.textContent=msg; toast.classList.add('show');
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>toast.classList.remove('show'),2800);
}

const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.desktop-nav a')];
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));
    }
  })
},{rootMargin:'-45% 0px -45% 0px'});
sections.forEach(s=>navObserver.observe(s));

const videoFiles={main-film:"assets/video/main-film.mp4",thirty-sec:"assets/video/thirty-sec.mp4",new-home:"assets/video/new-home.mp4"};
const modal=document.querySelector('.video-modal'),player=document.querySelector('#player'),playerTitle=document.querySelector('#playerTitle');
function openVideo(key){if(!videoFiles[key])return;player.src=videoFiles[key];playerTitle.textContent="HOWLREX • "+key.replaceAll("-"," ").toUpperCase();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");player.play().catch(()=>{});}
function closeVideo(){player.pause();player.removeAttribute("src");player.load();modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");}
document.querySelectorAll("[data-video]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();openVideo(el.dataset.video);}));
document.querySelector(".video-close")?.addEventListener("click",closeVideo);
document.querySelector(".video-backdrop")?.addEventListener("click",closeVideo);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal?.classList.contains("open"))closeVideo();});
