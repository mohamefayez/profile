document.addEventListener('portfolio:language', () => { selectTab(tabs.find(tab=>tab.getAttribute('aria-selected')==='true') || tabs[0]); closeMenu(); });
selectTab(tabs[0]);

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name')).trim(), email = String(data.get('email')).trim(), message = String(data.get('message')).trim();
  const status = document.querySelector('#form-status');
  if (!name || !message) { status.textContent = i18n.t('invalid'); return; }
  const brief = i18n.language === 'ar'
    ? `مرحبًا محمد، أود مناقشة مشروع معك.\n\nالاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nتفاصيل المشروع:\n${message}`
    : `Hi Mohamed, I'd like to discuss a project.\n\nName: ${name}\nEmail: ${email}\n\nProject details:\n${message}`;
  const url = new URL(socialLinks.whatsapp); url.searchParams.set('text', brief);
  const choices = ['project-type', 'budget', 'timeline'].map(id => {
    const field = document.getElementById(id);
    return `${document.querySelector(`label[for="${id}"]`).textContent}: ${field.selectedOptions[0].textContent}`;
  });
  url.searchParams.set('text', brief + '\n\n' + choices.join('\n'));
  window.portfolioAnalytics?.track('project_enquiry', {language:i18n.language});
  // Opens a draft only; the visitor explicitly sends it in WhatsApp.
  window.open(url.href, '_blank', 'noopener,noreferrer');
  status.replaceChildren(document.createTextNode(i18n.t('status') + ' '));
  const retry = document.createElement('a'); retry.href = url.href; retry.target = '_blank'; retry.rel = 'noopener noreferrer'; retry.textContent = i18n.t('retry');
  status.append(retry);
});

(() => {
  const header = document.querySelector('.header');
  const backToTop = document.querySelector('.back-to-top');
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let frame = 0;
  function update() {
    frame = 0;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    backToTop.hidden = window.scrollY < 600;
    const marker = window.innerHeight * .35;
    let current = -1;
    sections.forEach((section, index) => { if(section.getBoundingClientRect().top <= marker) current = index; });
    links.forEach((link,index) => { if(index === current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', () => { if(!frame) frame=requestAnimationFrame(update); }, {passive:true});
  window.addEventListener('resize',update);
  document.addEventListener('portfolio:language',update);
  backToTop.addEventListener('click', () => {
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    document.querySelector('.brand').focus({preventScroll:true});
  });
  update();
})();
