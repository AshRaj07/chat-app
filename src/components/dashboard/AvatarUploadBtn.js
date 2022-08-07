import React, { useRef, useState } from "react";
import { Alert, Button, Modal } from "rsuite";
import { useModalState } from "../../misc/custom-hook";
import AvatarEditor from "react-avatar-editor";
import { database, storage } from "../../misc/firebase";
import { useProfile } from "../../context/profile.context";
import ProfileAvatar from "./ProfileAvatar";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const AvatarUploadBtn = () => {
  const {profile} = useProfile();
  const avatarEditorRef = useRef(null);
  const { isOpen, open, close } = useModalState();
  const [img, setimg] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const onFileInputChange = (event) => {
    console.log(event.target.files);
    const curFile = event.target.files;
    if (curFile.length === 1) {
      const file = curFile[0];
      if (isValidFile(file)) {
        open();
        setimg(file);
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };
  const getBlob = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("File process error"));
        }
      });
    });
  };
  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setisLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child("avatar");
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public,max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
      const useAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child("avatar");
      useAvatarRef.set(downloadUrl);
      setisLoading(false);
      Alert.info("Avatar has been uploaded", 4000);
    } catch (error) {
      setisLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <div className="mt-3 text-center">
      <ProfileAvatar src={profile.avatar} name={profile.name} className='width-200 height-200 img-fullsize font-huge' />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new Avatar
          <input
            id="avatar-upload"
            type={"file"}
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
