
// InitialScreen.tsx
import React, { useRef } from "react";
import styles from '../../app/create/page.module.scss';
import Image from "next/image";

interface InitialScreenProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleButtonClick: () => void;
  selectedFile: File | null;
  handleCreateNowClick: () => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({
  handleFileChange,
  fileInputRef,
  handleButtonClick,
  selectedFile,
  handleCreateNowClick,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Post a Job</h2>
        <button className={styles.closeButton}>&times;</button>
      </div>
      <div className={styles.uploadSection}>
        <div className={styles.uploadHeader}>
          <Image
            src="" // Ensure you have an image at this path
            alt="Upload Icon"
            className={styles.uploadIcon}
          />
          <span>Upload Media</span>
        </div>
        <p className={styles.fileInfo}>
          .docx, pdf are allowed. File size should not exceed 5mb
        </p>
        <input
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className={styles.fileInput}
        />
        <button className={styles.browseButton} onClick={handleButtonClick}>
          Browse Files
        </button>
        {selectedFile && (
          <p className={styles.selectedFileName}>
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>
      <div className={styles.createSection}>
        <b>Don’t have a media ready?</b>
        <button
          className={styles.createButton}
          onClick={handleCreateNowClick}
        >
          Create Now
        </button>
      </div>
    </div>
  );
};

export default InitialScreen;
