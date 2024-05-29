"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteBlock = ({ id }) => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const deleteTicket = async () => {
    try {
      const res = await fetch(`/api/Tickets/${id}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete ticket");

      router.refresh("/dashboard");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    await deleteTicket();
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const ConfirmModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this ticket?</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded mr-2"
            onClick={cancelDelete}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            onClick={confirmDelete}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "inline-block" }}>
      <div
        className="rounded-lg border border-black-500 p-1 hover:bg-red-400"
        onClick={handleDeleteClick}
      >
        <FontAwesomeIcon icon={faTrash} />
      </div>

      {showConfirmModal && createPortal(<ConfirmModal />, document.body)}
      <ToastContainer />
    </div>
  );
};

export default DeleteBlock;
