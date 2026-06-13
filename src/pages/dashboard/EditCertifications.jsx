import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiEdit, FiTrash2, FiAward, FiX, FiCheck } from 'react-icons/fi';

export function EditCertifications() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('certifications'); // 'certifications' | 'achievements' | 'socials'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states based on tab
  const [formData, setFormData] = useState({
    // Certifications
    name: '',
    issuer: '',
    date: '',
    url: '',
    description: '',
    // Achievements
    title: '',
    metric: '',
    label: '',
    // Social Links
    socialName: '',
    socialUrl: '',
    socialIcon: 'FiGithub',
    socialLabel: '',
    order: 0,
  });

  const fetchItems = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, activeTab));
      const fetched = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(fetched);
    } catch (err) {
      console.error('Error fetching dashboard listings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      issuer: '',
      date: '',
      url: '',
      description: '',
      title: '',
      metric: '',
      label: '',
      socialName: '',
      socialUrl: '',
      socialIcon: 'FiGithub',
      socialLabel: '',
      order: items.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      issuer: item.issuer || '',
      date: item.date || '',
      url: item.url || '',
      description: item.description || '',
      title: item.title || '',
      metric: item.metric || '',
      label: item.label || '',
      socialName: item.name || '',
      socialUrl: item.url || '',
      socialIcon: item.icon || 'FiGithub',
      socialLabel: item.label || '',
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this listing entry?')) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, activeTab, itemId));
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error('Delete item failure:', err);
      alert('Delete failed.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const itemId = editingItem ? editingItem.id : `${activeTab}-${Date.now()}`;
    const docRef = doc(db, 'users', currentUser.uid, activeTab, itemId);

    let docData = { id: itemId, order: Number(formData.order) || 0 };

    if (activeTab === 'certifications') {
      if (!formData.name.trim() || !formData.issuer.trim()) {
        alert('Name and Issuer are required.');
        return;
      }
      docData = {
        ...docData,
        name: formData.name.trim(),
        issuer: formData.issuer.trim(),
        date: formData.date.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
      };
    } else if (activeTab === 'achievements') {
      if (!formData.title.trim()) {
        alert('Achievement Title is required.');
        return;
      }
      docData = {
        ...docData,
        title: formData.title.trim(),
        metric: formData.metric.trim(),
        label: formData.label.trim(),
      };
    } else if (activeTab === 'socials') {
      if (!formData.socialName.trim() || !formData.socialUrl.trim()) {
        alert('Network Name and URL are required.');
        return;
      }
      docData = {
        ...docData,
        name: formData.socialName.trim(),
        url: formData.socialUrl.trim(),
        icon: formData.socialIcon,
        label: formData.socialLabel.trim() || `Connect on ${formData.socialName}`,
      };
    }

    try {
      await setDoc(docRef, docData);
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Save item error:', err);
      alert('Failed to save details.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
            Platform Metadata Manager
          </h1>
          <p className="font-body text-body-sm text-text-muted">
            Customize certifications, social links, and highlighted achievements
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-all duration-fast focus-ring"
        >
          <FiPlus /> Add Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('certifications')}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'certifications'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Certifications
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'achievements'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('socials')}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'socials'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Social Links
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 bg-surface border border-border border-dashed rounded-lg text-center text-text-muted flex flex-col gap-2 items-center">
          <FiAward size={24} className="text-text-dim" />
          <p className="font-body text-body-sm">No entries created in this category yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-surface border border-border rounded-lg flex items-center justify-between gap-6 hover:border-border-hover transition-colors duration-fast"
            >
              <div className="flex flex-col gap-1">
                {activeTab === 'certifications' && (
                  <>
                    <h3 className="font-display text-body-md font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-body text-body-sm text-text-secondary">
                      {item.issuer} • {item.date}
                    </span>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline mt-1 w-fit">
                        View Credential Link
                      </a>
                    )}
                  </>
                )}

                {activeTab === 'achievements' && (
                  <>
                    <h3 className="font-display text-body-md font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <span className="font-body text-body-sm text-text-secondary">
                      Metric Highlight: <strong className="text-accent">{item.metric}</strong> ({item.label})
                    </span>
                  </>
                )}

                {activeTab === 'socials' && (
                  <>
                    <h3 className="font-display text-body-md font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-mono text-xs text-text-muted">
                      {item.url}
                    </span>
                    <span className="font-body text-[10px] text-text-dim uppercase mt-0.5 tracking-wider">
                      Icon: {item.icon}
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 border border-border hover:border-border-hover hover:text-accent rounded text-text-secondary transition-colors focus-ring"
                  aria-label="Edit details"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-border hover:border-border-hover hover:text-error rounded text-text-secondary transition-colors focus-ring"
                  aria-label="Delete entry"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-elevated/40">
              <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-wider">
                {editingItem ? 'Edit Entry Details' : 'Add Entry Details'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 border border-border rounded hover:text-white text-text-secondary focus-ring"
              >
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              
              {/* Conditional Inputs */}
              {activeTab === 'certifications' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Certification Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Issuing Organisation *</label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Issue Date</label>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="e.g. Jan 2026"
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Credential URL</label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Description</label>
                    <textarea
                      name="description"
                      rows={2}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'achievements' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Achievement Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Hackathon Winner"
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Highlight Metric</label>
                      <input
                        type="text"
                        name="metric"
                        value={formData.metric}
                        onChange={handleInputChange}
                        placeholder="e.g. 1st Place"
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Highlight Description Label</label>
                      <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="e.g. Out of 120 teams"
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'socials' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Social Network Name *</label>
                    <input
                      type="text"
                      name="socialName"
                      value={formData.socialName}
                      onChange={handleInputChange}
                      placeholder="e.g. GitHub, LinkedIn"
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-body-sm text-text-secondary font-medium">Network Profile URL *</label>
                    <input
                      type="url"
                      name="socialUrl"
                      value={formData.socialUrl}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Icon Preset</label>
                      <select
                        name="socialIcon"
                        value={formData.socialIcon}
                        onChange={handleInputChange}
                        className="px-3 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      >
                        <option value="FiGithub">GitHub Icon</option>
                        <option value="FiLinkedin">LinkedIn Icon</option>
                        <option value="FiTwitter">Twitter/X Icon</option>
                        <option value="FiInstagram">Instagram Icon</option>
                        <option value="FiYoutube">YouTube Icon</option>
                        <option value="FiLink">Website/Custom Link</option>
                        <option value="FiMail">Email Envelope</option>
                        <option value="FiPhone">WhatsApp/Phone</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-body-sm text-text-secondary font-medium">Screenreader Label</label>
                      <input
                        type="text"
                        name="socialLabel"
                        value={formData.socialLabel}
                        onChange={handleInputChange}
                        placeholder="e.g. Follow on GitHub"
                        className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Sort Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring w-24"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary hover:text-white rounded text-body-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-colors flex items-center gap-1"
                >
                  <FiCheck /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCertifications;
