import React, {  useEffect, useState } from "react";

import styles from "./CreateAgency.module.scss";
import { Button, Col, Form,Row } from "react-bootstrap";
import {  useForm } from "react-hook-form";
import {
  MultiSelect,
} from "../common/form-fields/MultiSelect";
import { IoClose } from "react-icons/io5";

interface CreateTradeScreenProps {
  countries?: string[]; 
  
  isEdit?: boolean;
  handleContinueClick: () => void;
  handleClose: () => void;
  latitude?: string;
  longitude?: string; 
  
 
}
import useAgencyStore, {CreateTradeFormData } from "@/stores/useAgencyStore";

import { createTradeTestCenter,updateTradeTestCenter } from "@/apis/trade-test-center";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  GetState,
} from "react-country-state-city";
import { CITIES } from "@/helpers/stateList";


const CreateTradeScreen: React.FC<CreateTradeScreenProps> = ({
  isEdit,
 
  handleContinueClick,
  handleClose,
}) => {
  const { tradeFormData} = useAgencyStore();
  const [loading, setLoading] = useState(false);
  const [stateList,setStateList] = useState([]);
  const queryClient = useQueryClient();
  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
    control
  } = useForm<CreateTradeFormData>({
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

  const onSubmit = async (data: CreateTradeFormData) => {
    try {
      setLoading(true);
     
      const contactNo = `${data.countryCode}-${data.contactNumber}`;
      const payload = {
        ...data,
        phone: contactNo,
        approved: true
      };
      let res;
      if (isEdit && tradeFormData?._id) {
        res = await updateTradeTestCenter(tradeFormData?._id,payload);
   
      } else {
        res = await createTradeTestCenter(payload);
      }
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes('testCenters');
        },
        refetchType:'all'
      })
      
     
      toast.success(`Trade Center ${isEdit ? "updated" : "created"} successfully`);
      handleContinueClick();
      setLoading(false);
    } catch (error) {
      toast.error(`Error while ${isEdit?'updating':'creating'} Trade Center. Please try again`)
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(tradeFormData){
      reset(tradeFormData)
    }
  },[tradeFormData])

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>
          {isEdit ? "Edit " : "Create "}
          Trade Center 
        </h2>

        <IoClose className={styles.closeButton} onClick={handleClose}></IoClose>
      </div>
      {
        loading ?  <div className={styles.popupContent}>
        <p className={styles.loadingContent}>
          Your Trade Center is {isEdit?"updating":"creating"} please wait
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
            defaultValue={tradeFormData?.name}
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
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            defaultValue={tradeFormData?.address}
            {...register("address", { required: true })}
          />
          {errors.address && (
            <Form.Text className="error">{errors.address.message}</Form.Text>
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
    defaultValue={tradeFormData?.latitude ?? "" as string}  
    isInvalid={!!errors.latitude}
    {...register("latitude", {
      pattern: {
        value: /^-?\d+(\.\d+)?$/, 
        message: "Enter a valid numeric latitude"
      },
      validate: (value) =>
        value === "" || 
        (Number(value) >= -90 && Number(value) <= 90) ||  
        "Latitude must be between -90 and 90"
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
                defaultValue={tradeFormData?.longitude}
                isInvalid={!!errors.longitude}
                {...register("longitude", {
                pattern: {
                value: /^-?\d+(\.\d+)?$/,
                message: "Enter a valid numeric longitude"
               },
               
                validate: (value) =>
                  value === "" || 
                  (Number(value) >= -180 && Number(value) <= 180) ||  
                  "Longitude must be between -180 and 180"
              })}
              />
              {errors.longitude && (
                  <Form.Text className="error">{errors.longitude.message}</Form.Text>
                )}
          </Form.Group>


            </Col>
          </Row>

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
                    defaultValue={tradeFormData?.state}
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
                    defaultValue={tradeFormData?.city}
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
            type="submit"
            className={`action-buttons ${isValid ? "" : styles.disabled}`}
            disabled={!isValid}
          >
            {isEdit ? "Edit " : "Create "}
            Trade Center
          </Button>
        </div>
      </Form>
      }
   
    </div>
  );
};

export default CreateTradeScreen;
