import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  FiMail, 
  FiLock, 
  FiLoader, 
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiSun,
  FiMoon,
  FiKey,
  FiShield
} from 'react-icons/fi';
import { apiCall } from '../../shared/utils/api';
import { useTheme } from '../../shared/context/ThemeContext';
import { Toast } from '../../shared/components';

export default function AuthPage({ onAuthenticated }) {
  const { theme, toggleTheme } = useTheme();

  // Step 1: 'email' (Email input + OAuth)
  // Step 2: 'verification' (Choose OTP or Password)
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(''); // '', 'google', 'microsoft', 'email', 'otp', 'password'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Real Google OAuth Login Handler
  const triggerGoogleLogin = useGoogleLogin({
    onNonOAuthError: () => setLoadingProvider(''),
    onSuccess: async (tokenResponse) => {
      // Pass real credential token to backend
      handleSocialAuth('google', tokenResponse.access_token || tokenResponse.credential);
    },
    onError: (error) => {
      console.error('Google Sign-In Error:', error);
      setErrorMessage('Google Sign-In was cancelled or failed.');
      setLoadingProvider('');
    },
    flow: 'implicit',
  });

  // Handle Step 1: Email Submission -> Dispatch OTP Code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    setLoadingProvider('email');

    try {
      const res = await apiCall('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccessMessage(res?.message || `A verification code has been sent to ${email}`);
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoadingProvider('');
    }
  };

  // Social Auth Handler (Google, Microsoft)
  const handleSocialAuth = async (provider, idToken) => {
    setLoadingProvider(provider);
    setErrorMessage('');
    try {
      const endpoint = `/auth/${provider}`;
      const payload = { idToken: idToken || `token_${provider}` };
      
      const res = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }

      if (onAuthenticated) {
        onAuthenticated(res.data?.user);
      }
    } catch (err) {
      console.error(`${provider} auth error:`, err.message);
      setErrorMessage(err.message || `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication failed.`);
    } finally {
      setLoadingProvider('');
    }
  };

  // Step 2 Login with Password
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoadingProvider('password');
    setErrorMessage('');
    try {
      const res = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }

      if (onAuthenticated) {
        onAuthenticated(res.data?.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoadingProvider('');
    }
  };

  // Step 2 Verify OTP
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoadingProvider('otp');
    setErrorMessage('');
    try {
      const res = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (res.data?.accessToken) {
        localStorage.setItem('scalematrix_access_token', res.data.accessToken);
      }

      if (onAuthenticated) {
        onAuthenticated(res.data?.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setLoadingProvider('');
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoadingProvider('otp_resend');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await apiCall('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccessMessage(res.message || 'A new verification code has been sent.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
    } finally {
      setLoadingProvider('');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 flex items-center justify-center font-sans select-none overflow-x-hidden transition-colors duration-200 p-6 sm:p-12">
      
      {/* Top Header with Brand Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">ScaleMatrix</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-[#18181d] dark:hover:bg-[#22222a] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <FiSun className="w-4 h-4 text-amber-400" />
          ) : (
            <FiMoon className="w-4 h-4 text-purple-600" />
          )}
        </button>
      </div>

      {/* Form Card Container - Split 2-panel Layout */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121215] rounded-xl shadow-xl overflow-hidden transition-all duration-200 my-auto pt-12 sm:pt-0 grid grid-cols-1 md:grid-cols-2">
        
        {/* Vertical Separator (Reduced Height) */}
        <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-px bg-neutral-200 dark:bg-neutral-800/80 -translate-x-1/2 z-10 pointer-events-none" />

        {/* Left Panel: Showcase */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-white dark:bg-[#121215] text-neutral-900 dark:text-white">
          
          {/* Top Tagline */}
          <div className="space-y-2">
            <span className="mb-5 inline-flex items-center px-5 py-1.5 rounded-full text-[12px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
              AI-Powered Marketing Matrix
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-tight pt-2">
              Accelerate your digital growth at scale
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Unified content studio, audience analytics, and automated campaign strategy console in one place.
            </p>
          </div>

          {/* Feature Highlights Mini Grid */}
          <div className="space-y-5 py-6">
            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-[#16161b] flex items-start gap-3">
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[14px] mb-1 font-medium text-neutral-900 dark:text-white">Smart Script & Content Generator</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Generate high-converting reels & post captions effortlessly.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-[#16161b] flex items-start gap-3">
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[14px] font-medium mb-1 text-neutral-900 dark:text-white">Real-time Reach Analytics</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Deep audience demographic insights & competitor benchmarking.</p>
              </div>
            </div>
          </div>

          {/* Footer details */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>ScaleMatrix Platform v2.4</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Enterprise Ready</span>
          </div>
        </div>

        {/* Right Panel: Form Content */}
        <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-center bg-white dark:bg-[#121215]">
          
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {step === 1 ? 'Welcome back' : 'Verification'}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">
              {step === 1 
                ? 'Sign in to continue to your workspace' 
                : `Choose how to complete authentication for ${email}`}
            </p>
          </div>

          {/* Toast Feedback Notifications */}
          <Toast
            message={errorMessage}
            type="error"
            onClose={() => setErrorMessage('')}
          />
          <Toast
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage('')}
          />

          {/* STEP 1: Email Input + 3 OAuth Options */}
          {step === 1 && (
            <>
              {/* Social Auth Options Stack */}
              <div className="space-y-3.5">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => triggerGoogleLogin()}
                  disabled={Boolean(loadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-neutral-50 dark:bg-[#18181d] hover:bg-neutral-100 dark:hover:bg-[#22222a] text-neutral-800 dark:text-white text-xs sm:text-sm font-semibold rounded-full border border-neutral-200 dark:border-transparent transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'google' ? (
                    <FiLoader className="w-4 h-4 animate-spin text-neutral-400" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={() => {
                    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
                    if (clientId && !clientId.includes('mock')) {
                      const redirectUri = window.location.origin + '/auth/callback/github';
                      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,user:email`;
                    } else {
                      handleSocialAuth('github', 'mock_github_code');
                    }
                  }}
                  disabled={Boolean(loadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-neutral-50 dark:bg-[#18181d] hover:bg-neutral-100 dark:hover:bg-[#22222a] text-neutral-800 dark:text-white text-xs sm:text-sm font-semibold rounded-full border border-neutral-200 dark:border-transparent transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'github' ? (
                    <FiLoader className="w-4 h-4 animate-spin text-neutral-400" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )}
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-bold tracking-widest">OR</span>
                <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
              </div>

              {/* Email Entry Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">Email address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500 text-sm" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-neutral-50 dark:bg-[#16161b] border border-neutral-200 dark:border-transparent rounded-full py-3 pl-11 pr-4 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-purple-600 accent-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-neutral-50 dark:bg-[#16161b] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Password reset email instructions have been sent.')}
                    className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingProvider)}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingProvider === 'email' ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign in</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Email Verification & Method Switcher (OTP vs Password) */}
          {step === 2 && (
            <div className="space-y-5">
              
              {/* Back to Step 1 button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Change email ({email})</span>
              </button>

              {/* Method Switcher Tabs */}
              <div className="flex bg-neutral-100 dark:bg-[#16161b] p-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('otp');
                    setErrorMessage('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    authMethod === 'otp'
                      ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <FiKey className="w-3.5 h-3.5" />
                  <span>One-Time Code (OTP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setErrorMessage('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    authMethod === 'password'
                      ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <FiLock className="w-3.5 h-3.5" />
                  <span>Password</span>
                </button>
              </div>

              {/* OTP Method Form */}
              {authMethod === 'otp' && (
                <form onSubmit={handleOTPVerify} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                      Enter 6-digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-neutral-50 dark:bg-[#16161b] border border-neutral-200 dark:border-transparent rounded-full py-2.5 text-center text-xl font-mono tracking-widest text-purple-600 dark:text-purple-300 placeholder-neutral-400 dark:placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={Boolean(loadingProvider) || otpCode.length !== 6}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/20 mt-6"
                  >
                    {loadingProvider === 'otp' ? <FiLoader className="w-5 h-5 animate-spin" /> : <span>Verify & Continue</span>}
                  </button>

                  <div className="flex justify-center items-center pt-1 text-xs space-x-1">
                    <span className="text-neutral-500">Didn't receive code?</span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={Boolean(loadingProvider)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loadingProvider === 'otp_resend' ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Method Form */}
              {authMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">Account Password</label>
                      <span className="text-[11px] text-neutral-500">First time? Set your password here</span>
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500 text-sm" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password or set a new one"
                        className="w-full bg-neutral-50 mb-3 dark:bg-[#16161b] border border-neutral-200 dark:border-transparent rounded-full py-3 pl-11 pr-11 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={Boolean(loadingProvider) || !password}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/20"
                  >
                    {loadingProvider === 'password' ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Continue with Password</span>
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

          {/* Footer Security Note */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <FiShield className="w-3.5 h-3.5" />
            <span>Enterprise-grade SSL security</span>
          </div>

        </div>
      </div>

    </div>
  );
}
