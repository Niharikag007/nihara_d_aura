import React, { useState } from 'react';
import { Image, Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { name: '', image: '', description: '', subcategories: '' };

export default function Categories() {
  const {
    darkMode,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addToast
  } = useAdminStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || '',
      image: category.image || '',
      description: category.description || '',
      subcategories: (category.subcategories || []).join('\n')
    });
    setErrors({});
    setModalOpen(true);
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter a category name.';
    const image = form.image.trim();
    const sitePath = image.startsWith('/') && !image.startsWith('//');
    let secureRemoteUrl = false;
    if (/^https:\/\//i.test(image)) {
      try {
        secureRemoteUrl = Boolean(new URL(image).hostname);
      } catch {
        secureRemoteUrl = false;
      }
    }
    if (!sitePath && !secureRemoteUrl) nextErrors.image = 'Use an HTTPS image URL or a site-relative image path.';
    const subcategories = form.subcategories.split('\n').map((item) => item.trim()).filter(Boolean);
    if (subcategories.length > 30) nextErrors.subcategories = 'A category can have up to 30 subcategories.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      image,
      description: form.description.trim(),
      subcategories
    };
    const saved = editing
      ? await updateCategory(editing.id, payload)
      : await addCategory(payload);
    setSaving(false);
    if (!saved) return;
    addToast({
      type: 'success',
      message: editing ? `Updated ${payload.name}` : `Added ${payload.name}`
    });
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const removed = await deleteCategory(deleting.id);
    if (removed) addToast({ type: 'success', message: `Deleted ${deleting.name}` });
    setDeleting(null);
  };

  const surface = darkMode ? 'bg-[#1a1717] border-white/10' : 'bg-white border-[#e7dfd1]';
  const heading = darkMode ? 'text-white' : 'text-[#241b18]';
  const muted = darkMode ? 'text-stone-400' : 'text-stone-500';
  const fieldClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 ${
    darkMode ? 'border-white/10 bg-black/20 text-white' : 'border-stone-200 bg-white text-stone-800'
  }`;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c37]">
            <Layers className="h-3.5 w-3.5" /> Store catalog
          </p>
          <h1 className={`font-serif text-3xl font-semibold sm:text-4xl ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Categories & collections
          </h1>
          <p className={`mt-1 text-sm ${muted}`}>Manage the category pages and subcategory links customers see in the storefront.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
      </header>

      {categories.length === 0 ? (
        <div className={`rounded-2xl border px-6 py-14 text-center ${surface}`}>
          <Layers className="mx-auto mb-3 h-8 w-8 text-[#b58a2a]" />
          <h2 className={`font-serif text-xl font-semibold ${heading}`}>No categories found</h2>
          <p className={`mt-1 text-sm ${muted}`}>Categories will appear here after the catalog loads.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.id} className={`overflow-hidden rounded-2xl border shadow-sm ${surface}`}>
              <div className="relative h-40 bg-stone-100">
                <img
                  src={category.image || '/hero-slide-1.jpg'}
                  alt={category.name}
                  className="h-full w-full object-cover"
                  onError={(event) => { event.currentTarget.src = '/hero-slide-1.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                  <h2 className="font-serif text-xl font-semibold text-white">{category.name}</h2>
                  <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white">
                    {category.itemCount || 0} products
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <p className={`line-clamp-2 min-h-10 text-sm ${muted}`}>{category.description || 'No category description yet.'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(category.subcategories || []).map((subcategory) => (
                    <span key={subcategory} className={`rounded-full px-2.5 py-1 text-[11px] ${
                      darkMode ? 'bg-white/5 text-stone-300' : 'bg-[#f7f2e8] text-stone-600'
                    }`}>
                      {subcategory}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center justify-between border-t pt-3 ${darkMode ? 'border-white/10' : 'border-stone-100'}`}>
                  <span className={`text-xs ${muted}`}>/{category.slug}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(category)} className={`rounded-lg p-2 ${muted} hover:bg-stone-100 dark:hover:bg-white/5`} aria-label={`Edit ${category.name}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setDeleting(category)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" aria-label={`Delete ${category.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Edit category' : 'Create category'}
        subtitle="Changes are reflected on the public categories page."
        maxWidth="max-w-xl"
      >
        <form onSubmit={saveCategory} className="space-y-4">
          <label className="block text-sm font-medium">
            <span className={heading}>Category name</span>
            <input maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={`${fieldClass} mt-1`} />
            {errors.name && <span className="mt-1 block text-xs text-rose-500">{errors.name}</span>}
          </label>
          <label className="block text-sm font-medium">
            <span className={heading}>Banner image URL</span>
            <span className={`mt-1 flex items-center gap-2 rounded-xl border px-3 ${darkMode ? 'border-white/10 bg-black/20' : 'border-stone-200 bg-white'}`}>
              <Image className={`h-4 w-4 shrink-0 ${muted}`} />
              <input maxLength={500} value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="/images/category-banner.jpg" className={`w-full bg-transparent py-2.5 text-sm outline-none ${heading}`} />
            </span>
            {errors.image && <span className="mt-1 block text-xs text-rose-500">{errors.image}</span>}
          </label>
          <label className="block text-sm font-medium">
            <span className={heading}>Description</span>
            <textarea maxLength={500} rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${fieldClass} mt-1 resize-y`} />
          </label>
          <label className="block text-sm font-medium">
            <span className={heading}>Subcategories (one per line)</span>
            <textarea rows={4} value={form.subcategories} onChange={(event) => setForm({ ...form, subcategories: event.target.value })} className={`${fieldClass} mt-1 resize-y`} />
            {errors.subcategories && <span className="mt-1 block text-xs text-rose-500">{errors.subcategories}</span>}
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className={`rounded-xl border px-4 py-2 text-sm ${muted}`}>Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete category?"
        message={deleting?.itemCount
          ? `This category currently has ${deleting.itemCount} products. Move or delete those products first.`
          : `Delete "${deleting?.name}" from the storefront?`}
        confirmText="Delete category"
      />
    </section>
  );
}
