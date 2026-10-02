const menuBtn=document.querySelector('.menu-button');
const menu=document.querySelector('.menu');

function setMenu(open){
  if(!menuBtn||!menu)return;
  menuBtn.classList.toggle('open',open);
  menu.classList.toggle('show',open);
  document.body.classList.toggle('menu-open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.setAttribute('aria-label',open?'Menü schliessen':'Menü öffnen');
}

if(menuBtn&&menu){
  menuBtn.addEventListener('click',()=>setMenu(!menu.classList.contains('show')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  menu.addEventListener('click',e=>{if(e.target===menu)setMenu(false)});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
}

const hero=document.querySelector('.home-hero');
function updateHeader(){
  if(!hero||!document.body.classList.contains('home-clean'))return;
  document.body.classList.toggle('past-hero',window.scrollY>Math.max(0,hero.offsetHeight-90));
}
window.addEventListener('scroll',updateHeader,{passive:true});
window.addEventListener('resize',updateHeader);
updateHeader();

const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

document.querySelectorAll('.acc').forEach(btn=>{
  btn.addEventListener('click',()=>btn.classList.toggle('active'));
});

document.querySelectorAll('[data-parallax]').forEach(img=>{
  const move=()=>{
    const r=img.parentElement.getBoundingClientRect();
    const p=(innerHeight-r.top)/(innerHeight+r.height);
    img.style.transform=`translateY(${(p-.5)*-35}px)`;
  };
  window.addEventListener('scroll',move,{passive:true});
  move();
});

(function renderSocialEmbeds(){
  const grids=document.querySelectorAll('.embed-grid[data-project]');
  if(!grids.length)return;
  const cfg=window.PORTFOLIO_MEDIA||{};
  let needInstagram=false,needTikTok=false;
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const names={blueNews:'Blue News',swissSkills:'SwissSkills',lakeLive:'LakeLive'};
  grids.forEach(grid=>{
    const key=grid.dataset.project;
    const links=[...(cfg[key]||[])].slice(0,3);
    while(links.length<3)links.push('');
    links.forEach((url,i)=>{
      const shell=document.createElement('div');
      shell.className='embed-shell reveal';
      const clean=(url||'').trim();
      if(!clean){
        shell.innerHTML=`<div class="embed-placeholder"><div class="phone-top"><span class="platform-pill">Instagram / TikTok</span><span class="slot-number">0${i+1}</span></div><div><h3>${esc(names[key]||key)}<br>Post ${i+1}</h3><p>Hier kommt später dein echter Social-Post hinein.</p></div></div>`;
      }else if(clean.includes('instagram.com')){
        needInstagram=true;
        shell.innerHTML=`<blockquote class="instagram-media" data-instgrm-permalink="${esc(clean)}" data-instgrm-version="14"></blockquote>`;
      }else if(clean.includes('tiktok.com')){
        const id=(clean.match(/\/video\/(\d+)/)||[])[1];
        if(id){
          needTikTok=true;
          shell.innerHTML=`<blockquote class="tiktok-embed" cite="${esc(clean)}" data-video-id="${id}"><section><a target="_blank" rel="noopener" href="${esc(clean)}">TikTok ansehen</a></section></blockquote>`;
        }else{
          shell.innerHTML=`<div class="embed-placeholder"><div><h3>TikTok-Link prüfen</h3><p>Der Link enthält keine erkennbare Video-ID.</p></div></div>`;
        }
      }else{
        shell.innerHTML=`<div class="embed-placeholder"><div><h3>Post öffnen</h3><a href="${esc(clean)}" target="_blank" rel="noopener">Post ansehen →</a></div></div>`;
      }
      grid.appendChild(shell);
      io.observe(shell);
    });
  });
  if(needInstagram){
    const s=document.createElement('script');s.async=true;s.src='https://www.instagram.com/embed.js';document.body.appendChild(s);
  }
  if(needTikTok){
    const s=document.createElement('script');s.async=true;s.src='https://www.tiktok.com/embed.js';document.body.appendChild(s);
  }
})();

document.querySelectorAll('[data-image]').forEach(slot=>{
  const img=new Image();
  img.onload=()=>{img.alt='';slot.prepend(img);slot.classList.add('has-media')};
  img.src=slot.dataset.image;
});

document.querySelectorAll('[data-video]').forEach(slot=>{
  const probe=document.createElement('video');
  probe.preload='metadata';
  probe.onloadedmetadata=()=>{
    const video=document.createElement('video');
    video.src=slot.dataset.video;
    video.controls=true;
    video.playsInline=true;
    video.preload='metadata';
    slot.prepend(video);
    slot.classList.add('has-media');
  };
  probe.src=slot.dataset.video;
});
