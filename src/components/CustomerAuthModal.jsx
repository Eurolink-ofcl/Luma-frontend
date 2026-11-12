import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function CustomerAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  authReason = '',
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Dubai');
  const [regCountry, setRegCountry] = useState('United Arab Emirates');
  const [regAddress, setRegAddress] = useState('');

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset or initialize state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/customer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Welcome back! Signed in successfully.');
        setTimeout(() => {
          onLoginSuccess(data.customer);
          onClose();
        }, 350);
      } else {
        setErrorMessage(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback demo login if server unreachable
      if (loginEmail.trim().toLowerCase() === 'demo@luma.com' || loginEmail.trim().toLowerCase() === 'customer@luma.com') {
        const fallbackUser = {
          name: 'Demo Member',
          email: loginEmail.trim().toLowerCase(),
          phone: '+971 50 123 4567',
          city: 'Dubai',
          country: 'United Arab Emirates',
        };
        setSuccessMessage('Signed in successfully.');
        setTimeout(() => {
          onLoginSuccess(fallbackUser);
          onClose();
        }, 350);
      } else {
        setErrorMessage('Unable to connect to LUMA server. Please ensure backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please enter your full name, email, and password.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/customer/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          phone: regPhone.trim(),
          city: regCity.trim(),
          country: regCountry.trim(),
          address: regAddress.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const savedEmail = regEmail.trim();
        // Clear registration fields
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegPhone('');
        setRegAddress('');

        // Pre-fill email in login form
        setLoginEmail(savedEmail);
        setLoginPassword('');

        // Switch to login tab
        setActiveTab('login');
        setSuccessMessage('Account created successfully! Please sign in with your email and password.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to create account.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrorMessage('Failed to connect to LUMA server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoginEmail('demo@luma.com');
    setLoginPassword('password123');
    setErrorMessage('');
    setTimeout(() => {
      fetch(`${API_BASE_URL}/customer/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@luma.com', password: 'password123' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customer) {
            onLoginSuccess(data.customer);
            onClose();
          }
        })
        .catch(() => {
          onLoginSuccess({
            name: 'Demo Member',
            email: 'demo@luma.com',
            phone: '+971 50 123 4567',
            city: 'Dubai',
            country: 'United Arab Emirates',
          });
          onClose();
        });
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-['Manrope']">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all transform animate-scaleUp">
        {/* Top Glow bar with LUMA Red accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ED2024] via-[#ff474b] to-[#ED2024]" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-xl leading-none z-20"
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* Modal Inner Container */}
        <div className="p-6 sm:p-8">
          {/* Logo & Brand Header */}
          <div className="text-center mb-6">
            <img
              src="/assets/luma-logo.png"
              alt="LUMA"
              className="h-7 w-auto mx-auto object-contain mb-3"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeTab === 'login' ? 'Customer Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
              {activeTab === 'login'
                ? 'Sign in to access your LUMA account.'
                : 'Join LUMA for seamless warranty and device support.'}
            </p>
          </div>

          {/* Contextual Auth Reason Banner (e.g. attempted add to cart or buy now) */}
          {authReason && (
            <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-[#ED2024]/15 border border-[#ED2024]/40 text-white text-[12px] flex items-center gap-2.5 animate-fadeIn shadow-sm">
              <span className="w-6 h-6 rounded-full bg-[#ED2024] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                🔒
              </span>
              <span className="leading-snug font-medium text-white/90">
                {authReason}
              </span>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-fadeIn">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-green-950/60 border border-green-500/40 text-green-200 text-xs flex items-start gap-2 animate-fadeIn">
              <span className="text-green-400 font-bold shrink-0">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#ED2024] text-white shadow-md shadow-[#ED2024]/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#ED2024] text-white shadow-md shadow-[#ED2024]/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Tab 1: SIGN IN */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. member@luma.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/30 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* One-Click Demo Member Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2 px-3 border border-dashed border-white/20 hover:border-[#ED2024]/50 rounded-xl text-[11px] text-white/70 hover:text-white hover:bg-[#ED2024]/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="text-[#ED2024]">⚡</span>
                  <span>One-Click Demo Member Sign In</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-white/50">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className="text-xs font-semibold text-[#ED2024] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* Tab 2: CREATE ACCOUNT */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sarah Al-Mansoor"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Dubai"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 font-medium mb-1">
                  Address <span className="text-white/40 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="e.g. Villa 14, Palm Jumeirah, Dubai"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                    Create Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#ED2024] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#ED2024] hover:bg-[#d61b1f] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ED2024]/30 cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-white/50">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-semibold text-[#ED2024] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
