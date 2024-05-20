import LoginForm from "./(components)/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative z-50 inset-0 flex justify-center items-center">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center p-5"
        style={{
          zIndex: -1, // Ensure the background is behind other content
          backgroundImage:
            "url('https://images.unsplash.com/photo-1615715757401-f30e7b27b912?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>
      {/* Login Form */}
      <div className="relative z-50">
        <LoginForm />
      </div>
      <div className="relative z-50 card p-5 m-5 bg-white bg-opacity-80 shadow-lg rounded-lg">
        <div className="card-details">
          <p className="text-title text-2xl font-bold">Rekonsys</p>
          <p className="text-body text-lg">Ticketing-System</p>
        </div>
      </div>
    </div>
  );
}
