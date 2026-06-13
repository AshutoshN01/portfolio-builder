import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiEdit, FiTrash2, FiClock, FiX, FiCheck } from 'react-icons/fi';

export function EditTimeline() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('experience'); // 'experience' | 'education'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievementsText: '', // Converted to array on save
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
      // Sort by order ascending
      fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(fetched);
    } catch (err) {
      console.error('Error loading timeline items:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);


  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievementsText: '',
      order: items.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    
    // Format achievements array back to text block
    let achievementsStr = '';
    if (item.achievements && Array.isArray(item.achievements)) {
      achievementsStr = item.achievements
        .map((a) => (typeof a === 'string' ? a : `${a.metric || ''} : ${a.label || ''}`))
        .join('\n');
    }

    setFormData({
      company: item.company || item.institution || '',
      role: item.role || item.degree || '',
      location: item.location || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      description: item.description || '',
      achievementsText: achievementsStr,
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, activeTab, itemId));
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete item.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      alert('Please fill in required fields.');
      return;
    }

    const itemId = editingItem ? editingItem.id : `timeline-${Date.now()}`;
    const docRef = doc(db, 'users', currentUser.uid, activeTab, itemId);

    // Convert achievements text block back into structures
    const achievements = formData.achievementsText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        if (line.includes(':')) {
          const parts = line.split(':');
          return {
            metric: parts[0].trim(),
            label: parts[1].trim(),
          };
        }
        return { metric: 'Highlights', label: line.trim() };
      });

    const docData = {
      id: itemId,
      company: formData.company.trim(),
      institution: formData.company.trim(),
      role: formData.role.trim(),
      degree: formData.role.trim(),
      location: formData.location.trim(),
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim(),
      description: formData.description.trim(),
      achievements,
      order: Number(formData.order) || 0,
    };

    try {
      await setDoc(docRef, docData);
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save timeline data.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
            Timeline Manager
          </h1>
          <p className="font-body text-body-sm text-text-muted">
            Manage your employment history and academic qualifications
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-all duration-fast focus-ring"
        >
          <FiPlus /> Add Record
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'experience'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`px-5 py-2.5 font-display text-body-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'education'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          Education
        </button>
      </div>

      {/* List Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 bg-surface border border-border border-dashed rounded-lg text-center text-text-muted flex flex-col gap-2 items-center">
          <FiClock size={24} className="text-text-dim" />
          <p className="font-body text-body-sm">No records added in this category yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-surface border border-border rounded-lg flex items-start justify-between gap-6 hover:border-border-hover transition-colors duration-fast"
            >
              <div className="flex flex-col gap-2">
                <span className="font-body text-overline text-accent uppercase tracking-widest">
                  {item.startDate} – {item.endDate}
                </span>
                <h3 className="font-display text-body-md font-bold text-white">
                  {item.role || item.degree}
                </h3>
                <span className="font-body text-body-sm text-text-secondary">
                  {item.company || item.institution} • {item.location}
                </span>
                {item.description && (
                  <p className="font-body text-body-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 border border-border hover:border-border-hover hover:text-accent rounded text-text-secondary transition-colors focus-ring"
                  aria-label="Edit item details"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-border hover:border-border-hover hover:text-error rounded text-text-secondary transition-colors focus-ring"
                  aria-label="Delete item record"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form CRUD Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-elevated/40">
              <h2 className="font-display text-body-md font-bold text-white uppercase tracking-wider">
                {editingItem ? 'Edit Timeline Record' : 'Add Timeline Record'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 border border-border rounded hover:text-white text-text-secondary focus-ring"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">
                  {activeTab === 'education' ? 'Institution / School *' : 'Company / Employer *'}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">
                  {activeTab === 'education' ? 'Degree / Field of Study *' : 'Role / Position *'}
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">Start Date</label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder="e.g. Jun 2025"
                    className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">End Date</label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    placeholder="e.g. Present"
                    className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium flex items-center justify-between">
                  <span>Highlighted Achievements (One per line)</span>
                  <span className="text-[10px] text-text-dim lowercase tracking-normal">metric : value (optional)</span>
                </label>
                <textarea
                  name="achievementsText"
                  rows={3}
                  value={formData.achievementsText}
                  onChange={handleInputChange}
                  placeholder="e.g., Projects : Built canvas tool&#10;Achievements : 1st place in Hackathon"
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Sort Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring transition-colors hover:border-border-hover"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border hover:text-white text-text-secondary rounded text-body-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FiCheck /> {editingItem ? 'Save Updates' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditTimeline;
