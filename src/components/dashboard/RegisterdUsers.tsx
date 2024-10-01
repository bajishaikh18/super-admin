import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../app/dashboard/Dashboard.module.scss";
import dataTableStyles from "../../components/common/DataTable.module.scss";
import { User, useUserStore } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import Link from "next/link";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "react-bootstrap";
import { getUsers } from "@/apis/dashboard";
import { INDIAN_STATES } from "@/helpers/stateList";

type TabType = "Admin" | "App";



const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("firstName", {
    header: () => "User Name",
    cell: (info) => (
      <Link href={`/user/${info.renderValue()}`}>{info.renderValue()}</Link>
    ),
  }),
  columnHelper.accessor("phone", {
    header: () => "Mobile No",
    cell: (info) => info.renderValue() || "N/A"
  }),
  columnHelper.accessor("email", {
    header: () => "Email Id",
    cell: (info) => info.renderValue() || "N/A"
  }),
  columnHelper.accessor("state", {
    header: () => "State",
    cell: (info) => INDIAN_STATES.find(state=>state.state_code===info.renderValue())?.name || info.renderValue(),
  }),
  columnHelper.accessor("currentJobTitle", {
    header: "Job title",
    cell: (info) => info.renderValue() || "N/A"
  }),
  columnHelper.accessor("industry", {
    header: "Industry",
        cell: (info) => info.renderValue() || "N/A"
  }),
  columnHelper.accessor("totalExperience", {
    header: "Experience",
    cell: (info) => info.renderValue() ? `${info.renderValue()} Years`:"N/A"

  }),
  columnHelper.accessor("gulfExperience", {
    header: "Gulf Exp.",
    cell: (info) =>  info.renderValue() === true ? "Yes" : "No" 
  }),
  columnHelper.accessor("resume", {
    cell: (info) => (
       
            (info.getValue()) ? <Link
            href={`/jobs/${info.getValue()}`}
            className={dataTableStyles.normalLink}
          >
            View Resume
          </Link> : "N/A"
    ),
    header: "CV Availability",
  }),
  columnHelper.accessor("workVideo", {
    cell: (info) => (
       
            (info.getValue()) ? <Link
            href={`/jobs/${info.getValue()}`}
            className={dataTableStyles.normalLink}
          >
            View Video
          </Link> : "N/A"
    ),
    header: "Work Video",
  }),
  columnHelper.accessor("createdAt", {
    header: "Regd. date",
    cell: (info) => info.renderValue() || "N/A"
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.renderValue() || "N/A"
  }),
];

const fetchSize = 50;

const RegisteredUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("App");
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<User[]>({
      queryKey: [
        "people",
        sorting, //refetch when sorting changes
        activeTab,
      ],
      queryFn: async ({ pageParam = 0}) => {
        const start = pageParam as number;
        const fetchedData = await getUsers(start, fetchSize); //pretend api call
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
//   const {
//     data: expiredData,
//     fetchNextPage: fetchNextPageExpired,
//     isFetching: isFetchingExpired,
//     isLoading: isLoadingExpired,
//   } = useInfiniteQuery<any>({
//     queryKey: [
//       "people",
//       sorting, //refetch when sorting changes
//     ],
//     queryFn: async ({ pageParam = 0 }) => {
//       const start = (pageParam as number) * fetchSize;
//       const fetchedData = await fetchUsers(start, fetchSize, sorting); //pretend api call
//       return fetchedData;
//     },
//     initialPageParam: 0,
//     getNextPageParam: (_lastGroup, groups) => groups.length,
//     refetchOnWindowFocus: false,
//     placeholderData: keepPreviousData,
//   });

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <section className={styles.registeredUsers}>
      <Card className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "App" ? styles.active : ""
              }`}
              onClick={() => handleTabClick("App")}
            >
              App Users ({12415})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "Admin" ? styles.active : ""
              }`}
              onClick={() => handleTabClick("Admin")}
            >
              Admin Users ({21})
            </button>
          </div>
        </div>
        {
          {
            App: (
                <div className="fadeIn">
              <DataTable
                columns={columns}
                sorting={sorting}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={data}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isFetching={isFetching}
              />
              </div>
            ),
            Admin: (
                <div className="fadeIn">

              {/* <DataTable
                columns={columns}
                sorting={sorting}
                sortingChanged={(updater: any) => setSorting(updater)}
                data={expiredData}
                fetchNextPage={fetchNextPageExpired}
                isLoading={isLoadingExpired}
                isFetching={isFetchingExpired}
              /> */}
              </div>
            )
          }[activeTab]
        }
      </Card>
    </section>
  );
};

export default RegisteredUsers;
