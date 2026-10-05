/* SGC SOFT DRINKS MANAGEMENT - app.js
   RLS: KEEP ENABLED. Client uses only the public publishable key.
*/
(() => {
'use strict';
 
 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SGC SOFT DRINKS — CORE CONFIGURATION & APP STATE
   ========================================================= */

const CFG = {
  url: 'https://prqhqogcisjwzcsxyics.supabase.co',
  key: 'sb_publishable_M1j6cLFnEVGULYaCfssaZg_KkFCLAcQ',
  cdn: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',

  bucket: 'profile-pictures',

  devFn: 'developer-signup',
  resetFn: 'password-reset',

  deviceKey: 'sgc.device.id'
};


/* =========================================================
   CONTACT INFORMATION
   ========================================================= */

const C = {
  wa1: '+255658542607',
  wa2: '+255638127127',

  call1: '+255638127127',
  call2: '+255658542607',

  email: 'sgcsoftdrinks@gmail.com'
};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const S = {
  sb: null,

  user: null,
  session: null,

  profile: null,
  role: null,

  /*
   * Language priority:
   * 1. Previously selected language from this browser
   * 2. Swahili as system fallback
   *
   * The database default_language setting will be
   * applied after Supabase is initialized.
   */
  lang: localStorage.getItem('sgc.language') || 'sw',

  page: 'dashboard',

  deviceId:
    localStorage.getItem(CFG.deviceKey),

  authSessionId: null,
  deviceSession: null,
  heartbeat: null,

  avatarPath: null,

  confirm: null
};


/* =========================================================
   FUNCTION ALIASES
   These declarations are required because this build
   runs in strict mode.
   ========================================================= */

let dashboard;

let products;
let viewProduct;

let customers;
let suppliers;

let received;
let verifyReceipt;

let sales;

let customerPaymentForm;
let supplierPaymentForm;

let payments;

let expenses;
let expenseForm;
let deleteExpense;

let userMgmt;

let renderPage;
let action;
let events;
let init;

let saleForm;
let receiptForm;

 const $=id=>document.getElementById(id), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
const money=v=>Number.isFinite(Number(v))?new Intl.NumberFormat('en-TZ',{maximumFractionDigits:2}).format(Number(v))+' TZS':'—';
const date=v=>{if(!v)return'—';const d=new Date(v);return Number.isNaN(d.getTime())?String(v):new Intl.DateTimeFormat(S.lang==='sw'?'sw-TZ':'en-TZ',{dateStyle:'medium',timeStyle:'short'}).format(d)};
const today=()=>{const d=new Date(),o=d.getTimezoneOffset();return new Date(d-o*60000).toISOString().slice(0,10)};
function txt(sw,en){return S.lang==='sw'?sw:en}
function toast(msg,type='info'){const c=$('toast-container');if(!c)return;const e=document.createElement('div');e.className='toast '+type;e.innerHTML=`<div>${esc(msg)}</div><button class="toast-close">×</button>`;e.querySelector('button').onclick=()=>e.remove();c.appendChild(e);setTimeout(()=>e.remove(),type==='error'?12000:5000)}
function important(msg){const c=$('message-container');if(!c)return;const e=document.createElement('div');e.className='message error';e.innerHTML=`<div>${esc(msg)}</div><button class="message-close">×</button>`;e.querySelector('button').onclick=()=>e.remove();c.appendChild(e)}
function err(e){const m=e?.message||e?.error_description||String(e||'Unknown error');const map={'Invalid login credentials':txt('Email au password si sahihi.','Email or password is incorrect.'),'Email not confirmed':txt('Thibitisha email yako kwanza.','Please confirm your email first.'),'User already registered':txt('Email hii tayari imesajiliwa.','This email is already registered.'),'Authentication required':txt('Ingia kwanza.','Authentication is required.'),'Device is not registered':txt('Kifaa hiki hakijasajiliwa.','This device is not registered.')};return map[m]||m}
function busy(b,x){if(!b)return;b.disabled=x;b.classList.toggle('btn-loading',x)}
function msg(id,m,type='info'){const e=$(id);if(e){e.hidden=!m;e.className='form-message '+type;e.textContent=m}}
function modal(id,open=true){const e=$(id);if(!e)return;e.hidden=!open;e.classList.toggle('open',open);document.body.classList.toggle('modal-open',$$('.modal:not([hidden])').length>0)}

const EN={
'nav.home':'Home','nav.about':'About','nav.features':'Features','nav.contact':'Contact','nav.login':'Login','nav.signup':'Sign Up','nav.dashboard':'Dashboard','nav.profile':'Profile','nav.logout':'Logout','language.label':'Language',
'actions.addProduct':'Add Product','actions.addCustomer':'Add Customer','actions.addSupplier':'Add Supplier','actions.addExpense':'Add Expense','actions.newSale':'New Sale','actions.receiveStock':'Receive Stock','actions.reload':'Reload','actions.saveChanges':'Save Changes',
'common.cancel':'Cancel','common.confirm':'Confirm','common.loading':'Loading...','confirm.title':'Confirm action','confirm.defaultMessage':'Are you sure you want to continue?',
'home.eyebrow':'SG COOPERATION','home.title':'Smart Management for SGC SOFT DRINKS','home.description':'Manage products, stock, sales, customers, suppliers and business finances from one secure system.','home.login':'Login','home.signup':'Create Account','home.quickTitle':'One system. Complete control.','home.quickHeading':'Built for daily business operations.','home.roles':'Role-based access','home.secure':'Secure database','home.directorEyebrow':'DIRECTOR SAM','home.directorTitle':'SG COOPERATION','home.directorText':'Technology • Business • Innovation',
'dashboard.eyebrow':'Overview','dashboard.title':'Dashboard','dashboard.subtitle':'Business activity from the live database.','dashboard.todaySales':"Today's Sales",'dashboard.transactions':'Transactions','dashboard.customers':'Customers','dashboard.stockValue':'Stock Value','dashboard.lowStock':'Low Stock','dashboard.activeCustomers':'Active Customers','dashboard.currentStockValue':'Current Stock Value','dashboard.itemsNeedAttention':'Items Need Attention','dashboard.quickActions':'Quick Actions','dashboard.quickActionsText':'Start common business actions from here.','dashboard.authStatus':'Authentication','dashboard.roleStatus':'Role','dashboard.accountStatus':'Account Status','dashboard.systemStatus':'System Status','dashboard.systemStatusText':'Supabase connection and security checks are active.','dashboard.today':'Today',
'profile.fullName':'Full Name','profile.username':'Username','profile.email':'Email','profile.phone':'Phone','profile.role':'Role','profile.status':'Account Status','profile.createdAt':'Created At','profile.active':'Active',

'profile.changePhoto':'Change Photo','profile.removePhoto':'Remove Photo','profile.photoHelp':'Use JPG, PNG or WEBP.',
/* RLS: ENABLED (KEEP ENABLED) */
'profile.takePhoto':'Take Photo',
'profile.moreInfo':'More Profile Info',
'profile.detailsEyebrow':'Profile',
'profile.detailsTitle':'More Profile Information',
'profile.detailsDescription':'Additional profile information available to you.',
'profile.zoom':'Zoom',
'profile.cropTitle':'Crop Profile Picture',
'profile.cropDescription':'Adjust the image before saving your profile picture.',
'profile.cropHint':'Drag the image to adjust its position.',

'auth.loginEyebrow':'Account','auth.loginTitle':'Login','auth.loginDescription':'Login to SGC SOFT DRINKS MANAGEMENT.','auth.loginButton':'Login','auth.email':'Email','auth.password':'Password','auth.forgotPassword':'Forgot password?','auth.createAccount':'Create account','auth.signupEyebrow':'New Account','auth.signupTitle':'Sign Up','auth.signupDescription':'Enter accurate account information.','auth.signupButton':'Create Account','auth.fullName':'Full Name','auth.username':'Username','auth.usernameHelp':'Lowercase letters, numbers, . _ -','auth.phone':'Phone','auth.passwordHelp':'At least 8 characters.','auth.confirmPassword':'Confirm Password','auth.accountType':'Account Type','auth.normalAccount':'Normal Account','auth.developerAccount':'Developer Account','auth.developerSignupCode':'Developer Signup Code','auth.developerSignupCodeHelp':'Required only for Developer signup.','auth.haveAccount':'Already have an account?','auth.backToLogin':'Back to Login','auth.forgotTitle':'Forgot Password','auth.forgotDescription':'An approved Developer generates reset codes for this system.','auth.resetTitle':'Reset Password','auth.resetDescription':'Enter target user ID, reset code and new password.','auth.targetUserId':'Target User ID','auth.resetCode':'Reset Code','auth.newPassword':'New Password','auth.resetButton':'Reset Password',
'about.eyebrow':'About','about.title':'SGC SOFT DRINKS MANAGEMENT','about.description':'A centralized management platform for the beverage business.','about.businessTitle':'Business management','about.businessText':'Products, stock, sales, customers, suppliers and finance.','about.rolesTitle':'Role-based access','about.rolesText':'Developer, Owner and Salesman access follows the backend security model.','about.securityTitle':'Security','about.securityText':'Supabase Auth, RPCs and Row Level Security protect business data.',
'features.eyebrow':'Features','features.title':'Everything connected','features.description':'The frontend communicates with the existing Supabase architecture.','features.products.title':'Products','features.products.text':'Manage products and prices.','features.received.title':'Received Stock','features.received.text':'Record supplier deliveries and verification.','features.stock.title':'Stock','features.stock.text':'Monitor current stock.','features.sales.title':'Sales','features.sales.text':'Create sales using controlled prices.','features.customers.title':'Customers','features.customers.text':'Manage customer records.','features.suppliers.title':'Suppliers','features.suppliers.text':'Manage suppliers and purchases.','features.payments.title':'Payments','features.payments.text':'Record customer and supplier payments.','features.expenses.title':'Expenses','features.expenses.text':'Track business expenses.','features.reports.title':'Reports','features.reports.text':'Read reports from actual database data.',
'contact.eyebrow':'Contact','contact.title':'Contact SGC SOFT DRINKS','contact.description':'Use WhatsApp, phone or email for support.','contact.whatsapp1':'WhatsApp 1','contact.whatsapp2':'WhatsApp 2','contact.call1':'Call 1','contact.call2':'Call 2','contact.email':'Email'
};
const SW={...EN,...{'nav.home':'Nyumbani','nav.about':'Kuhusu','nav.features':'Vipengele','nav.contact':'Mawasiliano','nav.login':'Ingia','nav.signup':'Jisajili','nav.dashboard':'Dashibodi','nav.profile':'Wasifu','nav.logout':'Toka','language.label':'Lugha','actions.addProduct':'Ongeza Bidhaa','actions.addCustomer':'Ongeza Mteja','actions.addSupplier':'Ongeza Supplier','actions.addExpense':'Ongeza Gharama','actions.newSale':'Uuzaji Mpya','actions.receiveStock':'Pokea Stock','actions.reload':'Pakia Tena','actions.saveChanges':'Hifadhi Mabadiliko','common.cancel':'Ghairi','common.confirm':'Thibitisha','common.loading':'Inapakia...','confirm.title':'Thibitisha kitendo','confirm.defaultMessage':'Una uhakika unataka kuendelea?','home.title':'Usimamizi wa Kisasa wa SGC SOFT DRINKS','home.description':'Simamia bidhaa, stock, mauzo, wateja, suppliers na fedha za biashara kupitia mfumo mmoja salama.','home.login':'Ingia','home.signup':'Fungua Akaunti','home.quickTitle':'Mfumo mmoja. Udhibiti kamili.','home.quickHeading':'Umejengwa kwa shughuli za kila siku za biashara.','home.roles':'Udhibiti wa majukumu','home.secure':'Database salama','about.eyebrow':'Kuhusu','about.description':'Mfumo wa kati wa kusimamia biashara ya vinywaji.','about.businessTitle':'Usimamizi wa biashara','about.businessText':'Bidhaa, stock, mauzo, wateja, suppliers na fedha.','about.rolesTitle':'Udhibiti wa majukumu','about.rolesText':'Developer, Owner na Salesman hufuata security ya backend.','about.securityTitle':'Usalama','about.securityText':'Supabase Auth, RPC na Row Level Security zinalinda data.','features.eyebrow':'Vipengele','features.title':'Kila kitu kimeunganishwa','features.description':'Frontend inatumia architecture halisi ya Supabase bila kurudia business logic.','features.products.title':'Bidhaa','features.products.text':'Simamia bidhaa na bei.','features.received.title':'Stock Iliyopokelewa','features.received.text':'Rekodi delivery za suppliers na verification.','features.stock.title':'Stock','features.stock.text':'Fuatilia stock iliyopo.','features.sales.title':'Mauzo','features.sales.text':'Fanya mauzo kwa bei zilizodhibitiwa.','features.customers.title':'Wateja','features.customers.text':'Simamia taarifa za wateja.','features.suppliers.title':'Suppliers','features.suppliers.text':'Simamia suppliers na manunuzi.','features.payments.title':'Malipo','features.payments.text':'Rekodi malipo ya wateja na suppliers.','features.expenses.title':'Gharama','features.expenses.text':'Fuatilia gharama za biashara.','features.reports.title':'Ripoti','features.reports.text':'Soma ripoti kutoka database.','contact.eyebrow':'Mawasiliano','contact.title':'Wasiliana na SGC SOFT DRINKS','contact.description':'Tumia WhatsApp, simu au email kwa msaada.','contact.whatsapp1':'WhatsApp 1','contact.whatsapp2':'WhatsApp 2','contact.call1':'Piga Simu 1','contact.call2':'Piga Simu 2','contact.email':'Email'}};

/* RLS: ENABLED (KEEP ENABLED) */

function t(k){

  const dictionary =
    S.lang === 'sw'
      ? SW
      : EN;

  return dictionary[k] || k;
}

 /* RLS: ENABLED (KEEP ENABLED) */

function applyLang(){

  $$('[data-i18n]').forEach(e=>{

    const key =
      e.dataset.i18n;

    const value =
      t(key);


    if(
      e.matches(
        'input,textarea,select'
      )
    ){

      e.placeholder =
        value;

    }else{

      e.textContent =
        value;
    }
  });


  [
    $('language-select'),
    $('topbar-language')
  ]
  .filter(Boolean)
  .forEach(e=>{

    e.value =
      S.lang;
  });


  document.documentElement.lang =
    S.lang === 'sw'
      ? 'sw'
      : 'en';


  localStorage.setItem(
    'sgc.language',
    S.lang
  );


  if(S.user){

    updateChrome();

    renderPage();
  }
}

/* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SUPABASE CLIENT
   ========================================================= */
 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SUPABASE CLIENT
   Primary CDN + fallback CDNs
   ========================================================= */

async function bootSupabase(){

  if(S.sb){
    return S.sb;
  }

  const cdnSources = [
    CFG.cdn,
    'https://esm.sh/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2/+esm'
  ];

  let lastError = null;

  for(const cdn of cdnSources){

    try{

      const m = await import(cdn);

      if(!m?.createClient){
        throw new Error(
          'Supabase createClient was not found.'
        );
      }

      S.sb = m.createClient(
        CFG.url,
        CFG.key,
        {
          auth:{
            persistSession:true,
            autoRefreshToken:true,
            detectSessionInUrl:true
          }
        }
      );

      return S.sb;

    }catch(error){

      lastError = error;

      /* RLS: ENABLED (KEEP ENABLED) */

console.warn(
  'Supabase CDN failed:',
  cdn,
  error
);
    }
  }

  throw new Error(
    'Supabase client could not be loaded. ' +
    'Please check your internet connection or CDN access.'
  );
}

async function ensureSupabaseClient(){

  if(S.sb){
    return S.sb;
  }

  await bootSupabase();

  if(!S.sb){

    throw new Error(
      'Supabase client could not be initialized.'
    );
  }

  return S.sb;
}


/* =========================================================
   LOAD SYSTEM DEFAULT LANGUAGE
   =========================================================
   Priority:
   1. Browser saved language
   2. Database default_language setting
   3. Kiswahili fallback
   ========================================================= */

async function loadSystemDefaultLanguage(){

  /*
   * If the user has already selected a language
   * on this browser, keep that preference.
   */

  const savedLanguage =
    localStorage.getItem(
      'sgc.language'
    );

  if(
    savedLanguage === 'sw' ||
    savedLanguage === 'en'
  ){

    S.lang =
      savedLanguage;

    return;
  }


  /*
   * Make sure Supabase is ready before
   * reading the system language setting.
   */

  try{

    await ensureSupabaseClient();

  }catch(error){

    console.warn(
      'Supabase is not ready for system language:',
      error
    );

    S.lang='sw';

    return;
  }


  try{

    const {
      data,
      error
    } =
      await S.sb
        .from('settings')
        .select('setting_value')
        .eq(
          'setting_key',
          'default_language'
        )
        .maybeSingle();


    if(error){

      console.warn(
        'Unable to load default system language:',
        error
      );

      S.lang='sw';

      return;
    }


    const dbLanguage =
      String(
        data?.setting_value || 'sw'
      )
      .trim()
      .toLowerCase();


    S.lang =
      dbLanguage === 'en'
        ? 'en'
        : 'sw';


    /*
     * Save the resolved language so this browser
     * keeps the selected language on future visits.
     */

    localStorage.setItem(
      'sgc.language',
      S.lang
    );

  }catch(error){

    console.warn(
      'System language loading failed:',
      error
    );

    S.lang='sw';
  }
}


/* =========================================================
   AUTH / USER HELPERS
   ========================================================= */

function jwtPayload(token){

  try{

    return JSON.parse(
      atob(
        token
          .split('.')[1]
          .replace(/-/g,'+')
          .replace(/_/g,'/')
      )
    );

  }catch{

    return null;
  }
}


function authSid(session){

  return jwtPayload(
    session?.access_token || ''
  )?.session_id || null;
}


function initials(n){

  return String(
    n || 'User'
  )
  .trim()
  .split(/\s+/)
  .slice(0,2)
  .map(x=>x[0])
  .join('')
  .toUpperCase() || 'U';
}


/* =========================================================
   PROFILE AVATAR
   ========================================================= */

async function avatar(path){

  if(!path){
    return null;
  }


  /*
   * Direct public/external image URL
   */

  if(
    /^https?:\/\//i.test(path)
  ){

    return path;
  }


  /*
   * Supabase Storage image
   */

  const {
    data
  } =
    await S.sb
      .storage
      .from(CFG.bucket)
      .createSignedUrl(
        path,
        3600
      );


  return data?.signedUrl || null;
}


function setAvatar(
  imgId,
  phId,
  url,
  name
){

  const i=$(imgId);
  const p=$(phId);


  if(!i || !p){
    return;
  }


  if(url){

    i.src=url;
    i.hidden=false;

    p.hidden=true;

  }else{

    i.hidden=true;

    p.hidden=false;

    p.textContent=
      initials(name);
  }
}


/* =========================================================
   LOAD USER PROFILE
   ========================================================= */

async function loadProfile(){

  if(!S.user){
    return null;
  }


  let lastError=null;


  for(
    let attempt=0;
    attempt<4;
    attempt++
  ){

    const {
      data,
      error
    } =
      await S.sb
        .from('profiles')
        .select('*')
        .eq(
          'id',
          S.user.id
        )
        .maybeSingle();


    if(error){

      lastError=error;
      break;
    }


    if(data){

      S.profile=data;
      S.role=
        data.role || null;

      return data;
    }


    await new Promise(
      r =>
        setTimeout(
          r,
          250 * (attempt + 1)
        )
    );
  }


  if(lastError){

    throw lastError;
  }


  throw new Error(
    txt(
      'Profile ya mtumiaji haikupatikana.',
      'User profile was not found.'
    )
  );
}


/* =========================================================
   ACCOUNT APPROVAL
   ========================================================= */

function approved(){

  return !!(
    S.profile?.is_active &&
    S.profile?.account_status === 'approved'
  );
}


/* =========================================================
   PERMISSIONS
   ========================================================= */

async function perm(code){

  /*
   * Owner and Developer have full frontend access.
   * Database RLS remains responsible for backend security.
   */

  if(
    S.role === 'owner' ||
    S.role === 'developer'
  ){

    return true;
  }


  const {
    data,
    error
  } =
    await S.sb.rpc(
      'has_permission',
      {
        p_permission_code:code
      }
    );


  if(error){
    throw error;
  }


  return data === true;
}


/* =========================================================
   UPDATE AUTHENTICATED CHROME
   ========================================================= */

async function updateChrome(){

  /* Hide public Home header when authenticated */

  const publicHeader =
    document.getElementById(
      'site-header'
    );

  if(publicHeader){

    publicHeader.hidden=true;
  }


  /* Hide public footer when authenticated */

  const publicFooter =
    document.getElementById(
      'site-footer'
    );

  if(publicFooter){

    publicFooter.hidden=true;
  }


  const p =
    S.profile || {};


  const name =
    p.full_name ||
    S.user?.email ||
    'User';


  const u =
    p.username ||
    name;


  const url =
    await avatar(
      p.avatar_url
    );


  $('navbar-username') &&
    (
      $('navbar-username').textContent =
        u
    );


  $('navbar-role') &&
    (
      $('navbar-role').textContent =
        p.role || '—'
    );


  $('sidebar-full-name') &&
    (
      $('sidebar-full-name').textContent =
        name
    );


  $('sidebar-user-role') &&
    (
      $('sidebar-user-role').textContent =
        p.role || '—'
    );


  $('topbar-username') &&
    (
      $('topbar-username').textContent =
        u
    );


  setAvatar(
    'navbar-avatar',
    'navbar-avatar-placeholder',
    url,
    name
  );


  setAvatar(
    'sidebar-avatar',
    'sidebar-avatar-placeholder',
    url,
    name
  );


  setAvatar(
    'topbar-avatar',
    'topbar-avatar-placeholder',
    url,
    name
  );


  /*
   * Developer-only elements
   */

  $$(
    '[data-role-only="developer"]'
  )
  .forEach(
    e =>
      e.hidden =
        S.role !== 'developer'
  );


  /*
   * Owner-only pages
   */

  const ownerPages = [
    'received-stock',
    'suppliers',
    'supplier-payments',
    'expenses',
    'audit-logs',
    'settings'
  ];


  $$('[data-dashboard-page]')
  .forEach(e=>{

    if(
      ownerPages.includes(
        e.dataset.dashboardPage
      )
    ){

      e.hidden =
        S.role !== 'owner';
    }
  });


  /*
   * Permission-controlled pages
   */

  const permissionPages = [
    ['sales','sales.view'],
    ['customers','customers.view'],
    ['customer-payments','customer_payments.view'],
    ['stock-adjustments','stock.adjust'],
    ['sales-returns','sales.return']
  ];


  for(
    const [page,code]
    of permissionPages
  ){

    for(
      const e
      of $$(
        `[data-dashboard-page="${page}"][data-permission="${code}"]`
      )
    ){

      e.hidden =
        !(await perm(code));
    }
  }
}


/* =========================================================
   PUBLIC PAGE
   ========================================================= */

function publicPage(p){

  [
    'home',
    'about',
    'features',
    'contact'
  ]
  .forEach(n=>{

    const e=$(
      `page-${n}`
    );

    if(e){

      e.hidden =
        n !== p;
    }
  });


  $('public-content')
    ?.removeAttribute(
      'hidden'
    );


  $('authenticated-app')
    ?.setAttribute(
      'hidden',
      ''
    );


  S.page=p;


  history.replaceState(
    null,
    '',
    '#' + p
  );


  scrollTo(
    0,
    0
  );
}

function jwtPayload(token){try{return JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch{return null}}
function authSid(session){return jwtPayload(session?.access_token||'')?.session_id||null}
function initials(n){return String(n||'User').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'U'}
async function avatar(path){if(!path)return null;if(/^https?:\/\//i.test(path))return path;const{data}=await S.sb.storage.from(CFG.bucket).createSignedUrl(path,3600);return data?.signedUrl||null}
function setAvatar(imgId,phId,url,name){const i=$(imgId),p=$(phId);if(!i||!p)return;if(url){i.src=url;i.hidden=false;p.hidden=true}else{i.hidden=true;p.hidden=false;p.textContent=initials(name)}}
async function loadProfile(){
 if(!S.user)return null;
 let lastError=null;
 for(let attempt=0;attempt<4;attempt++){
   const{data,error}=await S.sb.from('profiles').select('*').eq('id',S.user.id).maybeSingle();
   if(error){lastError=error;break}
   if(data){S.profile=data;S.role=data.role||null;return data}
   await new Promise(r=>setTimeout(r,250*(attempt+1)));
 }
 if(lastError)throw lastError;
 throw new Error(txt('Profile ya mtumiaji haikupatikana.','User profile was not found.'));
}
function approved(){return !!(S.profile?.is_active&&S.profile?.account_status==='approved')}
async function perm(code){if(S.role==='owner'||S.role==='developer')return true;const{data,error}=await S.sb.rpc('has_permission',{p_permission_code:code});if(error)throw error;return data===true}

async function updateChrome(){

  /* Hide public Home header when authenticated */
  const publicHeader = document.getElementById('site-header');
  if(publicHeader){
    publicHeader.hidden = true;
  }

  /* Hide public footer when authenticated */
  const publicFooter = document.getElementById('site-footer');
  if(publicFooter){
    publicFooter.hidden = true;
  }

  const p=S.profile||{},
  name=p.full_name||S.user?.email||'User',
  u=p.username||name,
  url=await avatar(p.avatar_url);
  $('navbar-username')&&($('navbar-username').textContent=u);$('navbar-role')&&($('navbar-role').textContent=p.role||'—');$('sidebar-full-name')&&($('sidebar-full-name').textContent=name);$('sidebar-user-role')&&($('sidebar-user-role').textContent=p.role||'—');$('topbar-username')&&($('topbar-username').textContent=u);setAvatar('navbar-avatar','navbar-avatar-placeholder',url,name);setAvatar('sidebar-avatar','sidebar-avatar-placeholder',url,name);setAvatar('topbar-avatar','topbar-avatar-placeholder',url,name);$$('[data-role-only="developer"]').forEach(e=>e.hidden=S.role!=='developer');const ownerPages=['received-stock','suppliers','supplier-payments','expenses','audit-logs','settings'];$$('[data-dashboard-page]').forEach(e=>{if(ownerPages.includes(e.dataset.dashboardPage))e.hidden=S.role!=='owner'});for(const [p,c] of [['sales','sales.view'],['customers','customers.view'],['customer-payments','customer_payments.view'],['stock-adjustments','stock.adjust'],['sales-returns','sales.return']])for(const e of $$(`[data-dashboard-page="${p}"][data-permission="${c}"]`))e.hidden=!(await perm(c))}

function publicPage(p){
  ['home','about','features','contact'].forEach(n=>{
    const e=$(`page-${n}`);
    if(e)e.hidden=n!==p;
  });

  $('public-content')?.removeAttribute('hidden');
  $('authenticated-app')?.setAttribute('hidden','');

  S.page=p;
  history.replaceState(null,'','#'+p);
  scrollTo(0,0);
}
function nav(p){if(!S.user)return publicPage(['home','about','features','contact'].includes(p)?p:'home');const e=$(`dashboard-page-${p}`);if(!e||e.hidden&&e.dataset.roleOnly==='developer'){toast(txt('Huna ruhusa.','You are not authorized.'),'error');return}S.page=p;$$('.dashboard-page').forEach(x=>x.hidden=x.dataset.dashboardView!==p);$$('[data-dashboard-page]').forEach(x=>x.classList.toggle('active',x.dataset.dashboardPage===p));$('breadcrumb-current')&&($('breadcrumb-current').textContent=e.querySelector('h1')?.textContent||p);renderPage();scrollTo(0,0)}
function table(cols,rows,actions=''){if(!rows?.length)return`<div class="empty-state"><strong>${esc(txt('Hakuna data.','No data found.'))}</strong></div>`;return`<div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${esc(c.label)}</th>`).join('')}${actions?'<th>Actions</th>':''}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c.render?c.render(r):esc(r[c.key])}</td>`).join('')}${actions?`<td><div class="table-actions">${actions(r)}</div></td>`:''}</tr>`).join('')}</tbody></table></div>`}
function badge(v){const x=String(v||'unknown').toLowerCase();let c='badge-info';if(['active','approved','paid','completed','verified'].includes(x))c='badge-success';if(['inactive','rejected','cancelled','blocked','revoked'].includes(x))c='badge-danger';if(['pending','partial','draft'].includes(x))c='badge-warning';return`<span class="badge ${c}">${esc(v||'—')}</span>`}
function host(p){return $(`${p}-module-content`)}

 /* RLS: ENABLED (KEEP ENABLED) */

function loadHost(p){
  if(host(p)){
    host(p).innerHTML=`
      <div class="loading-state">
        <strong>${esc(t('common.loading'))}</strong>
        <div class="skeleton"></div>
      </div>
    `;
  }
}

function toolbar(action,label,search=true){
  return `
    <div class="table-toolbar">

      ${
        search
          ? `
            <div class="search-wrap">
              <span class="search-icon">⌕</span>

              <input
                class="search-input module-search"
                type="search"
                placeholder="${esc(
                  BI('Tafuta...', 'Search...')
                )}"
              >
            </div>
          `
          : ''
      }

      <button
        class="btn btn-secondary btn-sm"
        data-action="reload-page">
        ↻ ${esc(t('actions.reload'))}
      </button>

      ${
        action
          ? `
            <button
              class="btn btn-primary btn-sm"
              data-action="${esc(action)}">
              + ${esc(label)}
            </button>
          `
          : ''
      }

    </div>
  `;
}


/* RLS: ENABLED (KEEP ENABLED) */

/* RLS: ENABLED (KEEP ENABLED) */

async function productForm(p=null){
  if(S.role!=='owner'){
    toast(
      BI('Owner pekee.','Owner/Developer only.'),
      'warning'
    );
    return;
  }

  openForm(
    p
      ? BI('Hariri Bidhaa','Edit Product')
      : BI('Ongeza Bidhaa','Add Product'),

    BI(
      'Jaza taarifa zote za bidhaa.',
      'Enter all product information.'
    ),

    `
    <form id="f-product" class="dynamic-form">

      <div class="form-grid">

        <div class="form-field">
          <label>${BI('Jina la Bidhaa','Product Name')}</label>
          <input
            name="name"
            required
            value="${esc(p?.name||'')}"
          >
        </div>

        <div class="form-field">
          <label>${BI('Brand','Brand')}</label>
          <input
            name="brand"
            value="${esc(p?.brand||'')}"
          >
        </div>

        /* RLS: ENABLED (KEEP ENABLED) */

<div class="form-field">
  <label>${BI('Category','Category')}</label>

  <select name="category">
    <option value="">${esc(BI('Chagua Category','Select Category'))}</option>

    <option value="water" ${p?.category==='water'?'selected':''}>
      WATER
    </option>

    <option value="soda" ${p?.category==='soda'?'selected':''}>
      SODA
    </option>

    <option value="juice" ${p?.category==='juice'?'selected':''}>
      JUICE
    </option>

    <option value="energy_drink" ${p?.category==='energy_drink'?'selected':''}>
      ENERGY DRINK
    </option>

    <option value="other" ${p?.category==='other'?'selected':''}>
      OTHER
    </option>
  </select>
</div>

        <div class="form-field">
          <label>${BI('Bei ya Mauzo','Selling Price')}</label>
          <input
            name="selling_price"
            type="number"
            min="0"
            step="0.01"
            required
            value="${esc(p?.selling_price??0)}"
          >
        </div>

        <div class="form-field">
          <label>${BI('Kiwango cha Chini cha Stock','Low Stock Level')}</label>
          <input
            name="low_stock_level"
            type="number"
            min="0"
            step="0.01"
            required
            value="${esc(p?.low_stock_level??0)}"
          >
        </div>

        <div class="form-field full">
          <label>${BI('Image URL','Image URL')}</label>
          <input
            name="image_url"
            type="url"
            placeholder="https://..."
            value="${esc(p?.image_url||'')}"
          >
        </div>

        <div class="form-field full">
          <label>${BI('Maelezo','Notes')}</label>
          <textarea
            name="notes"
            rows="4"
          >${esc(p?.notes||'')}</textarea>
        </div>

      </div>

      <div class="form-actions">

        <button
          type="button"
          class="btn btn-secondary"
          data-action="close-form-modal">
          ${esc(BI('Ghairi','Cancel'))}
        </button>

        <button
          type="submit"
          class="btn btn-primary">
          ${esc(BI('Hifadhi','Save'))}
        </button>

      </div>

    </form>
    `
  );

  $('f-product').onsubmit=async e=>{
    e.preventDefault();

    const b=e.target.querySelector(
      'button[type="submit"]'
    );

    const d=Object.fromEntries(
      new FormData(e.target)
    );

    busy(b,true);

    try{

      const r=p

        ? await S.sb.rpc(
            'update_product_full',
            {
              p_product_id:p.id,
              p_name:q(d.name),
              p_selling_price:num(d.selling_price),
              p_low_stock_level:num(d.low_stock_level),
              p_brand:q(d.brand)||null,
              p_category:q(d.category)||null,
              p_image_url:q(d.image_url)||null,
              p_notes:q(d.notes)||null
            }
          )

        : await S.sb.rpc(
            'create_product_full',
            {
              p_name:q(d.name),
              p_selling_price:num(d.selling_price),
              p_low_stock_level:num(d.low_stock_level),
              p_brand:q(d.brand)||null,
              p_category:q(d.category)||null,
              p_image_url:q(d.image_url)||null,
              p_notes:q(d.notes)||null
            }
          );

      if(r.error) throw r.error;

      modal('form-modal',false);

      toast(
        BI(
          'Bidhaa imehifadhiwa.',
          'Product saved.'
        ),
        'success'
      );

      await productsFinal();

    }catch(x){

      important(err(x));

    }finally{

      busy(b,false);

    }
  };
}

async function editProduct(id){
  const {data,error}=await S.sb.rpc('get_products_for_owner');
  if(error) throw error;

  const p=(data||[]).find(x=>x.id===id);
  if(!p) throw Error('Product not found');

  return productForm(p);
}

/* RLS: ENABLED (KEEP ENABLED) */

async function editVariant(id){
  if(S.role!=='owner'){
    toast(
      BI('Owner pekee.','Owner/Developer only.'),
      'warning'
    );
    return;
  }

  /*
   * Read variant through Supabase RPC.
   * Do NOT query product_variants directly.
   */
  const {data:rows,error}=await S.sb.rpc(
    'get_product_variants',
    {
      p_product_id:null
    }
  );

  if(error) throw error;

  const v=(rows||[]).find(x=>x.id===id);

  if(!v){
    throw Error(
      BI('Variant haikupatikana.','Variant not found.')
    );
  }

  return openVariantForm(
    v.product_id,
    v.id
  );
}
async function customerForm(c=null){openForm(c?txt('Hariri Mteja','Edit Customer'):t('actions.addCustomer'),'Customer information',`<form id="f-customer" class="dynamic-form"><div class="form-grid"><div class="form-field"><label>Name</label><input name="name" required value="${esc(c?.name||'')}"></div><div class="form-field"><label>Phone</label><input name="phone" type="tel" value="${esc(c?.phone||'')}"></div><div class="form-field full"><label>Address</label><textarea name="address">${esc(c?.address||'')}</textarea></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(t('common.confirm'))}</button></div></form>`);$('f-customer').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=c?await S.sb.rpc('update_customer',{p_customer_id:c.customer_id,p_name:d.name.trim(),p_phone:d.phone.trim()||null,p_address:d.address.trim()||null}):await S.sb.rpc('create_customer',{p_name:d.name.trim(),p_phone:d.phone.trim()||null,p_address:d.address.trim()||null});if(r.error)throw r.error;modal('form-modal',false);toast(txt('Mteja amehifadhiwa.','Customer saved.'),'success');await customers()}catch(x){important(err(x))}finally{busy(b,false)}}}
async function viewCustomer(id){const[a,b,c]=await Promise.all([S.sb.rpc('get_customer_credit_summary',{p_customer_id:id}),S.sb.rpc('get_customer_sales_history',{p_customer_id:id}),S.sb.rpc('get_customer_payment_history',{p_customer_id:id})]);if(a.error)throw a.error;if(b.error)throw b.error;if(c.error)throw c.error;const x=a.data?.[0]||{};openDetail(txt('Customer Details','Customer Details'),x.customer_name||'',`<div class="info-list"><div class="info-row"><span class="info-label">Total Sales</span><strong class="info-value">${esc(money(x.total_sales))}</strong></div><div class="info-row"><span class="info-label">Total Paid</span><strong class="info-value">${esc(money(x.total_paid))}</strong></div><div class="info-row"><span class="info-label">Balance</span><strong class="info-value">${esc(money(x.total_balance))}</strong></div></div><h3>Sales History</h3>${table([{key:'receipt_no',label:'Receipt'},{key:'total_amount',label:'Total',render:r=>esc(money(r.total_amount))},{key:'paid_amount',label:'Paid',render:r=>esc(money(r.paid_amount))},{key:'balance',label:'Balance',render:r=>esc(money(r.balance))},{key:'payment_status',label:'Payment',render:r=>badge(r.payment_status)}],b.data||[])}<h3>Payment History</h3>${table([{key:'receipt_no',label:'Receipt'},{key:'amount',label:'Amount',render:r=>esc(money(r.amount))},{key:'payment_method',label:'Method'},{key:'created_at',label:'Date',render:r=>esc(date(r.created_at))}],c.data||[])}`)}
async function supplierForm(s=null){openForm(s?txt('Hariri Supplier','Edit Supplier'):t('actions.addSupplier'),'Supplier information',`<form id="f-supplier" class="dynamic-form"><div class="form-grid"><div class="form-field"><label>Name</label><input name="name" required value="${esc(s?.name||'')}"></div><div class="form-field"><label>Phone</label><input name="phone" type="tel" value="${esc(s?.phone||'')}"></div><div class="form-field"><label>Contact Person</label><input name="contact_person" value="${esc(s?.contact_person||'')}"></div><div class="form-field"><label>Address</label><input name="address" value="${esc(s?.address||'')}"></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(t('common.confirm'))}</button></div></form>`);$('f-supplier').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=s?await S.sb.rpc('update_supplier',{p_supplier_id:s.id,p_name:d.name.trim(),p_phone:d.phone.trim()||null,p_address:d.address.trim()||null,p_contact_person:d.contact_person.trim()||null}):await S.sb.rpc('create_supplier',{p_name:d.name.trim(),p_phone:d.phone.trim()||null,p_address:d.address.trim()||null,p_contact_person:d.contact_person.trim()||null});if(r.error)throw r.error;modal('form-modal',false);toast(txt('Supplier amehifadhiwa.','Supplier saved.'),'success');await suppliers()}catch(x){important(err(x))}finally{busy(b,false)}}}
async function viewSupplier(id){const[a,b,c]=await Promise.all([S.sb.rpc('get_supplier_balance',{p_supplier_id:id}),S.sb.rpc('get_supplier_purchase_history',{p_supplier_id:id}),S.sb.rpc('get_supplier_payment_history',{p_supplier_id:id})]);if(a.error)throw a.error;if(b.error)throw b.error;if(c.error)throw c.error;const x=a.data?.[0]||{};openDetail(txt('Supplier Details','Supplier Details'),x.supplier_name||'',`<div class="info-list"><div class="info-row"><span class="info-label">Purchases</span><strong class="info-value">${esc(money(x.total_purchases))}</strong></div><div class="info-row"><span class="info-label">Paid</span><strong class="info-value">${esc(money(x.total_paid))}</strong></div><div class="info-row"><span class="info-label">Outstanding</span><strong class="info-value">${esc(money(x.outstanding_balance))}</strong></div></div><h3>Purchase History</h3>${table([{key:'invoice_receipt_no',label:'Invoice'},{key:'total_amount',label:'Total',render:r=>esc(money(r.total_amount))},{key:'outstanding_balance',label:'Outstanding',render:r=>esc(money(r.outstanding_balance))},{key:'verification_status',label:'Verification',render:r=>badge(r.verification_status)}],b.data||[])}<h3>Payment History</h3>${table([{key:'invoice_receipt_no',label:'Invoice'},{key:'amount',label:'Amount',render:r=>esc(money(r.amount))},{key:'payment_method',label:'Method'},{key:'created_at',label:'Date',render:r=>esc(date(r.created_at))}],c.data||[])}`)}

async function viewSale(id){
  const{data,error}=await S.sb.rpc('get_sale_details',{p_sale_id:id});
  if(error)throw error;
  const x=data?.[0]||{};openDetail('Sale Details',x.receipt_no||'',`
    <div class="info-list"><div class="info-row"><span class="info-label">Customer</span><strong class="info-value">${esc(x.customer_name||'—')
  }</strong></div><div class="info-row"><span class="info-label">Total</span>
    <strong class="info-value">${esc(money(x.total_amount))}</strong></div><div class="info-row">
    <span class="info-label">Paid</span><strong class="info-value">${esc(money(x.paid_amount))
    }</strong></div><div class="info-row"><span class="info-label">Balance</span><strong class="info-value">
      ${esc(money(x.balance))}</strong></div></div>${table([{key:'product_name',label:'Product'
      },{key:'quantity',label:'Qty'},{key:'selling_price',label:'Price',render:r=>esc(money(r.selling_price))
      },{key:'line_total',label:'Total',render:r=>esc(money(r.line_total))}],data||[])}`)}
  

/* CUSTOMER SALES RECEIPT — HTML PREVIEW */

function buildSalesReceipt(rows) {
  const x = rows?.[0];

  if (!x) {
    throw new Error(
      BI(
        'Taarifa za risiti hazipatikani.',
        'Receipt details are unavailable.'
      )
    );
  }

  /* Company logo: IMAGE 1 */
  const logoUrl =
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRsGllLOBF63Unp0kzICif6C1tapkNBLRntsN7FJJPLlytEa9m1uBi_CdMVtnA7HmE1niKAeRc7FaKka9HamTfaSy4Mp5V8jnfl0DJt12zb4S4WhtI3PSJH9mHkxhu65YXSVA7sD5b8sOfw8jakPYp3H8Um8qvyjlDzxWgNcdsH2qVTmnMbjsZF4TN/s1280/244759.png';

  /* Beverage banner: IMAGE 2 */
const beverageUrl =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrIHIgcB5CCRD_5TFwnNxBnbE9BDFZ0U9gTwwhaQO6UPceU06eIKv9n0gZRg0r1gXwBb2-W49WpCu1VtBI-tVxmaqjc4AiKgBX6RwHQy_zOvOrGDQ_624UOfko_f7WDvjZnELBEa2Ksxd1cKxoR3wxi9saD8AUWEjkteGTQyowfeIji8oq9l2OeEI5/s1536/271670.png';

  const items = rows.map((r, index) => `
    <tr>
      <td class="sr-item-number">${index + 1}</td>
      <td class="sr-item-name">${esc(r.product_name || '—')}</td>
      <td class="sr-item-qty">${esc(r.quantity ?? '')}</td>
      <td class="sr-item-price">${esc(money(r.selling_price))}</td>
      <td class="sr-item-total">${esc(money(r.line_total))}</td>
    </tr>
  `).join('');

  const customerName =
    x.customer_name ||
    BI('Mteja wa Cash', 'Cash Customer');

  const saleDate =
    x.sale_created_at
      ? date(x.sale_created_at)
      : '—';

  const salesmanName =
    x.salesman_name || '—';

  return `
    <article class="sales-receipt" id="sales-receipt">

      <!-- BRAND HEADER -->
      <header class="sales-receipt-header">

        <div class="sr-brand-logo">
          <img
            src="${logoUrl}"
            alt="SGC SOFT DRINKS Logo"
          >
        </div>

        <h2>SGC SOFT DRINKS</h2>

        <p class="sr-slogan">
          Driven By Quality Built On Trust
        </p>

        <div class="sr-title">
          <span>${BI('RISITI YA MAUZO', 'SALES RECEIPT')}</span>
        </div>

        <div class="sr-receipt-number">
          <small>${BI('Namba ya Risiti', 'Receipt Number')}</small>
          <strong>${esc(x.receipt_no || '—')}</strong>
        </div>

      </header>

      <!-- BEVERAGE IMAGE -->
      <div class="sr-beverage-banner">
        <img
          src="${beverageUrl}"
          alt="SGC SOFT DRINKS Beverages"
        >
      </div>

      <!-- SALE INFORMATION -->
      <section class="sales-receipt-meta">

        <div class="sr-meta-row">
          <span>${BI('Mteja', 'Customer')}</span>
          <strong>${esc(customerName)}</strong>
        </div>

        <div class="sr-meta-row">
          <span>${BI('Tarehe', 'Date')}</span>
          <strong>${esc(saleDate)}</strong>
        </div>

        <div class="sr-meta-row">
          <span>${BI('Muuzaji', 'Salesman')}</span>
          <strong>${esc(salesmanName)}</strong>
        </div>

        <div class="sr-meta-row">
          <span>${BI('Njia ya Malipo', 'Payment Method')}</span>
          <strong>${esc(x.payment_method || '—')}</strong>
        </div>

        <div class="sr-meta-row">
          <span>${BI('Hali ya Malipo', 'Payment Status')}</span>
          <strong>${esc(x.payment_status || '—')}</strong>
        </div>

        <div class="sr-meta-row">
          <span>${BI('Hali ya Mauzo', 'Sale Status')}</span>
          <strong>${esc(x.sale_status || '—')}</strong>
        </div>

      </section>

      <!-- SOLD ITEMS -->
      <div class="sr-items-heading">
        ${BI('BIDHAA ZILIZONUNULIWA', 'PURCHASED ITEMS')}
      </div>

      <table class="sales-receipt-table">

        <thead>
          <tr>
            <th>#</th>
            <th>${BI('Bidhaa', 'Product')}</th>
            <th>${BI('Idadi', 'Qty')}</th>
            <th>${BI('Bei', 'Price')}</th>
            <th>${BI('Jumla', 'Total')}</th>
          </tr>
        </thead>

        <tbody>
          ${items}
        </tbody>

      </table>

      <!-- PAYMENT SUMMARY -->
      <section class="sales-receipt-totals">

        <div class="sr-total-row sr-grand-total">
          <span>${BI('JUMLA YA MAUZO', 'SALE TOTAL')}</span>
          <strong>${esc(money(x.total_amount))}</strong>
        </div>

        <div class="sr-total-row">
          <span>${BI('Amelipa', 'Paid')}</span>
          <strong>${esc(money(x.paid_amount))}</strong>
        </div>

        <div class="sr-total-row sr-balance">
          <span>${BI('Salio', 'Balance')}</span>
          <strong>${esc(money(x.balance))}</strong>
        </div>

      </section>

     
        <strong>
          ${BI('Asante kwa kufanya biashara nasi!', 'Thank you for doing business with us!')}
        </strong>

        <p>SGC SOFT DRINKS</p>

        <small>Driven By Quality Built On Trust</small>


