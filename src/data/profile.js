/**
 * Profile Data — Centralized generic demo candidate details.
 * Personalized via environment variables or direct placeholder modifications.
 * These values are used for the static /static route and seeding new accounts.
 */
export const personalInfo = {
  name: import.meta.env.VITE_PROFILE_NAME || 'Ashutosh',
  title: import.meta.env.VITE_PROFILE_TITLE || 'Software Developer',
  tagline: import.meta.env.VITE_PROFILE_TAGLINE || 'Developer | Builder | Creator',
  email: import.meta.env.VITE_PROFILE_EMAIL || 'john.doe@example.com',
  location: import.meta.env.VITE_PROFILE_LOCATION || 'San Francisco, CA',
  resumeUrl: import.meta.env.VITE_PROFILE_RESUME_URL || '',
  bio: import.meta.env.VITE_PROFILE_BIO || 'A passionate software developer focused on building clean, performant, and user-friendly applications.',
  hero: {
    eyebrow: 'Developer | Builder | Creator',
    headlinePrefix: 'Building ',
    headlineHighlight: 'great software',
    headlineSuffix: ' for the web.',
    description: 'Full-stack developer with hands-on experience building modern web applications, RESTful APIs, and responsive user interfaces.',
    availabilityStatus: 'Open to Opportunities',
    stats: [
      { value: '10+', label: 'Projects Shipped' },
      { value: 'React', label: 'Web Frontend' },
      { value: 'Node.js', label: 'Backend' },
    ],
  },
  about: {
    introduction: 'Software developer focused on clean architecture and excellent user experiences.',
    bio: 'I am a full-stack software developer with experience building modern web applications using React, Node.js, and cloud services. I focus on writing maintainable, well-tested code and designing intuitive interfaces that users love.',
    specialties: [
      'React & Frontend Development',
      'Node.js & REST APIs',
      'Database Design (SQL & NoSQL)',
      'Cloud Services & Deployment',
    ],
    values: [
      {
        title: 'Clean Code',
        desc: 'Writing structured, readable, and reusable code that teams can maintain and extend confidently.',
      },
      {
        title: 'User-Centered Design',
        desc: 'Building interfaces that are intuitive, accessible, and delightful to use.',
      },
      {
        title: 'Continuous Learning',
        desc: 'Staying current with modern tooling and best practices to deliver the best solutions.',
      },
    ],
    workingStyle: [
      { label: 'Focus Area', value: 'React & Node.js' },
      { label: 'Database', value: 'PostgreSQL & Firebase' },
      { label: 'Code Quality', value: 'Clean & Tested' },
    ],
    highlights: [
      { metric: 'React', label: 'Component UI Design' },
      { metric: 'Node.js', label: 'Backend APIs' },
      { metric: 'Firebase', label: 'Cloud Platform' },
    ],
  },
  contact: {
    description: 'Have a project idea, collaboration opportunity, or developer role? Send a message below.',
    successMessage: 'Message received! I will review your inquiry and get back to you as soon as possible.',
  },
};
export default personalInfo;
