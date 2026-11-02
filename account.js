/* DLVARO accounts: Supabase manages verification and sessions. No private keys. */
(() => {
  const root = document.querySelector('.customer-account');
  if (!root) return;
  const emailForm = document.getElementById('account-email-form');
  const otpForm = document.getElementById('account-otp-form');
  const dashboard = document.getElementById('account-dashboard');
  const status = document.getElementById('account-status');
  const emailInput = document.getElementById('account-email');
  const otpInput = document.getElementById('account-code');
  const sendButton = document.getElementById('account-send');
  const resendButton = document.getElementById('account-resend');
  const preferencesForm = document.getElementById('account-preferences');
  const subscriptionInput = document.getElementById('account-subscribed');
  const messages = {
    en: {
      unavailable: 'Registration is temporarily unavailable. Please contact customer service.',
      sent: 'Check your email for your sign-in code. If it has not arrived, check your spam folder.',
      sendFailed: 'We could not send the code. Please check your email and try again later.',
      invalid: 'This code is invalid or expired. Check it or request a new code.',
      working: 'Please wait…', saved: 'Your preferences have been saved.',
      saveFailed: 'Your account is verified, but your preferences could not be saved. Please try again.',
      loadFailed: 'We could not load your preferences. Please reload the page to try again.',
      signedOut: 'You have signed out.', logoutFailed: 'Unable to sign out. Please try again.',
      wait: 'Please wait before requesting another code.',
      signedIn: 'You are signed in. Manage your newsletter subscription below.'
    },
    ar: {
      unavailable: 'التسجيل غير متاح مؤقتًا. يُرجى التواصل مع خدمة العملاء.',
      sent: 'راجعوا بريدكم للحصول على رمز الدخول. إن لم تصل الرسالة، تحققوا من مجلد الرسائل غير المرغوب فيها.',
      sendFailed: 'تعذّر إرسال الرمز. تحققوا من البريد وحاولوا لاحقًا.',
      invalid: 'الرمز غير صحيح أو انتهت صلاحيته. تحققوا منه أو اطلبوا رمزًا جديدًا.',
      working: 'يُرجى الانتظار…', saved: 'تم حفظ تفضيلاتكم.',
      saveFailed: 'تم تأكيد الحساب، لكن تعذّر حفظ التفضيلات. يُرجى المحاولة مجددًا.',
      loadFailed: 'تعذّر تحميل تفضيلاتكم. أعيدوا تحميل الصفحة للمحاولة مجددًا.',
      signedOut: 'تم تسجيل الخروج.', logoutFailed: 'تعذّر تسجيل الخروج. يُرجى المحاولة مجددًا.',
      wait: 'انتظروا قليلًا قبل طلب رمز آخر.',
      signedIn: 'تم تسجيل الدخول. يمكنكم إدارة الاشتراك بالأخبار أدناه.'
    }
  };
  let client, currentUser, pendingEmail = '', wantsNews = false, busy = false;
  let resendAt = 0, statusKey = '', statusError = false, timer;
  const lang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
  otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
      .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776)).replace(/\s/g, '');
  });
  function message(key, error = false) {
    statusKey = key; statusError = error;
    status.textContent = messages[lang()][key] || '';
    status.classList.toggle('is-error', error);
  }
  function setBusy(value) {
    busy = value;
    root.setAttribute('aria-busy', String(value));
    root.querySelectorAll('button').forEach(button => { button.disabled = value; });
    if (!value) resendButton.disabled = Date.now() < resendAt;
  }
  function cooldown() {
    resendAt = Date.now() + 60000;
    clearTimeout(timer);
    resendButton.disabled = true;
    timer = setTimeout(() => { if (!busy) resendButton.disabled = false; }, 60000);
  }
  function showEmail() {
    emailForm.hidden = false; otpForm.hidden = true; dashboard.hidden = true;
    preferencesForm.querySelector('button').disabled = true;
    currentUser = null; pendingEmail = ''; otpInput.value = '';
  }
  async function showAccount() {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) { showEmail(); return false; }
    currentUser = data.user;
    emailForm.hidden = true; otpForm.hidden = true; dashboard.hidden = false;
    document.getElementById('account-current-email').textContent = currentUser.email;
    subscriptionInput.checked = false;
    subscriptionInput.disabled = true;
    const result = await client.from('customer_preferences')
      .select('newsletter_subscribed').eq('user_id', currentUser.id).maybeSingle();
    if (result.error) { message('loadFailed', true); return false; }
    subscriptionInput.checked = result.data?.newsletter_subscribed === true;
    subscriptionInput.disabled = false;
    preferencesForm.querySelector('button').disabled = false;
    message('signedIn');
    return true;
  }
  async function savePreferences(subscribed) {
    const result = await client.rpc('set_customer_preferences', {
      p_subscribed: subscribed, p_locale: lang()
    });
    if (result.error) throw result.error;
  }
  async function sendCode() {
    if (busy || !client || Date.now() < resendAt) return;
    setBusy(true); message('working');
    try {
      const { error } = await client.auth.signInWithOtp({
        email: pendingEmail, options: { shouldCreateUser: true }
      });
      if (error) throw error;
      emailForm.hidden = true; otpForm.hidden = false;
      document.getElementById('account-pending-email').textContent = pendingEmail;
      cooldown(); message('sent'); otpInput.focus();
    } catch (_) { message('sendFailed', true); }
    finally { setBusy(false); }
  }
  emailForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!emailForm.reportValidity() || busy || !client) return;
    if (Date.now() < resendAt) { message('wait', true); return; }
    pendingEmail = emailInput.value.trim();
    wantsNews = document.getElementById('account-news-optin').checked;
    await sendCode();
  });
  otpForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!otpForm.reportValidity() || busy || !pendingEmail || !client) return;
    setBusy(true); message('working');
    try {
      const { error } = await client.auth.verifyOtp({ email: pendingEmail, token: otpInput.value.trim(), type: 'email' });
      if (error) throw error;
      otpInput.value = '';
      const loaded = await showAccount();
      if (loaded && wantsNews) {
        try { await savePreferences(true); subscriptionInput.checked = true; message('saved'); }
        catch (_) { message('saveFailed', true); }
      }
      wantsNews = false;
    } catch (_) { message('invalid', true); }
    finally { setBusy(false); if (subscriptionInput.disabled) preferencesForm.querySelector('button').disabled = true; }
  });
  resendButton.addEventListener('click', sendCode);
  document.getElementById('account-change-email').addEventListener('click', () => {
    if (busy) return; showEmail(); message(''); emailInput.focus();
  });
  preferencesForm.addEventListener('submit', async event => {
    event.preventDefault(); if (!currentUser || busy || subscriptionInput.disabled) return;
    setBusy(true); message('working');
    try { await savePreferences(subscriptionInput.checked); message('saved'); }
    catch (_) { message('saveFailed', true); }
    finally { setBusy(false); }
  });
  document.getElementById('account-signout').addEventListener('click', async () => {
    if (busy) return; setBusy(true);
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
      showEmail(); emailInput.value = ''; message('signedOut');
    } catch (_) { message('logoutFailed', true); }
    finally { setBusy(false); }
  });
  document.addEventListener('dlvaro:locale', () => message(statusKey, statusError));
  async function init() {
    setBusy(true);
    try {
      const response = await fetch('data/account-config.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Configuration unavailable');
      const config = await response.json();
      if (!config.enabled || !/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(config.supabaseUrl) || !config.publishableKey?.startsWith('sb_publishable_')) throw new Error('Not configured');
      client = window.supabase.createClient(config.supabaseUrl, config.publishableKey, {
        auth: { storage: sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
      });
      client.auth.onAuthStateChange(event => {
        if (event === 'SIGNED_OUT') { showEmail(); message('signedOut'); }
      });
      const { data } = await client.auth.getSession();
      if (data.session) await showAccount();
      setBusy(false);
      if (subscriptionInput.disabled) preferencesForm.querySelector('button').disabled = true;
    } catch (_) { message('unavailable', true); setBusy(true); root.setAttribute('aria-busy', 'false'); }
  }
  init();
})();