<!-- SGC SOFT DRINKS CONTACT FOOTER -->
<footer class="sgc-receipt-footer">
  <div class="sgc-footer-item sgc-footer-call">
    <span class="sgc-footer-icon" aria-hidden="true">☎</span>
    <div class="sgc-footer-text">
      <a href="tel:+255638127127">+255 638 127 127</a>
      <small>Call Us</small>
    </div>
  </div>

  <div class="sgc-footer-item sgc-footer-whatsapp">
    <span class="sgc-footer-icon" aria-hidden="true">◉</span>
    <div class="sgc-footer-text">
      <a href="https://wa.me/255658542607" target="_blank"
         rel="noopener noreferrer">+255 658 542 607</a>
      <small>WhatsApp</small>
    </div>
  </div>

  <div class="sgc-footer-item sgc-footer-email">
    <span class="sgc-footer-icon" aria-hidden="true">✉</span>
    <div class="sgc-footer-text">
      <a href="mailto:sgcsoftdrinks@gmail.com">
        sgcsoftdrinks@gmail.com
      </a>
      <small>Email</small>
    </div>
  </div>

  <div class="sgc-footer-item sgc-footer-location">
    <span class="sgc-footer-icon" aria-hidden="true">📍</span>
    <div class="sgc-footer-text">
      <strong>Goba - Kontena</strong>
      <small>Location</small>
    </div>
  </div>
</footer>

    </article>
  `;
}


async function openSalesReceipt(id) {
  const { data, error } = await S.sb.rpc(
    'get_sale_details',
    { p_sale_id: id }
  );

  if (error) throw error;

  const rows = data || [];

  if (!rows.length) {
    throw new Error(
      BI('Risiti haijapatikana.',
         'Receipt not found.')
    );
  }

  openDetail(
    BI('Risiti ya Mauzo','Sales Receipt'),
    rows[0].receipt_no || '',
    `
      <div class="receipt-actions">
        <button class="btn btn-primary"
                type="button"
                data-action="print-sales-receipt">
          ${BI('Chapisha','Print')}
        </button>

        <button class="btn btn-secondary"
                type="button"
                data-action="download-sales-receipt">
          ${BI('Pakua','Download')}
        </button>

        <button class="btn btn-secondary"
                type="button"
                data-action="share-sales-receipt">
          ${BI('Shiriki','Share')}
        </button>
      </div>

      ${buildSalesReceipt(rows)}
    `
  );
}


function getSalesReceiptHTML() {
  const receipt = document.getElementById('sales-receipt');

  if (!receipt) {
    throw new Error(
      BI('Risiti haijafunguliwa.', 'Receipt is not open.')
    );
  }

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]')
  ).map(el => el.outerHTML).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SGC Sales Receipt</title>
  
  ${styles}
  <style>

/* =========================================================
   SGC SOFT DRINKS — A6 SALES RECEIPT
   SIZE: 105mm × 148mm
   ========================================================= */

#sales-receipt.sales-receipt {
  width: 105mm !important;
  max-width: 105mm !important;
  min-width: 105mm !important;

  min-height: 148mm;

  margin: 0 auto !important;
  padding: 0 !important;

  overflow: hidden;

  background: #ffffff !important;
  color: #10243a !important;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 8.5px;
  line-height: 1.25;

  border: 1px solid #c9d8e5;
  border-radius: 3px;

  box-shadow: 0 8px 25px rgba(0,0,0,.15);

  box-sizing: border-box;
}


/* =========================================================
   IMPORTANT — EVERYTHING INSIDE RECEIPT
   ========================================================= */

#sales-receipt.sales-receipt *,
#sales-receipt.sales-receipt *::before,
#sales-receipt.sales-receipt *::after {
  box-sizing: border-box;
}


/* =========================================================
   RECEIPT HEADER
   Logo + company + title + receipt number
   ========================================================= */

#sales-receipt .sales-receipt-header {
  width: 100% !important;

  display: grid !important;

  grid-template-columns:
    25mm
    1fr
    28mm;

  grid-template-rows:
    auto
    auto
    auto;

  column-gap: 3mm;

  align-items: center;

  min-height: 27mm !important;

  margin: 0 !important;
  padding: 4mm 4mm 3mm !important;

  background:
    linear-gradient(
      135deg,
      #03294b,
      #063968,
      #07518a
    ) !important;

  color: #ffffff !important;

  border: 0 !important;
  border-bottom: 1.2mm solid #ffbd19 !important;

  border-radius: 0 !important;
}


/* =========================================================
   LOGO
   ========================================================= */

#sales-receipt .sr-brand-logo {
  grid-column: 1;
  grid-row: 1 / span 3;

  width: 25mm !important;
  height: 19mm !important;

  display: flex !important;

  align-items: center;
  justify-content: center;

  overflow: hidden;
}


#sales-receipt .sr-brand-logo img {
  display: block !important;

  width: 24mm !important;
  height: 18mm !important;

  max-width: 24mm !important;
  max-height: 18mm !important;

  object-fit: contain !important;

  object-position: center !important;
}


/* =========================================================
   COMPANY NAME
   ========================================================= */

#sales-receipt .sales-receipt-header h2 {
  grid-column: 2;
  grid-row: 1;

  margin: 0 !important;
  padding: 0 !important;

  color: #ffbd19 !important;

  font-size: 11px !important;
  line-height: 1.1 !important;

  font-weight: 900 !important;

  letter-spacing: .8px;

  text-align: center;
}


/* =========================================================
   SLOGAN
   ========================================================= */

#sales-receipt .sales-receipt-header .sr-slogan {
  grid-column: 2;
  grid-row: 2;

  margin: 1mm 0 0 !important;
  padding: 0 !important;

  color: #ffffff !important;

  font-size: 6.5px !important;

  line-height: 1.15 !important;

  text-align: center;

  white-space: nowrap;
}


/* =========================================================
   SALES RECEIPT TITLE
   ========================================================= */

#sales-receipt .sales-receipt-header .sr-title {
  grid-column: 2;
  grid-row: 3;

  margin-top: 1.5mm;

  text-align: center;
}


#sales-receipt .sales-receipt-header .sr-title span {
  display: inline-block;

  padding: 1.2mm 2.5mm;

  color: #03294b !important;

  background: #ffbd19;

  border-radius: 2px;

  font-size: 7px;

  font-weight: 900;

  letter-spacing: .3px;
}


/* =========================================================
   RECEIPT NUMBER
   ========================================================= */

#sales-receipt .sr-receipt-number {
  grid-column: 3;
  grid-row: 1 / span 3;

  display: flex;

  flex-direction: column;

  align-items: flex-end;
  justify-content: center;

  min-width: 0;

  text-align: right;
}


#sales-receipt .sr-receipt-number small {
  display: block;

  margin-bottom: 1mm;

  color: #dceeff !important;

  font-size: 5.5px !important;

  line-height: 1.1;
}


#sales-receipt .sr-receipt-number strong {
  display: block;

  max-width: 28mm;

  padding: 1.2mm 1.5mm;

  color: #ffbd19 !important;

  background: rgba(0,0,0,.25) !important;

  border: 1px solid rgba(255,189,25,.55);

  border-radius: 2px;

  font-size: 6.5px !important;

  line-height: 1.15;

  overflow-wrap: anywhere;

  text-align: center;
}


/* =========================================================
   BEVERAGE IMAGE
   SMALL A6 BANNER
   ========================================================= */

#sales-receipt .sr-beverage-banner {
  width: 100% !important;

  height: 20mm !important;

  max-height: 20mm !important;

  margin: 0 !important;
  padding: 0 !important;

  overflow: hidden !important;

  background: #eef8ff;

  border-bottom: 1px solid #d6e6f2;
}


#sales-receipt .sr-beverage-banner img {
  display: block !important;

  width: 100% !important;
  height: 20mm !important;

  max-width: 100% !important;
  max-height: 20mm !important;

  margin: 0 !important;
  padding: 0 !important;

  object-fit: cover !important;

  object-position: center !important;
}


/* =========================================================
   SALE INFORMATION
   ========================================================= */

#sales-receipt .sales-receipt-meta {
  display: grid !important;

  grid-template-columns: 1fr 1fr;

  gap: 0;

  width: 100%;

  margin: 0 !important;
  padding: 2.5mm 4mm !important;

  background: #ffffff !important;

  border: 0 !important;
}


/* Each information row */

#sales-receipt .sr-meta-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  min-width: 0;

  min-height: 5.5mm;

  padding: 1mm 1.5mm;

  border-bottom: 1px solid #e1eaf1;

  gap: 2mm;
}


#sales-receipt .sr-meta-row:nth-child(odd) {
  border-right: 1px solid #dce6ee;
}


#sales-receipt .sr-meta-row span {
  color: #49647b !important;

  font-size: 6.5px !important;

  font-weight: 600;

  white-space: nowrap;
}


#sales-receipt .sr-meta-row strong {
  color: #063968 !important;

  font-size: 6.5px !important;

  font-weight: 800;

  text-align: right;

  overflow-wrap: anywhere;
}


/* =========================================================
   PURCHASED ITEMS TITLE
   ========================================================= */

#sales-receipt .sr-items-heading {
  margin: 1mm 4mm 1.5mm !important;

  padding: 1.5mm 2mm;

  color: #ffffff !important;

  background: #063968 !important;

  border-left: 1mm solid #ffbd19;

  border-radius: 2px;

  font-size: 7px !important;

  font-weight: 900;

  letter-spacing: .3px;
}


/* =========================================================
   PRODUCT TABLE
   ========================================================= */

#sales-receipt .sales-receipt-table {
  width: calc(100% - 8mm) !important;

  margin: 0 4mm 2.5mm !important;

  border-collapse: separate !important;
  border-spacing: 0 !important;

  table-layout: fixed;

  background: #ffffff !important;

  border: 1px solid #cbddeb;

  border-radius: 2.5mm;

  overflow: hidden;
}


/* Column widths */

#sales-receipt .sales-receipt-table th:nth-child(1),
#sales-receipt .sales-receipt-table td:nth-child(1) {
  width: 7mm;
}

#sales-receipt .sales-receipt-table th:nth-child(2),
#sales-receipt .sales-receipt-table td:nth-child(2) {
  width: 34mm;
}

#sales-receipt .sales-receipt-table th:nth-child(3),
#sales-receipt .sales-receipt-table td:nth-child(3) {
  width: 12mm;
}

#sales-receipt .sales-receipt-table th:nth-child(4),
#sales-receipt .sales-receipt-table td:nth-child(4) {
  width: 20mm;
}

#sales-receipt .sales-receipt-table th:nth-child(5),
#sales-receipt .sales-receipt-table td:nth-child(5) {
  width: 24mm;
}


/* Table header */

#sales-receipt .sales-receipt-table thead {
  background: #063968 !important;
}


#sales-receipt .sales-receipt-table th {
  height: 7mm;

  padding: 1.5mm 1mm !important;

  color: #ffffff !important;

  background: #063968 !important;

  border-right: 1px solid #2e668e;
  border-bottom: 1mm solid #ffbd19;

  font-size: 6.5px !important;

  font-weight: 900;

  text-align: center;
}


/* Table cells */

#sales-receipt .sales-receipt-table td {
  height: 6.5mm;

  padding: 1.3mm 1mm !important;

  color: #172b3f !important;

  background: #ffffff !important;

  border-right: 1px solid #d9e5ee;

  border-bottom: 1px solid #d9e5ee;

  font-size: 6.5px !important;

  line-height: 1.2;

  vertical-align: middle;

  overflow-wrap: anywhere;
}


#sales-receipt .sales-receipt-table tbody tr:nth-child(even) td {
  background: #f3f8fc !important;
}


/* Center numerical columns */

#sales-receipt .sr-item-number,
#sales-receipt .sr-item-qty {
  text-align: center !important;
}


/* Price / total */

#sales-receipt .sr-item-price,
#sales-receipt .sr-item-total {
  text-align: right !important;
  white-space: nowrap;
}


/* =========================================================
   TOTALS
   ========================================================= */

#sales-receipt .sales-receipt-totals {
  width: calc(100% - 8mm);

  margin: 0 4mm 2.5mm !important;

  padding: 2mm 3mm !important;

  background: #edf7ff !important;

  border: 1px solid #d7e9f6;

  border-radius: 2.5mm;
}


#sales-receipt .sr-total-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 5.5mm;

  padding: 1mm 0;

  color: #24445e !important;

  border-bottom: 1px solid #d5e5f1;

  font-size: 7px !important;
}


#sales-receipt .sr-total-row:last-child {
  border-bottom: 0;
}


#sales-receipt .sr-total-row span {
  font-weight: 700;

  color: #38566e !important;
}


#sales-receipt .sr-total-row strong {
  color: #063968 !important;

  font-size: 7.5px !important;

  font-weight: 900;
}


/* Grand total */

#sales-receipt .sr-grand-total {
  color: #063968 !important;
}


#sales-receipt .sr-grand-total span,
#sales-receipt .sr-grand-total strong {
  color: #063968 !important;

  font-size: 8px !important;

  font-weight: 900;
}


/* Balance */

#sales-receipt .sr-balance {
  color: #b57900 !important;
}


#sales-receipt .sr-balance strong {
  color: #b57900 !important;
}


/* =========================================================
   THANK YOU / BRAND FOOTER TEXT
   ========================================================= */

#sales-receipt > article > strong,
#sales-receipt > strong {
  display: block;

  margin: 1.5mm 4mm 0;

  color: #063968 !important;

  font-size: 7.5px !important;

  text-align: center;

  font-weight: 900;
}


#sales-receipt > article > p,
#sales-receipt > p {
  margin: 1mm 4mm 0;

  color: #063968 !important;

  font-size: 7px !important;

  text-align: center;

  font-weight: 800;
}


#sales-receipt > article > small,
#sales-receipt > small {
  display: block;

  margin: .5mm 4mm 2mm;

  color: #49647b !important;

  font-size: 5.8px !important;

  text-align: center;
}


/* =========================================================
   CONTACT FOOTER
   ========================================================= */

#sales-receipt .sgc-receipt-footer {
  display: grid !important;

  grid-template-columns: repeat(2, 1fr);

  gap: 0;

  width: 100%;

  margin: 2mm 0 0 !important;

  padding: 2.5mm 3mm !important;

  color: #ffffff !important;

  background: #063968 !important;

  border-top: 1mm solid #ffbd19;

  border-radius: 0 !important;
}


#sales-receipt .sgc-footer-item {
  display: flex;

  align-items: center;

  gap: 1.5mm;

  min-width: 0;

  padding: 1.5mm 2mm;

  color: #ffffff !important;

  border-right: 1px solid rgba(255,255,255,.25);
}


#sales-receipt .sgc-footer-item:nth-child(2n) {
  border-right: 0;
}


#sales-receipt .sgc-footer-icon {
  flex: 0 0 6mm;

  width: 6mm;
  height: 6mm;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #063968 !important;

  background: #ffbd19 !important;

  border-radius: 50%;

  font-size: 8px !important;

  font-weight: 900;
}


#sales-receipt .sgc-footer-text {
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: .5mm;
}


#sales-receipt .sgc-footer-text a,
#sales-receipt .sgc-footer-text strong {
  color: #ffffff !important;

  font-size: 5.5px !important;

  line-height: 1.1;

  font-weight: 800;

  text-decoration: none;

  overflow-wrap: anywhere;
}


#sales-receipt .sgc-footer-text small {
  color: #dceeff !important;

  font-size: 4.8px !important;

  line-height: 1;
}


/* =========================================================
   PRINT — REAL A6 PAPER
   ========================================================= */

@media print {

  @page {
    size: A6 portrait;

    margin: 0;
  }


  html,
  body {
    width: 105mm !important;
    min-width: 105mm !important;

    margin: 0 !important;
    padding: 0 !important;

    background: #ffffff !important;

    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }


  #sales-receipt.sales-receipt {
    width: 105mm !important;
    max-width: 105mm !important;
    min-width: 105mm !important;

    min-height: 148mm;

    margin: 0 !important;
    padding: 0 !important;

    border: 0 !important;
    border-radius: 0 !important;

    box-shadow: none !important;

    overflow: hidden !important;
  }


  /* Hide application controls */

  .receipt-actions,
  #sales-receipt .receipt-actions {
    display: none !important;
  }


  /* Preserve colours */

  #sales-receipt .sales-receipt-header,
  #sales-receipt .sales-receipt-table thead,
  #sales-receipt .sgc-receipt-footer {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }


  /* Prevent rows from splitting */

  #sales-receipt .sales-receipt-table tr,
  #sales-receipt .sales-receipt-totals,
  #sales-receipt .sgc-receipt-footer {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}


/* =========================================================
   SCREEN PREVIEW
   ========================================================= */

@media screen {

  #sales-receipt.sales-receipt {
    margin: 10px auto !important;
  }
}


/* =========================================================
   SMALL SCREENS
   ========================================================= */

@media screen and (max-width: 500px) {

  #sales-receipt.sales-receipt {
    transform-origin: top center;
  }

}

  </style>
</head>
<body>
  ${receipt.outerHTML}
</body>
</html>`;
}

