import React, { useState } from "react";
import { Alert, Button, Modal } from "rsuite";
import { useModalState } from "../../misc/custom-hook";
import AvatarEditor from "react-avatar-editor";

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [img, setimg] = useState(null);
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
  return (
    <div className="mt-3 text-center">
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
            <Button block appearance="ghost">
              Upload new Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
