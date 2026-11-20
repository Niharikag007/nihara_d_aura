import React, { useEffect, useMemo, useState } from 'react';
import { LoaderCircle, Pencil, Plus, Search, Sparkles, Star, Trash2, UserRound } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = {
  name: '',
  role: 'Senior Stylist',
  experience: '',
  rating: '5',
  reviewCount: '0',
  avatar: '',
  bio: '',
  specialties: ''
};

export default function Artists() {
  const { darkMode, artists, loading, loadArtists, addArtist, updateArtist, deleteArtist, addToast } = useAdminStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const visibleArtists = useMemo(() => artists
    .filter((artist) => `${artist.name} ${artist.role} ${artist.bio}`.toLowerCase().includes(search.trim().toLowerCase())),
  [artists, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (artist) => {
    setEditing(artist);
    setForm({
      name: artist.name || '',
      role: artist.role || 'Senior Stylist',
      experience: artist.experience || '',
      rating: String(artist.rating ?? 5),
      reviewCount: String(artist.reviewCount ?? 0),
      avatar: artist.avatar || '',
      bio: artist.bio || '',
      specialties: (artist.specialties || []).join('\n')
    });
    setErrors({});
    setModalOpen(true);
  };

  const saveArtist = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter the artist name.';
    const rating = Number(form.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) nextErrors.rating = 'Rating must be between 0 and 5.';
    const reviewCount = Number(form.reviewCount);
    if (!Number.isInteger(reviewCount) || reviewCount < 0) nextErrors.reviewCount = 'Use a whole number for reviews.';
    const avatar = form.avatar.trim();
    const sitePath = avatar.startsWith('/') && !avatar.startsWith('//');
    let secureRemoteUrl = false;
    if (/^https:\/\//i.test(avatar)) {
      try {
        secureRemoteUrl = Boolean(new URL(avatar).hostname);
      } catch {
        secureRemoteUrl = false;
      }
    }
    if (avatar && !sitePath && !secureRemoteUrl) nextErrors.avatar = 'Use an HTTPS image URL or a site-relative image path.';
    const specialties = form.specialties.split('\n').map((item) => item.trim()).filter(Boolean);
    if (specialties.length > 12) nextErrors.specialties = 'An artist can have up to 12 specialties.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || 'Senior Stylist',
      experience: form.experience.trim(),
      rating,
      reviewCount,
      avatar,
      bio: form.bio.trim(),
      specialties
    };
    setSaving(true);
    const saved = editing
      ? await updateArtist(editing.id, payload)
      : await addArtist(payload);
    setSaving(false);
    if (!saved) return;

    addToast({
      type: 'success',
      message: editing ? `Updated “${payload.name}”` : `Added “${payload.name}”`
    });
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const deleted = await deleteArtist(pendingDelete.id);
    if (deleted) addToast({ type: 'success', message: `Removed “${pendingDelete.name}” from the artist team` });
    setPendingDelete(null);
  };

  const surface = darkMode ? 'bg-[#1a1717] border-white/10' : 'bg-white border-[#e7dfd1]';
  const heading = darkMode ? 'text-white' : 'text-[#241b18]';
  const muted = darkMode ? 'text-stone-400' : 'text-stone-500';

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c37]">
            <Sparkles className="h-3.5 w-3.5" /> Creative team
          </p>
          <h1 className={`font-serif text-3xl font-semibold sm:text-4xl ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Artists & stylists
          </h1>
          <p className={`mt-1 text-sm ${muted}`}>Manage the artists shown on services, bookings, and the public site.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" /> Add artist
        </button>
      </header>

      <div className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${surface}`}>
        <label className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 sm:max-w-xs ${
          darkMode ? 'border-white/10 bg-black/20' : 'border-stone-200 bg-[#fcfbf8]'
        }`}>
          <Search className={`h-4 w-4 ${muted}`} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search artists"
            className={`w-full bg-transparent text-sm outline-none placeholder:text-stone-400 ${heading}`}
            aria-label="Search artists"
          />
        </label>
        <span className={`text-xs ${muted}`}>{visibleArtists.length} artist{visibleArtists.length === 1 ? '' : 's'}</span>
      </div>

      {loading && artists.length === 0 ? (
        <div className={`flex min-h-56 items-center justify-center gap-3 rounded-2xl border ${surface} ${muted}`}>
          <LoaderCircle className="h-5 w-5 animate-spin text-[#b58a2a]" /> Loading artists…
        </div>
      ) : visibleArtists.length === 0 ? (
        <div className={`rounded-2xl border px-6 py-14 text-center ${surface}`}>
          <UserRound className="mx-auto mb-3 h-8 w-8 text-[#b58a2a]" />
          <h2 className={`font-serif text-xl font-semibold ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {search ? 'No matching artists' : 'No artists yet'}
          </h2>
          <p className={`mx-auto mt-1 max-w-md text-sm ${muted}`}>
            {search ? 'Try another search term or clear your search.' : 'Add an artist to showcase your salon team on the public site.'}
          </p>
          {!search && (
            <button type="button" onClick={openCreate} className="mt-5 text-sm font-semibold text-[#9b711e] hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500">
              Add the first artist
            </button>
          )}
        </div>
      ) : (
        <div className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`hidden grid-cols-[minmax(0,2fr)_140px_120px_110px_112px] gap-4 border-b px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] sm:grid ${
            darkMode ? 'border-white/10 text-stone-500' : 'border-stone-100 text-stone-400'
          }`}>
            <span>Artist</span><span>Role</span><span>Experience</span><span>Rating</span><span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-stone-100 dark:divide-white/10">
            {visibleArtists.map((artist) => (
              <li key={artist.id} className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,2fr)_140px_120px_110px_112px] sm:items-center sm:gap-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  {artist.avatar ? (
                    <img
                      src={artist.avatar}
                      alt=""
                      className="h-14 w-14 flex-shrink-0 rounded-full border border-[#dfbc77]/40 bg-[#f7f2e8] object-cover"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#f3e7cf] text-[#8d681b]">
                      <UserRound className="h-6 w-6" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className={`truncate text-sm font-semibold ${heading}`}>{artist.name}</h2>
                    <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${muted}`}>{artist.bio || 'No bio added yet.'}</p>
                    {(artist.specialties || []).length > 0 && (
                      <p className="mt-1 truncate text-[11px] text-[#9b711e]">
                        {(artist.specialties || []).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
                <span className="w-fit rounded-full border border-[#dfbc77]/50 bg-[#fcf8ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8d681b]">
                  {artist.role || 'Stylist'}
                </span>
                <span className={`text-xs ${muted}`}>{artist.experience || '—'}</span>
                <span className={`flex items-center gap-1 text-xs font-semibold ${heading}`}>
                  <Star className="h-3.5 w-3.5 fill-[#d9b45b] text-[#d9b45b]" />
                  {Number(artist.rating || 0).toFixed(1)}
                  <span className={`font-normal ${muted}`}>({artist.reviewCount || 0})</span>
                </span>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(artist)}
                    className={`rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'text-stone-300 hover:bg-white/10' : 'text-stone-500 hover:bg-[#f6f0e5]'
                    }`}
                    aria-label={`Edit ${artist.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(artist)}
                    className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:hover:bg-rose-950/30"
                    aria-label={`Delete ${artist.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Edit artist' : 'Add an artist'}
        subtitle="Changes are saved to the artist directory and shown across the public site."
      >
        <form className="space-y-4" onSubmit={saveArtist} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Artist name" error={errors.name} darkMode={darkMode}>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={120} />
            </Field>
            <Field label="Role" error={errors.role} darkMode={darkMode}>
              <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} maxLength={80} placeholder="Senior Stylist" />
            </Field>
            <Field label="Experience" error={errors.experience} darkMode={darkMode}>
              <input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} maxLength={60} placeholder="5+ Years" />
            </Field>
            <Field label="Avatar image path or HTTPS URL" error={errors.avatar} darkMode={darkMode}>
              <input value={form.avatar} onChange={(event) => setForm({ ...form, avatar: event.target.value })} maxLength={500} placeholder="/hero-slide-1.jpg" />
            </Field>
            <Field label="Rating (0–5)" error={errors.rating} darkMode={darkMode}>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} />
            </Field>
            <Field label="Review count" error={errors.reviewCount} darkMode={darkMode}>
              <input type="number" min="0" step="1" value={form.reviewCount} onChange={(event) => setForm({ ...form, reviewCount: event.target.value })} />
            </Field>
          </div>
          <Field label="Bio" error={errors.bio} darkMode={darkMode}>
            <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} rows={3} maxLength={1200} />
          </Field>
          <Field label="Specialties" hint="One per line, up to 12." error={errors.specialties} darkMode={darkMode}>
            <textarea value={form.specialties} onChange={(event) => setForm({ ...form, specialties: event.target.value })} rows={4} maxLength={2200} placeholder={'Bridal makeup\nHair styling\nMehndi'} />
          </Field>
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4 dark:border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#b58a2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9d751e] disabled:cursor-wait disabled:opacity-60">
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create artist'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Remove “${pendingDelete?.name || 'artist'}”?`}
        message="This removes the artist from the public site. Existing bookings keep their saved artist details."
        confirmText="Remove artist"
      />
    </section>
  );
}

function Field({ label, hint, error, darkMode, children }) {
  const fieldClass = `mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 ${
    darkMode ? 'border-white/10 bg-black/20 text-white' : 'border-stone-200 bg-white text-stone-800'
  }`;
  const child = React.cloneElement(children, {
    className: `${fieldClass} ${children.props.className || ''}`
  });
  return (
    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
      {label}
      {hint && <span className="ml-2 font-normal text-stone-400">{hint}</span>}
      {child}
      {error && <span role="alert" className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}
    </label>
  );
}
