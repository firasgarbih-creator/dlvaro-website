(() => {
  'use strict';
  const page = document.querySelector('.dial-page');
  if (!page) return;
  const links = [...page.querySelectorAll('[data-dial-index]')];
  const diagramButtons = [...page.querySelectorAll('[data-diagram]')];
  const dialog = page.querySelector('.dial-lightbox');
  const image = dialog.querySelector('.dial-full-image');
  let active = 0;
  let opener;
  function diagram(language) {
    page.querySelectorAll('[data-diagram-panel]').forEach(panel => { panel.hidden = panel.dataset.diagramPanel !== language; });
    diagramButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.diagram === language)));
  }
  function show(index) {
    active = (index + links.length) % links.length;
    image.src = links[active].href;
    image.alt = links[active].querySelector('img').alt;
    dialog.querySelector('.dial-count').textContent = String(active + 1).padStart(2,'0') + ' / 04';
  }
  links.forEach((link,index) => link.addEventListener('click', event => {
    event.preventDefault();
    opener = link;
    show(index);
    dialog.showModal();
    document.body.classList.add('dial-modal-open');
  }));
  diagramButtons.forEach(button => button.addEventListener('click', () => diagram(button.dataset.diagram)));
  dialog.querySelector('.dial-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.dial-prev').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.dial-next').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(active + ((event.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl') ? 1 : -1));
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dial-modal-open');
    opener?.focus();
  });
  const localize = () => {
    diagram(document.documentElement.lang === 'ar' ? 'ar' : 'en');
    if (dialog.open) show(active);
  };
  document.addEventListener('dlvaro:locale', localize);
  localize();
  page.classList.add('dial-ready');
})();
