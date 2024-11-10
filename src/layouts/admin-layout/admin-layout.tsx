import AdminHeader from "@layouts/admin-layout/header";
import ScrollToTopButton from "@components/ScrollToTopButton";
import { Outlet } from "react-router-dom";
export function AdminLayout() {
    return (
      <>
        {/* Header - Thay đổi header ở layouts/main-header/header */}
        < AdminHeader/>
  
        {/* Nội dung return về ở page sẽ truyền vào children ở layout này */}
        <div className="mx-20">
          {/* Outlet sẽ render các page con */}
          <Outlet/>
        </div>
        {/* Button click to back to top page */}
        <ScrollToTopButton />
      </>
    );
  }