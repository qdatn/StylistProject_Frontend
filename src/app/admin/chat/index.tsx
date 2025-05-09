import React, { useState } from "react";
import { MessageSquare, Star, Settings } from "lucide-react";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import { UserAccount } from "@src/types/UserAccount"; // nhớ import interface

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

    return (
        <div className="flex h-[82vh] w-full">
            {/* Chat list */}
            <ChatList onSelectUser={setSelectedUser} />
            {/* Chat Box */}
            <ChatBox user={selectedUser} />
        </div>
    );
};

export default ChatPage;
