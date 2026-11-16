(() => {
  const cfg = window.ORTLIF_CONFIG || {};

  const getConsent = () =>
    window.ORTLIF_CONSENT || {
      necessary: true,
      analytics: false,
      marketing: false
    };
    
  window.__ortlifGtmLoading = window.__ortlifGtmLoading || false;
  window.__ortlifGtmReady = window.__ortlifGtmReady || false;

  const loadGTM = () => {
    if (
      !cfg.gtmId ||
      window.__ortlifGtmLoading ||
      window.__ortlifGtmReady
    ) {
      return;
    }

    window.__ortlifGtmLoading = true;
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js"
    });

    const script = document.createElement("script");

    script.async = true;
    script.id = "ortlif-gtm";
    script.src =
      "https://www.googletagmanager.com/gtm.js?id=" +
      encodeURIComponent(cfg.gtmId);

    script.onload = () => {
      window.__ortlifGtmLoading = false;
      window.__ortlifGtmReady = true;
    };

    script.onerror = () => {
      window.__ortlifGtmLoading = false;
      console.error("Não foi possível carregar o Google Tag Manager.");
    };

    document.head.appendChild(script);
  };
  
  const activate = () => {
    const c = getConsent();

    if (c.analytics || c.marketing) {
      loadGTM();
    }
  };

  const push = (name, params = {}) => {
    const c = getConsent();

    if (!c.analytics && !c.marketing) {
      return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: name,
      ...params
    });
  };

  document.addEventListener("click", (e) => {
    const target = e.target;

    if (!(target instanceof Element)) return;

    const a = target.closest("a[data-track]");
    if (!a) return;

    const kind = a.dataset.track;

    if (kind !== "whatsapp" && kind !== "email") return;

    push(
      kind === "whatsapp" ? "click_whatsapp" : "click_email",
      {
        contact_method: kind,
        link_url: a.href,
        link_text: (a.innerText || "").trim()
      }
    );
  });

  document.addEventListener("click", (e) => {
    const target = e.target;

    if (!(target instanceof Element)) return;

    const a = target.closest("a[href]");
    if (!a) return;

    const url = new URL(a.href, window.location.origin);

    if (!url.pathname.startsWith("/servicos/")) return;

    push("select_service", {
      service_url: url.href
    });
  });

  window.addEventListener("ortlif:consent-updated", () => {
    activate();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate, {
      once: true
    });
  } else {
    activate();
  }

  window.ORTLIF_TRACK = {
    event: push
  };
})();