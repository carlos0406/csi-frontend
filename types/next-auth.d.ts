import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Estende o objeto User da sessão do Next Auth
   */
  interface Session {
    token?: string;
    user: {
      id?: string
    } & DefaultSession["user"]
  }
}