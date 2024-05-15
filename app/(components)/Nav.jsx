"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { faHome, faTicket, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Nav = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; // Redirect manually to home page after sign out
  };

  // Only show the user info if the session is loaded and the user is authenticated
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session.user) {
    return (
      <nav className="flex justify-between items-center w-full bg-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <FontAwesomeIcon icon={faHome} className="text-white text-xl cursor-pointer" />
          </Link>
          {session.user.role === "Admin" ? (
            <Link href="/TicketPage/new">
              <FontAwesomeIcon icon={faTicket} className="text-white text-xl cursor-pointer" />
            </Link>
          ) : (
            <div className="text-white text-xl cursor-pointer" title="Only admins can create tickets">
              <FontAwesomeIcon icon={faTicket} className="opacity-50" />
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center text-white font-bold px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2 text-xl" />
            Hi, {session.user.username}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <p className="font-medium">Email: {session.user.email}</p>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <p className="font-medium">Role: {session.user.role}</p>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <p className="font-medium">Department: {session.user.department}</p>
                </li>
                <li
                  className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 text-red-600"
                  onClick={handleSignOut}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span>Log Out</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return null; // Or return a different component for unauthenticated state
};

export default Nav;
