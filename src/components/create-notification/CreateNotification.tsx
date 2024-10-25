// "use client";

// import React, { useState, useRef, useEffect } from "react";
// // import styles from "./CreateAgency.module.scss";
// import InitialAgencyScreen from "@/components/create-agency/initialAgencyScreen";
// import { useNotificationStore } from "@/stores/useNotificationStore";
// import CreateNotificationScreen from "./CreateNotificationScreen";

// function CreateNotification({
//   handleModalClose,
// }: {
//   handleModalClose: () => void;
// }) {
//   const [screen, setScreen] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);
//   const { selectedFile, handleFileChange, resetData,setFormData } = useNotificationStore();
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(()=>{
//     if(agencyDetails){
//       const [countryCode, contactNumber] =  agencyDetails.phone?.split("-");
//       setIsEdit(true)
//       const agencyData = {
//         ...agencyDetails,
//         countryCode,
//         contactNumber
//       }
//       setFormData(agencyData);
//     }
//   },[])
 
 
//   const handleClose = () => {
//     reset();
//     handleModalClose();
//   };
//   const reset = () => {
//     resetData();
//   };
//   return (
//     <div className={styles.modalContainer}>
//       {
//         {
//           0: (
//             <InitialAgencyScreen
//               isEdit={isEdit}
//               handleFileChange={handleFileChange}
//               fileInputRef={fileInputRef}
//               selectedFile={selectedFile}
//               handleClose={handleClose}
//               handleCreateNowClick={() => {
//                 setScreen(1);
//               }}
//             />
//           ),
//           1: (
//             <CreateNotificationScreen
//               isEdit={isEdit}
//               handleClose={handleClose}
//               handleContinueClick={() => {
//                 reset();
//                 handleClose();
//               }}
//               handleBackToPostJobClick={() => setScreen(0)}
//             />
//           ),
//         }[screen]
//       }
//     </div>
//   );
// }

// export default CreateNotification;