function printSalesReceipt() {
  const html = getSalesReceiptHTML();
  const win = window.open('', '_blank');

  if (!win) {
    throw new Error(
      BI(
        'Ruhusu pop-up kwenye browser ili kuchapisha.',
        'Allow browser pop-ups to print the receipt.'
      )
    );
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();

  win.onload = () => {
    win.print();
  };
}

function downloadSalesReceipt() {
  const html = getSalesReceiptHTML();
  const receipt = document.getElementById('sales-receipt');
  const receiptNo = receipt
    ?.querySelector('.sales-receipt-header strong')
    ?.textContent
    ?.trim() || 'sales-receipt';

  const blob = new Blob([html], {
    type: 'text/html;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${receiptNo.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareSalesReceipt() {
  const receipt = document.getElementById('sales-receipt');

  if (!receipt) {
    throw new Error(
      BI('Risiti haijafunguliwa.', 'Receipt is not open.')
    );
  }

  const text = receipt.innerText;

  if (navigator.share) {
    await navigator.share({
      title: BI('Risiti ya Mauzo', 'Sales Receipt'),
      text
    });
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);

    toast(
      BI(
        'Maandishi ya risiti yamenakiliwa.',
        'Receipt text copied.'
      ),
      'success'
    );
    return;
  }

  throw new Error(
    BI(
      'Browser hii haiungi mkono kushiriki au kunakili.',
      'This browser does not support sharing or clipboard access.'
    )
  );
}


async function rejectReceipt(id){const reason=prompt(txt('Sababu ya rejection:','Rejection reason:'));if(!reason?.trim())return;const{error}=await S.sb.rpc('reject_stock_receipt',{p_stock_receipt_id:id,p_reason:reason.trim()});if(error)throw error;toast(txt('Receipt imekataliwa.','Receipt rejected.'),'success');await received()}

/* RLS: ENABLED (KEEP ENABLED) */

/* RLS: ENABLED (KEEP ENABLED) */

/* RLS: ENABLED (KEEP ENABLED) */

async function viewReceipt(id){
  const [a,b,p,v]=await Promise.all([

    S.sb
      .from('stock_receipts')
      .select(`
        id,
        invoice_receipt_no,
        supplier_id,
        received_by,
        verified_by,
        payment_reference,
        verification_status,
        total_amount,
        notes,
        received_at,
        verified_at,
        created_at,
        updated_at,
        suppliers(name),
        received_profile:profiles!stock_receipts_received_by_fkey(full_name),
        verified_profile:profiles!stock_receipts_verified_by_fkey(full_name)
      `)
      .eq('id',id)
      .maybeSingle(),

    S.sb
      .from('stock_receipt_items')
      .select(`
        id,
        product_id,
        variant_id,
        packaging,
        quantity,
        unit_cost,
        total_cost
      `)
      .eq('stock_receipt_id',id),

    S.sb.rpc(
      'get_products_for_owner'
    ),

    S.sb.rpc(
      'get_product_variants',
      {
        p_product_id:null
      }
    )

  ]);

if(a.error)throw a.error;
if(b.error)throw b.error;
if(p.error)throw p.error;
if(v.error)throw v.error;

const receipt = a.data;

if(!receipt){
  throw new Error(
    BI('Stock receipt haijapatikana.','Stock receipt not found.')
  );
}

const productMap=new Map(
  (p.data||[]).map(x=>[
    x.id,
    x
  ])
);

const variantMap=new Map(
  (v.data||[]).map(x=>[
    x.id,
    x
  ])
);

const items=(b.data||[]).map(r=>({
  ...r,
  product_variants:
    variantMap.get(r.variant_id) || null
}));

  const receivedName=
    receipt.received_profile?.full_name ||
    receipt.received_by ||
    '—';

  const verifiedName=
    receipt.verified_profile?.full_name ||
    receipt.verified_by ||
    '—';

  const supplierName=
    receipt.suppliers?.name ||
    receipt.supplier_id ||
    '—';

  openDetail(
    BI('Stock Receipt Details','Stock Receipt Details'),
    receipt.invoice_receipt_no||'',
    `
      <div class="info-list">

        <div class="info-row">
          <span class="info-label">${esc(BI('Supplier','Supplier'))}</span>
          <strong class="info-value">${esc(supplierName)}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Received By','Received By'))}</span>
          <strong class="info-value">${esc(receivedName)}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Verified By','Verified By'))}</span>
          <strong class="info-value">${esc(verifiedName)}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Payment Reference','Payment Reference'))}</span>
          <strong class="info-value">${esc(receipt.payment_reference||'—')}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Verification','Verification'))}</span>
          <strong class="info-value">${badge(receipt.verification_status)}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Total','Total'))}</span>
          <strong class="info-value">${esc(money(receipt.total_amount))}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Received At','Received At'))}</span>
          <strong class="info-value">${esc(date(receipt.received_at))}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Verified At','Verified At'))}</span>
          <strong class="info-value">${esc(date(receipt.verified_at))}</strong>
        </div>

        <div class="info-row">
          <span class="info-label">${esc(BI('Notes','Notes'))}</span>
          <strong class="info-value">${esc(receipt.notes||'—')}</strong>
        </div>

      </div>

      ${table([
        {
          key:'product_name',
          label:BI('Product','Product'),
render:r=>esc(
  productMap.get(r.product_id)?.name ||
  r.product_id ||
  '—'
)      
  },
        {
          key:'variant',
          label:BI('Variant','Variant'),

       render:r=>{
  const variant=variantMap.get(r.variant_id);

  if(!variant){
    return esc(r.variant_id||'—');
  }

  return esc(
    `${variant.unit||''} ${variant.volume_value||''} ${variant.volume_unit||''}`.trim()
  );
}
        },
        {
          key:'packaging',
          label:BI('Packaging','Packaging')
        },
        {
          key:'quantity',
          label:BI('Quantity','Quantity')
        },
        {
          key:'unit_cost',
          label:BI('Buying Price','Buying Price'),
          render:r=>esc(money(r.unit_cost))
        },
        {
          key:'total_cost',
          label:BI('Total Cost','Total Cost'),
          render:r=>esc(money(r.total_cost))
        }
      ],items)}
    `
  );
}


async function reports(startDate, endDate, selectedPeriod) {
  loadHost('reports');

  const today = new Date();
  const toISO = d => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };  
  window.reports = reports;
  
 const defaultEnd = toISO(today);

const period = selectedPeriod ||
  document.getElementById('reports-period')?.value ||
  'monthly';

const defaultStartDate = new Date(today);
defaultStartDate.setDate(defaultStartDate.getDate() - 29);

if (period !== 'custom') {
  const anchor = new Date(today);
anchor.setHours(12, 0, 0, 0);

  if (Number.isNaN(anchor.getTime())) {
    throw new Error('Invalid report date');
  }

 
  const todayISO = toISO(today);

  // Daily: leo pekee.
  if (period === 'daily') {
    startDate = todayISO;
    endDate = todayISO;

  } else if (period === 'weekly') {
  const weekStart = new Date(anchor);
  weekStart.setDate(anchor.getDate() - 6);

  startDate = toISO(weekStart);
  endDate = toISO(anchor);

} else if (period === 'monthly') {
  const monthStart = new Date(anchor);
  monthStart.setDate(anchor.getDate() - 29);

  startDate = toISO(monthStart);
  endDate = toISO(anchor);

  } else if (period === 'yearly') {
    startDate = `${today.getFullYear()}-01-01`;
    endDate = `${today.getFullYear()}-12-31`;
  }


  if (period === 'daily') {
    startDate = toISO(anchor);
    endDate = toISO(anchor);
  } else if (period === 'weekly') {
    const monday = new Date(anchor);
    monday.setDate(anchor.getDate() - mondayOffset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    startDate = toISO(monday);
    endDate = toISO(sunday);
  } else if (period === 'monthly') {
    startDate = toISO(
      new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12)
    );
    endDate = toISO(
      new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 12)
    );
  } else if (period === 'yearly') {
    startDate = toISO(
      new Date(anchor.getFullYear(), 0, 1, 12)
    );
    endDate = toISO(
      new Date(anchor.getFullYear(), 11, 31, 12)
    );
  }
} else {
  startDate = startDate || toISO(defaultStartDate);
  endDate = endDate || defaultEnd;
}

  if (startDate > endDate) {
    toast(txt('Tarehe ya kuanzia haiwezi kuzidi tarehe ya mwisho.',
              'Start date cannot be after end date.'), 'error');
    return;
  }

  const root = host('reports');
  root.innerHTML = `
    <section class="report-card">
      <h3>${esc(BI('Ripoti za Mauzo na Matumizi',
                    'Sales and Expenses Report'))}</h3>
      

<label>
  ${esc(BI('Aina ya ripoti', 'Report period'))}
  <select id="reports-period"
          onchange="reportsPeriodChanged(this.value)">
    <option value="daily" ${period === 'daily' ? 'selected' : ''}>
      ${esc(BI('Kila siku', 'Daily'))}
    </option>
    <option value="weekly" ${period === 'weekly' ? 'selected' : ''}>
      ${esc(BI('Kila wiki', 'Weekly'))}
    </option>
    <option value="monthly" ${period === 'monthly' ? 'selected' : ''}>
      ${esc(BI('Kila mwezi', 'Monthly'))}
    </option>
    <option value="yearly" ${period === 'yearly' ? 'selected' : ''}>
      ${esc(BI('Kila mwaka', 'Yearly'))}
    </option>
    <option value="custom" ${period === 'custom' ? 'selected' : ''}>
      ${esc(BI('Tarehe maalumu', 'Custom range'))}
    </option>
  </select>
</label>


      <div class="report-grid">
        <label>
          ${esc(BI('Kuanzia tarehe', 'Start date'))}
          <input id="reports-start" type="date"                    
           value="${esc(startDate)}">


        </label>
        <label>
          ${esc(BI('Hadi tarehe', 'End date'))}
          <input id="reports-end" type="date"
                value="${esc(endDate)}">
        </label>
      </div>

 
<button type="button" class="btn btn-primary"
  onclick="(async function(btn){
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
      if (typeof window.reports !== 'function') {
  throw new Error('reports() haijawekwa kwenye window');
}
   await window.reports(
  document.getElementById('reports-start').value,
  document.getElementById('reports-end').value,
  document.getElementById('reports-period').value
);
    } catch (error) {
      console.error('Generate Report error:', error);
      alert('Ripoti imeshindwa: ' + (error.message || error));
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  })(this)">
  ${esc(BI('Tengeneza Ripoti', 'Generate Report'))}
</button>


      <div id="reports-results" style="margin-top:18px">
        ${esc(BI('Inapakia ripoti...', 'Loading report...'))}
      </div>
    </section>`;

  const result = document.getElementById('reports-results');

  try {
    // Read sales through the existing secured RPC.
    let sales = [];
    const batchSize = 300;
    const maxRows = 6000;

    for (let offset = 0; offset < maxRows; offset += batchSize) {
      const { data, error } = await S.sb.rpc(
        'get_sales_for_current_user',
        {
          p_search: '',
          p_limit: batchSize,
          p_offset: offset
        }
      );

      if (error) throw error;

      const batch = data || [];
      sales.push(...batch);

      if (batch.length < batchSize) break;
    }

    const truncated = sales.length >= maxRows;

    // Only completed sales are included in the sales totals.
    const completedSales = sales.filter(s =>
      s.sale_status === 'completed' &&
      s.created_at &&
      s.created_at.slice(0, 10) >= startDate &&
      s.created_at.slice(0, 10) <= endDate
    );

    let expenses = [];

    if (S.role === 'owner') {
      const { data, error } = await S.sb.rpc(
        'get_expenses_for_current_user',
        { p_search: '' }
      );

      if (error) throw error;

      expenses = (data || []).filter(e => {
        const date = e.expense_date ||
          (e.created_at ? e.created_at.slice(0, 10) : '');

        return date >= startDate && date <= endDate;
      });
    }

    const sum = (rows, field) =>
      rows.reduce((total, row) =>
        total + (Number(row[field]) || 0), 0);

    const totalSales = sum(completedSales, 'total_amount');
    const totalPaid = sum(completedSales, 'paid_amount');
    const totalBalance = sum(completedSales, 'balance');
    const totalExpenses = sum(expenses, 'amount');

    // Build one entry for every day in the selected range.
    const days = [];
    const cursor = new Date(`${startDate}T12:00:00`);
    const lastDay = new Date(`${endDate}T12:00:00`);

    while (cursor <= lastDay && days.length < 366) {
      const date = toISO(cursor);

      const daySales = completedSales.filter(s =>
        s.created_at.slice(0, 10) === date
      );

      const dayExpenses = expenses.filter(e =>
        (e.expense_date ||
          (e.created_at ? e.created_at.slice(0, 10) : '')) === date
      );

      days.push({
        date,
        sales: sum(daySales, 'total_amount'),
        expenses: sum(dayExpenses, 'amount'),
        count: daySales.length
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    const maxValue = Math.max(
      1,
      ...days.map(d => Math.max(d.sales, d.expenses))
    );

    const chart = days.map(d => {
      const salesHeight = Math.max(0, d.sales / maxValue * 100);
      const expenseHeight = Math.max(0, d.expenses / maxValue * 100);

      return `
        <div title="${esc(d.date)}"
             style="flex:0 0 28px;min-width:28px;text-align:center">
          <div style="height:150px;display:flex;align-items:flex-end;
                      justify-content:center;gap:3px">
            <div style="width:10px;height:${salesHeight}%;
                        min-height:${d.sales > 0 ? 3 : 0}px;
                        background:#f59e0b;border-radius:3px 3px 0 0"
                 title="${esc(BI('Mauzo', 'Sales'))}: ${esc(money(d.sales))}">
            </div>
            ${S.role === 'owner' ? `
              <div style="width:10px;height:${expenseHeight}%;
                          min-height:${d.expenses > 0 ? 3 : 0}px;
                          background:#ef4444;border-radius:3px 3px 0 0"
                   title="${esc(BI('Matumizi', 'Expenses'))}: ${esc(money(d.expenses))}">
              </div>` : ''}
          </div>
          <small style="display:block;font-size:10px;margin-top:6px">
            ${esc(d.date.slice(5))}
          </small>
        </div>`;
    }).join('');

    const tableRows = [...days].reverse().map(d => `
      <tr>
        <td>${esc(d.date)}</td>
        <td>${esc(money(d.sales))}</td>
        ${S.role === 'owner'
          ? `<td>${esc(money(d.expenses))}</td>` : ''}
        <td>${esc(d.count)}</td>
      </tr>`).join('');

    result.innerHTML = `
      <div class="report-grid">
        <section class="report-card">
          <h3>${esc(BI('Mauzo yaliyokamilika',
                        'Completed Sales'))}</h3>
          <strong>${esc(money(totalSales))}</strong>
          <div class="metric-row">
            <span>${esc(BI('Amelipa', 'Paid'))}</span>
            <strong>${esc(money(totalPaid))}</strong>
          </div>
          <div class="metric-row">
            <span>${esc(BI('Deni', 'Balance'))}</span>
            <strong>${esc(money(totalBalance))}</strong>
          </div>
          <div class="metric-row">
            <span>${esc(BI('Idadi ya mauzo', 'Transactions'))}</span>
            <strong>${esc(completedSales.length)}</strong>
          </div>
        </section>

        ${S.role === 'owner' ? `
          <section class="report-card">
            <h3>${esc(BI('Matumizi', 'Expenses'))}</h3>
            <strong>${esc(money(totalExpenses))}</strong>
            <div class="metric-row">
              <span>${esc(BI('Salio baada ya matumizi',
                            'Balance after expenses'))}</span>
              <strong>${esc(money(totalSales - totalExpenses))}</strong>
            </div>
            <small>
              ${esc(BI(
                'Hili si faida halisi: gharama ya bidhaa zilizouzwa bado haijahesabiwa.',
                'This is not net profit: cost of goods sold has not been included.'
              ))}
            </small>
          </section>` : ''}
      </div>

      <section class="report-card" style="margin-top:16px">
        <h3>${esc(BI('Grafu ya kila siku',
                      'Daily Graph'))}</h3>
        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px">
          <span><span style="color:#f59e0b">■</span>
            ${esc(BI('Mauzo', 'Sales'))}</span>
          ${S.role === 'owner' ? `
            <span><span style="color:#ef4444">■</span>
              ${esc(BI('Matumizi', 'Expenses'))}</span>` : ''}
        </div>
        <div style="display:flex;gap:10px;overflow-x:auto;
                    align-items:flex-start;padding:10px 0">
          ${chart || esc(BI('Hakuna data', 'No data'))}
        </div>
        ${truncated ? `
          <p>${esc(BI(
            'Tahadhari: idadi ya mauzo imefikia kikomo cha rekodi 6,000. Ripoti inaweza kuwa haijumuishi mauzo yote.',
            'Warning: the 6,000-row sales limit was reached. The report may not include all sales.'
          ))}</p>` : ''}
        ${days.length >= 366 ? `
          <p>${esc(BI(
            'Grafu inaonyesha siku 366 za kwanza tu za kipindi ulichochagua.',
            'The graph shows only the first 366 days of the selected range.'
          ))}</p>` : ''}
      </section>

      <section class="report-card" style="margin-top:16px;overflow-x:auto">
        <h3>${esc(BI('Jedwali la ripoti ya kila siku',
                      'Daily Report Table'))}</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>${esc(BI('Tarehe', 'Date'))}</th>
              <th>${esc(BI('Mauzo', 'Sales'))}</th>
              ${S.role === 'owner'
                ? `<th>${esc(BI('Matumizi', 'Expenses'))}</th>` : ''}
              <th>${esc(BI('Idadi ya mauzo', 'Transactions'))}</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || ''}
          </tbody>
        </table>
        ${completedSales.length === 0 && expenses.length === 0 ? `
          <p class="empty-state">
            ${esc(BI(
              'Hakuna data ya mauzo au matumizi katika kipindi hiki.',
              'No sales or expense data for this period.'
            ))}
          </p>` : ''}
      </section>`;

  } catch (error) {
    console.error('Reports error:', error);

    result.innerHTML = `
      <div class="empty-state">
        ${esc(BI(
          'Imeshindikana kupakia ripoti. Hakikisha RPC zilizopo zinafanya kazi.',
          'Could not load the report. Check that the existing RPCs are working.'
        ))}
      </div>`;
  }
}

 

function reportsPeriodChanged(period) {
  const dateRange = document.getElementById('reports-date-range');

  if (dateRange) {
    dateRange.style.display =
      period === 'custom' ? 'grid' : 'none';
  }

  if (period === 'custom') {
    return;
  }

  reports('', '', period).catch(error => {
    console.error('Report period error:', error);
    alert('Imeshindikana kutengeneza ripoti: ' +
      (error.message || error));
  });
}


async function audit() {
  const el = host('audit-logs');

  if (S.role !== 'owner') {
    el.innerHTML = '<div class="empty-state">Owner only.</div>';
    return;
  }

  el.innerHTML = '<div class="loading-state">Loading audit logs...</div>';

  const { data, error } = await S.sb
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Audit Logs error:', error);
    el.innerHTML = `
      <div class="empty-state">
        Unable to load audit logs.<br>
        ${esc(error.message)}
      </div>`;
    return;
  }

  if (!data || data.length === 0) {
    el.innerHTML = '<div class="empty-state">No audit logs found.</div>';
    return;
  }

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0]).map(key =>
              `<th>${esc(key)}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.keys(data[0]).map(key =>
                `<td>${esc(row[key] == null ? '' : String(row[key]))}</td>`
              ).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

async function approve(id,type){const{error}=await S.sb.rpc(type==='owner'?'developer_approve_as_owner':'developer_approve_as_salesman',{p_user_id:id});if(error)throw error;toast(txt('Akaunti imeidhinishwa.','Account approved.'),'success');await userMgmt()}
async function reject(id){const r=prompt(txt('Sababu ya rejection:','Rejection reason:'));if(!r?.trim())return;const{error}=await S.sb.rpc('developer_reject_user',{p_user_id:id,p_reason:r.trim()});if(error)throw error;toast(txt('Akaunti imekataliwa.','Account rejected.'),'success');await userMgmt()}
async function resetCode(id){const{data,error}=await S.sb.rpc('developer_generate_password_reset_code',{p_target_user_id:id});if(error)throw error;openDetail('Password Reset Code','Developer generated code',`<div class="info-list"><div class="info-row"><span class="info-label">Code</span><strong class="info-value">${esc(data||'—')}</strong></div></div>`)}

 
 /* RLS: ENABLED (KEEP ENABLED) */

async function devices(){
  loadHost('devices-sessions');

  if(S.role!=='developer'){
    host('devices-sessions').innerHTML=
      `<div class="empty-state">
        ${esc(BI('Developer pekee.','Developer only.'))}
      </div>`;
    return;
  }

  const [devicesResult,sessionsResult]=await Promise.all([
    S.sb
      .from('user_devices')
      .select(`
        id,
        user_id,
        device_id,
        device_name,
        device_type,
        operating_system,
        browser,
        status,
        first_seen_at,
        last_seen_at,
        created_at
      `)
      .order('last_seen_at',{ascending:false}),

    S.sb
      .from('device_sessions')
      .select(`
        id,
        device_record_id,
        user_id,
        status,
        signed_in_at,
        last_seen_at,
        signed_out_at,
        revoked_at,
        revoke_reason
      `)
      .order('last_seen_at',{ascending:false})
  ]);

  if(devicesResult.error)throw devicesResult.error;
  if(sessionsResult.error)throw sessionsResult.error;

  const deviceRows=devicesResult.data||[];
  const sessionRows=sessionsResult.data||[];

  const deviceMap=new Map(
    deviceRows.map(d=>[
      d.id,
      d
    ])
  );

  const deviceName=(deviceId)=>{
    const d=deviceMap.get(deviceId);

    if(!d)return deviceId||'—';

    return d.device_name ||
      `${d.device_type||'Device'} — ${d.browser||''}`.trim();
  };

  host('devices-sessions').innerHTML=`

    <div class="stats-grid">

      <article class="stat-card">
        <div class="stat-card-top">
          <span class="stat-label">
            ${esc(BI('Registered Devices','Registered Devices'))}
          </span>
          <span class="stat-icon">D</span>
        </div>

        <strong class="stat-value">
          ${esc(deviceRows.length)}
        </strong>

        <small>
          ${esc(BI(
            'Devices zilizosajiliwa',
            'Registered devices'
          ))}
        </small>
      </article>

      <article class="stat-card">
        <div class="stat-card-top">
          <span class="stat-label">
            ${esc(BI('Active Sessions','Active Sessions'))}
          </span>
          <span class="stat-icon">S</span>
        </div>

        <strong class="stat-value">
          ${esc(
            sessionRows.filter(x=>x.status==='active').length
          )}
        </strong>

        <small>
          ${esc(BI(
            'Sessions zinazotumika',
            'Currently active sessions'
          ))}
        </small>
      </article>

      <article class="stat-card">
        <div class="stat-card-top">
          <span class="stat-label">
            ${esc(BI('Total Sessions','Total Sessions'))}
          </span>
          <span class="stat-icon">T</span>
        </div>

        <strong class="stat-value">
          ${esc(sessionRows.length)}
        </strong>

        <small>
          ${esc(BI(
            'Sessions zote zilizorekodiwa',
            'All recorded sessions'
          ))}
        </small>
      </article>

      <article class="stat-card">
        <div class="stat-card-top">
          <span class="stat-label">
            ${esc(BI('Blocked Devices','Blocked Devices'))}
          </span>
          <span class="stat-icon">!</span>
        </div>

        <strong class="stat-value">
          ${esc(
            deviceRows.filter(x=>x.status==='blocked').length
          )}
        </strong>

        <small>
          ${esc(BI(
            'Devices zilizozuiwa',
            'Blocked devices'
          ))}
        </small>
      </article>

    </div>

    <section class="panel" style="margin-top:16px">

      <div class="panel-header">
        <div>
          <h3>
            ${esc(BI(
              'Registered Devices',
              'Registered Devices'
            ))}
          </h3>

          <p>
            ${esc(BI(
              `${deviceRows.length} device(s)`,
              `${deviceRows.length} device(s)`
            ))}
          </p>
        </div>
      </div>

      <div class="panel-body">

        ${table([
          {
            key:'device_name',
            label:BI('Device','Device')
          },
          {
            key:'user_id',
            label:BI('User','User'),
            render:r=>esc(r.user_id||'—')
          },
          {
            key:'device_type',
            label:BI('Type','Type')
          },
          {
            key:'operating_system',
            label:BI('OS','OS')
          },
          {
            key:'browser',
            label:BI('Browser','Browser')
          },
          {
            key:'status',
            label:BI('Status','Status'),
            render:r=>badge(r.status)
          },
          {
            key:'first_seen_at',
            label:BI('First Seen','First Seen'),
            render:r=>esc(date(r.first_seen_at))
          },
          {
            key:'last_seen_at',
            label:BI('Last Seen','Last Seen'),
            render:r=>esc(date(r.last_seen_at))
          }
        ],
        deviceRows,
        r=>`
          ${
            r.status==='active'
              ? `
                <button
                  class="btn btn-danger btn-sm"
                  data-action="block-device"
                  data-id="${esc(r.id)}">
                  ${esc(BI('Block','Block'))}
                </button>
              `
              :''
          }

          ${
            r.status==='blocked'
              ? `
                <button
                  class="btn btn-success btn-sm"
                  data-action="unblock-device"
                  data-id="${esc(r.id)}">
                  ${esc(BI('Unblock','Unblock'))}
                </button>
              `
              :''
          }
        `)}

      </div>

    </section>

    <section class="panel" style="margin-top:16px">

      <div class="panel-header">
        <div>
          <h3>
            ${esc(BI(
              'Device Sessions',
              'Device Sessions'
            ))}
          </h3>

          <p>
            ${esc(BI(
              `${sessionRows.length} session(s)`,
              `${sessionRows.length} session(s)`
            ))}
          </p>
        </div>
      </div>

      <div class="panel-body">

        ${table([
          {
            key:'user_id',
            label:BI('User','User'),
           render:r=>esc(r.user_id||'—')
          },
          {
            key:'device_record_id',
            label:BI('Device','Device'),
            render:r=>esc(deviceName(r.device_record_id))
          },
          {
            key:'status',
            label:BI('Status','Status'),
            render:r=>badge(r.status)
          },
          {
            key:'signed_in_at',
            label:BI('Signed In','Signed In'),
            render:r=>esc(date(r.signed_in_at))
          },
          {
            key:'last_seen_at',
            label:BI('Last Seen','Last Seen'),
            render:r=>esc(date(r.last_seen_at))
          },
          {
            key:'signed_out_at',
            label:BI('Signed Out','Signed Out'),
            render:r=>esc(date(r.signed_out_at)||'—')
          },
          {
            key:'revoked_at',
            label:BI('Revoked At','Revoked At'),
            render:r=>esc(date(r.revoked_at)||'—')
          },
          {
            key:'revoke_reason',
            label:BI('Revoke Reason','Revoke Reason'),
            render:r=>esc(r.revoke_reason||'—')
          }
        ],
        sessionRows,
        r=>`
          ${
            r.status==='active'
              ? `
                <button
                  class="btn btn-danger btn-sm"
                  data-action="revoke-session"
                  data-id="${esc(r.id)}">
                  ${esc(BI('Revoke','Revoke'))}
                </button>
              `
              :''
          }
        `)}

      </div>

    </section>
  `;
}

async function profile(){const p=S.profile||await loadProfile();for(const[id,v]of [['profile-full-name',p?.full_name||''],['profile-username',p?.username||''],['profile-email',p?.email||S.user?.email||''],['profile-phone',p?.phone||''],['profile-role',p?.role||''],['profile-status',p?.account_status||''],['profile-created-at',date(p?.created_at)],['profile-active',p?.is_active?txt('Ndiyo','Yes'):txt('Hapana','No')]])if($(id))$(id).value=v;S.avatarPath=p?.avatar_url||null;setAvatar('profile-avatar-preview','profile-avatar-placeholder',await avatar(p?.avatar_url),p?.full_name)}
 /* RLS: ENABLED (KEEP ENABLED) */

 /* RLS: ENABLED (KEEP ENABLED) */

async function saveProfile(e){
  e.preventDefault();

  const button=e.target.querySelector('[data-action="save-profile"]');

  const fullName=$('profile-full-name')?.value.trim()||'';
  const username=$('profile-username')?.value.trim().toLowerCase()||'';
  const phone=$('profile-phone')?.value.trim()||null;
  const avatarPath=S.avatarPath||S.profile?.avatar_url||null;

  if(fullName.length<2){
    msg(
      'profile-form-message',
      txt(
        'Jina kamili lazima liwe na angalau herufi 2.',
        'Full name must contain at least 2 characters.'
      ),
      'error'
    );
    return;
  }

  if(!/^[A-Za-z0-9_.-]{3,50}$/.test(username)){
    msg(
      'profile-form-message',
      txt(
        'Username si sahihi.',
        'Username is invalid.'
      ),
      'error'
    );
    return;
  }

  busy(button,true);

  try{

    /* SAVE TO DATABASE */
    const saved=await S.sb.rpc(
      'update_my_profile',
      {
        p_full_name:fullName,
        p_username:username,
        p_phone:phone,
        p_avatar_url:avatarPath
      }
    );

    if(saved.error){
      console.error(
        'update_my_profile ERROR:',
        saved.error
      );

      throw saved.error;
    }

    console.log(
      'update_my_profile RPC RESULT:',
      saved.data
    );

    /*
      IMPORTANT:
      Do not trust only the RPC response.
      Read the profile again from Supabase.
    */
    const fresh=await loadProfileFinal();

    if(!fresh){
      throw new Error(
        txt(
          'Taarifa zimehifadhiwa lakini profile haikuweza kusomwa tena kutoka database.',
          'The information was saved but the profile could not be read back from the database.'
        )
      );
    }

    /*
      Confirm the values that actually came from DB.
    */
    console.log(
      'PROFILE AFTER SAVE FROM DATABASE:',
      fresh
    );

    S.profile=fresh;
    S.role=fresh.role||S.role;
    S.avatarPath=fresh.avatar_url||null;

    await profileFinal();
    await updateChromeFinal();

    msg(
      'profile-form-message',
      txt(
        'Wasifu umehifadhiwa kikamilifu.',
        'Profile saved successfully.'
      ),
      'success'
    );

  }catch(x){

    console.error(
      'SAVE PROFILE FAILED:',
      x
    );

    msg(
      'profile-form-message',
      err(x),
      'error'
    );

  }finally{
    busy(button,false);
  }
}

let profileCropImage=null;
let profileCropFile=null;
let profileCropScale=1;
let profileCropX=0;
let profileCropY=0;
let profileCropDragging=false;
let profileCropStartX=0;
let profileCropStartY=0;

async function openProfileCrop(file){
  if(!file||!file.type.startsWith('image/'))return;

  const url=URL.createObjectURL(file);
  const img=new Image();

  img.onload=()=>{
    profileCropImage=img;
    profileCropFile=file;
    profileCropScale=1;
    profileCropX=0;
    profileCropY=0;

    const modalEl=$('profile-crop-modal');
    const canvas=$('profile-crop-canvas');

    if(!modalEl||!canvas){
      URL.revokeObjectURL(url);
      toast(
        txt('Crop interface haijawekwa kwenye HTML bado.','The crop interface has not been added to HTML yet.'),
        'error'
      );
      return;
    }

    modalEl.hidden=false;
    drawProfileCrop();
    URL.revokeObjectURL(url);
  };

  img.onerror=()=>{
    URL.revokeObjectURL(url);
    toast(
      txt('Picha hii haiwezi kusomwa na browser.','This image cannot be read by the browser.'),
      'error'
    );
  };

  img.src=url;
}

/* RLS: ENABLED (KEEP ENABLED) */

function drawProfileCrop(){
  const canvas=$('profile-crop-canvas');
  if(!canvas||!profileCropImage)return;

  const ctx=canvas.getContext('2d');
  const size=Math.min(
    520,
    Math.max(280,Math.floor(window.innerWidth*0.8))
  );

  canvas.width=size;
  canvas.height=size;

  ctx.clearRect(0,0,size,size);

  const img=profileCropImage;

  /* RLS: ENABLED (KEEP ENABLED) */

const baseScale=Math.min(
  size/img.width,
  size/img.height
);

  const scale=baseScale*profileCropScale;

  const width=img.width*scale;
  const height=img.height*scale;

  const x=(size-width)/2+profileCropX;
  const y=(size-height)/2+profileCropY;

  ctx.save();

  ctx.beginPath();
  ctx.rect(0,0,size,size);
  ctx.clip();

  ctx.drawImage(
    img,
    x,
    y,
    width,
    height
  );

  ctx.restore();

  /* Crop boundary */
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,.95)';
  ctx.lineWidth=2;
  ctx.strokeRect(1,1,size-2,size-2);
  ctx.restore();

  /* Grid */
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,.35)';
  ctx.lineWidth=1;

  const third=size/3;

  ctx.beginPath();
  ctx.moveTo(third,0);
  ctx.lineTo(third,size);
  ctx.moveTo(third*2,0);
  ctx.lineTo(third*2,size);
  ctx.moveTo(0,third);
  ctx.lineTo(size,third);
  ctx.moveTo(0,third*2);
  ctx.lineTo(size,third*2);
  ctx.stroke();

  ctx.restore();
}

function startProfileCropDrag(e){
  if(!profileCropImage)return;

  profileCropDragging=true;

  const point=getProfileCropPoint(e);

  profileCropStartX=point.x-profileCropX;
  profileCropStartY=point.y-profileCropY;
}

function moveProfileCropDrag(e){
  if(!profileCropDragging)return;

  const point=getProfileCropPoint(e);

  profileCropX=point.x-profileCropStartX;
  profileCropY=point.y-profileCropStartY;

  drawProfileCrop();
}

function stopProfileCropDrag(){
  profileCropDragging=false;
}

function getProfileCropPoint(e){
  const canvas=$('profile-crop-canvas');
  const rect=canvas.getBoundingClientRect();

  return {
    x:(e.clientX-rect.left)*(canvas.width/rect.width),
    y:(e.clientY-rect.top)*(canvas.height/rect.height)
  };
}

function zoomProfileCrop(value){
  if(!profileCropImage)return;

 /* RLS: ENABLED (KEEP ENABLED) */

profileCropScale=Math.max(
  0.5,
  Math.min(4,Number(value)||1)
);

  drawProfileCrop();
}

function closeProfileCrop(){
  const modalEl=$('profile-crop-modal');
  if(modalEl)modalEl.hidden=true;

  profileCropImage=null;
  profileCropFile=null;
  profileCropScale=1;
  profileCropX=0;
  profileCropY=0;
  profileCropDragging=false;
}

/* RLS: ENABLED (KEEP ENABLED) */


async function saveProfileCrop(){
  if(!profileCropImage||!S.user)return;

  const canvas=$('profile-crop-canvas');
  if(!canvas)return;

  const output=document.createElement('canvas');
  const size=512;

  output.width=size;
  output.height=size;

  const ctx=output.getContext('2d');

  const scale=size/canvas.width;

  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width*scale,
    canvas.height*scale
  );

  const blob=await new Promise(resolve=>{
    output.toBlob(
      resolve,
      'image/webp',
      0.92
    );
  });

  if(!blob){
    toast(
      txt(
        'Imeshindikana kutengeneza picha.',
        'Could not create image.'
      ),
      'error'
    );
    return;
  }

  const croppedFile=new File(
    [blob],
    `profile-${crypto.randomUUID()}.webp`,
    {
      type:'image/webp'
    }
  );

  closeProfileCrop();

  await uploadCroppedAvatar(croppedFile);
}


async function uploadCroppedAvatar(file){
  if(!file||!S.user)return;

  const old=S.avatarPath||S.profile?.avatar_url||null;

  const path=
    `${S.user.id}/${crypto.randomUUID()}.webp`;

  const up=await S.sb.storage
    .from(CFG.bucket)
    .upload(
      path,
      file,
      {
        contentType:'image/webp',
        upsert:false
      }
    );

  if(up.error)throw up.error;

  const r=await S.sb.rpc(
    'update_my_profile',
    {
      p_full_name:
        $('profile-full-name')?.value.trim()
        ||S.profile?.full_name
        ||null,

      p_username:
        $('profile-username')?.value.trim().toLowerCase()
        ||S.profile?.username
        ||null,

      p_phone:
        $('profile-phone')?.value.trim()
        ||S.profile?.phone
        ||null,

      p_avatar_url:path
    }
  );

  if(r.error){
    await S.sb.storage
      .from(CFG.bucket)
      .remove([path]);

    throw r.error;
  }

  S.profile=r.data;
  S.avatarPath=path;

  if(
    old &&
    !/^https?:\/\//i.test(old) &&
    old!==path
  ){
    await S.sb.storage
      .from(CFG.bucket)
      .remove([old]);
  }

  await profile();
  await updateChrome();

  toast(
    txt(
      'Picha imehifadhiwa.',
      'Profile picture saved.'
    ),
    'success'
  );
}

async function removeAvatar(){if(!await confirm(txt('Ondoa picha','Remove photo'),txt('Picha itaondolewa.','The photo will be removed.')))return;const old=S.avatarPath;const r=await S.sb.rpc('update_my_profile',{p_full_name:$('profile-full-name').value.trim(),p_username:$('profile-username').value.trim().toLowerCase(),p_phone:$('profile-phone').value.trim()||null,p_avatar_url:null});if(r.error)throw r.error;S.profile=r.data;S.avatarPath=null;if(old&&!/^https?:\/\//i.test(old))await S.sb.storage.from(CFG.bucket).remove([old]);await profile();await updateChrome()}
function openForm(title,desc,html){$('form-modal-title').textContent=title;$('form-modal-description').textContent=desc||'';$('form-modal-content').innerHTML=html;modal('form-modal')}
function openDetail(title,desc,html){$('detail-modal-title').textContent=title;$('detail-modal-description').textContent=desc||'';$('detail-modal-content').innerHTML=html;modal('detail-modal')}
function confirm(title,message){return new Promise(r=>{S.confirm=r;$('confirm-title').textContent=title;$('confirm-message').textContent=message;modal('confirm-modal')})}
function resolveConfirm(v){const r=S.confirm;S.confirm=null;modal('confirm-modal',false);if(r)r(v)}
async function deviceRegister(){if(!S.user||!S.session||!approved())return;if(!S.deviceId){S.deviceId=crypto.randomUUID();localStorage.setItem(CFG.deviceKey,S.deviceId)}const sid=authSid(S.session);if(!sid){important(txt('Auth session ID haikupatikana.','Auth session ID unavailable.'));return}S.authSessionId=sid;let r=await S.sb.rpc('register_device',{p_device_id:S.deviceId,p_device_name:navigator.userAgent.includes('Mobile')?'Mobile Browser':'Desktop Browser',p_device_type:/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?'mobile':'desktop',p_operating_system:navigator.platform,p_browser:navigator.userAgent,p_user_agent:navigator.userAgent,p_location_consent:false,p_latitude:null,p_longitude:null});if(r.error){important(err(r.error));return}r=await S.sb.rpc('create_device_session',{p_device_id:S.deviceId,p_auth_session_id:sid});if(r.error){important(err(r.error));return}

S.deviceSession=r.data;

if(S.heartbeat) clearInterval(S.heartbeat);

const firstHeartbeat = await S.sb.rpc('device_session_heartbeat', {
  p_device_id: S.deviceId,
  p_auth_session_id: S.authSessionId
});

if(firstHeartbeat.error){
  console.error('device_session_heartbeat failed:', firstHeartbeat.error);
}else{
  console.log('device_session_heartbeat: OK', firstHeartbeat.data);
}

S.heartbeat = setInterval(async ()=>{
  const hb = await S.sb.rpc('device_session_heartbeat', {
    p_device_id: S.deviceId,
    p_auth_session_id: S.authSessionId
  });

  if(hb.error){
    console.error('device_session_heartbeat failed:', hb.error);
  }else{
    console.log('device_session_heartbeat: OK', hb.data);
  }
}, 300000);}
async function login(e){e.preventDefault();const b=e.target.querySelector('[data-action="login"]');const email=$('login-email').value.trim().toLowerCase(),password=$('login-password').value;if(!email||!password){msg('login-form-message',txt('Weka email na password.','Enter email and password.'),'error');return}busy(b,true);try{const r=await S.sb.auth.signInWithPassword({email,password});if(r.error)throw r.error;S.session=r.data.session;S.user=r.data.user;await loadProfile();if(!approved()){await S.sb.auth.signOut();throw Error(txt('Akaunti haijaidhinishwa.','Account is not approved.'))}

modal('login-modal',false);

document.getElementById('site-header')?.setAttribute('hidden','');

$('public-content')?.setAttribute('hidden','');
$('authenticated-app')?.removeAttribute('hidden');

/* Hide the entire public Home header */
document.getElementById('site-header')?.setAttribute('hidden','');

/* Hide public footer */
document.getElementById('site-footer')?.setAttribute('hidden','');

await updateChrome();

nav('dashboard');
await deviceRegister();toast(txt('Umeingia kwa mafanikio.','Login successful.'),'success')}catch(x){msg('login-form-message',err(x),'error')}finally{busy(b,false)}}
async function signup(e){
 e.preventDefault();
 const b=e.target.querySelector('[data-action="signup"]');
 const d=Object.fromEntries(new FormData(e.target));
 if(d.password!==d.confirm_password){msg('signup-form-message',txt('Password hazifanani.','Passwords do not match.'),'error');return}
 busy(b,true);
 try{
  if(d.account_type==='developer'){
   const r=await S.sb.functions.invoke(CFG.devFn,{body:{full_name:d.full_name.trim(),username:d.username.trim().toLowerCase(),email:d.email.trim().toLowerCase(),phone:d.phone.trim(),password:d.password,signup_code:d.signup_code?.trim()}});
   if(r.error)throw r.error;if(!r.data?.success)throw Error(r.data?.error||'Developer signup failed');
   const l=await S.sb.auth.signInWithPassword({email:d.email.trim().toLowerCase(),password:d.password});
   if(l.error)throw l.error;S.session=l.data.session;S.user=l.data.user;await loadProfile();
   if(S.role!=='developer'||!approved())throw Error('Developer account verification failed');

  modal('signup-modal',false);

$('public-content')?.setAttribute('hidden','');
$('authenticated-app')?.removeAttribute('hidden');

/* Hide the entire public Home header */
document.getElementById('site-header')?.setAttribute('hidden','');

/* Hide public footer */
document.getElementById('site-footer')?.setAttribute('hidden','');

await updateChrome();

nav('dashboard');

await deviceRegister();

   toast(txt('Developer account imeundwa.','Developer account created.'),'success');
  }else{
   const r=await S.sb.auth.signUp({email:d.email.trim().toLowerCase(),password:d.password,options:{data:{full_name:d.full_name.trim(),username:d.username.trim().toLowerCase(),phone:d.phone.trim()||null}}});
   if(r.error)throw r.error;modal('signup-modal',false);toast(r.data.session?txt('Akaunti imeundwa lakini inasubiri approval.','Account created and awaits approval.'):txt('Akaunti imeundwa. Thibitisha email kama inahitajika, kisha subiri approval.','Account created. Confirm email if required, then wait for approval.'),'success');
   if(r.data.session){S.session=r.data.session;S.user=r.data.user;await loadProfile();if(approved()){await updateChrome();nav('dashboard');await deviceRegister()}}
  }
 }catch(x){msg('signup-form-message',err(x),'error')}finally{busy(b,false)}
}
async function forgot(e){e.preventDefault();msg('forgot-password-message',txt('Developer aliyeidhinishwa ndiye hutengeneza reset code. Wasiliana naye.','An approved Developer generates the reset code. Contact the Developer.'),'warning')}
async function reset(e){e.preventDefault();const b=e.target.querySelector('[data-action="reset-password"]');busy(b,true);try{const r=await S.sb.functions.invoke(CFG.resetFn,{body:{target_user_id:$('reset-target-user-id').value.trim(),reset_code:$('reset-code').value.trim(),new_password:$('reset-new-password').value}});if(r.error)throw r.error;if(!r.data?.success)throw Error(r.data?.error||'Password reset failed');modal('reset-password-modal',false);modal('login-modal');toast(txt('Password imebadilishwa.','Password reset completed.'),'success')}catch(x){msg('reset-password-message',err(x),'error')}finally{busy(b,false)}}
async function requestPasswordReset(){
  const email=$('forgot-email')?.value.trim().toLowerCase();
  if(!email){msg('forgot-password-message',BI('Weka email kwanza.','Enter your email first.'),'error');return;}
  msg('forgot-password-message',BI('Mfumo huu hutumia reset code inayotengenezwa na Developer aliyeidhinishwa. Wasiliana na Developer kupata code, Target User ID na hatua za mwisho za reset.','This system uses a reset code generated by an approved Developer. Contact the Developer for the code, Target User ID and final reset steps.'),'warning');
}
async function logout(){

  if(S.heartbeat){
    clearInterval(S.heartbeat);
  }

  await S.sb.auth.signOut();

  S.user=null;
  S.session=null;
  S.profile=null;
  S.role=null;

  /* Show public Home header again */
  document.getElementById('site-header')?.removeAttribute('hidden');

  /* Show public footer again */
  document.getElementById('site-footer')?.removeAttribute('hidden');

  publicPage('home');

  toast(
    txt(
      'Umetoka kwenye mfumo.',
      'Logged out.'
    ),
    'success'
  );
}

async function devSettings(){const h=host('developer-settings');loadHost('developer-settings');if(S.role!=='developer'){h.innerHTML='<div class="empty-state">Developer only.</div>';return}h.innerHTML=`<div class="report-grid"><section class="report-card"><h3>System</h3><div class="metric-row"><span>Supabase</span><strong>Connected</strong></div><div class="metric-row"><span>RLS</span><strong>Enabled</strong></div><div class="metric-row"><span>Role</span><strong>${esc(S.role)}</strong></div></section><section class="report-card"><h3>Current Session</h3><div class="metric-row"><span>Device ID</span><strong>${esc(S.deviceId||'—')}</strong></div><div class="metric-row"><span>Auth Session ID</span><strong>${esc(S.authSessionId||'—')}</strong></div></section></div>`}


/* ============================================================
 FINAL INTEGRATION LAYER
 This block is intentionally placed at the end of app.js so the
 existing UI helpers are reused while the final routing/module
 implementations below become authoritative.
 RLS: KEEP ENABLED.
 ============================================================ */

const BI = (sw, en) => txt(sw, en);
const q = (v) => String(v ?? '').trim();
const num = (v) => Number(v || 0);
const optionList = (rows, idKey, labelFn, placeholder) =>
  `<option value="">${esc(placeholder || BI('Chagua...', 'Select...'))}</option>` +
  (rows || []).map(r => `<option value="${esc(r[idKey])}">${esc(labelFn(r))}</option>`).join('');

function closeSidebarOnNavigation(){
  $('app-sidebar')?.classList.remove('open');
  $('main-navigation')?.classList.remove('open');
}

function filterVisibleTable(input){
  const term = q(input.value).toLowerCase();
  const hostEl = input.closest('.module-page, .dashboard-page, .panel, body');
  const rows = hostEl ? $$('tbody tr', hostEl) : [];
  rows.forEach(row => { row.hidden = !!term && !row.textContent.toLowerCase().includes(term); });
}

function bindModuleSearch(){
  $$('.module-search').forEach(input => {
    if(input.dataset.bound === '1') return;
    input.dataset.bound = '1';
    input.addEventListener('input', () => filterVisibleTable(input));
  });
}

function tableFinal(cols, rows, actions=''){
  if(!rows?.length) return `<div class="empty-state"><strong>${esc(BI('Hakuna data.', 'No data found.'))}</strong></div>`;
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${esc(c.label)}</th>`).join('')}${actions?`<th>${esc(BI('Vitendo','Actions'))}</th>`:''}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c.render?c.render(r):esc(r[c.key] ?? '—')}</td>`).join('')}${actions?`<td><div class="table-actions">${actions(r)}</div></td>`:''}</tr>`).join('')}</tbody></table></div>`;
}

table = tableFinal;

async function getCustomers(search=''){
  const {data,error}=await S.sb.rpc('get_customers_for_current_user',{p_search:search});
  if(error) throw error;
  return data||[];
}

/* RLS: ENABLED (KEEP ENABLED) */

async function getSuppliers(search=''){
  const {data,error}=await S.sb
    .from('suppliers')
    .select('id,name,phone,contact_person,address,is_active')
    .ilike('name', `%${String(search || '').trim()}%`)
    .order('name', {ascending:true});

  if(error) throw error;

  return data || [];
}
 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   LOW STOCK SETTING
   Reads the Owner's system setting.
   ========================================================= */

async function isLowStockEnabled(){

  const {data,error}=await S.sb
    .from('settings')
    .select('setting_value')
    .eq('setting_key','low_stock_enabled')
    .maybeSingle();

  if(error) throw error;

  return String(
    data?.setting_value ?? 'true'
  ).trim().toLowerCase()==='true';
}

async function dashboardFinal(){
  const h=$('dashboard-stat-grid');
  if(!h) return;
  loadHost('dashboard');
  let d={today_sales:0,today_transactions:0,customers_count:0,stock_value:0,low_stock_count:0};
  if(S.role==='owner'){
    const {data,error}=await S.sb.rpc('get_owner_dashboard_summary');
    if(error) throw error;
    d={...d,...(data?.[0]||{})};
    /* RLS: ENABLED (KEEP ENABLED) */

if(!(await isLowStockEnabled())){
  d.low_stock_count=0;
}
  }else{
    const [{data:s,error:se},{data:stockRows,error:ste},{data:customersRows,error:ce}]=await Promise.all([
      S.sb.rpc('get_today_sales_summary'),
      S.sb.rpc('get_salesman_stock'),
      getCustomers('')
    ]);
    if(se) throw se; if(ste) throw ste; if(ce) throw ce;
    d.today_sales=s?.[0]?.total_sales||0;
    d.today_transactions=s?.[0]?.transaction_count||0;
    d.customers_count=(customersRows||[]).length;
    d.stock_value=(stockRows||[]).reduce((sum,r)=>sum+num(r.current_stock)*num(r.selling_price),0);
    d.low_stock_count=(stockRows||[]).filter(r=>r.is_low_stock).length;
    /* RLS: ENABLED (KEEP ENABLED) */

if(!(await isLowStockEnabled())){
  d.low_stock_count=0;
}
  }
  h.innerHTML=[
    ['dashboard.todaySales',money(d.today_sales)],
    ['dashboard.transactions',d.today_transactions||0],
    ['dashboard.customers',d.customers_count||0],
    ['dashboard.stockValue',money(d.stock_value)],
    ['dashboard.lowStock',d.low_stock_count||0]
  ].map(x=>`<div class="stat-card"><div class="stat-label">${esc(t(x[0]))}</div><div class="stat-value">${esc(x[1])}</div></div>`).join('');
  
/* RLS: ENABLED (KEEP ENABLED) */

$('dashboard-welcome-title')&&(
  $('dashboard-welcome-title').textContent=
    `${BI('Karibu','Welcome')}, ${S.profile?.username||'User'}`
);

  $('dashboard-current-date')&&($('dashboard-current-date').textContent=new Intl.DateTimeFormat(S.lang==='sw'?'sw-TZ':'en-TZ',{dateStyle:'full'}).format(new Date()));
  $('system-auth-status')&&($('system-auth-status').textContent=BI('Imeunganishwa','Connected'));
  $('system-role-status')&&($('system-role-status').textContent=S.role||'—');
  $('system-account-status')&&($('system-account-status').textContent=S.profile?.account_status||'—');
  $('system-auth-status')?.removeAttribute('data-error');
}

dashboard = dashboardFinal;

 /* RLS: ENABLED (KEEP ENABLED) */

async function productsFinal(){
  loadHost('products');

  let rows=[];

  if(S.role==='owner'){
    const {data,error}=await S.sb.rpc('get_products_for_owner');

    if(error) throw error;

    rows=data||[];

  }else{

    const {data,error}=await S.sb.rpc('get_products_for_sale');

    if(error) throw error;

    rows=data||[];
  }

  host('products').innerHTML=
    toolbar(
      S.role==='owner' ? 'open-product-form' : '',
      S.role==='owner'
        ? t('actions.addProduct')
        : '',
      true
    )

    +

    tableFinal(
      [

        {
          key:'name',
          label:BI('Bidhaa','Product')
        },

        {
          key:'sku',
          label:'SKU'
        },

        {
          key:'brand',
          label:BI('Brand','Brand')
        },

        {
          key:'category',
          label:BI('Category','Category')
        },

        {
          key:'selling_price',
          label:BI('Bei ya Mauzo','Selling Price'),
          render:r=>esc(money(r.selling_price))
        },

        {
          key:'low_stock_level',
          label:BI(
            'Kiwango cha Chini',
            'Low Stock'
          )
        },

        {
          key:'image_url',
          label:BI('Picha','Image'),
          render:r=>r.image_url
            ? `<img
                src="${esc(r.image_url)}"
                alt="${esc(r.name||'Product')}"
                style="
                  width:48px;
                  height:48px;
                  object-fit:cover;
                  border-radius:8px;
                "
                onerror="this.style.display='none'"
              >`
            : '—'
        },

        {
          key:'notes',
          label:BI('Maelezo','Notes'),
          render:r=>esc(r.notes||'—')
        },

        {
          key:'is_active',
          label:BI('Hali','Status'),
          render:r=>badge(
            r.is_active
              ? 'active'
              : 'inactive'
          )
        }

      ],

      rows,

      r=>`

        <button
          class="btn btn-secondary btn-sm"
          data-action="view-product"
          data-id="${esc(r.id)}">
          ${esc(BI('Variants','Variants'))}
        </button>

        ${
          S.role==='owner'
          ? `

            <button
              class="btn btn-ghost btn-sm"
              data-action="edit-product"
              data-id="${esc(r.id)}">
              ${esc(BI('Hariri','Edit'))}
            </button>

            <button
              class="btn btn-secondary btn-sm"
              data-action="toggle-product"
              data-id="${esc(r.id)}"
              data-active="${r.is_active?'1':'0'}">

              ${esc(
                r.is_active
                  ? BI('Zima','Deactivate')
                  : BI('Washa','Activate')
              )}

            </button>

          `
          : ''
        }

      `
    );

  bindModuleSearch();
}

products=productsFinal;
 
products=productsFinal;

async function viewProductFinal(id){
  const {data,error}=await S.sb.rpc('get_product_variants',{p_product_id:id}); if(error) throw error;
  const rows=data||[];
  openDetail(BI('Variants za Bidhaa','Product Variants'),BI('Taarifa halisi kutoka Supabase.','Live data from Supabase.'),
    `${S.role==='owner'?`<div class="form-actions"><button class="btn btn-primary btn-sm"

     data-action="open-variant-form" data-product-id="${esc(id)}">+ ${esc(BI('Ongeza Variant','Add Variant'))}</button></div>`:''}${tableFinal([
      {key:'product_name',label:BI('Bidhaa','Product')},{key:'unit',label:BI('Unit','Unit')},{key:'volume_value',label:BI('Kiasi','Volume')},{key:'volume_unit',label:BI('Kipimo','Volume Unit')},{key:'buying_price',label:BI('Bei ya Kununua','Buying Price'),render:r=>esc(money(r.buying_price))},{key:'selling_price',label:BI('Bei ya Kuuza','Selling Price'),render:r=>esc(money(r.selling_price))},{key:'low_stock_level',label:BI('Low Stock','Low Stock')},{key:'is_active',label:BI('Hali','Status'),render:r=>badge(r.is_active?'active':'inactive')}
    ],rows,r=>S.role==='owner'?`<button class="btn btn-ghost btn-sm" data-action="edit-variant" data-id="${esc(r.id)}">${esc(BI('Hariri','Edit'))}</button><button class="btn btn-secondary btn-sm" data-action="toggle-variant" data-id="${esc(r.id)}" data-active="${r.is_active?'1':'0'}">${esc(r.is_active?BI('Zima','Deactivate'):BI('Washa','Activate'))}</button>`:'')}`);
}
viewProduct=viewProductFinal;

/* RLS: ENABLED (KEEP ENABLED) */

async function openVariantForm(productId, variantId=null){
  if(S.role!=='owner'){
    toast(BI('Owner pekee.','Owner/Developer only.'),'warning');
    return;
  }

  let v=null;

  /* Read variant through RPC — do NOT query product_variants directly */
  if(variantId){
    const {data,error}=await S.sb.rpc('get_product_variants',{
      p_product_id:productId
    });

    if(error) throw error;

    v=(data||[]).find(x=>x.id===variantId);

    if(!v){
      throw Error(
        BI('Variant haikupatikana.','Variant not found.')
      );
    }
  }

  /* stock_packaging enum in Supabase:
     cotton, crates
     RLS: ENABLED (KEEP ENABLED)
  */
  const units=['cotton','crates'];

  openForm(
    v
      ? BI('Hariri Variant','Edit Variant')
      : BI('Ongeza Variant','Add Variant'),

    BI(
      'Taarifa za Variant zinahifadhiwa kupitia Supabase RPC.',
      'Variant data is saved through Supabase RPC.'
    ),

    `
 
