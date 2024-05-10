"use client";

import React, { useState, useEffect } from "react";
import TicketCard from "../(components)/TicketCard";
import Nav from "../(components)/Nav";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (session) {
      // Fetch tickets for the logged-in user
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await res.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  return (
    <div className="p-5">
      <Nav />
      {session ? (
        <div>
          {tickets.map((_ticket, _index) => (
            <TicketCard key={_index} ticket={_ticket} />
          ))}
        </div>
      ) : (
        <div>You must be logged in to view this page.</div>
      )}
    </div>
  );
};

export default Dashboard;
