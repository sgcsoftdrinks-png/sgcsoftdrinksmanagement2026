/* =========================================================
   SGC SOFT DRINKS MANAGEMENT
   MAIN APPLICATION JAVASCRIPT
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://prqhqogcisjwzcsxyics.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_M1j6cLFnEVGULYaCfssaZg_KkFCLAcQ";


/* =========================================================
   ENDPOINTS
   ========================================================= */

const AUTH_URL =
    `${SUPABASE_URL}/auth/v1`;

const OWNER_SIGNUP_URL = `${SUPABASE_URL}/functions/v1/clever-handler`;


/* =========================================================
   LANGUAGE DICTIONARY
   ========================================================= */

const translations = {

    sw: {

        brandTagline:
            "Driven By Quality, Built On Trust",

        brandDescription:
            "Mfumo wa kisasa wa kusimamia mauzo, stock, wateja, suppliers na taarifa za biashara.",

        featureReports:
            "Ripoti",

        featureStock:
            "Stock",

        featureSales:
            "Mauzo",

        featureFinance:
            "Fedha",

        brandBottom:
            "SGC SOFT DRINKS MANAGEMENT",

        loginLabel:
            "KARIBU",

        loginTitle:
            "Ingia kwenye Mfumo",

        loginSubtitle:
            "Ingia ili kusimamia biashara yako kwa urahisi.",

        email:
            "Email",

        password:
            "Password",

        forgotPassword:
            "Umesahau password?",

        loginButton:
            "Ingia",

        noAccount:
            "Huna akaunti ya Owner?",

        createOwner:
            "Tengeneza Owner Account",

        signupTitle:
            "Tengeneza Owner Account",

        signupSubtitle:
            "Ingiza taarifa zako na Owner Signup Code.",

        fullName:
            "Jina Kamili",

        username:
            "Username",

        confirmPassword:
            "Thibitisha Password",

        ownerCode:
            "Owner Signup Code",

        ownerCodeHint:
            "Code hii ni ya siri na inahitajika kuunda Owner.",

        createOwnerButton:
            "Tengeneza Account",

        alreadyAccount:
            "Tayari una akaunti?",

        loginHere:
            "Ingia hapa",

        forgotTitle:
            "Umesahau Password?",

        forgotSubtitle:
            "Weka email yako na tutakutumia link ya kubadilisha password.",

        sendReset:
            "Tuma Reset Link",

        backLogin:
            "← Rudi kwenye Login",

        resetTitle:
            "Weka Password Mpya",

        resetSubtitle:
            "Weka password mpya ya akaunti yako.",

        newPassword:
            "Password Mpya",

        savePassword:
            "Hifadhi Password",

        copyright:
            "© 2026 SGC SOFT DRINKS MANAGEMENT. Haki zote zimehifadhiwa."
    },


    en: {

        brandTagline:
            "Driven By Quality, Built On Trust",

        brandDescription:
            "A modern system for managing sales, stock, customers, suppliers and business information.",

        featureReports:
            "Reports",

        featureStock:
            "Stock",

        featureSales:
            "Sales",

        featureFinance:
            "Finance",

        brandBottom:
            "SGC SOFT DRINKS MANAGEMENT",

        loginLabel:
            "WELCOME",

        loginTitle:
            "Sign In",

        loginSubtitle:
            "Sign in to manage your business with ease.",

        email:
            "Email",

        password:
            "Password",

        forgotPassword:
            "Forgot password?",

        loginButton:
            "Sign In",

        noAccount:
            "Don't have an Owner account?",

        createOwner:
            "Create Owner Account",

        signupTitle:
            "Create Owner Account",

        signupSubtitle:
            "Enter your details and Owner Signup Code.",

        fullName:
            "Full Name",

        username:
            "Username",

        confirmPassword:
            "Confirm Password",

        ownerCode:
            "Owner Signup Code",

        ownerCodeHint:
            "This secret code is required to create an Owner.",

        createOwnerButton:
            "Create Account",

        alreadyAccount:
            "Already have an account?",

        loginHere:
            "Login here",

        forgotTitle:
            "Forgot Password?",

        forgotSubtitle:
            "Enter your email and we will send you a password reset link.",

        sendReset:
            "Send Reset Link",

        backLogin:
            "← Back to Login",

        resetTitle:
            "Set New Password",

        resetSubtitle:
            "Enter a new password for your account.",

        newPassword:
            "New Password",

        savePassword:
            "Save Password",

        copyright:
            "© 2026 SGC SOFT DRINKS MANAGEMENT. All rights reserved."
    }
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeApp();

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

    setupLanguage();

    setupViewNavigation();

    setupPasswordToggles();

    setupLogin();

    setupOwnerSignup();

    setupForgotPassword();

    setupPasswordReset();

    handleRecoverySession();

}


