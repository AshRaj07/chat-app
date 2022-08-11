import React, { memo } from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover } from '../../../misc/custom-hook';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({message,handleAdmin}) => {
    const {author,createdAt,text} = message;
    const isAdmin = useCurrentRoom(v=>v.isAdmin)
    const admins = useCurrentRoom(v=>v.admins)
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;
    const [hoverRef, isHovered] = useHover();
  return (
    <li ref={hoverRef} className={`padded mb-1 cursor-pointer ${isHovered?'bg-black-02':''}`}>
        <div  className='d-flex align-items-center font-bolder mb-1'>
            <PresenceDot uid={author.uid} />
            <ProfileAvatar 
            src={author.avatar}
            name={author.name}
            className="ml-1"
            size="xs"
            />
            <ProfileInfoBtnModal profile={author}
            className='ml-2 text-black'
            >
              {canGrantAdmin && 
              <Button
              block
              onClick={()=>handleAdmin(author.uid)}
              color="blue"
              >
                {isMsgAuthorAdmin?'Remove admin permission':'Grant admin permission'}
              </Button>
              }

            </ProfileInfoBtnModal>
            <TimeAgo 
            datetime={createdAt}
            className="font-normal text-black-45 ml-2"
            />
        </div>
        <div className="word-break-all">
            {text}
        </div>
    </li>
  )
}

export default memo(MessageItem)