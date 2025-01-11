'use client';
import Otpverification from "@/app/otpverification/Otpverification";
import { Loader } from "@/components/common/Feedbacks";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const { authUser } = useAuthUserStore();
  const handleOtpSuccess = () => {
    toast.success("OTP Verified Successfully!");
    router.push("/create-agency");
  };
  if(!authUser){
    return <Loader text="Fetching user details"/>
  }
  return (
    <Otpverification
      email={authUser?.email}
      onVerificationSuccess={handleOtpSuccess}
    />
  );
}

export default Page;
