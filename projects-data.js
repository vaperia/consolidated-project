const projects = {
  trolley: {
    title: "Autonomous Smart Trolley System — Capstone Project",
    type: "Capstone Project",
    status: "In Progress",
    category: "Robotics · Autonomous Systems · Sensor Integration",
    summary:
      "Indoor autonomous trolley with user-following and point-to-point delivery modes using UWB, LiDAR, IMU, wheel encoders and depth sensing.",
    overview:
      "This capstone project focuses on developing an indoor autonomous trolley that can either follow a user or navigate to a target location. The system combines user tracking, autonomous navigation, mapping, perception and safety behaviour.",
    goal:
      "The goal is to reduce manual effort when transporting heavy or bulky items by creating a trolley that can safely follow a user and support autonomous indoor delivery.",
    development: [
      "Built and tuned a UWB-based follow-me subsystem for estimating user distance and direction.",
      "Developed filtering and motion-control logic to improve tracking stability, reduce drift, recover the target and turn toward a user positioned behind the trolley.",
      "Developed motor-control logic and integrated user-position estimates with vehicle movement.",
      "Integrated LiDAR for obstacle detection and 2D mapping.",
      "Planned fusion of IMU and wheel-encoder odometry to improve localization and navigation stability.",
      "Integrated a depth camera for human confirmation, environmental perception and additional safety awareness.",
      "Applied safety logic so motion can be stopped or restricted when obstacles, unreliable tracking or emergency conditions are detected."
    ],
    challenges: [
      "Maintaining stable user tracking while the user and trolley are both moving.",
      "Combining several sensors with different noise characteristics and update behaviour.",
      "Ensuring autonomous movement remains safe when perception or tracking becomes unreliable."
    ],
    contribution: [
      "Designed and developed the UWB follow-me subsystem.",
      "Developed motion-control logic for following behaviour.",
      "Worked on LiDAR, depth-camera and localization integration.",
      "Applied sensor-fusion and safety concepts across the system."
    ],
    learning: [
      "Strengthened practical ROS2 and autonomous-system integration skills.",
      "Improved understanding of sensor fusion, localization and navigation stability.",
      "Developed experience debugging interactions between perception, control and physical system behaviour."
    ],
    skills: [
      "ROS2",
      "Nav2",
      "UWB",
      "LiDAR",
      "IMU",
      "Depth Camera",
      "Sensor Fusion",
      "Autonomous Navigation"
    ],
    source: "#",
    documentation: "#",
    video: ""
  },

  tourism: {
    title: "Database Tourism Application with NLP using SpaCy — SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Full Stack · Database · NLP",
    summary:
      "Tourism web application using MySQL, Firestore, Node.js, Python and SpaCy to manage tourism data and support intelligent user interaction.",
    overview:
      "This project involved developing a tourism web application with database-management functionality, backend services and SpaCy-based NLP features.",
    goal:
      "The goal was to create an integrated application where tourism data could be stored, retrieved, updated and presented through a responsive web workflow.",
    development: [
      "Developed database-management functionality using MySQL and Firestore for user, destination, review and application data.",
      "Designed application workflows connecting front-end components with backend services and database operations.",
      "Integrated SpaCy-based natural-language processing and intelligent features.",
      "Used JavaScript, Node.js and Python to support front-end/back-end integration and persistent data storage."
    ],
    challenges: [
      "Coordinating relational and NoSQL data within one application.",
      "Integrating Python NLP functionality into a JavaScript/Node.js application.",
      "Debugging workflows across front-end, backend, database and NLP components."
    ],
    contribution: [
      "Worked on application workflows linking front-end and backend components.",
      "Worked with MySQL and Firestore database operations.",
      "Integrated SpaCy-based NLP functionality."
    ],
    learning: [
      "Gained practical experience with relational and NoSQL databases.",
      "Improved understanding of full-stack application architecture.",
      "Strengthened debugging across multiple application layers."
    ],
    skills: [
      "JavaScript",
      "Node.js",
      "Python",
      "MySQL",
      "Firestore",
      "SpaCy",
      "Full Stack"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/Database/Tourism%20Webpage%20project/TourismSG-main",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/blob/main/Database/Tourism%20Webpage%20project/Tourism%20web%20page%20guide.pdf",
    video: "https://www.youtube.com/embed/v_CCZWeDJb0"
  },

  network: {
    title: "Smart Home Network & IoT System — Computer Networks Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Computer Networks · IoT",
    summary:
      "Smart-home networking project covering LAN/WLAN, switching, IP routing, transport-layer communication, sockets and IoT protocols.",
    overview:
      "This project applied networking fundamentals to a smart-home environment containing wired and wireless networking, routing, transport-layer communication and IoT application protocols.",
    goal:
      "The goal was to understand how switching, routing, transport, sockets and application protocols work together in an end-to-end IoT network.",
    development: [
      "Applied wired and wireless LAN concepts.",
      "Worked with LAN switching, IP addressing, packet forwarding and routing.",
      "Applied transport-layer concepts to end-to-end communication.",
      "Used IoT and socket-programming concepts for communication between devices, clients and services.",
      "Applied application-layer and IoT application-layer protocol concepts."
    ],
    challenges: [
      "Tracing communication issues across multiple network layers.",
      "Connecting theoretical networking concepts with end-to-end IoT behaviour."
    ],
    contribution: [
      "Applied networking concepts to the smart-home communication design.",
      "Worked with socket and IoT communication concepts."
    ],
    learning: [
      "Developed an end-to-end understanding of layered network communication.",
      "Improved network troubleshooting and IoT communication reasoning."
    ],
    skills: [
      "Networking",
      "LAN",
      "WLAN",
      "Switching",
      "Routing",
      "Socket Programming",
      "IoT"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/computer%20network/Smart%20Home",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/tree/main/computer%20network",
    video: "https://www.youtube.com/embed/ida8A7suqdM"
  },

  os: {
    title: "OSEK Traffic Light Control System — Operating Systems Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Operating Systems · OSEK",
    summary:
      "Traffic-light control system developed and simulated in an OSEK-based operating-system environment using SimuOSEK.",
    overview:
      "This project involved developing and simulating a traffic-light control system in an OSEK environment.",
    goal:
      "The goal was to apply task-based execution and system-configuration concepts to coordinate traffic-light control behaviour.",
    development: [
      "Developed and simulated the traffic-light control system using SimuOSEK.",
      "Applied task-based execution and OSEK system-configuration concepts.",
      "Tested and debugged interactions between application logic and OSEK configuration.",
      "Documented the final implementation in a technical report."
    ],
    challenges: [
      "Understanding how task execution and configuration affect application behaviour.",
      "Debugging timing and configuration issues in a simulated operating-system environment."
    ],
    contribution: [
      "Worked with OSEK project code and configuration.",
      "Participated in implementation, simulation, testing and documentation."
    ],
    learning: [
      "Improved understanding of task-based operating-system execution.",
      "Gained experience using simulation to evaluate control-system behaviour."
    ],
    skills: [
      "OSEK",
      "SimuOSEK",
      "Operating Systems",
      "Task Execution",
      "System Configuration"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/Operating%20system%20project/Group14_OS_Project/OSEK-GroupProject",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/blob/main/Operating%20system%20project/Group14_OS_Project/Operating%20System%20Group%2014%20Project%20Report.pdf",
    video: "https://www.youtube.com/embed/vEEoiYaisoI"
  },

  robot: {
    title: "Intelligent Autonomous Robot — Integrative Team Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "ROS2 · Autonomous Navigation · Computer Vision",
    summary:
      "Autonomous robot using ROS2, Nav2, SLAM and YOLOv8 for navigation, localization, obstacle avoidance and traffic-sign perception.",
    overview:
      "This team project focused on integrating navigation, mapping, localization and perception into an autonomous robot.",
    goal:
      "The goal was to achieve robust end-to-end autonomous robot behaviour by combining ROS2 navigation with environment perception.",
    development: [
      "Led development of the autonomous navigation module in ROS2.",
      "Designed and implemented a Nav2-based navigation stack with SLAM-based localization, path planning and obstacle avoidance.",
      "Integrated YOLOv8 traffic-sign detection with perception and mapping modules.",
      "Coordinated integration and debugging across navigation, mapping, localization and perception components."
    ],
    challenges: [
      "Integrating independently developed modules into one autonomous system.",
      "Debugging interactions between navigation, localization and perception."
    ],
    contribution: [
      "Led autonomous navigation development.",
      "Implemented Nav2 and SLAM-based navigation.",
      "Integrated YOLOv8 traffic-sign perception.",
      "Coordinated system integration and debugging."
    ],
    learning: [
      "Strengthened ROS2 system-integration skills.",
      "Developed practical experience with Nav2, SLAM and autonomous navigation.",
      "Improved team-level integration and debugging skills."
    ],
    skills: [
      "ROS2",
      "Nav2",
      "SLAM",
      "YOLOv8",
      "Path Planning",
      "Obstacle Avoidance"
    ],
    source: "#",
    documentation: "#",
    video: ""
  },

  logistics: {
    title: "Logistics Scheduling System — Object-Oriented Programming Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "C++ · Object-Oriented Programming",
    summary:
      "C++ logistics scheduling system using encapsulation, inheritance, polymorphism, class-based design and UML.",
    overview:
      "This project involved designing and implementing a logistics scheduling system in C++ using object-oriented programming principles.",
    goal:
      "The goal was to model real-world logistics entities and relationships in a maintainable, scalable object-oriented system.",
    development: [
      "Designed and implemented the scheduling system in C++.",
      "Used encapsulation, inheritance, polymorphism and class-based design.",
      "Contributed to UML class-diagram design and refinement.",
      "Maintained consistency between system design and implementation."
    ],
    challenges: [
      "Representing real-world entities and relationships cleanly in an object model.",
      "Keeping UML design and implementation consistent as the system evolved."
    ],
    contribution: [
      "Implemented core C++ classes and functionality.",
      "Contributed to UML design and refinement."
    ],
    learning: [
      "Improved object-oriented software-design skills.",
      "Strengthened understanding of maintainability, scalability and design modelling."
    ],
    skills: [
      "C++",
      "OOP",
      "UML",
      "Encapsulation",
      "Inheritance",
      "Polymorphism"
    ],
    source: "#",
    documentation: "#",
    video: ""
  },

  chatbot: {
    title: "AI Chatbot with OpenAI — Programming Fundamentals Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Python · Flask · APIs · SQLite",
    summary:
      "Python and Flask chatbot using OpenAI APIs, real-time weather integration and SQLite data persistence.",
    overview:
      "This project involved building a Python chatbot with Flask, OpenAI API communication, external weather data and SQLite persistence.",
    goal:
      "The goal was to build an interactive chatbot that could extend its core conversational capabilities using external APIs and persistent application data.",
    development: [
      "Built core chatbot functionality using Python and Flask to communicate with OpenAI APIs.",
      "Integrated external APIs including real-time weather data.",
      "Managed application data using SQLite and query/data-handling logic.",
      "Collaborated on deployment groundwork, debugging and additional application functionality."
    ],
    challenges: [
      "Handling external API responses reliably.",
      "Coordinating chatbot logic, Flask application behaviour and persistent data."
    ],
    contribution: [
      "Built core chatbot functionality.",
      "Integrated external APIs.",
      "Worked with SQLite query and data handling.",
      "Contributed to debugging and deployment groundwork."
    ],
    learning: [
      "Improved Python application-development skills.",
      "Gained experience with API integration and persistent storage."
    ],
    skills: [
      "Python",
      "Flask",
      "OpenAI API",
      "SQLite",
      "REST/API Integration"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/programming%20fundamental/AI%20chatbot/LAB_P11_1_Source_Code",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/blob/main/programming%20fundamental/AI%20chatbot/LAB-P11%20-%201_Proposal.docx",
    video: "https://www.youtube.com/embed/DQ0ObN1qxto"
  },

  cdb: {
    title: "C Database Management System — Programming Fundamentals Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "C · Memory Management · Debugging",
    summary:
      "Simple database-management program in C focused on functions, arrays, pointers, standard-library functions and dynamic memory.",
    overview:
      "This project was a C programming exercise focused on building and debugging a simple database-management program.",
    goal:
      "The goal was to strengthen understanding of core C concepts including functions, arrays, pointers and memory management.",
    development: [
      "Developed and debugged the database-management program in C.",
      "Applied functions, arrays, pointers and dynamic memory management.",
      "Used standard C library functions including strcpy, printf and malloc.",
      "Troubleshot function logic, pointer usage and array behaviour."
    ],
    challenges: [
      "Debugging pointer and dynamic-memory errors.",
      "Understanding how function logic and memory behaviour affect program reliability."
    ],
    contribution: [
      "Developed and debugged the program.",
      "Researched and applied standard C library functions."
    ],
    learning: [
      "Strengthened C fundamentals.",
      "Improved debugging of pointers, arrays and dynamic memory."
    ],
    skills: [
      "C",
      "Pointers",
      "Arrays",
      "malloc",
      "Memory Management",
      "Debugging"
    ],
    source: "#",
    documentation: "#",
    video: ""
  },

  dsa: {
    title: "Data Structures & Algorithms Project — INF1008, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Algorithms · Data Structures",
    summary:
      "INF1008 team project applying data-structure and algorithm concepts in a shared implementation with testing and technical documentation.",
    overview:
      "This team project applied data-structure and algorithm concepts in a larger implementation and documented the technical approach and results.",
    goal:
      "The goal was to translate algorithmic and data-structure concepts into a working team implementation.",
    development: [
      "Applied data-structure and algorithm concepts within a team implementation.",
      "Contributed to testing and integration across a shared codebase.",
      "Evaluated approaches for representing and processing information.",
      "Contributed to technical documentation."
    ],
    challenges: [
      "Balancing implementation correctness, maintainability and team integration.",
      "Selecting appropriate approaches for representing and processing information."
    ],
    contribution: [
      "Contributed to implementation, testing, integration and documentation."
    ],
    learning: [
      "Improved structured reasoning about data structures and algorithms.",
      "Gained experience integrating work in a shared codebase."
    ],
    skills: [
      "Algorithms",
      "Data Structures",
      "Problem Solving",
      "Team Development"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/data%20structure%20and%20algo/INF1008_P3_Team01",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/blob/main/data%20structure%20and%20algo/INF1008_P3_Team01_Report.pdf",
    video: ""
  },

  embedded: {
    title: "Embedded System Smart Bin Project — Embedded Systems Project, SIT",
    type: "Academic Project",
    status: "Completed",
    category: "Embedded Systems",
    summary:
      "Embedded smart-bin system combining software control logic, physical hardware behaviour, system integration, testing and debugging.",
    overview:
      "This project involved developing an embedded smart-bin system where software logic interacted directly with physical hardware behaviour.",
    goal:
      "The goal was to integrate and test an embedded system that operated reliably as a complete hardware/software solution.",
    development: [
      "Contributed to embedded software control logic.",
      "Participated in hardware/software integration.",
      "Performed system testing and debugging using both program output and physical device behaviour.",
      "Worked with the team to evaluate system reliability and document the final implementation."
    ],
    challenges: [
      "Distinguishing hardware issues from software issues during debugging.",
      "Evaluating the complete integrated system rather than isolated code."
    ],
    contribution: [
      "Contributed to implementation, integration, testing and debugging."
    ],
    learning: [
      "Strengthened hardware/software integration skills.",
      "Improved embedded-system debugging and system-level troubleshooting."
    ],
    skills: [
      "Embedded Systems",
      "Hardware / Software Integration",
      "Debugging",
      "System Testing"
    ],
    source:
      "https://github.com/vaperia/school-consolidated-project/tree/main/embedded%20project/Group_10_Codes",
    documentation:
      "https://github.com/vaperia/school-consolidated-project/blob/main/embedded%20project/Group_10_report.pdf",
    video: "https://www.youtube.com/embed/Z_uJ-1ZxX9A"
  },

  trading: {
    title: "Trading Journal — Personal Full-Stack Project",
    type: "Personal Project",
    status: "Offline",
    category: "Full Stack Development",
    summary:
      "Database-backed trading-journal application for recording trades and supporting structured review of past trading activity.",
    overview:
      "This personal project explored end-to-end development of a database-backed trading journal, including application logic, persistent data, deployment and operation.",
    goal:
      "The goal was to create a structured way to record and review trades while gaining practical experience operating a complete software product.",
    development: [
      "Designed and developed the application as a personal full-stack project.",
      "Worked across application logic and persistent data storage.",
      "Previously deployed and operated the hosted version.",
      "Evaluated the ongoing cost of keeping the application online."
    ],
    challenges: [
      "Structuring data for consistent trade review.",
      "Balancing useful functionality with ongoing hosting cost."
    ],
    contribution: [
      "Designed, developed, deployed and operated the project independently."
    ],
    learning: [
      "Improved full-stack development and database-backed application design.",
      "Learned to consider deployment, operating cost and maintainability."
    ],
    skills: [
      "Full Stack",
      "Database Design",
      "Deployment",
      "Application Design",
      "Cost Awareness"
    ],
    source: "#",
    documentation: "#",
    video: ""
  },

  hobby: {
    title: "Hobby Carousel Webpage — Personal Frontend Project",
    type: "Personal Project",
    status: "In Progress",
    category: "Frontend Development",
    summary:
      "Interactive carousel-style webpage for presenting and exploring hobbies using JavaScript, responsive design and UI/UX iteration.",
    overview:
      "This ongoing personal frontend project explores interactive presentation, responsive behaviour and user-experience decisions through a carousel-style interface.",
    goal:
      "The goal is to create an engaging and responsive interface for presenting and exploring hobbies.",
    development: [
      "Developing JavaScript-based carousel interaction.",
      "Iterating on navigation, responsive behaviour and interface structure.",
      "Testing usability across different screen sizes."
    ],
    challenges: [
      "Maintaining usability across different screen sizes.",
      "Balancing visual presentation with simple navigation."
    ],
    contribution: [
      "Designed and developed the project independently."
    ],
    learning: [
      "Strengthening practical frontend development and UI/UX reasoning.",
      "Improving responsive-design and independent product-iteration skills."
    ],
    skills: [
      "JavaScript",
      "Frontend",
      "Responsive UI",
      "UX",
      "Web Development"
    ],
    source: "#",
    documentation: "#",
    video: ""
  }
};
