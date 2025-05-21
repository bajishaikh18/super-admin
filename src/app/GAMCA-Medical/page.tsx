"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define types for test data
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

// Define component prop types
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
}

interface TestTableProps {
  activeTests: MedicalTest[];
}

const MedicalTestData = () => {
  // Typed the state with explicit string union type
  const [activeTab, setActiveTab] = useState<"new" | "completed">("new");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTests, setFilteredTests] = useState<MedicalTest[]>([]);

  // Use useMemo to get the base set of tests depending on active tab
  const baseTests = useMemo(() => {
    return activeTab === "new" ? newMedicalTests : completedMedicalTests;
  }, [activeTab]);

  // Filter tests based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTests(baseTests);
    } else {
      const filtered = baseTests.filter(
        (test) =>
          test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.contact.includes(searchTerm) ||
          test.orderId.includes(searchTerm)
      );
      setFilteredTests(filtered);
    }
  }, [searchTerm, baseTests]);

  return (
    <div className="container-fluid px-4" style={{ marginTop: "6rem" }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          type="button"
          className="text-decoration-none d-flex align-items-center btn p-0 border-0 bg-transparent"
          onClick={() => window.history.back()}
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
            style={{ color: "#212529" }} // or any specific color you want
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
              onClick={() => setActiveTab("new")}
              count={newMedicalTests.length}
              label="New"
            />
            <TabButton
              active={activeTab === "completed"}
              onClick={() => setActiveTab("completed")}
              count={completedMedicalTests.length}
              label="Completed"
            />
          </ul>

          {/* Search Bar */}
          <div className="d-flex align-items-center me-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "6px",
                  width: "180px",
                  height: "38px",
                  paddingLeft: "32px", // increased left padding for icon
                  paddingRight: "28px",
                }}
              />
              <div
                className="position-absolute"
                style={{
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Image
                  src="/searchicon.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  style={{ display: "block" }}
                />
              </div>
              {searchTerm && (
                <button
                  className="position-absolute"
                  style={{
                    right: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6C757D",
                    padding: 0,
                    lineHeight: 1,
                    height: "24px",
                    width: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setSearchTerm("")}
                  tabIndex={-1}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            {filteredTests.length === 0 ? (
              <div className="p-4 text-center text-muted">
                {searchTerm.trim() !== ""
                  ? "No matching records found."
                  : "No records found."}
              </div>
            ) : (
              <TestTable activeTests={filteredTests} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted reusable component for tab buttons with proper type definitions
const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  count,
  label,
}) => (
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
    >
      {label} ({count})
    </button>
  </li>
);

// Extracted table component for better readability with proper type definitions
const TestTable: React.FC<TestTableProps> = ({ activeTests }) => {
  const tableHeadings = [
    "Name",
    "Email",
    "Contact",
    "Order ID",
    "Amount",
    "Date",
    "Time",
    "Full Form",
  ];

  return (
    <table
      className="table mb-0"
      style={{ borderCollapse: "separate", borderSpacing: "0", width: "100%" }}
    >
      <thead>
        <tr className="bg-white" style={{ borderBottom: "1px solid #e0e0e0" }}>
          {tableHeadings.map((heading) => (
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
        {activeTests.map((test: MedicalTest, index: number) => (
          <tr
            key={`${test.id}-${index}`}
            style={{
              backgroundColor: index % 2 === 0 ? "#F8F8F8" : "#FFFFFF",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d6e4f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                index % 2 === 0 ? "#F8F8F8" : "#FFFFFF")
            }
          >
            <td style={cellStyle}>{test.name}</td>
            <td style={cellStyle}>{test.email}</td>
            <td style={cellStyle}>{test.contact}</td>
            <td style={cellStyle}>{test.orderId}</td>
            <td style={cellStyle}>{test.amount}</td>
            <td style={cellStyle}>{test.date}</td>
            <td style={cellStyle}>{test.time}</td>
            <td style={cellStyle}>
              <Link
                href={`/GAMCA-Medical/${test.id}`}
                className="text-primary text-decoration-none"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Define cell style outside the component
const cellStyle = {
  border: "none",
  textAlign: "left" as const,
  height: "62px",
  paddingLeft: "1.5rem",
  backgroundColor: "inherit",
  verticalAlign: "middle" as const,
};

// Moved outside the component to prevent recreation on every render
const newMedicalTests: MedicalTest[] = [
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
  // Removed duplicate entries to reduce code size
  // You can keep all your original entries but I've trimmed them for brevity
];

const completedMedicalTests: MedicalTest[] = [
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

export default MedicalTestData;
