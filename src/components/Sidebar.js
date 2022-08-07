import React, { useEffect, useRef, useState } from "react";
import { Divider } from "rsuite";
import CreateRoomBtnModal from "./dashboard/CreateRoomBtnModal";
import DashBoardToggle from "./dashboard/DashBoardToggle";
import ChatRoomList from "./rooms/ChatRoomList";

const Sidebar = () => {
  const topSideBarRef = useRef(null);
  const [height, setheight] = useState(0)
  useEffect(()=>{
    if(topSideBarRef.current){
      setheight(topSideBarRef.current.scrollHeight)
    }
  },[topSideBarRef])
  return (
    <div className="h-100 pt-2">
      <div ref={topSideBarRef}>
        <DashBoardToggle />
        <CreateRoomBtnModal />
        <Divider>Join conversation</Divider>
      </div>
        <ChatRoomList aboveElementHeight={height} />
    </div>
  );
};

export default Sidebar;
