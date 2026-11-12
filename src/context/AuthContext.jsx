import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'luma_customer_user';

export function AuthProvider({ children }) {
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (customerUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customerUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Error syncing customerUser to localStorage:', e);
    }
  }, [customerUser]);

  const loginCustomer = useCallback((userData) => {
    setCustomerUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    // Execute pending action if user was trying to add to cart or buy now
    if (pendingAction && typeof pendingAction === 'function') {
      try {
        setTimeout(() => {
          pendingAction(userData);
        }, 150);
      } catch (err) {
        console.error('Error executing pending action after login:', err);
      }
      setPendingAction(null);
    }
    setAuthReason('');
    setIsAuthModalOpen(false);
  }, [pendingAction]);

  const logoutCustomer = useCallback(() => {
    setCustomerUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setPendingAction(null);
    setAuthReason('');
  }, []);

  const openAuthModal = useCallback((reason = '') => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthReason('');
    setPendingAction(null);
  }, []);

  /**
   * Helper that guards actions requiring customer authentication.
   * If authenticated: immediately calls actionCallback(customerUser) and returns true.
   * If not authenticated: opens AuthModal with friendly reason, queues callback, and returns false.
   */
  const requireAuth = useCallback((actionCallback, reason = 'Please sign in or create an account to proceed.') => {
    if (customerUser) {
      if (typeof actionCallback === 'function') {
        actionCallback(customerUser);
      }
      return true;
    }

    setAuthReason(reason);
    if (typeof actionCallback === 'function') {
      setPendingAction(() => actionCallback);
    }
    setIsAuthModalOpen(true);
    return false;
  }, [customerUser]);

  return (
    <AuthContext.Provider
      value={{
        customerUser,
        isAuthModalOpen,
        authReason,
        openAuthModal,
        closeAuthModal,
        loginCustomer,
        logoutCustomer,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

