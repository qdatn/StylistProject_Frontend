import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "@layouts/main-layout/ChatBox";
import { UserAccount, mockUserAccounts } from "@src/types/UserAccount";

// Dữ liệu mock cho admin (người nhận tin nhắn)
const adminAccount: UserAccount = mockUserAccounts.find((acc: UserAccount) => acc.user.role === "admin")!;

const UserChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Icon mở chat */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 text-white"
                    
                >
                    <MessageCircle size={24} />
                </button>
            </div>

            {/* ChatBox */}
            {isOpen && (
                <div className="fixed bottom-6 right-20 w-80 h-[450px] z-50">
                    <ChatBox user={adminAccount} />
                </div>
            )}
        </>
    );
};

export default UserChatWidget;