/* RLS: ENABLED (KEEP ENABLED) */

<form id="f-variant" class="dynamic-form variant-modern-form">

  <div class="variant-form-banner">
    <div class="variant-form-icon">📦</div>
    <div>
      <h3>${esc(v ? BI('Hariri Product Variant','Edit Product Variant') : BI('Unda Product Variant','Create Product Variant'))}</h3>
      <p>${esc(BI('Weka vipimo na bei za kifungashio cha bidhaa.','Set the packaging measurements and prices for this product variant.'))}</p>
    </div>
  </div>

  <div class="variant-form-section">
    <div class="variant-form-section-title">
      <span class="variant-section-number">01</span>
      <div>
        <strong>${esc(BI('Taarifa za Variant','Variant Details'))}</strong>
        <small>${esc(BI('Aina ya kifungashio na vipimo','Packaging type and measurements'))}</small>
      </div>
    </div>

    <div class="form-grid variant-modern-grid">

      <div class="form-field">
        <label for="variant-unit">${esc(BI('Unit / Kifungashio','Unit / Packaging'))}</label>
        <select id="variant-unit" name="unit" required>
          ${units.map(u=>`
            <option value="${esc(u)}" ${v?.unit===u?'selected':''}>
              ${esc(u)}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="form-field">
        <label for="variant-volume">${esc(BI('Kiasi cha Volume','Volume Value'))}</label>
        <input
          id="variant-volume"
          name="volume_value"
          type="number"
          min="0"
          step="0.01"
          required
          value="${esc(v?.volume_value??'')}"
          placeholder="${esc(BI('Mfano: 1 au 1.5','Example: 1 or 1.5'))}"
        >
      </div>

      <div class="form-field">
        <label for="variant-volume-unit">${esc(BI('Kipimo cha Volume','Volume Unit'))}</label>
        <input
          id="variant-volume-unit"
          name="volume_unit"
          required
          value="${esc(v?.volume_unit||'')}"
          placeholder="${esc(BI('Mfano: L, ml, kg','Example: L, ml, kg'))}"
        >
      </div>

    </div>
  </div>

  <div class="variant-form-section">
    <div class="variant-form-section-title">
      <span class="variant-section-number">02</span>
      <div>
        <strong>${esc(BI('Taarifa za Bei','Pricing Details'))}</strong>
        <small>${esc(BI('Bei za ununuzi na mauzo','Purchase and selling prices'))}</small>
      </div>
    </div>

    <div class="form-grid variant-modern-grid">

      <div class="form-field">
        <label for="variant-buying-price">${esc(BI('Bei ya Kununua (TSh)','Buying Price (TSh)'))}</label>
        <input
          id="variant-buying-price"
          name="buying_price"
          type="number"
          min="0"
          step="0.01"
          required
          value="${esc(v?.buying_price??0)}"
        >
      </div>

      <div class="form-field">
        <label for="variant-selling-price">${esc(BI('Bei ya Kuuza (TSh)','Selling Price (TSh)'))}</label>
        <input
          id="variant-selling-price"
          name="selling_price"
          type="number"
          min="0"
          step="0.01"
          required
          value="${esc(v?.selling_price??0)}"
        >
      </div>

      <div class="form-field">
        <label for="variant-low-stock">${esc(BI('Kiwango cha Tahadhari ya Stock','Low Stock Alert Level'))}</label>
        <input
          id="variant-low-stock"
          name="low_stock_level"
          type="number"
          min="0"
          step="0.01"
          required
          value="${esc(v?.low_stock_level??0)}"
        >
      </div>

    </div>
  </div>

  <div class="variant-form-note">
    <span class="variant-note-icon">ⓘ</span>
    <p>${esc(BI('Kumbuka: Kuunda Variant hakumaanishi kuwa stock imeongezwa. Stock huingizwa kupitia Received Stock.','Note: Creating a variant does not add stock. Stock is recorded through Received Stock.'))}</p>
  </div>

  <div class="form-actions variant-modern-actions">
    <button
      type="button"
      class="btn btn-secondary"
      data-action="close-form-modal">
      ${esc(BI('Ghairi','Cancel'))}
    </button>

    <button type="submit" class="btn btn-primary">
      ${esc(v ? BI('Hifadhi Mabadiliko','Save Changes') : BI('Unda Variant','Create Variant'))}
    </button>
  </div>

</form>

    `
  );

  $('f-variant').onsubmit=async e=>{
    e.preventDefault();

    const b=e.target.querySelector(
      'button[type="submit"]'
    );

    const d=Object.fromEntries(
      new FormData(e.target)
    );

    busy(b,true);

    try{

      const r=v

        ? await S.sb.rpc(
            'update_product_variant',
            {
              p_variant_id:v.id,
              p_unit:d.unit,
              p_volume_value:num(d.volume_value),
              p_volume_unit:q(d.volume_unit),
              p_buying_price:num(d.buying_price),
              p_selling_price:num(d.selling_price),
              p_low_stock_level:num(d.low_stock_level)
            }
          )

        : await S.sb.rpc(
            'create_product_variant',
            {
              p_product_id:productId,
              p_unit:d.unit,
              p_volume_value:num(d.volume_value),
              p_volume_unit:q(d.volume_unit),
              p_buying_price:num(d.buying_price),
              p_selling_price:num(d.selling_price),
              p_low_stock_level:num(d.low_stock_level)
            }
          );

      if(r.error) throw r.error;

      modal('form-modal',false);

      toast(
        BI(
          'Variant imehifadhiwa.',
          'Variant saved.'
        ),
        'success'
      );

      await viewProductFinal(productId);

    }catch(x){

      important(err(x));

    }finally{

      busy(b,false);

    }
  };
}

async function toggleProduct(id,active){const {error}=await S.sb.rpc('set_product_active',{p_product_id:id,p_is_active:!active});if(error)throw error;toast(BI('Hali ya bidhaa imebadilishwa.','Product status updated.'),'success');await productsFinal()}
async function toggleVariant(id,active){const {error}=await S.sb.rpc('set_product_variant_active',{p_variant_id:id,p_is_active:!active});if(error)throw error;toast(BI('Hali ya variant imebadilishwa.','Variant status updated.'),'success');await nav('products');}

async function customersFinal(){
  loadHost('customers'); const rows=await getCustomers('');
  host('customers').innerHTML=toolbar('open-customer-form',t('actions.addCustomer'))+tableFinal([
    {key:'name',label:BI('Jina','Name')},{key:'phone',label:BI('Simu','Phone')},{key:'address',label:BI('Anwani','Address')},{key:'is_active',label:BI('Hali','Status'),render:r=>badge(r.is_active?'active':'inactive')}
  ],rows,r=>`<button class="btn btn-secondary btn-sm" data-action="view-customer" data-id="${esc(r.customer_id)}">${esc(BI('Details','Details'))}</button><button class="btn btn-ghost btn-sm" data-action="edit-customer" data-id="${esc(r.customer_id)}">${esc(BI('Hariri','Edit'))}</button><button class="btn btn-secondary btn-sm" data-action="toggle-customer" data-id="${esc(r.customer_id)}" data-active="${r.is_active?'1':'0'}">${esc(r.is_active?BI('Zima','Deactivate'):BI('Washa','Activate'))}</button>`);bindModuleSearch();
}
customers=customersFinal;

