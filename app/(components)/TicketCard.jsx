import { useSession } from "next-auth/react";
import StatusDisplay from "./StatusDisplay";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import Link from "next/link";

const TicketCard = ({ ticket }) => {
  const { data: session } = useSession();

  function formatTimestamp(timestamp) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  }

  const createdDateTime = formatTimestamp(ticket.createdAt);

  return (
    <div className="flex flex-col border-2 border-green-500 bg-white rounded-md shadow-lg p-4 m-2 hover:shadow-xl transition-shadow duration-300">
      <div className="flex mb-3">
        <PriorityDisplay priority={ticket.priority} />
        <div className="ml-auto">
          <DeleteBlock id={ticket._id} />
        </div>
      </div>
      <Link href={`/TicketPage/${ticket._id}`} style={{ display: "contents" }}>
        <h4 className="mb-1 font-semibold text-lg text-gray-800">{ticket.title}</h4>
        <hr className="h-px border-0 bg-gray-900 mb-2"></hr>
        <p className="whitespace-pre-wrap text-gray-700">{ticket.description}</p>

        <div className="flex-grow"></div>
        <div className="flex mt-2">
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
        <div className="mt-2 text-sm text-gray-600">
          <span>Done by: </span>
          <span className="font-semibold">{ticket.email}</span>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
