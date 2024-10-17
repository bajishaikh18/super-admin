"use client";
import React, { useState, useMemo } from "react";
import { AgencyType } from "@/stores/useAgencyStore";
import { Button, Card } from "react-bootstrap";
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
import dataTableStyles from "../../components/common/table/DataTable.module.scss";

const fetchSize = 10;

type AgencyResponse = {
  agencies: AgencyType[],
  totalCount: number
}
const Agencies: React.FC = () => {
  const [field, setField] = useState<SelectOption>({
    value: "agencyId",
    label: "Agency Id",
  } as SelectOption);
  const [search, setSearch] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const debouncedSearchTerm = useDebounce(search, 300);

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
  AgencyResponse
  >({
    queryKey: ["agencies", search, field, debouncedSearchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getAgencies('active',start,fetchSize,field.value,search);
      return fetchedData;
    },
    retry: 3,
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page: any) => page?.agencies) ?? [],
    [data]
  );
  const totalCount = data?.pages?.[0]?.totalCount || 0;
  console.log(totalCount)
  const columnHelper = createColumnHelper<AgencyType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("agencyId", {
        header: "Agency#",
        cell: (info) => {
          return <Link href={`/agency/${info.renderValue()}`}>
            {info.renderValue()}
          </Link>;
        },
      }),
      columnHelper.accessor("name", {
        header: "Agency Name",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => {
          return  info.renderValue() || "N/A"
        },
      }),
      columnHelper.accessor("phone", {
        header: "Mobile",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("postedJobs", {
        header: "Job Posts",
        cell: (info) => info.renderValue()  || 0,
      }),
      columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("approved", {
        header: "MEA Approved",
        cell: (info) => info.renderValue() ? <span className="success">Approved</span> : "",
        meta: { filter: false },
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
      })
    ],
    []
  );
  const handleCreateAgency = () => {
    console.log("Agency created successfully");
  };
  return (
    <main className="main-section">
      <div className="page-block">
        <div className="page-title">
          <h3 className="section-heading">Registered Agencies</h3>
          <div className="filter-container">
            <TableFilter
              search={search}
              field={field}
              handleChange={(e) => setSearch(e)}
              handleFilterChange={(newField) => setField(newField)}
              columnsHeaders={columns}
            />
            <Button className="btn-img" onClick={handleCreateAgency}>
              + Create Agency
            </Button>
          </div>
        </div>
        <Card>
          <DataTable
            totalCount={totalCount}
            columns={columns}
            sorting={sorting}
            sortingChanged={(updater: any) => {
              setSorting(updater);
            }}
            data={flatData}
            tableHeight={"75vh"}
            isSearch={!!search}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </Card>
      </div>
    </main>
  );
};
export default Agencies;
