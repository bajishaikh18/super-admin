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
  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        mobile: `${data.mobileCountryCode}-${data.mobileNumber}`,
        landline: `${data.landlineCountryCode}-${data.landlineNumber}`,
      };
      const response = await registerUser(payload);
      console.log("Response", response);
      if (response.token) {
        localStorage.setItem("token", response.token);
        const resp = await getUserDetails();
        setAuthUser(resp.userDetails as AuthUser);
        router.push('/verify')
      }
    } catch (error: any) {
      setLoading(false);
      if ([400, 404].includes(error.status)) {
        toast.error("Looks like the email is already used. Please contact your agency");
      } else {
        toast.error("Something went wrong! Please try again later");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <Container>
      <div className={styles.container}>
          <Card className={styles.card}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className={styles.cardHeader}>
              <Image src={"/admin.png"} alt="admin" width={80} height={80} />
              <h5 className={styles.header}>BOON.AI</h5>
            </CardHeader>
            <CardBody className={styles.cardBody}>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      isInvalid={!!errors.firstName}
                      className={styles.input}
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                    {errors.firstName && (
                      <Form.Text className="error">
                        {errors.firstName.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      isInvalid={!!errors.firstName}
                      className={styles.input}
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                    {errors.lastName && (
                      <Form.Text className="error">
                        {errors.lastName.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Mobile Number</Form.Label>
                    <InputGroup className={`contact-field`}>
                      <Form.Select
                        className={styles.input}
                        {...register("mobileCountryCode", {
                          required: "Country code is required",
                          onChange: () => trigger("mobileCountryCode"),
                        })}
                      >
                        {Object.values(COUNTRIES).map((country, i) => {
                          return (
                            <option
                              value={country.isdCode}
                              key={country.isdCode}
                            >
                              {country.isdCode}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Control
                        aria-label="Mobile number"
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: {
                            value: phoneRegex,
                            message: "Enter a valid mobile number",
                          },
                          onChange: () => trigger("mobileNumber"),
                        })}
                        isInvalid={!!errors.mobileNumber}
                      />
                    </InputGroup>
                    {errors.mobileNumber && (
                      <Form.Text className="error">
                        {errors.mobileNumber.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Landline Number</Form.Label>
                    <InputGroup className={`contact-field`}>
                      <Form.Select
                        className={styles.input}
                        {...register("landlineCountryCode", {
                          required: "Country code is required",
                          onChange: () => trigger("landlineCountryCode"),
                        })}
                      >
                        {Object.values(COUNTRIES).map((country) => {
                          return (
                            <option
                              value={country.isdCode}
                              key={country.isdCode}
                            >
                              {country.isdCode}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Control
                        aria-label="Landline number"
                        {...register("landlineNumber", {
                          required: "Landline number is required",
                          pattern: {
                            value: phoneRegex,
                            message: "Enter a valid Landline number",
                          },
                          onChange: () => trigger("landlineNumber"),
                        })}
                      />
                    </InputGroup>
                    {errors.landlineNumber && (
                      <Form.Text className="error">
                        {errors.landlineNumber.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="name@example.com"
                      isInvalid={!!errors.email}
                      className={styles.input}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <Form.Text className="error">
                        {errors.email.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Password</Form.Label>
                    <div className={styles.passwordField}>
                      <Form.Control
                        type={"password"}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        className={styles.input}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 4,
                            message: "Password must be at least 4 characters",
                          },
                          maxLength: {
                            value: 15,
                            message:
                              "Password cannot exceed more than 15 characters",
                          },
                        })}
                      />

                     
                    </div>
                    {errors.password && (
                      <Form.Text className="error">
                        {errors.password.message}{" "}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className={styles.formGroup}>
                    <Form.Label>Confirm Password</Form.Label>
                    <div className={styles.passwordField}>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className={styles.input}
                        isInvalid={!!errors.confirmPassword}
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        className={`${styles.togglePasswordIcon} ${
                          showPassword ? styles.hideIcon : ""
                        }`}
                      />
                      <Image
                        src="/eye.png"
                        alt={showPassword ? "Hide password" : "Show password"}
                        onClick={togglePasswordVisibility}
                        className={`${styles.togglePasswordIcon} ${
                          showPassword ? styles.hideIcon : ""
                        }`}
                        width={24}
                        height={24}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <Form.Text className="error">
                        {errors.confirmPassword.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Link href="/register" className={styles.forgotPassword}>
                Login
              </Link>
              <Button
                type="submit"
                className={`btn ${loading ? "btn-loading" : ""} ${
                  styles.button
                }`}
                disabled={loading || !isValid}
              >
                {loading ? <div className={styles.spinner}></div> : "Register"}
              </Button>
            </CardBody>
          </Form>
        </Card>
    </div>
  </Container>
);
}

export default Page;
