import { Form } from "react-bootstrap";
import styles from "./JobPosted.module.scss";
import { usePathname } from "next/navigation";
import Select from "react-select";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { DURATION_OPTIONS } from "@/helpers/constants";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { Control, FieldError, UseFormWatch } from "react-hook-form";
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

export const reportTypeOptions = [
  {
    label: "Jobs Posted Report",
    value: "jobs-posted",
  },
  {
    label: "Agency Applications Report",
    value: "application-received",
  },
  {
    label: "Job Applied Report",
    value: "jobs-applied",
  },
  {
    label: "Users Report",
    value: "users-report",
  },
  {
    label: "Employers Applications Report",
    value: "employer-applications",
  },
];
export const ReportTypeSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleReportTypeChange = (value: string) => {
    router.push(`/reports/${value}`);
  };
  return (
    <Form.Group className={styles.selectField}>
      <Form.Label>Report Type</Form.Label>
      <Select
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "rgba(246, 241, 255, 1)",
            primary: "#0045E6",
          },
        })}
        styles={{
          option: (baseStyles) => ({
            ...baseStyles,
            borderBottom: "1px solid rgba(217, 217, 217, 1)",
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: "16px",
            borderRadius: "8px",
            border: state.isFocused
              ? "1px solid #0045E6"
              : "1px solid rgba(189, 189, 189, 1)",
            minHeight: "44px",
            svg: {
              path: {
                fill: "#000",
              },
            },
            boxShadow: state.isFocused ? "none" : "none",
            "&:focus": {
              border: "1px solid green",
              boxShadow: "none",
            },
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            zIndex: 2,
          }),
          indicatorSeparator: () => ({ display: "none" }),
        }}
        defaultValue={reportTypeOptions.find((c) => pathname.includes(c.value))}
        options={reportTypeOptions}
        onChange={(val) => handleReportTypeChange(val?.value!)}
      />
    </Form.Group>
  );
};

export const GenerateReportText = () => {
  return (
    <div className={styles.generateReportSection}>
      <div className={styles.generateReportImage}>
        <Image
          src={"/generate.svg"}
          alt="Generate Report"
          width={229}
          height={178}
        />
      </div>
      <h3>Generate Report</h3>
      <p>Please select report details you&apos;re looking for</p>
    </div>
  );
};

export const NoReportText = () => {
  return (
    <div className={styles.generateReportSection}>
      <div className={styles.generateReportImage}>
        <Image
          src={"/generate.svg"}
          alt="Generate Report"
          width={229}
          height={178}
        />
      </div>
      <h3>No Reports found</h3>
      <p>Try adjusting the filters</p>
    </div>
  );
};


export const Duration = ({
  control,
  errors,
  watch,
  handleDateChange
}: {
  control: Control<any, any>;
  errors: any;
  watch: UseFormWatch<any>;
  handleDateChange:(dateRange:string) => void
}) => {
  const duration = watch("duration");
  const [dateRange, setDateRange] = useState([DateTime.now().minus({month:1}).toJSDate(), new Date()]);
  const [dateRangePicker,showDateRangePicker] = useState(false)
  const [startDate, endDate] = dateRange;
  
  const handleDateRangeChange = (update:any)=>{
    setDateRange(update);
     const start = DateTime.fromJSDate(update[0]).toISO();
     const end = DateTime.fromJSDate(update?.[1] || new Date()).toISO();
     handleDateChange(`${start}&${end}`);
  }
  useEffect(() => {
    if (duration === "custom") {
      showDateRangePicker(true)
    }else{
      showDateRangePicker(false)
    }
  }, [duration]);
  return (
    <>
      <Form.Group className={`${styles.selectField} ${styles.dateField}`}>
        <Form.Label>Duration</Form.Label>
        <MultiSelect
          name="duration"
          control={control}
          error={errors.duration as FieldError}
          options={DURATION_OPTIONS}
          defaultValue="0"
          menuListStyles={{
            fontSize: "13px",
          }}
          customStyles={{}}
        />
      </Form.Group>
      {
        dateRangePicker &&   <DatePicker
        selectsRange={true}
        startDate={startDate}
        popperClassName="custom-date-picker"
        endDate={endDate}
        minDate={startDate}
        onChange={handleDateRangeChange}
        dateFormat="dd/MM/yyyy"
        customInput={
          <Form.Control
            type="text"
            placeholder="YYYY-MM-DD"
            value={`${startDate} - ${endDate}`}
            onChange={handleDateRangeChange}
            readOnly
          />
        }
        isClearable={true}
      />
      }
       
    </>
  );
};
