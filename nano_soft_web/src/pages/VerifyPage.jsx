import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const VerifyPage = ({ onNavigate }) => {
  const [method, setMethod] = useState('email'); // الافتراضي هو الإيميل
  const [identifier, setIdentifier] = useState(''); // رقم الهاتف أو الإيميل
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: اختيار الطريقة، 2: إدخال الكود
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // إرسال الكود
  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.sendVerification(method, identifier);
      setStep(2); // انتقل لخطوة إدخال الكود
    } catch (err) {
      let errorMessage = 'فشل إرسال الكود، تأكد من البيانات';
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

  // التحقق من الكود
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.checkVerification(method, code, identifier);
      alert('تم التحقق بنجاح! يمكنك الآن تسجيل الدخول.');
      if (onNavigate) {
        onNavigate('login'); // التوجيه التلقائي لصفحة الدخول
      }
    } catch (err) {
      let errorMessage = 'الكود غير صحيح، حاول مرة أخرى';
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
          <h1>تنشيط الحساب</h1>
          <p>{step === 1 ? 'اختر طريقة استلام كود التحقق' : 'أدخل الكود الذي وصلك'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <div>
            <div className="form-group">
              <label>وسيلة التحقق</label>
              <div className="input-wrapper">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '0 12px', color: '#1E3A8A', fontFamily: 'inherit', fontSize: '1rem' }}
                >
                  <option value="email">بريد إلكتروني</option>
                  <option value="sms">رسالة SMS</option>
                  <option value="whatsapp">واتساب</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>أدخل الإيميل أو رقم الهاتف</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="أدخل البيانات هنا"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            <button className="login-button" onClick={handleSendCode} disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'إرسال الكود'}
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>كود التحقق</label>
              <div className="input-wrapper" style={{ justifyContent: 'center' }}>
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '12px', fontSize: '24px', paddingLeft: '12px' }}
                />
              </div>
            </div>
            <button className="login-button" onClick={handleVerifyCode} disabled={loading}>
              {loading ? 'جاري التحقق...' : 'تأكيد الكود'}
            </button>
            <div className="footer-text" onClick={() => setStep(1)} style={{cursor: 'pointer'}}>
              رجوع لتغيير الطريقة
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
