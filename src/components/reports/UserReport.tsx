import React, { useState,useCallback } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { MultiValue, ActionMeta } from 'react-select';
import { MultiSelectAsync } from "../common/form-fields/MultiSelect";
import { useRouter } from 'next/navigation';
import ReportTable from './JobPostedTable';
import { debounce } from "lodash";
import { FieldError, useForm } from "react-hook-form";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { SelectOption } from "@/helpers/types";
interface FormValues {
  industry: SelectOption;
}
interface Option {
  value: string;
  label: string;
}

const industryOptions: Option[] = [
  { value: 'all', label: 'All' },
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'mining', label: 'Mining' },
  { value: 'agriculture', label: 'Agriculture' },
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
  const [reportType, setReportType] = useState('user-report');
  const [duration, setDuration] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedAgencies(inputValue).then(options => callback(options));
    }, 500),
    []
  );

  const {
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== 'user-report') {
      setSelectedUsers([]);
    }
    if (newReportType !== 'Users Report') {
      setSelectedIndustries([]);
    }
    if (newReportType !== 'Users Report') {
      setDuration('');
    }
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
            <Form.Group className={styles.selectField}>
              <Form.Label>Job Title</Form.Label>
              <Form.Select>
                <option>All</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
          <Form.Group className={`${styles.selectField} ${styles.Dropdown}`}>
            <Form.Label>Industry</Form.Label>
              <MultiSelectAsync
            name="industry"
            control={control}
            error={errors.industry as FieldError}
            loadOptions={loadOptionsDebounced}
            rules={{ required: "Industry is required" }}
            customStyles={{}}
            menuPortalTarget={document.getElementsByClassName("modal")[0] as HTMLElement}
            menuPosition={"fixed"}
          />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Duration</Form.Label>
              <Form.Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Date Range</option>
              </Form.Select>
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
                <option value={"job-posted"}>Jobs Posted</option>
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

export default UserReport;