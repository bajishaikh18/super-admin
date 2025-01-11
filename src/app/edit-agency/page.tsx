"use client";
import React from "react";
import styles from "./page.module.scss";
import {
  Container,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { AuthUser, useAuthUserStore } from "@/stores/useAuthUserStore";
import { getUserDetails } from "@/apis/user";
import CreateAgency from "@/components/create-agency/CreateAgency";
import { useQuery } from "@tanstack/react-query";
import { getAgencyByUser } from "@/apis/agency";
import { Loader, NotFound } from "@/components/common/Feedbacks";


function Page() {
  const { authUser,setAuthUser } = useAuthUserStore();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["agencyDetails", authUser?.agencyId],
    queryFn: () => {
      if (authUser?.agencyId) {
        return getAgencyByUser(authUser?.agencyId);
      }
      throw new Error("jobId is null or undefined");
    },
    enabled: !!authUser?.agencyId,
  });
  
  const onSuccess = async ()=>{
    const resp = await getUserDetails();
    setAuthUser(resp.userDetails as AuthUser)
    router.push("/posted-jobs");
  }
  if(!authUser || isLoading){
    return <Container>
    <div className={styles.container}>
        <div className={styles.card}><Loader text="Fetching agency details"/></div></div></Container>
  }
  if(isError){
    return<Container>
    <div className={styles.container}>
        <div className={styles.card}> <NotFound text="Something went wrong while fetching agency details"/></div></div></Container>
  }
  return (
    <Container>
      <div className={styles.container}>
          <div className={styles.card}>
            <CreateAgency handleModalClose={()=>{}} isSelfSignup={true} handleSubmitSuccess={onSuccess} agencyDetails={data?.agency}/>
        </div>
    </div>
  </Container>
);
}

export default Page;
