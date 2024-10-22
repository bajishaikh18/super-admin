"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar, Nav, NavDropdown, Modal } from "react-bootstrap";
import styles from "./Header.module.scss";
import Image from "next/image";
import { getTokenClaims, isTokenValid } from "@/helpers/jwt";
import { AuthUser, useAuthUserStore } from "@/stores/useAuthUserStore";
import CreateJob from "@/components/create-job/CreateJob";
import Link from "next/link";
import { AuthHeader } from "./AuthHeader";
import usePostJobStore from "@/stores/usePostJobStore";
import CreateAgency from "@/components/create-agency/CreateAgency";
import useAgencyStore from "@/stores/useAgencyStore";

interface HeaderProps {}
const HIDEPATHS = ["/login", "/reset-password"];

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {setShowPostJob, showPostJob} = usePostJobStore();
  const {setShowCreateAgency, showCreateAgency} = useAgencyStore();
  const { authUser, setAuthUser } = useAuthUserStore();

  const handleModalClose = () => {
    setShowPostJob(false);
    setShowCreateAgency(false);
  };

  const logout = () => {
    localStorage.clear();
    setAuthUser(null);
    router.push("/login");
  };

  if (HIDEPATHS.includes(pathname)) {
    return <AuthHeader/>;
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
            <Link
              className={`${styles.navListItem} ${
                pathname == "/" ? styles.active : ""
              } `}
              href="/"
            >
              Dashboard
            </Link>
            <Link
              className={`${styles.navListItem} ${
                pathname == "/posted-jobs" ? styles.active : ""
              }`}
              href="/posted-jobs"
            >
              Posted Jobs
            </Link>
          <Link className={styles.navListItem} href="#agencies">
              Agencies
            </Link>
            <Link
              className={`${styles.navListItem} ${
                pathname == "/users" ? styles.active : ""
              }`}
              href="/users"
            >
              Users
            </Link>
            <Link className={styles.navListItem} href="#employers">
              Employers
            </Link>
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
          </Nav>

          <Nav className={styles.rightNavItems}>
            <Nav.Link onClick={() => {}} className={styles.faBell}>
              <Image src="/bell.png" alt="bell" width={16} height={19} />
            </Nav.Link>
            <Nav.Link
              onClick={() => setShowPostJob(true)}
              className={`${styles.postJob} d-flex align-items-center gap-2`}
            >
              <Image src="/upload.png" alt="bell" width={16} height={16} />
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
      <Modal show={showPostJob} onHide={handleModalClose} centered backdrop="static">
        {showPostJob && <CreateJob handleModalClose={handleModalClose} />}
      </Modal>
      <Modal show={showCreateAgency} onHide={handleModalClose} centered backdrop="static">
         {showCreateAgency && <CreateAgency handleModalClose={handleModalClose} /> }
      </Modal>
    </>
  );
};

export default Header;
