const topbar=document.querySelector(".topbar"),menuBtn=document.querySelector(".menu-btn"),mobileMenu=document.querySelector(".mobile-menu");
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
/* HOWLREX BACKGROUND MUSIC — RESILIENT PLAYBACK */
const backgroundMusic=document.getElementById("backgroundMusic"),musicToggle=document.getElementById("musicToggle"),musicLabel=document.querySelector(".music-label");
let musicEnabled=false,manualMusicOff=false,musicPausedForVideo=false,recoveryTimer=null;
function updateMusicUI(on){musicEnabled=on;musicToggle?.setAttribute("aria-pressed",on?"true":"false");musicToggle?.setAttribute("aria-label",on?"Turn background music off":"Start background music");if(musicLabel)musicLabel.textContent=on?"SOUND ON":"SOUND"}
function startMusic(force=false){if(!backgroundMusic||manualMusicOff&&!force||musicPausedForVideo)return;clearTimeout(recoveryTimer);backgroundMusic.volume=.28;const p=backgroundMusic.play();if(p)p.then(()=>updateMusicUI(true)).catch(()=>updateMusicUI(false))}
function stopMusic(reason="manual"){if(!backgroundMusic)return;if(reason==="video")musicPausedForVideo=true;backgroundMusic.pause();updateMusicUI(false)}
function recoverMusic(){if(!backgroundMusic||manualMusicOff||musicPausedForVideo)return;if(document.visibilityState==="hidden")return;if(backgroundMusic.paused){clearTimeout(recoveryTimer);recoveryTimer=setTimeout(()=>startMusic(),120)}}
if(backgroundMusic){
  backgroundMusic.addEventListener("error",()=>updateMusicUI(false));
  backgroundMusic.addEventListener("ended",()=>{if(!manualMusicOff&&!musicPausedForVideo){backgroundMusic.currentTime=0;startMusic()}});
  backgroundMusic.addEventListener("pause",recoverMusic);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")recoverMusic()});
  window.addEventListener("pageshow",recoverMusic);
  window.addEventListener("focus",recoverMusic);
  window.addEventListener("online",recoverMusic);
  window.addEventListener("load",()=>setTimeout(()=>startMusic(),100),{once:true});
  const wakeMusic=()=>startMusic();
  document.addEventListener("scroll",wakeMusic,{passive:true});
  document.addEventListener("wheel",wakeMusic,{passive:true});
  document.addEventListener("touchmove",wakeMusic,{passive:true});
  document.addEventListener("pointermove",wakeMusic,{passive:true});
  document.addEventListener("pointerup",wakeMusic,{passive:true});
  document.addEventListener("touchend",wakeMusic,{passive:true});
}
musicToggle?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();if(musicEnabled){manualMusicOff=true;musicPausedForVideo=false;stopMusic()}else{manualMusicOff=false;musicPausedForVideo=false;startMusic(true)}});


