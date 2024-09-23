
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import styles from '../../app/dashboard/Dashboard.module.scss';
import  useDashboardStore  from '../../stores/useDashboardStore';


const Summary: React.FC = () => {
    const { summaryData } = useDashboardStore((state) => ({
      summaryData: state.summaryData,
    }));

  return (
    <section className={styles.summary}>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>📋</div>
      <div className={styles.textContainer}>
        <div className={styles.value}>12,415</div>
        <div className={styles.label}>Jobs Posted</div>
      </div>
      <button className={styles.iconButton}>
        <FaChevronRight />
      </button>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>🏢</div>
      <div className={styles.textContainer}>
        <div className={styles.value}>116</div>
        <div className={styles.label}>Agencies Registered</div>
      </div>
      <button className={styles.iconButton}>
        <FaChevronRight />
      </button>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>👥</div>
      <div className={styles.textContainer}>
        <div className={styles.value}>27,362</div>
        <div className={styles.label}>Users Registered</div>
      </div>
      <button className={styles.iconButton}>
        <FaChevronRight />
      </button>
    </div>
    <div className={styles.summaryItem}>
      <div className={styles.iconContainer}>👤</div>
      <div className={styles.textContainer}>
        <div className={styles.value}>28</div>
        <div className={styles.label}>Employers</div>
      </div>
      <button className={styles.iconButton}>
        <FaChevronRight />
      </button>
    </div>
  </section>
  );
};

export default Summary;
