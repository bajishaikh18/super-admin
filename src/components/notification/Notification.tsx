"use client";

import {
  NotificationType,
 
} from "@/stores/useNotificationStore";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { DataTable } from "../common/table/DataTable";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { SelectOption } from "@/helpers/types";
import { getNotifications } from "@/apis/notification";
import { DateTime } from "luxon";
import { TableFilter } from "../common/table/Filter";
import CreateNotification from "../create-notification/CreateNotification";
import { FaPlus } from "react-icons/fa6";
import { ROLE } from "@/helpers/constants";
import { useAuthUserStore } from "@/stores/useAuthUserStore";

const fetchSize = 10;

const Notification: React.FC = () => {
  const { role } = useAuthUserStore();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");
  const [showCreate, setShowCreate] = React.useState<boolean>(false);
  const [field, setField] = useState<SelectOption>({
    value: "title",
    label: "Title",
  } as SelectOption);

  const { data, isFetching, isLoading,  fetchNextPage } =
    useInfiniteQuery<{ notifications: NotificationType[]; totalCount: number }>(
      {
        queryKey: ["notifications", search, field],
        queryFn: async ({ pageParam = 0 }) => {
          const start = pageParam as number;
          const fetchedData = await getNotifications(
            start,
            fetchSize,
            field.value,
            search
          );
          return fetchedData;
        },
        retry: 3,
        initialPageParam: 0,
        staleTime: 0,
        getNextPageParam: (_lastGroup, groups) => groups.length,
        refetchOnMount: true,
        placeholderData: keepPreviousData,
      }
    );

  const totalCount = data?.pages?.[0]?.totalCount || 0;
  console.log("Total", totalCount);
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page: any) => page.notifications) ?? [],
    [data]
  );

  const columnHelper = createColumnHelper<NotificationType>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("target", {
        header: "Target",
        cell: (info) =>
          info.getValue()?.length > 0 ? info.getValue().join(",") : "N/A",
        meta: {
          classes: "capitalize"
        }
      }),
      columnHelper.accessor("createdAt", {
        header: "Created Date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-5" },
      }),
    ],
    []
  );



  return (
    <>
      <main className="main-section">
        <div className="page-block">
          <div className="page-title">
            <h3 className="section-heading">Notifications ({totalCount})</h3>
            <div className="filter-container">
              <TableFilter
                search={search}
                field={field}
                handleChange={(e) => setSearch(e)}
                handleFilterChange={(newField) => setField(newField)}
                columnsHeaders={columns}
              />
              {role && [ROLE.admin, ROLE.superAdmin].includes(role) && (
                <Button className="btn-img" onClick={() => setShowCreate(true)}>
                  <FaPlus />
                  Create Notification
                </Button>
              )}
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
      <Modal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        centered
        backdrop="static"
      >
        {showCreate && (
          <CreateNotification handleModalClose={() => setShowCreate(false)} />
        )}
      </Modal>
    </>
  );
};

export default Notification;
