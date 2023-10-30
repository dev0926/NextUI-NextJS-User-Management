import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

import { User } from "@/config/types";
import { columns } from "@/config/data";

export const ModalComponent = (props: any) => {
  const { isOpen, onClose, type, data, userCount, onAdd, onEdit } = props;
  const [newData, setNewData] = useState<User>(data);

  useEffect(() => {
    setNewData(data || {});
  }, [data]);

  const handleChange = (value: any, id: any) => {
    setNewData((prevData: User) => ({ ...prevData, [id]: value }));
  };

  const onOK = () => {
    switch (type) {
      case "add":
        onAdd({ ...newData });
        break;
      case "edit":
        onEdit({ ...newData });
        break;
      default:
        break;
    }
    onClose();
  };

  const modalTitle = () => {
    switch (type) {
      case "add":
        return "Add a data entry";
      case "edit":
        return "Edit a data entry";
      default:
        return "View Details";
    }
  };

  const getDataValue = (key: string) => {
    switch (key) {
      case "id":
      case "firstName":
      case "lastName":
      case "email":
      case "address":
      case "phoneNumber":
      case "registered":
      case "adminNotes":
        return newData[key];
      default:
        return "";
    }
  };

  const modalBody = () => {
    switch (type) {
      case "add":
        return (
          <>
            {columns.map(
              (column) =>
                column.showable && (
                  <Input
                    key={column.uid}
                    variant="flat"
                    label={column.name}
                    onChange={(e) => handleChange(e.target.value, column.uid)}
                  />
                )
            )}
          </>
        );
      case "edit":
        return (
          <>
            {columns.map(
              (column) =>
                column.showable && (
                  <Input
                    isDisabled={!column.editable}
                    key={column.uid}
                    variant="underlined"
                    label={column.name}
                    value={getDataValue(column.uid) || ""}
                    onChange={(e) => handleChange(e.target.value, column.uid)}
                  />
                )
            )}
          </>
        );
      default:
        return (
          <>
            {columns.map(
              (column) =>
                column.showable && (
                  <Input
                    isDisabled
                    key={column.uid}
                    variant="bordered"
                    label={column.name}
                    value={data[column.uid] || ""}
                    radius="none"
                  />
                )
            )}
          </>
        );
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle()}
            </ModalHeader>
            <ModalBody>{modalBody()}</ModalBody>
            <ModalFooter>
              {type != "view" && (
                <Button color="danger" variant="light" onPress={onClose}>
                  CANCEL
                </Button>
              )}
              <Button color="primary" onPress={onOK}>
                {type === "view" ? "CLOSE" : type === "add" ? "ADD" : "CHANGE"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
