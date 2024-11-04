"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./CreateNotification.module.scss";
import { IoClose } from "react-icons/io5";
import {
  CreateNotificationFormData,
  useNotificationStore,
} from "@/stores/useNotificationStore";
import { FieldError, useForm } from "react-hook-form";
import { getJobTitles } from "@/apis/common";
import {
  MultiSelectAsync,
} from "../common/form-fields/MultiSelect";
import { SelectOption } from "@/helpers/types";
import { debounce } from "lodash";
import { getFormattedJobTitles } from "@/helpers/asyncOptions";

interface FormValues {
  title: string,
  description: string,
  jobTitle: SelectOption

}

function CreateNotification({
  handleModalClose,
}: {
  handleModalClose: () => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const { formData } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState<{ title: string }[]>([]);

  // const selectOption: SelectOption[] = jobTitles.map((jobTitle) => ({
  //   value: jobTitle.title,
  //   label: jobTitle.title,
  // }));

  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedJobTitles(inputValue).then((options) => callback(options));
    }, 500),
    []
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>();

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
        <IoClose className={styles.closeButton} onClick={handleClose} />
      </div>
      {/* {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Your notification is {isEdit ? "updating" : "creating"}, please wait
          </p>
          <div className={styles.createSpinner}></div>
        </div> */}
      {/* ) : ( */}
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
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter Description"
              className={styles.input}
              defaultValue={formData?.description}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Job Titles</Form.Label>
            <MultiSelectAsync
              name="jobTitle"
              control={control}
              error={errors.jobTitle as FieldError}
              loadOptions={loadOptionsDebounced}
              rules={{ required: "Job Title is required" }}
              customStyles={{}}
              defaultValue={formData?.jobTitle}
              menuPortalTarget={
                document.getElementsByClassName("modal")[0] as HTMLElement
              }
              menuPosition={"fixed"}
            />
            
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
      {/* ) */}
    </div>
  );
}

export default CreateNotification;
