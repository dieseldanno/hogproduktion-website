'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      }}
      className="text-custom-pink mb-12 inline-flex items-center font-bold"
    >
      <span className="mr-2">←</span> TILLBAKA
    </button>
  );
}
