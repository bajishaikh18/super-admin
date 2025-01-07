import React, { useCallback } from "react";
import styles from "./CreateWalkIn.module.scss";
import usePostWalkinStore from "@/stores/usePostWalkinStore";
import { Button, Form } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import { MultiSelect, MultiSelectAsync } from "../common/form-fields/MultiSelect";
import { IoClose } from "react-icons/io5";

interface FirstWalkInScreenProps {
  countries?: string[]; // Make the countries prop optional
  isEdit?:boolean;
  handleContinueClick: () => void;
  handleClose: () => void;
  handleBackToPostWalkInClick: () => void;
}
import { COUNTRIES, ROLE } from "@/helpers/constants";
import { CustomDatePicker } from "../common/form-fields/DatePicker";
import { debounce } from "lodash";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { SelectOption } from "@/helpers/types";
import { DateTime } from "luxon";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
interface FormValues {
  agency: SelectOption;
  location: string;
  country: string;
  expiry: string;
}

const FirstWalkInScreen: React.FC<FirstWalkInScreenProps> = ({
 // Provide a default value of an empty array
  isEdit,
  handleContinueClick,
  handleClose,
  handleBackToPostWalkInClick,
}) => {
  // Zustand store management
  const { selectedFacilities, handleFacilityClick, setFormData, formData } =
    usePostWalkinStore();
  const {shouldVisible} = useAuthUserStore();

  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
        getFormattedAgencies(inputValue).then(options => callback(options))
    }, 500),
    []
  );
  const workLocations = Object.entries(COUNTRIES)
      .filter(([key]) => key.toUpperCase() !== "IN") 
      .map(([key, val]) => ({
        label: val.label,
        value: key,
      }));
  
    const targetCountries = Object.entries(COUNTRIES).map(([key, val]) => ({
      label: val.label,
      value: key,
    }));
  const {
    control,
   
    handleSubmit,
    
    formState: { errors,isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setFormData(data);
      handleContinueClick();
    } catch{
    } finally {
    }
  };



  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
      <h2>
          {
            isEdit ? "Edit " : "Create a "
          }
          WalkIn <span>(1/2)</span> 
        </h2>
        
        <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        >
          
        </IoClose>
      </div>
      <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
        {/* Agency Selection */}
        {
          shouldVisible([ROLE.admin,ROLE.superAdmin]) && <Form.Group className={styles.formGroup}>
          <Form.Label>Agency</Form.Label>
          <MultiSelectAsync
                         name="agency"
                         control={control}
                         placeHolder="Type to search agency"
                         error={errors.agency as FieldError}
                          loadOptions={loadOptionsDebounced}
                          rules={{ required: "Agency is required" }}
                          customStyles={{}}
                          defaultValue={formData?.agency}
                          menuPortalTarget={document.getElementsByClassName('modal')[0] as HTMLElement}
                          menuPosition={"fixed"}
                        />
         
        </Form.Group>
        }
       

        <Form.Group className={styles.formGroup}>
          <Form.Label>Work Location</Form.Label>
          <MultiSelect
            name="location"
            control={control}
            error={errors.location}
            options={workLocations}
            rules={{ required: "Location is required" }}
            customStyles={{}}
            defaultValue={formData?.location}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Target Country</Form.Label>
          <MultiSelect
            name="country"
            control={control}
            error={errors.country}
            options={targetCountries}
            rules={{ required: "Target country is required" }}
            customStyles={{}}
            defaultValue={formData?.country}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Expiry date</Form.Label>
          <CustomDatePicker
            name="expiry"
            control={control}
            error={errors.expiry}
            defaultValue={formData?.expiry || DateTime.now().plus({days:45}).toISO()}
            minDate={new Date()}
            rules={{ required: "Expiry date is required" }}
          />
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
            className={`outlined action-buttons`}
            onClick={handleBackToPostWalkInClick}
          >
            Back
          </Button>
          <Button
            type="submit"
            className={`action-buttons ${
              isValid ? "" : styles.disabled
            }`}
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FirstWalkInScreen;
