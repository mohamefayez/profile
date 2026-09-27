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

// Scroll choreography: progressive, reversible, and driven by actual scroll position.
// Content stays visible without JavaScript. Only nearby elements are measured per frame.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [];
  const add = (selector, kind) => document.querySelectorAll(selector).forEach(element => {
    element.dataset.scroll = kind;
    targets.push(element);
  });
  add('.section-top', 'heading');
  add('.service-visual', 'media');
  add('.service-copy', 'copy');
  add('.expertise-content', 'panel');
  add('.process li', 'step');
  add('.contact-copy', 'heading');
  add('.social-links, .bottom-socials', 'icons');
  document.querySelectorAll('.process li').forEach((element, index) => {
    element.style.setProperty('--scroll-delay', String(index * .07));
  });

  const statement = document.querySelector('.about-main h2');
  // Preserve the original heading and line breaks for assistive technology.
  let words = [];
  function prepareStatement() {
  const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part.trim()) { fragment.append(document.createTextNode(part)); return; }
      const word = document.createElement('span');
      word.className = 'scroll-word'; word.textContent = part; fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  words = [...statement.querySelectorAll('.scroll-word')];
  }
  prepareStatement();
  const nearby = new Set();
  const clamp = value => Math.min(1, Math.max(0, value));
  let frame = 0;
  let pageHeight = document.documentElement.scrollHeight;
  const progressBar = document.querySelector('.reading-progress');
  function render() {
    frame = 0;
    const viewport = window.innerHeight;
    const readings = [...nearby].map(element => [element, element.getBoundingClientRect()]);
    const headingRect = statement.getBoundingClientRect();
    const headingProgress = clamp((viewport * .9 - headingRect.top) / (viewport * .58));
    // Batch layout reads before style writes; nothing intercepts wheel or touch input.
    readings.forEach(([element, rect]) => {
      const distance = Math.min(rect.height * .55 + 110, viewport * .46);
      const progress = clamp((viewport * .96 - rect.top) / distance);
      element.style.setProperty('--scroll-progress', progress.toFixed(4));
    });
    words.forEach((word, index) => {
      const progress = clamp(headingProgress * (words.length + 3) - index);
      word.style.setProperty('--word-light', (.3 + progress * .7).toFixed(3));
    });
    progressBar.style.transform = `scaleX(${clamp(window.scrollY / Math.max(1, pageHeight - viewport))})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  document.addEventListener('portfolio:language', () => { prepareStatement(); pageHeight = root.scrollHeight; schedule(); });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) nearby.add(entry.target);
      else {
        nearby.delete(entry.target);
        entry.target.style.setProperty('--scroll-progress', entry.boundingClientRect.top < 0 ? '1' : '0');
      }
    });
    schedule();
  }, { rootMargin: '160px 0px' });
  targets.forEach(element => observer.observe(element));
  // Reduced-motion uses light/opacity changes with no spatial movement.
  const syncPreference = () => { root.classList.toggle('scroll-motion-reduced', reducedMotion.matches); schedule(); };
  reducedMotion.addEventListener('change', syncPreference);
  syncPreference();
  root.classList.add('scroll-motion-ready');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { pageHeight = root.scrollHeight; schedule(); });
  new ResizeObserver(() => { pageHeight = root.scrollHeight; schedule(); }).observe(document.body);
  // A keyboard-focused control is always fully visible, even during a fast anchor jump.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-scroll]');
    if (target) target.style.setProperty('--scroll-progress', '1');
  });
  schedule();
})();

// Supply the owner's exact profile URLs here. Empty entries remain visibly unavailable.
const socialLinks = {
  whatsapp: 'https://wa.me/201018351183',
  instagram: 'https://www.instagram.com/eng.mo7amedx?stkn=eDhmM3o0am52Nzcy',
  tiktok: 'https://www.tiktok.com/@eng.mo7amedx',
  facebook: 'https://www.facebook.com/share/1F6X27PC1a/?mibextid=wwXIfr'
};
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