async function toggleCustomer(id,active){const {error}=await S.sb.rpc('set_customer_active',{p_customer_id:id,p_is_active:!active});if(error)throw error;toast(BI('Hali ya mteja imebadilishwa.','Customer status updated.'),'success');await customersFinal()}

async function suppliersFinal(){loadHost('suppliers');if(S.role!=='owner'){host('suppliers').innerHTML=`<div class="empty-state">${esc(BI('Owner pekee.','Owner only.'))}</div>`;return}const rows=await getSuppliers('');host('suppliers').innerHTML=toolbar('open-supplier-form',t('actions.addSupplier'))+tableFinal([{key:'name',label:BI('Supplier','Supplier')},{key:'phone',label:BI('Simu','Phone')},{key:'contact_person',label:BI('Mhusika','Contact Person')},{key:'address',label:BI('Anwani','Address')},{key:'is_active',label:BI('Hali','Status'),render:r=>badge(r.is_active?'active':'inactive')}],rows,r=>`<button class="btn btn-secondary btn-sm" data-action="view-supplier" data-id="${esc(r.id)}">${esc(BI('Details','Details'))}</button><button class="btn btn-ghost btn-sm" data-action="edit-supplier" data-id="${esc(r.id)}">${esc(BI('Hariri','Edit'))}</button><button class="btn btn-secondary btn-sm" data-action="toggle-supplier" data-id="${esc(r.id)}" data-active="${r.is_active?'1':'0'}">${esc(r.is_active?BI('Zima','Deactivate'):BI('Washa','Activate'))}</button>`);bindModuleSearch()}
suppliers=suppliersFinal;
async function toggleSupplier(id,active){const {error}=await S.sb.rpc('set_supplier_active',{p_supplier_id:id,p_is_active:!active});if(error)throw error;toast(BI('Hali ya supplier imebadilishwa.','Supplier status updated.'),'success');await suppliersFinal()}

async function receivedFinal(){
  loadHost('received-stock'); if(S.role!=='owner'){host('received-stock').innerHTML=`<div class="empty-state">${esc(BI('Owner pekee.','Owner only.'))}</div>`;return;}
  const {data,error}=await S.sb.from('stock_receipts').select('id,invoice_receipt_no,supplier_id,total_amount,payment_reference,verification_status,received_at,verified_at,notes').order('received_at',{ascending:false}).limit(300);if(error)throw error;
  const suppliers=await getSuppliers(''); const sm=new Map(suppliers.map(x=>[x.id,x.name]));
  host('received-stock').innerHTML=toolbar('open-stock-receipt-form',t('actions.receiveStock'))+tableFinal([{key:'invoice_receipt_no',label:BI('Invoice/Receipt','Invoice/Receipt')},{key:'supplier_id',label:BI('Supplier','Supplier'),render:r=>esc(sm.get(r.supplier_id)||r.supplier_id||'—')},{key:'total_amount',label:BI('Jumla','Total'),render:r=>esc(money(r.total_amount))},{key:'verification_status',label:BI('Verification','Verification'),render:r=>badge(r.verification_status)},{key:'received_at',label:BI('Tarehe','Date'),render:r=>esc(date(r.received_at))}],data||[],r=>`<button class="btn btn-secondary btn-sm" data-action="view-receipt" data-id="${esc(r.id)}">${esc(BI('Details','Details'))}</button>${r.verification_status==='pending'?`<button class="btn btn-success btn-sm" data-action="verify-receipt" data-id="${esc(r.id)}">${esc(BI('Thibitisha','Verify'))}</button><button class="btn btn-danger btn-sm" data-action="reject-receipt" data-id="${esc(r.id)}">${esc(BI('Kataa','Reject'))}</button>`:''}`);bindModuleSearch();
}
received=receivedFinal;

/* RLS: ENABLED (KEEP ENABLED) */

/* RLS: ENABLED (KEEP ENABLED) */

async function verifyReceiptFinal(id){
  if(!await confirm(
    BI('Thibitisha Receipt','Verify Receipt'),
    BI('Stock itaingia kwenye inventory baada ya verification.','Stock enters inventory after verification.')
  )) return;

  const {error}=await S.sb.rpc('verify_stock_receipt',{
    p_stock_receipt_id:id
  });

  if(error)throw error;

  toast(
    BI('Receipt imethibitishwa.','Receipt verified.'),
    'success'
  );

  await receivedFinal();
}

verifyReceipt=verifyReceiptFinal;

 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SALES MODULE
   Uses the existing secure RPC:
   get_sales_for_current_user
   No direct unrestricted sales-table access.
   ========================================================= */

async function salesFinal(){

  loadHost('sales');

  const {data,error} = await S.sb.rpc(
    'get_sales_for_current_user',
    {
      p_search:'',
      p_limit:300,
      p_offset:0
    }
  );

  if(error) throw error;

  const rows = data || [];

  host('sales').innerHTML = `

    ${toolbar(
      'open-sale-form',
      t('actions.newSale')
    )}

    <div class="module-table-wrap">

      ${tableFinal(

        [
          {
            key:'receipt_no',
            label:BI(
              'Receipt No.',
              'Receipt No.'
            )
          },

          {
            key:'customer_name',
            label:BI(
              'Mteja',
              'Customer'
            ),
            render:r=>esc(
              r.customer_name ||
              BI(
                'Mteja wa Cash',
                'Cash Customer'
              )
            )
          },

          {
            key:'salesman_name',
            label:BI(
              'Salesman',
              'Salesman'
            ),
            render:r=>esc(
              r.salesman_name || '—'
            )
          },

          {
            key:'total_amount',
            label:BI(
              'Jumla',
              'Total'
            ),
            render:r=>esc(
              money(r.total_amount)
            )
          },

          {
            key:'paid_amount',
            label:BI(
              'Amelipa',
              'Paid'
            ),
            render:r=>esc(
              money(r.paid_amount)
            )
          },

          {
            key:'balance',
            label:BI(
              'Deni',
              'Balance'
            ),
            render:r=>esc(
              money(r.balance)
            )
          },

          {
            key:'payment_status',
            label:BI(
              'Malipo',
              'Payment'
            ),
            render:r=>badge(
              r.payment_status
            )
          },

          {
            key:'sale_status',
            label:BI(
              'Hali ya Mauzo',
              'Sale Status'
            ),
            render:r=>badge(
              r.sale_status
            )
          },

          {
            key:'created_at',
            label:BI(
              'Tarehe',
              'Date'
            ),
            render:r=>esc(
              date(r.created_at)
            )
          }
        ],

        rows,

        r=>`

          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-action="view-sale"
            data-id="${esc(r.sale_id)}">

            ${esc(
              BI(
                'Maelezo',
                'Details'
              )
            )}

          </button>

        `
      )}

    </div>

  `;

  bindModuleSearch();
}

sales = salesFinal;

/* CUSTOMER SALES RECEIPTS MODULE */
async function receiptsFinal() {
  loadHost('receipts');

  const { data, error } = await S.sb.rpc(
    'get_sales_for_current_user',
    {
      p_search: '',
      p_limit: 300,
      p_offset: 0
    }
  );

  if (error) throw error;

  const rows = data || [];

  host('receipts').innerHTML = `
    <div class="module-table-wrap">
      ${tableFinal(
        [
          {
            key: 'receipt_no',
            label: BI('Namba ya Risiti', 'Receipt No.')
          },
          {
            key: 'customer_name',
            label: BI('Mteja', 'Customer'),
            render: r => esc(
              r.customer_name ||
              BI('Mteja wa Cash', 'Cash Customer')
            )
          },
          {
            key: 'total_amount',
            label: BI('Jumla', 'Total'),
            render: r => esc(money(r.total_amount))
          },
          {
            key: 'paid_amount',
            label: BI('Amelipa', 'Paid'),
            render: r => esc(money(r.paid_amount))
          },
          {
            key: 'balance',
            label: BI('Salio', 'Balance'),
            render: r => esc(money(r.balance))
          },
          {
            key: 'created_at',
            label: BI('Tarehe', 'Date'),
            render: r => esc(date(r.created_at))
          }
        ],
        rows,
        r => `
          <button
            type="button"
            class="btn btn-primary btn-sm"
            data-action="open-sales-receipt"
            data-id="${esc(r.sale_id)}">
            ${BI('Fungua Risiti', 'Open Receipt')}
          </button>
        `
      )}
    </div>
  `;

  bindModuleSearch();
}

async function customerPaymentFormFinal(){
  const salesRows=(await S.sb.rpc('get_sales_for_current_user',{p_search:'',p_limit:300,p_offset:0}));if(salesRows.error)throw salesRows.error;
  const open=(salesRows.data||[]).filter(x=>x.sale_status==='completed'&&num(x.balance)>0);
  openForm(BI('Malipo ya Mteja','Customer Payment'),BI('Chagua mauzo yenye deni lililobaki.','Select a completed sale with an outstanding balance.'),`<form id="f-cpay" class="dynamic-form"><div class="form-grid"><div class="form-field full"><label>${BI('Mauzo','Sale')}</label><select name="sale_id" required>${optionList(open,'sale_id',x=>`${x.receipt_no} — ${x.customer_name||BI('Mteja wa Cash','Cash Customer')} — ${money(x.balance)}`)}</select></div><div class="form-field"><label>${BI('Kiasi','Amount')}</label><input name="amount" type="number" min="0.01" step="0.01" required></div><div class="form-field"><label>${BI('Njia ya Malipo','Payment Method')}</label><select name="payment_method"><option value="cash">Cash</option><option value="mobile_money">Mobile Money</option><option value="bank">Bank</option></select></div><div class="form-field full"><label>${BI('Reference','Reference')}</label><input name="payment_reference"></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi Malipo','Save Payment'))}</button></div></form>`);
  $('f-cpay').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=await S.sb.rpc('record_customer_payment',{p_sale_id:d.sale_id,p_amount:num(d.amount),p_payment_method:d.payment_method,p_payment_reference:q(d.payment_reference)||null});if(r.error)throw r.error;modal('form-modal',false);toast(BI('Malipo yamehifadhiwa.','Payment saved.'),'success');await paymentsFinal('customer')}catch(x){important(err(x))}finally{busy(b,false)}};
}
customerPaymentForm=customerPaymentFormFinal;

async function supplierPaymentFormFinal(){
  if(S.role!=='owner')return;
  const {data,error}=await S.sb.from('stock_receipts').select('id,invoice_receipt_no,supplier_id,total_amount,verification_status').eq('verification_status','verified').order('received_at',{ascending:false}).limit(300);if(error)throw error;
  openForm(BI('Malipo ya Supplier','Supplier Payment'),BI('Chagua receipt iliyothibitishwa.','Select a verified stock receipt.'),`<form id="f-spay" class="dynamic-form"><div class="form-grid"><div class="form-field full"><label>${BI('Receipt','Receipt')}</label><select name="stock_receipt_id" required>${optionList(data,'id',x=>`${x.invoice_receipt_no} — ${money(x.total_amount)}`)}</select></div><div class="form-field"><label>${BI('Kiasi','Amount')}</label><input name="amount" type="number" min="0.01" step="0.01" required></div><div class="form-field"><label>${BI('Njia ya Malipo','Payment Method')}</label><select name="payment_method"><option value="cash">Cash</option><option value="mobile_money">Mobile Money</option><option value="bank">Bank</option></select></div><div class="form-field full"><label>${BI('Reference','Reference')}</label><input name="payment_reference"></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi Malipo','Save Payment'))}</button></div></form>`);
  $('f-spay').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=await S.sb.rpc('record_supplier_payment',{p_stock_receipt_id:d.stock_receipt_id,p_amount:num(d.amount),p_payment_method:d.payment_method,p_payment_reference:q(d.payment_reference)||null});if(r.error)throw r.error;modal('form-modal',false);toast(BI('Malipo ya supplier yamehifadhiwa.','Supplier payment saved.'),'success');await paymentsFinal('supplier')}catch(x){important(err(x))}finally{busy(b,false)}};
}
supplierPaymentForm=supplierPaymentFormFinal;

async function paymentsFinal(kind){
  const page=kind==='customer'?'customer-payments':'supplier-payments';loadHost(page);if(kind==='supplier'&&S.role!=='owner'){host(page).innerHTML=`<div class="empty-state">${esc(BI('Owner pekee.','Owner only.'))}</div>`;return;}
  const tableName=kind==='customer'?'customer_payments':'supplier_payments';const select=kind==='customer'?'id,customer_id,sale_id,amount,payment_method,payment_reference,recorded_by,created_at':'id,supplier_id,stock_receipt_id,amount,payment_method,payment_reference,recorded_by,created_at';const {data,error}=await S.sb.from(tableName).select(select).order('created_at',{ascending:false}).limit(300);if(error)throw error;
  const names=kind==='customer'?new Map((await getCustomers('')).map(x=>[x.customer_id,x.name])):new Map((await getSuppliers('')).map(x=>[x.id,x.name]));
  const add=kind==='customer'?`<button class="btn btn-primary btn-sm" data-action="open-customer-payment-form">+ ${esc(BI('Rekodi Malipo','Record Payment'))}</button>`:`<button class="btn btn-primary btn-sm" data-action="open-supplier-payment-form">+ ${esc(BI('Rekodi Malipo','Record Payment'))}</button>`;
  host(page).innerHTML=toolbar(null,'',true)+add+tableFinal([{key:kind==='customer'?'customer_id':'supplier_id',label:BI(kind==='customer'?'Mteja':'Supplier',kind==='customer'?'Customer':'Supplier'),render:r=>esc(names.get(r[kind==='customer'?'customer_id':'supplier_id'])||r[kind==='customer'?'customer_id':'supplier_id']||'—')},{key:kind==='customer'?'sale_id':'stock_receipt_id',label:BI(kind==='customer'?'Sale':'Receipt',kind==='customer'?'Sale':'Receipt')},{key:'amount',label:BI('Kiasi','Amount'),render:r=>esc(money(r.amount))},{key:'payment_method',label:BI('Njia','Method')},{key:'payment_reference',label:'Reference'},{key:'created_at',label:BI('Tarehe','Date'),render:r=>esc(date(r.created_at))}],data||[]);bindModuleSearch();
}
payments=paymentsFinal;


async function expensesFinal(){
  loadHost('expenses');

  if (
    !['owner','developer'].includes(S.role) &&
    !(await perm('expenses.view'))
  ) {
    host('expenses').innerHTML=`<div class="empty-state">${esc(BI(
      'Huna ruhusa ya kuona gharama hizi.',
      'You do not have permission to view these expenses.'
    ))}</div>`;
    return;
  }

async function expenseFormFinal(x = null) {
  const requiredPermission = x ? 'expenses.edit' : 'expenses.create';

  if (!['owner', 'developer'].includes(S.role) &&
      !(await perm(requiredPermission))) {
    important(BI(
      'Huna ruhusa ya kufanya kitendo hiki.',
      'You do not have permission to perform this action.'
    ));
    return;
  }

}
  
  const {data,error}=await S.sb.rpc('get_expenses_v2',{p_search:''});
 
  if(error)throw error;
 

host('expenses').innerHTML=
  toolbar('open-expense-form',t('actions.addExpense'))
  .replace(
    '</div>',
    `
      <button
        class="btn btn-secondary btn-sm"
        data-action="open-expense-settings">
        ⚙ ${esc(BI('Mipangilio ya Gharama','Expenses Settings'))}
      </button>
    </div>
    `
  )
  +tableFinal([

    {key:S.lang==='sw'?'category_name_sw':'category_name_en',label:BI('Aina ya Gharama','Expense Category')},
    {key:'description',label:BI('Maelezo','Description')},
    {key:'amount',label:BI('Kiasi','Amount'),render:r=>esc(money(r.amount))},
    {key:'expense_date',label:BI('Tarehe','Date'),render:r=>esc(r.expense_date||date(r.created_at))},
    {key:'payment_method',label:BI('Njia','Method')},
    {key:'payment_reference',label:'Reference'},
    {key:'recorded_by_name',label:BI('Aliyeandika','Recorded By')}
  ],data||[],

 /* RLS: ENABLED (KEEP ENABLED) */

r=>`<button class="btn btn-ghost btn-sm" data-action="edit-expense" data-id="${esc(r.expense_id)}">${esc(BI('Hariri','Edit'))}</button><button class="btn btn-danger btn-sm" data-action="delete-expense" data-id="${esc(r.expense_id)}">${esc(BI('Futa','Delete'))}</button>`)
  bindModuleSearch();
}
expenses=expensesFinal;

 /* RLS: ENABLED (KEEP ENABLED) */
 

async function expenseSettingsFinal(){
  if(!['owner','developer'].includes(S.role)) return;

  loadHost('expenses');

  const {data,error}=await S.sb
    .from('expense_categories')
    .select('id,category_code,name_sw,name_en,category_group,allowed_role,is_active')
    .order('name_sw');

  if(error) throw error;

  const rows=data||[];

  host('expenses').innerHTML=
    toolbar(
      'open-expense-category-form',
      BI('Ongeza Aina ya Gharama','Add Expense Category')
    )+
    tableFinal([
      {key:'category_code',label:'Code'},
      {key:S.lang==='sw'?'name_sw':'name_en',label:BI('Jina','Name')},
      {key:'category_group',label:BI('Kundi','Group')},
      {key:'allowed_role',label:BI('Ruhusa','Allowed Role')},
      {
        key:'is_active',
        label:BI('Hali','Status'),
        render:r=>esc(r.is_active?BI('Hai','Active'):BI('Imezimwa','Inactive'))
      }
    ],rows,r=>`
      <button class="btn btn-ghost btn-sm"
        data-action="edit-expense-category"
        data-id="${esc(r.id)}">
        ${esc(BI('Hariri','Edit'))}
      </button>
      <button class="btn btn-secondary btn-sm"
        data-action="toggle-expense-category"
        data-id="${esc(r.id)}"
        data-active="${r.is_active?'1':'0'}">
        ${esc(r.is_active?BI('Zima','Deactivate'):BI('Washa','Activate'))}
      </button>
    `);

  bindModuleSearch();
}

/* RLS: ENABLED — usiizime */

async function expenseCategoryFormFinal(id=null){
  if(!['owner','developer'].includes(S.role)) return;

  let c=null;

  if(id){
    const {data,error}=await S.sb
      .from('expense_categories')
      .select('id,category_code,name_sw,name_en,category_group,allowed_role,is_active')
      .eq('id',id)
      .maybeSingle();

    if(error) throw error;
    if(!data) throw Error(BI('Aina ya gharama haijapatikana.','Expense category not found.'));
    c=data;
  }

  openForm(
    c ? BI('Hariri Aina ya Gharama','Edit Expense Category')
      : BI('Ongeza Aina ya Gharama','Add Expense Category'),
    BI('Jaza taarifa za aina ya gharama.','Enter expense category details.'),
    `<form id="f-expense-category" class="dynamic-form">
      <div class="form-grid">

        <div class="form-field">
          <label>Code</label>
          <input name="category_code" required maxlength="30"
            value="${esc(c?.category_code||'')}">
        </div>

        <div class="form-field">
          <label>${BI('Kundi','Group')}</label>
          <input name="category_group" required
            value="${esc(c?.category_group||'general')}">
        </div>

        <div class="form-field">
          <label>${BI('Jina kwa Kiswahili','Swahili Name')}</label>
          <input name="name_sw" required
            value="${esc(c?.name_sw||'')}">
        </div>

        <div class="form-field">
          <label>${BI('Jina kwa Kiingereza','English Name')}</label>
          <input name="name_en" required
            value="${esc(c?.name_en||'')}">
        </div>

        <div class="form-field">
          <label>${BI('Nani anaruhusiwa?','Who is allowed?')}</label>
          <select name="allowed_role" required>
            <option value="both" ${c?.allowed_role==='both'?'selected':''}>${BI('Owner na Salesman','Owner and Salesman')}</option>
            <option value="owner" ${c?.allowed_role==='owner'?'selected':''}>Owner</option>
            <option value="salesman" ${c?.allowed_role==='salesman'?'selected':''}>Salesman</option>
          </select>
        </div>

        <div class="form-field">
          <label>${BI('Hali','Status')}</label>
          <select name="is_active">
            <option value="true" ${c?.is_active!==false?'selected':''}>${BI('Hai','Active')}</option>
            <option value="false" ${c?.is_active===false?'selected':''}>${BI('Imezimwa','Inactive')}</option>
          </select>
        </div>

      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary"
          data-action="close-form-modal">${esc(t('common.cancel'))}</button>
        <button type="submit" class="btn btn-primary">
          ${BI('Hifadhi','Save')}
        </button>
      </div>
    </form>`
  );

  $('f-expense-category').onsubmit=async e=>{
    e.preventDefault();

    const b=e.target.querySelector('button[type="submit"]');
    const d=Object.fromEntries(new FormData(e.target));

    const payload={
      category_code:q(d.category_code).toUpperCase(),
      name_sw:q(d.name_sw),
      name_en:q(d.name_en),
      category_group:q(d.category_group),
      allowed_role:d.allowed_role,
      is_active:d.is_active==='true'
    };

    busy(b,true);

    try{
      const result=c
        ? await S.sb.from('expense_categories')
            .update(payload).eq('id',c.id)
        : await S.sb.from('expense_categories')
            .insert(payload);

      if(result.error) throw result.error;

      modal('form-modal',false);
      toast(BI('Aina ya gharama imehifadhiwa.','Expense category saved.'),'success');
      await expenseSettingsFinal();
    }catch(error){
      important(err(error));
    }finally{
      busy(b,false);
    }
  };
}


async function toggleExpenseCategoryFinal(id,isActive){
  if(!['owner','developer'].includes(S.role)){
    throw Error(BI('Huna ruhusa ya kubadilisha aina ya gharama.','You cannot change expense categories.'));
  }

  const message=isActive
    ? BI('Zima aina hii ya gharama?','Deactivate this expense category?')
    : BI('Washa aina hii ya gharama?','Activate this expense category?');

  if(!await confirm(
    BI('Thibitisha','Confirm'),
    message
  )) return;

  const {error}=await S.sb
    .from('expense_categories')
    .update({is_active:!isActive})
    .eq('id',id);

  if(error) throw error;

  toast(
    BI('Hali ya aina ya gharama imebadilishwa.','Expense category status updated.'),
    'success'
  );

  await expenseSettingsFinal();
}


async function expenseFormFinal(x=null){
  const requiredPermission = x ? 'expenses.edit' : 'expenses.create';

  if (
    !['owner','developer'].includes(S.role) &&
    !(await perm(requiredPermission))
  ) {
    important(BI(
      'Huna ruhusa ya kufanya kitendo hiki.',
      'You do not have permission to perform this action.'
    ));
    return;
  }


  let existing=x;

  if(x && x.id && !x.expense_date){
    const {data,error}=await S.sb
      .from('expenses')

      .select(
  'id,category,category_id,description,amount,expense_date,period_start,period_end,payment_method,payment_reference'
)
      .eq('id',x.id)
      .maybeSingle();

    if(error) throw error;

    existing=data||x;
  }

  
const {data:expenseCategories,error:categoriesError} =
  await S.sb
    .from('expense_categories')
    .select('id,category_code,name_sw,name_en,allowed_role')
    .eq('is_active',true)
    .order('name_sw');

if(categoriesError) throw categoriesError;

const cats = expenseCategories || [];

const currentDate =
  existing?.expense_date || today();

const methods = [
  ['cash','Cash'],
  ['mobile_money','Mobile Money'],
  ['bank','Bank']
];

  openForm(
    existing
      ? BI('Hariri Gharama','Edit Expense')
      : t('actions.addExpense'),

    BI(
      'Jaza taarifa za gharama.',
      'Enter the expense information.'
    ),

    `<form id="f-expense" class="dynamic-form">

      <div class="form-grid">

        <div class="form-field">

          <label>
            ${BI('Category','Category')}
          </label>
 
<select
  id="expense-category"
  name="category_id"
  required
>
  ${cats.map(c=>`
    <option
      value="${esc(c.id)}"
      ${existing?.category_id===c.id?'selected':''}
    >
      ${esc(S.lang==='sw' ? c.name_sw : c.name_en)}
    </option>
  `).join('')}
</select>


        </div>
 


        <div class="form-field">

          <label>
            ${BI('Kiasi','Amount')}
          </label>

          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value="${esc(existing?.amount??'')}"
          >

        </div>


        <div class="form-field">

          <label>
            ${BI(
              'Tarehe ya Gharama',
              'Expense Date'
            )}
          </label>

          <input
            name="expense_date"
            type="date"
            required
            value="${esc(currentDate)}"
          >

        </div>


<div class="form-field">
  <label>
    ${BI('Kipindi Kinaanza','Period Start')}
  </label>
  <input
    name="period_start"
    type="date"
    required
    value="${esc(existing?.period_start || currentDate)}"
  >
</div>

<div class="form-field">
  <label>
    ${BI('Kipindi Kinaisha','Period End')}
  </label>
  <input
    name="period_end"
    type="date"
    required
    value="${esc(existing?.period_end || currentDate)}"
  >
</div>


        <div class="form-field">

          <label>
            ${BI(
              'Njia ya Malipo',
              'Payment Method'
            )}
          </label>

          <select
            name="payment_method"
            required
          >

            ${methods.map(([v,l])=>`

              <option
                value="${v}"
                ${
                  existing?.payment_method===v
                    ? 'selected'
                    : ''
                }
              >
                ${l}
              </option>

            `).join('')}

          </select>

        </div>


        <div class="form-field">

          <label>
            ${BI(
              'Payment Reference',
              'Payment Reference'
            )}
          </label>

          <input
            name="payment_reference"
            value="${esc(
              existing?.payment_reference||''
            )}"
          >

        </div>


        <div class="form-field full">

          <label>
            ${BI('Maelezo','Description')}
          </label>

          <textarea
            name="description"
            required
          >${esc(existing?.description||'')}</textarea>

        </div>

      </div>


      <div class="form-actions">

        <button
          type="button"
          class="btn btn-secondary"
          data-action="close-form-modal"
        >
          ${esc(t('common.cancel'))}
        </button>

        <button
          type="submit"
          class="btn btn-primary"
        >
          ${esc(
            BI('Hifadhi','Save')
          )}
        </button>

      </div>

    </form>`
  );


  $('f-expense').onsubmit=async e=>{

    e.preventDefault();

    const b =
      e.target.querySelector(
        'button[type=submit]'
      );

    const d =
      Object.fromEntries(
        new FormData(e.target)
      );

    busy(b,true);

    try{

 
const args = {
  p_category_id: d.category_id,
  p_description: q(d.description),
  p_amount: num(d.amount),
  p_expense_date: d.expense_date,
  p_period_start: d.period_start,
  p_period_end: d.period_end,
  p_payment_method: d.payment_method,
  p_payment_reference: q(d.payment_reference) || null
};



      const r =
        existing
          ? await S.sb.rpc(
              'update_expense_v2',
              {
                p_expense_id:existing.id,
                ...args
              }
            )
          : await S.sb.rpc(
              'create_expense_v2',
              args
            );

      if(r.error)
        throw r.error;


      modal(
        'form-modal',
        false
      );

      toast(
        BI(
          'Gharama imehifadhiwa.',
          'Expense saved.'
        ),
        'success'
      );

      S.reportCache=null;

      await expensesFinal();

    }catch(z){

      important(err(z));

    }finally{

      busy(b,false);

    }
  };
}

expenseForm=expenseFormFinal;

 
async function deleteExpenseFinal(id) {
  if (!['owner', 'developer'].includes(S.role)) {
    throw new Error(
      BI(
        'Huna ruhusa ya kufuta gharama.',
        'You do not have permission to delete expenses.'
      )
    );
  }

  if (
    !await confirm(
      BI('Futa Gharama', 'Delete Expense'),
      BI(
        'Kitendo hakiwezi kurudishwa.',
        'This action cannot be undone.'
      )
    )
  ) return;

  const { data, error } = await S.sb.rpc(
    'delete_expense_v2',
    { p_expense_id: id }
  );

  if (error) throw error;

  if (data !== true) {
    throw new Error(
      BI(
        'Gharama haikufutwa.',
        'Expense was not deleted.'
      )
    );
  }

  S.reportCache = null;

  toast(
    BI('Gharama imefutwa.', 'Expense deleted.'),
    'success'
  );

  await expensesFinal();
}

deleteExpense = deleteExpenseFinal;


 /* RLS: ENABLED (KEEP ENABLED) */

async function stockFinal(){

  loadHost('stock');

  const {data,error}=
    await S.sb.rpc('get_salesman_stock');

  if(error) throw error;

  const rows=data||[];

  /* Read Owner's Low Stock setting */
  const lowStockEnabled=
    await isLowStockEnabled();

  /* Attach setting state to each row */
  const displayRows=
    rows.map(r=>({
      ...r,
      _lowStockEnabled:
        lowStockEnabled
    }));

  host('stock').innerHTML=
    toolbar(null,'',true)+
    tableFinal([

      {
        key:'product_name',
        label:BI(
          'Bidhaa',
          'Product'
        )
      },

      {
        key:'unit',
        label:BI(
          'Unit',
          'Unit'
        )
      },

      {
        key:'volume_value',
        label:BI(
          'Volume',
          'Volume'
        ),
        render:r=>
          esc(
            `${r.volume_value??''} ${r.volume_unit??''}`
              .trim()
          )
      },

      {
        key:'selling_price',
        label:BI(
          'Bei',
          'Selling Price'
        ),
        render:r=>
          esc(
            money(r.selling_price)
          )
      },

      {
        key:'current_stock',
        label:BI(
          'Stock Iliyopo',
          'Current Stock'
        )
      },

      {
        key:'low_stock_level',
        label:BI(
          'Kiwango cha Chini',
          'Low Stock'
        )
      },

      {
        key:'is_low_stock',

        label:BI(
          'Hali',
          'Status'
        ),

        render:r=>{

          if(!r._lowStockEnabled){

            return badge('ok');

          }

          return badge(
            r.is_low_stock
              ? 'low'
              : 'ok'
          );

        }
      }

    ],displayRows);

  bindModuleSearch();
}
  
async function stockAdjustmentsFinal(){
  loadHost('stock-adjustments');const {data,error}=await S.sb.from('stock_adjustments').select('id,product_id,quantity,reason,adjustment_type,recorded_by,approved_by,approved_at,created_at').order('created_at',{ascending:false}).limit(300);if(error)throw error;
  const products=await (async()=>{const r=await S.sb.rpc(S.role==='owner'?'get_products_for_owner':'get_products_for_sale');if(r.error)throw r.error;return r.data||[]})();const pm=new Map(products.map(x=>[x.id,x.name]));
  const canCreate=S.role==='owner'||await perm('stock.adjust');
  host('stock-adjustments').innerHTML=toolbar(canCreate?'open-stock-adjustment-form':'',canCreate?BI('Ongeza Adjustment','Add Adjustment'):'',true)+tableFinal([{key:'product_id',label:BI('Bidhaa','Product'),render:r=>esc(pm.get(r.product_id)||r.product_id)},{key:'quantity',label:BI('Quantity','Quantity')},{key:'adjustment_type',label:BI('Aina','Type'),render:r=>badge(r.adjustment_type)},{key:'reason',label:BI('Sababu','Reason')},{key:'created_at',label:BI('Tarehe','Date'),render:r=>esc(date(r.created_at))}],data||[]);bindModuleSearch();
}