/* =========================================================
   LANGUAGE
   ========================================================= */

function setupLanguage() {

    const savedLanguage =
        localStorage.getItem("sgc_language") || "sw";

    applyLanguage(savedLanguage);


    document
        .querySelectorAll(".language-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const language =
                        button.dataset.language;

                    applyLanguage(language);

                }
            );

        });
}


function applyLanguage(language) {

    const selected =
        translations[language] || translations.sw;


    document.documentElement.lang =
        language;


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (selected[key]) {

                element.textContent =
                    selected[key];

            }

        });


    document
        .querySelectorAll(".language-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.language === language
            );

        });


    localStorage.setItem(
        "sgc_language",
        language
    );
}


/* =========================================================
   VIEW NAVIGATION
   ========================================================= */

function showView(viewId) {

    document
        .querySelectorAll(".auth-view")
        .forEach(view => {

            view.classList.remove(
                "active-view"
            );

        });


    const target =
        document.getElementById(viewId);

    if (target) {

        target.classList.add(
            "active-view"
        );

    }


    clearAllMessages();
}


function setupViewNavigation() {

    const showSignupButton =
        document.getElementById(
            "showSignupButton"
        );

    const showLoginButton =
        document.getElementById(
            "showLoginButton"
        );

    const forgotButton =
        document.getElementById(
            "forgotPasswordButton"
        );

    const backLoginButton =
        document.getElementById(
            "backToLoginButton"
        );


    showSignupButton.addEventListener(
        "click",
        () => {

            showView("signupView");

        }
    );


    showLoginButton.addEventListener(
        "click",
        () => {

            showView("loginView");

        }
    );


    forgotButton.addEventListener(
        "click",
        () => {

            showView("forgotView");

        }
    );


    backLoginButton.addEventListener(
        "click",
        () => {

            showView("loginView");

        }
    );
}


/* =========================================================
   PASSWORD TOGGLES
   ========================================================= */

function setupPasswordToggles() {

    document
        .querySelectorAll(".eye-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );

                    if (!input) return;


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "🙈";

                    } else {

                        input.type =
                            "password";

                        button.textContent =
                            "👁";

                    }

                }
            );

        });
}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            if (!email || !password) {

                showMessage(
                    "loginMessage",
                    "Tafadhali jaza email na password.",
                    "error"
                );

                return;

            }


            setButtonLoading(
                "loginButton",
                true,
                "Inaingia..."
            );


            try {

                const response =
                    await fetch(
                        `${AUTH_URL}/token?grant_type=password`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_PUBLISHABLE_KEY
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const result =
                    await safeJson(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        translateSupabaseError(
                            result,
                            "Email au password si sahihi."
                        )
                    );

                }


                /*
                 * Save session temporarily.
                 * Later dashboard will consume this session.
                 */

                localStorage.setItem(
                    "sgc_access_token",
                    result.access_token
                );

                localStorage.setItem(
                    "sgc_refresh_token",
                    result.refresh_token
                );

                localStorage.setItem(
                    "sgc_user",
                    JSON.stringify(
                        result.user || {}
                    )
                );


                showMessage(
                    "loginMessage",
                    "Login imefanikiwa. Karibu kwenye SGC SOFT DRINKS MANAGEMENT.",
                    "success"
                );


                /*
                 * Dashboard will be connected here later.
                 */

                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    900
                );


            } catch (error) {

                showMessage(
                    "loginMessage",
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    "loginButton",
                    false
                );

            }

        }
    );
}


