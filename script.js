(function(){
"use strict";

/* HOWLREX CORE — resilient, mobile-first, dependency-light */

var $=function(sel,root){return (root||document).querySelector(sel);};
var $$=function(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));};

document.documentElement.classList.add("js-ready");

/* NAVIGATION */
var topbar=$(".topbar"), menuBtn=$(".menu-btn"), mobileMenu=$(".mobile-menu");
window.addEventListener("scroll",function(){
  if(topbar)topbar.classList.toggle("scrolled",window.scrollY>30);
},{passive:true});

if(menuBtn&&mobileMenu){
  menuBtn.addEventListener("click",function(e){
    e.preventDefault();
    var open=mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded",String(open));
    mobileMenu.setAttribute("aria-hidden",String(!open));
  });
  $$(".mobile-menu a[href^='#']").forEach(function(a){
    a.addEventListener("click",function(){
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded","false");
      mobileMenu.setAttribute("aria-hidden","true");
    });
  });
}

/* SCROLL REVEALS — graceful fallback */
if("IntersectionObserver" in window){
  var revealObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.08});
  $$(".reveal").forEach(function(el){revealObserver.observe(el);});
}else{
  $$(".reveal").forEach(function(el){el.classList.add("visible");});
}

/* ACTIVE SECTION NAV */
var sections=$$("main section[id]"), nav=$$(".desktop-nav a");
if("IntersectionObserver" in window&&sections.length&&nav.length){
  var navObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        nav.forEach(function(a){a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id);});
      }
    });
  },{rootMargin:"-45% 0px -45% 0px"});
  sections.forEach(function(s){navObserver.observe(s);});
}

/* VIDEO SYSTEM */
var videoFiles={
  "main-film":"assets/video/main-film.mp4",
  "thirty-sec":"assets/video/thirty-sec.mp4",
  "new-home":"assets/video/new-home.mp4"
};
var modal=$(".video-modal"), player=$("#player"), playerTitle=$("#playerTitle");
var resumeMusicAfterVideo=false;

function openVideo(key){
  if(!modal||!player)return;
  var src=videoFiles[key];
  if(!src)return;

  resumeMusicAfterVideo=!!musicEnabled;
  if(resumeMusicAfterVideo)stopMusic("video");

  player.pause();
  player.removeAttribute("src");
  player.load();
  player.src=src;
  player.setAttribute("playsinline","");
  player.setAttribute("controls","");
  if(playerTitle)playerTitle.textContent="HOWLREX • "+key.replace(/-/g," ").toUpperCase();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  var p=player.play();
  if(p&&p.catch)p.catch(function(){});
}

function closeVideo(){
  if(!modal||!player)return;
  player.pause();
  player.removeAttribute("src");
  player.load();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
  if(resumeMusicAfterVideo){
    resumeMusicAfterVideo=false;
    startMusic(true);
  }
}

$$("[data-video]").forEach(function(el){
  el.addEventListener("click",function(e){
    e.preventDefault();
    e.stopPropagation();
    openVideo(el.getAttribute("data-video"));
  });
});
var videoClose=$(".video-close"), videoBackdrop=$(".video-backdrop");
if(videoClose)videoClose.addEventListener("click",closeVideo);
if(videoBackdrop)videoBackdrop.addEventListener("click",closeVideo);
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&modal&&modal.classList.contains("open"))closeVideo();
});

/* LIVE INDIA CLOCK — independent and fault tolerant */
var liveClock=$("#liveClock"), liveDate=$("#liveDate");
function getIndiaDate(){
  var now=new Date();
  try{
    var dateText=new Intl.DateTimeFormat("en-IN",{
      timeZone:"Asia/Kolkata",
      weekday:"long",day:"2-digit",month:"long",year:"numeric"
    }).format(now).toUpperCase();
    var timeParts=new Intl.DateTimeFormat("en-IN",{
      timeZone:"Asia/Kolkata",
      hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false
    }).formatToParts(now);
    var map={};
    timeParts.forEach(function(p){map[p.type]=p.value;});
    var h=map.hour||"00",m=map.minute||"00",s=map.second||"00";
    return {time:h+":"+m+":"+s,date:dateText};
  }catch(err){
    var utc=now.getTime()+(now.getTimezoneOffset()*60000);
    var india=new Date(utc+19800000);
    var pad=function(n){return String(n).padStart(2,"0");};
    var days=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    var months=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
    return {
      time:pad(india.getHours())+":"+pad(india.getMinutes())+":"+pad(india.getSeconds()),
      date:days[india.getDay()]+", "+pad(india.getDate())+" "+months[india.getMonth()]+" "+india.getFullYear()
    };
  }
}
function updateLiveClock(){
  if(!liveClock||!liveDate)return;
  var value=getIndiaDate();
  liveClock.textContent=value.time;
  liveDate.textContent=value.date;
}
updateLiveClock();
window.setInterval(updateLiveClock,1000);

