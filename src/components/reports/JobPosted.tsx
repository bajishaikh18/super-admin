import React, { useState, useCallback } from "react";
import { Form, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { MultiSelect } from "../common/form-fields/MultiSelect";
import { FieldError, useForm } from "react-hook-form";
import { SelectOption } from "@/helpers/types";
import styles from "./JobPosted.module.scss";
import ReportTable from "./ReportTable";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { getReports } from "@/apis/dashboard";
import { debounce } from "lodash";
import { getFormattedAgencies } from "@/helpers/asyncOptions";
import { COUNTRIES, DURATION_OPTIONS, INDUSTRIES } from "@/helpers/constants";
import { Duration, GenerateReportText, ReportTypeSelect } from "./CommonElements";
import {
  MultiSelectAsyncWithCheckbox,
  MultiSelectWithCheckbox,
} from "../common/form-fields/MultiSelectWithCheckbox";
import { getStartAndEndDate } from "@/helpers/date";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DateTime } from "luxon";

interface FormValues {
  reporttype: SelectOption[];
  agency: SelectOption[];
  country: SelectOption[];
  industry: SelectOption[];
  category: SelectOption[];
  status: SelectOption[];
  duration: string;
}

const industryOptions = [
  { value: "all", label: "All Industries" },
  ...Object.entries(INDUSTRIES).map(([key, val]) => {
    return { value: key, label: val };
  }),
];

const statusOptions = [
  {
    value: "all",
    label: "All status",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "pending",
    label: "Pending",
  },
];

type ReportData = {
  _id: string;
  jobId: string;
  agency: string;
  location: string;
  amenities: string[];
  positions: object[];
  imageUrl: string;
  createdAt: string;
  expiry: string;
  country: string;
  postedBy: string;
  status: string;
};

