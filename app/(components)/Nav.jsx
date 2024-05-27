"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  faHome,
  faTicket,
  faUser,
  faSignOutAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Nav = () => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; // Redirect manually to home page after sign out
  };

  const handleCreateTicketClick = (e) => {
    if (
      session.user.role !== "Admin" &&
      session.user.position !== "Testers/QA Engineers" &&
      session.user.department !== "Quality Assurance and Testing"
    ) {
      e.preventDefault();
      setToastMessage("You don't have permission to create a ticket.");
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated" && session.user) {
    return (
      <>
        <nav className="flex justify-between items-center w-full bg-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <FontAwesomeIcon
                icon={faHome}
                className="text-white text-xl cursor-pointer hover:bg-yellow-300"
              />
            </Link>
            <p className="hidden sm:block text-blue-300 font-bold">HOME</p>
            <Link href="/TicketPage/new" onClick={handleCreateTicketClick}>
              <FontAwesomeIcon
                icon={faTicket}
                className="text-white text-xl cursor-pointer hover:bg-green-300"
              />
            </Link>
            <p className="hidden sm:block text-blue-300 font-bold">NEW-TICKET</p>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <FontAwesomeIcon
                icon={faBell}
                className="text-white text-xl cursor-pointer"
              />
            </div>
            <div className="relative">
              <button
                className="flex items-center text-white font-bold px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-xl" />
                <span className="hidden sm:inline">Hi, {session.user.username}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <ul className="text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <p className="font-medium">Email: {session.user.email}</p>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <p className="font-medium">Role: {session.user.role}</p>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <p className="font-medium">
                        Department: {session.user.department}
                      </p>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <p className="font-medium">
                        Position: {session.user.position}
                      </p>
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
          </div>
        </nav>
        {toastMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </>
    );
  }

  return null; // Or return a different component for unauthenticated state
};

export default Nav;
