import React, { useCallback, useEffect, useState } from "react";
import styles from "./CreateWalkIn.module.scss";
import usePostWalkinStore from "@/stores/usePostWalkinStore";
import { AiOutlineDelete } from "react-icons/ai";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MultiSelect, MultiSelectAsync } from "../common/form-fields/MultiSelect";
import { IoClose } from "react-icons/io5";
import { getSignedUrl, uploadFile } from "@/apis/common";
import toast from "react-hot-toast";
import { createInterview, updateInterview } from "@/apis/walkin";
import { COUNTRIES, ROLE } from "@/helpers/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFormattedJobTitles } from "@/helpers/asyncOptions";
import { debounce, flatten } from "lodash";
import { generateExperienceRanges } from"@/helpers//experience";
import {  CustomDateTimePicker } from "../common/form-fields/DatePicker";

import {
 
  GetState,
} from "react-country-state-city";
import { CITIES } from "@/helpers/stateList";
import { FaPlus } from "react-icons/fa6";
import { UploadPositions } from "../common/UploadPositions";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
interface JobPosition {
  title: {
    value:string,
    label:string,
  };
  experience: string;
  salary: string;
  deleted?: string;
}

interface FormValues {
  contactNumber: string;
  altContactNumber: string;
  altCountryCode : string;
  email: string;
  countryCode: string;
  latitude:string;
  longitude:string;
  interviewDate: string;
  interviewLocation: string;
  interviewAddress: string;
  state:string;
  jobPositions: JobPosition[];
  description?: string;
}
interface SecondWalkInScreenProps {
  handleBackToPostWalkinClick: () => void;
  handleCreateWalkinClick: () => void;
  handleClose: () => void;
  isEdit?:boolean;
}
const phoneRegex = /^[0-9]{10}$/

const SecondWalkInScreen: React.FC<SecondWalkInScreenProps> = ({
  isEdit,
  handleBackToPostWalkinClick,
  handleCreateWalkinClick,
  handleClose
}) => {
  const queryClient = useQueryClient();
  const { role, authUser } = useAuthUserStore();
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([
    { title: {value:"",label:""}, experience: "0", salary: "" },
  ]);
  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
        getFormattedJobTitles(inputValue).then(options => callback(options))
    }, 500),
    []
);

