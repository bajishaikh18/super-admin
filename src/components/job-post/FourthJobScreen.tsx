"use client";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import styles from '../../app/create/page.module.scss';
import Image from "next/image";
import { AiOutlineExpand } from "react-icons/ai";
import usePostJobStore from "@/stores/usePostJobStore";
interface FourthJobScreenProps {
  handleClose: () => void;
}
const FourthJobScreen: React.FC<FourthJobScreenProps> = ({ handleClose }) => {
  const {
    agency,
    location,
    type,
    salaryFrom,
    salaryTo,
    expiryDate,
    selectedFacilities,
    experienceRequired,
    contactNumber,
    email,
    description,
    jobPositions,
  } = usePostJobStore((state) => ({
    agency: state.agency,
    location: state.location,
    type: state.type,
    salaryFrom: state.salaryFrom,
    salaryTo: state.salaryTo,
    expiryDate: state.expiryDate,
    selectedFacilities: state.selectedFacilities,
    experienceRequired: state.experienceRequired,
    contactNumber: state.contactNumber,
    email: state.email,
    description: state.description,
    jobPositions: state.jobPositions,
  }));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleDownloadImage = () => {
    const element = document.querySelector(`.${styles.innerCard}`) as HTMLElement;
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
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <div className={`${styles.modalBackdrop} ${isFullScreen ? styles.fullScreenBackdrop : ""}`}>
      <div className={`${styles.jobDetailsModal} ${isFullScreen ? styles.fullScreen : ""}`}>
        {/* Header Container for the Success Message */}
        <div className={styles.headerContainer}>
          <h4 className={styles.h4}>Your job is successfully created</h4>
        </div>
        {/* Inner Container for the Job Details */}
        <div className={styles.innerCard}>
          <button className={styles.expandButton} onClick={toggleFullScreen}>
            <AiOutlineExpand size={20} />
          </button>
          <div className={styles.jobDetails}>
            <h3 className={styles.h3}>Jobs in {location}</h3>
            <div>
              {jobPositions.length > 0 ? (
                <table className={styles.positionsTable}>
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {jobPositions.map((position, index) => (
                      <tr key={index}>
                        <td className={styles.jobPositionTitle}>• {position.title}</td>
                        <td>{salaryFrom} - {salaryTo}</td>
                        <td className={styles.type}>{type}</td>
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
              <div className={styles.facilities}>
                {selectedFacilities.map((facility, index) => (
                  <button key={index} className={styles.facilityButton}>
                    {facility}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.descriptionSection}>
              <h5 className={styles.jobDescriptionTitle}>Job Description</h5>
              <p className={styles.jobDescriptionText}>{description}</p>
              <b className={styles.jobExperience}>
                Minimum {experienceRequired} years experience required
              </b>
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
                <p className={styles.footerDetails}>{agency}</p>
                <p className={styles.contactNumber}>{contactNumber}</p>
                <p className={styles.email}>{email}</p>
                <p className={styles.website}></p>
                <p className={styles.location}>{location}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.downloadButton} onClick={handleDownloadImage}>
            Download as Image
          </button>
          <button className={styles.editButton} onClick={handleClose}>
            Edit
          </button>
          <button className={styles.postJobButton} onClick={() => console.log("Post Job Clicked")}>
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
};
export default FourthJobScreen;

