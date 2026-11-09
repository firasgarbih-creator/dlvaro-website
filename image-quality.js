(() => {
  'use strict';
  const records = [{"original":"assets/case/dv-01-case-1.jpg","variants":[{"src":"assets/highres/dv-01-case-1-640.webp","width":585},{"src":"assets/highres/dv-01-case-1-1600.webp","width":1462},{"src":"assets/highres/dv-01-case-1-3200.webp","width":2924},{"src":"assets/highres/dv-01-case-1-8k.webp","width":7019}],"full":"assets/highres/dv-01-case-1-8k.webp"},{"original":"assets/case/dv-01-case-2.jpg","variants":[{"src":"assets/highres/dv-01-case-2-640.webp","width":585},{"src":"assets/highres/dv-01-case-2-1600.webp","width":1462},{"src":"assets/highres/dv-01-case-2-3200.webp","width":2924},{"src":"assets/highres/dv-01-case-2-8k.webp","width":7019}],"full":"assets/highres/dv-01-case-2-8k.webp"},{"original":"assets/case/dv-01-case-3.jpg","variants":[{"src":"assets/highres/dv-01-case-3-640.webp","width":582},{"src":"assets/highres/dv-01-case-3-1600.webp","width":1455},{"src":"assets/highres/dv-01-case-3-3200.webp","width":2910},{"src":"assets/highres/dv-01-case-3-8k.webp","width":6985}],"full":"assets/highres/dv-01-case-3-8k.webp"},{"original":"assets/case/dv-01-case-4.jpg","variants":[{"src":"assets/highres/dv-01-case-4-640.webp","width":585},{"src":"assets/highres/dv-01-case-4-1600.webp","width":1462},{"src":"assets/highres/dv-01-case-4-3200.webp","width":2924},{"src":"assets/highres/dv-01-case-4-8k.webp","width":7019}],"full":"assets/highres/dv-01-case-4-8k.webp"},{"original":"assets/case/dv-01-case-5.jpg","variants":[{"src":"assets/highres/dv-01-case-5-640.webp","width":585},{"src":"assets/highres/dv-01-case-5-1600.webp","width":1462},{"src":"assets/highres/dv-01-case-5-3200.webp","width":2924},{"src":"assets/highres/dv-01-case-5-8k.webp","width":7019}],"full":"assets/highres/dv-01-case-5-8k.webp"},{"original":"assets/dial/dv-01-dial-components-ar-hands-v2.jpg","variants":[{"src":"assets/highres/dv-01-dial-components-ar-hands-v2-640.webp","width":640},{"src":"assets/highres/dv-01-dial-components-ar-hands-v2-1600.webp","width":1600},{"src":"assets/highres/dv-01-dial-components-ar-hands-v2-3200.webp","width":3200},{"src":"assets/highres/dv-01-dial-components-ar-hands-v2-8k.webp","width":7680}],"full":"assets/highres/dv-01-dial-components-ar-hands-v2-8k.webp"},{"original":"assets/dial/dv-01-dial-components-en-hands-v2.jpg","variants":[{"src":"assets/highres/dv-01-dial-components-en-hands-v2-640.webp","width":640},{"src":"assets/highres/dv-01-dial-components-en-hands-v2-1600.webp","width":1600},{"src":"assets/highres/dv-01-dial-components-en-hands-v2-3200.webp","width":3200},{"src":"assets/highres/dv-01-dial-components-en-hands-v2-8k.webp","width":7680}],"full":"assets/highres/dv-01-dial-components-en-hands-v2-8k.webp"},{"original":"assets/dial/dv-01-dial-day-black.jpg","variants":[{"src":"assets/highres/dv-01-dial-day-black-640.webp","width":640},{"src":"assets/highres/dv-01-dial-day-black-1600.webp","width":1600},{"src":"assets/highres/dv-01-dial-day-black-3200.webp","width":3200},{"src":"assets/highres/dv-01-dial-day-black-8k.webp","width":7680}],"full":"assets/highres/dv-01-dial-day-black-8k.webp"},{"original":"assets/dial/dv-01-dial-night-hand-v4.jpg","variants":[{"src":"assets/highres/dv-01-dial-night-hand-v4-640.webp","width":640},{"src":"assets/highres/dv-01-dial-night-hand-v4-1600.webp","width":1600},{"src":"assets/highres/dv-01-dial-night-hand-v4-3200.webp","width":3200},{"src":"assets/highres/dv-01-dial-night-hand-v4-8k.webp","width":7680}],"full":"assets/highres/dv-01-dial-night-hand-v4-8k.webp"},{"original":"assets/dlvaro-emblem-silver.png","variants":[{"src":"assets/highres/dlvaro-emblem-silver-640.webp","width":640},{"src":"assets/highres/dlvaro-emblem-silver-1600.webp","width":1600},{"src":"assets/highres/dlvaro-emblem-silver-3200.webp","width":3200},{"src":"assets/highres/dlvaro-emblem-silver-8k.webp","width":7680}],"full":"assets/highres/dlvaro-emblem-silver-8k.webp"},{"original":"assets/dlvaro-logo.png","variants":[{"src":"assets/highres/dlvaro-logo-640.webp","width":489},{"src":"assets/highres/dlvaro-logo-1600.webp","width":1222},{"src":"assets/highres/dlvaro-logo-3200.webp","width":2444},{"src":"assets/highres/dlvaro-logo-8k.webp","width":5866}],"full":"assets/highres/dlvaro-logo-8k.webp"},{"original":"assets/dlvaro-signature-triangles-silver.jpg","variants":[{"src":"assets/highres/dlvaro-signature-triangles-silver-640.webp","width":640},{"src":"assets/highres/dlvaro-signature-triangles-silver-1600.webp","width":1600},{"src":"assets/highres/dlvaro-signature-triangles-silver-3200.webp","width":3200},{"src":"assets/highres/dlvaro-signature-triangles-silver-8k.webp","width":7680}],"full":"assets/highres/dlvaro-signature-triangles-silver-8k.webp"},{"original":"assets/dv-01-approved.png","variants":[{"src":"assets/highres/dv-01-approved-640.webp","width":419},{"src":"assets/highres/dv-01-approved-1600.webp","width":1047},{"src":"assets/highres/dv-01-approved-3200.webp","width":2093},{"src":"assets/highres/dv-01-approved-8k.webp","width":5024}],"full":"assets/highres/dv-01-approved-8k.webp"},{"original":"assets/strap-orange.jpg","variants":[{"src":"assets/highres/strap-orange-640.webp","width":640},{"src":"assets/highres/strap-orange-1600.webp","width":1600},{"src":"assets/highres/strap-orange-3200.webp","width":3200},{"src":"assets/highres/strap-orange-8k.webp","width":7680}],"full":"assets/highres/strap-orange-8k.webp"},{"original":"assets/strap-white.jpg","variants":[{"src":"assets/highres/strap-white-640.webp","width":640},{"src":"assets/highres/strap-white-1600.webp","width":1600},{"src":"assets/highres/strap-white-3200.webp","width":3200},{"src":"assets/highres/strap-white-8k.webp","width":7680}],"full":"assets/highres/strap-white-8k.webp"},{"original":"assets/strap-yellow.jpg","variants":[{"src":"assets/highres/strap-yellow-640.webp","width":640},{"src":"assets/highres/strap-yellow-1600.webp","width":1600},{"src":"assets/highres/strap-yellow-3200.webp","width":3200},{"src":"assets/highres/strap-yellow-8k.webp","width":7680}],"full":"assets/highres/strap-yellow-8k.webp"},{"original":"assets/strap-green.jpg","variants":[{"src":"assets/highres/strap-green-640.webp","width":640},{"src":"assets/highres/strap-green-1600.webp","width":1600},{"src":"assets/highres/strap-green-3200.webp","width":3200},{"src":"assets/highres/strap-green-8k.webp","width":7680}],"full":"assets/highres/strap-green-8k.webp"},{"original":"assets/strap-black.jpg","variants":[{"src":"assets/highres/strap-black-640.webp","width":640},{"src":"assets/highres/strap-black-1600.webp","width":1600},{"src":"assets/highres/strap-black-3200.webp","width":3200},{"src":"assets/highres/strap-black-8k.webp","width":7680}],"full":"assets/highres/strap-black-8k.webp"},{"original":"assets/strap-burgundy.jpg","variants":[{"src":"assets/highres/strap-burgundy-640.webp","width":640},{"src":"assets/highres/strap-burgundy-1600.webp","width":1600},{"src":"assets/highres/strap-burgundy-3200.webp","width":3200},{"src":"assets/highres/strap-burgundy-8k.webp","width":7680}],"full":"assets/highres/strap-burgundy-8k.webp"},{"original":"assets/strap-blue.jpg","variants":[{"src":"assets/highres/strap-blue-640.webp","width":640},{"src":"assets/highres/strap-blue-1600.webp","width":1600},{"src":"assets/highres/strap-blue-3200.webp","width":3200},{"src":"assets/highres/strap-blue-8k.webp","width":7680}],"full":"assets/highres/strap-blue-8k.webp"},{"original":"assets/strap-brown.jpg","variants":[{"src":"assets/highres/strap-brown-640.webp","width":640},{"src":"assets/highres/strap-brown-1600.webp","width":1600},{"src":"assets/highres/strap-brown-3200.webp","width":3200},{"src":"assets/highres/strap-brown-8k.webp","width":7680}],"full":"assets/highres/strap-brown-8k.webp"}];
  const known = new Map();
  records.forEach(record => {
    known.set('/' + record.original, record);
    record.variants.forEach(variant => known.set('/' + variant.src, record));
  });
  const label = () => document.documentElement.lang === 'ar' ? 'عرض الصورة بالحجم الكامل ↗' : 'View full-size image ↗';
  const getRecord = img => {
    try { return known.get(new URL(img.getAttribute('src'), location.href).pathname); }
    catch (_) { return null; }
  };
  const resize = img => {
    const width = Math.ceil(img.getBoundingClientRect().width);
    if (width > 0) img.sizes = width + 'px';
  };
  const observer = new ResizeObserver(entries => entries.forEach(entry => resize(entry.target)));
  function fullLink(img, record) {
    let host;
    if (img.matches('.dial-full-image,.case-full-image')) host = img.closest('dialog').querySelector('.dial-lightbox-top,.case-lightbox-top');
    else if (img.closest('main') && !img.closest('a,[aria-hidden="true"]') && !img.matches('#case-image')) host = img.parentElement;
    if (!host) return;
    let link = host.querySelector(':scope > .image-fullsize-link');
    if (!link) {
      link = document.createElement('a');
      link.className = 'image-fullsize-link';
      link.target = '_blank';
      link.rel = 'noopener';
      const close = host.querySelector(':scope > button');
      if (close) host.insertBefore(link, close); else host.append(link);
    }
    link.href = record.full;
    link.textContent = label();
  }
  function apply(img) {
    const record = getRecord(img);
    if (!record) return;
    img.srcset = record.variants.map(v => v.src + ' ' + v.width + 'w').join(', ');
    img.dataset.fullImage = record.full;
    if (!img.hasAttribute('sizes')) img.sizes = '100vw';
    resize(img);
    observer.observe(img);
    fullLink(img,record);
  }
  const scan = root => {
    if (root.nodeType !== 1) return;
    if (root.matches('img')) apply(root);
    root.querySelectorAll('img').forEach(apply);
  };
  document.querySelectorAll('img').forEach(apply);
  new MutationObserver(mutations => mutations.forEach(m => {
    if (m.type === 'attributes') apply(m.target);
    else m.addedNodes.forEach(scan);
  })).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  document.addEventListener('dlvaro:locale', () => {
    document.querySelectorAll('.image-fullsize-link').forEach(link => { link.textContent = label(); });
  });
})();
