"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./CreateAgency.module.scss";
import InitialAgencyScreen from "@/components/create-agency/initialAgencyScreen";
import  { Agency, useAgencyStore } from "@/stores/useAgencyStore"; // Import Zustand store
import CreateAgencyScreen from "./CreateAgencyScreen";


function CreateAgency({
  handleModalClose,
  agencyDetails,
  isSelfSignup,
  handleSubmitSuccess
}: {
  handleModalClose: () => void;
  agencyDetails?: Agency;
  isSelfSignup?: boolean
  handleSubmitSuccess?:()=>void;
}) {
  const [screen, setScreen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const { selectedFile, handleFileChange, resetData,setFormData } = useAgencyStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(()=>{
    console.log("AGENCY",agencyDetails);
    if(agencyDetails){
      let countryCode, contactNumber;
      if(agencyDetails.phone.includes("-")){
        let [cc, cn] =  agencyDetails.phone?.split("-");
        countryCode = cc;
        contactNumber = cn;
      }else{
        contactNumber = agencyDetails.phone;
        countryCode = "+91";
      }
      setIsEdit(true)
      const agencyData = {
        ...agencyDetails,
        countryCode,
        contactNumber
      }
      setFormData(agencyData);
    }
  },[agencyDetails])
 
 
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
            <InitialAgencyScreen
              isEdit={isEdit}
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
              selectedFile={selectedFile}
              isSelfSignup={isSelfSignup}
              handleClose={handleClose}
              handleCreateNowClick={() => {
                setScreen(1);
              }}
            />
          ),
          1: (
            <CreateAgencyScreen
              isEdit={isEdit}
              handleClose={handleClose}
              isSelfSignup={isSelfSignup}
              handleContinueClick={async () => {
                reset();
                if(isSelfSignup && handleSubmitSuccess){
                  handleSubmitSuccess();
                 return
                }
                handleClose();
              }}
              handleBackToPostJobClick={() => setScreen(0)}
            />
          ),
        }[screen]
      }
    </div>
  );
}

export default CreateAgency;
