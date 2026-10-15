import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const ADMIN_CREDENTIALS = {
  email: 'admin@niharadaura.com',
  password: 'admin123'
};

export const ADMIN_USER = {
  id: "usr_admin_nihara",
  name: "Nihara Administrator",
  email: "admin@niharadaura.com",
  phone: "+91 9999999999",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  role: "admin",
  tier: "Master Admin",
  rewardPoints: 9999
};

export const DEFAULT_CUSTOMER = {
  id: "usr_nihara_patron",
  name: "Amit Kumar",
  email: "amitky2056@gmail.com",
  phone: "+918004116370",
  avatar: "/hero-slide-1.jpg",
  role: "user",
  tier: "Royal Patron",
  rewardPoints: 500
};

// Persist auth state in localStorage so logout/login survives page refresh
function getInitialState() {
  try {
    const stored = localStorage.getItem('nihara_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.user) {
        // Enforce role existence
        const role = parsed.user.role || (parsed.user.email === ADMIN_CREDENTIALS.email ? 'admin' : 'user');
        return {
          user: { ...parsed.user, role },
          isAuthenticated: !!parsed.isAuthenticated,
          token: parsed.token || (role === 'admin' ? 'jwt_nihara_token_admin_active' : 'jwt_nihara_token_customer_active')
        };
      }
    }
  } catch (e) {
    // ignore parse errors
  }
  // Default: logged in as regular customer (user role)
  return {
    user: DEFAULT_CUSTOMER,
    isAuthenticated: true,
    token: 'jwt_nihara_token_customer_active'
  };
}

function saveState(user, isAuthenticated, token) {
  try {
    localStorage.setItem('nihara_auth', JSON.stringify({ user, isAuthenticated, token }));
  } catch (e) {
    // ignore storage errors
  }
}

export function AuthProvider({ children }) {
  const initial = getInitialState();
  const [user, setUser] = useState(initial.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [token, setToken] = useState(initial.token);

  /**
   * Login with RBAC verification:
   * - If attempting admin login, email & password MUST match admin credentials
   * - Otherwise creates or logs in as regular customer (role: 'user')
   */
  const login = useCallback((credentials) => {
    const { email, password, role, ...extra } = credentials || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if user is attempting Admin login
    if (role === 'admin' || cleanEmail === ADMIN_CREDENTIALS.email) {
      if (cleanEmail === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const admin = { ...ADMIN_USER, ...extra };
        const adminToken = 'jwt_nihara_token_admin_active';
        setUser(admin);
        setIsAuthenticated(true);
        setToken(adminToken);
        saveState(admin, true, adminToken);
        return { success: true, role: 'admin', user: admin };
      } else {
        return {
          success: false,
          message: 'Invalid Admin credentials. Access Denied to Admin Panel.'
        };
      }
    }

    // Customer Login (Read & Purchase privileges only)
    const customer = {
      ...(credentials?.id ? credentials : DEFAULT_CUSTOMER),
      ...extra,
      email: cleanEmail || DEFAULT_CUSTOMER.email,
      role: 'user'
    };
    const customerToken = 'jwt_nihara_token_customer_active';
    setUser(customer);
    setIsAuthenticated(true);
    setToken(customerToken);
    saveState(customer, true, customerToken);
    return { success: true, role: 'user', user: customer };
  }, []);

  // Sync with backend profile on mount if authenticated
  useEffect(() => {
    let isMounted = true;
    if (token) {
      api.getProfile().then(res => {
        if (isMounted && res && res.user) {
          setUser(prev => ({ ...prev, ...res.user }));
        }
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [token]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    saveState(null, false, null);
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    saveState(merged, true, token);
    try {
      await api.updateProfile(updatedData);
    } catch (e) {
      console.warn('Profile sync to server error:', e.message);
    }
    return merged;
  }, [user, token]);

  const isAdmin = useMemo(() => {
    return isAuthenticated && user?.role === 'admin';
  }, [isAuthenticated, user]);

  const isCustomer = useMemo(() => {
    return isAuthenticated && user?.role === 'user';
  }, [isAuthenticated, user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isAdmin,
    isCustomer,
    token,
    login,
    logout,
    updateProfile
  }), [user, isAuthenticated, isAdmin, isCustomer, token, login, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
