import React, { useState, useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "./Otpverification.module.scss";
import { resendOtp, verifyEmail } from "@/apis/auth";
import { getUserDetails } from "@/apis/user";
import { AuthUser, useAuthUserStore } from "@/stores/useAuthUserStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OtpVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
}

const Otpverification: React.FC<OtpVerificationProps> = ({
  email}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState<number>(90);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showActivationMessage, setShowActivationMessage] = useState(false);
  const {setAuthUser} = useAuthUserStore();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
 const router = useRouter();
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

  const handleResend = async () => {
    try{
      await resendOtp({email:email})
      setTimer(90);
      setIsResendDisabled(true);
      toast.success("OTP resent successfully")

    }catch(e){
      toast.error("Error while resending otp. try again")
    }
  };

  const handleSubmit = async () => {
    try{
      const enteredOtp = otp.join("");
      setIsVerifying(true);
      await verifyEmail({email: email, otp:enteredOtp});
      const resp = await getUserDetails();
      toast.success("Email verified successfully")
      setIsVerifying(false);
      if(resp.status === "active"){
        setAuthUser(resp.userDetails as AuthUser)
        router.push("/posted-jobs")
      }else{
        setAuthUser(null)
        setShowActivationMessage(true);
      }
    }catch(e:any){
      if(e.status === 401){
        toast.error("Entered otp is invalid please try with valid otp");
      }else{
        toast.error("Something went wrong while verifiying email");
      }
      setIsVerifying(false);
    }
    
  };

  const handleBackToLogin = ()=>{
    router.push("/login")
  }

  return (
    <div className={styles.container}>
      
        {
          showActivationMessage ? <Card className={`${styles.card} ${styles.cardReview}`}>
            <h2 className={styles.title}>Under Review</h2>
            <p className={styles.description}>
            Your account is under review. You will be able to login only after approval.
          </p>
          <p className={styles.description}> Once approved you will be notified on your registered email regarding next steps.</p>
          <div className={styles.jobActions}>
            <Button
              className={styles.CreateButton}
              onClick={handleBackToLogin}
            >
              Back to login
            </Button>
          </div>
          </Card>:<Card className={styles.card}><h2 className={styles.title}>OTP Verification</h2>
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
              <span>Didn&apos;t get the OTP?</span>
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
              className={styles.CreateButton}
              onClick={handleSubmit}
              disabled={isVerifying || otp.some((digit) => digit === "")}
            >
              {isVerifying ? <div className={styles.spinner}></div> : "Verify Email"}
            </Button>
          </div></Card>
        }
       
    </div>
  );
};

export default Otpverification;
