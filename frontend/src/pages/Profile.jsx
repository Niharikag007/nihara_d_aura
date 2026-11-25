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
  Camera,
  Phone,
  User,
  Mail,
  Package,
  Ticket,
  RotateCcw,
  Globe,
  Moon,
  Sun,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

const BACKEND_STATIC_BASE = (
  import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    : (import.meta.env?.PROD ? 'https://api.niharadaura.com' : 'http://localhost:3000')
).replace(/\/+$/, '');

function resolveAvatarUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_STATIC_BASE}${trimmed}`;
  }
  return trimmed;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, updateProfile, uploadAvatar, logout } = useAuth();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(user?.avatar || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const [ordersStat, setOrdersStat] = useState({ userId: null, count: null });
  const [wishlistStat, setWishlistStat] = useState({ userId: null, count: null });
  const [statsError, setStatsError] = useState({ userId: null, message: '' });
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoaded, setCouponsLoaded] = useState(false);
  const [couponsError, setCouponsError] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  
  // Language translations - Only for Support & Preferences section
  const translations = {
    EN: {
      language: 'Language',
      darkMode: 'Dark Mode',
      helpCenter: 'Help Center',
      aboutNihara: 'About Nihara D\'Aura'
    },
    HI: {
      language: 'भाषा',
      darkMode: 'डार्क मोड',
      helpCenter: 'सहायता केंद्र',
      aboutNihara: 'निहारा डी ऑरा के बारे में'
    }
  };
  
  const t = translations[language] || translations.EN;
  
  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDarkMode]);

  // Add sample website update notification on first visit
  useEffect(() => {
    const hasSeenWebsiteUpdate = localStorage.getItem('nihara_website_update_seen');
    if (!hasSeenWebsiteUpdate) {
      addNotification({
        type: 'offer',
        title: 'Welcome to Nihara D\'Aura',
        message: 'Discover our luxury jewellery, silk makeup, and home fragrance collections.'
      });
      localStorage.setItem('nihara_website_update_seen', 'true');
    }
  }, [addNotification]);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    let active = true;
    if (!user?.id) return () => { active = false; };

    api.getMyOrders()
      .then((res) => {
        if (active) setOrdersStat({ userId: user.id, count: res.orders.length });
      })
      .catch((error) => {
        console.error('Could not load the signed-in user orders:', error.message);
        if (active) setStatsError({ userId: user.id, message: error.message });
      });
    api.getMyWishlist()
      .then((res) => {
        if (active) setWishlistStat({ userId: user.id, count: res.wishlist.length });
      })
      .catch((error) => {
        console.error('Could not load the signed-in user wishlist:', error.message);
        if (active) setStatsError({ userId: user.id, message: error.message });
      });
    api.getOffers()
      .then((res) => {
        if (!active) return;
        const now = Date.now();
        const offers = res.offers.filter((offer) => {
          if (offer.isActive === false) return false;
          if (!offer.validTill) return true;
          return new Date(`${offer.validTill}T23:59:59`).getTime() >= now;
        });
        setAvailableCoupons(offers);
        setCouponsLoaded(true);
      })
      .catch((error) => {
        console.error('Could not load active offers:', error.message);
        if (active) {
          setCouponsError(error.message);
          setCouponsLoaded(true);
        }
      });

    return () => { active = false; };
  }, [user?.id]);

  // Auth guard: redirect to login if not authenticated (safe after all hooks)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Process selected image file for preview and upload (supports all camera & gallery image formats)
  const processImageFile = (file) => {
    if (!file) return;

    // Check extensions and mimetypes (allow any image format, camera RAW, HEIC, etc.)
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg|bmp|heic|heif|avif|tiff?|dng|raw)$/i.test(file.name);
    if (!isImage) {
      showToast('Please select a valid image file from camera or gallery (JPG, PNG, WEBP, HEIC, etc.)', 'error');
      return;
    }

    // Limit check: 15MB
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size should be less than 15MB', 'error');
      return;
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto(e.target.result);
      setIsPhotoModalOpen(true);
      showToast('Photo selected! Click "Save Photo" to upload.', 'info');
    };
    reader.onerror = () => {
      showToast('Unable to preview file. You can still save to upload.', 'warning');
      setIsPhotoModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset file input value so user can reselect the same file if needed
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Save photo to auth state & backend via clean multipart upload (never huge base64 in DB)
  const handleApplyPhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      if (selectedFile) {
        await uploadAvatar(selectedFile);
      } else if (previewPhoto) {
        await updateProfile({ avatar: previewPhoto });
      }
      setIsPhotoModalOpen(false);
      setSelectedFile(null);
      showToast('Profile photo updated successfully!', 'success');
      addNotification({
        type: 'profile',
        title: 'Profile Photo Updated',
        message: 'Your profile photo has been successfully updated.'
      });
    } catch (error) {
      showToast(error.message || 'Could not update your profile photo.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Strict validations for Profile edit
  const validateProfileForm = () => {
    const errors = { name: '', email: '', phone: '' };
    let isValid = true;

    // Full name: only letters and spaces, at least 2 characters
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required.';
      isValid = false;
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
      isValid = false;
    } else if (!/^[a-zA-Z\s'.]+$/.test(trimmedName)) {
      errors.name = 'Name can only contain alphabetic letters and spaces.';
      isValid = false;
    }

    // Email validation
    const trimmedEmail = formData.email.trim().toLowerCase();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
      isValid = false;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
      isValid = false;
    }

    // Phone validation (optional or 10-digit)
    const trimmedPhone = formData.phone.trim().replace(/\D/g, '');
    if (formData.phone.trim() && (trimmedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(trimmedPhone))) {
      errors.phone = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) {
      showToast('Please fix the validation errors in the form.', 'error');
      return;
    }

    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim()
      });
      setIsEditModalOpen(false);
      showToast('Profile details updated successfully!', 'success');
      addNotification({
        type: 'profile',
        title: 'Profile Updated',
        message: 'Your profile details have been successfully updated.'
      });
    } catch (error) {
      showToast(error.message || 'Could not update your profile details.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out of Nihara account', 'info');
    navigate('/login');
  };

  const accountSettingsItems = [
    {
      title: 'My Orders',
      icon: ShoppingBag,
      link: '/orders'
    },
    {
      title: 'Returns & Refunds',
      icon: RotateCcw,
      onClick: () => showToast('Returns & Refunds: Contact support@niharadaura.com', 'info')
    },
    {
      title: 'Shipping Addresses',
      icon: MapPin,
      link: '/addresses'
    }
  ];

  const supportItems = [
    {
      title: t.language,
      icon: Globe,
      rightContent: (
        <div className="flex items-center gap-3">
          <span className={`text-base font-semibold transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-700'}`}>{language}</span>
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className={`text-base font-bold px-4 py-2 rounded-full transition-all hover:bg-[#C59B27] hover:text-white ${isDarkMode ? 'text-[#C59B27] bg-[#2C2318]' : 'text-[#C59B27] bg-[#FAF3E8]'}`}
          >
            {language === 'EN' ? '→ HI' : '→ EN'}
          </button>
        </div>
      )
    },
    {
      title: t.darkMode,
      icon: isDarkMode ? Moon : Sun,
      rightContent: (
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-16 h-8 rounded-full p-1 transition-colors hover:scale-105 ${isDarkMode ? 'bg-[#C59B27]' : 'bg-stone-300 hover:bg-[#C59B27]'}`}
        >
          <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`} />
        </button>
      )
    },
    {
      title: t.helpCenter,
      icon: HelpCircle,
      link: '/help'
    },
    {
      title: t.aboutNihara,
      icon: Info,
      link: '/about'
    }
  ];

  return (
    <div className={`min-h-screen px-4 py-10 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-b from-[#1C1917] to-[#0A0908]' : 'bg-gradient-to-b from-[#FFFDF9] to-[#F9F5EE]'}`}>
      <div className={`w-full max-w-2xl transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Profile Header */}
      <div className={`rounded-3xl border p-7 shadow-sm mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center gap-5">
          {/* Profile Picture */}
          <div 
            className="relative cursor-pointer flex-shrink-0 group"
            onClick={() => {
              setPreviewPhoto(user?.avatar || '');
              setSelectedFileName('');
              fileInputRef.current?.click();
            }}
          >
            {user?.avatar ? (
              <img
                src={resolveAvatarUrl(user.avatar)}
                alt={user.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#C59B27] group-hover:border-[#A87D17] group-hover:opacity-90 transition-all shadow-md"
              />
            ) : (
              <div className={`w-24 h-24 rounded-full border-2 border-dashed border-[#C59B27] flex flex-col items-center justify-center font-medium text-xs group-hover:border-[#A87D17] transition-all ${isDarkMode ? 'bg-[#2C2318] text-[#DFBC77]' : 'bg-[#FAF3E8] text-[#855F14]'}`}>
                <User className="w-9 h-9 mb-0.5 opacity-70" />
                <span className="text-[10px] font-semibold">Add Photo</span>
              </div>
            )}
            <div 
              className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-[#C59B27] text-white flex items-center justify-center border-2 border-white group-hover:bg-[#A87D17] group-hover:scale-110 transition-all shadow"
            >
              <Camera className="w-4 h-4" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <h2 className={`font-bold text-xl truncate transition-colors duration-300 ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>
              {user?.name || 'Name not provided'}
            </h2>
            <p className={`text-base mt-1.5 truncate transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>
              {user?.email || 'Email not provided'}
            </p>
            {user?.phone && (
              <p className={`text-base mt-1.5 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>
                {user.phone}
              </p>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => {
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || ''
              });
              setIsEditModalOpen(true);
            }}
            className="w-14 h-14 rounded-full bg-[#C59B27] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#A87D17] hover:scale-105 transition-all shadow-md"
          >
            <Edit3 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div 
          onClick={() => navigate('/orders')}
          className={`rounded-3xl border p-7 text-center cursor-pointer hover:border-[#C59B27] hover:shadow-lg hover:scale-105 transition-all group ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}
        >
          <span className={`font-bold text-3xl group-hover:text-[#C59B27] transition-colors ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>
            {ordersStat.userId === user?.id ? ordersStat.count : '—'}
          </span>
          <p className={`text-base mt-3 group-hover:text-[#855F14] transition-colors ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>Orders</p>
        </div>
        <div 
          onClick={() => navigate('/wishlist')}
          className={`rounded-3xl border p-7 text-center cursor-pointer hover:border-[#C59B27] hover:shadow-lg hover:scale-105 transition-all group ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}
        >
          <span className={`font-bold text-3xl group-hover:text-[#C59B27] transition-colors ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>
            {wishlistStat.userId === user?.id ? wishlistStat.count : '—'}
          </span>
          <p className={`text-base mt-3 group-hover:text-[#855F14] transition-colors ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>Wishlist</p>
        </div>
        <div 
          onClick={() => {
            if (!couponsLoaded) return;
            if (availableCoupons.length > 0) {
              setIsCouponModalOpen(true);
            } else {
              navigate('/cart');
            }
          }}
          className={`rounded-3xl border p-7 text-center cursor-pointer hover:border-[#C59B27] hover:shadow-lg hover:scale-105 transition-all group ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}
        >
          <span className={`font-bold text-3xl group-hover:text-[#C59B27] transition-colors ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>
            {couponsLoaded ? availableCoupons.length : '—'}
          </span>
          <p className={`text-base mt-3 group-hover:text-[#855F14] transition-colors ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>Coupons</p>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="mb-6">
        <h3 className={`text-base font-bold uppercase tracking-wider mb-5 px-1 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-400'}`}>
          Account Settings
        </h3>
        <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}>
          {accountSettingsItems.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div 
                key={idx}
                onClick={item.onClick}
                className={`flex items-center justify-between p-6 border-b last:border-b-0 cursor-pointer hover:bg-[#FAF3E8] hover:border-l-4 hover:border-l-[#C59B27] transition-all group ${isDarkMode ? 'border-[#3E2F1E]' : 'border-stone-100'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#C59B27] group-hover:text-white transition-all ${isDarkMode ? 'bg-[#2C2318] text-[#855F14]' : 'bg-[#FAF3E8] text-[#855F14]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-lg font-medium group-hover:text-[#855F14] transition-colors ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {item.badge && (
                    <span className="text-base font-semibold text-[#C59B27] bg-[#FAF3E8] px-4 py-1.5 rounded-full group-hover:bg-[#C59B27] group-hover:text-white transition-all">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-6 h-6 group-hover:text-[#C59B27] group-hover:translate-x-1 transition-all ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-400'}`} />
                </div>
              </div>
            );

            if (item.link) {
              return <Link key={idx} to={item.link}>{content}</Link>;
            }
            return content;
          })}
        </div>
      </div>

      {/* Support & Preferences Section */}
      <div className="mb-6">
        <h3 className={`text-base font-bold uppercase tracking-wider mb-5 px-1 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-400'}`}>
          Support & Preferences
        </h3>
        <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border-[#3E2F1E]' : 'bg-white border-stone-200'}`}>
          {supportItems.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div 
                key={idx}
                className={`flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-[#FAF3E8] hover:border-l-4 hover:border-l-[#C59B27] transition-all group ${isDarkMode ? 'border-[#3E2F1E]' : 'border-stone-100'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-[#C59B27] group-hover:text-white transition-all ${isDarkMode ? 'bg-[#2C2318] text-[#855F14]' : 'bg-[#FAF3E8] text-[#855F14]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-lg font-medium group-hover:text-[#855F14] transition-colors ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>{item.title}</span>
                </div>
                {item.rightContent || <ChevronRight className={`w-6 h-6 group-hover:text-[#C59B27] group-hover:translate-x-1 transition-all ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-400'}`} />}
              </div>
            );

            if (item.link) {
              return <Link key={idx} to={item.link}>{content}</Link>;
            }
            return content;
          })}
        </div>
      </div>

      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-[#C59B27] text-white font-semibold py-5 rounded-3xl mt-6 flex items-center justify-center gap-3 text-lg hover:bg-[#A87D17] hover:shadow-lg hover:scale-105 transition-all"
      >
        <LogOut className="w-6 h-6" />
        <span>Log Out</span>
      </button>

      {/* Footer */}
      <div className={`text-center mt-10 text-base font-medium transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-400'}`}>
        NIHARA D'AURA • JEWELLERY & MAKEUP
      </div>

      {/* Native File Input (accepts all formats: camera photos, JPG, PNG, WEBP, HEIC, RAW) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*,capture=camera,.jpg,.jpeg,.png,.webp,.gif,.svg,.bmp,.heic,.heif,.avif,.tiff,.dng,.raw"
        className="hidden"
      />
      </div>

      {/* ================= PHOTO UPLOAD MODAL ================= */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border border-[#3E2F1E]' : 'bg-white border border-stone-200'}`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-5 transition-colors duration-300 ${isDarkMode ? 'border-[#3E2F1E]' : 'border-stone-100'}`}>
              <h3 className={`font-serif text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>Upload Photo</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className={`p-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C] hover:text-[#FAF3E8]' : 'text-stone-400 hover:text-stone-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-5">
              {previewPhoto ? (
                <img src={previewPhoto} alt="Preview" className="w-28 h-28 rounded-full object-cover border-2 border-[#C59B27] shadow-md" />
              ) : (
                <div className={`w-28 h-28 rounded-full border-2 border-dashed border-[#C59B27] flex flex-col items-center justify-center text-xs transition-colors duration-300 ${isDarkMode ? 'bg-[#2C2318] text-[#DFBC77]' : 'bg-[#FAF3E8] text-[#855F14]'}`}>
                  <User className="w-12 h-12 mb-1 opacity-70" />
                  <span>No photo</span>
                </div>
              )}
              {selectedFileName && (
                <p className={`text-xs mt-3 truncate max-w-xs ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>
                  {selectedFileName}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsPhotoModalOpen(false)} className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'border-[#3E2F1E] text-[#B5A98C] hover:bg-[#2C2318]' : 'border-stone-300 text-stone-700'}`}>
                Cancel
              </button>
              <button 
                onClick={handleApplyPhoto} 
                disabled={isUploadingPhoto}
                className="flex-1 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#A87D17] text-white text-xs font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                {isUploadingPhoto ? 'Uploading...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border border-[#3E2F1E]' : 'bg-white border border-stone-200'}`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-5 transition-colors duration-300 ${isDarkMode ? 'border-[#3E2F1E]' : 'border-stone-100'}`}>
              <h3 className={`font-serif text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className={`p-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C] hover:text-[#FAF3E8]' : 'text-stone-400 hover:text-stone-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-700'}`}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[0-9]/g, '');
                    setFormData({ ...formData, name: cleaned });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors duration-300 ${formErrors.name ? 'border-red-500' : isDarkMode ? 'border-[#3E2F1E] text-[#FAF3E8] bg-[#2C2318]' : 'border-stone-300 text-stone-900'}`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-700'}`}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value.toLowerCase() });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors duration-300 ${formErrors.email ? 'border-red-500' : isDarkMode ? 'border-[#3E2F1E] text-[#FAF3E8] bg-[#2C2318]' : 'border-stone-300 text-stone-900'}`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-700'}`}>Phone</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors duration-300 ${formErrors.phone ? 'border-red-500' : isDarkMode ? 'border-[#3E2F1E] text-[#FAF3E8] bg-[#2C2318]' : 'border-stone-300 text-stone-900'}`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.phone}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)} 
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'border-[#3E2F1E] text-[#B5A98C] hover:bg-[#2C2318]' : 'border-stone-300 text-stone-700'}`}
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#A87D17] text-white text-xs font-bold shadow-md transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= COUPONS MODAL ================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in relative transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] border border-[#3E2F1E]' : 'bg-white border border-stone-200'}`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-4 transition-colors duration-300 ${isDarkMode ? 'border-[#3E2F1E]' : 'border-stone-100'}`}>
              <h3 className={`font-serif text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-[#FAF3E8]' : 'text-[#1C1917]'}`}>My Coupons</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className={`p-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C] hover:text-[#FAF3E8]' : 'text-stone-400 hover:text-stone-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {availableCoupons.length > 0 ? (
                availableCoupons.map((c, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#2C2318] border-[#3E2F1E]' : 'bg-[#FAF3E8] border-[#DFBC77]/50'}`}>
                    <div>
                      <span className="font-mono font-bold text-xs uppercase bg-[#C59B27] text-white px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                      <p className={`text-[11px] mt-1 transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-600'}`}>
                        {c.description || c.name}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(c.code);
                        showToast(`Coupon ${c.code} copied!`, 'success');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1917] text-[#C59B27] border-[#3E2F1E] hover:bg-[#2C2318]' : 'bg-white text-[#855F14] border-[#DFBC77]'}`}
                    >
                      Copy
                    </button>
                  </div>
                ))
              ) : (
                <div className={`text-center py-6 text-xs transition-colors duration-300 ${isDarkMode ? 'text-[#B5A98C]' : 'text-stone-500'}`}>No active coupons</div>
              )}
            </div>

            <button
              onClick={() => {
                setIsCouponModalOpen(false);
                navigate('/cart');
              }}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#C59B27] text-white text-xs font-bold"
            >
              Go to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
