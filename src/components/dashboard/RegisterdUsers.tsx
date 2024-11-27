import React, { useState, useMemo, useCallback, useEffect } from "react";
import dataTableStyles from "../../components/common/table/DataTable.module.scss";
import { User } from "../../stores/useUserStore";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/common/table/DataTable";
import Link from "next/link";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getSummary, getUsers } from "@/apis/dashboard";
import { INDIAN_STATES } from "@/helpers/stateList";
import { downloadMedia } from "@/helpers/mediaDownload";

import { useDebounce } from "@uidotdev/usehooks";
import { TableFilter } from "../common/table/Filter";
import { DateTime } from "luxon";
import { SelectOption } from "@/helpers/types";
import { COUNTRIES, INDUSTRIES } from "@/helpers/constants";
import CreateUserForm from "../users/CreateUsers";
import { Button, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { GetCountries, GetState } from "react-country-state-city";
import { useSearchParams } from "next/navigation";

type RegisteredUsersProps = {
  showButton: boolean;
};

type TabType = "admin" | "app";

const columnHelper = createColumnHelper<User>();

const fetchSize = 100;

const RegisteredUsers: React.FC<RegisteredUsersProps> = ({ showButton }) => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get('type')
  const [activeTab, setActiveTab] = useState<TabType>((type as TabType) || "app");
  // const [countries, setCountries] = useState<any[] | null>(null);
  // const [states, setStates] = useState<any[] | null>(null);
 
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [sortingAdmin, setSortingAdmin] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState<string>("");
  const [searchAdmin, setSearchAdmin] = React.useState<string>("");
  const [field, setField] = React.useState<SelectOption>({
    value: "email",
    label: "Email",
  } as SelectOption);
  const [fieldAdmin, setFieldAdmin] = React.useState<SelectOption>({
    value: "email",
    label: "Email",
  } as SelectOption);
  const debouncedSearchTerm = useDebounce(search, 300);
  const debouncedSearchTermAdmin = useDebounce(searchAdmin, 300);


  const {
    data: countries
  } = useQuery({
    queryKey: ["countries"],
    queryFn: async ()=>{
      const countriesList = await GetCountries();
      const neededCountries = countriesList.filter((x:any)=>COUNTRIES[x.iso2.toLowerCase() as "bh"]);
      return neededCountries;
    },
    retry: 3,
  });


  const {
    data: states
  } = useQuery({
    queryKey: ["states", countries],
    queryFn: async ()=>{
      if(countries){
        const statesList = await Promise.all(countries.map(async (cty:any)=>{
          const statesOfCty = await GetState(cty.id);
          return {
           id: cty.id,
           states: statesOfCty
          }
         }));
        return statesList
      }
    },
    retry: 3,
  });

  
  // const getCountryAndStates = async ()=>{
  //   const countriesList = await GetCountries();
  //   const neededCountries = countriesList.filter((x:any)=>COUNTRIES[x.iso2.toLowerCase() as "bh"]);
  //   const statesList = await Promise.all(neededCountries.map(async (cty:any)=>{
  //    const statesOfCty = await GetState(cty.id);
  //    return {
  //     id: cty.id,
  //     states: statesOfCty
  //    }
  //   }));
  //   setStates(statesList);
  //   setCountries(countriesList)
  // }
  // useEffect(() => {
  //   getCountryAndStates();
  // }, []);


  const getStateName = useCallback(
    (country: string, state: string) => {
      if (!countries || !states || !country || !state) {
        return "N/A";
      }
      const userCountry =  countries.find((cty:any)=>cty.iso2 === country.toUpperCase());
      if(!userCountry){
         return state || "N/A"
      }
      const stateList = states.find((st: any) => st.id === userCountry.id);
      
      if(!stateList){
        return state || "N/A"
      }
      return stateList.states.find((st:any) => st.state_code === state)
      ?.name ||  state
    },[countries, states]);
    
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
          INDIAN_STATES.find((state) => state.state_code === info.renderValue())
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
        cell: (info) => INDUSTRIES[info.getValue() as "oil_gas"] || info.renderValue() || "N/A",
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
          classes:"f-7"
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
        meta: { filter: false,classes:'f-8' },
        header: "CV Availability",
      }),
      columnHelper.accessor("workVideo", {
        meta: { filter: false,classes:'f-7' },
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
        meta: { filterType: "date",classes:"f-7" },
      }),
      columnHelper.accessor("lastLoginDate", {
        header: "Last access",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date",classes:"f-7" },
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

  const adminColumns = useMemo(
    () => [
      columnHelper.accessor("adminUserId", {
        header: "User Id",
        cell: (info) => (
          <Link href={`/user/${info.row.getValue("adminUserId")}`}>
            {info.renderValue() || "N/A"}
          </Link>
        ),
        enableColumnFilter: true,
      }),
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: (info) => info.renderValue() || "N/A",
      }),
      columnHelper.accessor("email", {
        header: "Email Id",
        cell: (info) => (
          <Link href={`/user/${info.row.getValue("adminUserId")}`}>
            {info.renderValue() || "N/A"}
          </Link>
        ),
        meta: {
          classes: "px-10",
        },
      }),
      columnHelper.accessor("mobile", {
        header: "Mobile No",
        cell: (info) => info.renderValue() || "N/A",
      }),

      columnHelper.accessor("state", {
        header: "State",
        cell: (info) =>
          getStateName(info.row.original.country, info.getValue()),

        meta: {
          filterType: "select",
          selectOptions: INDIAN_STATES.map((val) => ({
            label: val.name,
            value: val.state_code,
          })),
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Added date",
        cell: (info) =>
          info.renderValue()
            ? DateTime.fromISO(info.renderValue()!).toFormat("dd MMM yyyy")
            : "N/A",
        meta: { filterType: "date" },
      }),
      columnHelper.accessor("lastLoginDate", {
        header: "Last access",
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
    [countries,states]
  );

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary", "dashboard"],
    queryFn: getSummary,
    retry: 3,
  });

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    User[]
  >({
    queryKey: ["users", "app", activeTab, debouncedSearchTerm, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getUsers(
        activeTab,
        start,
        fetchSize,
        debouncedSearchTerm,
        field.value
      );
      return fetchedData;
    },
    retry: 3,
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: adminData,
    fetchNextPage: fetchAdminNextPage,
    isFetching: isAdminFetching,
    isLoading: isAdminLoading,
  } = useInfiniteQuery<User[]>({
    queryKey: ["users", "admin", activeTab, debouncedSearchTermAdmin, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam as number;
      const fetchedData = await getUsers(
        activeTab,
        start,
        fetchSize,
        debouncedSearchTermAdmin,
        fieldAdmin.value
      );
      return fetchedData;
    },
    refetchInterval: 100000,
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = React.useMemo(
    () =>
      data?.pages?.flatMap((page: any) => page?.paginatedUsers?.users) ?? [],
    [data]
  );
  const totalCount = summaryData?.usersRegistered ?? 0;

  const flatDataAdmin = React.useMemo(
    () =>
      adminData?.pages?.flatMap((page: any) => page?.paginatedUsers?.users) ??
      [],
    [adminData]
  );
  const totalCountAdmin = summaryData?.adminCount ?? 0;

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCreateUserClick = () => {
    setShowCreateUser(true);
  };

  const handleCancelCreateUser = () => {
    setShowCreateUser(false);
  };

  return (
    <Card>
      <div className={"header-row"}>
        <div className={"tab-container"}>
          <button
            className={`tab-button ${activeTab === "app" ? "active" : ""}`}
            onClick={() => handleTabClick("app")}
          >
            App Users ({summaryData?.usersRegistered || 0})
          </button>
          <button
            className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => handleTabClick("admin")}
          >
            Admin Users ({summaryData?.adminCount || 0})
          </button>
        </div>

        {
          {
            app: (
              <TableFilter
                key={"app"}
                handleFilterChange={(e) => setField(e)}
                field={field}
                search={search}
                columnsHeaders={columns}
                handleChange={(val: any) => setSearch(val)}
              />
            ),
            admin: (
              <TableFilter
                key={"admin"}
                handleFilterChange={(e) => setFieldAdmin(e)}
                field={fieldAdmin}
                columnsHeaders={adminColumns}
                search={searchAdmin}
                handleChange={(val: any) => setSearchAdmin(val)}
              />
            ),
          }[activeTab]
        }
        {showButton && (
          <div className={dataTableStyles.buttonContainer}>
            <Button
              href="#"
              className="btn-img"
              onClick={handleCreateUserClick}
            >
              <FaPlus />
              Create Admin User
            </Button>
            <Modal show={showCreateUser} onHide={handleCancelCreateUser} centered backdrop="static">
              <CreateUserForm onCancel={handleCancelCreateUser} />
            </Modal>
          </div>
        )}
      </div>
      {
        {
          app: (
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
                tableHeight={showButton ? "75vh": undefined}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </div>
          ),
          admin: (
            <div className="fadeIn">
              <DataTable
                totalCount={totalCountAdmin}
                columns={adminColumns}
                sorting={sortingAdmin}
                sortingChanged={(updater: any) => {
                  setSortingAdmin(updater);
                }}
                data={flatDataAdmin}
                tableHeight={showButton ? "75vh": undefined}
                isSearch={!!searchAdmin}
                fetchNextPage={fetchAdminNextPage}
                isLoading={isAdminLoading}
                isFetching={isAdminFetching}
              />
            </div>
          ),
        }[activeTab]
      }
    </Card>
  );
};

export default RegisteredUsers;
