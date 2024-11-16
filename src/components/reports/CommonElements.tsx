import { Col, Form } from "react-bootstrap";
import styles from "./JobPosted.module.scss";
import { usePathname } from "next/navigation";
import Select from "react-select";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

const options = [
    {
        label: "Jobs Posted",
        value:'jobs-posted'
    },
    {
        label: "Agency Applications Report",
        value:'application-received'
    },
    {
        label: "Job Applied Report",
        value:"jobs-applied"
    },
    {
        label: "Users Report",
        value:"users-report"
    },
    {
        label: "Employers Applications Report",
        value:"employer-applications"
    }
]
export const ReportTypeSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleReportTypeChange = (
    value: string
  ) => {
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
                primary25: 'rgba(246, 241, 255, 1)',
                primary: '#0045E6',
              },
            })}
            styles={{
              option:(baseStyles, state)=>({
                ...baseStyles,
                borderBottom:'1px solid rgba(217, 217, 217, 1)'
              }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                fontSize: "16px",
                borderRadius: "8px",
                border:  state.isFocused ? "1px solid #0045E6":"1px solid rgba(189, 189, 189, 1)",
                minHeight: "44px",
                svg: {
                  path: {
                    fill: "#000",
                  },
                },
                boxShadow: state.isFocused ? 'none' : 'none',
                "&:focus":{
                  border:"1px solid green",
                  boxShadow:'none'
                }
              }),
              menu:(baseStyles)=>({
                ...baseStyles,
                zIndex:2
              }),
              indicatorSeparator: () => ({ display: "none" }),

            }}
            defaultValue={options.find((c) => pathname.includes(c.value))}
            options={options}
            onChange={(val) => handleReportTypeChange(val?.value!)}
          />
          </Form.Group>
  );
};


export const GenerateReportText = ()=>{
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
    <p>
      Please select report details you're looking for
    </p>
  </div>
  )
}