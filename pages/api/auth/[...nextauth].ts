import GoogleProvider from 'next-auth/providers/google';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import NextAuth, { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  adapter: TypeORMAdapter({
    type: 'postgres',
    url: process.env.AUTH_TYPEORM_CONNECTION,
    synchronize: false,
    schema: 'users',
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        domain: process.env.NODE_ENV === 'production' ? '.carlos0406.com' : undefined,
      },
    },
  },
};

export default NextAuth(authOptions);
