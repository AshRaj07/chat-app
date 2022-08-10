import React from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hook'
import { database } from '../../../misc/firebase';
import EditableInput from '../../dashboard/EditableInput';

const EditRoomBtnDrawer = () => {
    const {chatId} = useParams();
    const {isOpen,open,close} = useModalState();
    const isMobile =useMediaQuery('(max-width: 992px)')
    const name = useCurrentRoom(v=>v.name)
    const description = useCurrentRoom(v => v.description);
    const update = (key,val) => {
        database.ref(`/rooms/${chatId}`).child(key).set(val).then(()=>{
            Alert.success("Succcessfully updated",4000)
        }).catch(error=>{
            Alert.error(error.message,4000)
        })
    }
    const onNameSave = (newName) => {
        update('name',newName);
    }
    const onDescriptionSave = (newDesc) => {
        update('description',newDesc)
    }
  return (
    <div>
        <Button 
        className='br-circle'
        size='sm'
        color='red'
        onClick={open}
        >
            A
        </Button>

        <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
            <Drawer.Header>
                <Drawer.Title>
                    Edit Room
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <EditableInput 
                initialValue={name}
                onSave={onNameSave}
                label={<h6 className='mb-2'>Name</h6>            
            }
            emptyMsg="Name can not be empty"
                />
                <EditableInput 
                componentClass="textarea"
                rows={5}
                initialValue={description}
                onSave={onDescriptionSave}
                emptyMsg="Description cannot be empty"
                wrapperClass='mt-3'
                />
            </Drawer.Body>
            <Drawer.Footer>
                <Button block onClick={close}>
                    Close
                </Button>
            </Drawer.Footer>
        </Drawer>
    </div>
  )
}

export default EditRoomBtnDrawer