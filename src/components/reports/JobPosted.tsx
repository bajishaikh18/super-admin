import React, { useState, useCallback} from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { MultiValue, ActionMeta } from 'react-select';
import { MultiSelectAsync } from "../common/form-fields/MultiSelect";
import { debounce } from "lodash";
import { FieldError, useForm } from "react-hook-form";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { SelectOption } from "@/helpers/types";
import styles from './JobPosted.module.scss';
import ReportTable from './JobPostedTable';
import { useRouter } from 'next/navigation';

interface FormValues {
  agency: SelectOption;
  country: SelectOption;
  industry: SelectOption;
}
interface Option {
  value: string;
  label: string;
}

const agencyOptions: Option[] = [
  { value: 'all', label: 'All Agencies' },
  { value: 'muthu', label: 'Muthu International' },
  { value: 'aldhia', label: 'Aldhia HR Consultants' },
  { value: 'falcon', label: 'Falcon Human Resources' },
  { value: 'cerner', label: 'Cerner HR Consulting' },
  { value: 'continental', label: 'Continental Holdings INC.' },
];

const countryOptions: Option[] = [
  { value: 'all', label: 'All' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'kuwait', label: 'Kuwait' },
  { value: 'oman', label: 'Oman' },
  { value: 'qatar', label: 'Qatar' },
  { value: 'saudi', label: 'Saudi Arabia' },
];

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
    <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '2px' }}>
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

function JobPosted() {
  const router = useRouter();
  const [duration, setDuration] = useState('');
  const [reportType, setReportType] = useState('Job Posted');
  const [selectedAgencies, setSelectedAgencies] = useState<Option[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);
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

  const handleAgencyChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allAgenciesOption = selected.find(option => option.value === 'all');
    setSelectedAgencies(allAgenciesOption ? agencyOptions.slice(1) : selected as Option[]);
  };

  const handleCountryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allCountriesOption = selected.find(option => option.value === 'all');
    setSelectedCountries(allCountriesOption ? countryOptions.slice(1) : selected as Option[]);
  };

  const handleIndustryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allIndustriesOption = selected.find(option => option.value === 'all');
    setSelectedIndustries(allIndustriesOption ? industryOptions.slice(1) : selected as Option[]);
  };


  const handleSubmit = () => {
    const exampleData = [
      { employerId: 'EMP1', companyName: 'N/A', firstName: 'N/A', lastName: 'N/A', mobile: 'N/A', landline: 'N/A', email: 'N/A', regDate: '2023-10-01', status: 'Active' },
      { employerId: 'EMP2', companyName: 'N/A', firstName: 'N/A', lastName: 'N/A', mobile: 'N/A', landline: 'N/A', email: 'N/A', regDate: '2023-09-15', status: 'Active' },
    ];
    setReportData(exampleData);
  };

  const handleReportTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`);
    if (newReportType !== 'Jobs Posted') {
      setSelectedAgencies([]);
    }
    if (newReportType !== 'Jobs Posted') {
      setDuration("");
    }
  };

  const renderReportFields = () => {
  return (
        <Row>
          <Col>
            <Form.Group className={styles.selectField}>
            <Form.Label>Agency</Form.Label>
            <MultiSelectAsync
            name="agency"
            control={control}
            error={errors.agency as FieldError}
            loadOptions={loadOptionsDebounced}
            rules={{ required: "Agency is required" }}
            customStyles={{}}
            menuPortalTarget={document.getElementsByClassName("modal")[0] as HTMLElement}
            menuPosition={"fixed"}
          />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Country</Form.Label>
              <MultiSelectAsync
            name="country"
            control={control}
            error={errors.country as FieldError}
            loadOptions={loadOptionsDebounced}
            rules={{ required: "Country is required" }}
            customStyles={{}}
            menuPortalTarget={document.getElementsByClassName("modal")[0] as HTMLElement}
            menuPosition={"fixed"}
          />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
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
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option>All</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Duration</Form.Label>
              <Form.Select>
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

export default JobPosted;