import React, { useCallback, useState, useRef } from "react";
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from "rsuite";
import firebase from "firebase";
import { useModalState } from "../../misc/custom-hook";
import { auth, database } from "../../misc/firebase";

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired("Chat name is required"),
  description: StringType().isRequired("Description is required"),
});

const INITIAL_FORM = {
  name: "",
  description: "",
};

const CreateRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setformValue] = useState(INITIAL_FORM);
  const [isLoading, setisLoading] = useState(false);
  const formRef = useRef(null);
  const onFormChange = useCallback((val) => {
    setformValue(val);
  }, []);
  const onSubmit = async () => {
    
    if (!formRef.current.check()) {
      return;
    }
    setisLoading(true);
    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins:{
        [auth.currentUser.uid] : true
      }
    };

    try {
      await database.ref("rooms").push(newRoomData);
      setisLoading(false);
      Alert.info(`${formValue.name} has been created`, 4000);
      setformValue(INITIAL_FORM);
      close();
    } catch (error) {
      setisLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <div className="mt-2">
      <Button block color="green" onClick={open}>
        <Icon />
        Create new chat room
      </Button>
      <Modal show={isOpen}>
        <Modal.Header>
          <Modal.Title>New chat room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
          >
            <FormGroup>
              <ControlLabel>Room name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                name="description"
                placeholder="Enter chat description..."
                componentClass="textarea"
                rows={5}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
