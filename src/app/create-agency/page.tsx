"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./page.module.scss";
import Forgot from "../../components/login/Forgot";
import { login, registerUser } from "@/apis/auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthUser, useAuthUserStore } from "@/stores/useAuthUserStore";
import { getUserDetails } from "@/apis/user";
import Link from "next/link";
import { COUNTRIES } from "@/helpers/constants";
import Otpverification from "../otpverification/Otpverification";
import CreateAgency from "@/components/create-agency/CreateAgency";

interface FormValues {
  firstName: string;
  lastName: string;
  landlineNumber: string;
  confirmPassword: string;
  mobileNumber: string;
  mobileCountryCode: string;
  landlineCountryCode: string;
  email: string;
  password: string;
}
const phoneRegex = /^[0-9]{10}$/;

function Page() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const { setAuthUser } = useAuthUserStore();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "all" });
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
