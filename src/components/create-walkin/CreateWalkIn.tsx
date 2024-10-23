"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./CreateWalkIn.module.scss";
import InitialScreen from "./InitialScreen";
import FirstWalkInScreen from "./FirstWalkInScreen";
import SecondWalkInScreen from "./SecondWalkInSreen";
import useStore, { Job } from "@/stores/usePostJobStore"; 
import PostWalkInScreen from "./PostWalkIn";
import usePostJobStore from "@/stores/usePostJobStore";
export default function CreateWalkIn({
  handleModalClose,
  jobDetails
}: {
  handleModalClose: () => void;
  jobDetails?: Job
}) {
  const [screen, setScreen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const {setFormData,setFacilities} = usePostJobStore();
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

  useEffect(()=>{
    if(jobDetails){
      const [countryCode, contactNo] =  jobDetails.contactNumbers?.[0]?.split("-");
      const [altCountryCode, altContactNo] =  jobDetails.contactNumbers?.[1] ? jobDetails.contactNumbers[1]?.split("-"):[];
      const payload = {
        ...jobDetails,
        agency: {
          value:jobDetails.agencyId._id,
          label:jobDetails.agencyId.name
        },
        country: jobDetails.country,
        countryCode:countryCode,
        contactNumber: contactNo,
        altContactNumber:altContactNo,
        altCountryCode:altCountryCode,
        jobPositions: jobDetails.positions.map(position=>{
          return {
            title:{
              value:position.jobTitleId,
              label:position.title
            },
            experience: position.experience.toString(),
            salary: position.salary
          }
        })
      }
      setFormData(payload)
      setIsEdit(true);
      setFacilities(jobDetails.amenities)
    }
  },[jobDetails])

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
              isEdit={isEdit}
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
            <FirstWalkInScreen
              countries={countries}
              isEdit={isEdit}
              handleContinueClick={() => setScreen(2)}
              handleClose={handleClose}
              handleBackToPostWalkInClick={() => setScreen(0)}
            />
          ),
          2: (
            <SecondWalkInScreen
              isEdit={isEdit}
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
            <PostWalkInScreen
              isEdit={isEdit}
              handleBack={() => setScreen(2)}
              handleClose={handleClose}
            />
          ),
        }[screen]
      }
    </div>
  );
}
