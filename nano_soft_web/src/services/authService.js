import apiClient from '../api/client';

const authService = {
  // تسجيل الدخول
  login: async (mobile, password) => {
    const response = await apiClient.post('/auth/login', { mobile, password });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('nano_token', data.token);
    }
    // حفظ بيانات المستخدم مباشرة عند الدخول
    const user = data.user || data.data || data;
    if (user && (user.name || user.email || user.mobile)) {
      localStorage.setItem('nano_user', JSON.stringify(user));
    }
    return data;
  },

  // إنشاء حساب جديد
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // التحقق من صحة البيانات قبل التسجيل
  registerValidator: async (data) => {
    const response = await apiClient.post('/auth/register-validator', data);
    return response.data;
  },

  // إرسال كود التحقق (sms, whatsapp, email)
  sendVerification: async (method, identifier) => {
    const payload = { method };
    if (method === 'email') {
      payload.email = identifier;
    } else {
      payload.mobile = identifier;
    }
    const response = await apiClient.post('/auth/verify/send', payload);
    return response.data;
  },

  // التأكد من كود التحقق
  checkVerification: async (method, code, identifier) => {
    const payload = { method, code };
    if (method === 'email') {
      payload.email = identifier;
    } else {
      payload.mobile = identifier;
    }
    const response = await apiClient.post('/auth/verify/check', payload);
    return response.data;
  },

  // طلب استعادة كلمة المرور
  forgotPassword: async (mobile) => {
    const response = await apiClient.post('/auth/forgot', { mobile });
    return response.data;
  },

  // تعيين كلمة مرور جديدة
  resetPassword: async (code, password) => {
    const response = await apiClient.post('/auth/reset', { code, password });
    return response.data;
  },

  // تسجيل الخروج
  logout: () => {
    localStorage.removeItem('nano_token');
  }
};

export default authService;
