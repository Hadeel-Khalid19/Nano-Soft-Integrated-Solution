import React, { useState } from 'react';
import authService from '../services/authService';
import '../styles/Login.css';

const ForgotPasswordPage = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState(''); // رقم الهاتف
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1: طلب الكود, 2: التحقق وتعيين الباسورد
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

  // 1. إرسال كود الاستعادة
  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(identifier);
      setStep(2); 
    } catch (err) {
      setError(extractError(err, 'فشل إرسال الكود، تأكد من أن الرقم مسجل مسبقاً'));
    } finally {
      setLoading(false);
    }
  };

  // 2. تعيين كلمة المرور الجديدة
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError('كلمة المرور يجب أن لا تقل عن 8 أحرف');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(code, newPassword);
      alert('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      if (onNavigate) onNavigate('login');
    } catch (err) {
      setError(extractError(err, 'فشل تغيير كلمة المرور، تأكد من صحة الكود'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>إعادة تعيين كلمة المرور</h1>
          <p>
            {step === 1 && 'أدخل رقم هاتفك لنرسل لك كود الاستعادة'}
            {step === 2 && 'أدخل الكود الذي وصلك وكلمة المرور الجديدة'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="أدخل رقم هاتفك المسجل"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            <button className="login-button" onClick={handleSendCode} disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'إرسال كود الاستعادة'}
            </button>
            <div className="footer-text" onClick={() => onNavigate('login')} style={{cursor: 'pointer'}}>
              تذكرت كلمة المرور؟ <b>العودة للدخول</b>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="form-group">
              <label>الكود المستلم (انسخه من الرسالة والصقه هنا)</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="الصق الكود الطويل هنا..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>كلمة المرور الجديدة</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>تأكيد كلمة المرور</label>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <button className="login-button" onClick={handleResetPassword} disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ وتسجيل الدخول'}
            </button>
            <div className="footer-text" onClick={() => setStep(1)} style={{cursor: 'pointer'}}>
              رجوع لتغيير الرقم
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