/* BACKGROUND MUSIC — explicit user gesture + mobile recovery */
var backgroundMusic=$("#backgroundMusic"), musicToggle=$("#musicToggle"), musicLabel=$(".music-label");
var musicEnabled=false, manualMusicOff=false, musicPausedForVideo=false, musicHasUserGesture=false;

function updateMusicUI(on,label){
  musicEnabled=!!on;
  if(musicToggle){
    musicToggle.setAttribute("aria-pressed",on?"true":"false");
    musicToggle.setAttribute("aria-label",on?"Turn background music off":"Start background music");
  }
  if(musicLabel)musicLabel.textContent=label||(on?"SOUND ON":"SOUND");
}
function musicErrorLabel(){
  var code=backgroundMusic&&backgroundMusic.error?backgroundMusic.error.code:0;
  if(code===4)return "FORMAT ERROR";
  if(code===3)return "LOAD ERROR";
  if(code===2)return "NETWORK";
  return "TAP TO PLAY";
}
async function startMusic(force){
  if(!backgroundMusic||musicPausedForVideo)return false;
  if(manualMusicOff&&!force)return false;
  try{
    backgroundMusic.volume=.28;
    backgroundMusic.muted=false;
    var promise=backgroundMusic.play();
    if(promise&&promise.then)await promise;
    musicHasUserGesture=true;
    updateMusicUI(true,"SOUND ON");
    return true;
  }catch(err){
    updateMusicUI(false,musicErrorLabel());
    return false;
  }
}
function stopMusic(reason){
  if(!backgroundMusic)return;
  if(reason==="video")musicPausedForVideo=true;
  backgroundMusic.pause();
  updateMusicUI(false,"SOUND");
}
function userStartMusic(){
  if(!musicEnabled&&!manualMusicOff&&!musicPausedForVideo)startMusic(true);
}

if(backgroundMusic){
  backgroundMusic.addEventListener("play",function(){updateMusicUI(true,"SOUND ON");});
  backgroundMusic.addEventListener("playing",function(){updateMusicUI(true,"SOUND ON");});
  backgroundMusic.addEventListener("pause",function(){
    if(!musicPausedForVideo&&!manualMusicOff)updateMusicUI(false,"TAP TO PLAY");
  });
  backgroundMusic.addEventListener("error",function(){updateMusicUI(false,musicErrorLabel());});
  backgroundMusic.addEventListener("ended",function(){
    if(!manualMusicOff&&!musicPausedForVideo){
      backgroundMusic.currentTime=0;
      startMusic(true);
    }
  });
}
if(musicToggle){
  musicToggle.addEventListener("click",async function(e){
    e.preventDefault();
    e.stopPropagation();
    if(musicEnabled){
      manualMusicOff=true;
      musicPausedForVideo=false;
      stopMusic("manual");
    }else{
      manualMusicOff=false;
      musicPausedForVideo=false;
      await startMusic(true);
    }
  });
}
document.addEventListener("pointerup",function(e){
  if(!musicToggle||!musicToggle.contains(e.target))userStartMusic();
},{passive:true});
document.addEventListener("keydown",function(e){
  if((e.key==="Enter"||e.key===" ")&&!musicEnabled&&!manualMusicOff&&!musicToggle?.contains(e.target))userStartMusic();
});
document.addEventListener("visibilitychange",function(){
  if(!document.hidden&&musicHasUserGesture&&!manualMusicOff&&!musicPausedForVideo&&!musicEnabled)startMusic(true);
});
window.addEventListener("pageshow",function(){
  if(musicHasUserGesture&&!manualMusicOff&&!musicPausedForVideo&&!musicEnabled)startMusic(true);
});
updateMusicUI(false,"SOUND");

/* CURSOR GLOW */
var glow=$(".cursor-glow");
if(glow&&window.matchMedia&&matchMedia("(pointer:fine)").matches){
  document.addEventListener("pointermove",function(e){
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
  },{passive:true});
}

})();