import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#FFF3DF]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
          <Header />
      <main className="flex-1 bg-[#FFF3DF]">
        <Outlet />
      </main>
    </div>
    </div>
  );
}

export default AppLayout;