import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/AuthContext';
import { db } from '@/firebase/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiEdit, FiTrash2, FiSliders, FiX, FiCheck } from 'react-icons/fi';

export function EditSkills() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null); // Index of item in category array

  // Form states
  const [catFormData, setCatFormData] = useState({
    name: '',
    description: '',
    order: 0,
  });

  const [itemFormData, setItemFormData] = useState({
    name: '',
    level: 'Intermediate', // 'Beginner' | 'Intermediate' | 'Advanced'
    proficiency: 80,
    years: '1+',
    type: 'primary', // 'primary' | 'secondary'
  });

  const [selectedCatForItems, setSelectedCatForItems] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'skills'));
      const fetched = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        items: d.data().items || [],
      }));
      fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(fetched);
    } catch (err) {
      console.error('Error fetching skills categories:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  // CATEGORY OPERATIONS
  const openAddCatModal = () => {
    setEditingCategory(null);
    setCatFormData({ name: '', description: '', order: categories.length });
    setCatModalOpen(true);
  };

  const openEditCatModal = (cat) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.categoryName || '',
      description: cat.description || '',
      order: cat.order || 0,
    });
    setCatModalOpen(true);
  };

  const handleDeleteCat = async (catId) => {
    if (!window.confirm('Delete this category and all its skills?')) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'skills', catId));
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Delete failed.');
    }
  };

  const handleCatFormSubmit = async (e) => {
    e.preventDefault();
    if (!catFormData.name.trim()) return;

    const catId = editingCategory ? editingCategory.id : `skills-${Date.now()}`;
    const docRef = doc(db, 'users', currentUser.uid, 'skills', catId);

    const docData = {
      id: catId,
      categoryName: catFormData.name.trim(),
      description: catFormData.description.trim(),
      items: editingCategory ? editingCategory.items : [],
      order: Number(catFormData.order) || 0,
    };

    try {
      await setDoc(docRef, docData);
      setCatModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Save failed.');
    }
  };

  // SKILL ITEM OPERATIONS
  const openAddItemModal = (cat) => {
    setSelectedCatForItems(cat);
    setEditingItemIndex(null);
    setItemFormData({
      name: '',
      level: 'Intermediate',
      proficiency: 80,
      years: '1+',
      type: 'primary',
    });
    setItemModalOpen(true);
  };

  const openEditItemModal = (cat, itemIndex) => {
    setSelectedCatForItems(cat);
    setEditingItemIndex(itemIndex);
    const item = cat.items[itemIndex];
    setItemFormData({
      name: item.name || '',
      level: item.level || 'Intermediate',
      proficiency: item.proficiency || 80,
      years: item.years || '1+',
      type: item.type || 'primary',
    });
    setItemModalOpen(true);
  };

  const handleDeleteItem = async (cat, itemIndex) => {
    if (!window.confirm('Remove this skill item?')) return;
    const updatedItems = cat.items.filter((_, idx) => idx !== itemIndex);
    const docRef = doc(db, 'users', currentUser.uid, 'skills', cat.id);

    try {
      await setDoc(docRef, { ...cat, items: updatedItems });
      await fetchCategories();
    } catch (err) {
      console.error('Delete item failed:', err);
      alert('Deletion failed.');
    }
  };

  const handleItemFormSubmit = async (e) => {
    e.preventDefault();
    if (!itemFormData.name.trim() || !selectedCatForItems) return;

    let updatedItems = [...selectedCatForItems.items];
    const newItem = {
      name: itemFormData.name.trim(),
      level: itemFormData.level,
      proficiency: Number(itemFormData.proficiency) || 80,
      years: itemFormData.years.trim(),
      type: itemFormData.type,
    };

    if (editingItemIndex !== null) {
      updatedItems[editingItemIndex] = newItem;
    } else {
      updatedItems.push(newItem);
    }

    const docRef = doc(db, 'users', currentUser.uid, 'skills', selectedCatForItems.id);

    try {
      await setDoc(docRef, { ...selectedCatForItems, items: updatedItems });
      setItemModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save skill.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-heading-md font-bold text-white uppercase tracking-wider">
            Skills Editor
          </h1>
          <p className="font-body text-body-sm text-text-muted">
            Group skills into logical categories and show experience metrics
          </p>
        </div>

        <button
          onClick={openAddCatModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-all duration-fast focus-ring"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 bg-surface border border-border border-dashed rounded-lg text-center text-text-muted flex flex-col gap-2 items-center">
          <FiSliders size={24} className="text-text-dim" />
          <p className="font-body text-body-sm">No skill categories configured.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 bg-surface border border-border rounded-xl flex flex-col gap-4"
            >
              {/* Category Header */}
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-body-md font-bold text-white uppercase tracking-wider">
                    {cat.categoryName}
                  </h3>
                  {cat.description && (
                    <p className="font-body text-body-sm text-text-muted">{cat.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditCatModal(cat)}
                    className="px-2.5 py-1.5 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded text-body-xs font-semibold transition-colors"
                  >
                    Edit Title
                  </button>
                  <button
                    onClick={() => handleDeleteCat(cat.id)}
                    className="p-1.5 border border-border hover:text-error hover:border-error rounded text-text-secondary transition-colors"
                    aria-label="Delete category"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-3">
                  {cat.items.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-background border border-border rounded-lg flex items-center gap-3"
                    >
                      <div className="flex flex-col">
                        <span className="font-display text-body-xs font-bold text-white leading-tight">
                          {item.name}
                        </span>
                        <span className="font-body text-[10px] text-text-dim mt-0.5 leading-none">
                          {item.level} • {item.years} yrs ({item.proficiency}%)
                        </span>
                      </div>
                      <div className="flex gap-1.5 border-l border-border pl-2.5 ml-1">
                        <button
                          onClick={() => openEditItemModal(cat, index)}
                          className="text-text-muted hover:text-white transition-colors"
                          aria-label="Edit skill parameters"
                        >
                          <FiEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(cat, index)}
                          className="text-text-muted hover:text-error transition-colors"
                          aria-label="Remove skill"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => openAddItemModal(cat)}
                    className="px-4 py-2 border border-accent/30 border-dashed hover:border-accent text-accent hover:text-white rounded-lg flex items-center gap-1.5 text-body-xs font-semibold transition-all duration-fast"
                  >
                    <FiPlus /> Add Skill
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-elevated/40">
              <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-wider">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 border border-border rounded hover:text-white text-text-secondary focus-ring"
              >
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleCatFormSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Category Name *</label>
                <input
                  type="text"
                  value={catFormData.name}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Description</label>
                <textarea
                  value={catFormData.description}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Sort Order</label>
                <input
                  type="number"
                  value={catFormData.order}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, order: e.target.value }))}
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring w-24"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary rounded text-body-sm font-semibold transition-colors"
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

      {/* Skill Item Modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-elevated/40">
              <h2 className="font-display text-body-sm font-bold text-white uppercase tracking-wider">
                {editingItemIndex !== null ? 'Edit Skill Item' : 'Add Skill Item'}
              </h2>
              <button
                onClick={() => setItemModalOpen(false)}
                className="p-1 border border-border rounded hover:text-white text-text-secondary focus-ring"
              >
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleItemFormSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Skill Name *</label>
                <input
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kotlin, CSS Grid"
                  className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">Skill Level</label>
                  <select
                    value={itemFormData.level}
                    onChange={(e) => setItemFormData((prev) => ({ ...prev, level: e.target.value }))}
                    className="px-3 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-body-sm text-text-secondary font-medium">Years Experience</label>
                  <input
                    type="text"
                    value={itemFormData.years}
                    onChange={(e) => setItemFormData((prev) => ({ ...prev, years: e.target.value }))}
                    placeholder="e.g. 2+"
                    className="px-4 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium flex justify-between">
                  <span>Proficiency Level</span>
                  <span>{itemFormData.proficiency}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={itemFormData.proficiency}
                  onChange={(e) => setItemFormData((prev) => ({ ...prev, proficiency: Number(e.target.value) }))}
                  className="w-full accent-accent bg-border rounded-lg h-2 cursor-pointer mt-1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-body-sm text-text-secondary font-medium">Skill Priority</label>
                <select
                  value={itemFormData.type}
                  onChange={(e) => setItemFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2.5 bg-background border border-border rounded-md font-body text-body-sm text-white focus-ring"
                >
                  <option value="primary">Primary Expertise</option>
                  <option value="secondary">Secondary Tooling</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary rounded text-body-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-body-sm font-semibold transition-colors flex items-center gap-1"
                >
                  <FiCheck /> Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSkills;
