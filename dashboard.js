/* SGC EMERGENCY NAVIGATION — independent of database/auth/loading code.
   RLS: USIBADILISHE — this is frontend navigation only. */
(function(){
  const routes={
    dashboard:['dashboardNavBtn',null],
    stock:['stockNavBtn','currentStockPage'],
    products:['productsNavBtn','productsPage'],
    receivedStock:['receivedStockNavBtn','receivedStockPage'],
    sales:['salesNavBtn','salesPage'],
    receipts:['receiptsNavBtn','receiptsPage'],
    customers:['customersNavBtn','customersPage'],
    suppliers:['suppliersNavBtn','suppliersPage'],
    expenses:['expensesNavBtn','expensesPage'],
    payments:['paymentsNavBtn','paymentsPage'],
    reports:['reportsNavBtn','reportsPage'],
    users:['usersNavBtn','usersPage'],
    settings:['settingsNavBtn','settingsPage']
  };

  function openRoute(name){
    const r=routes[name];
    if(!r) return;

    const all=document.querySelectorAll('.page-view');

    all.forEach(p=>{
      p.classList.remove('active','sgc-force-active');
      p.style.display='none';
      p.style.visibility='hidden';
    });

    document.querySelectorAll('.nav button')
      .forEach(b=>b.classList.remove('active'));

    const welcome=document.querySelector('.content > .welcome');
    const cards=document.querySelector('.content > .cards');
    const grid=document.querySelector('.content > .grid-two');

    const dashboard=name==='dashboard';

    if(welcome) welcome.style.display=dashboard?'':'none';
    if(cards) cards.style.display=dashboard?'':'none';
    if(grid) grid.style.display=dashboard?'':'none';

    const btn=document.getElementById(r[0]);

    if(btn) btn.classList.add('active');

    if(r[1]){
      const page=document.getElementById(r[1]);

      if(page){
        page.classList.add('active','sgc-force-active');
        page.style.display='block';
        page.style.visibility='visible';
      }
    }

    window.__SGC_EMERGENCY_ROUTE=name;
  }

  function install(){

    document.addEventListener('click',function(e){

      const btn=e.target.closest('.nav button');

      if(!btn) return;

      const name=Object.keys(routes)
        .find(k=>routes[k][0]===btn.id);

      if(!name) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      openRoute(name);

      setTimeout(()=>{
        openRoute(name);
      },0);

    },true);

    window.__SGCEmergencyOpen=openRoute;
    window.__SGC_NAV_READY=true;
  }

  if(document.readyState==='loading'){
    document.addEventListener(
      'DOMContentLoaded',
      install,
      {once:true}
    );
  }else{
    install();
  }

})();


/* ===== Extracted inline module ===== */

window.__openSGCSection = function(section){

  try{

    var pageIds=[
      'dashboardPage',
      'currentStockPage',
      'productsPage',
      'receivedStockPage',
      'salesPage',
      'receiptsPage',
      'customersPage',
      'suppliersPage',
      'expensesPage',
      'paymentsPage',
      'reportsPage',
      'usersPage',
      'settingsPage'
    ];

    pageIds.forEach(function(id){

      var p=document.getElementById(id);

      if(p){
        p.classList.remove(
          'active',
          'sgc-force-active'
        );

        p.style.removeProperty('display');
      }

    });

    document
      .querySelectorAll('.nav button')
      .forEach(function(b){
        b.classList.remove('active');
      });

    var welcome=
      document.querySelector('.content > .welcome');

    if(welcome)
      welcome.style.display='none';

    var cards=
      document.querySelector('.content > .cards');

    if(cards)
      cards.style.display='none';

    var grid=
      document.querySelector('.content > .grid-two');

    if(grid)
      grid.style.display='none';

    var page=
      document.getElementById(section+'Page');

    var btn=
      document.getElementById(section+'NavBtn');

    if(!page || !btn){

      console.error(
        'SGC navigation target not found:',
        section
      );

      return false;
    }

    page.classList.add(
      'active',
      'sgc-force-active'
    );

    page.style.display='block';

    btn.classList.add('active');

    if(
      section==='customers' &&
      typeof loadCustomers==='function'
    )
      loadCustomers();

    if(
      section==='expenses' &&
      typeof loadExpenses==='function'
    )
      loadExpenses();

    if(
      section==='payments' &&
      typeof loadPayments==='function'
    )
      loadPayments();

    if(
      section==='reports' &&
      typeof loadReports==='function'
    )
      loadReports();

    if(
      section==='users' &&
      typeof loadUsers==='function'
    )
      loadUsers();

    if(
      section==='settings' &&
      typeof loadSettings==='function'
    )
      loadSettings();

    if(
      window.innerWidth<=800 &&
      typeof sidebar!=='undefined' &&
      sidebar
    )
      sidebar.classList.remove('open');

    return false;

  }catch(error){

    console.error(
      'SGC section navigation error:',
      error
    );

    return false;
  }

};


/* ==========================================
   SGC SOFT DRINKS MANAGEMENT
   DASHBOARD
   ========================================== */

const SUPABASE_URL =
  "https://prqhqogcisjwzcsxyics.supabase.co";

const SUPABASE_AUTH_URL =
  `${SUPABASE_URL}/auth/v1`;

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_M1j6cLFnEVGULYaCfssaZg_KkFCLAcQ";


/* Use the same Supabase Auth session as the login application. */

const supabaseAuthClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth:{
        persistSession:true,
        autoRefreshToken:true,
        detectSessionInUrl:false
      }
    }
  );


/* ==========================================
   LANGUAGE
   ========================================== */

