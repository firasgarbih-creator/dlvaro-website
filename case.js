(() => {
  const gallery = document.querySelector('.case-gallery');
  if (!gallery) return;
  const thumbs = [...gallery.querySelectorAll('.case-thumb')];
  const stage = gallery.querySelector('.case-stage');
  const image = document.getElementById('case-image');
  const dialog = document.querySelector('.case-lightbox');
  const fullImage = dialog.querySelector('.case-full-image');
  let active = 0;
  let opener = stage;
  function show(index, animate = true) {
    active = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[active];
    const alt = copy[locale][thumb.querySelector('img').dataset.i18nAlt];
    image.src = thumb.href;
    image.alt = alt;
    stage.href = thumb.href;
    fullImage.src = thumb.href;
    fullImage.alt = alt;
    thumbs.forEach((item, i) => item.setAttribute('aria-current', String(i === active)));
    document.querySelectorAll('.case-count').forEach(node => { node.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(thumbs.length).padStart(2, '0'); });
    if (animate) {
      stage.classList.remove('is-changing');
      requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-changing')));
    }
  }
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', event => { event.preventDefault(); show(index); }));
  document.querySelectorAll('.case-prev').forEach(button => button.addEventListener('click', () => show(active - 1)));
  document.querySelectorAll('.case-next').forEach(button => button.addEventListener('click', () => show(active + 1)));
  stage.addEventListener('click', event => {
    event.preventDefault();
    opener = document.activeElement;
    dialog.showModal();
    document.body.classList.add('case-modal-open');
  });
  dialog.querySelector('.case-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('case-modal-open'); opener?.focus(); });
  function keys(event) {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(active + ((event.key === 'ArrowRight') !== (locale === 'ar') ? 1 : -1));
  }
  gallery.addEventListener('keydown', keys);
  dialog.addEventListener('keydown', keys);
  for (const surface of [stage, fullImage]) {
    let start;
    surface.addEventListener('touchstart', event => { const p=event.changedTouches[0]; start={x:p.clientX,y:p.clientY}; }, {passive:true});
    surface.addEventListener('touchend', event => {
      if (!start) return;
      const p=event.changedTouches[0], dx=p.clientX-start.x, dy=p.clientY-start.y;
      if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) show(active + ((dx<0)!==(locale==='ar')?1:-1));
      start=null;
    }, {passive:true});
  }
  document.addEventListener('dlvaro:locale', () => {
    show(active, false);
  });
  document.dispatchEvent(new CustomEvent('dlvaro:locale'));
})();
