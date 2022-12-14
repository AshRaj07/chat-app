import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader, Nav } from "rsuite";
import { useRooms } from "../../context/rooms.context";
import RoomItem from "./RoomItem";

const ChatRoomList = ({aboveElementHeight}) => {
    const room = useRooms()
    const location = useLocation()
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{height:`calc(100% - ${aboveElementHeight}px)`}}
      activeKey={location.pathname}
    >
        {!room&&<Loader center speed='fast' />}
        {room&&room.length>0&&room.map((room) => 
      <Nav.Item componentClass={Link} to={`/chat/${room.id}`} key={room.id}
      eventKey={`/chat/${room.id}`}>
      <RoomItem room={room} />
    </Nav.Item>
        )}

    </Nav>
  );
};

export default ChatRoomList;
