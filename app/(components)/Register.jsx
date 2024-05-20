"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const departments = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Project Manager",
    "Scrum Master",
    "Data Scientist",
    "Data Analyst",
    "Business Analyst",
    "System Administrator",
    "Network Engineer",
    "Security Analyst",
    "Technical Support Engineer",
    "IT Consultant",
    "Technical Writer",
    "Database Administrator",
    "Cloud Architect",
    "IT Auditor",
    "IT Trainer",
    "IT Sales",
    "IT Recruiter",
    "IT Manager",
  ];
  const roles = ["Manager", "Admin", "HR", "Employee"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !department || !role) {
      setError("All fields are necessary.");
      return;
    }

    // Validate email domain
    if (!email.endsWith("@rekonsys.tech")) {
      setError("Please use Related Email only");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          department,
          role,
        }),
      });

      if (res.ok) {
        // Reset form fields
        const form = e.target;
        form.reset();
        // Show toast
        setShowToast(true);
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          setShowToast(false);
          router.push("/");
        }, 3000);
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div
    className="fixed inset-0 bg-cover bg-center p-5"
    style={{
      zIndex: -1, // Ensure the background is behind other content
      backgroundImage:
        "url('https://images.unsplash.com/photo-1615715757401-f30e7b27b912?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    }}
    >
      <div className="grid place-items-center h-screen">
        {showToast && (
          <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md">
            Registration successful!
          </div>
        )}
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
          <h1 className="text-xl font-bold my-4">Register</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="Full Name"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
              Register
            </button>

            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <Link className="text-sm mt-3 text-right" href={"/"}>
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
