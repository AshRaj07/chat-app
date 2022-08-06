import React from "react";
import { Alert, Button, Icon, Drawer } from "rsuite";
import DashBoard from ".";
import { useMediaQuery, useModalState } from "../../misc/custom-hook";
import { auth } from "../../misc/firebase";
const DashBoardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px)')
  const onSignOut = () => {
    auth.signOut();
    Alert.info("Signed Out",4000)
    close();
  }
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <DashBoard onSignOut = {onSignOut} />
      </Drawer>
    </>
  );
};

export default DashBoardToggle;
