import React, { useState } from "react";
import GestureCamera from "./components/GestureCamera";

export default function GestureDemo() {
  const [gesture, setGesture] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleGesture = (g) => setGesture(g);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // 👇 send gesture + text to backend
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, gesture }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">EmpathAI — Gesture-Aware Chatbot</h1>

      {/* camera and gesture detector */}
      <GestureCamera onGestureDetected={handleGesture} />
      <p className="text-lg mt-2">
        Current gesture: <b>{gesture || "None"}</b>
      </p>

      {/* chat window */}
      <div className="border rounded-lg p-4 w-full max-w-md h-64 overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-1 ${
              m.role === "user" ? "text-blue-600" : "text-green-700"
            }`}
          >
            <b>{m.role === "user" ? "You" : "EmpathAI"}:</b> {m.content}
          </div>
        ))}
      </div>

      {/* message input */}
      <div className="flex gap-2 w-full max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}