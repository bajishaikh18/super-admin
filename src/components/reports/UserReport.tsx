import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import Select, { MultiValue, ActionMeta } from 'react-select';

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
  const [reportType, setReportType] = useState('Jobs Posted');
  const [duration, setDuration] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);

    if (newReportType !== 'Users Report') {
      setSelectedUsers([]);
    }
    if (newReportType !== 'Jobs Posted') {
      setSelectedIndustries([]);
    }
    if (newReportType !== 'Job Applied Report') {
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

  const renderReportFields = () => {
    if (reportType === 'Users Report') {
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
        <Image src="/generate-report.png" alt="Generate Report" width={100} height={100} />
      </div>
      <h3>Generate Report</h3>
      <p>Please select report details you are looking for</p>
    </div>
  );
}

export default UserReport;
