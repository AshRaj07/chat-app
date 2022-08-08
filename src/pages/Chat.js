import React from "react";
import { useParams } from "react-router";
import { Loader } from "rsuite";
import ChatBottom from "../components/chat-window/bottom";
import Messages from "../components/chat-window/messages";
import ChatTop from "../components/chat-window/top";
import { CurrentRoomProvider } from "../context/current-room.context";
import { useRooms } from "../context/rooms.context";

const Chat = () => {
  const rooms = useRooms();
  const { chatId } = useParams();
  if (!rooms) {
    return <Loader center size="md" content="Loading..." speed="normal" />;
  }
  const currentRoom = rooms.find((room) => room.id === chatId);
  if (!currentRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }
  return (
    <CurrentRoomProvider data={{name:currentRoom.name,description:currentRoom.description}}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
