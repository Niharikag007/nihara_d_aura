import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Calendar, Clock, MapPin, Sparkles, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Bookings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBookings().then(res => {
      if (res && res.bookings) setBookings(res.bookings);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (bookingId) => {
    await api.cancelBooking(bookingId);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.bookingId === bookingId) {
        return { ...b, status: 'Cancelled', canCancel: false };
      }
      return b;
    }));
    showToast('Appointment Cancelled', 'info');
  };

  const getStatusPill = (status) => {
    if (status === 'Confirmed') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Confirmed
        </span>
      );
    }
    if (status === 'Cancelled') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Cancelled
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors flex-shrink-0"
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#1C1917] truncate">
            My Appointments
          </h1>
        </div>

        <Link to="/book" className="btn-gold px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase flex items-center gap-1 shadow-sm flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Booking</span>
        </Link>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
            <Calendar className="w-12 h-12 text-[#DFBC77] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-900">No Appointments Scheduled</h3>
            <p className="text-xs text-stone-500 mt-1">Book master artists for bridal glow, nail art, or hair styling.</p>
            <Link to="/book" className="btn-gold inline-block mt-4 px-6 py-2 rounded-full text-xs font-bold">
              Book Appointment
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-[#DFBC77]/40 p-3.5 sm:p-5 shadow-sm space-y-3 min-w-0"
            >
              {/* Top Row: Ref & Status */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <span className="font-sans text-sm font-bold tracking-wider text-[#1C1917]">
                  {booking.bookingId}
                </span>
                {getStatusPill(booking.status)}
              </div>

              {/* Service & Artist */}
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  {booking.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Artist: <strong className="text-stone-800">{booking.artist}</strong>
                </p>
              </div>

              {/* Date, Time & Location Meta */}
              <div className="bg-[#FAF3E8]/40 p-3 rounded-xl border border-stone-100 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-stone-900">
                    <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-stone-900">
                    <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                    {booking.timeSlot}
                  </span>
                </div>

                <div className="flex items-start gap-1.5 pt-1 text-[11px] text-stone-500 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                  <span className="min-w-0 break-words leading-tight">{booking.location} — {booking.address}</span>
                </div>
              </div>

              {/* Cancellation link if applicable */}
              {booking.canCancel && booking.status === 'Confirmed' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
                  >
                    <span>Cancel Appointment</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