/* =========================================================
   OWNER SIGNUP
   ========================================================= */

function setupOwnerSignup() {

    const form =
        document.getElementById(
            "signupForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const fullName =
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "signupEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const ownerCode =
                document
                    .getElementById(
                        "ownerCode"
                    )
                    .value
                    .trim();


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (
                !fullName ||
                !username ||
                !email ||
                !password ||
                !confirmPassword ||
                !ownerCode
            ) {

                showMessage(
                    "signupMessage",
                    "Tafadhali jaza sehemu zote.",
                    "error"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "signupMessage",
                    "Password hazifanani.",
                    "error"
                );

                return;
            }


            if (
                password.length < 8
            ) {

                showMessage(
                    "signupMessage",
                    "Password lazima iwe na angalau characters 8.",
                    "error"
                );

                return;
            }


            if (
                !/^[a-zA-Z0-9._-]{3,30}$/
                    .test(username)
            ) {

                showMessage(
                    "signupMessage",
                    "Username iwe na herufi, namba, dot, underscore au hyphen tu.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                "signupButton",
                true,
                "Inatengeneza..."
            );


            try {

                const response =
                    await fetch(
                        OWNER_SIGNUP_URL,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_PUBLISHABLE_KEY

                            },

                            body: JSON.stringify({

                                full_name:
                                    fullName,

                                username:
                                    username,

                                email:
                                    email,

                                password:
                                    password,

                                owner_code:
                                    ownerCode

                            })
                        }
                    );


                const result =
                    await safeJson(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        translateSupabaseError(
                            result,
                            "Imeshindikana kutengeneza Owner account."
                        )
                    );

                }


                showMessage(
                    "signupMessage",
                    "Akaunti imetengenezwa. Angalia email yako na uthibitishe akaunti kabla ya kuingia.",
                    "success"
                );


                form.reset();


            } catch (error) {

                showMessage(
                    "signupMessage",
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    "signupButton",
                    false
                );

            }

        }
    );
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function setupForgotPassword() {

    const form =
        document.getElementById(
            "forgotForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "forgotEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showMessage(
                    "forgotMessage",
                    "Tafadhali weka email yako.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                "forgotButton",
                true,
                "Inatuma..."
            );


            try {

                /*
                 * IMPORTANT:
                 * Supabase must have your Netlify/site URL
                 * added to Authentication > URL Configuration.
                 */

                const redirectTo =
                    `${window.location.origin}${window.location.pathname}`;


                const response =
                    await fetch(
                        `${AUTH_URL}/recover`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_PUBLISHABLE_KEY

                            },

                            body: JSON.stringify({

                                email,

                                redirect_to:
                                    redirectTo

                            })
                        }
                    );


                const result =
                    await safeJson(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        translateSupabaseError(
                            result,
                            "Imeshindikana kutuma reset link."
                        )
                    );

                }


                showMessage(
                    "forgotMessage",
                    "Reset link imetumwa. Angalia email yako.",
                    "success"
                );


                form.reset();


            } catch (error) {

                showMessage(
                    "forgotMessage",
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    "forgotButton",
                    false
                );

            }

        }
    );
}


/* =========================================================
   PASSWORD RESET
   ========================================================= */

let recoveryAccessToken = null;


function handleRecoverySession() {

    /*
     * Supabase recovery links can return tokens
     * in the URL hash.
     */

    const hash =
        window.location.hash;


    if (!hash) return;


    const params =
        new URLSearchParams(
            hash.substring(1)
        );


    const type =
        params.get("type");


    const accessToken =
        params.get(
            "access_token"
        );


    if (
        type === "recovery" &&
        accessToken
    ) {

        recoveryAccessToken =
            accessToken;


        showView(
            "resetView"
        );

    }
}


