"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";

// Types
interface MedicalTest {
  id: number;
  name: string;
  email: string;
  contact: string;
  orderId: string;
  amount: string;
  date: string;
  time: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
}

interface TestTableProps {
  tests: MedicalTest[];
  searchTerm: string;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Constants
const ROWS_PER_PAGE = 20;
const CELL_STYLE = {
  border: "none",
  textAlign: "left" as const,
  height: "62px",
  paddingLeft: "1.5rem",
  backgroundColor: "inherit",
  verticalAlign: "middle" as const,
} as const;

const TABLE_HEADINGS = [
  "Name",
  "Email", 
  "Contact",
  "Order ID",
  "Amount",
  "Date",
  "Time",
  "Full Form",
] as const;

// Mock data - moved to top level to prevent recreation
const NEW_MEDICAL_TESTS: MedicalTest[] = [
  {
    id: 1,
    name: "Khadar",
    email: "Khadar20@gmail.com",
    contact: "8340816098",
    orderId: "45456",
    amount: "1200 /-",
    date: "25-04-2025",
    time: "16:48",
  },
  {
    id: 2,
    name: "Rafiq",
    email: "rafiq@gmail.com",
    contact: "9340816000",
    orderId: "45457",
    amount: "1400 /-",
    date: "25-04-2025",
    time: "17:00",
  },
  {
    id: 3,
    name: "Rafiq",
    email: "rafiq@gmail.com",
    contact: "9340816000",
    orderId: "45458",
    amount: "1400 /-",
    date: "25-04-2025",
    time: "17:00",
  },
  {
    id: 4,
    name: "Rafiq",
    email: "rafiq@gmail.com",
    contact: "9340816000",
    orderId: "45459",
    amount: "1400 /-",
    date: "25-04-2025",
    time: "17:00",
  },
  {
    id: 5,
    name: "Rafiq",
    email: "rafiq@gmail.com",
    contact: "9340816000",
    orderId: "45460",
    amount: "1400 /-",
    date: "25-04-2025",
    time: "17:00",
  },
];

const COMPLETED_MEDICAL_TESTS: MedicalTest[] = [
  {
    id: 101,
    name: "Ahmed",
    email: "ahmed@gmail.com",
    contact: "9123456780",
    orderId: "99999",
    amount: "1500 /-",
    date: "20-04-2025",
    time: "10:30",
  },
];

// Utility functions
const filterTests = (tests: MedicalTest[], searchTerm: string): MedicalTest[] => {
  if (!searchTerm.trim()) return tests;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return tests.filter(
    (test) =>
      test.name.toLowerCase().includes(lowercaseSearch) ||
      test.email.toLowerCase().includes(lowercaseSearch) ||
      test.contact.includes(searchTerm) ||
      test.orderId.includes(searchTerm)
  );
};

const paginateTests = (tests: MedicalTest[], page: number): MedicalTest[] => {
  const startIdx = (page - 1) * ROWS_PER_PAGE;
  return tests.slice(startIdx, startIdx + ROWS_PER_PAGE);
};

// Memoized Components
const TabButton = memo<TabButtonProps>(({ active, onClick, count, label }) => (
  <li className="nav-item">
    <button
      className={`nav-link py-3 px-5 ${
        active ? "fw-bold text-black" : "fw-medium text-secondary"
      }`}
      style={{
        border: "none",
        borderBottom: active ? "3px solid #0d6efd" : "none",
      }}
      onClick={onClick}
      type="button"
    >
      {label} ({count})
    </button>
  </li>
));

TabButton.displayName = "TabButton";

const SearchBar = memo<SearchBarProps>(({ searchTerm, onSearchChange, onClear }) => (
  <div className="position-relative" style={{ marginRight: "1rem" }}>
    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      style={{
        borderRadius: "6px",
        width: "240px",
        height: "36px",
        paddingLeft: "36px",
        paddingRight: "12px",
        fontSize: "0.875rem",
        border: "1px solid #d1d5db",
        lineHeight: "1.4",
        backgroundColor: "#ffffff",
      }}
    />
    <div
      className="position-absolute"
      style={{
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <Image
        src="/searchicon.svg"
        alt="Search"
        width={16}
        height={16}
        style={{ display: "block", opacity: 0.5 }}
      />
    </div>
    {searchTerm && (
      <button
        className="position-absolute"
        style={{
          right: "6px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#6C757D",
          padding: 0,
          lineHeight: 1,
          height: "18px",
          width: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "11px",
        }}
        onClick={onClear}
        tabIndex={-1}
        type="button"
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
  </div>
));

SearchBar.displayName = "SearchBar";

const Pagination = memo<PaginationProps>(({ currentPage, totalPages, onPageChange }) => (
  <div className="d-flex align-items-center" style={{ whiteSpace: "nowrap" }}>
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      style={{
        background: "none",
        border: "none",
        color: currentPage === 1 ? "#d1d5db" : "#6b7280",
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
        fontSize: "18px",
        padding: "4px 8px",
        minWidth: "24px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      type="button"
      aria-label="Previous page"
    >
      ‹
    </button>

    <span
      className="text-muted"
      style={{
        fontSize: "0.875rem",
        color: "#374151",
        fontWeight: "500",
        margin: "0 8px",
      }}
    >
      {totalPages === 0 ? 0 : currentPage} / {totalPages}
    </span>

    <button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages || totalPages === 0}
      style={{
        background: "none",
        border: "none",
        color:
          currentPage === totalPages || totalPages === 0
            ? "#d1d5db"
            : "#6b7280",
        cursor:
          currentPage === totalPages || totalPages === 0
            ? "not-allowed"
            : "pointer",
        fontSize: "18px",
        padding: "4px 8px",
        minWidth: "24px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      type="button"
      aria-label="Next page"
    >
      ›
    </button>
  </div>
));

Pagination.displayName = "Pagination";

const TestTableRow = memo<{ test: MedicalTest; index: number }>(({ test, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const backgroundColor = isHovered 
    ? "#d6e4f0" 
    : index % 2 === 0 
      ? "#F8F8F8" 
      : "#FFFFFF";

  return (
    <tr
      style={{
        backgroundColor,
        cursor: "pointer",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td style={CELL_STYLE}>{test.name}</td>
      <td style={CELL_STYLE}>{test.email}</td>
      <td style={CELL_STYLE}>{test.contact}</td>
      <td style={CELL_STYLE}>{test.orderId}</td>
      <td style={CELL_STYLE}>{test.amount}</td>
      <td style={CELL_STYLE}>{test.date}</td>
      <td style={CELL_STYLE}>{test.time}</td>
      <td style={CELL_STYLE}>
        <Link
          href={`/GAMCA-Medical/${test.id}`}
          className="text-primary text-decoration-none"
        >
          View
        </Link>
      </td>
    </tr>
  );
});

TestTableRow.displayName = "TestTableRow";

const TestTable = memo<TestTableProps>(({ tests, searchTerm }) => {
  if (tests.length === 0) {
    return (
      <div className="p-4 text-center text-muted">
        {searchTerm.trim() !== ""
          ? "No matching records found."
          : "No records found."}
      </div>
    );
  }

  return (
    <table
      className="table mb-0"
      style={{ borderCollapse: "separate", borderSpacing: "0", width: "100%" }}
    >
      <thead>
        <tr className="bg-white" style={{ borderBottom: "1px solid #e0e0e0" }}>
          {TABLE_HEADINGS.map((heading) => (
            <th
              key={heading}
              scope="col"
              className="text-secondary fw-semibold"
              style={{
                border: "none",
                height: "56px",
                textAlign: "left",
                paddingLeft: "1.5rem",
                fontWeight: 500,
                color: "#666",
              }}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tests.map((test, index) => (
          <TestTableRow key={test.id} test={test} index={index} />
        ))}
      </tbody>
    </table>
  );
});

TestTable.displayName = "TestTable";

// Main Component
const MedicalTestData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"new" | "completed">("new");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get base tests for active tab
  const baseTests = useMemo(() => {
    return activeTab === "new" ? NEW_MEDICAL_TESTS : COMPLETED_MEDICAL_TESTS;
  }, [activeTab]);

  // Filter tests based on search term
  const filteredTests = useMemo(() => {
    return filterTests(baseTests, searchTerm);
  }, [baseTests, searchTerm]);

  // Paginate filtered tests
  const paginatedTests = useMemo(() => {
    return paginateTests(filteredTests, currentPage);
  }, [filteredTests, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTests.length / ROWS_PER_PAGE);
  }, [filteredTests.length]);

  // Event handlers
  const handleTabChange = useCallback((tab: "new" | "completed") => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="container-fluid px-4" style={{ marginTop: "6rem" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          type="button"
          className="text-decoration-none d-flex align-items-center btn p-0 border-0 bg-transparent"
          onClick={handleBackClick}
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/back.svg"
            alt="Back"
            width={20}
            height={20}
            className="me-2"
          />
          <h5
            className="m-0 ms-1 fw-medium"
            style={{ color: "#212529" }}
          >
            Medical Test Data
          </h5>
        </button>
      </div>

      {/* Tabs with Search */}
      <div className="card border-0">
        <div className="card-header bg-white p-0 border-bottom d-flex justify-content-between align-items-center">
          <ul className="nav nav-tabs border-0">
            <TabButton
              active={activeTab === "new"}
              onClick={() => handleTabChange("new")}
              count={NEW_MEDICAL_TESTS.length}
              label="New"
            />
            <TabButton
              active={activeTab === "completed"}
              onClick={() => handleTabChange("completed")}
              count={COMPLETED_MEDICAL_TESTS.length}
              label="Completed"
            />
          </ul>

          {/* Search Bar and Pagination */}
          <div
            className="d-flex align-items-center me-3"
            style={{ height: "56px" }}
          >
            <div className="d-flex align-items-center">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onClear={handleSearchClear}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <TestTable tests={paginatedTests} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTestData;