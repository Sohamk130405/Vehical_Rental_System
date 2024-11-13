// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        console.log(user);
        if (!user) {
          return null;
        }

        const isPasswordCorrect = await verifyPassword(
          credentials.password,
          user.password
        );

        if (isPasswordCorrect && user.role === credentials.role) {
          return {
            id: user.user_id, // Make sure your `getUserByEmail` returns `user_id`
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // Use `user.id` instead of `user.user_id`
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
