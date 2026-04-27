
(function () {
  "use strict";

  const EMAILJS_SERVICE_ID  = "service_wg68jbu";
  const EMAILJS_TEMPLATE_ID = "template_3zcqec9";
  const EMAILJS_PUBLIC_KEY  = "BptJ9xxzyF5SdCKDw";

  const form    = document.getElementById("contact-form");
  const success = document.getElementById("form-success");

  if (!form) return;

  emailjs.init(EMAILJS_PUBLIC_KEY);

  const subjectMap = {
    order:    "Dat hang / Mua si",
    product:  "Tu van san pham",
    shipping: "Van chuyen & Giao hang",
    partner:  "Hop tac kinh doanh",
    other:    "Khac",
  };

  const validators = {
    name:    (v) => v.trim().length >= 2,
    phone:   (v) => /^[0-9\s+\-]{9,15}$/.test(v.trim()),
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function validateField(field) {
    const group = document.getElementById("group-" + field.name);
    if (!group || !validators[field.name]) return true;
    const valid = validators[field.name](field.value);
    group.classList.toggle("error", !valid);
    return valid;
  }

  ["name", "phone", "email", "message"].forEach(function (name) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-group")?.classList.contains("error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;
    ["name", "phone", "email", "message"].forEach(function (name) {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && !validateField(field)) isValid = false;
    });
    if (!isValid) return;

    const btn = form.querySelector(".form-submit");
    btn.disabled = true;
    btn.textContent = "Dang gui...";

    const subjectVal = form.querySelector("[name=subject]")?.value || "other";

    const templateParams = {
      from_name:  form.querySelector("[name=name]").value.trim(),
      phone:      form.querySelector("[name=phone]").value.trim(),
      from_email: form.querySelector("[name=email]").value.trim(),
      subject:    subjectMap[subjectVal] || subjectVal,
      message:    form.querySelector("[name=message]").value.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.removeAttribute("aria-hidden");
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      btn.disabled = false;
      btn.textContent = "Gui Tin Nhan";
      alert("Gui that bai, vui long thu lai hoac lien he truc tiep qua hotline.");
    }
  });
})();
