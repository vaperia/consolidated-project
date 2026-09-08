const profiles = {
  general: {
    label: "Computer Engineering Portfolio",
    title: "Engineering projects built across software and systems.",
    copy:
      "A balanced portfolio covering autonomous robotics, software development, databases, networking, operating systems, embedded systems and personal product work.",
    skills: [
      "Python",
      "C/C++",
      "JavaScript",
      "SQL",
      "ROS2",
      "Node.js",
      "Networking",
      "Embedded Systems"
    ],
    featured: ["trolley", "tourism", "robot"],
    order: [
      "trolley",
      "tourism",
      "network",
      "os",
      "robot",
      "logistics",
      "chatbot",
      "cdb",
      "dsa",
      "embedded",
      "trading",
      "hobby"
    ],
    note:
      "The project names and descriptions here are aligned with the master resume."
  },

  software: {
    label: "Software Engineering Portfolio",
    title: "Software projects focused on building usable applications.",
    copy:
      "Selected projects emphasizing application development, APIs, databases, object-oriented design and practical software engineering.",
    skills: [
      "Python",
      "JavaScript",
      "C++",
      "Node.js",
      "Flask",
      "APIs",
      "SQL",
      "Databases"
    ],
    featured: ["tourism", "chatbot", "logistics"],
    order: [
      "tourism",
      "chatbot",
      "logistics",
      "trading",
      "hobby",
      "cdb",
      "dsa",
      "trolley",
      "robot",
      "network",
      "os",
      "embedded"
    ],
    note:
      "Software-focused projects are prioritized while the complete engineering portfolio remains available below."
  },

  backend: {
    label: "Backend Engineering Portfolio",
    title: "Backend and data-focused projects built around services and persistence.",
    copy:
      "Projects emphasizing backend logic, APIs, SQL/NoSQL databases, persistent storage and application architecture.",
    skills: [
      "Node.js",
      "Python",
      "Flask",
      "MySQL",
      "Firestore",
      "SQLite",
      "APIs"
    ],
    featured: ["tourism", "chatbot", "trading"],
    order: [
      "tourism",
      "chatbot",
      "trading",
      "cdb",
      "logistics",
      "dsa",
      "hobby",
      "trolley",
      "network",
      "os",
      "robot",
      "embedded"
    ],
    note:
      "Backend, database and persistent-data projects appear first."
  },

  frontend: {
    label: "Frontend Engineering Portfolio",
    title: "Frontend projects focused on interaction, usability and product experience.",
    copy:
      "Selected work emphasizing JavaScript, user-facing workflows, responsive interfaces and web application development.",
    skills: [
      "JavaScript",
      "Frontend",
      "Responsive UI",
      "UX",
      "Web Applications"
    ],
    featured: ["hobby", "tourism", "trading"],
    order: [
      "hobby",
      "tourism",
      "trading",
      "chatbot",
      "logistics",
      "cdb",
      "dsa",
      "trolley",
      "robot",
      "network",
      "os",
      "embedded"
    ],
    note:
      "User-facing web projects are prioritized for frontend applications."
  },

  embedded: {
    label: "Embedded & Systems Engineering Portfolio",
    title: "Systems projects focused on embedded integration and low-level behaviour.",
    copy:
      "Selected projects emphasizing embedded systems, operating systems, networking, robotics and system-level debugging.",
    skills: [
      "Embedded Systems",
      "C/C++",
      "OSEK",
      "Networking",
      "IoT",
      "ROS2",
      "System Integration"
    ],
    featured: ["embedded", "os", "network"],
    order: [
      "embedded",
      "os",
      "network",
      "trolley",
      "robot",
      "dsa",
      "cdb",
      "logistics",
      "chatbot",
      "tourism",
      "trading",
      "hobby"
    ],
    note:
      "Embedded, OS, networking and physical-system projects are emphasized."
  },

  robotics: {
    label: "Robotics & Autonomous Systems Portfolio",
    title: "Robotics projects focused on navigation, sensing and system integration.",
    copy:
      "Projects emphasizing ROS2, autonomous navigation, mapping, perception, sensor integration and embedded systems.",
    skills: [
      "ROS2",
      "Nav2",
      "SLAM",
      "UWB",
      "LiDAR",
      "YOLOv8",
      "Sensor Fusion",
      "C/C++"
    ],
    featured: ["trolley", "robot", "embedded"],
    order: [
      "trolley",
      "robot",
      "embedded",
      "network",
      "os",
      "dsa",
      "logistics",
      "chatbot",
      "tourism",
      "cdb",
      "trading",
      "hobby"
    ],
    note:
      "Autonomous navigation, sensing and system-integration projects are prioritized."
  }
};

function getCurrentRole() {
  const params = new URLSearchParams(window.location.search);
  const role = (params.get("role") || "general").toLowerCase();
  return profiles[role] ? role : "general";
}

function createTags(skills) {
  return skills.map(skill => `<span class="tag">${skill}</span>`).join("");
}

function createProjectCard(id) {
  const project = projects[id];
  const videoBadge = project.video
    ? `<span class="video-badge">▶ Video Demo</span>`
    : "";

  return `
    <article class="project-card featured">
      <div class="project-meta">
        <span>${project.type}</span>
        <span class="status">${project.status}</span>
      </div>

      <h3>${project.title}</h3>
      <p>${project.summary}</p>

      <div class="tags">${createTags(project.skills)}</div>
      ${videoBadge}

      <div class="project-links">
        <a class="project-detail-link" href="project.html?project=${id}">
          View Project Details →
        </a>
      </div>
    </article>
  `;
}

function createProjectRow(id) {
  const project = projects[id];
  const demoText = project.video
    ? `<span class="row-video">▶ Demo available</span>`
    : "";

  return `
    <article class="project-row">
      <div class="row-main">
        <div class="project-meta">
          <span>${project.type}</span>
          <span class="status">${project.status}</span>
        </div>

        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        ${demoText}
      </div>

      <div class="row-tags">${createTags(project.skills)}</div>

      <div class="row-link">
        <a href="project.html?project=${id}">View Details →</a>
      </div>
    </article>
  `;
}

function renderPortfolio() {
  const role = getCurrentRole();
  const profile = profiles[role];

  document.title = `Ryan Ang | ${profile.label}`;
  document.getElementById("role-label").textContent = profile.label;
  document.getElementById("hero-title").textContent = profile.title;
  document.getElementById("hero-copy").textContent = profile.copy;
  document.getElementById("featured-note").textContent = profile.note;

  document.getElementById("focus-skills").innerHTML =
    profile.skills.map(skill => `<span class="skill-pill">${skill}</span>`).join("");

  document.getElementById("featured-projects").innerHTML =
    profile.featured.map(id => createProjectCard(id)).join("");

  document.getElementById("all-project-list").innerHTML =
    profile.order.map(id => createProjectRow(id)).join("");
}

renderPortfolio();
