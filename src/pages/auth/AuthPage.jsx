import React, { useState, useEffect } from 'react';
import '../../styles/main.css';

const AuthPage = () => {
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
            color: { value: '#6c5ce7' },
            opacity: { value: 0.8 },
            size: { value: 3 },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#6c5ce7',
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', loginData);
    // TODO: Implement login logic
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register data:', registerData);
    // TODO: Implement registration logic
  };

  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    const email = forgotData.email;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('If the email exists in our system, you will receive reset instructions shortly.');
      setForgotStep(2);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    const otp = forgotData.otp.join('');
    if (/^\d{6}$/.test(otp)) {
      alert('OTP verified!');
      setForgotStep(3);
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (forgotData.newPassword === forgotData.confirmPassword && forgotData.newPassword.length >= 6) {
      alert('Password reset successful!');
      toggleForm('login');
    } else {
      alert('Passwords do not match or too short!');
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
    <>
      <style>{`
        :root {
          --primary: #ff6b6b;
          --secondary: #6c5ce7;
          --background: #f5f6fa;
          --card-bg: rgba(255, 255, 255, 0.9);
          --border-color: rgba(108, 92, 231, 0.1);
          --shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .split-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          position: relative;
        }

        .brand-side {
          flex: 1;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          color: white;
          z-index: 0;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
        }

        .forms-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .form-section {
          position: absolute;
          width: 100%;
          opacity: 0;
          pointer-events: none;
          transform: translateX(100px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .form-section.active {
          position: relative;
          opacity: 1;
          pointer-events: all;
          transform: translateX(0);
        }

        .form-group {
          margin-bottom: 0.75rem;
          position: relative;
          min-height: 42px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: 2px solid rgba(108, 92, 231, 0.1);
          border-radius: 10px;
          font-size: 0.9rem;
          line-height: 1.2;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          height: 100%;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
          outline: none;
        }

        .form-group input::placeholder {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .form-group input:focus::placeholder {
          color: var(--secondary);
          opacity: 0.7;
        }

        .social-login {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(108, 92, 231, 0.1);
        }

        .social-login p {
          text-align: center;
          color: #6b7280;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
        }

        .social-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          border: 1px solid rgba(108, 92, 231, 0.1);
          border-radius: 10px;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 0.9rem;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: var(--secondary);
          background: rgba(108, 92, 231, 0.05);
          transform: translateY(-1px);
        }

        .social-btn i {
          font-size: 1.25rem;
        }

        .social-btn.google i {
          color: #ea4335;
        }

        .social-btn.github i {
          color: #333;
        }

        .switch-form-link {
          text-align: center;
          margin-top: 1rem;
          color: #6b7280;
        }

        .switch-form-link a {
          color: var(--secondary);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .switch-form-link a:hover {
          text-decoration: underline;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes popIn {
          0% { transform: scale(0.8) translateY(-50%); opacity: 0; }
          100% { transform: scale(1) translateY(-50%); opacity: 1; }
        }

        .validation-message {
          transition: all 0.3s ease;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }

        .validation-message.valid {
          color: #10b981;
        }

        .validation-message.invalid {
          color: #ef4444;
          cursor: help;
        }

        .validation-message.invalid:hover::after {
          content: attr(title);
          position: absolute;
          right: -120px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--card-bg);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }

        .forgot-step {
          display: none;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .forgot-step.active {
          display: block;
          opacity: 1;
        }

        .otp-wrapper {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin: 1rem 0;
        }

        .otp-input {
          width: 40px;
          height: 40px;
          padding: 0;
          text-align: center;
          font-size: 1.2rem;
          border: 2px solid rgba(108, 92, 231, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }

        .otp-input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
          outline: none;
        }

        .phone-input-group {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          height: 42px;
        }

        .input-wrapper {
          width: 100%;
          position: relative;
        }

        .country-code {
          width: 110px;
          height: 100%;
          flex: 0 0 110px;
          padding: 0 0.75rem;
          border: 2px solid rgba(108, 92, 231, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          font-family: 'Poppins', sans-serif;
          color: #374151;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c5ce7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 16px;
          padding-right: 32px;
        }

        .phone-input-wrapper {
          flex: 1;
          height: 100%;
          position: relative;
        }

        .phone-input-wrapper input {
          height: 100%;
          width: 100%;
          margin: 0;
        }

        .password-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input input {
          flex: 1;
          padding-right: 2.5rem;
        }

        .toggle-password {
          position: absolute;
          right: 0.75rem;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .toggle-password:hover {
          color: var(--secondary);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .remember-me,
        .terms-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #374151;
        }

        .forgot-password {
          color: var(--secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .auth-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
        }

        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .login-header i {
          font-size: 2rem;
          color: var(--secondary);
        }

        .login-header h1 {
          font-size: 1.5rem;
          color: var(--secondary);
          margin: 0;
        }

        .login-form h2 {
          font-size: 1.75rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .login-form > p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .auth-container {
          max-width: 450px;
          width: 100%;
          position: relative;
        }

        .forms-container {
          position: relative;
          width: 100%;
          min-height: 400px;
        }

        .brand-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }

        .brand-logo i {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .brand-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .tagline {
          font-size: 1.25rem;
          opacity: 0.9;
        }

        .brand-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .compact-form {
          margin: 0;
        }
      `}</style>

      <div className="split-container">
        <div className="brand-side">
          <div id="particles-left" className="particles"></div>
          <div className="brand-content">
            <div className="brand-logo">
              <i className="ri-seedling-fill"></i>
            </div>
            <h1>Sowberry</h1>
            <p className="tagline">Grow your skills, bloom your future</p>
          </div>
          <div className="brand-background">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
        </div>

        <div className="forms-side">
          <div id="particles-right" className="particles"></div>
          <div className="auth-container">
            <div className="forms-container">
              {/* Login Form */}
              <div className={`form-section login-section ${activeForm === 'login' ? 'active' : ''}`}>
                <div className="login-header">
                  <i className="ri-seedling-fill"></i>
                  <h1>Sowberry</h1>
                </div>
                <div className="login-form">
                  <h2>Welcome back!</h2>
                  <p>Please enter your details to sign in</p>
                  
                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email address"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <div className="password-input">
                        <input 
                          type={passwordVisibility.login ? 'text' : 'password'}
                          name="password" 
                          placeholder="Password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required 
                        />
                        <i 
                          className={`toggle-password ${passwordVisibility.login ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                          onClick={() => togglePasswordVisibility('login')}
                        ></i>
                      </div>
                    </div>
                    <div className="form-options">
                      <label className="remember-me">
                        <input 
                          type="checkbox" 
                          name="remember"
                          checked={loginData.remember}
                          onChange={handleLoginChange}
                        />
                        Remember me
                      </label>
                      <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); toggleForm('forgot'); }}>
                        Forgot password?
                      </a>
                    </div>
                    <button type="submit" className="auth-btn">Sign in</button>
                  </form>

                  <div className="social-login">
                    <p>Or continue with</p>
                    <div className="social-buttons">
                      <button className="social-btn google">
                        <i className="ri-google-fill"></i>
                        Google
                      </button>
                      <button className="social-btn github">
                        <i className="ri-github-fill"></i>
                        GitHub
                      </button>
                    </div>
                  </div>

                  <p className="switch-form-link">
                    Don't have an account? <a onClick={() => toggleForm('register')}>Sign up</a>
                  </p>
                </div>
              </div>

              {/* Registration Form */}
              <div className={`form-section register-section ${activeForm === 'register' ? 'active' : ''}`}>
                <div className="login-header">
                  <i className="ri-seedling-fill"></i>
                  <h1>Sowberry</h1>
                </div>
                <div className="login-form">
                  <h2>Create Account</h2>
                  <p>Please fill in your details to register</p>
                  
                  <form onSubmit={handleRegisterSubmit} className="compact-form">
                    <div className="form-group">
                      <div className="input-wrapper">
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email address"
                          value={registerData.email}
                          onChange={handleRegisterEmailChange}
                          required 
                        />
                        <span className={`validation-message ${registerValidation.email ? 'valid' : 'invalid'}`}>
                          {registerData.email && (registerValidation.email ? '✓' : '×')}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          name="username" 
                          placeholder="Choose username"
                          value={registerData.username}
                          onChange={handleRegisterUsernameChange}
                          disabled={!registerValidation.email}
                          required 
                        />
                        <span className={`validation-message ${registerValidation.username ? 'valid' : 'invalid'}`}>
                          {registerData.username && (registerValidation.username ? '✓' : '×')}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          name="fullName" 
                          placeholder="Full name"
                          value={registerData.fullName}
                          onChange={handleRegisterFullNameChange}
                          disabled={!registerValidation.username}
                          required 
                        />
                        <span className={`validation-message ${registerValidation.fullName ? 'valid' : 'invalid'}`}>
                          {registerData.fullName && (registerValidation.fullName ? '✓' : '×')}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <div className="phone-input-group">
                          <select 
                            className="country-code" 
                            name="countryCode"
                            value={registerData.countryCode}
                            onChange={handleRegisterChange}
                            disabled={!registerValidation.fullName}
                            required
                          >
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
                          <div className="phone-input-wrapper">
                            <input 
                              type="tel" 
                              name="phone" 
                              placeholder="Enter 10 digit number"
                              value={registerData.phone}
                              onChange={handleRegisterPhoneChange}
                              maxLength="12"
                              disabled={!registerValidation.fullName}
                              required 
                            />
                            <span className={`validation-message ${registerValidation.phone ? 'valid' : 'invalid'}`}>
                              {registerData.phone && (registerValidation.phone ? '✓' : '×')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-options">
                      <label className="terms-checkbox">
                        <input 
                          type="checkbox" 
                          name="terms"
                          checked={registerData.terms}
                          onChange={handleRegisterChange}
                          disabled={!registerValidation.phone}
                          required 
                        />
                        <span>I agree to the Terms & Conditions</span>
                      </label>
                    </div>

                    <button type="submit" className="auth-btn" disabled={!isRegisterFormValid()}>
                      Create Account
                    </button>
                  </form>

                  <p className="switch-form-link">
                    Already have an account? <a onClick={() => toggleForm('login')}>Sign in</a>
                  </p>
                </div>
              </div>

              {/* Forgot Password Form */}
              <div className={`form-section forgot-section ${activeForm === 'forgot' ? 'active' : ''}`}>
                <div className="login-header">
                  <i className="ri-seedling-fill"></i>
                  <h1>Sowberry</h1>
                </div>
                <div className="login-form">
                  {/* Step 1: Email */}
                  <div className={`forgot-step step-1 ${forgotStep === 1 ? 'active' : ''}`}>
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive OTP</p>
                    
                    <form onSubmit={handleForgotEmailSubmit} className="compact-form">
                      <div className="form-group">
                        <div className="input-wrapper">
                          <input 
                            type="email" 
                            name="email" 
                            placeholder="Enter your email address"
                            value={forgotData.email}
                            onChange={handleForgotChange}
                            required 
                          />
                          <span className="validation-message"></span>
                        </div>
                      </div>
                      <button type="submit" className="auth-btn">Send OTP</button>
                    </form>
                  </div>

                  {/* Step 2: OTP */}
                  <div className={`forgot-step step-2 ${forgotStep === 2 ? 'active' : ''}`}>
                    <h2>Enter OTP</h2>
                    <p>Please enter the OTP sent to your email</p>
                    
                    <form onSubmit={handleOTPSubmit} className="compact-form">
                      <div className="form-group">
                        <div className="otp-wrapper">
                          {forgotData.otp.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              className="otp-input"
                              maxLength="1"
                              pattern="[0-9]"
                              inputMode="numeric"
                              value={digit}
                              onChange={(e) => handleOTPChange(index, e.target.value)}
                              onKeyDown={(e) => handleOTPKeyDown(index, e)}
                              required
                            />
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="auth-btn">Verify OTP</button>
                    </form>
                  </div>

                  {/* Step 3: New Password */}
                  <div className={`forgot-step step-3 ${forgotStep === 3 ? 'active' : ''}`}>
                    <h2>Set New Password</h2>
                    <p>Enter your new password</p>
                    
                    <form onSubmit={handleResetPasswordSubmit} className="compact-form">
                      <div className="form-group">
                        <div className="password-input">
                          <input 
                            type={passwordVisibility.newPassword ? 'text' : 'password'}
                            name="newPassword" 
                            placeholder="New password"
                            value={forgotData.newPassword}
                            onChange={handleForgotChange}
                            required 
                          />
                          <i 
                            className={`toggle-password ${passwordVisibility.newPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                            onClick={() => togglePasswordVisibility('newPassword')}
                          ></i>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="password-input">
                          <input 
                            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword" 
                            placeholder="Confirm password"
                            value={forgotData.confirmPassword}
                            onChange={handleForgotChange}
                            required 
                          />
                          <i 
                            className={`toggle-password ${passwordVisibility.confirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                          ></i>
                        </div>
                      </div>
                      <button type="submit" className="auth-btn">Reset Password</button>
                    </form>
                  </div>

                  <p className="switch-form-link">
                    Remember your password? <a onClick={() => toggleForm('login')}>Sign in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
