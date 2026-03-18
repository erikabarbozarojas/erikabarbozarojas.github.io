// Cookie Consent for GDPR - Supports NL, ES, EN
const cookieConsent = {
    translations: {
        nl: {
            message: "Wij gebruiken cookies om uw ervaring te verbeteren en voor analytische doeleinden. Door verder te gaan, stemt u in met ons cookiebeleid.",
            accept: "Accepteren",
            decline: "Weigeren",
            settings: "Instellingen"
        },
        es: {
            message: "Utilizamos cookies para mejorar su experiencia y con fines analíticos. Al continuar, acepta nuestra política de cookies.",
            accept: "Aceptar",
            decline: "Rechazar",
            settings: "Configuración"
        },
        en: {
            message: "We use cookies to improve your experience and for analytical purposes. By continuing, you agree to our cookie policy.",
            accept: "Accept",
            decline: "Decline",
            settings: "Settings"
        }
    },

    init: function(lang = 'nl') {
        const consent = localStorage.getItem('cookieConsent');
        
        if (consent === null) {
            this.showBanner(lang);
        } else if (consent === 'accepted') {
            this.enableAnalytics();
        }
    },

    showBanner: function(lang) {
        const texts = this.translations[lang] || this.translations.nl;
        
        const banner = document.createElement('div');
        banner.id = 'cookieConsent';
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.95); color: #fff; padding: 20px; z-index: 99999; box-shadow: 0 -2px 10px rgba(0,0,0,0.3); font-family: Arial, sans-serif;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                    <p style="margin: 0; flex: 1; min-width: 300px; font-size: 14px; line-height: 1.5;">
                        ${texts.message}
                    </p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button onclick="cookieConsent.acceptCookies()" style="background: #10b981; color: white; border: none; padding: 10px 24px; border-radius: 5px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.3s;">
                            ${texts.accept}
                        </button>
                        <button onclick="cookieConsent.declineCookies()" style="background: transparent; color: white; border: 2px solid white; padding: 10px 24px; border-radius: 5px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s;">
                            ${texts.decline}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    },

    acceptCookies: function() {
        localStorage.setItem('cookieConsent', 'accepted');
        this.enableAnalytics();
        this.removeBanner();
    },

    declineCookies: function() {
        localStorage.setItem('cookieConsent', 'declined');
        this.disableAnalytics();
        this.removeBanner();
    },

    enableAnalytics: function() {
        // Grant consent to Google Analytics
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
    },

    disableAnalytics: function() {
        // Deny consent to Google Analytics
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
        
        // Delete Google Analytics cookies
        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
    },

    deleteCookie: function(name) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname;
        document.cookie = name + '=; Max-Age=0; path=/;';
    },

    removeBanner: function() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transition = 'opacity 0.3s';
            setTimeout(() => banner.remove(), 300);
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        const lang = document.documentElement.lang || 'nl';
        cookieConsent.init(lang);
    });
} else {
    const lang = document.documentElement.lang || 'nl';
    cookieConsent.init(lang);
}
