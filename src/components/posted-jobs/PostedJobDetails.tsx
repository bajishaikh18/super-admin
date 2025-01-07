"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobDetails, updateJob } from "@/apis/job";
import styles from "../common/styles/Details.module.scss";
import Image from "next/image";

import { FaChevronLeft } from "react-icons/fa6";
import DeleteModal from "../common/delete/DeleteModal";
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
import { DateTime } from "luxon";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { COUNTRIES, FACILITIES_IMAGES, IMAGE_BASE_URL, ROLE, YEARS_OF_EXPERIENCE_LABELS } from "@/helpers/constants";
import { FullScreenImage } from "../common/FullScreenImage";
import { Loader, NotFound } from "../common/Feedbacks";
import CreateJob from "../create-job/CreateJob";
import toast from "react-hot-toast";
import usePostJobStore from "@/stores/usePostJobStore";
import { LuExpand } from "react-icons/lu";
import { useAuthUserStore } from "@/stores/useAuthUserStore";

type PostedJobDetailsProps = {
  jobId: string;
};

const PostedJobDetails: React.FC<PostedJobDetailsProps> = ({
  jobId,
}) => {
  const queryClient = useQueryClient()
  const [isFullScreen, setIsFullScreen] = useState(false);
  const {refreshImage} = usePostJobStore();
  const router = useRouter();
  const [openEdit,setOpenEdit ]= useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {shouldVisible, authUser} = useAuthUserStore();
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => {
      if (jobId) {
        return getJobDetails(jobId);
      }
      throw new Error("jobId is null or undefined");
    },
    enabled: !!jobId,
  });

  const {
    _id,
    createdAt,
    expiry,
    agencyId,
    imageUrl,
    location,
    positions,
    contactNumbers,
    email,
    numberofApplications,
    viewed,
    status,
    jobCreator,
    description,
    savedBy,
    amenities,
  } = data?.job || {};
  const goBack = () => {
    router.push('/posted-jobs');
  };

  const changePostStatus = useCallback(async ()=>{
    try{
      let newStatus;
      switch(status){
        case "active" : newStatus = "pending";
                        break;
        case "pending" :newStatus = "active";
                        break;
        default :newStatus = "";
                        break;
      }
      if(newStatus){
        await updateJob(_id,{status:newStatus});
        await queryClient.invalidateQueries({
          queryKey:["jobDetails",jobId],
          refetchType:'all'
        })
      }
      toast.success("Job status changed successfully");
    }catch{
      toast.error("Error while deleting job. Please try again");
      return
    }
  },[status,jobId])


  const deletePost = useCallback(async ()=>{
    setDeleteLoading(true);
    try{
        await updateJob(_id,{isDeleted:true});
        router.push("/posted-jobs")
        await queryClient.invalidateQueries({
          queryKey:["jobDetails",jobId],
          refetchType:'all'
        })
      toast.success("Job deleted changed successfully");
    }catch{
      toast.error("Error while deleting job. Please try again");
      return
    }
  },[jobId,_id])
  

  if (isLoading) {
    return <main className="main-section"><Loader text="Loading job details"/></main>;
  }

  if (!data) {
    return <main className="main-section"><NotFound text="Oops!, looks like job details are not present"/></main>;
  }
  if (isError) {
    return <main className="main-section"><NotFound text="Something went wrong while accessing job details. Please try again"/></main>;
  }



  return (
    <main className="main-section">
      <Container fluid>
        <h3 onClick={goBack} className={styles.backlink}>
          <FaChevronLeft fontSize={16} color="#000" />
          Job Posting Details ({jobId})
        </h3>

        <Row>
          <Col lg={4}>
            <Card className={styles.summaryCard}>
              <CardBody className={styles.summaryCardBody}>
                <div className={styles.imageContainer}>
                  <Image
                    src={`${imageUrl ? `${IMAGE_BASE_URL}/${imageUrl}?ts=${refreshImage ? new Date().getTime() : ''}`: '/no_image.jpg'}`}
                    alt="Rectangle"
                    height={0}
                    blurDataURL="/no_image.jpg"
                    width={800}
                    style={{ height: "auto", width: "100%" }}
                    className={styles.buttonIcon}
                  />
                  <button className="expand-button">
                  <LuExpand  size={25}
                      onClick={() => setIsFullScreen(true)}/>
                  </button>
                </div>
                <ul className={styles.jobInfoList}>
                  <li>
                    <Image
                      src={"/clock.svg"}
                      width={18}
                      height={18}
                      alt="clock"
                    />
                    Posted on{" "}
                    {DateTime.fromISO(createdAt).toFormat("dd-MMM-yyyy")}
                  </li>
                  <li>
                    <Image
                      src={"/expiry-icon.svg"}
                      width={18}
                      height={18}
                      alt="expiry"
                    />
                    Valid till{" "}
                    {DateTime.fromISO(expiry).toFormat("dd-MMM-yyyy")}
                  </li>
                  <li>
                    <Image
                      src={"/view.svg"}
                      width={18}
                      height={18}
                      alt="view"
                    />
                    Viewed by {viewed} candidates
                  </li>
                  <li>
                    <Image
                      src={"/applied.svg"}
                      width={18}
                      height={18}
                      alt="applie"
                    />
                    Applied by <Link href={`/users/applied/${jobId}?type=job`}>{numberofApplications || 0} Candidates</Link>
                  </li>
                  <li>
                    <Image
                      src={"/applied.svg"}
                      width={18}
                      height={18}
                      alt="applie"
                    />
                    Saved by <Link href={`/users/saved/${jobId}?type=job`}>{savedBy || 0} Candidates</Link>
                  </li>
                </ul>
                <ul className={styles.footerInfo}>
                  <li>
                    <Image
                      src={"/clock.svg"}
                      width={18}
                      height={18}
                      alt="clock"
                    />
                    {DateTime.fromISO(createdAt).toFormat("dd-MMM-yyyy")}
                  </li>
                  <li>
                    <Image
                      src={"/expiry-icon.svg"}
                      width={18}
                      height={18}
                      alt="expiry"
                    />
                    Valid till{" "}
                    {DateTime.fromISO(expiry).toFormat("dd-MMM-yyyy")}
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className={styles.detailsCard}>
              <CardHeader className={styles.detailsCardHeader}>
                <div className={styles.agencyDetails}>
                <Image
                    src={`${agencyId?.profilePic ? `${IMAGE_BASE_URL}/${agencyId?.profilePic}`: '/no_image.jpg'}`}
                    width={55}
                    height={55}
                    alt="agency-logo"
                  />
                  <div>
                    <div className={styles.agencyNameContainer}>
                      <h2 className={styles.agencyName}>{agencyId?.name}</h2>
                      <Image
                        src="/verified.svg"
                        width={13}
                        height={13}
                        alt="agency-logo"
                      />
                    </div>
                    <p>
                      Approved by Ministry of external affairs Govt of India
                    </p>
                  </div>
                </div>
                <div className={styles.actionContainer}>
                   {
                    (shouldVisible([ROLE.superAdmin]) ||
                                      jobCreator === authUser?._id) && <>
                  <Button className={`action-buttons ${styles.editButton}`} onClick={()=>setOpenEdit(true)}>
                    Edit Post
                  </Button>
                    <Dropdown>
                      <Dropdown.Toggle className={styles.dropdownButton} variant="success" id="dropdown-basic">
                        <BsThreeDots fontSize={24} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
            {shouldVisible([ROLE.superAdmin]) && (
                        <>
                        {
                          status != 'expired' &&  <Dropdown.Item onClick={changePostStatus}>
                          {
                            status === "active" ? " De-activate Post": "Activate Post"
                          }
                           
                          </Dropdown.Item>
                        }
                      </>)}
                      <DeleteModal
        showModal={isDeleteModalOpen}
        handleClose={handleCloseDeleteModal}
        deleteLoading={deleteLoading}
        handleDelete={deletePost}
      />
                       <Dropdown.Item className="danger" onClick={handleOpenDeleteModal}>
                           Delete Post
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </>}
                </div>
              </CardHeader>
              <CardBody className={styles.detailsCardBody}>
                <h5>
                  <span>Working Location</span> {COUNTRIES[location as "bh"]?.label || location || "N/A" }
                </h5>
                <h5>
                  <span>Contact Mobile</span> {contactNumbers.join(", ")}
                </h5>
                <h5>
                  <span>Contact Email</span> {email}
                </h5>
                <div className={styles.line}></div>
                <div className={styles.positions}>
                  <h3>Positions</h3>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(
                        (
                          position: {
                            jobTitleId: number;
                            title: string;
                            experience: string;
                            salary: string;
                          },
                          
                        ) => (
                          <tr key={position.jobTitleId}>
                            <td className={styles.title}>{position.title}</td>
                            <td>{YEARS_OF_EXPERIENCE_LABELS?.find(yoe=>yoe?.value == position?.experience)?.label}</td>
                            <td>{position.salary}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={styles.line}></div>
                <div className={styles.jobDescription}>
                  <h3>Job Description</h3>
                  <p>{description || "N/A"}</p>
                  <ul className={styles.benefits}>
                    {amenities.map((amenity: string, index: number) => (
                      <li key={index}>
                        <Image
                          src={FACILITIES_IMAGES[amenity as "Food"]}
                          alt={amenity}
                          width={14}
                          height={14}
                        />{" "}
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <FullScreenImage
        isOpen={isFullScreen}
        handleClose={() => {
          setIsFullScreen(false);
        }}
        imageUrl={imageUrl}
      />
       <Modal show={openEdit} onHide={()=>setOpenEdit(false)} centered backdrop="static">
        {openEdit && <CreateJob handleModalClose={()=>setOpenEdit(false)} jobDetails={data.job} />}
      </Modal>
    </main>
  );
};

export default PostedJobDetails;
