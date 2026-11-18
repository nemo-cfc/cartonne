function initializeReference(){

(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var root=document.documentElement,body=document.body;
  $('#yr').textContent=new Date().getFullYear();

  /* header shadow + mobile bar */
  var header=$('#header'),mbar=$('#mbar'),hero=$('.hero');
  new IntersectionObserver(function(e){
    var past=!e[0].isIntersecting;mbar.classList.toggle('show',past);
  },{rootMargin:'-60% 0px 0px 0px'}).observe(hero);
  var ticking=false;
  addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){header.classList.toggle('scrolled',scrollY>40);ticking=false;tagline();});},{passive:true});

  /* mobile menu */
  var menuBtn=$('.menu-btn'),mm=$('#mobile-menu');
  matchMedia('(min-width:1101px)').addEventListener('change',function(e){if(e.matches)setMenu(false)});
  function setMenu(open){
    body.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',open);menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');mm.setAttribute('aria-hidden',!open);mm.inert=!open;
    $$('a,button',mm).forEach(function(a,i){a.style.transitionDelay=open?Math.min(i*60,400)+'ms':'0ms'});
    body.style.overflow=open?'hidden':'';
    if(open){setTimeout(function(){$('a',mm).focus()},50)}else{menuBtn.focus()}
  }
  menuBtn.addEventListener('click',function(){setMenu(!body.classList.contains('menu-open'))});
  $$('a',mm).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  /* active nav */
  var links=$$('.nav a');
  var secObs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.setAttribute('aria-current',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  ['products','work','process','faq','quote'].forEach(function(id){secObs.observe(document.getElementById(id))});

  /* drawer */
  var drawer=$('#drawer'),lastFocus=null;
  function openQuote(type){
    if(body.classList.contains('menu-open'))setMenu(false);
    lastFocus=document.activeElement;
    var card=$('.form-card',drawer);
    if(card.classList.contains('form-done'))resetForm(card);
    if(type){var r=$('input[name=type][value="'+type+'"]',drawer);if(r)r.checked=true;}
    body.classList.add('drawer-open');drawer.setAttribute('aria-hidden','false');drawer.inert=false;body.style.overflow='hidden';
    setTimeout(function(){$('#d-name').focus()},350);
  }
  function closeQuote(){body.classList.remove('drawer-open');drawer.setAttribute('aria-hidden','true');drawer.inert=true;body.style.overflow='';if(lastFocus)lastFocus.focus();}
  $$('[data-open-quote]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openQuote(b.getAttribute('data-type'))})});
  $$('[data-close-quote]').forEach(function(b){b.addEventListener('click',closeQuote)});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(body.classList.contains('drawer-open'))closeQuote();else if(body.classList.contains('menu-open'))setMenu(false);}
    if(e.key==='Tab'&&body.classList.contains('menu-open')){
      var mf=$$('a,button',mm),firstMenu=mf[0],lastMenu=mf[mf.length-1];
      if(e.shiftKey&&document.activeElement===firstMenu){e.preventDefault();menuBtn.focus()}else if(e.shiftKey&&document.activeElement===menuBtn){e.preventDefault();lastMenu.focus()}else if(!e.shiftKey&&document.activeElement===lastMenu){e.preventDefault();menuBtn.focus()}else if(!e.shiftKey&&document.activeElement===menuBtn){e.preventDefault();firstMenu.focus()}
    }
    if(e.key==='Tab'&&body.classList.contains('drawer-open')){
      var f=$$('button,a,input,select,textarea',drawer).filter(function(x){return x.offsetParent!==null});
      if(!f.length)return;var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });

  /* forms */
  function digits(v){v=v.replace(/\D/g,'');if(v.length===12&&v.indexOf('91')===0)v=v.slice(2);if(v.length===11&&v[0]==='0')v=v.slice(1);return v}
  function checkField(field){
    var input=$('input,select,textarea',field);if(!input||!input.required)return true;
    var ok;
    if(input.type==='radio'){ok=!!$('input:checked',field)}
    else if(input.dataset.type==='phone'){ok=/^[6-9]\d{9}$/.test(digits(input.value))}
    else if(input.type==='email'){ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())}
    else ok=input.value.trim().length>1||(input.tagName==='SELECT'&&input.value!=='');
    field.classList.toggle('invalid',!ok);
    $$('input,select,textarea',field).forEach(function(i){i.setAttribute('aria-invalid',!ok)});
    return ok;
  }
  function progress(form){
    var card=form.closest('.form-card'),bar=$('.progress .bar i',card);if(!bar)return;
    var req=$$('.field',form).filter(function(f){var i=$('input,select,textarea',f);return i&&i.required});
    var done=req.filter(function(f){var i=$('input,select,textarea',f);if(i.type==='radio')return !!$('input:checked',f);if(i.dataset.type==='phone')return /^[6-9]\d{9}$/.test(digits(i.value));if(i.type==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim());return i.value.trim()!==''}).length;
    var p=Math.round(done/req.length*100);bar.style.transform='scaleX('+(p/100)+')';$('.pct',card).textContent=p+'% complete';
  }
  function resetForm(card){var f=$('form',card);f.reset();$$('.field',f).forEach(function(x){x.classList.remove('invalid')});card.classList.remove('form-done');progress(f);}
  $$('.lead-form').forEach(function(form){
    var card=form.closest('.form-card');
    $$('.field',form).forEach(function(field){
      $$('input,select,textarea',field).forEach(function(i){
        i.addEventListener('blur',function(){if(i.value||field.classList.contains('invalid'))checkField(field)});
        i.addEventListener('input',function(){if(field.classList.contains('invalid'))checkField(field);progress(form)});
        i.addEventListener('change',function(){if(field.classList.contains('invalid'))checkField(field);progress(form)});
      });
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var fields=$$('.field',form),bad=fields.filter(function(f){return !checkField(f)});
      if(bad.length){var i=$('input,select,textarea',bad[0]);i.focus();return}
      var btn=$('.submit',form),lbl=$('.label',btn),data=new FormData(form);
      btn.setAttribute('aria-busy','true');lbl.textContent='Sending';
      btn.removeAttribute('aria-busy');lbl.textContent='Get my quote';
      var lines=Array.from(data.entries()).map(function(pair){return pair[0]+': '+pair[1]});
      var mail='mailto:hello@cartonne.in?subject='+encodeURIComponent('Custom packaging quote')+'&body='+encodeURIComponent(lines.join('\n'));
      window.location.href=mail;
      $('.success-msg',card).textContent='Your email app has been opened with your details. Send the email to request a quote, or call +91 98105 12657.';
      card.classList.add('form-done');

    });
    var r=$('.reset-form',card);if(r)r.addEventListener('click',function(){resetForm(card)});
  });

  /* work filter */
  var cards=$$('.work-card'),tabs=$$('.tab'),empty=$('#work-empty');
  tabs.forEach(function(t){
    var f=t.dataset.filter,n=f==='all'?cards.length:cards.filter(function(c){return c.dataset.cat.split(' ').indexOf(f)>-1}).length;
    t.insertAdjacentHTML('beforeend','<span class="n">'+n+'</span>');
    t.addEventListener('click',function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected',x===t)});
      var shown=0;
      cards.forEach(function(c){var on=f==='all'||c.dataset.cat.split(' ').indexOf(f)>-1;c.classList.toggle('is-hidden',!on);c.classList.remove('is-in');if(on){shown++;void c.offsetWidth;c.classList.add('is-in')}});
      empty.style.display=shown?'none':'block';
      var g=$('#work-grid');if(g._rebuild)g._rebuild();
    });
  });

  /* swipe carousels (phone width) */
  var mq=matchMedia('(max-width:640px)');
  $$('.swipe').forEach(function(track){
    var dots=document.createElement('div');dots.className='dots';dots.setAttribute('aria-label','Choose slide');track.after(dots);
    function items(){return $$(':scope>*',track).filter(function(c){return c.offsetParent!==null&&!c.classList.contains('work-empty')})}
    function build(){
      var list=items();dots.innerHTML='';
      list.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show item '+(i+1)+' of '+list.length);
        b.addEventListener('click',function(){track.scrollTo({left:c.offsetLeft-track.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft),behavior:'smooth'})});dots.appendChild(b)});
      sync();
    }
    function sync(){
      var list=items(),pad=parseFloat(getComputedStyle(track).paddingLeft),x=track.scrollLeft,best=0,d=1e9;
      list.forEach(function(c,i){var dd=Math.abs(c.offsetLeft-track.offsetLeft-pad-x);if(dd<d){d=dd;best=i}});
      if(track.scrollLeft+track.clientWidth>=track.scrollWidth-4)best=list.length-1;
      $$('button',dots).forEach(function(b,i){b.setAttribute('aria-current',i===best)});
    }
    var t=false;track.addEventListener('scroll',function(){if(t)return;t=true;requestAnimationFrame(function(){sync();t=false})},{passive:true});
    track._rebuild=function(){track.scrollLeft=0;build()};
    (mq.addEventListener?mq.addEventListener('change',build):mq.addListener(build));
    build();
  });

  /* reveal */
  var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.08});
  $$('.reveal').forEach(function(el,i){
    var sib=el.parentElement?$$('.reveal',el.parentElement).indexOf(el):0;
    el.style.transitionDelay=(Math.max(sib,0)%5)*60+'ms';rv.observe(el);
  });

  /* tagline word reveal */
  var tl=$('#tagline');
  (function split(){
    var out='';
    tl.childNodes.forEach(function(n){
      var accent=n.nodeType===1,txt=n.textContent;
      txt.split(/(\s+)/).forEach(function(w){if(!w.trim()){out+=w;return}out+='<span class="w'+(accent?' accent':'')+'">'+w+'</span>'});
    });
    tl.innerHTML=out;
  })();
  var words=$$('.w',tl);
  function tagline(){
    var line=innerHeight*0.72;
    for(var i=0;i<words.length;i++){var r=words[i].getBoundingClientRect();words[i].classList.toggle('on',r.top<line)}
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){words.forEach(function(w){w.classList.add('on')})}
  tagline();
})();


