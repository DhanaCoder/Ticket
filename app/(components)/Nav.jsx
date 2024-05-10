"use client";

import { signOut, useSession } from "next-auth/react";
import { faHome, faTicket, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; // Redirect manually to home page after sign out
  };

  return (
    <nav className="flex justify-between w-full bg-nav">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <FontAwesomeIcon icon={faHome} className="icon" />
        </Link>
        <Link href="/TicketPage/new">
          <FontAwesomeIcon icon={faTicket} className="icon" />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {session && (
          <div className="relative text-default-text">
            {/* Display dropdown menu */}
            <div className="dropdown relative">
              <button className="text-white font-bold px-4 py-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {session.user.username}
              </button>
              <ul className="dropdown-menu text-gray-700 pt-1">
                <li>
                  <p>{session.user.role}</p>
                </li>
                <li>
                  <p>{session.user.departments}</p>
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  <button onClick={handleSignOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
