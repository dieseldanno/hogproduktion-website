'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageType {
  id: string;
  url: string;
}

interface Props {
  images: ImageType[];
  title: string;
}

export default function GallerySlider({ images, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Tangentbordsstöd
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Swipe-stöd
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      next();
    } else if (distance < -minSwipeDistance) {
      prev();
    }
  };

  if (!images.length) return null;

  return (
    <div
      ref={sliderRef}
      className="relative w-full select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Bild-wrapper */}
      <div className="relative h-[520px] w-full overflow-hidden">
        {images.map((img, index) => (
          <Image
            key={img.id}
            src={img.url}
            alt={`Bild ${index + 1} från ${title}`}
            fill
            sizes="100vw"
            className={`absolute inset-0 object-contain transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === current}
          />
        ))}
      </div>

      {/* Vänster */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/40 px-4 py-2 text-white backdrop-blur transition hover:bg-black/70"
      >
        ←
      </button>

      {/* Höger */}
      <button
        onClick={next}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/40 px-4 py-2 text-white backdrop-blur transition hover:bg-black/70"
      >
        →
      </button>

      {/* Slide-indikator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1 text-sm text-white backdrop-blur">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
