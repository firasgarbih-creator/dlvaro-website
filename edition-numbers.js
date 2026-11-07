(() => {
 'use strict';
 const API='https://ggpgvktcazqovbafadzn.supabase.co/functions/v1/numbered-checkout';
 let pieces=Array.from({length:50},(_,i)=>({number:i+1,status:i<10||i===24?'sold':'unknown'}));
 let selected=Number(new URLSearchParams(location.search).get('number'))||null;
 let client,ready=false,busy=false,lastMessage='',mounted,needsSignIn=false,resolvingPayment=false;
 const t=(en,ar)=>document.documentElement.lang==='ar'?ar:en;
 const label=n=>String(n).padStart(2,'0');
 const saved=()=>{try{return JSON.parse(sessionStorage.getItem('dlvaro-number-order')||'null');}catch(_){return null;}};
 const own=n=>saved()?.number===n;
 const chooseable=p=>p.status==='available'||(p.status==='reserved'&&own(p.number));
 function markup(){return '<section class="edition-picker" aria-labelledby="edition-title"><h3 id="edition-title">'+t('Choose your edition number','اختاروا رقم إصداركم')+'</h3><p>'+t('Each number belongs to one watch.','كل رقم يخص ساعة واحدة فقط.')+'</p><div class="edition-legend"><span>'+t('Available','متاح')+'</span><span class="sold">'+t('Sold','مباع')+'</span><span class="reserved">'+t('Reserved','محجوز مؤقتًا')+'</span></div><div class="edition-grid" role="group" aria-labelledby="edition-title"></div><p class="edition-selection" aria-live="polite"></p><p class="edition-message" role="status"></p><button type="button" class="edition-signin" hidden>'+t('Sign in to view your order','تسجيل الدخول لعرض طلبكم')+'</button><button type="button" class="edition-refresh">'+t('Refresh availability','تحديث التوفر')+'</button></section>';}
 function paint(){
  const root=document.querySelector('.edition-picker');if(!root)return;
  if(selected&&!pieces.some(p=>p.number===selected&&chooseable(p)))selected=null;
  root.querySelector('.edition-grid').innerHTML=pieces.map(p=>{
   const state=p.status==='sold'?t('Sold','مباع'):p.status==='reserved'?t('Reserved','محجوز مؤقتًا'):p.status==='unknown'?t('Checking','جارٍ التحقق'):t('Available','متاح');
   return '<button type="button" data-edition="'+p.number+'" class="edition-number '+p.status+'" aria-pressed="'+(p.number===selected)+'" aria-label="'+label(p.number)+' — '+state+'" '+(!ready||busy||resolvingPayment||!chooseable(p)?'disabled':'')+'><bdi>'+label(p.number)+'</bdi><small>'+state+'</small></button>';
  }).join('');
  root.querySelector('.edition-selection').textContent=selected?t('Your number: ','رقمكم المختار: ')+label(selected)+'/50':t('Select an available number to continue.','اختاروا رقمًا متاحًا للمتابعة.');
  root.querySelector('.edition-message').textContent=lastMessage||t('Sign in before payment. Your number is held for 15 minutes while you complete checkout.','سجّلوا الدخول قبل الدفع. يُحجز رقمكم لمدة ١٥ دقيقة أثناء إتمام الطلب.');
  root.querySelector('.edition-refresh').disabled=busy;
  root.querySelector('.edition-signin').hidden=!needsSignIn;
  root.querySelectorAll('[data-edition]').forEach(button=>button.addEventListener('click',()=>{
   selected=Number(button.dataset.edition);const url=new URL(location.href);url.searchParams.set('number',selected);history.replaceState({},'',url);paint();root.querySelector('[data-edition="'+selected+'"]')?.focus();
  }));
  document.dispatchEvent(new CustomEvent('dlvaro:number'));
 }
 function mount(){
  mounted=document.querySelector('.edition-picker');if(!mounted)return;
  mounted.querySelector('.edition-refresh').addEventListener('click',()=>new URLSearchParams(location.search).has('payment')?handleReturn():refresh());mounted.querySelector('.edition-signin').addEventListener('click',signIn);paint();
 }
 async function refresh(){
  try{
   if (!client) throw Error();
   const result=await client.rpc('dv01_availability');if(result.error)throw Error();
   const data={pieces:result.data};
   if(!Array.isArray(data.pieces)||data.pieces.length!==50||data.pieces.some((p,i)=>p.number!==i+1||!['available','sold','reserved'].includes(p.status)))throw Error();
   pieces=data.pieces;ready=true;lastMessage='';
  }catch(_){ready=false;lastMessage=t('Availability could not be checked. Please refresh before continuing.','تعذّر التحقق من التوفر. يرجى التحديث قبل المتابعة.');}
  paint();
 }
 async function call(action,body){
  if(!client)throw Error('authentication_required');
  const {data}=await client.auth.getSession();if(!data.session)throw Error('authentication_required');
  const response=await fetch(API+'?action='+action,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+data.session.access_token},body:JSON.stringify(body)});
  const result=await response.json();if(!response.ok)throw Error(result.error||'payment_service_unavailable');return result;
 }
 function signIn(){const current=new URLSearchParams(location.search);if(['return','cancel'].includes(current.get('payment')))sessionStorage.setItem('dlvaro-payment-return',JSON.stringify({mode:current.get('payment'),token:current.get('token')||saved()?.orderId}));const next=new URL('account.html',location.href);next.searchParams.set('return','checkout');if(selected)next.searchParams.set('number',selected);next.searchParams.set('lang',document.documentElement.lang);location.assign(next.href);}
 async function start(){
  if(!selected||!ready||busy||resolvingPayment)return;
  busy=true;paint();
  try{
   const result=await call('create',{number:selected,lang:document.documentElement.lang});
   const target=new URL(result.approvalUrl);
   if(target.protocol!=='https:'||target.hostname!=='www.paypal.com')throw Error('payment_service_unavailable');
   sessionStorage.setItem('dlvaro-number-order',JSON.stringify(result));location.assign(target.href);
  }catch(e){
   if(e.message==='authentication_required'){signIn();return;}
   lastMessage=e.message==='number_unavailable'?t('This number is no longer available. Choose another.','لم يعد هذا الرقم متاحًا. اختاروا رقمًا آخر.'):e.message==='existing_reservation'?t('You already have a number reserved. Return to that number to continue, or wait for the reservation to expire.','لديكم رقم محجوز بالفعل. عودوا إليه للمتابعة، أو انتظروا انتهاء الحجز.'):t('Payment could not be started. Please refresh availability and try again.','تعذّر بدء الدفع. حدّثوا التوفر وحاولوا مجددًا.');
   busy=false;paint();
  }
 }
 async function handleReturn(){
  const params=new URLSearchParams(location.search),mode=params.get('payment'),order=saved();
  if(!mode)return;
  if(order)selected=order.number;
  busy=true;resolvingPayment=true;needsSignIn=false;paint();
  try{
   if(mode==='cancel'&&order){const cancelled=await call('cancel',{reservationId:order.reservationId});if(!cancelled.released)throw Error('payment_unconfirmed');sessionStorage.removeItem('dlvaro-number-order');sessionStorage.removeItem('dlvaro-payment-return');resolvingPayment=false;lastMessage=t('Checkout cancelled. No new payment was completed on this page.','أُلغي إكمال الطلب. لم تُنجز دفعة جديدة في هذه الصفحة.');}
   else if(mode==='return'){
    const result=await call('capture',{orderId:params.get('token')||order?.orderId});
    lastMessage=result.status==='sold'?t('Payment confirmed. Your watch number is ','تم تأكيد الدفع. رقم ساعتكم هو ')+label(result.number)+'/50.':t('Payment is being verified. Your number remains reserved. Contact customer service if this message persists.','جارٍ التحقق من الدفع. يبقى رقمكم محجوزًا. تواصلوا مع خدمة العملاء إذا استمرت هذه الحالة.');
    if(result.status==='sold'){lastMessage+=' '+(result.invoiceStatus==='sent'?t('Your detailed invoice has been emailed to your account address.','أُرسلت الفاتورة المفصّلة إلى بريد حسابكم.'):t('Your payment is complete. Your invoice is queued for email delivery; contact customer service if it does not arrive.','اكتمل الدفع. فاتورتكم قيد الإرسال بالبريد؛ تواصلوا مع خدمة العملاء إذا لم تصلكم.'));resolvingPayment=false;sessionStorage.removeItem('dlvaro-number-order');sessionStorage.removeItem('dlvaro-payment-return');}
   }
  }catch(e){if(e.message==='reservation_expired')resolvingPayment=false;needsSignIn=e.message==='authentication_required';lastMessage=needsSignIn?t('Sign in to confirm your order.','سجّلوا الدخول لتأكيد طلبكم.'):e.message==='reservation_expired'?t('The reservation expired before payment could be captured. Refresh to choose an available number.','انتهت مهلة الحجز قبل تحصيل الدفع. حدّثوا التوفر لاختيار رقم متاح.'):t('We could not confirm the payment yet. Do not pay again; contact customer service with your PayPal receipt.','لم نتمكن من تأكيد الدفع بعد. لا تدفعوا مجددًا؛ تواصلوا مع خدمة العملاء مع إيصال PayPal.');}
  busy=false;
  const resultMessage=lastMessage;await refresh();lastMessage=resultMessage;paint();
 }
 async function init(){
  try{
   const response=await fetch('data/account-config.json',{cache:'no-store'});const config=await response.json();
   client=window.supabase.createClient(config.supabaseUrl,config.publishableKey,{auth:{storage:sessionStorage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  }catch(_){}
  await refresh();await handleReturn();
 }
 window.DLVAROEdition={markup,mount,start,canPay:()=>ready&&!busy&&!resolvingPayment&&!!selected&&pieces.some(p=>p.number===selected&&chooseable(p))};
 if(new URLSearchParams(location.search).get('product')==='watch'){
  init();setInterval(()=>{if(!document.hidden&&!busy&&!document.activeElement?.closest('.edition-picker')&&!new URLSearchParams(location.search).has('payment'))refresh();},30000);
 }
})();
