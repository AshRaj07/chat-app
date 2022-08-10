import React from 'react'
import TimeAgo from 'timeago-react';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({message}) => {
    const {author,createdAt,text} = message;

  return (
    <li className='padded mb-1'>
        <div className='d-flex align-items-center font-bolder mb-1'>
            <PresenceDot uid={author.uid} />
            <ProfileAvatar 
            src={author.avatar}
            name={author.name}
            className="ml-1"
            size="xs"
            />
            {/* <span className='ml-2'>{author.name}</span> */}
            <ProfileInfoBtnModal profile={author}
            className='ml-2 text-black'
            />
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

export default MessageItem