async function stockAdjustmentForm(){
  const r=await S.sb.rpc(S.role==='owner'?'get_products_for_owner':'get_products_for_sale');if(r.error)throw r.error;const rows=r.data||[];
  openForm(BI('Stock Adjustment','Stock Adjustment'),BI('Adjustment inaingia kwenye stock ledger kupitia database.','The adjustment is written to the stock ledger through the database.'),`<form id="f-adjust" class="dynamic-form"><div class="form-grid"><div class="form-field full"><label>${BI('Bidhaa','Product')}</label><select name="product_id" required>${optionList(rows,'id',x=>x.name)}</select></div><div class="form-field"><label>${BI('Quantity','Quantity')}</label><input name="quantity" type="number" min="0.01" step="0.01" required></div><div class="form-field"><label>${BI('Aina','Type')}</label><select name="adjustment_type"><option value="increase">${BI('Ongeza','Increase')}</option><option value="decrease">${BI('Punguza','Decrease')}</option></select></div><div class="form-field full"><label>${BI('Sababu','Reason')}</label><textarea name="reason" required></textarea></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi','Save'))}</button></div></form>`);
  $('f-adjust').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=await S.sb.from('stock_adjustments').insert({product_id:d.product_id,quantity:num(d.quantity),reason:q(d.reason),adjustment_type:d.adjustment_type}).select('id').single();if(r.error)throw r.error;modal('form-modal',false);toast(BI('Adjustment imehifadhiwa.','Adjustment saved.'),'success');await stockAdjustmentsFinal()}catch(x){important(err(x))}finally{busy(b,false)}};
}

async function salesReturnsFinal(){
  loadHost('sales-returns');const {data,error}=await S.sb.from('sales_returns').select('id,sale_id,product_id,variant_id,quantity,amount,reason,recorded_by,created_at').order('created_at',{ascending:false}).limit(300);if(error)throw error;
  const products=await (async()=>{const r=await S.sb.rpc('get_products_for_sale');if(r.error)throw r.error;return r.data||[]})();const pm=new Map(products.map(x=>[x.id,x.name]));
  const canCreate=S.role==='owner'||await perm('sales.return');
  host('sales-returns').innerHTML=toolbar(canCreate?'open-sales-return-form':'',canCreate?BI('Ongeza Return','Add Return'):'',true)+tableFinal([{key:'sale_id',label:BI('Sale','Sale')},{key:'product_id',label:BI('Bidhaa','Product'),render:r=>esc(pm.get(r.product_id)||r.product_id)},{key:'variant_id',label:BI('Variant','Variant')},{key:'quantity',label:BI('Quantity','Quantity')},{key:'amount',label:BI('Amount','Amount'),render:r=>esc(money(r.amount))},{key:'reason',label:BI('Sababu','Reason')},{key:'created_at',label:BI('Tarehe','Date'),render:r=>esc(date(r.created_at))}],data||[]);bindModuleSearch();
}

async function salesReturnForm(){
  const s=await S.sb.rpc('get_sales_for_current_user',{p_search:'',p_limit:300,p_offset:0});if(s.error)throw s.error;const completed=(s.data||[]).filter(x=>x.sale_status==='completed');
  openForm(BI('Sales Return','Sales Return'),BI('Amount huhesabiwa na trigger ya database.','Amount is calculated by the database trigger.'),`<form id="f-return" class="dynamic-form"><div class="form-grid"><div class="form-field full"><label>${BI('Sale','Sale')}</label><select name="sale_id" required>${optionList(completed,'sale_id',x=>`${x.receipt_no} — ${x.customer_name||BI('Cash','Cash')}`)}</select></div><div class="form-field"><label>${BI('Product ID','Product ID')}</label><input name="product_id" required placeholder="UUID"></div><div class="form-field"><label>${BI('Variant ID','Variant ID')}</label><input name="variant_id" required placeholder="UUID"></div><div class="form-field"><label>${BI('Quantity','Quantity')}</label><input name="quantity" type="number" min="0.01" step="0.01" required></div><div class="form-field full"><label>${BI('Sababu','Reason')}</label><textarea name="reason" required></textarea></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi Return','Save Return'))}</button></div></form>`);
  $('f-return').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=await S.sb.from('sales_returns').insert({sale_id:d.sale_id,product_id:d.product_id,variant_id:d.variant_id,quantity:num(d.quantity),reason:q(d.reason)}).select('id').single();if(r.error)throw r.error;modal('form-modal',false);toast(BI('Return imehifadhiwa.','Return saved.'),'success');await salesReturnsFinal()}catch(x){important(err(x))}finally{busy(b,false)}};
}

 /* RLS: ENABLED (KEEP ENABLED) */

async function settingsFinal(){

  loadHost('settings');

  if(S.role!=='owner'){
    host('settings').innerHTML=`
      <div class="empty-state">
        ${esc(BI('Owner pekee.','Owner only.'))}
      </div>
    `;
    return;
  }

  const {data,error}=await S.sb
    .from('settings')
    .select(
      'id,setting_key,setting_value,description,updated_by,created_at,updated_at'
    )
    .order('setting_key');

  if(error) throw error;

  const rows=data||[];



  const businessRows=rows.filter(r =>
    ['business_name','system_name'].includes(r.setting_key)
  );

 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SETTINGS CATEGORIES
   ========================================================= */

const receiptRows=rows.filter(r =>
  ['receipt_prefix','receipt_number_digits']
    .includes(r.setting_key)
);

const stockRows=rows.filter(r =>
  ['low_stock_enabled']
    .includes(r.setting_key)
);

const systemRows=rows.filter(r =>
  ['default_language']
    .includes(r.setting_key)
);

const settingCard=(r)=>{

  const labels={
    business_name:BI('Jina la Biashara','Business Name'),
    system_name:BI('Jina la Mfumo','System Name'),
    receipt_prefix:BI('Prefix ya Receipt','Receipt Prefix'),
    receipt_number_digits:BI('Namba za Receipt','Receipt Number Digits'),
    low_stock_enabled:BI('Tahadhari ya Stock Ndogo','Low Stock Alerts'),
    default_language:BI('Lugha ya Mfumo','System Language')
  };

  return `
    <article class="settings-item-card">

      <div class="settings-item-main">

        <div class="settings-item-label">
          ${esc(
            labels[r.setting_key] || r.setting_key
          )}
        </div>

        <div class="settings-item-value">
          ${esc(r.setting_value||'—')}
        </div>

        ${
          r.description
            ? `
              <div class="settings-item-description">
                ${esc(r.description)}
              </div>
            `
            : ''
        }

      </div>

      <button
        type="button"
        class="btn btn-ghost btn-sm"
        data-action="edit-setting"
        data-id="${esc(r.id)}">
        ${esc(BI('Hariri','Edit'))}
      </button>

    </article>
  `;
};

const settingsCategory=(
  eyebrowSw,
  eyebrowEn,
  titleSw,
  titleEn,
  descriptionSw,
  descriptionEn,
  icon,
  categoryRows
)=>`

  <div class="settings-category">

    <div class="settings-category-header">

      <div>

        <span class="settings-category-eyebrow">
          ${esc(BI(eyebrowSw,eyebrowEn))}
        </span>

        <h2>
          ${esc(BI(titleSw,titleEn))}
        </h2>

        <p>
          ${esc(
            BI(
              descriptionSw,
              descriptionEn
            )
          )}
        </p>

      </div>

      <span class="settings-category-icon">
        ${icon}
      </span>

    </div>

    <div class="settings-items">

      ${
        categoryRows.length
          ? categoryRows.map(settingCard).join('')
          : `
            <div class="empty-state">
              ${esc(
                BI(
                  'Hakuna settings katika kundi hili.',
                  'No settings found in this category.'
                )
              )}
            </div>
          `
      }

    </div>

  </div>

`;

host('settings').innerHTML=`

  ${toolbar(
    'open-setting-form',
    BI('Ongeza Setting','Add Setting'),
    true
  )}

  <!-- BUSINESS INFORMATION -->

  <div class="settings-category">

    <div class="settings-category-header">

      <div>

        <span class="settings-category-eyebrow">
          ${esc(
            BI('Biashara','Business')
          )}
        </span>

        <h2>
          ${esc(
            BI(
              'Taarifa za Biashara',
              'Business Information'
            )
          )}
        </h2>

        <p>
          ${esc(
            BI(
              'Taarifa kuu zinazotambulisha biashara na mfumo.',
              'Core information that identifies the business and system.'
            )
          )}
        </p>

      </div>

      <span class="settings-category-icon">
        🏢
      </span>

    </div>

    <div class="settings-items">

      ${
        businessRows.length
          ? businessRows.map(settingCard).join('')
          : `
            <div class="empty-state">
              ${esc(
                BI(
                  'Hakuna taarifa za biashara.',
                  'No business information settings found.'
                )
              )}
            </div>
          `
      }

    </div>

  </div>

  <!-- RECEIPT & SALES -->

  ${settingsCategory(
    'Mauzo na Receipt',
    'Sales & Receipt',
    'Mipangilio ya Receipt',
    'Receipt & Sales',
    'Mipangilio inayodhibiti namba na muundo wa receipt.',
    'Settings that control receipt numbering and configuration.',
    '🧾',
    receiptRows
  )}

  <!-- STOCK -->

  ${settingsCategory(
    'Stock',
    'Stock',
    'Mipangilio ya Stock',
    'Stock Settings',
    'Mipangilio inayohusiana na tahadhari za stock.',
    'Settings related to stock alerts.',
    '📦',
    stockRows
  )}

  <!-- LANGUAGE & SYSTEM -->

  ${settingsCategory(
    'Mfumo',
    'System',
    'Lugha na Mfumo',
    'Language & System',
    'Mipangilio ya msingi ya matumizi ya mfumo.',
    'Core system usage settings.',
    '🌐',
    systemRows
  )}

`;

bindModuleSearch();
}

/* RLS: ENABLED (KEEP ENABLED) */

 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   SETTINGS FORM
   Uses the correct input type for each known system setting.
   Existing setting keys are protected from accidental changes.
   ========================================================= */

async function settingForm(id=null){

  let x=null;

  /* Load existing setting when editing */
  if(id){

    const {data,error}=await S.sb
      .from('settings')
      .select('*')
      .eq('id',id)
      .maybeSingle();

    if(error) throw error;

    x=data;
  }

  const key=x?.setting_key||'';

  const isExisting=!!x;

  /* -----------------------------------------
     Setting metadata
     ----------------------------------------- */

  const labels={
    business_name:BI('Jina la Biashara','Business Name'),
    system_name:BI('Jina la Mfumo','System Name'),
    receipt_number_digits:BI('Idadi ya Namba za Risiti','Receipt Number Digits'),
    receipt_prefix:BI('Prefix ya Risiti','Receipt Prefix'),
    low_stock_enabled:BI('Tahadhari ya Stock Ndogo','Low Stock Alerts'),
    default_language:BI('Lugha ya Mfumo','System Language')
  };

  const descriptions={
    business_name:BI(
      'Jina rasmi la biashara.',
      'Official business name.'
    ),

    system_name:BI(
      'Jina rasmi la mfumo.',
      'Official system name.'
    ),

    receipt_number_digits:BI(
      'Idadi ya tarakimu zinazotumika kwenye mfululizo wa namba za risiti.',
      'Number of digits used for the receipt sequence.'
    ),

    receipt_prefix:BI(
      'Prefix inayotumika kwenye namba za risiti.',
      'Prefix used for receipt numbers.'
    ),

    low_stock_enabled:BI(
      'Washa au zima tahadhari ya stock ndogo.',
      'Enable or disable low stock alerts.'
    ),

    default_language:BI(
      'Lugha ya mfumo kwa watumiaji wapya au browser ambayo haijawahi kuchagua lugha.',
      'Default system language for new users or browsers without a saved language preference.'
    )
  };

  /* -----------------------------------------
     Build the correct Value control
     ----------------------------------------- */

  let valueControl='';

  if(key==='low_stock_enabled'){

    const currentValue=
      String(x?.setting_value||'').toLowerCase()==='true';

    valueControl=`

      <select
        name="setting_value"
        required>

        <option
          value="true"
          ${currentValue?'selected':''}>
          ${esc(BI('Washa','Enabled'))}
        </option>

        <option
          value="false"
          ${!currentValue?'selected':''}>
          ${esc(BI('Zima','Disabled'))}
        </option>

      </select>

    `;

  }else if(key==='default_language'){

    const currentValue=
      String(x?.setting_value||'sw').toLowerCase()==='en'
        ? 'en'
        : 'sw';

    valueControl=`

      <select
        name="setting_value"
        required>

        <option
          value="sw"
          ${currentValue==='sw'?'selected':''}>
          Kiswahili (SW)
        </option>

        <option
          value="en"
          ${currentValue==='en'?'selected':''}>
          English (EN)
        </option>

      </select>

    `;

/* RLS: ENABLED (KEEP ENABLED) */

}else if(key==='low_stock_enabled'){

  const currentValue =
    String(
      x?.setting_value || ''
    )
    .trim()
    .toLowerCase() === 'true';

  valueControl = `

    <select
      name="setting_value"
      required>

      <option
        value="true"
        ${currentValue ? 'selected' : ''}>
        ${esc(
          BI(
            'Washa',
            'Enabled'
          )
        )}
      </option>

      <option
        value="false"
        ${!currentValue ? 'selected' : ''}>
        ${esc(
          BI(
            'Zima',
            'Disabled'
          )
        )}
      </option>

    </select>

  `;

  }else if(key==='receipt_number_digits'){

    valueControl=`

      <input
        name="setting_value"
        type="number"
        min="1"
        max="12"
        step="1"
        required
        value="${esc(x?.setting_value||'')}">

    `;

  }else{

    valueControl=`

      <input
        name="setting_value"
        type="text"
        required
        value="${esc(x?.setting_value||'')}">

    `;
  }

  /* -----------------------------------------
     Setting key field
     ----------------------------------------- */

  const keyControl=`

    <input
      name="setting_key"
      type="text"
      required
      value="${esc(key)}"
      ${isExisting?'readonly':''}>

  `;

  /* -----------------------------------------
     Open form
     ----------------------------------------- */

  openForm(

    id
      ? BI('Hariri Setting','Edit Setting')
      : BI('Ongeza Setting','Add Setting'),

    BI(
      'Mipangilio ya mfumo inasimamiwa na Owner.',
      'System settings are managed by the Owner.'
    ),

    `

      <form
        id="f-setting"
        class="dynamic-form">

        <div class="form-grid">

          <div class="form-field">

            <label>
              ${esc(BI('Key','Key'))}
            </label>

            ${keyControl}

          </div>


          <div class="form-field">

            <label>
              ${esc(
                labels[key] ||
                BI('Value','Value')
              )}
            </label>

            ${valueControl}

          </div>


          <div class="form-field full">

            <label>
              ${esc(
                BI(
                  'Maelezo',
                  'Description'
                )
              )}
            </label>

            <textarea
              name="description"
              rows="4"
              placeholder="${esc(
                BI(
                  'Maelezo ya setting...',
                  'Setting description...'
                )
              )}">${esc(
                x?.description ||
                descriptions[key] ||
                ''
              )}</textarea>

          </div>

        </div>


        <div class="form-actions">

          <button
            type="button"
            class="btn btn-secondary"
            data-action="close-form-modal">

            ${esc(
              t('common.cancel')
            )}

          </button>


          <button
            type="submit"
            class="btn btn-primary">

            ${esc(
              BI(
                'Hifadhi',
                'Save'
              )
            )}

          </button>

        </div>

      </form>

    `
  );


  /* -----------------------------------------
     Submit handler
     ----------------------------------------- */

  const form=$('f-setting');

  if(!form) return;


  form.onsubmit=async e=>{

    e.preventDefault();

    const b=
      form.querySelector(
        'button[type="submit"]'
      );

    const d=
      Object.fromEntries(
        new FormData(form)
      );


    busy(b,true);


    try{

      const cleanKey=
        q(d.setting_key);

      const cleanValue=
        q(d.setting_value);

      const cleanDescription=
        q(d.description)||null;


      if(!cleanKey){

        throw new Error(
          BI(
            'Setting key inahitajika.',
            'Setting key is required.'
          )
        );

      }


      if(!cleanValue){

        throw new Error(
          BI(
            'Setting value inahitajika.',
            'Setting value is required.'
          )
        );

      }


      /* Validate receipt digits */

      if(
        cleanKey==='receipt_number_digits'
      ){

        const digits=
          Number(cleanValue);

        if(
          !Number.isInteger(digits) ||
          digits<1 ||
          digits>12
        ){

          throw new Error(
            BI(
              'Receipt number digits lazima iwe namba kati ya 1 na 12.',
              'Receipt number digits must be an integer between 1 and 12.'
            )
          );

        }

      }


      /* Validate low stock */

      if(
        cleanKey==='low_stock_enabled' &&
        !['true','false'].includes(
          cleanValue.toLowerCase()
        )
      ){

        throw new Error(
          BI(
            'Low stock alerts lazima iwe true au false.',
            'Low stock alerts must be true or false.'
          )
        );

      }


      /* Validate language */

      if(
        cleanKey==='default_language' &&
        !['sw','en'].includes(
          cleanValue.toLowerCase()
        )
      ){

        throw new Error(
          BI(
            'Lugha lazima iwe SW au EN.',
            'Language must be SW or EN.'
          )
        );

      }


      let r;


      /* -------------------------------------
         UPDATE EXISTING SETTING
         ------------------------------------- */

      if(id){

        r=await S.sb
          .from('settings')
          .update({

            setting_value:
              cleanValue,

            description:
              cleanDescription,

            updated_by:
              S.user.id,

            updated_at:
              new Date().toISOString()

          })
          .eq('id',id);

      }


      /* -------------------------------------
         INSERT NEW SETTING
         ------------------------------------- */

      else{

        r=await S.sb
          .from('settings')
          .insert({

            setting_key:
              cleanKey,

            setting_value:
              cleanValue,

            description:
              cleanDescription,

            updated_by:
              S.user.id

          })
          .select('id')
          .single();

      }


      if(r.error){

        throw r.error;

      }


      /* Close modal */

      modal(
        'form-modal',
        false
      );


      /* Success message */

      toast(
        BI(
          'Setting imehifadhiwa.',
          'Setting saved successfully.'
        ),
        'success'
      );


      /* Reload Settings UI */

      await settingsFinal();


      /* If system language changed,
         immediately apply it. */

      if(
        cleanKey==='default_language'
      ){

        S.lang=
          cleanValue.toLowerCase()==='en'
            ? 'en'
            : 'sw';

        localStorage.setItem(
          'sgc.language',
          S.lang
        );

        applyLang();

      }


    }catch(x){

      important(
        err(x)
      );

    }finally{

      busy(
        b,
        false
      );

    }

  };

}


