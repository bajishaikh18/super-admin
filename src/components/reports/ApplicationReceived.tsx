import React, { useState } from "react";
import styles from "./JobPosted.module.scss";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import Select, { MultiValue, ActionMeta } from "react-select";
import router from "next/router";

interface Option {
  value: string;
  label: string;
}

const agencyOptions: Option[] = [
  { value: "all", label: "All Agencies" },
  { value: "muthu", label: "Muthu International" },
  { value: "aldhia", label: "Aldhia HR Consultants" },
  { value: "falcon", label: "Falcon Human Resources" },
  { value: "cerner", label: "Cerner HR Consulting" },
  { value: "continental", label: "Continental Holdings INC." },
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
      style={{ display: "flex", alignItems: "center", padding: "2px" }}
    >
      {data.value !== "all" && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
          style={{ marginRight: "4px" }}
        />
      )}
      {data.label}
    </div>
  );
};

function ApplicationReceived() {
  const [reportType, setReportType] = useState("Jobs Posted");
  const [selectedAgencies, setSelectedAgencies] = useState<Option[]>([]);
  const [postID, setPostID] = useState("");
  const [duration, setDuration] = useState("");

  const handleReportTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`)
    if (newReportType !== "Agency Applications Report") {
      setSelectedAgencies([]);
    }
    if (newReportType !== "Agency Applications Report") {
      setDuration("");
    }
  };

  const handleAgencyChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allAgenciesOption = selected.find((option) => option.value === "all");

    if (allAgenciesOption) {
      setSelectedAgencies(agencyOptions.slice(1));
    } else {
      setSelectedAgencies(selected as Option[]);

      if (selected.length === 0) {
        setSelectedAgencies([]);
      }
    }
  };

  const handleDurationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDuration(event.target.value);
  };

  const renderReportFields = () => {
    if (reportType === 'Agency Application Report') {
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
                <Form.Label>Post ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Post ID"
                  className={styles.input}
                  value={postID}
                  onChange={(e) => setPostID(e.target.value)}
                />
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
  };
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
          src={"/generate-report.png"}
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

export default ApplicationReceived;
