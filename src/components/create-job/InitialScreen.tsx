
// InitialScreen.tsx
import React, { useCallback, useRef, useState } from "react";
import styles from "./CreateJob.module.scss";
import Image from "next/image";
import { Button } from 'react-bootstrap';
import {useDropzone} from 'react-dropzone'
import { IoClose } from "react-icons/io5";

interface InitialScreenProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
  isEdit?:boolean,
  handleCreateNowClick: () => void;
  handleClose: () => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({
  handleFileChange,
  isEdit,
  fileInputRef,
  handleClose,
  selectedFile,
  handleCreateNowClick,
}) => {
  const onDrop = useCallback((acceptedFiles:any) => {
    const file = acceptedFiles[0];
    if(!file){
      return
    }
    handleFileChange(file)
  }, [])
  
  const {getRootProps, getInputProps, isDragActive,open,fileRejections} = useDropzone({ accept: {
    'image/png': ['.png'],
    'image/jpg': ['.jpg', '.jpeg'],
  },
  maxFiles:1,
  maxSize: 5 * 1024 * 1024,
  onDrop})

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>{isEdit ? "Edit":"Post a"} Job</h2>
        <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        >
          
        </IoClose>          </div>
      <div className={styles.uploadSection} {...getRootProps()}>

        <input accept=".docx,.pdf"  {...getInputProps()} />
       
        <div className={styles.uploadHeader}>
          <Image
            src="/upload.png" // Ensure you have an image at this path
            alt="Upload Icon"
            width={24}
            height={24}
            className={styles.uploadIcon}
          />
           {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Upload Media</p>
        }
        </div>
        <p className={`${styles.fileInfo} ${fileRejections.length >0 ? styles.error : ''}`}>
          .jpeg, .jpg & .png are allowed. File size should not exceed 5 MB
        </p>
       
      
        {selectedFile ? (
          <p className={styles.selectedFileName}>
            Selected file: {selectedFile.name}
          </p>
        ) :   <Button className={`outlined bg-white ${styles.outlinedButton}`}  onClick={open}>
        Browse Files
      </Button>}
      </div>
      <div className={styles.createSection}>
        <h3>{isEdit ?"Edit your media" : "Don’t have a media ready?" }</h3>
        <Button
        className={`outlined ${styles.outlinedButton}`}
          onClick={handleCreateNowClick}
        >
          {
            isEdit ? "Edit Now" : "Create Now"
          }
         
        </Button>
      </div>
    </div>
  );
};

export default InitialScreen;
