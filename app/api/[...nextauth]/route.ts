import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

const prisma = new PrismaClient();

// Define the shape of our user in the session
interface User {
  id: string;
  name: string | null;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.account.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

// App Router export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
