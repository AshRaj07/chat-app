import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useHover, useMediaQuery } from "../../../misc/custom-hook";
import { auth } from "../../../misc/firebase";
import ProfileAvatar from "../../dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import IconBtnControl from "./IconBtnControl";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";

const MessageItem = ({ message, handleAdmin, handleLike,handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;
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
            onClick={() => handleDelete(message.id)}
          />
        )}
      </div>
      <div className="word-break-all">{text}</div>
    </li>
  );
};

export default memo(MessageItem);
