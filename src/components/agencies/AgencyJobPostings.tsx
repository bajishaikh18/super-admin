import { getJobs } from "@/apis/job";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader, NotFound } from "../common/Feedbacks";
import agencyStyles from "./Agency.module.scss";
import { Button, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { JobType } from "../posted-jobs/PostedjobsTable";
import Image from "next/image";
import {
  COUNTRIES,
  FACILITIES_IMAGES,
  IMAGE_BASE_URL,
} from "@/helpers/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlineInfoCircle } from "react-icons/ai";

type AgencyJobPostingsType = {
  agencyId: string;
  postedJobs: number;
  activeJobCount: number;
  expiredJobCount: number;
};

type TabType = "active" | "expired";

const JobCard = ({
  type,
  agencyId,
  postedJobs,
}: {
  type: TabType;
  agencyId: string;
  postedJobs: number;
}) => {
  const router = useRouter();
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["jobs", agencyId, type],
    queryFn: () => {
      if (agencyId) {
        return getJobs(type, 0, postedJobs, agencyId, "agencyId");
      }
    },
    retry: 3,
  });

  if (isLoading || isFetching) {
    return <Loader text={`Fetching ${type} jobs`} />;
  }
  if (error) {
    return (
      <NotFound text={`Something went wrong while fetching ${type} jobs`} />
    );
  }
  if (!data || !data?.jobs || data?.jobs?.length === 0) {
    return <NotFound text={`No ${type} jobs found for the agency`} />;
  }

  const handleJobDetails = (id: string) => {
    router.push(`/posted-jobs/${id}`);
  };

  return (
    <>
      {data.jobs.map((job: JobType) => {
        return (
          <>
            <Row className={agencyStyles.jobContainer}>
              <Col md={5} className={agencyStyles.jobColumn}>
                <Image
                  src={`${
                    job.imageUrl
                      ? `${IMAGE_BASE_URL}/${job.imageUrl}`
                      : "/no_image.jpg"
                  }`}
                  alt="Rectangle"
                  height={305}
                  width={800}
                  blurDataURL="/no_image.jpg"
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </Col>
              <Col md={7} className={agencyStyles.agencyJobDetailsContainer}>
                <div>
                  <div className={agencyStyles.heading}>
                    <h3>
                      Jobs for {COUNTRIES[job.location as "bh"].label}{" "}
                      <span>
                        Approved{" "}
                          <AiOutlineInfoCircle fontSize={16} />
                      </span>
                    </h3>
                    <ul>
                      <li>{COUNTRIES[job.location as "bh"].label}</li>
                    </ul>
                  </div>
                  <div className={agencyStyles.facilities}>
                    <ul>
                      {job.amenities.map((amenity: string, index: number) => (
                        <li key={index}>
                          <Image
                            src={FACILITIES_IMAGES[amenity as "Food"]}
                            alt={amenity}
                            width={16}
                            height={16}
                          />{" "}
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href={`/posted-jobs/${job.jobId}`}
                  className={`outlined action-buttons ${agencyStyles.button}`}
                  onClick={() => handleJobDetails(job.jobId)}
                >
                  View Job Details
                </Link>
              </Col>
            </Row>
            <hr className={agencyStyles.separator} />
          </>
        );
      })}
    </>
  );
};

export const AgencyJobPostings: React.FC<AgencyJobPostingsType> = ({
  agencyId,
  postedJobs,
  activeJobCount,
  expiredJobCount,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className={`header-row ${agencyStyles.headerRow}`}>
        <div className={"tab-container"}>
          <button
            className={`tab-button ${activeTab === "active" ? "active" : ""}`}
            onClick={() => handleTabClick("active")}
          >
            Active ({activeJobCount})
          </button>
          <button
            className={`tab-button ${activeTab === "expired" ? "active" : ""}`}
            onClick={() => handleTabClick("expired")}
          >
            Expired ({expiredJobCount})
          </button>
        </div>
      </div>
      <div className="">
        {
          {
            active: (
              <JobCard
                type="active"
                agencyId={agencyId}
                postedJobs={postedJobs}
              />
            ),
            expired: (
              <JobCard
                type="expired"
                agencyId={agencyId}
                postedJobs={postedJobs}
              />
            ),
          }[activeTab]
        }
      </div>
    </>
  );
};
