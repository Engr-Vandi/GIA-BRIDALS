// ── PAGE LOADER (home only; guarded) ──
const loader=document.getElementById('loader');
const lbar=document.getElementById('lbar');
if(loader){
  if(lbar)setTimeout(()=>lbar.style.width='100%',100);
  setTimeout(()=>{loader.classList.add('gone');startWordAnim();},1800);
}

// ── HERO WORD ANIMATION ──
function startWordAnim(){
  const words=document.querySelectorAll('.word-inner');
  words.forEach((w,i)=>{
    setTimeout(()=>{
      w.style.transition='transform .75s cubic-bezier(.19,1,.22,1), opacity .6s ease';
      w.style.transform='none';
      w.style.opacity='1';
    },2200+i*120);
  });
}

// ── MOBILE NAV ──
const ham=document.getElementById('ham');
const mobileNav=document.getElementById('mobileNav');
const mobileBackdrop=document.getElementById('mobileBackdrop');
let navOpen=false;
function openNav(){
  navOpen=true;
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden','false');
  ham.classList.add('open');
  ham.setAttribute('aria-expanded','true');
  ham.setAttribute('aria-label','Close menu');
  document.body.style.overflow='hidden';
}
function closeNav(){
  navOpen=false;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden','true');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded','false');
  ham.setAttribute('aria-label','Open menu');
  document.body.style.overflow='';
}
if(ham&&mobileNav&&mobileBackdrop){
  ham.addEventListener('click',()=>navOpen?closeNav():openNav());
  mobileBackdrop.addEventListener('click',closeNav);
  document.querySelectorAll('.mobile-nav-links a, .mobile-nav-book').forEach(a=>{
    a.addEventListener('click',()=>{
      closeNav();
      const href=a.getAttribute('href');
      if(href&&href.startsWith('#')){
        setTimeout(()=>{
          const t=document.querySelector(href);
          if(t)window.scrollTo({top:t.offsetTop-64,behavior:'smooth'});
        },300);
      }
    });
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navOpen)closeNav()});
}

// ── SCROLL PROGRESS ──
const prog=document.getElementById('progress');
if(prog){
  const updateProgress=()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    prog.style.width=(h>0?scrollY/h*100:0)+'%';
  };
  window.addEventListener('scroll',updateProgress,{passive:true});
}

// ── NAV SCROLL ──
const nav=document.getElementById('nav');
if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

// ── HERO VIDEO (robust autoplay: iOS/Android) ──
const heroVideo=document.getElementById('heroVideo');
if(heroVideo){
  heroVideo.muted=true;
  const tryPlay=()=>{const r=heroVideo.play();if(r&&r.catch)r.catch(()=>{});};
  heroVideo.addEventListener('loadeddata',tryPlay);
  tryPlay();
  const kick=()=>{tryPlay();window.removeEventListener('touchstart',kick);window.removeEventListener('click',kick);};
  window.addEventListener('touchstart',kick,{passive:true});
  window.addEventListener('click',kick);
}

// ── HERO PARALLAX (home only) ──
const heroBg=document.getElementById('heroBg');
if(heroBg){
  window.addEventListener('scroll',()=>{
    if(scrollY<innerHeight)heroBg.style.transform=`translateY(${scrollY*.35}px)`;
  },{passive:true});
}

// ── CUSTOM CURSOR ──
const curDot=document.getElementById('curDot');
const curRing=document.getElementById('curRing');
if(curDot&&curRing){
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    curDot.style.left=mx+'px';curDot.style.top=my+'px';
    document.body.classList.add('cursor-ready');
  });
  (function animRing(){
    rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
    curRing.style.left=rx+'px';curRing.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.addEventListener('mousedown',()=>document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',()=>document.body.classList.remove('cursor-click'));
  document.querySelectorAll('a,button,.svc,.dress-card,.bride-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

// ── SCROLL REVEAL ──
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      const gl=e.target.querySelector('.gold-line');
      if(gl)setTimeout(()=>gl.classList.add('drawn'),200);
      io.unobserve(e.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>io.observe(el));
document.querySelectorAll('.gold-line').forEach(gl=>{
  const io2=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('drawn');io2.unobserve(e.target)}});
  },{threshold:.5});
  io2.observe(gl);
});
const stepObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');stepObs.unobserve(e.target)}});
},{threshold:.3});
document.querySelectorAll('.step').forEach(s=>stepObs.observe(s));

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!open)item.classList.add('open');
  });
});

// ── TESTIMONIAL SLIDER (guarded) ──
const slides=document.querySelectorAll('.testi-slide');
const dots=document.querySelectorAll('.tdot');
if(slides.length){
  let cur=0,auto;
  const goTo=n=>{
    slides[cur].classList.remove('active');if(dots[cur])dots[cur].classList.remove('on');
    cur=n;
    slides[cur].classList.add('active');if(dots[cur])dots[cur].classList.add('on');
  };
  const startAuto=()=>{auto=setInterval(()=>goTo((cur+1)%slides.length),5400);};
  dots.forEach(d=>d.addEventListener('click',()=>{clearInterval(auto);goTo(+d.dataset.i);startAuto();}));
  startAuto();
}

// ── SMOOTH SCROLL (same-page anchors only) ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href.length<2)return;
    const t=document.querySelector(href);
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-80,behavior:'smooth'})}
  });
});

// ── CARD TILT (desktop) ──
if(matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.dress-card,.svc').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}
