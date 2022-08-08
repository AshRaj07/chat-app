import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import firebase from 'firebase'
import { useProfile } from '../../../context/profile.context'
import { useParams } from 'react-router'
import { database } from '../../../misc/firebase'

function assembleMessage(profile,chatId){
    return{
        roomId:chatId,
        author:{
            name:profile.name,
            uid:profile.uid,
            createdAt:profile.createdAt,
            ...(profile.avatar?{avatar:profile.avatar}:{})
        },
        createdAt:firebase.database.ServerValue.TIMESTAMP
    }
}

const Bottom = () => {
    const [input, setinput] = useState('')
    const onInputChange = useCallback((val)=>{
        setinput(val)
    },[])
    const [isLoading,setIsLoading] = useState(false);
    const {profile} = useProfile()
    const {chatId} = useParams()
    const onSendClick = async() => {
        if(input.trim()===''){
            return;
        }
        const msgData = assembleMessage(profile,chatId);
        msgData.text = input;

        const updates = {};

        const messageId = database.ref('message').push().key;

        updates[`/messages/${messageId}`] = msgData
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId:messageId
        }
        setIsLoading(true);
        try {
            await database.ref().update(updates)
            setinput('')
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            Alert.error(error.message)
        }
    }
    const onKeyDown = (event) => {
        if(event.keyCode === 13){
            event.preventDefault();
            onSendClick()
        }
    }
  return (
    <div>
        <InputGroup>
        <Input placeholder="Write a message here..."
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        />
        <InputGroup.Button
        color="blue"
        appearance='primary'
        onClick={onSendClick}
        disabled={isLoading}
        >
        <Icon icon='send' />
        </InputGroup.Button>
        </InputGroup>
    </div>
  )
}

export default Bottom