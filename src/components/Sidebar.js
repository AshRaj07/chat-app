import React from "react";
import CreateRoomBtnModal from "./dashboard/CreateRoomBtnModal";
import DashBoardToggle from "./dashboard/DashBoardToggle";

const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashBoardToggle />
        <CreateRoomBtnModal />
      </div>
    </div>
  );
};

export default Sidebar;
