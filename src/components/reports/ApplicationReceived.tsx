import React, { useState, useCallback } from "react";
import styles from "./JobPosted.module.scss";
import { Form, Button, Row, Col , Spinner } from "react-bootstrap";
import ReportTable from "./JobPostedTable";
import {
  MultiSelect,
} from "../common/form-fields/MultiSelect";
import { debounce } from "lodash";
import { FieldError, useForm } from "react-hook-form";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { SelectOption } from "@/helpers/types";
import { getReports } from "@/apis/dashboard";
import { GenerateReportText, ReportTypeSelect } from "./CommonElements";
import { MultiSelectAsyncWithCheckbox } from "../common/form-fields/MultiSelectWithCheckbox";
import { getStartAndEndDate } from "@/helpers/date";
import { DURATION_OPTIONS } from "@/helpers/constants";

interface FormValues {
  agency: SelectOption[];
  duration: string;
  postId:string;
}

function ApplicationReceived() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedAgencies(inputValue,true).then((options) => callback(!inputValue ? [{value:'all',label:'All Agencies'},...options]: options));
    }, 500),
    []
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<FormValues>();
  
  const onSubmit = async (data:FormValues) => {
    try {
      setLoading(true)
      const response = await getReports(
        {
          type: "Applications Received",
          agency:data.agency?.map((agency) => agency.value).join(","),
          duration:getStartAndEndDate(Number(data.duration)),
          postId: data.postId
        }
      );
      setReportData(response.reportdata);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const renderReportFields = () => {
    return (
      <Row>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Agency</Form.Label>
            <MultiSelectAsyncWithCheckbox
              name="agency"
              control={control}
              error={errors.agency as FieldError}
              loadOptions={loadOptionsDebounced}
              customStyles={{}}
              isMulti={true}
              menuPortalTarget={
                document.getElementsByClassName("modal")[0] as HTMLElement
              }
              menuPosition={"fixed"}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Post ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Post ID"
              {...register("postId")}    
                      />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Duration</Form.Label>
            <MultiSelect
              name="duration"
              control={control}
              error={errors.duration as FieldError}
              options={DURATION_OPTIONS}
              menuListStyles={{
                fontSize:"13px",
              }}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button
            onClick={handleSubmit(onSubmit)}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <Row>
          <Col md={2}>
         <ReportTypeSelect />
         </Col>
        </Row>
        {renderReportFields()}
      </div>

      {reportData.length === 0 && (
        <GenerateReportText/>
      )}

      {reportData.length > 0 && <ReportTable data={reportData} />}
    </div>
  );
}

export default ApplicationReceived;
