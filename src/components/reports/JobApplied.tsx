import React, { useCallback, useState } from "react";
import styles from "./JobPosted.module.scss";
import { Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import ReportTable from "./ReportTable";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import { getReports } from "@/apis/dashboard";
import {
  Duration,
  GenerateReportText,
  ReportTypeSelect,
} from "./CommonElements";
import { MultiSelectAsyncWithCheckbox } from "../common/form-fields/MultiSelectWithCheckbox";
import { getFormattedJobTitles } from "@/helpers/asyncOptions";
import { debounce } from "lodash";
import { getStartAndEndDate } from "@/helpers/date";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { downloadMedia } from "@/helpers/mediaDownload";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { DateTime } from "luxon";

interface FormValues {
  jobtitle: SelectOption[];
  duration: string;
}
interface JobsAppliedData {
  jobId: string;
  _id: string;
  appliedBy: string;
  agency: {
    name: string;
    _id: string;
  };
  resume: string;
  workVideo: string;
  positions: string[];
  createdAt: string;
}

function JobApplied() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [exportPayload, setExportPayload] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const columnHelper = createColumnHelper<JobsAppliedData>();
  const [totalCount,setTotalCount] = useState(0);
  const [filters, setFilters] = useState<string[] | null>(null);
  const columns = [
    columnHelper.accessor("jobId", {
      header: "Post Id",
      cell: (info) => (
        <Link href={`/posted-jobs/${info.getValue()}`} target="_blank" passHref>
          {info.getValue()}
        </Link>
      ),
      meta: {
        classes: "f-2",
      },
    }),

    columnHelper.accessor("agency", {
      header: "Agency",
      cell: (info) => (
        <Link href={`/agency/${info.getValue()._id}`} target="_blank" passHref>
          {info.getValue().name}
        </Link>
      ),
      meta: {
        classes: "f-6",
      },
    }),

    columnHelper.accessor("_id", {
      header: "Application Id",
      cell: (info) => info.renderValue() || "N/A",
      meta: {
        classes: "f-6",
      },
    }),

    columnHelper.accessor("appliedBy", {
      header: "Applied by",
      cell: (info) => info.renderValue() || "N/A",
      meta: {
        classes: "f-7",
      },
    }),

    columnHelper.accessor("resume", {
      cell: (info) => {
        const [, extn] = info.getValue()?.split("") || [];
        return info.getValue() ? (
          <Link
            href={`javascript:;`}
            onClick={() =>
              downloadMedia(
                info.getValue(),
                `${info.row.getValue("appliedBy")}.${extn}`
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
      meta: { filter: false, classes: "f-5" },
      header: "CV Availability",
    }),
    columnHelper.accessor("workVideo", {
      meta: { filter: false, classes: "f-5" },
      cell: (info) => {
        return info.getValue() ? (
          <Link
            href={`javascript:;`}
            onClick={() =>
              downloadMedia(
                info.getValue(),
                `${info.row.getValue("appliedBy")}.mp4`
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
      header: "Applied Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: {
        filterType: "date",
        classes: "f-5",
      },
    }),
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const reportPayload = {
        type: "jobs-applied",
        jobTitle: data.jobtitle?.map((title) => title.value).join(","),
        duration:
          data.duration === "custom"
            ? dateRange
            : getStartAndEndDate(Number(data.duration)),
      };
      const response: { reportdata: JobsAppliedData[],totalCount:number } = await getReports(
        reportPayload
      );
      const filters = Object.keys(reportPayload).filter(
        (x) => reportPayload[x as "type"]
      );
      setFilters(filters);
      const payload = response?.reportdata.map((x) => {
        return {
          "Post Id": x.jobId,
          Agency: x.agency.name,
          "Application Id": x._id,
          "Applied By":x.appliedBy,
          "Applied on": DateTime.fromISO(x.createdAt).toFormat("dd MMM yyyy"),
        };
      });
      setExportPayload(payload);
      setTotalCount(response.totalCount)
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
            ? [{ value: "all", label: "All Job titles" }, ...options]
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

      {reportData.length === 0 && <GenerateReportText />}

      {reportData.length > 0 && (
        <ReportTable
          filters={filters}
          totalCount={totalCount}
          type="jobs-applied"
          exportFileName="Jobs_Applied"
          exportPayload={exportPayload}
          columns={columns}
          data={reportData}
        />
      )}
    </div>
  );
}

export default JobApplied;
