document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const status = document.getElementById("contactStatus");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.textContent;
  const service = contactForm.dataset.service;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name").trim();
    // Unique per-sender subjects keep separate inquiries from collapsing into one inbox thread.
    data.set("subject", `${service} inquiry — ${name}`);

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      contactForm.hidden = true;
      status.classList.add("is-success");
      status.textContent = `Thanks, ${name} — we've got your message and will be in touch soon.`;
      status.focus();
    } catch {
      const link = document.createElement("a");
      link.href = `mailto:hello@bacondigitallabs.com?subject=${encodeURIComponent(`${service} inquiry`)}`;
      link.textContent = "hello@bacondigitallabs.com";
      status.classList.add("is-error");
      status.append("Something went wrong sending your request. Please try again, or email ", link, ".");
      submitButton.disabled = false;
      submitButton.textContent = submitLabel;
    }
  });
}
