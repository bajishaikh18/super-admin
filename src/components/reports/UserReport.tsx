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

interface FormValues {
  jobtitle: SelectOption;
  industry: SelectOption;
  duration: SelectOption;

}
interface Option {
  value: string;
  label: string;
}
const jobtitleOptions: Option[] = [
  { value: "all", label: "All" },
];
const industryOptions: Option[] = [
  { value: 'all', label: 'All' },
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'mining', label: 'Mining' },
  { value: 'agriculture', label: 'Agriculture' },
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

function UserReport() {
  const router = useRouter();
  const [reportType, setReportType] = useState('Users Report');
  const [duration, setDuration] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); 


  const {
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== 'Users Report') {
      setSelectedUsers([]);
    }
    if (newReportType !== 'Users Report') {
      setSelectedIndustries([]);
    }
    if (newReportType !== 'Users Report') {
      setDuration('');
    }
  };
  const handleJobTitleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(event.target.value);
  };

  const handleIndustryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allIndustriesOption = selected.find(option => option.value === 'all');

    if (allIndustriesOption) {
      setSelectedIndustries(industryOptions.slice(1)); 
    } else {
      setSelectedIndustries(selected as Option[]);
      
      if (selected.length === 0) {
        setSelectedIndustries([]);
      }
    }
  };
  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(event.target.value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await getReports(
        reportType, 
        selectedUsers.map((agency) => agency.value).join(','),
        selectedIndustries.map((agency) => agency.value).join(','),
        duration
      );
      const formattedData = response.Reportdata.map((item) => ({
        jobId: item.jobId,
        agencyName: item.agencyData?.name, 
        firstName: item.firstName,    
        lastName: item.lastName, 
        phone: item.phone, 
        email: item.email,
        createdAt: item.createdAt,
        status: item.status
      }));

      setReportData(formattedData); 
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
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
            <Form.Label>Industry</Form.Label>
            <MultiSelect
              name="industry"
              control={control}
              error={errors.industry as FieldError}
              options={industryOptions}
              onChange={handleIndustryChange}
              customStyles={{}}
              rules={{ required: "Industry is required" }}
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
          <Button onClick={handleSubmit} className={styles.submitButton} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Submit"}
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
                <option value={"Applications-Received"}>Agency Applications Report</option>
                <option value={"Jobs-Applied"}>Job Applied Report</option>
                <option value={"Users Report"}>Users Report</option>
                <option value={"Employer-Applications-Report"}>Employers Applications Report</option>

            </Form.Select>
          </Col>
        </Form.Group>
        {renderReportFields()}
      </div>

      {reportData.length === 0 && (
        <div className={styles.generateReportSection}>
          <div className={styles.generateReportImage}>
            <Image src={"/generate-report.png"} alt="Generate Report" width={100} height={100} />
          </div>
          <h3>Generate Report</h3>
          <p>Generate the report by selecting the appropriate filters above and clicking Submit</p>
        </div>
      )}

      {reportData.length > 0 && <ReportTable data={reportData} />}
    </div>
  );
}

export default UserReport;