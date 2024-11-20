import React, { useState, useEffect } from "react";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { DateTime } from "luxon";
import { Card } from "react-bootstrap";
import styles from "./JobPosted.module.scss";
import { getApprovals, updateApprovalStatus } from "@/apis/approval";

type TabType = "Approved" | "Pending"| "Completed";

const fetchSize = 50;

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
  reason: string;
};
const reportTypeMapping: { [key: string]: string } = {
  "jobs-posted": "Jobs Posted",
  "application-received": "Applications Received",
  "jobs-applied": "Jobs Applied",
  "users-report": "Users Report",
  "employer-applications": "Employers Application"
};
const ApprovalRequest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Approved");
  const [sortingApproved, setSortingApproved] = useState<SortingState>([]);
  const [sortingPending, setSortingPending] = useState<SortingState>([]);
  const [sortingCompleted, setSortingCompleted] = useState<SortingState>([]);
  const [searchApproved, setSearchApproved] = useState<string>(""); 
  const [searchPending, setSearchPending] = useState<string>("");
  const [searchCompleted, setSearchCompleted] = useState<string>(""); 
  const [approvedEmployers, setApprovedEmployers] = useState<JobType[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<JobType[]>([]);
  const [completedEmployers, setCompletedEmployers] = useState<JobType[]>([]);
  const queryClient = useQueryClient();

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
      cell: (info) => {
        const reportType = info.getValue() || "N/A";
        return reportTypeMapping[reportType] || reportType;
      },
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("filters", {
      cell: (info) => {
        const value = info.getValue();
        return Array.isArray(value) ? value.join(", ") : value || "N/A";
      },
    }),
    columnHelper.accessor("approvedBy", {
      header: "Approved By",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("createdAt", {
      header: "Regd Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
          
      meta: { filterType: "date",            classes: "f-5",
      },
    }),
    columnHelper.accessor("reason", {
      header: "Reason",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      meta: {
        classes: "capitalize f-5",
        filter: false
      },
      cell: (info) => {
        return (
          <div
            className={`status-cont ${info.getValue() === "pending" ? styles.pending : ""}`}
          >
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
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes('employers');
        },
        refetchType:'all'
      })
      toast.success("Employer approved successfully!");
    } catch (error) {
      toast.error("Failed to approve.");
    }
  };

  const handleReject = async (employer: JobType) => {
    try {
      await updateApprovalStatus(employer._id, "reject");
      toast.success("Employer rejected successfully!");
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes('employers');
        },
        refetchType:'all'
      })
    } catch (error) {
      toast.error("Failed to reject.");
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
        const completed = approvalData.filter((item: any) => item.status === "completed");

        setApprovedEmployers(approved);
        setPendingEmployers(pending);
        setCompletedEmployers(completed);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    fetchApprovalData();
  }, []);

  const filteredApprovedEmployers = approvedEmployers.filter(employer => employer.requestBy.toString().includes(searchApproved));
  const filteredPendingEmployers = pendingEmployers.filter(employer => employer.requestBy.toString().includes(searchPending));
  const filteredCompletedEmployers = completedEmployers.filter(employer => employer.requestBy.toString().includes(searchCompleted));

  const totalApprovedCount = filteredApprovedEmployers.length;
  const totalPendingCount = filteredPendingEmployers.length;
  const totalCompletedCount = filteredCompletedEmployers.length;

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
          <button
            className={`tab-button ${activeTab === "Completed" ? "active" : ""}`}
            onClick={() => handleTabClick("Completed")}
          >
            Completed ({totalCompletedCount})
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
        ) : activeTab === "Pending" ? (
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
        ) : (
          <DataTable
            columns={columns}
            sorting={sortingCompleted}
            totalCount={totalCompletedCount}
            isSearch={!!searchCompleted}
            sortingChanged={(updater: any) => setSortingCompleted(updater)}
            data={filteredCompletedEmployers}
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