async function userMgmtFinal() {
  loadHost('user-management');

  if (!['developer', 'owner'].includes(S.role)) {
    host('user-management').innerHTML =
      `<div class="empty-state">${esc(BI(
        'Developer au Owner pekee.',
        'Developer or Owner only.'
      ))}</div>`;
    return;
  }

  const { data, error } = await S.sb
    .from('profiles')
    .select('id,full_name,email,username,phone,role,account_status,is_active,created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  host('user-management').innerHTML =
    `<div class="table-toolbar">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input class="search-input module-search"
          type="search"
          placeholder="${esc(BI('Tafuta mtumiaji...','Search user...'))}">
      </div>
      <button class="btn btn-secondary btn-sm" data-action="reload-page">
        ↻ ${esc(t('actions.reload'))}
      </button>
    </div>` +
    tableFinal(
      [
        { key: 'full_name', label: BI('Jina', 'Name') },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        {
          key: 'account_status',
          label: BI('Hali', 'Status'),
          render: r => badge(r.account_status)
        },
        {
          key: 'is_active',
          label: 'Active',
          render: r => badge(r.is_active ? 'active' : 'inactive')
        }
      ],
      data || [],
      r => `
        ${r.account_status === 'pending' ? `
          <button class="btn btn-success btn-sm"
            data-action="approve-salesman" data-id="${esc(r.id)}">
            ${esc(BI('Approve Salesman','Approve Salesman'))}
          </button>
          <button class="btn btn-warning btn-sm"
            data-action="approve-owner" data-id="${esc(r.id)}">
            ${esc(BI('Approve Owner','Approve Owner'))}
          </button>
          <button class="btn btn-danger btn-sm"
            data-action="reject-user" data-id="${esc(r.id)}">
            ${esc(BI('Kataa','Reject'))}
          </button>
        ` : ''}

        ${r.role === 'salesman' && r.is_active &&
          r.account_status === 'approved' ? `
          <button class="btn btn-primary btn-sm"
            data-action="manage-user-permissions"
            data-id="${esc(r.id)}">
            ${esc(BI('Manage Permissions','Manage Permissions'))}
          </button>
        ` : ''}

        <button class="btn btn-secondary btn-sm"
          data-action="reset-code" data-id="${esc(r.id)}">
          ${esc(BI('Reset Code','Reset Code'))}
        </button>
      `
    );

  bindModuleSearch();
}

userMgmt = userMgmtFinal;
 

async function manageUserPermissions(userId) {
  if (!['developer', 'owner'].includes(S.role)) {
    throw new Error('Not authorized to manage permissions.');
  }


  const { data: user, error: userError } = await S.sb
    .from('profiles')
    .select('id,full_name,username,role,is_active,account_status')
    .eq('id', userId)
    .eq('role', 'salesman')
    .eq('is_active', true)
    .eq('account_status', 'approved')
    .single();

  if (userError) throw userError;

  const { data: permissions, error: permissionsError } = await S.sb
    .from('permissions')
    .select('id,permission_code,permission_name,permission_group,description')
    .order('permission_group')
    .order('permission_code');

  if (permissionsError) throw permissionsError;

  const { data: assigned, error: assignedError } = await S.sb
    .from('user_permissions')
    .select('permission_id,allowed')
    .eq('user_id', userId);

  if (assignedError) throw assignedError;

  const allowedIds = new Set(
    (assigned || [])
      .filter(p => p.allowed === true)
      .map(p => p.permission_id)
  );

  const groups = {};

  for (const p of permissions || []) {
    const group = p.permission_group || 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(p);
  }

  const permissionHtml = Object.entries(groups).map(([group, items]) => `
    <section class="permission-group">
      <h3>${esc(group)}</h3>
      ${items.map(p => `
        <label class="permission-option">
          <input type="checkbox"
            name="permission-code"
            value="${esc(p.id)}"
            ${allowedIds.has(p.id) ? 'checked' : ''}>
          <span>
            <strong>${esc(p.permission_name || p.permission_code)}</strong>
            <small>${esc(p.permission_code)}</small>
            ${p.description ? `<small>${esc(p.description)}</small>` : ''}
          </span>
        </label>
      `).join('')}
    </section>
  `).join('');

  openForm(
    BI('Manage Permissions', 'Manage Permissions'),
    `${user.full_name || user.username} — ${BI(
      'Chagua ruhusa anazopaswa kutumia.',
      'Select the permissions this user may use.'
    )}`,
    `
      <div class="permission-toolbar">
        <button type="button" class="btn btn-secondary btn-sm"
          data-action="select-all-user-permissions">
          ${esc(BI('Chagua zote','Select all'))}
        </button>
        <button type="button" class="btn btn-secondary btn-sm"
          data-action="clear-user-permissions">
          ${esc(BI('Ondoa chaguo','Clear selection'))}
        </button>
      </div>

      <div id="user-permission-list">
        ${permissionHtml || `<p>${esc(BI(
          'Hakuna permissions zilizopatikana.',
          'No permissions found.'
        ))}</p>`}
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-primary"
          data-action="save-user-permissions"
          data-id="${esc(userId)}">
          ${esc(BI('Hifadhi ruhusa','Save permissions'))}
        </button>
      </div>
    `
  );
}


async function saveUserPermissions(userId) {
  if (!['developer', 'owner'].includes(S.role)) {
    throw new Error('Not authorized to manage permissions.');
  }

  const selectedIds = [
    ...document.querySelectorAll(
      '#user-permission-list input[name="permission-code"]:checked'
    )
  ].map(input => input.value);

  const { data: user, error: userError } = await S.sb
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .eq('role', 'salesman')
    .eq('is_active', true)
    .eq('account_status', 'approved')
    .single();

  if (userError) throw userError;

  const { error: deleteError } = await S.sb
    .from('user_permissions')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (selectedIds.length) {
    const rows = selectedIds.map(permissionId => ({
      user_id: userId,
      permission_id: permissionId,
      allowed: true
    }));

    const { error: insertError } = await S.sb
      .from('user_permissions')
      .insert(rows);

    if (insertError) {
      throw new Error(
        'Permissions could not be saved. Check the user_permissions RLS policies. ' +
        insertError.message
      );
    }
  }

  important(BI(
    'Ruhusa zimehifadhiwa.',
    'Permissions saved successfully.'
  ));

  modal('form-modal', false);
  await userMgmtFinal();
}

/* RLS: ENABLED (KEEP ENABLED) */

async function profileFinal(){
  const p=S.profile||await loadProfileFinal();

  if(!p){
    msg(
      'profile-form-message',
      BI(
        'Profile haikupatikana. Account profile record inahitajika.',
        'Profile was not found. The account profile record is required.'
      ),
      'error'
    );
    return;
  }

  /* =========================================
     PROFILE SUMMARY
     Only these 4 items are shown by default:
     1. Profile picture
     2. Username
     3. Role
     4. Account status
     ========================================= */

  if($('profile-summary-username')){
    $('profile-summary-username').textContent=
      p.username||'—';
  }

  if($('profile-summary-role')){
    $('profile-summary-role').textContent=
      p.role||'—';
  }

  if($('profile-summary-status')){
    $('profile-summary-status').textContent=
      p.account_status||'—';
  }

  /* =========================================
     MORE PROFILE INFO
     These remain available but hidden until
     the user opens More Profile Info.
     ========================================= */

  if($('profile-full-name')){
    $('profile-full-name').value=
      p.full_name||'';
  }

  if($('profile-username')){
    $('profile-username').value=
      p.username||'';
  }

  if($('profile-email')){
    $('profile-email').value=
      p.email||S.user?.email||'';
  }

  if($('profile-phone')){
    $('profile-phone').value=
      p.phone||'';
  }

  if($('profile-role')){
    $('profile-role').value=
      p.role||'';
  }

  if($('profile-status')){
    $('profile-status').value=
      p.account_status||'';
  }

  if($('profile-created-at')){
    $('profile-created-at').value=
      date(p.created_at);
  }

  if($('profile-active')){
    $('profile-active').value=
      p.is_active
        ? BI('Ndiyo','Yes')
        : BI('Hapana','No');
  }

  /* =========================================
     PROFILE PICTURE
     ========================================= */

  S.avatarPath=p.avatar_url||null;

  setAvatar(
    'profile-avatar-preview',
    'profile-avatar-placeholder',
    await avatar(p.avatar_url),
    p.full_name||p.username||'User'
  );

  /* =========================================
     MORE INFO STARTS CLOSED
     ========================================= */

  if($('profile-more-info')){
    $('profile-more-info').hidden=true;
  }
}

profile=profileFinal;


/* RLS: ENABLED (KEEP ENABLED) */

async function loadProfileFinal(){
  try{
    const {data:authData,error:authError}=await S.sb.auth.getUser();

    if(authError) throw authError;

    const user=authData?.user;

    if(!user){
      S.profile=null;
      S.role=null;
      return null;
    }

    S.user=user;

    const {data,error}=await S.sb
      .from('profiles')
      .select('*')
      .eq('id',user.id)
      .maybeSingle();

    if(error){
      console.error('loadProfileFinal profile error:',error);
      throw error;
    }

    if(!data){
      console.warn('No profile found for authenticated user:',user.id);
      S.profile=null;
      S.role=null;
      return null;
    }

    S.profile=data;
    S.role=data.role||null;
    S.avatarPath=data.avatar_url||null;

    return data;

  }catch(error){
    console.error('loadProfileFinal failed:',error);
    S.profile=null;
    S.role=null;
    return null;
  }
}

loadProfile=loadProfileFinal;

/* ============================================================
   SGC ACCESS CONTROL — FRONTEND ↔ SUPABASE
   RLS MUST REMAIN ENABLED.
   Frontend visibility follows role + Supabase permission check.
   ============================================================ */

const PAGE_ACCESS = Object.freeze({
  dashboard: null,
  profile: null,

  products: "products.view",
  "received-stock": "stock.receive",
 sales: "sales.view",
receipts: "sales.view",
stock: "stock.view",
  customers: "customers.view",
  "customer-payments": "customer_payments.view",

  suppliers: "suppliers.view",
  "supplier-payments": "supplier_payments.view",
  expenses: "expenses.view",

  "stock-adjustments": "stock.adjust",
  "sales-returns": "sales.return",

  reports: "reports.view",

  "user-management": "users.view",
  "devices-sessions": "devices.view",
  "developer-settings": "settings.view",

  settings: "settings.view",
  "audit-logs": "audit_logs.view",
});

const DEVELOPER_ONLY_PAGES = new Set([
  "devices-sessions",
  "developer-settings"
]);

async function pageHasAccess(page){
  if(!S.user || !S.profile) return false;

  /* Dashboard and own profile are available to every
     approved authenticated user. */
  if(page === "dashboard" || page === "profile"){
    return true;
  }

  /* Developer-only areas */
  if(DEVELOPER_ONLY_PAGES.has(page)){
    return S.role === "developer";
  }

  const permission = PAGE_ACCESS[page];

  /* Unknown page = deny */
  if(permission === undefined){
    return false;
  }

  /* Owner and Developer are allowed by the existing
     backend role model. */
  if(S.role === "owner" || S.role === "developer"){
    return true;
  }

  /* Salesman and any other permission-based user:
     ask Supabase directly. */
  return await perm(permission);
}


/* ============================================================
   UPDATE USER CHROME
   ============================================================ */

async function updateChromeFinal(){

  const p = S.profile || {};

  const name =
    p.full_name ||
    S.user?.email ||
    "User";

  const username =
    p.username ||
    name;

  const url =
    await avatar(p.avatar_url);


  /* ---------------- USER INFORMATION ---------------- */

  $('navbar-username') &&
    ($('navbar-username').textContent = username);

  $('navbar-role') &&
    ($('navbar-role').textContent = p.role || '—');

  $('sidebar-full-name') &&
    ($('sidebar-full-name').textContent = name);

  $('sidebar-user-role') &&
    ($('sidebar-user-role').textContent = p.role || '—');

  $('topbar-username') &&
    ($('topbar-username').textContent = username);
/* RLS: ENABLED (KEEP ENABLED) */

$('topbar-role') &&
  ($('topbar-role').textContent =
    p.role || '—');

const topbarStatus =
  p.account_status === 'approved' && p.is_active
    ? BI('Active','Active')
    : p.account_status || '—';

$('topbar-status-text') &&
  ($('topbar-status-text').textContent =
    topbarStatus);

  /* ---------------- PROFILE IMAGES ---------------- */

  setAvatar(
    'navbar-avatar',
    'navbar-avatar-placeholder',
    url,
    name
  );

  setAvatar(
    'sidebar-avatar',
    'sidebar-avatar-placeholder',
    url,
    name
  );

  setAvatar(
    'topbar-avatar',
    'topbar-avatar-placeholder',
    url,
    name
  );


  /* ==========================================================
     SIDEBAR ROLE VISIBILITY
     ========================================================== */

  $$('[data-role-only="developer"]').forEach(el => {
    el.hidden = S.role !== "developer";
  });


  /* ==========================================================
     MODULE / PAGE ACCESS
     IMPORTANT:
     We do NOT use the initial HTML "hidden" state as permission.
     hidden is only for page switching.
     ========================================================== */

  const pageButtons =
    $$('[data-dashboard-page]');

  for(const button of pageButtons){

    const page =
      button.dataset.dashboardPage;

    const allowed =
      await pageHasAccess(page);

    button.hidden = !allowed;
    button.dataset.accessAllowed =
      allowed ? "1" : "0";
  }


  /* ==========================================================
     DASHBOARD PAGES
     Hide only pages the current user is NOT authorized to use.
     ========================================================== */

  const pages =
    $$('.dashboard-page');

  for(const page of pages){

    const pageName =
      page.dataset.dashboardView;

    const allowed =
      await pageHasAccess(pageName);

    page.dataset.accessAllowed =
      allowed ? "1" : "0";

    /*
      Do not force the dashboard page itself visible here.
      navFinal() controls which page is currently displayed.
    */

    if(!allowed){
      page.hidden = true;
    }
  }
}

updateChrome = updateChromeFinal;


/* ============================================================
   PAGE RENDERER
   ============================================================ */

async function renderPageFinal(){

  const map = {
    dashboard: dashboardFinal,

    products: productsFinal,

    "received-stock": receivedFinal,

/* RLS: ENABLED (KEEP ENABLED) */
 stock: stockFinal,
    sales: salesFinal,
    receipts: receiptsFinal,

    customers: customersFinal,

    suppliers: suppliersFinal,

    "customer-payments":
      () => paymentsFinal("customer"),

    "supplier-payments":
      () => paymentsFinal("supplier"),

    expenses: expensesFinal,

    "stock-adjustments":
      stockAdjustmentsFinal,

    "sales-returns":
      salesReturnsFinal,

    reports,

    "audit-logs":
      audit,

    "user-management":
      userMgmtFinal,

    "devices-sessions":
      devices,

    "developer-settings":
      devSettings,

    profile:
      profileFinal,

    settings:
      settingsFinal
  };


  const fn =
    map[S.page];

  if(!fn) return;


  try{

    await fn();

    bindModuleSearch();

  }catch(x){

    console.error(x);

    const h =
      host(S.page);

    if(h){

      h.innerHTML =
        `<div class="error-state">
          <strong>
            ${esc(
              BI(
                'Imeshindikana kupakia data.',
                'Unable to load data.'
              )
            )}
          </strong>

          <div>
            ${esc(err(x))}
          </div>

          <button
            class="btn btn-secondary btn-sm"
            data-action="reload-page">
            ${esc(t('actions.reload'))}
          </button>
        </div>`;
    }
  }
}

renderPage = renderPageFinal;


/* ============================================================
   FINAL NAVIGATION
   ============================================================ */

async function navFinal(page){

  if(!S.user){

    publicPage(
      ['home','about','features','contact'].includes(page)
        ? page
        : 'home'
    );

    return;
  }


  /* Make sure profile/role is available */
  if(!S.profile){

    await loadProfileFinal();
  }


  /* Check REAL permission */
  const allowed =
    await pageHasAccess(page);


  if(!allowed){

    toast(
      BI(
        'Huna ruhusa kwa ukurasa huu.',
        'You are not authorized for this page.'
      ),
      'error'
    );

    return;
  }


  const target =
    $(`dashboard-page-${page}`);


  if(!target){

    toast(
      BI(
        'Ukurasa huu haupo.',
        'This page does not exist.'
      ),
      'error'
    );

    return;
  }


  /* ==========================================================
     PAGE SWITCHING
     ========================================================== */

  S.page = page;


  $$('.dashboard-page').forEach(el => {

    const pageName =
      el.dataset.dashboardView;

    /*
      Only the selected page is shown.
      Unauthorized pages remain hidden.
    */
    if(pageName === page){

      el.hidden = false;

    }else{

      el.hidden = true;
    }
  });


  /* ==========================================================
     ACTIVE MODULE BUTTON
     ========================================================== */

  $$('[data-dashboard-page]').forEach(el => {

    el.classList.toggle(
      'active',
      el.dataset.dashboardPage === page
    );
  });


  /* ==========================================================
     BREADCRUMB
     ========================================================== */

  const heading =
    target.querySelector('h1');

  if($('breadcrumb-current')){

    $('breadcrumb-current').textContent =
      heading?.textContent || page;
  }


  /* ==========================================================
     CLOSE SIDEBAR
     ========================================================== */

  closeSidebarOnNavigation();


  /* ==========================================================
     LOAD REAL DATA FROM SUPABASE
     ========================================================== */

  await renderPageFinal();


  window.scrollTo(0,0);
}

nav = navFinal;

/* RLS: ENABLED (KEEP ENABLED) */
async function actionFinal(e) {
  const a = e.dataset.action;
  if (!a) return;

  switch (a) {

 /* RLS: ENABLED (KEEP ENABLED) */

case 'open-product-form':
  await productForm();
  break;

case 'view-product':
  await viewProductFinal(e.dataset.id);
  break;

case 'edit-product':
  await editProduct(e.dataset.id);
  break;

case 'toggle-product':
  await toggleProduct(
    e.dataset.id,
    e.dataset.active === '1'
  );
  break;

case 'open-variant-form':
  await openVariantForm(
    e.dataset.productId
  );
  break;

case 'edit-variant':
  await editVariant(e.dataset.id);
  break;

case 'toggle-variant':
  await toggleVariant(
    e.dataset.id,
    e.dataset.active === '1'
  );
  break;

case 'open-customer-form':
  await customerForm();
  break;

case 'view-customer':
  await viewCustomer(e.dataset.id);
  break;

case 'edit-customer': {
  const rows = await getCustomers('');
  const c = (rows || []).find(
    x => x.customer_id === e.dataset.id
  );

  if(!c){
    throw Error(
      BI(
        'Mteja haikupatikana.',
        'Customer not found.'
      )
    );
  }

  await customerForm(c);
  break;
}

case 'toggle-customer':
  await toggleCustomer(
    e.dataset.id,
    e.dataset.active === '1'
  );
  break;

case 'open-supplier-form':
  await supplierForm();
  break;

case 'view-supplier':
  await viewSupplier(e.dataset.id);
  break;

case 'edit-supplier': {
  const rows = await getSuppliers('');
  const s = (rows || []).find(
    x => x.id === e.dataset.id
  );

  if(!s){
    throw Error(
      BI(
        'Supplier haikupatikana.',
        'Supplier not found.'
      )
    );
  }

  await supplierForm(s);
  break;
}

case 'toggle-supplier':
  await toggleSupplier(
    e.dataset.id,
    e.dataset.active === '1'
  );
  break;

case 'reload-page':
  await renderPageFinal();
  break;

case 'close-form-modal':
  modal('form-modal', false);
  break;

/* RLS: ENABLED (KEEP ENABLED) */

case 'open-sale-form':
  await saleForm();
  break;

case 'view-sale':
  await viewSale(e.dataset.id);
  break;

case 'open-customer-payment-form':
  await customerPaymentFormFinal();
  break;

case 'open-supplier-payment-form':
  await supplierPaymentFormFinal();
  break;

case 'open-stock-receipt-form':
  await receiptForm();
  break;

case 'view-receipt':
  await viewReceipt(e.dataset.id);
  break;

case 'verify-receipt':
  await verifyReceiptFinal(e.dataset.id);
  break;

case 'reject-receipt':
  await rejectReceipt(e.dataset.id);
  break;

/* CUSTOMER SALES RECEIPTS — KEEP STOCK RECEIPTS SEPARATE */
case 'open-sales-receipt':
case 'reprint-sales-receipt':
  await openSalesReceipt(e.dataset.id);
  break;

case 'print-sales-receipt':
  printSalesReceipt();
  break;

case 'download-sales-receipt':
  downloadSalesReceipt();
  break;

case 'share-sales-receipt':
  await shareSalesReceipt();
  break;

case 'open-expense-form':
  await expenseFormFinal();
  break;

/* RLS: ENABLED (KEEP ENABLED) */

case'edit-expense':{
const rows=await S.sb.rpc('get_expenses_v2',{p_search:''});  if(rows.error)throw rows.error;

  const data=(rows.data||[]).find(x=>x.expense_id===e.dataset.id);

  if(!data){
    throw Error(BI('Gharama haikupatikana.','Expense not found.'));
  }

 
await expenseFormFinal({
  id: data.expense_id,
  category_id: data.category_id,
  description: data.description,
  amount: data.amount,
  expense_date: data.expense_date,
  period_start: data.period_start,
  period_end: data.period_end,
  payment_method: data.payment_method,
  payment_reference: data.payment_reference
});

  break;
}
case'delete-expense':await deleteExpenseFinal(e.dataset.id);break;
    case'open-stock-adjustment-form':await stockAdjustmentForm();break;
    case'open-sales-return-form':await salesReturnForm();break;
    case'open-setting-form':await settingForm();break;

    case'edit-setting':await settingForm(e.dataset.id);break;
      case'open-expense-settings':
  await expenseSettingsFinal();
  break;
  case 'open-expense-category-form':
  await expenseCategoryFormFinal();
  break;

case 'edit-expense-category':
  await expenseCategoryFormFinal(e.dataset.id);
  break;

case 'toggle-expense-category':
  await toggleExpenseCategoryFinal(
    e.dataset.id,
    e.dataset.active === '1'
  );
  break;
    case'approve-salesman':await approve(e.dataset.id,'salesman');break;
    case'approve-owner':await approve(e.dataset.id,'owner');break;
    case'reject-user':await reject(e.dataset.id);break;
    case'reset-code':await resetCode(e.dataset.id);break;
    case'block-device':await block(e.dataset.id);break;
    case'unblock-device':await unblock(e.dataset.id);break;
    case'revoke-session':await revoke(e.dataset.id);break;
   
/* RLS: ENABLED (KEEP ENABLED) */

case'open-more-profile-info':
  openMoreProfileInfo();
  break;

case'close-more-profile-info':
  closeMoreProfileInfo();
  break;

case'select-profile-picture':
  $('profile-avatar-input')?.click();
  break;

case'open-profile-camera':
  await openProfileCamera();
  break;

case'close-profile-camera':
  closeProfileCamera();
  break;

case'capture-profile-camera':
  captureProfileCamera();
  break;

case'save-profile-crop':
  await saveProfileCrop();
  break;

case'cancel-profile-crop':
  closeProfileCrop();
  break;

/* RLS: ENABLED (KEEP ENABLED) */

case 'open-login':
  modal('login-modal');
  break;

case 'open-signup':
  modal('signup-modal');
  break;

case 'open-forgot-password':
  modal('login-modal', false);
  modal('forgot-password-modal');
  break;

case 'request-password-reset':
  await requestPasswordReset();
  break;

case 'close-login':
  modal('login-modal', false);
  break;

case 'close-signup':
  modal('signup-modal', false);
  break;

case 'close-forgot-password':
  modal('forgot-password-modal', false);
  break;

case 'close-reset-password':
  modal('reset-password-modal', false);
  break;

case 'close-form-modal':
  modal('form-modal', false);
  break;

case 'close-detail-modal':
  modal('detail-modal', false);
  break;

case 'close-confirm':
  resolveConfirm(false);
  break;

case 'confirm':
  resolveConfirm(true);
  break;

case 'logout':
  await logout();
  break;

case 'open-profile':
  await navFinal('profile');
  break;

case 'open-dashboard':
  await navFinal('dashboard');
  break;

case 'reload-profile':
  await profileFinal();
  break;

case 'toggle-language':
  S.lang = S.lang === 'sw' ? 'en' : 'sw';
  applyLang();
  break;

case 'toggle-password': {
  const x = $(e.dataset.target);
  if(x){
    x.type = x.type === 'password'
      ? 'text'
      : 'password';
  }
  break;
}

case 'reload-page':
  await renderPageFinal();
  break;

case'remove-profile-picture':
  await removeAvatar();
  break;   
  /* RLS: ENABLED (KEEP ENABLED) */

case 'logout':
  await logout();
  break;

 
case 'manage-user-permissions':
  await manageUserPermissions(e.dataset.id);
  break;

case 'select-all-user-permissions':
  document.querySelectorAll(
    '#user-permission-list input[name="permission-code"]'
  ).forEach(input => {
    input.checked = true;
  });
  break;

case 'clear-user-permissions':
  document.querySelectorAll(
    '#user-permission-list input[name="permission-code"]'
  ).forEach(input => {
    input.checked = false;
  });
  break;

case 'save-user-permissions':
  await saveUserPermissions(e.dataset.id);
  break;

default:
  break;
  }
}

action = actionFinal;


/* RLS: ENABLED (KEEP ENABLED) */

function openMoreProfileInfo(){
  const box=$('profile-more-info');

  if(!box)return;

  box.hidden=false;

  box.scrollIntoView({
    behavior:'smooth',
    block:'start'
  });
}

function closeMoreProfileInfo(){
  const box=$('profile-more-info');

  if(!box)return;

  box.hidden=true;
}

function eventsFinal(){
  if(document.body.dataset.sgcEventsBound==='1')return;document.body.dataset.sgcEventsBound='1';
  document.addEventListener('click',async e=>{
    const a=e.target.closest('[data-action]');
    if(a){if(['login','signup','reset-password','save-profile'].includes(a.dataset.action))return;e.preventDefault();try{await actionFinal(a)}catch(x){console.error(x);important(err(x))}return;}
    const p=e.target.closest('[data-dashboard-page]');if(p){e.preventDefault();await navFinal(p.dataset.dashboardPage);return;}
    const r=e.target.closest('[data-route]');if(r&&!S.user){e.preventDefault();publicPage(r.dataset.route)}
  });
  $('login-form')?.addEventListener('submit',login);$('signup-form')?.addEventListener('submit',signup);$('forgot-password-form')?.addEventListener('submit',forgot);$('reset-password-form')?.addEventListener('submit',reset);$('profile-form')?.addEventListener('submit',saveProfile);
   
   /* RLS: ENABLED (KEEP ENABLED) */

$('profile-avatar-input')?.addEventListener(
  'change',
  async e => {
    const file=e.target.files?.[0];

    if(!file){
      return;
    }

    try{
      await openProfileCrop(file);
    }catch(x){
      console.error('PROFILE IMAGE SELECT ERROR:',x);

      important(
        err(x)
      );
    }finally{
      /*
       * Allow selecting the same image again.
       */
      e.target.value='';
    }
  }
);

/* RLS: ENABLED (KEEP ENABLED) */

const profileCropCanvas=$('profile-crop-canvas');
const profileCropZoom=$('profile-crop-zoom');

if(profileCropCanvas){
  profileCropCanvas.addEventListener(
    'pointerdown',
 
   e=>{
      profileCropCanvas.setPointerCapture?.(e.pointerId);
      startProfileCropDrag(e);
    }
  );


  profileCropCanvas.addEventListener(
    'pointermove',
    e=>{
      moveProfileCropDrag(e);
    }
  );

  profileCropCanvas.addEventListener(
    'pointerup',
    e=>{
      stopProfileCropDrag();
      profileCropCanvas.releasePointerCapture?.(e.pointerId);
    }
  );

  profileCropCanvas.addEventListener(
    'pointercancel',
    ()=>{
      stopProfileCropDrag();
    }
  );

  profileCropCanvas.addEventListener(
    'wheel',
    e=>{
      e.preventDefault();

      const current=profileCropScale;
      const next=e.deltaY<0
        ? current+0.1
        : current-0.1;

      zoomProfileCrop(next);

      if(profileCropZoom){
        profileCropZoom.value=profileCropScale;
      }
    },
    {passive:false}
  );
}

if(profileCropZoom){
  profileCropZoom.addEventListener(
    'input',
    e=>{
      zoomProfileCrop(e.target.value);
    }
  );
}

  $('language-select')?.addEventListener('change',e=>{S.lang=e.target.value==='en'?'en':'sw';applyLang()});$('topbar-language')?.addEventListener('change',e=>{S.lang=e.target.value==='en'?'en':'sw';applyLang()});
  $('mobile-menu-toggle')?.addEventListener('click',()=>$('main-navigation')?.classList.toggle('open'));$('sidebar-toggle')?.addEventListener('click',()=>$('app-sidebar')?.classList.toggle('open'));
  $$('input[name="account_type"]').forEach(r=>r.addEventListener('change',()=>{if($('developer-signup-fields'))$('developer-signup-fields').hidden=r.value!=='developer'||!r.checked}));
  document.addEventListener('click',e=>{if(e.target.closest('.toast-close,.message-close')){e.target.closest('.toast,.message')?.remove()}});
}

events=eventsFinal;

/* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   CONTACT ACTIONS
   ========================================================= */

function contactLinks(){

  const bind = (
    id,
    handler
  ) => {

    $(id)?.addEventListener(
      'click',
      e => {

        e.preventDefault();

        handler();
      }
    );
  };


  bind(
    'contact-whatsapp-1',
    () => openWhats(C.wa1)
  );


  bind(
    'contact-whatsapp-2',
    () => openWhats(C.wa2)
  );


  bind(
    'contact-call-1',
    () => {

      location.href =
        'tel:' +
        C.call1.replace(
          /\s/g,
          ''
        );
    }
  );


  bind(
    'contact-call-2',
    () => {

      location.href =
        'tel:' +
        C.call2.replace(
          /\s/g,
          ''
        );
    }
  );


  bind(
    'contact-email',
    () => {

      location.href =
        'mailto:' +
        C.email;
    }
  );
}


/* =========================================================
   OPEN WHATSAPP
   ========================================================= */

function openWhats(number){

  const cleanNumber =
    String(number || '')
      .replace(
        /\D/g,
        ''
      );


  const message =
    txt(
      'Habari, naomba msaada kuhusu SGC SOFT DRINKS MANAGEMENT.',
      'Hello, I need support with SGC SOFT DRINKS MANAGEMENT.'
    );


  window.open(
    'https://wa.me/' +
      cleanNumber +
      '?text=' +
      encodeURIComponent(message),

    '_blank',

    'noopener,noreferrer'
  );
}

async function initFinal(){
  try{
    $('footer-year')&&($('footer-year').textContent=new Date().getFullYear());

     /* RLS: ENABLED (KEEP ENABLED) */

eventsFinal();

contactLinks();

await bootSupabase();

await loadSystemDefaultLanguage();

applyLang();

    const l=await S.sb.auth.getSession();
    S.session=l.data.session;
    S.user=l.data.session?.user||null;

    S.sb.auth.onAuthStateChange((ev,s)=>setTimeout(async()=>{
      try{

        /* USER SIGNED OUT */
        if(ev==='SIGNED_OUT'){
          if(S.heartbeat)clearInterval(S.heartbeat);

          S.user=null;
          S.session=null;
          S.profile=null;
          S.role=null;
          S.deviceSession=null;

          /* SHOW PUBLIC HOMEPAGE */
          document.getElementById('site-header')?.removeAttribute('hidden');
          $('public-content')?.removeAttribute('hidden');
          $('authenticated-app')?.setAttribute('hidden','');

          publicPage('home');
          return;
        }

        /* USER SIGNED IN */
        if(s){
          S.session=s;
          S.user=s.user;

          await loadProfileFinal();

          if(approved()){

            /* HIDE PUBLIC HOMEPAGE */
            document.getElementById('site-header')?.setAttribute('hidden','');
            $('public-content')?.setAttribute('hidden','');

            /* SHOW USER DASHBOARD */
            $('authenticated-app')?.removeAttribute('hidden');

            await updateChromeFinal();
            await navFinal('dashboard');
            await deviceRegister();

          }else{

            /* ACCOUNT NOT APPROVED */
            document.getElementById('site-header')?.removeAttribute('hidden');
            $('public-content')?.removeAttribute('hidden');
            $('authenticated-app')?.setAttribute('hidden','');

            publicPage('home');
          }
        }

      }catch(x){
        console.error(x);
        important(err(x));
      }
    },0));

    /* EXISTING SESSION WHEN PAGE LOADS */
    if(S.user){

      await loadProfileFinal();

      if(approved()){

        /* HIDE PUBLIC HOMEPAGE NAVIGATION */
        document.getElementById('site-header')?.setAttribute('hidden','');
        $('public-content')?.setAttribute('hidden','');

        /* SHOW USER DASHBOARD */
        $('authenticated-app')?.removeAttribute('hidden');

        await updateChromeFinal();
        await navFinal('dashboard');
        await deviceRegister();

      }else{

        /* NOT APPROVED → PUBLIC HOMEPAGE */
        document.getElementById('site-header')?.removeAttribute('hidden');
        $('public-content')?.removeAttribute('hidden');
        $('authenticated-app')?.setAttribute('hidden','');

        publicPage('home');
      }

    }else{

      /* GUEST → PUBLIC HOMEPAGE */
      document.getElementById('site-header')?.removeAttribute('hidden');
      $('public-content')?.removeAttribute('hidden');
      $('authenticated-app')?.setAttribute('hidden','');

      const h=location.hash.slice(1);

      publicPage(
        ['about','features','contact'].includes(h)
          ? h
          : 'home'
      );
    }

    $('global-loader')&&($('global-loader').hidden=true);

  }catch(x){
    console.error(x);
    important(err(x));

    $('global-loader-text')&&(
      $('global-loader-text').textContent=err(x)
    );
  }
}

init=initFinal;
window.addEventListener('hashchange',()=>{
  const h=location.hash.replace(/^#/,'').trim();

  /* PUBLIC NAVIGATION */
  const publicMode=$('authenticated-app')?.hasAttribute('hidden');

  if(publicMode){
    if(['home','about','features','contact'].includes(h)){
      publicPage(h);
    }else{
      publicPage('home');
    }
    return;
  }

  /* USER DASHBOARD NAVIGATION */
  if(
    S.user &&
    document.getElementById(`dashboard-page-${h}`)
  ){
    navFinal(h);
  }
});


/* PUBLIC NAVIGATION CLICK HANDLER */
document.addEventListener('click',e=>{

  const link=e.target.closest(
    '#guest-nav [data-route], #auth-nav [data-route], .brand-link[data-route]'
  );

  if(!link)return;

  const route=link.dataset.route;

  if(!['home','about','features','contact'].includes(route)){
    return;
  }

  const publicMode=$('authenticated-app')?.hasAttribute('hidden');

  if(!publicMode){
    return;
  }

  e.preventDefault();

  publicPage(route);
});

/* Searchable entity selectors + receipt/sale final forms. */
 
 /* RLS: ENABLED (KEEP ENABLED) */

/* =========================================================
   NEW SALE — MULTI PRODUCT SALES WORKSPACE
   Total + Balance are calculated by DATABASE RPC.
   Final sale is still saved by create_sale RPC.
   ========================================================= */

 /* RLS: ENABLED (KEEP ENABLED) */

 /* RLS: ENABLED (KEEP ENABLED) */

async function saleFormFinal(){

  const [pr, cr] = await Promise.all([
    S.sb.rpc('get_products_for_sale'),
    getCustomers('')
  ]);

  if(pr.error) 
    throw pr.error;

  const productsRows = pr.data || [];
  const customersRows = cr || [];

  let saleRows = [];
  let previewTimer = null;


  openForm(
    t('actions.newSale'),

    BI(
      'Weka taarifa za mteja kwa hiari, kisha ongeza bidhaa.',
      'Enter customer information optionally, then add products.'
    ),

    `<form id="f-sale-final" class="sale-form">

      <section class="sale-section-card">

        <div class="sale-section-heading">

          <div>
            <span class="eyebrow">
              ${BI('Mteja','Customer')}
            </span>

            <h3>
              ${BI(
                'Taarifa za Mteja',
                'Customer Information'
              )}
            </h3>
          </div>

        </div>


        <div class="sale-customer-grid">

          <div class="form-field">

            <label>
              ${BI(
                'Jina la Mteja',
                'Customer Name'
              )}
            </label>

            <input
              id="sale-customer-name"
              name="customer_name"
              list="sale-customers"
              autocomplete="off"
              placeholder="${BI(
                'Hiari',
                'Optional'
              )}"
            >

            <datalist id="sale-customers">

              ${customersRows.map(c => `
                <option value="${esc(c.name)}">
              `).join('')}

            </datalist>

          </div>


          <div class="form-field">

            <label>
              ${BI(
                'Mobile',
                'Mobile'
              )}
            </label>

            <input
              id="sale-customer-phone"
              name="customer_phone"
              type="tel"
              autocomplete="tel"
              placeholder="${BI(
                'Hiari',
                'Optional'
              )}"
            >

          </div>


          <div class="form-field">

            <label>
              ${BI(
                'Address',
                'Address'
              )}
            </label>

            <input
              id="sale-customer-address"
              name="customer_address"
              autocomplete="street-address"
              placeholder="${BI(
                'Hiari',
                'Optional'
              )}"
            >

          </div>

        </div>

      </section>


      <section class="sale-section-card">

        <div class="sale-section-heading">

          <div>

            <span class="eyebrow">
              ${BI(
                'Bidhaa',
                'Products'
              )}
            </span>

            <h3>
              ${BI(
                'Bidhaa za Mauzo',
                'Sale Products'
              )}
            </h3>

          </div>


          <button
            type="button"
            class="btn btn-primary"
            id="sale-add-product">

            + ${BI(
              'Ongeza Bidhaa',
              'Add Product'
            )}

          </button>

        </div>


        <div class="sale-items-table">

          <div class="sale-items-header">

            <span>#</span>

            <span>
              ${BI(
                'Bidhaa',
                'Product'
              )}
            </span>

            <span>
              ${BI(
                'Variant',
                'Variant'
              )}
            </span>

            <span>
              ${BI(
                'Quantity',
                'Quantity'
              )}
            </span>

            <span>
              ${BI(
                'Selling Price',
                'Selling Price'
              )}
            </span>

            <span>
              ${BI(
                'Total Price',
                'Total Price'
              )}
            </span>

            <span>
              ${BI(
                'Action',
                'Action'
              )}
            </span>

          </div>


          <div id="sale-items-body"></div>

        </div>


        <div class="sale-products-footer">

          <button
            type="button"
            class="btn btn-secondary"
            id="sale-clear-all">

            ${BI(
              'Futa Zote',
              'Clear All'
            )}

          </button>


          <div class="sale-total-box">

            <span>
              ${BI(
                'TOTAL (TSH)',
                'TOTAL (TSH)'
              )}
            </span>

            <strong id="sale-total-final">
              0
            </strong>

          </div>

        </div>

      </section>


      <section class="sale-payment-grid">


        <div class="sale-section-card">

          <div class="form-field">

            <label>
              ${BI(
                'Amount Paid (TSH)',
                'Amount Paid (TSH)'
              )}
            </label>

            <input
              id="sale-paid-final"
              name="paid_amount"
              type="number"
              min="0"
              step="0.01"
              value="0"
            >

          </div>


          <div class="sale-debt-block">

            <span>
              ${BI(
                'Debt (TSH)',
                'Debt (TSH)'
              )}
            </span>

            <strong id="sale-balance-final">
              0
            </strong>

          </div>

        </div>


        <div class="sale-section-card">

          <div class="form-field">

            <label>
              ${BI(
                'Payment Method',
                'Payment Method'
              )}
            </label>

            <select
              id="sale-payment-method"
              name="payment_method">

              <option value="cash">
                Cash
              </option>

              <option value="mobile_money">
                Mobile Money
              </option>

              <option value="bank">
                Bank
              </option>

              <option value="credit">
                Credit
              </option>

            </select>

          </div>


          <div class="form-field">

            <label>
              ${BI(
                'Notes (Optional)',
                'Notes (Optional)'
              )}
            </label>

            <textarea
              name="notes"
              placeholder="${BI(
                'Sale notes...',
                'Sale notes...'
              )}">
            </textarea>

          </div>

        </div>

      </section>


      <div class="sale-form-actions">

        <button
          type="button"
          class="btn btn-secondary"
          data-action="close-form-modal">

          ${esc(
            t('common.cancel')
          )}

        </button>


        <button
          type="submit"
          class="btn btn-primary">

          ${esc(
            BI(
              'Kamilisha Mauzo',
              'Complete Sale'
            )
          )}

        </button>

      </div>

    </form>`
  );


  const customerName =
    $('sale-customer-name');

  const customerPhone =
    $('sale-customer-phone');

  const customerAddress =
    $('sale-customer-address');

  const itemsBody =
    $('sale-items-body');

  const paidInput =
    $('sale-paid-final');


  function moneyValue(value){

    const n =
      Number(value || 0);

    return Number.isFinite(n)
      ? money(n)
      : '0';

  }


  function createSaleRow(){

    saleRows.push({

      id:
        `sale-row-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,

      productId: '',

      productName: '',

      variantId: '',

      quantity: 1,

      price: 0,

      stock: 0

    });

    renderSaleRows();

  }


  function renderSaleRows(){

    itemsBody.innerHTML =
      saleRows.map(
        (row, index) => `

          <div
            class="sale-item-row"
            data-sale-row="${esc(row.id)}">


            <div class="sale-line-number">
              ${index + 1}
            </div>


            <div class="sale-product-cell">

              <select
                class="sale-row-product"
                data-row-id="${esc(row.id)}">

                <option value="">
                  ${BI(
                    'Chagua bidhaa',
                    'Select product'
                  )}
                </option>

                ${productsRows.map(
                  product => `

                    <option
                      value="${esc(product.id)}"
                      ${
                        row.productId === product.id
                          ? 'selected'
                          : ''
                      }>

                      ${esc(product.name)}

                    </option>

                  `
                ).join('')}

              </select>


              <small
                class="sale-row-stock"
                data-stock-for="${esc(row.id)}">

                ${
                  row.productId
                    ? `${BI(
                        'Stock',
                        'Stock'
                      )}: ${row.stock}`
                    : ''
                }

              </small>

            </div>


            <div>

              <select
                class="sale-row-variant"
                data-row-id="${esc(row.id)}">

                <option value="">
                  ${BI(
                    'Chagua variant',
                    'Select variant'
                  )}
                </option>

              </select>

            </div>


            <div>

              <div class="sale-quantity-control">

                <button
                  type="button"
                  class="sale-qty-btn sale-qty-minus"
                  data-row-id="${esc(row.id)}"
                  aria-label="${BI(
                    'Punguza',
                    'Reduce'
                  )}">

                  −

                </button>


                <input
                  class="sale-row-quantity"
                  data-row-id="${esc(row.id)}"
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  value="${Math.max(
                    1,
                    Math.floor(
                      Number(row.quantity) || 1
                    )
                  )}"
                >


                <button
                  type="button"
                  class="sale-qty-btn sale-qty-plus"
                  data-row-id="${esc(row.id)}"
                  aria-label="${BI(
                    'Ongeza',
                    'Add'
                  )}">

                  +

                </button>

              </div>

            </div>


            <div>

              <input
                class="sale-row-price"
                data-row-id="${esc(row.id)}"
                value="${
                  row.price
                    ? moneyValue(row.price)
                    : '0'
                }"
                readonly
              >

            </div>


            <div>

              <strong
                class="sale-row-total"
                data-total-for="${esc(row.id)}">

                0

              </strong>

            </div>


            <div>

              <button
                type="button"
                class="btn btn-danger sale-remove-row"
                data-row-id="${esc(row.id)}"
                title="${BI(
                  'Ondoa',
                  'Remove'
                )}">

                🗑

              </button>

            </div>


          </div>

        `
      ).join('');


    saleRows.forEach(
      row =>
        loadRowVariants(row)
    );

  }


  async function loadRowVariants(row){

    const rowEl =
      itemsBody.querySelector(
        `[data-sale-row="${CSS.escape(row.id)}"]`
      );

    if(!rowEl) return;


    const select =
      rowEl.querySelector(
        '.sale-row-variant'
      );

    if(!select) return;


    if(!row.productId){

      select.innerHTML = `
        <option value="">
          ${BI(
            'Chagua bidhaa kwanza',
            'Select product first'
          )}
        </option>
      `;

      return;

    }


    select.innerHTML = `
      <option value="">
        ${BI(
          'Inapakia...',
          'Loading...'
        )}
      </option>
    `;


    const result =
      await S.sb.rpc(
        'get_variants_for_sale',
        {
          p_product_id:
            row.productId
        }
      );


    if(result.error){

      important(
        err(result.error)
      );

      return;

    }


    const variants =
      result.data || [];


    select.innerHTML = `

      <option value="">
        ${BI(
          'Chagua variant',
          'Select variant'
        )}
      </option>

    ` +

    variants.map(
      variant => `

        <option
          value="${esc(variant.variant_id)}"
          data-price="${esc(
            variant.selling_price
          )}"
          data-stock="${esc(
            variant.current_stock
          )}">

          ${esc(
            variant.unit || ''
          )}

          ${esc(
            variant.volume_value || ''
          )}

          ${esc(
            variant.volume_unit || ''
          )}

          —
          ${esc(
            moneyValue(
              variant.selling_price
            )
          )}

        </option>

      `
    ).join('');


    if(row.variantId){

      select.value =
        row.variantId;

      const selected =
        select.selectedOptions[0];

      if(selected){

        row.price =
          Number(
            selected.dataset.price || 0
          );

        row.stock =
          Number(
            selected.dataset.stock || 0
          );

      }

    }

  }


  async function refreshSalePreview(){

    const items =
      saleRows
        .filter(
          row =>
            row.productId &&
            row.variantId &&
            Number(row.quantity) >= 1
        )
        .map(
          row => ({
            product_id:
              row.productId,

            variant_id:
              row.variantId,

            quantity:
              Math.floor(
                Number(row.quantity)
              )
          })
        );


    if(!items.length){

      $('sale-total-final').textContent =
        '0';

      $('sale-balance-final').textContent =
        '0';

      saleRows.forEach(
        row => {

          const totalElement =
            itemsBody.querySelector(
              `[data-total-for="${CSS.escape(row.id)}"]`
            );

          if(totalElement){

            totalElement.textContent =
              '0';

          }

        }
      );

      return;

    }


    const { data, error } =
      await S.sb.rpc(
        'preview_sale_totals',
        {
          p_items:
            items,

          p_paid_amount:
            Number(
              paidInput.value || 0
            )
        }
      );


    if(error){

      console.error(
        'preview_sale_totals:',
        error
      );

      $('sale-total-final').textContent =
        '0';

      $('sale-balance-final').textContent =
        '0';

      important(
        err(error)
      );

      return;

    }


    const total =
      Number(
        data?.total_amount || 0
      );


    const balance =
      Number(
        data?.balance || 0
      );


    $('sale-total-final').textContent =
      moneyValue(total);


    $('sale-balance-final').textContent =
      moneyValue(balance);


    (data?.lines || []).forEach(
      line => {

        const row =
          saleRows.find(
            r =>
              r.productId ===
                line.product_id &&
              r.variantId ===
                line.variant_id
          );

        if(!row) return;


        row.price =
          Number(
            line.selling_price || 0
          );


        row.stock =
          Number(
            line.current_stock || 0
          );


        const totalElement =
          itemsBody.querySelector(
            `[data-total-for="${CSS.escape(row.id)}"]`
          );


        if(totalElement){

          totalElement.textContent =
            moneyValue(
              line.line_total
            );

        }


        const priceElement =
          itemsBody.querySelector(
            `.sale-row-price[data-row-id="${CSS.escape(row.id)}"]`
          );


        if(priceElement){

          priceElement.value =
            moneyValue(
              line.selling_price
            );

        }


        const stockElement =
          itemsBody.querySelector(
            `[data-stock-for="${CSS.escape(row.id)}"]`
          );


        if(stockElement){

          stockElement.textContent =
            `${BI(
              'Stock',
              'Stock'
            )}: ${
              line.current_stock || 0
            }`;

        }

      }
    );

  }


  function schedulePreview(){

    clearTimeout(
      previewTimer
    );

    previewTimer =
      setTimeout(
        () => refreshSalePreview(),
        120
      );

  }


  /*
    PRODUCT DROPDOWN
  */

  itemsBody.addEventListener(
    'change',
    async event => {

      const productSelect =
        event.target.closest(
          '.sale-row-product'
        );


      if(productSelect){

        const row =
          saleRows.find(
            r =>
              r.id ===
              productSelect.dataset.rowId
          );


        if(!row) return;


        const product =
          productsRows.find(
            p =>
              p.id ===
              productSelect.value
          );


        row.productId =
          product?.id || '';


        row.productName =
          product?.name || '';


        row.variantId =
          '';


        row.quantity =
          1;


        row.price =
          0;


        row.stock =
          0;


        renderSaleRows();

        schedulePreview();

        return;

      }


      /*
        VARIANT DROPDOWN
      */

      const variantSelect =
        event.target.closest(
          '.sale-row-variant'
        );


      if(!variantSelect) return;


      const row =
        saleRows.find(
          r =>
            r.id ===
            variantSelect.dataset.rowId
        );


      if(!row) return;


      row.variantId =
        variantSelect.value;


      const selected =
        variantSelect.selectedOptions[0];


      row.price =
        Number(
          selected?.dataset.price || 0
        );


      row.stock =
        Number(
          selected?.dataset.stock || 0
        );


      const priceElement =
        itemsBody.querySelector(
          `.sale-row-price[data-row-id="${CSS.escape(row.id)}"]`
        );


      if(priceElement){

        priceElement.value =
          moneyValue(row.price);

      }


      schedulePreview();

    }
  );


  /*
    QUANTITY INPUT
    INTEGER ONLY
  */

  itemsBody.addEventListener(
    'input',
    event => {

      const quantityInput =
        event.target.closest(
          '.sale-row-quantity'
        );


      if(!quantityInput) return;


      const row =
        saleRows.find(
          r =>
            r.id ===
            quantityInput.dataset.rowId
        );


      if(!row) return;


      let quantity =
        Math.floor(
          Number(
            quantityInput.value
          ) || 1
        );


      quantity =
        Math.max(
          1,
          quantity
        );


      row.quantity =
        quantity;


      quantityInput.value =
        quantity;


      schedulePreview();

    }
  );


  /*
    + / - QUANTITY BUTTONS
  */

  itemsBody.addEventListener(
    'click',
    event => {

      const plus =
        event.target.closest(
          '.sale-qty-plus'
        );


      const minus =
        event.target.closest(
          '.sale-qty-minus'
        );


      if(plus || minus){

        const button =
          plus || minus;


        const row =
          saleRows.find(
            r =>
              r.id ===
              button.dataset.rowId
          );


        if(!row) return;


        let quantity =
          Math.floor(
            Number(
              row.quantity
            ) || 1
          );


        if(plus){

          quantity += 1;

        }


        if(minus){

          quantity =
            Math.max(
              1,
              quantity - 1
            );

        }


        row.quantity =
          quantity;


        const input =
          itemsBody.querySelector(
            `.sale-row-quantity[data-row-id="${CSS.escape(row.id)}"]`
          );


        if(input){

          input.value =
            quantity;

        }


        schedulePreview();

        return;

      }


      /*
        REMOVE PRODUCT
      */

      const remove =
        event.target.closest(
          '.sale-remove-row'
        );


      if(!remove) return;


      const rowId =
        remove.dataset.rowId;


      saleRows =
        saleRows.filter(
          row =>
            row.id !== rowId
        );


      if(!saleRows.length){

        createSaleRow();

      }else{

        renderSaleRows();

        schedulePreview();

      }

    }
  );


  /*
    ADD PRODUCT
  */

  $('sale-add-product').addEventListener(
    'click',
    () => {

      createSaleRow();

    }
  );


  /*
    CLEAR ALL
  */

  $('sale-clear-all').addEventListener(
    'click',
    () => {

      saleRows = [];

      createSaleRow();

      $('sale-total-final').textContent =
        '0';

      $('sale-balance-final').textContent =
        '0';

    }
  );


  /*
    EXISTING CUSTOMER
    AUTO-FILL MOBILE + ADDRESS
  */

  customerName.addEventListener(
    'change',
    () => {

      const name =
        q(
          customerName.value
        ).trim().toLowerCase();


      const customer =
        customersRows.find(
          c =>
            q(c.name)
              .trim()
              .toLowerCase() ===
            name
        );


      if(!customer) return;


      customerPhone.value =
        customer.phone || '';


      customerAddress.value =
        customer.address || '';

    }
  );


  /*
    PAID AMOUNT
  */

  paidInput.addEventListener(
    'input',
    schedulePreview
  );


  /*
    SUBMIT SALE
  */

  $('f-sale-final').onsubmit =
    async event => {

      event.preventDefault();


      const button =
        event.target.querySelector(
          'button[type="submit"]'
        );


      const items =
        saleRows
          .filter(
            row =>
              row.productId &&
              row.variantId &&
              Number(row.quantity) >= 1
          )
          .map(
            row => ({
              product_id:
                row.productId,

              variant_id:
                row.variantId,

              quantity:
                Math.floor(
                  Number(
                    row.quantity
                  )
                )
            })
          );


      if(!items.length){

        important(
          BI(
            'Ongeza angalau bidhaa moja.',
            'Add at least one product.'
          )
        );

        return;

      }


      const customerNameValue =
        q(
          customerName.value
        ).trim();


      const customerPhoneValue =
        q(
          customerPhone.value
        ).trim();


      const customerAddressValue =
        q(
          customerAddress.value
        ).trim();


      busy(
        button,
        true
      );


      try{

        /*
          Customer information is OPTIONAL.
        */

        if(
          customerNameValue ||
          customerPhoneValue ||
          customerAddressValue
        ){

          const customerResult =
            await S.sb.rpc(
              'prepare_sale_customer',
              {
                p_name:
                  customerNameValue ||
                  null,

                p_phone:
                  customerPhoneValue ||
                  null,

                p_address:
                  customerAddressValue ||
                  null
              }
            );


          if(
            customerResult.error
          ){

            throw customerResult.error;

          }

        }


        /*
          Final sale calculation
          and stock validation happen
          inside create_sale.
        */

        const result =
          await S.sb.rpc(
            'create_sale',
            {

              p_customer_name:
                customerNameValue ||
                null,

              p_paid_amount:
                Number(
                  paidInput.value || 0
                ),

              p_payment_method:
                $('sale-payment-method')
                  .value,

              p_notes:
                q(
                  event.target.querySelector(
                    '[name="notes"]'
                  )?.value
                ) || null,

              p_items:
                items

            }
          );


        if(result.error){

          throw result.error;

        }


        modal(
          'form-modal',
          false
        );


        toast(
          BI(
            'Mauzo yamekamilika.',
            'Sale completed.'
          ),
          'success'
        );


        await salesFinal();

        await dashboardFinal();

const saleId = result?.data;

if (saleId && typeof saleId === 'string') {
  try {
    await openSalesReceipt(saleId);
  } catch (receiptError) {
    console.error('Sales receipt error:', receiptError);

    toast(
      BI(
        'Mauzo yamehifadhiwa, lakini risiti haikufunguka.',
        'Sale saved, but the receipt could not be opened.'
      ),
      'warning'
    );
  }
}


      }catch(error){

        console.error(
          error
        );

        important(
          err(error)
        );


      }finally{

        busy(
          button,
          false
        );

      }

    };


  /*
    START WITH ONE EMPTY PRODUCT ROW
  */

  createSaleRow();

}


saleForm =
  saleFormFinal;

async function receiptFormFinal(){
  if(S.role!=='owner')return;
  const [sr,vr]=await Promise.all([getSuppliers(''),S.sb.rpc('get_active_product_variants')]);if(vr.error)throw vr.error;const suppliersRows=sr||[], variants=vr.data||[];
  openForm(t('actions.receiveStock'),BI('Tafuta supplier na variant kwa jina. Receipt huanza pending.','Search supplier and variant. The receipt starts as pending.'),`<form id="f-receipt-final" class="dynamic-form"><div class="form-grid">
    <div class="form-field"><label>${BI('Invoice / Receipt No.','Invoice / Receipt No.')}</label><input name="invoice_receipt_no" required></div>
    <div class="form-field"><label>${BI('Supplier','Supplier')}</label><input id="receipt-supplier-search" name="supplier_name" list="receipt-suppliers" autocomplete="off" required><datalist id="receipt-suppliers">${suppliersRows.map(x=>`<option value="${esc(x.name)}">`).join('')}</datalist><input id="receipt-supplier-id" name="supplier_id" type="hidden"></div>
    <div class="form-field"><label>${BI('Variant','Variant')}</label><input id="receipt-variant-search" name="variant_label" list="receipt-variants" autocomplete="off" required><datalist id="receipt-variants">${variants.map(x=>`<option value="${esc(`${x.product_name} — ${x.unit} ${x.volume_value||''} ${x.volume_unit||''}`)}" data-id="${esc(x.variant_id)}">`).join('')}</datalist><input id="receipt-variant-id" name="variant_id" type="hidden"></div>
    <div class="form-field"><label>${BI('Quantity','Quantity')}</label><input name="quantity" type="number" min="0.01" step="0.01" required></div>
    <div class="form-field"><label>${BI('Buying Price','Buying Price')}</label><input id="receipt-buying-price" name="buying_price" type="number" min="0" step="0.01" required></div>
    <div class="form-field"><label>${BI('Payment Reference','Payment Reference')}</label><input name="payment_reference"></div>
    <div class="form-field full"><label>${BI('Maelezo','Notes')}</label><textarea name="notes"></textarea></div>
  </div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi Receipt','Save Receipt'))}</button></div></form>`);
  $('receipt-supplier-search').addEventListener('input',()=>{const x=suppliersRows.find(r=>r.name.toLowerCase()===q($('receipt-supplier-search').value).toLowerCase());$('receipt-supplier-id').value=x?.id||''});
  $('receipt-variant-search').addEventListener('input',()=>{const label=q($('receipt-variant-search').value).toLowerCase();const x=variants.find(v=>`${v.product_name} — ${v.unit} ${v.volume_value||''} ${v.volume_unit||''}`.toLowerCase()===label);$('receipt-variant-id').value=x?.variant_id||'';if(x?.buying_price!==undefined)$('receipt-buying-price').value=x.buying_price});
  $('f-receipt-final').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));if(!d.supplier_id||!d.variant_id)throw Error(BI('Chagua supplier na variant halali kutoka kwenye orodha.','Select a valid supplier and variant from the lists.'));busy(b,true);try{const r=await S.sb.rpc('create_stock_receipt',{p_invoice_receipt_no:q(d.invoice_receipt_no),p_supplier_id:d.supplier_id,p_payment_reference:q(d.payment_reference)||null,p_notes:q(d.notes)||null,p_items:[{variant_id:d.variant_id,quantity:num(d.quantity),buying_price:num(d.buying_price)}]});if(r.error)throw r.error;modal('form-modal',false);toast(BI('Received stock imehifadhiwa kama pending.','Received stock saved as pending.'),'success');await receivedFinal()}catch(x){important(err(x))}finally{busy(b,false)}};
}
receiptForm=receiptFormFinal;

