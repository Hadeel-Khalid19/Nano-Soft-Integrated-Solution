import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const LoginPage = ({ onNavigate }) => {
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // إذا كان مختار هاتف، ممكن نضيف مفتاح الدولة إذا كان الـ API يطلبه، لكن حالياً نرسله كما هو أو حسب متطلباتك
      // let finalIdentifier = loginMethod === 'phone' ? `+967${identifier}` : identifier;
      const data = await authService.login(identifier, password);
      alert('تم تسجيل الدخول بنجاح!');
      onNavigate('profile');
    } catch (err) {
      let errorMessage = 'فشل تسجيل الدخول، تأكد من البيانات';
      const responseData = err?.response?.data;
      
      if (responseData) {
          if (responseData.errors && typeof responseData.errors === 'object' && Object.keys(responseData.errors).length > 0) {
              const firstKey = Object.keys(responseData.errors)[0];
              errorMessage = responseData.errors[firstKey][0];
          } else if (responseData.error && typeof responseData.error === 'string') {
              errorMessage = responseData.error;
          } else if (responseData.message && typeof responseData.message === 'string') {
              errorMessage = responseData.message;
          }
      } else if (err?.message) {
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>أهلاً وسهلاً بك!</h1>
          <p>سجل دخولك للاستمتاع بتجربة سلسة وآمنة</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="login-tabs">
          <button 
            type="button"
            className={`tab-btn ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
          >
            <span>📱</span> رقم الجوال
          </button>
          <button 
            type="button"
            className={`tab-btn ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
          >
            <span>✉️</span> البريد الإلكتروني
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>{loginMethod === 'phone' ? 'رقم الجوال' : 'البريد الإلكتروني'}</label>
          
          {loginMethod === 'phone' ? (
            <div className="phone-input-container">
              <div className="country-code-prefix">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="16" style={{ borderRadius: '2px' }}>
                  <rect width="900" height="600" fill="#000"/>
                  <rect width="900" height="400" fill="#fff"/>
                  <rect width="900" height="200" fill="#ce1126"/>
                </svg>
                <span style={{ direction: 'ltr' }}>+967</span>
              </div>
              <input 
                type="tel" 
                placeholder="أدخل رقم الجوال" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="input-wrapper">
              <input 
                type="email" 
                placeholder="أدخل بريدك الإلكتروني" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          )}
        </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginTop: '-10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <span onClick={() => onNavigate('forgot-password')} style={{ fontSize: '0.9em', color: '#1E3A8A', cursor: 'pointer', fontWeight: 'bold' }}>نسيت كلمة المرور؟</span>
            <span onClick={() => onNavigate('recover-account')} style={{ fontSize: '0.9em', color: '#1E3A8A', cursor: 'pointer', fontWeight: 'bold' }}>استرداد الحساب</span>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="footer-text">
          <div style={{ marginBottom: '10px' }}>
            ليس لديك حساب؟ <span onClick={() => onNavigate('register')}>إنشاء حساب جديد</span>
          </div>
          <div>
            <span onClick={() => onNavigate('verify')} style={{ fontSize: '0.9em', color: '#64748b', cursor: 'pointer' }}>هل لديك حساب غير منشط؟ انقر هنا للتنشيط</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
