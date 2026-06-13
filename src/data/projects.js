/**
 * Projects Data — Centralized project content store.
 * Mapped for: OCR Text Extraction System, AI Text Formatter, and Android TODO App.
 * Uses generic placeholders for URLs.
 */
export const projectsData = [
  {
    id: 'project-ocr-extractor',
    slug: 'ocr-text-extractor',
    title: 'OCR Text Extraction System',
    category: 'Computer Vision & Web Tools',
    tagline: 'Client-side React interface that extracts character text from uploaded document images.',
    description: 'Developed a React application implementing optical character recognition (OCR) via Tesseract.js to parse scanned documents and images directly inside the user browser. Uses background worker loops to offload heavy calculations.',
    featured: true,
    status: 'Completed',
    meta: {
      role: 'React Developer',
      timeline: 'Sep 2025 – Nov 2025',
      client: 'Independent Project',
      tech: ['React', 'Tesseract.js', 'JavaScript', 'HTML5', 'CSS3', 'Vite'],
    },
    metrics: [
      { value: 'React', label: 'Frontend UI' },
      { value: 'Tesseract', label: 'OCR Library' },
      { value: '60 FPS', label: 'Scroll Target' },
    ],
    overview: 'Built an optical character recognition web utility where users drag and drop document images to extract raw textual strings, edit the output inside an editable screen field, and copy the parsed text directly to their clipboard.',
    challenge: 'Performing character recognition scans directly on the browser\'s main thread causes CPU blocks, dropping the interface frame rate to under 10 FPS and freezing user mouse/keyboard input during processing.',
    solution: 'Configured Tesseract.js to run its scanner inside a dedicated client background Web Worker thread. Optimized processing speed by scaling high-resolution images down using Canvas context dimensions before scanning, maintaining smooth UI rendering.',
    goal: 'To create a client-side OCR tool that parses text content directly within the user browser, ensuring complete privacy by not transmitting documents to any third-party backend servers.',
    lessonsLearned: 'Web workers are crucial for preventing thread starvation in the browser during heavy parsing sweeps. Image pre-scaling using Canvas dimensions maintains high speed without degrading character recognition precision.',
    architecture: {
      frontend: 'React, HTML5, CSS3, JavaScript',
      backend: 'Client-side local parsing engine',
      database: 'None',
      integrations: 'Tesseract.js OCR library engine',
    },
    links: {
      live: 'https://github.com/john-doe/ocr-text-extractor',
      source: 'https://github.com/john-doe/ocr-text-extractor',
    },
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&fm=webp&fit=crop',
      cover: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&fm=webp&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&fm=webp&fit=crop',
      ],
    },
  },
  {
    id: 'project-ai-formatter',
    slug: 'ai-text-formatter',
    title: 'AI Text Formatter',
    category: 'Generative AI Tools',
    tagline: 'An AI-integrated document editor that cleans OCR noise and extracts key points using APIs.',
    description: 'Developed a React application integrating generative language model APIs to clean spelling typos from raw OCR extractions, summarize document content, and list core topics.',
    featured: true,
    status: 'Completed',
    meta: {
      role: 'Full-Stack Developer',
      timeline: 'Nov 2025 – Jan 2026',
      client: 'Independent Project',
      tech: ['React', 'Node.js', 'Express', 'OpenAI API', 'Tailwind CSS', 'Vite'],
    },
    metrics: [
      { value: 'OpenAI API', label: 'LLM Integration' },
      { value: 'Express', label: 'Node.js Backend' },
      { value: 'Markdown', label: 'Output Schema' },
    ],
    overview: 'Built a text formatting workspace that connects with generative language model APIs. The utility takes disorganized text notes or transcripts and formats them into clean, reader-ready outlines, bullet points, or summarized summaries based on user guidelines.',
    challenge: 'Remote generative model APIs exhibit high latency (often taking 4-8 seconds to complete a full paragraph layout request), resulting in a stagnant page state and poor user feedback during connection loops.',
    solution: 'Configured the Node.js Express server to stream textual progress to the React client chunk-by-chunk using Server-Sent Events (SSE). This updates the text field on screen dynamically as chunks arrive, reducing perceived page load delays.',
    goal: 'To build a text editor workspace that connects to generative model endpoints to strip spelling noise from OCR documents and compile structured summaries.',
    lessonsLearned: 'Standard REST paradigms lead to a frozen interface layout due to remote API delays. Streaming completion chunks using Server-Sent Events (SSE) resolves latency feedback and provides immediate layout progression.',
    architecture: {
      frontend: 'React, Tailwind CSS, JavaScript',
      backend: 'Node.js, Express (REST stream handlers)',
      database: 'None',
      integrations: 'OpenAI API / Generative LLM SDK',
    },
    links: {
      live: 'https://github.com/john-doe/ai-text-formatter',
      source: 'https://github.com/john-doe/ai-text-formatter',
    },
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&fm=webp&fit=crop',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&fm=webp&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&fm=webp&fit=crop',
      ],
    },
  },
  {
    id: 'project-android-todo',
    slug: 'android-todo-app',
    title: 'Android TODO App',
    category: 'Mobile Applications',
    tagline: 'Native Android task planner featuring Room SQLite local storage and RecyclerView layouts.',
    description: 'Designed and built a native Android task organizer in Kotlin. Integrates Room Database for offline task storage and RecyclerView layouts for smooth checklist scroll states.',
    featured: true,
    status: 'Completed',
    meta: {
      role: 'Mobile Developer',
      timeline: 'Jun 2025 – Aug 2025',
      client: 'Academic Project',
      tech: ['Kotlin', 'Android SDK', 'Room DB', 'SQLite', 'RecyclerView', 'Coroutines'],
    },
    metrics: [
      { value: 'Kotlin', label: 'Native Language' },
      { value: 'Room DB', label: 'SQLite Storage' },
      { value: 'Recycler', label: 'Scroll View UI' },
    ],
    overview: 'Built a native Android task organizer designed for offline reliability. The app stores and displays checklists, updates local database tables offline, and manages lifecycle callback state shifts.',
    challenge: 'Running database query loops directly on the main Android thread blocks UI operations, leading to frozen rendering states and app crashes during scroll actions.',
    solution: 'Used Kotlin Coroutines thread pooling to move SQLite write and query operations to a background I/O scope. Implemented state matching inside the RecyclerView adapter to prevent visual list jumps.',
    goal: 'To design a native Kotlin scheduler utilizing local SQLite schemas for persistent offline list management and fluid transitions.',
    lessonsLearned: 'Isolating disk transactions via Room DB entities and Kotlin Coroutines prevents frame-drops in RecyclerView grids, delivering an app that runs smoothly even under heavy database updates.',
    architecture: {
      frontend: 'Kotlin, XML Layouts, RecyclerView',
      backend: 'Local Standalone mobile app',
      database: 'SQLite (Room Database Framework)',
      integrations: 'Android SDK, Android Jetpack Lifecycle API',
    },
    links: {
      live: 'https://github.com/john-doe/android-todo-app',
      source: 'https://github.com/john-doe/android-todo-app',
    },
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&fm=webp&fit=crop',
      cover: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&fm=webp&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&fm=webp&fit=crop',
      ],
    },
  },
];

export const getProjectBySlug = (slug) => {
  return projectsData.find((project) => project.slug === slug);
};

export const getFeaturedProjects = () => {
  return projectsData.filter((project) => project.featured);
};
export default projectsData;
