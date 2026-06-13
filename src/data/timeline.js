/**
 * Timeline Data — Career and academic progression history.
 * Mapped for academic history representing a Diploma in Computer Engineering.
 */
export const timelineData = [
  {
    id: 'academic-diploma',
    company: 'State Polytechnic College',
    role: 'Diploma in Computer Engineering',
    location: 'San Francisco, CA',
    startDate: '2022',
    endDate: '2025',
    duration: '3 Years',
    employmentType: 'Academic Studies',
    description: 'Pursuing a Diploma in Computer Engineering, developing foundations in software systems, database managers, and mobile applications development.',
    achievements: [
      { metric: 'Projects', label: 'Developed OCR character parser, AI document formatter, and SQLite mobile planners' },
      { metric: 'Android', label: 'Trained in native mobile architectures, layouts, and SQLite/Room caching' },
      { metric: 'React', label: 'Developed responsive, state-managed components and UI visual interfaces' },
    ],
    technologies: ['React', 'Kotlin', 'Firebase', 'SQLite', 'Room DB', 'JavaScript', 'Tailwind CSS', 'Git'],
    featured: true,
    links: { companyUrl: '' },
  },
];
export default timelineData;
