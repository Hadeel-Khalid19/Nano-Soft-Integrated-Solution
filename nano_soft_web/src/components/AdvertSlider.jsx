import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const AdvertSlider = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      title: 'نظام نانو المدرسي',
      desc: 'إدارة متكاملة لمدارس المستقبل بتقنيات حديثة'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      title: 'إدارة شاملة للنظام',
      desc: 'واجهات احترافية لتسهيل متابعة الطلاب والمعلمين'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      title: 'تقارير ذكية ودقيقة',
      desc: 'تحليلات تفصيلية لاتخاذ قرارات تربوية وإدارية أفضل'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      title: 'دعم فني 24/7',
      desc: 'فريقنا جاهز لمساعدتك دائماً في كل خطوة'
    }
  ];

  return (
    <div className="advert-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.custom-slider-dots',
          bulletClass: 'slider-dot',
          bulletActiveClass: 'active'
        }}
        navigation={{
          nextEl: '.custom-slider-next',
          prevEl: '.custom-slider-prev',
        }}
        className="slider-track"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-item">
              <img src={slide.image} alt={slide.title} loading="lazy" />
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrows (Custom classes to match your CSS) */}
      <button className="slider-arrow prev custom-slider-prev" aria-label="السابق">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <button className="slider-arrow next custom-slider-next" aria-label="التالي">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Dots (Custom container to match your CSS) */}
      <div className="slider-dots custom-slider-dots"></div>
    </div>
  );
};

export default AdvertSlider;
