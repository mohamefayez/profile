const i18n = window.portfolioI18n;
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelector('#year').textContent=new Date().getFullYear();
// The requested name loop always starts automatically. Pause is explicit and session-only.
const heroSection = document.querySelector('.hero');
const motionToggle = document.querySelector('.motion-toggle');
let motionPaused = false;
let heroVisible = true;
function updateMotion() {
  heroSection.classList.toggle('motion-paused', motionPaused || !heroVisible || document.hidden);
  motionToggle.hidden = false;
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.setAttribute('aria-label', i18n.t(motionPaused ? 'resumeLabel' : 'pauseLabel'));
  motionToggle.innerHTML = `${i18n.t(motionPaused ? 'resume' : 'pause')} <span aria-hidden="true">${motionPaused ? '▷' : 'Ⅱ'}</span>`;
}
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  updateMotion();
});
document.addEventListener('visibilitychange', updateMotion);
new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; updateMotion(); }).observe(heroSection);
updateMotion();
document.addEventListener('portfolio:language', updateMotion);

// Replay lightweight reveals on viewport entry; large screenshot surfaces stay still.
// IntersectionObserver replaces per-frame geometry reads and word-by-word repainting.
(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.section-top, .service-visual, .service-copy, .project-copy, .expertise-content, .process li, .contact-copy, .social-links, .bottom-socials, .about-main')];
  targets.forEach(element => element.dataset.scroll = 'reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting, intersectionRatio}) => {
      if (!isIntersecting && !target.getAnimations().some(animation => animation.playState === 'running')) target.classList.remove('is-revealed');
      else if (intersectionRatio >= .08) target.classList.add('is-revealed');
    });
  }, {threshold: [0, .08]});
  function syncPreference() {
    observer.disconnect();
    root.classList.toggle('scroll-motion-reduced', preference.matches);
    targets.forEach(element => {
      element.classList.remove('is-revealed');
      observer.observe(element);
    });
  }
  root.classList.add('scroll-motion-ready');
  preference.addEventListener('change', syncPreference); syncPreference();
  targets.forEach(element => element.addEventListener('animationend', event => {
    if(event.target !== element) return;
    // One check at animation completion avoids edge jitter and resets fast scroll exits.
    const rect = element.getBoundingClientRect();
    if(rect.bottom <= 0 || rect.top >= innerHeight) element.classList.remove('is-revealed');
  }));
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-scroll]');
    if(target) target.classList.add('is-revealed');
  });
  const progressBar = document.querySelector('.reading-progress');
  let frame = 0, scrollRange = 1, previous = -1;
  function render() {
    frame = 0;
    const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
    if(progress !== previous) {progressBar.style.transform = 'scaleX(' + progress + ')'; previous = progress;}
  }
  function schedule() {if(!frame) frame = requestAnimationFrame(render);}
  function measure() {scrollRange = Math.max(1, root.scrollHeight - innerHeight); schedule();}
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.body);
  document.addEventListener('portfolio:language', measure);
  measure();
})();

// Supply the owner's exact profile URLs here. Empty entries remain visibly unavailable.
const socialLinks = {
  whatsapp: 'https://wa.me/201018531183',
  instagram: 'https://www.instagram.com/eng.mo7amedx?stkn=eDhmM3o0am52Nzcy',
  tiktok: 'https://www.tiktok.com/@eng.mo7amedx',
  facebook: 'https://www.facebook.com/share/1F6X27PC1a/?mibextid=wwXIfr'
};
function updateProjectLinks() {
  document.querySelectorAll('.project-card').forEach(card => {
    const title = card.querySelector('h3').textContent;
    const url = new URL(socialLinks.whatsapp);
    url.searchParams.set('text', i18n.language === 'ar'
      ? `مرحبًا محمد، أحب أعرف أكثر عن مشروع ${title}.`
      : `Hi Mohamed, I'd like to know more about your ${title}.`);
    const link = card.querySelector('.project-link');
    link.href = url.href;
    link.setAttribute('aria-label', i18n.language === 'ar' ? `اسألني عن ${title} عبر واتساب` : `Ask about ${title} on WhatsApp`);
  });
}
updateProjectLinks();
document.addEventListener('portfolio:language', updateProjectLinks);
document.querySelectorAll('[data-social]').forEach(link => {
  const url = socialLinks[link.dataset.social];
  if (!url) return;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  link.removeAttribute('title');
});
const missingSocials = Object.entries(socialLinks).filter(([, url]) => !url).map(([name]) => ({instagram:'Instagram',tiktok:'TikTok',facebook:'Facebook',whatsapp:'WhatsApp'}[name]));
const socialNote = document.querySelector('.social-note');
socialNote.hidden = missingSocials.length === 0;
socialNote.textContent = missingSocials.length ? missingSocials.join(', ') + ' links coming soon.' : '';
const skills={
 frontend:{symbol:'</>',title:'Interfaces that feel right.',description:'Responsive, accessible experiences with reusable components, considered interactions, and performance built in.',tools:['React','Next.js','TypeScript','Tailwind CSS','Framer Motion','Zustand']},
 backend:{symbol:'{ }',title:'Solid foundations. Seamless connections.',description:'Server-side logic, well-structured APIs, and secure authentication that connect your interface to the services it needs.',tools:['Node.js','Express.js','NestJS','REST APIs','JWT & OAuth','Laravel']},
 data:{symbol:'⌘',title:'Built to grow with your product.',description:'Thoughtful data models, optimized queries, and reliable deployment workflows that keep your application running smoothly.',tools:['PostgreSQL','MongoDB','Prisma','Redis','Docker','GitHub Actions','Vercel']},
 quality:{symbol:'✳',title:'The details make the difference.',description:'Accessible interfaces, automated testing, and performance optimization. Care that extends beyond the first launch.',tools:['Playwright','Vitest','Jest','Web accessibility','Core Web Vitals','Figma','Git']}
};
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){tabs.forEach(item=>{item.setAttribute('aria-selected',String(item===tab));item.tabIndex=item===tab?0:-1;});const category=tab.dataset.category;const data={...skills[category],...(i18n.language==='ar'?i18n.skillsAr[category]:{})};const panel=document.querySelector('#skills-panel');panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('.skill-symbol').textContent=data.symbol;panel.querySelector('h3').textContent=data.title;panel.querySelector('p').textContent=data.description;panel.querySelector('ul').replaceChildren(...data.tools.map(tool=>{const li=document.createElement('li');li.textContent=tool;return li;}));}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown')next=(index+1)%tabs.length;if(event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}});});

