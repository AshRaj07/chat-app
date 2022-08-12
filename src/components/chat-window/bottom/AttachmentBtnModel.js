import React, { useState } from "react";
import { useParams } from "react-router";
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from "rsuite";
import { useModalState } from "../../../misc/custom-hook";
import { storage } from "../../../misc/firebase";

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModel = ({afterUpload}) => {
  const { chatId } = useParams();
  const { isOpen, close, open } = useModalState();
  const [filelist, setfilelist] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setfilelist(filtered);
  };
  const onUpload = async () => {
    try {
      const uploadPromises = filelist.map((f) => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });
      const uploadSnapshots = await Promise.all(uploadPromises)
      const shapePromises = uploadSnapshots.map(async snap => {
        return {
            contentType:snap.metadata.contentType,
            name:snap.metadata.name,
            url:await snap.ref.getDownloadURL()
        }
      })
      const files = await Promise.all(shapePromises);
      await afterUpload(files)
      setisLoading(false)
      close()
    } catch (error) {
        setisLoading(false)
        Alert.error(error.message,4000)
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            className="w-100"
            autoUpload={false}
            action=""
            fileList={filelist}
            onChange={onChange}
            multiple
            listType="picture-text"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* only files less than 5mb are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModel;
