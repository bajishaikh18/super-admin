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

function Page() {
  const { setAuthUser } = useAuthUserStore();
  const router = useRouter();
  const onSuccess = async ()=>{
    const resp = await getUserDetails();
    setAuthUser(resp.userDetails as AuthUser)
    router.push("/posted-jobs");
  }
  return (
    <Container>
      <div className={styles.container}>
          <div className={styles.card}>
            <CreateAgency handleModalClose={()=>{}} isSelfSignup={true} handleSubmitSuccess={onSuccess}/>
        </div>
    </div>
  </Container>
);
}

export default Page;