const translations = {

  sw: {

    main_menu: "Main Menu",
    dashboard: "Dashboard",
    overview_text: "Muhtasari wa biashara yako",

    stock: "Stock",
    received_stock: "Stock Iliyoingia",
    receipts: "Risiti",
    received_history: "Historia",
    sales: "Mauzo",
    customers: "Wateja",
    suppliers: "Suppliers",

    finance: "Fedha",
    expenses: "Matumizi",
    payments: "Malipo",
    reports: "Ripoti",
    reports_menu: "Ripoti",

    administration: "Usimamizi",
    users: "Watumiaji",
    settings: "Mipangilio",
    logout: "Toka",

    welcome: "Karibu",

    welcome_message:
      "Karibu kwenye SGC SOFT DRINKS MANAGEMENT. Dhibiti biashara yako kwa urahisi.",

    today_sales: "Mauzo ya Leo",
    stock_value: "Thamani ya Stock",
    today_transactions: "Transactions Leo",
    customers_count: "Wateja",

    quick_actions: "Vitendo vya Haraka",

    receive_stock: "Pokea Stock",

    receive_stock_desc:
      "Rekodi bidhaa mpya zilizoingia",

    new_sale: "Mauzo Mapya",

    new_sale_desc:
      "Rekodi mauzo ya bidhaa",

    sales_title: "Mauzo",

    sales_subtitle:
      "Rekodi mauzo, fuatilia malipo na tafuta receipts.",

    sales_total: "Mauzo ya Leo",
    sales_paid: "Zimelipwa",
    sales_credit: "Credit",
    sales_transactions: "Transactions",

    search_sales:
      "Tafuta receipt...",

    new_sale_title:
      "Mauzo Mapya",

    customer: "Mteja",

    walk_in_customer:
      "Mteja wa kawaida",

    payment_method:
      "Njia ya Malipo",

    paid_amount:
      "Kilicholipwa",

    sale_notes:
      "Notes",

    sale_items:
      "Bidhaa za Mauzo",

    grand_total:
      "Jumla",

    balance:
      "Balance",

    save_sale:
      "Hifadhi Sale",

    sales_history:
      "Historia ya Mauzo",

    receipt_no:
      "Receipt",

    salesman:
      "Salesman",

    view:
      "Tazama",

    print:
      "Print",

    sale_saved:
      "Sale imehifadhiwa vizuri.",

    sale_error:
      "Imeshindikana kuhifadhi sale.",

    customer_required_credit:
      "Credit/partial payment inahitaji customer.",

    no_sale_items:
      "Ongeza angalau bidhaa moja.",

    duplicate_sale_product:
      "Bidhaa hiyo tayari ipo kwenye mstari mwingine.",

    new_customer:
      "Mteja Mpya",

    new_customer_desc:
      "Ongeza mteja mpya",

    new_expense:
      "Expense Mpya",

    new_expense_desc:
      "Rekodi matumizi ya biashara",

    recent_activity:
      "Shughuli za Karibuni",

    no_activity:
      "Hakuna shughuli bado.",

    products_title:
      "Bidhaa",

    products_subtitle:
      "Simamia bidhaa, bei za mauzo na viwango vya stock.",

    search_products:
      "Tafuta bidhaa...",

    add_product:
      "Ongeza Bidhaa",

    products_list:
      "Orodha ya Bidhaa",

    product:
      "Bidhaa",

    selling_price:
      "Bei ya Mauzo",

    low_stock:
      "Low Stock",

    status:
      "Hali",

    actions:
      "Vitendo",

    active:
      "Hai",

    inactive:
      "Haifanyi kazi",

    edit:
      "Hariri",

    activate:
      "Washa",

    deactivate:
      "Zima",

    loading:
      "Inapakia...",

    no_products:
      "Hakuna bidhaa zilizopatikana.",

    add_product_title:
      "Ongeza Bidhaa",

    edit_product_title:
      "Hariri Bidhaa",

    product_name:
      "Jina la Bidhaa",

    selling_price_label:
      "Bei ya Mauzo",

    low_stock_label:
      "Kiwango cha Low Stock",

    cancel:
      "Ghairi",

    save:
      "Hifadhi",

    product_saved:
      "Bidhaa imehifadhiwa vizuri.",

    product_updated:
      "Bidhaa imesasishwa vizuri.",

    product_activated:
      "Bidhaa imewashwa.",

    product_deactivated:
      "Bidhaa imezimwa.",

    product_error:
      "Kuna tatizo. Tafadhali jaribu tena.",

    name_required:
      "Jina la bidhaa linahitajika.",

    stock_title:
      "Stock",

    stock_subtitle:
      "Pokea, thibitisha na fuatilia bidhaa zinazoingia.",

    pending_receipts:
      "Receipts Pending",

    verified_receipts:
      "Receipts Zilizothibitishwa",

    rejected_receipts:
      "Receipts Zilizokataliwa",

    receive_stock_tab:
      "Pokea Stock",

    receipts_tab:
      "Receipts",

    new_receipt:
      "Receipt Mpya",

    receive_stock_title:
      "Pokea Stock",

    pending_note:
      "Itahifadhiwa kama Pending mpaka Owner athibitishe.",

    invoice_no:
      "Invoice / Receipt No.",

    supplier:
      "Supplier",

    select_supplier:
      "Chagua Supplier",

    payment_reference:
      "Payment Reference",

    notes:
      "Notes",

    stock_items:
      "Bidhaa Zilizopokelewa",

    add_item:
      "Ongeza Bidhaa",

    receipt_total:
      "Jumla ya Receipt",

    clear:
      "Futa",

    save_pending:
      "Hifadhi Pending",

    packaging:
      "Ufungashaji",

    quantity:
      "Kiasi",

    buying_price:
      "Bei ya Manunuzi",

    stock_receipts:
      "Stock Receipts",

    refresh:
      "Refresh",

    total:
      "Jumla",

    date:
      "Tarehe",

    verify:
      "Thibitisha",

    reject:
      "Kataa",

    confirm_verify:
      "Una uhakika unataka kuthibitisha receipt hii?",

    rejection_prompt:
      "Andika sababu ya kukataa:",

    receipt_saved:
      "Stock receipt imehifadhiwa kama Pending.",

    receipt_verified:
      "Stock receipt imethibitishwa na stock itaingia.",

    receipt_rejected:
      "Stock receipt imekataliwa.",

    no_receipts:
      "Hakuna stock receipts.",

    load_error:
      "Imeshindikana kupakia data.",

    no_active_products:
      "Hakuna bidhaa hai. Ongeza bidhaa kwanza."

  },


  en: {

    main_menu:
      "Main Menu",

    dashboard:
      "Dashboard",

    overview_text:
      "Overview of your business",

    stock:
      "Stock",

    received_stock:
      "Received Stock",

    sales:
      "Sales",

    customers:
      "Customers",

    suppliers:
      "Suppliers",

    finance:
      "Finance",

    expenses:
      "Expenses",

    payments:
      "Payments",

    reports:
      "Reports",

    reports_menu:
      "Reports",

    administration:
      "Administration",

    users:
      "Users",

    settings:
      "Settings",

    logout:
      "Logout",

    welcome:
      "Welcome",

    welcome_message:
      "Welcome to SGC SOFT DRINKS MANAGEMENT. Manage your business with ease.",

    today_sales:
      "Today's Sales",

    stock_value:
      "Stock Value",

    today_transactions:
      "Today's Transactions",

    customers_count:
      "Customers",

    quick_actions:
      "Quick Actions",

    receive_stock:
      "Receive Stock",

    receive_stock_desc:
      "Record newly received products",

    new_sale:
      "New Sale",

    new_sale_desc:
      "Record a product sale",

    sales_title:
      "Sales",

    sales_subtitle:
      "Record sales, track payments and search receipts.",

    sales_total:
      "Today Sales",

    sales_paid:
      "Paid",

    sales_credit:
      "Credit",

    sales_transactions:
      "Transactions",

    search_sales:
      "Search receipt...",

    new_sale_title:
      "New Sale",

    customer:
      "Customer",

    walk_in_customer:
      "Walk-in Customer",

    payment_method:
      "Payment Method",

    paid_amount:
      "Paid Amount",

    sale_notes:
      "Notes",

    sale_items:
      "Sale Items",

    grand_total:
      "Total",

    balance:
      "Balance",

    save_sale:
      "Save Sale",

    sales_history:
      "Sales History",

    receipt_no:
      "Receipt",

    salesman:
      "Salesman",

    view:
      "View",

    print:
      "Print",

    sale_saved:
      "Sale saved successfully.",

    sale_error:
      "Failed to save sale.",

    customer_required_credit:
      "Credit/partial payment requires a customer.",

    no_sale_items:
      "Add at least one product.",

    duplicate_sale_product:
      "That product is already on another line.",

    new_customer:
      "New Customer",

    new_customer_desc:
      "Add a new customer",

    new_expense:
      "New Expense",

    new_expense_desc:
      "Record business expenses",

    recent_activity:
      "Recent Activity",

    no_activity:
      "No activity yet.",

    products_title:
      "Products",

    products_subtitle:
      "Manage products, selling prices and stock levels.",

    search_products:
      "Search products...",

    add_product:
      "Add Product",

    products_list:
      "Product List",

    product:
      "Product",

    selling_price:
      "Selling Price",

    low_stock:
      "Low Stock",

    status:
      "Status",

    actions:
      "Actions",

    active:
      "Active",

    inactive:
      "Inactive",

    edit:
      "Edit",

    activate:
      "Activate",

    deactivate:
      "Deactivate",

    loading:
      "Loading...",

    no_products:
      "No products found.",

    add_product_title:
      "Add Product",

    edit_product_title:
      "Edit Product",

    product_name:
      "Product Name",

    selling_price_label:
      "Selling Price",

    low_stock_label:
      "Low Stock Level",

    cancel:
      "Cancel",

    save:
      "Save",

    product_saved:
      "Product saved successfully.",

    product_updated:
      "Product updated successfully.",

    product_activated:
      "Product activated.",

    product_deactivated:
      "Product deactivated.",

    product_error:
      "Something went wrong. Please try again.",

    name_required:
      "Product name is required.",

    stock_title:
      "Stock",

    stock_subtitle:
      "Receive, verify and track incoming products.",

    pending_receipts:
      "Pending Receipts",

    verified_receipts:
      "Verified Receipts",

    rejected_receipts:
      "Rejected Receipts",

    receive_stock_tab:
      "Receive Stock",

    receipts_tab:
      "Receipts",

    new_receipt:
      "New Receipt",

    receive_stock_title:
      "Receive Stock",

    pending_note:
      "It will remain Pending until the Owner verifies it.",

    invoice_no:
      "Invoice / Receipt No.",

    supplier:
      "Supplier",

    select_supplier:
      "Select Supplier",

    payment_reference:
      "Payment Reference",

    notes:
      "Notes",

    stock_items:
      "Received Products",

    add_item:
      "Add Product",

    receipt_total:
      "Receipt Total",

    clear:
      "Clear",

    save_pending:
      "Save Pending",

    packaging:
      "Packaging",

    quantity:
      "Quantity",

    buying_price:
      "Buying Price",

    stock_receipts:
      "Stock Receipts",

    refresh:
      "Refresh",

    total:
      "Total",

    date:
      "Date",

    verify:
      "Verify",

    reject:
      "Reject",

    confirm_verify:
      "Are you sure you want to verify this receipt?",

    rejection_prompt:
      "Enter rejection reason:",

    receipt_saved:
      "Stock receipt saved as Pending.",

    receipt_verified:
      "Stock receipt verified and stock will be added.",

    receipt_rejected:
      "Stock receipt rejected.",

    no_receipts:
      "No stock receipts.",

    load_error:
      "Failed to load data.",

    no_active_products:
      "No active products. Add a product first."

  }

};


let currentLanguage =
  localStorage.getItem("sgc_language") || "sw";


function applyLanguage(language){

  currentLanguage=language;

  localStorage.setItem(
    "sgc_language",
    language
  );

  document
    .querySelectorAll("[data-i18n]")
    .forEach(element=>{

      const key=
        element.getAttribute("data-i18n");

      if(
        translations[language] &&
        translations[language][key]
      ){

        element.textContent=
          translations[language][key];

      }

    });

  document
    .querySelectorAll("[data-i18n-placeholder]")
    .forEach(element=>{

      const key=
        element.getAttribute(
          "data-i18n-placeholder"
        );

      if(
        translations[language] &&
        translations[language][key]
      ){

        element.placeholder=
          translations[language][key];

      }

    });

}
/* ==========================================
   GLOBAL STATE
   ========================================== */

let currentUser = null;
let currentProfile = null;
let currentRole = null;

let customersData = [];
let suppliersData = [];
let productsData = [];
let variantsData = [];
let salesData = [];
let expensesData = [];
let paymentsData = [];
let reportsData = [];

let selectedCustomer = null;
let selectedSupplier = null;
let selectedProduct = null;
let selectedSale = null;

let dashboardInitialized = false;


/* ==========================================
   DOM HELPERS
   ========================================== */

function $(selector){
  return document.querySelector(selector);
}

function $$(selector){
  return Array.from(
    document.querySelectorAll(selector)
  );
}

function byId(id){
  return document.getElementById(id);
}

function showElement(element){
  if(!element) return;

  element.style.display='';
  element.style.visibility='visible';
  element.hidden=false;
}

function hideElement(element){
  if(!element) return;

  element.style.display='none';
  element.style.visibility='hidden';
}

function escapeHtml(value){

  if(value === null || value === undefined)
    return '';

  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}


/* ==========================================
   NUMBER / MONEY HELPERS
   ========================================== */

function numberValue(value){

  const n=Number(value);

  return Number.isFinite(n) ? n : 0;
}


function formatMoney(value){

  return new Intl.NumberFormat(
    'en-TZ',
    {
      minimumFractionDigits:2,
      maximumFractionDigits:2
    }
  ).format(
    numberValue(value)
  );
}


function formatDate(value){

  if(!value) return '';

  const date=new Date(value);

  if(Number.isNaN(date.getTime()))
    return String(value);

  return new Intl.DateTimeFormat(
    currentLanguage==='sw'
      ? 'sw-TZ'
      : 'en-TZ',
    {
      year:'numeric',
      month:'short',
      day:'numeric'
    }
  ).format(date);
}


function formatDateTime(value){

  if(!value) return '';

  const date=new Date(value);

  if(Number.isNaN(date.getTime()))
    return String(value);

  return new Intl.DateTimeFormat(
    currentLanguage==='sw'
      ? 'sw-TZ'
      : 'en-TZ',
    {
      year:'numeric',
      month:'short',
      day:'numeric',
      hour:'2-digit',
      minute:'2-digit'
    }
  ).format(date);
}


/* ==========================================
   TOAST / NOTIFICATION
   ========================================== */

function showToast(
  message,
  type='info'
){

  let container=
    byId('sgcToastContainer');

  if(!container){

    container=
      document.createElement('div');

    container.id=
      'sgcToastContainer';

    container.style.position=
      'fixed';

    container.style.right=
      '20px';

    container.style.bottom=
      '20px';

    container.style.zIndex=
      '99999';

    container.style.display=
      'flex';

    container.style.flexDirection=
      'column';

    container.style.gap=
      '10px';

    document.body.appendChild(
      container
    );
  }


  const toast=
    document.createElement('div');

  toast.className=
    `sgc-toast sgc-toast-${type}`;

  toast.textContent=
    message;


  toast.style.padding=
    '12px 16px';

  toast.style.borderRadius=
    '10px';

  toast.style.background=
    '#111827';

  toast.style.color=
    '#ffffff';

  toast.style.boxShadow=
    '0 8px 25px rgba(0,0,0,.20)';

  toast.style.maxWidth=
    '360px';

  toast.style.fontSize=
    '14px';


  container.appendChild(
    toast
  );


  setTimeout(()=>{

    toast.style.opacity='0';

    toast.style.transform=
      'translateY(10px)';

    toast.style.transition=
      'all .25s ease';

    setTimeout(()=>{
      toast.remove();
    },300);

  },3000);

}


function showSuccess(message){
  showToast(message,'success');
}


function showError(message){
  showToast(message,'error');
}


function showInfo(message){
  showToast(message,'info');
}


/* ==========================================
   SUPABASE HELPERS
   ========================================== */

async function getSession(){

  const {
    data,
    error
  } =
    await supabaseAuthClient
      .auth
      .getSession();


  if(error){

    console.error(
      'Supabase getSession error:',
      error
    );

    return null;
  }

  return data?.session || null;
}


async function getUser(){

  const session=
    await getSession();

  return session?.user || null;
}


