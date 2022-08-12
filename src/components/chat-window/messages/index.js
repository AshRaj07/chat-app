import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Alert, Button } from "rsuite";
import { auth, database, storage } from "../../../misc/firebase";
import { groupBy, transformToArrWithId } from "../../../misc/helper";
import MessageItem from "./MessageItem";

const PAGE_SIZE = 15;
const msgRef = database.ref("messages");

function shouldScrollToBottom(node,threshold = 30) {
  const percentage = (100*node.scrollTop)/(node.scrollHeight-node.clientHeight)||0

  return percentage>threshold
}

const Messages = () => {
  const selfRef = useRef()
  const { chatId } = useParams();
  const [messages, setmessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMsg = messages && messages.length > 0;
  const [limit, setlimit] = useState(PAGE_SIZE)
  
  const loadMessages = useCallback((limitToLast)=>{

    const node = selfRef.current;
    msgRef.off();

    msgRef
    .orderByChild("roomId")
    .equalTo(chatId)
    .limitToLast(limitToLast||PAGE_SIZE)
    .on("value", (snap) => {
      const data = transformToArrWithId(snap.val());
      setmessages(data);
      if(shouldScrollToBottom(node)){
        node.scrollTop=node.scrollHeight;
      }
    });
    setlimit(p=>p+PAGE_SIZE)
  },[chatId])

  const onLoadMore = useCallback(()=>{
    const node = selfRef.current;
    const oldnode = node.scrollHeight
    loadMessages(limit)
    setTimeout(()=>{
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldnode;
    },200)
  },[limit, loadMessages])
  
  useEffect(() => {
    const node = selfRef.current;
    loadMessages()
    setTimeout(()=>{
      node.scrollTop = node.scrollHeight;
    },200)
    return () => {
      msgRef.off("value");
    };
  }, [chatId,loadMessages]);

  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = "Admin permission Revoked";
          } else {
            admins[uid] = true;
            alertMsg = "Admin permission Granted";
          }
          return admins;
        }
      });
      Alert.info(alertMsg, 2000);
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const msgRef = database.ref(`/messages/${msgId}`);
    let alertMsg;
    await msgRef.transaction((msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = "Like removed";
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = "Liked";
        }
        return msg;
      }
    });
    Alert.info(alertMsg, 2000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm("Delete this message?")) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info("Message has been deleted", 4000);
      } catch (error) {
        return Alert.error(error.message, 4000);
      }
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessage = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );
      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll" style={{ listStyle: "none" }}>
      {messages&&messages.length>=PAGE_SIZE&&(
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMsg && renderMessage()}
    </ul>
  );
};

export default Messages;
