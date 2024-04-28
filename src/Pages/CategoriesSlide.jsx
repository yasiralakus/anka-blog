import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

export default function CategoriesSlide() {
  return (
    <>
      <Swiper
        spaceBetween={16}
        slidesPerView={6}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        breakpoints={{
            1220: {
                slidesPerView: 5,
            },
            800: {
                slidesPerView: 4,
            },
            430: {
                slidesPerView: 3,
            },
            0: {
                slidesPerView: 2,
            },
          }}
        className="mySwiper"
      >
        <SwiperSlide>
            <Link to="/category/yemek"> Yemek</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/sinema"> Sinema</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/seyahat"> Seyahat</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/tarih"> Tarih</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/bilim"> Bilim</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/felsefe"> Felsefe</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/siyaset"> Siyaset</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/moda"> Moda</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/sanat"> Sanat</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/aile"> Aile</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/teknoloji"> Teknoloji</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/finans"> Finans</Link>
        </SwiperSlide>
        <SwiperSlide>
            <Link to="/category/dekorasyon"> Dekorasyon</Link>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
