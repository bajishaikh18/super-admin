import React, { useState, useMemo } from "react";
import { Card, Dropdown, Modal } from "react-bootstrap";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import styles from "./JobPosted.module.scss";
import * as XLSX from "xlsx";
import { FullScreenImage } from "../common/FullScreenImage";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { ROLE } from "@/helpers/constants";
import RequestMore from "./RequestMore";

const REPORT_NAMES = {
  "jobs-posted":"Jobs Posted Report",
  "application-received":"Agency Applications Report",
  "jobs-applied":"Job Applied Report",
  "users-report":"Users Report",
  "employer-applications":"Employers Applications Report"
}

type ReportTableProps = {
  data: any;
  columns: any;
  type: string;
  exportPayload:any;
  filters: string[] | null;
  exportFileName:string;
  showImage?: boolean;
  imageUrl?:string
  resetLinkClick?:()=>void
};

const ReportTable: React.FC<ReportTableProps> = ({ data,type, columns, exportPayload,exportFileName,showImage,imageUrl,filters,resetLinkClick }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [requestMore, setRequestMore] = useState(false);
  const [selectedFormat, setSelectedFormat] =
    useState<string>("Download Report");
  const { role } = useAuthUserStore();

  const totalCount = data.length;


  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportPayload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, exportFileName);
    XLSX.writeFile(workbook, `${exportFileName}_${DateTime.now().toFormat("dd_MM_yyyy hh:mm:ss")}.xlsx`);
  };

  const name = REPORT_NAMES[type as 'jobs-posted'];
  return (
    <div className="page-block report-block">
      <div className="page-title">
        <div className={styles.headingContainer}>
        <h3 className="section-heading">{name} ({data.length || 0})</h3>
        {role === ROLE.admin && data.length >=20 && <h4 onClick={()=>setRequestMore(true)}>Request more data</h4>}
        </div>
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
       <Modal show={requestMore} onHide={()=>setRequestMore(false)} centered backdrop="static">
        {requestMore && <RequestMore type={type} filters={filters} handleModalClose={()=>setRequestMore(false)} /> }
      </Modal>
    </div>
  );
};

export default ReportTable;
