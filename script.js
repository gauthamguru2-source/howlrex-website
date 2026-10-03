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
/* HOWLREX BACKGROUND MUSIC — MOBILE-SAFE USER-GESTURE PLAYBACK */
const backgroundMusic=document.getElementById("backgroundMusic"),
      musicToggle=document.getElementById("musicToggle"),
      musicLabel=document.querySelector(".music-label");

let musicEnabled=false,
    manualMusicOff=false,
    musicPausedForVideo=false,
    musicHasUserGesture=false;

function updateMusicUI(on,label){
  musicEnabled=on;
  musicToggle?.setAttribute("aria-pressed",on?"true":"false");
  musicToggle?.setAttribute("aria-label",on?"Turn background music off":"Start background music");
  if(musicLabel)musicLabel.textContent=label||(on?"SOUND ON":"SOUND");
}

function musicErrorLabel(){
  const code=backgroundMusic?.error?.code;
  if(code===4)return "FORMAT ERROR";
  if(code===3)return "LOAD ERROR";
  if(code===2)return "NETWORK";
  return "TAP TO PLAY";
}

async function startMusic(force=false){
  if(!backgroundMusic||musicPausedForVideo)return false;
  if(manualMusicOff&&!force)return false;

  try{
    backgroundMusic.volume=0.28;
    backgroundMusic.muted=false;
    const playPromise=backgroundMusic.play();
    if(playPromise&&typeof playPromise.then==="function")await playPromise;
    musicHasUserGesture=true;
    updateMusicUI(true,"SOUND ON");
    return true;
  }catch(err){
    updateMusicUI(false,musicErrorLabel());
    return false;
  }
}

function stopMusic(reason="manual"){
  if(!backgroundMusic)return;
  if(reason==="video")musicPausedForVideo=true;
  backgroundMusic.pause();
  updateMusicUI(false,"SOUND");
}

function userStartMusic(){
  if(!musicEnabled&&!manualMusicOff&&!musicPausedForVideo)startMusic(true);
}

/* Media diagnostics keep the control truthful instead of claiming playback started. */
backgroundMusic?.addEventListener("play",()=>updateMusicUI(true,"SOUND ON"));
backgroundMusic?.addEventListener("playing",()=>updateMusicUI(true,"SOUND ON"));
backgroundMusic?.addEventListener("pause",()=>{
  if(!musicPausedForVideo&&!manualMusicOff)updateMusicUI(false,"TAP TO PLAY");
});
backgroundMusic?.addEventListener("error",()=>updateMusicUI(false,musicErrorLabel()));
backgroundMusic?.addEventListener("stalled",()=>{if(!musicEnabled)updateMusicUI(false,"LOADING")});
backgroundMusic?.addEventListener("waiting",()=>{if(musicEnabled)updateMusicUI(true,"LOADING")});
backgroundMusic?.addEventListener("ended",()=>{
  if(!manualMusicOff&&!musicPausedForVideo){
    backgroundMusic.currentTime=0;
    startMusic(true);
  }
});

/* The first real tap/click anywhere is allowed to start audible media on mobile.
   The dedicated SOUND button remains the explicit fallback/control. */
musicToggle?.addEventListener("click",async e=>{
  e.preventDefault();
  e.stopPropagation();
  if(musicEnabled){
    manualMusicOff=true;
    musicPausedForVideo=false;
    stopMusic();
  }else{
    manualMusicOff=false;
    musicPausedForVideo=false;
    await startMusic(true);
  }
});

document.addEventListener("pointerup",e=>{
  if(!musicToggle?.contains(e.target))userStartMusic();
},{passive:true});

document.addEventListener("keydown",e=>{
  if((e.key==="Enter"||e.key===" ")&&!musicEnabled&&!manualMusicOff&&!musicToggle?.contains(e.target)){
    userStartMusic();
  }
});

document.addEventListener("visibilitychange",()=>{
  if(!document.hidden&&musicHasUserGesture&&!manualMusicOff&&!musicPausedForVideo&&!musicEnabled){
    startMusic(true);
  }
});

window.addEventListener("pageshow",()=>{
  if(musicHasUserGesture&&!manualMusicOff&&!musicPausedForVideo&&!musicEnabled)startMusic(true);
});

updateMusicUI(false,"SOUND");