// Hero Carousel Controller with autoplay and sync
(function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".s-dot");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const formatEl = document.getElementById("live-slide-format");
  const specEl = document.getElementById("live-slide-spec");
  const priceEl = document.getElementById("live-slide-price");

  if (!slides.length) return;
  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dots.forEach((d, i) => {d.classList.toggle("active", i === current);d.setAttribute("aria-current",String(i===current))});
    slides.forEach((s,i)=>s.setAttribute("aria-hidden",String(i!==current)));

    // Sync dynamic badges with active slide
    const activeSlide = slides[current];
    if (formatEl && activeSlide.dataset.format) formatEl.textContent = activeSlide.dataset.format;
    if (specEl && activeSlide.dataset.spec) specEl.textContent = activeSlide.dataset.spec;
    if (priceEl && activeSlide.dataset.price) priceEl.textContent = activeSlide.dataset.price;
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    if(matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden)return;
    timer = setInterval(nextSlide, 4200);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAutoplay(); });
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  const sliderEl = document.getElementById("hero-slider");
  if (sliderEl) {
    sliderEl.addEventListener("mouseenter", stopAutoplay);
    sliderEl.addEventListener("mouseleave", startAutoplay);
  }

  document.addEventListener('visibilitychange',function(){if(document.hidden)stopAutoplay();else startAutoplay()});
  sliderEl.addEventListener('focusin',stopAutoplay);
  sliderEl.addEventListener('focusout',startAutoplay);
  showSlide(0);
  startAutoplay();
})();

}
initializeReference();
