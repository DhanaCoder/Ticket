import React, { useState, useEffect } from 'react';

const CommentModal = ({ ticketId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${ticketId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [ticketId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/comments/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const newComment = await res.json();
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-2">Comments</h2>
        <div className="mb-4 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment._id} className="mb-2 border-b border-gray-300 pb-2">
              <p className="text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full border border-gray-300 p-2 rounded mb-2"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end">
            <button type="button" className="mr-2 text-sm text-gray-500" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="text-sm text-blue-600">
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
