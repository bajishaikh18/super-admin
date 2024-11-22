"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./CreateNotification.module.scss";
import { IoClose } from "react-icons/io5";
import {
  useNotificationStore,
} from "@/stores/useNotificationStore";
import { FieldError, useForm } from "react-hook-form";
import {
  MultiSelectAsync,
} from "../common/form-fields/MultiSelect";
import { SelectOption } from "@/helpers/types";
import { debounce } from "lodash";
import { getFormattedJobTitles } from "@/helpers/asyncOptions";
import { createNotification } from "@/apis/notification";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
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
      getFormattedJobTitles(inputValue).then((options) => {
        const modified = [{value:'all',label:'All'},...options]
        callback(modified)
      });
    }, 500),
    []
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
     mode: 'all'
  });



  const handleClose = () => {
    handleModalClose();
  };

  const onSubmit = async (data: any) => {
    try{
      setLoading(true);
      const payload = {
        title:data.title,
        description:data.description,
        target: data?.jobTitle?.map((x:any)=>x.value)
      }
      await createNotification(payload);
      setLoading(false);
      toast.success("Notification added successfully");
      handleClose();
      await queryClient.invalidateQueries({
        queryKey:["notifications"],
        refetchType:'all'
      });     
    }catch(e){
      toast.error("Error while adding notification");
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>{isEdit ? "Edit" : "Create "} Notification</h2>
        <IoClose className={styles.closeButton} onClick={handleClose} />
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Your notification is {isEdit ? "updating" : "creating"}, please wait
          </p>
          <div className={styles.createSpinner}></div>
        </div>
       ): ( 
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              className={styles.input}
              isInvalid={!!errors.title}
              defaultValue={formData?.title}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter Description"
              className={styles.input}
              defaultValue={formData?.description}
              {...register("description")}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Targetted job Titles</Form.Label>
            <MultiSelectAsync
              name="jobTitle"
              isMulti={true}
              placeHolder="Type to search job titles"
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
      )}
    </div>
  );
}

export default CreateNotification;
