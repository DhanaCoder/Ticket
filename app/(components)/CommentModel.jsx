import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommentModal = ({ ticket, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const ticketId = ticket._id;

  useEffect(() => {
    const fetchComments = async () => {
      if (!ticketId) {
        console.error("Ticket ID is undefined");
        return;
      }
      try {
        const res = await fetch(`/api/comments/${ticketId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [ticketId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!ticketId) {
      console.error("Ticket ID is undefined");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const newComment = await res.json();
      setComments([...comments, newComment]);
      setCommentText("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const commentId = commentToDelete;
    if (!ticketId || !commentId) {
      console.error("Ticket ID or Comment ID is undefined");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${ticketId}/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments(comments.filter((comment) => comment._id !== commentId));
      setShowConfirmModal(false);
      setCommentToDelete(null);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setCommentToDelete(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Comments</h2>
        <div className="mb-4 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="mb-2 border-b border-gray-300 pb-2 flex justify-between items-start"
            >
              <div>
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                className="rounded-lg border border-red-500 text-red-500 text-sm p-1 hover:bg-red-400"
                onClick={() => handleDeleteClick(comment._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex flex-col">
          <textarea
            placeholder="Enter your comment"
            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-blue-500 ml-2 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
            >
              Add Comment
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-bold text-gray-600 mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition ease-in-out duration-150"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md mt-4 ml-2 hover:bg-gray-600 transition ease-in-out duration-150"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentModal;
