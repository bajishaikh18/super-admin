"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "../common/styles/Details.module.scss";
import agencyStyles from "./Agency.module.scss";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa6";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  Modal,
  Row,
} from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { Loader, NotFound } from "../common/Feedbacks";
import toast from "react-hot-toast";
import usePostJobStore from "@/stores/usePostJobStore";
import { AgencyType } from "@/stores/useAgencyStore";
import { deleteAgencyAPI, getAgencyByAdminId, updateAgency } from "@/apis/agency";
import Link from "next/link";
import { AgencyJobPostings } from "./AgencyJobPostings";
import CreateAgency from "../create-agency/CreateAgency";
import { IMAGE_BASE_URL } from "@/helpers/constants";
import { INDIAN_STATES } from "@/helpers/stateList";
import { MapView } from "../common/MapView";


type PostedJobDetailsProps = {
  agencyId: string;
};

const AgencyDetails: React.FC<PostedJobDetailsProps> = ({ agencyId }) => {
  const queryClient = useQueryClient();
  const { refreshImage } = usePostJobStore();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["agencyDetails", agencyId],
    queryFn: () => {
      if (agencyId) {
        return getAgencyByAdminId(agencyId);
      }
      throw new Error("jobId is null or undefined");
    },
    enabled: !!agencyId,
  });

  const { _id, regNo, name,latitude,longitude, address,phone,postedJobs,profilePic,city,state, website, email, status,activeJobCount,expiredJobCount } =
    (data?.agency as AgencyType) || {};

  const goBack = () => {
    router.back();
  };

  

  const changePostStatus = useCallback(async () => {
    try {
      let newStatus;
      switch (status) {
        case "active":
          newStatus = "inactive";
          break;
        case "inactive":
          newStatus = "active";
          break;
        default:
          newStatus = "";
          break;
      }
      if (newStatus) {
        await updateAgency(_id, { status: newStatus });
        await queryClient.invalidateQueries({
          queryKey: ["agencyDetails", agencyId],
          refetchType: "all",
        });
      }
      toast.success("Agency status changed successfully");
    } catch (e) {
      toast.error("Error while deactivating agency. Please try again");
      return;
    }
  }, [status, agencyId]);

  
  const deleteAgency = useCallback(async () => {
    try {
      await deleteAgencyAPI(_id, { isDeleted: true });
      router.push("/agency");
      await queryClient.invalidateQueries({
        queryKey: ["agencyDetails", agencyId],
        refetchType: "all",
      });
      toast.success("Agency deleted successfully");
    } catch (e) {
      toast.error("Error while deleting agency. Please try again");
      return;
    }
  }, [agencyId, _id]);


  if (isLoading) {
    return (
      <main className="main-section">
        <Loader text="Loading agency details" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="main-section">
        <NotFound text="Oops!, looks like agency details are not present" />
      </main>
    );
  }
  if (isError) {
    return (
      <main className="main-section">
        <NotFound text="Something went wrong while accessing agency details. Please try again" />
      </main>
    );
  }


  return (
    <main className="main-section">
      <Container fluid>
        <h3 onClick={goBack} className={styles.backlink}>
          <FaChevronLeft fontSize={16} color="#000" />
          Agency Details ({agencyId})
        </h3>

        <Row>
          <Col lg={4}>
            <Card className={styles.summaryCard}>
              <CardHeader className={agencyStyles.summaryCardHeader}>
                <div className={styles.agencyDetails}>
                  <Image
                    src={`${profilePic ? `${IMAGE_BASE_URL}/${profilePic}?ts=${refreshImage ? new Date().getTime() : ''}`: '/no_image.jpg'}`}
                    width={66}
                    height={66}
                    alt="agency-logo"
                  />
                  <div>
                    <div className={styles.agencyNameContainer}>
                      <h2 className={styles.agencyName}>{name}</h2>
                      <Image
                        src="/verified.svg"
                        width={13}
                        height={13}
                        alt="agency-logo"
                      />
                    </div>
                    <p className={agencyStyles.regNo}>
                      {regNo || "REG No: B-1853/MUM/COM/1000+/5/0242/2023 "}
                    </p>
                  </div>
                </div>
                <h5 className={`${agencyStyles.approvedText} success`}>
                  Approved by Ministry of External affairs Govt of India
                </h5>
              </CardHeader>
              <CardBody className={styles.summaryCardBody}>
              <ul className={`${styles.jobInfoList} ${agencyStyles.agencyInfoList}`}>
                  <li>
                    <Image
                      src={"/suitcase.png"}
                      width={24}
                      height={20}
                      alt="clock"
                    />
                    <span>{postedJobs} Jobs Posted</span>
                  </li>
                </ul>
                <div className={agencyStyles.addressSection}>
                    <h3>Address</h3>
                    <p>{address}, {city || ""}, {INDIAN_STATES.find(x=>x.state_code===state)?.name || state || ""}</p>
                    {
                    address && <MapView address={address} latitude={latitude} longitude={longitude} />
                    }
                </div>
                <div className={agencyStyles.contactSection}>
                    <h3>Contact</h3>
            <ul className={`${styles.jobInfoList} ${agencyStyles.agencyContactList}`}>
                  <li>
                    <Image
                      src={"/phone.svg"}
                      width={16}
                      height={16}
                      alt="phone"
                    />
                    <a href={`tel:${phone}`}>{phone}</a>

                  </li>
                  <li>
                    <Image
                      src={"/mail.svg"}
                      width={16}
                      height={16}
                      alt="mail"
                    />
                    <a href={`mailto:${email}`}>{email}</a>

                  </li>
                  {
                    website &&<li>
                    <Image
                      src={"/globe.svg"}
                      width={16}
                      height={16}
                      alt="mail"
                    />
                    <a href={`${website?.includes("http") ? website : `http://${website}`}`}>{website}</a>

                  </li>
                  }
                  
                </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className={styles.detailsCard}>
              <CardHeader className={styles.detailsCardHeader}>
                <div  className={agencyStyles.detailInfoHeader}>
                 <h3>Jobs Posted by {name} ({postedJobs})</h3>
                 <div>
                    <Image src={"/share.svg"} width={20} height={20} alt="applications received"/>
                    <p>Total applications received <Link href={`/users/applied/${agencyId}?type=agency`}>{data?.applicationCount}</Link></p>
                 </div>
                </div>
                <div className={styles.actionContainer}>
                  <Button
                    className={`action-buttons ${styles.editButton}`}
                    onClick={() => setOpenEdit(true)}
                  >
                    Edit Agency Details
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle
                      className={styles.dropdownButton}
                      variant="success"
                      id="dropdown-basic"
                    >
                      <BsThreeDots fontSize={24} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {status != "expired" && (
                        <Dropdown.Item onClick={changePostStatus}>
                          {status === "active"
                            ? " De-activate Agency"
                            : "Activate Agency"}
                        </Dropdown.Item>
                      )}

                      <Dropdown.Item className="danger" onClick={deleteAgency}>
                        Delete Agency
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </CardHeader>
              <CardBody className={agencyStyles.detailCardBody}>
                    <AgencyJobPostings agencyId={_id} postedJobs={postedJobs} activeJobCount={activeJobCount} expiredJobCount={expiredJobCount}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal
        show={openEdit}
        onHide={() => setOpenEdit(false)}
        centered
        backdrop="static"
      >
        {openEdit && (
          <CreateAgency
            handleModalClose={() => setOpenEdit(false)}
            agencyDetails={data?.agency}
          />
        )}
      </Modal>
    </main>
  );
};

export default AgencyDetails;
