import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Bell, Clock, User, Package, Heart, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import Footer from '../components/common/Footer';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, deleteNotification, clearAllNotifications } = useNotifications();

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearAllNotifications();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'profile':
        return User;
      case 'order':
        return Package;
      case 'wishlist':
        return Heart;
      case 'offer':
        return Sparkles;
      default:
        return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'profile':
        return 'text-[#C59B27]';
      case 'order':
        return 'text-[#C59B27]';
      case 'wishlist':
        return 'text-[#C59B27]';
      case 'offer':
        return 'text-[#C59B27]';
      default:
        return 'text-[#C59B27]';
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'profile':
        return 'bg-[#FAF3E8]';
      case 'order':
        return 'bg-[#FAF3E8]';
      case 'wishlist':
        return 'bg-[#FAF3E8]';
      case 'offer':
        return 'bg-[#FAF3E8]';
      default:
        return 'bg-[#FAF3E8]';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] to-[#F9F5EE]">
      {/* Top Half - Notifications Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto" style={{ minHeight: '50vh' }}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-[#1C1917] font-serif">
              Notifications
            </h1>
          </div>
          <p className="text-stone-500 text-base">
            Stay updated with your order statuses, special offers, and profile updates
          </p>
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-semibold text-stone-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAF3E8] border border-[#DFBC77] flex items-center justify-center mx-auto text-[#C59B27] mb-6">
                <Bell className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] mb-2">No notifications yet</h3>
              <p className="text-base text-stone-500 leading-relaxed">
                You're all caught up! Order updates, special offers, and profile updates will appear right here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`bg-white rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all ${
                    !notification.read ? 'border-[#C59B27] bg-[#FAF3E8]/30' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${getIconBg(notification.type)} ${getIconColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className={`font-semibold text-base ${!notification.read ? 'text-[#1C1917]' : 'text-stone-600'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-stone-500 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Bottom Half - Footer */}
      <Footer />
    </div>
  );
}
