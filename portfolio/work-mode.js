const navButtons = [...document.querySelectorAll('.nav-btn')];
const panels = [...document.querySelectorAll('.panel')];
const projectSections = document.getElementById('project-sections');
const projectDetailContent = document.getElementById('project-detail-content');
const backToProjects = document.getElementById('back-to-projects');
const jumpToProjects = document.querySelector('[data-jump="projects"]');

const projectCategories = [
  {
    id: 'web-design',
    name: 'Web Design',
    projects: [
      {
        id: 'java-noir',
        title: 'Javanoir Scrollytelling',
        short: 'Narrative-driven scrollytelling project with immersive transitions.',
        image: '/WebDesign/javanoir/cover.png',
        overview:
          'Interactive long-form story experience built for web, focused on immersive pacing and atmospheric storytelling.',
        problem:
          'Needed to maintain narrative impact while keeping scrolling and readability smooth across sections.',
        process:
          'Built layered structure, tuned transition timing, and iterated visual contrast for clarity in a dark theme.',
        result:
          'A cinematic, readable scrollytelling experience with strong mood and clear narrative direction.',
        tools: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollTrigger'],
        year: '2026',
        url: 'https://javanoir-scrollytelling.netlify.app/'
      },
      {
        id: 'history-web-design',
        title: 'History of Web Design',
        short: 'Timeline-style educational site exploring key web design eras.',
        image: '/WebDesign/historyofwd/cover.png',
        overview:
          'Historical overview project focused on web design evolution through interactive timeline storytelling.',
        problem:
          'Needed to present dense historical content in an engaging structure without overwhelming users.',
        process:
          'Organized periods by era, refined hierarchy, and introduced interaction moments for retention.',
        result:
          'A clean educational site with strong visual rhythm and easy era-to-era navigation.',
        tools: ['Semantic HTML', 'CSS Grid', 'JavaScript'],
        year: '2026',
        url: 'https://historyofwd.netlify.app/'
      },
      {
        id: 'newesd101',
        title: 'NewESD101',
        short: 'District web redesign section focused on clearer school/community resources.',
        image: '/WebDesign/newesd101/cover.png',
        overview:
          'A service-focused web section showcasing district pages and resources across the NewESD101 project.',
        problem:
          'Important district resources needed better wayfinding and clearer information grouping.',
        process:
          'Designed and organized multiple service pages, balancing consistency with department-specific content needs.',
        result:
          'A clearer resource ecosystem with improved scanability and page-to-page cohesion.',
        tools: ['HTML', 'CSS', 'Information Architecture'],
        year: '2025–2026',
        url: '/WebDesign/newesd101/Best-Page/NESD101-BestPage.html',
        pages: [
          { label: 'Best Page', url: '/WebDesign/newesd101/Best-Page/NESD101-BestPage.html' },
          { label: 'AmeriCorps', url: '/WebDesign/newesd101/Americorp/Americorp.html' },
          { label: 'School & Community Resources', url: '/WebDesign/newesd101/School & Community Resources/S&CR.html' },
          { label: 'Special Education Resources', url: '/WebDesign/newesd101/Special Education Resources/SpecialEducationResources.html' },
          { label: 'Superintendent & School Board Services', url: '/WebDesign/newesd101/Superintendent&SchoolBoardServices/SISBS.html' },
          { label: 'Teacher of the Year', url: '/WebDesign/newesd101/TeacherOfTheYear/TeacherOfTheYear.html' }
        ]
      },
      {
        id: 'gradshow-2024',
        title: '2024 Grad Show Website',
        short: 'Celebratory, accessible showcase site for 25 years of SFCC design graduates.',
        image: '/WebDesign/gradshow2024/Gradshow-Website-Mockup.png',
        overview:
          'The SFCC 2024 Grad Show website celebrates 25 years of design graduates while keeping exploration simple and readable.',
        problem:
          'Needed to highlight many student works without clutter or accessibility issues.',
        process:
          'Designed in Figma, developed in WordPress with custom HTML/CSS, and refined responsive behavior and hierarchy.',
        result:
          'A celebratory showcase with clear structure, accessible patterns, and consistent visual rhythm.',
        tools: ['Figma', 'WordPress', 'HTML', 'CSS'],
        year: '2026',
        url: 'https://sfccdesign.com/2024gradshow/'
      },
      {
        id: 'quote-generator',
        title: 'Random Quote Generator',
        short: 'Playful quote generator built as a personality-driven inside joke project.',
        image: '/WebDesign/quotegen/cover.png',
        overview:
          'A lighthearted web project made to practice dynamic content updates and interaction design.',
        problem:
          'Needed to keep the experience simple while still feeling fun and animated.',
        process:
          'Built random quote logic, refined visual tone, and tuned feedback interactions.',
        result:
          'A playful project that combines humor with solid front-end fundamentals.',
        tools: ['HTML', 'CSS', 'JavaScript'],
        year: '2026',
        url: 'https://colinm-quote-gen.netlify.app/'
      },
      {
        id: 'keepsake-ledger',
        title: 'The Keepsake Ledger API Listing',
        short: 'API listing interface designed for clarity and fast browsing.',
        image: '/WebDesign/keepsakeledger/cover.png',
        overview:
          'Data-focused interface for organizing and presenting API records in an easy-to-scan layout.',
        problem:
          'Data views needed cleaner visual hierarchy and simpler browsing behavior.',
        process:
          'Structured content blocks by relevance and optimized visual rhythm for quick lookup.',
        result:
          'A clearer, more navigable listing interface.',
        tools: ['HTML', 'CSS', 'JavaScript'],
        year: '2026',
        url: 'https://wallaceapidatalisting.netlify.app/'
      },
      {
        id: 'peace-of-mind-dashboard',
        title: 'Peace of Mind Dashboard',
        short: 'Dashboard concept for tracking and managing wellbeing signals.',
        image: '/WebDesign/peaceofmind/cover.png',
        overview:
          'A personal dashboard concept designed for quick status visibility and intuitive metric scanning.',
        problem:
          'Needed to make emotional/wellbeing data feel approachable and not overwhelming.',
        process:
          'Explored dashboard hierarchies and card groupings for clear at-a-glance understanding.',
        result:
          'A calm, scannable dashboard with meaningful visual priority.',
        tools: ['Figma', 'HTML', 'CSS'],
        year: '2026',
        url: 'https://mindful-dashboard-task-keeper.netlify.app/'
      }
    ]
  },
  {
    id: 'ux-design',
    name: 'UX Design',
    projects: [
      {
        id: 'nocturne',
        title: 'Nocturne',
        short: 'Modern, moody restaurant concept with night-inspired dining UX.',
        image: '/UXDesign/nocturne/HompageKH.png',
        overview:
          'Nocturne is a modern restaurant concept centered around craft cocktails, shareable plates, and intimate atmosphere.',
        problem:
          'Needed to communicate premium mood while preserving fast, clear menu and reservation pathways.',
        process:
          'Built user flow map, tested page hierarchy, and iterated visual tone through prototype cycles.',
        result:
          'A polished UX direction balancing atmosphere and conversion-focused clarity.',
        tools: ['Figma', 'UX Flow Design', 'UI Prototyping'],
        year: '2025',
        url: 'https://www.figma.com/proto/nCVow6D3JEpuHJHY9XOybR/Nocturne?page-id=0%3A1&node-id=1-1018&viewport=-6597%2C-1926%2C0.28&t=8vbov3t8FRKnZNvJ-1&scaling=min-zoom&content-scaling=fixed'
      },
      {
        id: 'kindara',
        title: 'Kindara',
        short: 'Calming mental health website with support and self-care tools.',
        image: '/UXDesign/kindara/KindaraMockup.png',
        overview:
          'Kindara provides supportive mental health resources in a calm, low-friction interface.',
        problem:
          'The challenge was building trust and emotional clarity through content and structure.',
        process:
          'Mapped emotional journeys, refined content grouping, and tested tone consistency across screens.',
        result:
          'An approachable support-focused UX with soothing visual rhythm and clear pathways.',
        tools: ['Figma', 'UX Writing', 'Prototype Testing'],
        year: '2025',
        url: 'https://www.figma.com/proto/hiYKsf8yJsGzTPOtcZ4Blk/Kindara?page-id=5%3A6&node-id=3333-316&viewport=162%2C319%2C0.08&t=XGtuw8JmfDuDjErO-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=3324%3A159'
      },
      {
        id: 'inklore',
        title: 'Inklore',
        short: 'Trip planning UX with discovery and recommendation workflows.',
        image: '/UXDesign/inklore/InkloreMockup.png',
        overview:
          'Travel UX prototype focused on discovery, planning, and decision support in one flow.',
        problem:
          'Needed to reduce planning friction while preserving exploration and delight.',
        process:
          'Defined trip-planning journeys, wireframed guidance states, and tested recommendation touchpoints.',
        result:
          'A clearer end-to-end planning flow with stronger decision confidence.',
        tools: ['Figma', 'Journey Mapping', 'Interaction Design'],
        year: '2025',
        url: 'https://www.figma.com/proto/HavXiTc963sPpUNYyX7lA2/Inklore?page-id=0%3A1&node-id=1-823&viewport=424%2C363%2C0.05&t=5exoolhhL3Qgt6P4-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A837'
      },
      {
        id: 'yopedia',
        title: 'Yō-Pedia',
        short: 'Spooky-playful folklore experience with quizzes and saved favorites.',
        image: '/UXDesign/yopedia/yopediaMockup.png',
        overview:
          'Yō-Pedia blends education and playful interaction to explore Japanese folklore characters.',
        problem:
          'Needed to keep the product fun without sacrificing usability and content clarity.',
        process:
          'Built modular content system, quiz interaction flow, and favorites behavior prototypes.',
        result:
          'A memorable educational concept with strong personality and clear UX structure.',
        tools: ['Figma', 'UX Prototyping', 'Information Design'],
        year: '2025',
        url: 'https://www.figma.com/proto/bS9zIgjEoz1pq2W5pNvT5Z/Yo-pedia?page-id=0%3A1&node-id=1-2419&viewport=45%2C84%2C0.03&t=CKhp8cC4ySywlFiq-1&scaling=min-zoom&content-scaling=fixed'
      },
      {
        id: 'greenly',
        title: 'Greenly',
        short: 'Eco-action app building daily green habits through tasks and badges.',
        image: '/UXDesign/greenly/greenly mockup 1.png',
        overview:
          'Greenly is an eco-action app concept that tracks positive habits and impact in a motivating way.',
        problem:
          'Needed to make sustainability actions feel simple, rewarding, and trackable.',
        process:
          'Developed action loops, badge systems, and progress patterns with a collaborative design team.',
        result:
          'A friendly, habit-forming UX concept with clear rewards and progress feedback.',
        tools: ['Figma', 'Gamification UX', 'Collaborative Design'],
        year: '2025',
        url: 'https://www.figma.com/proto/VFa9OIap1WKtjWFH3vicj9/Verdantia?page-id=0%3A1&node-id=61-1751&viewport=157%2C181%2C0.11&t=8sqo8z4iXSt86MZg-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=61%3A1751&show-proto-sidebar=1'
      }
    ]
  },
  {
    id: 'logo-design',
    name: 'Logo Design',
    projects: [
      {
        id: 'sunshine-club',
        title: 'Sunshine Club',
        short: 'Bold identity direction in logo concept exploration.',
        image: '/Logos/Sunshine Club/Sunshine Club.png',
        overview: 'Logo concept study focused on playful structure and recognizable silhouette.',
        problem: 'Needed a distinctive mark that remains readable across sizes.',
        process: 'Iterated symbol geometry, spacing, and lockup alternatives.',
        result: 'Strong conceptual identity direction ready for brand system extension.',
        tools: ['Illustrator', 'Logo Exploration']
      },
      {
        id: 'nightmare-fuel',
        title: 'Nightmare Fuel',
        short: 'Expressive identity concept in darker visual tone.',
        image: '/Logos/Nightmare Fuel/NightmareFuel-Logo-Primary.png',
        overview: 'A mood-forward logo concept with spooky energy and memorable shape language.',
        problem: 'Needed to keep edgy personality while preserving visual balance.',
        process: 'Refined icon forms, tested contrast variants, and adjusted typographic pairing.',
        result: 'Distinctive concept logo with strong character and display presence.',
        tools: ['Illustrator', 'Brand Concept Development']
      },
      {
        id: 'solvana',
        title: 'Solvana',
        short: 'Identity concept exploring clean modern mark systems.',
        overview: 'Logo exploration focused on minimal geometry and versatile brand expression.',
        problem: 'Needed a clean mark that still carries personality.',
        process: 'Created multiple icon/treatment variants and tested visual consistency.',
        result: 'A flexible identity direction suitable for digital-first branding.',
        tools: ['Illustrator']
      },
      {
        id: '931-local',
        title: '931 Local',
        short: 'Local-first branding concept with approachable visual language.',
        overview: 'Concept identity built around community energy and bold readability.',
        problem: 'Needed to blend local personality with professional polish.',
        process: 'Explored lockups and icon treatments for signage and digital use.',
        result: 'A warm identity concept with strong usability across brand touchpoints.',
        tools: ['Illustrator']
      },
      {
        id: 'friends-of-the',
        title: 'Friends of the',
        short: 'Community-oriented logo concept series.',
        overview: 'Brand mark studies exploring trust, accessibility, and clean composition.',
        problem: 'Needed visual warmth while staying clear at smaller scales.',
        process: 'Tested rounded geometry and typographic pairings.',
        result: 'Foundational direction for a flexible community brand identity.',
        tools: ['Illustrator']
      }
    ]
  },
  {
    id: 'other-projects',
    name: 'Other Projects',
    projects: [
      {
        id: 'ganja-goddess-package',
        title: 'Ganja Goddess Package',
        short: 'Packaging design concept focused on shelf presence and mood.',
        image: '/Posters/GanjaGoddess/GanjaGoddess.png',
        overview: 'Packaging study blending tone, readability, and product-focused hierarchy.',
        problem: 'Needed visual impact without sacrificing legibility and clarity.',
        process: 'Explored color systems, typography balance, and print-facing composition.',
        result: 'A bold packaging concept ready for further production refinement.',
        tools: ['Illustrator', 'Layout Design']
      },
      {
        id: 'invitations',
        title: 'Invitations',
        short: 'Invitation design collection with varied event styles.',
        overview: 'A set of invitation pieces tailored to theme-specific visual language.',
        problem: 'Needed uniqueness per invite while maintaining clean communication hierarchy.',
        process: 'Built compositional templates and refined typography for readability.',
        result: 'Polished invitation designs with strong tone matching.',
        tools: ['Illustrator', 'Typography']
      },
      {
        id: 'riotfest-campaign',
        title: 'Riotfest Campaign',
        short: 'Event campaign visuals with high-energy brand direction.',
        image: '/Posters/Riotfest/riotfest.png',
        overview: 'Campaign-style design work for an event identity concept.',
        problem: 'Needed to unify multiple campaign assets under one recognizable look.',
        process: 'Developed campaign motifs, poster direction, and visual hierarchy rules.',
        result: 'A cohesive campaign concept with punchy visual impact.',
        tools: ['Illustrator', 'Campaign Design']
      },
      {
        id: 'women-helping-women',
        title: 'Women Helping Women Campaign',
        short: 'Awareness campaign visuals centered on clarity and advocacy.',
        image: '/Posters/WHWFCampaign/WHWF-CampaignPoster-1.png',
        overview: 'Campaign concept designed to communicate mission and encourage engagement.',
        problem: 'Needed an emotional yet clear visual system for messaging.',
        process: 'Structured message hierarchy, refined typography, and iterated poster treatments.',
        result: 'An advocacy-focused visual set with clear communication and strong tone.',
        tools: ['Illustrator', 'Poster Design']
      },
      {
        id: 'infographic-design',
        title: 'Infographic Design',
        short: 'Data storytelling through accessible visual communication.',
        image: '/Posters/Infographic/Infographic.png',
        overview: 'Infographic project translating complex information into clear visual structure.',
        problem: 'Dense data needed to be readable and engaging at a glance.',
        process: 'Mapped information tiers and built visual cues for fast comprehension.',
        result: 'A concise infographic layout with strong hierarchy and readability.',
        tools: ['Illustrator', 'Information Design']
      }
    ]
  }
];

