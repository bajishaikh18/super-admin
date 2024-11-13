import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Row, Col, Image, InputGroup } from "react-bootstrap";
import { MultiValue, ActionMeta } from "react-select";
import { MultiSelect, MultiSelectAsync } from "../common/form-fields/MultiSelect"; 
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import styles from "./JobPosted.module.scss";
import ReportTable from "./JobPostedTable";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/apis/dashboard";
import { debounce } from "lodash";
import { getFormattedAgencies, getFormattedJobTitles } from "@/helpers/asyncOptions";

interface FormValues {
  agency: SelectOption;
  country: SelectOption;
  industry: SelectOption;
}

interface Option {
  value: string;
  label: string;
}


const countryOptions: Option[] = [
  { value: "all", label: "All" },
  { value: "dubai", label: "Dubai" },
  { value: "kuwait", label: "Kuwait" },
  { value: "oman", label: "Oman" },
  { value: "qatar", label: "Qatar" },
  { value: "saudi", label: "Saudi Arabia" },
];

const industryOptions: Option[] = [
  { value: "all", label: "All" },
  { value: "construction", label: "Construction" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "mining", label: "Mining" },
  { value: "agriculture", label: "Agriculture" },
];

function JobPosted() {
  const router = useRouter();
  const [duration, setDuration] = useState("");
  const [reportType, setReportType] = useState("Jobs Posted");
  const [selectedAgencies, setSelectedAgencies] = useState<Option[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [countriesList, setCountriesList] = useState([]);

  const { control, formState: { errors, isValid } } = useForm<FormValues>();

  const handleAgencyChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allAgenciesOption = selected.find((option) => option.value === "all");
  };

  const handleCountryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allCountriesOption = selected.find(
      (option) => option.value === "all"
    );
    setSelectedCountries(
      allCountriesOption ? countryOptions.slice(1) : (selected as Option[])
    );
  };


  const handleIndustryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allIndustriesOption = selected.find(
      (option) => option.value === "all"
    );
    setSelectedIndustries(allIndustriesOption ? industryOptions.slice(1) : (selected as Option[]));
  };

  const handleSubmit = async () => {
    try {
      const reports = await getReports(
        reportType,
        "",
        selectedCountries.map((country) => country.value).join(','),
        selectedIndustries.map((industry) => industry.value).join(','),
        duration
      );
      setReportData(reports);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleReportTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newReportType = event.target.value;
    setReportType(newReportType);
    router.push(`/reports/${newReportType}`);
    if (newReportType !== "Jobs Posted") {
      setSelectedAgencies([]);
    }
    if (newReportType !== "Jobs Posted") {
      setDuration("");
    }
  };

  const { register, trigger, watch } = useForm({
    defaultValues: {
      country: "",
    },
  });


  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
        getFormattedAgencies(inputValue).then(options => callback(options))
    }, 500),
    []
  );
  const country: any = watch("country");


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
                menuPortalTarget={document.getElementsByClassName('modal')[0] as HTMLElement}
                menuPosition={"fixed"}
                />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className={styles.selectField}>
            <Form.Label>Country</Form.Label>
            <MultiSelect
              name="country"
              control={control}
              error={errors.country as FieldError}
              options={countryOptions}
              onChange={handleCountryChange}
              customStyles={{}}
              rules={{ required: "Country is required" }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className={styles.selectField}>
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

export default JobPosted;
