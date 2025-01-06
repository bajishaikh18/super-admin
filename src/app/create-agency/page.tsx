"use client";

import CreateAgency from "@/components/create-agency/CreateAgency";

const CreateAgencyPage =() => {
    const handleModalClose = () => {
       // console.log("Modal closed");
       
      };
    
      return <CreateAgency handleModalClose={handleModalClose} />;
    };



export default CreateAgencyPage;
 