(() => {
  const film = document.querySelector('.design-film');
  if (!film) return;
  const shots = [...film.querySelectorAll('.film-shot')];
  const chapters = [...film.querySelectorAll('.film-chapter')];
  const toggle = film.querySelector('.film-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = film.querySelector('.film-lightbox');
  const enlarge = film.querySelector('.film-enlarge');
  let active = 0, elapsed = 0, previousTime = 0, onScreen = false;
  let playing = !reduced.matches, ended = false;
  const seconds = 7;
  const words = () => copy[document.documentElement.lang === 'ar' ? 'ar' : 'en'];
  film.querySelector('.film-controls').hidden = false;
  film.classList.add('film-enhanced');
  function labels() {
    const lang = words(), shot = shots[active];
    film.querySelector('.film-caption').textContent = lang[shot.dataset.caption];
    const story = film.querySelector('.film-story');
    story.dataset.i18n = shot.dataset.story;
    story.textContent = lang[shot.dataset.story];
    film.querySelector('.film-count').textContent = `${String(active+1).padStart(2,'0')} / 07`;
    chapters.forEach((button,i) => button.setAttribute('aria-label',`${lang.filmChapter} ${i+1}: ${lang[shots[i].dataset.caption]}`));
    toggle.dataset.i18n = ended ? 'filmReplay' : playing ? 'filmPause' : 'filmPlay';
    toggle.textContent = lang[toggle.dataset.i18n];
    film.querySelector('.film-prev').disabled = active === 0;
    film.querySelector('.film-next').disabled = active === shots.length-1;
    if (dialog.open) {
      dialog.querySelector('img').alt = lang[shot.dataset.caption];
      dialog.querySelector('p').textContent = lang[shot.dataset.caption];
    }
  }
  function show(index, manual = false) {
    active = Math.max(0,Math.min(shots.length-1,index)); elapsed=0; ended=false;
    if (manual) playing=false;
    shots.forEach((shot,i) => {shot.classList.toggle('is-active',i===active);shot.setAttribute('aria-hidden',String(i!==active));});
    chapters.forEach((button,i) => button.setAttribute('aria-pressed',String(i===active)));
    const src=shots[active].querySelector('img').getAttribute('src');
    enlarge.href=src;
    film.querySelector('.film-atmosphere img').src=src;
    const upcoming=shots[active+1]?.querySelector('img'); if(upcoming)upcoming.loading='eager';
    labels(); progress();
  }
  function progress() {
    chapters.forEach((button,i)=>button.style.setProperty('--chapter-progress',`${i<active?100:i===active?elapsed/seconds*100:0}%`));
  }
  function setPlaying(value) { playing=value; labels(); }
  toggle.addEventListener('click',()=>{if(ended)show(0);setPlaying(!playing);});
  film.querySelector('.film-prev').addEventListener('click',()=>show(active-1,true));
  film.querySelector('.film-next').addEventListener('click',()=>show(active+1,true));
  chapters.forEach((button,i)=>button.addEventListener('click',()=>show(i,true)));
  film.addEventListener('keydown',event=>{
    if(dialog.open || !['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const rtl=document.documentElement.dir==='rtl';
    show(active+((event.key==='ArrowRight')!==rtl?1:-1),true);
  });
  let touchX=null;
  const visual=film.querySelector('.film-visual');
  visual.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;},{passive:true});
  visual.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>60)show(active+(dx<0?1:-1)*(document.documentElement.dir==='rtl'?-1:1),true);},{passive:true});
  enlarge.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof dialog.showModal!=='function')return;
    event.preventDefault();setPlaying(false);dialog.querySelector('img').src=enlarge.href;
    dialog.querySelector('img').alt=words()[shots[active].dataset.caption];
    dialog.querySelector('p').textContent=words()[shots[active].dataset.caption];
    dialog.showModal();document.body.classList.add('design-lightbox-open');
  });
  film.querySelector('.film-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('design-lightbox-open');enlarge.focus();});
  new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;},{threshold:.2}).observe(film);
  reduced.addEventListener('change',()=>{if(reduced.matches)setPlaying(false);});
  document.addEventListener('dlvaro:locale',labels);
  function tick(now) {
    const delta=previousTime?Math.min((now-previousTime)/1000,.1):0;previousTime=now;
    const running=playing&&onScreen&&!document.hidden&&!document.documentElement.classList.contains('splash-pending')&&!document.body.classList.contains('menu-open')&&!dialog.open;
    film.classList.toggle('is-playing',running);
    if(running){elapsed+=delta;if(elapsed>=seconds){if(active<shots.length-1)show(active+1);else{elapsed=seconds;ended=true;setPlaying(false);}}progress();}
    requestAnimationFrame(tick);
  }
  show(0);requestAnimationFrame(tick);
})();
