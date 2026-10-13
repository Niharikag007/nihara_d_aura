import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  MapPin, 
  Home, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  User, 
  ShoppingBag,
  Star,
  Sun,
  Moon,
  CalendarDays,
  RotateCcw
} from 'lucide-react';
import { mockData } from '../services/mockData';
import { api } from '../services/api';

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Selected service IDs
  const [selectedServiceIds, setSelectedServiceIds] = useState(
    preselectedServiceId ? [preselectedServiceId] : ['srv_bridal_glow']
  );

  // Step 2: Dynamic Calendar & Time Slot State
  const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 16));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('all'); // 'all', 'morning', 'afternoon', 'evening'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('01:00 PM');

  // Step 3: Location
  const [locationType, setLocationType] = useState('home'); // 'salon' or 'home'
  const [serviceAddress, setServiceAddress] = useState(
    'Flat 302, Royal Palms, Jubilee Hills, Hyderabad'
  );

  // Step 4: Artist
  const [selectedArtistId, setSelectedArtistId] = useState('art_ananya');

  // Step 5: Final booking details & Confirmation Modal
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('BK-126697');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Derived selected services
  const selectedServices = mockData.services.filter(s => selectedServiceIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const travelCharge = locationType === 'home' ? 500 : 0;
  const totalPayable = subtotal + travelCharge;

  // Selected artist object
  const selectedArtist = mockData.artists.find(a => a.id === selectedArtistId) || mockData.artists[0];

  // Toggle service selection in Step 1
  const toggleService = (serviceId) => {
    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  // Month navigation helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToCurrent = () => {
    const target = new Date(2026, 9, 16);
    setCurrentCalDate(new Date(target.getFullYear(), target.getMonth(), 1));
    setSelectedDate(target);
  };

  // Helper date formatters
  const formatSelectedDateShort = (date) => {
    if (!date) return 'Fri, Oct 16, 2026';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSelectedDateFull = (date) => {
    if (!date) return 'Friday, 16 October 2026';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Compute days for active calendar view
  const calYear = currentCalDate.getFullYear();
  const calMonth = currentCalDate.getMonth();
  const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startingDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday

  // Dynamic Time slots catalog with period categorization and badges
  const allTimeSlots = [
    { time: '09:30 AM', period: 'morning', badge: 'Early Bird', popular: false },
    { time: '11:00 AM', period: 'morning', badge: 'Popular', popular: true },
    { time: '12:15 PM', period: 'afternoon', badge: 'Prime Slot', popular: false },
    { time: '01:00 PM', period: 'afternoon', badge: 'Recommended', popular: true },
    { time: '02:30 PM', period: 'afternoon', badge: 'Available', popular: false },
    { time: '04:00 PM', period: 'afternoon', badge: 'Available', popular: false },
    { time: '05:30 PM', period: 'evening', badge: 'Evening Glow', popular: true },
    { time: '07:00 PM', period: 'evening', badge: 'Night Salon', popular: false }
  ];

  const filteredTimeSlots = selectedTimePeriod === 'all'
    ? allTimeSlots
    : allTimeSlots.filter(s => s.period === selectedTimePeriod);

  // Final booking submission
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const bookingPayload = {
      serviceIds: selectedServiceIds,
      date: formatSelectedDateShort(selectedDate),
      timeSlot: selectedTimeSlot,
      locationType,
      serviceAddress: { streetAddress: serviceAddress },
      artistId: selectedArtist.id,
      artistName: selectedArtist.name
    };

    const res = await api.createBooking(bookingPayload);
    setIsSubmitting(false);
    if (res && res.booking) {
      setConfirmedBookingRef(res.booking.bookingId);
      setIsConfirmedModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Header & Step Tracker */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
          Book Services
        </h1>
        <p className="text-xs font-semibold text-[#855F14] tracking-widest uppercase mt-1">
          Step {currentStep} of 5
        </p>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? 'w-8 bg-[#C59B27]'
                  : currentStep > step
                  ? 'w-4 bg-[#DFBC77]'
                  : 'w-4 bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#DFBC77]/40 p-6 sm:p-8 shadow-sm">
        
        {/* ================= STEP 1: SELECT BEAUTY SERVICES ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Select Beauty Services
              </h2>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                Tap to select one or multiple beauty services below.
              </p>
            </div>

            {/* Selected Count & Subtotal Banner (As seen in video!) */}
            {selectedServiceIds.length > 0 && (
              <div className="bg-[#FAF3E8] border border-[#DFBC77] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#855F14]">
                <span>
                  {selectedServiceIds.length} service(s) Selected
                </span>
                <span>
                  Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Services List with Checkboxes */}
            <div className="space-y-3">
              {mockData.services.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#FAF3E8]/80 border-[#C59B27] shadow-sm'
                        : 'bg-white border-stone-200 hover:border-[#DFBC77]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-[#1C1917] truncate">
                          {service.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {service.durationMinutes} Mins • <strong className="text-stone-900">₹{service.price.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Radio/Checkbox indicator matching video */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#C59B27] border-[#C59B27] text-white'
                        : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={selectedServiceIds.length === 0}
                className="w-full sm:w-auto btn-gold px-8 py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE DATE & TIME ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <h2 className="font-serif text-xl font-bold text-[#1C1917] truncate">
                  Choose Date & Time
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Select your preferred appointment date and time slot.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-50/80 border border-amber-200/70 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-[#855F14] flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                <span>Est. Duration: {selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0)} Mins</span>
              </div>
            </div>

            {/* Dynamic Calendar Container */}
            <div className="bg-[#FAF3E8]/60 p-3.5 sm:p-5 rounded-2xl border border-[#DFBC77]/60 shadow-sm space-y-4 min-w-0">
              {/* Month & Year Navigation Header */}
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="font-serif text-sm sm:text-lg font-bold text-[#1C1917] truncate">
                    {monthNames[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={handleJumpToCurrent}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:border-[#DFBC77] hover:text-[#855F14] transition-colors flex-shrink-0"
                    title="Jump to current date"
                  >
                    Today
                  </button>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                    className="w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] sm:min-w-[36px] rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 active:scale-95 transition-all shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    className="w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] sm:min-w-[36px] rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 active:scale-95 transition-all shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers (Sunday to Saturday) */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-400">
                <span className="text-[#855F14]/70">S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span className="text-[#855F14]/70">S</span>
              </div>

              {/* Dynamic Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty offset days for the start of the month */}
                {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-8 w-8 sm:h-10 sm:w-10 mx-auto" />
                ))}

                {/* Actual Month Days */}
                {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayDate = new Date(calYear, calMonth, dayNum);
                  const isSelected = selectedDate &&
                    selectedDate.getFullYear() === calYear &&
                    selectedDate.getMonth() === calMonth &&
                    selectedDate.getDate() === dayNum;

                  const isToday = calYear === 2026 && calMonth === 9 && dayNum === 16;

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedDate(dayDate)}
                      className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto rounded-full flex flex-col items-center justify-center font-medium transition-all relative ${
                        isSelected
                          ? 'bg-[#855F14] text-white font-bold shadow-md scale-105 ring-2 ring-[#DFBC77]'
                          : isToday
                          ? 'bg-amber-100 text-stone-900 font-bold border border-[#C59B27]'
                          : 'text-stone-700 hover:bg-[#EAD7AD]/50 active:scale-95'
                      }`}
                    >
                      <span className="leading-none">{dayNum}</span>
                      {/* Subtle availability dot */}
                      {!isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#C59B27] mt-0.5 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Legend / Hint */}
              <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#855F14]" />
                  <span>Selected Date</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-100 border border-[#C59B27]" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Dynamic Time Slot Selector */}
            <div className="space-y-3 pt-2 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Time Slot
                </label>
                
                {/* Period Filter Tabs with horizontal scroll */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl max-w-full overflow-x-auto no-scrollbar text-[10px] sm:text-[11px]">
                  <button
                    onClick={() => setSelectedTimePeriod('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex-shrink-0 transition-all ${
                      selectedTimePeriod === 'all'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    All ({allTimeSlots.length})
                  </button>
                  <button
                    onClick={() => setSelectedTimePeriod('morning')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 flex-shrink-0 transition-all ${
                      selectedTimePeriod === 'morning'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Morning</span>
                  </button>
                  <button
                    onClick={() => setSelectedTimePeriod('afternoon')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 flex-shrink-0 transition-all ${
                      selectedTimePeriod === 'afternoon'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#C59B27]" />
                    <span>Afternoon</span>
                  </button>
                  <button
                    onClick={() => setSelectedTimePeriod('evening')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 flex-shrink-0 transition-all ${
                      selectedTimePeriod === 'evening'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-indigo-500" />
                    <span>Evening</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {filteredTimeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`py-2 px-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 relative active:scale-98 ${
                        isSelected
                          ? 'bg-[#855F14] text-white border-[#855F14] shadow-md ring-2 ring-[#DFBC77]/60'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-[#DFBC77] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        <span className="truncate">{slot.time}</span>
                      </div>
                      <span className={`text-[9px] font-normal tracking-wide uppercase truncate ${
                        isSelected ? 'text-[#FAF3E8]' : 'text-stone-400'
                      }`}>
                        {slot.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Appointment Summary Banner */}
            <div className="bg-[#FAF3E8] border border-[#DFBC77] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs min-w-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C59B27]/20 text-[#855F14] flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#855F14]">
                    Selected Appointment Schedule
                  </p>
                  <p className="font-serif text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {formatSelectedDateFull(selectedDate)} • {selectedTimeSlot}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Slot Available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-gold-outline px-6 py-2.5 rounded-full text-xs uppercase font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-gold px-8 py-2.5 rounded-full text-xs uppercase font-bold flex items-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SELECT LOCATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Select Location
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Choose between our Bandra flagship salon or luxury at-home service.
              </p>
            </div>

            {/* Location Options */}
            <div className="space-y-3">
              {/* Option A: Salon Visit */}
              <div
                onClick={() => setLocationType('salon')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                  locationType === 'salon'
                    ? 'bg-[#FAF3E8] border-[#C59B27] shadow-sm'
                    : 'bg-white border-stone-200 hover:border-[#DFBC77]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#855F14] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#1C1917]">
                      Nihara Luxury Salon Visit
                    </h4>
                    <p className="text-xs text-stone-500">
                      Bandra Flagship Salon, Mumbai
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  locationType === 'salon' ? 'border-[#C59B27] bg-[#C59B27]' : 'border-stone-300'
                }`}>
                  {locationType === 'salon' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Option B: At Home Service (+500) */}
              <div
                onClick={() => setLocationType('home')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                  locationType === 'home'
                    ? 'bg-[#FAF3E8] border-[#C59B27] shadow-sm'
                    : 'bg-white border-stone-200 hover:border-[#DFBC77]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#855F14] flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#1C1917]">
                      At Home Luxury Service (+₹500)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Therapist visits your home with full equipment
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  locationType === 'home' ? 'border-[#C59B27] bg-[#C59B27]' : 'border-stone-300'
                }`}>
                  {locationType === 'home' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* If Home Service: Address Card / Input matching video */}
            {locationType === 'home' && (
              <div className="mt-4 p-4 rounded-2xl bg-[#FCF9F2] border border-[#DFBC77]/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#855F14]">
                  Your Delivery & Service Address
                </span>
                <p className="text-xs font-semibold text-stone-800">
                  {serviceAddress}
                </p>
                <p className="text-[11px] text-stone-500">
                  Primary Contact: Amit Kumar (+91 8004116370)
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-gold-outline px-6 py-2.5 rounded-full text-xs uppercase font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="btn-gold px-8 py-2.5 rounded-full text-xs uppercase font-bold flex items-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CHOOSE MASTER ARTIST ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Choose Master Artist
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Select preferred artist or choose "Any Available Specialist"
              </p>
            </div>

            <div className="space-y-3">
              {mockData.artists.map((artist) => {
                const isSelected = selectedArtistId === artist.id;
                return (
                  <div
                    key={artist.id}
                    onClick={() => setSelectedArtistId(artist.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#FAF3E8] border-[#C59B27] shadow-sm'
                        : 'bg-white border-stone-200 hover:border-[#DFBC77]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-[#1C1917] truncate">
                          {artist.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5 truncate">
                          {artist.title}
                          {artist.rating && (
                            <span className="ml-2 font-semibold text-stone-700">
                              • ★ {artist.rating}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-[#C59B27] bg-[#C59B27]' : 'border-stone-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-gold-outline px-6 py-2.5 rounded-full text-xs uppercase font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="btn-gold px-8 py-2.5 rounded-full text-xs uppercase font-bold flex items-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: BOOKING SUMMARY ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Booking Summary
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Review your appointment details and confirm booking.
              </p>
            </div>

            {/* Selected Services breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                Selected Services
              </span>
              <div className="space-y-2">
                {selectedServices.map(s => (
                  <div key={s.id} className="bg-[#FAF3E8]/50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt={s.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-serif font-bold text-stone-900">{s.name}</p>
                        <p className="text-stone-500">{s.durationMinutes} Mins</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">₹{s.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Table Card matching video */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Date</span>
                <span className="font-semibold text-stone-900">{formatSelectedDateShort(selectedDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Time Slot</span>
                <span className="font-semibold text-stone-900">{selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Location</span>
                <span className="font-semibold text-stone-900">
                  {locationType === 'home' ? 'At Home Service' : 'At Salon - Bandra Flagship'}
                </span>
              </div>
              {locationType === 'home' && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Address</span>
                  <span className="font-semibold text-stone-900 text-right max-w-xs">{serviceAddress}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Artist</span>
                <span className="font-semibold text-stone-900">{selectedArtist.name}</span>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-1.5 text-xs text-stone-600 bg-[#FCF9F2] p-4 rounded-2xl border border-[#DFBC77]/60">
              <div className="flex justify-between">
                <span>Services Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>At-Home Travel Charge</span>
                <span className="font-semibold text-stone-900">₹{travelCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Payable</span>
                <span className="text-[#855F14] font-sans font-bold">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="btn-gold-outline px-6 py-2.5 rounded-full text-xs uppercase font-bold"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="btn-gold px-8 py-3 rounded-full text-xs uppercase font-bold flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm & Book'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ================= CONFIRMATION MODAL (Matching Video & APK) ================= */}
      {isConfirmedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#DFBC77]/50 animate-scale-in">
            
            {/* Gold Shopping Bag Emblem */}
            <div className="w-16 h-16 rounded-full bg-[#FCF9F2] border-2 border-[#DFBC77] flex items-center justify-center mx-auto text-[#C59B27] shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Appointment Confirmed!
            </h3>

            <p className="text-xs font-sans font-bold tracking-wider text-[#855F14] bg-[#FAF3E8] py-1 px-3 rounded-full inline-block">
              Booking Ref: {confirmedBookingRef}
            </p>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedServiceIds.length} services scheduled for <br />
              <strong className="text-stone-900">{formatSelectedDateShort(selectedDate)} at {selectedTimeSlot}</strong>
            </p>

            <button
              onClick={() => {
                setIsConfirmedModalOpen(false);
                navigate('/bookings');
              }}
              className="w-full btn-gold py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-md"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