async function callRpc(
  functionName,
  params={}
){

  try{

    const {
      data,
      error
    } =
      await supabaseAuthClient
        .rpc(
          functionName,
          params
        );


    if(error){

      console.error(
        `RPC ${functionName} error:`,
        error
      );

      throw error;
    }

    return data;

  }catch(error){

    console.error(
      `RPC ${functionName} failed:`,
      error
    );

    throw error;
  }
}


/* ==========================================
   PROFILE
   ========================================== */

async function loadCurrentProfile(){

  const user=
    await getUser();

  if(!user){

    currentUser=null;
    currentProfile=null;
    currentRole=null;

    return null;
  }


  currentUser=user;


  const {
    data,
    error
  } =
    await supabaseAuthClient
      .from('profiles')
      .select('*')
      .eq('id',user.id)
      .maybeSingle();


  if(error){

    console.error(
      'Profile load error:',
      error
    );

    return null;
  }


  currentProfile=data || null;

  currentRole=
    currentProfile?.role || null;


  return currentProfile;
}


/* ==========================================
   AUTH CHECK
   ========================================== */

async function ensureAuthenticated(){

  const session=
    await getSession();

  if(!session){

    console.warn(
      'No authenticated Supabase session.'
    );

    return false;
  }

  currentUser=
    session.user;

  return true;
}


/* ==========================================
   LOGOUT
   ========================================== */

async function logoutUser(){

  try{

    const {
      error
    } =
      await supabaseAuthClient
        .auth
        .signOut();


    if(error)
      throw error;


    window.location.href=
      'index.html';

  }catch(error){

    console.error(
      'Logout error:',
      error
    );

    showError(
      currentLanguage==='sw'
        ? 'Imeshindikana kutoka kwenye mfumo.'
        : 'Failed to logout.'
    );
  }
}


/* ==========================================
   NAVIGATION
   ========================================== */

const SGC_ROUTES = {

  dashboard:{
    button:'dashboardNavBtn',
    page:'dashboardPage'
  },

  stock:{
    button:'stockNavBtn',
    page:'currentStockPage'
  },

  products:{
    button:'productsNavBtn',
    page:'productsPage'
  },

  receivedStock:{
    button:'receivedStockNavBtn',
    page:'receivedStockPage'
  },

  sales:{
    button:'salesNavBtn',
    page:'salesPage'
  },

  receipts:{
    button:'receiptsNavBtn',
    page:'receiptsPage'
  },

  customers:{
    button:'customersNavBtn',
    page:'customersPage'
  },

  suppliers:{
    button:'suppliersNavBtn',
    page:'suppliersPage'
  },

  expenses:{
    button:'expensesNavBtn',
    page:'expensesPage'
  },

  payments:{
    button:'paymentsNavBtn',
    page:'paymentsPage'
  },

  reports:{
    button:'reportsNavBtn',
    page:'reportsPage'
  },

  users:{
    button:'usersNavBtn',
    page:'usersPage'
  },

  settings:{
    button:'settingsNavBtn',
    page:'settingsPage'
  }

};


function resetAllPages(){

  $$('.page-view')
    .forEach(page=>{

      page.classList.remove(
        'active',
        'sgc-force-active'
      );

      page.style.display='none';
      page.style.visibility='hidden';

    });


  $$('.nav button')
    .forEach(button=>{

      button.classList.remove(
        'active'
      );

    });


  const welcome=
    $('.content > .welcome');

  const cards=
    $('.content > .cards');

  const grid=
    $('.content > .grid-two');


  hideElement(welcome);
  hideElement(cards);
  hideElement(grid);
}


async function openSection(
  section,
  options={}
){

  const route=
    SGC_ROUTES[section];

  if(!route){

    console.warn(
      'Unknown SGC route:',
      section
    );

    return false;
  }


  try{

    resetAllPages();


    const button=
      byId(route.button);

    const page=
      byId(route.page);


    if(button)
      button.classList.add(
        'active'
      );


    if(page){

      page.classList.add(
        'active',
        'sgc-force-active'
      );

      page.style.display=
        'block';

      page.style.visibility=
        'visible';

    }else{

      console.error(
        'Page element missing:',
        route.page
      );

      return false;
    }


    if(section==='dashboard'){

      const welcome=
        $('.content > .welcome');

      const cards=
        $('.content > .cards');

      const grid=
        $('.content > .grid-two');


      showElement(welcome);
      showElement(cards);
      showElement(grid);

    }


    window.__SGC_CURRENT_SECTION=
      section;


    /*
     * Load data only after the page
     * itself has been made visible.
     *
     * This prevents database errors from
     * blocking navigation.
     */

    setTimeout(()=>{

      try{

        switch(section){

          case 'dashboard':

            if(typeof loadDashboardData==='function')
              loadDashboardData();

            break;


          case 'stock':

            if(typeof loadCurrentStock==='function')
              loadCurrentStock();

            break;


          case 'products':

            if(typeof loadProducts==='function')
              loadProducts();

            break;


          case 'receivedStock':

            if(typeof loadReceivedStock==='function')
              loadReceivedStock();

            break;


          case 'sales':

            if(typeof loadSales==='function')
              loadSales();

            break;


          case 'receipts':

            if(typeof loadReceipts==='function')
              loadReceipts();

            break;


          case 'customers':

            if(typeof loadCustomers==='function')
              loadCustomers();

            break;


          case 'suppliers':

            if(typeof loadSuppliers==='function')
              loadSuppliers();

            break;


          case 'expenses':

            if(typeof loadExpenses==='function')
              loadExpenses();

            break;


          case 'payments':

            if(typeof loadPayments==='function')
              loadPayments();

            break;


          case 'reports':

            if(typeof loadReports==='function')
              loadReports();

            break;


          case 'users':

            if(typeof loadUsers==='function')
              loadUsers();

            break;


          case 'settings':

            if(typeof loadSettings==='function')
              loadSettings();

            break;

        }

      }catch(error){

        console.error(
          `Section ${section} loader error:`,
          error
        );

      }

    },0);


    return true;

  }catch(error){

    console.error(
      'Navigation error:',
      error
    );

    return false;
  }
}


/* ==========================================
   NAVIGATION EVENTS
   ========================================== */

/* ==========================================
   NAVIGATION EVENTS — FIXED
   RLS: HAKUNA MABADILIKO
   Frontend navigation only.
   ========================================== */

function installNavigation(){

  const routes = Object.entries(SGC_ROUTES);

  routes.forEach(
    ([section, route])=>{

      const button =
        byId(route.button);

      if(!button)
        return;

      /*
       * Remove old listeners safely by
       * replacing the button.
       */

      const cleanButton =
        button.cloneNode(true);

      button.replaceWith(
        cleanButton
      );


      cleanButton.type =
        'button';


      cleanButton.addEventListener(
        'click',
        function(event){

          event.preventDefault();
          event.stopPropagation();

          openSection(
            section
          );

        }
      );

    }
  );


  /*
   * Quick Products
   */

  const quickProducts =
    byId('quickProductsBtn');

  if(quickProducts){

    const clean =
      quickProducts.cloneNode(true);

    quickProducts.replaceWith(
      clean
    );

    clean.type =
      'button';

    clean.addEventListener(
      'click',
      function(event){

        event.preventDefault();

        openSection(
          'products'
        );

      }
    );

  }


  /*
   * Quick Sale
   */

  const quickSale =
    byId('quickSaleBtn');

  if(quickSale){

    const clean =
      quickSale.cloneNode(true);

    quickSale.replaceWith(
      clean
    );

    clean.type =
      'button';

    clean.addEventListener(
      'click',
      function(event){

        event.preventDefault();

        openSection(
          'sales'
        );

      }
    );

  }


  /*
   * Logout
   */

  const logout =
    byId('logoutBtn');

  if(logout){

    const clean =
      logout.cloneNode(true);

    logout.replaceWith(
      clean
    );

    clean.type =
      'button';

    clean.addEventListener(
      'click',
      function(event){

        event.preventDefault();

        logoutUser();

      }
    );

  }

}

   ========================================== */

function installSidebar(){

  const sidebar=
    byId('sidebar');

  const toggle=
    byId('sidebarToggle');

  if(!sidebar || !toggle)
    return;


  toggle.addEventListener(
    'click',
    function(){

      sidebar.classList.toggle(
        'open'
      );

    }
  );


  document.addEventListener(
    'click',
    function(event){

      if(window.innerWidth>800)
        return;

      if(
        !sidebar.contains(event.target) &&
        !toggle.contains(event.target)
      ){

        sidebar.classList.remove(
          'open'
        );

      }

    }
  );

}


/* ==========================================
   LANGUAGE SELECTOR
   ========================================== */

function installLanguageSelector(){

  const selector=
    byId('languageSelector');

  if(!selector)
    return;


  selector.value=
    currentLanguage;


  selector.addEventListener(
    'change',
    function(){

      applyLanguage(
        selector.value
      );

    }
  );

}


/* ==========================================
   CUSTOMERS
   ========================================== */

async function loadCustomers(){

  const container=
    byId('customersTableBody');

  if(container){

    container.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].loading
          )}
        </td>
      </tr>`;

  }


  try{

    const data=
      await callRpc(
        'get_customers_for_current_user',
        {
          p_search:''
        }
      );


    customersData=
      Array.isArray(data)
        ? data
        : [];


    renderCustomers(
      customersData
    );


  }catch(error){

    console.error(
      'Customers loading error:',
      error
    );


    if(container){

      container.innerHTML=
        `<tr>
          <td colspan="7">
            ${escapeHtml(
              translations[currentLanguage].load_error
            )}
          </td>
        </tr>`;

    }

  }

}


function renderCustomers(
  customers
){

  const tbody=
    byId('customersTableBody');

  if(!tbody)
    return;


  if(!customers.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    customers.map(
      customer=>{

        const active=
          customer.is_active !== false;

        return `
          <tr>

            <td>
              ${escapeHtml(
                customer.name
              )}
            </td>

            <td>
              ${escapeHtml(
                customer.phone || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                customer.address || ''
              )}
            </td>

            <td>
              ${formatMoney(
                customer.total_sales || 0
              )}
            </td>

            <td>
              ${formatMoney(
                customer.total_paid || 0
              )}
            </td>

            <td>
              ${formatMoney(
                customer.balance || 0
              )}
            </td>

            <td>
              <span class="${
                active
                  ? 'status-active'
                  : 'status-inactive'
              }">
                ${
                  active
                    ? translations[currentLanguage].active
                    : translations[currentLanguage].inactive
                }
              </span>
            </td>

          </tr>
        `;

      }
    ).join('');

}


/* ==========================================
   SUPPLIERS
   ========================================== */

async function loadSuppliers(){

  const tbody=
    byId('suppliersTableBody');

  if(tbody){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].loading
          )}
        </td>
      </tr>`;

  }


  try{

    const data=
      await callRpc(
        'get_suppliers_for_current_user',
        {
          p_search:''
        }
      );


    suppliersData=
      Array.isArray(data)
        ? data
        : [];


    renderSuppliers(
      suppliersData
    );


  }catch(error){

    console.error(
      'Suppliers loading error:',
      error
    );


    if(tbody){

      tbody.innerHTML=
        `<tr>
          <td colspan="7">
            ${escapeHtml(
              translations[currentLanguage].load_error
            )}
          </td>
        </tr>`;

    }

  }

}


