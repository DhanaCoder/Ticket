"use client";
import React, { useState, useEffect } from "react";
import TicketCard from "../(components)/TicketCard";
import Nav from "../(components)/Nav";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");

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
        // If user is admin, show all tickets
        userTickets = data.tickets;
      } else {
        // If user is not admin, filter tickets based on assignedTo field
        const userEmail = session.user.email;
        userTickets = data.tickets.filter((ticket) =>
          ticket.assignedTo.includes(userEmail)
        );
        // Add tickets created by the user to the list
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
    if (filter === "Completed") return ticket.status === "done";
    return true;
  });

  const uniqueCategories = [
    ...new Set(filteredTickets?.map(({ category }) => category)),
  ];

  return (
    <div>
      {session ? (
        <div>
          <Nav />
          <div>
            <div className="mb-4 flex justify-around">
              <button
                onClick={() => setFilter("All")}
                className={`btn px-4 py-2 rounded-lg text-sm font-semibold border-collapse border-black border-2 transition-colors duration-300 ${
                  filter === "All"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Pending")}
                className={`btn px-4 py-2 rounded-lg text-sm font-semibold border-collapse border-black border-2 transition-colors duration-300 ${
                  filter === "Pending"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Completed")}
                className={`btn px-4 py-2 rounded-lg border-collapse border-black border-2 text-sm font-semibold transition-colors duration-300 ${
                  filter === "Completed"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Completed
              </button>
            </div>
            {uniqueCategories?.map((uniqueCategory, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                <h2 className="text-xl font-bold">{uniqueCategory}</h2>
                <div className="grid grid-cols-4 gap-1">
                  {filteredTickets
                    .filter((ticket) => ticket.category === uniqueCategory)
                    .map((filteredTicket, index) => (
                      <TicketCard key={index} ticket={filteredTicket} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>You must be logged in to view this page.</div>
      )}
    </div>
  );
};

export default Dashboard;
