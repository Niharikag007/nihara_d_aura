import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from './Toast';
import useAdminStore from '../../store/useAdminStore';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const darkMode = useAdminStore(s => s.darkMode);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? '#121010' : '#f5f3f0',
          fontFamily: 'Manrope, sans-serif',
        }}>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

        <main
          className={`transition-all duration-300 pb-20 lg:pb-8 min-h-screen ${
            collapsed ? 'lg:ml-[72px]' : 'lg:ml-[252px]'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>

        <ToastContainer />
      </div>
    </div>
  );
}
