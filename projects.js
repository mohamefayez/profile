// Original screenshots with explicitly labeled illustrative manga samples.
(() => {
  const shots = {
    manga: [{file:'manga-colored-v2', extension:'jpg', kind:'manga', en:'Home page', ar:'الصفحة الرئيسية'}],
    coloring: [{file:'manga-colorizer', kind:'app', en:'Coloring workspace', ar:'مساحة عمل التلوين'}],
    perfume: [
      {file:'asel-home', kind:'browser', en:'Store home page', ar:'الصفحة الرئيسية للمتجر'},
      {file:'asel-products', kind:'browser', en:'Perfume collection', ar:'مجموعة العطور'},
      {file:'asel-mobile', kind:'mobile', en:'Mobile store preview', ar:'معاينة المتجر على الموبايل'}
    ]
  };
  const dialog = document.querySelector('.project-dialog');
  const area = dialog.querySelector('.preview-image-wrap');
  const previous = dialog.querySelector('.preview-prev');
  const next = dialog.querySelector('.preview-next');
  let selected = 'manga', index = 0, opener;
  const arabic = () => window.portfolioI18n.language === 'ar';
  function render() {
    const list = shots[selected], shot = list[index];
    const title = document.querySelector(`[data-project="${selected}"] h3`).textContent;
    document.querySelector('#preview-title').textContent = title;
    const surface = document.createElement('div');
    surface.className = `screen-surface ${shot.kind}-capture`;
    const img = document.createElement('img');
    img.src = `assets/projects/${shot.file}.${shot.extension || 'png'}`;
    img.alt = `${title} — ${arabic() ? shot.ar : shot.en}`;
    surface.append(img);
    const sample = document.querySelector('[data-project="' + selected + '"] .color-sample');
    if(sample) surface.append(sample.cloneNode(true));
    area.replaceChildren(surface);
    const note = selected === 'coloring' ? (arabic() ? ' — عينة توضيحية' : ' — illustrative artwork') : '';
    dialog.querySelector('.preview-counter').textContent = `${arabic() ? shot.ar : shot.en}${note} · ${index+1} / ${list.length}`;
    previous.hidden = next.hidden = list.length === 1;
  }
  function syncLabels() {
    document.querySelectorAll('[data-gallery]').forEach(button => {
      const title = button.closest('.project-card').querySelector('h3').textContent;
      button.setAttribute('aria-label', arabic() ? `عرض صور ${title}` : `View ${title} screenshots`);
    });
    if (dialog.open) render();
  }
  function change(step) { index = (index + step + shots[selected].length) % shots[selected].length; render(); }
  document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.gallery; index = 0; opener = button;
    render(); dialog.showModal(); document.documentElement.classList.add('preview-open');
    dialog.querySelector('.preview-close').focus();
  }));
  dialog.querySelector('.preview-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('preview-open'); opener?.focus({preventScroll:true}); });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if(event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  previous.addEventListener('click', () => change(-1)); next.addEventListener('click', () => change(1));
  dialog.addEventListener('keydown', event => {
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); change((event.key === 'ArrowRight' ? 1 : -1) * (arabic() ? -1 : 1)); }
  });
  document.addEventListener('portfolio:language', syncLabels); syncLabels();
})();
