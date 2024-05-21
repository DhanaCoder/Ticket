import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusDisplay from "./StatusDisplay";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import Link from "next/link";

const TicketCard = ({ ticket }) => {
  const { data: session } = useSession();
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await fetch(`/api/register/${ticket.email}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setDepartment(data.department);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [ticket.email]);

  const createdDateTime = new Date(ticket.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isAdmin = session && session.user.role === "Admin";
  const canEdit = session && (session.user.email === ticket.email || isAdmin);

  return (
    <div className="relative w-69 h-80 overflow-hidden bg-white shadow-lg border-t-4 border-black rounded-lg transition-transform duration-500 transform hover:-translate-y-4 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-white z-0 rounded-lg"></div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white font-bold text-lg p-4">
        <p className="text-sm text-gray-900 font-bold mb-2">
          Created by: {ticket.email}
          <br />
          Department: {loading ? "Loading..." : department}
        </p>
        <p className="text-sm text-gray-900 font-bold mb-2">
          Project: {ticket.category || "Loading..."}
          <br />
          Assigned To: {ticket.assignedTo.join(", ")}
        </p>
        <div className="flex mb-3 gap-2 w-full">
          <PriorityDisplay priority={ticket.priority} />
          <div className="ml-auto">
            {canEdit && <DeleteBlock id={ticket._id} />}
          </div>
        </div>
        <Link
          href={`/TicketPage/${ticket._id}`}
          style={{ display: "contents" }}
        >
          <h4 className="mb-1 font-semibold text-lg text-gray-800">
            {ticket.title}
          </h4>
          <hr className="h-px border-0 bg-gray-900 mb-2" />
          <p className="whitespace-pre-wrap text-gray-700">
            {editMode
              ? ticket.description
              : truncateDescription(ticket.description)}
          </p>
          <div className="flex-grow"></div>
          <div className="flex mt-2 w-full">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 my-1">{createdDateTime}</p>
              <ProgressDisplay progress={ticket.progress} />
            </div>
            <div className="ml-auto flex items-end">
              <StatusDisplay status={ticket.status} />
            </div>
          </div>
        </Link>
        {ticket.status === "done" && session && (
          <div className="mt-2 text-sm text-gray-600 font-bold">
            <span>Done by: </span>
            <span className="font-semibold">{session.user.email}</span>
          </div>
        )}
        {isAdmin && (
          <div
            className="mt-2 text-sm text-gray-600 font-bold cursor-pointer"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "View" : "Edit"} Description
          </div>
        )}
      </div>
    </div>
  );
};

const truncateDescription = (description) => {
  const maxLength = 25;
  return description.length > maxLength
    ? description.substring(0, maxLength) + "..."
    : description;
};

export default TicketCard;
