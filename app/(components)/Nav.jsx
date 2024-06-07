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
      session.user.role !== "admin" &&
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
        <nav
          className="flex justify-between items-center w-full p-4 fixed top-0 left-0 bg-gradient-to-r from-teal-400 to-indigo-900 z-50"
        >
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2"
            >
              <FontAwesomeIcon
                icon={faHome}
                className="text-white text-xl cursor-pointer hover:text-blue-500"
              />
              <p className="hidden sm:block text-white hover:text-blue-500 font-bold">
                HOME
              </p>
            </Link>

            <Link
              href="/TicketPage/new"
              onClick={handleCreateTicketClick}
              className="inline-flex items-center space-x-2"
            >
              <FontAwesomeIcon
                icon={faTicket}
                className="text-white text-xl cursor-pointer hover:text-blue-500"
              />
              <p className="hidden sm:block text-white hover:text-blue-500 font-bold">
                NEW-TICKET
              </p>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                className="flex items-center text-white font-bold px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-xl" />
                <span className="hidden sm:inline">
                  Hi, {session.user.username}
                </span>
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
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <p className="font-medium">
                        empCode: {session.user.employeeCode}
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
        <div className="pt-20">
          {/* This div adds padding to the top of the content so it doesn't get hidden under the navbar */}
          {/* Your main content goes here */}
        </div>
      </>
    );
  }

  return null;
};

export default Nav;
