import React from "react";
import { Search } from "lucide-react";
import { UserAccount } from "@src/types/UserAccount";
import { mockUserAccounts } from "@src/types/UserAccount";

interface ChatListProps {
    onSelectUser: (user: UserAccount) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectUser }) => {
    return (
        <div className="w-72 bg-white p-4 border-r overflow-y-auto rounded-sm">
            <h2 className="text-lg font-bold mb-4">Messages</h2>

            <div className="relative mb-4">
                <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border rounded w-full text-sm"
                />
            </div>

            <div className="space-y-2">
                {mockUserAccounts.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h3 className="font-medium">{user.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
