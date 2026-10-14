const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrpeajqq";

const retriedPictures = new WeakSet();
function handleImageError(image) {
  console.error("Image load failed:", image.currentSrc || image.src);
  const picture = image.closest("picture");
  if (picture && !retriedPictures.has(image) && image.currentSrc !== image.src) {
    retriedPictures.add(image);
    picture.querySelectorAll("source").forEach((source) => source.removeAttribute("srcset"));
    image.src = image.src;
  }
}
document.addEventListener("error", (event) => {
  if (event.target instanceof HTMLImageElement) handleImageError(event.target);
}, true);
document.querySelectorAll("img[src]").forEach((image) => {
  if (image.complete && image.naturalWidth === 0) handleImageError(image);
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle && navigation) {
  function closeNavigation() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح قائمة التنقل");
    navigation.classList.remove("is-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "فتح قائمة التنقل" : "إغلاق قائمة التنقل");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a") && navigation.classList.contains("is-open")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeNavigation();
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("is-open") &&
      event.target instanceof Node &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeNavigation();
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop instanceof HTMLAnchorElement) {
  const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}

if ("IntersectionObserver" in window) {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    document.documentElement.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const portfolioGallery = document.querySelector(".portfolio-gallery");
if (portfolioGallery) {
  const image = portfolioGallery.querySelector(".portfolio-gallery-image");
  const caption = portfolioGallery.querySelector(".portfolio-gallery-caption");
  const dots = portfolioGallery.querySelector(".portfolio-gallery-dots");
  const previous = portfolioGallery.querySelector(".portfolio-gallery-previous");
  const next = portfolioGallery.querySelector(".portfolio-gallery-next");
  const source = portfolioGallery.querySelector("source");
  const works = [
    { src: "assets/images/project-work-01.png", alt: "منطقة علاج وتأهيل مجهزة بأدوات التمارين والتعليق الحركي", caption: "تجهيز منطقة العلاج والتأهيل" },
    { src: "assets/images/project-work-02.png", alt: "غرفة تأهيل نهاري بأرضية ملونة وأجهزة تمارين وأنشطة حركية", caption: "مساحة الرعاية والتأهيل النهاري" },
    { src: "assets/images/project-work-03.png", alt: "مركز علاج طبيعي مجهز بأجهزة التمارين ومسارات التدريب على المشي", caption: "تجهيز مركز العلاج الطبيعي" },
    { src: "assets/images/project-work-04.png", alt: "قاعة علاج وتأهيل واسعة مجهزة بأجهزة تمارين ومعدات إعادة التأهيل", caption: "قاعة متكاملة للعلاج والتأهيل" },
    { src: "assets/images/project-work-05.png", alt: "مركز علاج طبيعي واسع مجهز بأجهزة تمارين وطاولات علاجية وحصائر", caption: "تجهيز مركز علاج طبيعي" },
    { src: "assets/images/project-work-06.png", alt: "غرفة علاج طبيعي تضم طاولة علاج زرقاء وأجهزة ومستلزمات التأهيل", caption: "غرفة العلاج الطبيعي" },
    { src: "assets/images/project-work-07.png", alt: "مسارات تدريب على المشي وسلالم تأهيل خشبية داخل مركز علاجي", caption: "تجهيز مسارات التأهيل الحركي" }
  ];
  let activeWork = 0;
  let requestedWork = 0;
  let requestId = 0;

  if (
    !(image instanceof HTMLImageElement) ||
    !(caption instanceof HTMLElement) ||
    !(dots instanceof HTMLElement) ||
    !(previous instanceof HTMLButtonElement) ||
    !(next instanceof HTMLButtonElement)
  ) {
    throw new Error("معرض الأعمال غير مكتمل؛ تعذر تفعيل أزرار التنقل.");
  }

  function updateDots() {
    [...dots.children].forEach((dot, dotIndex) => {
      dot.setAttribute("aria-pressed", String(dotIndex === activeWork));
    });
  }

  async function showWork(index) {
    requestedWork = (index + works.length) % works.length;
    const targetIndex = requestedWork;
    const current = works[targetIndex];
    const id = ++requestId;
    portfolioGallery.setAttribute("aria-busy", "true");
    caption.textContent = "جارٍ تحميل صورة العمل…";
    const pending = new Image();
    pending.decoding = "async";
    pending.src = current.src.replace(/\.png$/, ".webp");
    try {
      try {
        await pending.decode();
      } catch (error) {
        if (id !== requestId) return;
        console.error("Gallery WebP load failed; trying original:", pending.src, error);
        pending.src = current.src;
        await pending.decode();
      }
      if (id !== requestId) return;
      image.loading = "eager";
      if (source instanceof HTMLSourceElement) {
        if (pending.src.endsWith(".webp")) source.srcset = pending.src;
        else source.removeAttribute("srcset");
      }
      image.src = current.src;
      image.alt = current.alt;
      activeWork = targetIndex;
      caption.textContent = current.caption;
      updateDots();
    } catch (error) {
      if (id !== requestId) return;
      console.error("Gallery image load failed:", current.src, error);
      requestedWork = activeWork;
      caption.textContent = "تعذر تحميل الصورة المطلوبة. الصورة السابقة باقية؛ حاول التنقل مرة أخرى.";
    } finally {
      if (id === requestId) portfolioGallery.removeAttribute("aria-busy");
    }
  }

  works.forEach((work, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "portfolio-gallery-dot";
    dot.setAttribute("aria-label", `عرض صورة العمل: ${work.caption}`);
    dot.setAttribute("aria-pressed", String(index === activeWork));
    dot.addEventListener("click", () => showWork(index));
    dots.append(dot);
  });

  previous.addEventListener("click", () => showWork(requestedWork - 1));
  next.addEventListener("click", () => showWork(requestedWork + 1));
  portfolioGallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showWork(requestedWork + 1);
    if (event.key === "ArrowRight") showWork(requestedWork - 1);
  });
}

