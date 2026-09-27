// English markup remains the no-JavaScript fallback; Arabic is applied to the same elements.
(() => {
  const content = [
    ['#faq .eyebrow', 'قبل ما نبدأ'], ['#faq h2', 'أسئلة تستحق<br>إجابات واضحة.'],
    ['#faq .section-top > p', 'توقعات واضحة.<br>من أول محادثة.'],
    ['#faq details:nth-child(1) summary', 'نبدأ إزاي؟'],
    ['#faq details:nth-child(1) p', 'ابعت نبذة عن فكرتك والخصائص المطلوبة وأي أمثلة تعجبك. بعدها نناقش نطاق المشروع والخطوات القادمة على واتساب.'],
    ['#faq details:nth-child(2) summary', 'تكلفة المشروع بتتحدد إزاي؟'],
    ['#faq details:nth-child(2) p', 'مفيش قائمة أسعار ثابتة. السعر وطريقة الدفع بنتفق عليهم لكل مشروع بعد تحديد المطلوب. خانة الميزانية مجرد بداية للنقاش.'],
    ['#faq details:nth-child(3) summary', 'التنفيذ بياخد وقت قد إيه؟'],
    ['#faq details:nth-child(3) p', 'المدة بتعتمد على حجم المشروع والمحتوى والتكاملات المطلوبة. شاركني الموعد المفضل عشان نتناقش في خطة تسليم واقعية قبل بداية الشغل.'],
    ['#faq details:nth-child(4) summary', 'إيه نظام التعديلات والتسليم؟'],
    ['#faq details:nth-child(4) p', 'عدد جولات التعديل ومراحل المراجعة والملفات اللي هتستلمها بنتفق عليهم حسب مشروعك قبل بداية الشغل.'],
    ['#faq details:nth-child(5) summary', 'في دعم بعد الإطلاق؟'],
    ['#faq details:nth-child(5) p', 'الدعم والصيانة والاستضافة وأي تكاليف مستمرة بنتناقش فيهم بشكل منفصل حسب المشروع. لسه مفيش مدة دعم ثابتة.'],
    ['label[for="project-type"]', 'نوع المشروع'], ['label[for="budget"]', 'الميزانية التقريبية'], ['label[for="timeline"]', 'الموعد المفضل'],
    ['#project-type option[value="discuss"]', 'نحدد سوا'], ['#project-type option[value="website"]', 'موقع / صفحة تعريفية'],
    ['#project-type option[value="application"]', 'تطبيق ويب'], ['#project-type option[value="dashboard"]', 'لوحة تحكم'], ['#project-type option[value="improvement"]', 'تطوير موقع موجود'],
    ['#budget option[value="discuss"]', 'نتناقش فيها'], ['#budget option[value="under-10k"]', 'أقل من ١٠٬٠٠٠ جنيه'],
    ['#budget option[value="10k-25k"]', '١٠٬٠٠٠–٢٥٬٠٠٠ جنيه'], ['#budget option[value="25k-50k"]', '٢٥٬٠٠٠–٥٠٬٠٠٠ جنيه'], ['#budget option[value="over-50k"]', 'أكثر من ٥٠٬٠٠٠ جنيه'],
    ['#timeline option[value="flexible"]', 'مرن / نتفق سوا'], ['#timeline option[value="month"]', 'خلال شهر'], ['#timeline option[value="quarter"]', 'خلال شهر إلى ٣ شهور'], ['#timeline option[value="exploring"]', 'لسه بستكشف الفكرة'],
    ['.brief-hint', 'دي بداية للنقاش، مش عرض سعر أو تأكيد لموعد التسليم.'],
    ['.skip', 'تخطَّ إلى المحتوى'],
    ['nav a[href="#about"]', 'عني'], ['nav a[href="#services"]', 'الخدمات'], ['nav a[href="#expertise"]', 'المهارات'],
    ['nav a[href="#contact"]', 'لنتحدث <span aria-hidden="true">↗</span>'],
    ['.menu-toggle', 'القائمة <span>+</span>'],
    ['.hero-top p', 'تفكير مستقل. وتطوير متكامل.'], ['.hero-top > span', 'حين يلتقي التصميم بالتطوير.'],
    ['#hero-title > .sr-only', 'محمد فايز — مطوّر ويب متكامل'],
    ['.name-track > span', 'محمد فايز&nbsp;·&nbsp;'],
    ['#portrait-title', 'صورة محمد فايز'],
    ['.hero-intro p', 'واجهات مدروسة.<br>أسس قوية.<br>تجربة تعمل بإتقان.'],
    ['.hero-intro .text-link', 'تعرّف عليّ <span aria-hidden="true">↗</span>'],
    ['.hero-role p', 'مطوّر ويب متكامل.<br>أهتم بكل تفصيلة.'],
    ['.hero-role a', 'تحميل السيرة الذاتية <span aria-hidden="true">↓</span>'],
    ['.hero-foot > span', 'مرّر لاكتشاف المزيد'],
    ['.section-label', '<span class="tiny-mark" aria-hidden="true">✳</span> نبذة عني'],
    ['.about-main h2', 'أجمع بين التصميم<br>المدروس <span>والتطوير<br>المتقن.</span>'],
    ['.about-details p:first-child', 'أنا محمد، مطوّر ويب متكامل. أبني تطبيقات سريعة ومتجاوبة، بواجهات واضحة وأنظمة موثوقة تعمل خلفها.'],
    ['.about-details p:last-child', 'من أول تفاعل إلى آخر استعلام في قاعدة البيانات، أهتم بتكامل كل جزء. تجربة سهلة الاستخدام، وتنفيذ يهتم بالتفاصيل.'],
    ['.about-main .text-link', 'كيف أساعدك؟ <span aria-hidden="true">↗</span>'],
    ['.tech-label', 'الأدوات وراء التجربة'],
    ['#services .eyebrow', 'ما أقدّمه'],
    ['#services h2', 'من أول فكرة.<br>إلى آخر تفصيلة.'],
    ['#services .section-top > p', 'الواجهة. المنطق. الإطلاق.<br>اهتمام متكامل بكل جوانب منتجك.'],
    ['.service-row:nth-child(1) .visual-caption', 'الشكل والوظيفة'],
    ['.service-row:nth-child(1) .service-category', 'واجهات الاستخدام'],
    ['.service-row:nth-child(1) h3', 'تجربة مريحة.<br>على كل شاشة.'],
    ['.service-row:nth-child(1) .service-copy p', 'مواقع وواجهات متجاوبة تجعل الأفكار المعقدة سهلة الاستخدام، ومصممة حول احتياجات المستخدمين.'],
    ['.service-row:nth-child(1) .plain-tags', '<li>مواقع وصفحات تعريفية</li><li>واجهات متجاوبة</li><li>أنظمة تصميم</li>'],
    ['.service-row:nth-child(2) .visual-caption', 'تكامل من البداية'],
    ['.service-row:nth-child(2) .service-category', 'تطبيقات ويب متكاملة'],
    ['.service-row:nth-child(2) h3', 'جمال في الواجهة.<br>وقوة في الأداء.'],
    ['.service-row:nth-child(2) .service-copy p', 'تطبيقات ويب ولوحات تحكم ومنصات تجمع بين الواجهة والخادم، بحيث تعمل كل الطبقات معًا.'],
    ['.service-row:nth-child(2) .plain-tags', '<li>تطبيقات ويب</li><li>لوحات تحكم</li><li>أنظمة تسجيل الدخول</li>'],
    ['.service-row:nth-child(3) .visual-caption', 'الأساس يصنع الفارق'],
    ['.service-row:nth-child(3) .service-category', 'الخوادم والبنية التحتية'],
    ['.service-row:nth-child(3) h3', 'مبني على أساس<br>تقدر تعتمد عليه.'],
    ['.service-row:nth-child(3) .service-copy p', 'واجهات برمجية منظمة، ونماذج بيانات مدروسة، وتكاملات موثوقة. أساس قوي للخطوة القادمة.'],
    ['.service-row:nth-child(3) .plain-tags', '<li>واجهات برمجية وتكاملات</li><li>قواعد بيانات</li><li>نشر التطبيقات</li>'],
    ['#expertise .eyebrow', 'مهاراتي وأدواتي'],
    ['#expertise h2', 'الأدوات المناسبة.<br>للأسباب المناسبة.'],
    ['#expertise .section-top > p', 'اختيارات تقنية مدروسة، من الواجهة<br>إلى كل ما يجعلها تعمل.'],
    ['#tab-frontend', 'الواجهات <span>↗</span>'], ['#tab-backend', 'الخوادم <span>↗</span>'],
    ['#tab-data', 'البيانات والبنية التحتية <span>↗</span>'], ['#tab-quality', 'الجودة والتفاصيل <span>↗</span>'],
    ['#process .eyebrow', 'طريقة عملي'], ['#process h2', 'عمل متقن.<br>وخطوات واضحة.'],
    ['#process .section-top > p', 'تفكير مدروس من البداية.<br>واهتمام حتى النهاية.'],
    ['#process li:nth-child(1) h3', 'أفهم.'],
    ['#process li:nth-child(1) p', 'أصل إلى جوهر الفكرة، وأحدد المستخدمين والمشكلة والنتيجة التي نريد تحقيقها.'],
    ['#process li:nth-child(2) h3', 'أبني.'],
    ['#process li:nth-child(2) p', 'أربط التصميم بالبنية التقنية، وأطوّر على خطوات واضحة تسمح بالمراجعة والتحسين.'],
    ['#process li:nth-child(3) h3', 'أُتقن.'],
    ['#process li:nth-child(3) p', 'أختبر التفاصيل، وأراجع سهولة الوصول والأداء، وأجهّز كل جزء للإطلاق.'],
    ['.social-bar > div > p', 'تواصل معي.'],
    ['.contact-copy .eyebrow', 'فكرتك القادمة تبدأ هنا'],
    ['.contact-copy h2', 'لنبنِ معًا<br>شيئًا يصنع<br>فارقًا<span>.</span>'],
    ['.contact-copy > p:not([class])', 'موقع جديد. منتج مفيد.<br>تجربة أفضل. احكِ لي فكرتك.'],
    ['#contact-note', 'هنجهّز رسالتك في واتساب. راجعها واضغط إرسال بنفسك.'],
    ['label[for="name"]', 'اسمك'], ['label[for="email"]', 'بريدك الإلكتروني'], ['label[for="message"]', 'ما فكرتك؟'],
    ['#contact-submit', 'متابعة إلى واتساب <span aria-hidden="true">↗</span>'],
    ['.footer-brand', 'محمد فايز'], ['footer > a:last-child', 'العودة للأعلى ↑']
  ];
  const entries = content.flatMap(([selector, ar]) => [...document.querySelectorAll(selector)].map(element => ({element, en:element.innerHTML, ar})));
  const attributes = [
    ['#name', 'placeholder', 'محمد أحمد'], ['#email', 'placeholder', 'name@example.com'],
    ['#message', 'placeholder', 'نبذة عن فكرتك والوقت المتاح والهدف من المشروع…'],
    ['.brand', 'aria-label', 'محمد فايز — الرئيسية'], ['#navigation', 'aria-label', 'التنقّل الرئيسي'],
    ['.hero-foot > a', 'aria-label', 'انتقل إلى النبذة'], ['.tech-band .wrap > div', 'aria-label', 'التقنيات الأساسية'],
    ['.tabs', 'aria-label', 'تصنيفات المهارات'], ['.social-bar', 'aria-label', 'حسابات التواصل'],
    ['.bottom-socials', 'aria-label', 'روابط التواصل الاجتماعي'], ['.back-to-top', 'aria-label', 'العودة للأعلى']
  ].flatMap(([selector,attribute,ar]) => [...document.querySelectorAll(selector)].map(element => ({element,attribute,ar,en:element.getAttribute(attribute)})));
  const messages = {
    en: {pause:'Pause motion',resume:'Resume motion',pauseLabel:'Pause name animation',resumeLabel:'Resume name animation',status:'Your draft is ready. Review it in WhatsApp and press Send there.',retry:'Open WhatsApp',invalid:'Please enter your name and a short description of your project.'},
    ar: {pause:'إيقاف الحركة',resume:'تشغيل الحركة',pauseLabel:'إيقاف حركة الاسم',resumeLabel:'تشغيل حركة الاسم',status:'رسالتك جاهزة. افتحها في واتساب وراجعها قبل الضغط على إرسال.',retry:'فتح واتساب',invalid:'من فضلك اكتب اسمك ونبذة عن مشروعك.'}
  };
  const skillsAr = {
    frontend:{title:'واجهات مريحة في الاستخدام.',description:'تجارب متجاوبة وسهلة الوصول، بمكوّنات قابلة لإعادة الاستخدام وتفاعلات مدروسة وأداء سريع.'},
    backend:{title:'أساس قوي. وتكامل سلس.',description:'منطق خادم منظم، وواجهات برمجية واضحة، وتسجيل دخول آمن يربط الواجهة بالخدمات التي تحتاجها.'},
    data:{title:'جاهز للنمو مع منتجك.',description:'نماذج بيانات مدروسة، واستعلامات محسّنة، وخطوات نشر موثوقة تحافظ على سلاسة عمل تطبيقك.'},
    quality:{title:'التفاصيل تصنع الفارق.',description:'واجهات سهلة الوصول، واختبارات آلية، وتحسين للأداء. اهتمام يمتد إلى ما بعد الإطلاق.'}
  };
  const button = document.querySelector('.language-toggle');
  let language = 'en';
  try { language = localStorage.getItem('portfolio-language') === 'ar' ? 'ar' : 'en'; } catch {}
  function applyLanguage(next) {
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    entries.forEach(({element,en,ar}) => { element.innerHTML = language === 'ar' ? ar : en; });
    attributes.forEach(({element,attribute,en,ar}) => element.setAttribute(attribute,language === 'ar' ? ar : en));
    button.textContent = language === 'ar' ? 'English' : 'العربية';
    document.querySelector('.hero-role a').href = language === 'ar' ? 'assets/Mohamed-Fayez-CV-AR.pdf' : 'assets/Mohamed-Fayez-CV.pdf';
    button.lang = language === 'ar' ? 'en' : 'ar';
    button.setAttribute('aria-label',language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    document.title = language === 'ar' ? 'محمد فايز — مطوّر ويب متكامل' : 'Mohamed Fayez — Full-Stack Developer';
    document.querySelector('meta[name="description"]').content = language === 'ar' ? 'محمد فايز، مطوّر ويب متكامل. واجهات مدروسة وأنظمة موثوقة وتجارب ويب متقنة.' : 'Mohamed Fayez — Full-stack web developer. Thoughtful interfaces, dependable systems, and web experiences built with care.';
    document.querySelector('footer > span').innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${language === 'ar' ? 'محمد فايز' : 'Mohamed Fayez'}`;
    document.querySelector('#form-status').textContent = '';
    try { localStorage.setItem('portfolio-language',language); } catch {}
    document.dispatchEvent(new CustomEvent('portfolio:language', { detail:language }));
  }
  window.portfolioI18n = {get language(){return language;},t:key=>messages[language][key],skillsAr,applyLanguage};
  button.addEventListener('click',()=>applyLanguage(language === 'ar' ? 'en' : 'ar'));
  applyLanguage(language);
})();