function renderSuppliers(
  suppliers
){

  const tbody=
    byId('suppliersTableBody');

  if(!tbody)
    return;


  if(!suppliers.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    suppliers.map(
      supplier=>{

        const active=
          supplier.is_active !== false;

        return `
          <tr>

            <td>
              ${escapeHtml(
                supplier.name
              )}
            </td>

            <td>
              ${escapeHtml(
                supplier.phone || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                supplier.contact_person || ''
              )}
            </td>

            <td>
              ${formatMoney(
                supplier.total_purchases || 0
              )}
            </td>

            <td>
              ${formatMoney(
                supplier.total_paid || 0
              )}
            </td>

            <td>
              ${formatMoney(
                supplier.balance || 0
              )}
            </td>

            <td>
              <span class="${
                active
                  ? 'status-active'
                  : 'status-inactive'
              }">
                ${
                  active
                    ? translations[currentLanguage].active
                    : translations[currentLanguage].inactive
                }
              </span>
            </td>

          </tr>
        `;

      }
    ).join('');

}


/* ==========================================
   PRODUCTS
   ========================================== */

async function loadProducts(){

  const tbody=
    byId('productsTableBody');

  if(tbody){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].loading
          )}
        </td>
      </tr>`;

  }


  try{

    const data=
      await callRpc(
        'get_products_for_owner'
      );


    productsData=
      Array.isArray(data)
        ? data
        : [];


    renderProducts(
      productsData
    );


  }catch(error){

    console.error(
      'Products loading error:',
      error
    );


    if(tbody){

      tbody.innerHTML=
        `<tr>
          <td colspan="7">
            ${escapeHtml(
              translations[currentLanguage].load_error
            )}
          </td>
        </tr>`;

    }

  }

}


function renderProducts(
  products
){

  const tbody=
    byId('productsTableBody');

  if(!tbody)
    return;


  if(!products.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_products
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    products.map(
      product=>{

        const active=
          product.is_active !== false;


        return `
          <tr>

            <td>
              ${escapeHtml(
                product.name
              )}
            </td>

            <td>
              ${escapeHtml(
                product.category || ''
              )}
            </td>

            <td>
              ${formatMoney(
                product.selling_price
              )}
            </td>

            <td>
              ${escapeHtml(
                product.stock_quantity ??
                product.current_stock ??
                0
              )}
            </td>

            <td>
              ${escapeHtml(
                product.low_stock_threshold ??
                product.low_stock_level ??
                0
              )}
            </td>

            <td>
              <span class="${
                active
                  ? 'status-active'
                  : 'status-inactive'
              }">
                ${
                  active
                    ? translations[currentLanguage].active
                    : translations[currentLanguage].inactive
                }
              </span>
            </td>

            <td>

              <button
                type="button"
                class="btn btn-sm"
                data-product-edit="${escapeHtml(product.id)}"
              >
                ${escapeHtml(
                  translations[currentLanguage].edit
                )}
              </button>

            </td>

          </tr>
        `;

      }
    ).join('');


  tbody
    .querySelectorAll(
      '[data-product-edit]'
    )
    .forEach(button=>{

      button.addEventListener(
        'click',
        ()=>{

          const id=
            button.dataset.productEdit;

          const product=
            products.find(
              item=>String(item.id)===String(id)
            );

          if(product)
            openProductEditor(
              product
            );

        }
      );

    });

}


/* ==========================================
   PRODUCT EDITOR
   ========================================== */

function openProductEditor(
  product=null
){

  selectedProduct=
    product;


  const modal=
    byId('productModal');

  if(!modal){

    showInfo(
      currentLanguage==='sw'
        ? 'Product editor haijawekwa kwenye HTML.'
        : 'Product editor is not available in the HTML.'
    );

    return;
  }


  const title=
    byId('productModalTitle');

  const name=
    byId('productName');

  const price=
    byId('productSellingPrice');

  const lowStock=
    byId('productLowStock');


  if(title){

    title.textContent=
      product
        ? translations[currentLanguage].edit_product_title
        : translations[currentLanguage].add_product_title;

  }


  if(name)
    name.value=
      product?.name || '';


  if(price)
    price.value=
      product?.selling_price || '';


  if(lowStock)
    lowStock.value=
      product?.low_stock_threshold ||
      product?.low_stock_level ||
      '';


  showElement(modal);

}


function closeProductEditor(){

  const modal=
    byId('productModal');

  hideElement(modal);

  selectedProduct=null;

}


async function saveProduct(){

  const name=
    byId('productName')?.value?.trim();

  const price=
    numberValue(
      byId('productSellingPrice')?.value
    );

  const lowStock=
    numberValue(
      byId('productLowStock')?.value
    );


  if(!name){

    showError(
      translations[currentLanguage]
        .name_required
    );

    return;
  }


  try{

    if(selectedProduct){

      await callRpc(
        'update_product',
        {
          p_product_id:
            selectedProduct.id,

          p_name:
            name,

          p_selling_price:
            price,

          p_low_stock_threshold:
            lowStock
        }
      );


      showSuccess(
        translations[currentLanguage]
          .product_updated
      );

    }else{

      await callRpc(
        'create_product',
        {
          p_name:
            name,

          p_selling_price:
            price,

          p_low_stock_threshold:
            lowStock
        }
      );


      showSuccess(
        translations[currentLanguage]
          .product_saved
      );

    }


    closeProductEditor();

    await loadProducts();


  }catch(error){

    console.error(
      'Save product error:',
      error
    );

    showError(
      translations[currentLanguage]
        .product_error
    );

  }

}


/* ==========================================
   STOCK
   ========================================== */

async function loadCurrentStock(){

  const tbody=
    byId('currentStockTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="8">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const data=
      await callRpc(
        'get_variant_stock_summary'
      );


    const rows=
      Array.isArray(data)
        ? data
        : [];


    if(!rows.length){

      tbody.innerHTML=
        `<tr>
          <td colspan="8">
            ${escapeHtml(
              translations[currentLanguage].no_products
            )}
          </td>
        </tr>`;

      return;
    }


    tbody.innerHTML=
      rows.map(
        row=>`

          <tr>

            <td>
              ${escapeHtml(
                row.product_name || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                row.variant_name || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                row.unit_name || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                row.stock_quantity ?? 0
              )}
            </td>

            <td>
              ${formatMoney(
                row.buying_price || 0
              )}
            </td>

            <td>
              ${formatMoney(
                row.selling_price || 0
              )}
            </td>

            <td>
              ${formatMoney(
                row.stock_value || 0
              )}
            </td>

            <td>
              ${escapeHtml(
                row.status || ''
              )}
            </td>

          </tr>

        `
      ).join('');


  }catch(error){

    console.error(
      'Current stock error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="8">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


/* ==========================================
   RECEIVED STOCK
   ========================================== */

async function loadReceivedStock(){

  const tbody=
    byId('receivedStockTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="8">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const {
      data,
      error
    } =
      await supabaseAuthClient
        .from('stock_receipts')
        .select('*')
        .order(
          'created_at',
          {
            ascending:false
          }
        );


    if(error)
      throw error;


    const rows=
      Array.isArray(data)
        ? data
        : [];


    if(!rows.length){

      tbody.innerHTML=
        `<tr>
          <td colspan="8">
            ${escapeHtml(
              translations[currentLanguage].no_receipts
            )}
          </td>
        </tr>`;

      return;
    }


    tbody.innerHTML=
      rows.map(
        row=>`

          <tr>

            <td>
              ${escapeHtml(
                row.invoice_no ||
                row.receipt_no ||
                ''
              )}
            </td>

            <td>
              ${escapeHtml(
                row.supplier_name ||
                row.supplier ||
                ''
              )}
            </td>

            <td>
              ${formatMoney(
                row.total_amount ||
                row.total ||
                0
              )}
            </td>

            <td>
              ${escapeHtml(
                row.status || ''
              )}
            </td>

            <td>
              ${formatDateTime(
                row.created_at
              )}
            </td>

            <td>
              ${escapeHtml(
                row.recorded_by || ''
              )}
            </td>

            <td>
              ${escapeHtml(
                row.verified_by || ''
              )}
            </td>

            <td>

              ${
                row.status==='pending'
                  ? `
                    <button
                      type="button"
                      class="btn btn-sm"
                      data-verify-receipt="${escapeHtml(row.id)}"
                    >
                      ${escapeHtml(
                        translations[currentLanguage].verify
                      )}
                    </button>
                  `
                  : ''
              }

            </td>

          </tr>

        `
      ).join('');


    tbody
      .querySelectorAll(
        '[data-verify-receipt]'
      )
      .forEach(button=>{

        button.addEventListener(
          'click',
          ()=>{

            verifyStockReceipt(
              button.dataset.verifyReceipt
            );

          }
        );

      });


  }catch(error){

    console.error(
      'Received stock error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="8">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


async function verifyStockReceipt(
  receiptId
){

  if(
    !confirm(
      translations[currentLanguage]
        .confirm_verify
    )
  )
    return;


  try{

    await callRpc(
      'verify_stock_receipt',
      {
        p_stock_receipt_id:
          receiptId
      }
    );


    showSuccess(
      translations[currentLanguage]
        .receipt_verified
    );


    await loadReceivedStock();


  }catch(error){

    console.error(
      'Verify stock receipt error:',
      error
    );


    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   SALES
   ========================================== */

async function loadSales(){

  const tbody=
    byId('salesTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="8">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const data=
      await callRpc(
        'get_sales_for_current_user',
        {
          p_search:'',
          p_limit:100,
          p_offset:0
        }
      );


    salesData=
      Array.isArray(data)
        ? data
        : [];


    renderSales(
      salesData
    );


  }catch(error){

    console.error(
      'Sales error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="8">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


function renderSales(
  sales
){

  const tbody=
    byId('salesTableBody');

  if(!tbody)
    return;


  if(!sales.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="8">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    sales.map(
      sale=>`

        <tr>

          <td>
            ${escapeHtml(
              sale.receipt_number ||
              sale.receipt_no ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              sale.customer_name ||
              translations[currentLanguage].walk_in_customer
            )}
          </td>

          <td>
            ${formatMoney(
              sale.grand_total ||
              sale.total_amount ||
              sale.total ||
              0
            )}
          </td>

          <td>
            ${formatMoney(
              sale.paid_amount ||
              0
            )}
          </td>

          <td>
            ${formatMoney(
              sale.balance ||
              0
            )}
          </td>

          <td>
            ${escapeHtml(
              sale.payment_method ||
              ''
            )}
          </td>

          <td>
            ${formatDateTime(
              sale.created_at ||
              sale.sale_date
            )}
          </td>

          <td>

            <button
              type="button"
              class="btn btn-sm"
              data-sale-view="${escapeHtml(sale.id)}"
            >
              ${escapeHtml(
                translations[currentLanguage].view
              )}
            </button>

          </td>

        </tr>

      `
    ).join('');


  tbody
    .querySelectorAll(
      '[data-sale-view]'
    )
    .forEach(button=>{

      button.addEventListener(
        'click',
        ()=>{

          openSaleDetails(
            button.dataset.saleView
          );

        }
      );

    });

}


async function openSaleDetails(
  saleId
){

  try{

    const data=
      await callRpc(
        'get_sale_details',
        {
          p_sale_id:
            saleId
        }
      );


    selectedSale=data;

    showInfo(
      currentLanguage==='sw'
        ? 'Maelezo ya sale yamepakiwa.'
        : 'Sale details loaded.'
    );


    console.log(
      'Sale details:',
      data
    );


  }catch(error){

    console.error(
      'Sale details error:',
      error
    );

    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   RECEIPTS
   ========================================== */

async function loadReceipts(){

  const tbody=
    byId('receiptsTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="7">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const data=
      await callRpc(
        'get_sales_for_current_user',
        {
          p_search:'',
          p_limit:100,
          p_offset:0
        }
      );


    const rows=
      Array.isArray(data)
        ? data
        : [];


    tbody.innerHTML=
      rows.length
        ? rows.map(
            row=>`

              <tr>

                <td>
                  ${escapeHtml(
                    row.receipt_number ||
                    row.receipt_no ||
                    ''
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    row.customer_name ||
                    translations[currentLanguage].walk_in_customer
                  )}
                </td>

                <td>
                  ${formatMoney(
                    row.grand_total ||
                    row.total_amount ||
                    0
                  )}
                </td>

                <td>
                  ${formatMoney(
                    row.paid_amount ||
                    0
                  )}
                </td>

                <td>
                  ${formatMoney(
                    row.balance ||
                    0
                  )}
                </td>

                <td>
                  ${formatDateTime(
                    row.created_at
                  )}
                </td>

                <td>

                  <button
                    type="button"
                    class="btn btn-sm"
                    data-receipt-view="${escapeHtml(row.id)}"
                  >
                    ${escapeHtml(
                      translations[currentLanguage].view
                    )}
                  </button>

                </td>

              </tr>

            `
          ).join('')
        :
          `<tr>
            <td colspan="7">
              ${escapeHtml(
                translations[currentLanguage].no_activity
              )}
            </td>
          </tr>`;


    tbody
      .querySelectorAll(
        '[data-receipt-view]'
      )
      .forEach(button=>{

        button.addEventListener(
          'click',
          ()=>{

            openReceipt(
              button.dataset.receiptView
            );

          }
        );

      });


  }catch(error){

    console.error(
      'Receipts error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


async function openReceipt(
  saleId
){

  try{

    const sale=
      await callRpc(
        'get_sale_details',
        {
          p_sale_id:
            saleId
        }
      );


    console.log(
      'Receipt:',
      sale
    );


    showInfo(
      currentLanguage==='sw'
        ? 'Receipt imefunguliwa.'
        : 'Receipt opened.'
    );


  }catch(error){

    console.error(
      'Open receipt error:',
      error
    );

    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   EXPENSES
   ========================================== */

async function loadExpenses(){

  const tbody=
    byId('expensesTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="7">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const data=
      await callRpc(
        'get_expenses_for_current_user',
        {
          p_search:''
        }
      );


    expensesData=
      Array.isArray(data)
        ? data
        : [];


    renderExpenses(
      expensesData
    );


  }catch(error){

    console.error(
      'Expenses error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


function renderExpenses(
  expenses
){

  const tbody=
    byId('expensesTableBody');

  if(!tbody)
    return;


  if(!expenses.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    expenses.map(
      expense=>`

        <tr>

          <td>
            ${formatDate(
              expense.expense_date ||
              expense.created_at
            )}
          </td>

          <td>
            ${escapeHtml(
              expense.category || ''
            )}
          </td>

          <td>
            ${escapeHtml(
              expense.description || ''
            )}
          </td>

          <td>
            ${formatMoney(
              expense.amount
            )}
          </td>

          <td>
            ${escapeHtml(
              expense.payment_method || ''
            )}
          </td>

          <td>
            ${escapeHtml(
              expense.payment_reference || ''
            )}
          </td>

          <td>
            ${escapeHtml(
              expense.recorded_by_name ||
              expense.recorded_by ||
              ''
            )}
          </td>

        </tr>

      `
    ).join('');

}


/* ==========================================
   PAYMENTS
   ========================================== */

async function loadPayments(){

  const customerBody=
    byId('customerPaymentsTableBody');

  const supplierBody=
    byId('supplierPaymentsTableBody');


  if(customerBody){

    customerBody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].loading
          )}
        </td>
      </tr>`;

  }


  if(supplierBody){

    supplierBody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].loading
          )}
        </td>
      </tr>`;

  }


  /*
   * Payments module can contain customer and
   * supplier payments. We intentionally load
   * each section independently so an error in
   * one does not stop the other.
   */

  try{

    if(customerBody){

      const {
        data,
        error
      } =
        await supabaseAuthClient
          .from('customer_payments')
          .select('*')
          .order(
            'created_at',
            {
              ascending:false
            }
          )
          .limit(100);


      if(error)
        throw error;


      paymentsData=
        Array.isArray(data)
          ? data
          : [];


      renderCustomerPayments(
        paymentsData
      );

    }

  }catch(error){

    console.error(
      'Customer payments error:',
      error
    );


    if(customerBody){

      customerBody.innerHTML=
        `<tr>
          <td colspan="7">
            ${escapeHtml(
              translations[currentLanguage].load_error
            )}
          </td>
        </tr>`;

    }

  }


  try{

    if(supplierBody){

      const {
        data,
        error
      } =
        await supabaseAuthClient
          .from('supplier_payments')
          .select('*')
          .order(
            'created_at',
            {
              ascending:false
            }
          )
          .limit(100);


      if(error)
        throw error;


      renderSupplierPayments(
        Array.isArray(data)
          ? data
          : []
      );

    }

  }catch(error){

    console.error(
      'Supplier payments error:',
      error
    );


    if(supplierBody){

      supplierBody.innerHTML=
        `<tr>
          <td colspan="7">
            ${escapeHtml(
              translations[currentLanguage].load_error
            )}
          </td>
        </tr>`;

    }

  }

}


function renderCustomerPayments(
  payments
){

  const tbody=
    byId('customerPaymentsTableBody');

  if(!tbody)
    return;


  if(!payments.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    payments.map(
      payment=>`

        <tr>

          <td>
            ${formatDateTime(
              payment.created_at
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.customer_name ||
              payment.customer_id ||
              ''
            )}
          </td>

          <td>
            ${formatMoney(
              payment.amount
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.payment_method ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.reference_no ||
              payment.payment_reference ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.notes ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.recorded_by ||
              ''
            )}
          </td>

        </tr>

      `
    ).join('');

}


function renderSupplierPayments(
  payments
){

  const tbody=
    byId('supplierPaymentsTableBody');

  if(!tbody)
    return;


  if(!payments.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    payments.map(
      payment=>`

        <tr>

          <td>
            ${formatDateTime(
              payment.created_at
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.supplier_name ||
              payment.supplier_id ||
              ''
            )}
          </td>

          <td>
            ${formatMoney(
              payment.amount
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.payment_method ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.reference_no ||
              payment.payment_reference ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.notes ||
              ''
            )}
          </td>

          <td>
            ${escapeHtml(
              payment.recorded_by ||
              ''
            )}
          </td>

        </tr>

      `
    ).join('');

}
/* ==========================================
   REPORTS
   ========================================== */

async function loadReports(){

  const reportContainer=
    byId('reportsContent');

  if(reportContainer){

    reportContainer.innerHTML=
      `<div class="loading-state">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </div>`;

  }


  try{

    const [
      salesSummary,
      expenseSummary,
      stockSummary
    ] =
      await Promise.allSettled([

        callRpc(
          'get_today_sales_summary'
        ),

        callRpc(
          'get_expense_summary'
        ),

        callRpc(
          'get_variant_stock_summary'
        )

      ]);


    const sales=
      salesSummary.status==='fulfilled'
        ? salesSummary.value
        : null;

    const expenses=
      expenseSummary.status==='fulfilled'
        ? expenseSummary.value
        : null;

    const stock=
      stockSummary.status==='fulfilled'
        ? stockSummary.value
        : [];


    reportsData={
      sales,
      expenses,
      stock
    };


    renderReports(
      reportsData
    );


  }catch(error){

    console.error(
      'Reports error:',
      error
    );


    if(reportContainer){

      reportContainer.innerHTML=
        `<div class="error-state">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </div>`;

    }

  }

}


function renderReports(
  reports
){

  const container=
    byId('reportsContent');

  if(!container)
    return;


  const sales=
    reports.sales || {};

  const expenses=
    reports.expenses || {};

  const stock=
    Array.isArray(reports.stock)
      ? reports.stock
      : [];


  let totalStockValue=0;

  stock.forEach(
    row=>{

      totalStockValue +=
        numberValue(
          row.stock_value
        );

    }
  );


  const salesTotal=
    numberValue(
      sales.total_sales ||
      sales.total_amount ||
      sales.sales ||
      0
    );


  const expenseTotal=
    numberValue(
      expenses.total_expenses ||
      expenses.total_amount ||
      expenses.expenses ||
      0
    );


  const estimatedProfit=
    salesTotal -
    expenseTotal;


  container.innerHTML=`

    <div class="report-summary-grid">

      <div class="report-card">

        <div class="report-card-label">
          ${escapeHtml(
            translations[currentLanguage].today_sales
          )}
        </div>

        <div class="report-card-value">
          ${formatMoney(
            salesTotal
          )}
        </div>

      </div>


      <div class="report-card">

        <div class="report-card-label">
          ${escapeHtml(
            translations[currentLanguage].expenses
          )}
        </div>

        <div class="report-card-value">
          ${formatMoney(
            expenseTotal
          )}
        </div>

      </div>


      <div class="report-card">

        <div class="report-card-label">
          ${escapeHtml(
            translations[currentLanguage].stock_value
          )}
        </div>

        <div class="report-card-value">
          ${formatMoney(
            totalStockValue
          )}
        </div>

      </div>


      <div class="report-card">

        <div class="report-card-label">
          Profit / Difference
        </div>

        <div class="report-card-value">
          ${formatMoney(
            estimatedProfit
          )}
        </div>

      </div>

    </div>

    <div class="report-section">

      <h3>
        ${escapeHtml(
          translations[currentLanguage].stock
        )}
      </h3>

      <div class="table-responsive">

        <table>

          <thead>

            <tr>

              <th>
                ${escapeHtml(
                  translations[currentLanguage].product
                )}
              </th>

              <th>
                Variant
              </th>

              <th>
                ${escapeHtml(
                  translations[currentLanguage].quantity
                )}
              </th>

              <th>
                ${escapeHtml(
                  translations[currentLanguage].selling_price
                )}
              </th>

              <th>
                ${escapeHtml(
                  translations[currentLanguage].total
                )}
              </th>

            </tr>

          </thead>

          <tbody>

            ${
              stock.length
                ? stock.map(
                    row=>`

                      <tr>

                        <td>
                          ${escapeHtml(
                            row.product_name || ''
                          )}
                        </td>

                        <td>
                          ${escapeHtml(
                            row.variant_name || ''
                          )}
                        </td>

                        <td>
                          ${escapeHtml(
                            row.stock_quantity ?? 0
                          )}
                        </td>

                        <td>
                          ${formatMoney(
                            row.selling_price || 0
                          )}
                        </td>

                        <td>
                          ${formatMoney(
                            row.stock_value || 0
                          )}
                        </td>

                      </tr>

                    `
                  ).join('')
                :
                  `<tr>
                    <td colspan="5">
                      ${escapeHtml(
                        translations[currentLanguage].no_products
                      )}
                    </td>
                  </tr>`
            }

          </tbody>

        </table>

      </div>

    </div>

  `;

}


/* ==========================================
   USERS
   ========================================== */

async function loadUsers(){

  const tbody=
    byId('usersTableBody');

  if(!tbody)
    return;


  tbody.innerHTML=
    `<tr>
      <td colspan="7">
        ${escapeHtml(
          translations[currentLanguage].loading
        )}
      </td>
    </tr>`;


  try{

    const {
      data,
      error
    } =
      await supabaseAuthClient
        .from('profiles')
        .select(
          'id,full_name,email,role,is_active,created_at'
        )
        .order(
          'created_at',
          {
            ascending:false
          }
        );


    if(error)
      throw error;


    const users=
      Array.isArray(data)
        ? data
        : [];


    renderUsers(
      users
    );


  }catch(error){

    console.error(
      'Users loading error:',
      error
    );


    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].load_error
          )}
        </td>
      </tr>`;

  }

}


