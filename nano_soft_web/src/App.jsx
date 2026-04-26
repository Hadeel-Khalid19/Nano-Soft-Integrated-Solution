import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RecoverAccountPage from './pages/RecoverAccountPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import './styles/Login.css';

function App() {
  // حالة لإدارة الصفحة الحالية
  const [currentPage, setCurrentPage] = useState('login');

  // دالة لتغيير الصفحة
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className="app-container">
      {currentPage === 'login' && <LoginPage onNavigate={navigateTo} />}
      {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
      {currentPage === 'verify' && <VerifyPage onNavigate={navigateTo} />}
      {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={navigateTo} />}
      {currentPage === 'recover-account' && <RecoverAccountPage onNavigate={navigateTo} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={navigateTo} />}
      {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
    </div>
  );
}

export default App;
