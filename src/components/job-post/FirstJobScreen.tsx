import React from "react";
import styles from '../../app/create/page.module.scss';
import usePostJobStore from "@/stores/usePostJobStore";

interface FirstJobScreenProps {
  countries?: string[]; // Make the countries prop optional
  handleContinueClick: () => void;
  handleBackToPostJobClick: () => void;
}

const FirstJobScreen: React.FC<FirstJobScreenProps> = ({
  countries = [], // Provide a default value of an empty array
  handleContinueClick,
  handleBackToPostJobClick,
}) => {
  // Zustand store management
  const {
    selectedFacilities,
    handleFacilityClick,
    agency,
    setAgency,
    type,
    setType,
    salaryFrom,
    setSalaryFrom,
    salaryTo,
    setSalaryTo,
    expiryDate,
    setExpiryDate,
    location,
    setLocation,

  } = usePostJobStore();

  const isContinueButtonEnabled = selectedFacilities.length > 0;

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create a Job (1/2)</h2>
        <button
          className={styles.closeButton}
          onClick={handleBackToPostJobClick}
        >
          &times;
        </button>
      </div>
      <form>
        {/* Agency Selection */}
        <label className={styles.formLabel}>Agency</label>
        <select
          className={styles.inputField}
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
        >
          <option value="">Select Agency</option>
          <option value="CodeCraft">CodeCraft</option>
          <option value="ByteBridge">ByteBridge</option>
          <option value="AgileTech Solutions">AgileTech Solutions</option>
        </select>

        {/* Working Location */}
        <label className={styles.formLabel}>Working Location</label>
        <select
          className={styles.inputField}
          value={location} // Use Zustand location state
          onChange={(e) => setLocation(e.target.value)} // Update Zustand store
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        

        {/* Type Selection */}
        <label className={styles.formLabel}>Type</label>
        <select
          className={styles.inputField}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>

        {/* Salary From */}
        <label className={styles.formLabel}>Salary From</label>
        <input
          type="number"
          placeholder="0"
          className={styles.inputField}
          step="1"
          value={salaryFrom}
          onChange={(e) => setSalaryFrom(e.target.value)}
        />

        {/* Salary To */}
        <label className={styles.formLabel}>Salary To</label>
        <input
          type="number"
          placeholder="0"
          className={styles.inputField}
          step="1"
          value={salaryTo}
          onChange={(e) => setSalaryTo(e.target.value)}
        />

        {/* Expiry Date */}
        <label className={styles.formLabel}>Expiry Date</label>
        <input
          type="date"
          className={styles.inputField}
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        {/* Facility Buttons */}
        <label className={styles.formLabel}>Free Facilities</label>
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

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleBackToPostJobClick}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.continueButton} ${
              isContinueButtonEnabled ? "" : styles.disabled
            }`}
            onClick={handleContinueClick}
            disabled={!isContinueButtonEnabled}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirstJobScreen;