function JobPosted() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [exportPayload, setExportPayload] = useState<any[]>([]);
  const columnHelper = createColumnHelper<ReportData>();
  const [showImage, setShowImage] = useState(false);
  const [filters,setFilters] = useState<string[]|null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [dateRange, setDateRange] = useState("");
  const columns = [
    columnHelper.accessor("jobId", {
      header: "Post Id",
      cell: (info) => (
        <Link href={`/posted-jobs/${info.getValue()}`} passHref>
          {info.getValue()}
        </Link>
      ),
      meta: {
        classes: "f-3",
      },
    }),

    columnHelper.accessor("agency", {
      header: "Agency",
      cell: (info) => info.renderValue() || "N/A",
      meta: {
        classes: "f-6",
      },
    }),

    columnHelper.accessor("postedBy", {
      header: "Posted by",
      cell: (info) => info.renderValue() || "N/A",
      meta: {
        classes: "f-4",
      },
    }),

    columnHelper.accessor("country", {
      header: "Target country",
      cell: (info) =>
        COUNTRIES[info.renderValue() as "sa"]?.label ||
        info.renderValue() ||
        "N/A",
      meta: {
        classes: "capitalize f-5",
        filterType: "select",
        selectOptions: Object.entries(COUNTRIES).map(([key, val]) => ({
          label: val.label,
          value: key,
        })),
      },
    }),

    columnHelper.accessor("location", {
      header: "Job Location",
      cell: (info) =>
        COUNTRIES[info.renderValue() as "sa"]?.label ||
        info.renderValue() ||
        "N/A",
      meta: {
        classes: "capitalize f-5",
        filterType: "select",
        selectOptions: Object.entries(COUNTRIES).map(([key, val]) => ({
          label: val.label,
          value: key,
        })),
      },
    }),

    columnHelper.accessor("amenities", {
      header: "Benefits",
      cell: (info) => (
        <span title={info.renderValue()?.join(", ") || "N/A"}>
          {info.renderValue()?.join(", ") || "N/A"}
        </span>
      ),
      meta: {
        filterType: "select",
        selectOptions: [
          { value: "Food", label: "Food" },
          { value: "Transportation", label: "Transportation" },
          { value: "Stay", label: "Stay" },
          { value: "Recruitment", label: "Recruitment" },
        ],
      },
    }),

    columnHelper.accessor("positions", {
      header: "No. of positions",
      cell: (info) => info.getValue()?.length || "N/A",
      meta: {
        filterType: "number",
        classes: "f-4",
      },
    }),

    columnHelper.accessor("imageUrl", {
      header: "Media",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <Link
              href={`javascript:;`}
              onClick={() => {
                setShowImage(true);
                setImageUrl(info.getValue());
              }}
              className={dataTableStyles.normalLink}
            >
              View Image
            </Link>
          ) : (
            "N/A"
          )}
        </>
      ),
      meta: {
        filter: false,
        classes: "f-4",
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "Posted Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: {
        filterType: "date",
        classes: "f-5",
      },
    }),

    columnHelper.accessor("expiry", {
      header: "Expiry",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: {
        filterType: "date",
        classes: "f-5",
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      meta: {
        classes: "capitalize f-4",
        filterType: "select",
        selectOptions: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "InActive" },
        ],
      },
      cell: (info) => {
        return <div className="status-cont">{info.renderValue() || "N/A"}</div>;
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
      const reportPayload  = {
        type: "jobs-posted",
        agency: data.agency?.map((agency) => agency.value).join(","),
        country: data.country?.map((country) => country.value).join(","),
        industry: data.industry?.map((industry) => industry.value).join(","),
        duration: data.duration === 'custom'? dateRange : getStartAndEndDate(Number(data.duration)),
        status: data.status?.map((status) => status.value).join(","),
      }
      const response = await getReports(reportPayload);
      const filters = Object.keys(reportPayload).filter((x)=>reportPayload[x as 'type']);
      setFilters(filters)
      const payload = response?.reportdata.map((x: any) => {
        return {
          "Post id": x.jobId,
          Agency: x.agency,
          Benefits: x.amenities.join(","),
          "Posted By": x.postedBy,
          "Target Country":  COUNTRIES[x.country as "sa"]?.label,
          "Job Location": COUNTRIES[x.location as "sa"]?.label,
          "No of Positions": x.positions.length,
          "Posted Date": DateTime.fromISO(x.createdAt).toFormat("dd MMM yyyy"),
          "Expiry Date": DateTime.fromISO(x.createdAt).toFormat("dd MMM yyyy"),
          Status: x.status,
        };
      });
      setExportPayload(payload);
      setReportData(response.reportdata);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetLinkClick = () => {
    setImageUrl("");
    setShowImage(false);
  };
  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      getFormattedAgencies(inputValue, true).then((options) =>
        callback(
          !inputValue
            ? [{ value: "all", label: "All Agencies" }, ...options]
            : options
        )
      );
    }, 500),
    []
  );
  const workLocations = [
    { value: "all", label: "All countries" },
    ...Object.entries(COUNTRIES).map(([key, val]) => {
      return {
        label: val.label,
        value: key,
      };
    }),
  ];

  const renderReportFields = () => {
    return (
      <Row>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
            <Form.Label>Agency</Form.Label>
            <MultiSelectAsyncWithCheckbox
              name="agency"
              control={control}
              error={errors.agency as FieldError}
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
          <Form.Group className={styles.selectField}>
            <Form.Label>Country</Form.Label>
            <MultiSelectWithCheckbox
              name="country"
              control={control}
              error={errors.country as FieldError}
              options={workLocations}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className={styles.selectField}>
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
          <Form.Group className={styles.selectField}>
            <Form.Label>Job status</Form.Label>
            <MultiSelectWithCheckbox
              name="status"
              control={control}
              error={errors.status as FieldError}
              options={statusOptions}
              customStyles={{}}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Duration watch={watch} control={control} errors={errors} handleDateChange={setDateRange}/>
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
          type="jobs-posted"
          filters={filters}
          showImage={showImage}
          resetLinkClick={resetLinkClick}
          exportFileName="JobsPosted"
          imageUrl={imageUrl}
          columns={columns}
          exportPayload={exportPayload}
          data={reportData}
        />
      )}
    </div>
  );
}

export default JobPosted;
