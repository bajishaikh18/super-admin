"use client";
import React, { useState, useMemo } from "react";
import useAgencyStore, { AgencyType } from "@/stores/useAgencyStore";
import { Button, Card } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { TableFilter } from "@/components/common/table/Filter";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import {
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import Link from "next/link";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import { useDebounce } from "@uidotdev/usehooks";
import { getAgencies } from "@/apis/agency";
import Image from "next/image";
import { IMAGE_BASE_URL } from "@/helpers/constants";
import agencyStyles from "./Agency.module.scss";

const fetchSize = 100;

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
      const fetchedData = await getAgencies('all',start,fetchSize,field.value,search);
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
        meta: {
          classes: "f-3",
        },
      }),
      columnHelper.accessor("name", {
        header: "Agency Name",
        cell: (info) => {
          return <div className={agencyStyles.tableAgencyName}>
           <Image
              src={`${info.row.original.profilePic ? `${IMAGE_BASE_URL}/${info.row.original.profilePic}`: '/no_image.jpg'}`}
              width={24}
              height={24}
              alt="agency-logo"
            />
              {info.renderValue() || "N/A"}
          </div>
        }
       ,
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
        meta: {
          classes: "f-7",
        },
      }),
      columnHelper.accessor("postedJobs", {
        header: "Job Posts",
        cell: (info) => info.renderValue()  || 0,
        meta: {
          classes: "f-5",
        },
      }),
      columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("approved", {
        header: "MEA Approved",
        cell: (info) => info.renderValue() ? <span className="success">Approved</span> : "",
        meta: { filter: false,classes: "f-5"
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created Date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date",classes:'f-5' },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        meta: {
          classes: "capitalize f-4",
          filter: false,
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
  const {setShowCreateAgency} = useAgencyStore();

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
            <Button className="btn-img" onClick={()=>setShowCreateAgency(true)}>
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
