(() => {
  'use strict';
  const root = document.querySelector('[data-checkout]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const product = params.get('product');
  const colours = {orange:['Orange','برتقالي'],white:['White','أبيض'],yellow:['Yellow','أصفر'],green:['Green','أخضر'],black:['Black','أسود'],burgundy:['Burgundy','عنابي'],blue:['Blue','أزرق'],brown:['Brown','بني']};
  const requestedColour = params.get('colour');
  const colour = Object.hasOwn(colours, requestedColour) ? requestedColour : 'orange';
  // Watch prices and numbers are enforced by the server; straps use a merchant-managed link.
  // Never accept a payment URL or an amount from the query string.
  const links = {strap:'https://www.paypal.com/ncp/payment/7PB8H22CYS3T4'};
  const validProduct = product === 'watch' || product === 'strap';
  const ar = () => document.documentElement.lang === 'ar';
  const t = (en, arabic) => ar() ? arabic : en;
  function render() {
    document.title = t('Review your pre-order — DLVARO','مراجعة الطلب المسبق — DLVARO');
    document.querySelector('meta[name="description"]').content = t('Review your DLVARO pre-order, full payment and shipping terms before continuing to PayPal.','راجعوا طلب DLVARO المسبق والمبلغ الكامل وشروط الشحن قبل الانتقال إلى PayPal.');
    if (!validProduct) {
      root.innerHTML = '<div class="checkout-error"><h1>' + t('Choose your creation','اختاروا منتجكم') + '</h1><p>' + t('Select a watch or strap before continuing to payment.','اختاروا الساعة أو السوار قبل المتابعة إلى الدفع.') + '</p><a href="products.html?lang=' + (ar()?'ar':'en') + '">' + t('Explore watches','استكشفوا الساعات') + '</a></div>';
      return;
    }
    const strap = product === 'strap';
    const value = new Intl.NumberFormat(ar() ? 'ar-SA' : 'en-US', {
      numberingSystem: ar() ? 'arab' : 'latn', useGrouping: true, maximumFractionDigits: 0
    }).format(strap ? 150 : 2300).replace(/\u066c/g, ',');
    const price = ar() ? value + ' $' : '$' + value;
    const title = strap ? t('DLVARO · 20 mm strap','DLVARO · سوار ٢٠ مم') : 'DLVARO DV-01';
    const selected = colours[colour][ar()?1:0];
    const accepted = root.querySelector('#preorder-consent')?.checked || false;
    root.innerHTML = `
      <div class="checkout-heading"><p class="eyebrow">${t('DLVARO / PRE-ORDER','DLVARO / طلب مسبق')}</p><h1>${t('Review your pre-order','مراجعة طلبكم المسبق')}</h1><p>${t('A creation worth waiting for. Review the details before continuing to PayPal.','إبداع يستحق الانتظار. راجعوا التفاصيل قبل المتابعة إلى PayPal.')}</p></div>
      ${strap?'':window.DLVAROEdition.markup()}
      <div class="checkout-grid"><figure class="checkout-visual"><img src="${strap?'assets/strap-'+colour+'.jpg':'assets/dv-01-approved.png'}" alt="${title}${strap?' — '+selected:''}"><figcaption>${t('Design visualization.','تصوّر بصري للتصميم.')}</figcaption></figure>
      <section class="checkout-summary" aria-label="${t('Order summary','ملخص الطلب')}"><h2 dir="${strap?(ar()?'rtl':'ltr'):'ltr'}">${title}</h2>
      <p>${strap?t('Rubber and fabric · 20 mm · '+selected,'مطاط وقماش · ٢٠ مم · '+selected):t('Limited edition · 50 numbered pieces','إصدار محدود · ٥٠ قطعة مرقّمة')}</p>
      <dl class="checkout-details"><div><dt>${t('Quantity','الكمية')}</dt><dd>1</dd></div><div><dt>${t('Price, tax included','السعر شامل الضريبة')}</dt><dd><bdi>${price}</bdi></dd></div><div><dt>${t('Worldwide shipping','الشحن لجميع الدول')}</dt><dd>${t('Free','مجاني')}</dd></div><div class="checkout-total"><dt>${t('Full amount due now','المبلغ الكامل المستحق الآن')}</dt><dd><bdi>${price}</bdi></dd></div></dl>
      <div class="checkout-terms"><p><strong>${t('Shipping starts 1 June 2027.','يبدأ الشحن في ١ يونيو ٢٠٢٧.')}</strong> ${t('This is the dispatch date, not the arrival date.','هذا موعد بدء الشحن، وليس موعد وصول الطلب.')}</p><p>${t('This is a pre-order. The full amount is collected now in US dollars. Other currency displays on the website are estimates only.','هذا طلب مسبق ويُحصّل المبلغ كاملًا الآن بالدولار الأمريكي. عرض العملات الأخرى في الموقع تقديري فقط.')}</p>
      ${strap?'<p class="checkout-colour-note">'+t('Your selection: '+selected+'. Select this colour again on the PayPal page before paying. The colour confirmed in PayPal is the colour ordered.','اختياركم: '+selected+'. اختاروا هذا اللون مرة أخرى في صفحة PayPal قبل الدفع. اللون المؤكد في PayPal هو لون الطلب.')+'</p>':'<p>'+t('You may request a watch exchange or return within 7 days of receiving it. Contact social@dlvaroofficial.com. Statutory consumer rights remain unaffected.','يمكن طلب استبدال الساعة أو استرجاعها خلال ٧ أيام من استلامها عبر social@dlvaroofficial.com. لا تتأثر حقوق المستهلك القانونية.')+'</p>'}
      ${strap?'':'<p>'+t('Your watch has a five-year warranty from the purchase date. After payment confirmation, a detailed DLVARO invoice with your serial and edition number is emailed to your account address.','تتمتع الساعة بضمان خمس سنوات من تاريخ الشراء. بعد تأكيد الدفع تُرسل فاتورة DLVARO المفصّلة، متضمنة السيريال ورقم الإصدار، إلى بريد حسابكم.')+'</p>'}
      <p>${t('For cancellation or return enquiries, contact customer service. Your order and payment receipt are confirmed by PayPal.','لاستفسارات الإلغاء أو الاسترجاع، تواصلوا مع خدمة العملاء. يتم تأكيد الطلب وإيصال الدفع عبر PayPal.')}</p></div>
      <form id="preorder-form"><label class="checkout-consent"><input type="checkbox" id="preorder-consent" required ${accepted?'checked':''}><span>${t('I understand this is a pre-order, the full amount is charged now, and shipping starts on 1 June 2027.','أقرّ بأن هذا طلب مسبق، وأن المبلغ يُحصّل كاملًا الآن، وأن الشحن يبدأ في ١ يونيو ٢٠٢٧.')}</span></label><button class="button-outline checkout-pay" type="submit" ${accepted?'':'disabled'}>${t('Continue to PayPal','المتابعة إلى PayPal')} <span aria-hidden="true"><svg class="direction-arrow" viewBox="0 0 24 24" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></span></button></form>
      <a class="checkout-support" href="mailto:social@dlvaroofficial.com">${t('Questions? Contact customer service','للاستفسار، تواصلوا مع خدمة العملاء')}</a></section></div>`;
    const consent = root.querySelector('#preorder-consent');
    const button = root.querySelector('.checkout-pay');
    function syncPayment() { button.disabled = !consent.checked || (!strap && !window.DLVAROEdition.canPay()); }
    consent.addEventListener('change', syncPayment);
    if (!strap) window.DLVAROEdition.mount();
    syncPayment();
    root.querySelector('#preorder-form').addEventListener('submit', event => {
      event.preventDefault();
      if (!consent.checked) return;
      if (strap) location.assign(links.strap);
      else window.DLVAROEdition.start();
    });
  }
  document.addEventListener('dlvaro:locale', render);
  document.addEventListener('dlvaro:number', () => {
    const consent = root.querySelector('#preorder-consent');
    const button = root.querySelector('.checkout-pay');
    if (consent && button) button.disabled = !consent.checked || !window.DLVAROEdition.canPay();
  });
  // Browsers can restore checkbox state when returning from PayPal.
  window.addEventListener('pageshow', () => {
    const consent = root.querySelector('#preorder-consent');
    const button = root.querySelector('.checkout-pay');
    if (consent && button) button.disabled = !consent.checked || (product === 'watch' && !window.DLVAROEdition.canPay());
  });
  render();
})();
