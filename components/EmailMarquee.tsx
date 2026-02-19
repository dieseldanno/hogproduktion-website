'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function EmailMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const emailContact = '>>> hogproduktion@gmail.com <<<';

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.fromTo(
      track,
      { x: container.offsetWidth },
      {
        x: -track.offsetWidth,
        duration: 20,
        ease: 'none',
      }
    );

    const handleEnter = () => tl.pause();
    const handleLeave = () => tl.play();

    container.addEventListener('mouseenter', handleEnter);
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mouseenter', handleEnter);
      container.removeEventListener('mouseleave', handleLeave);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="border-custom-pink relative w-full overflow-hidden border-b"
    >
      <div
        ref={trackRef}
        className="hover:bg-custom-pink flex w-max bg-black px-2 py-0.5 text-sm font-medium tracking-wide whitespace-nowrap uppercase hover:text-black"
      >
        <a href="mailto:hogproduktion@gmail.com">{emailContact}</a>
      </div>
    </div>
  );
}
