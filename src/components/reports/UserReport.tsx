import React, { useState, useCallback, useMemo } from "react";
import styles from "./JobPosted.module.scss";
import { Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { MultiValue, ActionMeta } from "react-select";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { useRouter } from "next/navigation";
import ReportTable from "./ReportTable";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import { getReports } from "@/apis/dashboard";
import {
  Duration,
  GenerateReportText,
  NoReportText,
  ReportTypeSelect,
} from "./CommonElements";
import {
  MultiSelectAsyncWithCheckbox,
  MultiSelectWithCheckbox,
} from "../common/form-fields/MultiSelectWithCheckbox";
import { debounce } from "lodash";
import { getFormattedJobTitles } from "@/helpers/asyncOptions";
import { getStartAndEndDate } from "@/helpers/date";
import { INDUSTRIES } from "@/helpers/constants";
import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/stores/useUserStore";
import Link from "next/link";
import { INDIAN_STATES } from "@/helpers/stateList";
import { downloadMedia } from "@/helpers/mediaDownload";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { DateTime } from "luxon";

interface FormValues {
  jobtitle: SelectOption[];
  industry: SelectOption[];
  duration: string;
}

const industryOptions = [
  { value: "all", label: "All Industries" },
  ...Object.entries(INDUSTRIES).map(([key, val]) => {
    return { value: key, label: val };
  }),
];

function UserReport() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [exportPayload, setExportPayload] = useState<any[]>([]);
  const columnHelper = createColumnHelper<User>();
  const [dateRange, setDateRange] = useState("");
  const [totalCount,setTotalCount] = useState(0);
  const [filters, setFilters] = useState<string[] | null>(null);
  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: " Name",
        cell: (info) => info.renderValue() || "N/A",
        enableColumnFilter: true,
      }),
      columnHelper.accessor("phone", {
        header: "Mobile No",
        cell: (info) => (
          <Link href={`/user/${info.renderValue()}`}>{info.renderValue()}</Link>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email Id",
        cell: (info) => <>{info.renderValue() || "N/A"}</>,
        meta: {
          classes: "px-10",
        },
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: (info) =>
          INDIAN_STATES.find((state) => state.state_code === info.renderValue())
            ?.name ||
          info.renderValue() ||
          "N/A",
      }),
      columnHelper.accessor("currentJobTitle", {
        header: "Job title",
        cell: (info) => (info.renderValue() as any)?.title || "N/A",
      }),
      columnHelper.accessor("industry", {
        header: "Industry",
        cell: (info) => INDUSTRIES[info.getValue() as "oil_gas"] || info.renderValue() || "N/A",
        meta: {
          classes: "capitalize f-9",
          filterType: "select",
          selectOptions: Object.entries(INDUSTRIES).map(([value, label]) => ({
            value: value,
            label: label,
          })),
        },
      }),
      columnHelper.accessor("totalExperience", {
        header: "Experience",
        meta: {
          filterType: "number",
          classes: "f-7",
        },
        cell: (info) =>
          info.renderValue() ? `${info.renderValue()} Years` : "N/A",
      }),
      columnHelper.accessor("gulfExperience", {
        header: "Gulf Exp.",
        meta: {
          classes: "capitalize f-6",
          filterType: "select",
          selectOptions: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
        cell: (info) => (info.renderValue() === true ? "Yes" : "No"),
      }),
      columnHelper.accessor("resume", {
        cell: (info) => {
          const [, extn] = info.getValue()?.keyName?.split("") || [];
          return info.getValue()?.keyName ? (
            <Link
              href={`javascript:;`}
              onClick={() =>
                downloadMedia(
                  info.getValue()?.keyName,
                  `${info.row.getValue("firstName")}_${info.row.getValue(
                    "lastName"
                  )}.${extn}`
                )
              }
              className={dataTableStyles.normalLink}
            >
              Download CV
            </Link>
          ) : (
            "N/A"
          );
        },
        meta: { filter: false, classes: "f-8" },
        header: "CV Availability",
      }),
      columnHelper.accessor("workVideo", {
        meta: { filter: false, classes: "f-7" },
        cell: (info) => {
          return info.getValue()?.keyName ? (
            <Link
              href={`javascript:;`}
              onClick={() =>
                downloadMedia(
                  info.getValue()?.keyName,
                  `${info.row.getValue("firstName")}_${info.row.getValue(
                    "lastName"
                  )}.mp4`
                )
              }
              className={dataTableStyles.normalLink}
            >
              View Video
            </Link>
          ) : (
            "N/A"
          );
        },
        header: "Work Video",
      }),
      columnHelper.accessor("createdAt", {
        header: "Regd. date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-7" },
      }),
      columnHelper.accessor("lastLoginDate", {
        header: "Last access",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-7" },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        meta: {
          classes: "capitalize f-7",
          filterType: "select",
          selectOptions: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "InActive" },
          ],
        },
        cell: (info) => {
          return (
            <div className="status-cont">{info.renderValue() || "N/A"}</div>
          );
        },
      }),
    ],
    []
  );
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setNoData(false);
      const reportPayload = {
        type: "users-report",
        jobTitle: data.jobtitle?.map((title) => title.value).join(","),
        industry: data.industry?.map((industry) => industry.value).join(","),
        duration:
          data.duration === "custom"
            ? dateRange
            : getStartAndEndDate(Number(data.duration)),
      };
      const response: { reportdata: User[],totalCount:number } = await getReports(reportPayload);
      const filters = Object.keys(reportPayload).filter(
        (x) => reportPayload[x as "type"]
      );
      setFilters(filters);
      const payload = response?.reportdata.map((x) => {
        return {
          "User Id": x.userId,
          "Mobile No": x.phone,
          "Email Id": x.email,
          State: INDIAN_STATES.find((state) => state.state_code === x.state)
            ?.name,
          "Job Title": (x.currentJobTitle as any)?.title,
          Industry: INDUSTRIES[x.industry as "oil_gas"] || x.industry,
          Experience: `${x.totalExperience} Years`,
          "Has Gulf Experience": x.gulfExperience ? "Yes" : "No",
          "Registered On": DateTime.fromISO(x.createdAt).toFormat(
            "dd MMM yyyy"
          ),
          "Last logged in": DateTime.fromISO(x.lastLoginDate).toFormat(
            "dd MMM yyyy"
          ),
        };
      });
      setExportPayload(payload);
      setTotalCount(response.totalCount)
      if(response.reportdata.length === 0){
        setNoData(true);
      }   
      setReportData(response.reportdata);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedJobTitles(inputValue).then((options) =>
        callback(
          !inputValue
            ? [{ value: "all", label: "All titles" }, ...options]
            : options
        )
      );
    }, 500),
    []
  );

  const renderReportFields = () => {
    return (
      <Row>
        <Col md={2}>
          <Form.Group className={`${styles.selectField}`}>
            <Form.Label>Job Title</Form.Label>
            <MultiSelectAsyncWithCheckbox
              name="jobtitle"
              control={control}
              error={errors.jobtitle as FieldError}
              loadOptions={loadOptionsDebounced}
              customStyles={{}}
              isMulti={true}
              menuPortalTarget={
                document.getElementsByClassName("modal")[0] as HTMLElement
              }
              menuPosition={"fixed"}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={`${styles.selectField}`}>
            <Form.Label>Industry</Form.Label>
            <MultiSelectWithCheckbox
              name="industry"
              control={control}
              error={errors.industry as FieldError}
              options={industryOptions}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Duration
            watch={watch}
            control={control}
            errors={errors}
            handleDateChange={setDateRange}
          />
        </Col>
        <Col>
          <Button
            onClick={handleSubmit(onSubmit)}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <Row>
          <Col md={2}>
            <ReportTypeSelect />
          </Col>
        </Row>
        {renderReportFields()}
      </div>

      {(reportData.length === 0 && !noData) && <GenerateReportText />}
      {(noData) && <NoReportText/>}
      {reportData.length > 0 && (
        <ReportTable
          totalCount={totalCount}
          type="users-report"
          filters={filters}
          exportPayload={exportPayload}
          exportFileName="User_Report"
          columns={columns}
          data={reportData}
        />
      )}
    </div>
  );
}

export default UserReport;
