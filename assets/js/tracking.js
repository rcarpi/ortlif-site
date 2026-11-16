
(() => {
  const cfg = window.ORTLIF_CONFIG || {};

  const consent = () =>
    window.ORTLIF_CONSENT || {
      analytics: false,
      marketing: false
    };

  const loadGTM = () => {
    if (!cfg.gtmId || window.__ortlifGtmLoaded) return;

    window.__ortlifGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js"
    });

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtm.js?id=" +
      encodeURIComponent(cfg.gtmId);

    script.id = "ortlif-gtm";
    document.head.appendChild(script);
  };

  const activate = () => {
    const c = consent();

    if (c.analytics || c.marketing) {
      loadGTM();
    }
  };

  const push = (name, params = {}) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: name,
      ...params
    });
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-track]");
    if (!a) return;

    const kind = a.dataset.track;

    push(
      kind === "whatsapp" ? "click_whatsapp" : "click_email",
      {
        contact_method: kind,
        link_url: a.href,
        link_text: (a.innerText || "").trim()
      }
    );
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href^='/servicos/']").forEach((a) => {
      a.addEventListener("click", () => {
        push("select_service", {
          service_url: a.href
        });
      });
    });
  });

  window.addEventListener("ortlif:consent-updated", activate);

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
