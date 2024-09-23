import React, { useState } from "react";
import styles from '../../app/create/page.module.scss';
import usePostJobStore from "@/stores/usePostJobStore";

interface JobPosition {
  title: string;
  experience: string;
  salary: string;
}

interface SecondJobScreenProps {
  contactNumber: string;
  email: string;
  description: string;
  setContactNumber: (value: string) => void;
  setEmail: (value: string) => void;
  setDescription: (value: string) => void;
  handleBackToPostJobClick: () => void;
  isCreateJobButtonEnabled: boolean;
  handleCreateJobClick: () => void;
}

const SecondJobScreen: React.FC<SecondJobScreenProps> = ({
  contactNumber,
  email,
  description,
  setContactNumber,
  setEmail,
  setDescription,
  handleBackToPostJobClick,
  isCreateJobButtonEnabled,
  handleCreateJobClick,
}) => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    { title: "", experience: "0", salary: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAlternateMobile, setShowAlternateMobile] = useState(false);
  const [alternateMobile, setAlternateMobile] = useState<string>("");

  const setGlobalJobPositions = usePostJobStore((state) => state.setJobPositions);

  const handleAddMore = () => {
    const lastPosition = jobPositions[jobPositions.length - 1];
    if (lastPosition.title.trim() === "" || lastPosition.salary.trim() === "") {
      setErrorMessage("Please fill in all fields before adding a new position.");
      return;
    }
    setErrorMessage("");
    const newPositions = [...jobPositions, { title: "", experience: "0", salary: "" }];
    setJobPositions(newPositions);
    setGlobalJobPositions(newPositions);

    if (!showAlternateMobile) {
      setShowAlternateMobile(true);
    }
  };

  const handlePositionChange = (index: number, field: keyof JobPosition, value: string) => {
    const updatedPositions = [...jobPositions];
    updatedPositions[index][field] = value;
    setJobPositions(updatedPositions);
    setGlobalJobPositions(updatedPositions);
  };

  const handlePhoneNumberChange = (setter: (value: string) => void, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 10) {
      setter(value);
    }
  };

  const handleSubmit = () => {
    if (contactNumber.length !== 10 || (showAlternateMobile && alternateMobile.length !== 10)) {
      setErrorMessage("Please enter valid 10-digit mobile numbers.");
      return;
    }
    handleCreateJobClick();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create a Job (2/2)</h2>
        <button className={styles.closeButton} onClick={handleBackToPostJobClick}>
          &times;
        </button>
      </div>
      <form className={styles.form}>
        <label className={styles.formLabel}>Add positions</label>
        {jobPositions.map((position, index) => (
          <div className={styles.positionsContainer} key={index}>
            <input
              type="text"
              placeholder="Add Job Title"
              className={styles.jobTitleInput}
              value={position.title}
              onChange={(e) => handlePositionChange(index, "title", e.target.value)}
            />
            <select
              className={styles.experienceInput}
              value={position.experience}
              onChange={(e) => handlePositionChange(index, "experience", e.target.value)}
            >
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i}>
                  {i} Years
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="0-0"
              className={styles.salaryInput}
              value={position.salary}
              onChange={(e) => handlePositionChange(index, "salary", e.target.value)}
            />
          </div>
        ))}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <button type="button" className={styles.addMoreButton} onClick={handleAddMore}>
          Add More
        </button>

        <label className={styles.formLabel}>Contact Mobile Number</label>
        <div className={styles.contactContainer}>
          <select className={styles.countryCodeInput}>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+91">+91</option>
          </select>
          <input
            type="tel"
            placeholder="  984892801"
            value={contactNumber}
            onChange={(e) => handlePhoneNumberChange(setContactNumber, e.target.value)}
            className={styles.phoneInput}
            maxLength={10}
          />
        </div>

        {showAlternateMobile && (
          <>
            <label className={styles.formLabel}>Alternate Mobile Number</label>
            <div className={styles.contactContainer}>
              <select className={styles.countryCodeInput}>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                placeholder="Enter alternate mobile number"
                value={alternateMobile}
                onChange={(e) => handlePhoneNumberChange(setAlternateMobile, e.target.value)}
                className={styles.phoneInput}
                maxLength={10}
              />
            </div>
          </>
        )}

        <label className={styles.formLabel}>Contact Email Address</label>
        <input
          type="email"
          placeholder="Enter Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />

        <label className={styles.formLabel}>Description (Optional)</label>
        <textarea
          placeholder="Write job description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.inputField}
        />

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={handleBackToPostJobClick}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.createJobButton} ${
              isCreateJobButtonEnabled ? "" : styles.disabled
            }`}
            onClick={handleSubmit}
            disabled={!isCreateJobButtonEnabled}
          >
            Create a Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecondJobScreen;
