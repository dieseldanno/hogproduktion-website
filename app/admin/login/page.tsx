'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/compat/router';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router?.push('/admin');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FF6900] text-white">
      {/* Card */}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-sm">
        {/* Logo */}
        <h1 className="text-center text-5xl font-black tracking-wider text-[#F6339A]">
          HÖG
        </h1>

        <h2 className="text-center text-xl font-semibold">Admin-login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              E-post
            </label>
            <input
              id="email"
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-white/30 bg-transparent px-4 py-3 text-white placeholder-white/70 focus:border-[#F6339A] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="sr-only">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="placeholder-white/ bins70 w-full rounded border border-white/30 bg-transparent px-4 py-3 text-white focus:border-[#F6339A] focus:outline-none"
            />
          </div>

          {/* Error */}
          {error && <p className="text-center text-sm text-red-300">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded bg-[#F6339A] py-3 font-bold tracking-wider text-white uppercase transition hover:bg-[#d92b87] focus:outline-none"
          >
            Logga in
          </button>
        </form>

        {/* Hint */}
        <p className="text-center text-xs opacity-80">
          Test: <strong>admin@theatre.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
