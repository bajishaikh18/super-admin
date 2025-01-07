"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import useAgencyStore, {
  AgencyType,
  Trade,
  
} from "@/stores/useAgencyStore";
import styles from "../create-agency/CreateAgency.module.scss";
import { Button, Card, Modal } from "react-bootstrap";
import { SelectOption } from "@/helpers/types";
import { TableFilter } from "@/components/common/table/Filter";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import {
  useInfiniteQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
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
import { deleteTradeTestCenterAPI } from "@/apis/trade-test-center";
import { AiFillDelete } from "react-icons/ai";

import { BsPencilFill } from "react-icons/bs";
import CreateTradeCenter from "../create-agency/CreateTradeTestCenter";
import { IoClose } from "react-icons/io5";
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
    label: "Trade #",
  } as SelectOption);
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState<string>("");
  const [tradeSearch, setTradeSearch] = React.useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("agency");
  const [editId, setEditId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tradeSorting, tradeSetSorting] = React.useState<SortingState>([]);
  const [tradeTestCenter, setTradeTestCenter] = React.useState<Trade | null>(
    null
  );
  const [deleteId,setDeleteId] = useState('');
  const [showCreateTrade, setShowCreateTrade] = useState(false);
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

  const {
    data: tradeData,
    fetchNextPage: tradeFetchNextPage,
    isFetching: tradeIsFetching,
    isLoading: tradeIsLoading,
  } = useInfiniteQuery<TradeCenterResponse>({
    queryKey: [
      "testCenters",
      tradeSearch,
      tradeField,
      debouncedTradeSearchTerm,
    ],
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
    async () => {
      try {
        setDeleteLoading(true);
        await deleteTradeTestCenterAPI(deleteId);
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("testCenters");
          },
          refetchType: "all",
        });
        setDeleteId("");
        toast.success("TradeCenter deleted successfully");
      } catch  {
        toast.error("Error while deleting TradeCenter. Please try again");
      }
      setDeleteLoading(false);
    },
    [deleteId]
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
  useEffect(() => {
    if (editId) {
      const tc = tradeFlatData.find((x) => x._id === editId);
      setTradeTestCenter(tc);
    }
  }, [editId]);
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
          INDIAN_STATES.find(
            (state) => state.state_code === info.getValue()?.toUpperCase()
          )?.name ||
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
      columnHelper.accessor("_id", {
        header: "Action",
    
        cell: (info) => {
          const tradeId = info.getValue() || "";
          return (
            <div style={{ display: "flex", gap: "30px" }}>
              <BsPencilFill
                fontSize={16}
                color="#0045E6"
                style={{ cursor: "pointer" }}
                onClick={() => setEditId(tradeId)}
              />
              <AiFillDelete
                fontSize={20}
                style={{ cursor: "pointer" }}
                color="rgb(228, 77, 77)"
                onClick={() =>
                  setDeleteId(tradeId as string)
                }
              />
            </div>
          );
        },
        meta: { classes: "f-3", filter: false},
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
                  <>
                    {" "}
                    <TableFilter
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
                    <Modal
                      show={showCreateTrade}
                      onHide={() => setShowCreateTrade(false)}
                      centered
                      backdrop="static"
                    >
                      <CreateTradeCenter
                        handleModalClose={() => setShowCreateTrade(false)}
                      />
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
            show={!!editId}
            onHide={() => setEditId("")}
            centered
            backdrop="static"
          >
            {editId && tradeTestCenter && (
              <CreateTradeCenter
                handleModalClose={() => setEditId("")}
                tradeCenterDetails={tradeTestCenter}
              />
            )}
          </Modal>

         
        </Card>
        <Modal
            show={!!deleteId}
            onHide={() => setDeleteId('')}
            centered
            backdrop="static"
          >
                <div className={styles.modalContainer}>

            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>
                  Delete Trade Center
                </h2>

                <IoClose
                  className={styles.closeButton}
                  onClick={()=>setDeleteId('')}
                ></IoClose>
              </div>
              {
        deleteLoading ?  <div className={styles.popupContent}>
        <p className={styles.loadingContent}>
          Your trade test center is deleting please wait
        </p>
        <div className={styles.createSpinner}></div>
      </div>  : <div className={styles.deletePrompt}>
                <h3>Are you sure you want to delete trade test center?</h3>
                <p>This action is irreversible</p>
              </div>}
              
              <div className={styles.actions}>
                <Button             className={`action-buttons ${!deleteLoading ? "" : styles.disabled}`}
 onClick={deleteTradeTestCenter}>
                  Delete
                </Button>
              </div>
            </div>
            </div>
          </Modal>
      </div>
    </main>
  );
};
export default Agencies;
