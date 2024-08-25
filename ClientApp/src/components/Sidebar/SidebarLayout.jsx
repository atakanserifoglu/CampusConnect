import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./../Navbar/Navbar";

const SidebarLayout = () => (
  <>
    <Navbar />
    <Sidebar>
      <Outlet />
    </Sidebar>
  </>
);

export default SidebarLayout;