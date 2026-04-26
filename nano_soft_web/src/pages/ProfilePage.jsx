import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import authService from '../services/authService';

const ProfilePage = ({ onNavigate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // حالة التعديل
  const [editState, setEditState] = useState({ isOpen: false, type: '', value: '', loading: false, error: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      console.log('Profile Data:', userData);
      setUser(userData);
    } catch (err) {
      console.error('فشل جلب البيانات', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onNavigate('login');
  };

  const openEditModal = (type, currentValue) => {
    setEditState({ isOpen: true, type, value: currentValue || '', loading: false, error: '' });
  };

  const handleSave = async () => {
    if (!editState.value) return;
    setEditState({ ...editState, loading: true, error: '' });
    try {
      let finalValue = editState.value;
      if (editState.type === 'mobile' && !finalValue.startsWith('+967')) {
        finalValue = `+967${finalValue}`;
      }
      const payload = editState.type === 'email' ? { email: finalValue } : { mobile: finalValue };
      const res = await userService.updateProfile(payload);
      console.log('Update Success Response:', res);
      
      // لا نعتمد على التحديث المحلي فقط، بل نجلب البيانات من السيرفر للتأكد
      await fetchData(); 
      
      setEditState({ ...editState, isOpen: false });
      alert(res?.message || 'تم التحديث بنجاح ✅');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'فشل التحديث، حاول مرة أخرى';
      setEditState({ ...editState, loading: false, error: msg });
    }
  };

  if (loading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc'}}>
      <h2>جاري التحميل...</h2>
    </div>
  );

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <nav style={{ background: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#1E3A8A', color: '#fff', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>N</div>
          <span style={{ fontWeight: 'bold', color: '#1E3A8A' }}>نانو سوفت</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigate('home')} style={{ background: '#f1f5f9', color: '#1E3A8A', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>العودة للسابق</button>
          <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>خروج</button>
        </div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 20px' }}>
        {/* User Card */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60px', background: 'linear-gradient(135deg, #1E3A8A, #111827)' }}></div>
          <div style={{ width: '80px', height: '80px', background: '#d4af37', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '30px', position: 'relative', zIndex: 1, border: '4px solid #fff' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 style={{ margin: '0 0 5px 0', color: '#1E3A8A' }}>Welcome! أهلاً بك</h2>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#333' }}>{user?.name || 'مستخدم نانو'}</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>عضو نشط</span>
        </div>

        {/* Info Card */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginTop: 0 }}>معلومات التواصل</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>البريد الإلكتروني</div>
              <div style={{ fontWeight: 'bold' }}>{user?.email || 'غير متوفر'}</div>
            </div>
            <button onClick={() => openEditModal('email', user?.email)} style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>تعديل</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>رقم الهاتف</div>
              <div style={{ fontWeight: 'bold' }}>{user?.mobile || 'غير متوفر'}</div>
            </div>
            <button onClick={() => openEditModal('mobile', user?.mobile)} style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>تعديل</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editState.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
            <h3>تعديل {editState.type === 'email' ? 'البريد' : 'الهاتف'}</h3>
            {editState.error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.8rem' }}>{editState.error}</div>}
            <input 
              type="text" 
              value={editState.value} 
              onChange={(e) => setEditState({ ...editState, value: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} disabled={editState.loading} style={{ flex: 1, background: '#1E3A8A', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                {editState.loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={() => setEditState({ ...editState, isOpen: false })} style={{ flex: 1, background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
