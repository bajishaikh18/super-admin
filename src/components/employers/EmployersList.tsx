import React, { useState } from "react";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Card, Modal } from "react-bootstrap";
import { TableFilter } from "@/components/common/table/Filter";
import { getEmployers } from "@/apis/dashboard";
import { DateTime } from "luxon";
import { COUNTRIES } from "@/helpers/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectOption } from "@/helpers/types";
import CreateEmployerForm from "./CreateEmployer";
import { FaPlus } from "react-icons/fa6";

type TabType = "Active" | "Pending";

const fetchSize = 100;

export type JobType = {
  _id: string; 
  adminUserId:string;
  companyName: string;
  firstName: string;
  lastName: string;
  mobile: string; 
  landline: string; 
  email: string;
  createdAt: string;
  status: string;
  action: string; 
};

export type JobApiResponse = {
  employers: JobType[];
  totalInterviewCount: number;
};

const EmployersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [sortingActive, setSortingActive] = React.useState<SortingState>([]);
  const [sortingPending, setSortingPending] = React.useState<SortingState>([]);
  const [showCreate, setShowCreate] = React.useState<boolean>(false);
  const [searchActive, setSearchActive] = React.useState<string>("");
  const [searchPending, setSearchPending] = React.useState<string>("");
  const [activeEmployerData, setActiveEmployerData] = useState<JobType[]>([]);
  const [pendingEmployerData, setPendingEmployerData] = useState<JobType[]>([]);
  const [fieldActive, setFieldActive] = React.useState<SelectOption>({
    value: "empId",
    label: "Employer Id",
  } as SelectOption);
  const [fieldPending, setFieldPending] = React.useState<SelectOption>({
    value: "empId",
    label: "Employer Id",
  } as SelectOption);

  const debouncedSearchActive = useDebounce(searchActive, 300);
  const debouncedSearchPending = useDebounce(searchPending, 300);

  const {
    data: activeEmployersData,
    fetchNextPage: fetchActiveEmployerNextPage,
    isFetching: isActiveEmployerFetching,
    isLoading: isActiveEmployerLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["employers", "active", debouncedSearchActive],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getEmployers(
        "active",
        start,
        fetchSize,
        fieldActive.value,
        debouncedSearchActive
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnMount: true,
    staleTime: 0,
  });

  const {
    data: pendingEmployersData,
    fetchNextPage: fetchPendingEmployerNextPage,
    isFetching: isPendingEmployerFetching,
    isLoading: isPendingEmployerLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["employers", "pending", debouncedSearchPending],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getEmployers(
        "pending",
        start,
        fetchSize,
        fieldPending.value,
        debouncedSearchPending
      );
      return fetchedData;
    },
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
  });

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const flattendActiveEmployerData = React.useMemo(
    () => activeEmployersData?.pages?.flatMap((page: any) => page?.employers) ?? [],
    [activeEmployersData]
  );
  
  const flattendPendingEmployerData = React.useMemo(
    () => pendingEmployersData?.pages?.flatMap((page: any) => page?.employers) ?? [],
    [pendingEmployersData]
  );

  const totalActiveCount = activeEmployersData?.pages?.[0]?.totalInterviewCount ?? 0;
  const totalPendingCount = pendingEmployersData?.pages?.[0]?.totalInterviewCount ?? 0;

  const columnHelper = createColumnHelper<JobType>();
  const columns = [
    columnHelper.accessor("adminUserId", {
      header: "Employer ID",
      cell: (info) => {
        const value = info.getValue() || "N/A";
        return (
          <Link href={`/employers/${value}`}>
            {value}
          </Link>
        );
      },
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
      cell: (info) => info.renderValue() || "N/A",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      cell: (info) => info.renderValue() || "N/A",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("mobile", {
      header: "Mobile No",
      cell: (info) => info.renderValue() || "N/A",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("landline", {
      header: "Landline No",
      cell: (info) => info.renderValue() || "N/A",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("email", {
      header: "Email Id",
      cell: (info) => info.renderValue() || "N/A",
      meta: {
        classes: "px-10",
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Regd Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: { filterType: "date" },
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
  ];

  const pendingColumns = [
    ...columns,
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => (
        <div style={{ display: "flex", gap: "20px", cursor: "pointer" }}>
          <span onClick={() => handleApprove(info.row.original)} style={{ color: "blue" }}>Approve</span>
          <span onClick={() => handleReject(info.row.original)} style={{ color: "red" }}>Reject</span>
        </div>
      ),
    }),
  ];

  const handleApprove = (employer: JobType) => {
    console.log("Approving employer:", employer);
    setActiveEmployerData((prevActive) => [
      ...prevActive,
      { ...employer, status: "active" }, 
    ]);
    
    setPendingEmployerData((prevPending) => 
      prevPending.filter((item) => item._id !== employer._id)
    );
  };
  
  const handleReject = (employer: JobType) => {
    console.log("Rejected employer:", employer);
    setPendingEmployerData((prevPending) => 
      prevPending.filter((item) => item._id !== employer._id)
    );
  };
  
  const handleCreateUserClick = () => {
    setShowCreate(true);
  };

  const handleCancelCreateUser = () => {
    setShowCreate(false);
  };



  return (
    <div className="page-block">
      <div className="page-title">
        <h3 className="section-heading">List of Employers</h3>
        <div className="filter-container">
          {
            {
              Active: (
                <TableFilter
                  key={"activeFilter"}
                  handleFilterChange={(e) => setFieldActive(e)}
                  field={fieldActive}
                  search={searchActive}
                  columnsHeaders={columns}
                  handleChange={(val: any) => setSearchActive(val)}
                />
              ),
              Pending: (
                <TableFilter
                  key={"pendingFilter"}
                  handleFilterChange={(e) => setFieldPending(e)}
                  field={fieldPending}
                  search={searchPending}
                  columnsHeaders={pendingColumns}
                  handleChange={(val) => setSearchPending(val)}
                />
              ),
            }[activeTab]
          }
          <Button
              href="#"
              className="btn-img"
              onClick={handleCreateUserClick}
            >
              <FaPlus />
              Create Employer
            </Button>
          <Modal show={showCreate} onHide={handleCancelCreateUser} centered backdrop="static">
              <CreateEmployerForm onCancel={handleCancelCreateUser} />
            </Modal>
        </div>
      </div>
      <Card>
        <div className={"header-row"}>
          <div className={"tab-container"}>
            <button
              className={`tab-button ${activeTab === "Active" ? "active" : ""}`}
              onClick={() => handleTabClick("Active")}
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
        </div>
        {
          {
            Active: (
              <div className="fadeIn">
            <DataTable
              columns={columns}
              sorting={sortingActive}
              totalCount={totalActiveCount}
              isSearch={!!searchActive}
              sortingChanged={(updater: any) => setSortingActive(updater)}
              data={flattendActiveEmployerData}
              fetchNextPage={fetchActiveEmployerNextPage}
              isLoading={isActiveEmployerLoading}
              isFetching={isActiveEmployerFetching}
            />
              </div>
            ),
            Pending: (
              <div className="fadeIn">
            <DataTable
              columns={pendingColumns}
              sorting={sortingPending}
              totalCount={totalPendingCount}
              isSearch={!!searchPending}
              sortingChanged={(updater: any) => setSortingPending(updater)}
              data={flattendPendingEmployerData} 
              fetchNextPage={fetchPendingEmployerNextPage}
              isLoading={isPendingEmployerLoading}
              isFetching={isPendingEmployerFetching}
            />
              </div>
            ),
          }[activeTab]
        }
      </Card>
    </div>
  );
};

export default EmployersList;
