import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import styles from "./Summary.module.scss";
import { SummaryData } from "../../stores/useDashboardStore";
import Image from "next/image";
import { Card } from "react-bootstrap";

const SummarySection = ({ summaryData }: { summaryData: SummaryData }) => {
  return (
    <section className={styles.summary}>
      <Card className={`internal-card ${styles.summaryItem}`}>
        <div className={styles.iconContainer}>
          <Image src={"/jobs.png"} width={24} height={24} alt="job" />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.value}>12,415</div>
          <div className={styles.label}>Jobs Posted</div>
        </div>
        <div className={styles.more}>
         <FaChevronRight fontSize={16} />

        </div>
      </Card>
      <Card className={`internal-card ${styles.summaryItem}`}>
        <div className={styles.iconContainer}>
          {" "}
          <Image src={"/agencies.png"} width={24} height={24} alt="job" />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.value}>116</div>
          <div className={styles.label}>Agencies Registered</div>
        </div>
        <div className={styles.more}>
         <FaChevronRight fontSize={16} />

        </div>
      </Card>
      <Card className={`internal-card ${styles.summaryItem}`}>
        <div className={styles.iconContainer}>
          {" "}
          <Image src={"/users.png"} width={24} height={24} alt="job" />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.value}>27,362</div>
          <div className={styles.label}>Users Registered</div>
        </div>
        <div className={styles.more}>
         <FaChevronRight fontSize={16} />

        </div>
      </Card>
      <Card className={`internal-card ${styles.summaryItem}`}>
        <div className={styles.iconContainer}>
          {" "}
          <Image src={"/employers.png"} width={21} height={24} alt="job" />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.value}>28</div>
          <div className={styles.label}>Employers</div>
        </div>
        <div className={styles.more}>
         <FaChevronRight fontSize={16} />

        </div>
      </Card>
    </section>
  );
};

export default SummarySection;
