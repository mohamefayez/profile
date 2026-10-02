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

// Scroll-linked choreography: the scroll position determines every frame.
// Cache untransformed document positions on layout changes, never during scrolling.
(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [];
  const add = (selector, kind) => document.querySelectorAll(selector).forEach(element => {
    element.dataset.scroll = kind;
    targets.push({element, top:0, height:0, last:-1});
  });
  add('.section-top, .contact-copy', 'heading');
  add('.service-visual', 'media');
  add('.service-copy, .project-copy', 'copy');
  add('.project-preview', 'image');
  add('.expertise-content', 'panel');
  add('.process li', 'step');
  add('.social-links, .bottom-socials', 'icons');
  const byElement = new Map(targets.map(target => [target.element, target]));
  const clamp = value => Math.min(1, Math.max(0, value));
  const statement = document.querySelector('.about-main h2');
  let words = [], wordLevels = [], statementTop = 0;
  function prepareWords() {
    const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) if(!walker.currentNode.parentElement.closest('.scroll-word')) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if(!part.trim()) {fragment.append(document.createTextNode(part)); return;}
        const word = document.createElement('span');
        word.className = 'scroll-word'; word.textContent = part; fragment.append(word);
      });
      node.replaceWith(fragment);
    });
    words = [...statement.querySelectorAll('.scroll-word')];
    wordLevels = words.map(() => -1);
  }
  // offsetTop does not include our visual transforms, so motion cannot feed back into its own input.
  function documentTop(element) {
    let top = 0;
    for(let current = element; current; current = current.offsetParent) top += current.offsetTop;
    return top;
  }
  let frame = 0, layoutDirty = true, scrollRange = 1, viewport = innerHeight, lastBar = -1;
  const progressBar = document.querySelector('.reading-progress');
  function progressFor(target, y) {
    const distance = Math.min(target.height * .55 + 110, viewport * .46);
    return Math.round(clamp((viewport * .96 - (target.top-y)) / distance) * 1000) / 1000;
  }
  function apply(target, value) {
    if(value !== target.last) {
      target.element.style.setProperty('--scroll-progress', String(value));
      target.last = value;
    }
  }
  function render() {
    frame = 0;
    if(layoutDirty) {
      layoutDirty = false; viewport = innerHeight;
      targets.forEach(target => {target.top = documentTop(target.element); target.height = target.element.offsetHeight;});
      statementTop = documentTop(statement);
      scrollRange = Math.max(1, root.scrollHeight - viewport);
    }
    const y = scrollY;
    targets.forEach(target => apply(target, progressFor(target,y)));
    const statementProgress = clamp((viewport * .9 - (statementTop-y)) / (viewport * .58));
    words.forEach((word, index) => {
      const value = Math.round((.3 + clamp(statementProgress * (words.length+3)-index)*.7)*100)/100;
      if(value !== wordLevels[index]) {word.style.setProperty('--word-light',String(value)); wordLevels[index]=value;}
    });
    const bar = Math.round(clamp(y/scrollRange)*10000)/10000;
    if(bar !== lastBar) {progressBar.style.transform='scaleX('+bar+')'; lastBar=bar;}
  }
  function schedule() {if(!frame) frame=requestAnimationFrame(render);}
  function invalidate() {layoutDirty=true; schedule();}
  const syncPreference = () => {root.classList.toggle('scroll-motion-reduced',preference.matches);schedule();};
  preference.addEventListener('change',syncPreference);syncPreference();
  prepareWords();root.classList.add('scroll-motion-ready');
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',invalidate);
  new ResizeObserver(invalidate).observe(document.body);
  document.fonts?.ready.then(invalidate);
  document.addEventListener('portfolio:language',()=>{prepareWords();invalidate();});
  document.addEventListener('focusin',event=>{const target=byElement.get(event.target.closest('[data-scroll]'));if(target)apply(target,1);});
  schedule();
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
// One cached local SVG sprite; labels remain readable to assistive technology.
const techIcons = {
 'React':['react','#61dafb'], 'Next.js':['nextdotjs','#f5f5f7'],
 'HTML':['html5','#f07b54'], 'CSS':['css','#b394f5'], 'JavaScript':['javascript','#f7df1e'],
 'TypeScript':['typescript','#65a9ee'], 'Tailwind CSS':['tailwindcss','#38bdf8'],
 'Framer Motion':['framer','#d4b4ff'], 'Zustand':['state','#cfb49a'],
 'Node.js':['nodedotjs','#83cd72'], 'Express.js':['express','#e2e2e7'],
 'NestJS':['nestjs','#fa668a'], 'REST APIs':['api','#8cbcff'], 'JWT & OAuth':['lock','#b5a5ed'],
 'Laravel':['laravel','#ff716b'], 'PostgreSQL':['postgresql','#83b6e0'],
 'MongoDB':['mongodb','#73c97d'], 'Prisma':['prisma','#d7e1ed'], 'Redis':['redis','#ff7972'],
 'Docker':['docker','#59b9ff'], 'GitHub Actions':['githubactions','#8dbbff'], 'Vercel':['vercel','#f5f5f7'],
 'Playwright':['testing','#8ccf85'], 'Vitest':['vitest','#b8d76c'], 'Jest':['jest','#ed9bae'],
 'Web accessibility':['accessibility','#97c8ff'], 'Core Web Vitals':['performance','#8dd4be'],
 'Figma':['figma','#e3adff'], 'Git':['git','#f78a73']
};
function createTechIcon(tool) {
 const [id,color] = techIcons[tool];
 const icon = document.createElementNS('http://www.w3.org/2000/svg','svg');
 icon.setAttribute('class','tech-icon'); icon.setAttribute('viewBox','0 0 24 24');
 icon.setAttribute('aria-hidden','true'); icon.setAttribute('focusable','false');
 icon.style.color = color;
 const use = document.createElementNS('http://www.w3.org/2000/svg','use');
 use.setAttribute('href','assets/tech-icons.svg#'+id); icon.append(use);
 return icon;
}
const skills={
 frontend:{symbol:'</>',title:'Interfaces that feel right.',description:'Responsive, accessible experiences with reusable components, considered interactions, and performance built in.',tools:['React','Next.js','HTML','CSS','JavaScript','TypeScript','Tailwind CSS','Framer Motion','Zustand']},
 backend:{symbol:'{ }',title:'Solid foundations. Seamless connections.',description:'Server-side logic, well-structured APIs, and secure authentication that connect your interface to the services it needs.',tools:['Node.js','Express.js','NestJS','REST APIs','JWT & OAuth','Laravel']},
 data:{symbol:'⌘',title:'Built to grow with your product.',description:'Thoughtful data models, optimized queries, and reliable deployment workflows that keep your application running smoothly.',tools:['PostgreSQL','MongoDB','Prisma','Redis','Docker','GitHub Actions','Vercel']},
 quality:{symbol:'✳',title:'The details make the difference.',description:'Accessible interfaces, automated testing, and performance optimization. Care that extends beyond the first launch.',tools:['Playwright','Vitest','Jest','Web accessibility','Core Web Vitals','Figma','Git']}
};
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){tabs.forEach(item=>{item.setAttribute('aria-selected',String(item===tab));item.tabIndex=item===tab?0:-1;});const category=tab.dataset.category;const data={...skills[category],...(i18n.language==='ar'?i18n.skillsAr[category]:{})};const panel=document.querySelector('#skills-panel');panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('.skill-symbol').replaceChildren(createTechIcon(data.tools[0]));panel.querySelector('h3').textContent=data.title;panel.querySelector('p').textContent=data.description;panel.querySelector('ul').replaceChildren(...data.tools.map(tool=>{const li=document.createElement('li');li.append(createTechIcon(tool),document.createTextNode(tool));li.dir="ltr";return li;}));}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown')next=(index+1)%tabs.length;if(event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}});});

