'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./page.module.scss";
import Forgot from '../../components/login/Forgot';
import Otpverification from '../otpverification/Otpverification';
import { login } from '@/apis/auth';
import { Button, Card, CardBody, CardHeader, Container, Form } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthUser, useAuthUserStore } from '@/stores/useAuthUserStore';
import { getUserDetails } from '@/apis/user';
import Link from 'next/link';
import { ROLE } from '@/helpers/constants';

interface FormValues {
  email: string;
  password: string;
}

function Page() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpVerification] = useState(false);
  const [userEmail] = useState<string>(''); 
  const { setAuthUser } = useAuthUserStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await login(data);
      console.log("Response", response);

      if (response.token) {
        localStorage.setItem('token', response.token);      
        const resp = await getUserDetails();
        console.log(resp);
        setAuthUser(resp.userDetails as AuthUser);
        if(resp?.userDetails?.emailVerified || resp.userDetails.role !== ROLE.employer){
          router.prefetch('/');
          router.push("/");
        }else{
          router.prefetch('/verify');
          router.push("/verify");
        }
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      if ([400, 404].includes(error.status)) {
        toast.error('Looks like your credentials are wrong');
      } else  if ([412].includes(error.status)){
        toast.error('Your account is not approved yet. Our team will approve it shortly');
      }else{
        toast.error('Something went wrong! Please try again later');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <Container>
      <div className={styles.container}>
        {!showForgotPassword && !showOtpVerification ? (
          <Card className={styles.card}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className={styles.cardHeader}>
                <Image src={'/admin.png'} alt='admin' width={80} height={80} />
                <h5 className={styles.header}>SUPER ADMIN</h5>
              </CardHeader>
              <CardBody className={styles.cardBody}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name@example.com"
                    isInvalid={!!errors.email}
                    className={styles.input}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && <Form.Text className='error'>
                    {errors.email.message}
                  </Form.Text>}
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Label>Password</Form.Label>
                  <div className={styles.passwordField}>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      className={styles.input}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 4,
                          message: 'Password must be at least 4 characters',
                        },
                        maxLength: {
                          value: 15,
                          message: 'Password cannot exceed more than 15 characters',
                        },
                      })}
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
                  {errors.password && <Form.Text className='error'>
                    {errors.password.message}
                  </Form.Text>}
                </Form.Group>
                <div className={styles.actionLink}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
                    className={styles.forgotPassword}
                  >
                    Forgot Password?
                  </a>
                  <Link
                    href='/register'
                    className={styles.forgotPassword}
                  >
                    Register as agency
                  </Link>
                </div>
                <Button
                  type="submit"
                  className={`btn ${loading ? 'btn-loading' : ''} ${styles.button}`}
                  disabled={loading}
                >
                  {loading ? <div className={styles.spinner}></div> : 'Sign In'}
                </Button>
              </CardBody>
            </Form>
          </Card>
        ) : showForgotPassword ? (
          <Forgot setShowForgotPassword={setShowForgotPassword} />
        ) : (
          <Otpverification
            email={userEmail}
            onVerificationSuccess={() => router.push('/')}
          />
        )}
      </div>
    </Container>
  );
}

export default Page;
