import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon, Clock, Plus, Trash2, Edit3, User,
  Phone, MapPin, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import StatusPill from '../../components/admin/StatusPill';
import { formatINR } from '../../utils/adminUtils';
import { services, artists } from '../../data/appointments';

export default function Appointments() {
  const {
    darkMode,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addToast,
  } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    service: services[0].name,
    price: services[0].price,
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: services[0].duration,
    artist: artists[0],
    location: 'At salon – Bandra flagship',
    notes: '',
    status: 'Confirmed',
  });
  const [errors, setErrors] = useState({});

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'All') return appointments;
    return appointments.filter(a => a.status === statusFilter);
  }, [appointments, statusFilter]);

  // When service changes in modal, auto-fill price and duration
  const handleServiceChange = (serviceName) => {
    const s = services.find(srv => srv.name === serviceName);
    if (s) {
      setFormData(prev => ({
        ...prev,
        service: s.name,
        price: s.price,
        duration: s.duration,
      }));
    } else {
      setFormData(prev => ({ ...prev, service: serviceName }));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointment(id, { status: newStatus });
    addToast({ type: 'success', message: `Booking ${id} set to ${newStatus}` });
  };

  const handleDeleteWithUndo = (apt) => {
    deleteAppointment(apt.id);
    addToast({
      type: 'info',
      message: `Deleted booking for ${apt.client}`,
      duration: 8000,
      undoAction: () => {
        addAppointment(apt);
        addToast({ type: 'success', message: `Restored booking for ${apt.client}` });
      },
    });
  };

  const handleSaveBooking = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addAppointment({
      ...formData,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration, 10) || 60,
    });

    addToast({
      type: 'success',
      message: `Booked appointment for ${formData.client}`,
    });
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'client',
      header: 'Client & Phone',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold block text-stone-900 dark:text-white">
            {val}
          </span>
          <span className="text-[11px] text-stone-400 block font-mono">
            {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service requested',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-xs block text-[#1e1519] dark:text-stone-200">
            {val}
          </span>
          <span className="text-[11px] text-stone-400 block">
            Artist: {row.artist || 'Unassigned'} • {row.duration} mins
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-xs block">
            {val}
          </span>
          <span className="text-[11px] text-stone-400 block">
            {row.time}
          </span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Service fee',
      sortable: true,
      render: (val) => (
        <span className="font-serif font-bold text-sm text-[#b58a2a]">
          {formatINR(val, { compact: false })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Booking status',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <StatusPill status={val} size="xs" />
          <select
            value={val}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className={`text-[11px] font-medium py-1 px-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#b58a2a] cursor-pointer ${
              darkMode
                ? 'bg-[#181416] border-white/10 text-stone-300'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <button
          type="button"
          aria-label={`Delete booking for ${row.client}`}
          onClick={() => handleDeleteWithUndo(row)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-[#1e1519]'
            }`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Salon & bridal appointments
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Manage luxury salon schedules, bridal suites, and master stylists
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              client: '',
              phone: '',
              service: services[0].name,
              price: services[0].price,
              date: new Date().toISOString().split('T')[0],
              time: '12:00',
              duration: services[0].duration,
              artist: artists[0],
              location: 'At salon – Bandra flagship',
              notes: '',
              status: 'Confirmed',
            });
            setErrors({});
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
        >
          <Plus className="w-4 h-4" />
          Add appointment
        </button>
      </div>

      {/* ── Status Filter Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              statusFilter === st
                ? 'bg-[#1e1519] text-white border-[#1e1519] dark:bg-amber-600 dark:border-amber-600 shadow-sm'
                : darkMode
                ? 'bg-[#181416] border-white/10 text-stone-400 hover:text-white'
                : 'bg-white border-[#e9e3dd] text-stone-600 hover:text-stone-900 shadow-sm'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* ── Appointments Table ── */}
      <DataTable
        columns={columns}
        data={filteredAppointments}
        keyField="id"
        searchPlaceholder="Search client name, phone, or service..."
        searchKeys={['client', 'phone', 'service', 'artist']}
        pageSize={10}
        emptyMessage="No salon appointments found for this status."
      />

      {/* ── Add Booking Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule salon appointment"
        subtitle="Book a luxury makeup, hair, or nail session with automated pricing"
      >
        <form onSubmit={handleSaveBooking} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Client name *
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData(p => ({ ...p, client: e.target.value }))}
                placeholder="e.g. Radhika Roy"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {errors.client && <p className="text-[11px] text-rose-500 mt-1">{errors.client}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Contact number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Select service (Auto-fills price)
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
              }`}
            >
              {services.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} — ₹{s.price.toLocaleString('en-IN')} ({s.duration} mins)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Fee (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Time slot
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Assigned lead stylist
              </label>
              <select
                value={formData.artist}
                onChange={(e) => setFormData(p => ({ ...p, artist: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              >
                {artists.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="At salon or Client home address"
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
            >
              Confirm booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
