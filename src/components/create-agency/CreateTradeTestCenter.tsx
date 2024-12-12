"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreateAgency.module.scss";
import useStore, { Agency, useAgencyStore } from "@/stores/useAgencyStore";
import CreateTradeScreen from "./CreateTradeScreen";


function CreateTradeCenter({
  handleModalClose,
  tradeCenterDetails,
}: {
  handleModalClose: () => void;
  tradeCenterDetails?: Agency; 
}) {
  const [isEdit, setIsEdit] = useState(false);
  const { resetData, setFormData } = useAgencyStore(); 

  useEffect(() => {
    if (tradeCenterDetails) {
      let countryCode = "+91", contactNumber = tradeCenterDetails.phone;

      
      if (tradeCenterDetails.phone.includes("-")) {
        [countryCode, contactNumber] = tradeCenterDetails.phone.split("-");
      }

      setIsEdit(true);
      setFormData({
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
