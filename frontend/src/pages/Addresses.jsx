import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home, 
  Building2, 
  Plus, 
  Check, 
  X, 
  MapPin, 
  Pencil, 
  Trash2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Addresses() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Address objects for action
  const [editingAddr, setEditingAddr] = useState(null);
  const [deletingAddr, setDeletingAddr] = useState(null);

  // Form states
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    fullName: '',
    phone: '',
    streetAddress: '',
    area: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });

  const [editFormData, setEditFormData] = useState({
    type: 'Home',
    fullName: '',
    phone: '',
    streetAddress: '',
    area: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });

  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Fetch city/state from Indian PIN code
  const handlePincodeLookup = async (pincode, isEdit = false) => {
    if (!pincode || pincode.length !== 6) return;
    setFetchingPincode(true);
    setPincodeError('');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice?.[0];
        if (postOffice) {
          const updater = isEdit ? setEditFormData : setNewAddr;
          updater(prev => ({
            ...prev,
            city: postOffice.District || prev.city,
            state: postOffice.State || prev.state
          }));
        } else {
          setPincodeError('City/state not found for this PIN code. Please enter manually below.');
        }
      } else {
        setPincodeError('Invalid PIN code. Please enter city/state manually below.');
      }
    } catch (error) {
      console.error('PIN code lookup failed:', error);
      setPincodeError('Network error. Please enter city/state manually below.');
    } finally {
      setFetchingPincode(false);
    }
  };

  const loadAddresses = useCallback(async () => {
    try {
      const res = await api.getAddresses();
      if (res && res.addresses) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Set default address
  const handleSetDefault = async (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    await api.updateAddress(id, { isDefault: true });
    showToast('Default sanctuary updated', 'success');
  };

  // Open Edit Modal
  const handleOpenEdit = (addr) => {
    setEditingAddr(addr);
    setEditFormData({
      type: addr.type || addr.tag || 'Home',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      streetAddress: addr.streetAddress || addr.street || '',
      area: addr.area || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || addr.pincode || '',
      isDefault: !!addr.isDefault
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Address
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.fullName || !editFormData.streetAddress || !editFormData.postalCode) {
      showToast('Please fill name, street address, and PIN code', 'error');
      return;
    }
    if (!editFormData.city || !editFormData.state) {
      showToast('Please fill city and state (auto-filled from PIN code or enter manually)', 'error');
      return;
    }

    try {
      await api.updateAddress(editingAddr.id, editFormData);
      setAddresses(prev => prev.map(a => {
        if (a.id === editingAddr.id) {
          return { ...a, ...editFormData };
        }
        if (editFormData.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      }));
      setIsEditModalOpen(false);
      setEditingAddr(null);
      setPincodeError('');
      showToast('Address updated successfully', 'success');
    } catch (err) {
      console.error('Edit address error:', err);
      showToast(err.message || 'Failed to update address', 'error');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (addr) => {
    setDeletingAddr(addr);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Address
  const handleConfirmDelete = async () => {
    if (!deletingAddr) return;

    try {
      await api.deleteAddress(deletingAddr.id);
      setAddresses(prev => prev.filter(a => a.id !== deletingAddr.id));
      setIsDeleteModalOpen(false);
      setDeletingAddr(null);
      showToast('Address removed', 'info');
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  // Add Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.streetAddress || !newAddr.postalCode) {
      showToast('Please fill name, street address, and PIN code', 'error');
      return;
    }
    if (!newAddr.city || !newAddr.state) {
      showToast('Please fill city and state (auto-filled from PIN code or enter manually)', 'error');
      return;
    }

    const payload = {
      isDefault: addresses.length === 0 ? true : newAddr.isDefault,
      ...newAddr
    };

    try {
      const res = await api.addAddress(payload);
      if (res && res.address) {
        if (payload.isDefault) {
          setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(res.address));
        } else {
          setAddresses(prev => [...prev, res.address]);
        }
        setIsAddModalOpen(false);
        setNewAddr({
          type: 'Home',
          fullName: '',
          phone: '',
          streetAddress: '',
          area: '',
          city: '',
          state: '',
          postalCode: '',
          isDefault: false
        });
        setPincodeError('');
        showToast('Address saved successfully', 'success');
      } else {
        showToast('Server error: could not save address', 'error');
      }
    } catch (err) {
      console.error('Add address error:', err);
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors flex-shrink-0"
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] truncate">
            Saved Addresses
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New</span>
        </button>
      </div>

      {/* Address Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">
            Loading your sanctuaries...
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#855F14] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">No Saved Addresses</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your home, office, or luxury venue to enjoy seamless checkout and at-home salon bookings.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider mt-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl border border-[#DFBC77]/40 shadow-sm relative transition-all hover:border-[#DFBC77] group overflow-hidden"
            >
              {/* Header with Type and Actions */}
              <div className="bg-gradient-to-r from-[#0A6847] to-[#085238] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center">
                    {addr.type === 'Office' ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : (
                      <Home className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="font-serif font-bold text-sm text-white">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
                      DEFAULT
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] text-white/80 hover:text-white font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Address"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(addr)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Address Content */}
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">Full Name</span>
                    <span className="text-xs font-semibold text-stone-900">{addr.fullName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">Flat, House no.</span>
                    <span className="text-xs text-stone-700 leading-relaxed">{addr.streetAddress || addr.street}</span>
                  </div>
                  {addr.area && (
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">Area, Colony</span>
                      <span className="text-xs text-stone-700 leading-relaxed">{addr.area}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">City</span>
                    <span className="text-xs text-stone-700">{addr.city}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">State</span>
                    <span className="text-xs text-stone-700">{addr.state}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">Pincode</span>
                    <span className="text-xs text-stone-700 font-mono">{addr.postalCode || addr.pincode}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide w-32 flex-shrink-0">Phone</span>
                    <span className="text-xs text-stone-700 font-mono">{addr.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Address Button at Bottom */}
      {addresses.length > 0 && (
        <div className="pt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full btn-gold py-3.5 rounded-2xl text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>
      )}

      {/* ================= EDIT ADDRESS MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#DFBC77]/40 animate-scale-in relative overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-r from-[#0A6847] to-[#085238] px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAddr(null);
                }}
                className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg font-bold text-white">
                Edit Address
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3">
              {/* Address Label */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">Address Label</label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Full Name (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Flat, House no., Building, Company, Apartment (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter flat, house no., building, company, apartment"
                  value={editFormData.streetAddress}
                  onChange={(e) => setEditFormData({ ...editFormData, streetAddress: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Area, Colony, Landmark (Optional) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Area, Colony, Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter area, colony, landmark"
                  value={editFormData.area}
                  onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* City (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter city"
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Pincode (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter pincode"
                    maxLength={6}
                    value={editFormData.postalCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setEditFormData({ ...editFormData, postalCode: val });
                      if (val.length === 6) handlePincodeLookup(val, true);
                    }}
                    className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                  />
                  {fetchingPincode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">Fetching...</span>
                  )}
                </div>
                {pincodeError && <p className="text-[10px] text-amber-700 mt-1">{pincodeError}</p>}
              </div>

              {/* State */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={editFormData.state}
                  onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Phone Number (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter phone number"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Set as Default Address Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsDefault"
                  checked={editFormData.isDefault}
                  onChange={(e) => setEditFormData({ ...editFormData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0A6847] focus:ring-[#0A6847] accent-[#0A6847]"
                />
                <label htmlFor="editIsDefault" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Set as Default Address
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAddr(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-[#0A6847] text-white hover:bg-[#085238] transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && deletingAddr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-rose-200 animate-scale-in text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Delete Address?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-stone-900">{deletingAddr.type}</strong> ({deletingAddr.fullName}) from your saved sanctuaries?
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-left text-xs text-stone-600 truncate">
              {deletingAddr.streetAddress || deletingAddr.street}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingAddr(null);
                }}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD ADDRESS MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#DFBC77]/40 animate-scale-in relative overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-r from-[#0A6847] to-[#085238] px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-lg font-bold text-white">
                Shipping Addresses
              </h3>
            </div>

            <form onSubmit={handleAddAddress} className="p-4 space-y-3">
              {/* Address Label */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">Address Label</label>
                <select
                  value={newAddr.type}
                  onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Full Name (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Flat, House no., Building, Company, Apartment (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter flat, house no., building, company, apartment"
                  value={newAddr.streetAddress}
                  onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Area, Colony, Landmark (Optional) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Area, Colony, Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter area, colony, landmark"
                  value={newAddr.area}
                  onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* City (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter city"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Pincode (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter pincode"
                    maxLength={6}
                    value={newAddr.postalCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setNewAddr({ ...newAddr, postalCode: val });
                      if (val.length === 6) handlePincodeLookup(val, false);
                    }}
                    className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                  />
                  {fetchingPincode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">Fetching...</span>
                  )}
                </div>
                {pincodeError && <p className="text-[10px] text-amber-700 mt-1">{pincodeError}</p>}
              </div>

              {/* State */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Phone Number (Required) */}
              <div>
                <label className="text-[11px] font-bold text-stone-600">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter phone number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:ring-1 focus:ring-[#0A6847] focus:outline-none"
                />
              </div>

              {/* Set as Default Address Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addIsDefault"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0A6847] focus:ring-[#0A6847] accent-[#0A6847]"
                />
                <label htmlFor="addIsDefault" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Set as Default Address
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-[#0A6847] text-white hover:bg-[#085238] transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
