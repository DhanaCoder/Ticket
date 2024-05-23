"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

const DeleteBlock = ({ id }) => {
  const router = useRouter();

  const deleteTicket = async () => {
    const res = await fetch(`http://localhost:3000/api/Tickets/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div
      className="rounded-lg border border-black-500 p-1 hover:bg-red-400"
      onClick={deleteTicket}
      style={{ display: "inline-block" }}
    >
      <FontAwesomeIcon icon={faTrash} />
    </div>
  );
};

export default DeleteBlock;
