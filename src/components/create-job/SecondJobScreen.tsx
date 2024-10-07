import React, { useEffect, useState } from "react";
import styles from "./CreateJob.module.scss";
import usePostJobStore from "@/stores/usePostJobStore";
import { AiOutlineDelete } from "react-icons/ai";

import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import { MultiSelect, MultiSelectAsync } from "../common/form-fields/MultiSelect";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";
import { IoClose } from "react-icons/io5";
import { getJobTitles, getSignedUrl, uploadFile } from "@/apis/common";
import toast from "react-hot-toast";
import { createJob } from "@/apis/job";
import { COUNTRIES } from "@/helpers/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFormattedJobTitles } from "@/helpers/jobTitles";

interface JobPosition {
  title: {
    value:string,
    label:string,
  };
  experience: string;
  salary: string;
  deleted?: string;
}

interface FormValues {
  contactNumber: string;
  altContactNumber: string;
  altCountryCode : string;
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
const phoneRegex = /^[0-9]{10}$/

const SecondJobScreen: React.FC<SecondJobScreenProps> = ({
  handleBackToPostJobClick,
  handleCreateJobClick,
  handleClose
}) => {
  const queryClient = useQueryClient()
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    { title: {value:"",label:""}, experience: "0", salary: "" },
  ]);

  const createJobMutation = useMutation({
    mutationFn: createJob
  })
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { selectedFacilities, setFormData,selectedFile, formData, setNewlyCreatedJob } = usePostJobStore();

  useEffect(()=>{
    if(formData?.jobPositions){
      setJobPositions(formData.jobPositions);
    }
  },[formData])
  
  const handleAddMore = () => {
    const jobPositionsFromForm = getValues("jobPositions");
    console.log(jobPositionsFromForm)
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
      { title: {value:"",label:""}, experience: "0", salary: "" },
    ];
    setJobPositions(newPositions);
    // setGlobalJobPositions(newPositions);
  };

  const handleRemove = (index: number) => {
    setValue(`jobPositions.${index}.title`, {"value":"","label":""});
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
    { label: "Engineer", value: "5f2c6e02e4b0a914d4a9fcb5" },
    { label: "Doctor", value: "5f2c6e02e4b0a914d4a9fcb1" },
    { label: "Plumber", value: "5f2c6e02e4b0a914d4a9fcb2" },
    { label: "Electrician", value: "5f2c6e02e4b0a914d4a9fcb3" },
  ];

  const experienceLevels = [
    { value: "0", label: "0 Years" },
    { value: "1", label: "0-1 Year" },
    { value: "2", label: "1-2 Years" },
    { value: "3", label: "3-4 Years" },
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
      setLoading(true);
      setFormData(data);
      let resp;
      if(selectedFile){
        resp = await getSignedUrl("jobImage", selectedFile?.type!, "testJob");
        if (resp) {
          await uploadFile(resp.uploadurl, selectedFile!);
        }
      }
      const contacts = [`${data.countryCode}${data.contactNumber}`];
      if(data.altContactNumber && data.altCountryCode){
        contacts.push(`${data.countryCode}${data.contactNumber}`);
      }
      const jobData = {
        agencyId: formData?.agency,
        location: formData?.location,
        expiry: formData?.expiryDate,
        positions: data?.jobPositions.filter(x=>x && x.title?.value).map(position => ({
          positionId: position.title.value,
          experience: Number(position.experience),
          salary: position.salary,
        })),
        imageUrl: resp?.keyName,
        amenities: selectedFacilities,
        contactNumbers: contacts,
        country: formData?.targetCountry || 'in',
        email:data.email,
        description:data.description,
      }
      const res = await createJobMutation.mutateAsync(jobData);
      await queryClient.invalidateQueries({
        predicate: (query) => {
          console.log(query.queryKey ,query.queryKey.includes('jobs'))
          return query.queryKey.includes('jobs');
        },
        refetchType:'all'
      })
      await queryClient.refetchQueries({
          predicate: (query) => {
            return query.queryKey.includes('jobs');
          },
        });
      setNewlyCreatedJob(res.job)
      toast.success('Job created successfully')
      handleCreateJobClick();
      setLoading(false);
    } catch (error) {
      toast.error('Error while posting job. Please try again')
      setLoading(false);
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
          <div className={styles.createSpinner}></div>
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
                        <MultiSelectAsync
                          name={`jobPositions.${index}.title`}
                          control={control}
                          // @ts-ignore
                          error={errors[`jobPositions.${index}.title`]}
                          loadOptions={getFormattedJobTitles}
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
                          // @ts-ignore
                          error={errors[`jobPositions.${index}.experience`]}
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
                  required: "Country code is required",
                
                })}
                defaultValue={formData?.countryCode}
              >
                 {
                  Object.values(COUNTRIES).map(country=>{
                    return  <option value={country.isdCode}>{country.isdCode}</option>
                  })
                }
              </Form.Select>
              <Form.Control
                defaultValue={formData?.contactNumber}
                aria-label="Contact number"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  maxLength:10,
                  minLength:10,
                  pattern: {
                    value: phoneRegex,
                    message: "Enter a valid contact number "
                  }
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
            <Form.Label>Alternate Contact Mobile Number</Form.Label>
            <InputGroup className={`contact-field`}>
              <Form.Select
                className={styles.input}
                {...register("altCountryCode")}
                defaultValue={formData?.altCountryCode}
              >
                {
                  Object.values(COUNTRIES).map(country=>{
                    return  <option value={country.isdCode}>{country.isdCode}</option>
                  })
                }
              </Form.Select>
              <Form.Control
                defaultValue={formData?.altContactNumber}
                aria-label="Alternate Contact number"
                {...register("altContactNumber",{
                  maxLength:10,
                  pattern: {
                    value: phoneRegex,
                    message: "Enter a valid contact number "
                  }
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
