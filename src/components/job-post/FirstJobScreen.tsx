import React from "react";
import styles from "../../app/create/page.module.scss";
import usePostJobStore from "@/stores/usePostJobStore";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

interface FirstJobScreenProps {
  countries?: string[]; // Make the countries prop optional
  handleContinueClick: () => void;
  handleBackToPostJobClick: () => void;
}

interface FormValues {
  agency: string;
  location: string;
  expiryDate: string;
}

const FirstJobScreen: React.FC<FirstJobScreenProps> = ({
  countries = [], // Provide a default value of an empty array
  handleContinueClick,
  handleBackToPostJobClick,
}) => {
  // Zustand store management
  const { selectedFacilities, handleFacilityClick, setFormData, formData } =
    usePostJobStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setFormData(data);
      handleContinueClick();
    } catch (error) {
    } finally {
    }
  };

  const isContinueButtonEnabled = selectedFacilities.length > 0;

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>
          Create a Job <span>(1/2)</span>
        </h2>
        <button
          className={styles.closeButton}
          onClick={handleBackToPostJobClick}
        >
          &times;
        </button>
      </div>
      <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
        {/* Agency Selection */}
        <Form.Group className={styles.formGroup}>
          <Form.Label>Agency</Form.Label>
          <Form.Select
            className={styles.input}
            {...register("agency", {
              required: "Agency is required",
            })}
          >
            <option value="" selected>
              Select Agency
            </option>
            <option value="1">Agency1</option>
            <option value="2">Agency2</option>
            <option value="3">Agency3</option>
          </Form.Select>
          {errors.agency && (
            <Form.Text className="error">{errors.agency.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Work Location</Form.Label>
          <Form.Select
            className={styles.input}
            {...register("location", {
              required: "Work location is required",
            })}
          >
            <option value="" selected>
              Select country
            </option>
            <option value="ae">UAE</option>
            <option value="sa">Saudi Arabia</option>
            <option value="qa">Qatar</option>
            <option value="bh">Bahrain</option>
            <option value="om">Oman</option>
          </Form.Select>
          {errors.location && (
            <Form.Text className="error">{errors.location.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Expiry date</Form.Label>
          <Form.Control
            type="date"
            {...register("expiryDate", {
              required: "Expiry date is required",
            })}
          />
          {errors.expiryDate && (
            <Form.Text className="error">{errors.expiryDate.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className={styles.formGroup}>
          <Form.Label>Free Facilities</Form.Label>
          <div className={styles.facilitiesContainer}>
            {["Food", "Transportation", "Stay", "Recruitment"].map(
              (facility) => (
                <button
                  key={facility}
                  type="button"
                  className={`${styles.facilityButton} ${
                    selectedFacilities.includes(facility) ? styles.selected : ""
                  }`}
                  onClick={() => handleFacilityClick(facility)}
                >
                  {selectedFacilities.includes(facility)
                    ? `- ${facility}`
                    : `+ ${facility}`}
                </button>
              )
            )}
          </div>
        </Form.Group>

        {/* Action Buttons */}
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
              isContinueButtonEnabled ? "" : styles.disabled
            }`}
            disabled={!isContinueButtonEnabled}
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FirstJobScreen;
