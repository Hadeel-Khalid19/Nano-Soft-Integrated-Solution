import React from 'react';
import '../styles/Home.css';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-container" dir="rtl">
      {/* Top Header */}
      <header className="home-header">
        <div className="header-logo">
          <div className="logo-icon">N</div>
          <h2>نانو سوفت</h2>
        </div>
        <div className="header-actions">
          <button className="icon-btn">🔍</button>
          <button className="icon-btn">🔔</button>
        </div>
      </header>

      {/* Main Banner */}
      <div className="home-banner">
        <h3>مرحباً بك في عالم التقنية!</h3>
        <p>استكشف أحدث الدورات التدريبية والمنتجات التقنية التي نقدمها.</p>
      </div>

      {/* Categories */}
      <div className="section-title">
        الأقسام الرئيسية
        <span>عرض الكل</span>
      </div>
      <div className="categories-scroll">
        <div className="category-card">
          <div className="cat-icon">💻</div>
          <div className="cat-name">برمجة</div>
        </div>
        <div className="category-card">
          <div className="cat-icon">📱</div>
          <div className="cat-name">تطبيقات</div>
        </div>
        <div className="category-card">
          <div className="cat-icon">🎨</div>
          <div className="cat-name">تصميم</div>
        </div>
        <div className="category-card">
          <div className="cat-icon">🛡️</div>
          <div className="cat-name">أمن سيبراني</div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="section-title">
        الأكثر طلباً
      </div>
      <div className="products-grid">
        <div className="product-card">
          <div className="product-image">⚛️</div>
          <div className="product-title">دورة React الشاملة</div>
          <div className="product-price">150$</div>
        </div>
        <div className="product-card">
          <div className="product-image">🦋</div>
          <div className="product-title">دبلوم Flutter</div>
          <div className="product-price">200$</div>
        </div>
        <div className="product-card">
          <div className="product-image">🚀</div>
          <div className="product-title">برمجة الباك إند</div>
          <div className="product-price">180$</div>
        </div>
        <div className="product-card">
          <div className="product-image">🤖</div>
          <div className="product-title">الذكاء الاصطناعي</div>
          <div className="product-price">250$</div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <i>🏠</i>
          <span>الرئيسية</span>
        </button>
        <button className="nav-item">
          <i>❤️</i>
          <span>المفضلة</span>
        </button>
        <button className="nav-item">
          <i>🛒</i>
          <span>السلة</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('profile')}>
          <i>👤</i>
          <span>حسابي</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
