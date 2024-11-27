import React, { useState, useMemo, useCallback, useEffect } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { User } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { INDIAN_STATES } from "@/helpers/stateList";
import { downloadMedia } from "@/helpers/mediaDownload";

import { useDebounce } from "@uidotdev/usehooks";
import { TableFilter } from "../common/table/Filter";
import { DateTime } from "luxon";
import { SelectOption } from "@/helpers/types";
import { INDUSTRIES } from "@/helpers/constants";
import { useParams, useSearchParams } from "next/navigation";
import { getUsersBasedOnType } from "@/apis/user";


type TabType = "admin" | "app";

const columnHelper = createColumnHelper<User>();

const fetchSize = 100;

const AppliedOrSavedUsers = ({pageType}:{pageType:"applied" | "saved"}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");
  const [field, setField] = React.useState<SelectOption>({
    value: "email",
    label: "Email",
  } as SelectOption);
  const searchParams = useSearchParams()
  const {id} = useParams();
  const type = searchParams.get("type");
  const debouncedSearchTerm = useDebounce(search, 300);
  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: " Name",
        cell: (info) => info.renderValue() || "N/A",
        enableColumnFilter: true,
      }),
      columnHelper.accessor("phone", {
        header: "Mobile No",
        cell: (info) => (
          info.renderValue()
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email Id",
        cell: (info) => (
          <OverlayTrigger
            overlay={
              <Tooltip id="button-tooltip-2">Check out this avatar</Tooltip>
            }
          >
            <>{info.renderValue() || "N/A"}</>
          </OverlayTrigger>
        ),
        meta: {
          classes: "px-10",
        },
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: (info) =>
          INDIAN_STATES.find((state) => state.state_code === info.getValue()?.toUpperCase())
            ?.name ||
          info.renderValue() ||
          "N/A",
        meta: {
          filterType: "select",
          selectOptions: INDIAN_STATES.map((val) => ({
            label: val.name,
            value: val.state_code,
          })),
        },
      }),
      columnHelper.accessor("currentJobTitle", {
        header: "Job title",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("industry", {
        header: "Industry",
        cell: (info) =>INDUSTRIES[info.getValue() as "oil_gas"] || info.renderValue() || "N/A",
        meta: {
          classes: "capitalize f-9",
          filterType: "select",
          selectOptions: Object.entries(INDUSTRIES).map(([value, label]) => ({
            value: value,
            label: label,
          })),
        },
      }),
      columnHelper.accessor("totalExperience", {
        header: "Experience",
        meta: {
          filterType: "number",
          classes: "f-7",
        },
        cell: (info) =>
          info.renderValue() ? `${info.renderValue()} Years` : "N/A",
      }),
      columnHelper.accessor("gulfExperience", {
        header: "Gulf Exp.",
        meta: {
          classes: "capitalize f-6",
          filterType: "select",
          selectOptions: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
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
        meta: { filter: false, classes: "f-8" },
        header: "CV Availability",
      }),
      columnHelper.accessor("workVideo", {
        meta: { filter: false, classes: "f-7" },
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
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-7" },
      }),
      columnHelper.accessor("lastLoginDate", {
        header: "Last access",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-7" },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        meta: {
          classes: "capitalize f-7",
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
  );

  const pageTitle = pageType == "applied" ? "Applied users" : "Saved users";
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
   {
    users: User[],
    total:number,
   }
  >({
    queryKey: ["users", type, debouncedSearchTerm, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getUsersBasedOnType(
        pageType,
        id as string,
        type!,
        start,
        fetchSize,
        field.value,
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

  const flatData = React.useMemo(
    () =>
      data?.pages?.flatMap((page: any) => page?.users) ?? [],
    [data]
  );
  const totalCount = data?.pages[0].total || 0;

  return (
    <main className="main-section">
      <div className="page-block">
        <div className="page-title">
          <h3 className="section-heading">{pageTitle}</h3>
          <div className="filter-container">
            <TableFilter
              search={search}
              field={field}
              handleChange={(e) => setSearch(e)}
              handleFilterChange={(newField) => setField(newField)}
              columnsHeaders={columns}
            />
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

export default AppliedOrSavedUsers;
