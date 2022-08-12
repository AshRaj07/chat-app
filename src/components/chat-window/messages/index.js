import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Alert } from "rsuite";
import { auth, database } from "../../../misc/firebase";
import { transformToArrWithId } from "../../../misc/helper";
import MessageItem from "./MessageItem";

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setmessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMsg = messages && messages.length > 0;

  useEffect(() => {
    const msgRef = database.ref("messages");

    msgRef
      .orderByChild("roomId")
      .equalTo(chatId)
      .on("value", (snap) => {
        const data = transformToArrWithId(snap.val());
        setmessages(data);
      });
    return () => {
      msgRef.off("value");
    };
  }, [chatId]);

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
    async (msgId) => {
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
        Alert.error(error.message, 4000);
      }
    },
    [chatId, messages]
  );

  return (
    <ul style={{ listStyle: "none" }}>
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMsg &&
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
