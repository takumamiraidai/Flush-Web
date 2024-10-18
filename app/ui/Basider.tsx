/*

'use client';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import BlurCard from './BlurCard';
import { useEffect, useState } from 'react';

interface Blog {
    slug: string;
    frontMatter: {
      title: string;
      date: string;
      image: string;
    };
  }

const BasicSlider: React.FC = () => {

  const [initialBlogs, setInitialBlogs] = useState<Blog[]>([]);
  
  useEffect(() => {
    // クライアントサイドで API ルートを呼び出してデータを取得
    const fetchBlogs = async () => {
      const response = await fetch('https://taku-log-api.tq5tmhpyr9.workers.dev/api/latest_blog');  //ここが決め手 /つけろ
      const data: Blog[] = await response.json();
      setInitialBlogs(data);
    };

    fetchBlogs();
  }, []);

  if (!initialBlogs) {
    return <div className='w-full h-full flex justify-center items-center'>loading...</div>;
  }

    const slideSettings = {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    };
  
    return (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          breakpoints={slideSettings}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          speed={2000}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          pagination={{
            clickable: true, 
          }}
          className={"relative w-full h-full"}
        >
          {initialBlogs.slice(1).map((blog: Blog, index: number) => (
            <SwiperSlide key={index} className="relative">
                 <BlurCard
                  href={"dashboard/blog/" + blog.slug}
                  title={blog.frontMatter.title}
                  date={blog.frontMatter.date}
                  backgroundImage={blog.frontMatter.image}
                />
            </SwiperSlide>
          ))}
          <div className="custom-swiper-button-next"></div>
          <div className="custom-swiper-button-prev"></div>
        </Swiper>
    );
}
export default BasicSlider;
*/