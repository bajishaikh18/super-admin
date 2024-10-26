import { getTokenClaims, isTokenValid } from "@/helpers/jwt";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { NotFound } from "./Feedbacks";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Authorize = ({
  roles,
  children,
}: {
  roles: number[];
  children: any;
}) => {
  const { role, setRole } = useAuthUserStore();
  const router = useRouter();
  if (!role) {
    const tokenDetails = getTokenClaims();
    if (tokenDetails) {
      setRole((tokenDetails as any).role);
    }
  }
  if (!role) {
    return (
      <main className="main-section">
        <div className="d-flex justify-content-center">
          <div className="text-center">
            <NotFound text="Oops looks you are in a wrong page" />

            <Link
              href="/posted-jobs"
              className="btn outlined action-buttons br-normal"
            >
              Go to posted jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }
  if (role && !roles.includes(role)) {
    return router.push('/posted-jobs')
  }
  return children;
};
