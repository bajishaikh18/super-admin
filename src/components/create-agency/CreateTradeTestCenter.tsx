"use client";

import React, { useState, useEffect } from "react";
import styles from "./CreateAgency.module.scss";
import useStore, { Agency, useAgencyStore } from "@/stores/useAgencyStore"; 
import CreateTradeScreen from "./CreateTradeScreen";

function CreateAgency({
  handleModalClose,
  agencyDetails,
}: {
  handleModalClose: () => void;
  agencyDetails?: Agency;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const { setFormData, resetData } = useAgencyStore();

  useEffect(() => {
    console.log("AGENCY DETAILS:", agencyDetails);
    if (agencyDetails) {
      let countryCode, contactNumber;

    
      if (agencyDetails.phone.includes("-")) {
        const [cc, cn] = agencyDetails.phone.split("-");
        countryCode = cc;
        contactNumber = cn;
      } else {
        countryCode = "+91";
        contactNumber = agencyDetails.phone;
      }

     
      setIsEdit(true);
      setFormData({
        ...agencyDetails,
        countryCode,
        contactNumber,
      });
    }
  }, [agencyDetails, setFormData]);

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

export default CreateAgency;