const allProjects = projectCategories.flatMap((category) =>
  category.projects.map((project) => ({ ...project, categoryName: category.name }))
);

function setActiveNav(section) {
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });
}

function resolveProjectImage(path) {
  if (!path) return '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return encodeURI(`../assets/portfolio${normalized}`);
}

function resolveProjectUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return encodeURI(`../assets/portfolio${path.startsWith('/') ? path : `/${path}`}`);
}

function showPanel(panelName, navSection = null) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === panelName);
  });

  if (navSection) {
    setActiveNav(navSection);
  } else {
    navButtons.forEach((btn) => btn.classList.remove('active'));
  }
}

function openProjectDetail(projectId) {
  const selected = allProjects.find((project) => project.id === projectId);
  if (!selected) return;

  projectDetailContent.innerHTML = `
    <p class="eyebrow">${selected.categoryName}</p>
    <h2>${selected.title}</h2>
    ${selected.year ? `<p><strong>Year:</strong> ${selected.year}</p>` : ''}
    <h3>Overview</h3>
    <p>${selected.overview}</p>
    <h3>Problem</h3>
    <p>${selected.problem}</p>
    <h3>Process</h3>
    <p>${selected.process}</p>
    <h3>Final Result</h3>
    <p>${selected.result}</p>
    <h3>Tools Used</h3>
    <ul>${selected.tools.map((tool) => `<li>${tool}</li>`).join('')}</ul>
    ${selected.url ? `<p><a class="detail-link" href="${resolveProjectUrl(selected.url)}" target="_blank" rel="noreferrer">Open Live Project</a></p>` : ''}
    ${selected.pages
      ? `<h3>Project Pages</h3><ul>${selected.pages
          .map((page) => `<li><a class="detail-link" href="${resolveProjectUrl(page.url)}" target="_blank" rel="noreferrer">${page.label}</a></li>`)
          .join('')}</ul>`
      : ''}
  `;
  showPanel('project-detail', 'projects');
}

