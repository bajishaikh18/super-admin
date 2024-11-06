import React, { useState } from 'react';
import styles from './JobPosted.module.scss';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import Select, { MultiValue, ActionMeta } from 'react-select';

function ApplicationReceived() {

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <Form.Group className={styles.reportTypeField}>
          <Form.Label>Report Type</Form.Label>
          <Col>
            <Form.Select>
              <option>Jobs Posted</option>
              <option>Agency Applications Report</option>
              <option>Job Applied Report</option>
              <option>Users Report</option>
              <option>Employers Applications Report</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Agency</Form.Label>
              <Form.Select>
                <option>All</option>
              </Form.Select>         
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className={styles.selectField}>
              <Form.Label>Post ID</Form.Label>
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
      </div>

      <div className={styles.generateReportImage}>
        <Image src={'/generate-report.png'} alt="Generate Report" width={100} height={100} />
      </div>
      <h3>Generate Report</h3>
      <p>Please select report details you are looking for</p>
    </div>
  );
}

export default ApplicationReceived;