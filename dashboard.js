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
    const r=routes[name]; if(!r) return;
    const all=document.querySelectorAll('.page-view');
    all.forEach(p=>{p.classList.remove('active','sgc-force-active');p.style.display='none';p.style.visibility='hidden';});
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
    const welcome=document.querySelector('.content > .welcome');
    const cards=document.querySelector('.content > .cards');
    const grid=document.querySelector('.content > .grid-two');
    const dashboard= name==='dashboard';
    if(welcome) welcome.style.display=dashboard?'':'none';
    if(cards) cards.style.display=dashboard?'':'none';
    if(grid) grid.style.display=dashboard?'':'none';
    const btn=document.getElementById(r[0]); if(btn) btn.classList.add('active');
    if(r[1]){
      const page=document.getElementById(r[1]);
      if(page){page.classList.add('active','sgc-force-active');page.style.display='block';page.style.visibility='visible';}
    }
    window.__SGC_EMERGENCY_ROUTE=name;
  }
  function install(){
    document.addEventListener('click',function(e){
      const btn=e.target.closest('.nav button');
      if(!btn) return;
      const name=Object.keys(routes).find(k=>routes[k][0]===btn.id);
      if(!name) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openRoute(name);
      // Restore the selected page after any legacy handler/loader finishes.
      setTimeout(()=>openRoute(name),0);
    },true);
    window.__SGCEmergencyOpen=openRoute;
    window.__SGC_NAV_READY=true;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();

/* ===== Extracted inline module ===== */

window.__openSGCSection = function(section){
    try{
        var pageIds=['dashboardPage','currentStockPage','productsPage','receivedStockPage','salesPage','receiptsPage','customersPage','suppliersPage','expensesPage','paymentsPage','reportsPage','usersPage','settingsPage'];
        pageIds.forEach(function(id){ var p=document.getElementById(id); if(p){ p.classList.remove('active','sgc-force-active'); p.style.removeProperty('display'); }});
        document.querySelectorAll('.nav button').forEach(function(b){ b.classList.remove('active'); });
        var welcome=document.querySelector('.content > .welcome'); if(welcome) welcome.style.display='none';
        var cards=document.querySelector('.content > .cards'); if(cards) cards.style.display='none';
        var grid=document.querySelector('.content > .grid-two'); if(grid) grid.style.display='none';
        var page=document.getElementById(section+'Page');
        var btn=document.getElementById(section+'NavBtn');
        if(!page || !btn){ console.error('SGC navigation target not found:',section); return false; }
        page.classList.add('active','sgc-force-active');
        page.style.display='block';
        btn.classList.add('active');
        if(section==='customers' && typeof loadCustomers==='function') loadCustomers();
        if(section==='expenses' && typeof loadExpenses==='function') loadExpenses();
        if(section==='payments' && typeof loadPayments==='function') loadPayments();
        if(section==='reports' && typeof loadReports==='function') loadReports();
        if(section==='users' && typeof loadUsers==='function') loadUsers();
        if(section==='settings' && typeof loadSettings==='function') loadSettings();
        if(window.innerWidth<=800 && typeof sidebar!=='undefined' && sidebar) sidebar.classList.remove('open');
        return false;
    }catch(error){ console.error('SGC section navigation error:',error); return false; }
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
    const supabaseAuthClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: false
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
            stock: "Stock", received_stock: "Stock Iliyoingia", receipts: "Risiti", received_history: "Historia", sales: "Mauzo", customers: "Wateja", suppliers: "Suppliers",
            finance: "Fedha", expenses: "Matumizi", payments: "Malipo", reports: "Ripoti", reports_menu: "Ripoti",
            administration: "Usimamizi", users: "Watumiaji", settings: "Mipangilio", logout: "Toka",
            welcome: "Karibu",
            welcome_message: "Karibu kwenye SGC SOFT DRINKS MANAGEMENT. Dhibiti biashara yako kwa urahisi.",
            today_sales: "Mauzo ya Leo", stock_value: "Thamani ya Stock", today_transactions: "Transactions Leo", customers_count: "Wateja",
            quick_actions: "Vitendo vya Haraka", receive_stock: "Pokea Stock", receive_stock_desc: "Rekodi bidhaa mpya zilizoingia",
            new_sale: "Mauzo Mapya", new_sale_desc: "Rekodi mauzo ya bidhaa", sales_title: "Mauzo", sales_subtitle: "Rekodi mauzo, fuatilia malipo na tafuta receipts.", sales_total: "Mauzo ya Leo", sales_paid: "Zimelipwa", sales_credit: "Credit", sales_transactions: "Transactions", search_sales: "Tafuta receipt...", new_sale_title: "Mauzo Mapya", customer: "Mteja", walk_in_customer: "Mteja wa kawaida", payment_method: "Njia ya Malipo", paid_amount: "Kilicholipwa", sale_notes: "Notes", sale_items: "Bidhaa za Mauzo", grand_total: "Jumla", balance: "Balance", save_sale: "Hifadhi Sale", sales_history: "Historia ya Mauzo", receipt_no: "Receipt", salesman: "Salesman", view: "Tazama", print: "Print", sale_saved: "Sale imehifadhiwa vizuri.", sale_error: "Imeshindikana kuhifadhi sale.", customer_required_credit: "Credit/partial payment inahitaji customer.", no_sale_items: "Ongeza angalau bidhaa moja.", duplicate_sale_product: "Bidhaa hiyo tayari ipo kwenye mstari mwingine.", new_customer: "Mteja Mpya", new_customer_desc: "Ongeza mteja mpya",
            new_expense: "Expense Mpya", new_expense_desc: "Rekodi matumizi ya biashara", recent_activity: "Shughuli za Karibuni", no_activity: "Hakuna shughuli bado.",
            products_title: "Bidhaa", products_subtitle: "Simamia bidhaa, bei za mauzo na viwango vya stock.", search_products: "Tafuta bidhaa...",
            add_product: "Ongeza Bidhaa", products_list: "Orodha ya Bidhaa", product: "Bidhaa", selling_price: "Bei ya Mauzo",
            low_stock: "Low Stock", status: "Hali", actions: "Vitendo", active: "Hai", inactive: "Haifanyi kazi", edit: "Hariri",
            activate: "Washa", deactivate: "Zima", loading: "Inapakia...", no_products: "Hakuna bidhaa zilizopatikana.",
            add_product_title: "Ongeza Bidhaa", edit_product_title: "Hariri Bidhaa", product_name: "Jina la Bidhaa",
            selling_price_label: "Bei ya Mauzo", low_stock_label: "Kiwango cha Low Stock", cancel: "Ghairi", save: "Hifadhi",
            product_saved: "Bidhaa imehifadhiwa vizuri.", product_updated: "Bidhaa imesasishwa vizuri.", product_activated: "Bidhaa imewashwa.",
            product_deactivated: "Bidhaa imezimwa.", product_error: "Kuna tatizo. Tafadhali jaribu tena.", name_required: "Jina la bidhaa linahitajika.",
            stock_title: "Stock", stock_subtitle: "Pokea, thibitisha na fuatilia bidhaa zinazoingia.",
            pending_receipts: "Receipts Pending", verified_receipts: "Receipts Zilizothibitishwa", rejected_receipts: "Receipts Zilizokataliwa",
            receive_stock_tab: "Pokea Stock", receipts_tab: "Receipts", new_receipt: "Receipt Mpya", receive_stock_title: "Pokea Stock",
            pending_note: "Itahifadhiwa kama Pending mpaka Owner athibitishe.", invoice_no: "Invoice / Receipt No.", supplier: "Supplier",
            select_supplier: "Chagua Supplier", payment_reference: "Payment Reference", notes: "Notes", stock_items: "Bidhaa Zilizopokelewa",
            add_item: "Ongeza Bidhaa", receipt_total: "Jumla ya Receipt", clear: "Futa", save_pending: "Hifadhi Pending",
            packaging: "Ufungashaji", quantity: "Kiasi", buying_price: "Bei ya Manunuzi", stock_receipts: "Stock Receipts", refresh: "Refresh",
            total: "Jumla", date: "Tarehe", verify: "Thibitisha", reject: "Kataa",
            confirm_verify: "Una uhakika unataka kuthibitisha receipt hii?", rejection_prompt: "Andika sababu ya kukataa:",
            receipt_saved: "Stock receipt imehifadhiwa kama Pending.", receipt_verified: "Stock receipt imethibitishwa na stock itaingia.",
            receipt_rejected: "Stock receipt imekataliwa.", no_receipts: "Hakuna stock receipts.", load_error: "Imeshindikana kupakia data.",
            no_active_products: "Hakuna bidhaa hai. Ongeza bidhaa kwanza."
        },

        en: {
            main_menu: "Main Menu", dashboard: "Dashboard", overview_text: "Overview of your business", stock: "Stock", received_stock: "Received Stock", sales: "Sales",
            customers: "Customers", suppliers: "Suppliers", finance: "Finance", expenses: "Expenses", payments: "Payments", reports: "Reports",
            reports_menu: "Reports", administration: "Administration", users: "Users", settings: "Settings", logout: "Logout", welcome: "Welcome",
            welcome_message: "Welcome to SGC SOFT DRINKS MANAGEMENT. Manage your business with ease.", today_sales: "Today's Sales",
            stock_value: "Stock Value", today_transactions: "Today's Transactions", customers_count: "Customers", quick_actions: "Quick Actions",
            receive_stock: "Receive Stock", receive_stock_desc: "Record newly received products", new_sale: "New Sale", new_sale_desc: "Record a product sale", sales_title: "Sales", sales_subtitle: "Record sales, track payments and search receipts.", sales_total: "Today Sales", sales_paid: "Paid", sales_credit: "Credit", sales_transactions: "Transactions", search_sales: "Search receipt...", new_sale_title: "New Sale", customer: "Customer", walk_in_customer: "Walk-in Customer", payment_method: "Payment Method", paid_amount: "Paid Amount", sale_notes: "Notes", sale_items: "Sale Items", grand_total: "Total", balance: "Balance", save_sale: "Save Sale", sales_history: "Sales History", receipt_no: "Receipt", salesman: "Salesman", view: "View", print: "Print", sale_saved: "Sale saved successfully.", sale_error: "Failed to save sale.", customer_required_credit: "Credit/partial payment requires a customer.", no_sale_items: "Add at least one product.", duplicate_sale_product: "That product is already on another line.",
            new_customer: "New Customer", new_customer_desc: "Add a new customer", new_expense: "New Expense", new_expense_desc: "Record business expenses",
            recent_activity: "Recent Activity", no_activity: "No activity yet.", products_title: "Products",
            products_subtitle: "Manage products, selling prices and stock levels.", search_products: "Search products...", add_product: "Add Product",
            products_list: "Product List", product: "Product", selling_price: "Selling Price", low_stock: "Low Stock", status: "Status", actions: "Actions",
            active: "Active", inactive: "Inactive", edit: "Edit", activate: "Activate", deactivate: "Deactivate", loading: "Loading...",
            no_products: "No products found.", add_product_title: "Add Product", edit_product_title: "Edit Product", product_name: "Product Name",
            selling_price_label: "Selling Price", low_stock_label: "Low Stock Level", cancel: "Cancel", save: "Save",
            product_saved: "Product saved successfully.", product_updated: "Product updated successfully.", product_activated: "Product activated.",
            product_deactivated: "Product deactivated.", product_error: "Something went wrong. Please try again.", name_required: "Product name is required.",
            stock_title: "Stock", stock_subtitle: "Receive, verify and track incoming products.", pending_receipts: "Pending Receipts",
            verified_receipts: "Verified Receipts", rejected_receipts: "Rejected Receipts", receive_stock_tab: "Receive Stock", receipts_tab: "Receipts",
            new_receipt: "New Receipt", receive_stock_title: "Receive Stock", pending_note: "It will remain Pending until the Owner verifies it.",
            invoice_no: "Invoice / Receipt No.", supplier: "Supplier", select_supplier: "Select Supplier", payment_reference: "Payment Reference",
            notes: "Notes", stock_items: "Received Products", add_item: "Add Product", receipt_total: "Receipt Total", clear: "Clear",
            save_pending: "Save Pending", packaging: "Packaging", quantity: "Quantity", buying_price: "Buying Price", stock_receipts: "Stock Receipts",
            refresh: "Refresh", total: "Total", date: "Date", verify: "Verify", reject: "Reject",
            confirm_verify: "Are you sure you want to verify this receipt?", rejection_prompt: "Enter rejection reason:",
            receipt_saved: "Stock receipt saved as Pending.", receipt_verified: "Stock receipt verified and stock will be added.",
            receipt_rejected: "Stock receipt rejected.", no_receipts: "No stock receipts.", load_error: "Failed to load data.",
            no_active_products: "No active products. Add a product first."
        }

    };


    let currentLanguage =
        localStorage.getItem("sgc_language") || "sw";


    function applyLanguage(language) {

        currentLanguage = language;

        localStorage.setItem(
            "sgc_language",
            language
        );


        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.getAttribute("data-i18n");

                if (
                    translations[language] &&
                    translations[language][key]
                ) {

                    element.textContent =
                        translations[language][key];

                }

            });



        document
            .querySelectorAll("[data-i18n-placeholder]")
            .forEach(element => {
                const key = element.getAttribute("data-i18n-placeholder");
                if (translations[language] && translations[language][key]) {
                    element.placeholder = translations[language][key];
                }
            });

        document
            .getElementById("swBtn")
            .classList.toggle(
                "active",
                language === "sw"
            );


        document
            .getElementById("enBtn")
            .classList.toggle(
                "active",
                language === "en"
            );

    }


    document
        .getElementById("swBtn")
        .addEventListener(
            "click",
            () => applyLanguage("sw")
        );


    document
        .getElementById("enBtn")
        .addEventListener(
            "click",
            () => applyLanguage("en")
        );


    /* ==========================================
       AUTH SESSION + AUTOMATIC JWT REFRESH
       ========================================== */

    let accessToken =
        localStorage.getItem("sgc_access_token");

    let refreshToken =
        localStorage.getItem("sgc_refresh_token");

    const storedUser =
        localStorage.getItem("sgc_user");

    const nativeFetch = window.fetch.bind(window);
    let refreshPromise = null;

    function saveSession(session) {
        if (!session?.access_token) return;

        accessToken = session.access_token;
        localStorage.setItem("sgc_access_token", accessToken);

        if (session.refresh_token) {
            refreshToken = session.refresh_token;
            localStorage.setItem("sgc_refresh_token", refreshToken);
        }

        if (session.user) {
            localStorage.setItem("sgc_user", JSON.stringify(session.user));
        }
    }

    async function refreshAuthSession(force = false) {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
            try {
                const { data, error } = force
                    ? await supabaseAuthClient.auth.refreshSession()
                    : await supabaseAuthClient.auth.getSession();

                if (error) {
                    console.error("Supabase session refresh failed:", error);
                    return false;
                }

                if (!data?.session?.access_token) {
                    return false;
                }

                saveSession(data.session);
                return true;
            } catch (error) {
                console.error("Supabase session refresh error:", error);
                return false;
            } finally {
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    }

    function tokenNeedsRefresh() {
        if (!accessToken) return true;

        try {
            const payload = JSON.parse(
                atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
            );
            return !payload.exp || (payload.exp * 1000 - Date.now()) < 5 * 60 * 1000;
        } catch (_) {
            return false;
        }
    }

    async function ensureAuthSession() {
        try {
            const { data, error } = await supabaseAuthClient.auth.getSession();

            if (error) throw error;

            if (data?.session?.access_token) {
                saveSession(data.session);
            } else if (refreshToken) {
                const refreshed = await refreshAuthSession(true);
                if (!refreshed) {
                    window.location.href = "index.html";
                    return false;
                }
            } else {
                window.location.href = "index.html";
                return false;
            }

            if (tokenNeedsRefresh()) {
                const refreshed = await refreshAuthSession(true);
                if (!refreshed) return false;
            }

            return !!accessToken;
        } catch (error) {
            console.error("Auth session check failed:", error);
            window.location.href = "index.html";
            return false;
        }
    }

    supabaseAuthClient.auth.onAuthStateChange((event, session) => {
        if (session?.access_token) {
            saveSession(session);
        }
    });

    /* Automatically retry expired-token requests with a fresh JWT. */
    window.fetch = async function(input, init = {}) {
        const requestUrl = typeof input === "string"
            ? input
            : input?.url || "";

        const isAuthRequest =
            requestUrl.includes("/auth/v1/token") ||
            requestUrl.includes("/auth/v1/logout");

        if (!isAuthRequest) {
            const ready = await ensureAuthSession();
            if (!ready) {
                return new Response(JSON.stringify({ message: "Authentication required." }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        const requestInit = { ...init, headers: new Headers(init.headers || {}) };

        if (!isAuthRequest && accessToken) {
            requestInit.headers.set("Authorization", `Bearer ${accessToken}`);
            requestInit.headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
        }

        let response = await nativeFetch(input, requestInit);

        if (response.status !== 401 || isAuthRequest) {
            return response;
        }

        const refreshed = await refreshAuthSession(true);
        if (!refreshed) {
            return response;
        }

        requestInit.headers.set("Authorization", `Bearer ${accessToken}`);
        requestInit.headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
        return nativeFetch(input, requestInit);
    };

    /* Refresh periodically so normal use does not hit JWT expiry. */
    setInterval(() => {
        if (refreshToken && tokenNeedsRefresh()) {
            refreshAuthSession(false);
        }
    }, 60 * 1000);

    /* Bootstrap from the real Supabase Auth session. */
    ensureAuthSession();


    let user = null;


    try {

        user = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        user = null;

    }


    /* ==========================================
       USER INFORMATION
       ========================================== */

    function displayUser() {

        const email =
            user?.email || "Owner";

        const metadata =
            user?.user_metadata || {};

        const name =
            metadata.full_name ||
            metadata.name ||
            email.split("@")[0] ||
            "Owner";


        document
            .getElementById("userName")
            .textContent = name;


        document
            .getElementById("welcomeName")
            .textContent = name;


        document
            .getElementById("userAvatar")
            .textContent =
            name.charAt(0).toUpperCase();

    }


    /* ==========================================
       DASHBOARD REAL DATA
       ========================================== */

    async function loadDashboardSummary() {

        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/rpc/get_owner_dashboard_summary`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_PUBLISHABLE_KEY,

                            "Authorization":
                                `Bearer ${accessToken}`
                        },

                        body: JSON.stringify({})
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Dashboard summary error:",
                    data
                );

                return;

            }


            const summary =
                Array.isArray(data)
                    ? data[0]
                    : data;


            if (!summary) {

                return;

            }


            document
                .getElementById("todaySales")
                .textContent =
                `TZS ${Number(
                    summary.today_sales || 0
                ).toLocaleString()}`;


            document
                .getElementById("stockValue")
                .textContent =
                `TZS ${Number(
                    summary.stock_value || 0
                ).toLocaleString()}`;


            document
                .getElementById("todayTransactions")
                .textContent =
                Number(
                    summary.today_transactions || 0
                ).toLocaleString();


            document
                .getElementById("customersCount")
                .textContent =
                Number(
                    summary.customers_count || 0
                ).toLocaleString();


        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        }

    }




    /* ==========================================
       STOCK / RECEIVE STOCK MANAGEMENT
       ========================================== */

    const stockPage = document.getElementById("stockPage");
    const receivedStockNavBtn = document.getElementById("receivedStockNavBtn");
    const stockNavBtn = document.getElementById("stockNavBtn");
    const receiveStockTab = document.getElementById("receiveStockTab");
    const receiptsTab = document.getElementById("receiptsTab");
    const receiveStockPanel = document.getElementById("receiveStockPanel");
    const receiptsPanel = document.getElementById("receiptsPanel");
    const receiptItems = document.getElementById("receiptItems");
    const receiptSupplier = document.getElementById("receiptSupplier");
    const stockReceiptForm = document.getElementById("stockReceiptForm");
    const stockFormMessage = document.getElementById("stockFormMessage");
    const receiptsTableBody = document.getElementById("receiptsTableBody");

    let stockProducts = [];
    let stockSuppliers = [];
    let stockReceipts = [];

    function showStockPage() {
        document.querySelector(".content > .welcome").style.display = "none";
        document.querySelector(".content > .cards").style.display = "none";
        document.querySelector(".content > .grid-two").style.display = "none";
        productsPage.classList.remove("active");
        salesPage.classList.remove("active");
        stockPage.classList.add("active");

        document.querySelectorAll(".nav button").forEach(btn => btn.classList.remove("active"));
        stockNavBtn.classList.add("active");

        loadStockData();

        if (window.innerWidth <= 800) sidebar.classList.remove("open");
    }

    function showProductsFromStock() {
        showProductsPage();
    }

    function switchStockTab(tab) {
        const receive = tab === "receive";
        receiveStockTab.classList.toggle("active", receive);
        receiptsTab.classList.toggle("active", !receive);
        receiveStockPanel.classList.toggle("active", receive);
        receiptsPanel.classList.toggle("active", !receive);

        if (!receive) loadStockReceipts();
    }

    receiveStockTab.addEventListener("click", () => switchStockTab("receive"));
    receiptsTab.addEventListener("click", () => switchStockTab("receipts"));

    document.getElementById("newReceiptBtn").addEventListener("click", () => {
        switchStockTab("receive");
        clearReceiptForm();
        document.getElementById("receiptNumber").focus();
    });

    document.getElementById("refreshReceiptsBtn").addEventListener("click", loadStockReceipts);

    document.getElementById("addStockLineBtn").addEventListener("click", () => {
        addReceiptItemRow();
    });

    document.getElementById("clearReceiptBtn").addEventListener("click", clearReceiptForm);

    function showStockMessage(message, type) {
        stockFormMessage.textContent = message;
        stockFormMessage.className = `stock-message show ${type}`;
    }

    function clearStockMessage() {
        stockFormMessage.textContent = "";
        stockFormMessage.className = "stock-message";
    }

    async function loadStockData() {
        try {
            const [productData, supplierResponse] = await Promise.all([
                supabaseRPC("get_products_for_owner"),
                fetch(
                    `${SUPABASE_URL}/rest/v1/suppliers?select=id,name&order=name.asc`,
                    {
                        headers: {
                            "apikey": SUPABASE_PUBLISHABLE_KEY,
                            "Authorization": `Bearer ${accessToken}`
                        }
                    }
                )
            ]);

            if (!supplierResponse.ok) {
                throw new Error("Supplier request failed.");
            }

            const supplierData = await supplierResponse.json();

            stockProducts = (Array.isArray(productData) ? productData : [])
                .filter(product => product.is_active === true);

            stockSuppliers = Array.isArray(supplierData) ? supplierData : [];

            renderSupplierOptions();

            if (!receiptItems.children.length) {
                if (stockProducts.length) {
                    addReceiptItemRow();
                }
            }

            await loadStockReceipts();
        } catch (error) {
            console.error("Stock data error:", error);
            showStockMessage(t("load_error"), "error");
        }
    }

    function renderSupplierOptions() {
        receiptSupplier.innerHTML =
            `<option value="">${t("select_supplier")}</option>` +
            stockSuppliers.map(supplier =>
                `<option value="${supplier.id}">${escapeHtml(supplier.name || "")}</option>`
            ).join("");
    }

    function addReceiptItemRow(item = {}) {
        if (!stockProducts.length) {
            showStockMessage(t("no_active_products"), "error");
            return;
        }

        const row = document.createElement("div");
        row.className = "receipt-item-row";

        const productOptions = stockProducts.map(product => {
            const selected = product.id === item.product_id ? "selected" : "";
            return `<option value="${product.id}" ${selected}>${escapeHtml(product.name)}</option>`;
        }).join("");

        row.innerHTML = `
            <div class="form-group product-field">
                <label>${t("product")}</label>
                <select class="stock-line-product">
                    <option value="">${t("product")}</option>
                    ${productOptions}
                </select>
            </div>

            <div class="form-group">
                <label>${t("packaging") || "Packaging"}</label>
                <select class="stock-line-packaging">
                    <option value="cotton" ${item.packaging === "cotton" ? "selected" : ""}>Cotton</option>
                    <option value="crates" ${item.packaging === "crates" ? "selected" : ""}>Crates</option>
                </select>
            </div>

            <div class="form-group">
                <label>${t("quantity") || "Quantity"}</label>
                <input class="stock-line-quantity" type="number" min="0.01" step="0.01" value="${item.quantity ?? ""}">
            </div>

            <div class="form-group">
                <label>${t("buying_price") || "Buying Price"}</label>
                <input class="stock-line-cost" type="number" min="0" step="0.01" value="${item.unit_cost ?? ""}">
            </div>

            <div>
                <button type="button" class="remove-line-btn" title="Remove">×</button>
                <div class="line-total-box">TZS 0</div>
            </div>
        `;

        receiptItems.appendChild(row);

        row.querySelector(".stock-line-quantity").addEventListener("input", updateReceiptTotals);
        row.querySelector(".stock-line-cost").addEventListener("input", updateReceiptTotals);
        row.querySelector(".remove-line-btn").addEventListener("click", () => {
            row.remove();
            updateReceiptTotals();

            if (!receiptItems.children.length && stockProducts.length) {
                addReceiptItemRow();
            }
        });

        updateReceiptTotals();
    }

    function updateReceiptTotals() {
        let grandTotal = 0;

        receiptItems.querySelectorAll(".receipt-item-row").forEach(row => {
            const quantity = Number(row.querySelector(".stock-line-quantity").value || 0);
            const cost = Number(row.querySelector(".stock-line-cost").value || 0);
            const lineTotal = quantity * cost;

            grandTotal += lineTotal;

            row.querySelector(".line-total-box").textContent =
                `TZS ${lineTotal.toLocaleString()}`;
        });

        document.getElementById("receiptGrandTotal").textContent =
            `TZS ${grandTotal.toLocaleString()}`;
    }

    function clearReceiptForm() {
        stockReceiptForm.reset();
        receiptItems.innerHTML = "";
        clearStockMessage();

        if (stockProducts.length) {
            addReceiptItemRow();
        }

        document.getElementById("receiptGrandTotal").textContent = "TZS 0";
    }

    function collectReceiptItems() {
        const items = [];

        receiptItems.querySelectorAll(".receipt-item-row").forEach(row => {
            const productId = row.querySelector(".stock-line-product").value;
            const packaging = row.querySelector(".stock-line-packaging").value;
            const quantity = Number(row.querySelector(".stock-line-quantity").value);
            const unitCost = Number(row.querySelector(".stock-line-cost").value);

            if (productId || quantity || unitCost) {
                items.push({
                    product_id: productId,
                    packaging,
                    quantity,
                    unit_cost: unitCost
                });
            }
        });

        return items;
    }

    stockReceiptForm.addEventListener("submit", async event => {
        event.preventDefault();
        clearStockMessage();

        const receiptNumber = document.getElementById("receiptNumber").value.trim();
        const supplierId = receiptSupplier.value;
        const paymentReference = document.getElementById("paymentReference").value.trim();
        const notes = document.getElementById("receiptNotes").value.trim();
        const items = collectReceiptItems();

        if (!receiptNumber || !supplierId || !items.length) {
            showStockMessage(t("load_error"), "error");
            return;
        }

        for (const item of items) {
            if (!item.product_id || !Number.isFinite(item.quantity) || item.quantity <= 0 ||
                !Number.isFinite(item.unit_cost) || item.unit_cost < 0) {
                showStockMessage(t("load_error"), "error");
                return;
            }
        }

        const saveButton = document.getElementById("saveReceiptBtn");
        saveButton.disabled = true;

        try {
            await supabaseRPC("create_stock_receipt", {
                p_invoice_receipt_no: receiptNumber,
                p_supplier_id: supplierId,
                p_payment_reference: paymentReference || null,
                p_notes: notes || null,
                p_items: items
            });

            showStockMessage(t("receipt_saved"), "success");
            stockReceiptForm.reset();
            receiptItems.innerHTML = "";
            addReceiptItemRow();
            updateReceiptTotals();
            await loadStockReceipts();
            switchStockTab("receipts");
        } catch (error) {
            console.error("Stock receipt save error:", error);

            const message = String(error.message || "");
            const friendly = message.toLowerCase().includes("duplicate")
                ? (currentLanguage === "sw"
                    ? "Invoice/Receipt number tayari ipo."
                    : "That Invoice/Receipt number already exists.")
                : message || t("load_error");

            showStockMessage(friendly, "error");
        } finally {
            saveButton.disabled = false;
        }
    });

    async function loadStockReceipts() {
        receiptsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">${t("loading")}</td>
            </tr>
        `;

        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/stock_receipts?select=*&order=created_at.desc`,
                {
                    headers: {
                        "apikey": SUPABASE_PUBLISHABLE_KEY,
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Receipts request failed.");
            }

            stockReceipts = await response.json();

            const counts = {
                pending: 0,
                verified: 0,
                rejected: 0
            };

            stockReceipts.forEach(receipt => {
                if (counts[receipt.verification_status] !== undefined) {
                    counts[receipt.verification_status]++;
                }
            });

            document.getElementById("pendingReceiptCount").textContent = counts.pending;
            document.getElementById("verifiedReceiptCount").textContent = counts.verified;
            document.getElementById("rejectedReceiptCount").textContent = counts.rejected;

            if (!stockReceipts.length) {
                receiptsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-row">${t("no_receipts")}</td>
                    </tr>
                `;
                return;
            }

            const supplierMap = new Map(
                stockSuppliers.map(supplier => [supplier.id, supplier.name])
            );

            receiptsTableBody.innerHTML = stockReceipts.map(receipt => {
                const status = receipt.verification_status || "pending";
                const statusText =
                    status === "verified" ? t("verified_receipts") :
                    status === "rejected" ? t("rejected_receipts") :
                    t("pending_receipts");

                const date = receipt.created_at
                    ? new Date(receipt.created_at).toLocaleString()
                    : "-";

                return `
                    <tr>
                        <td><strong>${escapeHtml(receipt.invoice_receipt_no || "-")}</strong></td>
                        <td>${escapeHtml(supplierMap.get(receipt.supplier_id) || "-")}</td>
                        <td class="price">TZS ${Number(receipt.total_amount || 0).toLocaleString()}</td>
                        <td>
                            <span class="receipt-status ${status}">
                                ${escapeHtml(statusText)}
                            </span>
                        </td>
                        <td>${escapeHtml(date)}</td>
                        <td>
                            <div class="receipt-actions-cell">
                                ${status === "pending" ? `
                                    <button class="small-btn activate" data-receipt-action="verify" data-id="${receipt.id}">
                                        ✓ ${t("verify")}
                                    </button>
                                    <button class="small-btn deactivate" data-receipt-action="reject" data-id="${receipt.id}">
                                        ✕ ${t("reject")}
                                    </button>
                                ` : "—"}
                            </div>
                        </td>
                    </tr>
                `;
            }).join("");

        } catch (error) {
            console.error("Stock receipts loading error:", error);
            receiptsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-row">${t("load_error")}</td>
                </tr>
            `;
        }
    }

    receiptsTableBody.addEventListener("click", async event => {
        const button = event.target.closest("button[data-receipt-action]");
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.receiptAction;

        if (action === "verify") {
            if (!confirm(t("confirm_verify"))) return;

            button.disabled = true;