/* HOWLREX CINEMA 2.0 — LIVE MEDIA LAYER */
(()=>{
  const mediaData=[
    {key:"thirty-sec",label:"SHORT FILM",name:"30 SECOND CUT",sub:"ENERGY / STYLE / MOTION"},
    {key:"new-home",label:"LIFESTYLE",name:"NEW HOME",sub:"A NEW CHAPTER"},
    {key:"main-film",label:"ORIGINAL",name:"THE FRAME",sub:"BETWEEN THE SHOTS"}
  ];
  const srcFor=key=>videoFiles[key];
  const formatTime=s=>{
    if(!Number.isFinite(s))return "--:--";
    const m=Math.floor(s/60),sec=Math.floor(s%60);
    return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
  };

  /* Featured film: a silent cinematic preview with the existing poster retained as fallback. */
  const feature=document.querySelector(".feature-film");
  if(feature){
    const fv=document.createElement("video");
    fv.className="feature-video";
    fv.muted=true; fv.loop=true; fv.autoplay=true; fv.playsInline=true;
    fv.preload="metadata"; fv.setAttribute("aria-hidden","true");
    fv.src=srcFor("main-film");
    const status=document.createElement("div");
    status.className="film-status";
    status.innerHTML="<i></i><span>CINEMA PREVIEW / HD</span>";
    feature.insertBefore(fv,feature.querySelector(".film-overlay"));
    feature.appendChild(status);
    fv.addEventListener("loadeddata",()=>{fv.classList.add("ready");feature.classList.add("media-ready")},{once:true});
    fv.addEventListener("error",()=>{fv.removeAttribute("src");fv.load()});
    fv.play().catch(()=>{});
  }

  /* Convert the existing cards into premium, lightweight video previews. */
  const cards=[...document.querySelectorAll(".media-card[data-video]")];
  cards.forEach((card,index)=>{
    const key=card.dataset.video;
    const data=mediaData.find(x=>x.key===key);
    if(!data)return;

    card.setAttribute("tabindex","0");
    card.setAttribute("aria-label","Play "+data.name);
    const preview=document.createElement("video");
    preview.className="media-preview";
    preview.muted=true; preview.loop=true; preview.playsInline=true;
    preview.preload="none"; preview.setAttribute("aria-hidden","true");
    const duration=document.createElement("span");
    duration.className="media-duration";
    duration.textContent="MEDIA";
    const live=document.createElement("span");
    live.className="media-live";
    live.textContent="PREVIEW";
    const progress=document.createElement("div");
    progress.className="media-progress";
    progress.innerHTML="<span></span>";
    card.insertBefore(preview,card.firstChild);
    card.append(duration,live,progress);

    let loaded=false;
    const loadPreview=()=>{
      if(loaded)return;
      loaded=true;
      preview.src=srcFor(key);
      preview.load();
      preview.addEventListener("loadedmetadata",()=>{
        duration.textContent=formatTime(preview.duration);
      },{once:true});
      preview.addEventListener("loadeddata",()=>{
        preview.classList.add("ready");
        preview.play().catch(()=>{});
      },{once:true});
      preview.addEventListener("timeupdate",()=>{
        const pct=preview.duration?preview.currentTime/preview.duration*100:0;
        progress.firstElementChild.style.width=pct+"%";
      });
      preview.addEventListener("error",()=>{
        preview.classList.remove("ready");
        duration.textContent="VIDEO";
      });
    };
    const stopPreview=()=>{
      if(!loaded)return;
      preview.pause();
      try{preview.currentTime=0}catch{}
      progress.firstElementChild.style.width="0%";
    };
    card.addEventListener("pointerenter",loadPreview,{passive:true});
    card.addEventListener("pointerleave",stopPreview,{passive:true});
    card.addEventListener("focusin",loadPreview);
    card.addEventListener("focusout",stopPreview);
    card.addEventListener("touchstart",loadPreview,{passive:true});
  });

  /* Premium cinema toolbar. */
  const rail=document.querySelector(".media-rail");
  if(rail){
    const toolbar=document.createElement("div");
    toolbar.className="cinema-toolbar reveal visible";
    toolbar.innerHTML='<div class="toolbar-left"><span>HOWLREX CINEMA</span><strong>MEDIA LIBRARY</strong></div><div class="toolbar-right"><span class="cinema-hint">HOVER FOR MOTION</span><span>03 FILMS / LOCAL 4K READY</span></div>';
    rail.parentNode.insertBefore(toolbar,rail);
  }

  /* Upgrade the existing modal with browse controls without replacing the native video controls. */
  if(modal&&player&&title){
    const bar=modal.querySelector(".player-bar");
    if(bar&&!bar.querySelector(".player-nav")){
      const originalTitle=title;
      const main=document.createElement("div");
      main.className="player-main";
      originalTitle.parentNode.insertBefore(main,originalTitle);
      main.appendChild(originalTitle);
      const eyebrow=document.createElement("span");
      eyebrow.className="player-eyebrow";
      eyebrow.textContent="HOWLREX CINEMA";
      main.appendChild(eyebrow);

      const navWrap=document.createElement("div");
      navWrap.className="player-nav";
      const prev=document.createElement("button");
      const next=document.createElement("button");
      prev.type=next.type="button";
      prev.setAttribute("aria-label","Previous film");
      next.setAttribute("aria-label","Next film");
      prev.textContent="←"; next.textContent="→";
      navWrap.append(prev,next);

      const quality=document.createElement("span");
      quality.className="player-quality";
      quality.textContent="HD / SOUND ON PLAYER";
      bar.replaceChildren(main,navWrap,quality);

      let currentIndex=0;
      const findIndex=key=>Math.max(0,mediaData.findIndex(x=>x.key===key));
      const playKey=key=>{
        const src=srcFor(key);
        if(!src)return;
        currentIndex=findIndex(key);
        title.textContent="HOWLREX • "+key.replaceAll("-"," ").toUpperCase();
        player.src=src;
        player.load();
        player.play().catch(()=>{});
        prev.disabled=currentIndex<=0;
        next.disabled=currentIndex>=mediaData.length-1;
      };
      const originalOpen=window.openVideo;
      /* Buttons already call the original function; observe the modal after it opens and sync the index. */
      const sync=()=>{
        const key=player.src.split("/").pop()?.split(".")[0]||"";
        currentIndex=findIndex(key);
        prev.disabled=currentIndex<=0;
        next.disabled=currentIndex>=mediaData.length-1;
      };
      prev.addEventListener("click",e=>{
        e.stopPropagation();
        if(currentIndex>0)playKey(mediaData[currentIndex-1].key);
      });
      next.addEventListener("click",e=>{
        e.stopPropagation();
        if(currentIndex<mediaData.length-1)playKey(mediaData[currentIndex+1].key);
      });
      modal.addEventListener("transitionend",sync);
      const observer=new MutationObserver(sync);
      observer.observe(modal,{attributes:true,attributeFilter:["class","aria-hidden"]});
      document.addEventListener("keydown",e=>{
        if(!modal.classList.contains("open"))return;
        if(e.key==="ArrowLeft"&&!prev.disabled)prev.click();
        if(e.key==="ArrowRight"&&!next.disabled)next.click();
      });
      sync();
    }
  }

  /* Horizontal cinema rail: wheel gestures become a natural film-strip interaction. */
  if(rail){
    rail.addEventListener("wheel",e=>{
      if(Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;
      if(rail.scrollWidth<=rail.clientWidth)return;
      e.preventDefault();
      rail.scrollLeft+=e.deltaY;
    },{passive:false});
  }
})();
