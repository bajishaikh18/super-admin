"use client";
import React, { useRef, useState } from "react";
import styles from "./CreateJob.module.scss";
import InitialScreen from "@/components/create-job/InitialScreen";
import FirstJobScreen from "@/components/create-job/FirstJobScreen";
import SecondJobScreen from "@/components/create-job/SecondJobScreen";
import useStore from "@/stores/usePostJobStore"; // Import Zustand store
import PostJobScreen from "@/components/create-job/PostJobScreen";
export default function CreateJob({
  handleModalClose,
}: {
  handleModalClose: () => void;
}) {
  const [screen, setScreen] = useState(0);
  const {
    selectedFile,
    handleFileChange,
    resetData,
  } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "India",
    "Germany",
    "France",
    "Japan",
    "China",
    "Brazil",
  ];

  const handleClose = () => {
    reset();
    handleModalClose();
  };
  const reset = () => {
    resetData();
  };

  return (
    <div className={styles.modalContainer}>
      {
        {
          0: (
            <InitialScreen
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
              selectedFile={selectedFile}
              handleClose={handleClose}
              handleCreateNowClick={() => {
                setScreen(1);
              }}
            />
          ),
          1: (
            <FirstJobScreen
              countries={countries}
              handleContinueClick={() => setScreen(2)}
              handleClose={handleClose}
              handleBackToPostJobClick={() => setScreen(0)}
            />
          ),
          2: (
            <SecondJobScreen
              handleBackToPostJobClick={() => setScreen(1)}
              handleClose={handleClose}
              handleCreateJobClick={() => {
                if(selectedFile){
                  handleClose()
                }else{
                  setScreen(3)
                }
              }}
            />
          ),
          3: (
            <PostJobScreen
              handleBack={() => setScreen(2)}
              handleClose={handleClose}
            />
          ),
        }[screen]
      }
    </div>
  );
}
