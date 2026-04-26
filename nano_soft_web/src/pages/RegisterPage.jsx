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
      await authService.register(formData);

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
            <label>رقم الهاتف</label>
            <div className="input-wrapper">
              <input name="mobile" type="tel" placeholder="000000000" onChange={handleChange} required />
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
