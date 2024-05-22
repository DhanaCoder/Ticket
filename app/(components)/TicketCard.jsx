import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusDisplay from "./StatusDisplay";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import Linkify from "react-linkify";
import Link from "next/link";
import DescriptionModal from "./DescriptionModal";

const TicketCard = ({ ticket }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await fetch(
          `https://api.rekonsys.tech/auth/users?email=${ticket.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        const user = data.find((user) => user.email === ticket.email);
        if (user) {
          setDepartment(user.department);
        } else {
          throw new Error("User not found");
        }
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

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const truncateDescription = (description) => {
    const maxLength = 25;
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  return (
    <>
      <div className="relative w-72 h-96 overflow-hidden bg-white shadow-lg border-t-4 my-2 border-b-4 border-black rounded-lg transition-transform duration-500 transform hover:-translate-y-2 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 z-0 rounded-lg"></div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between text-black font-medium text-base p-4">
          <div className="w-full text-left">
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
          </div>
          <div className="text-center mb-3">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              {ticket.title}
            </h4>
            <hr className="border-t border-gray-200" />
            <p className="whitespace-pre-wrap text-gray-800">
              <Linkify
                componentDecorator={(href, text, key) => (
                  <a
                    href={href}
                    key={key}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                )}
              >
                {truncateDescription(ticket.description)}
              </Linkify>
            </p>
          </div>

          <div className="w-full flex items-center justify-between mb-2">
            <PriorityDisplay priority={ticket.priority} />
            {session && (session.user.email === ticket.email || isAdmin) && (
              <DeleteBlock id={ticket._id} />
            )}
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">{createdDateTime}</p>
              <ProgressDisplay progress={ticket.progress} />
            </div>
            <StatusDisplay status={ticket.status} />
          </div>

          {ticket.status === "done" && ticket.doneBy && (
            <p className="text-sm text-green-600 font-bold mt-2">
              Done by: {ticket.doneBy.email}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <button
              className="text-sm text-blue-600 font-bold cursor-pointer"
              onClick={handleToggleModal}
            >
              View Description
            </button>
            {ticket._id && ticket.status !== "done" && ( // Check if ticket status is not "done"
              <Link href={`/TicketPage/${ticket._id}`}>
                <span className="text-sm text-blue-600 font-bold cursor-pointer">
                  Edit
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <DescriptionModal
          description={ticket.description}
          onClose={handleToggleModal}
        />
      )}
    </>
  );
};

export default TicketCard;