function renderUsers(
  users
){

  const tbody=
    byId('usersTableBody');

  if(!tbody)
    return;


  if(!users.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="7">
          ${escapeHtml(
            translations[currentLanguage].no_activity
          )}
        </td>
      </tr>`;

    return;
  }


  tbody.innerHTML=
    users.map(
      user=>`

        <tr>

          <td>
            ${escapeHtml(
              user.full_name || ''
            )}
          </td>

          <td>
            ${escapeHtml(
              user.email || ''
            )}
          </td>

          <td>
            ${escapeHtml(
              user.role || ''
            )}
          </td>

          <td>

            <span class="${
              user.is_active
                ? 'status-active'
                : 'status-inactive'
            }">

              ${
                user.is_active
                  ? translations[currentLanguage].active
                  : translations[currentLanguage].inactive
              }

            </span>

          </td>

          <td>
            ${formatDate(
              user.created_at
            )}
          </td>

          <td>

            <button
              type="button"
              class="btn btn-sm"
              data-user-edit="${escapeHtml(user.id)}"
            >
              ${escapeHtml(
                translations[currentLanguage].edit
              )}
            </button>

          </td>

        </tr>

      `
    ).join('');

}


/* ==========================================
   SETTINGS
   ========================================== */

async function loadSettings(){

  const container=
    byId('settingsContent');

  if(!container)
    return;


  try{

    const {
      data,
      error
    } =
      await supabaseAuthClient
        .from('settings')
        .select('*')
        .order(
          'setting_key',
          {
            ascending:true
          }
        );


    if(error)
      throw error;


    const settings=
      Array.isArray(data)
        ? data
        : [];


    renderSettings(
      settings
    );


  }catch(error){

    console.error(
      'Settings loading error:',
      error
    );


    container.innerHTML=
      `<div class="error-state">
        ${escapeHtml(
          translations[currentLanguage].load_error
        )}
      </div>`;

  }

}


function renderSettings(
  settings
){

  const container=
    byId('settingsContent');

  if(!container)
    return;


  if(!settings.length){

    container.innerHTML=
      `<div class="empty-state">
        ${escapeHtml(
          translations[currentLanguage].no_activity
        )}
      </div>`;

    return;
  }


  container.innerHTML=
    settings.map(
      setting=>`

        <div class="setting-row">

          <div class="setting-information">

            <strong>
              ${escapeHtml(
                setting.setting_key || ''
              )}
            </strong>

            ${
              setting.description
                ? `
                  <small>
                    ${escapeHtml(
                      setting.description
                    )}
                  </small>
                `
                : ''
            }

          </div>


          <div class="setting-value">

            <input
              type="text"
              value="${escapeHtml(
                setting.setting_value || ''
              )}"
              data-setting-id="${escapeHtml(setting.id)}"
              data-setting-key="${escapeHtml(setting.setting_key || '')}"
            />


            <button
              type="button"
              class="btn btn-sm"
              data-save-setting="${escapeHtml(setting.id)}"
            >
              ${escapeHtml(
                translations[currentLanguage].save
              )}
            </button>

          </div>

        </div>

      `
    ).join('');


  container
    .querySelectorAll(
      '[data-save-setting]'
    )
    .forEach(button=>{

      button.addEventListener(
        'click',
        ()=>{

          saveSetting(
            button.dataset.saveSetting
          );

        }
      );

    });

}


async function saveSetting(
  settingId
){

  const input=
    document.querySelector(
      `[data-setting-id="${CSS.escape(settingId)}"]`
    );


  if(!input)
    return;


  try{

    const {
      error
    } =
      await supabaseAuthClient
        .from('settings')
        .update({

          setting_value:
            input.value,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          'id',
          settingId
        );


    if(error)
      throw error;


    showSuccess(
      currentLanguage==='sw'
        ? 'Mipangilio imehifadhiwa.'
        : 'Settings saved.'
    );


  }catch(error){

    console.error(
      'Save setting error:',
      error
    );


    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   DASHBOARD SUMMARY
   ========================================== */

async function loadDashboardData(){

  try{

    const summary=
      await callRpc(
        'get_owner_dashboard_summary'
      );


    renderDashboardSummary(
      summary
    );


  }catch(error){

    console.error(
      'Dashboard summary error:',
      error
    );

    /*
     * Dashboard should remain visible even
     * when the summary RPC is unavailable.
     */

  }


  try{

    const today=
      await callRpc(
        'get_today_sales_summary'
      );


    renderTodaySalesSummary(
      today
    );


  }catch(error){

    console.error(
      'Today sales summary error:',
      error
    );

  }

}


function renderDashboardSummary(
  summary
){

  if(!summary)
    return;


  const mappings={

    todaySales:[
      'todaySalesValue',
      'today_sales'
    ],

    stockValue:[
      'stockValue',
      'stock_value'
    ],

    todayTransactions:[
      'todayTransactionsValue',
      'today_transactions'
    ],

    customers:[
      'customersCount',
      'customers_count'
    ]

  };


  Object.entries(
    mappings
  ).forEach(
    ([key,ids])=>{

      const value=
        summary[key] ??
        summary[
          key.replace(
            /[A-Z]/g,
            m=>`_${m.toLowerCase()}`
          )
        ];


      if(value===undefined)
        return;


      ids.forEach(
        id=>{

          const element=
            byId(id);

          if(!element)
            return;


          if(
            key==='todaySales' ||
            key==='stockValue'
          ){

            element.textContent=
              formatMoney(value);

          }else{

            element.textContent=
              String(value);

          }

        }
      );

    }
  );

}


function renderTodaySalesSummary(
summary
){

  if(!summary)
    return;


  const possibleTotal=
    summary.total_sales ??
    summary.total_amount ??
    summary.sales ??
    0;


  const possibleTransactions=
    summary.transactions ??
    summary.total_transactions ??
    summary.transaction_count ??
    0;


  const salesElement=
    byId('todaySalesValue');


  const transactionsElement=
    byId('todayTransactionsValue');


  if(salesElement){

    salesElement.textContent=
      formatMoney(
        possibleTotal
      );

  }


  if(transactionsElement){

    transactionsElement.textContent=
      String(
        possibleTransactions
      );

  }

}


/* ==========================================
   QUICK ACTIONS
   ========================================== */

function installQuickActions(){

  const newCustomer=
    byId('newCustomerBtn');

  if(newCustomer){

    const clean=
      newCustomer.cloneNode(true);

    newCustomer.replaceWith(
      clean
    );


    clean.addEventListener(
      'click',
      ()=>{

        openCustomerEditor();

      }
    );

  }


  const newExpense=
    byId('newExpenseBtn');

  if(newExpense){

    const clean=
      newExpense.cloneNode(true);

    newExpense.replaceWith(
      clean
    );


    clean.addEventListener(
      'click',
      ()=>{

        openExpenseEditor();

      }
    );

  }


  const newProduct=
    byId('addProductBtn');

  if(newProduct){

    const clean=
      newProduct.cloneNode(true);

    newProduct.replaceWith(
      clean
    );


    clean.addEventListener(
      'click',
      ()=>{

        openProductEditor();

      }
    );

  }

}


/* ==========================================
   CUSTOMER EDITOR
   ========================================== */

function openCustomerEditor(
  customer=null
){

  selectedCustomer=
    customer;


  const modal=
    byId('customerModal');

  if(!modal){

    showInfo(
      currentLanguage==='sw'
        ? 'Customer form haijawekwa kwenye HTML.'
        : 'Customer form is not available in the HTML.'
    );

    return;

  }


  const name=
    byId('customerName');

  const phone=
    byId('customerPhone');

  const address=
    byId('customerAddress');


  if(name)
    name.value=
      customer?.name || '';


  if(phone)
    phone.value=
      customer?.phone || '';


  if(address)
    address.value=
      customer?.address || '';


  showElement(
    modal
  );

}


function closeCustomerEditor(){

  const modal=
    byId('customerModal');

  hideElement(
    modal
  );

  selectedCustomer=null;

}


async function saveCustomer(){

  const name=
    byId('customerName')
      ?.value
      ?.trim();

  const phone=
    byId('customerPhone')
      ?.value
      ?.trim() || null;

  const address=
    byId('customerAddress')
      ?.value
      ?.trim() || null;


  if(!name){

    showError(
      currentLanguage==='sw'
        ? 'Jina la mteja linahitajika.'
        : 'Customer name is required.'
    );

    return;
  }


  try{

    if(selectedCustomer){

      await callRpc(
        'update_customer',
        {
          p_customer_id:
            selectedCustomer.id,

          p_name:
            name,

          p_phone:
            phone,

          p_address:
            address
        }
      );


    }else{

      await callRpc(
        'create_customer',
        {
          p_name:
            name,

          p_phone:
            phone,

          p_address:
            address
        }
      );

    }


    showSuccess(
      currentLanguage==='sw'
        ? 'Mteja amehifadhiwa.'
        : 'Customer saved.'
    );


    closeCustomerEditor();

    await loadCustomers();


  }catch(error){

    console.error(
      'Save customer error:',
      error
    );


    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   EXPENSE EDITOR
   ========================================== */

function openExpenseEditor(
  expense=null
){

  const modal=
    byId('expenseModal');

  if(!modal){

    showInfo(
      currentLanguage==='sw'
        ? 'Expense form haijawekwa kwenye HTML.'
        : 'Expense form is not available in the HTML.'
    );

    return;

  }


  const category=
    byId('expenseCategory');

  const description=
    byId('expenseDescription');

  const amount=
    byId('expenseAmount');

  const date=
    byId('expenseDate');

  const paymentMethod=
    byId('expensePaymentMethod');

  const reference=
    byId('expensePaymentReference');


  if(category)
    category.value=
      expense?.category || '';


  if(description)
    description.value=
      expense?.description || '';


  if(amount)
    amount.value=
      expense?.amount || '';


  if(date)
    date.value=
      expense?.expense_date ||
      new Date()
        .toISOString()
        .slice(0,10);


  if(paymentMethod)
    paymentMethod.value=
      expense?.payment_method || '';


  if(reference)
    reference.value=
      expense?.payment_reference || '';


  showElement(
    modal
  );

}


function closeExpenseEditor(){

  const modal=
    byId('expenseModal');

  hideElement(
    modal
  );

}


async function saveExpense(){

  const category=
    byId('expenseCategory')
      ?.value;

  const description=
    byId('expenseDescription')
      ?.value
      ?.trim() || null;

  const amount=
    numberValue(
      byId('expenseAmount')
        ?.value
    );

  const date=
    byId('expenseDate')
      ?.value;

  const paymentMethod=
    byId('expensePaymentMethod')
      ?.value;

  const reference=
    byId('expensePaymentReference')
      ?.value
      ?.trim() || null;


  if(!category || amount<=0){

    showError(
      currentLanguage==='sw'
        ? 'Jaza taarifa sahihi za expense.'
        : 'Enter valid expense details.'
    );

    return;
  }


  try{

    await callRpc(
      'create_expense',
      {
        p_category:
          category,

        p_description:
          description,

        p_amount:
          amount,

        p_expense_date:
          date,

        p_payment_method:
          paymentMethod,

        p_payment_reference:
          reference
      }
    );


    showSuccess(
      currentLanguage==='sw'
        ? 'Expense imehifadhiwa.'
        : 'Expense saved.'
    );


    closeExpenseEditor();

    await loadExpenses();


  }catch(error){

    console.error(
      'Save expense error:',
      error
    );


    showError(
      translations[currentLanguage]
        .load_error
    );

  }

}


/* ==========================================
   SEARCH HELPERS
   ========================================== */

function installSearch(
  inputId,
  callback
){

  const input=
    byId(inputId);

  if(!input || typeof callback!=='function')
    return;


  let timer=null;


  input.addEventListener(
    'input',
    function(){

      clearTimeout(timer);


      timer=
        setTimeout(
          ()=>{

            callback(
              input.value.trim()
            );

          },
          300
        );

    }
  );

}


/* ==========================================
   CUSTOMER SEARCH
   ========================================== */

async function searchCustomers(
  search=''
){

  try{

    const data=
      await callRpc(
        'get_customers_for_current_user',
        {
          p_search:
            search
        }
      );


    customersData=
      Array.isArray(data)
        ? data
        : [];


    renderCustomers(
      customersData
    );


  }catch(error){

    console.error(
      'Customer search error:',
      error
    );

  }

}


/* ==========================================
   SUPPLIER SEARCH
   ========================================== */

async function searchSuppliers(
  search=''
){

  try{

    const data=
      await callRpc(
        'get_suppliers_for_current_user',
        {
          p_search:
            search
        }
      );


    suppliersData=
      Array.isArray(data)
        ? data
        : [];


    renderSuppliers(
      suppliersData
    );


  }catch(error){

    console.error(
      'Supplier search error:',
      error
    );

  }

}


/* ==========================================
   PRODUCT SEARCH
   ========================================== */

function searchProducts(
  search=''
){

  const term=
    search.toLowerCase();


  const filtered=
    productsData.filter(
      product=>{

        const name=
          String(
            product.name || ''
          ).toLowerCase();


        const category=
          String(
            product.category || ''
          ).toLowerCase();


        return (
          name.includes(term) ||
          category.includes(term)
        );

      }
    );


  renderProducts(
    filtered
  );

}


/* ==========================================
   SALES SEARCH
   ========================================== */

async function searchSales(
  search=''
){

  try{

    const data=
      await callRpc(
        'get_sales_for_current_user',
        {
          p_search:
            search,

          p_limit:
            100,

          p_offset:
            0
        }
      );


    salesData=
      Array.isArray(data)
        ? data
        : [];


    renderSales(
      salesData
    );


  }catch(error){

    console.error(
      'Sales search error:',
      error
    );

  }

}


/* ==========================================
   RECEIPT NUMBER
   ========================================== */

async function generateReceiptNumber(){

  try{

    const receipt=
      await callRpc(
        'generate_receipt_number'
      );


    return receipt || null;

  }catch(error){

    console.error(
      'Generate receipt number error:',
      error
    );

    return null;
  }

}


/* ==========================================
   SALE ITEM STATE
   ========================================== */

let saleItems=[];


function clearSaleItems(){

  saleItems=[];

  renderSaleItems();

}


function addSaleItem(
  product,
  quantity=1
){

  if(!product)
    return;


  const existing=
    saleItems.find(
      item=>String(item.product_id)===
             String(product.id)
    );


  if(existing){

    existing.quantity +=
      numberValue(quantity);

  }else{

    saleItems.push({

      product_id:
        product.id,

      variant_id:
        product.variant_id ||
        product.default_variant_id ||
        null,

      product_name:
        product.name,

      quantity:
        numberValue(quantity),

      unit_price:
        numberValue(
          product.selling_price
        ),

      cogs:
        numberValue(
          product.buying_price ||
          product.cost_price ||
          0
        )

    });

  }


  renderSaleItems();

}


function removeSaleItem(
  index
){

  saleItems.splice(
    index,
    1
  );

  renderSaleItems();

}


function updateSaleItemQuantity(
  index,
  quantity
){

  const item=
    saleItems[index];

  if(!item)
    return;


  const q=
    numberValue(quantity);


  if(q<=0){

    removeSaleItem(
      index
    );

    return;
  }


  item.quantity=q;

  renderSaleItems();

}


function renderSaleItems(){

  const tbody=
    byId('saleItemsTableBody');

  if(!tbody)
    return;


  if(!saleItems.length){

    tbody.innerHTML=
      `<tr>
        <td colspan="6">
          ${escapeHtml(
            translations[currentLanguage].no_sale_items ||
            (
              currentLanguage==='sw'
                ? 'Hakuna bidhaa.'
                : 'No items.'
            )
          )}
        </td>
      </tr>`;

    updateSaleTotals();

    return;
  }


  tbody.innerHTML=
    saleItems.map(
      (item,index)=>{

        const total=
          numberValue(
            item.quantity
          ) *
          numberValue(
            item.unit_price
          );


        return `

          <tr>

            <td>
              ${escapeHtml(
                item.product_name
              )}
            </td>

            <td>

              <input
                type="number"
                min="1"
                value="${escapeHtml(item.quantity)}"
                data-sale-qty="${index}"
              />

            </td>

            <td>
              ${formatMoney(
                item.unit_price
              )}
            </td>

            <td>
              ${formatMoney(
                total
              )}
            </td>

            <td>

              <button
                type="button"
                class="btn btn-sm"
                data-remove-sale-item="${index}"
              >
                ×
              </button>

            </td>

          </tr>

        `;

      }
    ).join('');


  tbody
    .querySelectorAll(
      '[data-sale-qty]'
    )
    .forEach(input=>{

      input.addEventListener(
        'change',
        ()=>{

          updateSaleItemQuantity(
            Number(
              input.dataset.saleQty
            ),
            input.value
          );

        }
      );

    });


  tbody
    .querySelectorAll(
      '[data-remove-sale-item]'
    )
    .forEach(button=>{

      button.addEventListener(
        'click',
        ()=>{

          removeSaleItem(
            Number(
              button.dataset.removeSaleItem
            )
          );

        }
      );

    });


  updateSaleTotals();

}


function calculateSaleTotal(){

  return saleItems.reduce(
    (total,item)=>{

      return total +
        (
          numberValue(
            item.quantity
          ) *
          numberValue(
            item.unit_price
          )
        );

    },
    0
  );

}


function updateSaleTotals(){

  const total=
    calculateSaleTotal();


  const totalElement=
    byId('saleGrandTotal');

  if(totalElement){

    totalElement.textContent=
      formatMoney(total);

  }


  const paidInput=
    byId('salePaidAmount');


  const balanceElement=
    byId('saleBalance');


  const paid=
    numberValue(
      paidInput?.value
    );


  if(balanceElement){

    balanceElement.textContent=
      formatMoney(
        Math.max(
          total-paid,
          0
        )
      );

  }

}


/* ==========================================
   SALE PAYMENT EVENTS
   ========================================== */

function installSaleEvents(){

  const paidInput=
    byId('salePaidAmount');

  if(paidInput){

    paidInput.addEventListener(
      'input',
      updateSaleTotals
    );

  }


  const addButton=
    byId('addSaleItemBtn');

  if(addButton){

    addButton.addEventListener(
      'click',
      function(){

        showInfo(
          currentLanguage==='sw'
            ? 'Chagua bidhaa ili kuongeza kwenye sale.'
            : 'Select a product to add to the sale.'
        );

      }
    );

  }

}


/* ==========================================
   INIT
   ========================================== */

/* ==========================================
   DASHBOARD INITIALIZATION — FIXED
   RLS: HAKUNA MABADILIKO
   Frontend initialization only.
   ========================================== */

async function initializeDashboard(){

  if(dashboardInitialized)
    return;


  dashboardInitialized = true;


  /*
   * Language
   */

  applyLanguage(
    currentLanguage
  );


  /*
   * Install UI navigation FIRST.
   *
   * This must happen before authentication
   * and database loading so that navigation
   * cannot be blocked by Supabase errors.
   */

  installNavigation();

  installSidebar();

  installLanguageSelector();

  installQuickActions();

  installSaleEvents();


  /*
   * Search
   */

  installSearch(
    'customerSearch',
    searchCustomers
  );

  installSearch(
    'supplierSearch',
    searchSuppliers
  );

  installSearch(
    'productSearch',
    searchProducts
  );

  installSearch(
    'salesSearch',
    searchSales
  );


  /*
   * Authentication
   *
   * Navigation must NOT depend on this.
   */

  try{

    const authenticated =
      await ensureAuthenticated();


    if(authenticated){

      await loadCurrentProfile();

    }

  }catch(error){

    console.error(
      'SGC authentication initialization error:',
      error
    );

  }


  /*
   * Always open Dashboard after
   * navigation has been installed.
   *
   * Database errors must never stop
   * the navigation system.
   */

  try{

    await openSection(
      'dashboard'
    );

  }catch(error){

    console.error(
      'SGC dashboard opening error:',
      error
    );

  }


  /*
   * Public functions
   */

  window.openSection =
    openSection;

  window.openSGCSection =
    openSection;


  window.loadCustomers =
    loadCustomers;

  window.loadSuppliers =
    loadSuppliers;

  window.loadProducts =
    loadProducts;

  window.loadExpenses =
    loadExpenses;

  window.loadPayments =
    loadPayments;

  window.loadReports =
    loadReports;

  window.loadUsers =
    loadUsers;

  window.loadSettings =
    loadSettings;

  window.loadSales =
    loadSales;

  window.loadReceipts =
    loadReceipts;

  window.loadCurrentStock =
    loadCurrentStock;

  window.loadReceivedStock =
    loadReceivedStock;


  /*
   * Confirm navigation is ready.
   */

  window.__SGC_NAV_READY =
    true;

}
   ========================================== */

window.addEventListener(
  'error',
  function(event){

    console.error(
      'SGC dashboard error:',
      event.error ||
      event.message
    );

  }
);


window.addEventListener(
  'unhandledrejection',
  function(event){

    console.error(
      'SGC unhandled promise rejection:',
      event.reason
    );

  }
);


/* ==========================================
   START APPLICATION
   ========================================== */

if(
  document.readyState==='loading'
){

  document.addEventListener(
    'DOMContentLoaded',
    initializeDashboard,
    {
      once:true
    }
  );

}else{

  initializeDashboard();

}


/* ==========================================
   PUBLIC API
   ========================================== */

window.SGCApp={

  openSection,

  loadCustomers,

  loadSuppliers,

  loadProducts,

  loadExpenses,

  loadPayments,

  loadReports,

  loadUsers,

  loadSettings,

  loadSales,

  loadReceipts,

  loadCurrentStock,

  loadReceivedStock,

  generateReceiptNumber,

  showToast,

  showSuccess,

  showError,

  showInfo

};
/* ==========================================
   SGC DASHBOARD — PART 4
   FINAL COMPATIBILITY + LEGACY BRIDGE
   ========================================== */


/* ==========================================
   LEGACY FUNCTION BRIDGES
   ========================================== */

/*
 * Baadhi ya buttons za HTML zinaweza kuwa na
 * onclick attributes kutoka versions zilizopita.
 * Bridges hizi zinahakikisha hazivunji navigation.
 */

window.showSection=function(section){

  if(
    typeof window.openSection==='function'
  ){

    return window.openSection(
      section
    );

  }

};


window.navigateTo=function(section){

  if(
    typeof window.openSection==='function'
  ){

    return window.openSection(
      section
    );

  }

};


window.goToSection=function(section){

  if(
    typeof window.openSection==='function'
  ){

    return window.openSection(
      section
    );

  }

};


/* ==========================================
   DIRECT BUTTON COMPATIBILITY
   ========================================== */

function installDirectCompatibility(){

  const mappings={

    customersNavBtn:
      'customers',

    suppliersNavBtn:
      'suppliers',

    expensesNavBtn:
      'expenses',

    paymentsNavBtn:
      'payments',

    reportsNavBtn:
      'reports',

    usersNavBtn:
      'users',

    settingsNavBtn:
      'settings',

    productsNavBtn:
      'products',

    salesNavBtn:
      'sales',

    stockNavBtn:
      'stock',

    receivedStockNavBtn:
      'receivedStock',

    receiptsNavBtn:
      'receipts',

    dashboardNavBtn:
      'dashboard'

  };


  Object.entries(
    mappings
  ).forEach(
    ([buttonId,section])=>{

      const button=
        document.getElementById(
          buttonId
        );


      if(!button)
        return;


      /*
       * Use capture phase so this handler
       * can survive older event handlers.
       */

      button.addEventListener(
        'click',
        function(event){

          event.preventDefault();
          event.stopImmediatePropagation();


          if(
            typeof window.openSection===
            'function'
          ){

            window.openSection(
              section
            );

          }

        },
        true
      );

    }
  );

}


/* ==========================================
   FORCE NAVIGATION AFTER LEGACY CODE
   ========================================== */

function installNavigationWatchdog(){

  let lastSection=
    window.__SGC_CURRENT_SECTION ||
    'dashboard';


  setInterval(
    function(){

      const current=
        window.__SGC_CURRENT_SECTION;


      if(
        current &&
        current!==lastSection
      ){

        lastSection=
          current;

        return;

      }


      /*
       * If a page has been accidentally hidden
       * by another legacy handler, restore it.
       */

      if(
        !current ||
        !window.SGCApp ||
        typeof window.SGCApp.openSection!==
        'function'
      ){

        return;

      }


      const route=
        SGC_ROUTES[
          current
        ];


      if(!route)
        return;


      const page=
        document.getElementById(
          route.page
        );


      const button=
        document.getElementById(
          route.button
        );


      if(
        page &&
        (
          page.style.display==='none' ||
          !page.classList.contains('active')
        )
      ){

        /*
         * Do not reload dashboard data here.
         * Only restore visual state.
         */

        page.classList.add(
          'active',
          'sgc-force-active'
        );

        page.style.display=
          'block';

        page.style.visibility=
          'visible';

      }


      if(button){

        button.classList.add(
          'active'
        );

      }

    },
    250
  );

}


/* ==========================================
   MODAL CLOSE HANDLING
   ========================================== */

function installModalCloseHandlers(){

  document.addEventListener(
    'click',
    function(event){

      const closeButton=
        event.target.closest(
          '[data-close-modal]'
        );


      if(closeButton){

        const modalId=
          closeButton.dataset.closeModal;


        if(modalId){

          hideElement(
            byId(modalId)
          );

        }

      }

    }
  );


  /*
   * Close modal when clicking outside
   */

  document.addEventListener(
    'click',
    function(event){

      if(
        !event.target.classList.contains(
          'modal'
        )
      ){

        return;

      }


      const modal=
        event.target;


      hideElement(
        modal
      );

    }
  );


  /*
   * ESC closes visible modal
   */

  document.addEventListener(
    'keydown',
    function(event){

      if(
        event.key!=='Escape'
      ){

        return;

      }


      $$('.modal')
        .forEach(
          modal=>{

            if(
              modal.style.display!=='none'
            ){

              hideElement(
                modal
              );

            }

          }
        );

    }
  );

}


/* ==========================================
   FORM ENTER PROTECTION
   ========================================== */

function installFormProtection(){

  document.addEventListener(
    'submit',
    function(event){

      /*
       * Prevent accidental page reload.
       * Actual form actions are handled by
       * their specific JavaScript functions.
       */

      const form=
        event.target;


      if(
        form &&
        form.dataset.sgcNativeSubmit!=='true'
      ){

        event.preventDefault();

      }

    }
  );

}


/* ==========================================
   SAFE GLOBAL ERROR MESSAGE
   ========================================== */

function installSafeErrorDisplay(){

  window.addEventListener(
    'error',
    function(event){

      /*
       * Do not replace the whole dashboard
       * with an error screen.
       *
       * This is especially important because
       * a database/module error must not stop
       * navigation.
       */

      console.error(
        '[SGC Dashboard Error]',
        event.error ||
        event.message
      );

    }
  );


  window.addEventListener(
    'unhandledrejection',
    function(event){

      console.error(
        '[SGC Promise Error]',
        event.reason
      );

    }
  );

}


/* ==========================================
   AUTH STATE LISTENER
   ========================================== */

function installAuthListener(){

  supabaseAuthClient
    .auth
    .onAuthStateChange(
      async function(
        event,
        session
      ){

        console.log(
          'SGC Auth Event:',
          event
        );


        if(
          session &&
          session.user
        ){

          currentUser=
            session.user;


          /*
           * Do not automatically reload the
           * entire dashboard on every token
           * refresh.
           */

          if(
            event==='SIGNED_IN'
          ){

            try{

              await loadCurrentProfile();

            }catch(error){

              console.error(
                'Profile refresh error:',
                error
              );

            }

          }

        }else if(
          event==='SIGNED_OUT'
        ){

          currentUser=null;
          currentProfile=null;
          currentRole=null;

        }

      }
    );

}


/* ==========================================
   WINDOW RESIZE
   ========================================== */

function installResizeHandler(){

  let timer=null;


  window.addEventListener(
    'resize',
    function(){

      clearTimeout(
        timer
      );


      timer=
        setTimeout(
          function(){

            /*
             * Ensure sidebar does not remain
             * open after switching to desktop.
             */

            if(
              window.innerWidth>800
            ){

              const sidebar=
                byId('sidebar');


              if(sidebar){

                sidebar.classList.remove(
                  'open'
                );

              }

            }

          },
          150
        );

    }
  );

}


/* ==========================================
   PAGE VISIBILITY SAFETY
   ========================================== */

function installVisibilitySafety(){

  document.addEventListener(
    'visibilitychange',
    function(){

      if(
        document.visibilityState!==
        'visible'
      ){

        return;

      }


      /*
       * When returning to the dashboard,
       * verify that the selected page is still
       * visible.
       */

      const section=
        window.__SGC_CURRENT_SECTION;


      if(
        section &&
        typeof window.openSection===
        'function'
      ){

        const route=
          SGC_ROUTES[
            section
          ];


        if(!route)
          return;


        const page=
          byId(
            route.page
          );


        if(
          page &&
          (
            !page.classList.contains('active') ||
            page.style.display==='none'
          )
        ){

          /*
           * Visual restore only.
           */

          page.classList.add(
            'active',
            'sgc-force-active'
          );

          page.style.display=
            'block';

          page.style.visibility=
            'visible';

        }

      }

    }
  );

}


/* ==========================================
   ACCESSIBILITY
   ========================================== */

function installAccessibility(){

  document
    .querySelectorAll(
      '.nav button'
    )
    .forEach(
      button=>{

        if(
          !button.getAttribute(
            'aria-label'
          )
        ){

          const text=
            button.textContent
              .trim();


          if(text){

            button.setAttribute(
              'aria-label',
              text
            );

          }

        }

      }
    );

}


/* ==========================================
   REINITIALIZE NAVIGATION
   ========================================== */

window.reinitializeSGCNavigation=
  function(){

    try{

      installNavigation();

      installDirectCompatibility();


      const current=
        window.__SGC_CURRENT_SECTION ||
        'dashboard';


      if(
        typeof openSection==='function'
      ){

        openSection(
          current
        );

      }

      return true;

    }catch(error){

      console.error(
        'SGC navigation reinitialization error:',
        error
      );

      return false;

    }

  };


/* ==========================================
   INITIALIZATION PATCH
   ========================================== */

(function(){

  function patch(){

    try{

      installDirectCompatibility();

      installNavigationWatchdog();

      installModalCloseHandlers();

      installFormProtection();

      installSafeErrorDisplay();

      installAuthListener();

      installResizeHandler();

      installVisibilitySafety();

      installAccessibility();


      /*
       * Apply language again after all HTML
       * elements have loaded.
       */

      applyLanguage(
        currentLanguage
      );


      console.log(
        'SGC Dashboard Version 24 initialized successfully.'
      );


    }catch(error){

      console.error(
        'SGC Version 24 initialization patch error:',
        error
      );

    }

  }


  if(
    document.readyState==='loading'
  ){

    document.addEventListener(
      'DOMContentLoaded',
      patch,
      {
        once:true
      }
    );

  }else{

    patch();

  }

})();


/* ==========================================
   FINAL PUBLIC DEBUG API
   ========================================== */

window.SGC_DEBUG={

  version:'24',

  routes:SGC_ROUTES,

  currentSection:function(){

    return (
      window.__SGC_CURRENT_SECTION ||
      null
    );

  },

  open:function(section){

    if(
      typeof window.openSection===
      'function'
    ){

      return window.openSection(
        section
      );

    }

    return false;

  },

  profile:function(){

    return currentProfile;

  },

  user:function(){

    return currentUser;

  },

  role:function(){

    return currentRole;

  },

  products:function(){

    return productsData;

  },

  customers:function(){

    return customersData;

  },

  suppliers:function(){

    return suppliersData;

  },

  sales:function(){

    return salesData;

  },

  expenses:function(){

    return expensesData;

  },

  payments:function(){

    return paymentsData;

  }

};


/* ==========================================
   END OF SGC DASHBOARD.JS
   ========================================== */
