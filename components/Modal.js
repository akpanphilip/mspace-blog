import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  content,
  setTitle,
  setContent,
  updateId,
  onUpdate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-8 z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <h1
          class="text-base font-semibold text-2xl leading-6 text-gray-900 mb-4"
          id="modal-title"
        >
          {updateId ? "Update Post" : "Add Post"}
        </h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button
          onClick={updateId ? onUpdate : onSubmit}
          className="bg-black text-white py-2 px-4 rounded w-full"
        >
          {updateId ? "Update Post" : "Add Post"}
        </button>
      </div>
    </div>
  );
};

export default Modal;
