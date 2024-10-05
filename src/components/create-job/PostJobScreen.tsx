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
import { createJob, updateJob } from "@/apis/job";
import { IoClose } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { getSignedUrl, uploadFile } from "@/apis/common";
import toast from "react-hot-toast";

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
  color: string;
}) => {
  return (
    <div className={styles.imageContainer}>
      {isFullScreen ? (
        <button className={styles.closeFullscreen}>
          <AiFillCloseCircle
            size={30}
            onClick={() => handleFullScreen(false)}
          />
        </button>
      ) : (
        <>
            <button className={styles.expandButton}>
              <AiOutlineExpand
                size={14}
                onClick={() => handleFullScreen(true)}
              />
            </button>
        </>
      )}
      <div
        className={`${styles.jobDetailsModal} ${
          isFullScreen ? styles.fullScreen : ""
        }`}
      >
        {/* Header Container for the Success Message */}

        {/* Inner Container for the Job Details */}
        <div className={styles.innerCard}>
          <div
            className={styles.jobDetails}
            style={{ border: `2px solid ${color}` }}
          >
            <h3 className={styles.h3} style={{ backgroundColor: color }}>
              Jobs in {COUNTRIES[formData?.location as "bh"]?.label}
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
                        <td className={styles.positionText}>
                          {position.salary}
                        </td>
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
              <p
                className={styles.highlightText}
                style={{ backgroundColor: color }}
              >
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
                <p className={styles.contactNumber}>
                  {formData?.contactNumber}
                </p>
                <p className={styles.email}>{formData?.email}</p>
                <p className={styles.website}></p>
                <p className={styles.location}>{formData?.location}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
      </div>
    </div>
  );
};
const PostJobScreen: React.FC<FourthJobScreenProps> = ({
  handleBack,
  handleClose,
}) => {
  const { formData, selectedFacilities,newlyCreatedJob } = usePostJobStore();
  const [color, setColor] = useState("#0045E6");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading,setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const handleDownloadImage = async () => {
    setDownloadLoading(true);
    const element = document.querySelector(
      `.${styles.jobDetailsModal}`
    ) as HTMLElement;
    if (element) {
      try {
        const canvas = await html2canvas(element, { useCORS: true, scale: 5 });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "job-details.png";
        link.click();
      } catch (e) {
        console.error("Error capturing screenshot:", e);
      }
    } else {
      console.error("Element not found");
    }
    setDownloadLoading(false);
  };

  const toggleFullScreen = (fullScreen: boolean) => {
    setIsFullScreen(fullScreen);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if(!newlyCreatedJob?._id){
        throw "Not found";
      }
      const element = document.querySelector(
        `.${styles.jobDetailsModal}`
      ) as HTMLElement;
      const canvas = await html2canvas(element, { useCORS: true, scale: 5 });
      const blob: Blob | null = await new Promise((resolve, reject) =>
        canvas.toBlob(function (blob) {
          if (!blob) reject();
          resolve(blob);
        })
      );
      const resp = await getSignedUrl("jobImage", blob?.type!, newlyCreatedJob?._id);
      if (resp) {
        await uploadFile(resp.uploadurl, blob!);
        await updateJob(newlyCreatedJob?._id, {imageUrl: resp.keyName})
        toast.success('Job posted successfully')
        handleClose();
      }
      setLoading(false);
    } catch (error: unknown) {
      toast.success('Error while posting job. Please try again')
      setLoading(false);
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
            ></IoClose>{" "}
          </div>
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
          <Form.Label className={styles.colorLabel}>Customize</Form.Label>
          <div className={styles.colorInput}>
            <FormControl
              value={color}
              placeholder="#0045E6"
              onChange={(e) => setColor(e.target.value)}
            />
            {showPicker ? (
              <IoClose
                fontSize={30}
                className={styles.pickerIcon}
                onClick={() => setShowPicker(false)}
              />
            ) : (
              <IoIosColorPalette
                className={styles.pickerIcon}
                fontSize={30}
                onClick={() => setShowPicker(true)}
              />
            )}
          </div>
          <div className={styles.colorPicker}>
            {showPicker && <HexColorPicker color={color} onChange={setColor} />}
          </div>
          <div className={styles.actions}>
            <div
              className={`${styles.download} ${
                downloadLoading ? "disabled" : ""
              }`}
              onClick={handleDownloadImage}
            >
              <Image
                src="/download.png"
                alt="download"
                width={24}
                height={24}
              />
              {downloadLoading ? "Downloading.." : "Download Image"}
            </div>
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
              Edit
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className={`btn ${loading ? 'btn-loading' : ''} ${styles.actionButtons}`}
              disabled={loading}
            >
             
              {loading ? <div className='spinner'></div> : 'Post Job'}
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
export default PostJobScreen;
