import React, { useCallback, useState } from 'react'
import { ReactMic } from 'react-mic'
import { useParams } from 'react-router'
import { Alert, Icon, InputGroup } from 'rsuite'
import { storage } from '../../../misc/firebase'

const AudioMsgBtn = ({afterUpload}) => {
  const {chatId} = useParams()
  const [isRecording, setisRecording] = useState(false)
const [isUploading, setisUploading] = useState(false)
  const onClick = useCallback(() =>{
    setisRecording(p=>!p);
  },[])

  const onUpload = useCallback(async(data)=>{
    setisUploading(true)
    try {
      const snap = await storage
      .ref(`/chat/${chatId}`)
      .child(`audio_${Date.now()}.mp3`)
      .put(data.blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const file = {
        contentType:snap.metadata.contentType,
        name:snap.metadata.name,
        url:await snap.ref.getDownloadURL()
      }

      setisUploading(false)
      afterUpload([file])
    } catch (error) {
        setisUploading(false)
        Alert.error(error.message,4000)
    }
  },[afterUpload, chatId])
    
  return (
    <InputGroup.Button onClick={onClick} disabled={isUploading}
    className={isRecording?'animate-blink':''}
    >
        <Icon icon="microphone" />
        <ReactMic 
        record={isRecording}
        className='d-none'
        onStop={(data) => onUpload(data)}
        mimeType="audio/mp3"
        />
    </InputGroup.Button>
  )
}

export default AudioMsgBtn