/* Replace final render map once more so the searchable forms are authoritative. */
const R_FINAL={dashboard:dashboardFinal,products:productsFinal,'received-stock':receivedFinal,stock:stockFinal,sales:salesFinal,customers:customersFinal,suppliers:suppliersFinal,'customer-payments':()=>paymentsFinal('customer'),'supplier-payments':()=>paymentsFinal('supplier'),expenses:expensesFinal,'stock-adjustments':stockAdjustmentsFinal,'sales-returns':salesReturnsFinal,reports,audit,'user-management':userMgmtFinal,devices,'developer-settings':devSettings,profile:profileFinal,settings:settingsFinal};
renderPage=async function(){const fn=R_FINAL[S.page];if(!fn)return;try{await fn();bindModuleSearch()}catch(x){console.error(x);const h=host(S.page);if(h)h.innerHTML=`<div class="error-state"><strong>${esc(BI('Imeshindikana kupakia data.','Unable to load data.'))}</strong><div>${esc(err(x))}</div><button class="btn btn-secondary btn-sm" data-action="reload-page">${esc(t('actions.reload'))}</button></div>`}};


async function salesReturnFormFinal(){
  const s=await S.sb.rpc('get_sales_for_current_user',{p_search:'',p_limit:300,p_offset:0});if(s.error)throw s.error;const completed=(s.data||[]).filter(x=>x.sale_status==='completed');
  openForm(BI('Sales Return','Sales Return'),BI('Chagua sale, kisha product na variant ya sale hiyo.','Choose a sale, then the product and variant from that sale.'),`<form id="f-return-final" class="dynamic-form"><div class="form-grid"><div class="form-field full"><label>${BI('Sale','Sale')}</label><select id="return-sale" name="sale_id" required>${optionList(completed,'sale_id',x=>`${x.receipt_no} — ${x.customer_name||BI('Cash','Cash')}`)}</select></div><div class="form-field"><label>${BI('Bidhaa','Product')}</label><select id="return-product" name="product_id" required><option value="">${BI('Chagua sale kwanza','Select a sale first')}</option></select></div><div class="form-field"><label>${BI('Variant','Variant')}</label><select id="return-variant" name="variant_id" required><option value="">${BI('Chagua product kwanza','Select a product first')}</option></select></div><div class="form-field"><label>${BI('Quantity','Quantity')}</label><input name="quantity" type="number" min="0.01" step="0.01" required></div><div class="form-field full"><label>${BI('Sababu','Reason')}</label><textarea name="reason" required></textarea></div></div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-form-modal">${esc(t('common.cancel'))}</button><button class="btn btn-primary">${esc(BI('Hifadhi Return','Save Return'))}</button></div></form>`);
  let items=[];
  $('return-sale').addEventListener('change',async()=>{const id=$('return-sale').value;$('return-product').innerHTML=`<option value="">${BI('Inapakia...','Loading...')}</option>`;$('return-variant').innerHTML=`<option value="">${BI('Chagua product kwanza','Select a product first')}</option>`;if(!id)return;const r=await S.sb.rpc('get_sale_details',{p_sale_id:id});if(r.error){important(err(r.error));return}let items=r.data||[];const products=[...new Map(items.map(x=>[x.product_id,{product_id:x.product_id,product_name:x.product_name}])).values()];$('return-product').innerHTML=`<option value="">${BI('Chagua product','Select product')}</option>`+products.map(x=>`<option value="${esc(x.product_id)}">${esc(x.product_name)}</option>`).join('')});
  $('return-product').addEventListener('change',()=>{const pid=$('return-product').value;const vars=items.filter(x=>x.product_id===pid);$('return-variant').innerHTML=`<option value="">${BI('Chagua variant','Select variant')}</option>`+vars.map(x=>`<option value="${esc(x.variant_id)}">${esc(x.unit)} ${esc(x.volume_value||'')} ${esc(x.volume_unit||'')} — ${esc(x.quantity)} ${BI('available','available')}</option>`).join('')});
  $('f-return-final').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button[type=submit]'),d=Object.fromEntries(new FormData(e.target));busy(b,true);try{const r=await S.sb.from('sales_returns').insert({sale_id:d.sale_id,product_id:d.product_id,variant_id:d.variant_id,quantity:num(d.quantity),reason:q(d.reason)}).select('id').single();if(r.error)throw r.error;modal('form-modal',false);toast(BI('Return imehifadhiwa.','Return saved.'),'success');await salesReturnsFinal()}catch(x){important(err(x))}finally{busy(b,false)}};
}
salesReturnForm=salesReturnFormFinal;

/* Complete static HTML translation coverage. */
const EXTRA_EN={
'actions.customer':'Customer','actions.products':'Products','actions.receivedStock':'Received Stock','actions.sale':'Sale','auth.continue':'Continue','auth.resetEyebrow':'Password Reset',
'dashboard.modulesEyebrow':'Modules','dashboard.modulesText':'Open the business module you need.','dashboard.modulesTitle':'Business Modules',
'sidebar.account':'Account','sidebar.auditLogs':'Audit Logs','sidebar.business':'Business','sidebar.control':'Control','sidebar.customerPayments':'Customer Payments','sidebar.customers':'Customers','sidebar.dashboard':'Dashboard','sidebar.developer':'Developer','sidebar.developerSettings':'Developer Settings','sidebar.devicesSessions':'Devices & Sessions','sidebar.expenses':'Expenses','sidebar.finance':'Finance','sidebar.logout':'Logout','sidebar.products':'Products','sidebar.profile':'My Profile','sidebar.receivedStock':'Received Stock','sidebar.reports':'Reports','sidebar.sales':'Sales','sidebar.salesReturns':'Sales Returns','sidebar.settings':'Settings','sidebar.stock':'Stock','sidebar.stockAdjustments':'Stock Adjustments','sidebar.supplierPayments':'Supplier Payments','sidebar.suppliers':'Suppliers','sidebar.userManagement':'User Management',
'moduleCards.auditLogs':'Review security and business activity.',
'moduleCards.customerPayments':'Record customer payments and balances.',
'moduleCards.customers':'Manage customers and credit.',
'moduleCards.developerSettings':'System and developer controls.',
'moduleCards.devicesSessions':'Manage registered devices and sessions.',
'moduleCards.expenses':'Record and manage business expenses.',
'moduleCards.products':'Manage products, prices and variants.',
'moduleCards.receivedStock':'Record supplier stock receipts.',
'moduleCards.reports':'View business reports and summaries.',
'moduleCards.sales':'Create and manage sales.',
'moduleCards.salesReturns':'Record returned goods from sales.',
'moduleCards.settings':'Manage system settings.',
'moduleCards.stock':'View current stock and stock levels.',
'moduleCards.stockAdjustments':'Record stock increases or decreases.',
'moduleCards.supplierPayments':'Record supplier payments and balances.',
'moduleCards.suppliers':'Manage suppliers and purchase history.',
'moduleCards.userManagement':'Approve and manage system users.',
};
const EXTRA_SW={
'actions.customer':'Mteja','actions.products':'Bidhaa',
'actions.receivedStock':'Stock Iliyopokelewa',
'actions.sale':'Mauzo','auth.continue':'Endelea',
'auth.resetEyebrow':'Kubadilisha Password',
'dashboard.modulesEyebrow':'Modules',
'dashboard.modulesText':'Fungua module ya biashara unayohitaji.','dashboard.modulesTitle':'Modules za Biashara',
'sidebar.account':'Akaunti','sidebar.auditLogs':'Audit Logs','sidebar.business':'Biashara','sidebar.control':'Udhibiti','sidebar.customerPayments':'Malipo ya Wateja','sidebar.customers':'Wateja','sidebar.dashboard':'Dashibodi','sidebar.developer':'Developer','sidebar.developerSettings':'Developer Settings','sidebar.devicesSessions':'Devices & Sessions','sidebar.expenses':'Gharama','sidebar.finance':'Fedha','sidebar.logout':'Toka','sidebar.products':'Bidhaa','sidebar.profile':'Wasifu Wangu','sidebar.receivedStock':'Stock Iliyopokelewa','sidebar.reports':'Ripoti','sidebar.sales':'Mauzo','sidebar.salesReturns':'Returns za Mauzo','sidebar.settings':'Settings','sidebar.stock':'Stock','sidebar.stockAdjustments':'Marekebisho ya Stock','sidebar.supplierPayments':'Malipo ya Suppliers','sidebar.suppliers':'Suppliers','sidebar.userManagement':'Usimamizi wa Watumiaji',
'moduleCards.auditLogs':'Kagua shughuli za usalama na biashara.',
'moduleCards.customerPayments':'Rekodi malipo na madeni ya wateja.',
'moduleCards.customers':'Simamia wateja na madeni yao.',
'moduleCards.developerSettings':'Udhibiti wa mfumo na developer.',
'moduleCards.devicesSessions':'Simamia devices na sessions zilizosajiliwa.',
'moduleCards.expenses':'Rekodi na simamia gharama za biashara.',
'moduleCards.products':'Simamia bidhaa, bei na variants.',
'moduleCards.receivedStock':'Rekodi mapokezi ya stock kutoka suppliers.',
'moduleCards.reports':'Angalia ripoti na muhtasari wa biashara.',
'moduleCards.sales':'Tengeneza na simamia mauzo.',
'moduleCards.salesReturns':'Rekodi bidhaa zilizorejeshwa kwenye mauzo.',
'moduleCards.settings':'Simamia settings za mfumo.',
'moduleCards.stock':'Angalia stock iliyopo na viwango vyake.',
'moduleCards.stockAdjustments':'Rekodi ongezeko au upungufu wa stock.',
'moduleCards.supplierPayments':'Rekodi malipo na madeni ya suppliers.',
'moduleCards.suppliers':'Simamia suppliers na historia ya manunuzi.',
'moduleCards.userManagement':'Approve na simamia watumiaji wa mfumo.',
/* RLS: ENABLED (KEEP ENABLED) */
'profile.fullName':'Jina Kamili',
'profile.username':'Username',
'profile.email':'Barua Pepe',
'profile.phone':'Simu',
'profile.role':'Role',
'profile.status':'Hali ya Akaunti',
'profile.createdAt':'Imeundwa',
'profile.active':'Active',
'profile.changePhoto':'Badili Picha',
'profile.removePhoto':'Ondoa Picha',
'profile.photoHelp':'Tumia picha yoyote inayoungwa mkono na kifaa.',
'profile.takePhoto':'Piga Picha',
'profile.moreInfo':'Taarifa Zaidi za Wasifu',
'profile.detailsEyebrow':'Wasifu',
'profile.detailsTitle':'Taarifa Zaidi za Wasifu',
'profile.detailsDescription':'Taarifa nyingine za wasifu zinazopatikana kwako.',
'profile.zoom':'Kuza',
'profile.cropTitle':'Kata Picha ya Wasifu',
'profile.cropDescription':'Rekebisha picha kabla ya kuihifadhi.',
'profile.cropHint':'Buruta picha kurekebisha nafasi yake.',
'modules.profile.eyebrow':'Akaunti',
'modules.profile.title':'Wasifu Wangu',
'modules.profile.description':'Angalia na sasisha taarifa zako.',
}

/* RLS: ENABLED (KEEP ENABLED) */

Object.assign(EN,EXTRA_EN);
Object.assign(SW,EXTRA_SW);

/* =========================================================
   COMPLETE MODULE PAGE TRANSLATIONS
   Applies to ALL dashboard modules.
   ========================================================= */

Object.assign(EN,{

  'modules.auditLogs.eyebrow':'Security',
  'modules.auditLogs.title':'Audit Logs',
  'modules.auditLogs.description':'Review recorded security and business actions.',

  'modules.customerPayments.eyebrow':'Finance',
  'modules.customerPayments.title':'Customer Payments',
  'modules.customerPayments.description':'Record and review customer payments.',

  'modules.customers.eyebrow':'Customers',
  'modules.customers.title':'Customers',
  'modules.customers.description':'Manage customer records and status.',

  'modules.developerSettings.eyebrow':'Developer',
  'modules.developerSettings.title':'Developer Settings',
  'modules.developerSettings.description':'Review system and session information.',

  'modules.devicesSessions.eyebrow':'Developer',
  'modules.devicesSessions.title':'Devices & Sessions',
  'modules.devicesSessions.description':'Review registered devices and active sessions.',

  'modules.expenses.eyebrow':'Finance',
  'modules.expenses.title':'Expenses',
  'modules.expenses.description':'Record and manage business expenses.',

  'modules.products.eyebrow':'Inventory',
  'modules.products.title':'Products',
  'modules.products.description':'Manage products, prices and variants.',

  'modules.profile.eyebrow':'Account',
  'modules.profile.title':'My Profile',
  'modules.profile.description':'View and update your profile information.',

  'modules.receivedStock.eyebrow':'Inventory',
  'modules.receivedStock.title':'Received Stock',
  'modules.receivedStock.description':'Record supplier deliveries and verify receipts.',

  'modules.reports.eyebrow':'Reports',
  'modules.reports.title':'Reports',
  'modules.reports.description':'Review business summaries from live data.',

  'modules.sales.eyebrow':'Sales',
  'modules.sales.title':'Sales',
  'modules.sales.description':'Create and review sales.',

  'modules.salesReturns.eyebrow':'Sales',
  'modules.salesReturns.title':'Sales Returns',
  'modules.salesReturns.description':'Record and review returned goods.',

  'modules.settings.eyebrow':'System',
  'modules.settings.title':'Settings',
  'modules.settings.description':'Manage system settings.',

  'modules.stock.eyebrow':'Inventory',
  'modules.stock.title':'Stock',
  'modules.stock.description':'Monitor current stock and low-stock items.',

  'modules.stockAdjustments.eyebrow':'Inventory',
  'modules.stockAdjustments.title':'Stock Adjustments',
  'modules.stockAdjustments.description':'Record approved stock increases or decreases.',

  'modules.supplierPayments.eyebrow':'Finance',
  'modules.supplierPayments.title':'Supplier Payments',
  'modules.supplierPayments.description':'Record and review supplier payments.',

  'modules.suppliers.eyebrow':'Suppliers',
  'modules.suppliers.title':'Suppliers',
  'modules.suppliers.description':'Manage supplier records and purchase history.',

  'modules.userManagement.eyebrow':'Developer',
  'modules.userManagement.title':'User Management',
  'modules.userManagement.description':'Approve and manage application users.'

});

Object.assign(SW,{

  'modules.auditLogs.eyebrow':'Usalama',
  'modules.auditLogs.title':'Audit Logs',
  'modules.auditLogs.description':'Kagua vitendo vya usalama na biashara vilivyorekodiwa.',

  'modules.customerPayments.eyebrow':'Fedha',
  'modules.customerPayments.title':'Malipo ya Wateja',
  'modules.customerPayments.description':'Rekodi na kagua malipo ya wateja.',

  'modules.customers.eyebrow':'Wateja',
  'modules.customers.title':'Wateja',
  'modules.customers.description':'Simamia taarifa na hali za wateja.',

  'modules.developerSettings.eyebrow':'Developer',
  'modules.developerSettings.title':'Developer Settings',
  'modules.developerSettings.description':'Kagua taarifa za mfumo na session.',

  'modules.devicesSessions.eyebrow':'Developer',
  'modules.devicesSessions.title':'Devices & Sessions',
  'modules.devicesSessions.description':'Kagua devices zilizosajiliwa na sessions.',

  'modules.expenses.eyebrow':'Fedha',
  'modules.expenses.title':'Gharama',
  'modules.expenses.description':'Rekodi na simamia gharama za biashara.',

  'modules.products.eyebrow':'Inventory',
  'modules.products.title':'Bidhaa',
  'modules.products.description':'Simamia bidhaa, bei na variants.',

  'modules.profile.eyebrow':'Akaunti',
  'modules.profile.title':'Wasifu Wangu',
  'modules.profile.description':'Angalia na sasisha taarifa zako.',

  'modules.receivedStock.eyebrow':'Inventory',
  'modules.receivedStock.title':'Stock Iliyopokelewa',
  'modules.receivedStock.description':'Rekodi delivery za suppliers na thibitisha receipts.',

  'modules.reports.eyebrow':'Ripoti',
  'modules.reports.title':'Ripoti',
  'modules.reports.description':'Kagua muhtasari wa biashara kutoka kwenye data hai.',

  'modules.sales.eyebrow':'Mauzo',
  'modules.sales.title':'Mauzo',
  'modules.sales.description':'Tengeneza na kagua mauzo.',

  'modules.salesReturns.eyebrow':'Mauzo',
  'modules.salesReturns.title':'Returns za Mauzo',
  'modules.salesReturns.description':'Rekodi na kagua bidhaa zilizorejeshwa.',

  'modules.settings.eyebrow':'Mfumo',
  'modules.settings.title':'Settings',
  'modules.settings.description':'Simamia settings za mfumo.',

  'modules.stock.eyebrow':'Inventory',
  'modules.stock.title':'Stock',
  'modules.stock.description':'Fuatilia stock iliyopo na bidhaa zenye stock ndogo.',

  'modules.stockAdjustments.eyebrow':'Inventory',
  'modules.stockAdjustments.title':'Marekebisho ya Stock',
  'modules.stockAdjustments.description':'Rekodi ongezeko au upungufu wa stock.',

  'modules.supplierPayments.eyebrow':'Fedha',
  'modules.supplierPayments.title':'Malipo ya Suppliers',
  'modules.supplierPayments.description':'Rekodi na kagua malipo ya suppliers.',

  'modules.suppliers.eyebrow':'Suppliers',
  'modules.suppliers.title':'Suppliers',
  'modules.suppliers.description':'Simamia suppliers na historia ya manunuzi.',

  'modules.userManagement.eyebrow':'Developer',
  'modules.userManagement.title':'Usimamizi wa Watumiaji',
  'modules.userManagement.description':'Approve na simamia watumiaji wa mfumo.'

});


window.SGC={config:CFG,state:S,navigate:nav,toggleLanguage:()=>{S.lang=S.lang==='sw'?'en':'sw';applyLang()},setLanguage:v=>{S.lang=v==='en'?'en':'sw';applyLang()},login,signup,logout,deviceRegister,perm,loadProfile,updateChrome,renderPage,products:productsFinal,customers:customersFinal,suppliers:suppliersFinal,receivedStock:receivedFinal,stock:stockFinal,sales:salesFinal,expenses:expensesFinal,reports,audit,userManagement:userMgmtFinal,devices,salesReturns:salesReturnsFinal,settings:settingsFinal,profile:profileFinal,rpc:(name,args)=>S.sb.rpc(name,args)};document.readyState==='loading'
?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();

