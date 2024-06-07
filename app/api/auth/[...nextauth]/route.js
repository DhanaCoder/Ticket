import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Fetch user data from the external login API
          const response = await fetch("https://api.rekonsys.tech/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          const user = data.user;

          // Return user object to include additional details
          return {
            id: user._id,
            email: user.email,
            username: `${user.firstName} ${user.lastName}`,
            employeeCode: user.employeeCode,
            role: user.role,
            department: user.department,
            position: user.position,
          };
        } catch (error) {
          console.error("Error authenticating user:", error.message);
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
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.department = user.department;
        token.position = user.position;
        token.employeeCode = user.employeeCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.position = token.position;
        session.user.employeeCode = token.employeeCode;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
