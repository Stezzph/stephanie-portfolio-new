const menuBtn=document.querySelector('.menu-button');
const menu=document.querySelector('.menu');
if(menuBtn&&menu){
  const setMenu=(open)=>{menuBtn.classList.toggle('open',open);menu.classList.toggle('show',open);document.body.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',String(open));};
  menuBtn.addEventListener('click',()=>setMenu(!menu.classList.contains('show')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
}
const progress=document.querySelector('.scroll-progress');
const onScroll=()=>{
  if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?(scrollY/max)*100:0}%`;}
  document.querySelectorAll('[data-parallax]').forEach(el=>{const r=el.getBoundingClientRect();const p=(innerHeight-r.top)/(innerHeight+r.height);el.style.transform=`translateY(${(p-.5)*-55}px)`;});
};
addEventListener('scroll',onScroll,{passive:true});onScroll();
window.io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>window.io.observe(el));
document.querySelectorAll('.acc').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('active')));

// V3: social embed renderer. Paste only the post URLs into media-links.js.
(function(){
  const grids=document.querySelectorAll('.embed-grid[data-project]');
  if(!grids.length)return;
  const cfg=window.PORTFOLIO_MEDIA||{};
  let needInstagram=false, needTikTok=false;
  const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const projectNames={blueNews:'Blue News',swissSkills:'SwissSkills',lakeLive:'LakeLive'};
  grids.forEach(grid=>{
    const key=grid.dataset.project;
    const links=(cfg[key]||[]).slice(0,3);
    while(links.length<3)links.push('');
    links.forEach((url,i)=>{
      const shell=document.createElement('div');shell.className='embed-shell reveal';
      const clean=(url||'').trim();
      if(!clean){
        shell.innerHTML=`<div class="embed-placeholder"><div class="phone-top"><span class="platform-pill">Instagram / TikTok</span><span class="slot-number">0${i+1}</span></div><div><h3>${escapeHtml(projectNames[key]||key)}<br>Post ${i+1}</h3><p>Hier kommt später dein echter Social-Post hinein.</p><code>media-links.js → ${escapeHtml(key)} → Link ${i+1}</code></div></div>`;
      }else if(clean.includes('instagram.com')){
        needInstagram=true;
        shell.innerHTML=`<blockquote class="instagram-media" data-instgrm-permalink="${escapeHtml(clean)}" data-instgrm-version="14"></blockquote>`;
      }else if(clean.includes('tiktok.com')){
        const id=(clean.match(/\/video\/(\d+)/)||[])[1];
        if(id){needTikTok=true;shell.innerHTML=`<blockquote class="tiktok-embed" cite="${escapeHtml(clean)}" data-video-id="${id}" style="max-width:605px;min-width:325px"><section><a target="_blank" href="${escapeHtml(clean)}">TikTok ansehen</a></section></blockquote>`;}
        else shell.innerHTML=`<div class="embed-placeholder"><div class="phone-top"><span class="platform-pill">TikTok</span><span class="slot-number">0${i+1}</span></div><div><h3>Link prüfen</h3><p>Der TikTok-Link enthält keine erkennbare Video-ID.</p><code>${escapeHtml(clean)}</code></div></div>`;
      }else{
        shell.innerHTML=`<div class="embed-placeholder"><div class="phone-top"><span class="platform-pill">Link</span><span class="slot-number">0${i+1}</span></div><div><h3>Post öffnen</h3><p>Dieser Link wird als externer Post geöffnet.</p><a class="cta-link" href="${escapeHtml(clean)}" target="_blank" rel="noopener">Post ansehen <span>→</span></a></div></div>`;
      }
      grid.appendChild(shell);
      if(window.io)window.io.observe(shell);
    });
  });
  if(needInstagram){const s=document.createElement('script');s.async=true;s.src='https://www.instagram.com/embed.js';document.body.appendChild(s);}
  if(needTikTok){const s=document.createElement('script');s.async=true;s.src='https://www.tiktok.com/embed.js';document.body.appendChild(s);}
})();


// V4: subtle custom cursor for desktop only.
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('custom-cursor');
  const dot=document.createElement('div');
  const ring=document.createElement('div');
  dot.className='cursor-dot'; ring.className='cursor-ring';
  document.body.append(dot,ring);
  let mx=-100,my=-100,rx=-100,ry=-100;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate3d(${mx}px,${my}px,0)`;});
  const animate=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;requestAnimationFrame(animate)}; animate();
  document.querySelectorAll('a,button,input,.timeline-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

// V6: single on-brand plus cursor. No trailing ring.
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('custom-cursor');
  const mark=document.createElement('div');
  mark.className='cursor-mark';
  document.body.appendChild(mark);
  addEventListener('mousemove',e=>{mark.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;});
  document.querySelectorAll('a,button,input,.timeline-card,.feature-card,.choice-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

// V4: private-work media slots. Drop correctly named files into /assets/private/.
document.querySelectorAll('[data-image]').forEach(slot=>{
  const src=slot.dataset.image;
  const img=new Image();
  img.onload=()=>{img.alt='';slot.prepend(img);slot.classList.add('has-media')};
  img.src=src;
});
document.querySelectorAll('[data-video]').forEach(slot=>{
  const src=slot.dataset.video;
  const probe=document.createElement('video');
  probe.preload='metadata';
  probe.onloadedmetadata=()=>{const v=document.createElement('video');v.src=src;v.controls=true;v.playsInline=true;v.preload='metadata';slot.prepend(v);slot.classList.add('has-media')};
  probe.src=src;
});
