import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
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

    const handleAdmin = useCallback(async(uid)=>{
        const adminsRef = database.ref(`/rooms/${chatId}/admins`)
        let alertMsg;
        await adminsRef.transaction(admins=>{
            if(admins){
                if(admins[uid]){
                    admins[uid] = null;
                    alertMsg="Admin permission Revoked";
                }else{
                    admins[uid]=true;
                    alertMsg="Admin permission Granted"
                }
                return admins;
            }
        })
        Alert.info(alertMsg,2000)
    },[chatId])

const handleLike = useCallback(async (msgId)=>{
    const {uid} = auth.currentUser;
    const msgRef = database.ref(`/messages/${msgId}`)
    let alertMsg;
    await msgRef.transaction(msg=>{
        if(msg){
            if(msg.likes&&msg.likes[uid]){
                msg.likeCount -=1;
                msg.likes[uid] = null;
                alertMsg="Like removed";
            }else{
                msg.likeCount+=1;
                if(!msg.likes){
                    msg.likes={}
                }
                msg.likes[uid]=true;
                alertMsg="Liked"
            }
            return msg;
        }
    })
    Alert.info(alertMsg,2000)
},[])

  return (
    <ul style={{'listStyle':'none'}}>
        {isChatEmpty&&<li>No messages yet</li>}
        {canShowMsg&&messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike}/>)}
    </ul>
  )
}

export default Messages