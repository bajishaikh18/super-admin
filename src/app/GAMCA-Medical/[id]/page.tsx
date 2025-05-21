"use client";
import React, { useState } from "react";
import Image from "next/image";
import BackSvg from "../../../../public/Back.svg";

// Define types for the TableRow component props
interface TableRowProps {
  data: string[];
  bg?: string;
  border?: boolean;
  opacityArr?: number[];
  isHeader?: boolean;
  isLast?: boolean;
}

// Reusable TableRow component
const TableRow: React.FC<TableRowProps> = ({
  data,
  bg = "white",
  border = false,
  opacityArr = [],
  isHeader = false,
  isLast = false,
}) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 700);
    }
  };

  return (
    <div
      style={{
        alignSelf: "stretch",
        justifyContent: "space-between",
        alignItems: "center",
        display: "inline-flex",
      }}
    >
      {data.map((cell: string, idx: number) => (
        <div
          key={idx}
          style={{
            flex: "1 1 0",
            height: 54.74,
            paddingTop: 7.3,
            paddingBottom: 7.3,
            paddingLeft: 14.6,
            paddingRight: 7.3,
            background: bg,
            borderRight:
              border && idx !== data.length - 1
                ? "0.73px #363636 solid"
                : undefined,
            opacity: opacityArr[idx] ?? 1,
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
          {/* Show icon except for header */}
          {!isHeader && (
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
                style={{
                  opacity: opacityArr[idx] ?? 1,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: copiedIdx === idx ? "scale(1.3)" : "scale(1)",
                  filter:
                    copiedIdx === idx ? "drop-shadow(0 0 4px #246BFC)" : "none",
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
      ))}
    </div>
  );
};

const Page: React.FC = () => {
  // Table data arrays
  const locationHeader: string[] = [
    "Country",
    "City",
    "Country Traveling To",
    "Order ID",
    "Date",
    "Time",
    "Full Data",
  ];
  const locationRow: string[] = [
    "India",
    "Hyderabad",
    "Bahrain",
    "45456",
    "19-Mar-2025",
    "15:30",
    "View",
  ];
  const locationOpacity: number[] = [1, 1, 1, 0, 0, 0, 0];

  const candidateHeader: string[] = [
    "First Name",
    "Last Name",
    "Date of Birth",
    "Nationality",
    "Gender",
    "Marital status",
    "Full Data",
  ];
  const candidateRow: string[] = [
    "Khadar",
    "Shaik",
    "25-04-2002",
    "Indian",
    "Male",
    "Unmarried",
    "View",
  ];
  const candidateOpacity: number[] = [1, 1, 1, 1, 1, 1, 0];

  const docHeader: string[] = [
    "Passport number",
    "Passport Issue Place",
    "Passport Issue Date",
    "Passport Expiry Date",
    "Visa Type",
    "Email ID",
    "Phone No",
    "National ID",
    "Position applied for",
  ];
  const docRow: string[] = [
    "G121212",
    "Vijayawada",
    "25-04-2002",
    "25-04-2002",
    "Indian",
    "Khadar20@gmail.com",
    "8340816098",
    "454545454",
    "Engineer",
  ];

  return (
    <div
      style={{
        marginTop: "6rem",
        marginRight: "2rem",
        marginLeft: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          gap: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <Image src={BackSvg} alt="Back" width={32} height={32} />
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Medical Test Data : Khadar
          </h2>
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
            style={{
              width: 18,
              height: 18,
              accentColor: "#246BFC",
              margin: 0,
            }}
          />
          Completed
        </label>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        {/* Location Section */}
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
              }}
            >
              Location
            </div>
          </div>
        </div>
        <TableRow data={locationHeader} isHeader opacityArr={locationOpacity} />
        <TableRow
          data={locationRow}
          bg="#E2E2E2"
          border
          opacityArr={locationOpacity}
          isLast
        />

        {/* Candidate's Information Section */}
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
              }}
            >
              Candidate's information
            </div>
          </div>
        </div>
        <TableRow
          data={candidateHeader}
          isHeader
          opacityArr={candidateOpacity}
        />
        <TableRow
          data={candidateRow}
          bg="#E2E2E2"
          border
          opacityArr={candidateOpacity}
          isLast
        />

        {/* Documents and Contact Section */}
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
                whiteSpace: "nowrap", // Ensure text stays on one line
              }}
            >
              Documents and Contact
            </div>
          </div>
        </div>
        <TableRow data={docHeader} isHeader />
        <TableRow data={docRow} bg="#E2E2E2" border isLast />
      </div>
    </div>
  );
};

export default Page;
