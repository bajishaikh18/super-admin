import React, { useState, useCallback } from "react";
import { Form, Button, Row, Col, Image, Spinner} from "react-bootstrap";
import { MultiValue, ActionMeta } from "react-select";
import { MultiSelect, MultiSelectAsync } from "../common/form-fields/MultiSelect"; 
import { FieldError, useForm, } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import styles from "./JobPosted.module.scss";
import ReportTable from "./JobPostedTable";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/apis/dashboard";
import { debounce } from "lodash";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { COUNTRIES } from "@/helpers/constants";


interface FormValues {
  reporttype: SelectOption;
  agency: SelectOption;
  country: SelectOption;
  industry: SelectOption;
  category: SelectOption;
  duration: SelectOption;
}

interface Option {
  value: string;
  label: string;
}
const reportTypeOptions: Option[] = [
  { value: "jobs-posted", label: "Jobs Posted" },
  { value: "Applications-Received", label: "Agency Applications Report" },
  { value: "Jobs-Applied", label: "Job Applied Report" },
  { value: "Users-Report", label: "Users Report" },
  { value: "Employer-Applications-Report", label: "Employers Applications Report" },
];


const industryOptions: Option[] = [
  { value: "all", label: "All" },
  { value: "construction", label: "Construction" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "mining", label: "Mining" },
  { value: "agriculture", label: "Agriculture" },
];
const categoryOptions: Option[] = [
  { value: "all", label: "All" },
  
];
const durationOptions: Option[] = [
  { value: "this month", label: "This Month" },
  { value: "last month", label: "Last Month" },
  { value: "last 3 months", label: "Last 3 months" },
  { value: "last 6 months", label: "Last 6 months" },
  { value: "data range", label: "Data Range" },
];

function JobPosted() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  const [duration, setDuration] = useState("");
  const [reportType, setReportType] = useState("Jobs Posted");
  const [selectedAgencies, setSelectedAgencies] = useState<Option[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<Option[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);

  const { control, formState: { errors, isValid } } = useForm<FormValues>();

   const handleIndustryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allIndustriesOption = selected.find(
      (option) => option.value === "all"
    );
    setSelectedIndustries(allIndustriesOption ? industryOptions.slice(1) : (selected as Option[]));
  };
  const handleCategoryChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allCategoriesOption = selected.find(
      (option) => option.value === "all"
    );
    setSelectedCategories(allCategoriesOption ? categoryOptions.slice(1) : (selected as Option[]));
  };
  const handleDurationChange = (
    selected: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    const allDurationOption = selected.find(
      (option) => option.value === "all"
    );
    setSelectedDuration(allDurationOption ? durationOptions.slice(1) : (selected as Option[]));
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await getReports(
        reportType,
        selectedAgencies.map((agency) => agency.value).join(','),
        selectedCountries.map((country) => country.value).join(','),
        selectedIndustries.map((industry) => industry.value).join(','),
        selectedCategories.map((category) => category.value).join(','),
        selectedDuration.map((duration) => duration.value).join(',')
      );
  
      const formattedData = response.Reportdata.map((item) => ({
        jobId: item.jobId,
        companyName: item.companyName, 
        firstName: item.firstName,    
        lastName: item.lastName, 
        contactNumbers: item.contactNumbers,
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
  const workLocations = Object.entries(COUNTRIES).map(([key, val]) => {
    return {
      label: val.label,
      value: key,
    };
  });
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
            error={errors.country}
            options={workLocations}
            rules={{ required: "Location is required" }}
            customStyles={{}}
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
            <MultiSelect
              name="category"
              control={control}
              error={errors.category as FieldError}
              options={categoryOptions}
              onChange={handleCategoryChange}
              customStyles={{}}
              rules={{ required: "Category is required" }}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className={styles.selectField}>
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
  <MultiSelect
              name="reporttype"
              control={control}
              error={errors.reporttype as FieldError}
              options={reportTypeOptions}
              onChange={handleReportTypeChange}
              customStyles={{}}
              rules={{ required: "Report Type is required" }}
            />
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