function renderProjectSections() {
  projectSections.innerHTML = projectCategories
    .map(
      (category, index) => `
        <section class="project-category ${index === 0 ? 'open' : ''}" data-category="${category.id}">
          <button class="category-toggle" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
            <span>${category.name}</span>
            <small>${category.projects.length} projects</small>
          </button>
          <div class="project-grid">
            ${category.projects
              .map(
                (project) => `
                  <button class="project-card" type="button" data-project-id="${project.id}" aria-label="Open ${project.title}">
                    <div class="project-thumb">
                      ${project.image ? `<img src="${resolveProjectImage(project.image)}" alt="${project.title} preview" loading="lazy" />` : ''}
                    </div>
                    <div class="project-meta">
                      <h4>${project.title}</h4>
                      <p>${project.short}</p>
                    </div>
                  </button>
                `
              )
              .join('')}
          </div>
        </section>
      `
    )
    .join('');

  projectSections.querySelectorAll('.category-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const categoryElement = toggle.closest('.project-category');
      const isOpen = categoryElement.classList.contains('open');
      categoryElement.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  projectSections.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
      openProjectDetail(card.dataset.projectId);
    });
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    showPanel(btn.dataset.section, btn.dataset.section);
  });
});

jumpToProjects.addEventListener('click', () => {
  showPanel('projects', 'projects');
});

backToProjects.addEventListener('click', () => {
  showPanel('projects', 'projects');
});

renderProjectSections();
showPanel('home');
