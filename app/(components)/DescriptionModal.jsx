import React from "react";
import Linkify from "react-linkify";

const DescriptionModal = ({ ticket, department, onClose }) => {
  const {
    title,
    description,
    priority,
    progress,
    status,
    category,
    email,
    assignedTo,
    createdAt,
    doneBy,
  } = ticket;

  const createdDateTime = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const updateDateTime = new Date(ticket.updatedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const truncateUrl = (url) => {
    const maxLength = 50;
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const renderAssignedTo = (assignedTo) => {
    return assignedTo.map((user, index) => (
      <span key={user.value}>
        {user.label} 
        {index < assignedTo.length - 1 && ", "}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-1 uppercase">
            {title}
          </h4>
          <p className="text-sm text-gray-900 mb-2">
            <strong>Description:</strong>
            <br />
            <Linkify
              componentDecorator={(href, text, key) => (
                <a
                  href={href}
                  key={key}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateUrl(text)}
                </a>
              )}
            >
              {description}
            </Linkify>
          </p>
          <p className="text-sm text-gray-900 mb-2">
            <strong>Priority:</strong> {priority}
            <br />
            <strong>Progress:</strong> {progress}%<br />
            <strong>Status:</strong> {status}
            <br />
            <strong>Project:</strong> {category}
            <br />
            <strong>Created By:</strong> {email}
            <br />
            <strong>Created Person Department:</strong> {department}
            <br />
            <strong>Assigned To:</strong> {renderAssignedTo(assignedTo)}
            <br />
            <strong>Created At:</strong> {createdDateTime}
            <br />
            <strong>Updated At:</strong> {updateDateTime}
          </p>
          {status === "solved" && doneBy && (
            <p className="text-sm text-green-600 font-bold">
              Done by: {doneBy.name} ({doneBy.email})
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DescriptionModal;