/* =========================================================
   UPDATE PASSWORD
   ========================================================= */

function setupPasswordReset() {

    const form =
        document.getElementById(
            "resetForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!recoveryAccessToken) {

                showMessage(
                    "resetMessage",
                    "Reset session haipo. Tafadhali omba reset link mpya.",
                    "error"
                );

                return;
            }


            const password =
                document
                    .getElementById(
                        "newPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmNewPassword"
                    )
                    .value;


            if (
                password.length < 8
            ) {

                showMessage(
                    "resetMessage",
                    "Password lazima iwe na angalau characters 8.",
                    "error"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "resetMessage",
                    "Password hazifanani.",
                    "error"
                );

                return;
            }


            setButtonLoading(
                "resetButton",
                true,
                "Inahifadhi..."
            );


            try {

                const response =
                    await fetch(
                        `${AUTH_URL}/user`,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "apikey":
                                    SUPABASE_PUBLISHABLE_KEY,

                                "Authorization":
                                    `Bearer ${recoveryAccessToken}`

                            },

                            body: JSON.stringify({
                                password
                            })
                        }
                    );


                const result =
                    await safeJson(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        translateSupabaseError(
                            result,
                            "Imeshindikana kubadilisha password."
                        )
                    );

                }


                showMessage(
                    "resetMessage",
                    "Password imebadilishwa. Sasa unaweza kuingia.",
                    "success"
                );


                form.reset();


                setTimeout(
                    () => {

                        window.history.replaceState(
                            {},
                            document.title,
                            window.location.pathname
                        );

                        recoveryAccessToken =
                            null;

                        showView(
                            "loginView"
                        );

                    },
                    1200
                );


            } catch (error) {

                showMessage(
                    "resetMessage",
                    error.message,
                    "error"
                );

            } finally {

                setButtonLoading(
                    "resetButton",
                    false
                );

            }

        }
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

async function safeJson(response) {

    try {

        return await response.json();

    } catch {

        return {};

    }
}


function showMessage(
    elementId,
    message,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) return;


    element.hidden = false;

    element.textContent =
        message;

    element.className =
        `message ${type}`;
}


function clearAllMessages() {

    document
        .querySelectorAll(".message")
        .forEach(message => {

            message.hidden = true;

            message.textContent = "";

            message.className =
                "message";

        });
}


function setButtonLoading(
    buttonId,
    loading,
    text = ""
) {

    const button =
        document.getElementById(
            buttonId
        );


    if (!button) return;


    if (loading) {

        button.disabled = true;

        button.dataset.originalText =
            button.innerHTML;

        button.innerHTML =
            `<span>${text}</span>`;

    } else {

        button.disabled = false;

        if (
            button.dataset.originalText
        ) {

            button.innerHTML =
                button.dataset.originalText;

        }

    }
}


/* =========================================================
   SUPABASE ERROR TRANSLATION
   ========================================================= */

function translateSupabaseError(
    result,
    fallback
) {

    const raw =
        String(
            result?.message ||
            result?.error_description ||
            result?.error ||
            ""
        );


    const lower =
        raw.toLowerCase();


    if (
        lower.includes(
            "invalid login credentials"
        )
    ) {

        return "Email au password si sahihi.";

    }


    if (
        lower.includes(
            "email not confirmed"
        )
    ) {

        return "Tafadhali thibitisha email yako kwanza.";

    }


    if (
        lower.includes(
            "user already registered"
        )
    ) {

        return "Email hii tayari imesajiliwa.";

    }


    if (
        lower.includes(
            "username already exists"
        )
    ) {

        return "Username hii tayari inatumika.";

    }


    if (
        lower.includes(
            "invalid owner signup code"
        )
    ) {

        return "Owner Signup Code si sahihi.";

    }


    if (
        lower.includes(
            "password"
        ) &&
        lower.includes(
            "weak"
        )
    ) {

        return "Password ni dhaifu. Tumia password yenye nguvu.";

    }


    if (raw) {

        return raw;

    }


    return fallback;
}
