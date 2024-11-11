import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import ReportTable from './JobPostedTable';
import { useRouter } from 'next/navigation';

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

function EmployersReport() {
  const router = useRouter();
  const [reportType, setReportType] = useState('employer-report');
  const [reportData, setReportData] = useState<any[]>([]);
  const [selectedEmployers, setSelectedEmployers] = useState<Option[]>([]);
  const [duration, setDuration] = useState('');

  const handleReportTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== 'employer-report') {
      setSelectedEmployers([]);
    }
    if (newReportType !== 'Employers Applications Report') {
      setDuration('');
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
                <Form.Label>Employer</Form.Label>
                {/* Uncomment and use if Select component is required
                <Select
                  options={employerOptions}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option: CustomOption }}
                  onChange={handleEmployerChange}
                  placeholder="Select Employer"
                  value={selectedEmployers}
                  className={styles.customSelect}
                /> */}
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

export default EmployersReport;
