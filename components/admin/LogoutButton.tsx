'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="rounded-full bg-red-600 px-6 py-3 text-lg font-bold text-white shadow transition hover:bg-red-700"
    >
      LOGGA UT
    </button>
  );
}
