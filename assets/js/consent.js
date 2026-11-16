(() => {
  const KEY = "ortlif_consent_v1";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } };
  const saved = read();
  window.ORTLIF_CONSENT = saved || {necessary:true, analytics:false, marketing:false};
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  });
  if (saved) {
    window.gtag("consent", "update", {
      analytics_storage: saved.analytics ? "granted" : "denied",
      ad_storage: saved.marketing ? "granted" : "denied",
      ad_user_data: saved.marketing ? "granted" : "denied",
      ad_personalization: saved.marketing ? "granted" : "denied"
    });
  }
  const banner = document.createElement("section");
  banner.className = "cookie-banner"; banner.setAttribute("role","dialog"); banner.setAttribute("aria-label","Preferências de cookies");
  banner.innerHTML = '<h2>Privacidade e cookies</h2><p>Usamos cookies essenciais para o funcionamento do site. Com sua autorização, também poderemos usar tecnologias analíticas e de marketing para entender o uso do site e mensurar campanhas. Você pode aceitar, rejeitar ou escolher suas preferências.</p><div class="cookie-actions"><button class="accept" data-choice="all">Aceitar todos</button><button class="reject" data-choice="necessary">Somente necessários</button><button data-choice="custom">Personalizar</button></div><div class="cookie-note">Consulte nossa <a href="/privacidade/">Política de Privacidade</a> e <a href="/cookies/">Política de Cookies</a>.</div>';
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(banner);
    if (!saved) banner.classList.add("is-visible");
    banner.addEventListener("click", (e) => {
      const btn=e.target.closest("button[data-choice]"); if(!btn) return;
      let choice=btn.dataset.choice; let consent;
      if(choice==="all") consent={necessary:true,analytics:true,marketing:true};
      else if(choice==="custom"){ const analytics=window.confirm("Autoriza cookies analíticos para medição de audiência?"); const marketing=window.confirm("Autoriza cookies de marketing e publicidade?"); consent={necessary:true,analytics,marketing}; }
      else consent={necessary:true,analytics:false,marketing:false};
      localStorage.setItem(KEY,JSON.stringify(consent)); window.ORTLIF_CONSENT=consent;
      window.gtag("consent", "update", {analytics_storage:consent.analytics?"granted":"denied",ad_storage:consent.marketing?"granted":"denied",ad_user_data:consent.marketing?"granted":"denied",ad_personalization:consent.marketing?"granted":"denied"});
      if (window.__ortlifGtmReady === true) {
        window.dataLayer.push({
          event: "ortlif_consent_update"
        });
      }

      banner.classList.remove("is-visible");

      window.dispatchEvent(
        new CustomEvent("ortlif:consent-updated", {
          detail: consent
        })
      );
    });
  });
})();
