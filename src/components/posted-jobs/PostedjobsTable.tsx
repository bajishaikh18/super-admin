import React, { useState, useEffect, useCallback, useMemo } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { useUserStore } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData, PersonApiResponse } from "../../helpers/makeData";
import { Card } from "react-bootstrap";
import { TableFilter } from "@/components/common/table/Filter";

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

const PostedJobsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const { fetchUsers } = useUserStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<PersonApiResponse>({
      queryKey: [
        "people",
        sorting, //refetch when sorting changes
        activeTab,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await fetchData(start, fetchSize, sorting); //pretend api call
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  const {
    data: expiredData,
    fetchNextPage: fetchNextPageExpired,
    isFetching: isFetchingExpired,
    isLoading: isLoadingExpired,
  } = useInfiniteQuery<PersonApiResponse>({
    queryKey: [
      "people",
      sorting, //refetch when sorting changes
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize;
      const fetchedData = await fetchData(start, fetchSize, sorting); //pretend api call
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
  const flatData = React.useMemo(
    () =>
      data?.pages?.flatMap((page: any) => page?.data) ?? [],
    [data]
  );
  const totalCount = flatData.length ?? 0;

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
              Active ({12415})
            </button>
            <button
              className={`tab-button ${
                activeTab === "Pending" ? 'active' : ""
              }`}
              onClick={() => handleTabClick("Pending")}
            >
              Pending ({21})
            </button>
            <button
             className={`tab-button ${
              activeTab === "Expired" ? 'active' : ""
            }`}
              onClick={() => handleTabClick("Expired")}
            >
              Expired ({241})
            </button>
          </div>
          <TableFilter
            search={search}
            handleChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        {
          {
            Active: (
                <div className="fadeIn">
              <DataTable
                columns={columns}
                sorting={sorting}
                totalCount={totalCount}
                isSearch={!!search}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={flatData}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isFetching={isFetching}
              />
              </div>
            ),
            Expired: (
                <div className="fadeIn">

              {/* <DataTable
                columns={columns}
                sorting={sorting}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={flatData}
                totalCount={totalCount}
                isSearch={!!search}
                fetchNextPage={fetchNextPageExpired}
                isLoading={isLoadingExpired}
                isFetching={isFetchingExpired}
              /> */}
              </div>
            ),
            Pending: (
                <div className="fadeIn">

              </div>
            ),
          }[activeTab]
        }
      </Card>
  );
};

export default PostedJobsTable;
