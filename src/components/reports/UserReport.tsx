import React, { useState,useCallback } from 'react';
import styles from "./JobPosted.module.scss";
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import { MultiValue, ActionMeta } from 'react-select';
import { MultiSelect,} from "../common/form-fields/MultiSelect";
import { useRouter } from 'next/navigation';
import ReportTable from './JobPostedTable';
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import { getReports } from "@/apis/dashboard";
import { GenerateReportText, ReportTypeSelect } from './CommonElements';
import { MultiSelectAsyncWithCheckbox, MultiSelectWithCheckbox } from '../common/form-fields/MultiSelectWithCheckbox';
import { debounce } from 'lodash';
import { getFormattedJobTitles } from '@/helpers/asyncOptions';
import { getStartAndEndDate } from '@/helpers/date';
import { DURATION_OPTIONS, INDUSTRIES } from '@/helpers/constants';

interface FormValues {
  jobtitle: SelectOption[];
  industry: SelectOption[];
  duration: string;

}

const industryOptions = [{value:'all',label:'All Industries'},...Object.entries(INDUSTRIES).map(([key,val])=>{
  return { value: key, label: val }
})];



function UserReport() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 


  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data:FormValues) => {
    try {
      setLoading(true)
      const response = await getReports(
        {
          type: "Users Report",
          jobTitle:data.jobtitle?.map((title) => title.value).join(","),
          industry:data.industry?.map((industry) => industry.value).join(","),
          duration:getStartAndEndDate(Number(data.duration)),
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
      getFormattedJobTitles(inputValue).then((options) => callback(!inputValue ? [{value:'all',label:'All Agencies'},...options]: options));
    }, 500),
    []
  );

  const renderReportFields = () => {
      return (
        <Row>
          <Col md={2}>
          <Form.Group className={`${styles.selectField}`}>
            <Form.Label>Job Title</Form.Label>
            <MultiSelectAsyncWithCheckbox
              name="jobtitle"
              control={control}
              error={errors.jobtitle as FieldError}
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
          <Form.Group className={`${styles.selectField}`}>
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
          <Form.Group className={`${styles.selectField}`}>
            <Form.Label>Duration</Form.Label>
            <MultiSelect
              name="duration"
              control={control}
              error={errors.duration as FieldError}
              options={DURATION_OPTIONS}
              customStyles={{}}
            />
          </Form.Group>
          </Col>
          <Col>
          <Button onClick={handleSubmit(onSubmit)} className={styles.submitButton} disabled={loading}>
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

export default UserReport;