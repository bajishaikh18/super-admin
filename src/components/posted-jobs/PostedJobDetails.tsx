'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getJobDetails } from "@/apis/job";
import styles from "../../components/dashboard/Dashboard.module.scss";
import Image from "next/image";
import { AiFillCloseCircle, AiOutlineExpand } from "react-icons/ai";

type PostedJobDetailsProps = {
  jobId: string;
  onClose: () => void;
};

const PostedJobDetails: React.FC<PostedJobDetailsProps> = ({ jobId, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobDetails', jobId],
    queryFn: () => {
      if (jobId) {
        return getJobDetails(jobId);
      }
      throw new Error("jobId is null or undefined");
    },
    enabled: !!jobId });

  console.log("Job", data);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading job details</div>;
  }
  
  const {
    createdAt,
    expiry,
    agencyName,
    location,
    positions,
    contactNumbers, 
    email,
    description,
    amenities, 
  } = data.job;

  const postedDate = new Date(createdAt).toLocaleDateString();
  
  const goBack = () => {
    router.back();
  };

  return (
    <main className="main-section">
      <div className={`${styles.detailedViewContainer} ${isFullScreen ? styles.fullScreen : ""}`}>
        <span onClick={goBack} className={styles.backlink}>
          〱 Job Posting Details
        </span>
        <div className={styles.contentWrapper}>
          <div className={styles.leftContainer}>
            <div className={styles.imageContainer}>
              <Image
                src="/Rectangle.png"
                alt="Rectangle"
                width={403}
                height={404}
                className={styles.buttonIcon}
              />
              {isFullScreen ? (
                <button className={styles.closeFullscreen}>
                  <AiFillCloseCircle size={30} onClick={toggleFullScreen} />
                </button>
              ) : (
                <button className={styles.expandButton}>
                  <AiOutlineExpand size={20} onClick={toggleFullScreen} />
                </button>
              )}
            </div>
            <ul className={styles.jobInfoList}>
              <li>Posted on {postedDate}</li>
              <li>Valid till {new Date(expiry).toLocaleDateString()}</li>
              <li>Viewed by X Candidates</li>
              <li>Applied by Y Candidates</li>
            </ul>
          </div>
          <div className={styles.rightContainer}>
            <h2 className={styles.agencyName}>{agencyName}</h2>
            <div className={styles.actionsContainer}>
              <button className={styles.editPostButton}>Edit Post</button>
              <div className={styles.dropdownButton}>
                <button className={styles.moreActionsButton} onClick={toggleDropdown}>
                  ...
                </button>
                {dropdownVisible && (
                  <div className={styles.dropdownContent}>
                    <button>De-activate Post</button>
                    <button>Delete Post</button>
                  </div>
                )}
              </div>
            </div>
            <p><strong>Working Location:</strong> {location}</p>
            <p><strong>Contact Mobile:</strong> {contactNumbers.join(", ")}</p>
            <p><strong>Contact Email:</strong> {email}</p>
            <div className={styles.line}></div>
            <div className={styles.positions}>
              <h3>Positions</h3>
              <ul>
                {positions.map((position: { positionId: number; title: string; experience: string; salary: string }, index: number) => (
                  <li key={position.positionId}>
                    <strong>{position.title}</strong> - {position.experience}, Salary: {position.salary}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.line}></div>
            <div className={styles.jobDescription}>
              <h3>Job Description</h3>
              <p>{description}</p>
              <div className={styles.benefits}>
                {amenities.map((amenity: string, index: number) => (
                  <span key={index}>{amenity}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostedJobDetails;
