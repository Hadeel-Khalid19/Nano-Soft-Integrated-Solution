import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const RecoverAccountPage = ({ onNavigate }) => {
  const [method, setMethod] = useState('sms');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractError = (err, defaultMsg) => {
    let errorMessage = defaultMsg;
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
    return errorMessage;
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.sendVerification(method, identifier);
      setStep(2); 
    } catch (err) {
      setError(extractError(err, 'فشل الإرسال، تأكد من صحة البيانات'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.checkVerification(method, code, identifier);
      alert('تم استرداد حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
      if (onNavigate) onNavigate('login');
    } catch (err) {
      setError(extractError(err, 'الكود غير صحيح، حاول مرة أخرى'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>استرداد الحساب</h1>
          <p>
            {step === 1 && 'أدخل بياناتك لطلب استرداد الحساب'}
            {step === 2 && 'أدخل كود التحقق لإكمال الاسترداد'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div>
            <div className="form-group">
              <label>وسيلة الاسترداد</label>
              <div className="input-wrapper">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '0 12px', color: '#1E3A8A', fontFamily: 'inherit', fontSize: '1rem' }}
                >
                  <option value="sms">رسالة SMS</option>
                  <option value="whatsapp">واتساب</option>
                  <option value="email">بريد إلكتروني</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>رقم الهاتف أو الإيميل</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="أدخل البيانات هنا"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            <button className="login-button" onClick={handleSendRequest} disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'طلب استرداد الحساب'}
            </button>
            <div className="footer-text" onClick={() => onNavigate('login')} style={{cursor: 'pointer'}}>
              العودة لشاشة الدخول
            </div>
          </div>
        )}

        {step === 2 && (
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
              {loading ? 'جاري التحقق...' : 'تأكيد الاسترداد'}
            </button>
            <div className="footer-text" onClick={() => setStep(1)} style={{cursor: 'pointer'}}>
              رجوع
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoverAccountPage;
