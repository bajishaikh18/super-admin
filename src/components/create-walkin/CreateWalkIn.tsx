"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./CreateWalkIn.module.scss";
import InitialScreen from "./InitialScreen";
import FirstWalkInScreen from "./FirstWalkInScreen";
import SecondWalkInScreen from "./SecondWalkInScreen";
import useStore, {Walkin} from "@/stores/usePostWalkinStore"; 
import PostWalkInScreen from "./PostWalkIn";
import usePostWalkinStore from "@/stores/usePostWalkinStore";
export default function CreateWalkIn({
  handleModalClose,
  walkinDetails
}: {
  handleModalClose: () => void;
  walkinDetails?: Walkin

}) {
  const [screen, setScreen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const {setFormData,setFacilities} = usePostWalkinStore();
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
    if(walkinDetails){
      const [countryCode, contactNo] =  walkinDetails.contactNumbers?.[0]?.split("-");
      const [altCountryCode, altContactNo] =  walkinDetails.contactNumbers?.[1] ? walkinDetails.contactNumbers[1]?.split("-"):[];
      const payload = {
        ...walkinDetails,
        agency: {
          value:walkinDetails.agencyId._id,
          label:walkinDetails.agencyId.name
        },
        country: walkinDetails.country,
        countryCode:countryCode,
        interviewDate: new Date(walkinDetails.interviewDate) as any,
        contactNumber: contactNo,
        altContactNumber:altContactNo,
        altCountryCode:altCountryCode,
        jobPositions: walkinDetails.positions.map(position=>{
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
      setFacilities(walkinDetails.amenities)
    }
  },[walkinDetails])

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
              handleBackToPostWalkinClick={() => setScreen(1)}
              handleClose={handleClose}
              handleCreateWalkinClick={() => {
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
              handleBack={(isEdit) => {
                if(isEdit){
                  setIsEdit(isEdit);
                  setScreen(2)
                }
              }}
              handleClose={handleClose}
            />
          ),
        }[screen]
      }
    </div>
  );
}
