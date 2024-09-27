'use client'
import React, { useState } from "react";
import Header from '../../components/common/Header';
import JobSummary from "../Summary/jobsummary";
import PostedJobs from "../Summary/postedjobs";
import styles from '../../app/dashboard/Dashboard.module.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Image from "next/image";
import { Button } from "react-bootstrap";

const PostJob = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); 


  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
    
  };

  return (
    <div className={styles.dashboard}>
<Header 
        onNotificationToggle={toggleNotification} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      {notificationVisible && (
        <div className={styles.notificationPanel}>
          <div className={styles.notificationHeader}>
            Notifications <a className={styles.markAllRead} href="#">Mark all as read</a>
          </div>
          <div className={styles.notificationSection}>
            <h4>New (2)</h4>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>Falcon Human Resource Consultancy</p>
                <span className={styles.notificationDescription}>New Agency has been created</span>
                <time className={styles.notificationTime}>2 mins</time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>Jobs for Oman</p>
                <span className={styles.notificationDescription}>New job post has been created</span>
                <time className={styles.notificationTime}>16 mins</time>
              </div>
            </div>
          </div>
          <div className={styles.notificationSection}>
            <h4>Previous</h4>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>New request for an Employer</p>
                <a href="#">View Details</a>
                <time className={`${styles.notificationTime} ${styles.yesterday}`}>Yesterday</time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>Report has been generated</p>
                <span className={styles.notificationDescription}>New job post has been created</span>
                <time className={styles.notificationTime}>20-July-2024</time>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>Reached 100K app downloads</p>
                <span className={styles.notificationDescription}>New job post has been created</span>
                <time className={styles.notificationTime}>12-July-2024</time>
              </div>
            </div>
          </div>
        </div>
      )}

<main>
        <div className={styles.jobSummaryContainer}>
          <section className={styles.summaryText}>
            <p>Jobs Summary</p>
          </section>
          <JobSummary /> 
        </div>
        <>
          <section className={styles.postedJobsHeader}>
            <p>Posted Jobs</p>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="Search" 
                className={styles.searchInput} 
              />
              <Image 
                src="/Search.png" 
                alt="Search" 
                width={16} 
                height={16}
                className={styles.searchImg}
              />
              <div className={styles.groupContainer}>
                <Image 
                  src="/Group.png" 
                  alt="Group" 
                  width={16} 
                  height={16}
                  className={styles.groupImg}
                />
              </div>
              <Button type="submit" className={`btn ${styles.button}`}>
                <Image 
                  src="/Upload.png" 
                  alt="Upload"
                  width={16} 
                  height={16} 
                  className={styles.buttonIcon} 
                />
                Post A New Job
              </Button>
            </div>
          </section>
          <PostedJobs /> 
        </>
      </main>
    </div>
  );
};

export default PostJob;