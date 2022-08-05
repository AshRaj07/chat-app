import React from "react";
import { Button, Icon, Drawer } from "rsuite";
import DashBoard from ".";
import { useModalState } from "../../misc/custom-hook";
const DashBoardToggle = () => {
  const { isOpen, open, close } = useModalState();
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer show={isOpen} onHide={close} placement="left">
        <DashBoard />
      </Drawer>
    </>
  );
};

export default DashBoardToggle;
