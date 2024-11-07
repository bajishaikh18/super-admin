import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import Select, { MultiValue, ActionMeta } from 'react-select';
import router from 'next/router';

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
  const [reportType, setReportType] = useState('Jobs Posted');
  const [selectedAgencies, setSelectedAgencies] = useState<Option[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);
  const [duration, setDuration] = useState('');


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

  const handleReportTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== "Job Posted Report") {
      setSelectedAgencies([]);
    }
    if (newReportType !== "Job Posted Report") {
      setDuration("");
    }
  };

  const renderReportFields = () => {
    if (reportType === "Jobs Posted") {
      return (
        <Row>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Agency</Form.Label>
              <Select
                options={agencyOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CustomOption }}
                onChange={handleAgencyChange}
                placeholder="Select Agency"
                value={selectedAgencies}
                className={styles.customSelect}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Country</Form.Label>
              <Select
                options={countryOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CustomOption }}
                onChange={handleCountryChange}
                placeholder="Select Country"
                value={selectedCountries}
                className={styles.customSelect}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Industry</Form.Label>
              <Select
                options={industryOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CustomOption }}
                onChange={handleIndustryChange}
                placeholder="Select Industry"
                value={selectedIndustries}
                className={styles.customSelect}
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
            <Button type="submit" className={styles.submitButton}>
              Submit
            </Button>
          </Col>
        </Row>
      );
    }
    return null;
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <Form.Group className={styles.reportTypeField}>
          <Form.Label>Report Type</Form.Label>
          <Col>
            <Form.Select onChange={handleReportTypeChange} value={reportType}>
              <option>Jobs Posted</option>
              <option>Agency Applications Report</option>
              <option>Job Applied Report</option>
              <option>Users Report</option>
              <option>Employers Applications Report</option>
            </Form.Select>
          </Col>
        </Form.Group>
        {renderReportFields()}
      </div>

      <div className={styles.generateReportImage}>
        <Image src={'/generate-report.png'} alt="Generate Report" width={100} height={100} />
      </div>
      <h3>Generate Report</h3>
      <p>Please select report details you are looking for</p>
    </div>
  );
}

export default JobPosted;
