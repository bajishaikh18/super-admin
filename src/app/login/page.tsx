'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./page.module.scss";
import Forgot from '../../components/login/Forgot';
import { login } from '@/apis/auth';
import { Button, Card, CardBody, CardHeader, Container, Form } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthUser, useAuthUserStore } from '@/stores/useAuthUserStore';
import { getUserDetails } from '@/apis/user';

interface FormValues {
  email: string;
  password: string;
}

function Page() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthUserStore()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await login(data);
      console.log("Respone",response);
      if (response.token) { 
        localStorage.setItem('token', response.token);
        const resp = await getUserDetails();
        setAuthUser(resp.userDetails as AuthUser)
        router.push('/'); 
        setLoading(false);
     }
    } catch (error:any) {
      setLoading(false);
      if(error.status === 404){
        toast.error('Looks like credentials are wrong')
      }else{
        toast.error('Something went wrong! Please try again later')
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
      {!showForgotPassword ? (
        <Card className={styles.card}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className={styles.cardHeader}>
            <Image src={'/admin.png'} alt='admin' width={80} height={80}/>
            <h5 className={styles.header}>SUPER ADMIN</h5>
            </CardHeader>
            <CardBody className={styles.cardBody}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="name@example.com"                 isInvalid={!!errors.email}
 className={styles.input}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}/>
              {errors.email &&  <Form.Text className='error'>
                {errors.email.message}
                </Form.Text>}
            </Form.Group>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Password</Form.Label>
                <div className={styles.passwordField}>
                <Form.Control  type={showPassword ? 'text' : 'password'}
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
                    })}/>
                  
                  <span
                    onClick={togglePasswordVisibility}
                    className={`${styles.togglePasswordIcon} ${showPassword ? styles.hideIcon : ''}`}>
                  </span>
                  <Image
                    src="/eye.png"
                    alt={showPassword ? 'Hide password' : 'Show password'}
                    onClick={togglePasswordVisibility}
                    className={`${styles.togglePasswordIcon} ${showPassword ? styles.hideIcon : ''}`} 
                    width={24}  
                    height={24}
                  />
                </div>
                {errors.password &&  <Form.Text className='error'>
                  {errors.password.message}                </Form.Text>}
              </Form.Group>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
                className={styles.forgotPassword}
              >
                Forgot Password?
              </a>
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
      ) : (
        <Forgot setShowForgotPassword={setShowForgotPassword} />
      )}
    </div>
    </Container>
    
  );
}

export default Page;