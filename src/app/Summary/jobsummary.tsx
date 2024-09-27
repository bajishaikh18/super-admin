'use client'
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import styles from '../../app/dashboard/Dashboard.module.scss';
import useDashboardStore from '@/stores/useDashboardStore';


const JobSummary: React.FC = () => {
  const { jobSummaryData } = useDashboardStore((state) => ({
    jobSummaryData: state.jobSummaryData,
  }));

  return (
    <section className={styles.summary}>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>📋</div>
      <div className={styles.textContainer}>
      <div className={styles.value}>{jobSummaryData?.posted || 0}</div> 
      <div className={styles.label}>Posted</div>
      </div>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>🏢</div>
      <div className={styles.textContainer}>
      <div className={styles.value}>{jobSummaryData?.applied || 0}</div>
      <div className={styles.label}>Applied</div>
      </div>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>👥</div>
      <div className={styles.textContainer}>
      <div className={styles.value}>{jobSummaryData?.expired || 0}</div> 
      <div className={styles.label}>Expired</div>
      </div>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>👤</div>
      <div className={styles.textContainer}>
      <div className={styles.value}>{jobSummaryData?.agencies || 0}</div> 
      <div className={styles.label}>Agencies</div>
      </div>
      <button className={styles.iconButton}>
        <FaChevronRight />
      </button>
    </div>
  </section>
  );
};

export default JobSummary;
