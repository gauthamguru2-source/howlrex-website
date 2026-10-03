const topbar=document.querySelector(".topbar"),menuBtn=document.querySelector(".menu-btn"),mobileMenu=document.querySelector(".mobile-menu");
document.documentElement.classList.add("js-ready");
window.addEventListener("scroll",()=>topbar?.classList.toggle("scrolled",scrollY>30),{passive:true});
menuBtn?.addEventListener("click",e=>{e.preventDefault();const open=mobileMenu.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open);mobileMenu.setAttribute("aria-hidden",!open)});
document.querySelectorAll(".mobile-menu a[href^="#"]").forEach(a=>a.addEventListener("click",()=>{mobileMenu.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");mobileMenu.setAttribute("aria-hidden","true")}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.1});document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));
const sections=[...document.querySelectorAll("main section[id]")],nav=[...document.querySelectorAll(".desktop-nav a")];const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -45% 0px"});sections.forEach(s=>navObserver.observe(s));
const videoFiles={"main-film":"assets/video/main-film.mp4","thirty-sec":"assets/video/thirty-sec.mp4","new-home":"assets/video/new-home.mp4"};const modal=document.querySelector(".video-modal"),player=document.querySelector("#player"),title=document.querySelector("#playerTitle");
let resumeMusicAfterVideo=false;
function openVideo(key){const src=videoFiles[key];if(!src)return;resumeMusicAfterVideo=!!musicEnabled;if(resumeMusicAfterVideo)stopMusic("video");player.src=src;title.textContent="HOWLREX • "+key.replaceAll("-"," ").toUpperCase();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");player.play().catch(()=>{})}
function closeVideo(){player.pause();player.removeAttribute("src");player.load();modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");if(resumeMusicAfterVideo){resumeMusicAfterVideo=false;startMusic(true)}}
document.querySelectorAll("[data-video]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();openVideo(el.dataset.video)}));document.querySelector(".video-close")?.addEventListener("click",closeVideo);document.querySelector(".video-backdrop")?.addEventListener("click",closeVideo);document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeVideo()});
const glow=document.querySelector(".cursor-glow");if(glow&&matchMedia("(pointer:fine)").matches)document.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
/* LIVE HOWLREX CLOCK */
const liveClock=document.getElementById("liveClock"),liveDate=document.getElementById("liveDate");
function updateLiveClock(){if(!liveClock||!liveDate)return;const now=new Date(),pad=n=>String(n).padStart(2,"0");liveClock.textContent=pad(now.getHours())+":"+pad(now.getMinutes())+":"+pad(now.getSeconds());liveDate.textContent=new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(now).toUpperCase()}
updateLiveClock();setInterval(updateLiveClock,1000);
/* HOWLREX BACKGROUND MUSIC — EXPLICIT USER-START */
const backgroundMusic=document.getElementById("backgroundMusic"),musicToggle=document.getElementById("musicToggle"),musicLabel=document.querySelector(".music-label");
let musicEnabled=false,manualMusicOff=false,musicPausedForVideo=false;
function updateMusicUI(on){musicEnabled=on;musicToggle?.setAttribute("aria-pressed",on?"true":"false");musicToggle?.setAttribute("aria-label",on?"Turn background music off":"Start background music");if(musicLabel)musicLabel.textContent=on?"SOUND ON":"SOUND"}
async function startMusic(force=false){
  if(!backgroundMusic||manualMusicOff&&!force||musicPausedForVideo)return false;
  try{
    backgroundMusic.volume=.28;
    await backgroundMusic.play();
    updateMusicUI(true);
    return true;
  }catch(err){
    updateMusicUI(false);
    return false;
  }
}
function stopMusic(reason="manual"){if(!backgroundMusic)return;if(reason==="video")musicPausedForVideo=true;backgroundMusic.pause();updateMusicUI(false)}
backgroundMusic?.addEventListener("error",()=>updateMusicUI(false));
backgroundMusic?.addEventListener("ended",()=>{if(!manualMusicOff&&!musicPausedForVideo){backgroundMusic.currentTime=0;startMusic(true)}});
/* A real click/tap is the reliable browser permission boundary for audible playback. */
const activateMusic=()=>{if(!musicEnabled&&!manualMusicOff)startMusic(true)};
musicToggle?.addEventListener("click",async e=>{e.preventDefault();e.stopPropagation();if(musicEnabled){manualMusicOff=true;musicPausedForVideo=false;stopMusic()}else{manualMusicOff=false;musicPausedForVideo=false;await startMusic(true)}});
document.addEventListener("click",activateMusic,{passive:true});
document.addEventListener("pointerdown",e=>{if(!musicToggle?.contains(e.target))activateMusic()},{passive:true});
document.addEventListener("touchstart",e=>{if(!musicToggle?.contains(e.target))activateMusic()},{passive:true});
