/**
 * Skills Data — Centralized skills and expertise store.
 * Candidate: John Doe
 * Contains ZERO fabricated metrics or fictional entries.
 */
export const skillsData = {
  categories: [
    {
      id: 'frontend',
      name: 'Frontend Development',
      description: 'Responsive web engineering languages and visual systems.',
      icon: 'FiCpu',
      items: [
        { name: 'React', level: 'Intermediate', proficiency: 82, years: '2+', type: 'primary' },
        { name: 'JavaScript', level: 'Intermediate', proficiency: 84, years: '2+', type: 'primary' },
        { name: 'TypeScript', level: 'Intermediate', proficiency: 78, years: '1+', type: 'primary' },
        { name: 'HTML / CSS', level: 'Advanced', proficiency: 90, years: '3+', type: 'secondary' },
        { name: 'Tailwind CSS', level: 'Intermediate', proficiency: 82, years: '2+', type: 'secondary' },
      ],
    },
    {
      id: 'backend-db',
      name: 'Backend & Databases',
      description: 'API services and persistent database management setups.',
      icon: 'FiDatabase',
      items: [
        { name: 'Node.js / Express', level: 'Intermediate', proficiency: 76, years: '1+', type: 'primary' },
        { name: 'Firebase', level: 'Intermediate', proficiency: 80, years: '2+', type: 'primary' },
        { name: 'SQLite / Room DB', level: 'Intermediate', proficiency: 78, years: '1+', type: 'primary' },
        { name: 'MySQL', level: 'Intermediate', proficiency: 75, years: '2+', type: 'secondary' },
      ],
    },
    {
      id: 'android-dev',
      name: 'Android Development',
      description: 'Native mobile platforms and layout programming environments.',
      icon: 'FiLayers',
      items: [
        { name: 'Kotlin', level: 'Intermediate', proficiency: 80, years: '1+', type: 'primary' },
        { name: 'Java', level: 'Intermediate', proficiency: 75, years: '2+', type: 'primary' },
        { name: 'XML / Layouts', level: 'Advanced', proficiency: 85, years: '2+', type: 'secondary' },
        { name: 'Room Database', level: 'Intermediate', proficiency: 78, years: '1+', type: 'secondary' },
      ],
    },
    {
      id: 'ai-tools',
      name: 'AI & Engineering Tools',
      description: 'Generative endpoints, text parsing services, and compiler environments.',
      icon: 'FiTerminal',
      items: [
        { name: 'OpenAI APIs / LLMs', level: 'Intermediate', proficiency: 80, years: '1+', type: 'primary' },
        { name: 'OCR (Tesseract.js)', level: 'Intermediate', proficiency: 78, years: '1+', type: 'primary' },
        { name: 'Prompt Engineering', level: 'Advanced', proficiency: 85, years: '1+', type: 'secondary' },
        { name: 'Git / GitHub', level: 'Intermediate', proficiency: 82, years: '3+', type: 'secondary' },
        { name: 'Android Studio / VS Code', level: 'Advanced', proficiency: 88, years: '3+', type: 'secondary' },
        { name: 'Postman', level: 'Intermediate', proficiency: 80, years: '2+', type: 'secondary' },
      ],
    },
  ],
  focusAreas: [
    { title: 'Mobile App Engineering', desc: 'Developing native Android apps in Kotlin using RecyclerView and SQLite storage.' },
    { title: 'React UI Development', desc: 'Constructing responsive, state-managed SPA layouts using Tailwind CSS.' },
    { title: 'AI API Integrations', desc: 'Interfacing frontend editors with LLMs for cleaning, formatting, and summarizing transcripts.' },
    { title: 'Structured Data Storage', desc: 'Building offline-first local room models and cloud synchronization schemas.' },
  ],
};
export default skillsData;
