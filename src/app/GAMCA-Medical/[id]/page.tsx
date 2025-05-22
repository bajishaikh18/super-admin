"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define types
interface TableRowProps {
  data: string[];
  bg?: string;
  border?: boolean;
  opacityArr?: number[];
  isHeader?: boolean;
  isLast?: boolean;
}

interface TableSection {
  title: string;
  header: string[];
  row: string[];
  opacity: number[];
}

// Reusable TableRow component with optimizations
const TableRow = React.memo<TableRowProps>(({
  data,
  bg = "white",
  border = false,
  opacityArr = [],
  isHeader = false,
  isLast = false,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = useCallback(async (text: string, idx: number) => {
    if (!text || typeof navigator === "undefined" || !navigator.clipboard) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 700);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, []);

  const rowStyle = useMemo(() => ({
    alignSelf: "stretch" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    display: "inline-flex" as const,
  }), []);

  return (
    <div style={rowStyle}>
      {data.map((cell: string, idx: number) => {
        const cellOpacity = opacityArr[idx] ?? 1;
        const shouldShowBorder = border && idx !== data.length - 1;
        
        return (
          <div
            key={`${cell}-${idx}`}
            style={{
              flex: "1 1 0",
              height: 54.74,
              paddingTop: 7.3,
              paddingBottom: 7.3,
              paddingLeft: 14.6,
              paddingRight: 7.3,
              background: bg,
              borderRight: shouldShowBorder ? "0.73px #363636 solid" : undefined,
              opacity: cellOpacity,
              justifyContent: isHeader ? "flex-start" : "space-between",
              alignItems: "center",
              gap: 7.3,
              display: "flex",
              position: "relative",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: isHeader ? "#757575" : "black",
                fontSize: 13.76,
                fontFamily: "Inter",
                fontWeight: isHeader ? "600" : "400",
                wordWrap: "break-word",
              }}
            >
              {cell}
            </div>
            
            {!isHeader && cellOpacity > 0 && (
              <span
                style={{
                  position: "absolute",
                  right: 7.3,
                  top: "50%",
                  display: "flex",
                  alignItems: "center",
                  transform: "translateY(-50%)",
                }}
              >
                <Image
                  src="/copy.svg"
                  alt="Copy"
                  width={19}
                  height={19}
                  priority={false}
                  style={{
                    opacity: cellOpacity,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    transform: copiedIdx === idx ? "scale(1.3)" : "scale(1)",
                    filter: copiedIdx === idx ? "drop-shadow(0 0 4px #246BFC)" : "none",
                  }}
                  onClick={() => handleCopy(String(cell), idx)}
                />
                {copiedIdx === idx && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      color: "#246BFC",
                      fontWeight: 500,
                      transition: "opacity 0.2s",
                      opacity: 1,
                    }}
                  >
                    Copied!
                  </span>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

TableRow.displayName = "TableRow";

// Section Header Component
const SectionHeader = React.memo<{ title: string }>(({ title }) => (
  <div
    style={{
      alignSelf: "stretch",
      background: "white",
      borderTopLeftRadius: 7.3,
      borderTopRightRadius: 7.3,
      borderBottom: "0.73px rgba(128.34, 127.05, 127.05, 0.50) solid",
      justifyContent: "flex-start",
      alignItems: "center",
      display: "inline-flex",
    }}
  >
    <div
      style={{
        width: 172.26,
        height: 54.74,
        paddingTop: 10.95,
        paddingBottom: 7.3,
        paddingLeft: 7.3,
        paddingRight: 7.3,
        background: "white",
        borderTopLeftRadius: 7.3,
        borderBottom: "3.65px var(--Primary, #246BFC) solid",
        justifyContent: "center",
        alignItems: "center",
        gap: 7.3,
        display: "flex",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "black",
          fontSize: 13.76,
          fontFamily: "Inter",
          fontWeight: "500",
          wordWrap: "break-word",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
    </div>
  </div>
));

SectionHeader.displayName = "SectionHeader";

// Table Section Component
const TableSection = React.memo<{ section: TableSection }>(({ section }) => (
  <>
    <SectionHeader title={section.title} />
    <TableRow data={section.header} isHeader opacityArr={section.opacity} />
    <TableRow
      data={section.row}
      bg="#E2E2E2"
      border
      opacityArr={section.opacity}
      isLast
    />
  </>
));

TableSection.displayName = "TableSection";

// Main Page Component
const MedicalTestDataPage: React.FC = () => {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  // Memoized table data
  const tableSections = useMemo<TableSection[]>(() => [
    {
      title: "Location",
      header: ["Country", "City", "Country Traveling To", "Order ID", "Date", "Time", "Full Data"],
      row: ["India", "Hyderabad", "Bahrain", "45456", "19-Mar-2025", "15:30", "View"],
      opacity: [1, 1, 1, 0, 0, 0, 0],
    },
    {
      title: "Candidate's information",
      header: ["First Name", "Last Name", "Date of Birth", "Nationality", "Gender", "Marital status", "Full Data"],
      row: ["Khadar", "Shaik", "25-04-2002", "Indian", "Male", "Unmarried", "View"],
      opacity: [1, 1, 1, 1, 1, 1, 0],
    },
    {
      title: "Documents and Contact",
      header: ["Passport number", "Passport Issue Place", "Passport Issue Date", "Passport Expiry Date", "Visa Type", "Email ID", "Phone No", "National ID", "Position applied for"],
      row: ["G121212", "Vijayawada", "25-04-2002", "25-04-2002", "Indian", "Khadar20@gmail.com", "8340816098", "454545454", "Engineer"],
      opacity: Array(9).fill(1),
    },
  ], []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCompletedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(e.target.checked);
  }, []);

  const containerStyle = useMemo(() => ({
    marginTop: "6rem",
    marginRight: "2rem",
    marginLeft: "2rem",
  }), []);

  const headerStyle = useMemo(() => ({
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
    justifyContent: "space-between",
  }), []);

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleBack}
            aria-label="Go back"
          >
            <Image 
              src="/Back.svg" 
              alt="Back" 
              width={32} 
              height={32}
              priority
            />
          </button>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Medical Test Data : Khadar
          </h1>
        </div>
        
        {/* Completed Checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            fontWeight: 500,
            gap: "0.5rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCompletedChange}
            style={{
              width: 18,
              height: 18,
              accentColor: "#246BFC",
              margin: 0,
            }}
            aria-label="Mark as completed"
          />
          Completed
        </label>
      </header>

      {/* Main Content */}
      <main
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        {tableSections.map((section, index) => (
          <TableSection key={`${section.title}-${index}`} section={section} />
        ))}
      </main>
    </div>
  );
};

export default MedicalTestDataPage;