import React, { useState, useEffect } from "react";
import axios from "axios";
import Request from "./req.js";
import Sidebar from "./his.js";
import Login from "./intro.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function App() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn && location.pathname !== "/") {
      navigate("/");
    }
  }, [loggedIn, location.pathname, navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:3500/chats");
        setChats(res.data);
        if (res.data.length > 0) {
          setCurrentChat(res.data[res.data.length - 1]);
        }
      } catch (err) {
        setError("Failed to load chats. Is the server running?");
        toast.error("Failed to load chats!");
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn) fetchChats();
  }, [loggedIn]);

  const handleNewChat = async () => {
    try {
      const newChat = {
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
      };
      const res = await axios.post("http://localhost:3500/chats", newChat);
      setChats((prev) => [...prev, res.data]);
      setCurrentChat(res.data);
      toast.success("New chat created!");
    } catch (err) {
      setError("Failed to create new chat");
      toast.error("Failed to create new chat!");
    }
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleSaveMessage = async (req, res) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages: [
        ...currentChat.messages,
        { req, res, createdAt: new Date().toISOString() },
      ],
      title:
        currentChat.title === "New Chat" && currentChat.messages.length === 0
          ? req.slice(0, 30) + (req.length > 30 ? "..." : "")
          : currentChat.title,
    };

    try {
      await axios.put(
        `http://localhost:3500/chats/${currentChat.id}`,
        updatedChat
      );
      setCurrentChat(updatedChat);
      setChats((prev) =>
        prev.map((c) => (c.id === currentChat.id ? updatedChat : c))
      );
    } catch (err) {
      toast.error("Failed to save message!");
    }
  };

  const handleDeleteChat = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/chats/${id}`);
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      if (currentChat?.id === id) setCurrentChat(null);
      toast.success("Chat deleted!");
    } catch (err) {
      toast.error("Failed to delete chat!");
    }
  };

  if (loading && loggedIn)
    return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0 ">
      {loggedIn ? (
        <>
          {/* Navbar */}
          <nav className="navbar bg-body-tertiary sticky-top bg-primary">
            <div className="container-fluid">
              <div>
                <button
                  className="btn btn-outline-primary d-md-none"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  ☰
                </button>
                <button
                  className="btn btn-sm btn-primary ms-2"
                  onClick={handleNewChat}
                >
                  <FaPlus />
                </button>
              </div>
              <span
                className="navbar-brand mb-0 h1 text-primary "
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                Angloo Ai
              </span>
            </div>
          </nav>

          <div
            className="d-flex flex-grow-1 overflow-hidden"
            style={{ marginTop: "56px" }}
          >
            {/* Sidebar */}
            <div
              className={`sidebar bg-light border-end h-100 ${
                sidebarOpen ? "open" : ""
              } d-md-block`}
            >
              <Sidebar
                chats={chats}
                currentChatId={currentChat?.id}
                onSelect={handleSelectChat}
                onDelete={handleDeleteChat}
                onNewChat={handleNewChat}
                formatDate={(date) => new Date(date).toLocaleString()}
              />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column p-0 overflow-auto">
              <Request chat={currentChat} onSave={handleSaveMessage} />
            </div>
          </div>
        </>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
