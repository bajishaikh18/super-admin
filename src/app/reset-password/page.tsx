'use client';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/apis/auth";
import { useRouter } from "next/navigation";
import { Button, Form, Container, Card } from 'react-bootstrap';
import styles from './resetPassword.module.scss';
import Image from 'next/image';

interface ResetProps {
  onBackToLogin: () => void;
}

interface FormValues {
  password: string;
  confirmPassword: string;
}
function Reset({ onBackToLogin }: ResetProps) {
  const router = useRouter();  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);  
  const [loading, setLoading] = useState(false);  
  const [resetSuccess, setResetSuccess] = useState(false);  
  const [code, setCode] = useState<string | null>(null); 
  const [email, setEmail] = useState<string | null>(null); 

  const password = watch("password");  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    setCode(codeParam);
    setEmail(localStorage.getItem("forgotPasswordEmail"));  
  }, []);

  const onResetPasswordSubmit = async (data: FormValues) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!code) {
      alert("Reset code is missing");
      return;
    }
    if (!email) {
      alert("Email is missing");
      return;
    }

    setLoading(true);  
    try {
      const response = await resetPassword({
        otp: code,
        password: data.password,
        email: email,
      });
      console.log("Password reset successful:", response.data);
      setResetSuccess(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  
  };

  const handleBackToLogin = () => {
    router.push('/login');  
  };

  return (
    <Container>
    <Card className={`${styles.formContainer} ${resetSuccess ? styles.formContainerSuccess : ''}`}>     
     {resetSuccess ? (
      <div className={styles.resetSuccessContainer}>
      <h5 className={styles.header}>SUCCESS</h5>
        <p className={styles.resetPasswordmessage}>Password has been successfully changed</p>
        <Button
          type="button"
          className={`btn ${loading ? 'btn-loading' : ''} ${styles.button}`}
          disabled={loading}
          onClick={handleBackToLogin}
        >
          {loading ? <div className={styles.spinner}></div> : 'Back to login'}
        </Button>
      </div>
    ) : (
      <Form onSubmit={handleSubmit(onResetPasswordSubmit)}>
        <h5 className={styles.resetPasswordHeader}>RESET PASSWORD</h5>
         <p className={styles.resetPasswordmessage}>Please create a new password</p>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Password</Form.Label>
                <div className={styles.passwordField}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={styles.input}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                      maxLength: {
                        value: 15,
                        message: 'Password cannot exceed more than 15 characters',
                      },
                    })}
                  />
                </div>
                {errors.password && <Form.Text className='error'>{errors.password.message}</Form.Text>}
              </Form.Group>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Confirm Password</Form.Label>
                <div className={styles.passwordField}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className={styles.input}
                    {...register('confirmPassword', {
                      required: 'Confirm Password is required',
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className={`${styles.togglePasswordIcon} ${showPassword ? styles.hideIcon : ''}`}
                  />
                  <Image
                    src="/eye.png"
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    onClick={togglePasswordVisibility}
                    className={`${styles.togglePasswordIcon} ${showPassword ? styles.hideIcon : ''}`} 
                    width={24} 
                    height={24}
                  />
                </div>
                {errors.confirmPassword && <Form.Text className='error'>{errors.confirmPassword.message}</Form.Text>}
              </Form.Group>
              <Button
                type="submit"
                className={`btn ${loading ? 'btn-loading' : ''} ${styles.button}`}
                disabled={loading}
              >
                {loading ? <div className={styles.spinner}></div> : 'Reset Password'}
              </Button>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleBackToLogin(); }}
                className={styles.backLink}
              >
                Back to Login
              </a>
            </Form>
        )}
      </Card>
    </Container>
  );
}

export default Reset;
