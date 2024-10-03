import React, { useState, useMemo } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { User } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getSummary, getUsers } from "@/apis/dashboard";
import { INDIAN_STATES } from "@/helpers/stateList";
import { downloadMedia } from "@/helpers/mediaDownload";

import { useDebounce } from "@uidotdev/usehooks";
import { TableFilter } from "../common/table/Filter";
import { DateTime } from "luxon";

type TabType = "admin" | "app";

const columnHelper = createColumnHelper<User>();

const fetchSize = 100;

const RegisteredUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("app");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");
  const [searchAdmin, setSearchAdmin] = React.useState<string>("");

  const debouncedSearchTerm = useDebounce(search, 300);
  const debouncedSearchTermAdmin = useDebounce(searchAdmin, 300);

  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: () => "User Name",
        cell: (info) => (
          <Link href={`/user/${info.renderValue()}`}>{info.renderValue()}</Link>
        ),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("phone", {
        header: () => "Mobile No",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("email", {
        header: () => "Email Id",
        cell: (info) => (
          <OverlayTrigger
            overlay={<Tooltip id="button-tooltip-2">Check out this avatar</Tooltip>}
          >
            <>{info.renderValue() || "N/A"}</>
          </OverlayTrigger>
        ),
        meta: {
          classes: "px-10",
        },
      }),
      columnHelper.accessor("state", {
        header: () => "State",
        cell: (info) =>
          INDIAN_STATES.find((state) => state.state_code === info.renderValue())
            ?.name || info.renderValue(),
      }),
      columnHelper.accessor("currentJobTitle", {
        header: "Job title",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("industry", {
        header: "Industry",
        cell: (info) => info.renderValue() || "N/A",
        meta:{classes:"capitalize"}
      }),
      columnHelper.accessor("totalExperience", {
        header: "Experience",
        cell: (info) =>
          info.renderValue() ? `${info.renderValue()} Years` : "N/A",
      }),
      columnHelper.accessor("gulfExperience", {
        header: "Gulf Exp.",
        cell: (info) => (info.renderValue() === true ? "Yes" : "No"),
      }),
      columnHelper.accessor("resume", {
        cell: (info) => {
          const [, extn] = info.getValue()?.keyName?.split("") || [];
          return info.getValue()?.keyName ? (
            <Link
              href={`javascript:;`}
              onClick={() =>
                downloadMedia(
                  info.getValue()?.keyName,
                  `${info.row.getValue("firstName")}_${info.row.getValue(
                    "lastName"
                  )}.${extn}`
                )
              }
              className={dataTableStyles.normalLink}
            >
              Download CV
            </Link>
          ) : (
            "N/A"
          );
        },

        header: "CV Availability",
      }),
      columnHelper.accessor("workVideo", {
        cell: (info) => {
          return info.getValue()?.keyName ? (
            <Link
              href={`javascript:;`}
              onClick={() =>
                downloadMedia(
                  info.getValue()?.keyName,
                  `${info.row.getValue("firstName")}_${info.row.getValue(
                    "lastName"
                  )}.mp4`
                )
              }
              className={dataTableStyles.normalLink}
            >
              View Video
            </Link>
          ) : (
            "N/A"
          );
        },

        header: "Work Video",
      }),
      columnHelper.accessor("createdAt", {
        header: "Regd. date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd-MM-yyyy")
            : "N/A",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => info.renderValue() || "N/A",
      }),
    ],
    []
  );

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary", "dashboard"],
    queryFn: getSummary,
    retry: 3,
  });

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    User[]
  >({
    queryKey: ["people", activeTab, debouncedSearchTerm, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getUsers(
        activeTab,
        start,
        fetchSize,
        debouncedSearchTerm
      );
      return fetchedData;
    },
    retry: 3,
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: adminData,
    fetchNextPage: fetchAdminNextPage,
    isFetching: isAdminFetching,
    isLoading: isAdminLoading,
  } = useInfiniteQuery<User[]>({
    queryKey: ["people", activeTab, debouncedSearchTermAdmin, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getUsers(
        activeTab,
        start,
        fetchSize,
        debouncedSearchTermAdmin
      );
      return fetchedData;
    },
    refetchInterval: 100000,
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = React.useMemo(
    () =>
      data?.pages?.flatMap((page: any) => page?.paginatedUsers?.users) ?? [],
    [data]
  );
  const totalCount = summaryData?.usersRegistered ?? 0;

  const flatDataAdmin = React.useMemo(
    () =>
      adminData?.pages?.flatMap((page: any) => page?.paginatedUsers?.users) ??
      [],
    [adminData]
  );
  const totalCountAdmin = summaryData?.adminCount ?? 0;

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <Card>
      <div className={"header-row"}>
        <div className={"tab-container"}>
          <button
            className={`tab-button ${activeTab === "app" ? "active" : ""}`}
            onClick={() => handleTabClick("app")}
          >
            App Users ({summaryData?.usersRegistered || 0})
          </button>
          <button
            className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => handleTabClick("admin")}
          >
            Admin Users ({summaryData?.adminCount || 0})
          </button>
        </div>
        {
          {
            app: (
              <TableFilter
                search={search}
                handleChange={(e: any) => setSearch(e.target.value)}
              />
            ),
            admin: (
              <TableFilter
                search={searchAdmin}
                handleChange={(e: any) => setSearchAdmin(e.target.value)}
              />
            ),
          }[activeTab]
        }
      </div>
      {
        {
          app: (
            <div className="fadeIn">
              <DataTable
                totalCount={totalCount}
                columns={columns}
                sorting={sorting}
                sortingChanged={(updater: any) => {
                  setSorting(updater);
                }}
                data={flatData}
                isSearch={!!search}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </div>
          ),
          admin: (
            <div className="fadeIn">
              <DataTable
                totalCount={totalCountAdmin}
                columns={columns}
                sorting={sorting}
                sortingChanged={(updater: any) => {
                  setSorting(updater);
                }}
                data={flatDataAdmin}
                isSearch={!!searchAdmin}
                fetchNextPage={fetchAdminNextPage}
                isLoading={isAdminLoading}
                isFetching={isAdminFetching}
              />
            </div>
          ),
        }[activeTab]
      }
    </Card>
  );
};

export default RegisteredUsers;
