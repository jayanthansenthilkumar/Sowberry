import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


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


      <div className="split-container">
        <div className="brand-side">
          <div id="particles-left" className="particles"></div>
          <div className="brand-content">
            <Link to="/" className="back-home-link">
              <i className="ri-arrow-left-line"></i> Home
            </Link>
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
                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm('register'); }}>Sign up</a>
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
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm('login'); }}>Sign in</a>
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
                    Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm('login'); }}>Sign in</a>
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
