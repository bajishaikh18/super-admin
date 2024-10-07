import { IMAGE_BASE_URL } from "@/helpers/constants";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

export const FullScreenImage = ({
  imageUrl,
  isOpen,
  handleClose,
}: {
  imageUrl: string;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      centered
      size="lg"
      className={"image-modal"}
    >  
    <div className={"image-modal-close"}>
      <IoClose size={21} color="#fff" onClick={handleClose}/>
      </div>
      <Image
        src={`${IMAGE_BASE_URL}/${imageUrl}`}
        alt=""
        width={800}
        height={800}
        style={{ height: "100%", width: "auto" }}
      />
    </Modal>
  );
};
