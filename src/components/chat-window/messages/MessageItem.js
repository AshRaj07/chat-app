import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useHover, useMediaQuery } from "../../../misc/custom-hook";
import { auth } from "../../../misc/firebase";
import ProfileAvatar from "../../dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import IconBtnControl from "./IconBtnControl";
import ImgBtnModal from "./ImgBtnModal";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";

const renderFileMessage = (file) => {
  if(file.contentType.includes('image')){
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    )
  }
  if(file.contentType.includes('audio')){
    return (
      <audio controls>
        <source src={file.url} type='audio/mp3' />
          Your browser does not support the audio element.
        
      </audio>
    )
  }
  return <a href={file.url}>Download {file.name}</a>
}

const MessageItem = ({ message, handleAdmin, handleLike,handleDelete }) => {
  const { author, createdAt, text,file ,likes, likeCount } = message;
  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const admins = useCurrentRoom((v) => v.admins);
  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const [hoverRef, isHovered] = useHover();
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  const isMobile = useMediaQuery("(max-width: 992px)");
  const canShowIcons = isMobile || isHovered;

  return (
    <li
      ref={hoverRef}
      className={`padded mb-1 cursor-pointer ${isHovered ? "bg-black-02" : ""}`}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal profile={author} className="ml-2 text-black">
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? "Remove admin permission"
                : "Grant admin permission"}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? { color: "red" } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="trash"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id,file)}
          />
        )}
      </div>
      <div >
        {text && <span className="word-break-all">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
