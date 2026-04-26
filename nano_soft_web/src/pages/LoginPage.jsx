import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const LoginPage = ({ onNavigate }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(mobile, password);
      alert('تم تسجيل الدخول بنجاح!');
      onNavigate('profile'); // التوجه للبروفايل بعد الدخول
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
          <h1>مرحباً بك</h1>
          <p>سجل دخولك لمتابعة تدريب نانو سوفت</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>رقم الهاتف</label>
          <div className="input-wrapper">
            <input 
              type="tel" 
              placeholder="أدخل رقم هاتفك (مثال: 777123456)" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
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
