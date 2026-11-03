(() => {
 const links=[...document.querySelectorAll('.design-open')];
 const stage=document.querySelector('.atelier-stage');
 const dialog=document.querySelector('.design-lightbox');
 if(!stage||!links.length||!dialog)return;
 const hero=stage.querySelector('img'), full=dialog.querySelector('.design-full-image');
 const back=document.querySelector('.reel-prev'), next=document.querySelector('.reel-next');
 const modalBack=dialog.querySelector('.design-prev'), modalNext=dialog.querySelector('.design-next');
 let active=0, animation;
 function select(index,animate=true){
  active=Math.max(0,Math.min(links.length-1,index));
  const source=links[active].querySelector('img');
  stage.href=links[active].href; hero.src=stage.href; hero.alt=source.alt;
  full.src=stage.href; full.alt=source.alt;
  dialog.querySelector('#design-lightbox-caption').textContent=source.alt;
  document.querySelector('.atelier-index').textContent=`${String(active+1).padStart(2,'0')} / 07`;
  dialog.querySelector('.design-position').textContent=`${active+1} / 7`;
  links.forEach((link,i)=>link.setAttribute('aria-current',String(i===active)));
  back.disabled=modalBack.disabled=active===0;
  next.disabled=modalNext.disabled=active===links.length-1;
  if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   animation?.cancel(); animation=hero.animate([{opacity:.35},{opacity:1}],{duration:320,easing:'ease-out'});
  }
  const rail=document.querySelector('.designs-grid');
  if(rail.scrollWidth>rail.clientWidth){
   const box=rail.getBoundingClientRect(),thumb=links[active].getBoundingClientRect();
   rail.scrollBy({left:thumb.left-box.left-(box.width-thumb.width)/2,behavior:'smooth'});
  }
 }
 links.forEach((link,i)=>link.addEventListener('click',e=>{
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();select(i);
 }));
 back.addEventListener('click',()=>select(active-1)); next.addEventListener('click',()=>select(active+1));
 modalBack.addEventListener('click',()=>select(active-1));modalNext.addEventListener('click',()=>select(active+1));
 stage.addEventListener('click',e=>{
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||typeof dialog.showModal!=='function')return;
  e.preventDefault();dialog.showModal();document.body.classList.add('design-lightbox-open');
 });
 dialog.querySelector('.design-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('design-lightbox-open');stage.focus();});
 function arrows(e){
  if(!['ArrowRight','ArrowLeft'].includes(e.key))return;
  e.preventDefault();select(active+((e.key==='ArrowRight')!==(document.documentElement.dir==='rtl')?1:-1));
 }
 document.querySelector('.designs-section').addEventListener('keydown',arrows);
 dialog.addEventListener('keydown',arrows);
 let touchX,touchY;
 stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY;},{passive:true});
 stage.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)select(active+((dx<0)!==(document.documentElement.dir==='rtl')?1:-1));
 },{passive:true});
 document.addEventListener('dlvaro:locale',()=>select(active,false));select(0,false);
})();
