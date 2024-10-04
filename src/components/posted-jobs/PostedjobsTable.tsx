import React, { useState, useEffect, useCallback, useMemo } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { useUserStore } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchData, PersonApiResponse } from "../../helpers/makeData";
import { Card } from "react-bootstrap";
import { TableFilter } from "@/components/common/table/Filter";
import { getJobs, getJobSummary } from "@/apis/job";
import { DateTime } from "luxon";
import { COUNTRIES } from "@/helpers/constants";
import { useDebounce } from "@uidotdev/usehooks";

type TabType = "Active" | "Pending" | "Expired";
type Person = {
  jobId: string;
  agencyName: string;
  location: string;
  amenities: string[];
  noOfPositions: number;
  media: string;
  postedDate: string;
  expiry: string;
};
interface PostedJobsProps {
  onViewImageToggle: (isActive: boolean) => void; 
}

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("jobId", {
    header: () => "Post Id",
    cell: (info) => (
      <Link href={`/jobs/${info.getValue()}`}>{info.getValue()}</Link>
    ),
  }),
  columnHelper.accessor("agencyName", {
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => "Agency",
  }),
  columnHelper.accessor("location", {
    header: () => "Location",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("amenities", {
    header: () => "Benefits",
  }),
  columnHelper.accessor("noOfPositions", {
    header: "No. of positions",
  }),
  columnHelper.accessor("media", {
    cell: (info) => (
      <Link
        href={`/jobs/${info.getValue()}`}
        className={'normal-link'}
      >
        View Image
      </Link>
    ),
    header: "Media",
  }),
  columnHelper.accessor("postedDate", {
    header: "Posted Date",
  }),
  columnHelper.accessor("expiry", {
    header: "Expiry",
  }),
];

const fetchSize = 50;

export type JobType = {
  _id: string;
  agencyId: string;
  location: string;
  amenities: string[];
  positions: object[];
  imageUrl: string;
  createdAt: string;
  expiry: string;
}

export type JobApiResponse = {
jobs: JobType[]
}

const PostedJobsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchActive, setSearchActive] = React.useState<string>("");
  const [searchPending, setSearchPending] = React.useState<string>("");
  const [searchExpired, setSearchExpired] = React.useState<string>("");
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
    retry: 3
  });

  const { data:activeJobsData , fetchNextPage: fetchActiveJobsNextPage, isFetching: isActiveJobsFetching, isLoading: isActiveJobsLoading } =
    useInfiniteQuery<JobApiResponse>({
      queryKey: ["jobs", sorting, 'active', debouncedSearchActive],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await getJobs('status','active',start, fetchSize,debouncedSearchActive);
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  const { data:expiredJobsData , fetchNextPage: fetchExpiredJobsNextPage, isFetching: isExpiredJobsFetching, isLoading: isExpiredJobsLoading } =
    useInfiniteQuery<JobApiResponse>({
      queryKey: ["people", sorting, 'expired',debouncedSearchExpired],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await getJobs('status','expired',start, fetchSize,debouncedSearchExpired);
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  const { data:pendingJobsData , fetchNextPage: fetchPendingJobsNextPage, isFetching: isPendingJobsFetching, isLoading: isPendingJobsLoading } =
    useInfiniteQuery<JobApiResponse>({
      queryKey: ["people", sorting, 'pending',debouncedSearchPending],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await getJobs('status','pending',start, fetchSize,debouncedSearchPending);
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
    () =>
      activeJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
    [activeJobsData]
  );

  const flattendExpiredJobData = React.useMemo(
    () =>
      expiredJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
    [expiredJobsData]
  );
  
  const flattendPendingJobData = React.useMemo(
    () =>
      pendingJobsData?.pages?.flatMap((page: any) => page?.jobs) ?? [],
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
      cell: (info) => COUNTRIES[info.renderValue() as "sa"] || info.renderValue() || "N/A",
      meta:{classes:"capitalize"}
    }),
    columnHelper.accessor("amenities", {
      header: () => "Benefits",
      cell: (info) => info.renderValue()?.join(', ') || "N/A",
    }),
    columnHelper.accessor("positions", {
      header: "No. of positions",
      cell: (info)=> info.getValue()?.length || "N/A"
    }),
    columnHelper.accessor("imageUrl", {
      cell: (info) => (
        <span
          className={dataTableStyles.normalLink}
          onClick={() => {}}
          style={{ cursor: "pointer" }}
        >
          View Image
        </span>
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
    columnHelper.accessor('expiry', {
      header: 'Expiry',
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
    }),
  ];

  const fetchSize = 50;

  return (
      <Card>
        <div className={"header-row"}>
          <div className={"tab-container"}>
            <button
              className={`tab-button ${
                activeTab === "Active" ? 'active' : ""
              }`}
              onClick={() => handleTabClick("Active")}
            >
              Active ({totalActiveCount})
            </button>
            <button
              className={`tab-button ${
                activeTab === "Pending" ? 'active' : ""
              }`}
              onClick={() => handleTabClick("Pending")}
            >
              Pending ({totalPendingCount})
            </button>
            <button
             className={`tab-button ${
              activeTab === "Expired" ? 'active' : ""
            }`}
              onClick={() => handleTabClick("Expired")}
            >
              Expired ({totalExpiredCount})
            </button>
          </div>
          {{
           "Active":  <TableFilter
                  search={searchActive}
                  handleChange={(e: any) => setSearchActive(e.target.value)}
                />,
                "Expired":  <TableFilter
                search={searchExpired}
                handleChange={(e: any) => setSearchExpired(e.target.value)}
              />,
              Pending:  <TableFilter
              search={searchPending}
              handleChange={(e: any) => setSearchPending(e.target.value)}
            />
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
              )
            }[activeTab]
        }
      </Card>
  );
};

export default PostedJobsTable;