const createWalkInMutation = useMutation({
  mutationFn: createInterview
});

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { selectedFacilities, setFormData,selectedFile, formData, newlyCreatedWalkin, setNewlyCreatedWalkin, setRefreshImage } = usePostWalkinStore();
  const [stateList,setStateList] = useState([]);
  const [manualEntry,setManualEntry] = useState(true);
  const [uploaded,setUploaded] = useState(true);
  const [defaultTitleOptions,setDefaultTitleOptions] = useState<{
    value:string,
    label:string,
  }[]>([]);

  useEffect(()=>{
    if(formData?.jobPositions){
      setJobPositions(formData.jobPositions);
    }
  },[formData])
  
  const handleAddMore = () => {
    const jobPositionsFromForm = getValues("jobPositions");
    console.log(jobPositionsFromForm)
    const lastPosition = jobPositionsFromForm[jobPositions.length - 1];
    if (
      !lastPosition.deleted &&
      (!lastPosition.title || !lastPosition.experience)
    ) {
      setErrorMessage(
        "Please fill in all fields before adding a new position."
      );
      return;
    }
    setErrorMessage("");
    const newPositions = [
      ...jobPositions,
      { title: {value:"",label:""}, experience: "0", salary: "" },
    ];
    setJobPositions(newPositions);
  };

  const handleRemove = (index: number) => {
    if(index === jobPositions.length-1){
      const pos = jobPositions.slice(0,-1);
      setJobPositions(pos);
      unregister(`jobPositions.${index}.title`);
      unregister(`jobPositions.${index}.experience`);
      unregister(`jobPositions.${index}.salary`);
      unregister(`jobPositions.${index}.deleted`);
    }else{

    setValue(`jobPositions.${index}.title`, {"value":"","label":""});
    setValue(`jobPositions.${index}.experience`, "");
    setValue(`jobPositions.${index}.salary`, "");
    setValue(`jobPositions.${index}.deleted`, "true");
    setErrorMessage("");

    const newPositions = jobPositions.map((x, i) => {
      if (i === index) {
        return {
          ...x,
          deleted: "true",
        };
      }
      return x;
    });
    setJobPositions(newPositions);
    }
  };
  const rangeStep = 1;  
  const steps = 11;  
  const yearsOfExperience = generateExperienceRanges(rangeStep, steps);



  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    unregister,
    watch,
    reset,
    formState: { errors,isValid },
  } = useForm<FormValues>({
    mode: 'all'
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


  const setDefaultOptionsForTitles = useCallback(async (positions:any[])=>{
    const uniquePositions = positions.filter((x:any,i:any)=>positions.indexOf(x)===i);
    const defaultOptions = flatten(await Promise.all(uniquePositions.map(async (position:string)=>{
      return getFormattedJobTitles(position);
    })))
    setDefaultTitleOptions(defaultOptions)
    return defaultOptions;
  },[])


  const onDataUpload = async (data:any)=>{
    setFormData({jobPositions:undefined});
    setJobPositions([
      { title: {value:"",label:""}, experience: "0", salary: "" },
    ]);
    reset({
      jobPositions:[
        { title: {value:"",label:""}, experience: "0", salary: "" },
      ],
    });
    const positions = data.map((x:any)=>x.Position);
    const defaultOptions = await setDefaultOptionsForTitles(positions);
    const formattedData = data.map((x:any,index:number)=>{
      const selectedOption = defaultOptions.find(option=>option.label.toLowerCase() === x.Position.toLowerCase());
      setValue(`jobPositions.${index}.title`, selectedOption);
      setValue(`jobPositions.${index}.experience`, x.Experience.toString());
      setValue(`jobPositions.${index}.salary`, x.Salary.toString());
      return {
        title:selectedOption,
        experience: x.Experience.toString(),
        salary: x.Salary.toString()
      }
    })
    const formData = {
      jobPositions: formattedData
    }
    setUploaded(true);
    setFormData(formData)
    setJobPositions(formattedData);
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setFormData(data);

      const contacts = [`${data.countryCode}-${data.contactNumber}`];
      if (data.altContactNumber && data.altCountryCode) {
        contacts.push(`${data.altCountryCode}-${data.altContactNumber}`);
      }
      const agencyId = role===ROLE.employer ? authUser?.agencyId : formData?.agency?.value;
      const jobData = {
        agencyId:agencyId,
        location: formData?.location,
        expiry: formData?.expiry,
        positions: data?.jobPositions
          .filter((x) => x && x.title?.value)
          .map((position) => ({
            jobTitleId: position.title.value,
            experience: Number(position.experience),
            salary: position.salary,
          })),
        amenities: selectedFacilities,
        contactNumbers: contacts,
        state: data.state,
        country: formData?.country || "in",
        email: data.email,
        description: data.description,
        interviewDate: data.interviewDate,
        interviewLocation:data.interviewLocation,
        interviewAddress: data.interviewAddress,
        latitude:data.latitude,
        longitude:data.longitude
      };

      let res; 

      if (isEdit && (formData?._id || newlyCreatedWalkin?._id)) {
        res = await updateInterview((formData?._id || newlyCreatedWalkin?._id)!, jobData);
        await queryClient.invalidateQueries({
          queryKey: ["walkinDetails", formData?.interviewId?.toString()],
          refetchType: "all",
        });
      } else {
        res = await createWalkInMutation.mutateAsync(jobData); 
        if(!selectedFile)
        await queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("walkins"),
          refetchType: "all",
        });
      }

      if (selectedFile) {
        const response = await getSignedUrl("jobImage", selectedFile?.type!, "jobId", res.interview._id || formData?._id);
        if (response) {
          await uploadFile(response.uploadurl, selectedFile!);
          await updateInterview(res.interview._id! || formData?._id!, { imageUrl: response.keyName });
          setRefreshImage(true);
          await queryClient.invalidateQueries({
            predicate: (query) => query.queryKey.includes("walkins"),
            refetchType: "all",
          });
        }
      }
      setFormData({_id: res.interview?._id,...data,agency:{value:agencyId||"",label:"Test"}});
      setNewlyCreatedWalkin(res.interview);
      toast.success(`Interview ${isEdit ? "updated" : "created"} successfully`);
      handleCreateWalkinClick();
      setLoading(false);
    } catch {
      toast.error(`Error while ${isEdit ? "updating" : "creating"} Interview. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>
          {
            isEdit ? "Edit " : "Create a "
          }
          Walkin <span>(1/2)</span>
        </h2>
        <IoClose
          className={styles.closeButton}
          onClick={handleClose}
        >
          
        </IoClose> 
      </div>
      {loading ? (
        <div className={styles.popupContent}>
          <p className={styles.loadingContent}>
            Your Interview is {isEdit?"updating":"creating"} please wait
          </p>
          <div className={styles.createSpinner}></div>
        </div>
      ) : (
        <Form className={"post-form"} onSubmit={handleSubmit(onSubmit)}>
           
          
          <div className={`${styles.overFlowSection} scroll-box`}>
          {
              (!manualEntry && !uploaded) && <>
                <UploadPositions handleUploadProcessed={onDataUpload}/>
                <div className={styles.manualUpload}>
                {
                  (!manualEntry && !uploaded) && <button
                        type="button"
                        className={`${styles.addMoreButton} ${styles.manualButton}`}
                        onClick={()=>setManualEntry(true)}
                      ><FaPlus fontSize={10}/> Add Manually</button>
                }
               </div>
              </>
            }
          {
              (manualEntry || uploaded) && 
          <Form.Group className={styles.formGroup}>
            <label className={styles.formLabel}>Add positions</label>
            <button
                type="button"
                className={styles.addMoreButton}
                onClick={()=>{setManualEntry(false);setUploaded(false);}}
              >
                Upload positions
              </button>
            <div className={styles.overFlowTable}>
            <Table>
              <thead>
                <tr>
                  <th className="w-50">Job Title</th>
                  <th className="w-30">Exp Required</th>
                  <th className="w-20">Salary (Optional)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobPositions.map((position, index) => {
                  if (position?.deleted) {
                    return null;
                  }
                  return (
                    <tr key={index}>
                      <td>
                        <MultiSelectAsync
                          name={`jobPositions.${index}.title`}
                          control={control}
                          defaultOptions={defaultTitleOptions}
                          placeHolder="Type to search job titles"
                          // @ts-ignore
                          error={errors[`jobPositions.${index}.title`]}
                          loadOptions={loadOptionsDebounced}
                          defaultValue={formData?.jobPositions?.[index]?.title}
                          rules={{ required: "Job title is required" }}
                          customStyles={{
                            border: "none !important",
                            boxShadow: "none !important",
                            fontSize: "14px",
                            "&:focus": {
                              border: "none",
                            },
                          }}
                          menuPortalTarget={document.getElementsByClassName('modal')[0] as HTMLElement}
                          menuPosition={"fixed"}
                        />
                      </td>
                      <td>
                        <MultiSelect
                          name={`jobPositions.${index}.experience`}
                          control={control}
                          // @ts-ignore
                          error={errors[`jobPositions.${index}.experience`]}
                          options={yearsOfExperience}
                          defaultValue={
                            formData?.jobPositions?.[index]?.experience
                          }
                          rules={{ required: "Job Experience is required" }}
                          customStyles={{
                            border: "none !important",
                            boxShadow: "none !important",
                            fontSize: "14px",
                            "&:focus": {
                              border: "none",
                            },
                          }}
                          menuPortalTarget={document.getElementsByClassName('modal')[0] as HTMLElement}
                          menuPosition={"fixed"}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="0-0"
                          className={styles.input}
                          defaultValue={formData?.jobPositions?.[index]?.salary}
                          {...register(`jobPositions.${index}.salary`, {
                          })}
                        />
                      </td>
                      <td>
                        {index != 0 && (
                          <AiOutlineDelete
                            className={styles.positionDelete}
                            onClick={() => handleRemove(index)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
            {errorMessage && (
              <div>
                <Form.Text className="error">{errorMessage}</Form.Text>
              </div>
            )}

            <button
              type="button"
              className={styles.addMoreButton}
              onClick={handleAddMore}
            >
              Add More
            </button>
          </Form.Group>
          }
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
                 {
                  Object.values(COUNTRIES).map(country=>{
                    return  <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  })
                }
              </Form.Select>
              <Form.Control
                defaultValue={formData?.contactNumber}
                aria-label="Contact number"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: phoneRegex,
                    message: "Enter a valid contact number"
                  }
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

          <Form.Group className={styles.formGroup}>
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
          </Form.Group>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Contact Email Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email Id"
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
          <Form.Label>Walkin Date & Time</Form.Label>
          <CustomDateTimePicker
            name="interviewDate"
            control={control}
            error={errors.interviewDate}
            defaultValue={formData?.interviewDate}
            minDate={new Date()}
            rules={{ required: "interviewDate date is required" }}
          />
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
                    name={`interviewLocation`}
                    control={control}
                    // @ts-ignore
                    error={errors[`interviewLocation`]}
                    customStyles={{}}
                    options={cities}
                    defaultValue={formData?.interviewLocation}
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

          <Form.Group className={styles.formGroup}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            defaultValue={formData?.interviewAddress}
            {...register("interviewAddress", { required: true })}
          />
          {errors.interviewAddress && (
            <Form.Text className="error">{errors.interviewAddress.message}</Form.Text>
          )}
        </Form.Group>
        <Row>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Latitude (Optional)</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter Latitude"
                className={styles.input}
                defaultValue={formData?.latitude}
                isInvalid={!!errors.latitude}
                {...register("latitude", {
                pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Enter a valid numeric latitude"
                },
                validate: (value) =>
                value === "" || (parseFloat(value) >= -90 && parseFloat(value) <= 90) || "Latitude must be between -90 and 90"
                })}
              />
              {errors.latitude && (
                  <Form.Text className="error">{errors.latitude.message}</Form.Text>
                )}
          </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className={styles.formGroup}>
                <Form.Label>Longitude (Optional)</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter Longitude"
                className={styles.input}
                defaultValue={formData?.longitude}
                isInvalid={!!errors.longitude}
                {...register("longitude", {
                pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Enter a valid numeric longitude"
               },
               validate: (value) =>
                value === "" || (parseFloat(value) >= -180 && parseFloat(value) <= 180) || "Longitude must be between -180 and 180"
               })}
              />
              {errors.longitude && (
                  <Form.Text className="error">{errors.longitude.message}</Form.Text>
                )}
          </Form.Group>
            </Col>
          </Row>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={formData?.description}
              {...register("description")}
            />
          </Form.Group>
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              className={`outlined action-buttons`}
              onClick={handleBackToPostWalkinClick}
            >
              Back
            </Button>
            <Button
              type="submit"
              className={`action-buttons ${
                isValid ? "" : styles.disabled
              }`}
              disabled={!isValid || loading}               
              >
               {
            isEdit ? "Edit " : "Create a "
          }
             Walkin
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default SecondWalkInScreen;
