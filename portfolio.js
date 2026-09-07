const projects = {
  trading: {
    title: "Trading Journal",
    type: "Personal Project",
    status: "Offline",
    summary:
      "A personal trading-journal application built to record trades and support structured review. The hosted version was later shut down because the ongoing operating cost was not worthwhile for a personal project.",
    skills: [
      "Full Stack",
      "Database Design",
      "Deployment",
      "Cost Awareness"
    ],
    source: "#",
    detail: "#"
  },

  tourism: {
    title: "Tourism Web Application with NLP",
    type: "Academic Project",
    status: "Completed",
    summary:
      "Full-stack tourism application combining MySQL, Firestore, Node.js, Python and SpaCy-based NLP features.",
    skills: [
      "Node.js",
      "Python",
      "MySQL",
      "Firestore",
      "SpaCy"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/Database/Tourism%20Webpage%20project/TourismSG-main",
    detail:
      "https://github.com/vaperia/school-consolidated-project/blob/main/Database/Tourism%20Webpage%20project/Tourism%20web%20page%20guide.pdf"
  },

  chatbot: {
    title: "AI Chatbot",
    type: "Academic Project",
    status: "Completed",
    summary:
      "Python chatbot application with modular GUI, chatbot logic, SQLite persistence and external API integration.",
    skills: [
      "Python",
      "SQLite",
      "APIs",
      "GUI"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/programming%20fundamental/AI%20chatbot/LAB_P11_1_Source_Code",
    detail:
      "https://github.com/vaperia/school-consolidated-project/blob/main/programming%20fundamental/AI%20chatbot/LAB-P11%20-%201_Proposal.docx"
  },

  hobby: {
    title: "Hobby Carousel Webpage",
    type: "Personal Project",
    status: "In Progress",
    summary:
      "An in-progress personal web project focused on presenting and discovering hobbies through a carousel-style interface.",
    skills: [
      "Frontend",
      "JavaScript",
      "Responsive UI",
      "UX"
    ],
    source: "#",
    detail: "#"
  },

  network: {
    title: "Smart Home Network & IoT System",
    type: "Academic Project",
    status: "Completed",
    summary:
      "Smart-home networking coursework covering LAN/WLAN, switching, routing, sockets and IoT application-layer communication.",
    skills: [
      "Networking",
      "IoT",
      "Routing",
      "Socket Programming"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/computer%20network/Smart%20Home",
    detail:
      "https://github.com/vaperia/school-consolidated-project/tree/main/computer%20network"
  },

  os: {
    title: "OSEK Operating Systems Project",
    type: "Academic Project",
    status: "Completed",
    summary:
      "OSEK-based operating-systems coursework with source code, SimuOSEK configuration and a technical report.",
    skills: [
      "OSEK",
      "Operating Systems",
      "Simulation",
      "Systems"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/Operating%20system%20project/Group14_OS_Project/OSEK-GroupProject",
    detail:
      "https://github.com/vaperia/school-consolidated-project/blob/main/Operating%20system%20project/Group14_OS_Project/Operating%20System%20Group%2014%20Project%20Report.pdf"
  },

  dsa: {
    title: "Data Structures & Algorithms Project",
    type: "Academic Project",
    status: "Completed",
    summary:
      "INF1008 team implementation supported by a full technical report.",
    skills: [
      "Algorithms",
      "Data Structures",
      "Problem Solving",
      "Team Development"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/data%20structure%20and%20algo/INF1008_P3_Team01",
    detail:
      "https://github.com/vaperia/school-consolidated-project/blob/main/data%20structure%20and%20algo/INF1008_P3_Team01_Report.pdf"
  },

  embedded: {
    title: "Embedded Systems Group Project",
    type: "Academic Project",
    status: "Completed",
    summary:
      "Embedded-systems coursework with source code and a formal technical report.",
    skills: [
      "Embedded Systems",
      "System Integration",
      "Debugging",
      "Hardware / Software"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/embedded%20project/Group_10_Codes",
    detail:
      "https://github.com/vaperia/school-consolidated-project/blob/main/embedded%20project/Group_10_report.pdf"
  }
};

const profiles = {
  general: {
    label: "Computer Engineering Portfolio",
    title:
      "Engineering projects built across software and systems.",
    copy:
      "A balanced portfolio covering software development, databases, networking, operating systems, embedded systems and personal product work.",
    skills: [
      "Python",
      "JavaScript",
      "C/C++",
      "SQL",
      "Node.js",
      "Databases",
      "Networking",
      "Embedded Systems"
    ],
    featured: [
      "trading",
      "tourism",
      "embedded"
    ],
    order: [
      "trading",
      "tourism",
      "chatbot",
      "hobby",
      "embedded",
      "os",
      "network",
      "dsa"
    ],
    note:
      "A broad view of both software and lower-level engineering work."
  },

  software: {
    label: "Software Engineering Portfolio",
    title:
      "Software projects focused on building usable applications.",
    copy:
      "Selected projects emphasizing application development, APIs, databases, modular software design and practical problem solving.",
    skills: [
      "Python",
      "JavaScript",
      "Node.js",
      "APIs",
      "SQL",
      "Databases",
      "Full Stack"
    ],
    featured: [
      "trading",
      "tourism",
      "chatbot"
    ],
    order: [
      "trading",
      "tourism",
      "chatbot",
      "hobby",
      "dsa",
      "network",
      "os",
      "embedded"
    ],
    note:
      "Software-heavy projects are surfaced first, while systems work remains available below."
  },

  backend: {
    label: "Backend Engineering Portfolio",
    title:
      "Backend and data-focused projects built around services and persistence.",
    copy:
      "Projects emphasizing backend logic, APIs, SQL/NoSQL storage, data handling and application architecture.",
    skills: [
      "Node.js",
      "Python",
      "MySQL",
      "Firestore",
      "SQLite",
      "APIs",
      "Backend Architecture"
    ],
    featured: [
      "trading",
      "tourism",
      "chatbot"
    ],
    order: [
      "trading",
      "tourism",
      "chatbot",
      "dsa",
      "os",
      "network",
      "hobby",
      "embedded"
    ],
    note:
      "Projects are ordered around backend, database and data-processing relevance."
  },

  frontend: {
    label: "Frontend Engineering Portfolio",
    title:
      "Frontend projects focused on interaction, usability and product experience.",
    copy:
      "Selected work emphasizing web interfaces, user-facing application flows and responsive frontend development.",
    skills: [
      "JavaScript",
      "Frontend",
      "Responsive UI",
      "UX",
      "Web Applications"
    ],
    featured: [
      "hobby",
      "tourism",
      "trading"
    ],
    order: [
      "hobby",
      "tourism",
      "trading",
      "chatbot",
      "dsa",
      "network",
      "os",
      "embedded"
    ],
    note:
      "User-facing web projects appear first; systems coursework remains available for breadth."
  },

  embedded: {
    label: "Embedded & Systems Engineering Portfolio",
    title:
      "Systems projects focused on constrained environments and integration.",
    copy:
      "Selected projects emphasizing embedded systems, operating-system concepts, networking and system-level debugging.",
    skills: [
      "Embedded Systems",
      "Operating Systems",
      "Networking",
      "IoT",
      "C/C++",
      "System Integration"
    ],
    featured: [
      "embedded",
      "os",
      "network"
    ],
    order: [
      "embedded",
      "os",
      "network",
      "dsa",
      "chatbot",
      "tourism",
      "trading",
      "hobby"
    ],
    note:
      "Embedded, operating-system and networking projects are prioritized."
  },

  robotics: {
    label: "Robotics & Systems Portfolio",
    title:
      "Engineering projects relevant to robotics, sensing and autonomous systems.",
    copy:
      "Projects are ordered toward systems, embedded, networking and algorithmic work that supports robotics engineering.",
    skills: [
      "Embedded Systems",
      "Networking",
      "Algorithms",
      "Python",
      "C/C++",
      "System Integration"
    ],
    featured: [
      "embedded",
      "network",
      "dsa"
    ],
    order: [
      "embedded",
      "network",
      "dsa",
      "os",
      "chatbot",
      "tourism",
      "trading",
      "hobby"
    ],
    note:
      "This view emphasizes the systems foundation behind robotics work."
  }
};

function getCurrentRole() {
  const params = new URLSearchParams(window.location.search);

  const role = (
    params.get("role") || "general"
  ).toLowerCase();

  if (profiles[role]) {
    return role;
  }

  return "general";
}

function createProjectCard(id, isFeatured = false) {
  const project = projects[id];

  const skillTags = project.skills
    .map(
      (skill) =>
        `<span class="tag">${skill}</span>`
    )
    .join("");

  let sourceLink = "";

  if (project.source !== "#") {
    sourceLink = `
      <a
        href="${project.source}"
        target="_blank"
        rel="noopener"
      >
        Source Code ↗
      </a>
    `;
  } else {
    sourceLink = `
      <span class="pending">
        Source link to add
      </span>
    `;
  }

  let detailLink = "";

  if (project.detail !== "#") {
    detailLink = `
      <a
        href="${project.detail}"
        target="_blank"
        rel="noopener"
      >
        Documentation ↗
      </a>
    `;
  }

  return `
    <article
      class="project-card ${
        isFeatured ? "featured" : ""
      }"
    >

      <div class="project-meta">

        <span>
          ${project.type}
        </span>

        <span class="status">
          ${project.status}
        </span>

      </div>

      <h3>
        ${project.title}
      </h3>

      <p>
        ${project.summary}
      </p>

      <div class="tags">
        ${skillTags}
      </div>

      <div class="project-links">

        ${sourceLink}

        ${detailLink}

      </div>

    </article>
  `;
}

function createProjectRow(id) {
  const project = projects[id];

  const skillTags = project.skills
    .map(
      (skill) =>
        `<span class="tag">${skill}</span>`
    )
    .join("");

  let projectLink = "";

  if (project.source !== "#") {
    projectLink = `
      <a
        href="${project.source}"
        target="_blank"
        rel="noopener"
      >
        View Project ↗
      </a>
    `;
  } else {
    projectLink = `
      <span class="pending">
        Link pending
      </span>
    `;
  }

  return `
    <article class="project-row">

      <div class="row-main">

        <div class="project-meta">

          <span>
            ${project.type}
          </span>

          <span class="status">
            ${project.status}
          </span>

        </div>

        <h3>
          ${project.title}
        </h3>

        <p>
          ${project.summary}
        </p>

      </div>

      <div class="row-tags">
        ${skillTags}
      </div>

      <div class="row-link">
        ${projectLink}
      </div>

    </article>
  `;
}

function renderPortfolio() {
  const role = getCurrentRole();

  const profile = profiles[role];

  document.title =
    `Ryan Ang | ${profile.label}`;

  document.getElementById(
    "role-label"
  ).textContent =
    profile.label;

  document.getElementById(
    "hero-title"
  ).textContent =
    profile.title;

  document.getElementById(
    "hero-copy"
  ).textContent =
    profile.copy;

  document.getElementById(
    "featured-note"
  ).textContent =
    profile.note;

  const skillsHTML = profile.skills
    .map(
      (skill) =>
        `<span class="skill-pill">${skill}</span>`
    )
    .join("");

  document.getElementById(
    "focus-skills"
  ).innerHTML =
    skillsHTML;

  const featuredHTML =
    profile.featured
      .map(
        (id) =>
          createProjectCard(id, true)
      )
      .join("");

  document.getElementById(
    "featured-projects"
  ).innerHTML =
    featuredHTML;

  const allProjectsHTML =
    profile.order
      .map(
        (id) =>
          createProjectRow(id)
      )
      .join("");

  document.getElementById(
    "all-project-list"
  ).innerHTML =
    allProjectsHTML;
}

renderPortfolio();
