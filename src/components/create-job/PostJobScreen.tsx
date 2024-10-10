"use client";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import styles from "./CreateJob.module.scss";
import Image from "next/image";
import { AiFillCloseCircle, AiOutlineExpand } from "react-icons/ai";
import usePostJobStore, { PostJobFormData } from "@/stores/usePostJobStore";
import { COUNTRIES, FACILITIES_IMAGES } from "@/helpers/constants";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import { createJob, updateJob } from "@/apis/job";
import { IoClose } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { getSignedUrl, uploadFile } from "@/apis/common";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface FourthJobScreenProps {
  isEdit?:boolean;
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
    
      <div
        className={`${styles.jobDetailsModal} ${
          isFullScreen ? styles.fullScreen : ""
        }`}
      >
        {/* Header Container for the Success Message */}

        {/* Inner Container for the Job Details */}
        <div className={styles.innerCard}>
          <div
            style={{
              border: `4px solid ${color}`,
              padding: "12px",
              borderRadius: "8px",
              marginTop: "0px",
            }}
          >
            <h3
              style={{
                backgroundColor: color,
                color: "#fff",
                textAlign: "center",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "29px",
                fontWeight: "700",
              }}
            >
              Required for {formData?.location === "ae" ? "UAE" : COUNTRIES[formData?.location as "bh"]?.label}
            </h3>
            <div>
              {formData?.jobPositions && formData.jobPositions?.length > 0 ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "15px",
                  }}
                >
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {formData.jobPositions.filter(x=>x.title && x.title.value).map((position, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "22px 8px",
                            borderBottom: "1px solid rgba(189, 189, 189, 1)",
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              background: color,
                              borderRadius: "100px",
                              display: "inline-block",
                              verticalAlign: "middle",
                              marginRight: "8px",
                            }}
                          ></div>

                          <span>{position.title.label}</span>
                        </td>
                        <td
                          style={{
                            padding: "22px 8px",
                            borderBottom: "1px solid rgba(189, 189, 189, 1)",
                            fontSize: "14px",
                            fontWeight: 400,
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          {position.experience} years Exp
                        </td>
                        <td
                          style={{
                            padding: "22px 8px",
                            borderBottom: "1px solid rgba(189, 189, 189, 1)",
                            fontSize: "14px",
                            fontWeight: 400,
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <img
                            src={"/dollar.svg"}
                            alt="dollar"
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          />{" "}
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            {position.salary ? `(${position.salary})` : ""}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No job positions available.</p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(247, 247, 247, 1)",
                borderRadius: "8px",
                margin: "20px 0px",
                alignItems: "center",
                padding: "14px 15px",
              }}
            >
              <h5
                style={{
                  marginBottom: "0px",
                  fontSize: "13px",
                  lineHeight: "15px",
                  fontWeight: 600,
                }}
              >
                Benefits
              </h5>
              <ul
                style={{
                  display: "flex",
                  gap: "7px",
                  flexWrap: "wrap",
                  margin: "0px",
                  paddingLeft: "10px",
                  alignItems: "center",
                }}
              >
                {selectedFacilities.map((facility, index) => (
                  <>
                    <Image
                      src={FACILITIES_IMAGES[facility as "Food"]}
                      alt={facility}
                      width={14}
                      height={14}
                      style={{ marginLeft: "5px" }}
                    />
                    <li
                      key={index}
                      style={{
                        color: "rgba(117, 117, 117, 1)",
                        fontSize: "12px",
                        marginLeft: "5px",
                      }}
                    >
                      {facility}
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div
              style={{
                textAlign: "left",
                fontSize: "14px",
                marginTop: "2px",
                marginBottom: "15px",
              }}
            >
              <h5
                style={{
                  fontSize: "13px",
                  lineHeight: "15px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                More Details
              </h5>
              <p
                style={{
                  background: "rgba(247, 247, 247, 1)",
                  padding: "4px 7px",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "rgba(33, 33, 33, 1)",
                  borderRadius: "7px",
                  marginBottom: "12px",
                }}
              >
                {formData?.description}
              </p>
              <p
                style={{
                  backgroundColor: color,
                  padding: "4px 7px",
                  fontSize: "13px",
                  fontWeight: 500,
                  marginTop: "12px",
                  lineHeight: "15px",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "7px",
                  marginBottom: "12px",
                }}
              >
                interested candidates can send their updated CV, Passport Copy,
                Photo & Experience Certificates by email with the position
                applied in the subject line.
              </p>
            </div>
            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "20px",
                background: "rgba(239, 239, 239, 1)",
                margin: "0px -12px -10px -12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <img src="/ag_logo.svg" />
                <div>
                  <h6
                    style={{
                      fontSize: "18px",
                      margin: "0px",
                      fontWeight: 600,
                      lineHeight: "24px",
                    }}
                  >
                    Aldhia Human Resource Consultants
                  </h6>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "0px",
                      fontWeight: 500,
                      lineHeight: "17px",
                      color: "rgba(91, 91, 91, 1)",
                      textAlign: "left",
                    }}
                  >
                    REG No: B-1853/MUM/COM/1000+/5/0242/2023{" "}
                  </p>
                </div>
                <img src="/verified.svg" style={{ marginTop: "-20px" }} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap:"20px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <img src="/call.svg" />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 600,
                        lineHeight: "22px",
                        marginLeft: "8px",
                      }}
                    >
                      {formData?.countryCode}
                      {formData?.contactNumber}{" "}
                      <span
                        style={{
                          fontWeight: 400,
                          color: "rgba(189, 189, 189, 1)",
                        }}
                      >
                        |
                      </span>{" "}
                      {formData?.altCountryCode}
                      {formData?.altContactNumber}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <img src="/globe.svg" />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        marginLeft: "8px",
                      }}
                    >
                      alarabarafa.com
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <img src="/mail.svg" />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 600,
                        lineHeight: "22px",
                        marginLeft: "8px",
                      }}
                    >
                      {formData?.email}
                      
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >
                    <img src="/location.svg" />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        marginLeft: "8px",
                      }}
                    >
                      {COUNTRIES[formData?.location as "bh"].label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
      </div>
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
            <AiOutlineExpand size={14} onClick={() => handleFullScreen(true)} />
          </button>
        </>
      )}
    </div>
  );
};
const PostJobScreen: React.FC<FourthJobScreenProps> = ({
  isEdit,
  handleBack,
  handleClose,
}) => {
  const queryClient = useQueryClient()
  const { formData, selectedFacilities, newlyCreatedJob,setRefreshImage } = usePostJobStore();
  const [color, setColor] = useState("#0045E6");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const id = newlyCreatedJob?._id || formData?._id;
      if (!id) {
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
      const resp = await getSignedUrl(
        "jobImage",
        blob?.type!,
        id
      );
      if (resp) {
        await uploadFile(resp.uploadurl, blob!);
        await updateJob(id, { imageUrl: resp.keyName });
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes('jobs');
          },
          refetchType:'all'
        })
        // await queryClient.refetchQueries({
        //     predicate: (query) => {
        //       return query.queryKey.includes('jobs');
        //     },
        //   });
        toast.success("Job posted successfully");
        handleClose();
        setRefreshImage(true)
      }
      setLoading(false);
    } catch (error: unknown) {
      toast.error("Error while posting job. Please try again");
      setLoading(false);
    }
  };
  return (
    <>
      {!isFullScreen && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Success</h2>
            <IoClose
              className={styles.closeButton}
              onClick={handleClose}
            ></IoClose>{" "}
          </div>
          <div className={styles.headerContainer}>
            <h4 className={styles.h4}>Your job is successfully {isEdit?"created":"updated"}</h4>
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
              className={`outlined action-buttons`}
            >
              Edit
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className={`btn ${loading ? "btn-loading" : ""} action-buttons`}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Post Job"}
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
