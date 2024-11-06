import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';

interface Option {
  value: string;
  label: string;
}

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
  const [reportType, setReportType] = useState('Jobs Posted');
  const [duration, setDuration] = useState('');
  const [selectedJob, setSelectedJob] = useState<Option[]>([]);

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);

    if (newReportType !== 'Job Applied Report') {
      setSelectedJob([]);
    }
    if (newReportType !== 'Job Applied Report') {
      setDuration('');
    }
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(event.target.value);
  };

  const renderReportFields = () => {
    if (reportType === 'Job Applied Report') {
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
              <Form.Label>Duration</Form.Label>
              <Form.Select value={duration} onChange={handleDurationChange}>
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
        <Image
          src="/generate-report.png"
          alt="Generate Report"
          width={100}
          height={100}
        />
      </div>
      <h3>Generate Report</h3>
      <p>Please select report details you are looking for</p>
    </div>
  );
}

export default JobApplied;
