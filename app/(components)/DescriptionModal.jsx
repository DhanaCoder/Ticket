import React from "react";
import Linkify from "react-linkify";

const DescriptionModal = ({ description, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="whitespace-pre-wrap text-gray-800 mb-4">
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
            {description}
          </Linkify>
        </p>
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
