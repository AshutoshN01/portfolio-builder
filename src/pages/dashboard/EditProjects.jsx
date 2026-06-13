import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiEdit, FiTrash2, FiCode, FiX, FiCheck } from 'react-icons/fi';

export function EditProjects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    tagline: '',
    description: '',
    overview: '',
    goal: '',
    challenge: '',
    solution: '',
    lessonsLearned: '',
    frontendArch: '',
    backendArch: '',
    databaseArch: '',
    integrationsArch: '',
    liveLink: '',
    sourceLink: '',
    featured: false,
    order: 0,
    metricsText: '', // Format: 'React: UI \n 60 FPS: Target'
    thumbnailUrl: '',
    coverUrl: '',
  });



  const fetchProjects = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'projects'));
      const fetched = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(fetched);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'slug') {
      val = value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: '',
      tagline: '',
      description: '',
      overview: '',
      goal: '',
      challenge: '',
      solution: '',
      lessonsLearned: '',
      frontendArch: '',
      backendArch: '',
      databaseArch: '',
      integrationsArch: '',
      liveLink: '',
      sourceLink: '',
      featured: false,
      order: projects.length,
      metricsText: '',
      thumbnailUrl: '',
      coverUrl: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    
    // Format metrics back to text block
    let metricsStr = '';
    if (proj.metrics && Array.isArray(proj.metrics)) {
      metricsStr = proj.metrics.map((m) => `${m.value} : ${m.label}`).join('\n');
    }

    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || '',
      tagline: proj.tagline || '',
      description: proj.description || '',
      overview: proj.overview || '',
      goal: proj.goal || '',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      lessonsLearned: proj.lessonsLearned || '',
      frontendArch: proj.architecture?.frontend || '',
      backendArch: proj.architecture?.backend || '',
      databaseArch: proj.architecture?.database || '',
      integrationsArch: proj.architecture?.integrations || '',
      liveLink: proj.links?.live || '',
      sourceLink: proj.links?.source || '',
      featured: proj.featured || false,
      order: proj.order || 0,
      metricsText: metricsStr,
      thumbnailUrl: proj.media?.thumbnail || '',
      coverUrl: proj.media?.cover || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'projects', projId));
      setProjects((prev) => prev.filter((p) => p.id !== projId));
    } catch (err) {
      console.error('Delete project failure:', err);
      alert('Failed to delete project.');
    }
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { title, slug } = formData;

    if (!title.trim() || !slug.trim()) {
      alert('Project title and URL slug are required.');
      return;
    }

    const projectId = editingProject ? editingProject.id : `project-${Date.now()}`;
    const docRef = doc(db, 'users', currentUser.uid, 'projects', projectId);

    // Parse metrics text
    const metrics = formData.metricsText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        if (line.includes(':')) {
          const parts = line.split(':');
          return { value: parts[0].trim(), label: parts[1].trim() };
        }
        return { value: 'Info', label: line.trim() };
      });

    const docData = {
      id: projectId,
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      overview: formData.overview.trim(),
      challenge: formData.challenge.trim(),
      solution: formData.solution.trim(),
      goal: formData.goal.trim(),
      lessonsLearned: formData.lessonsLearned.trim(),
      featured: formData.featured,
      order: Number(formData.order) || 0,
      architecture: {
        frontend: formData.frontendArch.trim(),
        backend: formData.backendArch.trim(),
        database: formData.databaseArch.trim(),
        integrations: formData.integrationsArch.trim(),
      },
      links: {
        live: formData.liveLink.trim(),
        source: formData.sourceLink.trim(),
      },
      media: {
        thumbnail: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&fm=webp&fit=crop',
        cover: formData.coverUrl || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&fm=webp&fit=crop',
        gallery: [
          formData.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&fm=webp&fit=crop',
        ],
      },
      metrics: metrics.length > 0 ? metrics : [{ value: 'Vite', label: 'Framework' }],
    };

    try {
      await setDoc(docRef, docData);
      setModalOpen(false);
      await fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save case study.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
            Case Studies Manager
          </h1>
          <p className="font-body text-body-sm text-text-muted">
            Configure case studies with Problem, Goal, Solutions, and Architecture descriptions
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-all duration-fast focus-ring"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* List content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-8 bg-surface border border-border border-dashed rounded-lg text-center text-text-muted flex flex-col gap-2 items-center">
          <FiCode size={24} className="text-text-dim" />
          <p className="font-body text-body-sm">No project case studies added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 bg-surface border border-border rounded-lg flex flex-col gap-4 justify-between hover:border-border-hover transition-colors duration-fast"
            >
              <div className="flex flex-col gap-2">
                <span className="font-body text-overline text-accent uppercase tracking-widest block">
                  {proj.category}
                </span>
                <h3 className="font-display text-body-md font-bold text-white leading-tight">
                  {proj.title}
                </h3>
                <p className="font-body text-body-sm text-text-muted leading-relaxed">
                  {proj.tagline}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                <span className="font-mono text-[10px] text-text-dim">
                  slug: {proj.slug}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-2 border border-border hover:border-border-hover hover:text-accent rounded text-text-secondary transition-colors focus-ring"
                    aria-label="Edit project"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 border border-border hover:border-border-hover hover:text-error rounded text-text-secondary transition-colors focus-ring"
                    aria-label="Delete project"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal Form Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-elevated/40">
              <h2 className="font-display text-body-md font-bold text-white uppercase tracking-wider">
                {editingProject ? 'Edit Project Case Study' : 'Create Project Case Study'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-border rounded hover:text-white text-text-secondary focus-ring"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
              
              {/* Section 1: Basic Settings */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  1. Project Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Project Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">URL Route Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. ocr-extractor"
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-mono text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Category / Group</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Mobile Applications"
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Brief Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">Card Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-accent bg-background border-border focus-ring"
                  />
                  <label htmlFor="featured" className="font-body text-body-sm text-white font-medium select-none">
                    Feature project on public home page
                  </label>
                </div>
              </div>

              {/* Section 2: Visual Media Links */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  2. Visual Media Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Thumbnail URL */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="thumbnailUrl" className="font-body text-body-sm text-text-secondary font-medium">Thumbnail Image URL</label>
                    <input
                      type="url"
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>

                  {/* Cover URL */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="coverUrl" className="font-body text-body-sm text-text-secondary font-medium">Cover Graphic URL</label>
                    <input
                      type="url"
                      id="coverUrl"
                      name="coverUrl"
                      value={formData.coverUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Telemetry Metrics */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  3. Telemetry metrics
                </h3>
                <label className="font-body text-body-sm text-text-secondary font-medium flex items-center justify-between">
                  <span>Highlighted stats (One per line)</span>
                  <span className="text-[10px] text-text-dim">value : label</span>
                </label>
                <textarea
                  name="metricsText"
                  rows={2}
                  value={formData.metricsText}
                  onChange={handleInputChange}
                  placeholder="e.g. React : Web UI&#10;Room DB : SQLite"
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                />
              </div>

              {/* Section 4: Narrative Case study */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  4. Dynamic Case Study Content
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Overview Description</label>
                    <textarea
                      name="overview"
                      rows={3}
                      value={formData.overview}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Core Project Goal</label>
                    <textarea
                      name="goal"
                      rows={2}
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium text-error">The Challenge</label>
                      <textarea
                        name="challenge"
                        rows={4}
                        value={formData.challenge}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium text-success">The Solution</label>
                      <textarea
                        name="solution"
                        rows={4}
                        value={formData.solution}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium text-accent">Key Takeaway / Lesson Learned</label>
                    <textarea
                      name="lessonsLearned"
                      rows={3}
                      value={formData.lessonsLearned}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Architecture Setup */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  5. System Architecture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Frontend stack</label>
                    <input
                      type="text"
                      name="frontendArch"
                      value={formData.frontendArch}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Backend stack</label>
                    <input
                      type="text"
                      name="backendArch"
                      value={formData.backendArch}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Database engine</label>
                    <input
                      type="text"
                      name="databaseArch"
                      value={formData.databaseArch}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Third-party Integrations</label>
                    <input
                      type="text"
                      name="integrationsArch"
                      value={formData.integrationsArch}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Connectors */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-overline text-white tracking-widest border-b border-border pb-1">
                  6. Connections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Live Application Link</label>
                    <input
                      type="url"
                      name="liveLink"
                      value={formData.liveLink}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">GitHub Repository Link</label>
                    <input
                      type="url"
                      name="sourceLink"
                      value={formData.sourceLink}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">Sort Order Index</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring w-24"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary hover:text-white rounded text-body-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-colors flex items-center gap-1.5 hover:shadow-accent"
                >
                  <FiCheck /> {editingProject ? 'Save Updates' : 'Add Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProjects;
