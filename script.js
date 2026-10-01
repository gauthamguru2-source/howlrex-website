const header=document.querySelector('.site-header');const menu=document.querySelector('.menu-btn');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30),{passive:true});
menu?.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false')});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
