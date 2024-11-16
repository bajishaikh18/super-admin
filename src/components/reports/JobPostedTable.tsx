import React, { useState, useMemo } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import { useDebounce } from "@uidotdev/usehooks";
import styles from "./JobPosted.module.scss";
import Link from "next/link";
import * as XLSX from "xlsx";
import { COUNTRIES } from "@/helpers/constants";
import { FullScreenImage } from "../common/FullScreenImage";



type ReportTableProps = {
  data: any;
  columns: any;
  exportPayload:any;
  exportFileName:string;
  showImage?: boolean;
  imageUrl?:string
  resetLinkClick?:()=>void
};

const ReportTable: React.FC<ReportTableProps> = ({ data, columns, exportPayload,exportFileName,showImage,imageUrl,resetLinkClick }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedFormat, setSelectedFormat] =
    useState<string>("Download Report");

  const totalCount = data.length;


  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportPayload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, exportFileName);
    XLSX.writeFile(workbook, `${exportFileName}_${DateTime.now().toFormat("dd_MM_yyyy hh:mm:ss")}.xlsx`);
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
            tableHeight={"60vh"}
            isSearch={false}
            fetchNextPage={() => {}}
            isLoading={false}
            isFetching={false}
          />
        </Card>
        <FullScreenImage
        isOpen={!!showImage}
        handleClose={resetLinkClick ? resetLinkClick: ()=>{}}
        imageUrl={imageUrl || ""}
      />
    </div>
  );
};

export default ReportTable;
