'use client';

export default function EmailMarquee() {
  const emailContact = '>>> hogproduktion@gmail.com <<<';

  return (
    <div
      className="border-custom-pink relative z-10 w-full overflow-hidden border-b"
      aria-label="Kontakt"
    >
      <a
        href="mailto:hogproduktion@gmail.com"
        className="block w-full"
        aria-label="Skicka mail till hogproduktion@gmail.com"
      >
        <div className="marquee-track inline-block whitespace-nowrap bg-black px-2 py-0.5 text-sm font-medium tracking-wide uppercase hover:bg-custom-pink hover:text-black">
          {emailContact}
        </div>
      </a>

      <style jsx>{`
        .marquee-track {
          animation: marquee 20s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
