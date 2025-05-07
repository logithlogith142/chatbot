import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function Sidebar({
  chats,
  currentChatId,
  onSelect,
  onDelete,
  onNewChat,
  formatDate,
}) {
  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="m-0">Chats</h5>
        <button className="btn btn-sm btn-primary" onClick={onNewChat}>
          <FaPlus />
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {chats.length === 0 ? (
          <div className="text-muted text-center mt-4">No chats yet</div>
        ) : (
          <div className="list-group">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`list-group-item list-group-item-action ${
                  chat.id === currentChatId ? "active" : ""
                } d-flex justify-content-between align-items-center`}
                style={{ cursor: "pointer" }}
              >
                <div onClick={() => onSelect(chat)} style={{ flexGrow: 1 }}>
                  <div className="fw-bold">
                    {chat.title.length > 20
                      ? chat.title.slice(0, 20) + "..."
                      : chat.title}
                  </div>
                  <div className="small text-muted">
                    {formatDate(chat.createdAt)}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
