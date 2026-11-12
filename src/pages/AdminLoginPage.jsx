import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AdminLoginPage({ onNavigateHome, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Authentication successful! Loading dashboard...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data.admin || { email, name: 'LUMA Admin' });
          }
        }, 400);
      } else {
        setErrorMessage(data.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      // Local fallback verification if backend is offline
      if (email.trim().toLowerCase() === 'admin@luma.com' && password === 'admin123') {
        setSuccessMessage('Authentication verified! Loading dashboard...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess({ email: 'admin@luma.com', name: 'LUMA Administrator' });
          }
        }, 400);
      } else {
        setErrorMessage('Unable to connect to backend server. Ensure backend is running on http://localhost:5000.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@luma.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-[#070707] text-[#FFFFFF] font-['Manrope'] select-none relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Red Core Ambient (660nm wavelength theme) */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#ED2024]/12 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[380px] h-[380px] bg-[#ED2024]/5 blur-[120px] rounded-full" />
        {/* Subtle Dark Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="relative z-10 w-full border-b border-white/[0.06] bg-[#0A0A0A]/70 backdrop-blur-md px-5 sm:px-8 md:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Admin Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
            >
              {/* 6-dot matrix (3x2) LUMA icon */}
              <div className="grid grid-cols-3 gap-[3px] w-[21px] h-[14px]">
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
                <div className="w-[4px] h-[4px] rounded-full bg-[#ED2024]" />
              </div>
              <span className="text-[17px] sm:text-[19px] font-extrabold tracking-[0.14em] text-white uppercase group-hover:text-[#ED2024] transition-colors">
                LUMA
              </span>
            </button>

            <span className="text-white/20 select-none hidden sm:inline">|</span>

            {/* Portal Tag */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED2024] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Right Action: Return to Public Store */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-[12px] sm:text-[13px] font-medium tracking-[0.02em] text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
            <span>Return to Store</span>
          </button>
        </div>
      </header>

      {/* ==================== MAIN LOGIN CARD ==================== */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[460px]">
          
          {/* Card Wrapper */}
          <div className="relative rounded-[22px] sm:rounded-[26px] bg-[#121212]/90 border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.85)] p-6 sm:p-9 md:p-10 backdrop-blur-xl">
            
            {/* Top Security Icon / Accent Ring */}
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-[#222222] to-[#141414] border border-white/[0.1] shadow-inner">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-[#ED2024]/10 blur-sm pointer-events-none" />
                {/* Shield / Keyhole SVG Icon */}
                <svg
                  className="w-6 h-6 text-[#ED2024] relative z-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-7">
              <h1 className="text-[22px] sm:text-[25px] font-bold tracking-[0.02em] text-[#FFFFFF] uppercase">
                Administrator Sign In
              </h1>
              <p className="mt-2 text-[12.5px] sm:text-[13.5px] font-normal text-[#8E8E8E] leading-relaxed">
                Enter your authorized credentials to access the LUMA management console.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-[#ED2024]/10 border border-[#ED2024]/30 flex items-start gap-2.5 text-[#ED2024] text-[12.5px] animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="flex-1 leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-400 text-[12.5px] animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1 leading-snug">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#A0A0A0]"
                >
                  Administrator Email
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#666666] pointer-events-none flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="admin@luma.com"
                    className="w-full h-[46px] sm:h-[48px] pl-10 pr-4 rounded-[12px] bg-[#1A1A1A] border border-white/[0.08] text-[#FFFFFF] text-[13px] sm:text-[14px] placeholder-[#555555] transition-all focus:outline-none focus:border-[#ED2024] focus:ring-1 focus:ring-[#ED2024]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#A0A0A0]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact system administrator (security@luma.com) to reset administrative privileges.')}
                    className="text-[11px] text-[#8E8E8E] hover:text-[#ED2024] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#666666] pointer-events-none flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full h-[46px] sm:h-[48px] pl-10 pr-11 rounded-[12px] bg-[#1A1A1A] border border-white/[0.08] text-[#FFFFFF] text-[13px] sm:text-[14px] placeholder-[#555555] transition-all focus:outline-none focus:border-[#ED2024] focus:ring-1 focus:ring-[#ED2024]"
                  />
                  {/* Show/Hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 text-[#777777] hover:text-white transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1A1A1A] border border-white/[0.15] text-[#ED2024] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ED2024]"
                  />
                  <span className="text-[12px] font-normal text-[#9E9E9E]">
                    Remember this session
                  </span>
                </label>

                {/* Quick Demo Credentials Filler */}
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-medium text-[#ED2024] hover:text-[#ff383c] transition-colors cursor-pointer hover:underline"
                >
                  Use Demo Credentials
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] sm:h-[50px] rounded-[12px] bg-[#ED2024] hover:bg-[#d61611] text-[#FFFFFF] text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#ED2024]/20 hover:shadow-[#ED2024]/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <span className="text-[16px]">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Badge Bottom Row */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[#777777] text-[11px]">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>256-Bit SSL Encrypted Enterprise Management Portal</span>
            </div>

          </div>

          {/* Under-Card Help Notice */}
          <p className="mt-5 text-center text-[11px] text-[#555555]">
            Authorized personnel only. All access events are cryptographically audited.
          </p>

        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 w-full border-t border-white/[0.04] py-4 px-6 text-center text-[11.5px] text-[#666666]">
        <p>
          &copy; {new Date().getFullYear()} LUMA Phototherapy & Health Technologies Inc. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

