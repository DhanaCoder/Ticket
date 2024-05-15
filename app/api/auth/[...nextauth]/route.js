import { connectMongoDB } from "@/lib/mongodb";
import Person from "@/app/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await Person.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          // Return user object to include username, role, and department
          return {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            department: user.department,
          };
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // This function is called whenever a JWT is created or updated.
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      // This function is called whenever a session is checked.
      if (token) {
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.department = token.department;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
