import AdminHeader from "@layouts/admin-layout/header";
import ScrollToTopButton from "@components/ScrollToTopButton";
import { Outlet } from "react-router-dom";
import Sidebar from "./leftSideBar";
export function AdminLayout() {
    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex flex-col flex-1 w-full">
                    {/* Header - Thay đổi header ở layouts/main-header/header */}
                    < AdminHeader />

                    {/* Nội dung return về ở page sẽ truyền vào children ở layout này */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        {/* Outlet sẽ render các page con */}
                        <Outlet />
                    </div>
                </div>
                {/* Button click to back to top page */}
                <ScrollToTopButton />
            </div>
        </>
    );
}