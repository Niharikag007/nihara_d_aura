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
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '',
    isDefault: false
  });

  const [editFormData, setEditFormData] = useState({
    type: 'Home',
    fullName: '',
    phone: '',
    streetAddress: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '',
    isDefault: false
  });

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
      type: addr.type || 'Home',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      streetAddress: addr.streetAddress || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      postalCode: addr.postalCode || '',
      isDefault: !!addr.isDefault
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Address
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAddr || !editFormData.fullName || !editFormData.streetAddress) return;

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
      showToast('Address updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update address', 'error');
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
    if (!newAddr.fullName || !newAddr.streetAddress) return;

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
      }
      setIsAddModalOpen(false);
      setNewAddr({
        type: 'Home',
        fullName: '',
        phone: '',
        streetAddress: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '',
        isDefault: false
      });
      showToast('New sanctuary address saved', 'success');
    } catch (err) {
      showToast('Failed to save address', 'error');
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
              className="bg-white rounded-2xl border border-[#DFBC77]/40 p-4 sm:p-5 shadow-sm space-y-2.5 relative transition-all hover:border-[#DFBC77] group"
            >
              {/* Top row: Type & Actions (Edit, Delete, Default Badge) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3E8] text-[#855F14] flex items-center justify-center flex-shrink-0">
                    {addr.type === 'Office' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <Home className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1C1917] truncate">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex-shrink-0">
                      DEFAULT
                    </span>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] text-stone-400 hover:text-[#855F14] font-medium mr-1 hidden sm:inline-block"
                    >
                      Set as Default
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-stone-600 hover:text-[#855F14] hover:bg-[#FAF3E8] border border-transparent hover:border-[#DFBC77]/50 transition-all flex items-center gap-1 text-xs font-semibold"
                    title="Edit Address"
                    aria-label={`Edit ${addr.type} address`}
                  >
                    <Pencil className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleOpenDelete(addr)}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all flex items-center gap-1 text-xs font-semibold"
                    title="Delete Address"
                    aria-label={`Delete ${addr.type} address`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Recipient & Full Address */}
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {addr.fullName}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed break-words pt-0.5">
                  {addr.streetAddress}
                </p>
                <p className="text-xs text-stone-500 font-mono pt-1 flex items-center gap-2">
                  <span>Phone: {addr.phone}</span>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] text-stone-400 hover:text-[#855F14] font-medium sm:hidden underline decoration-dotted"
                    >
                      Make Default
                    </button>
                  )}
                </p>
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 animate-scale-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#855F14] flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Edit Address
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAddr(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Address Label</label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                >
                  <option value="Home">Home Sanctuary</option>
                  <option value="Office">Corporate / Office</option>
                  <option value="Other">Other Sanctuary</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Street Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Apartment, building, street, area, city, pincode"
                  value={editFormData.streetAddress}
                  onChange={(e) => setEditFormData({ ...editFormData, streetAddress: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsDefault"
                  checked={editFormData.isDefault}
                  onChange={(e) => setEditFormData({ ...editFormData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#855F14] focus:ring-[#DFBC77] accent-[#855F14]"
                />
                <label htmlFor="editIsDefault" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAddr(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider shadow-sm"
                >
                  Save Changes
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
              {deletingAddr.streetAddress}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 animate-scale-in relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Add New Address
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Address Label</label>
                <select
                  value={newAddr.type}
                  onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other Sanctuary</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600">Street Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Apartment, building, street, area, city, pincode"
                  value={newAddr.streetAddress}
                  onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-xs bg-[#FCF9F2] focus:ring-1 focus:ring-[#DFBC77] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addIsDefault"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#855F14] focus:ring-[#DFBC77] accent-[#855F14]"
                />
                <label htmlFor="addIsDefault" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Set as default address
                </label>
              </div>

              <button
                type="submit"
                className="w-full btn-gold py-3 rounded-xl text-xs uppercase font-bold tracking-wider mt-4 shadow-sm"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
