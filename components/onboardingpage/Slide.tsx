'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface SliderProps {
  slides: React.ReactNode[];
}

const Slider = ({ slides }: SliderProps) => {
  return (
    <div className="slider-container">
      <Swiper
        modules={[Pagination]}
        pagination={{
          type: 'bullets',
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} onboard-custom-bullet"></span>`;
          },
        }}
        className="h-screen w-full onboard-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>{slide}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
