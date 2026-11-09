(() => {
  const WA_NUMBER = "2348106105523"; // 0810 610 5523 in international format
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ---------- WhatsApp links ---------- */
  const generic = "Hello Dave Surprises! 🎁 I'd like to place an order.";
  const links = {
    heroWa: generic,
    contactWa: generic,
    ctaWa: generic,
    fabWa: generic,
    deliveryWa: "Hello Dave Surprises! Do you deliver to my location? I'm in: "
  };
  Object.entries(links).forEach(([id, msg]) => {
    const el = document.getElementById(id);
    if (el) el.href = waLink(msg);
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("navLinks");
  const closeMenu = () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 90}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => co.observe(c));
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Order form -> WhatsApp ---------- */
  const form = document.getElementById("orderForm");
  const errorBox = document.getElementById("formError");
  const dateInput = document.getElementById("dateInput");

  // Don't allow past dates
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().split("T")[0];

  const formatBudget = (v) => {
    const digits = v.replace(/[^\d]/g, "");
    return digits ? Number(digits).toLocaleString("en-NG") : "";
  };
  form.budget.addEventListener("input", (e) => {
    e.target.value = formatBudget(e.target.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    const required = form.querySelectorAll("[required]");
    let firstBad = null;
    required.forEach((el) => {
      if (!el.value.trim()) {
        el.classList.add("invalid");
        firstBad = firstBad || el;
      }
    });
    if (firstBad) {
      errorBox.textContent = "Please fill in the highlighted fields.";
      errorBox.hidden = false;
      firstBad.focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form).entries());
    const niceDate = new Date(d.date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    const msg = [
      "🎁 *NEW ORDER: Dave Surprises*",
      "",
      `*From:* ${d.name} (${d.phone})`,
      `*Receiver:* ${d.receiver} (${d.receiverPhone})`,
      `*Address:* ${d.address}`,
      `*Occasion:* ${d.occasion}`,
      `*Budget:* ${d.budget ? "₦" + d.budget : "Not specified"}`,
      `*Delivery:* ${niceDate}, ${d.time}`,
      `*Notes:* ${d.message || "None"}`,
      "",
      "Sent from the website order form."
    ].join("\n");

    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
