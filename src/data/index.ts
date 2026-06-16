export const projects = [
  {
    id: 1,
    title: "Appointment Booking & Admin Dashboard System",
    status: 'Featured Project',
    statusType: 'featured',
    description: 'A full-stack web application for appointment scheduling and management. Built with a focus on scalability, real-time data, and smooth UX across all devices.',
    features: ['Appointment scheduling', 'Dynamic time-slot allocation', 'REST API integration', 'MongoDB database operations', 'Performance optimization'],
    tech: ['React.js', 'Node.js', 'MongoDB', 'REST APIs'],
    demo: 'https://glowbeautyabs.netlify.app/',
    github: 'https://github.com/rosamystica14/glowbeauty',
    linkedinPost: "https://www.linkedin.com/feed/update/urn:li:activity:7468889270175432704/",
    screenshots: [],
  },
  {
    id: 2,
    title: 'AI Medical Chatbot',
    status: 'Internship Project',
    statusType: 'internship',
    description: 'An AI-powered medical chatbot built during internship using NLP and Streamlit for real-time medical query handling.',
    features: ['Real-time query handling', 'Intent recognition', 'Keyword extraction', 'Analytics dashboard', 'User engagement monitoring'],
    tech: ['Python', 'Streamlit', 'NLP'],
    demo: null,
    github: null,
    linkedinPost: 'https://www.linkedin.com/feed/update/urn:li:activity:7469980972193837056/',
    screenshots: [],
  },
  {
    id: 3,
    title: 'Zoho BreakBuddy',
    status: 'Product Prototype',
    statusType: 'prototype',
    description: 'A productivity bot built on Zoho Cliq that helps remote teams maintain healthy work habits through automated break reminders and analytics.',
    features: ['Automated break cycle management', 'Daily wellness reports', 'Break analytics dashboard', 'Zoho Cliq bot integration', 'Custom interval configuration', 'Deluge scripting backend'],
    tech: ['Zoho Cliq', 'Deluge'],
    demo: null,
    github: null,
    linkedinPost: null,
    screenshots: ['/screenshots/bb-1.png','/screenshots/bb-2.png','/screenshots/bb-3.png','/screenshots/bb-4.png','/screenshots/bb-5.png','/screenshots/bb-6.png'],
  },
  {
    id: 4,
    title: 'SR Restaurant Website',
    status: 'AI-Assisted Prototype',
    statusType: 'ai-prototype',
    description: 'A modern restaurant website prototype created using AI-assisted development and customized for an engaging dining experience with admin management.',
    features: ['Multi-page restaurant site', 'Dynamic menu with filters', 'Gallery with categories', 'Admin dashboard', 'Contact & reservation form'],
    tech: ['HTML', 'CSS', 'JavaScript', 'Bolt AI'],
    demo: null,
    github: null,
    linkedinPost: null,
    screenshots: ['/screenshots/rs-1.png','/screenshots/rs-2.png','/screenshots/rs-3.png','/screenshots/rs-4.png','/screenshots/rs-5.png','/screenshots/rs-6.png','/screenshots/rs-7.png'],
  },
];

export const skills = {
  Programming: [
    { name: 'Java', icon: '☕' },
    { name: 'Python', icon: '🐍' },
    { name: 'JavaScript', icon: '⚡' },
  ],
  Frontend: [
    { name: 'React.js', icon: '⚛️' },
    { name: 'HTML5', icon: '🔶' },
    { name: 'CSS3', icon: '🎨' },
    { name: 'Tailwind CSS', icon: '💨' },
  ],
  Backend: [
    { name: 'Node.js', icon: '🟢' },
    { name: 'Spring Boot', icon: '🍃' },
    { name: 'REST APIs', icon: '🔗' },
    { name: 'PHP', icon: '🐘' },
  ],
  Database: [
    { name: 'MongoDB', icon: '🍃' },
    { name: 'MySQL', icon: '🐬' },
    { name: 'SQL', icon: '📊' },
  ],
  'AI & GenAI': [
    { name: 'Generative AI', icon: '🤖' },
    { name: 'Prompt Engineering', icon: '✨' },
    { name: 'NLP', icon: '💬' },
    { name: 'Machine Learning', icon: '🧠' },
    { name: 'Pandas', icon: '🐼' },
    { name: 'NumPy', icon: '🔢' },
  ],
};

export const certifications = [
  { name: 'Artificial Intelligence Primer', issuer: 'Infosys', color: '#7c3aed' },
  { name: 'Principles of Generative AI', issuer: 'Infosys', color: '#06b6d4' },
  { name: 'Java Certification', issuer: 'AL-Salaam Institution', color: '#4f46e5' },
  { name: 'Web Development Certification', issuer: 'AL-Salaam Institution', color: '#7c3aed' },
];

export const journey = [
  {
    year: '2022',
    icon: '🎓',
    color: '#7c3aed',
    title: 'Started B.E. Computer Science Engineering',
    subtitle:
      'Began my engineering journey at Grace College of Engineering, Thoothukudi, building a strong foundation in programming and computer science concepts.',
    tags: ['Computer Science', 'Problem Solving'],
  },

  {
    year: '2023',
    icon: '☕',
    color: '#8b5cf6',
    title: 'Started Learning Core Java',
    subtitle:
      'Learned object-oriented programming, data structures, and application development fundamentals at Al Salaam Computer Institution.',
    tags: ['Core Java', 'OOP'],
  },

  {
    year: '2024',
    icon: '💻',
    color: '#06b6d4',
    title: 'Entered Web Development',
    subtitle:
      'Explored full web development fundamentals through HTML, CSS, JavaScript, PHP, and SQL while building interactive web applications.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL'],
  },

  {
    year: '2025',
    icon: '🤖',
    color: '#0ea5e9',
    title: 'Data Science Internship',
    subtitle:
      'Completed an internship at NullClass where I worked on an AI-powered Medical Chatbot project involving machine learning concepts and chatbot development.',
    tags: ['Python', 'Data Science', 'AI Chatbot', 'Machine Learning'],
  },

  {
    year: '2025',
    icon: '🏆',
    color: '#14b8a6',
    title: 'Hackathon Journey',
    subtitle:
      'Actively participated in Zoho Hackathon and Smart India Hackathon, gaining real-world problem-solving and team collaboration experience.',
    tags: ['Zoho Hackathon', 'SIH', 'Teamwork', 'Innovation'],
  },

  {
    year: '2025',
    icon: '⚛️',
    color: '#22c55e',
    title: 'Started MERN Stack Development',
    subtitle:
      'Focused on self-learning modern full-stack development using React, Tailwind CSS, Node.js, Express.js, and MongoDB.',
    tags: ['React.js', 'Tailwind CSS', 'Node.js', 'MongoDB'],
  },

  {
    year: '2026',
    icon: '📅',
    color: '#f59e0b',
    title: 'Built Glow Beauty Appointment Booking System',
    subtitle:
      'Developed a full-stack appointment booking platform with scheduling, API integration, database management, and responsive user experience.',
    tags: ['MERN Stack', 'REST APIs', 'Database Design'],
  },

  {
    year: '2026',
    icon: '🎉',
    color: '#ef4444',
    title: 'Graduated in Computer Science Engineering',
    subtitle:
      'Successfully completed B.E. Computer Science Engineering and prepared to begin a professional software development career.',
    tags: ['B.E CSE', 'Graduation', 'Software Development'],
    active: true,
  },
];