"use client";
import React, { useState, useEffect } from "react";
import TicketCard from "../(components)/TicketCard";
import Nav from "../(components)/Nav";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session) {
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/Tickets", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await res.json();

      let userTickets = [];

      if (session.user.role === "Admin") {
        userTickets = data.tickets;
      } else {
        const userEmail = session.user.email;
        userTickets = data.tickets.filter((ticket) =>
          ticket.assignedTo.includes(userEmail)
        );
        const createdTickets = data.tickets.filter(
          (ticket) => ticket.email === userEmail
        );
        userTickets = [...userTickets, ...createdTickets];
      }

      setTickets(userTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "All") return true;
    if (filter === "Pending")
      return ticket.status === "not started" || ticket.status === "started";
    if (filter === "Completed") return ticket.status === "solved";
    return true;
  });

  const uniqueCategories = [
    ...new Set(filteredTickets?.map(({ category }) => category)),
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedCategories = uniqueCategories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {session ? (
        <div>
          <Nav />
          <div className="flex mx-4 my-4 rounded bg-white p-2 lg:max-w-md lg:mx-auto">
            <input
              className="border br-2 bg-transparent px-4 py-2 text-gray-700 outline-none flex-grow"
              type="search"
              name="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="m-2 rounded bg-blue-600 p-2 text-white flex items-center"
            >
              <svg
                className="fill-current h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
          <div className="mb-4 flex flex-wrap lg:flex-nowrap justify-around gap-2 mx-4">
            <button
              onClick={() => setFilter("All")}
              className={`button btn px-3 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-300 ${
                filter === "All"
                  ? "bg-blue-200 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`button btn px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-colors duration-300 ${
                filter === "Pending"
                  ? "bg-blue-200 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("Completed")}
              className={`button btn px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-colors duration-300 ${
                filter === "Completed"
                  ? "bg-blue-200 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Completed
            </button>
          </div>
          {searchedCategories.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-4 mx-4">
              <h2 className="text-lg font-bold">{uniqueCategory}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTickets
                  .filter((ticket) => ticket.category === uniqueCategory)
                  .map((filteredTicket, index) => (
                    <TicketCard key={index} ticket={filteredTicket} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">You must be logged in to view this page.</div>
      )}
    </div>
  );
};

export default Dashboard;
