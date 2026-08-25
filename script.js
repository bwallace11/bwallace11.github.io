const desktopIcons = [...document.querySelectorAll(".desktop-icon")];
const windowLayer = document.getElementById("window-layer");
const taskbarWindows = document.getElementById("taskbar-windows");
const mobileCards = document.getElementById("mobile-cards");
const clockElement = document.getElementById("clock");
const contactTab = document.getElementById("contact-tab");
const contactPanel = document.getElementById("contact-panel");
const contactPanelClose = document.getElementById("contact-panel-close");

const portfolioAppOrder = [
  "about",
  "resume",
  "web-design",
  "ux-design",
  "logo-design",
  "other-projects",
  "contact",
];

const folderImageNames = ["cover", "01", "02", "03", "04"];
const folderImageExtensions = ["jpg", "png", "webp"];

function folderImages(folder, existingImages = []) {
  const conventionalImages = folderImageNames.flatMap((name) =>
    folderImageExtensions.map((extension) => `${folder}/${name}.${extension}`)
  );

  return [...existingImages, ...conventionalImages];
}

function createProjectContent({
  title,
  summary = "",
  image,
  images = [],
  details = [],
  body = "",
  link = "",
  linkLabel = "Open Project",
}) {
  const mediaItems = [...new Set([image, ...images].filter(Boolean))];
  const snapshotMarkup =
    mediaItems.length > 1
      ? `
        <figure class="project-snapshot project-carousel" data-carousel aria-label="${title} image carousel">
          <div class="carousel-stage">
            ${mediaItems
              .map(
                (src, index) =>
                  `<img class="carousel-slide ${index === 0 ? "active" : ""}" src="${src}" alt="${title} preview ${index + 1}" data-carousel-slide data-carousel-slide-index="${index}" />`
              )
              .join("")}
            <span class="project-snapshot-fallback" hidden>${title}</span>
          </div>
          <button class="carousel-btn carousel-prev" type="button" data-carousel-prev aria-label="Previous image">&lt;</button>
          <button class="carousel-btn carousel-next" type="button" data-carousel-next aria-label="Next image">&gt;</button>
          <div class="carousel-dots" aria-hidden="true">
            ${mediaItems.map((_, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-carousel-dot="${index}"></button>`).join("")}
          </div>
        </figure>
      `
      : mediaItems.length === 1
        ? `<figure class="project-snapshot"><img src="${mediaItems[0]}" alt="${title} preview" data-project-image /><span class="project-snapshot-fallback" hidden>${title}</span></figure>`
        : `<div class="project-snapshot project-snapshot-empty"><span>${title}</span></div>`;
  const detailMarkup = details.length
    ? `<ul class="entry-list">${details.map((detail) => `<li>${detail}</li>`).join("")}</ul>`
    : "";
  const summaryMarkup = summary ? `<p>${summary}</p>` : "";
  const externalAttributes = /^https?:\/\//i.test(link) ? ' target="_blank" rel="noreferrer"' : "";
  const linkMarkup = link
    ? `<p><a class="content-link" href="${link}"${externalAttributes}>${linkLabel}</a></p>`
    : "";

  return `
    <article class="content-block portfolio-entry">
      ${snapshotMarkup}
      <div class="portfolio-info">
        ${summaryMarkup}
        ${body}
        ${detailMarkup}
        ${linkMarkup}
      </div>
    </article>
  `;
}

function createPetContent(pets) {
  return `
    <article class="content-block pet-slider" data-pet-slider>
      <blockquote class="pet-slider-intro">
        <p>The unofficial Late Night Studio staff. Their responsibilities mostly include supervising, interrupting work, and appearing exactly when I&rsquo;m trying to concentrate.</p>
      </blockquote>
      <div class="pet-slider-stage">
        ${pets
          .map(
            (pet, index) => `
              <section class="pet-slide ${index === 0 ? "active" : ""}" data-pet-slide="${index}" ${index === 0 ? "" : "hidden"}>
                <figure class="project-snapshot pet-snapshot">
                  <img src="${pet.image}" alt="${pet.name} portrait" data-project-image />
                  <span class="project-snapshot-fallback" hidden>${pet.name}</span>
                </figure>
                <div class="portfolio-info pet-slide-info">
                  <section class="pet-card">
                    <h3>${pet.name}</h3>
                    <p class="pet-meta">${pet.meta}</p>
                    <dl class="pet-facts">
                      <div><dt>Studio Job:</dt><dd>${pet.job}</dd></div>
                      <div><dt>Personality:</dt><dd>${pet.personality}</dd></div>
                      <div><dt>Favorite Things:</dt><dd>${pet.favoriteThings}</dd></div>
                      <div><dt>Story:</dt><dd>${pet.story}</dd></div>
                      <div><dt>Special Talent:</dt><dd>${pet.specialTalent}</dd></div>
                    </dl>
                  </section>
                </div>
              </section>
            `
          )
          .join("")}
      </div>
      <footer class="pet-slider-controls" aria-label="Pet profile controls">
        <button class="pet-nav-btn" type="button" data-pet-prev aria-label="Previous pet">&lt;</button>
        <span class="pet-counter" data-pet-counter>1 / ${pets.length}</span>
        <button class="pet-nav-btn" type="button" data-pet-next aria-label="Next pet">&gt;</button>
      </footer>
    </article>
  `;
}

function setCarouselSlide(carousel, index) {
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")].filter((slide) => !slide.hidden);
  const fallback = carousel.querySelector(".project-snapshot-fallback");
  const controls = carousel.querySelectorAll(".carousel-btn, .carousel-dots");
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];

  if (!slides.length) {
    if (fallback) fallback.hidden = false;
    controls.forEach((control) => {
      control.hidden = true;
    });
    return;
  }

  if (fallback) fallback.hidden = true;
  controls.forEach((control) => {
    control.hidden = slides.length <= 1;
  });

  const nextIndex = ((index % slides.length) + slides.length) % slides.length;
  carousel.dataset.carouselIndex = String(nextIndex);
  const activeSlideIndex = Number(slides[nextIndex].dataset.carouselSlideIndex);

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === nextIndex;
    slide.classList.toggle("active", active);
    slide.tabIndex = active ? 0 : -1;
  });

  dots.forEach((dot) => {
    const dotIndex = Number(dot.dataset.carouselDot);
    const matchingSlide = carousel.querySelector(`[data-carousel-slide-index="${dotIndex}"]`);
    dot.hidden = matchingSlide?.hidden ?? true;
    dot.classList.toggle("active", dotIndex === activeSlideIndex);
  });
}

function advanceCarousel(carousel, direction) {
  const currentIndex = Number(carousel.dataset.carouselIndex || "0");
  setCarouselSlide(carousel, currentIndex + direction);
}

function setPetSlide(slider, index) {
  const slides = [...slider.querySelectorAll("[data-pet-slide]")];
  if (!slides.length) return;

  const nextIndex = ((index % slides.length) + slides.length) % slides.length;
  slider.dataset.petIndex = String(nextIndex);

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === nextIndex;
    slide.hidden = !active;
    slide.classList.toggle("active", active);
    slide.querySelectorAll("img, button, a").forEach((element) => {
      element.tabIndex = active ? 0 : -1;
    });
  });

  const counter = slider.querySelector("[data-pet-counter]");
  if (counter) counter.textContent = `${nextIndex + 1} / ${slides.length}`;
}

function initPetSliders(root) {
  root.querySelectorAll("[data-pet-slider]").forEach((slider) => {
    if (slider.dataset.petSliderReady === "true") return;

    slider.dataset.petSliderReady = "true";
    slider.dataset.petIndex = "0";

    slider.querySelector("[data-pet-prev]")?.addEventListener("click", () => {
      setPetSlide(slider, Number(slider.dataset.petIndex || "0") - 1);
    });

    slider.querySelector("[data-pet-next]")?.addEventListener("click", () => {
      setPetSlide(slider, Number(slider.dataset.petIndex || "0") + 1);
    });

    setPetSlide(slider, 0);
  });
}

let previewLightboxElement = null;

function closePreviewLightbox() {
  if (!previewLightboxElement) return;
  previewLightboxElement.hidden = true;
}

function getPreviewLightbox() {
  if (previewLightboxElement) return previewLightboxElement;

  previewLightboxElement = document.createElement("section");
  previewLightboxElement.className = "preview-lightbox";
  previewLightboxElement.hidden = true;
  previewLightboxElement.setAttribute("role", "dialog");
  previewLightboxElement.setAttribute("aria-modal", "true");
  previewLightboxElement.setAttribute("aria-label", "Expanded project preview");
  previewLightboxElement.innerHTML = `
    <div class="preview-lightbox-frame">
      <button class="preview-lightbox-close" type="button" aria-label="Close expanded preview">&times;</button>
      <img class="preview-lightbox-img" src="" alt="" />
    </div>
  `;

  previewLightboxElement.addEventListener("click", (event) => {
    if (event.target === previewLightboxElement) closePreviewLightbox();
  });

  previewLightboxElement.querySelector(".preview-lightbox-close").addEventListener("click", closePreviewLightbox);
  document.body.appendChild(previewLightboxElement);

  return previewLightboxElement;
}

function openPreviewLightbox(src, alt) {
  const lightbox = getPreviewLightbox();
  const image = lightbox.querySelector(".preview-lightbox-img");
  image.src = src;
  image.alt = alt;
  lightbox.hidden = false;
  lightbox.querySelector(".preview-lightbox-close").focus();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePreviewLightbox();
    setContactPanelOpen(false);
  }
});

function setContactPanelOpen(open) {
  if (!contactTab || !contactPanel) return;

  contactPanel.classList.toggle("open", open);
  contactPanel.setAttribute("aria-hidden", String(!open));
  contactTab.setAttribute("aria-expanded", String(open));
}

function initProjectMedia(root) {
  root.querySelectorAll("[data-project-image]").forEach((imageElement) => {
    imageElement.addEventListener("error", () => {
      imageElement.hidden = true;
      const fallback = imageElement.nextElementSibling;
      if (fallback) fallback.hidden = false;
    });
  });

  root.querySelectorAll(".project-snapshot img").forEach((imageElement) => {
    if (imageElement.dataset.previewReady === "true") return;

    imageElement.dataset.previewReady = "true";
    imageElement.tabIndex = 0;
    imageElement.setAttribute("role", "button");
    imageElement.setAttribute("aria-label", `Open larger preview of ${imageElement.alt || "project image"}`);

    const openPreview = () => {
      if (imageElement.hidden) return;
      openPreviewLightbox(imageElement.currentSrc || imageElement.src, imageElement.alt || "Project preview");
    };

    imageElement.addEventListener("click", openPreview);
    imageElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });
  });

  root.querySelectorAll("[data-carousel]").forEach((carousel) => {
    if (carousel.dataset.carouselReady === "true") return;

    carousel.dataset.carouselReady = "true";
    carousel.dataset.carouselIndex = "0";

    carousel.querySelectorAll("[data-carousel-slide]").forEach((slide) => {
      slide.addEventListener("error", () => {
        slide.hidden = true;
        setCarouselSlide(carousel, Number(carousel.dataset.carouselIndex || "0"));
      });
    });

    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      advanceCarousel(carousel, -1);
    });

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      advanceCarousel(carousel, 1);
    });

    carousel.querySelectorAll("[data-carousel-dot]").forEach((dot) => {
      dot.addEventListener("click", () => {
        setCarouselSlide(carousel, Number(dot.dataset.carouselDot));
      });
    });

    setCarouselSlide(carousel, 0);

    const intervalId = window.setInterval(() => {
      if (!carousel.isConnected) {
        window.clearInterval(intervalId);
        return;
      }

      advanceCarousel(carousel, 1);
    }, 5000);
  });

  initPetSliders(root);
}

const appContent = {
  about: {
    title: "About Me",
    items: [
      {
        title: "Brittany Wallace",
        summary: "Graphic designer and front-end web designer.",
        content: createProjectContent({
          title: "Brittany Wallace",
          image: "assets/portfolio/me/bwallacepic.png",
          body: `
            <h3>Intro</h3>
            <blockquote>
              <p>I&rsquo;m a graphic designer and front-end web designer who loves working where visual design and code meet. I create websites, interactive experiences, branding, and digital projects that balance personality with usability.</p>
              <p>I especially enjoy taking an idea from a rough concept and turning it into something people can actually see, use, and interact with.</p>
            </blockquote>
            <div class="profile-chip-list" aria-label="Creative skills">
              <span class="profile-chip">Graphic Design</span>
              <span class="profile-chip">Front-End Web Design</span>
              <span class="profile-chip">UX/UI Design</span>
              <span class="profile-chip">Interactive Design</span>
              <span class="profile-chip">Branding</span>
              <span class="profile-chip">Creative Coding</span>
            </div>
            <section class="quick-facts" aria-label="Quick facts">
              <h3>Quick Facts</h3>
              <dl class="fact-list">
                <div><dt>Based in:</dt><dd>Washington</dd></div>
                <div><dt>Favorite Color:</dt><dd>Purple</dd></div>
                <div><dt>Best Working Hours:</dt><dd>Late</dd></div>
                <div><dt>Usually Creating:</dt><dd>Websites, graphics, or something unnecessarily complicated</dd></div>
              </dl>
            </section>
          `,
        }),
      },
      {
        title: "Fun Things About Me",
        summary: "A personal notes section for the little details that make the portfolio feel like me.",
        content: createProjectContent({
          title: "Fun Things About Me",
          images: folderImages("assets/portfolio/AboutMe/FunThings"),
          body: `
            <h3>Small intro</h3>
            <blockquote>
              <p>There&rsquo;s more to me than design files and browser tabs. Here are a few things that make me, me.</p>
            </blockquote>
            <div class="personal-list">
              <section class="personal-card">
                <h3>Night Owl</h3>
                <p>My best ideas have a suspicious habit of showing up after midnight.</p>
              </section>
              <section class="personal-card">
                <h3>Purple Everything</h3>
                <p>Purple has been my favorite color long enough that resisting it in my designs takes actual effort.</p>
              </section>
              <section class="personal-card">
                <h3>Coffee Powered</h3>
                <p>Cold brew is basically part of the creative process at this point.</p>
              </section>
              <section class="personal-card">
                <h3>Gamer</h3>
                <p>Games are one of my favorite sources of inspiration for storytelling, atmosphere, interaction, and visual design.</p>
              </section>
              <section class="personal-card">
                <h3>Spooky Stuff</h3>
                <p>I love dark, gothic, strange, mysterious, and slightly creepy things.</p>
              </section>
              <section class="personal-card">
                <h3>I Like Making Things</h3>
                <p>Digital projects, crafts, weird experiments, websites. Apparently having one hobby was too reasonable.</p>
              </section>
              <section class="personal-card">
                <h3>Always Learning</h3>
                <p>I&rsquo;m constantly trying new design tools, coding techniques, and creative ideas.</p>
              </section>
            </div>
          `,
        }),
      },
      {
        title: "Meet the Pets",
        summary: "The unofficial Late Night Studio staff.",
        content: createPetContent([
          {
            name: "Max",
            meta: "15 years old | Terrier Mix",
            image: "assets/portfolio/AboutMe/Pets/maxie.jpg",
            job: "Senior Snack Supervisor &amp; Solar Energy Specialist",
            personality: "Loyal, energetic, and somehow still powered by an endless internal battery.",
            favoriteThings: "Snacks, sunshine, naps, and being wherever his mom is.",
            story:
              "Max has been my loyal boy for 15 years and still has the energy of the Energizer Bunny. He would happily snack all day if given the opportunity, and when he isn&rsquo;t looking for food, you&rsquo;ll usually find him stretched out somewhere sunny. He is basically a tiny, furry solar panel who recharges exclusively through sunlight and snacks.",
            specialTalent: "Finding the warmest patch of sunlight in the entire house.",
          },
          {
            name: "Miz",
            meta: "2 years old | Tortoiseshell Cat",
            image: "assets/portfolio/AboutMe/Pets/mizKitty.jpg",
            job: "Resident Princess &amp; Head of Distractions",
            personality: "Sassy, spoiled, dramatic, and extremely selective about her people.",
            favoriteThings: "Food, backyard adventures, grass, sunshine, and annoying Max.",
            story:
              "Miz is the brattiest little princess in the house, and she is completely aware of it. She loves roaming around the backyard, lounging in the grass, begging for food, and bothering her older brother Max whenever the mood strikes. She is fiercely devoted to her mom and has decided that everyone else can simply exist somewhere else.",
            specialTalent: "Turning a request for food into a full-scale emergency.",
          },
          {
            name: "Moira",
            meta: "8 years old | Bearded Dragon",
            image: "assets/portfolio/AboutMe/Pets/Moira.jpg",
            job: "Bug Inspector &amp; Reptile Royalty",
            personality: "Sassy, opinionated, spoiled, and surprisingly dramatic for a lizard.",
            favoriteThings: "Bugs, apples, grapes, blueberries, and sleeping in completely unreasonable positions.",
            story:
              "Moira is another princess of the household, just with scales. She absolutely loves her bugs and fruit, especially apples, grapes, and blueberries. Greens are another story. She would happily remove them from the menu forever, but unfortunately for her, management insists on a balanced diet. She has an impressive amount of sass for one small lizard and regularly falls asleep in positions that look physically impossible.",
            specialTalent: "Sleeping like gravity is merely a suggestion.",
          },
        ]),
      },
      {
        title: "Creative Fuel",
        summary: "The games, colors, places, stories, and wonderfully strange things that inspire my work.",
        content: createProjectContent({
          title: "Creative Fuel",
          images: folderImages("assets/portfolio/AboutMe/CreativeFuel"),
          body: `
            <blockquote>
              <p>A lot of my inspiration comes from things outside traditional design. Games, moody environments, storytelling, nature, strange little details, and nostalgic visuals often find their way into the things I create.</p>
            </blockquote>
            <div class="personal-list">
              <section class="personal-card">
                <h3>Games</h3>
                <p>Interactive worlds, environmental storytelling, character design, UI, and atmosphere.</p>
              </section>
              <section class="personal-card">
                <h3>Dark + Moody Visuals</h3>
                <p>Deep colors, glowing light, dramatic contrast, fog, rain, nighttime scenes, and anything slightly mysterious.</p>
              </section>
              <section class="personal-card">
                <h3>Nature</h3>
                <p>Plants, rocks, landscapes, textures, flowers, and organic colors.</p>
              </section>
              <section class="personal-card">
                <h3>Nostalgia</h3>
                <p>Retro websites, pixel art, old games, magazines, vintage graphics, and things that feel familiar without looking outdated.</p>
              </section>
              <section class="personal-card">
                <h3>Storytelling</h3>
                <p>I love designs that feel like they belong to a larger world instead of existing only to look pretty.</p>
              </section>
              <section class="personal-card">
                <h3>Odd Little Things</h3>
                <p>Cryptids, unusual objects, weird history, tiny details, and anything that makes me want to know more.</p>
              </section>
            </div>
          `,
        }),
      },
    ],
  },
  resume: {
    title: "Resume",
    items: [
      {
        title: "Brittany Wallace Resume",
        summary: "Full-page PDF resume.",
        content: `
          <article class="content-block resume-document">
            <object
              class="resume-pdf"
              data="assets/portfolio/Resume/Brittany_Wallace_Resume_Full_Page.pdf"
              type="application/pdf"
              aria-label="Brittany Wallace resume PDF"
            >
              <a class="content-link" href="assets/portfolio/Resume/Brittany_Wallace_Resume_Full_Page.pdf">Open Brittany Wallace Resume PDF</a>
            </object>
          </article>
        `,
      },
    ],
  },
  contact: {
    title: "Contact",
    items: [
      {
        title: "Contact",
        summary: "Email, GitHub, and project inquiry links.",
        content: createProjectContent({
          title: "Contact Info",
          summary: "Send a message about design work, portfolio feedback, collaborations, or project questions.",
          images: folderImages("assets/portfolio/Contact"),
          details: [
            '<strong>Email:</strong> <a href="mailto:hello@brittanywallace.design">hello@brittanywallace.design</a>',
            '<strong>GitHub:</strong> <a href="https://github.com/bwallace11" target="_blank" rel="noreferrer">github.com/bwallace11</a>',
          ],
        }),
      },
    ],
  },
  "web-design": {
    title: "Web Design",
    items: [
      {
        title: "Javanoir Scrollytelling",
        summary: "Narrative web experience with cinematic scroll pacing.",
        content: createProjectContent({
          title: "Javanoir Scrollytelling",
          summary: "A narrative-driven web project built around mood, pacing, and immersive page transitions.",
          image: "assets/portfolio/WebDesign/javanoir/cover.png",
          details: ["Interactive storytelling", "HTML, CSS, JavaScript, GSAP", "Live scrollytelling portfolio project"],
          link: "https://scrollytelling-javanoir-bwallace.netlify.app/",
          linkLabel: "Open Live Project",
        }),
      },
      {
        title: "History of Web Design",
        summary: "Timeline-style educational site exploring web design eras.",
        content: createProjectContent({
          title: "History of Web Design",
          summary: "An educational website that organizes major web design eras into a readable, visual timeline.",
          image: "assets/portfolio/WebDesign/historyofwd/cover.png",
          details: ["Timeline structure", "Era-based visual hierarchy", "Responsive educational layout"],
          link: "https://historyofwd.netlify.app/",
          linkLabel: "Open Live Project",
        }),
      },
      {
        title: "NewESD101",
        summary: "District web redesign work for clearer resources.",
        content: createProjectContent({
          title: "NewESD101",
          summary: "A service-focused web redesign project centered on clearer school and community resources.",
          image: "assets/portfolio/WebDesign/newesd101/cover.png",
          details: ["Information architecture", "Department page systems", "Resource navigation"],
          link: "assets/portfolio/WebDesign/newesd101/Best-Page/NESD101-BestPage.html",
          linkLabel: "Open Project Page",
        }),
      },
      {
        title: "2024 Grad Show Website",
        summary: "Showcase site for SFCC design graduates.",
        content: createProjectContent({
          title: "2024 Grad Show Website",
          summary: "A celebratory showcase site designed to present graduate work with clear structure and visual rhythm.",
          image: "assets/portfolio/WebDesign/gradshow2024/Gradshow-Website-Mockup.png",
          details: ["Figma", "WordPress", "Custom HTML and CSS"],
          link: "https://sfccdesign.com/2024gradshow/",
          linkLabel: "Open Live Project",
        }),
      },
      {
        title: "Random Quote Generator",
        summary: "Small interactive web project with dynamic content.",
        content: createProjectContent({
          title: "Random Quote Generator",
          summary: "A playful web project built to practice JavaScript content updates and interaction feedback.",
          image: "assets/portfolio/WebDesign/quotegen/cover.png",
          details: ["HTML", "CSS", "JavaScript"],
          link: "https://wallacerandomquotegen.netlify.app/",
          linkLabel: "Open Live Project",
        }),
      },
      {
        title: "The Keepsake Ledger API Listing",
        summary: "Scannable data interface for API records.",
        content: createProjectContent({
          title: "The Keepsake Ledger API Listing",
          summary: "A data-focused listing interface built for fast browsing and clear record hierarchy.",
          image: "assets/portfolio/WebDesign/keepsakeledger/cover.png",
          details: ["API listing", "Interface hierarchy", "Front-end structure"],
          link: "https://wallace-apilisting-thekeepsakeledger.netlify.app/",
          linkLabel: "Open Live Project",
        }),
      },
      {
        title: "Peace of Mind Dashboard",
        summary: "Dashboard concept for calm wellbeing tracking.",
        content: createProjectContent({
          title: "Peace of Mind Dashboard",
          summary: "A dashboard concept focused on approachable status visibility and emotional data scanning.",
          image: "assets/portfolio/WebDesign/peaceofmind/cover.png",
          details: ["Dashboard UI", "Calm visual system", "Metric organization"],
          link: "https://wallace-peaceofmind-dashboard.netlify.app/",
          linkLabel: "Open Live Project",
        }),
      },
    ],
  },
  "ux-design": {
    title: "UX Design",
    items: [
      {
        title: "Nocturne",
        summary: "Moody restaurant UX concept with clear menu and reservation paths.",
        content: createProjectContent({
          title: "Nocturne",
          summary: "A modern restaurant UX concept balancing atmosphere with fast, clear decision paths.",
          images: folderImages("assets/portfolio/UXDesign/nocturne", [
            "assets/portfolio/UXDesign/nocturne/HompageKH.png",
            "assets/portfolio/UXDesign/nocturne/Nocturnemockup2%201.png",
            "assets/portfolio/UXDesign/nocturne/NocturneMock3.png",
          ]),
          details: ["Figma prototype", "User flow mapping", "Restaurant interface design"],
          link: "https://www.figma.com/proto/nCVow6D3JEpuHJHY9XOybR/Nocturne?page-id=0%3A1&node-id=1-1018&viewport=-6597%2C-1926%2C0.28&t=8vbov3t8FRKnZNvJ-1&scaling=min-zoom&content-scaling=fixed",
          linkLabel: "Open Prototype",
        }),
      },
      {
        title: "Kindara",
        summary: "Mental health website concept with calm support flows.",
        content: createProjectContent({
          title: "Kindara",
          summary: "A supportive mental health UX concept built around calm pacing, trust, and low-friction navigation.",
          images: folderImages("assets/portfolio/UXDesign/kindara", [
            "assets/portfolio/UXDesign/kindara/KindaraMockup.png",
            "assets/portfolio/UXDesign/kindara/kindara-mockup-2%201.png",
            "assets/portfolio/UXDesign/kindara/Kindar-lowfi%201.png",
          ]),
          details: ["UX writing", "Support pathways", "Prototype testing"],
          link: "https://www.figma.com/proto/hiYKsf8yJsGzTPOtcZ4Blk/Kindara?page-id=5%3A6&node-id=3333-316&viewport=162%2C319%2C0.08&t=XGtuw8JmfDuDjErO-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=3324%3A159",
          linkLabel: "Open Prototype",
        }),
      },
      {
        title: "Inklore",
        summary: "Trip planning UX with discovery and recommendation workflows.",
        content: createProjectContent({
          title: "Inklore",
          summary: "A travel planning UX prototype focused on discovery, planning, and decision confidence.",
          images: folderImages("assets/portfolio/UXDesign/inklore", [
            "assets/portfolio/UXDesign/inklore/InkloreMockup.png",
            "assets/portfolio/UXDesign/inklore/InkloreMockup2.png",
            "assets/portfolio/UXDesign/inklore/InkloreMockup3.png",
            "assets/portfolio/UXDesign/inklore/iNKLORESTICKER.png",
          ]),
          details: ["Journey mapping", "Recommendation flow", "Interaction design"],
          link: "https://www.figma.com/proto/HavXiTc963sPpUNYyX7lA2/Inklore?page-id=0%3A1&node-id=1-823&viewport=424%2C363%2C0.05&t=5exoolhhL3Qgt6P4-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A837",
          linkLabel: "Open Prototype",
        }),
      },
      {
        title: "Yo-Pedia",
        summary: "Folklore learning experience with quizzes and favorites.",
        content: createProjectContent({
          title: "Yo-Pedia",
          summary: "A folklore education concept that uses quizzes, modular content, and saved favorites.",
          images: folderImages("assets/portfolio/UXDesign/yopedia", [
            "assets/portfolio/UXDesign/yopedia/yopediaMockup.png",
            "assets/portfolio/UXDesign/yopedia/yopediamockup2.png",
            "assets/portfolio/UXDesign/yopedia/yopida-screen.png",
            "assets/portfolio/UXDesign/yopedia/yopida-hoodie.png",
          ]),
          details: ["UX prototyping", "Information design", "Playful learning flow"],
          link: "https://www.figma.com/proto/bS9zIgjEoz1pq2W5pNvT5Z/Yo-pedia?page-id=0%3A1&node-id=1-2419&viewport=45%2C84%2C0.03&t=CKhp8cC4ySywlFiq-1&scaling=min-zoom&content-scaling=fixed",
          linkLabel: "Open Prototype",
        }),
      },
      {
        title: "Greenly",
        summary: "Eco-action app concept with habit loops and badges.",
        content: createProjectContent({
          title: "Greenly",
          summary: "An eco-action app concept designed to make sustainable habits feel simple and rewarding.",
          images: folderImages("assets/portfolio/UXDesign/greenly", [
            "assets/portfolio/UXDesign/greenly/greenly%20mockup%201.png",
            "assets/portfolio/UXDesign/greenly/greenlyMockup3.png",
            "assets/portfolio/UXDesign/greenly/fasdfsdvffvfrtggbtgbhgnh%201.png",
          ]),
          details: ["Gamification UX", "Progress feedback", "Collaborative design"],
          link: "https://www.figma.com/proto/VFa9OIap1WKtjWFH3vicj9/Verdantia?page-id=0%3A1&node-id=61-1751&viewport=157%2C181%2C0.11&t=8sqo8z4iXSt86MZg-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=61%3A1751&show-proto-sidebar=1",
          linkLabel: "Open Prototype",
        }),
      },
    ],
  },
  "logo-design": {
    title: "Logo Design",
    items: [
      {
        title: "Local 931",
        summary: "Local-first identity concept with bold, approachable readability.",
        content: createProjectContent({
          title: "Local 931",
          summary: "A community-focused identity concept built around clear lockups and local personality.",
          images: folderImages("assets/portfolio/LogoDesign/Local931", [
            "assets/portfolio/LogoDesign/Local931/931Local-logo.jpg",
            "assets/portfolio/LogoDesign/Local931/931tshirtmockup.png",
          ]),
          details: ["Logo exploration", "Brand mark development", "Signage and digital flexibility"],
        }),
      },
      {
        title: "Friends of The Centennial Trail Logo",
        summary: "Trail-focused community identity with outdoor energy.",
        content: createProjectContent({
          title: "Friends of The Centennial Trail Logo",
          summary: "A community logo concept shaped around trees, trail movement, and an accessible outdoor mark.",
          images: folderImages("assets/portfolio/LogoDesign/FriendsCentennialTrail", [
            "assets/portfolio/LogoDesign/FriendsCentennialTrail/FOTCT-8.png",
            "assets/portfolio/LogoDesign/FriendsCentennialTrail/naturetshirt.jpg",
          ]),
          details: ["Logo system", "Outdoor nonprofit identity", "Merch and community use"],
        }),
      },
      {
        title: "The Sunshine Club Logo",
        summary: "Sunny, playful logo system with apparel and event uses.",
        content: createProjectContent({
          title: "The Sunshine Club Logo",
          summary: "A bright identity system with a sunglasses sun mark, expressive typography, and friendly event energy.",
          images: folderImages("assets/portfolio/LogoDesign/SunshineClub", [
            "assets/portfolio/LogoDesign/SunshineClub/SunshineClubLogo.png",
            "assets/portfolio/LogoDesign/SunshineClub/538600355_1306171467868836_5871361979572095778_n.jpg",
            "assets/portfolio/LogoDesign/SunshineClub/480967944_1168310114988306_7159077442531729478_n.jpg",
          ]),
          details: ["Logo design", "Apparel mockups", "Event banner application"],
        }),
      },
      {
        title: "Nightmare Fuel",
        summary: "Coffee brand identity with a bold creature mark and packaging mockups.",
        content: createProjectContent({
          title: "Nightmare Fuel",
          summary: "A moody coffee identity built around a purple monster mark, bright green accent color, and packaging applications.",
          images: folderImages("assets/portfolio/LogoDesign/NightmareFuel", [
            "assets/portfolio/LogoDesign/NightmareFuel/nightmarefuel.png",
            "assets/portfolio/LogoDesign/NightmareFuel/nightmarefuelMockup.jpg",
          ]),
          details: ["Logo design", "Packaging mockups", "Brand application"],
        }),
      },
    ],
  },
  "other-projects": {
    title: "Other Projects",
    items: [
      {
        title: "My Attack On Travis Game",
        summary: "Game project placed first in the other-projects folder.",
        content: createProjectContent({
          title: "My Attack On Travis Game",
          summary: "A game project included in the portfolio's other creative work section.",
          images: folderImages("assets/portfolio/OtherProjects/AttackOnTravis", [
            "assets/portfolio/OtherProjects/AttackOnTravis/AtackonTravis-Cover.jpg",
          ]),
          details: ["Game concept", "Interactive project", "Creative coding"],
          link: "https://gd.games/bwallace/attack-on-travis",
          linkLabel: "Play Game",
        }),
      },
      {
        title: "The Last Place We Played Game",
        summary: "Game project listed before the invitation work.",
        content: createProjectContent({
          title: "The Last Place We Played Game",
          summary: "A game project focused on interactive storytelling and playable experience design.",
          images: folderImages("assets/portfolio/OtherProjects/TheLastPlaceWePlayed", [
            "assets/portfolio/OtherProjects/TheLastPlaceWePlayed/Title-Page-Full.jpg",
          ]),
          details: ["Game design", "Interactive narrative", "Atmospheric direction"],
          link: "https://gd.games/bwallace/the-last-place-we-played",
          linkLabel: "Play Game",
        }),
      },
      {
        title: "Caitylnn's Wedding Invite",
        summary: "Custom wedding invitation design.",
        content: createProjectContent({
          title: "Caitylnn's Wedding Invite",
          summary: "A custom wedding invitation piece built around event tone, hierarchy, and print-friendly layout.",
          images: folderImages("assets/portfolio/OtherProjects/CaitylnnWeddingInvite", [
            "assets/portfolio/OtherProjects/CaitylnnWeddingInvite/caitymockup3.jpg",
            "assets/portfolio/OtherProjects/CaitylnnWeddingInvite/caityinviteNew.jpg",
          ]),
          details: ["Invitation design", "Typography", "Print layout"],
        }),
      },
      {
        title: "Jacob's Birthday Invite",
        summary: "Comic-inspired birthday invitation design.",
        content: createProjectContent({
          title: "Jacob's Birthday Invite",
          summary: "A bold birthday invite with comic-inspired styling and clear event information.",
          images: folderImages("assets/portfolio/OtherProjects/JacobBirthdayInvite", [
            "assets/portfolio/OtherProjects/JacobBirthdayInvite/Jacobinvite3.jpg",
          ]),
          details: ["Invitation design", "Comic visual style", "Print layout"],
        }),
      },
      {
        title: "Dad and Deb Wedding Invite",
        summary: "Personal wedding invitation design.",
        content: createProjectContent({
          title: "Dad and Deb Wedding Invite",
          summary: "A personal wedding invitation piece with custom visual direction and clean event hierarchy.",
          images: folderImages("assets/portfolio/OtherProjects/DadDebWeddingInvite", [
            "assets/portfolio/OtherProjects/DadDebWeddingInvite/D%26DWInv.jpg",
          ]),
          details: ["Wedding invite", "Typography", "Personal event design"],
        }),
      },
    ],
  },
};

let topZ = 20;
const openWindows = new Map();

function updateClock() {
  const now = new Date();
  clockElement.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateTaskbar() {
  taskbarWindows.innerHTML = "";

  openWindows.forEach((windowData) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "task-chip";
    chip.textContent = windowData.title;
    chip.setAttribute("aria-label", `Focus ${windowData.title} window`);

    const active = Number(windowData.element.style.zIndex) === topZ;
    if (active) chip.classList.add("active");

    chip.addEventListener("click", () => {
      focusWindow(windowData.element);
    });

    taskbarWindows.appendChild(chip);
  });
}

function focusWindow(windowElement) {
  topZ += 1;
  windowElement.style.zIndex = String(topZ);
  updateTaskbar();
}

function closeWindow(appId) {
  const windowData = openWindows.get(appId);
  if (!windowData) return;

  windowData.element.remove();
  openWindows.delete(appId);
  updateTaskbar();
}

function renderFolder(windowData) {
  windowData.mode = "folder";

  const listMarkup = windowData.app.items
    .map(
      (item, index) => `
        <button class="folder-item" type="button" data-item-index="${index}" aria-label="Open ${item.title}">
          <span class="folder-item-title">${item.title}</span>
          <span class="folder-item-summary">${item.summary}</span>
        </button>
      `
    )
    .join("");

  windowData.content.innerHTML = `
    <section class="folder-view">
      <h2>${windowData.title} Folder</h2>
      <p class="folder-help">Choose an item to open its full page.</p>
      <div class="folder-list">${listMarkup}</div>
    </section>
  `;

  windowData.content.querySelectorAll(".folder-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemIndex = Number(button.dataset.itemIndex);
      renderPage(windowData, itemIndex);
    });
  });
}

function renderPage(windowData, itemIndex) {
  const item = windowData.app.items[itemIndex];
  if (!item) return;

  windowData.mode = "page";

  windowData.content.innerHTML = `
    <section class="page-view">
      <header class="page-view-header">
        <h2>${item.title}</h2>
        <button class="page-close" type="button" aria-label="Close page and return to folder">&times;</button>
      </header>
      <div class="page-body">${item.content}</div>
    </section>
  `;

  initProjectMedia(windowData.content);

  const pageClose = windowData.content.querySelector(".page-close");
  pageClose.addEventListener("click", () => {
    renderFolder(windowData);
  });

}

function createWindow(appId) {
  const appData = appContent[appId];
  if (!appData) return;

  if (openWindows.has(appId)) {
    const existing = openWindows.get(appId);
    focusWindow(existing.element);
    return;
  }

  const windowElement = document.createElement("section");
  windowElement.className = "window";
  windowElement.setAttribute("role", "dialog");
  windowElement.setAttribute("aria-label", appData.title);

  const estimatedWindowWidth = Math.min(78 * 16, window.innerWidth * 0.9);
  const nextTop = Math.min(70 + openWindows.size * 26, Math.max(12, window.innerHeight - 560));
  const nextLeft = Math.min(
    220 + openWindows.size * 32,
    Math.max(12, window.innerWidth - estimatedWindowWidth - 16)
  );
  windowElement.style.top = `${nextTop}px`;
  windowElement.style.left = `${nextLeft}px`;

  windowElement.innerHTML = `
    <header class="window-header">
      <span class="window-title">${appData.title}</span>
      <div class="window-actions">
        <button class="window-btn" type="button" data-action="close" aria-label="Close folder">&times;</button>
      </div>
    </header>
    <div class="window-content"></div>
  `;

  windowElement.addEventListener("pointerdown", () => focusWindow(windowElement));

  const closeBtn = windowElement.querySelector('[data-action="close"]');
  const contentElement = windowElement.querySelector(".window-content");

  const windowData = {
    appId,
    title: appData.title,
    app: appData,
    element: windowElement,
    content: contentElement,
    mode: "folder",
  };

  closeBtn.addEventListener("click", () => closeWindow(appId));

  enableDrag(windowElement);

  windowLayer.appendChild(windowElement);
  openWindows.set(appId, windowData);

  renderFolder(windowData);
  focusWindow(windowElement);
}

function enableDrag(windowElement) {
  const header = windowElement.querySelector(".window-header");

  header.addEventListener("pointerdown", (event) => {
    if (window.innerWidth <= 900) return;
    if (event.target.closest("button")) return;

    event.preventDefault();

    const rect = windowElement.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    const handleMove = (moveEvent) => {
      const maxLeft = window.innerWidth - rect.width - 12;
      const maxTop = window.innerHeight - rect.height - 60;

      const nextLeft = Math.min(Math.max(8, moveEvent.clientX - startX), maxLeft);
      const nextTop = Math.min(Math.max(8, moveEvent.clientY - startY), maxTop);

      windowElement.style.left = `${nextLeft}px`;
      windowElement.style.top = `${nextTop}px`;
    };

    const handleUp = () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
  });
}

function clearIconSelection() {
  desktopIcons.forEach((icon) => icon.classList.remove("selected"));
}

desktopIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    clearIconSelection();
    icon.classList.add("selected");
    if (icon.dataset.app) {
      createWindow(icon.dataset.app);
    }
  });

  icon.addEventListener("keydown", (event) => {
    if (!icon.dataset.app) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      createWindow(icon.dataset.app);
    }
  });
});

contactTab?.addEventListener("click", (event) => {
  event.stopPropagation();
  setContactPanelOpen(!contactPanel?.classList.contains("open"));
});

contactPanelClose?.addEventListener("click", () => {
  setContactPanelOpen(false);
  contactTab?.focus();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".desktop-icon")) {
    clearIconSelection();
  }

  if (
    contactPanel?.classList.contains("open") &&
    !contactPanel.contains(event.target) &&
    !contactTab?.contains(event.target)
  ) {
    setContactPanelOpen(false);
  }
});

function buildMobileCards() {
  mobileCards.innerHTML = "";

  portfolioAppOrder.map((appId) => appContent[appId]).forEach((app) => {
    const card = document.createElement("article");
    card.className = "mobile-card";
    card.innerHTML = `
      <header class="mobile-card-header">${app.title}</header>
      <div class="mobile-card-content">
        <ul class="entry-list">
          ${app.items.map((item) => `<li><strong>${item.title}:</strong> ${item.summary}</li>`).join("")}
        </ul>
      </div>
    `;

    mobileCards.appendChild(card);
  });
}

updateClock();
setInterval(updateClock, 30000);
buildMobileCards();
