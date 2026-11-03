/* Display currencies only. The approved commercial price remains in SAR. */
(() => {
  'use strict';
  const currencies = [
    ['CHF', 'Swiss franc', 'الفرنك السويسري'],
    ['USD', 'US dollar', 'الدولار الأمريكي'],
    ['SAR', 'Saudi riyal', 'الريال السعودي'],
    ['EUR', 'Euro', 'اليورو'],
    ['QAR', 'Qatari riyal', 'الريال القطري'],
    ['AED', 'UAE dirham', 'الدرهم الإماراتي'],
    ['GBP', 'British pound', 'الجنيه الإسترليني'],
    ['CNY', 'Chinese yuan', 'اليوان الصيني'],
    ['SGD', 'Singapore dollar', 'الدولار السنغافوري']
  ];
  const read = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const supported = code => currencies.some(row => row[0] === code);
  let selected = supported(read('dlvaro-currency')) ? read('dlvaro-currency') : 'SAR';
  let product = { price: 8500, currency: 'SAR' };
  let rates = null, request = null, failed = false;
  const ar = () => document.documentElement.lang === 'ar';
  const text = (en, arabic) => ar() ? arabic : en;
  const amount = (value, code) => new Intl.NumberFormat(ar() ? 'ar-SA' : 'en-US', {
    style: 'currency', currency: code, currencyDisplay: 'code', minimumFractionDigits: code === 'SAR' ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
  const valid = data => data && data.result === 'success' && data.base_code === 'SAR' &&
    Number.isFinite(data.time_last_update_unix) && data.time_last_update_unix * 1000 <= Date.now() + 3600000 &&
    Date.now() - data.time_last_update_unix * 1000 < 48 * 3600000 &&
    Number.isFinite(data.time_next_update_unix) &&
    currencies.every(([code]) => Number.isFinite(data.rates?.[code]) && data.rates[code] > 0) && data.rates.SAR === 1;
  try { const cached = JSON.parse(read('dlvaro-exchange-rates')); if (valid(cached)) rates = cached; } catch (_) {}

  const trigger = document.createElement('button');
  trigger.className = 'currency-toggle'; trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-controls', 'currency-dialog');
  document.querySelector('.header-actions')?.insertBefore(trigger, document.querySelector('.language-toggle'));
  const dialog = document.createElement('dialog');
  dialog.id = 'currency-dialog'; dialog.className = 'currency-dialog';
  dialog.setAttribute('aria-labelledby', 'currency-title');
  dialog.innerHTML = '<div class="currency-heading"><h2 id="currency-title"></h2><button class="currency-close" type="button">×</button></div><p class="currency-intro"></p><div class="currency-options"></div><p class="currency-status" role="status"></p><p class="currency-source"><a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates By Exchange Rate API</a></p>';
  document.body.append(dialog);
  const status = dialog.querySelector('.currency-status');
  const list = dialog.querySelector('.currency-options');
  currencies.forEach(([code, en, arabic]) => {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.currency = code;
    button.innerHTML = '<b dir="ltr"></b><span></span><i aria-hidden="true">✓</i>';
    button.querySelector('b').textContent = code;
    button.addEventListener('click', () => {
      selected = code; save('dlvaro-currency', code); failed = false; render();
      dialog.close(); ensureRates();
    });
    list.append(button);
  });
  const priceNodes = [...document.querySelectorAll('[data-product-price]')];
  const notes = priceNodes.map(node => {
    const wrapper = document.createElement('div'); wrapper.className = 'currency-price-tools';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'currency-price-change';
    button.addEventListener('click', open); wrapper.append(button);
    const note = document.createElement('p'); note.className = 'currency-price-note'; note.setAttribute('role', 'status');
    const details = document.createElement('details'); details.className = 'currency-details';
    const summary = document.createElement('summary'); details.append(summary);
    const information = document.createElement('p'); information.className = 'currency-detail-copy'; details.append(information);
    wrapper.append(details, note); node.closest('.launch-details').after(wrapper);
    return { button, note, details, summary, information };
  });
  function open() { render(); dialog.showModal(); ensureRates(); }
  trigger.addEventListener('click', open);
  dialog.querySelector('.currency-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  function render() {
    if (rates && !valid(rates)) rates = null;
    trigger.textContent = selected + ' ⌄';
    trigger.setAttribute('aria-label', text('Select currency: ', 'اختيار العملة: ') + selected);
    dialog.querySelector('h2').textContent = text('Select currency', 'اختر العملة');
    dialog.querySelector('.currency-close').setAttribute('aria-label', text('Close', 'إغلاق'));
    dialog.querySelector('.currency-intro').textContent = text('The official price is in SAR. Other currencies are approximate conversions for reference.', 'السعر المعتمد بالريال السعودي. أسعار العملات الأخرى تحويلات تقديرية للاطلاع.');
    list.querySelectorAll('button').forEach((button, i) => {
      button.querySelector('span').textContent = currencies[i][ar() ? 2 : 1];
      button.setAttribute('aria-pressed', String(button.dataset.currency === selected));
    });
    const converted = selected !== 'SAR' && rates;
    priceNodes.forEach(node => { node.textContent = (converted ? '≈ ' : '') + amount(product.price * (converted ? rates.rates[selected] : 1), converted ? selected : 'SAR'); });
    const date = rates ? new Intl.DateTimeFormat(ar() ? 'ar-SA-u-ca-gregory' : 'en-GB', {dateStyle:'medium',timeZone:'UTC'}).format(new Date(rates.time_last_update_unix * 1000)) : '';
    let message = '';
    if (selected !== 'SAR') {
      message = rates ? text('Approximate · Official price: ', 'تقريبي · السعر المعتمد: ') + amount(product.price, 'SAR') + text(' · Rates dated ', ' · أسعار الصرف بتاريخ ') + date :
        failed ? text('Conversion unavailable. Showing the official SAR price. Please try again later.', 'التحويل غير متاح حاليًا. يُعرض السعر المعتمد بالريال السعودي. يرجى المحاولة لاحقًا.') :
        text('Loading exchange rates… The official SAR price is shown meanwhile.', 'جارٍ تحميل أسعار الصرف… يُعرض السعر المعتمد بالريال السعودي مؤقتًا.');
    }
    notes.forEach(({ button, note, details, summary, information }) => {
      button.textContent = text('Currency · ', 'العملة · ') + selected + ' ⌄';
      details.hidden = !converted;
      if (!converted) details.open = false;
      summary.textContent = text('Approximate · Details', 'تقريبي · تفاصيل التحويل');
      note.textContent = converted ? '' : message;
      note.hidden = !note.textContent;
      information.textContent = converted ? message : '';
      if (converted) {
        const link = document.createElement('a'); link.href = 'https://www.exchangerate-api.com';
        link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Rates By Exchange Rate API';
        information.append(document.createElement('br'), link);
      }
    });
    status.textContent = message || (rates ? text('Rates dated ', 'أسعار الصرف بتاريخ ') + date : '');
  }
  async function ensureRates() {
    if (selected === 'SAR' || request || (rates && Date.now() < rates.time_next_update_unix * 1000)) return;
    failed = false;
    request = (async () => {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/SAR', {signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer'});
        if (!response.ok) throw new Error('Rates unavailable');
        const data = await response.json(); if (!valid(data)) throw new Error('Invalid rates');
        rates = data; save('dlvaro-exchange-rates', JSON.stringify(data));
      } catch (_) { failed = true; }
      finally { clearTimeout(timer); request = null; render(); }
    })();
    await request;
  }
  document.addEventListener('dlvaro:locale', render);
  fetch('data/watch.json?v=launch-june-2027').then(r => r.json()).then(data => {
    if (Number.isFinite(data.price) && data.price > 0 && data.currency === 'SAR') product = data;
    render();
  }).catch(() => {});
  render(); ensureRates();
})();
