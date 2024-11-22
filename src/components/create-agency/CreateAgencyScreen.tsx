import React, { useCallback, useEffect, useState } from "react";
import usePostJobStore from "@/stores/usePostJobStore";
import styles from "./CreateAgency.module.scss";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FieldError, useForm } from "react-hook-form";
import {
  MultiSelect,
  MultiSelectAsync,
} from "../common/form-fields/MultiSelect";
import { IoClose } from "react-icons/io5";

interface CreateAgencyScreenProps {
  countries?: string[]; // Make the countries prop optional
  isEdit?: boolean;
  handleContinueClick: () => void;
  handleClose: () => void;
  handleBackToPostJobClick: () => void;
}
import { COUNTRIES } from "@/helpers/constants";
import useAgencyStore, { CreateAgencyFormData } from "@/stores/useAgencyStore";
import { getSignedUrl, uploadFile } from "@/apis/common";
import { createAgency, updateAgency } from "@/apis/agency";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  GetState,
} from "react-country-state-city";
import { CITIES } from "@/helpers/stateList";

const phoneRegex = /^[0-9]{10}$/;

const CreateAgencyScreen: React.FC<CreateAgencyScreenProps> = ({
  countries = [], // Provide a default value of an empty array
  isEdit,
  handleContinueClick,
  handleClose,
  handleBackToPostJobClick,
}) => {
  const { formData, setFormData, selectedFile } = useAgencyStore();
  const [loading, setLoading] = useState(false);
  const [stateList,setStateList] = useState([]);
  const queryClient = useQueryClient();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
    control
  } = useForm<CreateAgencyFormData>({
    mode: "all",
  });

  const state  = watch("state")

  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const statesList = await GetState(101);
      const formattedList =  statesList.map((state: any) => ({
        value: state.state_code,
        label: state.name,
      }));
      setStateList(formattedList)
      return statesList;
    },
    retry: 3,
  });
  
  const { data: cities } = useQuery({
    queryKey: ["cities", state, stateList],
    queryFn: async () => {
      if (state && stateList.length>0) {
        const selectedState:any = states?.find(
          (cty: any) => cty.state_code === state
        );
        const cityList = CITIES[selectedState?.state_code as "KL"];
        return cityList.map((city: any) => ({
          value: city,
          label: city,
        }));
      }
      return [];
    },
    retry: 3,
  });

  const onSubmit = async (data: CreateAgencyFormData) => {
    try {
      let resp;
      setLoading(true);
     
      const contactNo = `${data.countryCode}-${data.contactNumber}`;
      const payload = {
        ...data,
        phone: contactNo,
        approved: true
      };
      let res;
      if (isEdit && formData?._id) {
        res = await updateAgency(formData?._id,payload);
        await queryClient.invalidateQueries({
            queryKey:["agencyDetails",formData?.agencyId?.toString()],
            refetchType:'all'
        })
      } else {
        res = await createAgency(payload);
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("agencies");
          },
          refetchType: "all",
        });
      }
      
      if (selectedFile) {
        resp = await getSignedUrl("agencyImage", selectedFile?.type!,"agencyId", res.agency?._id || formData?._id!);
        if (resp) {
          await uploadFile(resp.uploadurl, selectedFile!);
        }
        await updateAgency(res?.agency?._id! || formData?._id!, {profilePic: resp?.keyName});
      }
      toast.success(`Agency ${isEdit ? "updated" : "created"} successfully`);
      handleContinueClick();
      setLoading(false);
    } catch (error) {
      toast.error(`Error while ${isEdit?'updating':'creating'} agency. Please try again`)
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>
          {isEdit ? "Edit " : "Create "}
          Agency (2/2)
        </h2>

        <IoClose className={styles.closeButton} onClick={handleClose}></IoClose>
      </div>
      {
        loading ?  <div className={styles.popupContent}>
        <p className={styles.loadingContent}>
          Your agency is {isEdit?"updating":"creating"} please wait
        </p>
        <div className={styles.createSpinner}></div>
      </div> :    <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
      <div className={`${styles.overFlowSection} scroll-box`}>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            className={styles.input}
            defaultValue={formData?.name}
            isInvalid={!!errors.name}
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <Form.Text className="error">{errors.name.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className={styles.formGroup}>
          <Form.Label>Registration Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter registration no."
            className={styles.input}
            defaultValue={formData?.regNo}
            isInvalid={!!errors.regNo}
            {...register("regNo", {
              required: "Registration No. is required",
            })}
          />
          {errors.regNo && (
            <Form.Text className="error">{errors.regNo.message}</Form.Text>
          )}
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
              {Object.values(COUNTRIES).map((country) => {
                return (
                  <option value={country.isdCode} key={country.isdCode}>
                    {country.isdCode}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control
              defaultValue={formData?.contactNumber}
              aria-label="Contact number"
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: phoneRegex,
                  message: "Enter a valid contact number",
                },
              })}
              isInvalid={!!errors.contactNumber}
            />
          </InputGroup>
          {errors.contactNumber && (
            <Form.Text className="error">
              {errors.contactNumber.message}
            </Form.Text>
          )}
        </Form.Group>
        {/* <Form.Group className={styles.formGroup}>
            <Form.Label>Alternate Contact Mobile Number (Optional)</Form.Label>
            <InputGroup className={`contact-field`}>
              <Form.Select
                className={styles.input}
                {...register("altCountryCode")}
                defaultValue={formData?.altCountryCode}
              >
                {
                  Object.values(COUNTRIES).map(country=>{
                    return  <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  })
                }
              </Form.Select>
              <Form.Control
                defaultValue={formData?.altContactNumber}
                aria-label="Alternate Contact number"
                isInvalid={!!errors.altContactNumber}
                {...register("altContactNumber",{
                  maxLength:10,
                  pattern: {
                    value: phoneRegex,
                    message: "Enter a valid contact number "
                  }
                })}
              />
            </InputGroup>
            {errors.altContactNumber && (
              <Form.Text className="error">
                {errors.altContactNumber.message}
              </Form.Text>
            )}
          </Form.Group> */}
        <Form.Group className={styles.formGroup}>
          <Form.Label>Contact Email Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email Id"
            className={styles.input}
            defaultValue={formData?.email}
            isInvalid={!!errors.email}
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
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter website"
            className={styles.input}
            defaultValue={formData?.website}
            isInvalid={!!errors.website}
            {...register("website", {
              required: "Website is required",
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
                message: "Website should have proper format",
              },
            })}
          />
          {errors.website && (
            <Form.Text className="error">{errors.website.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className={styles.formGroup}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            defaultValue={formData?.address}
            {...register("address", { required: true })}
          />
          {errors.address && (
            <Form.Text className="error">{errors.address.message}</Form.Text>
          )}
        </Form.Group>
        <Row>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>State</Form.Label>
                {stateList && (
                  <MultiSelect
                    name={`state`}
                    control={control}
                    // @ts-ignore
                    error={errors[`state`]}
                    customStyles={{}}
                    options={stateList}
                    defaultValue={formData?.state}
                    rules={{ required: "State is required" }}
                    menuPortalTarget={
                      document.getElementsByClassName("modal")[0] as HTMLElement
                    }
                    menuPosition={"fixed"}
                  />
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>City</Form.Label>
                {cities && (
                  <MultiSelect
                    name={`city`}
                    control={control}
                    // @ts-ignore
                    error={errors[`city`]}
                    customStyles={{}}
                    options={cities}
                    defaultValue={formData?.city}
                    rules={{ required: "City is required" }}
                    menuPortalTarget={
                      document.getElementsByClassName("modal")[0] as HTMLElement
                    }
                    menuPosition={"fixed"}
                  />
                )}
              </Form.Group>
            </Col>
          </Row>
          </div>
        <div className={styles.actions}>
          <Button
            type="button"
            className={`outlined action-buttons`}
            onClick={handleBackToPostJobClick}
          >
            Back
          </Button>
          <Button
            type="submit"
            className={`action-buttons ${isValid ? "" : styles.disabled}`}
            disabled={!isValid}
          >
            {isEdit ? "Edit " : "Create "}
            Agency
          </Button>
        </div>
      </Form>
      }
   
    </div>
  );
};

export default CreateAgencyScreen;
