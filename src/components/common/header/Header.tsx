"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { Navbar, Nav, NavDropdown, Modal, Badge } from "react-bootstrap";
import styles from "./Header.module.scss";
import Image from "next/image";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import CreateJob from "@/components/create-job/CreateJob";
import Link from "next/link";
import { AuthHeader } from "./AuthHeader";
import usePostJobStore from "@/stores/usePostJobStore";

import CreateAgency from "@/components/create-agency/CreateAgency";
import useAgencyStore from "@/stores/useAgencyStore";
import { getTokenClaims, isTokenValid } from "@/helpers/jwt";
import { ROLE } from "@/helpers/constants";
import { Notifications } from "../notifications/Notifications";
import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/apis/notification";
import { Notification } from "@/stores/useNotificationStore";
import toast from "react-hot-toast";
import { forgotPassword } from "@/apis/auth";
import '../../../../public/Stars.svg';
interface HeaderProps {}
const HIDEPATHS = [
  "/login",
  "/change-password",
  "/register",
  "/verify",
  "/create-agency",
];

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();

  const ref = useRef<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { setShowPostJob, showPostJob } = usePostJobStore();
  const { setShowCreateAgency, showCreateAgency } = useAgencyStore();
  const { authUser, setAuthUser, role, setRole } = useAuthUserStore();
  const [notifCount, setNotifCount] = useState(0);
  const [unReadCount, setUnReadCount] = useState(0);
  const loggedIn = isTokenValid();
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery<Notification[]>({
    queryKey: ["user-notifications", loggedIn],
    queryFn: async () => {
      if (loggedIn) {
        const data = await getUserNotifications();
        return data;
      }
      return undefined;
    },
    refetchInterval: 10000,
    retry: 1,
  });
  const handleModalClose = () => {
    setShowPostJob(false);
    setShowCreateAgency(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", (e: any) => outsideClose(e));
    return () => {
      document.removeEventListener("mousedown", (e: any) => outsideClose(e));
    };
  }, []);

  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter((x) => !x.dismissed).length;
      setUnReadCount(unread);
      setNotifCount(notifications.length);
    }
  }, [notifCount, notifications]);

  const outsideClose = (e: any) => {
    let filterDiv = document.getElementById("notification-menu");
    if (
      filterDiv &&
      !filterDiv?.contains(e.target) &&
      ref?.current !== undefined
    ) {
      setShowNotification(false);
    }
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

  const changePassword = async () => {
    try {
      const email = authUser?.email;
      if (!email) {
        toast.error("Looks like your session is expired,please login again");
        logout();
        return;
      }
      await forgotPassword({ email: email, type: "auth" });
      toast.success(
        "Instruction has been sent to your registered email to change password"
      );
    } catch (e) {
      toast.error("Looks like your session is expired,please login again");
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    window.location.href = "/login";
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
            height={38}
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
                  pathname.includes("posted-jobs") ? styles.active : ""
                }`}
                href="/posted-jobs"
              >
                Posted Jobs
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin, ROLE.admin, ROLE.employer]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname.includes("walk-in") ? styles.active : ""
                }`}
                href="/walk-in"
              >
                Walk-ins
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin, ROLE.admin, ROLE.employer]) && (
              <Link
                className={`${styles.navListItem} ${
                  pathname.includes("GAMCA") ? styles.active : ""
                }`}
                href="/GAMCA-Medical"
              >
                <div style={{ display: "inline-flex", alignItems: "flex-start", gap: "2px" }}>
                  GAMCA
                  <Image
                    src="/Stars.svg"
                    alt="star"
                    width={20}
                    height={20}
                    style={{ marginTop: "-7px", marginRight: "-9px" }}
                  />
                </div>
              </Link>
            )}

            {shouldVisible([ROLE.superAdmin, ROLE.admin]) && (
              <NavDropdown
                title="Users"
                className={`${styles.navListItem} nav-list-item`}
              >
                {shouldVisible([ROLE.superAdmin]) && (
                  <>
                    {" "}
                    <NavDropdown.Item
                      className={`${styles.navListItem} ${
                        pathname.includes("/users?type=app")
                          ? styles.active
                          : ""
                      }`}
                      href="/users?type=app"
                    >
                      Registered app users
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      className={`${styles.navListItem} ${
                        pathname.includes("/users?type=admin")
                          ? styles.active
                          : ""
                      }`}
                      href="/users?type=admin"
                    >
                      Internal users
                    </NavDropdown.Item>
                  </>
                )}
                {shouldVisible([ROLE.superAdmin, ROLE.admin]) && (
                  <>
                    <NavDropdown.Item
                      className={`${styles.navListItem} ${
                        pathname.includes("/agency") ? styles.active : ""
                      }`}
                      href="/agency"
                    >
                      Agencies / Trade centers
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/employers" ? styles.active : ""
                  }`}
                  href="/employers"
                >
                  Employers
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {shouldVisible([ROLE.superAdmin, ROLE.admin]) && (
              <NavDropdown
                title="Reports"
                className={`${styles.navListItem} nav-list-item`}
              >
                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/jobs-posted" ? styles.active : ""
                  }`}
                  href="/reports/jobs-posted"
                >
                  Job Posted Report
                </NavDropdown.Item>
                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/application-received" ? styles.active : ""
                  }`}
                  href="/reports/application-received"
                >
                  Applications Received by Agency Report
                </NavDropdown.Item>
                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/jobs-applied" ? styles.active : ""
                  }`}
                  href="/reports/jobs-applied"
                >
                  Job Applied Report
                </NavDropdown.Item>
                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/users-report" ? styles.active : ""
                  }`}
                  href="/reports/users-report"
                >
                  Total Users/Candidates Report
                </NavDropdown.Item>
                <NavDropdown.Item
                  className={`${styles.navListItem} ${
                    pathname == "/employer-applications" ? styles.active : ""
                  }`}
                  href="/reports/employer-applications"
                >
                  Employers Report
                </NavDropdown.Item>
                {shouldVisible([ROLE.superAdmin]) && (
                  <NavDropdown.Item
                    className={`${styles.navListItem} ${
                      pathname == "/approval-exports" ? styles.active : ""
                    }`}
                    href="/reports/approval-exports"
                  >
                    Approval for Exports Report
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            )}
          </Nav>

          <Nav className={styles.rightNavItems}>
            <Nav.Link
              href="javascript:;"
              id="notification-menu"
              ref={ref}
              onClick={() => {
                setShowNotification(true);
              }}
              className={styles.notificationTrigger}
            >
              <Image src="/bell.png" alt="bell" width={16} height={19} />
              {!!unReadCount && (
                <Badge className={styles.notificationBadge}>
                  {unReadCount}
                </Badge>
              )}
              {showNotification && (
                <Notifications
                  notifications={notifications}
                  handleClose={(e) => {
                    e.stopPropagation();
                    setShowNotification(false);
                  }}
                  isLoading={isLoading}
                  error={error}
                />
              )}
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
                {shouldVisible([ROLE.employer]) && (
                  <>
                    <NavDropdown.Item href="/profile">
                      Edit Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/edit-agency">
                      Edit Agency Details
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Item onClick={changePassword}>
                  Change Password
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
