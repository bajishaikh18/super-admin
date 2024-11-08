import React, { useState, useMemo } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import { useDebounce } from "@uidotdev/usehooks";
import styles from "./JobPosted.module.scss";
import Link from "next/link";


type ReportData = {
  employerId: string;
  companyName: string;
  firstName: string;
  lastName: string;
  mobile: string;
  landline: string;
  email: string;
  regDate: string;
  status: string;
};

type ReportTableProps = {
  data: ReportData[];
};

const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  const [field, setField] = useState<SelectOption>({
    value: "employerId",
    label: "Employer ID",
  });
  const [search, setSearch] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("Download Report");
  const debouncedSearchTerm = useDebounce(search, 300);

  const columnHelper = createColumnHelper<ReportData>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("employerId", {
        header: "Employer Id",
        cell: (info) => (
          <Link href={`/job-posted/${info.getValue()}`}>{info.getValue()}</Link>
        ), 
        meta: {
          classes: "f-3",
        },
      }),
      columnHelper.accessor("companyName", {
        header: "Company Name",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("mobile", {
        header: "Mobile No.",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("landline", {
        header: "Landline No.",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("email", {
        header: "Company Email ID",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("regDate", {
        header: "Regd. Date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue() || "").toFormat("dd MMM yyyy")
            : "N/A",  
      }),
      columnHelper.accessor("status", {
        header: "Status",
        meta: {
          classes: "capitalize",
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

  const totalCount = data.length;
  const handleSelectFormat = (format: string) => {
    setSelectedFormat(format); 
  };

  return (
    <main className={styles.mainSection}>
      <div className={styles.pageBlock}>
        <div className={styles.reportTitleContainer}>
          <h3 className={styles.reportTitle}>Job Posted Report</h3>
          <div className={styles.downloadDropdownContainer}>
            <Dropdown>
            <Dropdown.Toggle className={styles.downloadDropdown}>
                {selectedFormat} 
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/pdf">PDF</Dropdown.Item>
                <Dropdown.Item href="/csv">CSV</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className={styles.tableContainer}>
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
        </div>
      </div>
    </main>
  );
};

export default ReportTable;
