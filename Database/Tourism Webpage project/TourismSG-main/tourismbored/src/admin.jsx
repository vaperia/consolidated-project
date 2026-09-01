// src/admin.jsx
import React, { useState, useEffect } from "react";
import Header from "./header";

export default function Admin() {
    const [tab, setTab] = useState("concerts");
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Fetch Data
    const fetchData = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/${tab}`);
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tab]);

    // ✅ Upload Image
    const uploadImage = async () => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "name",
            editData?.name ||
            editData?.hotel_name ||
            editData?.restaurant_name ||
            editData?.attraction_name ||
            "Unnamed"
        );

        try {
            const res = await fetch(`http://localhost:5000/api/upload/${tab}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!data.url) throw new Error("No URL returned from server");
            return data.url;
        } catch (err) {
            console.error("Upload error:", err);
            throw err;
        }
    };

    // ✅ Save Changes
    const handleSave = async () => {
        if (!editData) return;
        setLoading(true);
        try {
            let image_url = editData.image_url || "";
            if (file) {
                const url = await uploadImage();
                if (url) image_url = url;
            }

            const updatedData = { ...editData, image_url };
            delete updatedData.imageUrl;

            const idField =
                editData.concert_id ||
                editData.hotel_id ||
                editData.attraction_id ||
                editData.food_id;

            const res = await fetch(`http://localhost:5000/api/${tab}/${idField}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Failed to update database");

            setMessage("✅ Entry updated successfully!");
            setEditingId(null);
            setFile(null);
            fetchData();
        } catch (err) {
            console.error("Save error:", err);
            setMessage("❌ Failed to update data.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete Entry
    const handleDelete = async (item) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${item.name ||
                item.hotel_name ||
                item.restaurant_name ||
                item.attraction_name
                }"?`
            )
        )
            return;

        setLoading(true);
        try {
            const idField =
                item.concert_id ||
                item.hotel_id ||
                item.attraction_id ||
                item.food_id;

            const res = await fetch(
                `http://localhost:5000/api/${tab}/${idField}/delete`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete entry");

            setMessage("✅ Entry deleted successfully!");
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            setMessage("❌ Failed to delete entry.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Floating Scrollbar Sync
    useEffect(() => {
        const mainScroll = document.getElementById("scroll-container");
        const cloneScroll = document.getElementById("scrollbar-clone");
        const cloneContent = document.getElementById("scrollbar-content");

        if (mainScroll && cloneScroll && cloneContent) {
            cloneContent.style.width = mainScroll.scrollWidth + "px";

            const syncMain = () => {
                cloneScroll.scrollLeft = mainScroll.scrollLeft;
            };
            const syncClone = () => {
                mainScroll.scrollLeft = cloneScroll.scrollLeft;
            };

            mainScroll.addEventListener("scroll", syncMain);
            cloneScroll.addEventListener("scroll", syncClone);

            return () => {
                mainScroll.removeEventListener("scroll", syncMain);
                cloneScroll.removeEventListener("scroll", syncClone);
            };
        }
    }, [data]);

    return (
        <div className="min-h-screen bg-blue-100">
            <Header />

            <div className="pt-24 p-6 ml-16"> {/* Added ml-16 for left margin */}
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
                    Admin Management Panel
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {["concerts", "hotels", "attractions", "foodplaces"].map((t) => (
                        <button
                            key={t}
                            onClick={() => {
                                setTab(t);
                                setEditingId(null);
                                setMessage("");
                            }}
                            className={`px-5 py-2 rounded-full font-medium shadow-md ${tab === t
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-blue-800 border border-blue-300"
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="relative mb-8">
                    <div
                        id="scroll-container"
                        className="w-full overflow-x-auto pb-4"
                        style={{ scrollbarWidth: "none" }}
                    >
                        <div className="w-full inline-block align-middle">
                            <table className="w-full min-w-full bg-white border border-gray-300 rounded-xl shadow-md">
                                <thead className="bg-blue-200 text-blue-900 sticky top-0 z-10">
                                    <tr>
                                        {data.length > 0 &&
                                            Object.keys(data[0]).map((key) => (
                                                <th
                                                    key={key}
                                                    className="p-2 border border-gray-300 whitespace-nowrap text-sm"
                                                >
                                                    {key}
                                                </th>
                                            ))}
                                        <th className="p-2 border border-gray-300 text-sm">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((item, idx) => (
                                        <React.Fragment
                                            key={
                                                item.concert_id ||
                                                item.hotel_id ||
                                                item.attraction_id ||
                                                item.food_id ||
                                                idx
                                            }
                                        >
                                            {/* Display Row */}
                                            <tr
                                                className={`transition ${editingId === idx ? "bg-blue-50" : "hover:bg-blue-50"
                                                    }`}
                                            >
                                                {Object.entries(item).map(([key, value]) => (
                                                    <td
                                                        key={key}
                                                        className="p-2 border border-gray-300 text-sm max-w-[250px] truncate"
                                                        title={String(value)}
                                                    >
                                                        {String(value)}
                                                    </td>
                                                ))}

                                                <td className="p-2 border border-gray-300 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => {
                                                            if (editingId === idx) {
                                                                setEditingId(null);
                                                                setEditData(null);
                                                            } else {
                                                                setEditingId(idx);
                                                                setEditData(item);
                                                                setFile(null);
                                                            }
                                                        }}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mx-1"
                                                    >
                                                        {editingId === idx ? "Close" : "Edit"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mx-1"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Edit Row */}
                                            {editingId === idx && editData && (
                                                <tr className="bg-blue-50 border-t border-blue-200">
                                                    <td colSpan={Object.keys(item).length + 1}>
                                                        <div className="p-4 space-y-3">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {Object.keys(editData).map((key) => {
                                                                    if (key.endsWith("_id")) return null;
                                                                    const value = editData[key] ?? "";
                                                                    return (
                                                                        <div key={key}>
                                                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                                                {key.replaceAll("_", " ")}
                                                                            </label>
                                                                            <textarea
                                                                                value={value}
                                                                                onChange={(e) =>
                                                                                    setEditData({
                                                                                        ...editData,
                                                                                        [key]: e.target.value,
                                                                                    })
                                                                                }
                                                                                className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-16"
                                                                                maxLength={250}
                                                                            />
                                                                            <p className="text-xs text-gray-500 text-right">
                                                                                {value.length}/250 characters
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Image Upload */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Upload Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) =>
                                                                        setFile(e.target.files[0])
                                                                    }
                                                                    className="block w-full text-sm"
                                                                />
                                                                {editData.image_url && (
                                                                    <img
                                                                        src={editData.image_url}
                                                                        alt="Preview"
                                                                        className="mt-3 w-48 h-32 object-cover rounded border"
                                                                    />
                                                                )}
                                                            </div>

                                                            {/* Save / Cancel */}
                                                            <div className="flex justify-end gap-3 mt-4">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingId(null);
                                                                        setEditData(null);
                                                                    }}
                                                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleSave}
                                                                    disabled={loading}
                                                                    className={`px-4 py-2 rounded text-white ${loading
                                                                            ? "bg-green-300"
                                                                            : "bg-green-600 hover:bg-green-700"
                                                                        }`}
                                                                >
                                                                    {loading ? "Saving..." : "Save Changes"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Floating Scrollbar */}
                <div
                    id="scrollbar-clone"
                    className="fixed bottom-0 left-0 w-full h-5 overflow-x-auto bg-blue-100 border-t border-blue-300 z-50"
                    style={{ scrollbarColor: "#3b82f6 #e0f2fe" }}
                >
                    <div id="scrollbar-content" style={{ width: "3000px" }}></div>
                </div>

                {data.length === 0 && (
                    <p className="text-gray-600 mt-4 text-center">
                        No entries found for {tab}.
                    </p>
                )}

                {message && (
                    <p
                        className={`mt-6 text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
