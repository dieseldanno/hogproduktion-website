'use client';

import { useState } from 'react';

export function ToggleCurrent({
  slug,
  isCurrent,
}: {
  slug: string;
  isCurrent: boolean;
}) {
  const [current, setCurrent] = useState(isCurrent);

  const toggle = async () => {
    const res = await fetch(`/api/projects/${slug}/toggle`, {
      method: 'POST',
    });
    if (res.ok) {
      setCurrent(!current);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`rounded px-5 py-2 font-bold transition-all ${
        current ? 'bg-green-600' : 'bg-gray-600'
      } hover:opacity-90`}
    >
      {current ? 'AKTUELL' : 'ARKIV'}
    </button>
  );
}
