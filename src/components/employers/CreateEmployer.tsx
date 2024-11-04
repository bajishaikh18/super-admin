import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import {
  GetCountries,
  GetState,
} from "react-country-state-city";
import { inviteUser } from "@/apis/user";
import { toast } from "react-hot-toast";
import "react-country-state-city/dist/react-country-state-city.css";
import styles from "./EmployerList.module.scss"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { COUNTRIES } from "@/helpers/constants";
import { MultiSelect } from "../common/form-fields/MultiSelect";

const phoneRegex = /^[0-9]{10}$/;

interface CreateEmployerProps {
  onCancel: () => void;
}
const CreateEmployerForm: React.FC<CreateEmployerProps> = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const queryClient = useQueryClient();
  const {register,handleSubmit,control,formState: { errors },reset,watch,trigger,} = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      mobileNumber: "",
      landlineNumber: "",
      email: "",
      address: "",
      state: "",
      country: "",
      mobileCountryCode: "+91",
      landlineCountryCode: "+91",
    },
  });

  const country: any = watch("country");

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const countriesList = await GetCountries();
      const neededCountries = countriesList.filter(
        (x: any) => COUNTRIES[x.iso2.toLowerCase() as "bh"]
      );
      const countryList = neededCountries.map((x: any) => ({
        value: x.iso2,
        label: x.name,
      }));
      setCountriesList(countryList);
      return neededCountries;
    },
    retry: 3,
  });

  const { data: states } = useQuery({
    queryKey: ["states", country],
    queryFn: async () => {
      if (country) {
        const selectedCountry = countries.find(
          (cty: any) => cty.iso2 === country
        );
        const statesList = await GetState(selectedCountry?.id);
        return statesList.map((state: any) => ({
          value: state.state_code,
          label: state.name,
        }));
      }
      return [];
    },
    retry: 3,
  });

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    setLoading(true);
    try {
      const userDetails = {
        ...data,
        role: 3,
        country: data.country,
        state: data.state,
        mobile: `${data.mobileCountryCode}-${data.mobileNumber}`,
        landline: `${data.landlineCountryCode}-${data.landlineNumber}`,
      };
      const response = await inviteUser(userDetails);
      console.log("Submitting data:", response);
      toast.success("Success! Employer has been created and waiting for approval");
      await queryClient.invalidateQueries({
        predicate: (query) => {
          console.log(query.queryKey, query.queryKey.includes("users"));
          return query.queryKey.includes("jobs");
        },
        refetchType: "all",
      });
      handleCancel();
      setLoading(false);
    } catch (error) {
      console.error("Error creating employer:", error);
      toast.error("Error inviting employer. Please try again.");
      setLoading(false);
    }
  };
  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create Employer</h2>
        <IoClose className={styles.closeButton} onClick={handleCancel} />
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>Employer creation in progress</p>
          <div className={styles.createSpinner}></div>
        </div>
      ) : (
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  className={styles.input}
                  {...register("firstName", {
                    required: "First name is required",
                    onChange: () => trigger("firstName"),
                  })}
                />
                {errors.firstName && (
                  <Form.Text className="error">
                    {errors.firstName.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  className={styles.input}
                  {...register("lastName", {
                    required: "Last name is required",
                    onChange: () => trigger("lastName"),
                  })}
                />
                {errors.lastName && (
                  <Form.Text className="error">
                    {errors.lastName.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className={styles.formGroup}>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name"
                  className={styles.input}
                  {...register("companyName", {
                    required: "Company name is required",
                    onChange: () => trigger("companyName"),
                  })}
                />
                {errors.lastName && (
                  <Form.Text className="error">
                    {errors.lastName.message}
                  </Form.Text>
                )}
              </Form.Group>
          <Row>
            <Col md={12}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Mobile Number</Form.Label>
                <InputGroup className={`contact-field`}>
                  <Form.Select
                    className={styles.input}
                    {...register("mobileCountryCode", {
                      required: "Country code is required",
                      onChange: () => trigger("mobileCountryCode"),
                    })}
                  >
                    {Object.values(COUNTRIES).map((country, i) => {
                      return (
                        <option value={country.isdCode} key={country.isdCode}>
                          {country.isdCode}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control
                    aria-label="Mobile number"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: phoneRegex,
                        message: "Enter a valid mobile number",
                      },
                      onChange: () => trigger("mobileNumber"),
                    })}
                    isInvalid={!!errors.mobileNumber}
                  />
                </InputGroup>
                {errors.mobileNumber && (
                  <Form.Text className="error">
                    {errors.mobileNumber.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Landline Number</Form.Label>
                <InputGroup className={`contact-field`}>
                  <Form.Select
                    className={styles.input}
                    {...register("landlineCountryCode", {
                      required: "Country code is required",
                      onChange: () => trigger("landlineCountryCode"),
                    })}
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
                    aria-label="Landline number"
                    {...register("landlineNumber", {
                      required: "Landline number is required",
                      pattern: {
                        value: phoneRegex,
                        message: "Enter a valid Landline number",
                      },
                      onChange: () => trigger("landlineNumber"),
                    })}
                  />
                </InputGroup>
                {errors.landlineNumber && (
                  <Form.Text className="error">
                    {errors.landlineNumber.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Company Email ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email Id"
              className={styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
                onChange: () => trigger("email"),
              })}
            />
            <Form.Text>
              *An OTP will be sent to this email for authentication
            </Form.Text>
            {errors.email && (
              <Form.Text className="error">{errors.email.message}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              {...register("address", {
                required: "Address is required",
                onChange: () => trigger("address"),
              })}
              placeholder="Enter Address"
              className={styles.inputField}
            />
            {errors.address && (
              <Form.Text className="error">{errors.address.message}</Form.Text>
            )}
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Country</Form.Label>
                <MultiSelect
                  name={`country`}
                  control={control}
                  // @ts-ignore
                  error={errors[`country`]}
                  options={countriesList}
                  defaultValue={""}
                  customStyles={{}}
                  rules={{ required: "Country is required" }}
                  menuPortalTarget={
                    document.getElementsByClassName("modal")[0] as HTMLElement
                  }
                  menuPosition={"fixed"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>State</Form.Label>
                {states && (
                  <MultiSelect
                    name={`state`}
                    control={control}
                    // @ts-ignore
                    error={errors[`state`]}
                    customStyles={{}}
                    options={states}
                    defaultValue={""}
                    rules={{ required: "state is required" }}
                    menuPortalTarget={
                      document.getElementsByClassName("modal")[0] as HTMLElement
                    }
                    menuPosition={"fixed"}
                  />
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className={styles.actions}>
            <Button
              type="button"
              className={`outlined action-buttons`}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`action-buttons`}
              disabled={loading}
            >
              {loading ? <div className={styles.spinner}></div> : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default CreateEmployerForm;