"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar, Nav, NavDropdown, Modal } from "react-bootstrap";
import styles from "./Header.module.scss";
import Image from "next/image";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import CreateJob from "@/components/create-job/CreateJob";
import Link from "next/link";
import { AuthHeader } from "./AuthHeader";
import usePostJobStore from "@/stores/usePostJobStore";
import usePostWalkinStore from "@/stores/usePostWalkinStore";
import CreateAgency from "@/components/create-agency/CreateAgency";
import useAgencyStore from "@/stores/useAgencyStore";
import { getTokenClaims } from "@/helpers/jwt";
import { ROLE } from "@/helpers/constants";

interface HeaderProps {}
const HIDEPATHS = ["/login", "/reset-password"];

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setShowPostJob, showPostJob } = usePostJobStore();
  const { setShowCreateAgency, showCreateAgency } = useAgencyStore();
  const { authUser, setAuthUser, role, setRole } = useAuthUserStore();

  const handleModalClose = () => {
    setShowPostJob(false);
    setShowCreateAgency(false);
  };

  if (!role) {
    const tokenDetails = getTokenClaims();
    if (tokenDetails) {
      setRole((tokenDetails as any).role);
    }
  }

  const shouldVisible = useCallback(
    (allowedRoles: number[]) => {
      return role && allowedRoles.includes(role);
    },
    [role]
  );

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    router.push("/login");
  };

  if (HIDEPATHS.includes(pathname)) {
    return <AuthHeader />;
  }

  return (
    <>
      <Navbar className={styles.header} expand="lg" fixed={"top"}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.png"
            className={styles.logo}
            alt="Logo"
            width={136}
            height={27}
          />
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.navContainer}>
            {role === ROLE.superAdmin && (
              <Link
                className={`${styles.navListItem} ${
                  pathname == "/" ? styles.active : ""
                } `}
                href="/"
              >
                Dashboard
              </Link>
            )}
            {shouldVisible([ROLE.superAdmin, ROLE.admin, ROLE.employer]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname == "/posted-jobs" ? styles.active : ""
                }`}
                href="/posted-jobs"
              >
                Posted Jobs
              </Link>
            )}

              {shouldVisible([ROLE.superAdmin, ROLE.admin, ROLE.employer]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname == "/posted-jobs" ? styles.active : ""
                }`}
                href="/posted-jobs"
              >
                Walkins
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin, ROLE.admin]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname == "/agency" ? styles.active : ""
                }`}
                href="/agency"
              >
                Agencies
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname == "/users" ? styles.active : ""
                }`}
                href="/users"
              >
                Users
              </Link>
            )}
            {shouldVisible([ROLE.admin, ROLE.superAdmin]) && (
              <Link className={styles.navListItem} href="#employers">
                Employers
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin, ROLE.admin]) && (
              <NavDropdown
                title="Reports"
                className={`${styles.navListItem} nav-list-item`}
              >
                <NavDropdown.Item
                  href="#action/3.1"
                  className={styles.navListItem}
                >
                  Report Item
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.2"
                  className={styles.navListItem}
                >
                  Report Item
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav className={styles.rightNavItems}>
            <Nav.Link onClick={() => {}} className={styles.faBell}>
              <Image src="/bell.png" alt="bell" width={16} height={19} />
            </Nav.Link>
            <Nav.Link
              onClick={() => setShowPostJob(true)}
              className={`${styles.postJob} d-flex align-items-center gap-2`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 8H14C14.1326 8 14.2598 8.05268 14.3536 8.14645C14.4473 8.24021 14.5 8.36739 14.5 8.5V12.5C14.5 12.6326 14.4473 12.7598 14.3536 12.8536C14.2598 12.9473 14.1326 13 14 13H2C1.86739 13 1.74021 12.9473 1.64645 12.8536C1.55268 12.7598 1.5 12.6326 1.5 12.5V8.5C1.5 8.36739 1.55268 8.24021 1.64645 8.14645C1.74021 8.05268 1.86739 8 2 8H5"
                  stroke="#0045E6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 8V1.5"
                  stroke="#0045E6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 4.5L8 1.5L11 4.5"
                  stroke="#0045E6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.75 11.25C12.1642 11.25 12.5 10.9142 12.5 10.5C12.5 10.0858 12.1642 9.75 11.75 9.75C11.3358 9.75 11 10.0858 11 10.5C11 10.9142 11.3358 11.25 11.75 11.25Z"
                  fill="#0045E6"
                />
              </svg>
              Post Job
            </Nav.Link>

            {authUser && authUser.firstName && authUser.lastName && (
              <NavDropdown
                className="nav-list-item"
                title={
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={styles.superAdmin}
                    >{`${authUser?.firstName} ${authUser?.lastName}`}</span>
                  </span>
                }
                id="super-admin-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#my-account">
                  My Account
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Modal
        show={showPostJob}
        onHide={handleModalClose}
        centered
        backdrop="static"
      >
        {showPostJob && <CreateJob handleModalClose={handleModalClose} />}
      </Modal>
      <Modal
        show={showCreateAgency}
        onHide={handleModalClose}
        centered
        backdrop="static"
      >
        {showCreateAgency && (
          <CreateAgency handleModalClose={handleModalClose} />
        )}
      </Modal>
    </>
  );
};

export default Header;
