"use client";

import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./CreateNotification.module.scss";
import { IoClose } from "react-icons/io5";
import { CreateNotificationFormData, useNotificationStore } from "@/stores/useNotificationStore";
import { useForm } from "react-hook-form";
import { getJobTitles } from "@/apis/common";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { SelectOption } from "@/helpers/types";

function CreateNotification({
  handleModalClose,
}: {
  handleModalClose: () => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const {  formData, setFormData } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState<{ title: string }[]>([]); 


  const selectOptions: SelectOption[] = jobTitles.map((jobTitle) => ({
    value: jobTitle.title, 
    label: jobTitle.title, 
  }));

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateNotificationFormData>({
    mode: "all",
  });


  

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const jobTitles = await getJobTitles(); 
        setJobTitles(jobTitles);
      } catch (error) {
        console.error("Failed to load job titles", error);
      }
    };

    fetchJobTitles();
  }, []);

  const handleClose = () => {
    handleModalClose();
  };

  

  const onSubmit = (data: any) => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false);
      handleClose();
    }, 2000);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>{isEdit ? "Edit" : "Create "} Notification</h2>
        <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        />
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Your notification is {isEdit ? "updating" : "creating"}, please wait
          </p>
          <div className={styles.createSpinner}></div>
        </div>
      ) : (
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              className={styles.input}
              defaultValue={formData?.title}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <span className={styles.error}>{errors.title.message}</span>}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter Description"
              className={styles.input}
              defaultValue={formData?.description}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Job Titles</Form.Label>
            <MultiSelect
                name="jobtitle"
                control={control}
                error={errors[`title`]}
                customStyles={{}}
                options={selectOptions}
                defaultValue={formData?.title}
                rules={{required: "Title is required"}}
                menuPortalTarget={
                    document.getElementsByClassName("modal") [0] as HTMLElement
                }
                 menuPosition={"fixed"}
                />            
            {errors.jobTitles && (
              <span className={styles.error}>{errors.jobTitles.message}</span>
            )}
          </Form.Group>

          <div className={styles.actions}>
            <Button
              type="button"
              className={`outlined action-buttons`}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`action-buttons ${styles.submitButton}`}
              disabled={loading}
            >
              {isEdit ? "Update" : "Create"} Notification
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default CreateNotification;




