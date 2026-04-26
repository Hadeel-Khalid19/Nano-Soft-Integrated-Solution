import apiClient from '../api/client';

const userService = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/me', {
      params: { api_version: 'v2' }
    });
    const data = response.data;
    return data?.user || data?.data || data;
  },

  updateProfile: async (data) => {
    // إعدادات الطلب النظيفة (Clean Setup)
    const config = {
      headers: {
        'api-version': 'v2',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        api_version: 'v2'
      }
    };

    try {
      // المحاولة 1: التحديث المباشر عبر /me (كما هو مطلوب في القائمة)
      // نستخدم PUT حقيقي وليس محاكاة
      const response = await apiClient.put('/me', data, config);
      
      // إذا لم يرجع السيرفر خطأ، نفترض النجاح
      return response.data;
    } catch (e) {
      // المحاولة 2: التحديث عبر /user/profile (كمسار بديل نظيف)
      try {
        const response = await apiClient.put('/user/profile', data, config);
        return response.data;
      } catch (e2) {
        // المحاولة 3: العودة للمحاكاة (Fallback) فقط في حالة فشل الـ PUT الحقيقي
        const response = await apiClient.post('/me', { ...data, _method: 'PUT' }, config);
        return response.data;
      }
    }
  },

  getUserProfile: async () => {
    const response = await apiClient.get('/user/profile', {
      params: { api_version: 'v2' }
    });
    return response.data;
  }
};

export default userService;
