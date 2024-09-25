import React, { useState } from "react";
import styles from "../../app/create/page.module.scss";
import usePostJobStore from "@/stores/usePostJobStore";
import { AiOutlineDelete } from "react-icons/ai";

import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";

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
}

const SecondJobScreen: React.FC<SecondJobScreenProps> = ({
  handleBackToPostJobClick,
  handleCreateJobClick,
}) => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    { title: "", experience: "0", salary: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { selectedFacilities, setFormData, formData } = usePostJobStore();

  const handleAddMore = () => {
    const jobPositionsFromForm = getValues("jobPositions");
    const lastPosition = jobPositionsFromForm[jobPositions.length - 1];
    if (
      !lastPosition.deleted &&
      (lastPosition.title.trim() === "" ||
        lastPosition.experience.trim() === "")
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

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setFormData(data);
      const payload = {
        ...data,
        ...formData,
        facilities: selectedFacilities,
      };
      console.log(payload);
      setLoading(true);
      handleCreateJobClick();
    } catch (error) {
    } finally {
    }
  };
  // const handleSubmit = async () => {
  //   // if (contactNumber.length !== 10 || (showAlternateMobile && alternateMobile.length !== 10)) {
  //   //   setErrorMessage("Please enter valid 10-digit mobile numbers.");
  //   //   return;
  //   // }

  //   try {
  //     // const jobData = {
  //     //   agencyId: "CodeCraft",
  //     //   location: "India", // Replace with actual location
  //     //   min_Salary: salaryFrom,
  //     //   max_Salary: salaryTo,
  //     //   currency: "USD", // Replace with actual currency if needed
  //     //   expiry: expiryDate,
  //     //   imageUrl: "some url", // Replace with actual image URL if needed
  //     //   jobType: "fulltime", // Adjust based on selection
  //     //   positions: jobPositions.map(position => ({
  //     //     positionId: "someId", // Set this according to your requirements
  //     //     experience: position.experience,
  //     //     min_Salary: position.salary,
  //     //     max_Salary: position.salary,
  //     //   })),
  //     //   amenties: selectedFacilities,
  //     //   contactNumbers: [contactNumber, showAlternateMobile ? alternateMobile : undefined].filter(Boolean),
  //     //   email,
  //     //   description,
  //     // };

  //     // await axios.post(`${BASE_URL}/jobs`, jobData, {
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     // });
  //     console.log('Job created successfully');
  //     handleCreateJobClick(); // Trigger your job creation success logic
  //   } catch (error: unknown) {
  //     if (axios.isAxiosError(error)) {
  //       setErrorMessage(error.response?.data?.message || "Error creating job");
  //     } else {
  //       setErrorMessage("An unexpected error occurred");
  //     }
  //   }
  // };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create a Job (2/2)</h2>
        <button
          className={styles.closeButton}
          onClick={handleBackToPostJobClick}
        >
          &times;
        </button>
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>Your job is creating please wait</p>
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
                        <Form.Select
                          className={styles.input}
                          {...register(`jobPositions.${index}.title`, {
                            required: "Job title is required",
                          })}
                        >
                          <option value="Engineer">Engineer</option>
                          <option value="Plumber">Plumber</option>
                          <option value="Carpenter">Carpenter</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          className={styles.input}
                          {...register(`jobPositions.${index}.experience`, {
                            required: "Job Experience is required",
                          })}
                        >
                          <option value="1">0-1 Years</option>
                          <option value="2">1-2 Years</option>
                          <option value="5">2-5 Years</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="0-0"
                          className={styles.input}
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
            <InputGroup className={`mb-3 contact-field`}>
              <Form.Select
                className={styles.input}
                {...register("countryCode", {
                  required: "Agency is required",
                })}
              >
                <option value="1">+91</option>
                <option value="2">+94</option>
                <option value="3">+99</option>
              </Form.Select>
              <Form.Control
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
            <Form.Control as="textarea" rows={3} {...register("description")} />
          </Form.Group>
          <div className={styles.actions}>
            <Button
              type="button"
              className={`outlined ${styles.actionButtons}`}
              onClick={handleBackToPostJobClick}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${styles.actionButtons} ${
                true ? "" : styles.disabled
              }`}
              disabled={!true}
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
