import React,{ createContext,useEffect,useState } from 'react'
import { database } from '../misc/firebase'
import {transformToArrWithId} from '../misc/helper'

const RoomsContext = createContext();

export const RoomsProvider = ({children}) => {
    const [rooms, setrooms] = useState(null)
    useEffect(()=>{
        const roomListRef = database.ref('rooms')

        roomListRef.on('value',snap=>{
            const data = transformToArrWithId(snap.val());
            console.log(data);
            setrooms(data)
            
        })

        return ()=>{
            roomListRef.off()
        }
    },[])

    return(
        <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
    )
}