const productGallery = document.querySelector("#product-gallery");
const galleryImage = document.querySelector("#product-gallery-image");
const galleryStatus = document.querySelector("#gallery-status");

if (
  productGallery instanceof HTMLDialogElement &&
  galleryImage instanceof HTMLImageElement &&
  galleryStatus instanceof HTMLElement
) {
  const galleries = {
    "btl-combo": [
      {
        src: "assets/images/btl-combo-product.png",
        alt: "جهاز BTL وملحقاته للعلاج الكهربائي والموجات فوق الصوتية"
      },
      {
        src: "assets/images/btl-combo-product-detail.jpg",
        alt: "جهاز BTL مع رأس الموجات فوق الصوتية والأقطاب والملحقات"
      }
    ],
    "knee-hip-rehab": [
      {
        src: "assets/images/knee-hip-rehab-product.png",
        alt: "جهاز إعادة تأهيل الركبة والورك"
      },
      {
        src: "assets/images/knee-hip-rehab-product-detail.jpg",
        alt: "منظر قريب لجهاز إعادة تأهيل الركبة والورك"
      },
      {
        src: "assets/images/knee-hip-rehab-product-side.jpg",
        alt: "استخدام جهاز إعادة تأهيل الركبة والورك لدعم الساق"
      }
    ]
  };
  const previousButton = productGallery.querySelector(".gallery-previous");
  const nextButton = productGallery.querySelector(".gallery-next");
  const closeButton = productGallery.querySelector(".gallery-close");
  const galleryStage = productGallery.querySelector(".gallery-stage");
  let activeGallery = [];
  let activeImageIndex = 0;
  let galleryOpener = null;
  let pointerStart = null;

  function updateGalleryImage() {
    const image = activeGallery[activeImageIndex];
    galleryImage.src = image.src;
    galleryImage.alt = image.alt;
    galleryStatus.textContent = `الصورة ${activeImageIndex + 1} من ${activeGallery.length}`;
  }

  function moveGallery(direction) {
    activeImageIndex = (activeImageIndex + direction + activeGallery.length) % activeGallery.length;
    updateGalleryImage();
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest("[data-gallery]");
    if (!trigger) return;

    const gallery = galleries[trigger.getAttribute("data-gallery")];
    if (!gallery) return;

    galleryOpener = trigger;
    activeGallery = gallery;
    activeImageIndex = 0;
    updateGalleryImage();
    productGallery.showModal();
    closeButton.focus();
  });

  previousButton.addEventListener("click", () => moveGallery(-1));
  nextButton.addEventListener("click", () => moveGallery(1));
  closeButton.addEventListener("click", () => productGallery.close());

  productGallery.addEventListener("click", (event) => {
    if (event.target !== productGallery) return;
    const bounds = productGallery.getBoundingClientRect();
    const outsideDialog =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outsideDialog) productGallery.close();
  });

  productGallery.addEventListener("close", () => {
    galleryOpener?.focus();
    galleryOpener = null;
  });

  document.addEventListener("keydown", (event) => {
    if (!productGallery.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      productGallery.close();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveGallery(1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveGallery(-1);
    }
  });

  galleryStage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      pointerStart = { x: event.clientX, y: event.clientY };
    }
  });

  galleryStage.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const distanceX = event.clientX - pointerStart.x;
    const distanceY = event.clientY - pointerStart.y;
    if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
      moveGallery(distanceX < 0 ? 1 : -1);
    }
    pointerStart = null;
  });

  galleryStage.addEventListener("pointercancel", () => {
    pointerStart = null;
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const form = document.querySelector("#quote-form");

if (form instanceof HTMLFormElement) {
  const status = document.querySelector("#form-status");
  const submitButton = document.querySelector("#submit-button");
  const fields = [
    { input: form.elements.namedItem("name"), error: document.querySelector("#name-error"), message: "يرجى إدخال الاسم الكامل." },
    { input: form.elements.namedItem("phone"), error: document.querySelector("#phone-error") },
    { input: form.elements.namedItem("email"), error: document.querySelector("#email-error") },
    { input: form.elements.namedItem("region"), error: document.querySelector("#region-error"), message: "يرجى اختيار المنطقة." },
    { input: form.elements.namedItem("details"), error: document.querySelector("#details-error") }
  ];

  function validateField(field) {
    const { input, error } = field;
    let message = "";

    if (input.name === "name" && !input.value.trim()) {
      message = field.message;
    } else if (input.name === "phone") {
      const phone = input.value
        .replace(/[٠-٩۰-۹]/g, (digit) => {
          const zeroCode = digit.charCodeAt(0) >= 0x06f0 ? 0x06f0 : 0x0660;
          return String(digit.charCodeAt(0) - zeroCode);
        })
        .replace(/[\s()-]/g, "");
      if (!phone) {
        message = "يرجى إدخال رقم الهاتف.";
      } else if (!/^(?:(?:\+|00)?966|0)?5\d{8}$/.test(phone)) {
        message = "أدخل رقم جوال سعوديًا صحيحًا، مثل 05xxxxxxxx أو +9665xxxxxxxx.";
      }
    } else if (input.name === "email") {
      if (!input.value.trim()) {
        message = "يرجى إدخال البريد الإلكتروني.";
      } else if (!input.validity.valid) {
        message = "يرجى إدخال بريد إلكتروني صحيح.";
      }
    } else if (input.name === "region" && !input.value) {
      message = field.message;
    } else if (input.name === "details") {
      if (!input.value.trim()) {
        message = "يرجى كتابة تفاصيل الطلب.";
      } else if (input.value.trim().length < 10) {
        message = "يرجى كتابة تفاصيل أكثر (10 أحرف على الأقل).";
      }
    } else if (input.required && !input.value) {
      message = field.message;
    }

    error.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.getAttribute("aria-invalid") === "true") validateField(field);
    });
    field.input.addEventListener("change", () => validateField(field));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.removeAttribute("data-state");

    const invalidField = fields.find((field) => !validateField(field));
    if (invalidField) {
      status.textContent = "تحقق من الحقول المشار إليها ثم أعد المحاولة.";
      status.dataset.state = "error";
      invalidField.input.focus();
      return;
    }

    const honeypot = form.elements.namedItem("_gotcha");
    if (honeypot.value) {
      status.textContent = "تعذر التحقق من الطلب. يرجى المحاولة مرة أخرى.";
      status.dataset.state = "error";
      return;
    }

    if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(FORMSPREE_ENDPOINT)) {
      status.textContent = "نموذج الطلب جاهز، لكن خدمة الإرسال لم تُعَدّ بعد. يُرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني.";
      status.dataset.state = "error";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "جارٍ إرسال طلبك…";

    try {
      const payload = new FormData(form);
      payload.set("_subject", "طلب عرض سعر جديد من موقع مدماك فيجن");
      payload.set("_replyto", form.elements.namedItem("email").value.trim());

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      });
      const result = await response.json();

      if (!response.ok || result.ok !== true) {
        const reasons = Array.isArray(result.errors)
          ? result.errors.map((entry) => entry.message).filter(Boolean).join(" ")
          : "";
        throw new Error(reasons || `تعذر تأكيد استلام الطلب (HTTP ${response.status}).`);
      }

      form.reset();
      fields.forEach(({ input, error }) => {
        input.removeAttribute("aria-invalid");
        error.textContent = "";
      });
      status.textContent = "شكرًا لك، تم استلام طلبك بنجاح. سيتواصل معك فريقنا.";
      status.dataset.state = "success";
    } catch (error) {
      console.error("Quote request submission failed:", error);
      status.textContent = "لم نتمكن من إرسال الطلب الآن. حاول مرة أخرى، أو تواصل معنا مباشرة عبر الهاتف أو البريد الإلكتروني.";
      status.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'إرسال طلب عرض السعر <svg class="link-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';
    }
  });
}
