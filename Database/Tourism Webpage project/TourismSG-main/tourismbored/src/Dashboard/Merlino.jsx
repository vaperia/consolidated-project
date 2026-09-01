// src/Dashboard/Merlino.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MoreVertical, Trash2 } from "lucide-react";
import { useAuth } from "../AuthContext.jsx"; // ✅ NEW

export default function Merlino() {
  const [sidebarWidth, setSidebarWidth] = useState(224);
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const { isLoggedIn } = useAuth(); // ✅ Detect login
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = isLoggedIn ? user?.user_id : null; // ✅ null if guest

  // 🧭 Load saved chat session
  useEffect(() => {
    const savedChatId = localStorage.getItem("merlino_chat_id");
    if (savedChatId && !selectedChat && isLoggedIn) {
      const ref = doc(db, "chatlogs", savedChatId);
      onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setSelectedChat({ id: docSnap.id, ...docSnap.data() });
          setChatHistory(docSnap.data().messages || []);
        }
      });
    }
  }, []);

  // 🔹 Listen to sidebar toggle
  useEffect(() => {
    const handleSidebarToggle = (e) => setSidebarWidth(e.detail.width);
    window.addEventListener("dashboardSidebarToggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("dashboardSidebarToggle", handleSidebarToggle);
  }, []);

  // 🔹 Fetch chat logs (real-time)
  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    const q = query(collection(db, "chatlogs"), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      logs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setChatLogs(logs);
    });
    return () => unsub();
  }, [userId, isLoggedIn]);

  // 🔹 Sync selected chat
  useEffect(() => {
    if (selectedChat) setChatHistory(selectedChat.messages || []);
    else setChatHistory([]);
  }, [selectedChat]);

  // 🧠 Send message
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessage("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, userId }),
      });

      const data = await response.json();
      const aiReply = data.reply || "🤔 No reply from AI.";

      // 🚫 Guest users — do not save to Firestore
      if (!isLoggedIn || !userId) {
        console.log("⚠️ Guest mode: skipping Firestore save");
        setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
        setLoading(false);
        return;
      }

      let chatId = selectedChat?.id || localStorage.getItem("merlino_chat_id");

      // 🧠 Create chat if not exist
      if (!chatId) {
        const docRef = await addDoc(collection(db, "chatlogs"), {
          userId,
          title: userMsg.slice(0, 40) || "New Chat",
          messages: [],
          createdAt: serverTimestamp(),
        });
        chatId = docRef.id;
        localStorage.setItem("merlino_chat_id", chatId);
        const newChat = {
          id: chatId,
          title: userMsg.slice(0, 40),
          messages: [{ sender: "user", text: userMsg }],
        };
        setSelectedChat(newChat);
        setChatHistory([{ sender: "user", text: userMsg }]);
      }

      // ✅ Append both messages to Firestore
      const ref = doc(db, "chatlogs", chatId);
      await updateDoc(ref, {
        messages: arrayUnion(
          { sender: "user", text: userMsg, createdAt: Timestamp.now() },
          { sender: "ai", text: aiReply, createdAt: Timestamp.now() }
        ),
      });

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Server error, please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete chat
  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Delete this chat?")) return;
    try {
      await deleteDoc(doc(db, "chatlogs", chatId));
      setChatLogs((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        localStorage.removeItem("merlino_chat_id");
        setChatHistory([]);
      }
      setMenuOpenId(null);
    } catch (err) {
      console.error("Failed to delete chat:", err);
      alert("Failed to delete chat. Check console for details.");
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem("merlino_chat_id");
    setSelectedChat(null);
    setChatHistory([]);
  };

  return (
    <div
      className="fixed top-16 right-0 bottom-0 flex bg-gray-50 transition-all duration-300"
      style={{ left: `${sidebarWidth}px` }}
    >
      {/* === Chat Sidebar === */}
      <div className="w-72 bg-blue-900 text-white flex flex-col border-r border-blue-800">
        <div className="p-4 text-lg font-bold border-b border-blue-700 flex items-center gap-2">
          💬 Merlino
        </div>

        {/* Guest notice */}
        {!isLoggedIn && (
          <div className="bg-yellow-100 text-yellow-900 text-xs text-center py-2 border-b border-yellow-400">
            ⚠️ Guest mode — chats are not saved
          </div>
        )}

        <div className="flex-1 overflow-y-auto relative">
          {isLoggedIn && chatLogs.length > 0 ? (
            chatLogs.map((chat) => (
              <div
                key={chat.id}
                className={`relative px-4 py-3 text-sm cursor-pointer border-b border-blue-800 hover:bg-blue-800 transition ${
                  selectedChat?.id === chat.id ? "bg-blue-800" : ""
                }`}
                onClick={(e) => {
                  if (e.target.closest(".menu-button")) return;
                  setSelectedChat(chat);
                  localStorage.setItem("merlino_chat_id", chat.id);
                }}
              >
                <span className="block truncate pr-6">
                  {chat.title || "Untitled Chat"}
                </span>

                <button
                  className="menu-button absolute top-3 right-3 text-gray-300 hover:text-white"
                  onClick={() =>
                    setMenuOpenId((prev) => (prev === chat.id ? null : chat.id))
                  }
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpenId === chat.id && (
                  <div className="absolute top-8 right-3 bg-white text-gray-800 border rounded-md shadow-lg w-28 z-50">
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-sm p-4">
              {isLoggedIn
                ? "No previous conversations yet."
                : "Start chatting below!"}
            </p>
          )}
        </div>

        {isLoggedIn && (
          <div className="p-3 border-t border-blue-800">
            <button
              onClick={handleNewChat}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-semibold"
            >
              + New Chat
            </button>
          </div>
        )}
      </div>

      {/* === Chat Window === */}
      <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {chatHistory.length === 0 && !loading ? (
            <div className="text-gray-400 text-center mt-20 italic">
              Start a conversation with Merlino 👋
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-900 mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
          {loading && (
            <div className="text-gray-500 bg-gray-100 w-fit px-3 py-2 rounded-md">
              Thinking...
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Merlino anything about Singapore..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
