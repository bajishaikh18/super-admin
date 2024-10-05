import React, { useState, useEffect, useCallback, useMemo } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { useUserStore } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { fetchData, PersonApiResponse } from "../../helpers/makeData";
import { Card, Modal } from "react-bootstrap";
import { TableFilter } from "@/components/common/table/Filter";
import { getJobs, getJobSummary } from "@/apis/job";
import { DateTime } from "luxon";
import { COUNTRIES, IMAGE_BASE_URL } from "@/helpers/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectOption } from "@/helpers/types";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FullScreenImage } from "../common/FullScreenImage";

type TabType = "Active" | "Pending" | "Expired";
type Person = {
  jobId: string;
  agencyName: string;
  location: string;
  amenities: string[];
  noOfPositions: number;
  imageUrl: string;
  postedDate: string;
  expiry: string;
};

const fetchSize = 100;

export type JobType = {
  _id: string;
  agencyId: string;
  location: string;
  amenities: string[];
  positions: object[];
  imageUrl: string;
  createdAt: string;
  expiry: string;
};

export type JobApiResponse = {
  jobs: JobType[];
};

const PostedJobsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showImage,setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [searchActive, setSearchActive] = React.useState<string>("");
  const [searchPending, setSearchPending] = React.useState<string>("");
  const [searchExpired, setSearchExpired] = React.useState<string>("");
  const [fieldActive, setFieldActive] = React.useState<SelectOption>({value:"_id",label:"Post Id"} as SelectOption);
  const [fieldPending, setFieldPending] = React.useState<SelectOption>({value:"_id",label:"Post Id"} as SelectOption);
  const [fieldExpired, setFieldExpired] = React.useState<SelectOption>({value:"_id",label:"Post Id"} as SelectOption);

  const debouncedSearchActive = useDebounce(searchActive, 300);
  const debouncedSearchExpired = useDebounce(searchExpired, 300);
  const debouncedSearchPending = useDebounce(searchPending, 300);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary", "job"],
    queryFn: getJobSummary,
    retry: 3,
  });

  const {
    data: activeJobsData,
    fetchNextPage: fetchActiveJobsNextPage,
    isFetching: isActiveJobsFetching,
    isLoading: isActiveJobsLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["jobs", sorting, "active", debouncedSearchActive],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number);
      const fetchedData = await getJobs(
        "status",
        "active",
        start,
        fetchSize,
        debouncedSearchActive
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: expiredJobsData,
    fetchNextPage: fetchExpiredJobsNextPage,
    isFetching: isExpiredJobsFetching,
    isLoading: isExpiredJobsLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["jobs", sorting, "expired", debouncedSearchExpired],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number);
      const fetchedData = await getJobs(
        "status",
        "expired",
        start,
        fetchSize,
        debouncedSearchExpired
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: pendingJobsData,
    fetchNextPage: fetchPendingJobsNextPage,
    isFetching: isPendingJobsFetching,
    isLoading: isPendingJobsLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["jobs", sorting, "pending", debouncedSearchPending],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) ;
      const fetchedData = await getJobs(
        "status",
        "pending",
        start,
        fetchSize,
        debouncedSearchPending
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const flattendActiveJobData = React.useMemo(
    () => activeJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
    [activeJobsData]
  );

  const flattendExpiredJobData = React.useMemo(
    () => expiredJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
    [expiredJobsData]
  );

  const flattendPendingJobData = React.useMemo(
    () => pendingJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
    [pendingJobsData]
  );

  const totalActiveCount = summaryData?.activeCount ?? 0;
  const totalPendingCount = summaryData?.pendingCount ?? 0;
  const totalExpiredCount = summaryData?.expiredCount ?? 0;

  const columnHelper = createColumnHelper<JobType>();
  const columns = [
    columnHelper.accessor("_id", {
      header: () => "Post Id",
      cell: (info) => (
        <Link href={`/posted-jobs/${info.getValue()}`}>{info.getValue()}</Link>
      ),
    }),
    columnHelper.accessor("agencyId", {
      cell: (info) => info.renderValue() || "N/A",
      header: () => "Agency",
    }),
    columnHelper.accessor("location", {
      header: () => "Location",
      cell: (info) =>
        COUNTRIES[info.renderValue() as "sa"]?.label ||
        info.renderValue() ||
        "N/A",
      meta: { classes: "capitalize" },
    }),
    columnHelper.accessor("amenities", {
      header: () => "Benefits",
      cell: (info) => (
        <span title={info.renderValue()?.join(", ") || "N/A"}>
          {info.renderValue()?.join(", ") || "N/A"}
        </span>
      ),
    }),
    columnHelper.accessor("positions", {
      header: "No. of positions",
      cell: (info) => info.getValue()?.length || "N/A",
    }),
    columnHelper.accessor("imageUrl", {
      cell: (info) => (
        <Link
        href={`javascript:;`}
        onClick={() =>{
          setShowImage(true)
          setImageUrl(info.getValue())
        }
        }
        className={dataTableStyles.normalLink}
      >
        View Image
      </Link>
      ),
      header: "Media",
    }),
    columnHelper.accessor("createdAt", {
      header: "Posted Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
    }),
    columnHelper.accessor("expiry", {
      header: "Expiry",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
    }),
  ];


  return (
    <>
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
            className={`tab-button ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => handleTabClick("Pending")}
          >
            Pending ({totalPendingCount})
          </button>
          <button
            className={`tab-button ${activeTab === "Expired" ? "active" : ""}`}
            onClick={() => handleTabClick("Expired")}
          >
            Expired ({totalExpiredCount})
          </button>
        </div>
        {
          {
            Active: (
              <TableFilter
                handleFilterChange={(e)=> setFieldActive(e)}
                field={fieldActive}
                search={searchActive}
                columnsHeaders={columns}
                handleChange={(e: any) => setSearchActive(e.target.value)}
              />
            ),
            Expired: (
              <TableFilter
                handleFilterChange={(e)=> setFieldExpired(e)}
                field={fieldExpired}
                search={searchExpired}
                columnsHeaders={columns}
                handleChange={(e: any) => setSearchExpired(e.target.value)}
              />
            ),
            Pending: (
              <TableFilter
                handleFilterChange={(e)=> setFieldPending(e)}
                field={fieldPending}
                search={searchPending}
                columnsHeaders={columns}
                handleChange={(e: any) => setSearchPending(e.target.value)}
              />
            ),
          }[activeTab]
        }
      </div>
      {
        {
          Active: (
            <div className="fadeIn">
              <DataTable
                columns={columns}
                sorting={sorting}
                totalCount={totalActiveCount}
                isSearch={!!searchActive}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={flattendActiveJobData}
                fetchNextPage={fetchActiveJobsNextPage}
                isLoading={isActiveJobsLoading}
                isFetching={isActiveJobsFetching}
              />
            </div>
          ),
          Expired: (
            <div className="fadeIn">
              <DataTable
                columns={columns}
                sorting={sorting}
                totalCount={totalExpiredCount}
                isSearch={!!searchExpired}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={flattendExpiredJobData}
                fetchNextPage={fetchExpiredJobsNextPage}
                isLoading={isExpiredJobsLoading}
                isFetching={isExpiredJobsFetching}
              />
            </div>
          ),
          Pending: (
            <div className="fadeIn">
              <DataTable
                columns={columns}
                sorting={sorting}
                totalCount={totalPendingCount}
                isSearch={!!searchPending}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={flattendPendingJobData}
                fetchNextPage={fetchPendingJobsNextPage}
                isLoading={isPendingJobsLoading}
                isFetching={isPendingJobsFetching}
              />
            </div>
          ),
        }[activeTab]
      }
    </Card>
    <FullScreenImage isOpen={showImage} handleClose={()=>{setImageUrl(""),setShowImage(false)}} imageUrl={imageUrl}/>
    </>
  );
};

export default PostedJobsTable;
