import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import * as schema from './schema';

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const providers = [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Development',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "43cdffb1-0317-4256-92ee-2c50250bc26c", name: "Developer Admin", email: "admin@antriankita.com" };
        }
        return null;
      }
    })
  ];

  if (!db) {
    return {
      providers,
      pages: { signIn: '/login' },
    };
  }

  return {
    adapter: DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
    providers,
    session: { strategy: 'jwt' },
    callbacks: {
      session({ session, token }) {
        if (session.user && token?.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
    pages: {
      signIn: '/login',
    },
  };
});
