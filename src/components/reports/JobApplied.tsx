import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import ReportTable from './JobPostedTable';
import { useRouter } from 'next/navigation';
import { MultiSelect} from "../common/form-fields/MultiSelect";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";


interface FormValues {  
  jobtitle: SelectOption;
  duration: SelectOption;
}
interface Option {
  value: string;
  label: string;
}
const jobtitleOptions: Option[] = [
  { value: "all", label: "All" },
];
const durationOptions: Option[] = [
  { value: "this month", label: "This Month" },
  { value: "last month", label: "Last Month" },
  { value: "last 3 months", label: "Last 3 months" },
  { value: "last 6 months", label: "Last 6 months" },
  { value: "data range", label: "Data Range" },
];

const CustomOption = (props: {
  data: Option;
  innerRef: React.Ref<HTMLDivElement>;
  innerProps: any;
  isSelected: boolean;
}) => {
  const { data, innerRef, innerProps, isSelected } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: 'flex', alignItems: 'center', padding: '2px' }}
    >
      {data.value !== 'all' && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
          style={{ marginRight: '4px' }}
        />
      )}
      {data.label}
    </div>
  );
};

function JobApplied() {
  const router = useRouter();
  const [reportType, setReportType] = useState('job-applied');
  const [duration, setDuration] = useState('');
  const [selectedJob, setSelectedJob] = useState<Option[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);

  const {
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>();
  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== 'job-applied') {
      setSelectedJob([]);
    }
    if (newReportType !== 'Job Applied Report') {
      setDuration('');
    }
  };
  const handleJobTitleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(event.target.value);
  };


  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(event.target.value);
  };
  const handleSubmit = () => {
    const exampleData = [
      { employerId: 'EMP1', companyName: 'N/A', firstName: 'N/A', lastName: 'N/A', mobile: 'N/A', landline: 'N/A', email: 'N/A', regDate: '2023-10-01', status: 'Active' },
      { employerId: 'EMP2', companyName: 'N/A', firstName: 'N/A', lastName: 'N/A', mobile: 'N/A', landline: 'N/A', email: 'N/A', regDate: '2023-09-15', status: 'Active' },
    ];
    setReportData(exampleData);
  };

  const renderReportFields = () => {
      return (
        <Row>
          <Col>
          <Form.Group className={`${styles.selectField} ${styles.Dropdown}`}>
            <Form.Label>Job Title</Form.Label>
            <MultiSelect
              name="jobtitle"
              control={control}
              error={errors.jobtitle as FieldError}
              options={jobtitleOptions}
              onChange={handleJobTitleChange}
              customStyles={{}}
              rules={{ required: "Job Title is required" }}
            />
            </Form.Group>
          </Col>
          <Col>
          <Form.Group className={`${styles.selectField} ${styles.Dropdown}`}>
            <Form.Label>Duration</Form.Label>
            <MultiSelect
              name="duration"
              control={control}
              error={errors.duration as FieldError}
              options={durationOptions}
              onChange={handleDurationChange}
              customStyles={{}}
              rules={{ required: "Duration is required" }}
            />
          </Form.Group>
          </Col>
          <Col>
          <Button onClick={handleSubmit} className={styles.submitButton}>
              Submit
            </Button>
          </Col>
        </Row>
      );
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <Form.Group className={styles.reportTypeField}>
          <Form.Label>Report Type</Form.Label>
          <Col>
            <Form.Select onChange={handleReportTypeChange} value={reportType}>
              <option value={"jobs-posted"}>Jobs Posted</option>
              <option value={"application-received"}>Agency Applications Report</option>
              <option value={"job-applied"}>Job Applied Report</option>
              <option value={"user-report"}>Users Report</option>
              <option value={"employer-report"}>Employers Applications Report</option>
            </Form.Select>
          </Col>
        </Form.Group>
        {renderReportFields()}
      </div>

      {reportData.length === 0 && (
        <div className={styles.generateReportSection}>
          <div className={styles.generateReportImage}>
            <Image src={'/generate-report.png'} alt="Generate Report" width={100} height={100} />
          </div>
          <h3>Generate Report</h3>
          <p>Generate the report by selecting the appropriate filters above and clicking Submit</p>
        </div>
      )}

      {reportData.length > 0 && (
        <ReportTable data={reportData} />
      )}
    </div>
  );
}

export default JobApplied;
