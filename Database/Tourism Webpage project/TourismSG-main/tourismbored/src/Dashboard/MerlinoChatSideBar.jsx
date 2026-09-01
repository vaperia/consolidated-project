import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MoreVertical, Trash2 } from "lucide-react";

export default function ChatSidebar({ selectedChat, onSelect, sidebarExpanded }) {
  const [chatLogs, setChatLogs] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Adjust offset depending on your dashboard sidebar width
  const dashboardSidebarWidth = sidebarExpanded ? 224 : 64;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id || "guest";

    const q = query(
      collection(db, "chatlogs"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatLogs(logs);
    });

    return () => unsubscribe();
  }, []);

  // 🗑️ Delete chat from Firestore + update local state
  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Delete this chat?")) return;
    try {
      await deleteDoc(doc(db, "chatlogs", chatId));
      setChatLogs((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChat?.id === chatId) onSelect(null);
    } catch (err) {
      console.error("Failed to delete chat:", err);
      alert("Failed to delete chat. Check console for details.");
    }
  };

  return (
    <div
      className="fixed top-16 bottom-0 bg-white border-r shadow-sm flex flex-col transition-all duration-300"
      style={{
        left: `${dashboardSidebarWidth}px`,
        width: "320px",
      }}
    >
      <div className="p-4 border-b bg-indigo-700 text-white">
        <h2 className="text-xl font-bold">Chat Logs 💬</h2>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {chatLogs.length === 0 && (
          <p className="text-gray-400 p-6 text-center">
            No previous conversations yet.
          </p>
        )}

        {chatLogs.map((chat) => (
          <div
            key={chat.id}
            className={`relative p-4 cursor-pointer border-b hover:bg-indigo-50 transition ${
              selectedChat?.id === chat.id ? "bg-indigo-100" : ""
            }`}
            onClick={(e) => {
              // avoid selecting when clicking the menu button
              if (e.target.closest(".menu-button")) return;
              onSelect(chat);
            }}
          >
            {/* Chat info */}
            <h3 className="font-semibold text-indigo-700 truncate pr-6">
              {chat.title || "Untitled Chat"}
            </h3>
            <p className="text-gray-600 text-sm truncate">
              {chat.messages?.[0]?.text || "No messages yet"}
            </p>
            <span className="text-xs text-gray-400">
              {chat.createdAt?.toDate
                ? chat.createdAt.toDate().toLocaleString()
                : ""}
            </span>

            {/* ⋯ menu button */}
            <button
              className="menu-button absolute top-3 right-3 text-gray-500 hover:text-indigo-700"
              onClick={() =>
                setMenuOpenId((prev) => (prev === chat.id ? null : chat.id))
              }
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown menu */}
            {menuOpenId === chat.id && (
              <div className="absolute top-8 right-3 bg-white border rounded-md shadow-lg w-28 z-50">
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={() => onSelect(null)}
          className="w-full bg-indigo-700 text-white font-medium py-2 rounded-md hover:bg-indigo-800 transition"
        >
          ➕ New Chat
        </button>
      </div>
    </div>
  );
}
