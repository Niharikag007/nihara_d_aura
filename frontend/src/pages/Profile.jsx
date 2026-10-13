import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Heart, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Edit3, 
  ChevronRight, 
  X,
  Upload,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || 'Amit Kumar',
    email: user?.email || 'amitky2056@gmail.com',
    phone: user?.phone || '+91 8004116370',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  });

  // Keep form synchronized if user profile updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar: user.avatar || prev.avatar
      }));
      setPreviewPhoto(user.avatar || prev.avatar);
    }
  }, [user]);

  // Auth guard: redirect to login if not authenticated (safe after all hooks)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Optimize and resize uploaded image (crystal clear & lightweight)
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG, etc.)', 'error');
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPreviewPhoto(optimizedDataUrl);
        showToast('Image selected! Click "Save Photo" to apply.', 'info');
      };
      img.onerror = () => {
        showToast('Unable to process image file.', 'error');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Save photo to auth state & backend
  const handleApplyPhoto = async () => {
    setFormData(prev => ({ ...prev, avatar: previewPhoto }));
    await updateProfile({ avatar: previewPhoto });
    setIsPhotoModalOpen(false);
    showToast('Profile photo updated successfully!', 'success');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditModalOpen(false);
    showToast('Profile details updated successfully!', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out of Nihara account', 'info');
    navigate('/login');
  };

  const menuItems = [
    ...(isAdmin ? [
      {
        title: 'Admin Dashboard (Catalog & Offers)',
        subtitle: 'Manage products, stock levels & active promo coupons',
        icon: ShieldCheck,
        link: '/admin',
        badge: 'Admin Panel'
      }
    ] : [
      {
        title: 'Admin Portal Login',
        subtitle: 'Sign in with admin credentials to manage inventory',
        icon: KeyRound,
        link: '/login?role=admin',
        badge: 'Staff'
      }
    ]),
    {
      title: 'My Orders',
      subtitle: 'Track past purchases and active orders',
      icon: ShoppingBag,
      link: '/orders'
    },
    {
      title: 'My Bookings',
      subtitle: 'View upcoming salon & at-home appointments',
      icon: Calendar,
      link: '/bookings'
    },
    {
      title: 'Saved Addresses',
      subtitle: 'Manage home & office delivery addresses',
      icon: MapPin,
      link: '/addresses'
    },
    {
      title: 'My Wishlist',
      subtitle: 'Saved items & beauty favorites',
      icon: Heart,
      link: '/wishlist'
    },
    {
      title: 'Help & Concierge Support',
      subtitle: '24/7 dedicated beauty advisor',
      icon: HelpCircle,
      onClick: () => showToast('Connecting to 24/7 Concierge: +91 92660 59846', 'info')
    },
    {
      title: 'Settings',
      subtitle: 'Notifications, currency & privacy',
      icon: Settings,
      onClick: () => showToast('Preferences updated: INR (₹) / SMS Enabled', 'info')
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-8 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-2xl lg:max-w-3xl mx-auto">
      
      {/* Title */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#1C1917] mb-6 lg:mb-10">
        My Profile
      </h1>

      {/* User Info Card with interactive Avatar Upload Badge */}
      <div className="bg-white rounded-2xl border border-[#DFBC77]/40 p-4 sm:p-5 lg:p-6 shadow-sm flex items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center gap-4">
          
          {/* Avatar with Upload badge */}
          <div 
            className="relative group cursor-pointer"
            onClick={() => {
              setPreviewPhoto(user?.avatar || formData.avatar);
              setSelectedFileName('');
              setIsPhotoModalOpen(true);
            }}
            title="Click to upload profile photo"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
              alt={user?.name || 'User'}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-[#C59B27] shadow group-hover:ring-2 group-hover:ring-[#C59B27]/50 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#C59B27] text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 group-hover:bg-[#A87D17] transition-transform">
              <Upload className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#1C1917] flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>{user?.name || 'Amit Kumar'}</span>
              <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isAdmin 
                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                  : 'bg-[#FAF3E8] text-[#855F14] border-[#DFBC77]/40'
              }`}>
                {isAdmin ? '🛡️ Admin' : '👤 Customer'}
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#855F14] border border-[#DFBC77]/40">
                {user?.tier || 'Royal Elite'}
              </span>
            </h2>
            <p className="text-xs lg:text-sm text-stone-500">{user?.email || 'amitky2056@gmail.com'}</p>
            <p className="text-xs lg:text-sm text-stone-500 font-mono mt-0.5">{user?.phone || '+91 8004116370'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Photo Button */}
          <button
            onClick={() => {
              setPreviewPhoto(user?.avatar || formData.avatar);
              setSelectedFileName('');
              setIsPhotoModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF3E8] hover:bg-[#F2E5CE] text-[#855F14] border border-[#DFBC77]/60 transition-all shadow-sm"
            title="Upload photo"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          {/* Edit Profile Info Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2.5 rounded-full hover:bg-[#FAF3E8] text-[#855F14] transition-colors"
            title="Edit profile information"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Options List */}
      <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-10">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center justify-between p-4 lg:p-5 bg-white rounded-2xl border border-[#DFBC77]/30 shadow-sm hover:border-[#C59B27] hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#FAF3E8] text-[#855F14] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-sm lg:text-base font-bold text-[#1C1917]">
                    {item.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-stone-500 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-stone-400" />
            </div>
          );

          if (item.link) {
            return (
              <Link key={idx} to={item.link}>
                {content}
              </Link>
            );
          }
          return (
            <div key={idx} onClick={item.onClick}>
              {content}
            </div>
          );
        })}

        {/* Log Out Option */}
        <div
          onClick={handleLogout}
          className="flex items-center justify-between p-4 lg:p-5 bg-white rounded-2xl border border-rose-100 shadow-sm hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm lg:text-base font-bold text-rose-600">
                Log Out
              </h3>
              <p className="text-xs lg:text-sm text-stone-500 mt-0.5">
                Sign out from your Nihara account
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-stone-400" />
        </div>
      </div>

      {/* ================= PURE IMAGE UPLOAD MODAL (No Camera, No Presets) ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 animate-scale-in relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-5">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Upload Profile Photo
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Circular Avatar Preview */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <img
                  src={previewPhoto}
                  alt="Avatar preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#C59B27] shadow-lg"
                />
                <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-[#1C1917] text-white text-[9px] font-bold uppercase rounded-full shadow">
                  Preview
                </span>
              </div>
              {selectedFileName ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-2.5 truncate max-w-xs border border-emerald-200">
                  ✓ {selectedFileName}
                </span>
              ) : (
                <p className="text-[11px] text-stone-500 mt-2">
                  This photo will appear across your orders & account
                </p>
              )}
            </div>

            {/* Hidden Native File Input (Accepts ALL image types) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.bmp,.heic"
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-[#C59B27] bg-[#FAF3E8]' 
                  : 'border-stone-300 hover:border-[#C59B27] bg-[#FCF9F2]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white border border-[#DFBC77]/40 text-[#855F14] flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-sm font-bold text-[#1C1917] mb-1">
                Click to browse or drag & drop photo
              </h4>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto mb-3">
                All formats supported: PNG, JPG, JPEG, WEBP, GIF, SVG, BMP, HEIC
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-gold shadow-sm inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose From Device</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-5 border-t border-stone-100 mt-5">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyPhoto}
                className="flex-1 btn-gold py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Photo</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE DETAILS MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 animate-scale-in relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Photo Avatar Edit Banner */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FCF9F2] border border-[#DFBC77]/40">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C59B27] shadow"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1C1917] block">Profile Photo</span>
                  <p className="text-[11px] text-stone-500 truncate">Upload a picture from device</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setPreviewPhoto(formData.avatar);
                    setSelectedFileName('');
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF3E8] border border-[#DFBC77]/80 text-[#855F14] hover:bg-[#C59B27] hover:text-white transition-all shadow-sm flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              {/* Save CTA */}
              <button
                type="submit"
                className="w-full btn-gold py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md mt-4"
              >
                Save Changes
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
