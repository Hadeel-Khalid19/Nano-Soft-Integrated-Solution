import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdverts } from '../services/advertService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/AdvertSlider.css';

const AdvertSlider = () => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchAdverts = async () => {
      try {
        const data = await getAdverts();
        // Assume API returns data.data or similar. Adjust based on real API response
        const advertList = Array.isArray(data) ? data : (data.data || []);
        setAdverts(advertList.length > 0 ? advertList : getPlaceholderAdverts());
      } catch (error) {
        console.error('Failed to fetch adverts:', error);
        setAdverts(getPlaceholderAdverts());
      } finally {
        setLoading(false);
      }
    };

    fetchAdverts();
  }, []);

  const getPlaceholderAdverts = () => [
    {
      id: 1,
      image_path: 'images/luxury_banner.png',
      title: 'نظام نانو المتكامل',
      description: 'الفخامة والاحترافية في إدارة المؤسسات التعليمية الحديثة'
    },
    {
      id: 2,
      is_gradient: true,
      title: 'تميز بمدرستك',
      description: 'حلول رقمية مبتكرة تجمع بين دقة الأداء وجمال التصميم'
    },
    {
      id: 3,
      image_path: 'images/banner2.png',
      title: 'مستقبل رقمي واعد',
      description: 'انضم إلى نخبة المدارس التي اختارت نانو سوفت لتطوير رحلتها التعليمية'
    }
  ];

  if (loading) {
    return (
      <div className="advert-slider-container loading-skeleton">
        <div className="skeleton-pulse" style={{ width: '100%', height: '100%', background: '#f0f0f0' }}></div>
      </div>
    );
  }

  return (
    <div className="advert-slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.prev-btn',
          nextEl: '.next-btn',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        loop={adverts.length > 1}
      >
        {adverts.map((advert, index) => (
          <SwiperSlide key={advert.id || index}>
            <div className="slide-image-wrapper">
              {advert.is_gradient ? (
                <div className="luxury-mesh-bg">
                  <div className="mesh-circle mesh-1"></div>
                  <div className="mesh-circle mesh-2"></div>
                </div>
              ) : (
                <img 
                  src={advert.image_path || advert.image} 
                  alt={advert.title} 
                  className="slide-image"
                />
              )}
              <div className="slide-overlay"></div>
            </div>
            
            <div className="slide-content">
              <AnimatePresence mode="wait">
                {activeIndex === index && (
                  <>
                    <motion.h2
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 20,
                        delay: 0.2 
                      }}
                      className="slide-title"
                    >
                      {advert.title}
                    </motion.h2>
                    <motion.p
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 20,
                        delay: 0.4 
                      }}
                      className="slide-description"
                    >
                      {advert.description}
                    </motion.p>
                  </>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}

        <button className="slider-nav-btn prev-btn">
          <ChevronRight size={24} />
        </button>
        <button className="slider-nav-btn next-btn">
          <ChevronLeft size={24} />
        </button>
      </Swiper>
    </div>
  );
};

export default AdvertSlider;
