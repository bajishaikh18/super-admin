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

const PostedJobDetails: React.FC<PostedJobDetailsProps> = ({ jobId, onClose }) =>{
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
    postedDate,
    expiry,
    agencyName,
    location,
    noOfPositions,
  } = data;
  
  const goBack = () => {
    router.back();
  };


  return (
    <main className="main-section">

    <div
      className={`${styles.detailedViewContainer} ${
        isFullScreen ? styles.fullScreen : ""
      }`}
    >
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
            <li>Valid till {expiry}</li>
            <li>Viewed by X Candidates</li>
            <li>Applied by Y Candidates</li>
          </ul>
        </div>
        <div className={styles.rightContainer}>
          <h2 className={styles.agencyName}>{agencyName}</h2>
          
          <div className={styles.actionsContainer}>
            <button className={styles.editPostButton}>Edit Post</button>
            <div className={styles.dropdownButton}>
              <button
                className={styles.moreActionsButton}
                onClick={toggleDropdown}
              >
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
          
          <p>
            <strong>Working Location:</strong> {location}
          </p>
          <p>
            <strong>Job Type:</strong> {noOfPositions} Positions
          </p>
          <p>
            <strong>Salary From:</strong> 20,000
          </p>
          <p>
            <strong>Salary To:</strong> 30,000
          </p>
          <p>
            <strong>Contact Mobile:</strong> +123456789
          </p>
          <p>
            <strong>Contact Email:</strong> example@example.com
          </p>
          <div className={styles.line}></div>
          <div className={styles.positions}>
            <h3>Positions</h3>
            <ul>
              <li>Position 1</li>
              <li>Position 2</li>
              <li>Position 3</li>
            </ul>
          </div>
          <div className={styles.line}></div>
          <div className={styles.jobDescription}>
            <h3>Job Description</h3>
            <p>Job description goes here...</p>
            <div className={styles.benefits}>
              <span>🍽️ Food</span>
              <span>🛏️ Stay</span>
              <span>🚗 Transport</span>
              <span>📋 Recruitment</span>
              </div>
          </div>
        </div>
      </div>
    </div>
    </main>

  );
};
export default PostedJobDetails;