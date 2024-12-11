"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./CreateAgency.module.scss";
import InitialTradeScreen from "./IntialTradeScreen";
import useStore, { Agency, useAgencyStore } from "@/stores/useAgencyStore"; // Import Zustand store
import CreateTradeScreen from "./CreateTradeScreen";


function CreateAgency({
  handleModalClose,
  agencyDetails,
}: {
  handleModalClose: () => void;
  agencyDetails?: Agency;
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
        contactNumber,
        
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
            <InitialTradeScreen
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
            <CreateTradeScreen
              isEdit={isEdit}
              handleClose={handleClose}
              handleContinueClick={() => {
                reset();
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
