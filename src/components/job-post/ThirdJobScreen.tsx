

import React from "react";
import styles from '../../app/create/page.module.scss';

interface ThirdScreenProps {
  handleClose: () => void;
}

const ThirdJobScreen: React.FC<ThirdScreenProps> = ({ handleClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2>Create a Job (2/2)</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className={styles.popupContent}>
          <p>Your job is creating please wait</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
};

export default ThirdJobScreen;
