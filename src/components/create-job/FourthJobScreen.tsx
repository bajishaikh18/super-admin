"use client";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import styles from "./CreateJob.module.scss";
import Image from "next/image";
import { AiFillCloseCircle, AiOutlineExpand } from "react-icons/ai";
import usePostJobStore, { PostJobFormData } from "@/stores/usePostJobStore";
import { COUNTRIES } from "@/helpers/constants";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import { createJob } from "@/apis/job";
import { IoClose } from "react-icons/io5";

interface FourthJobScreenProps {
  handleBack: () => void;
  handleClose: () => void;
}

const JobPostingImage = ({
  formData,
  selectedFacilities,
  handleFullScreen,
  isFullScreen,
  color,
}: {
  formData: PostJobFormData | null;
  selectedFacilities: string[];
  handleFullScreen: (fullScreen: boolean) => void;
  isFullScreen: boolean;
  color:string
}) => {
  
  return (
    <div
      className={`${styles.jobDetailsModal} ${
        isFullScreen ? styles.fullScreen : ""
      }`}
    >
      {/* Header Container for the Success Message */}

      {/* Inner Container for the Job Details */}
      <div className={styles.innerCard}>
        {isFullScreen ? (
          <button className={styles.closeFullscreen}>
            <AiFillCloseCircle
              size={30}
              onClick={() => handleFullScreen(false)}
            />
          </button>
        ) : (
          <button className={styles.expandButton}>
            <AiOutlineExpand size={20} onClick={() => handleFullScreen(true)} />
          </button>
        )}
        <div className={styles.jobDetails} style={{  border: `2px solid ${color}`}}>
          <h3 className={styles.h3} style={{  backgroundColor: color}}>
            Jobs in {COUNTRIES[formData?.location as "bh"]}
          </h3>
          <div>
            {formData?.jobPositions && formData.jobPositions?.length > 0 ? (
              <table className={styles.positionsTable}>
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  {formData.jobPositions.map((position, index) => (
                    <tr key={index}>
                      <td className={styles.positionText}>
                        <b>{position.title}</b>
                      </td>
                      <td className={styles.positionText}>
                        {position.experience} years Exp
                      </td>
                      <td className={styles.positionText}>{position.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No job positions available.</p>
            )}
          </div>
          <div className={styles.benefitsSection}>
            <h5>Benefits</h5>
            <ul className={styles.facilities}>
              {selectedFacilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>
          <div className={styles.descriptionSection}>
            <h5 className={styles.jobDescriptionTitle}>More Details</h5>
            <p className={styles.jobDescriptionText}>
              Sometext with some values{formData?.description}
            </p>
            <p className={styles.highlightText} style={{  backgroundColor: color}}>
              Sometext with some values{formData?.description}
            </p>
          </div>
          <div className={styles.jobDetailsFooter}>
            <div className={styles.contactInfo}>
              <Image
                src="" // Add the URL for the agency logo
                alt=""
                className={styles.agencyLogo}
              />
            </div>
            <div className={styles.contactDetails}>
              <p className={styles.footerDetails}>{formData?.agency}</p>
              <p className={styles.contactNumber}>{formData?.contactNumber}</p>
              <p className={styles.email}>{formData?.email}</p>
              <p className={styles.website}></p>
              <p className={styles.location}>{formData?.location}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
    </div>
  );
};
const FourthJobScreen: React.FC<FourthJobScreenProps> = ({ handleBack,handleClose }) => {
  const { formData, selectedFacilities } = usePostJobStore();
  const [color, setColor] = useState("#0045E6");
  const [isFullScreen, setIsFullScreen] = useState(false);
 
  const handleDownloadImage = () => {
    const element = document.querySelector(
      `.${styles.jobDetailsModal}`
    ) as HTMLElement;
    if (element) {
      html2canvas(element, { useCORS: true })
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "job-details.png";
          link.click();
        })
        .catch((error) => {
          console.error("Error capturing screenshot:", error);
        });
    } else {
      console.error("Element not found");
    }
  };

  const toggleFullScreen = (fullScreen: boolean) => {
    setIsFullScreen(fullScreen);
  };

  const handleSubmit = async () => {
    try {
      const jobData = {
        agencyId: formData?.agency,
        location: formData?.location,
        currency: "",
        expiry: formData?.expiryDate,
        positions: formData?.jobPositions?.filter(x=>x).map(position => ({
          positionId: position.title,
          experience: position.experience,
          min_Salary: position.salary,
          max_Salary: position.salary,
        })),
        amenties: selectedFacilities,
        contactNumbers: formData?.contactNumber,
        email:formData?.email,
        description:formData?.description,
      }
      await createJob(jobData);
    } catch (error: unknown) {
     
    }
  };
  return (
    <>
      {!isFullScreen && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Create a Job (2/2)</h2>
            <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        >
          
        </IoClose>          </div>
          <div className={styles.headerContainer}>
            <h4 className={styles.h4}>Your job is successfully created</h4>
          </div>

          <JobPostingImage
            formData={formData}
            selectedFacilities={selectedFacilities}
            handleFullScreen={toggleFullScreen}
            isFullScreen={false}
            color={color}
          />
          <HexColorPicker color={color} onChange={setColor} />
          <Form.Label>Select Color</Form.Label>
          <FormControl value={color} placeholder="#0045E6" onChange={(e)=>setColor(e.target.value)} />
          <div className={styles.actions}>
          {/* <Button
              type="button"
              className={`outlined ${styles.actionButtons}`}
              onClick={handleDownloadImage}
            >
              Cancel
            </Button> */}
            <Button
              type="button"
              onClick={handleBack}
              className={`outlined ${styles.actionButtons}`}
            >
              Back
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className={`${styles.actionButtons} ${
                true ? "" : styles.disabled
              }`}
              disabled={!true}
            >
              Post Job
            </Button>
          </div>
        </div>
      )}

      <Modal
        show={isFullScreen}
        onHide={() => toggleFullScreen(false)}
        size="xl"
        centered
        className="full-screen-modal"
      >
        <JobPostingImage
          formData={formData}
          selectedFacilities={selectedFacilities}
          handleFullScreen={toggleFullScreen}
          isFullScreen={true}
          color={color}
        />
      </Modal>
    </>
  );
};
export default FourthJobScreen;
