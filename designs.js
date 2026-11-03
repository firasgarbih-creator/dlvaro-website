(() => {
  const rail = document.querySelector('.designs-grid');
  const back = document.querySelector('.reel-prev');
  const forward = document.querySelector('.reel-next');
  if (rail && back && forward) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const distance = Math.abs(rail.scrollLeft);
      back.disabled = distance < 2;
      forward.disabled = distance >= rail.scrollWidth - rail.clientWidth - 2;
    };
    const move = direction => rail.scrollBy({
      left: direction * (document.documentElement.dir === 'rtl' ? -1 : 1) * (rail.querySelector('.design-card').getBoundingClientRect().width + 18),
      behavior: reduced.matches ? 'instant' : 'smooth'
    });
    back.addEventListener('click', () => move(-1));
    forward.addEventListener('click', () => move(1));
    rail.addEventListener('scroll', update, {passive:true});
    rail.addEventListener('keydown', event => {
      if (event.target !== rail || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move((event.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl') ? 1 : -1);
    });
    new ResizeObserver(update).observe(rail);
    document.addEventListener('dlvaro:locale', () => requestAnimationFrame(update));
    update();
  }

  const dialog = document.querySelector('.design-lightbox');
  const links = [...document.querySelectorAll('.design-open')];
  if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.design-full-image');
  const caption = dialog.querySelector('#design-lightbox-caption');
  const previous = dialog.querySelector('.design-prev');
  const next = dialog.querySelector('.design-next');
  let active = 0;
  let opener;
  function display(index) {
    active = Math.max(0, Math.min(links.length - 1, index));
    const source = links[active].querySelector('img');
    image.src = links[active].href;
    image.alt = source.alt;
    caption.textContent = source.alt;
    dialog.querySelector('.design-position').textContent = `${active + 1} / ${links.length}`;
    previous.disabled = active === 0;
    next.disabled = active === links.length - 1;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; display(index);
    dialog.showModal(); document.body.classList.add('design-lightbox-open');
  }));
  dialog.querySelector('.design-close').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => display(active - 1));
  next.addEventListener('click', () => display(active + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('design-lightbox-open'); opener?.focus();
  });
  dialog.addEventListener('keydown', event => {
    const rtl = document.documentElement.dir === 'rtl';
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); display(active + ((event.key === 'ArrowRight') !== rtl ? 1 : -1));
    }
  });
  document.addEventListener('dlvaro:locale', () => { if (dialog.open) display(active); });
})();
