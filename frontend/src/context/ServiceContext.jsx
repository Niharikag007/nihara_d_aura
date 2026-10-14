import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useSocket } from './SocketContext';

const ServiceContext = createContext();

export function ServiceProvider({ children }) {
  const { socket } = useSocket();
  const [services, setServices] = useState([]);
  const [artists, setArtists] = useState([]);
  const [salonInfo, setSalonInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [servicesRes, artistsRes, salonRes, catRes] = await Promise.all([
        api.getServices(),
        api.getArtists(),
        api.getSalon(),
        api.getCategories()
      ]);

      if (servicesRes?.services) setServices(servicesRes.services);
      if (artistsRes?.artists) setArtists(artistsRes.artists);
      if (salonRes?.salon) setSalonInfo(salonRes.salon);
      if (catRes?.categories) setCategories(catRes.categories);
    } catch (err) {
      console.warn('[ServiceContext] Error fetching dynamic salon data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Listen to real-time events via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      fetchAllData();
    };

    socket.on('booking:created', handleUpdate);
    socket.on('booking:cancelled', handleUpdate);
    socket.on('service:updated', handleUpdate);

    return () => {
      socket.off('booking:created', handleUpdate);
      socket.off('booking:cancelled', handleUpdate);
      socket.off('service:updated', handleUpdate);
    };
  }, [socket, fetchAllData]);

  const value = useMemo(() => ({
    services,
    artists,
    salonInfo,
    categories,
    loading,
    refreshServices: fetchAllData
  }), [services, artists, salonInfo, categories, loading, fetchAllData]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
