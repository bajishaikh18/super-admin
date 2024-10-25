"use client"

import { NotificationType, useNotificationStore } from '@/stores/useNotificationStore';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { DataTable } from '../common/table/DataTable';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { SelectOption } from '@/helpers/types';
import { getNotifications } from "@/apis/notification";



type NotificationResponse = {
  notifications: NotificationType[],
}


const Notification: React.FC = () => {
  
  
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search] = React.useState<string>("");





  const { data, isFetching, isLoading, isError, fetchNextPage } = useInfiniteQuery<
  NotificationResponse
  >({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0}) => {
      const notificationId = '66ebbce50469faf30a2bd364';
      const start = pageParam as number;
      const fetchedData = await getNotifications('_id', notificationId);
      return fetchedData;

    },
    retry: 3,
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnMount: true,
    placeholderData: keepPreviousData

  });

  

  const totalCount =  0;

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page: any) => page?.notifications) ?? [],
    [data]
  );

  const columnHelper = createColumnHelper<NotificationType>();

  const columns = useMemo( () => [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => info.renderValue() || "N/A",
    })

   ],[]
);


const {setShowCreateNotification} = useNotificationStore();




  return (
    <main className="main-section">
    <div className="page-block">
      <div className="page-title">
        <h3 className="section-heading">Notifications</h3>
        <div className="filter-container">
          <Button className="btn-img" onClick={()=>setShowCreateNotification(true)}>
            Create Notification
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

  )
}

export default Notification;

  
