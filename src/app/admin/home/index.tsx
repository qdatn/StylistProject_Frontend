import Sidebar from "@layouts/admin-layout/leftSideBar";
import DashboardPage from "./Dashboard";
export default function AdminHome() {
  return (

    <div>
      <DashboardPage startDate={new Date} endDate={new Date} />
    </div>
  );
}
