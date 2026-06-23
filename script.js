const desktopIcons = [...document.querySelectorAll(".desktop-icon")];
const windowLayer = document.getElementById("window-layer");
const taskbarWindows = document.getElementById("taskbar-windows");
const mobileCards = document.getElementById("mobile-cards");
const clockElement = document.getElementById("clock");

const portfolioAppOrder = [
  "about",
  "resume",
  "contact",
  "web-design",
  "ux-design",
  "logo-design",
  "other-projects",
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
  summary,
  image,
  images = [],
  details = [],
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
  const externalAttributes = /^https?:\/\//i.test(link) ? ' target="_blank" rel="noreferrer"' : "";
  const linkMarkup = link
    ? `<p><a class="content-link" href="${link}"${externalAttributes}>${linkLabel}</a></p>`
    : "";

  return `
    <article class="content-block portfolio-entry">
      ${snapshotMarkup}
      <div class="portfolio-info">
        <h2>${title}</h2>
        <p>${summary}</p>
        ${detailMarkup}
        ${linkMarkup}
      </div>
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
    slide.classList.toggle("active", slideIndex === nextIndex);
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

function initProjectMedia(root) {
  root.querySelectorAll("[data-project-image]").forEach((imageElement) => {
    imageElement.addEventListener("error", () => {
      imageElement.hidden = true;
      const fallback = imageElement.nextElementSibling;
      if (fallback) fallback.hidden = false;
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
}

const appContent = {
  about: {
    title: "About Me",
    items: [
      {
        title: "Brittany Wallace",
        summary: "Designer focused on web, UX, visual identity, and expressive interactive work.",
        content: createProjectContent({
          title: "Brittany Wallace",
          summary:
            "I design atmospheric digital experiences that blend visual storytelling, clear structure, and interaction. My work moves between web design, UX design, logo systems, invitations, and game projects.",
          images: folderImages("assets/portfolio/AboutMe", ["assets/portfolio/me/bwallacepic.png"]),
          details: ["Web design", "UX design", "Logo systems", "Invitations and interactive projects"],
        }),
      },
      {
        title: "Fun Things About Me",
        summary: "A personal notes section for the little details that make the portfolio feel like me.",
        content: createProjectContent({
          title: "Fun Things About Me",
          summary:
            "A place for favorite creative habits, late-night ideas, games, coffee-fueled work sessions, and the small personality notes that do not fit neatly into a resume.",
          images: folderImages("assets/portfolio/AboutMe/FunThings"),
          details: [
            "I like portfolio work that feels personal, atmospheric, and a little unexpected.",
            "I enjoy building visual worlds, not just flat project pages.",
            "This section is ready for photos, favorites, and extra personality details.",
          ],
        }),
      },
      {
        title: "Pets",
        summary: "A dedicated spot for pet photos, names, and tiny life updates.",
        content: createProjectContent({
          title: "Pets",
          summary: "A dedicated spot for pet photos, names, and tiny life updates inside the portfolio.",
          images: folderImages("assets/portfolio/AboutMe/Pets"),
          details: [
            "Add pet pictures to assets/portfolio/AboutMe/Pets to turn this into a carousel.",
            "This page is set up for names, favorite quirks, and little stories.",
          ],
        }),
      },
      {
        title: "Design Focus",
        summary: "A quick look at the kind of work I want this garden to hold.",
        content: createProjectContent({
          title: "Design Focus",
          summary: "A quick look at the creative sections inside this portfolio garden.",
          details: [
            "<strong>Web Design:</strong> Built sites, responsive interfaces, and interactive storytelling.",
            "<strong>UX Design:</strong> Flows, prototypes, systems, and product concepts.",
            "<strong>Logo Design:</strong> Identity work with readable marks and flexible lockups.",
            "<strong>Other Projects:</strong> Invitations, games, print pieces, and playful experiments.",
          ],
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
    title: "Contact Info",
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

document.addEventListener("click", (event) => {
  if (!event.target.closest(".desktop-icon")) {
    clearIconSelection();
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
