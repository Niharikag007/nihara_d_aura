import React, { useMemo, useState } from 'react';
import { Clock3, LoaderCircle, Pencil, Plus, Search, Scissors, Sparkles, Trash2 } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { formatINR } from '../../utils/adminUtils';

const EMPTY_FORM = {
  name: '',
  category: 'Makeup',
  price: '',
  durationMinutes: '',
  image: '',
  description: '',
  inclusions: ''
};

const categoryFor = (service) => service.category === 'Makeup' ? 'Makeup' : 'Salon';

export default function Services() {
  const { darkMode, services, loading, addService, updateService, deleteService, addToast } = useAdminStore();
  const [category, setCategory] = useState('Makeup');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categoryCounts = useMemo(() => ({
    Makeup: services.filter((service) => categoryFor(service) === 'Makeup').length,
    Salon: services.filter((service) => categoryFor(service) === 'Salon').length
  }), [services]);

  const visibleServices = useMemo(() => services
    .filter((service) => categoryFor(service) === category)
    .filter((service) => `${service.name} ${service.description}`.toLowerCase().includes(search.trim().toLowerCase())),
  [services, category, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      name: service.name || '',
      category: categoryFor(service),
      price: String(service.price ?? ''),
      durationMinutes: String(service.durationMinutes ?? ''),
      image: service.image || '',
      description: service.description || '',
      inclusions: (service.inclusions || []).join('\n')
    });
    setErrors({});
    setModalOpen(true);
  };

  const saveService = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter a service name.';
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) nextErrors.price = 'Enter a price greater than zero.';
    if (!Number.isInteger(Number(form.durationMinutes)) || Number(form.durationMinutes) <= 0) {
      nextErrors.durationMinutes = 'Use a duration in whole minutes.';
    }
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
    if (!form.description.trim()) nextErrors.description = 'Add a short service description.';
    const inclusions = form.inclusions.split('\n').map((item) => item.trim()).filter(Boolean);
    if (inclusions.length > 12) nextErrors.inclusions = 'A service can have up to 12 inclusions.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      image: form.image.trim(),
      description: form.description.trim(),
      inclusions
    };
    setSaving(true);
    const saved = editing
      ? await updateService(editing.id, payload)
      : await addService(payload);
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
    const deleted = await deleteService(pendingDelete.id);
    if (deleted) addToast({ type: 'success', message: `Removed “${pendingDelete.name}” from the service menu` });
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
            <Sparkles className="h-3.5 w-3.5" /> Service atelier
          </p>
          <h1 className={`font-serif text-3xl font-semibold sm:text-4xl ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Signature services
          </h1>
          <p className={`mt-1 text-sm ${muted}`}>Manage the experiences shown in your public services menu and booking flow.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" /> Add service
        </button>
      </header>

      <div className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${surface}`}>
        <div className="flex gap-2" role="tablist" aria-label="Service category">
          {['Makeup', 'Salon'].map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                category === item
                  ? 'bg-[#2a1e1b] text-[#f3d994] shadow-sm'
                  : darkMode ? 'text-stone-300 hover:bg-white/5' : 'text-stone-600 hover:bg-[#f7f2e8]'
              }`}
            >
              {item}<span className="ml-2 text-xs opacity-70">{categoryCounts[item]}</span>
            </button>
          ))}
        </div>
        <label className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 sm:max-w-xs ${
          darkMode ? 'border-white/10 bg-black/20' : 'border-stone-200 bg-[#fcfbf8]'
        }`}>
          <Search className={`h-4 w-4 ${muted}`} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${category.toLowerCase()} services`}
            className={`w-full bg-transparent text-sm outline-none placeholder:text-stone-400 ${heading}`}
            aria-label="Search services"
          />
        </label>
      </div>

      {loading && services.length === 0 ? (
        <div className={`flex min-h-56 items-center justify-center gap-3 rounded-2xl border ${surface} ${muted}`}>
          <LoaderCircle className="h-5 w-5 animate-spin text-[#b58a2a]" /> Loading services…
        </div>
      ) : visibleServices.length === 0 ? (
        <div className={`rounded-2xl border px-6 py-14 text-center ${surface}`}>
          <Scissors className="mx-auto mb-3 h-8 w-8 text-[#b58a2a]" />
          <h2 className={`font-serif text-xl font-semibold ${heading}`} style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {search ? 'No matching services' : `No ${category} services yet`}
          </h2>
          <p className={`mx-auto mt-1 max-w-md text-sm ${muted}`}>
            {search ? 'Try another search term or clear your search.' : 'Add a service to make it available in the storefront and customer booking flow.'}
          </p>
          {!search && (
            <button type="button" onClick={openCreate} className="mt-5 text-sm font-semibold text-[#9b711e] hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500">
              Add the first service
            </button>
          )}
        </div>
      ) : (
        <div className={`overflow-hidden rounded-2xl border ${surface}`}>
          <div className={`hidden grid-cols-[minmax(0,2fr)_120px_110px_112px] gap-4 border-b px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] sm:grid ${
            darkMode ? 'border-white/10 text-stone-500' : 'border-stone-100 text-stone-400'
          }`}>
            <span>Service</span><span>Category</span><span>Duration</span><span className="text-right">Price</span>
          </div>
          <ul className="divide-y divide-stone-100 dark:divide-white/10">
            {visibleServices.map((service) => (
              <li key={service.id} className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,2fr)_120px_110px_112px] sm:items-center sm:gap-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={service.image}
                    alt=""
                    className="h-14 w-14 flex-shrink-0 rounded-xl border border-[#dfbc77]/40 bg-[#f7f2e8] object-cover"
                    onError={(event) => { event.currentTarget.src = '/hero-slide-1.jpg'; }}
                  />
                  <div className="min-w-0">
                    <h2 className={`truncate text-sm font-semibold ${heading}`}>{service.name}</h2>
                    <p className={`mt-1 line-clamp-2 text-xs leading-relaxed ${muted}`}>{service.description}</p>
                  </div>
                </div>
                <span className="w-fit rounded-full border border-[#dfbc77]/50 bg-[#fcf8ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8d681b]">
                  {categoryFor(service)}
                </span>
                <span className={`flex items-center gap-1.5 text-xs ${muted}`}>
                  <Clock3 className="h-3.5 w-3.5 text-[#b58a2a]" /> {service.durationMinutes} min
                </span>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className={`font-semibold ${heading}`}>{formatINR(service.price)}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className={`rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        darkMode ? 'text-stone-300 hover:bg-white/10' : 'text-stone-500 hover:bg-[#f6f0e5]'
                      }`}
                      aria-label={`Edit ${service.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(service)}
                      className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:hover:bg-rose-950/30"
                      aria-label={`Delete ${service.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Edit service' : 'Add a signature service'}
        subtitle="Changes are saved to the service catalogue and reflected in bookings."
      >
        <form className="space-y-4" onSubmit={saveService} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Service name" error={errors.name} darkMode={darkMode}>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={120} />
            </Field>
            <Field label="Category" error={errors.category} darkMode={darkMode}>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                <option value="Makeup">Makeup</option>
                <option value="Salon">Salon</option>
              </select>
            </Field>
            <Field label="Price (INR)" error={errors.price} darkMode={darkMode}>
              <input type="number" min="1" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </Field>
            <Field label="Duration (minutes)" error={errors.durationMinutes} darkMode={darkMode}>
              <input type="number" min="1" step="1" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
            </Field>
          </div>
          <Field label="Image path or HTTPS URL" error={errors.image} darkMode={darkMode}>
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} maxLength={500} placeholder="/hero-slide-1.jpg" />
          </Field>
          <Field label="Description" error={errors.description} darkMode={darkMode}>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} maxLength={1200} />
          </Field>
          <Field label="What's included" hint="One item per line, up to 12." error={errors.inclusions} darkMode={darkMode}>
            <textarea value={form.inclusions} onChange={(event) => setForm({ ...form, inclusions: event.target.value })} rows={4} maxLength={2200} />
          </Field>
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4 dark:border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#b58a2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9d751e] disabled:cursor-wait disabled:opacity-60">
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Remove “${pendingDelete?.name || 'service'}”?`}
        message="This removes the service from the public menu and future bookings. Existing bookings keep their saved service details."
        confirmText="Remove service"
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
