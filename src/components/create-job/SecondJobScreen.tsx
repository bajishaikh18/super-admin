import React, { useEffect, useState } from "react";
import styles from "./CreateJob.module.scss";
import usePostJobStore from "@/stores/usePostJobStore";
import { AiOutlineDelete } from "react-icons/ai";

import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";
import { IoClose } from "react-icons/io5";

interface JobPosition {
  title: string;
  experience: string;
  salary: string;
  deleted?: string;
}

interface FormValues {
  contactNumber: string;
  email: string;
  countryCode: string;
  jobPositions: JobPosition[];
  description?: string;
}
interface SecondJobScreenProps {
  handleBackToPostJobClick: () => void;
  handleCreateJobClick: () => void;
  handleClose: () => void;
}

const SecondJobScreen: React.FC<SecondJobScreenProps> = ({
  handleBackToPostJobClick,
  handleCreateJobClick,
  handleClose
}) => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    { title: "", experience: "0", salary: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { selectedFacilities, setFormData, formData } = usePostJobStore();

  useEffect(()=>{
    if(formData?.jobPositions){
      setJobPositions(formData.jobPositions);
    }
  },[formData])
  const handleAddMore = () => {
    const jobPositionsFromForm = getValues("jobPositions");
    const lastPosition = jobPositionsFromForm[jobPositions.length - 1];
    if (
      !lastPosition.deleted &&
      (!lastPosition.title || !lastPosition.experience)
    ) {
      setErrorMessage(
        "Please fill in all fields before adding a new position."
      );
      return;
    }
    setErrorMessage("");
    const newPositions = [
      ...jobPositions,
      { title: "", experience: "0", salary: "" },
    ];
    setJobPositions(newPositions);
    // setGlobalJobPositions(newPositions);
  };

  const handleRemove = (index: number) => {
    setValue(`jobPositions.${index}.title`, "");
    setValue(`jobPositions.${index}.experience`, "");
    setValue(`jobPositions.${index}.salary`, "");
    setValue(`jobPositions.${index}.deleted`, "true");
    setErrorMessage("");

    const newPositions = jobPositions.map((x, i) => {
      if (i === index) {
        return {
          ...x,
          deleted: "true",
        };
      }
      return x;
    });
    setJobPositions(newPositions);
    // setGlobalJobPositions(newPositions);
  };

  const jobTitle = [
    { label: "Engineer", value: "Engineer" },
    { label: "Doctor", value: "Doctor" },
    { label: "Plumber", value: "Plumber" },
    { label: "Electrician", value: "Electrician" },
  ];

  const experienceLevels = [
    { label: "0", value: "0 Years" },
    { label: "1", value: "0-1 Year" },
    { label: "2", value: "1-2 Years" },
    { label: "3", value: "3-4 Years" },
  ];

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    formState: { errors,isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setFormData(data);
      const payload = {
        ...data,
        ...formData,
        jobPositions: jobPositions.filter(x=>!x.deleted),
        facilities: selectedFacilities,
      };
      console.log(payload);
      setLoading(true);
      handleCreateJobClick();
    } catch (error) {
    } finally {
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create a Job (2/2)</h2>
        <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        >
          
        </IoClose> 
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Your job is creating please wait
          </p>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className={styles.formGroup}>
            <label className={styles.formLabel}>Add positions</label>
            <Table>
              <thead>
                <tr>
                  <th className="w-50">Job Title</th>
                  <th className="w-30">Exp Required</th>
                  <th className="w-20">Salary</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobPositions.map((position, index) => {
                  if (position.deleted) {
                    return null;
                  }
                  return (
                    <tr key={index}>
                      <td>
                        <MultiSelect
                          name={`jobPositions.${index}.title`}
                          control={control}
                          error={errors[`jobPositions.${index}.title`] as any}
                          options={jobTitle}
                          defaultValue={formData?.jobPositions?.[index]?.title}
                          rules={{ required: "Job title is required" }}
                          customStyles={{
                            border: "none !important",
                            boxShadow: "none !important",
                            fontSize: "14px",
                            "&:focus": {
                              border: "none",
                            },
                          }}
                        />
                      </td>
                      <td>
                        <MultiSelect
                          name={`jobPositions.${index}.experience`}
                          control={control}
                          error={
                            errors[`jobPositions.${index}.experience`] as any
                          }
                          options={experienceLevels}
                          defaultValue={
                            formData?.jobPositions?.[index]?.experience
                          }
                          rules={{ required: "Job Experience is required" }}
                          customStyles={{
                            border: "none !important",
                            boxShadow: "none !important",
                            fontSize: "14px",
                            "&:focus": {
                              border: "none",
                            },
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="0-0"
                          className={styles.input}
                          defaultValue={formData?.jobPositions?.[index]?.salary}
                          {...register(`jobPositions.${index}.salary`, {})}
                        />
                      </td>
                      <td>
                        {index != 0 && (
                          <AiOutlineDelete
                            className={styles.positionDelete}
                            onClick={() => handleRemove(index)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {errorMessage && (
              <div>
                <Form.Text className="error">{errorMessage}</Form.Text>
              </div>
            )}

            <button
              type="button"
              className={styles.addMoreButton}
              onClick={handleAddMore}
            >
              Add More
            </button>
          </Form.Group>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Contact Mobile Number</Form.Label>
            <InputGroup className={`contact-field`}>
              <Form.Select
                className={styles.input}
                {...register("countryCode", {
                  required: "Agency is required",
                })}
                defaultValue={formData?.countryCode}
              >
                <option value="1">+91</option>
                <option value="2">+94</option>
                <option value="3">+99</option>
              </Form.Select>
              <Form.Control
                defaultValue={formData?.contactNumber}
                aria-label="Contact number"
                {...register("contactNumber", {
                  required: "Contact number is required",
                })}
              />
            </InputGroup>
            {errors.contactNumber && (
              <Form.Text className="error">
                {errors.contactNumber.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Contact Email Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email Id"
              className={styles.input}
              defaultValue={formData?.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <Form.Text className="error">{errors.email.message}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={formData?.description}
              {...register("description")}
            />
          </Form.Group>
          <div className={styles.actions}>
            <Button
              type="button"
              className={`outlined ${styles.actionButtons}`}
              onClick={handleBackToPostJobClick}
            >
              Back
            </Button>
            <Button
              type="submit"
              className={`${styles.actionButtons} ${
                isValid ? "" : styles.disabled
              }`}
              disabled={!isValid}
            >
              Create a Job
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default SecondJobScreen;
