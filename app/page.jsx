import LoginForm from "./(components)/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{
          zIndex: -1, // Ensure the background is behind other content
          backgroundImage:
            "url('https://images.unsplash.com/photo-1615715757401-f30e7b27b912?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}></div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
