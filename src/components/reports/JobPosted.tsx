import React, { useState, useCallback } from "react";
import { Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { MultiValue, ActionMeta } from "react-select";
import {
  MultiSelect,
  MultiSelectAsync,
} from "../common/form-fields/MultiSelect";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import styles from "./JobPosted.module.scss";
import ReportTable from "./JobPostedTable";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/apis/dashboard";
import { debounce } from "lodash";
import {
  getFormattedAgencies,
  getFormattedJobTitles,
} from "@/helpers/asyncOptions";
import { COUNTRIES, DURATION_OPTIONS, INDUSTRIES } from "@/helpers/constants";
import { GenerateReportText, ReportTypeSelect } from "./CommonElements";
import { MultiSelectAsyncWithCheckbox, MultiSelectWithCheckbox } from "../common/form-fields/MultiSelectWithCheckbox";
import { getStartAndEndDate } from "@/helpers/date";

interface FormValues {
  reporttype: SelectOption[];
  agency: SelectOption[];
  country: SelectOption[];
  industry: SelectOption[];
  category: SelectOption[];
  status: SelectOption[];
  duration: string;
}


const industryOptions = [{value:'all',label:'All Industries'},...Object.entries(INDUSTRIES).map(([key,val])=>{
  return { value: key, label: val }
})];



const statusOptions = [
  {
    value: 'all',
    label: "All status"
  },
  {
    value: 'active',
    label: "Active"
  },
  {
    value: 'expired',
    label: "Expired"
  },
  {
    value: 'pending',
    label: "Pending"
  }
]

function JobPosted() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("Jobs Posted");
  const [reportData, setReportData] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>();


  const onSubmit = async (data:FormValues) => {
    try {
      setLoading(true)
      const response = await getReports(
        {
          type: reportType,
          agency:data.agency?.map((agency) => agency.value).join(","),
          country:data.country?.map((country) => country.value).join(","),
          industry:data.industry?.map((industry) => industry.value).join(","),
          duration:getStartAndEndDate(Number(data.duration)),
          status: data.status?.map((status) => status.value).join(",")
        }
      );
      setReportData(response.reportdata);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };


  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedAgencies(inputValue,true).then((options) => callback(!inputValue ? [{value:'all',label:'All Agencies'},...options]: options));
    }, 500),
    []
  );
  const workLocations = [{value:'all',label:"All countries"},...Object.entries(COUNTRIES).map(([key, val]) => {
    return {
      label: val.label,
      value: key,
    };
  })];

  const renderReportFields = () => {
    return (
      <Row>
        <Col  md={2}>
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
            <Form.Label>Country</Form.Label>
            <MultiSelectWithCheckbox
              name="country"
              control={control}
              error={errors.country as FieldError}
              options={workLocations}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Industry</Form.Label>
            <MultiSelectWithCheckbox
              name="industry"
              control={control}
              error={errors.industry as FieldError}
              options={industryOptions}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Job status</Form.Label>
            <MultiSelectWithCheckbox
              name="status"
              control={control}
              error={errors.status as FieldError}
              options={statusOptions}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col  md={2}>
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
        <Col>
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

export default JobPosted;
