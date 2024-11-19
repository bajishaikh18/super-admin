import React, { useState, useEffect } from "react";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { Card } from "react-bootstrap";
import styles from "./JobPosted.module.scss";
import { getApprovals, updateApprovalStatus } from "@/apis/approval";

type TabType = "Approved" | "Pending";

const fetchSize = 100;

export type JobType = {
  _id: string;
  requestBy: number;
  reportType: string;
  quantity: string;
  filters: string;
  approvedBy: string;
  createdAt: string;
  action: string;
  status: string;
};

const ApprovalRequest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Approved");
  const [sortingApproved, setSortingApproved] = useState<SortingState>([]);
  const [sortingPending, setSortingPending] = useState<SortingState>([]);
  const [searchApproved, setSearchApproved] = useState<string>(""); 
  const [searchPending, setSearchPending] = useState<string>("");

  const [approvedEmployers, setApprovedEmployers] = useState<JobType[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<JobType[]>([]);

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
    columnHelper.accessor("filters", {
      header: "Filters",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("approvedBy", {
      header: "Approved By",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("createdAt", {
      header: "Regd Date",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("status", {
      header: "Status",
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
      cell: (info) => (
        <div style={{ display: "flex", gap: "32px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          <span onClick={() => handleApprove(info.row.original)} className="color-brand-1">Approve</span>
          <span onClick={() => handleReject(info.row.original)} className="error">Reject</span>
        </div>
      ),
    }),
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleApprove = async (employer: JobType) => {
    try {
      await updateApprovalStatus(employer._id, "approve");
      setApprovedEmployers((prev) => [...prev, employer]);
      setPendingEmployers((prev) => prev.filter((item) => item._id !== employer._id));
      setActiveTab("Approved");
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const handleReject = async (employer: JobType) => {
    try {
      await updateApprovalStatus(employer._id, "reject");
      setPendingEmployers((prev) => prev.filter((item) => item._id !== employer._id));
    } catch (error) {
      console.error("Error rejecting approval:", error);
    }
  };

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const response = await getApprovals();
        console.log("Response Data:", response); 

        const approvalData = response.ApprovalData; 
        const approved = approvalData.filter((item: any) => item.status === "approved");
        const pending = approvalData.filter((item: any) => item.status === "pending");

        setApprovedEmployers(approved);
        setPendingEmployers(pending);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    fetchApprovalData();
  }, []);

  const filteredApprovedEmployers = approvedEmployers.filter(employer => employer.requestBy.toString().includes(searchApproved));
  const filteredPendingEmployers = pendingEmployers.filter(employer => employer.requestBy.toString().includes(searchPending));

  const totalApprovedCount = filteredApprovedEmployers.length;
  const totalPendingCount = filteredPendingEmployers.length;

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
            Approved ({totalApprovedCount})
          </button>
          <button
            className={`tab-button ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => handleTabClick("Pending")}
          >
            Pending ({totalPendingCount})
          </button>
        </div>

        {activeTab === "Approved" ? (
          <DataTable
            columns={columns}
            sorting={sortingApproved}
            totalCount={totalApprovedCount}
            isSearch={!!searchApproved}
            sortingChanged={(updater: any) => setSortingApproved(updater)}
            data={filteredApprovedEmployers}
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
            data={filteredPendingEmployers}
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
