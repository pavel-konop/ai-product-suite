import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // Assign orphaned projects to the very first user who signs up
      try {
        if (user.id) {
          const userCount = await prisma.user.count();
          if (userCount === 1) {
            await prisma.project.updateMany({
              where: { userId: null },
              data: { userId: user.id },
            });
          }
        }
      } catch (e) {
        console.error("signIn callback error:", e);
      }
      return true;
    },
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
