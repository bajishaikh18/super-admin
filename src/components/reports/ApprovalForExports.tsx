import React, { useState } from "react";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { Card } from "react-bootstrap";
import styles from "./JobPosted.module.scss";

type TabType = "Approved" | "Pending";

const fetchSize = 100;

export type JobType = {
  _id: string;
  requestBy: number;
  reportType: string;
  quantity: string;
  Filters: string;
  approvedBy: string;
  action: string;
  status: string;
};

const mockData: JobType[] = [
  {
    _id: "1",
    requestBy: 1,
    reportType: "",
    quantity: "",
    Filters: "",
    approvedBy: "",
    status: "approved",
    action: "Approve",
  },
  {
    _id: "2",
    requestBy: 2,
    reportType: "",
    quantity: "",
    Filters: "",
    approvedBy: "",
    status: "pending",
    action: "Approve",
  },
];

const ApprovalRequest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Approved");
  const [sortingApproved, setSortingApproved] = React.useState<SortingState>([]);
  const [sortingPending, setSortingPending] = React.useState<SortingState>([]);
  const [searchApproved, setSearchApproved] = React.useState<string>(""); 
  const [searchPending, setSearchPending] = React.useState<string>("");

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const flattendActiveEmployerData = React.useMemo(
    () => mockData.filter((employer) => employer.status === "approved"),
    []
  );

  const flattendPendingEmployerData = React.useMemo(
    () => mockData.filter((employer) => employer.status === "pending"),
    []
  );

  const [approvedEmployers, setApprovedEmployers] = useState<JobType[]>(flattendActiveEmployerData);
  const [pendingEmployers, setPendingEmployers] = useState<JobType[]>(flattendPendingEmployerData);

  const totalActiveCount = approvedEmployers.length;
  const totalPendingCount = pendingEmployers.length;

  const columnHelper = createColumnHelper<JobType>();
  const columns = [
    columnHelper.accessor("requestBy", {
      header: "Request By",
      cell: (info) => {
        const value = info.getValue() || "N/A";
        return (
          <Link href={`/employers/${value}`}>
            {value}
          </Link>
        );
      },
    }),
    columnHelper.accessor("reportType", {
      header: "Report Type",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("Filters", {
      header: "Filters",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("approvedBy", {
      header: "Approved By",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      meta: {
        classes: "capitalize f-5",
        filter:false
      },
      cell: (info) => {
        return (
          <div className={`status-cont ${info.getValue() === "pending" ? styles.pending : ""}`}>
            {info.renderValue() || "N/A"}
          </div>
        );
      },
    }),
  ];

  const pendingColumns = [
    ...columns,
    columnHelper.accessor("action", {
      header: "Action",
      meta: {
        classes: "f-7",
        filter:false
      },
      cell: (info) => (
        <div style={{ display: "flex", gap: "32px", fontSize:"14px", fontWeight:600, cursor: "pointer" }}>
          <span onClick={() => handleApprove(info.row.original)} className="color-brand-1">Approve</span>
          <span onClick={() => handleReject(info.row.original)} className="error">Reject</span>
        </div>
      ),
    }),
  ];

  const handleApprove = (employer: JobType) => {
    setApprovedEmployers((prev) => [...prev, employer]);
    setPendingEmployers((prev) => prev.filter((item) => item._id !== employer._id));
    setActiveTab("Approved");
  };

  const handleReject = (employer: JobType) => {
    setPendingEmployers((prev) => prev.filter((item) => item._id !== employer._id));
  };

  return (
    <div className="page-block">
      <div className="page-title">
        <h3 className={styles.heading}>List of Approval Requests</h3>
      </div>
      <Card className={styles.cardContainer}>
        <div className={styles.tabContainer}>
        <button
              className={`tab-button ${activeTab === "Approved" ? "active" : ""}`}
              onClick={() => handleTabClick("Approved")}
            >
              Active ({totalActiveCount})
            </button>
            <button
              className={`tab-button ${
                activeTab === "Pending" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Pending")}
            >
              Pending ({totalPendingCount})
            </button>
        </div>

        {activeTab === "Approved" ? (
          <DataTable
          columns={columns}
          sorting={sortingApproved}
          totalCount={totalActiveCount}
          isSearch={!!searchApproved}
          sortingChanged={(updater: any) => setSortingApproved(updater)}
          data={approvedEmployers}
          fetchNextPage={() => {}}
          isLoading={false}
          isFetching={false}
        />

        ) : (
          <DataTable
          columns={pendingColumns}
          sorting={sortingPending}
          totalCount={totalPendingCount}
          isSearch={!!searchPending}
          sortingChanged={(updater: any) => setSortingPending(updater)}
          data={pendingEmployers}
          fetchNextPage={() => {}}
          isLoading={false}
          isFetching={false}
        />
        )}
      </Card>
    </div>
  );
};

export default ApprovalRequest;