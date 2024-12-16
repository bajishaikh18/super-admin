"use client";
import React, { useState, useMemo,useCallback } from "react";
import useAgencyStore, { AgencyType,TradeType } from "@/stores/useAgencyStore";
import { Button, Card, Modal } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { TableFilter } from "@/components/common/table/Filter";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { QueryClient,useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";
import { DataTable } from "../common/table/DataTable";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { useDebounce } from "@uidotdev/usehooks";
import { getAgencies } from "@/apis/agency";
import Image from "next/image";
import { IMAGE_BASE_URL } from "@/helpers/constants";
import agencyStyles from "./Agency.module.scss";
import { getTradeTestCenters } from "@/apis/trade-test-center";
import { INDIAN_STATES } from "@/helpers/stateList";
import CreateTradeTestCenter from "../create-agency/CreateTradeTestCenter";
import CreateTradeScreen from "../create-agency/CreateTradeScreen";
import { deleteTradeTestCenterAPI } from "@/apis/trade-test-center";
const queryClient = new QueryClient();
const fetchSize = 100;



type AgencyResponse = {
  agencies: AgencyType[];
  totalCount: number;
  trade: any[];
};

type TradeCenterResponse = {
  pages: AgencyResponse[]; 
  totalCount: number;
  trade: string;
 
 
};

type TabType = "agency" | "trade";
const Agencies: React.FC = () => {
  const [field, setField] = useState<SelectOption>({
    value: "agencyId",
    label: "Agency Id",
  } as SelectOption);
  const [tradeField, setTradeField] = useState<SelectOption>({
    value: "tradeId",
    label: "Trade Test Center Id",
  } as SelectOption);
  const [search, setSearch] = React.useState<string>("");
  const [tradeSearch, setTradeSearch] = React.useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("agency");
  const [openEdit, setOpenEdit] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tradeSorting, tradeSetSorting] = React.useState<SortingState>([]);
  const [showCreateTrade,setShowCreateTrade] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 300);
  const debouncedTradeSearchTerm = useDebounce(tradeSearch, 300);

  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<AgencyResponse>({
      queryKey: ["agencies", search, field, debouncedSearchTerm],
      queryFn: async ({ pageParam = 0 }) => {
        const start = pageParam as number;
        const fetchedData = await getAgencies(
          "all",
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
    });

    const { data:tradeData, fetchNextPage:tradeFetchNextPage, isFetching:tradeIsFetching, isLoading:tradeIsLoading } =
    useInfiniteQuery<TradeCenterResponse>({
      queryKey: ["testCenters", tradeSearch, tradeField, debouncedTradeSearchTerm],
     queryFn: async ({ pageParam = 0 }) => {
        const start = pageParam as number;
        const fetchedData = await getTradeTestCenters(
          "all",
          start,
          fetchSize,
          tradeField.value,
          tradeSearch
          
        );
        return fetchedData;
      },
      retry: 3,
      initialPageParam: 0,
      staleTime: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnMount: true,
      placeholderData: keepPreviousData,
    }); 
   

    const deleteTradeTestCenter = useCallback(
      async (_id: string, data: { isDeleted: boolean }) => {
        try {
          await deleteTradeTestCenterAPI(_id, data);
          await queryClient.invalidateQueries({
            queryKey: ["testCenters"],
            refetchType: "all",
          });
          toast.success("TradeCenter deleted successfully");
        } catch (e) {
          toast.error("Error while deleting TradeCenter. Please try again");
        }
      },
      []
    );
    
    
 

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page: any) => page?.agencies) ?? [],
    [data]
  );

  const totalCount = data?.pages?.[0]?.totalCount || 0;

  const tradeFlatData = React.useMemo(
    () => tradeData?.pages?.flatMap((page: any) => page?.trades) ?? [],
    [tradeData]
  );

  const tradeTotalCount = tradeData?.pages?.[0]?.totalCount || 0;

  const columnHelper = createColumnHelper<AgencyType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("agencyId", {
        header: "Agency#",
        cell: (info) => {
          return (
            <Link href={`/agency/${info.renderValue()}`}>
              {info.renderValue()}
            </Link>
          );
        },
        meta: {
          classes: "f-3",
        },
      }),
      columnHelper.accessor("name", {
        header: "Agency Name",
        cell: (info) => {
          return (
            <div className={agencyStyles.tableAgencyName}>
              <Image
                src={`${
                  info.row.original.profilePic
                    ? `${IMAGE_BASE_URL}/${info.row.original.profilePic}`
                    : "/no_image.jpg"
                }`}
                width={24}
                height={24}
                alt="agency-logo"
              />
              {info.renderValue() || "N/A"}
            </div>
          );
        },
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => {
          return info.renderValue() || "N/A";
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
        cell: (info) => info.renderValue() || 0,
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
        cell: (info) =>
          info.renderValue() ? <span className="success">Approved</span> : "",
        meta: { filter: false, classes: "f-5" },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created Date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-5" },
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
      }),
    ],
    []
  );
  const tradeTestCenterColumn = useMemo(
  
    () => [
      columnHelper.accessor("tradeId", {
        header: "Trade #",
        cell: (info) => {
          return info.renderValue();
        },
        meta: {
          classes: "f-3",
        },
      }),
      columnHelper.accessor("name", {
        header: "Trade Test Center Name",
        cell: (info) => {
          return (
            <div className={agencyStyles.tableAgencyName}>
              {info.renderValue() || "N/A"}
            </div>
          );
        },
      }),
     

      columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: (info) =>
          INDIAN_STATES.find((state) => state.state_code === info.getValue()?.toUpperCase())
            ?.name ||
          info.renderValue() ||
          "N/A",
        meta: {
          classes: "f-4",
          filterType: "select",
          selectOptions: INDIAN_STATES.map((val) => ({
            label: val.name,
            value: val.state_code,
          })),
        },
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: (info) => info.renderValue(),
        meta: { classes: "f-5" },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created Date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date", classes: "f-5" },
      }),
      columnHelper.display({
        id: "edit",
        header: "Edit",
        cell: (info) => {
          const tradeId = info.row.original.tradeId || ""; 
          return (
            <span
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setOpenEdit(true)}
                  >
              Edit
            </span>
          );
        },
        meta: { classes: "f-3" },
      }),

      columnHelper.display({
        id: "delete",
        header: "Delete",
        cell: (info) => {
          const tradeId = info.row.original.tradeId; 
      
          return (
            <span
              style={{ color: "red", cursor: "pointer", textDecoration: "underline" }}
              onClick={() =>
                deleteTradeTestCenter(tradeId as string, { isDeleted: true })

              }
            >
              Delete
            </span>
          );
        },
        meta: { classes: "f-3" },
      }),
      
      
      
    ],
    []
  );

  
  const { setShowCreateAgency } = useAgencyStore();
  const handleTabClick = (tab: TabType) => {
  setActiveTab(tab);
};

  return (
    <main className="main-section">
      <div className="page-block">
        <div className="page-title">
          <h3 className="section-heading">Registered Agencies</h3>
          <div className="filter-container">
            {
              {
                agency: (
                  <> <TableFilter
                  search={search}
                  field={field}
                  handleChange={(e) => setSearch(e)}
                  handleFilterChange={(newField) => setField(newField)}
                  columnsHeaders={columns}
                />
                      <Button
              className="btn-img"
              onClick={() => setShowCreateAgency(true)}
            >
              + Create Agency
            </Button>
                  </>
                 
                ),
                trade: (
                  <>
                  <TableFilter
                    search={tradeSearch}
                    field={tradeField}
                    handleChange={(e) => setTradeSearch(e)}
                    handleFilterChange={(newField) => setTradeField(newField)}
                    columnsHeaders={tradeTestCenterColumn}
                  />
                   <Button
              className="btn-img"
              onClick={() => setShowCreateTrade(true)}
            >
              + Create Trade Test Center
            </Button>
            <Modal show={showCreateTrade} onHide={()=>setShowCreateTrade(false)} centered backdrop="static">
              <CreateTradeTestCenter handleModalClose={()=>setShowCreateTrade(false)} />
            </Modal>
                  </>
                ),
              }[activeTab]
            }

          
          </div>
        </div>
        <Card>
          <div className={"header-row"}>
            <div className={"tab-container"}>
              <button
                className={`tab-button ${
                  activeTab === "agency" ? "active" : ""
                }`}
                onClick={() => handleTabClick("agency")}
              >
                Agencies ({totalCount || 0})
              </button>
              <button
                className={`tab-button ${
                  activeTab === "trade" ? "active" : ""
                }`}
                onClick={() => handleTabClick("trade")}
              >
                Trade Test Centers ({tradeTotalCount || 0})
              </button>
            </div>
          </div>
          {
            {
              agency: (
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
              ),
              trade: (
                <DataTable
                  totalCount={tradeTotalCount}
                  columns={tradeTestCenterColumn}
                  sorting={tradeSorting}
                  sortingChanged={(updater: any) => {
                    tradeSetSorting(updater);
                  }}
                  data={tradeFlatData}
                  tableHeight={"75vh"}
                  isSearch={!!tradeSearch}
                  fetchNextPage={tradeFetchNextPage}
                  isLoading={tradeIsLoading}
                  isFetching={tradeIsFetching}
                />
              ),
            }[activeTab]
          }
            <Modal
        show={openEdit}
        onHide={() => setOpenEdit(false)}
        centered
        backdrop="static"
      >
         {openEdit && (
          <CreateTradeScreen
          handleClose={() => setOpenEdit(false)}
            tradeCenterDetails={tradeFlatData}
          />
        )}
      </Modal>

        </Card>
      </div>
    </main>
  );

};
export default Agencies;
