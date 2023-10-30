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
  const { isOpen, onClose, type, data } = props;

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

  const modalBody = () => {
    switch (type) {
      case "add":
        return (
          <>
            {columns.map(
              (column) =>
                column.editable && (
                  <Input key={column.uid} variant="flat" label={column.name} />
                )
            )}
          </>
        );
      case "edit":
        return (
          <>
            {columns.map(
              (column) =>
                column.editable && (
                  <Input
                    key={column.uid}
                    variant="underlined"
                    label={column.name}
                    value={data[column.uid] || ""}
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
              <Button color="danger" variant="light" onPress={onClose}>
                CANCEL
              </Button>
              <Button color="primary" onPress={onClose}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
