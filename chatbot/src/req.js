import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import Markdown from "react-markdown";

export default function Request({ chat, onSave }) {
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [temporaryResponse, setTemporaryResponse] = useState(null);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || !chat || isResponding) return;

    const userMessage = input;
    setInput("");
    setIsResponding(true);

    // Show thinking indicator
    setTemporaryResponse({
      req: userMessage,
      res: "Thinking...",
      createdAt: new Date().toISOString(),
    });

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key not configured");

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );

      const botResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!botResponse) throw new Error("No response from Gemini");

      // Save the actual response
      await onSave(userMessage, botResponse);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to get response";
      await onSave(userMessage, `Error: ${errorMessage}`);
    } finally {
      setTemporaryResponse(null);
      setIsResponding(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, temporaryResponse]);

  // Combine actual messages with temporary response
  const displayMessages = temporaryResponse
    ? [...(chat?.messages || []), temporaryResponse]
    : chat?.messages || [];

  return (
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {!chat ? (
          <div className="text-muted text-center mt-5">
            <h1> Select a chat or start a new one!</h1>
          </div>
        ) : displayMessages.length > 0 ? (
          displayMessages.map((msg, idx) => (
            <div key={idx} className="mb-3">
              <div className="fw-bold text-primary">You:</div>
              <div className="border p-2 rounded bg-light">{msg.req}</div>
              <div className="fw-bold text-success mt-2">Angloo:</div>
              <div className="border p-2 rounded bg-white">
                {msg.res === "Thinking..." ? (
                  <div className="d-flex align-items-center">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></div>
                    Thinking...
                  </div>
                ) : (
                  <Markdown>{msg.res}</Markdown>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted text-center mt-5">
            <h1>Hi, ask something!</h1>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {chat && (
        <div className="border-top p-3 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={isResponding || !input.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}
