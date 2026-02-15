import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';


const AuthPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor' : '/student';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  const [activeForm, setActiveForm] = useState('login');
  const [forgotStep, setForgotStep] = useState(1);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    fullName: '',
    countryCode: '+91',
    phone: '',
    terms: false
  });
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    newPassword: '',
    confirmPassword: ''
  });
  const [registerValidation, setRegisterValidation] = useState({
    email: false,
    username: false,
    fullName: false,
    phone: false
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    login: false,
    newPassword: false,
    confirmPassword: false
  });

  const validTLDs = [
    'com', 'org', 'net', 'edu', 'gov', 'mil',
    'info', 'biz', 'name', 'mobi', 'pro',
    'int', 'museum', 'travel', 'xyz', 'app',
    'dev', 'io', 'co', 'me', 'tv', 'us', 'uk',
    'ca', 'au', 'de', 'fr', 'jp', 'ru', 'in',
    'edu.in', 'ac.in', 'gov.in', 'org.in', 'res.in',
    'tech', 'online', 'site', 'web', 'cloud',
    'ai', 'blog', 'design', 'studio', 'email'
  ];

  useEffect(() => {
    const loadParticles = async () => {
      if (window.particlesJS) {
        const leftConfig = {
          particles: {
            number: { value: 60 },
            color: { value: '#ffffff' },
            opacity: { value: 0.7 },
            size: { value: 3 },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.1,
              width: 1
            },
            move: {
              enable: true,
              speed: 2
            }
          }
        };

        const rightConfig = {
          particles: {
            number: { value: 60 },
            color: { value: '#c96442' },
            opacity: { value: 0.8 },
            size: { value: 3 },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#c96442',
              opacity: 0.1,
              width: 1
            },
            move: {
              enable: true,
              speed: 2
            }
          }
        };

        setTimeout(() => {
          try {
            window.particlesJS('particles-left', leftConfig);
            window.particlesJS('particles-right', rightConfig);
            console.log('Particles initialized successfully');
          } catch (error) {
            console.error('Particles initialization error:', error);
          }
        }, 100);
      }
    };

    loadParticles();
  }, []);

  const toggleForm = (formType) => {
    setActiveForm(formType);
    if (formType === 'forgot') {
      setForgotStep(1);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterEmailChange = (e) => {
    const email = e.target.value.trim().toLowerCase();
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (isValidFormat) {
      const domain = email.split('@')[1];
      const domainParts = domain.split('.');
      const tld = domainParts.slice(1).join('.');
      
      const isValid = validTLDs.some(validTLD => tld === validTLD);
      setRegisterValidation(prev => ({ ...prev, email: isValid }));
      
      if (!isValid) {
        setRegisterValidation(prev => ({ 
          ...prev, 
          username: false, 
          fullName: false, 
          phone: false 
        }));
        setRegisterData(prev => ({ 
          ...prev, 
          email, 
          username: '', 
          fullName: '', 
          phone: '' 
        }));
      } else {
        setRegisterData(prev => ({ ...prev, email }));
      }
    } else {
      setRegisterValidation(prev => ({ 
        ...prev, 
        email: false, 
        username: false, 
        fullName: false, 
        phone: false 
      }));
      setRegisterData(prev => ({ 
        ...prev, 
        email, 
        username: '', 
        fullName: '', 
        phone: '' 
      }));
    }
  };

  const handleRegisterUsernameChange = (e) => {
    const username = e.target.value;
    const isValid = username.length >= 3;
    setRegisterValidation(prev => ({ ...prev, username: isValid }));
    setRegisterData(prev => ({ ...prev, username }));
    
    if (!isValid) {
      setRegisterValidation(prev => ({ ...prev, fullName: false, phone: false }));
      setRegisterData(prev => ({ ...prev, fullName: '', phone: '' }));
    }
  };

  const handleRegisterFullNameChange = (e) => {
    const fullName = e.target.value;
    const isValid = fullName.length >= 2;
    setRegisterValidation(prev => ({ ...prev, fullName: isValid }));
    setRegisterData(prev => ({ ...prev, fullName }));
    
    if (!isValid) {
      setRegisterValidation(prev => ({ ...prev, phone: false }));
      setRegisterData(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleRegisterPhoneChange = (e) => {
    let phoneNumber = e.target.value.replace(/\D/g, '');
    
    if (phoneNumber.length === 10) {
      const formatted = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      setRegisterValidation(prev => ({ ...prev, phone: true }));
      setRegisterData(prev => ({ ...prev, phone: formatted }));
    } else if (phoneNumber.length < 10) {
      setRegisterValidation(prev => ({ ...prev, phone: false }));
      setRegisterData(prev => ({ ...prev, phone: phoneNumber }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOTP = [...forgotData.otp];
    newOTP[index] = value;
    setForgotData(prev => ({ ...prev, otp: newOTP }));
    
    if (value && index < 5) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !forgotData.otp[index] && index > 0) {
      const prevInput = document.querySelectorAll('.otp-input')[index - 1];
      if (prevInput) prevInput.focus();
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await authApi.login({ email: loginData.email, password: loginData.password });
      if (res.success) {
        login(res.token, res.user);
        await Swal.fire({ icon: 'success', title: 'Welcome back!', text: `Logged in as ${res.user.fullName}`, timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        const path = res.user.role === 'admin' ? '/admin' : res.user.role === 'mentor' ? '/mentor' : '/student';
        navigate(path);
      } else {
        Swal.fire({ icon: 'error', title: 'Login Failed', text: res.message || 'Invalid credentials', background: '#fff', color: '#1f2937' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Please try again.', background: '#fff', color: '#1f2937' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const phone = registerData.countryCode + registerData.phone.replace(/\D/g, '');
      const res = await authApi.register({
        email: registerData.email,
        username: registerData.username,
        fullName: registerData.fullName,
        phone,
        password: registerData.username + '@123',
        role: 'student'
      });
      if (res.success) {
        await Swal.fire({ icon: 'success', title: 'Account Created!', html: `Your temporary password is: <strong>${registerData.username}@123</strong><br/>Please change it after login.`, background: '#fff', color: '#1f2937' });
        toggleForm('login');
      } else {
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: res.message || 'Could not create account', background: '#fff', color: '#1f2937' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Please try again.', background: '#fff', color: '#1f2937' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const email = forgotData.email;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setIsSubmitting(true);
    try {
      const res = await authApi.forgotPassword({ email });
      if (res.success) {
        await Swal.fire({ icon: 'info', title: 'OTP Sent', text: res.message || 'Check your email for the OTP code.', background: '#fff', color: '#1f2937' });
        setForgotStep(2);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Could not send OTP', background: '#fff', color: '#1f2937' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error. Try again.', background: '#fff', color: '#1f2937' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const otp = forgotData.otp.join('');
    if (!/^\d{6}$/.test(otp)) return;
    setIsSubmitting(true);
    try {
      const res = await authApi.verifyOtp({ email: forgotData.email, otp });
      if (res.success) {
        await Swal.fire({ icon: 'success', title: 'OTP Verified!', text: 'Set your new password.', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        setForgotStep(3);
      } else {
        Swal.fire({ icon: 'error', title: 'Invalid OTP', text: res.message || 'Please check and try again.', background: '#fff', color: '#1f2937' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error.', background: '#fff', color: '#1f2937' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      Swal.fire({ icon: 'warning', title: 'Mismatch', text: 'Passwords do not match!', background: '#fff', color: '#1f2937' });
      return;
    }
    if (forgotData.newPassword.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Too Short', text: 'Password must be at least 6 characters.', background: '#fff', color: '#1f2937' });
      return;
    }
    setIsSubmitting(true);
    try {
      const otp = forgotData.otp.join('');
      const res = await authApi.resetPassword({ email: forgotData.email, otp, newPassword: forgotData.newPassword });
      if (res.success) {
        await Swal.fire({ icon: 'success', title: 'Password Reset!', text: 'You can now sign in with your new password.', background: '#fff', color: '#1f2937' });
        toggleForm('login');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Could not reset password.', background: '#fff', color: '#1f2937' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error.', background: '#fff', color: '#1f2937' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRegisterFormValid = () => {
    const phoneValue = registerData.phone.replace(/\D/g, '');
    return registerValidation.email &&
           registerValidation.username &&
           registerValidation.fullName &&
           phoneValue.length === 10 &&
           registerData.terms;
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 flex-col items-center justify-center overflow-hidden">
        <div id="particles-left" className="absolute inset-0 z-0"></div>
        {/* Decorative shapes */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5"></div>

        <div className="relative z-10 text-center text-white space-y-6 p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-8">
            <i className="ri-arrow-left-line"></i> Home
          </Link>
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
            <i className="ri-seedling-fill text-4xl"></i>
          </div>
          <h1 className="text-4xl font-bold">Sowberry</h1>
          <p className="text-white/70 text-lg">Grow your skills, bloom your future</p>
        </div>
      </div>

      {/* Forms Side */}
      <div className="flex-1 flex items-center justify-center bg-cream dark-theme:bg-gray-950 relative overflow-hidden">
        <div id="particles-right" className="absolute inset-0 z-0"></div>

        <div className="relative z-10 w-full max-w-md px-6 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <i className="ri-seedling-fill text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Sowberry</h1>
          </div>

          {/* Login Form */}
          {activeForm === 'login' && (
            <div className="animate-fade-in-up">
              <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-8 border border-sand dark-theme:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-800 dark-theme:text-white mb-1">Welcome back!</h2>
                <p className="text-gray-500 dark-theme:text-gray-400 text-sm mb-6">Please enter your details to sign in</p>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <input
                    type="email" name="email" placeholder="Email address"
                    value={loginData.email} onChange={handleLoginChange} required
                    className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors"
                  />
                  <div className="relative">
                    <input
                      type={passwordVisibility.login ? 'text' : 'password'}
                      name="password" placeholder="Password"
                      value={loginData.password} onChange={handleLoginChange} required
                      className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10"
                    />
                    <button type="button" onClick={() => togglePasswordVisibility('login')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark-theme:hover:text-gray-300">
                      <i className={passwordVisibility.login ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 dark-theme:text-gray-400 cursor-pointer">
                      <input type="checkbox" name="remember" checked={loginData.remember} onChange={handleLoginChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => toggleForm('forgot')}
                      className="text-primary hover:underline font-medium">Forgot password?</button>
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-60">
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="mt-6">
                  <p className="text-center text-sm text-gray-400 mb-4">Or continue with</p>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sand dark-theme:border-gray-700 text-sm font-medium text-gray-700 dark-theme:text-gray-200 hover:bg-cream dark-theme:hover:bg-gray-800 transition-colors">
                      <i className="ri-google-fill text-red-500"></i> Google
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sand dark-theme:border-gray-700 text-sm font-medium text-gray-700 dark-theme:text-gray-200 hover:bg-cream dark-theme:hover:bg-gray-800 transition-colors">
                      <i className="ri-github-fill"></i> GitHub
                    </button>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500 dark-theme:text-gray-400 mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => toggleForm('register')} className="text-primary font-semibold hover:underline">Sign up</button>
                </p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {activeForm === 'register' && (
            <div className="animate-fade-in-up">
              <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-8 border border-sand dark-theme:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-800 dark-theme:text-white mb-1">Create Account</h2>
                <p className="text-gray-500 dark-theme:text-gray-400 text-sm mb-6">Please fill in your details to register</p>

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  {/* Email */}
                  <div className="relative">
                    <input type="email" placeholder="Email address" value={registerData.email}
                      onChange={handleRegisterEmailChange} required
                      className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10" />
                    {registerData.email && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${registerValidation.email ? 'text-green-500' : 'text-red-400'}`}>
                        {registerValidation.email ? 'âœ“' : 'Ã—'}
                      </span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="relative">
                    <input type="text" placeholder="Choose username" value={registerData.username}
                      onChange={handleRegisterUsernameChange} disabled={!registerValidation.email} required
                      className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10 disabled:opacity-50 disabled:cursor-not-allowed" />
                    {registerData.username && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${registerValidation.username ? 'text-green-500' : 'text-red-400'}`}>
                        {registerValidation.username ? 'âœ“' : 'Ã—'}
                      </span>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="relative">
                    <input type="text" placeholder="Full name" value={registerData.fullName}
                      onChange={handleRegisterFullNameChange} disabled={!registerValidation.username} required
                      className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10 disabled:opacity-50 disabled:cursor-not-allowed" />
                    {registerData.fullName && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${registerValidation.fullName ? 'text-green-500' : 'text-red-400'}`}>
                        {registerValidation.fullName ? 'âœ“' : 'Ã—'}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex gap-2">
                    <select name="countryCode" value={registerData.countryCode} onChange={handleRegisterChange}
                      disabled={!registerValidation.fullName}
                      className="w-28 px-3 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+86">+86 (CN)</option>
                      <option value="+81">+81 (JP)</option>
                      <option value="+49">+49 (DE)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+7">+7 (RU)</option>
                      <option value="+55">+55 (BR)</option>
                      <option value="+52">+52 (MX)</option>
                      <option value="+82">+82 (KR)</option>
                      <option value="+39">+39 (IT)</option>
                      <option value="+34">+34 (ES)</option>
                      <option value="+1">+1 (CA)</option>
                    </select>
                    <div className="relative flex-1">
                      <input type="tel" placeholder="Enter 10 digit number" value={registerData.phone}
                        onChange={handleRegisterPhoneChange} maxLength="12"
                        disabled={!registerValidation.fullName} required
                        className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10 disabled:opacity-50 disabled:cursor-not-allowed" />
                      {registerData.phone && (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${registerValidation.phone ? 'text-green-500' : 'text-red-400'}`}>
                          {registerValidation.phone ? 'âœ“' : 'Ã—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark-theme:text-gray-400 cursor-pointer">
                    <input type="checkbox" name="terms" checked={registerData.terms} onChange={handleRegisterChange}
                      disabled={!registerValidation.phone}
                      className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50" />
                    I agree to the Terms & Conditions
                  </label>

                  <button type="submit" disabled={!isRegisterFormValid() || isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark-theme:text-gray-400 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => toggleForm('login')} className="text-primary font-semibold hover:underline">Sign in</button>
                </p>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {activeForm === 'forgot' && (
            <div className="animate-fade-in-up">
              <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-8 border border-sand dark-theme:border-gray-800">
                {/* Step 1: Email */}
                {forgotStep === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 dark-theme:text-white mb-1">Reset Password</h2>
                    <p className="text-gray-500 dark-theme:text-gray-400 text-sm mb-6">Enter your email to receive OTP</p>
                    <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                      <input type="email" name="email" placeholder="Enter your email address"
                        value={forgotData.email} onChange={handleForgotChange} required
                        className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors" />
                      <button type="submit" disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-60">
                        {isSubmitting ? 'Sending...' : 'Send OTP'}
                      </button>
                    </form>
                  </>
                )}

                {/* Step 2: OTP */}
                {forgotStep === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 dark-theme:text-white mb-1">Enter OTP</h2>
                    <p className="text-gray-500 dark-theme:text-gray-400 text-sm mb-6">Please enter the OTP sent to your email</p>
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                      <div className="flex justify-center gap-3">
                        {forgotData.otp.map((digit, index) => (
                          <input key={index} type="text" maxLength="1" pattern="[0-9]" inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                            required
                            className="otp-input w-12 h-12 text-center text-lg font-bold rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-gray-700 dark-theme:text-gray-200 transition-colors" />
                        ))}
                      </div>
                      <button type="submit" disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-60">
                        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </form>
                  </>
                )}

                {/* Step 3: New Password */}
                {forgotStep === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 dark-theme:text-white mb-1">Set New Password</h2>
                    <p className="text-gray-500 dark-theme:text-gray-400 text-sm mb-6">Enter your new password</p>
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="relative">
                        <input type={passwordVisibility.newPassword ? 'text' : 'password'}
                          name="newPassword" placeholder="New password"
                          value={forgotData.newPassword} onChange={handleForgotChange} required
                          className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10" />
                        <button type="button" onClick={() => togglePasswordVisibility('newPassword')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark-theme:hover:text-gray-300">
                          <i className={passwordVisibility.newPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                        </button>
                      </div>
                      <div className="relative">
                        <input type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                          name="confirmPassword" placeholder="Confirm password"
                          value={forgotData.confirmPassword} onChange={handleForgotChange} required
                          className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors pr-10" />
                        <button type="button" onClick={() => togglePasswordVisibility('confirmPassword')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark-theme:hover:text-gray-300">
                          <i className={passwordVisibility.confirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                        </button>
                      </div>
                      <button type="submit" disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 disabled:opacity-60">
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </form>
                  </>
                )}

                <p className="text-center text-sm text-gray-500 dark-theme:text-gray-400 mt-6">
                  Remember your password?{' '}
                  <button onClick={() => toggleForm('login')} className="text-primary font-semibold hover:underline">Sign in</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
