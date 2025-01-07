"use client";

import React, { useState} from "react";
import { Button, Form } from "react-bootstrap";
import styles from "../common/Modal.module.scss";
import { IoClose } from "react-icons/io5";
import {
  useNotificationStore,
} from "@/stores/useNotificationStore";
import { FieldError, useForm } from "react-hook-form";
import {
    MultiSelect,

} from "../common/form-fields/MultiSelect";
import { SelectOption } from "@/helpers/types";

import toast from "react-hot-toast";

import { reportTypeOptions } from "./CommonElements";
import { createApproval } from "@/apis/approval";

interface FormValues {
  noOfRecords: string,
  reason: string,
  reportType: SelectOption
}

function RequestMore({
  handleModalClose,
  type,
  filters,
  maxQuantity
}: {
  handleModalClose: () => void;
  type: string,
  filters:string[] | null
  maxQuantity:number
}) {
 
  const { formData } = useNotificationStore();
  const [loading, setLoading] = useState(false);

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
        reportType : type,
        quantity: data.noOfRecords,
        filters:filters,
        reason: data.reason
      }
      await createApproval(payload);
      toast.success("Your request has been sent to super admin")
      setLoading(false);
      handleClose();
    }catch{
      toast.error("Error while submitting request");
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Request more data</h2>
        <IoClose className={styles.closeButton} onClick={handleClose} />
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Submitting your request, please wait
          </p>
          <div className={styles.createSpinner}></div>
        </div>
       ): ( 
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
             <Form.Group className={styles.formGroup}>
            <Form.Label>Report Type</Form.Label>
            <MultiSelect
              name="reportType"
              control={control}
              error={errors.reportType as FieldError}
              options={reportTypeOptions}
              rules={{ required: "Report type is required" }}
              customStyles={{}}
              defaultValue={type}
              menuPortalTarget={
                document.getElementsByClassName("modal")[0] as HTMLElement
              }
              menuPosition={"fixed"}
            />
            
          </Form.Group>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Number of records to view</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter No. of records"
              className={styles.input}
              max={maxQuantity}
              isInvalid={!!errors.noOfRecords}
              defaultValue={maxQuantity}
              {...register("noOfRecords", { required: "No. of records",max: {
                value: maxQuantity,
                message: `The number must be less than or equal to ${maxQuantity}`,
              }, })}
            />
            {errors.noOfRecords && (
              <span className={styles.error}>{errors.noOfRecords.message}</span>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Reason for additional data (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter Description"
              className={styles.input}
              defaultValue={formData?.description}
              {...register("reason")}
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
              Submit request
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default RequestMore;
