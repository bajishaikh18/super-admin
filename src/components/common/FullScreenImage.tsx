import { IMAGE_BASE_URL } from "@/helpers/constants";
import usePostJobStore from "@/stores/usePostJobStore";
import Image from "next/image";
import { CardHeader, Modal, ModalBody, ModalHeader } from "react-bootstrap";
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
  const {refreshImage} = usePostJobStore();
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
        src={`${IMAGE_BASE_URL}/${imageUrl}?ts=${refreshImage ? new Date().getTime() : ''}`}
        alt=""
        width={800}
        height={800}
        style={{ height: "100%", width: "auto" }}
      />
    </Modal>
  );
};


export const JobPositions = ({
  positions,
  isOpen,
  handleClose,
}: {
  positions: string[];
  isOpen: boolean;
  handleClose: () => void;
}) => {
  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      centered
      size="sm"
      className="job-positions-modal"
    >  
      <IoClose size={21} color="#000" onClick={handleClose}/>
      <ModalHeader>
      <h3>Applied Positions</h3>
      </ModalHeader>
      <ModalBody>
      <ul className="job-positions">
        {positions.map((position) => (
          <li key={position} className="job-position">
            {position}
          </li>
        ))}
      </ul>
      </ModalBody>
      
    </Modal>
  );
};
