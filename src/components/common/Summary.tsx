import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import styles from "./Summary.module.scss";
import Image from "next/image";
import { Card } from "react-bootstrap";

const SummarySection = ({ summaryData }: { summaryData: {label:string,value:string,image:string}[] }) => {
  return (
    <section className={styles.summary}>
      {
        summaryData.map(summary=>{
          return (
            <Card className={`internal-card ${styles.summaryItem}`}>
            <div className={styles.iconContainer}>
              <Image src={summary.image} width={summary.image==="/employers.png"?20:24} height={24} alt="job" />
            </div>
            <div className={styles.textContainer}>
              <div className={styles.value}>{summary.value}</div>
              <div className={styles.label}>{summary.label}</div>
            </div>
            <div className={styles.more}>
             <FaChevronRight fontSize={16} />
    
            </div>
          </Card>
          )
        })
      }
    </section>
  );
};

export default SummarySection;
