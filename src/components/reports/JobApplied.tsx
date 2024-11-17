import React, { useCallback, useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import ReportTable from './ReportTable';
import { useRouter } from 'next/navigation';
import { MultiSelect} from "../common/form-fields/MultiSelect";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import { getReports } from "@/apis/dashboard";
import { Duration, GenerateReportText, ReportTypeSelect } from './CommonElements';
import { MultiSelectAsyncWithCheckbox } from '../common/form-fields/MultiSelectWithCheckbox';
import { getFormattedJobTitles } from '@/helpers/asyncOptions';
import { debounce } from 'lodash';
import { getStartAndEndDate } from '@/helpers/date';
import { DURATION_OPTIONS } from '@/helpers/constants';


interface FormValues {  
  jobtitle: SelectOption[];
  duration: string;
}


function JobApplied() {
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 
  const [dateRange, setDateRange] = useState("");


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>();
  
  const onSubmit = async (data:FormValues) => {
    try {
      setLoading(true)
      const response = await getReports(
        {
          type: "jobs-applied",
          jobTitle:data.jobtitle?.map((title) => title.value).join(","),
          duration: data.duration === 'custom'? dateRange : getStartAndEndDate(Number(data.duration)),
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
          <Duration watch={watch} control={control} errors={errors} handleDateChange={setDateRange}/>

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

export default JobApplied;
