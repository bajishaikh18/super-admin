
"use client";
import React, { useRef } from "react";
import styles from "./page.module.scss";
import InitialScreen from "@/components/job-post/InitialScreen";
import FirstJobScreen from "@/components/job-post/FirstJobScreen";
import SecondJobScreen from "@/components/job-post/SecondJobScreen";
import ThirdJobScreen from "@/components/job-post/ThirdJobScreen";
import FourthJobScreen from "@/components/job-post/FourthJobScreen";
import useStore from "@/stores/usePostJobStore";// Import Zustand store
export default function Page() {
  // Zustand state and actions
  const {
    selectedFile,
    isCreateJobScreen,
    isSecondJobScreen,
    isThirdScreenVisible,
    isFourthScreenVisible,
    selectedFacilities,
    experienceRequired,
    contactNumber,
    email,
    description,
    agency,
    location,
    type,
    salaryFrom,
    salaryTo,
    expiryDate,
    setContactNumber,
    setEmail,
    setDescription,
    handleFileChange,
    handleCreateNowClick,
    handleBackToPostJobClick,
    handleFacilityClick,
    handleContinueClick,
    handleCreateJobClick,
    handleCloseThirdScreen,
    handleCloseFourthScreen,
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
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const isContinueButtonEnabled = selectedFacilities.length > 0;
  // Explicitly check that experienceRequired, contactNumber, and email are non-empty strings to return a boolean
  const isCreateJobButtonEnabled = !!(experienceRequired && contactNumber && email);

  return (
    <div className={styles.modalContainer}>
      {!isCreateJobScreen && !isSecondJobScreen && !isThirdScreenVisible && !isFourthScreenVisible && (
        <InitialScreen
          handleFileChange={handleFileChange}
          fileInputRef={fileInputRef}
          handleButtonClick={handleButtonClick}
          selectedFile={selectedFile}
          handleCreateNowClick={handleCreateNowClick}
        />
      )}
      {isSecondJobScreen && !isThirdScreenVisible && !isFourthScreenVisible && (
        <SecondJobScreen
          contactNumber={contactNumber}
          email={email}
          description={description}
          setContactNumber={setContactNumber}
          setEmail={setEmail}
          setDescription={setDescription}
          handleBackToPostJobClick={handleBackToPostJobClick}
          isCreateJobButtonEnabled={isCreateJobButtonEnabled}
          handleCreateJobClick={handleCreateJobClick}
        />
      )}
      {isCreateJobScreen && !isSecondJobScreen && !isThirdScreenVisible && !isFourthScreenVisible && (
        <FirstJobScreen
          countries={countries}
          handleContinueClick={handleContinueClick}
          handleBackToPostJobClick={handleBackToPostJobClick}
        />
      )}
      {isThirdScreenVisible && !isFourthScreenVisible && (
        <ThirdJobScreen handleClose={handleCloseThirdScreen} />
      )}
      {isFourthScreenVisible && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <FourthJobScreen
              handleClose={handleCloseFourthScreen}
            />
          </div>
        </div>
      )}
    </div>
  );
}