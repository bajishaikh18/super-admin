"use client";
import React, { useState } from "react";
import styles from './Dashboard.module.scss';
import Header from '../../components/common/Header';
import Insights from '../../components/dashboard/Insights'; 
import RegisteredUsers from '../../components/dashboard/RegisterdUsers';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SummarySection from "@/components/common/Summary";
import useDashboardStore from "@/stores/useDashboardStore";

const Dashboard = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); 


  const {summaryData} = useDashboardStore();
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

      <main className="main-section">
        <div className="page-block">
          <h3 className="section-heading">Summary</h3>
          <SummarySection summaryData={summaryData}/>
        </div>
        <div className="page-block">
        <h3 className="section-heading">Insights</h3>
        <Insights />
        </div>

        <section className={styles.thirdText}>
          <p>Registered users</p>
        </section>
        <RegisteredUsers />
      </main>
    </div>
  );
};

export default Dashboard;
