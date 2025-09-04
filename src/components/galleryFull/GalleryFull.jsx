import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./_galleryfull.scss";

const BASE_IMG_URL = "https://image.tmdb.org/t/p/original";

const GalleryFull = ({ images, visible, onClose }) => {
  const overlayRef = useRef();

  if (!images || images.length === 0) return null;

  const uniqueImages = images.filter(
    (img, index, self) =>
      index === self.findIndex((i) => i.file_path === img.file_path)
  );

  const handleClick = (e) => {
    const activeSlide = overlayRef.current.querySelector(
      ".swiper-slide-active"
    );
    if (
      e.target.classList.contains("swiper-button-next") ||
      e.target.classList.contains("swiper-button-prev")
    ) {
      return;
    }

    if (!activeSlide) return;
    const image = activeSlide.querySelector("img");
    if (!image) return;
    if (e.target === image) return;
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`gallery-container ${visible ? "visible" : ""}`}
      ref={overlayRef}
      onClick={handleClick}
    >
      <div className="overlay">
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          keyboard={{ enabled: true }}
          loop={true}
        >
          {uniqueImages.map((img, index) => (
            <SwiperSlide key={index} className="gallery-slide">
              <img
                src={`${BASE_IMG_URL}${img.file_path}`}
                alt={`Imagen ${index + 1}`}
                className="gallery-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GalleryFull;
