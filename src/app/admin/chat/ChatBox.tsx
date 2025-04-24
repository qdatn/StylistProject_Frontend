import React, { useState } from "react";
import { Phone, Video } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";


import { UserAccount } from "@src/types/UserAccount";

interface ChatBoxProps {
    user: UserAccount | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const handleDelete = () => {
        // Your logic to delete the message
        setShowPopup(false);  // Close the pop-up after deleting
    };
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-200 text-lg">
                Choose someone to start messaging
            </div>
        );
    }

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages((prev) => [...prev, message]);
        setMessage("");
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-200 relative ml-2 rounded-sm">
            <div className="rouded-md">

            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm rounded-t-sm">
                <div className="flex items-center gap-2">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <h2 className="font-semibold text-lg">{user.name}</h2>
                </div>
                <div className="flex gap-4 text-gray-600">
                    {/* <Phone />
                    <Video /> */}
                    <button
                        className="flex items-center space-x-2 hover:text-gray-800"
                        onClick={() => setShowPopup(!showPopup)}
                    >
                        <p className="text-sm">Delete message</p>
                        <IoTrashOutline className="text-2xl" />
                    </button>
                    {showPopup && (
                        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 border w-40">
                            <p className="text-sm">Are you sure you want to delete?</p>
                            <div className="mt-2 flex justify-between">
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 text-sm hover:text-red-700">
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-500 text-sm hover:text-gray-700">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className="bg-white max-w-[70%] p-3 rounded-lg shadow text-sm self-end ml-auto"
                    >
                        {msg}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex items-center p-4 border-t bg-white gap-2 rounded-b-sm">
                <input
                    type="text"
                    placeholder="Enter message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border rounded-lg px-4 py-2 outline-none"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div >
    );
};

export default ChatBox;
