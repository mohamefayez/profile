(() => {
  const config = window.portfolioConfig?.analytics;
  const allowed = new Set(['page_view', 'social_click', 'cv_download', 'project_enquiry']);
  const queue = [];
  let ready = false, enabled = false;
  const privacyChoice = () => navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  function send(name, data) {
    if (privacyChoice()) return;
    // Supply a clean canonical page address: never send query strings, hashes, or referrers.
    try { window.umami?.track(props => ({website: props.website, hostname: location.hostname, url: location.pathname, title: 'Mohamed Fayez — Portfolio', language: document.documentElement.lang, name, data})); } catch { /* Analytics must never interrupt contact or downloads. */ }
  }
  function track(name, data = {}) {
    if (!enabled || privacyChoice() || !allowed.has(name)) return;
    const safe = {};
    if (['en', 'ar'].includes(data.language)) safe.language = data.language;
    if (['whatsapp', 'instagram', 'tiktok', 'facebook'].includes(data.platform)) safe.platform = data.platform;
    if (ready) send(name, safe);
    else if (queue.length < 20) queue.push([name, safe]);
  }
  window.portfolioAnalytics = {track};
  if (!config?.enabled || privacyChoice() || !/^https?:$/.test(location.protocol)) return;
  try {
    const url = new URL(config.scriptUrl);
    if (url.protocol !== 'https:' || url.username || url.password || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.websiteId)) return;
    const script = document.createElement('script');
    script.src = url.href; script.defer = true;
    script.dataset.websiteId = config.websiteId;
    script.dataset.autoTrack = 'false';
    enabled = true;
    script.onload = () => { ready = true; for (const event of queue.splice(0)) send(...event); };
    script.onerror = () => { enabled = false; queue.length = 0; };
    document.head.append(script);
  } catch { return; }
  // Pageviews use a payload without a custom event name so Umami counts them as visits.
  queue.push([undefined, {}]);
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const platform = link.dataset.social || ({'wa.me':'whatsapp','www.instagram.com':'instagram','www.tiktok.com':'tiktok','www.facebook.com':'facebook'})[link.hostname];
    if (platform) track('social_click', {platform, language:document.documentElement.lang});
    if (link.hasAttribute('download') && /\.pdf$/i.test(link.pathname)) track('cv_download', {language:document.documentElement.lang});
  });
})();
