"use client";

import React, { useState, useMemo } from "react";
import { AgencyType } from "@/stores/useAgencyStore";
import { Card } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { TableFilter } from "@/components/common/table/Filter";
import { createColumnHelper, SortingState } from "@tanstack/react-table";  
import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import Link from "next/link";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import { INDIAN_STATES } from "@/helpers/stateList";
import { useDebounce } from "@uidotdev/usehooks";
import { getAgencies } from "@/apis/agency";

import styles from "./Agency.module.scss";

// export type AgencyApiResponse ={
//     agencies: AgencyType[];
// }


const fetchSize = 100;


const Agencies: React.FC = () => {
  const [field, setField] = useState<SelectOption>({
    value: "name",
    label: "Agency Name",
  } as SelectOption);
  const [search, setSearch] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const debouncedSearchTerm = useDebounce(search, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isLoading, error } = useInfiniteQuery<
    AgencyType[]
  >({
    queryKey: ["agencies", "active", debouncedSearchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getAgencies(
        "status",
        "active",
        start,
        fetchSize,
        debouncedSearchTerm,
        field.value
      );
      return fetchedData;
    },
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => {
        return _lastGroup.length ? groups.length * fetchSize : undefined;
    },
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });

   const flatData = useMemo(() => {
    return data?.pages?.flatMap((page) => page) ?? [];
   }, [data]);

   const totalCount = flatData.length;

   const columnHelper = createColumnHelper<AgencyType>();

   const columns = useMemo(
    () => [

        columnHelper.accessor("_id", {
            header: "Agency#",
            cell: (info) => {
                <Link href={`/agency/${info.renderValue()}`}>{info.renderValue()}</Link>
            }
        }),

        columnHelper.accessor("name", {
            header: "Agency Name",
            cell: (info) => info.renderValue() || "N/A",

        }),

        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => {
                <Link 
                 href={`/agency/${info.row.renderValue("_id")}`}>
                    {info.renderValue() || "N/A"}
                </Link>
            }
        }),

        columnHelper.accessor("phone", {
            header: "Mobile",
            cell: (info) => info.renderValue() || "N/A",
        }),

        columnHelper.accessor("jobposts", {
            header: "Job Posts",
            cell: (info) => info.renderValue() || "N/A",
        }),

        columnHelper.accessor("address", {
            header: "Address",
            cell: (info) => info.renderValue() || "N/A",
        }),

        columnHelper.accessor("approved", {
            header: "MEA Approved",
            cell: (info) => info.renderValue(),
        }),

        columnHelper.accessor("createdAt", {
            header: "Created Date",
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
   ],
   []
)
  



  const handleCreateAgency = () => {
    console.log("Agency created successfully");
  };

  return (
      <Card>
        <main className="main-section">
          <div className="page-block">
            <div className="page-title">
              <h3 className={styles.sectionHeading}>Registered Agencies</h3>
              <div className={styles.filterSection}>
                <TableFilter
                  search={search}
                  field={field}
                  handleChange={(e) => setSearch(e)}
                  handleFilterChange={(newField) => setField(newField)}
                  columnsHeaders={columns}
                />

                <button
                  className={styles.createAgency}
                  onClick={handleCreateAgency}
                >
                  + Create Agency
                </button>
              </div>
            </div>
          </div>
        </main>

        <div className={"header-row"}>
          <div className={"tab-container"}>
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
          </div>
        </div>
      </Card>

  );
};

export default Agencies;
