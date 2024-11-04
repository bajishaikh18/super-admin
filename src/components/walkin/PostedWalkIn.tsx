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
import { Button, Card, Modal } from "react-bootstrap";
import { TableFilter } from "@/components/common/table/Filter";
import { getInterviews, getInterviewSummary } from "@/apis/walkin";
import { DateTime } from "luxon";
import { COUNTRIES } from "@/helpers/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectOption } from "@/helpers/types";
import { FullScreenImage } from "../common/FullScreenImage";
import usePostWalkinStore from "@/stores/usePostWalkinStore";
import CreateWalkIn from "../create-walkin/CreateWalkIn";

type TabType = "Active" | "Pending" | "Expired";

const fetchSize = 100;

export type JobType = {
  _id: string;
  interviewId:string;
  jobId: string;
  agency: string;
  location: string;
  amenities: string[];
  positions: object[];
  interviewDate: string;
  imageUrl: string;
  createdAt: string;
  expiry: string;
};

export type JobApiResponse = {
  jobs: JobType[];
  totalInterviewCount: number;
};

const PostedWakInTable: React.FC = () => {  
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [sortingActive, setSortingActive] = React.useState<SortingState>([]);
  const [sortingExpired, setSortingExpired] = React.useState<SortingState>([]);
  const [sortingPending, setSortingPending] = React.useState<SortingState>([]);
  const [ showCreate, setShowCreate] = React.useState<boolean>(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [searchActive, setSearchActive] = React.useState<string>("");
  const [searchPending, setSearchPending] = React.useState<string>("");
  const [searchExpired, setSearchExpired] = React.useState<string>("");
  const [fieldActive, setFieldActive] = React.useState<SelectOption>({
    value: "interviewId",
    label: "Post Id",
  } as SelectOption);
  const [fieldPending, setFieldPending] = React.useState<SelectOption>({
    value: "interviewId",
    label: "Post Id",
  } as SelectOption);
  const [fieldExpired, setFieldExpired] = React.useState<SelectOption>({
    value: "interviewId",
    label: "Post Id",
  } as SelectOption);

  const debouncedSearchActive = useDebounce(searchActive, 300);
  const debouncedSearchExpired = useDebounce(searchExpired, 300);
  const debouncedSearchPending = useDebounce(searchPending, 300);

  const {
    data: activeWalkinData,
    fetchNextPage: fetchActiveWalkinNextPage,
    isFetching: isActiveWalkinFetching,
    isLoading: isActiveWalkinLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["walkins", "active", debouncedSearchActive],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getInterviews(
        "active",
        start,
        fetchSize,
        debouncedSearchActive,
        fieldActive.value
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnMount: true,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

  const {
    data: expiredWalkinData,
    fetchNextPage: fetchExpiredWalkinNextPage,
    isFetching: isExpiredWalkinFetching,
    isLoading: isExpiredWalkinLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["walkins", "expired", debouncedSearchExpired],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getInterviews(
        "expired",
        start,
        fetchSize,
        debouncedSearchExpired,
        fieldExpired.value
      );
      return fetchedData;
    },
    refetchOnMount: true,
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    placeholderData: keepPreviousData,
  });
  const {setShowPostWalkin} = usePostWalkinStore();

  const {
    data: pendingWalkinData,
    fetchNextPage: fetchPendingWalkinNextPage,
    isFetching: isPendingWalkinFetching,
    isLoading: isPendingWalkinLoading,
  } = useInfiniteQuery<JobApiResponse>({
    queryKey: ["walkins", "pending", debouncedSearchPending],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getInterviews(
        "pending",
        start,
        fetchSize,
        debouncedSearchPending,
        fieldPending.value
      );
      return fetchedData;
    },
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const flattendActiveWalkinData = React.useMemo(
    () => activeWalkinData?.pages?.flatMap((page: any) => page?.interviews) ?? [],
    [activeWalkinData]
  );

  const flattendExpiredWalkinData = React.useMemo(
    () => expiredWalkinData?.pages?.flatMap((page: any) => page?.interviews) ?? [],
    [expiredWalkinData]
  );

  const flattendPendingWalkinData = React.useMemo(
    () => pendingWalkinData?.pages?.flatMap((page: any) => page?.interviews) ?? [],
    [pendingWalkinData]
  );

  const totalActiveCount = activeWalkinData?.pages?.[0]?.totalInterviewCount ?? 0;
  const totalPendingCount = pendingWalkinData?.pages?.[0]?.totalInterviewCount ?? 0;
  const totalExpiredCount = expiredWalkinData?.pages?.[0]?.totalInterviewCount ?? 0;

  const columnHelper = createColumnHelper<JobType>();
  const columns = [
    columnHelper.accessor("interviewId", {
      header: "Post Id",
      cell: (info) => (
        <Link href={`/walk-in/${info.getValue()}`}>{info.getValue()}</Link>
      ),
    }),
    columnHelper.accessor("agency", {
      cell: (info) => info.renderValue() || "N/A",
      header: "Agency",
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) =>
        COUNTRIES[info.renderValue() as "sa"]?.label ||
        info.renderValue() ||
        "N/A",
      meta: {
        classes: "capitalize",
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
          {
            value: "Food",
            label: "Food",
          },
          {
            value: "Transportation",
            label: "Transportation",
          },
          {
            value: "Stay",
            label: "Stay",
          },
          {
            value: "Recruitment",
            label: "Recruitment",
          },
        ],
      },
    }),
    columnHelper.accessor("positions", {
      header: "No. of positions",
      cell: (info) => info.getValue()?.length || "N/A",
      meta: { filterType: "number" },
    }),
    columnHelper.accessor("interviewDate", {
      header: "Interview Date & Time",
      cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd MMM yyyy hh:mm a"),
      meta: { filterType: "dateTime" },
    }),
    columnHelper.accessor("imageUrl", {
      cell: (info) => (
        <>
          {
            info.getValue() ? <Link
            href={`javascript:;`}
            onClick={() => {
              setShowImage(true);
              setImageUrl(info.getValue());
            }}
            className={dataTableStyles.normalLink}
          >
            
            View Image
          </Link> : "N/A"
          }
        </>
        
      ),
      header: "Media",
      meta: { filter: false },
    }),
    columnHelper.accessor("createdAt", {
      header: "Posted Date",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: { filterType: "date" },
    }),
    columnHelper.accessor("expiry", {
      header: "Expiry",
      cell: (info) =>
        info.renderValue()
          ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
          : "N/A",
      meta: { filterType: "date" },
    }),
  ];

  return (
    <div className="page-block">
      <div className="page-title">
        <h3 className="section-heading">Posted Walk-In</h3>
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
              Expired: (
                <TableFilter
                  key={"expiredFilter"}
                  handleFilterChange={(e) => setFieldExpired(e)}
                  field={fieldExpired}
                  search={searchExpired}
                  columnsHeaders={columns}
                  handleChange={(val: any) => setSearchExpired(val)}
                />
              ),
              Pending: (
                <TableFilter
                  key={"pendingFilter"}
                  handleFilterChange={(e) => setFieldPending(e)}
                  field={fieldPending}
                  search={searchPending}
                  columnsHeaders={columns}
                  handleChange={(val) => setSearchPending(val)}
                />
              ),
            }[activeTab]
          }
          <Button href="#" className="btn-img" onClick={()=>setShowCreate(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 8H14C14.1326 8 14.2598 8.05268 14.3536 8.14645C14.4473 8.24021 14.5 8.36739 14.5 8.5V12.5C14.5 12.6326 14.4473 12.7598 14.3536 12.8536C14.2598 12.9473 14.1326 13 14 13H2C1.86739 13 1.74021 12.9473 1.64645 12.8536C1.55268 12.7598 1.5 12.6326 1.5 12.5V8.5C1.5 8.36739 1.55268 8.24021 1.64645 8.14645C1.74021 8.05268 1.86739 8 2 8H5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 8V1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 4.5L8 1.5L11 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.75 11.25C12.1642 11.25 12.5 10.9142 12.5 10.5C12.5 10.0858 12.1642 9.75 11.75 9.75C11.3358 9.75 11 10.0858 11 10.5C11 10.9142 11.3358 11.25 11.75 11.25Z" fill="white"/>
        </svg>

            Post a New Walk-In
          </Button>
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
            <button
              className={`tab-button ${
                activeTab === "Expired" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Expired")}
            >
              Expired ({totalExpiredCount})
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
                  data={flattendActiveWalkinData}
                  fetchNextPage={fetchActiveWalkinNextPage}
                  isLoading={isActiveWalkinLoading}
                  isFetching={isActiveWalkinFetching}
                />
              </div>
            ),
            Expired: (
              <div className="fadeIn">
                <DataTable
                  columns={columns}
                  sorting={sortingExpired}
                  totalCount={totalExpiredCount}
                  isSearch={!!searchExpired}
                  sortingChanged={(updater: any) => setSortingExpired(updater)}
                  data={flattendExpiredWalkinData}
                  fetchNextPage={fetchExpiredWalkinNextPage}
                  isLoading={isExpiredWalkinLoading}
                  isFetching={isExpiredWalkinFetching}
                />
              </div>
            ),
            Pending: (
              <div className="fadeIn">
                <DataTable
                  columns={columns}
                  sorting={sortingPending}
                  totalCount={totalPendingCount}
                  isSearch={!!searchPending}
                  sortingChanged={(updater: any) => setSortingPending(updater)}
                  data={flattendPendingWalkinData}
                  fetchNextPage={fetchPendingWalkinNextPage}
                  isLoading={isPendingWalkinLoading}
                  isFetching={isPendingWalkinFetching}
                />
              </div>
            ),
          }[activeTab]
        }
      </Card>
      <Modal
        show={showCreate}
        onHide={()=>setShowCreate(false)}
        centered
        backdrop="static"
      >
        {showCreate && (
          <CreateWalkIn handleModalClose={()=>setShowCreate(false)} />
        )}
      </Modal>
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

export default PostedWakInTable;
