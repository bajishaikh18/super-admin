'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../app/login/page.module.scss";
import { forgotPassword } from "@/apis/auth";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, Container, Form } from 'react-bootstrap';
import Image from "next/image";
import toast from "react-hot-toast";

interface ForgotValues {
  email: string;
}

interface ForgotProps {
  setShowForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

function Forgot({ setShowForgotPassword }: ForgotProps) {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>();

  const onForgotPasswordSubmit = async (data: ForgotValues) => {
    setEmail(data.email);
    setLoading(true);
    try {
      localStorage.setItem("forgotPasswordEmail", data.email);
      await forgotPassword(data);
      setEmailSent(true);
    } catch (error:any) {    
      if(error.status === 400){
        toast.error('Looks like your email doesnt exist')
      }else{
        toast.error('Something went wrong! Please try again later')
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowForgotPassword(false);
  };

  const handleGoToEmail = () => {
    const resetCode = 766778;
    router.push(`/change-password?code=${resetCode}`);
  };

  
  return  (
    <Container>
      <Card className={styles.formContainer}>
        {emailSent ? (
          <div className={styles.emailSentContainer}>
             <CardHeader className={styles.cardHeader}>
              <Image src={'/email-sent.png'} alt='admin' width={66} height={121}/>
              <h5 className={styles.header}>EMAIL SENT</h5>
            </CardHeader>
            <p className={styles.emailSentSuccess}>We&apos;ve sent you a reset password link to your registered email address:</p>
            <p className={styles.emailsentMessage}>{email}</p>
      
            <Button
              type="button"
              className={`btn ${loading ? 'btn-loading' : ''} ${styles.button}`}
              disabled={loading}
              onClick={handleBack}
              >
              {loading ? <div className={styles.spinner}></div> : "Back to Login"}
              
            </Button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleGoToEmail();
              }}
              className={styles.backLink}
            >
              Go to Email
            </a>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onForgotPasswordSubmit)}>
            <h5 className={styles.forgotPasswordHeader}>FORGOT PASSWORD?</h5>
            <p className={styles.forgotPasswordInstructions}>Don&apos;t worry</p>
            <p className={styles.forgotPasswordInstructions}>
              We will send you an email with instructions on how to reset your password.
            </p>
            <p className={`${styles.forgotPasswordInstructions} ${styles.forgotPasswordEmailPrompt}`}>
              Enter your registered Email ID.
            </p>
            <Form.Group className={styles.forgotPasswordFormGroup}>
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button
              type="submit"
              className={`btn ${loading ? 'btn-loading' : ''} ${styles.button}`}
              disabled={loading}
            >
              {loading ? <div className={styles.spinner}></div> : "Submit"}
            </Button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBack();
              }}
              className={styles.backLink}
            >
              Back
            </a>
          </Form>
        )}
      </Card>
    </Container>
  );
}

export default Forgot;