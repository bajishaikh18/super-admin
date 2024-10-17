"use client"

import React, {useState, useRef} from "react";
import styles from "./CreateAgency.module.scss";
import InitialAgencyScreen from "@/components/create-agency/initialAgencyScreen";
import useStore, { Agency } from "@/stores/useAgencyStore"; // Import Zustand store



function CreateAgency ({
    handleModalClose,
    // agencyDetails

}: {

    handleModalClose: () =>void,
    // agencyDetails?: Agency

}) {

    const [screen, setScreen] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const {
        selectedFile,
        handleFileChange,
        resetData,
      } = useStore();
      const fileInputRef = useRef<HTMLInputElement | null>(null);
      


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
                          handleClose={handleClose}
                          handleCreateNowClick={() => {
                            setScreen(1);
                          }}
                        />
                      ),
                }[screen]
            }

        </div>
    )

}

export default CreateAgency;