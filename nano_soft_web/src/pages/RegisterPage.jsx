import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const RegisterPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [mainError, setMainError] = useState('');

  // حذف بيانات تسجيل الدخول السابقة لكي يعاملنا السيرفر كزائر جديد (يمنع خطأ 403)
  React.useEffect(() => {
    localStorage.removeItem('nano_token');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMainError('');
    setLoading(true);

    try {
      // نرسل الداتا أولاً للـ validator
      await authService.registerValidator(formData);
      // إذا نجح الـ validator نقوم بإنشاء الحساب
      const submitData = { ...formData, mobile: `+967${formData.mobile}` };
      const data = await authService.register(submitData);

      alert('تم إنشاء الحساب بنجاح! انتقل لتفعيل حسابك');
      onNavigate('verify');
    } catch (err) {
      let errorMessage = 'فشل إنشاء الحساب، يرجى مراجعة البيانات';
      const responseData = err?.response?.data;

      if (responseData) {
          // 1. البحث في تفاصيل الأخطاء (المصفوفة)
          if (responseData.errors && typeof responseData.errors === 'object' && Object.keys(responseData.errors).length > 0) {
              const firstKey = Object.keys(responseData.errors)[0];
              errorMessage = responseData.errors[firstKey][0];
          } 
          // 2. البحث في حقل الخطأ المفرد
          else if (responseData.error && typeof responseData.error === 'string') {
              errorMessage = responseData.error;
          } 
          // 3. البحث في الرسالة العامة
          else if (responseData.message && typeof responseData.message === 'string') {
              errorMessage = responseData.message;
          }
      } else if (err?.message) {
          // 4. أخطاء الشبكة أو انقطاع الإنترنت
          errorMessage = err.message;
      }

      setMainError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>إنشاء حساب جديد</h1>
          <p>انضم إلينا في نانو سوفت</p>
        </div>

        {mainError && <div className="error-message">{mainError}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>الاسم الكامل</label>
            <div className="input-wrapper">
              <input name="name" type="text" placeholder="أدخل اسمك" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <div className="input-wrapper">
              <input name="email" type="email" placeholder="name@example.com" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>رقم الجوال</label>
            <div className="phone-input-container">
              <div className="country-code-prefix">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="16" style={{ borderRadius: '2px' }}>
                  <rect width="900" height="600" fill="#000"/>
                  <rect width="900" height="400" fill="#fff"/>
                  <rect width="900" height="200" fill="#ce1126"/>
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="input-with-code">
                <span className="dial-code">+967</span>
                <input name="mobile" type="tel" placeholder="أدخل رقم الجوال" onChange={handleChange} required style={{ paddingRight: '16px' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <div className="input-wrapper">
              <input name="password_confirmation" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="footer-text">
          لديك حساب بالفعل؟ <span onClick={() => onNavigate('login')}>تسجيل الدخول</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
