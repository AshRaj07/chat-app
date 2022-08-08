import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helper';
import MessageItem from './MessageItem';

const Messages = () => {
    const {chatId} = useParams();
    const [messages, setmessages] = useState(null)
    const isChatEmpty = messages && messages.length===0;
    const canShowMsg = messages && messages.length>0

    useEffect(()=>{
        const msgRef = database.ref('messages');

        msgRef.orderByChild('roomId').equalTo(chatId).on('value',snap => {
            const data = transformToArrWithId(snap.val())
            setmessages(data)
        })
        return () => {
            msgRef.off('value')
        }
    },[chatId])
  return (
    <ul style={{'list-style':'none'}}>
        {isChatEmpty&&<li>No messages yet</li>}
        {canShowMsg&&messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  )
}

export default Messages