import React, { useState, useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "./Otpverification.module.scss";

interface OtpVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  
}

const Otpverification: React.FC<OtpVerificationProps> = ({
  email,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState<number>(90);
  const [isVerifying, setIsVerifying] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer, isResendDisabled]);

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = value;
        return updatedOtp;
      });
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus(); 
      }
    }
  };

  const handleResend = () => {
    setTimer(90);
    setIsResendDisabled(true);
    alert("OTP resent to your email!");
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    setIsVerifying(true);
    setTimeout(() => {
      if (enteredOtp === "123456") {
        onVerificationSuccess();
      } else {
        alert("Invalid OTP");
      }
      setIsVerifying(false);
    }, 1000); 
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h2 className={styles.title}>OTP Verification</h2>
        <p className={styles.description}>
          Please enter the OTP sent to the company registered email ID
        </p>
        <p className={styles.email}>{email}</p>
        <div className={styles["otp-inputs"]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className={styles["otp-input"]}
              value={otp[index]}
              ref={(el) => {
                otpInputRefs.current[index] = el;
              }}
              
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>
        <div className="text-center">
          <p className={`${styles.resendText}`}>
            <span>Didn't get the OTP?</span>
            <span style={{ marginLeft: "10px" }}>
              {isResendDisabled ? (
                <span className={styles.disableResent}>
                
                  Resend {timer}s
                </span>
              ) : (
                <span
                  className={styles.resendLink}
                  onClick={handleResend}
                  style={{ color: "blue" }}
                 
                >
                  Resend
                </span>
              )}
            </span>
          </p>
        </div>
        <div className={styles.jobActions}>
          <Button
            className={styles.CancelButton}
            variant="secondary"
            onClick={() => alert("OTP verification canceled!")}
          >
            Cancel
          </Button>
          <Button
            className={styles.CreateButton}
            onClick={handleSubmit}
            disabled={isVerifying || otp.some((digit) => digit === "")}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Otpverification;
