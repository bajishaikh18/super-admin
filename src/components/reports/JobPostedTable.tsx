import React, { useState, useMemo } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import { useDebounce } from "@uidotdev/usehooks";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import styles from "./JobPosted.module.scss";
import Link from "next/link";
import * as XLSX from "xlsx";
import { COUNTRIES } from "@/helpers/constants";
import { FullScreenImage } from "../common/FullScreenImage";

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
  status:string;
};

type ReportTableProps = {
  data: ReportData[];
};

const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  const [field, setField] = useState<SelectOption>({
    value: "employerId",
    label: "Employer ID",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [search, setSearch] = React.useState<string>("");
  const [showImage, setShowImage] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedFormat, setSelectedFormat] =
    useState<string>("Download Report");
  const debouncedSearchTerm = useDebounce(search, 300);

  const columnHelper = createColumnHelper<ReportData>();
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
        classes: "f-4",
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
        return (
          <div className="status-cont">{info.renderValue() || "N/A"}</div>
        );
      },
    }),
  ];

  const totalCount = data.length;

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "JobPostedReport");

    XLSX.writeFile(workbook, "JobPostedReport.xlsx");
  };

  return (
    <div className="page-block report-block">
      <div className="page-title">
        <h3 className="section-heading">Job Posted Report</h3>

        <div className={styles.downloadDropdownContainer}>
          <Dropdown>
            <Dropdown.Toggle className={styles.downloadDropdown}>
              {selectedFormat}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={downloadExcel}>Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

        <Card>
          <DataTable
            totalCount={totalCount}
            columns={columns}
            sorting={sorting}
            sortingChanged={(updater: any) => {
              setSorting(updater);
            }}
            data={data}
            tableHeight={"75vh"}
            isSearch={!!search}
            fetchNextPage={() => {}}
            isLoading={false}
            isFetching={false}
          />
        </Card>
        <FullScreenImage
        isOpen={showImage}
        handleClose={() => {
          setImageUrl(""), setShowImage(false);
        }}
        imageUrl={imageUrl}
      />
    </div>
  );
};

export default ReportTable;
