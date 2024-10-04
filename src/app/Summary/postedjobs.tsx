'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import styles from "../../app/dashboard/Dashboard.module.scss";
import dataTableStyles from "../../components/common/DataTable.module.scss";
import { useUserStore } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData, PersonApiResponse } from "./makeData";
import { Card } from "react-bootstrap";
import ViewImage from "./viewimage";

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

const PostedJobs: React.FC<PostedJobsProps> = ({ onViewImageToggle }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const { fetchUsers } = useUserStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [detailedView, setDetailedView] = useState<Person | null>(null);
  const router = useRouter(); 
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<PersonApiResponse>({
      queryKey: ["people", sorting, activeTab],
      queryFn: async ({ pageParam = 0 }) => {
        const start = (pageParam as number) * fetchSize;
        const fetchedData = await fetchData(start, fetchSize, sorting);
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

  const handleMediaClick = (job: Person) => {
    router.push(`/${job.jobId}`); 
  };

  const closeDetailedView = () => {
    setDetailedView(null);
    onViewImageToggle(false); 
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
        <span
          className={dataTableStyles.normalLink}
          onClick={() => handleMediaClick(info.row.original)}
          style={{ cursor: "pointer" }}
        >
          View Image
        </span>
      ),
      header: "Media",
    }),
    columnHelper.accessor("postedDate", {
      header: "Posted Date",
    }),
    columnHelper.accessor('expiry', {
      header: 'Expiry',
    }),
  ];

  const fetchSize = 50;

  return (
    <section className={styles.registeredUsers}>
      <Card className={styles.card}>
        {!detailedView ? (
          <>
            <div className={styles.headerRow}>
              <div className={styles.tabContainer}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Active" ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick("Active")}
                >
                  Active ({12415})
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Pending" ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick("Pending")}
                >
                  Pending ({21})
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Expired" ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick("Expired")}
                >
                  Expired ({241})
                </button>
              </div>
            </div>
            {
              {
                Active: (
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
                Expired: (
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
                Pending: <div className="fadeIn"></div>,
              }[activeTab]
            }
          </>
        ) : (
          <ViewImage
            media={detailedView.media}
            postedDate={detailedView.postedDate}
            expiry={detailedView.expiry}
            agencyName={detailedView.agencyName}
            location={detailedView.location}
            noOfPositions={detailedView.noOfPositions}
            onClose={closeDetailedView}
          />
        )}
      </Card>
    </section>
  );
};

export default PostedJobs;
