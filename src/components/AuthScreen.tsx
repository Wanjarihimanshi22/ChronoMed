import React, { useState } from 'react';
import {
  HeartPulse,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Clock,
  Pill
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginUser,
  registerUser,
  requestPasswordResetCode,
  verifyAndResetPassword,
  DEMO_USERS
} from '../utils/storage';
import { playSuccessChime } from '../utils/audioSynthesizer';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpCondition, setSignUpCondition] = useState('Cardiovascular Wellness');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'done'>('request');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Quick 1-Click Demo Login
  const handleQuickLogin = (demoUser: UserProfile, pass: string) => {
    setSignInEmail(demoUser.email);
    setSignInPassword(pass);
    setSignInLoading(true);
    setSignInError(null);

    setTimeout(() => {
      const res = loginUser(demoUser.email, pass);
      setSignInLoading(false);
      if (res.success && res.user) {
        playSuccessChime();
        onLoginSuccess(res.user);
      } else {
        setSignInError(res.error || 'Authentication failed');
      }
    }, 400);
  };

  // Regular Sign In
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }
    if (!signInPassword) {
      setSignInError('Please enter your password.');
      return;
    }

    setSignInLoading(true);
    setTimeout(() => {
      const res = loginUser(signInEmail, signInPassword);
      setSignInLoading(false);

      if (res.success && res.user) {
        playSuccessChime();
        onLoginSuccess(res.user);
      } else {
        setSignInError(res.error || 'Invalid email or password.');
      }
    }, 400);
  };

  // Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!signUpName.trim()) {
      setSignUpError('Please provide your full legal or preferred name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setSignUpError('Please provide a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setSignUpLoading(true);
    setTimeout(() => {
      const res = registerUser(signUpName, signUpEmail, signUpPassword, [signUpCondition]);
      setSignUpLoading(false);

      if (res.success && res.user) {
        playSuccessChime();
        onLoginSuccess(res.user);
      } else {
        setSignUpError(res.error || 'Registration failed.');
      }
    }, 450);
  };

  // Forgot Password: Step 1 (Request Code)
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter the email address associated with your account.');
      return;
    }

    const res = requestPasswordResetCode(forgotEmail);
    if (res.success && res.code) {
      setGeneratedCode(res.code);
      setResetStep('verify');
      setForgotSuccess(`Verification code dispatched to ${forgotEmail}.`);
    } else {
      setForgotError(res.error || 'Unable to request password reset.');
    }
  };

  // Forgot Password: Step 2 (Verify & Reset)
  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!inputCode.trim()) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('New passwords do not match.');
      return;
    }

    const res = verifyAndResetPassword(forgotEmail, inputCode, newPassword);
    if (res.success) {
      setResetStep('done');
      playSuccessChime();
    } else {
      setForgotError(res.error || 'Verification failed. Please check the code.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Subtle Background Glow Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-500/25 mb-4">
          <HeartPulse className="h-9 w-9 stroke-[2.2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          ChronoMed
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
            Health Hub
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          Circadian Prescriptions, Smart Alarms & Vitality Dashboard
        </p>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/90 overflow-hidden">
          {/* View Tab Selector (Sign In vs Sign Up) */}
          {mode !== 'forgot' ? (
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
              <button
                type="button"
                id="tab-btn-signin"
                onClick={() => {
                  setMode('signin');
                  setSignInError(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="tab-btn-signup"
                onClick={() => {
                  setMode('signup');
                  setSignUpError(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                New Patient Sign Up
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <KeyRound className="h-4 w-4 text-teal-600" />
                <span>Account Password Recovery</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setResetStep('request');
                  setForgotError(null);
                }}
                className="text-xs text-slate-500 hover:text-teal-700 font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* ================= MODE: SIGN IN ================= */}
            {mode === 'signin' && (
              <div className="space-y-5">
                {signInError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{signInError}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="signin-email-input"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="e.g. eleanor.vance@chronomed.io"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        id="forgot-password-link"
                        onClick={() => {
                          setForgotEmail(signInEmail || 'eleanor.vance@chronomed.io');
                          setResetStep('request');
                          setForgotError(null);
                          setForgotSuccess(null);
                          setMode('forgot');
                        }}
                        className="text-xs text-teal-700 hover:text-teal-800 font-bold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="signin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-600 font-medium">Remember this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="signin-submit-btn"
                    disabled={signInLoading}
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    {signInLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Authenticating Patient Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to ChronoMed</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick 1-Click Demo Login Options */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-teal-600" />
                      Instant Demo Patient Access
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      id="demo-login-eleanor"
                      onClick={() => handleQuickLogin(DEMO_USERS[0], 'password123')}
                      className="w-full text-left p-2.5 rounded-xl border border-teal-200/80 bg-teal-50/60 hover:bg-teal-100/70 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          EV
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {DEMO_USERS[0].name}
                          </p>
                          <p className="text-[11px] text-teal-700 font-medium">
                            {DEMO_USERS[0].email}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-teal-600 text-white shadow-2xs group-hover:bg-teal-700">
                        1-Click Login
                      </span>
                    </button>

                    <button
                      type="button"
                      id="demo-login-himanshi"
                      onClick={() => handleQuickLogin(DEMO_USERS[1], 'chronomed2026')}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-cyan-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          HW
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {DEMO_USERS[1].name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {DEMO_USERS[1].email}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-800 text-white shadow-2xs group-hover:bg-slate-900">
                        1-Click Login
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= MODE: SIGN UP ================= */}
            {mode === 'signup' && (
              <div className="space-y-4">
                {signUpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{signUpError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal or Preferred Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Himanshi Wanjari"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yourname@gmail.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Health Care Focus
                    </label>
                    <select
                      value={signUpCondition}
                      onChange={(e) => setSignUpCondition(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    >
                      <option value="Cardiovascular & Blood Pressure">Cardiovascular & Blood Pressure</option>
                      <option value="Cholesterol & Heart Health">Cholesterol & Heart Health</option>
                      <option value="Diabetes & Glycemic Balance">Diabetes & Glycemic Balance</option>
                      <option value="Circadian Sleep & Vitality">Circadian Sleep & Vitality</option>
                      <option value="Daily Vitamins & Routine Wellness">Daily Vitamins & Routine Wellness</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    {signUpLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Create Patient Account</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-xs text-slate-500 pt-2">
                  Already enrolled?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}

            {/* ================= MODE: FORGOT PASSWORD ================= */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {forgotError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{forgotError}</span>
                  </div>
                )}

                {/* Step 1: Request Code */}
                {resetStep === 'request' && (
                  <form onSubmit={handleRequestCode} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <KeyRound className="h-4 w-4 text-teal-700" />
                        <span>Self-Service Password Reset</span>
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Enter your registered patient email address. We will generate a secure 6-digit verification code to reset your credentials.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Patient Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          id="forgot-email-input"
                          type="email"
                          required
                          placeholder="e.g. eleanor.vance@chronomed.io"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Pre-fill Quick Selector for Testing */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Quick Select:</span>
                      <button
                        type="button"
                        onClick={() => setForgotEmail('eleanor.vance@chronomed.io')}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                      >
                        Eleanor Vance
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotEmail('wanjarihimanshi@gmail.com')}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                      >
                        Himanshi Wanjari
                      </button>
                    </div>

                    <button
                      type="submit"
                      id="forgot-send-code-btn"
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <span>Send 6-Digit Verification Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {/* Step 2: Verify Code & Set New Password */}
                {resetStep === 'verify' && (
                  <form onSubmit={handleVerifyAndReset} className="space-y-4">
                    {/* Simulated Verification Notice showing code clearly for immediate testing */}
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-amber-900">
                          <Clock className="h-4 w-4 text-amber-700" />
                          <span>Verification Code Dispatched</span>
                        </span>
                        {generatedCode && (
                          <button
                            type="button"
                            onClick={() => setInputCode(generatedCode)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors"
                          >
                            Auto-Fill Code
                          </button>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        For demo testing, your 6-digit code for <strong>{forgotEmail}</strong> is:
                      </p>
                      <div className="font-mono text-center font-extrabold text-xl tracking-widest text-teal-800 bg-white py-1.5 px-3 rounded-lg border border-amber-200">
                        {generatedCode}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        6-Digit Verification Code
                      </label>
                      <input
                        id="forgot-code-input"
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 742918"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full p-2.5 text-center font-mono tracking-widest text-lg font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Create New Password
                        </label>
                        <input
                          id="forgot-new-password-input"
                          type="password"
                          required
                          placeholder="Min 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="forgot-confirm-password-input"
                          type="password"
                          required
                          placeholder="Repeat new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        id="forgot-reset-submit-btn"
                        className="w-2/3 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Success Confirmation */}
                {resetStep === 'done' && (
                  <div className="text-center py-4 space-y-4 animate-in fade-in">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Password Successfully Reset!
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Your account credentials for <strong>{forgotEmail}</strong> have been updated securely.
                      </p>
                    </div>

                    <button
                      type="button"
                      id="forgot-proceed-signin-btn"
                      onClick={() => {
                        setSignInEmail(forgotEmail);
                        setSignInPassword(newPassword);
                        setMode('signin');
                        setResetStep('request');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <span>Proceed to Sign In Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Security Badges */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>HIPAA Compliant UI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>256-Bit Encrypted Session</span>
            </div>
          </div>
        </div>

        {/* Demo Helper Note at Bottom */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Need testing accounts? Use the quick 1-click login buttons or click "Forgot Password" to test the 6-digit recovery flow.
          </p>
        </div>
      </div>
    </div>
  );
};
