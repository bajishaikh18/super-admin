"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreateAgency.module.scss";
import { Trade, useAgencyStore } from "@/stores/useAgencyStore";
import CreateTradeScreen from "./CreateTradeScreen";


function CreateTradeCenter({
  handleModalClose,
  tradeCenterDetails,
}: {
  handleModalClose: () => void;
  tradeCenterDetails?: Trade; 
}) {
  const [isEdit, setIsEdit] = useState(false);
  const { resetData, setTradeFormData } = useAgencyStore(); 

  useEffect(() => {
    if (tradeCenterDetails) {
      let countryCode = "+91", contactNumber = tradeCenterDetails.phone;

      
      if (tradeCenterDetails.phone.includes("-")) {
        [countryCode, contactNumber] = tradeCenterDetails.phone.split("-");
      }

      setIsEdit(true);
      setTradeFormData({
        ...tradeCenterDetails,
        countryCode,
        contactNumber,
      });
    }
  }, [tradeCenterDetails]);
  const handleClose = () => {
    resetData(); 
    handleModalClose();
  };

  return (
    <div className={styles.modalContainer}>
      <CreateTradeScreen
        isEdit={isEdit}
        handleClose={handleClose}
        handleContinueClick={() => {
          resetData();
          handleClose();
        }}
        handleBackToPostJobClick={() => {}}
      />
    </div>
  );
}


export default CreateTradeCenter; 
